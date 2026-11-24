import React, { useState } from 'react';
import {
  ClipboardList,
  Printer,
  Copy,
  Check,
  Heart,
  Activity,
  FlaskConical,
  Pill,
  Stethoscope,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldAlert,
  UserCheck,
  MessageSquare,
  Sparkles,
  Siren,
  ArrowRight
} from 'lucide-react';
import {
  PatientProfile,
  PatientEmotionalState,
  VitalSigns,
  VitalTrendPoint,
  LabTest,
  MedicationOrder,
  NursingIntervention,
  SimulationObjective,
  ChatMessage,
  MultidimensionalFeelings,
  HospitalEmergencyCode
} from '../types';

interface PatientSummaryViewProps {
  patient: PatientProfile;
  currentState: PatientEmotionalState;
  previousState?: PatientEmotionalState;
  vitals: VitalSigns;
  vitalTrends: VitalTrendPoint[];
  labs: LabTest[];
  medications: MedicationOrder[];
  interventions: NursingIntervention[];
  objectives: SimulationObjective[];
  history: ChatMessage[];
  immediateFeeling?: string;
  nonVerbalCues?: string[];
  lastImpactExplanation?: string;
  feelingsDimensions?: MultidimensionalFeelings;
  activeEmergencyBanner?: HospitalEmergencyCode | null;
  onNavigateTab?: (tab: 'dialogue' | 'vitals' | 'labs' | 'history' | 'pharmacy' | 'nursing' | 'grading') => void;
}

