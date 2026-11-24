import React, { useState } from 'react';
import {
  ShieldCheck,
  Activity,
  Heart,
  Eye,
  Smile,
  AlertCircle,
  Sparkles,
  Check,
  HeartHandshake,
  MessageSquareQuote
} from 'lucide-react';
import { PatientEmotionalState, PatientProfile } from '../types';

interface EmotionalVitalsHUDProps {
  patient: PatientProfile;
  currentState: PatientEmotionalState;
  previousState?: PatientEmotionalState;
  immediateFeeling?: string;
  nonVerbalCues?: string[];
  lastImpactExplanation?: string;
  onInjectEmpathyPhrase?: (phrase: string) => void;
}

export const EmotionalVitalsHUD: React.FC<EmotionalVitalsHUDProps> = ({
  patient,
  currentState,
  previousState,
  immediateFeeling,
  nonVerbalCues,
  lastImpactExplanation,
  onInjectEmpathyPhrase,
}) => {
  const [lastInjected, setLastInjected] = useState<string | null>(null);

  const trustDelta = previousState ? currentState.trust - previousState.trust : 0;
  const anxietyDelta = previousState ? currentState.anxiety - previousState.anxiety : 0;

  // Determine emotional color scheme on white/light blue
  const getAnxietyColor = (val: number) => {
    if (val > 70) return 'text-rose-600 bg-rose-50/80 border-rose-200';
    if (val > 40) return 'text-amber-700 bg-amber-50/80 border-amber-200';
    return 'text-sky-700 bg-sky-50/80 border-sky-200';
  };

  const getTrustColor = (val: number) => {
    if (val >= 65) return 'text-blue-700 bg-blue-50/80 border-blue-200';
    if (val >= 40) return 'text-sky-700 bg-sky-50/80 border-sky-200';
    return 'text-amber-700 bg-amber-50/80 border-amber-200';
  };

  const getPainColor = (val: number) => {
    if (val >= 7) return 'text-rose-600 bg-rose-50/80 border-rose-200';
    if (val >= 4) return 'text-amber-700 bg-amber-50/80 border-amber-200';
    return 'text-sky-700 bg-sky-50/80 border-sky-200';
  };

  // One-Click Empathy Shortcuts
  const empathyShortcuts = [
    { label: '“I hear you”', text: '“I hear you, and what you’re telling me matters deeply.”' },
    { label: '“That sounds incredibly difficult”', text: '“That sounds incredibly difficult to be carrying right now.”' },
    { label: '“Take your time, I am with you”', text: '“Take all the time you need. I am right here with you.”' },
    { label: '“I can understand why you feel anxious”', text: '“I can completely understand why you would feel so anxious in this situation.”' },
    { label: '“Your feelings make complete sense”', text: '“Given everything your body has been through, your feelings make complete sense.”' },
    { label: '“You don’t have to carry this alone”', text: '“We are a team here. You don’t have to carry this fear all by yourself.”' },
    { label: '“What feels heaviest right now?”', text: '“What feels like the heaviest or most frightening part for you right now?”' },
    { label: '“I notice you look tense”', text: '“I notice you look a bit tense holding your breath. Let’s pause together for a moment.”' },
  ];

  const handleShortcutClick = (text: string) => {
    if (onInjectEmpathyPhrase) {
      onInjectEmpathyPhrase(text);
      setLastInjected(text);
      setTimeout(() => setLastInjected(null), 3000);
    }
  };

  return (
    <div className="bg-sky-50/40 border-b border-sky-100 p-4 sm:p-5">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* Top row: Patient Card & Current Feeling Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-sky-100">
          {/* Patient Quick Identity */}
          <div className="flex items-start gap-3.5">
            <div className="relative">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-sky-100 to-blue-200 border-2 border-white shadow-sm flex items-center justify-center text-xl font-bold text-sky-800">
                {patient.name.charAt(0)}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" title="Simulated Live Bedside" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-bold text-slate-900 text-base sm:text-lg">
                  {patient.name}
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 font-medium">
                  {patient.age} yrs • {patient.gender}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white text-slate-600 border border-slate-200">
                  {patient.occupation}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 font-semibold">
                  {patient.clinicalSetting}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                <strong className="text-slate-800">Complaint:</strong> {patient.chiefComplaint}
              </p>
            </div>
          </div>

          {/* Current Immediate Feeling Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 bg-white border border-sky-200 rounded-xl p-3 lg:max-w-md shadow-xs">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700">
                Felt at this Moment
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-sky-900">
                {immediateFeeling || patient.demeanor}
              </div>
              {lastImpactExplanation && (
                <div className="text-[11px] text-slate-600 mt-0.5 italic line-clamp-2">
                  &ldquo;{lastImpactExplanation}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle row: Emotional & Physiological Meters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Trust & Rapport */}
          <div className={`p-2.5 rounded-xl border bg-white shadow-xs ${getTrustColor(currentState.trust)} transition-all`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Trust
              </span>
              <span className="text-xs font-bold">
                {currentState.trust}%
                {trustDelta !== 0 && (
                  <span className={`ml-1 text-[10px] ${trustDelta > 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}`}>
                    {trustDelta > 0 ? `+${trustDelta}` : trustDelta}
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, currentState.trust))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentState.trust >= 65 ? 'Ready to share fears' : currentState.trust >= 40 ? 'Cautious & listening' : 'Guarded & defensive'}
            </p>
          </div>

          {/* Anxiety Level */}
          <div className={`p-2.5 rounded-xl border bg-white shadow-xs ${getAnxietyColor(currentState.anxiety)} transition-all`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Anxiety
              </span>
              <span className="text-xs font-bold">
                {currentState.anxiety}%
                {anxietyDelta !== 0 && (
                  <span className={`ml-1 text-[10px] ${anxietyDelta < 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}`}>
                    {anxietyDelta > 0 ? `+${anxietyDelta}` : anxietyDelta}
                  </span>
                )}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  currentState.anxiety > 70 ? 'bg-rose-500' : currentState.anxiety > 40 ? 'bg-amber-500' : 'bg-sky-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, currentState.anxiety))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentState.anxiety > 75 ? 'Panicking / Racing' : currentState.anxiety > 45 ? 'Underlying distress' : 'Relatively settled'}
            </p>
          </div>

          {/* Physical Pain VAS */}
          <div className={`p-2.5 rounded-xl border bg-white shadow-xs ${getPainColor(currentState.pain)} transition-all`}>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-rose-600">
                <Heart className="w-3.5 h-3.5" />
                Pain
              </span>
              <span className="text-xs font-bold">{currentState.pain}/10</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, currentState.pain * 10))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentState.pain >= 7 ? 'Severe physical ache' : currentState.pain >= 4 ? 'Moderate discomfort' : 'Mild / tolerable'}
            </p>
          </div>

          {/* Emotional Openness */}
          <div className="p-2.5 rounded-xl border border-sky-100 bg-white text-slate-700 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-sky-700">
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                Openness
              </span>
              <span className="text-xs font-bold text-sky-700">{currentState.openness}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, currentState.openness))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentState.openness >= 60 ? 'Unfiltered honesty' : currentState.openness >= 35 ? 'Shares when invited' : 'Minimizes feelings'}
            </p>
          </div>

          {/* Comfort & Dignity */}
          <div className="p-2.5 rounded-xl border border-sky-100 bg-white text-slate-700 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-blue-700">
                <Smile className="w-3.5 h-3.5 text-blue-600" />
                Comfort
              </span>
              <span className="text-xs font-bold text-blue-700">{currentState.comfort}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, currentState.comfort))}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              {currentState.comfort >= 60 ? 'Feels respected' : currentState.comfort >= 35 ? 'Tolerating exam' : 'Vulnerable & exposed'}
            </p>
          </div>

          {/* Live Non-Verbal Somatic Signals */}
          <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/50 col-span-2 sm:col-span-1 lg:col-span-1 shadow-xs">
            <div className="text-[11px] font-bold text-amber-800 flex items-center gap-1 mb-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Observed Non-Verbal
            </div>
            <div className="text-[11px] text-amber-900 italic line-clamp-2">
              {nonVerbalCues && nonVerbalCues.length > 0
                ? nonVerbalCues.join(', ')
                : 'Eyes darting, tense posture'}
            </div>
          </div>
        </div>

        {/* ONE-CLICK EMPATHY SHORTCUTS BAR (Direct User Request) */}
        <div className="bg-white/90 border border-sky-200 rounded-xl p-2.5 sm:p-3 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-900">
              <HeartHandshake className="w-4 h-4 text-sky-600" />
              <span>One-Click Empathy Shortcuts</span>
              <span className="text-[10px] font-normal text-slate-500 ml-1">
                (Click to instantly inject validated clinical phrasing into dialogue)
              </span>
            </div>

            {lastInjected && (
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 animate-fadeIn">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Injected into input!</span>
              </div>
            )}
          </div>

          {/* Shortcut Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {empathyShortcuts.map((shortcut, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleShortcutClick(shortcut.text)}
                title={`Click to insert: ${shortcut.text}`}
                className="group inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-50/70 hover:bg-sky-600 hover:text-white text-slate-700 border border-sky-200 hover:border-sky-600 transition-all shadow-2xs hover:shadow-xs active:scale-95"
              >
                <MessageSquareQuote className="w-3 h-3 text-sky-500 group-hover:text-sky-200" />
                <span>{shortcut.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
