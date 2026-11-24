import React, { useState } from 'react';
import {
  AlertOctagon,
  X,
  Flame,
  HeartCrack,
  Activity,
  Biohazard,
  ShieldAlert,
  Baby,
  AlertTriangle,
  Siren,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { HOSPITAL_EMERGENCY_CODES } from '../data/emergencyCodes';
import { HospitalEmergencyCode } from '../types';

interface HospitalEmergencyCodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerCode?: (code: HospitalEmergencyCode) => void;
}

export const HospitalEmergencyCodesModal: React.FC<HospitalEmergencyCodesModalProps> = ({
  isOpen,
  onClose,
  onTriggerCode,
}) => {
  const [selectedCode, setSelectedCode] = useState<HospitalEmergencyCode>(HOSPITAL_EMERGENCY_CODES[0]);
  const [activatedCode, setActivatedCode] = useState<HospitalEmergencyCode | null>(null);

  if (!isOpen) return null;

  const handleActivate = (code: HospitalEmergencyCode) => {
    setActivatedCode(code);
    if (onTriggerCode) {
      onTriggerCode(code);
    }
  };

  const getCodeIcon = (codeName: string) => {
    switch (codeName) {
      case 'CODE BLUE':
        return <HeartCrack className="w-5 h-5 text-blue-400" />;
      case 'CODE RED':
        return <Flame className="w-5 h-5 text-rose-500 animate-pulse" />;
      case 'CODE STEMI':
        return <Activity className="w-5 h-5 text-orange-400" />;
      case 'CODE SEPSIS':
        return <Biohazard className="w-5 h-5 text-purple-400" />;
      case 'CODE BLACK':
        return <ShieldAlert className="w-5 h-5 text-slate-300" />;
      case 'CODE PINK':
        return <Baby className="w-5 h-5 text-pink-400" />;
      case 'CODE YELLOW':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'CODE ORANGE':
      default:
        return <AlertOctagon className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border-2 border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 max-h-[92vh] overflow-y-auto text-slate-100 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400 shadow-sm animate-pulse">
              <Siren className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-wider text-white">
                  Hospital Emergency Codes Station
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700 uppercase">
                  Rapid Response Alert
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Standard international hospital emergency codes with immediate clinical action protocols and resuscitation pathways.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Emergency Broadcast Alert Banner if activated */}
        {activatedCode && (
          <div className="mt-4 p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 animate-pulse flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-rose-200">
            <div className="flex items-center gap-3">
              <Siren className="w-6 h-6 text-rose-400 animate-bounce" />
              <div>
                <strong className="text-sm font-bold tracking-wider uppercase text-white block">
                  BROADCAST ACTIVE: {activatedCode.code} - {activatedCode.name}
                </strong>
                <span className="text-xs text-rose-300 font-sans">
                  Rapid Response Team and resuscitation paging dispatched to bedside. Action protocol active.
                </span>
              </div>
            </div>

            <button
              onClick={() => setActivatedCode(null)}
              className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-sans font-semibold border border-rose-600 transition shrink-0"
            >
              Stand Down / Code Clear
            </button>
          </div>
        )}

        {/* Split Grid: Codes Selector & Protocol Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
          {/* Left: Code Buttons List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">
              Select Emergency Code
            </span>

            {HOSPITAL_EMERGENCY_CODES.map((item) => {
              const isSelected = selectedCode.code === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setSelectedCode(item)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 border-sky-400 shadow-md ring-1 ring-sky-500/30'
                      : 'bg-slate-900/40 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center border border-slate-800 shrink-0">
                      {getCodeIcon(item.code)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className={`text-xs font-extrabold tracking-wider ${item.textClass}`}>
                          {item.code}
                        </strong>
                      </div>
                      <span className="text-[11px] text-slate-300 font-sans line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    item.urgency === 'critical' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.urgency}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Protocol Card (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-700">
                    {getCodeIcon(selectedCode.code)}
                  </div>
                  <div>
                    <h3 className={`text-lg font-extrabold tracking-wider ${selectedCode.textClass}`}>
                      {selectedCode.code}
                    </h3>
                    <p className="text-xs text-slate-200 font-sans font-semibold">
                      {selectedCode.name}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleActivate(selectedCode)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-sans font-bold text-xs rounded-xl shadow-lg shadow-rose-600/30 transition flex items-center gap-1.5 active:scale-95"
                >
                  <Siren className="w-4 h-4 animate-pulse" />
                  <span>TRIGGER {selectedCode.code}</span>
                </button>
              </div>

              {/* Description */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 font-sans leading-relaxed">
                <strong className="text-white block font-mono text-[11px] uppercase tracking-wider mb-1">
                  Clinical Trigger &amp; Definition:
                </strong>
                {selectedCode.description}
              </div>

              {/* Clinical Protocol Steps */}
              <div>
                <strong className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Action Protocol Checklist:
                </strong>
                <ul className="space-y-2 text-xs font-sans text-slate-300">
                  {selectedCode.clinicalActionProtocol.map((step, idx) => (
                    <li key={idx} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start gap-2">
                      <span className="text-sky-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-sans">
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                Hospital Emergency Switchboard: Dial <strong>2222</strong>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close Station
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
