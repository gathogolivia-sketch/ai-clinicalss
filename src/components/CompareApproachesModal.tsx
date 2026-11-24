import React, { useState } from 'react';
import {
  X,
  GitCompare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Brain
} from 'lucide-react';
import { ComparisonResult, PatientProfile, PatientEmotionalState } from '../types';

interface CompareApproachesModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  currentState: PatientEmotionalState;
  onSelectApproach: (text: string) => void;
  initialTopic?: string;
}

export const CompareApproachesModal: React.FC<CompareApproachesModalProps> = ({
  isOpen,
  onClose,
  patient,
  currentState,
  onSelectApproach,
  initialTopic = "Exploring their current discomfort and fears",
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  if (!isOpen) return null;

  const handleRunComparison = async (searchTopic?: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/compare-approaches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          topic: searchTopic || topic,
          currentState,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run automatically on first open if no result yet
  if (!result && !loading) {
    handleRunComparison(topic);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-sky-200 rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
              <GitCompare className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Why Phrasing Matters: Compare 3 Questioning Styles
              </h2>
              <p className="text-xs text-slate-500">
                Witness how {patient.name} answers and feels in 3 completely different ways based on your communication style.
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

        {/* Topic Input Bar */}
        <div className="my-4 flex items-center gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter clinical topic or inquiry goal (e.g. Asking about chest pain and discharge anxiety)..."
            className="flex-1 bg-sky-50/40 border border-sky-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-sky-500 shadow-2xs"
          />
          <button
            onClick={() => handleRunComparison()}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm transition disabled:opacity-50 shrink-0 shadow-xs"
          >
            {loading ? 'Simulating...' : 'Re-Simulate'}
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-semibold animate-pulse shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-500" /> Simulating 3 patient emotional reactions in real-time...
            </div>
          </div>
        ) : result ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.approaches.map((app, index) => {
                const isRecommended = app.trustImpact > 0;
                const isNegative = app.trustImpact < -10;

                return (
                  <div
                    key={index}
                    className={`rounded-xl border p-4 flex flex-col justify-between transition shadow-xs ${
                      isRecommended
                        ? 'border-sky-300 bg-sky-50/60'
                        : isNegative
                        ? 'border-rose-200 bg-rose-50/50'
                        : 'border-amber-200 bg-amber-50/50'
                    }`}
                  >
                    <div>
                      {/* Badge & Style title */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">
                          {app.styleName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isRecommended
                              ? 'bg-sky-150 text-sky-800 border border-sky-300 bg-sky-100'
                              : isNegative
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {app.badge}
                        </span>
                      </div>

                      {/* Student question */}
                      <div className="bg-white rounded-lg p-2.5 mb-3 border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Student Phrasing:
                        </span>
                        <p className="text-xs text-slate-800 italic font-medium">
                          {app.studentSample}
                        </p>
                      </div>

                      {/* Patient Spoken Reaction */}
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                          Patient Spoken Answer:
                        </span>
                        <p className="text-xs text-slate-700 font-normal">
                          {app.patientSpokenReaction}
                        </p>
                      </div>

                      {/* Patient Inner Feeling */}
                      <div className="rounded-lg p-2.5 bg-blue-50/70 border border-blue-200 mb-3 shadow-2xs">
                        <span className="text-[10px] font-bold text-blue-800 flex items-center gap-1 mb-0.5">
                          <Brain className="w-3 h-3 text-blue-600" /> Felt Inside:
                        </span>
                        <p className="text-xs text-blue-950 italic">
                          {app.patientInnerReaction}
                        </p>
                      </div>

                      {/* Trust Shift */}
                      <div className="flex items-center gap-1.5 text-xs font-bold mb-2">
                        {app.trustImpact > 0 ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Trust Shift: +{app.trustImpact}%
                          </span>
                        ) : (
                          <span className="text-rose-700 flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5 text-rose-600" /> Trust Shift: {app.trustImpact}%
                          </span>
                        )}
                      </div>

                      {/* Educational Takeaway */}
                      <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200 pt-2 mb-3">
                        {app.keyLearningPoint}
                      </p>
                    </div>

                    {/* Adopt Phrasing Button */}
                    <button
                      onClick={() => {
                        onSelectApproach(app.studentSample.replace(/[“”"]/g, ''));
                        onClose();
                      }}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        isRecommended
                          ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>Adopt This Phrasing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
