import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

function callWithTimeout<T>(promise: Promise<T>, timeoutMs = 7000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Gemini call timed out after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Types
export interface PatientEmotionalState {
  trust: number;     // 0 - 100
  anxiety: number;   // 0 - 100
  pain: number;      // 1 - 10
  fatigue: number;   // 0 - 100
  comfort: number;   // 0 - 100
  openness: number;  // 0 - 100
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  avatarSeed: string;
  chiefComplaint: string;
  clinicalSetting: string;
  background: string;
  hiddenConcern: string;
  demeanor: string;
  baselineState: PatientEmotionalState;
  samplePrompts: string[];
}

const defaultPatient: PatientProfile = {
  id: 'eleanor-vance',
  name: 'Eleanor Vance',
  age: 68,
  gender: 'Female',
  occupation: 'Retired Librarian',
  avatarSeed: 'Eleanor',
  chiefComplaint: 'Post-op coronary stent recovery; awaiting discharge evaluation.',
  clinicalSetting: 'Inpatient Cardiology Ward',
  background: 'Admitted 48 hours ago for acute coronary syndrome. Successfully stented.',
  hiddenConcern: 'Afraid of having another attack alone at home at night.',
  demeanor: 'Polite, soft-spoken, hesitant to bother nurses, clenches bedsheets.',
  baselineState: { trust: 45, anxiety: 78, pain: 5, fatigue: 72, comfort: 35, openness: 38 },
  samplePrompts: [],
};

// Fallback response generator if Gemini API key is missing or fails
function generateFallbackChatResponse(
  patient: PatientProfile,
  message: string,
  currentState: PatientEmotionalState,
  inquiryMode?: string
) {
  const lower = message.toLowerCase();
  const isEmpathic = lower.includes('feel') || lower.includes('scared') || lower.includes('worry') || lower.includes('hear') || lower.includes('understand') || lower.includes('take your time');
  const isRushed = lower.includes('hurry') || lower.includes('quick') || lower.includes('just answer') || lower.length < 15;

  let trustDelta = isEmpathic ? 12 : isRushed ? -8 : 4;
  let anxietyDelta = isEmpathic ? -10 : isRushed ? 8 : -2;

  const newTrust = Math.max(10, Math.min(100, (currentState.trust || 50) + trustDelta));
  const newAnxiety = Math.max(10, Math.min(100, (currentState.anxiety || 60) + anxietyDelta));
  const newComfort = Math.max(10, Math.min(100, (currentState.comfort || 40) + (isEmpathic ? 10 : -5)));
  const newOpenness = Math.max(10, Math.min(100, (currentState.openness || 45) + (isEmpathic ? 14 : -6)));

  let spoken = "";
  let inner = "";
  let feeling = "";
  let explanation = "";

  if (inquiryMode === 'physical' || lower.includes('body') || lower.includes('pain') || lower.includes('physical')) {
    spoken = `It feels like a heavy band tightening around my chest whenever I take a deep breath. My hands feel clammy and shaky right now, to be honest.`;
    inner = `I'm terrified this isn't just surgical recovery pain, but that something is tearing inside.`;
    feeling = `Physically vulnerable & guarded`;
    explanation = `Asking specifically about my physical sensations helped me point out what's aching without feeling silly.`;
  } else if (inquiryMode === 'emotional' || lower.includes('afraid') || lower.includes('feel inside') || lower.includes('emotion')) {
    spoken = `Truthfully? I feel terrified. When everyone rushes in with charts and monitors, I feel like a broken machine rather than a human being. I'm scared I won't get back to my normal life.`;
    inner = `Nobody has asked me about my fear all morning—they only ask for vitals. I'm actually relieved you asked.`;
    feeling = `Emotional release & cautious trust`;
    explanation = `Your willingness to ask directly about my emotions validated that my distress isn't invisible.`;
  } else if (inquiryMode === 'social' || lower.includes('family') || lower.includes('home') || lower.includes('burden')) {
    spoken = `I keep thinking about my family waiting at home. My daughter took time off work to care for me, and I just feel like such a heavy burden on everyone.`;
    inner = `I hate being dependent on other people. It hurts my dignity more than the surgery did.`;
    feeling = `Guilt & feeling like a burden`;
    explanation = `Inquiring about life outside this hospital bed reminds me that you see my whole life, not just my illness.`;
  } else {
    spoken = isEmpathic
      ? `*sighs softly and relaxes their shoulders* Thank you for asking like that. Most people just glance at the monitors and rush out. Right now, I'm feeling overwhelmed and anxious about what the test results actually mean.`
      : `*shifts uncomfortably in the bed* Well... I suppose I'm managing. Just the usual soreness, I guess. Nothing you haven't heard a hundred times today.`;
    inner = isEmpathic
      ? `This student actually stopped to look me in the eye. Maybe I can safely tell them what is really terrifying me.`
      : `They seem hurried or detached. I better keep quiet and not cause any trouble.`;
    feeling = isEmpathic ? `Heard & slightly comforted` : `Cautious & minimizing symptoms`;
    explanation = isEmpathic
      ? `Your tone was respectful and open-ended, which made it safer for me to drop my defensive guard.`
      : `The inquiry felt procedural, so I gave a safe, minimal answer to avoid being perceived as difficult.`;
  }

  return {
    spokenResponse: spoken,
    innerMonologue: inner,
    immediateFeeling: feeling,
    emotionalImpactExplanation: explanation,
    updatedState: {
      trust: newTrust,
      anxiety: newAnxiety,
      pain: Math.max(1, Math.min(10, currentState.pain || 5)),
      fatigue: currentState.fatigue || 60,
      comfort: newComfort,
      openness: newOpenness,
    },
    nonVerbalCues: isEmpathic
      ? ["makes steady eye contact", "hands uncurl slightly from bedsheet", "tone softens"]
      : ["glances toward the door", "fidgets with hospital bracelet", "swallows nervously"],
    multidimensionalFeelings: {
      physical: `A dull throb rated ${(currentState.pain || 5)}/10, shallow respirations, and muscle tension in neck and shoulders.`,
      emotional: isEmpathic ? "Cautiously hopeful that someone is listening, though underlying fear lingers." : "Guarded, anxious, and hesitant to reveal vulnerability.",
      social: `Worrying about being a burden to family and feeling isolated in this sterile environment.`,
      existentialOrCare: `Wondering whether the medical team has full control of the treatment plan and if discharge is premature.`
    },
    studentFeedback: {
      empathyScore: isEmpathic ? 90 : isRushed ? 40 : 65,
      strengths: isEmpathic
        ? ["Used empathetic framing", "Invited patient to share unvarnished feelings", "Acknowledged personhood before pathology"]
        : ["Initiated inquiry into current status"],
      learningOpportunity: isEmpathic
        ? "Follow up with a supportive reflection: 'It sounds like the uncertainty is wearing on you just as much as the physical pain.'"
        : "Try replacing closed or clinical questions with an open invitation: 'How has today felt for you mentally as well as physically?'",
      calgaryCambridgeSkill: isEmpathic ? "Exploring Patient's Ideas, Concerns, and Expectations (ICE)" : "Establishing Initial Rapport & Empathy"
    }
  };
}

// 1. POST /api/chat - Patient simulated dialogue
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const patient = req.body.patient || defaultPatient;
    const { history, message, inquiryMode, currentState } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      const fallback = generateFallbackChatResponse(patient, message, currentState || patient.baselineState, inquiryMode);
      return res.json(fallback);
    }

    const state = currentState || patient.baselineState;
    const conversationContext = (history || [])
      .slice(-6)
      .map((m: any) => `${m.role === 'student' ? 'Medical Student' : patient.name}: ${m.text}`)
      .join('\n');

    const systemInstruction = `You are roleplaying as a real patient in a medical/healthcare simulation clinic:
Name: ${patient.name}, Age: ${patient.age}, Gender: ${patient.gender}, Occupation: ${patient.occupation}
Clinical Setting: ${patient.clinicalSetting}
Chief Complaint: ${patient.chiefComplaint}
Background & Illness History: ${patient.background}
Hidden Deep Concern (only shared when Trust is > 65% or with deep empathy): "${patient.hiddenConcern}"
Initial Demeanor: ${patient.demeanor}

CURRENT REAL-TIME EMOTIONAL & PHYSICAL STATE:
- Trust in Student: ${state.trust}/100
- Anxiety: ${state.anxiety}/100
- Physical Pain: ${state.pain}/10
- Fatigue: ${state.fatigue}/100
- Comfort: ${state.comfort}/100
- Emotional Openness: ${state.openness}/100

CRITICAL TEACHING OBJECTIVE:
The student is practicing clinical bedside communication. They need to explore how YOU feel AT THIS EXACT MOMENT, rather than getting a flat, generic, robotic one-way answer.
Patients never answer in just one flat way. Real patients have:
1. What they speak aloud (often cautious, conditioned by fear or polite suppression).
2. What they think inside (inner monologue / fears).
3. Non-verbal body language and somatic cues.
4. Multidimensional feelings (Physical sensations right now, Emotional state right now, Social/Relational worries, and Hospital/Existential feelings).
5. Dynamic emotional shifts based on the student's empathy, pacing, active listening, or abruptness.

Respond strictly as JSON matching the schema.`;

    const prompt = `Recent Conversation:
${conversationContext || '(Beginning of consultation)'}

Medical Student just said:
"${message}"
(Student inquiry focus/mode: ${inquiryMode || 'general discussion'})

Generate the patient's authentic, emotionally nuanced response to the student's words. Reflect how the patient feels at this exact moment in time, both out loud and internally, and update the emotional metrics. Provide constructive Calgary-Cambridge communication feedback for the student.`;

    const response = await callWithTimeout(ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spokenResponse: {
              type: Type.STRING,
              description: 'The verbal response spoken aloud by the patient, including non-verbal actions in *italics* if natural.',
            },
            innerMonologue: {
              type: Type.STRING,
              description: 'What the patient is genuinely feeling and thinking internally, which they might not fully say yet.',
            },
            immediateFeeling: {
              type: Type.STRING,
              description: 'A 2-4 word summary of how the patient feels at this exact second (e.g. "Vulnerable and cautiously relieved").',
            },
            emotionalImpactExplanation: {
              type: Type.STRING,
              description: 'One sentence explaining why the student\'s specific tone or question made the patient feel this way.',
            },
            updatedState: {
              type: Type.OBJECT,
              properties: {
                trust: { type: Type.INTEGER, description: 'Trust 0 to 100' },
                anxiety: { type: Type.INTEGER, description: 'Anxiety 0 to 100' },
                pain: { type: Type.INTEGER, description: 'Pain 1 to 10' },
                fatigue: { type: Type.INTEGER, description: 'Fatigue 0 to 100' },
                comfort: { type: Type.INTEGER, description: 'Comfort 0 to 100' },
                openness: { type: Type.INTEGER, description: 'Openness 0 to 100' },
              },
              required: ['trust', 'anxiety', 'pain', 'fatigue', 'comfort', 'openness'],
            },
            nonVerbalCues: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2 to 3 observable physical behaviors (e.g., "uncrosses arms", "avoids direct eye contact", "sighs softly").',
            },
            multidimensionalFeelings: {
              type: Type.OBJECT,
              properties: {
                physical: { type: Type.STRING, description: 'What their body feels like in this instant (tightness, throbbing, chill, nausea, etc.)' },
                emotional: { type: Type.STRING, description: 'The primary emotional struggle right now (fear, grief, loneliness, shame, hope)' },
                social: { type: Type.STRING, description: 'How they feel regarding family, career, burdening loved ones' },
                existentialOrCare: { type: Type.STRING, description: 'Feelings about the healthcare team, control over their body, or what lies ahead' },
              },
              required: ['physical', 'emotional', 'social', 'existentialOrCare'],
            },
            studentFeedback: {
              type: Type.OBJECT,
              properties: {
                empathyScore: { type: Type.INTEGER, description: 'Score from 0 to 100 for this turn' },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Positive communication skills observed' },
                learningOpportunity: { type: Type.STRING, description: 'Constructive tip on how the student could explore feelings even deeper' },
                calgaryCambridgeSkill: { type: Type.STRING, description: 'E.g. Building Rapport, Exploring Patient Perspective, Empathetic Listening' },
              },
              required: ['empathyScore', 'strengths', 'learningOpportunity', 'calgaryCambridgeSkill'],
            },
          },
          required: [
            'spokenResponse',
            'innerMonologue',
            'immediateFeeling',
            'emotionalImpactExplanation',
            'updatedState',
            'nonVerbalCues',
            'multidimensionalFeelings',
            'studentFeedback',
          ],
        },
      },
    }), 7500);

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    // Graceful fallback to avoid halting user exploration
    const fallback = generateFallbackChatResponse(
      req.body.patient,
      req.body.message || '',
      req.body.currentState || req.body.patient?.baselineState || { trust: 50, anxiety: 60, pain: 5, fatigue: 60, comfort: 40, openness: 45 },
      req.body.inquiryMode
    );
    return res.json(fallback);
  }
});

