import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Award,
  CheckCircle,
  Lightbulb,
  Heart,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { DebriefResult, PatientProfile, PatientEmotionalState, ChatMessage } from '../types';

interface DebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  history: ChatMessage[];
  finalState: PatientEmotionalState;
  onRestart: () => void;
}

export const DebriefModal: React.FC<DebriefModalProps> = ({
  isOpen,
  onClose,
  patient,
  history,
  finalState,
  onRestart,
}) => {
  const [loading, setLoading] = useState(false);
  const [debrief, setDebrief] = useState<DebriefResult | null>(null);

  if (!isOpen) return null;

  const handleGenerateDebrief = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/debrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          history,
          finalState,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setDebrief(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on open if not loaded
  if (!debrief && !loading) {
    handleGenerateDebrief();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white border border-sky-200 rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
              <FileCheck2 className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                OSCE Clinical Communication Debrief
              </h2>
              <p className="text-xs text-slate-500">
                Evaluation of bedside empathy, emotional inquiry, and Calgary-Cambridge framework benchmarks.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-sky-50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold animate-pulse shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-500" /> Analyzing consultation transcript and emotional trajectory...
            </div>
          </div>
        ) : debrief ? (
          <div className="space-y-6 pt-4">
            {/* Top score & summary card */}
            <div className="bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                  Overall Bedside Performance
                </span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {debrief.overallGrade}
                </div>
                <p className="text-xs text-slate-600 mt-2 max-w-lg leading-relaxed">
                  {debrief.summary}
                </p>
              </div>

              <div className="w-24 h-24 rounded-full border-4 border-sky-400 bg-white flex flex-col items-center justify-center shrink-0 shadow-md">
                <span className="text-2xl font-black text-sky-700">{debrief.overallScore}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">out of 100</span>
              </div>
            </div>

            {/* Calgary-Cambridge 5 Domains */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" />
                Calgary-Cambridge Consultation Framework Scores
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(debrief.calgaryCambridgeScores).map(([key, score]) => {
                  const formatKey = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase());
                  return (
                    <div key={key} className="p-3 rounded-xl bg-sky-50/50 border border-sky-100 shadow-2xs">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                        <span>{formatKey}</span>
                        <span className="text-sky-700 font-bold">{score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-sky-600 h-1.5 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths & Improvement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 shadow-2xs">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Identified Strengths
                </h4>
                <ul className="space-y-2">
                  {debrief.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Opportunities */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-2xs">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  Areas to Deepen Feeling Inquiry
                </h4>
                <ul className="space-y-2">
                  {debrief.areasForImprovement.map((imp, idx) => (
                    <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Patient Final Word */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1 mb-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                {patient.name}&apos;s Final Impression of this Encounter:
              </span>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                {debrief.patientFinalImpression}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  onRestart();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart Consultation
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition shadow-xs"
              >
                Done Reviewing
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
