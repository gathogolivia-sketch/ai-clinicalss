import React from 'react';
import {
  Heart,
  Brain,
  Home,
  Hospital,
  ChevronRight,
  MessageSquare,
  Sparkles,
  Layers
} from 'lucide-react';
import { MultidimensionalFeelings, PatientProfile } from '../types';

interface MultidimensionalFeelingsCardProps {
  patient: PatientProfile;
  feelings?: MultidimensionalFeelings;
  onSelectDimension: (mode: 'physical' | 'emotional' | 'social' | 'reassurance', suggestedText: string) => void;
  isLoading: boolean;
}

export const MultidimensionalFeelingsCard: React.FC<MultidimensionalFeelingsCardProps> = ({
  patient,
  feelings,
  onSelectDimension,
  isLoading,
}) => {
  const physicalText = feelings?.physical ||
    `Experiencing ${patient.baselineState.pain}/10 discomfort. Breathing slightly rapid, hands clutched tight.`;
  const emotionalText = feelings?.emotional ||
    `Feeling guarded and anxious. Struggling with the fear of vulnerability and uncertainty.`;
  const socialText = feelings?.social ||
    `Thinking about loved ones and the dread of being a burden or falling behind at home.`;
  const careText = feelings?.existentialOrCare ||
    `Wonders if the clinical team is listening to them or merely managing lab values.`;

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              How {patient.name.split(' ')[0]} Feels Right Now (4 Dimensions)
            </h2>
            <p className="text-[11px] text-slate-500">
              Patients feel on multiple levels simultaneously. Click any dimension to discuss it.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
          <Sparkles className="w-3 h-3 text-sky-500" /> Live Perspective
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Dimension 1: Physical / Somatic */}
        <div className="bg-sky-50/30 hover:bg-sky-50/70 border border-sky-100 hover:border-rose-300 rounded-xl p-3.5 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-xs font-bold text-rose-700">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                1. Physical &amp; Somatic Sensation
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Body</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {physicalText}
            </p>
          </div>
          <button
            onClick={() => onSelectDimension('physical', `“Could you describe what your body and chest are experiencing in this exact moment?”`)}
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 transition disabled:opacity-50 shadow-2xs"
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-rose-500" /> Discuss Physical Feeling
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-rose-500 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Dimension 2: Emotional & Psychological */}
        <div className="bg-sky-50/30 hover:bg-sky-50/70 border border-sky-100 hover:border-amber-300 rounded-xl p-3.5 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Brain className="w-3.5 h-3.5 text-amber-600" />
                2. Emotional &amp; Mental Burden
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Psych</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {emotionalText}
            </p>
          </div>
          <button
            onClick={() => onSelectDimension('emotional', `“Beyond the physical symptoms, what is the hardest emotion you are dealing with today?”`)}
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 transition disabled:opacity-50 shadow-2xs"
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-amber-600" /> Discuss Emotional Struggle
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Dimension 3: Social & Family Burden */}
        <div className="bg-sky-50/30 hover:bg-sky-50/70 border border-sky-100 hover:border-sky-300 rounded-xl p-3.5 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-xs font-bold text-sky-800">
                <Home className="w-3.5 h-3.5 text-sky-600" />
                3. Social, Family &amp; Role Burden
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Life</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {socialText}
            </p>
          </div>
          <button
            onClick={() => onSelectDimension('social', `“How is this illness affecting your daily life, your family, or how you feel about heading home?”`)}
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 text-sky-800 border border-sky-200 transition disabled:opacity-50 shadow-2xs"
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-sky-600" /> Discuss Social / Family Impact
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* Dimension 4: Care Experience & Trust in System */}
        <div className="bg-sky-50/30 hover:bg-sky-50/70 border border-sky-100 hover:border-blue-300 rounded-xl p-3.5 transition group flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-xs font-bold text-blue-800">
                <Hospital className="w-3.5 h-3.5 text-blue-600" />
                4. Healthcare Experience &amp; Control
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Care</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {careText}
            </p>
          </div>
          <button
            onClick={() => onSelectDimension('reassurance', `“How are you feeling about the care you are receiving here, and do you feel your voice is being heard?”`)}
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 transition disabled:opacity-50 shadow-2xs"
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-blue-600" /> Discuss Care Experience
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