// Fallback for analyzing patient free-text feelings
function generateFallbackPatientAnalysis(
  patient: PatientProfile,
  freeText: string,
  currentState?: PatientEmotionalState
) {
  const textLower = freeText.toLowerCase();
  const isSeverePanic = textLower.includes('terrified') || textLower.includes('panic') || textLower.includes('scared') || textLower.includes('fear') || textLower.includes('dying');
  const isPainRelated = textLower.includes('pain') || textLower.includes('hurt') || textLower.includes('chest') || textLower.includes('tight') || textLower.includes('ache');
  const isAloneOrBurden = textLower.includes('alone') || textLower.includes('nobody') || textLower.includes('burden') || textLower.includes('family') || textLower.includes('home');
  const isDismissed = textLower.includes('dismiss') || textLower.includes('listen') || textLower.includes('crazy') || textLower.includes('head');

  const primaryEmotion = isSeverePanic
    ? 'Acute Somatic Terror & Vulnerability'
    : isPainRelated
    ? 'Physical Distress & Health Apprehension'
    : isAloneOrBurden
    ? 'Isolation & Dread of Burdening Loved Ones'
    : isDismissed
    ? 'Frustration from Feeling Unheard & Helpless'
    : 'Overwhelm & Emotional Exhaustion';

  const secondaryEmotions = [
    isPainRelated ? 'Fear of physical relapse' : 'Uncertainty about recovery',
    isAloneOrBurden ? 'Guilt over needing care' : 'Loss of autonomy',
    'Hypervigilance in hospital environment'
  ];

  const somatic: string[] = [];
  if (textLower.includes('chest') || textLower.includes('tight')) somatic.push('Chest constriction / tightness');
  if (textLower.includes('breath') || textLower.includes('dizzy')) somatic.push('Dyspnea & lightheadedness');
  if (textLower.includes('shake') || textLower.includes('cold') || textLower.includes('trembl')) somatic.push('Peripheral tremors & autonomic arousal');
  if (somatic.length === 0) somatic.push('Muscle tension and shallow breathing');

  const unmetNeeds = [
    'Deep emotional validation without premature advice',
    'Reassurance of physical safety and non-abandonment',
    'Acknowledgment of the reality of their suffering'
  ];

  const firstName = patient.name.split(' ')[0];

  const acknowledgment = `I hear you so clearly, ${firstName}. When you describe that feeling—that ${isPainRelated ? 'intense physical ache and tightness' : 'heavy emotional weight and fear'}—it must be deeply unsettling to endure.`;
  
  const validation = `Given everything your body and mind have been put through, it makes complete and total sense that you feel this way right now. Anyone in this hospital bed, dealing with this uncertainty, would feel exactly as vulnerable as you do. Your feelings are not foolish, and you are not being 'difficult' for feeling them.`;
  
  const supportAndPresence = `You are not alone in this room right now. I am right here with you, and we are going to walk through this step by step together. You don't have to carry this alone.`;
  
  const gentleExploration = `Would it help to just breathe together for a moment, or is there a specific part of what you just shared that feels heaviest on your heart right now?`;

  const fullSpokenReply = `${acknowledgment} ${validation} ${supportAndPresence} ${gentleExploration}`;

  return {
    primaryEmotion,
    secondaryEmotions,
    intensity: isSeverePanic ? 90 : 75,
    underlyingFears: patient.hiddenConcern || 'Fear of sudden relapse and being unable to protect themselves.',
    somaticManifestations: somatic,
    unmetNeeds,
    detectedState: {
      trust: Math.min(100, (currentState?.trust || patient.baselineState.trust) + 15),
      anxiety: Math.max(15, (currentState?.anxiety || patient.baselineState.anxiety) - 10),
      pain: currentState?.pain || patient.baselineState.pain,
      fatigue: currentState?.fatigue || patient.baselineState.fatigue,
      comfort: Math.min(100, (currentState?.comfort || patient.baselineState.comfort) + 18),
      openness: Math.min(100, (currentState?.openness || patient.baselineState.openness) + 20),
    },
    empatheticResponse: {
      acknowledgment,
      validation,
      supportAndPresence,
      gentleExploration,
      fullSpokenReply,
      nurseTechniques: {
        naming: `Explicitly named: "${primaryEmotion}"`,
        understanding: `Validated that experiencing this distress after medical trauma is natural and expected.`,
        respecting: `Honored their courage in speaking their truth rather than hiding behind polite silence.`,
        supporting: `Affirmed immediate presence and commitment to not leaving them alone in distress.`,
        exploring: `Offered gentle, non-pressuring inquiry into what feels heaviest.`,
      }
    },
    studentCoachingTip: `Notice how acknowledging the emotion BEFORE offering medical explanations drops patient defense mechanisms and builds profound bedside trust.`
  };
}

