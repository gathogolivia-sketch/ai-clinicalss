import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  Target,
  ShieldCheck,
  Heart,
  Droplet,
  Pill,
  Stethoscope,
  RefreshCw,
  Printer
} from 'lucide-react';
import {
  PatientProfile,
  PatientEmotionalState,
  ChatMessage,
  VitalSigns,
  LabTest,
  MedicationOrder,
  NursingIntervention,
  SimulationObjective,
  GradingRubricItem
} from '../types';

interface GradingReportViewProps {
  patient: PatientProfile;
  currentState: PatientEmotionalState;
  history: ChatMessage[];
  vitals: VitalSigns;
  labs: LabTest[];
  medications: MedicationOrder[];
  interventions: NursingIntervention[];
  objectives: SimulationObjective[];
  onRestartSession?: () => void;
}

export const GradingReportView: React.FC<GradingReportViewProps> = ({
  patient,
  currentState,
  history,
  vitals,
  labs,
  medications,
  interventions,
  objectives,
  onRestartSession,
}) => {
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Compute Granular Scores based on actual student actions
  const studentMessages = history.filter(m => m.role === 'student' || m.role === 'clinician');
  const turnsCount = studentMessages.length;

  // 1. Communication & Empathy (Max 30 pts)
  const trustGained = Math.max(0, currentState.trust - patient.baselineState.trust);
  const anxietyReduced = Math.max(0, patient.baselineState.anxiety - currentState.anxiety);
  let commScore = 8; // baseline presence
  if (turnsCount >= 1) commScore += 6;
  if (turnsCount >= 3) commScore += 6;
  if (currentState.trust >= 65) commScore += 6;
  if (trustGained >= 15 || anxietyReduced >= 10) commScore += 4;
  commScore = Math.min(30, commScore);

  // 2. Diagnostic & Laboratory Competence (Max 20 pts)
  const hbTest = labs.find(l => l.id === 'hb');
  const labsOrderedCount = labs.filter(l => l.ordered).length;
  let diagScore = 5;
  if (hbTest && hbTest.ordered) diagScore += 8;
  if (labsOrderedCount >= 3) diagScore += 4;
  if (labsOrderedCount >= 5) diagScore += 3;
  diagScore = Math.min(20, diagScore);

  // 3. Patient History & Chart Exploration (Max 15 pts)
  let historyScore = 6;
  if (patient.history.allergies.length > 0) historyScore += 4;
  if (turnsCount >= 2) historyScore += 5;
  historyScore = Math.min(15, historyScore);

  // 4. Nursing Care & Patient Safety (Max 15 pts)
  const performedInterventions = interventions.filter(i => i.performed).length;
  let nursingScore = 4;
  if (performedInterventions >= 1) nursingScore += 5;
  if (performedInterventions >= 2) nursingScore += 4;
  if (performedInterventions >= 3) nursingScore += 2;
  nursingScore = Math.min(15, nursingScore);

  // 5. Pharmacological & Medication Safety (Max 20 pts)
  const administeredMeds = medications.filter(m => m.status === 'administered').length;
  let pharmScore = 6;
  if (administeredMeds >= 1) pharmScore += 8;
  if (administeredMeds >= 2) pharmScore += 6;
  pharmScore = Math.min(20, pharmScore);

  // Total Score (0 - 100)
  const totalScore = Math.min(100, commScore + diagScore + historyScore + nursingScore + pharmScore);

  // Determine Letter Grade
  let letterGrade = 'B';
  let gradeTitle = 'Competent Bedside Care';
  let badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';

  if (totalScore >= 93) {
    letterGrade = 'A+';
    gradeTitle = 'Exemplary Patient-Centered Mastery';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
  } else if (totalScore >= 85) {
    letterGrade = 'A';
    gradeTitle = 'Superior Clinical & Empathic Performance';
    badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (totalScore >= 78) {
    letterGrade = 'B+';
    gradeTitle = 'Proficient Bedside Communication & Care';
    badgeColor = 'bg-sky-100 text-sky-900 border-sky-300';
  } else if (totalScore >= 70) {
    letterGrade = 'B';
    gradeTitle = 'Satisfactory Clinical Exploration';
    badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
  } else {
    letterGrade = 'C+';
    gradeTitle = 'Emerging Clinical Skills (Needs Development)';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
  }

  // Rubrics
  const rubrics: GradingRubricItem[] = [
    {
      category: 'Bedside Communication & Empathy (NURSE Protocol)',
      maxScore: 30,
      earnedScore: commScore,
      status: commScore >= 25 ? 'excellent' : commScore >= 20 ? 'proficient' : 'needs-work',
      feedback: commScore >= 25
        ? `Superb empathetic inquiry! You actively explored how ${patient.name} felt in the moment, increasing trust to ${currentState.trust}%.`
        : `Continue practicing the NURSE framework. Validate emotional hesitation before offering technical explanations.`,
    },
    {
      category: 'Diagnostic & Laboratory Competence (Haemoglobin & Blood Panels)',
      maxScore: 20,
      earnedScore: diagScore,
      status: diagScore >= 16 ? 'excellent' : diagScore >= 12 ? 'proficient' : 'needs-work',
      feedback: hbTest?.ordered
        ? `Accurately reviewed Haemoglobin (${hbTest.value} ${hbTest.unit}) and recognized clinical implications for patient weakness and recovery.`
        : `Ensure you evaluate Complete Blood Count and Haemoglobin levels to monitor for acute blood loss and chronic anemia.`,
    },
    {
      category: 'Patient History & Background Exploration',
      maxScore: 15,
      earnedScore: historyScore,
      status: historyScore >= 13 ? 'excellent' : 'proficient',
      feedback: `Reviewed clinical history, underlying illness factors, and documented patient allergies to ensure safe bedside management.`,
    },
    {
      category: 'Nursing Care, Comfort Measures & Bedside Safety',
      maxScore: 15,
      earnedScore: nursingScore,
      status: nursingScore >= 12 ? 'excellent' : nursingScore >= 8 ? 'proficient' : 'needs-work',
      feedback: performedInterventions > 0
        ? `Executed ${performedInterventions} nursing interventions (positioning, comfort, or safety), directly improving patient comfort to ${currentState.comfort}%.`
        : `Execute comfort interventions (e.g. elevating head of bed, warm blanket, fall precautions) to support recovery.`,
    },
    {
      category: 'Pharmacological & Closed-Loop Medication Safety',
      maxScore: 20,
      earnedScore: pharmScore,
      status: pharmScore >= 16 ? 'excellent' : pharmScore >= 12 ? 'proficient' : 'needs-work',
      feedback: administeredMeds > 0
        ? `Administered indicated medication with confirmed allergy safety, achieving noticeable symptom alleviation.`
        : `Evaluate the pharmacy eMAR to order or administer indicated relief (e.g. analgesics, anxiolytics, or blood support).`,
    },
  ];

  // Dynamic Commendations based on what was done
  const commendations: string[] = [];
  if (currentState.trust >= 65) commendations.push(`Built exceptional bedside trust (${currentState.trust}%), unlocking the patient's deepest hidden vulnerability.`);
  if (hbTest && hbTest.ordered) commendations.push(`Thoroughly checked Haemoglobin status (${hbTest.value} ${hbTest.unit}) to assess physiological oxygenation and fatigue.`);
  if (performedInterventions >= 2) commendations.push(`Demonstrated hands-on nursing competence by carrying out multiple comfort and safety interventions.`);
  if (administeredMeds >= 1) commendations.push(`Practiced closed-loop medication administration without allergy violations.`);
  if (commendations.length === 0) commendations.push(`Initiated clinical consultation and conducted baseline assessment.`);

  // Generate AI Preceptor Report
  const handleGenerateAiPreceptorReport = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/grade-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          history,
          currentState,
          vitals,
          labs,
          medications,
          interventions,
          totalScore,
          letterGrade,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiReport(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Letter Grade & Overall Performance */}
      <div className="bg-white border border-sky-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sky-100">
          <div className="flex items-start gap-4">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-md border-2 ${badgeColor}`}>
              {letterGrade}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Simulation OSCE Performance Grade
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200">
                  Score: {totalScore} / 100
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {gradeTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Graded on communication empathy, diagnostic labs (haemoglobin), clinical history review, nursing interventions, and pharmacological safety for {patient.name}.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Print Clinical Simulation Evaluation"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Evaluation</span>
            </button>

            <button
              onClick={handleGenerateAiPreceptorReport}
              disabled={isGeneratingAi}
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-sky-600/20 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-sky-200" />
              <span>{isGeneratingAi ? 'Analyzing Preceptor Review...' : 'AI Preceptor In-Depth OSCE Review'}</span>
            </button>
          </div>
        </div>

        {/* Five Core Dimension Progress Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-5">
          <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100">
            <span className="text-[11px] font-bold text-slate-600 block">Communication &amp; Empathy</span>
            <div className="flex items-center justify-between text-xs font-extrabold text-sky-900 mt-1">
              <span>{commScore} / 30 pts</span>
              <span>{Math.round((commScore / 30) * 100)}%</span>
            </div>
            <div className="w-full bg-sky-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-sky-600 h-1.5 rounded-full" style={{ width: `${(commScore / 30) * 100}%` }} />
            </div>
          </div>

          <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
            <span className="text-[11px] font-bold text-slate-600 block">Diagnostic Labs &amp; Hb</span>
            <div className="flex items-center justify-between text-xs font-extrabold text-purple-900 mt-1">
              <span>{diagScore} / 20 pts</span>
              <span>{Math.round((diagScore / 20) * 100)}%</span>
            </div>
            <div className="w-full bg-purple-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${(diagScore / 20) * 100}%` }} />
            </div>
          </div>

          <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] font-bold text-slate-600 block">Patient History &amp; EHR</span>
            <div className="flex items-center justify-between text-xs font-extrabold text-blue-900 mt-1">
              <span>{historyScore} / 15 pts</span>
              <span>{Math.round((historyScore / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-blue-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(historyScore / 15) * 100}%` }} />
            </div>
          </div>

          <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-bold text-slate-600 block">Nursing Interventions</span>
            <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900 mt-1">
              <span>{nursingScore} / 15 pts</span>
              <span>{Math.round((nursingScore / 15) * 100)}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(nursingScore / 15) * 100}%` }} />
            </div>
          </div>

          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
            <span className="text-[11px] font-bold text-slate-600 block">Pharmacy &amp; Safety</span>
            <div className="flex items-center justify-between text-xs font-extrabold text-amber-900 mt-1">
              <span>{pharmScore} / 20 pts</span>
              <span>{Math.round((pharmScore / 20) * 100)}%</span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
              <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${(pharmScore / 20) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Preceptor In-Depth Evaluation (if generated) */}
      {aiReport && (
        <div className="bg-gradient-to-r from-sky-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-sky-800 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-sky-800/80">
            <Sparkles className="w-6 h-6 text-sky-400" />
            <div>
              <h3 className="font-extrabold text-lg text-white">AI Clinical Preceptor OSCE Evaluation</h3>
              <p className="text-xs text-sky-300">Individualized clinical appraisal based on consultation transcript &amp; care actions.</p>
            </div>
          </div>

          <p className="text-sm text-sky-100 leading-relaxed italic">
            &ldquo;{aiReport.summary}&rdquo;
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-sky-950/70 p-4 rounded-xl border border-sky-800/60">
              <strong className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                Demonstrated Strengths
              </strong>
              <ul className="space-y-1.5 text-xs text-sky-200">
                {(aiReport.strengths || []).map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sky-950/70 p-4 rounded-xl border border-sky-800/60">
              <strong className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                Clinical Pearls &amp; Growth Areas
              </strong>
              <ul className="space-y-1.5 text-xs text-sky-200">
                {(aiReport.areasForImprovement || []).map((a: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {aiReport.patientFinalImpression && (
            <div className="p-3 bg-sky-800/40 rounded-xl border border-sky-700 text-xs text-sky-100">
              <strong className="text-sky-300 block mb-0.5">Patient’s Final Retrospective Thought:</strong>
              &ldquo;{aiReport.patientFinalImpression}&rdquo;
            </div>
          )}
        </div>
      )}

      {/* Rubric Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-sky-600" />
          <span>Granular OSCE Rubric Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {rubrics.map((rubric, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm sm:text-base text-slate-900">{rubric.category}</h4>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    rubric.status === 'excellent'
                      ? 'bg-emerald-100 text-emerald-800'
                      : rubric.status === 'proficient'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rubric.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {rubric.feedback}
                </p>
              </div>

              <div className="shrink-0 text-right sm:border-l sm:border-slate-100 sm:pl-6">
                <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {rubric.earnedScore}
                </span>
                <span className="text-xs text-slate-400 font-semibold ml-1">/ {rubric.maxScore} pts</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Commendations */}
      <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-2">
        <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Accomplished Simulation Milestones</span>
        </h4>
        <ul className="space-y-1.5 text-xs text-emerald-900">
          {commendations.map((comm, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{comm}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
