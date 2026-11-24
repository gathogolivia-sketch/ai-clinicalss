export interface PatientEmotionalState {
  trust: number;     // 0 - 100
  anxiety: number;   // 0 - 100
  pain: number;      // 1 - 10
  fatigue: number;   // 0 - 100
  comfort: number;   // 0 - 100
  openness: number;  // 0 - 100
}

export interface VitalSigns {
  hr: number;           // Heart rate (bpm)
  bpSystolic: number;   // Systolic BP (mmHg)
  bpDiastolic: number;  // Diastolic BP (mmHg)
  spo2: number;         // Oxygen saturation (%)
  rr: number;           // Respiratory rate (breaths/min)
  temp: number;         // Body temperature (°C)
  pain: number;         // Pain score (1 - 10)
  rhythm: string;       // Cardiac rhythm description
}

export interface LabTest {
  id: string;
  name: string;
  category: 'Hematology' | 'Chemistry' | 'Cardiac' | 'Inflammatory' | 'Coagulation' | 'Other';
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string;
  flag: 'normal' | 'low' | 'high' | 'critical';
  interpretation: string;
  ordered: boolean;
  orderedAt?: string;
  isPending?: boolean;
}

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface HomeMedication {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  indication: string;
}

export interface PatientHistory {
  mrn: string;
  dob: string;
  room: string;
  attending: string;
  codeStatus: string;
  allergies: Allergy[];
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  familyHistory: string[];
  socialHistory: string[];
  reviewOfSystems: Record<string, string>;
  physicalExam: Record<string, string>;
  homeMedications: HomeMedication[];
}

export interface MedicationOrder {
  id: string;
  name: string;
  dose: string;
  route: string;
  frequency: string;
  indication: string;
  category: 'Analgesic' | 'Anxiolytic' | 'Cardiovascular' | 'Hematology / Blood' | 'Fluids' | 'Immunomodulator' | 'Other';
  status: 'active' | 'administered' | 'held';
  administeredAt?: string;
  administeredBy?: string;
  responseEffect?: {
    painDelta?: number;
    anxietyDelta?: number;
    trustDelta?: number;
    comfortDelta?: number;
    hrDelta?: number;
    bpSystolicDelta?: number;
    spo2Delta?: number;
    hbDelta?: number;
    note: string;
  };
}

export interface NursingIntervention {
  id: string;
  title: string;
  description: string;
  category: 'Comfort' | 'Positioning' | 'Therapeutic Presence' | 'Safety' | 'Diagnostic / Phlebotomy' | 'Respiratory';
  performed: boolean;
  performedAt?: string;
  impactSummary: string;
  effect?: {
    comfortDelta?: number;
    painDelta?: number;
    anxietyDelta?: number;
    trustDelta?: number;
    spo2Delta?: number;
    hrDelta?: number;
  };
}

export interface SimulationObjective {
  id: string;
  title: string;
  description: string;
  category: 'Communication' | 'Diagnostics' | 'Nursing' | 'Pharmacology' | 'History';
  status: 'pending' | 'in-progress' | 'completed';
  criteria: string;
  completedAt?: string;
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
  difficulty?: 'Easy' | 'Intermediate' | 'Difficult';
  baselineVitals: VitalSigns;
  history: PatientHistory;
  labs: LabTest[];
  medications: MedicationOrder[];
  nursingInterventions: NursingIntervention[];
  objectives: SimulationObjective[];
}

export interface VitalTrendPoint {
  time: string;
  hr: number;
  bpSystolic: number;
  bpDiastolic: number;
  spo2: number;
  event?: string;
}

export interface HospitalEmergencyCode {
  code: string;
  name: string;
  color: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  description: string;
  clinicalActionProtocol: string[];
  urgency: 'critical' | 'urgent' | 'warning';
}

export interface MultidimensionalFeelings {
  physical: string;
  emotional: string;
  social: string;
  existentialOrCare: string;
}

export interface StudentFeedback {
  empathyScore: number;
  strengths: string[];
  learningOpportunity: string;
  calgaryCambridgeSkill: string;
}

export interface TurnDetails {
  spokenResponse: string;
  innerMonologue: string;
  immediateFeeling: string;
  emotionalImpactExplanation: string;
  updatedState: PatientEmotionalState;
  nonVerbalCues: string[];
  multidimensionalFeelings: MultidimensionalFeelings;
  studentFeedback: StudentFeedback;
}

export interface NurseFramework {
  naming: string;       // N - Naming the emotion explicitly
  understanding: string;// U - Understanding & normalizing the reaction
  respecting: string;   // R - Respecting the patient's struggle & resilience
  supporting: string;   // S - Supporting with tangible presence & partnership
  exploring: string;    // E - Exploring feelings gently
}

export interface EmpatheticResponseData {
  acknowledgment: string;
  validation: string;
  supportAndPresence: string;
  gentleExploration: string;
  fullSpokenReply: string;
  nurseTechniques: NurseFramework;
}

export interface PatientEmotionalAnalysis {
  primaryEmotion: string;
  secondaryEmotions: string[];
  intensity: number; // 0 - 100
  underlyingFears: string;
  somaticManifestations: string[];
  unmetNeeds: string[];
  detectedState: PatientEmotionalState;
  empatheticResponse: EmpatheticResponseData;
  studentCoachingTip: string;
}

export interface ChatMessage {
  id: string;
  role: 'student' | 'patient' | 'clinician';
  text: string;
  timestamp: string;
  inquiryMode?: 'natural' | 'physical' | 'emotional' | 'social' | 'reassurance' | 'patient-expression';
  details?: TurnDetails;
  emotionalAnalysis?: PatientEmotionalAnalysis;
}

export interface ApproachComparison {
  styleName: string;
  badge: string;
  studentSample: string;
  patientSpokenReaction: string;
  patientInnerReaction: string;
  trustImpact: number;
  keyLearningPoint: string;
}

export interface ComparisonResult {
  topic: string;
  approaches: ApproachComparison[];
}

export interface DebriefResult {
  overallGrade: string;
  overallScore: number;
  summary: string;
  calgaryCambridgeScores: {
    initiatingSession: number;
    gatheringInformation: number;
    understandingPatientPerspective: number;
    buildingRapport: number;
    closingSession: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  patientFinalImpression: string;
}

export interface GradingRubricItem {
  category: string;
  maxScore: number;
  earnedScore: number;
  feedback: string;
  status: 'excellent' | 'proficient' | 'needs-work';
}

export interface SimulationGrade {
  overallScore: number;
  letterGrade: string;
  title: string;
  rubrics: GradingRubricItem[];
  completedObjectivesCount: number;
  totalObjectivesCount: number;
  commendations: string[];
  recommendations: string[];
  timestamp: string;
}