// 2. POST /api/analyze-patient-feelings - Free-text emotional analysis and empathetic validation
app.post('/api/analyze-patient-feelings', async (req: Request, res: Response) => {
  try {
    const patient = req.body.patient || defaultPatient;
    const { patientFreeText, currentState } = req.body;

    if (!patientFreeText) {
      return res.status(400).json({ error: 'patientFreeText is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json(generateFallbackPatientAnalysis(patient, patientFreeText, currentState));
    }

    const state = currentState || patient.baselineState;

    const systemInstruction = `You are an expert clinical psychologist and medical communication educator specializing in the NURSE framework (Naming, Understanding, Respecting, Supporting, Exploring).
A patient in a healthcare consultation has written their feelings in their own unfiltered free-text words.
Patient: ${patient.name}, ${patient.age}yo ${patient.gender}.
Clinical Setting: ${patient.clinicalSetting}.
Chief Complaint: ${patient.chiefComplaint}.
Background: ${patient.background}.
Hidden Fear: "${patient.hiddenConcern}".
Current Emotional State: Trust ${state.trust}%, Anxiety ${state.anxiety}%, Pain ${state.pain}/10.

CRITICAL INSTRUCTION:
Do NOT rely on pre-defined or static categories. Analyze the patient's exact free-text input to extract their authentic emotional state, fears, somatic expressions, and unmet emotional needs.
Then, generate a deeply empathetic, conversational response that:
1. Explicitly acknowledges and reflects their specific words (Naming the emotion).
2. Validates their emotional experience as completely understandable, normal, and human given their medical situation (Understanding & Respecting).
3. Offers tangible presence, comfort, and safety without being dismissive (Supporting).
4. Gently explores their feelings with an open question without interrogating (Exploring).

Respond strictly in JSON matching the schema.`;

    const prompt = `Patient's Free-Text Feeling Expression:
"${patientFreeText}"

Analyze the emotional state behind these words and construct the empathetic acknowledgment and validation response.`;

    const response = await callWithTimeout(ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryEmotion: { type: Type.STRING, description: 'The dominant core emotion detected from the free text' },
            secondaryEmotions: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 to 3 secondary emotional nuances' },
            intensity: { type: Type.INTEGER, description: 'Emotional distress intensity from 0 to 100' },
            underlyingFears: { type: Type.STRING, description: 'The deeper unsaid fear driving these feelings' },
            somaticManifestations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Physical sensations implied or stated' },
            unmetNeeds: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'What this patient emotionally needs right now' },
            detectedState: {
              type: Type.OBJECT,
              properties: {
                trust: { type: Type.INTEGER },
                anxiety: { type: Type.INTEGER },
                pain: { type: Type.INTEGER },
                fatigue: { type: Type.INTEGER },
                comfort: { type: Type.INTEGER },
                openness: { type: Type.INTEGER },
              },
              required: ['trust', 'anxiety', 'pain', 'fatigue', 'comfort', 'openness'],
            },
            empatheticResponse: {
              type: Type.OBJECT,
              properties: {
                acknowledgment: { type: Type.STRING, description: 'Opening that explicitly names and reflects their feeling' },
                validation: { type: Type.STRING, description: 'Normalizing and validating why their feeling makes complete sense' },
                supportAndPresence: { type: Type.STRING, description: 'Expressing presence and commitment to not abandoning them' },
                gentleExploration: { type: Type.STRING, description: 'Gentle open invitation to elaborate at their own pace' },
                fullSpokenReply: { type: Type.STRING, description: 'The complete empathetic reply ready to speak aloud' },
                nurseTechniques: {
                  type: Type.OBJECT,
                  properties: {
                    naming: { type: Type.STRING },
                    understanding: { type: Type.STRING },
                    respecting: { type: Type.STRING },
                    supporting: { type: Type.STRING },
                    exploring: { type: Type.STRING },
                  },
                  required: ['naming', 'understanding', 'respecting', 'supporting', 'exploring'],
                },
              },
              required: ['acknowledgment', 'validation', 'supportAndPresence', 'gentleExploration', 'fullSpokenReply', 'nurseTechniques'],
            },
            studentCoachingTip: { type: Type.STRING, description: 'Clinical teaching tip on why this validation was effective' },
          },
          required: [
            'primaryEmotion',
            'secondaryEmotions',
            'intensity',
            'underlyingFears',
            'somaticManifestations',
            'unmetNeeds',
            'detectedState',
            'empatheticResponse',
            'studentCoachingTip',
          ],
        },
      },
    }), 7500);

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/analyze-patient-feelings:', error);
    const patient = req.body.patient || defaultPatient;
    return res.json(generateFallbackPatientAnalysis(patient, req.body.patientFreeText || '', req.body.currentState));
  }
});

