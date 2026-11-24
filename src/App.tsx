import React, { useState } from 'react';
import { PATIENTS } from './data/patients';
import {
  PatientProfile,
  PatientEmotionalState,
  ChatMessage,
  MultidimensionalFeelings,
  PatientEmotionalAnalysis,
  VitalSigns,
  LabTest,
  MedicationOrder,
  NursingIntervention,
  SimulationObjective,
  VitalTrendPoint,
  HospitalEmergencyCode
} from './types';
import { Header } from './components/Header';
import { EmotionalVitalsHUD } from './components/EmotionalVitalsHUD';
import { VitalSignsMonitor } from './components/VitalSignsMonitor';
import { LabsDashboard } from './components/LabsDashboard';
import { PatientHistoryView } from './components/PatientHistoryView';
import { PharmacyManagement } from './components/PharmacyManagement';
import { NursingCareView } from './components/NursingCareView';
import { PatientSummaryView } from './components/PatientSummaryView';
import { GradingReportView } from './components/GradingReportView';
import { MultidimensionalFeelingsCard } from './components/MultidimensionalFeelingsCard';
import { DialogueStream } from './components/DialogueStream';
import { StudentActionBar } from './components/StudentActionBar';
import { PatientFreeTextExpress } from './components/PatientFreeTextExpress';
import { CompareApproachesModal } from './components/CompareApproachesModal';
import { DebriefModal } from './components/DebriefModal';
import { CustomPatientModal } from './components/CustomPatientModal';
import { FuturisticLandingPage } from './components/FuturisticLandingPage';
import { HospitalEmergencyCodesModal } from './components/HospitalEmergencyCodesModal';
import {
  HeartPulse,
  Sparkles,
  MessageSquare,
  Heart,
  Layers,
  ShieldCheck,
  Activity,
  FlaskConical,
  FileText,
  Pill,
  Stethoscope,
  Award,
  CheckCircle2,
  Siren,
  Home,
  ClipboardList
} from 'lucide-react';

