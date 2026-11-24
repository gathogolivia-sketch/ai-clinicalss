import React from 'react';
import {
  Stethoscope,
  CheckCircle2,
  Clock,
  Target,
  Sparkles,
  Heart,
  Shield,
  Activity,
  Bed,
  Droplet,
  Compass,
  AlertCircle
} from 'lucide-react';
import { NursingIntervention, SimulationObjective, PatientProfile, PatientEmotionalState } from '../types';

interface NursingCareViewProps {
  patient: PatientProfile;
  interventions: NursingIntervention[];
  objectives: SimulationObjective[];
  currentState: PatientEmotionalState;
  onPerformIntervention: (interventionId: string) => void;
}

export const NursingCareView: React.FC<NursingCareViewProps> = ({
  patient,
  interventions,
  objectives,
  currentState,
  onPerformIntervention,
}) => {
  const completedObjectives = objectives.filter(o => o.status === 'completed').length;
  const progressPercent = Math.round((completedObjectives / Math.max(1, objectives.length)) * 100);

  const getObjectiveCategoryBadge = (cat: SimulationObjective['category']) => {
    switch (cat) {
      case 'Communication':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Diagnostics':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Nursing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pharmacology':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'History':
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* SECTION 1: CLINICAL SIMULATION OBJECTIVES CHECKLIST */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Clinical Simulation Learning Objectives
              </h2>
              <p className="text-xs text-slate-500">
                Essential competencies across patient history, labs (haemoglobin), empathy, nursing care, and safety.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="text-right">
              <span className="text-xs text-slate-500 font-semibold block">Case Progress</span>
              <strong className="text-sm font-extrabold text-sky-800">
                {completedObjectives} of {objectives.length} Completed ({progressPercent}%)
              </strong>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-sky-100 flex items-center justify-center font-bold text-xs text-sky-800 bg-sky-50">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Objectives List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {objectives.map((obj) => {
            const isDone = obj.status === 'completed';
            const isInProgress = obj.status === 'in-progress';

            return (
              <div
                key={obj.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                    : isInProgress
                    ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getObjectiveCategoryBadge(obj.category)}`}>
                      {obj.category}
                    </span>
                    <span className={`text-[11px] font-semibold ${isDone ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isDone ? 'Goal Achieved' : 'Incomplete'}
                    </span>
                  </div>

                  <h3 className={`font-bold text-sm mt-1 ${isDone ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                    {obj.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {obj.description}
                  </p>
                  <p className="text-[11px] text-sky-800 font-medium mt-1 bg-white/70 p-1.5 rounded border border-sky-100">
                    <strong className="text-sky-950">Verification Criteria:</strong> {obj.criteria}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: BEDSIDE NURSING CARE INTERVENTIONS */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xs">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                Bedside Nursing Care Interventions
              </h2>
              <p className="text-xs text-slate-500">
                Carry out therapeutic positioning, comfort measures, phlebotomy, and fall safety.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {interventions.filter(i => i.performed).length} of {interventions.length} Executed
          </span>
        </div>

        {/* Nursing Interventions Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {interventions.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                item.performed
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-sky-300 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.category}
                  </span>
                  {item.performed && (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Executed {item.performedAt || 'Today'}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  {item.description}
                </p>

                <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                  <strong>Clinical Impact:</strong> {item.impactSummary}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                {item.performed ? (
                  <button
                    disabled
                    className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1 cursor-default"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed &amp; Charted</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPerformIntervention(item.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-xs"
                  >
                    Execute Intervention
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
