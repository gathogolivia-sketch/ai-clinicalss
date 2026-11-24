import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  Brain,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Activity,
  Layers
} from 'lucide-react';
import { PatientEmotionalAnalysis, PatientProfile, PatientEmotionalState } from '../types';
import { speakPatientText, stopSpeaking } from '../utils/speech';

interface PatientFreeTextExpressProps {
  patient: PatientProfile;
  currentState: PatientEmotionalState;
  onApplyAnalysis: (freeText: string, analysis: PatientEmotionalAnalysis) => void;
  isLoading?: boolean;
}

export const PatientFreeTextExpress: React.FC<PatientFreeTextExpressProps> = ({
  patient,
  currentState,
  onApplyAnalysis,
  isLoading: globalLoading = false,
}) => {
  const [freeText, setFreeText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PatientEmotionalAnalysis | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Setup Web Speech recognition for voice typing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setFreeText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Microphone speech recognition is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = (textToAnalyze || freeText).trim();
    if (!text || analyzing) return;

    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze-patient-feelings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          patientFreeText: text,
          currentState,
        }),
      });

      if (res.ok) {
        const data: PatientEmotionalAnalysis = await res.json();
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error('Error analyzing patient feelings:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyToDialogue = () => {
    if (!analysisResult) return;
    onApplyAnalysis(freeText, analysisResult);
  };

  const toggleSpeak = (text: string) => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      speakPatientText(text, 'Female');
      setIsPlayingAudio(true);
    }
  };

  return (
    <div className="bg-white border border-sky-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Express Patient Feelings (Free-Text Input)
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                Natural Language AI Analysis
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Type or speak how {patient.name.split(' ')[0]} feels without preset categories. The AI dynamically decodes emotional state and responds with clinical validation.
            </p>
          </div>
        </div>

        <span className="text-[11px] text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-200 font-semibold">
          No rigid choices • Unfiltered patient voice
        </span>
      </div>

      {/* Free-Text Input Area */}
      <div className="space-y-3">
        <div className="relative">
          <label htmlFor="patient-free-text" className="sr-only">Express Patient Feelings</label>
          <textarea
            id="patient-free-text"
            rows={3}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder={`Express what you or ${patient.name.split(' ')[0]} are feeling right now (e.g. "I feel this terrible tight ache in my chest whenever the monitor beeps. I'm terrified I won't make it home, but I don't want to be a burden on the nurses...")...`}
            disabled={analyzing}
            className="w-full bg-sky-50/40 border border-sky-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl p-3.5 pr-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition resize-y shadow-2xs"
          />

          {/* Voice dictation button inside textarea */}
          <button
            type="button"
            onClick={toggleMic}
            title={isListening ? "Listening... click to stop" : "Voice dictation"}
            className={`absolute right-3 top-3 p-1.5 rounded-lg transition ${
              isListening
                ? 'bg-rose-50 text-rose-600 animate-pulse border border-rose-200'
                : 'text-slate-400 hover:text-sky-600 hover:bg-sky-100'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        {/* Sample Real-Life Patient Expressions */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
            Try a real-life feeling disclosure:
          </span>
          <button
            type="button"
            onClick={() => {
              const text = `“I'm terrified this chest pressure means I'm having another infarct, but when nurses rush by I feel like I shouldn't bother them.”`;
              setFreeText(text);
              handleAnalyze(text);
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition italic shadow-2xs"
          >
            “Terrified of another attack...”
          </button>
          <button
            type="button"
            onClick={() => {
              const text = `“Everyone says it's just panic or work stress, but my hands are tingling, my heart is pounding 120 bpm, and I feel like I'm losing control.”`;
              setFreeText(text);
              handleAnalyze(text);
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition italic shadow-2xs"
          >
            “Nobody believes my heart is racing...”
          </button>
          <button
            type="button"
            onClick={() => {
              const text = `“My body feels like a broken cage. I can't hold my daughter or do my job anymore, and I feel so guilty that my spouse has to take care of me.”`;
              setFreeText(text);
              handleAnalyze(text);
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition italic shadow-2xs"
          >
            “Feel like a burden on my family...”
          </button>
        </div>

        {/* Analyze Action Bar */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500">
            {freeText.length > 0 ? `${freeText.length} characters entered` : 'Speak or write freely'}
          </span>

          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={!freeText.trim() || analyzing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-sky-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-white" />
                <span>Decoding Emotional State...</span>
              </>
            ) : (
              <>
                <Brain className="w-4 h-4" />
                <span>Analyze Emotional State &amp; Generate Empathy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results & Empathetic Validation Response */}
      {analysisResult && (
        <div className="mt-6 pt-5 border-t border-sky-100 space-y-5 animate-fade-in">
          {/* Top Emotional Diagnostic Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Primary Emotion & Intensity */}
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                Primary Core Emotion
              </span>
              <div className="text-sm font-bold text-rose-900">
                {analysisResult.primaryEmotion}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-rose-700">
                <span>Distress Intensity</span>
                <span className="font-bold">{analysisResult.intensity}%</span>
              </div>
              <div className="w-full bg-rose-100 rounded-full h-1.5 mt-1 overflow-hidden">
                <div
                  className="bg-rose-500 h-1.5 rounded-full"
                  style={{ width: `${analysisResult.intensity}%` }}
                />
              </div>
            </div>

            {/* Somatic / Body Manifestations */}
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                Somatic Physical Signals
              </span>
              <ul className="space-y-1">
                {analysisResult.somaticManifestations.map((som, idx) => (
                  <li key={idx} className="text-xs text-amber-900 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-amber-600 shrink-0" />
                    <span>{som}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Unmet Emotional Needs */}
            <div className="p-3.5 rounded-xl bg-sky-50 border border-sky-200 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block mb-1">
                Primary Unmet Needs
              </span>
              <ul className="space-y-1">
                {analysisResult.unmetNeeds.map((need, idx) => (
                  <li key={idx} className="text-xs text-sky-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                    <span>{need}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* AI Empathetic Conversational Response: Acknowledge & Validate */}
          <div className="rounded-2xl border-2 border-sky-300 bg-sky-50/50 p-4 sm:p-5 shadow-sm relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-sky-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                <h3 className="text-sm font-bold text-sky-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  AI Clinician Empathetic Response (Acknowledging &amp; Validating)
                </h3>
              </div>

              <button
                type="button"
                onClick={() => toggleSpeak(analysisResult.empatheticResponse.fullSpokenReply)}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-sky-200 text-sky-700 hover:bg-sky-50 transition shadow-2xs"
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    <span className="text-rose-600">Stop Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>Listen Spoken</span>
                  </>
                )}
              </button>
            </div>

            {/* Spoken Response text */}
            <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed mb-4 pl-3 border-l-2 border-sky-500 bg-white/70 p-3 rounded-r-xl border border-sky-100">
              {analysisResult.empatheticResponse.fullSpokenReply}
            </div>

            {/* NURSE Empathy Protocol Breakdown */}
            <div className="bg-white rounded-xl p-3.5 border border-sky-200 space-y-2 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                NURSE Clinical Empathy Model Breakdown:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2 rounded-lg bg-sky-50/60 border border-sky-100">
                  <strong className="text-sky-800 block mb-0.5">🏷️ Naming:</strong>
                  <span className="text-slate-700">{analysisResult.empatheticResponse.nurseTechniques.naming}</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                  <strong className="text-amber-800 block mb-0.5">🤝 Understanding:</strong>
                  <span className="text-slate-700">{analysisResult.empatheticResponse.nurseTechniques.understanding}</span>
                </div>
                <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100">
                  <strong className="text-blue-800 block mb-0.5">🛡️ Respecting:</strong>
                  <span className="text-slate-700">{analysisResult.empatheticResponse.nurseTechniques.respecting}</span>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <strong className="text-emerald-800 block mb-0.5">🤲 Supporting:</strong>
                  <span className="text-slate-700">{analysisResult.empatheticResponse.nurseTechniques.supporting}</span>
                </div>
              </div>
            </div>

            {/* Coaching Tip */}
            {analysisResult.studentCoachingTip && (
              <div className="mt-3 flex items-start gap-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-sky-100">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-700 font-semibold">Educational Communication Takeaway: </strong>
                  <span>{analysisResult.studentCoachingTip}</span>
                </div>
              </div>
            )}

            {/* Action button to insert into dialogue */}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleApplyToDialogue}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition shadow-md shadow-sky-600/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Add Exchange to Active Bedside Dialogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