export const PatientSummaryView: React.FC<PatientSummaryViewProps> = ({
  patient,
  currentState,
  vitals,
  vitalTrends,
  labs,
  medications,
  interventions,
  objectives,
  history,
  immediateFeeling,
  nonVerbalCues,
  lastImpactExplanation,
  feelingsDimensions,
  activeEmergencyBanner,
  onNavigateTab,
}) => {
  const [copiedSbar, setCopiedSbar] = useState(false);

  const nowDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const nowTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Aggregated Metrics
  const completedObjectives = objectives.filter(o => o.status === 'completed');
  const pendingObjectives = objectives.filter(o => o.status !== 'completed');
  const objectivePercent = Math.round((completedObjectives.length / Math.max(1, objectives.length)) * 100);

  const performedInterventions = interventions.filter(i => i.performed);
  const pendingInterventions = interventions.filter(i => !i.performed);

  const administeredMeds = medications.filter(m => m.status === 'administered');
  const activeMeds = medications.filter(m => m.status === 'active');

  const orderedLabs = labs.filter(l => l.ordered);
  const abnormalLabs = labs.filter(l => l.flag !== 'normal');
  const hbLab = labs.find(
    l => l.id === 'hb' || l.name.toLowerCase().includes('haemoglobin') || l.name.toLowerCase().includes('hemoglobin')
  );

  const studentExchanges = history.filter(m => m.role === 'student' || m.role === 'clinician');
  const clinicalSystemNotes = history.filter(
    m => m.role === 'clinician' && (m.text.startsWith('[') || m.text.includes('🚨'))
  );

  // Delta helpers
  const renderDelta = (current: number, baseline: number, unit = '', lowerIsBetter = false) => {
    const diff = Number((current - baseline).toFixed(1));
    if (diff === 0) {
      return (
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
          <Minus className="w-3 h-3" /> No change
        </span>
      );
    }
    const isPositiveOutcome = lowerIsBetter ? diff < 0 : diff > 0;
    const colorClass = isPositiveOutcome
      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
      : 'text-amber-700 bg-amber-50 border border-amber-200';

    return (
      <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold px-1.5 py-0.5 rounded ${colorClass}`}>
        {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {diff > 0 ? `+${diff}${unit}` : `${diff}${unit}`}
      </span>
    );
  };

  // Emotional state trajectory summary text
  const trustDelta = currentState.trust - patient.baselineState.trust;
  const anxietyDelta = currentState.anxiety - patient.baselineState.anxiety;
  const emotionalTrajectoryStatus =
    trustDelta >= 10 || anxietyDelta <= -10
      ? 'Therapeutically Improving'
      : anxietyDelta >= 10 || trustDelta <= -10
      ? 'Heightened Distress — Requires Reassurance'
      : 'Stable / Baseline Rapport';

  const emotionalTrajectoryBadge =
    trustDelta >= 10 || anxietyDelta <= -10
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : anxietyDelta >= 10 || trustDelta <= -10
      ? 'bg-rose-50 text-rose-800 border-rose-200'
      : 'bg-sky-50 text-sky-800 border-sky-200';

  // Copy plain-text SBAR handover to clipboard
  const handleCopySbar = async () => {
    const lines = [
      `CLINICAL AI SIMULATOR — SHIFT HANDOVER REPORT CARD`,
      `Date/Time: ${nowDate} ${nowTime}`,
      `Patient: ${patient.name} (${patient.age}y ${patient.gender}) | MRN: ${patient.history.mrn} | Room: ${patient.history.room}`,
      `Setting: ${patient.clinicalSetting} | Attending: ${patient.history.attending} | Code Status: ${patient.history.codeStatus}`,
      `Allergies: ${
        patient.history.allergies.length > 0
          ? patient.history.allergies.map(a => `${a.allergen} (${a.severity}: ${a.reaction})`).join('; ')
          : 'No Known Drug Allergies (NKDA)'
      }`,
      ``,
      `S — SITUATION:`,
      `Chief Complaint: ${patient.chiefComplaint}`,
      `Emotional State: ${emotionalTrajectoryStatus} | Immediate Feeling: ${immediateFeeling || patient.demeanor}`,
      `Trust: ${currentState.trust}% (base ${patient.baselineState.trust}%), Anxiety: ${currentState.anxiety}% (base ${patient.baselineState.anxiety}%), Pain: ${currentState.pain}/10, Comfort: ${currentState.comfort}%`,
      ``,
      `B — BACKGROUND:`,
      `PMHx: ${patient.history.pastMedicalHistory.join(', ') || 'None documented'}`,
      `Underlying Concern: ${patient.hiddenConcern}`,
      ``,
      `A — ASSESSMENT & CLINICAL TRAJECTORY:`,
      `Vitals: HR ${vitals.hr} bpm | BP ${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg | SpO2 ${vitals.spo2}% | RR ${vitals.rr}/min | Temp ${vitals.temp}°C | Rhythm: ${vitals.rhythm}`,
      `Haemoglobin (Hb): ${hbLab ? `${hbLab.value} ${hbLab.unit} [${hbLab.flag.toUpperCase()}]` : 'N/A'}`,
      `Abnormal/Flagged Labs: ${abnormalLabs.map(l => `${l.name}: ${l.value} ${l.unit} (${l.flag})`).join('; ') || 'None'}`,
      ``,
      `R — NURSING ACHIEVEMENTS & NEXT SHIFT PRIORITIES:`,
      `Objectives Completed: ${completedObjectives.length}/${objectives.length} (${objectivePercent}%)`,
      `Interventions Executed: ${performedInterventions.map(i => `${i.title}${i.performedAt ? ` @ ${i.performedAt}` : ''}`).join('; ') || 'None yet'}`,
      `Medications Administered: ${administeredMeds.map(m => `${m.name} ${m.dose} ${m.route}${m.administeredAt ? ` @ ${m.administeredAt}` : ''}`).join('; ') || 'None yet'}`,
      `Pending Priorities: ${pendingObjectives.map(o => o.title).join('; ') || 'All primary objectives completed.'}`,
    ];

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopiedSbar(true);
      setTimeout(() => setCopiedSbar(false), 2500);
    } catch {
      setCopiedSbar(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="print:hidden bg-white border border-sky-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xs">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Patient Summary &amp; Shift Handover Report Card
            </h2>
            <p className="text-xs text-slate-500">
              Live clinical aggregation of emotional trajectory, hemodynamic shifts, lab panels, and nursing milestones.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopySbar}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 transition"
          >
            {copiedSbar ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">SBAR Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-sky-600" />
                <span>Copy SBAR Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Shift Handover</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE SHIFT HANDOVER REPORT CARD DOCUMENT */}
      <article className="bg-white border-2 border-sky-200 rounded-2xl shadow-md overflow-hidden print:border print:border-slate-300 print:shadow-none print:rounded-none">
        {/* Document Masthead */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 text-white p-5 sm:p-6 print:bg-white print:text-slate-900 print:border-b-2 print:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded bg-white/15 border border-white/25 text-sky-100 print:border-slate-400 print:text-slate-700">
                  Shift Handover Report Card
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/30 border border-sky-300/40 text-white print:text-slate-700 print:border-slate-300">
                  SBAR Standardized Summary
                </span>
                {patient.difficulty && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-blue-900">
                    Case Level: {patient.difficulty}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {patient.name}
                <span className="text-sm sm:text-base font-medium text-sky-100 ml-2 print:text-slate-600">
                  ({patient.age} yrs • {patient.gender} • {patient.occupation})
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-sky-100 print:text-slate-700 max-w-3xl">
                <strong>Chief Complaint:</strong> {patient.chiefComplaint}
              </p>
            </div>

            {/* Patient Chart Identifiers Box */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-xl p-3 text-xs space-y-1 min-w-[230px] print:bg-slate-50 print:border-slate-300 print:text-slate-800">
              <div className="flex justify-between gap-4">
                <span className="text-sky-200 print:text-slate-500">MRN:</span>
                <strong className="font-mono">{patient.history.mrn}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-200 print:text-slate-500">DOB:</span>
                <strong>{patient.history.dob}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-200 print:text-slate-500">Unit / Room:</span>
                <strong>{patient.clinicalSetting} • {patient.history.room}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-200 print:text-slate-500">Attending:</span>
                <strong>{patient.history.attending}</strong>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-sky-200 print:text-slate-500">Code Status:</span>
                <strong className="text-emerald-300 print:text-emerald-700">{patient.history.codeStatus}</strong>
              </div>
              <div className="flex justify-between gap-4 border-t border-white/15 pt-1 mt-1 print:border-slate-200">
                <span className="text-sky-200 print:text-slate-500">Generated:</span>
                <span>{nowDate} {nowTime}</span>
              </div>
            </div>
          </div>

          {/* Critical Safety & Allergy Strip */}
          <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs print:border-slate-300">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 font-extrabold uppercase tracking-wider text-amber-200 print:text-rose-700">
                <ShieldAlert className="w-4 h-4" /> Allergies:
              </span>
              {patient.history.allergies.length > 0 ? (
                patient.history.allergies.map((allergy, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-rose-500/90 text-white font-bold border border-rose-300/60 print:bg-rose-50 print:text-rose-800 print:border-rose-300"
                  >
                    {allergy.allergen} ({allergy.severity} — {allergy.reaction})
                  </span>
                ))
              ) : (
                <span className="px-2 py-0.5 rounded bg-emerald-500/30 border border-emerald-300/50 text-emerald-100 font-semibold print:text-emerald-800 print:bg-emerald-50">
                  No Known Drug Allergies (NKDA)
                </span>
              )}
            </div>

            {activeEmergencyBanner && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-600 border border-rose-300 text-white font-extrabold">
                <Siren className="w-3.5 h-3.5" />
                <span>ACTIVE ALERT: {activeEmergencyBanner.code} ({activeEmergencyBanner.name})</span>
              </div>
            )}
          </div>
        </div>

        {/* Report Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* KPI Summary Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Emotional Rapport</span>
                <Heart className="w-4 h-4 text-sky-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{currentState.trust}%</span>
                <span className="text-xs text-slate-500">Trust</span>
              </div>
              <div className="mt-1">{renderDelta(currentState.trust, patient.baselineState.trust, '%')}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Nursing Objectives</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {completedObjectives.length}/{objectives.length}
                </span>
                <span className="text-xs text-slate-500">({objectivePercent}%)</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700">
                {performedInterventions.length} interventions executed
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Current Vitals</span>
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-xl font-extrabold text-slate-900">
                  {vitals.bpSystolic}/{vitals.bpDiastolic}
                </span>
                <span className="text-xs text-slate-500">mmHg</span>
              </div>
              <span className="text-[11px] font-semibold text-blue-700">
                HR {vitals.hr} bpm • SpO2 {vitals.spo2}% • Pain {vitals.pain}/10
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Haemoglobin &amp; Labs</span>
                <FlaskConical className="w-4 h-4 text-purple-600" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  {hbLab ? hbLab.value : '—'}
                </span>
                <span className="text-xs text-slate-500">{hbLab ? hbLab.unit : ''}</span>
              </div>
              <span className={`text-[11px] font-bold ${hbLab?.flag === 'normal' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {hbLab ? `Hb: ${hbLab.flag.toUpperCase()} (${orderedLabs.length}/${labs.length} labs reviewed)` : `${orderedLabs.length} labs reviewed`}
              </span>
            </div>
          </div>

          {/* SECTION 1: CURRENT EMOTIONAL STATE & PSYCHOSOCIAL PROFILE */}
          <section className="border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-gradient-to-b from-sky-50/30 to-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                  1. Current Emotional State &amp; Psychosocial Shift
                </h3>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${emotionalTrajectoryBadge}`}>
                {emotionalTrajectoryStatus}
              </span>
            </div>

            {/* 6 Emotional Vitals Comparison Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {[
                { label: 'Trust', cur: currentState.trust, base: patient.baselineState.trust, unit: '%', lowerBetter: false },
                { label: 'Anxiety', cur: currentState.anxiety, base: patient.baselineState.anxiety, unit: '%', lowerBetter: true },
                { label: 'Comfort', cur: currentState.comfort, base: patient.baselineState.comfort, unit: '%', lowerBetter: false },
                { label: 'Openness', cur: currentState.openness, base: patient.baselineState.openness, unit: '%', lowerBetter: false },
                { label: 'Pain Score', cur: currentState.pain, base: patient.baselineState.pain, unit: '/10', lowerBetter: true },
                { label: 'Fatigue', cur: currentState.fatigue, base: patient.baselineState.fatigue, unit: '%', lowerBetter: true },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <strong className="text-lg font-extrabold text-slate-900">
                      {item.cur}{item.unit}
                    </strong>
                    <span className="text-[10px] text-slate-400">
                      Base: {item.base}{item.unit}
                    </span>
                  </div>
                  <div>{renderDelta(item.cur, item.base, item.unit, item.lowerBetter)}</div>
                </div>
              ))}
            </div>

            {/* Affect, Cues, Hidden Concern & Multidimensional Readout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-sky-100 space-y-2">
                <div>
                  <span className="font-bold text-slate-700 block">Immediate Feeling / Affective Tone:</span>
                  <p className="text-slate-900 font-semibold mt-0.5">
                    {immediateFeeling || patient.demeanor}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-700 block">Observed Non-Verbal Cues:</span>
                  {nonVerbalCues && nonVerbalCues.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {nonVerbalCues.map((cue, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-medium">
                          {cue}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic mt-0.5">Baseline bedside demeanor; continue observing somatic cues.</p>
                  )}
                </div>

                {lastImpactExplanation && (
                  <div className="pt-1 border-t border-slate-100">
                    <span className="font-bold text-blue-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Latest Therapeutic Impact:
                    </span>
                    <p className="text-slate-700 mt-0.5">{lastImpactExplanation}</p>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-sky-100 space-y-2">
                <div>
                  <span className="font-bold text-slate-700 block">Primary Psychosocial / Hidden Concern to Address:</span>
                  <p className="text-slate-800 mt-0.5 bg-amber-50/70 border border-amber-200 rounded-lg p-2">
                    {patient.hiddenConcern}
                  </p>
                </div>

                {feelingsDimensions ? (
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong className="text-slate-700 block">Physical:</strong>
                      <span className="text-slate-600">{feelingsDimensions.physical}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong className="text-slate-700 block">Emotional:</strong>
                      <span className="text-slate-600">{feelingsDimensions.emotional}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong className="text-slate-700 block">Social:</strong>
                      <span className="text-slate-600">{feelingsDimensions.social}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong className="text-slate-700 block">Care / Existential:</strong>
                      <span className="text-slate-600">{feelingsDimensions.existentialOrCare}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-500 italic pt-1">
                    <strong>Background Context:</strong> {patient.background}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* SECTION 2: CLINICAL TRAJECTORY (VITALS, TIMELINE & LABS) */}
          <section className="border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                  2. Clinical Trajectory — Vitals, Timeline &amp; Diagnostics
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                Rhythm: <strong className="text-slate-900">{vitals.rhythm}</strong>
              </span>
            </div>

            {/* Vitals Baseline vs Current Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-sky-50/80 text-slate-600 border-b border-sky-200">
                    <th className="py-2 px-3 font-bold">Vital Parameter</th>
                    <th className="py-2 px-3 font-bold">Admission Baseline</th>
                    <th className="py-2 px-3 font-bold">Current Reading</th>
                    <th className="py-2 px-3 font-bold">Shift Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Heart Rate (HR)</td>
                    <td className="py-2 px-3 text-slate-600">{patient.baselineVitals.hr} bpm</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{vitals.hr} bpm</td>
                    <td className="py-2 px-3">{renderDelta(vitals.hr, patient.baselineVitals.hr, ' bpm', patient.baselineVitals.hr > 90)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Blood Pressure (NIBP)</td>
                    <td className="py-2 px-3 text-slate-600">{patient.baselineVitals.bpSystolic}/{patient.baselineVitals.bpDiastolic} mmHg</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{vitals.bpSystolic}/{vitals.bpDiastolic} mmHg</td>
                    <td className="py-2 px-3">{renderDelta(vitals.bpSystolic, patient.baselineVitals.bpSystolic, ' sys', patient.baselineVitals.bpSystolic > 135)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Oxygen Saturation (SpO2)</td>
                    <td className="py-2 px-3 text-slate-600">{patient.baselineVitals.spo2}%</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{vitals.spo2}%</td>
                    <td className="py-2 px-3">{renderDelta(vitals.spo2, patient.baselineVitals.spo2, '%', false)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-slate-800">Respiratory Rate (RR) &amp; Temp</td>
                    <td className="py-2 px-3 text-slate-600">{patient.baselineVitals.rr}/min • {patient.baselineVitals.temp}°C</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{vitals.rr}/min • {vitals.temp}°C</td>
                    <td className="py-2 px-3">{renderDelta(vitals.rr, patient.baselineVitals.rr, '/min', patient.baselineVitals.rr > 20)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Two-column: Chronological Trend Log & Key Labs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
              {/* Trajectory Events Log */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    Shift Physiological Timeline ({vitalTrends.length} points)
                  </span>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {vitalTrends.map((pt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 text-[11px] bg-white px-2.5 py-1.5 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-blue-700 shrink-0">{pt.time}</span>
                        <span className="font-semibold text-slate-800 truncate">
                          {pt.event || 'Vital Check'}
                        </span>
                      </div>
                      <span className="font-mono text-slate-600 shrink-0">
                        HR {pt.hr} • {pt.bpSystolic}/{pt.bpDiastolic} • {pt.spo2}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Diagnostics Spotlight */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-purple-600" />
                    Laboratory Diagnostics &amp; Haemoglobin Status
                  </span>
                  <span className="text-[11px] font-bold text-purple-700">
                    {orderedLabs.length}/{labs.length} Reviewed
                  </span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {labs.map((lab) => {
                    const flagColor =
                      lab.flag === 'critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : lab.flag === 'high' || lab.flag === 'low'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    return (
                      <div
                        key={lab.id}
                        className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-slate-900">{lab.name}</strong>
                            {lab.ordered ? (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                                Reviewed{lab.orderedAt ? ` @ ${lab.orderedAt}` : ''}
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 rounded">
                                Pending Review
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 truncate">{lab.interpretation}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded border font-bold ${flagColor}`}>
                            {lab.value} {lab.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: KEY NURSING ACHIEVEMENTS, eMAR & OBJECTIVES */}
          <section className="border border-sky-200 rounded-2xl p-4 sm:p-5 space-y-4 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase tracking-wide">
                  3. Key Nursing Achievements, eMAR &amp; Handover Priorities
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {completedObjectives.length} of {objectives.length} Objectives Achieved ({objectivePercent}%)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Column A: Objectives Achieved & Pending */}
              <div className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2.5">
                <h4 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-600" />
                  Clinical Objectives Sign-Off
                </h4>

                <div className="space-y-1.5">
                  {objectives.map((obj) => {
                    const done = obj.status === 'completed';
                    return (
                      <div
                        key={obj.id}
                        className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                          done ? 'bg-white border-emerald-200' : 'bg-white/70 border-slate-200'
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-bold ${done ? 'text-slate-900' : 'text-slate-700'}`}>
                              {obj.title}
                            </span>
                            {done && obj.completedAt && (
                              <span className="text-[10px] text-emerald-700 font-mono shrink-0">
                                {obj.completedAt}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            {obj.category} • {done ? 'Completed' : 'Handover Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Column B: Bedside Nursing Interventions */}
              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  Nursing Care Interventions ({performedInterventions.length}/{interventions.length})
                </h4>

                <div className="space-y-1.5">
                  {performedInterventions.length > 0 ? (
                    performedInterventions.map((item) => (
                      <div key={item.id} className="p-2 rounded-lg bg-white border border-emerald-200 text-xs">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-700 shrink-0">
                            {item.performedAt || 'Done'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{item.impactSummary}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 italic">
                      No bedside nursing interventions charted yet this shift.
                    </div>
                  )}

                  {pendingInterventions.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                        Remaining / Next-Shift Interventions:
                      </span>
                      {pendingInterventions.map((item) => (
                        <div key={item.id} className="text-[11px] text-slate-600 flex items-center gap-1.5 py-0.5">
                          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{item.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Column C: Pharmacy / eMAR Handover */}
              <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-200 space-y-2.5">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-blue-600" />
                  Medication &amp; eMAR Handover ({administeredMeds.length} Given)
                </h4>

                <div className="space-y-1.5">
                  {administeredMeds.length > 0 ? (
                    administeredMeds.map((med) => (
                      <div key={med.id} className="p-2 rounded-lg bg-white border border-blue-200 text-xs">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-slate-900">
                            {med.name} ({med.dose})
                          </span>
                          <span className="text-[10px] font-mono text-blue-700 shrink-0">
                            {med.administeredAt || 'Given'}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          {med.route} • {med.indication}
                        </span>
                        {med.responseEffect?.note && (
                          <p className="text-[11px] text-emerald-700 mt-0.5">
                            Response: {med.responseEffect.note}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-500 italic">
                      No PRN or scheduled medications administered yet this shift.
                    </div>
                  )}

                  {activeMeds.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        Active Orders Available on eMAR ({activeMeds.length}):
                      </span>
                      {activeMeds.map((med) => (
                        <div key={med.id} className="text-[11px] text-slate-600 flex items-center justify-between py-0.5">
                          <span>• {med.name} {med.dose}</span>
                          <span className="text-[10px] text-slate-400">{med.frequency}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: COMMUNICATION LOG & OUTGOING CLINICIAN SIGN-OFF */}
          <section className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  4. Shift Communication Summary &amp; Outgoing Sign-Off
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {studentExchanges.length} clinical exchanges logged
              </span>
            </div>

            {clinicalSystemNotes.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-600">Key System &amp; Clinical Milestones Logged:</span>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {clinicalSystemNotes.slice(-4).map((note) => (
                    <div key={note.id} className="text-[11px] bg-white px-2.5 py-1.5 rounded border border-slate-200 text-slate-700">
                      <span className="font-mono text-slate-400 mr-2">[{note.timestamp}]</span>
                      {note.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5 text-slate-600">
                <p>
                  <strong>Outgoing Clinician:</strong> Student RN / MD (Clinical AI Simulator)
                </p>
                <p>
                  <strong>Recommended Next-Shift Focus:</strong>{' '}
                  {pendingObjectives.length > 0
                    ? pendingObjectives.map(o => o.title).join(', ')
                    : 'Continue empathetic reassurance and monitor hemodynamic stability.'}
                </p>
              </div>

              <div className="flex items-center gap-2 print:hidden shrink-0">
                {onNavigateTab && (
                  <button
                    type="button"
                    onClick={() => onNavigateTab('grading')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                  >
                    <span>Proceed to OSCE Grading</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="hidden print:block text-right text-[11px] text-slate-600 border-t border-slate-400 pt-1 min-w-[200px]">
                Outgoing Signature / Date: {nowDate} {nowTime}
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
};