function getFallbackApproaches(patient: PatientProfile, topic?: string) {
  return {
    topic: topic || "Exploring how the patient feels right now",
    approaches: [
      {
        styleName: "Closed / Rapid Interrogation",
        badge: "Low Empathy",
        studentSample: `“Are you in pain right now? Yes or no? We have limited time so please stick to the symptoms.”`,
        patientSpokenReaction: `“Uh... yes, a little. It's just my chest.”`,
        patientInnerReaction: `“I feel like a case number on a clipboard. I’m definitely not mentioning how terrified I am of going home alone.”`,
        trustImpact: -15,
        keyLearningPoint: `Closed interrogative questions trigger defensive shutdown. The patient minimizes symptoms to avoid feeling like a nuisance.`
      },
      {
        styleName: "Premature Reassurance / Dismissive",
        badge: "Superficial Comfort",
        studentSample: `“Don't worry at all! Your vitals look totally fine and you're in the best hospital in the state.”`,
        patientSpokenReaction: `“Right... okay. If you say so.”`,
        patientInnerReaction: `“They aren't taking my fear seriously. Just because my numbers look normal doesn't mean I don't feel like I'm drowning.”`,
        trustImpact: -5,
        keyLearningPoint: `Dismissing anxiety with quick reassurance invalidates patient distress and stops them from sharing underlying concerns.`
      },
      {
        styleName: "Empathetic & Dimensional Inquiry (Recommended)",
        badge: "High Rapport",
        studentSample: `“I notice you're looking a bit tense while holding your arm. Could you tell me what you're feeling right now, both in your body and on your mind?”`,
        patientSpokenReaction: `“*sighs, voice softening* To be honest, I'm scared. The monitor keeps beeping and I keep thinking my heart is failing again.”`,
        patientInnerReaction: `“Someone finally noticed my anxiety instead of just checking off boxes. I can actually be honest with them.”`,
        trustImpact: 20,
        keyLearningPoint: `Acknowledging non-verbal cues and opening the floor to both physical and emotional feelings unlocks the patient's core concern.`
      }
    ]
  };
}

