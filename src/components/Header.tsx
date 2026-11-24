import React from 'react';
import {
  HeartPulse,
  Users,
  GitCompare,
  FileCheck2,
  RotateCcw,
  PlusCircle,
  Sparkles,
  Home,
  Siren
} from 'lucide-react';
import { PatientProfile, HospitalEmergencyCode } from '../types';

interface HeaderProps {
  patients: PatientProfile[];
  currentPatient: PatientProfile;
  onSelectPatient: (patient: PatientProfile) => void;
  onOpenCustomModal: () => void;
  onOpenCompareModal: () => void;
  onOpenDebriefModal: () => void;
  onResetSession: () => void;
  onNavigateHome?: () => void;
  onOpenEmergencyCodes?: () => void;
  turnCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  patients,
  currentPatient,
  onSelectPatient,
  onOpenCustomModal,
  onOpenCompareModal,
  onOpenDebriefModal,
  onResetSession,
  onNavigateHome,
  onOpenEmergencyCodes,
  turnCount,
}) => {
  const getDifficultyBadge = (diff?: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Difficult':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Intermediate':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Info */}
          <div className="flex items-center gap-3">
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
                title="Return to Landing Page & Study Guide"
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-700 transition flex items-center gap-1 border border-slate-200"
              >
                <Home className="w-4 h-4" />
                <span className="text-xs font-bold hidden sm:inline">Home</span>
              </button>
            )}

            <div className="relative cursor-pointer flex items-center gap-2.5" onClick={onNavigateHome}>
              <img
                src="/assets/aistudio/ai_clinical_simulator_66b1e337.jpeg"
                alt="AI Clinical Simulation Assistant"
                className="h-11 sm:h-12 w-auto object-contain"
              />
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 hidden xl:flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Bedside Simulation
              </span>
            </div>
          </div>

          {/* Patient Selector & Global Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Patient dropdown */}
            <div className="relative flex items-center">
              <label htmlFor="patient-select" className="sr-only">Select Patient</label>
              <div className="flex items-center bg-sky-50/70 hover:bg-sky-100/60 border border-sky-200 rounded-lg px-2.5 py-1.5 transition">
                <Users className="w-4 h-4 text-sky-600 mr-2 shrink-0" />
                <select
                  id="patient-select"
                  value={currentPatient.id}
                  onChange={(e) => {
                    const found = patients.find(p => p.id === e.target.value);
                    if (found) onSelectPatient(found);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-slate-800">
                      [{p.difficulty || 'Med'}] {p.name} ({p.age}y, {p.clinicalSetting})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Current Difficulty Tag */}
            <span className={`hidden md:inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getDifficultyBadge(currentPatient.difficulty)}`}>
              {currentPatient.difficulty || 'Intermediate'}
            </span>

            {/* Hospital Emergency Codes Trigger */}
            {onOpenEmergencyCodes && (
              <button
                onClick={onOpenEmergencyCodes}
                title="View & Trigger Hospital Emergency Codes (Red, Blue, STEMI)"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition shadow-2xs"
              >
                <Siren className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span className="hidden lg:inline">Emergency Codes</span>
              </button>
            )}

            {/* Custom patient button */}
            <button
              onClick={onOpenCustomModal}
              title="Create Custom Patient Case"
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-sky-50 text-slate-700 border border-slate-200 hover:border-sky-300 transition shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-sky-600" />
              <span>New Case</span>
            </button>

            {/* Compare approaches button */}
            <button
              onClick={onOpenCompareModal}
              title="Compare How 3 Different Question Styles Shift Patient Feelings"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition shadow-xs"
            >
              <GitCompare className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden sm:inline">Compare 3 Phrasings</span>
              <span className="sm:hidden">Phrasings</span>
            </button>

            {/* Debrief / OSCE Report */}
            <button
              onClick={onOpenDebriefModal}
              title="Generate Consultation Debrief and Calgary-Cambridge OSCE Evaluation"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition shadow-sm"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">OSCE Debrief</span>
              <span className="sm:hidden">Debrief</span>
              {turnCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-sky-800 text-[10px] flex items-center justify-center font-bold">
                  {turnCount}
                </span>
              )}
            </button>

            {/* Reset button */}
            <button
              onClick={onResetSession}
              title="Restart Consultation"
              className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-sky-300 transition shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