export default function App() {
  // Navigation View: 'landing' (Initial Futuristic Landing Page) or 'simulator' (Clinical Simulator)
  const [currentView, setCurrentView] = useState<'landing' | 'simulator'>('landing');

  const [patients, setPatients] = useState<PatientProfile[]>(PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<PatientProfile>(PATIENTS[0]);
  const [currentState, setCurrentState] = useState<PatientEmotionalState>(PATIENTS[0].baselineState);
  const [previousState, setPreviousState] = useState<PatientEmotionalState | undefined>(undefined);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prefilledText, setPrefilledText] = useState('');
  const [immediateFeeling, setImmediateFeeling] = useState<string | undefined>(undefined);
  const [nonVerbalCues, setNonVerbalCues] = useState<string[] | undefined>(undefined);
  const [lastImpactExplanation, setLastImpactExplanation] = useState<string | undefined>(undefined);
  const [feelingsDimensions, setFeelingsDimensions] = useState<MultidimensionalFeelings | undefined>(undefined);

  // Clinical Modules State
  const [vitals, setVitals] = useState<VitalSigns>(PATIENTS[0].baselineVitals);
  const [labs, setLabs] = useState<LabTest[]>(PATIENTS[0].labs);
  const [medications, setMedications] = useState<MedicationOrder[]>(PATIENTS[0].medications);
  const [interventions, setInterventions] = useState<NursingIntervention[]>(PATIENTS[0].nursingInterventions);
  const [objectives, setObjectives] = useState<SimulationObjective[]>(PATIENTS[0].objectives);

  // Recharts Historical Vital Trends State (User Requirement)
  const [vitalTrends, setVitalTrends] = useState<VitalTrendPoint[]>([
    {
      time: '08:00',
      hr: PATIENTS[0].baselineVitals.hr,
      bpSystolic: PATIENTS[0].baselineVitals.bpSystolic,
      bpDiastolic: PATIENTS[0].baselineVitals.bpDiastolic,
      spo2: PATIENTS[0].baselineVitals.spo2,
      event: 'Baseline Triage',
    },
  ]);

  // Active Main Navigation Tab in Simulator
  type TabType = 'dialogue' | 'vitals' | 'labs' | 'history' | 'pharmacy' | 'nursing' | 'summary' | 'grading' | 'express' | 'dimensions';
  const [activeTab, setActiveTab] = useState<TabType>('dialogue');

  // Modals
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareTopic, setCompareTopic] = useState('');
  const [debriefModalOpen, setDebriefModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [activeEmergencyBanner, setActiveEmergencyBanner] = useState<HospitalEmergencyCode | null>(null);

  // Helper to append a vital trend record
  const logVitalTrend = (newVitals: Partial<VitalSigns>, eventName?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const point: VitalTrendPoint = {
      time: timeStr,
      hr: newVitals.hr !== undefined ? newVitals.hr : vitals.hr,
      bpSystolic: newVitals.bpSystolic !== undefined ? newVitals.bpSystolic : vitals.bpSystolic,
      bpDiastolic: newVitals.bpDiastolic !== undefined ? newVitals.bpDiastolic : vitals.bpDiastolic,
      spo2: newVitals.spo2 !== undefined ? newVitals.spo2 : vitals.spo2,
      event: eventName,
    };
    setVitalTrends(prev => [...prev.slice(-15), point]);
  };

  // Helper to mark an objective as completed
  const markObjectiveComplete = (objectiveId: string) => {
    setObjectives(prev =>
      prev.map(obj =>
        obj.id === objectiveId || obj.id.includes(objectiveId)
          ? { ...obj, status: 'completed', completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          : obj
      )
    );
  };

  // Launch simulator from landing page (User Requirement)
  const handleStartSimulation = (patientId?: string) => {
    if (patientId) {
      const found = patients.find(p => p.id === patientId);
      if (found) {
        handleSelectPatient(found);
      }
    }
    setCurrentView('simulator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select patient
  const handleSelectPatient = (patient: PatientProfile) => {
    setCurrentPatient(patient);
    setCurrentState(patient.baselineState);
    setPreviousState(undefined);
    setHistory([]);
    setImmediateFeeling(undefined);
    setNonVerbalCues(undefined);
    setLastImpactExplanation(undefined);
    setFeelingsDimensions(undefined);
    setPrefilledText('');
    setVitals(patient.baselineVitals);
    setLabs(patient.labs);
    setMedications(patient.medications);
    setInterventions(patient.nursingInterventions);
    setObjectives(patient.objectives);
    setVitalTrends([
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hr: patient.baselineVitals.hr,
        bpSystolic: patient.baselineVitals.bpSystolic,
        bpDiastolic: patient.baselineVitals.bpDiastolic,
        spo2: patient.baselineVitals.spo2,
        event: 'Admission Baseline',
      },
    ]);
    setActiveEmergencyBanner(null);
    setActiveTab('dialogue');
  };

  // Reset current session
  const handleResetSession = () => {
    setCurrentState(currentPatient.baselineState);
    setPreviousState(undefined);
    setHistory([]);
    setImmediateFeeling(undefined);
    setNonVerbalCues(undefined);
    setLastImpactExplanation(undefined);
    setFeelingsDimensions(undefined);
    setPrefilledText('');
    setVitals(currentPatient.baselineVitals);
    setLabs(currentPatient.labs);
    setMedications(currentPatient.medications);
    setInterventions(currentPatient.nursingInterventions);
    setObjectives(currentPatient.objectives);
    setVitalTrends([
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        hr: currentPatient.baselineVitals.hr,
        bpSystolic: currentPatient.baselineVitals.bpSystolic,
        bpDiastolic: currentPatient.baselineVitals.bpDiastolic,
        spo2: currentPatient.baselineVitals.spo2,
        event: 'Session Reset',
      },
    ]);
    setActiveEmergencyBanner(null);
  };

  // Add custom patient
  const handleCreateCustomPatient = (newPatient: PatientProfile) => {
    setPatients(prev => [newPatient, ...prev]);
    handleSelectPatient(newPatient);
  };

  // Emergency Code Triggered
  const handleTriggerEmergencyCode = (code: HospitalEmergencyCode) => {
    setActiveEmergencyBanner(code);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const emergencyMsg: ChatMessage = {
      id: `code-${Date.now()}`,
      role: 'clinician',
      text: `[🚨 HOSPITAL EMERGENCY ALERT BROADCAST: ${code.code} (${code.name}) ACTIVATED AT ${timeStr}. Clinical team responding immediately to ${currentPatient.history.room || 'Bedside'}.]`,
      timestamp: timeStr,
    };

    setHistory(prev => [...prev, emergencyMsg]);
    logVitalTrend({}, `Triggered ${code.code}`);
  };

  // Empathy Shortcut clicked in EmotionalVitalsHUD (User Requirement)
  const handleInjectEmpathyPhrase = (phrase: string) => {
    setPrefilledText(phrase);
    setActiveTab('dialogue');

    // Mark communication objective complete
    markObjectiveComplete('empathy');
    markObjectiveComplete('nurse');
    markObjectiveComplete('validation');
  };

  // Lab Actions (User Requirement: labs part to check for things like haemoglobin)
  const handleOrderLab = (testId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLabs(prev =>
      prev.map(test =>
        test.id === testId ? { ...test, ordered: true, orderedAt: timeStr } : test
      )
    );

    markObjectiveComplete('hb');
    markObjectiveComplete('labs');
    markObjectiveComplete('troponin');
  };

  const handleOrderStatDraw = (testName: string, category: LabTest['category']) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isHb = testName.toLowerCase().includes('haemoglobin') || testName.toLowerCase().includes('hemoglobin') || testName.toLowerCase().includes('hb');

    const newTest: LabTest = {
      id: `stat-${Date.now()}`,
      name: testName,
      category,
      value: isHb ? '9.6' : 'Within normal limits',
      unit: isHb ? 'g/dL' : 'ref',
      referenceRange: isHb ? '12.0 - 15.5 g/dL' : 'Normal',
      flag: isHb ? 'low' : 'normal',
      interpretation: isHb
        ? 'STAT repeat Haemoglobin indicates stabilizing red cell index post-intervention.'
        : `STAT point-of-care ${testName} analysis resulted promptly with no acute critical deviations.`,
      ordered: true,
      orderedAt: timeStr,
    };

    setLabs(prev => [newTest, ...prev]);
    markObjectiveComplete('hb');
    markObjectiveComplete('labs');
  };

  // Pharmacy Actions (User Requirement: add pharmacy)
  const handleAdministerMedication = (medId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const med = medications.find(m => m.id === medId);
    if (!med) return;

    setMedications(prev =>
      prev.map(m =>
        m.id === medId
          ? { ...m, status: 'administered', administeredAt: timeStr, administeredBy: 'Student RN / MD' }
          : m
      )
    );

    // Apply physiological and emotional effect
    if (med.responseEffect) {
      const effect = med.responseEffect;
      setCurrentState(prev => ({
        ...prev,
        pain: effect.painDelta !== undefined ? Math.max(1, Math.min(10, prev.pain + effect.painDelta)) : prev.pain,
        anxiety: effect.anxietyDelta !== undefined ? Math.max(10, Math.min(100, prev.anxiety + effect.anxietyDelta)) : prev.anxiety,
        trust: effect.trustDelta !== undefined ? Math.min(100, prev.trust + effect.trustDelta) : prev.trust,
        comfort: effect.comfortDelta ? Math.min(100, prev.comfort + effect.comfortDelta) : prev.comfort,
      }));

      const updatedVitals: VitalSigns = {
        ...vitals,
        hr: effect.hrDelta !== undefined ? Math.max(50, vitals.hr + effect.hrDelta) : vitals.hr,
        bpSystolic: effect.bpSystolicDelta !== undefined ? Math.max(90, vitals.bpSystolic + effect.bpSystolicDelta) : vitals.bpSystolic,
        spo2: effect.spo2Delta !== undefined ? Math.min(100, vitals.spo2 + effect.spo2Delta) : vitals.spo2,
        pain: effect.painDelta !== undefined ? Math.max(1, vitals.pain + effect.painDelta) : vitals.pain,
      };
      setVitals(updatedVitals);

      // Append vital trend point in Recharts!
      logVitalTrend(updatedVitals, `Gave ${med.name}`);

      // If PRBC was given, boost Haemoglobin lab value!
      if (effect.hbDelta) {
        setLabs(prev =>
          prev.map(l =>
            l.id === 'hb'
              ? {
                  ...l,
                  value: (parseFloat(l.value) + effect.hbDelta!).toFixed(1),
                  interpretation: `Post-transfusion response: Haemoglobin increased to ${(parseFloat(l.value) + effect.hbDelta!).toFixed(1)} g/dL. Fatigue noticeably improving.`,
                  flag: parseFloat(l.value) + effect.hbDelta! >= 10.5 ? 'normal' : 'low',
                  orderedAt: timeStr,
                }
              : l
          )
        );
      }

      // Add system message into dialogue stream
      const systemNotice: ChatMessage = {
        id: `sys-${Date.now()}`,
        role: 'clinician',
        text: `[eMAR Medication Administered: ${med.name} (${med.dose} ${med.route}) at ${timeStr}. Clinical Response: ${effect.note}]`,
        timestamp: timeStr,
      };
      setHistory(prev => [...prev, systemNotice]);
    }

    markObjectiveComplete('pharmacy');
    markObjectiveComplete('medication');
  };

  const handleOrderNewMedication = (newMed: Partial<MedicationOrder>) => {
    const fullMed: MedicationOrder = {
      id: newMed.id || `med-${Date.now()}`,
      name: newMed.name || 'New Medication',
      dose: newMed.dose || 'Standard',
      route: newMed.route || 'Oral (PO)',
      frequency: newMed.frequency || 'PRN',
      indication: newMed.indication || 'Symptom relief',
      category: newMed.category || 'Other',
      status: 'active',
      responseEffect: newMed.responseEffect,
    };
    setMedications(prev => [fullMed, ...prev]);
  };

  // Nursing Actions (User Requirement: nursing part where we also have objectives)
  const handlePerformIntervention = (interventionId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = interventions.find(i => i.id === interventionId);
    if (!target) return;

    setInterventions(prev =>
      prev.map(i =>
        i.id === interventionId ? { ...i, performed: true, performedAt: timeStr } : i
      )
    );

    // Apply effect to state & vitals
    if (target.effect) {
      const eff = target.effect;
      setCurrentState(prev => ({
        ...prev,
        comfort: eff.comfortDelta ? Math.min(100, prev.comfort + eff.comfortDelta) : prev.comfort,
        anxiety: eff.anxietyDelta ? Math.max(10, prev.anxiety + eff.anxietyDelta) : prev.anxiety,
        trust: eff.trustDelta ? Math.min(100, prev.trust + eff.trustDelta) : prev.trust,
        pain: eff.painDelta ? Math.max(1, prev.pain + eff.painDelta) : prev.pain,
      }));

      const updatedVitals: VitalSigns = {
        ...vitals,
        spo2: eff.spo2Delta ? Math.min(100, vitals.spo2 + eff.spo2Delta) : vitals.spo2,
        hr: eff.hrDelta ? Math.max(50, vitals.hr + eff.hrDelta) : vitals.hr,
        pain: eff.painDelta ? Math.max(1, vitals.pain + eff.painDelta) : vitals.pain,
      };
      setVitals(updatedVitals);

      // Append vital trend point in Recharts!
      logVitalTrend(updatedVitals, target.title);

      // If Phlebotomy intervention was performed, trigger lab update!
      if (interventionId.includes('blood-draw') || interventionId.includes('phlebotomy')) {
        handleOrderLab('hb');
      }

      // Add notice to bedside dialogue
      const nurseMsg: ChatMessage = {
        id: `nurse-${Date.now()}`,
        role: 'clinician',
        text: `[Nursing Intervention Executed: ${target.title}. ${target.impactSummary}]`,
        timestamp: timeStr,
      };
      setHistory(prev => [...prev, nurseMsg]);
    }

    markObjectiveComplete('nursing');
  };

  // Handle message sending (from student inquiry or patient free-text feeling)
  const handleSendMessage = async (
    messageText: string,
    mode: 'natural' | 'physical' | 'emotional' | 'social' | 'reassurance' | 'patient-expression' = 'natural',
    asRole: 'student' | 'patient' = 'student'
  ) => {
    if (!messageText.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    markObjectiveComplete('empathy');
    markObjectiveComplete('validation');

    // Branch 1: User is speaking as Patient expressing feelings in Free Text
    if (asRole === 'patient' || mode === 'patient-expression') {
      setIsLoading(true);
      setPrefilledText('');

      try {
        const response = await fetch('/api/analyze-patient-feelings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patient: currentPatient,
            patientFreeText: messageText,
            currentState,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to analyze patient feelings');
        }

        const analysisData: PatientEmotionalAnalysis = await response.json();

        const patientMsg: ChatMessage = {
          id: `patient-expr-${Date.now()}`,
          role: 'patient',
          text: messageText,
          timestamp: timeStr,
          inquiryMode: 'patient-expression',
          emotionalAnalysis: analysisData,
        };

        const clinicianMsg: ChatMessage = {
          id: `clinician-resp-${Date.now() + 1}`,
          role: 'clinician',
          text: analysisData.empatheticResponse.fullSpokenReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          emotionalAnalysis: analysisData,
        };

        setPreviousState(currentState);
        if (analysisData.detectedState) {
          setCurrentState(analysisData.detectedState);
          if (analysisData.detectedState.anxiety < currentState.anxiety) {
            const nextVitals = {
              ...vitals,
              hr: Math.max(62, vitals.hr - 4),
              bpSystolic: Math.max(110, vitals.bpSystolic - 4),
            };
            setVitals(nextVitals);
            logVitalTrend(nextVitals, 'Validated Emotions');
          }
          if (analysisData.detectedState.trust >= 65) {
            markObjectiveComplete('trust');
          }
        }
        setImmediateFeeling(analysisData.primaryEmotion);
        if (analysisData.somaticManifestations) {
          setNonVerbalCues(analysisData.somaticManifestations);
        }
        setLastImpactExplanation(analysisData.empatheticResponse.validation);

        setHistory(prev => [...prev, patientMsg, clinicianMsg]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Branch 2: Student is inquiring to Simulated Patient
    const studentMsg: ChatMessage = {
      id: `student-${Date.now()}`,
      role: 'student',
      text: messageText,
      timestamp: timeStr,
      inquiryMode: mode,
    };

    const newHistory = [...history, studentMsg];
    setHistory(newHistory);
    setIsLoading(true);
    setPrefilledText('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: currentPatient,
          history: newHistory,
          message: messageText,
          inquiryMode: mode,
          currentState,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`);
      }

      const data = await response.json();

      setPreviousState(currentState);

      if (data.updatedState) {
        setCurrentState(data.updatedState);
        // Autonomic shift in vitals
        if (data.updatedState.anxiety < currentState.anxiety) {
          const nextVitals = {
            ...vitals,
            hr: Math.max(60, vitals.hr - 3),
            bpSystolic: Math.max(110, vitals.bpSystolic - 3),
          };
          setVitals(nextVitals);
          logVitalTrend(nextVitals, 'Empathy Calming');
        } else if (data.updatedState.anxiety > currentState.anxiety) {
          const nextVitals = {
            ...vitals,
            hr: Math.min(130, vitals.hr + 4),
            bpSystolic: Math.min(160, vitals.bpSystolic + 4),
          };
          setVitals(nextVitals);
          logVitalTrend(nextVitals, 'Anxiety Spike');
        }

        if (data.updatedState.trust >= 65) {
          markObjectiveComplete('trust');
        }
      }
      if (data.immediateFeeling) {
        setImmediateFeeling(data.immediateFeeling);
      }
      if (data.nonVerbalCues) {
        setNonVerbalCues(data.nonVerbalCues);
      }
      if (data.emotionalImpactExplanation) {
        setLastImpactExplanation(data.emotionalImpactExplanation);
      }
      if (data.multidimensionalFeelings) {
        setFeelingsDimensions(data.multidimensionalFeelings);
      }

      const patientMsg: ChatMessage = {
        id: `patient-${Date.now()}`,
        role: 'patient',
        text: data.spokenResponse || `*takes a breath* I hear what you're saying...`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        details: data,
      };

      setHistory(prev => [...prev, patientMsg]);
    } catch (err) {
      console.error(err);
      const errorPatientMsg: ChatMessage = {
        id: `patient-err-${Date.now()}`,
        role: 'patient',
        text: `*looks down quietly* I'm sorry... I lost my train of thought for a moment. Could you repeat that?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory(prev => [...prev, errorPatientMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFreeTextAnalysis = (freeText: string, analysis: PatientEmotionalAnalysis) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const patientMsg: ChatMessage = {
      id: `patient-free-${Date.now()}`,
      role: 'patient',
      text: freeText,
      timestamp: timeStr,
      inquiryMode: 'patient-expression',
      emotionalAnalysis: analysis,
    };

    const clinicianMsg: ChatMessage = {
      id: `clinician-val-${Date.now() + 1}`,
      role: 'clinician',
      text: analysis.empatheticResponse.fullSpokenReply,
      timestamp: timeStr,
      emotionalAnalysis: analysis,
    };

    setPreviousState(currentState);
    if (analysis.detectedState) {
      setCurrentState(analysis.detectedState);
      if (analysis.detectedState.trust >= 65) {
        markObjectiveComplete('trust');
      }
    }
    setImmediateFeeling(analysis.primaryEmotion);
    if (analysis.somaticManifestations) {
      setNonVerbalCues(analysis.somaticManifestations);
    }
    setLastImpactExplanation(analysis.empatheticResponse.validation);

    setHistory(prev => [...prev, patientMsg, clinicianMsg]);
    setActiveTab('dialogue');
  };

  const handleSelectDimension = (mode: 'physical' | 'emotional' | 'social' | 'reassurance', suggestedText: string) => {
    setPrefilledText(suggestedText);
    setActiveTab('dialogue');
  };

  const handleOpenCompare = (topic?: string) => {
    setCompareTopic(topic || "How the patient feels right now");
    setCompareModalOpen(true);
  };

  const studentTurnCount = history.filter(m => m.role === 'student' || m.role === 'clinician').length;
  const completedObjectivesCount = objectives.filter(o => o.status === 'completed').length;

  // VIEW 1: FUTURISTIC LANDING PAGE (Initial Page as requested)
  if (currentView === 'landing') {
    return (
      <FuturisticLandingPage
        onStartSimulation={handleStartSimulation}
        patients={patients}
      />
    );
  }

  // VIEW 2: EXISTING FULL CLINICAL SIMULATOR
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Header with Return to Home button */}
      <div className="print:hidden">
        <Header
          patients={patients}
          currentPatient={currentPatient}
          onSelectPatient={handleSelectPatient}
          onOpenCustomModal={() => setCustomModalOpen(true)}
          onOpenCompareModal={() => handleOpenCompare()}
          onOpenDebriefModal={() => setDebriefModalOpen(true)}
          onResetSession={handleResetSession}
          onNavigateHome={() => setCurrentView('landing')}
          onOpenEmergencyCodes={() => setEmergencyModalOpen(true)}
          turnCount={studentTurnCount}
        />
      </div>

      {/* Emergency Active Broadcast Banner (if active) */}
      {activeEmergencyBanner && (
        <div className="print:hidden bg-rose-600 text-white px-4 py-2 text-xs font-mono flex items-center justify-between gap-4 animate-pulse border-b border-rose-700">
          <div className="flex items-center gap-2">
            <Siren className="w-4 h-4 animate-bounce" />
            <span>
              <strong>HOSPITAL EMERGENCY BROADCAST ACTIVE:</strong> {activeEmergencyBanner.code} - {activeEmergencyBanner.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="px-2 py-0.5 bg-rose-800 hover:bg-rose-900 rounded font-bold text-[11px] underline"
            >
              View Protocol
            </button>
            <button
              onClick={() => setActiveEmergencyBanner(null)}
              className="text-white hover:text-rose-200 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Real-time Emotional Vitals HUD with ONE-CLICK EMPATHY SHORTCUTS */}
      <div className="print:hidden">
        <EmotionalVitalsHUD
          patient={currentPatient}
          currentState={currentState}
          previousState={previousState}
          immediateFeeling={immediateFeeling}
          nonVerbalCues={nonVerbalCues}
          lastImpactExplanation={lastImpactExplanation}
          onInjectEmpathyPhrase={handleInjectEmpathyPhrase}
        />
      </div>

      {/* Main Clinical Simulation Console */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-5 print:p-0 print:max-w-none">
        {/* Navigation Tabs Matrix */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-2.5 border-b border-sky-100 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap bg-white p-1 rounded-2xl border border-sky-200 shadow-2xs">
            {/* Tab: Dialogue */}
            <button
              onClick={() => setActiveTab('dialogue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'dialogue'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Bedside Dialogue</span>
              {history.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[10px] flex items-center justify-center font-bold">
                  {history.length}
                </span>
              )}
            </button>

            {/* Tab: Vital Signs Monitor with Recharts Trends */}
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'vitals'
                  ? 'bg-slate-900 text-emerald-400 shadow-xs border border-slate-700'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>Vitals &amp; Vital Trends (Recharts)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                {vitals.hr} bpm
              </span>
            </button>

            {/* Tab: Labs & Haemoglobin */}
            <button
              onClick={() => setActiveTab('labs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'labs'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>Labs &amp; Haemoglobin</span>
              {labs.find(l => l.id === 'hb')?.flag === 'low' && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                  Low Hb
                </span>
              )}
            </button>

            {/* Tab: Patient History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Patient History (EHR)</span>
            </button>

            {/* Tab: Pharmacy */}
            <button
              onClick={() => setActiveTab('pharmacy')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'pharmacy'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50'
              }`}
            >
              <Pill className="w-4 h-4 text-sky-400" />
              <span>Pharmacy &amp; eMAR</span>
            </button>

            {/* Tab: Nursing & Objectives */}
            <button
              onClick={() => setActiveTab('nursing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'nursing'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-emerald-300" />
              <span>Nursing &amp; Objectives</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                {completedObjectivesCount}/{objectives.length}
              </span>
            </button>

            {/* Tab: Patient Summary (Shift Handover) */}
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                activeTab === 'summary'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <ClipboardList className={`w-4 h-4 ${activeTab === 'summary' ? 'text-indigo-100' : 'text-indigo-500'}`} />
              <span>Patient Summary</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                activeTab === 'summary' ? 'bg-indigo-800 text-indigo-100' : 'bg-indigo-100 text-indigo-800'
              }`}>
                Handover
              </span>
            </button>

            {/* Tab: Grading Portion */}
            <button
              onClick={() => setActiveTab('grading')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'grading'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>Simulation Grading</span>
            </button>
          </div>

          {/* Secondary Feeling Explorers & Home Shortcut */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
              title="Hospital Emergency Codes"
            >
              <Siren className="w-3.5 h-3.5 text-rose-600" />
              <span>Hospital Codes</span>
            </button>

            <button
              onClick={() => setActiveTab('express')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeTab === 'express'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-white text-slate-600 hover:bg-rose-50 border-slate-200'
              }`}
              title="Patient speaks in unconstrained free text"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Free-Text</span>
            </button>

            <button
              onClick={() => setActiveTab('dimensions')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                activeTab === 'dimensions'
                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                  : 'bg-white text-slate-600 hover:bg-sky-50 border-slate-200'
              }`}
              title="4-Dimensional Feeling Map"
            >
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              <span>4D Map</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BEDSIDE DIALOGUE */}
        {activeTab === 'dialogue' && (
          <div className="space-y-4 flex-1 flex flex-col">
            {/* Quick Helper Ribbon */}
            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-xs text-slate-700 font-medium">
                  Use the <strong>1-click Empathy Shortcuts</strong> above in the HUD or type your own empathetic reflections to explore how {currentPatient.name.split(' ')[0]} feels right now.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('vitals')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 hover:bg-sky-100 text-sky-800 text-xs font-semibold"
                >
                  View Vitals &amp; Recharts Trends
                </button>
                <button
                  onClick={() => setActiveTab('labs')}
                  className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
                >
                  Check Labs (Hb)
                </button>
              </div>
            </div>

            {/* Clinical Dialogue Stream */}
            <div className="flex-1 bg-white border border-sky-200 rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col min-h-[420px]">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-sky-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <HeartPulse className="w-4 h-4 text-sky-600" />
                  <span>Bedside Dialogue &amp; Empathetic Validation Stream</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {history.length} exchanges • Real-time patient somatic responses
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                <DialogueStream
                  messages={history}
                  patient={currentPatient}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VITAL SIGNS MONITOR & RECHARTS VITAL TRENDS */}
        {activeTab === 'vitals' && (
          <div className="space-y-4">
            <VitalSignsMonitor
              patient={currentPatient}
              vitals={vitals}
              currentState={currentState}
              trendHistory={vitalTrends}
              onRefreshVitals={() => {
                const updated = {
                  ...vitals,
                  bpSystolic: vitals.bpSystolic + (Math.random() > 0.5 ? 2 : -2),
                  bpDiastolic: vitals.bpDiastolic + (Math.random() > 0.5 ? 1 : -1),
                };
                setVitals(updated);
                logVitalTrend(updated, 'NIBP Cycle');
                markObjectiveComplete('vitals');
              }}
              onTriggerEmergencyCode={handleTriggerEmergencyCode}
            />
          </div>
        )}

        {/* TAB 3: LABS & HAEMOGLOBIN */}
        {activeTab === 'labs' && (
          <div className="space-y-4">
            <LabsDashboard
              patient={currentPatient}
              labs={labs}
              onOrderLab={handleOrderLab}
              onOrderStatDraw={handleOrderStatDraw}
            />
          </div>
        )}

        {/* TAB 4: PATIENT HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <PatientHistoryView
              patient={currentPatient}
              onOpenConsultation={() => setActiveTab('dialogue')}
            />
          </div>
        )}

        {/* TAB 5: PHARMACY */}
        {activeTab === 'pharmacy' && (
          <div className="space-y-4">
            <PharmacyManagement
              patient={currentPatient}
              medications={medications}
              onAdministerMedication={handleAdministerMedication}
              onOrderNewMedication={handleOrderNewMedication}
              currentState={currentState}
              vitals={vitals}
            />
          </div>
        )}

        {/* TAB 6: NURSING & OBJECTIVES */}
        {activeTab === 'nursing' && (
          <div className="space-y-4">
            <NursingCareView
              patient={currentPatient}
              interventions={interventions}
              objectives={objectives}
              currentState={currentState}
              onPerformIntervention={handlePerformIntervention}
            />
          </div>
        )}

        {/* TAB 7: PATIENT SUMMARY / SHIFT HANDOVER REPORT CARD */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <PatientSummaryView
              patient={currentPatient}
              currentState={currentState}
              previousState={previousState}
              vitals={vitals}
              vitalTrends={vitalTrends}
              labs={labs}
              medications={medications}
              interventions={interventions}
              objectives={objectives}
              history={history}
              immediateFeeling={immediateFeeling}
              nonVerbalCues={nonVerbalCues}
              lastImpactExplanation={lastImpactExplanation}
              feelingsDimensions={feelingsDimensions}
              activeEmergencyBanner={activeEmergencyBanner}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {/* TAB 8: SIMULATION GRADING PORTION */}
        {activeTab === 'grading' && (
          <div className="space-y-4">
            <GradingReportView
              patient={currentPatient}
              currentState={currentState}
              history={history}
              vitals={vitals}
              labs={labs}
              medications={medications}
              interventions={interventions}
              objectives={objectives}
              onRestartSession={handleResetSession}
            />
          </div>
        )}

        {/* TAB 8: FREE-TEXT FEELING EXPRESSION */}
        {activeTab === 'express' && (
          <div className="space-y-4">
            <PatientFreeTextExpress
              patient={currentPatient}
              currentState={currentState}
              onApplyAnalysis={handleApplyFreeTextAnalysis}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* TAB 9: 4-DIMENSIONAL MAP */}
        {activeTab === 'dimensions' && (
          <MultidimensionalFeelingsCard
            patient={currentPatient}
            feelings={feelingsDimensions}
            onSelectDimension={handleSelectDimension}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Bottom Sticky Student/Patient Action Bar (dialogue tab) */}
      <div className="print:hidden sticky bottom-0 z-30">
        <StudentActionBar
          patient={currentPatient}
          onSendMessage={handleSendMessage}
          onOpenCompare={handleOpenCompare}
          onScrollToExpressPortal={() => setActiveTab('express')}
          isLoading={isLoading}
          prefilledText={prefilledText}
        />
      </div>

      {/* Modals */}
      <HospitalEmergencyCodesModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        onTriggerCode={handleTriggerEmergencyCode}
      />

      <CompareApproachesModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        patient={currentPatient}
        currentState={currentState}
        onSelectApproach={(text) => {
          setPrefilledText(text);
          setActiveTab('dialogue');
        }}
        initialTopic={compareTopic}
      />

      <DebriefModal
        isOpen={debriefModalOpen}
        onClose={() => setDebriefModalOpen(false)}
        patient={currentPatient}
        history={history}
        finalState={currentState}
        onRestart={handleResetSession}
      />

      <CustomPatientModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onCreatePatient={handleCreateCustomPatient}
      />
    </div>
  );
}