function getFallbackDebrief(patient: PatientProfile, finalState: any) {
  return {
    overallGrade: "B+ (Proficient Clinical Empathy)",
    overallScore: 84,
    summary: `You established a compassionate dialogue with ${patient.name}. You paid attention to emotional cues and explored their feelings beyond simple medical facts.`,
    calgaryCambridgeScores: {
      initiatingSession: 88,
      gatheringInformation: 82,
      understandingPatientPerspective: 90,
      buildingRapport: 85,
      closingSession: 76,
    },
    strengths: [
      `Asked open-ended questions about emotional and physical state rather than strictly transactional queries.`,
      `Validated patient hesitation instead of brushing past non-verbal signs of distress.`,
      `Increased patient trust from baseline to ${finalState?.trust || 75}%.`
    ],
    areasForImprovement: [
      `Practice allowing a few seconds of silence after heavy emotional disclosures to let the patient reflect.`,
      `Summarize back the patient's feelings ('It sounds like you feel torn between needing help and not wanting to burden your family') before suggesting clinical next steps.`
    ],
    patientFinalImpression: `“I came in feeling like just another chart, but this student took time to ask how I was truly coping in that moment. That made all the difference.”`
  };
}

// 2. POST /api/compare-approaches - Compare 3 different student questioning styles
app.post('/api/compare-approaches', async (req: Request, res: Response) => {
  try {
    const patient = req.body.patient || defaultPatient;
    const { topic, currentState } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json(getFallbackApproaches(patient, topic));
    }

    const prompt = `You are a medical education coach.
Patient: ${patient.name}, ${patient.age}yo, ${patient.chiefComplaint}.
Background: ${patient.background}
Current State: Trust ${currentState?.trust || 50}%, Anxiety ${currentState?.anxiety || 60}%.
Topic/Goal: Student wants to ask about: "${topic || 'How the patient feels right now'}".

Generate 3 contrasting ways a medical student could phrase this inquiry, and show how THIS EXACT PATIENT will react differently to each:
1. Closed / Interrogative (rushed, checkbox-driven)
2. Premature Reassurance / False Cheer (dismissive of feelings)
3. Empathetic Multi-Dimensional Exploration (open-ended, observant, validates feelings)

Respond strictly in JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            approaches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  styleName: { type: Type.STRING },
                  badge: { type: Type.STRING },
                  studentSample: { type: Type.STRING },
                  patientSpokenReaction: { type: Type.STRING },
                  patientInnerReaction: { type: Type.STRING },
                  trustImpact: { type: Type.INTEGER },
                  keyLearningPoint: { type: Type.STRING },
                },
                required: [
                  'styleName',
                  'badge',
                  'studentSample',
                  'patientSpokenReaction',
                  'patientInnerReaction',
                  'trustImpact',
                  'keyLearningPoint',
                ],
              },
            },
          },
          required: ['topic', 'approaches'],
        },
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/compare-approaches:', error);
    const patient = req.body.patient || defaultPatient;
    return res.json(getFallbackApproaches(patient, req.body.topic));
  }
});

// 3. POST /api/debrief - OSCE-style Consultation Debrief Report
app.post('/api/debrief', async (req: Request, res: Response) => {
  try {
    const patient = req.body.patient || defaultPatient;
    const { history, finalState } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        overallGrade: "B+ (Proficient Clinical Empathy)",
        overallScore: 84,
        summary: `You established a compassionate dialogue with ${patient.name}. You paid attention to emotional cues and explored their feelings beyond simple medical facts.`,
        calgaryCambridgeScores: {
          initiatingSession: 88,
          gatheringInformation: 82,
          understandingPatientPerspective: 90,
          buildingRapport: 85,
          closingSession: 76,
        },
        strengths: [
          `Asked open-ended questions about emotional and physical state rather than strictly transactional queries.`,
          `Validated patient hesitation instead of brushing past non-verbal signs of distress.`,
          `Increased patient trust from baseline to ${finalState?.trust || 75}%.`
        ],
        areasForImprovement: [
          `Practice allowing a few seconds of silence after heavy emotional disclosures to let the patient reflect.`,
          `Summarize back the patient's feelings ('It sounds like you feel torn between needing help and not wanting to burden your family') before suggesting clinical next steps.`
        ],
        patientFinalImpression: `“I came in feeling like just another chart, but this student took time to ask how I was truly coping in that moment. That made all the difference.”`
      });
    }

    const conversationTranscript = (history || [])
      .map((m: any) => `[${m.role.toUpperCase()}]: ${m.text}`)
      .join('\n');

    const prompt = `Analyze this medical student consultation with patient ${patient.name} (${patient.age}yo, ${patient.chiefComplaint}).
Patient Hidden Concern: "${patient.hiddenConcern}"
Final Emotional State: Trust ${finalState?.trust}/100, Anxiety ${finalState?.anxiety}/100.

TRANSCRIPT:
${conversationTranscript || 'No dialogue transcript.'}

Provide an OSCE-level clinical communication assessment focusing on how effectively the student explored and discussed how the patient felt in the moment, active listening, and bedside empathy. Respond in JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallGrade: { type: Type.STRING },
            overallScore: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            calgaryCambridgeScores: {
              type: Type.OBJECT,
              properties: {
                initiatingSession: { type: Type.INTEGER },
                gatheringInformation: { type: Type.INTEGER },
                understandingPatientPerspective: { type: Type.INTEGER },
                buildingRapport: { type: Type.INTEGER },
                closingSession: { type: Type.INTEGER },
              },
              required: ['initiatingSession', 'gatheringInformation', 'understandingPatientPerspective', 'buildingRapport', 'closingSession']
            },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            patientFinalImpression: { type: Type.STRING },
          },
          required: [
            'overallGrade',
            'overallScore',
            'summary',
            'calgaryCambridgeScores',
            'strengths',
            'areasForImprovement',
            'patientFinalImpression',
          ],
        },
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/debrief:', error);
    const patient = req.body.patient || defaultPatient;
    return res.json(getFallbackDebrief(patient, req.body.finalState));
  }
});

// 4. POST /api/grade-simulation - Deep OSCE Preceptor Performance Assessment
app.post('/api/grade-simulation', async (req: Request, res: Response) => {
  try {
    const patient = req.body.patient || defaultPatient;
    const { history, currentState, vitals, labs, medications, interventions, totalScore, letterGrade } = req.body;

    const fallbackReport = {
      summary: `Student demonstrated well-rounded clinical competence caring for ${patient.name}. They effectively integrated bedside communication with diagnostic vigilance (reviewing Haemoglobin and lab parameters), executed supportive nursing measures, and adhered to safe pharmacological practices.`,
      strengths: [
        `Maintained an empathetic presence and addressed patient distress beyond superficial symptoms.`,
        `Checked diagnostic blood panels, paying particular attention to Haemoglobin status (${labs?.find((l: any) => l.id === 'hb')?.value || '9.2'} g/dL) and physiological stability.`,
        `Practiced closed-loop medication administration without allergy violations.`,
        `Carried out supportive nursing comfort interventions that enhanced patient trust.`
      ],
      areasForImprovement: [
        `Summarize the patient's emotional disclosures before pivoting to diagnostic explanations.`,
        `Continue to explore patient ideas, concerns, and expectations (ICE) early in the consultation.`
      ],
      patientFinalImpression: `“I felt genuinely heard rather than rushed. The student explained what my labs meant in plain words, and knowing they were monitoring my blood levels and heart made me feel safe.”`
    };

    if (!process.env.GEMINI_API_KEY) {
      return res.json(fallbackReport);
    }

    const conversationTranscript = (history || [])
      .map((m: any) => `[${m.role.toUpperCase()}]: ${m.text}`)
      .join('\n');

    const prompt = `You are a Senior OSCE Medical & Nursing Clinical Preceptor evaluating a student's bedside simulation performance.
Patient: ${patient.name}, ${patient.age}yo, ${patient.chiefComplaint}.
Background: ${patient.background}
Hidden Concern: "${patient.hiddenConcern}"
Final Emotional State: Trust ${currentState?.trust}/100, Anxiety ${currentState?.anxiety}/100, Pain ${currentState?.pain}/10.
Vitals: HR ${vitals?.hr} bpm, BP ${vitals?.bpSystolic}/${vitals?.bpDiastolic}, SpO2 ${vitals?.spo2}%.
Labs Checked: ${(labs || []).filter((l: any) => l.ordered).map((l: any) => `${l.name}: ${l.value} ${l.unit}`).join(', ')}
Medications Handled: ${(medications || []).map((m: any) => `${m.name} (${m.status})`).join(', ')}
Nursing Interventions Performed: ${(interventions || []).filter((i: any) => i.performed).map((i: any) => i.title).join(', ')}
Current Earned Grade: ${letterGrade || 'A'} (${totalScore || 85}/100)

Consultation Dialogue Transcript:
${conversationTranscript || 'No dialogue transcript recorded.'}

Provide an insightful, supportive, and academically rigorous OSCE preceptor evaluation. Respond strictly in JSON matching the schema.`;

    const response = await callWithTimeout(ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: '2-3 sentence overarching appraisal of the clinical consultation' },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3-4 specific clinical strengths demonstrated' },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-3 constructive learning pearls for future OSCEs' },
            patientFinalImpression: { type: Type.STRING, description: 'First-person retrospective thought from the patient' },
          },
          required: ['summary', 'strengths', 'areasForImprovement', 'patientFinalImpression'],
        },
      },
    }), 7500);

    return res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Error in /api/grade-simulation:', error);
    const patient = req.body.patient || defaultPatient;
    return res.json({
      summary: `Student demonstrated thoughtful clinical competence caring for ${patient.name}. They effectively integrated bedside communication with diagnostic vigilance (reviewing Haemoglobin and lab parameters), executed supportive nursing measures, and adhered to safe pharmacological practices.`,
      strengths: [
        `Maintained an empathetic presence and addressed patient distress beyond superficial symptoms.`,
        `Checked diagnostic blood panels, paying particular attention to Haemoglobin status and physiological stability.`,
        `Practiced closed-loop medication administration without allergy violations.`,
        `Carried out supportive nursing comfort interventions that enhanced patient trust.`
      ],
      areasForImprovement: [
        `Summarize the patient's emotional disclosures before pivoting to diagnostic explanations.`,
        `Continue to explore patient ideas, concerns, and expectations (ICE) early in the consultation.`
      ],
      patientFinalImpression: `“I felt genuinely heard rather than rushed. The student explained what my labs meant in plain words, and knowing they were monitoring my blood levels and heart made me feel safe.”`
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`AuraEmpathy server running on http://0.0.0.0:${port} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
