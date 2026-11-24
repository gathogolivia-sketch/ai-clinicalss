import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  PlusCircle,
  FileText,
  Droplet,
  HeartPulse,
  Flame,
  ShieldAlert,
  Info
} from 'lucide-react';
import { LabTest, PatientProfile } from '../types';

interface LabsDashboardProps {
  patient: PatientProfile;
  labs: LabTest[];
  onOrderLab: (testId: string) => void;
  onOrderStatDraw: (testName: string, category: LabTest['category'], customValue?: string) => void;
}

export const LabsDashboard: React.FC<LabsDashboardProps> = ({
  patient,
  labs,
  onOrderLab,
  onOrderStatDraw,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isOrderingModalOpen, setIsOrderingModalOpen] = useState(false);
  const [customTestName, setCustomTestName] = useState('');
  const [customCategory, setCustomCategory] = useState<LabTest['category']>('Hematology');
  const [isOrderingInProgress, setIsOrderingInProgress] = useState(false);

  // Find the primary haemoglobin test for patient
  const hbTest = labs.find(l => l.id === 'hb' || l.name.toLowerCase().includes('haemoglobin') || l.name.toLowerCase().includes('hemoglobin'));

  const categories = ['All', 'Hematology', 'Chemistry', 'Cardiac', 'Inflammatory', 'Coagulation'];

  const filteredLabs = labs.filter((test) => {
    const matchesCat = selectedCategory === 'All' || test.category === selectedCategory;
    const matchesQuery =
      test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.interpretation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getFlagBadge = (flag: LabTest['flag']) => {
    switch (flag) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            CRITICAL
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            LOW
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            HIGH
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            NORMAL
          </span>
        );
    }
  };

  const handleCreateCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTestName.trim()) return;

    setIsOrderingInProgress(true);
    setTimeout(() => {
      onOrderStatDraw(customTestName.trim(), customCategory);
      setCustomTestName('');
      setIsOrderingInProgress(false);
      setIsOrderingModalOpen(false);
    }, 700);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Haemoglobin & CBC Spotlight */}
      {hbTest && (
        <div className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm ${
          hbTest.flag === 'low'
            ? 'bg-gradient-to-r from-amber-50/90 to-rose-50/90 border-amber-300'
            : hbTest.flag === 'critical'
            ? 'bg-rose-50 border-rose-300'
            : 'bg-gradient-to-r from-sky-50 to-blue-50 border-sky-200'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                hbTest.flag === 'low'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-sky-100 text-sky-800 border border-sky-200'
              }`}>
                <Droplet className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Spotlight Diagnostic Marker
                  </span>
                  {getFlagBadge(hbTest.flag)}
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  Haemoglobin (Hb) Diagnostic Status: {hbTest.value} {hbTest.unit}
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl">
                  {hbTest.interpretation}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end justify-center shrink-0 bg-white/80 p-3 rounded-xl border border-sky-200">
              <span className="text-xs text-slate-500">Normal Reference Range</span>
              <strong className="text-sm font-bold text-slate-800">{hbTest.referenceRange}</strong>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Last Drawn: {hbTest.orderedAt || 'Recent'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Laboratory Control Bar */}
      <div className="bg-white border border-sky-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50/70 text-slate-600 hover:text-sky-700 hover:bg-sky-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search and Order STAT Draw */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs (e.g. haemoglobin, troponin)..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-sky-400"
            />
          </div>

          <button
            onClick={() => setIsOrderingModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Order STAT Lab</span>
          </button>
        </div>
      </div>

      {/* Lab Results Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredLabs.map((test) => (
          <div
            key={test.id}
            className={`p-4 rounded-xl border transition-all ${
              test.ordered
                ? test.flag === 'critical'
                  ? 'bg-rose-50/50 border-rose-300 shadow-xs'
                  : test.flag === 'low' || test.flag === 'high'
                  ? 'bg-amber-50/40 border-amber-200 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs'
                : 'bg-slate-50/60 border-dashed border-slate-300 opacity-80'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {test.category}
                  </span>
                  {test.ordered ? getFlagBadge(test.flag) : (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Available to Order
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base mt-1 flex items-center gap-1.5">
                  {test.name.toLowerCase().includes('haemoglobin') && (
                    <Droplet className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  {test.name}
                </h3>
              </div>

              {/* Value display */}
              <div className="text-right">
                {test.ordered ? (
                  <div>
                    <span className={`text-lg sm:text-xl font-extrabold ${
                      test.flag === 'critical'
                        ? 'text-rose-700'
                        : test.flag === 'low' || test.flag === 'high'
                        ? 'text-amber-800'
                        : 'text-slate-900'
                    }`}>
                      {test.value}
                    </span>
                    <span className="text-xs text-slate-500 ml-1">{test.unit}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => onOrderLab(test.id)}
                    className="px-2.5 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-semibold transition border border-sky-200"
                  >
                    Order Now
                  </button>
                )}
              </div>
            </div>

            {/* Reference Range & Details */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Reference Range: <strong className="text-slate-700">{test.referenceRange}</strong></span>
              {test.ordered && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {test.orderedAt || 'Reported'}
                </span>
              )}
            </div>

            {/* Interpretation */}
            {test.ordered && test.interpretation && (
              <div className="mt-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-100 italic">
                <span className="font-semibold not-italic text-slate-800">Clinical Interpretation: </span>
                {test.interpretation}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredLabs.length === 0 && (
        <div className="p-8 text-center bg-white rounded-xl border border-sky-100 text-slate-500">
          No laboratory results match &ldquo;{searchQuery}&rdquo;.
        </div>
      )}

      {/* STAT Order Modal */}
      {isOrderingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-sky-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">Order STAT Diagnostic Lab</h3>
              </div>
              <button
                onClick={() => setIsOrderingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Test Name / Panel
                </label>
                <input
                  type="text"
                  required
                  value={customTestName}
                  onChange={(e) => setCustomTestName(e.target.value)}
                  placeholder="e.g. Repeat Haemoglobin, Ferritin, Blood Gas..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Laboratory Discipline
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                >
                  <option value="Hematology">Hematology (CBC, Haemoglobin, Platelets)</option>
                  <option value="Chemistry">Chemistry (Metabolic Panel, Electrolytes, Renal)</option>
                  <option value="Cardiac">Cardiac Biomarkers (Troponin, BNP)</option>
                  <option value="Inflammatory">Inflammatory &amp; Autoimmune (ESR, CRP, ANA)</option>
                  <option value="Coagulation">Coagulation (PT/INR, aPTT, D-Dimer)</option>
                </select>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg text-xs text-sky-800">
                <Info className="w-4 h-4 inline-block mr-1 text-sky-600" />
                STAT draws simulate acute phlebotomy processing and deliver rapid point-of-care verification directly to the chart.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrderingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isOrderingInProgress}
                  className="px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {isOrderingInProgress ? 'Drawing & Analyzing...' : 'Transmit STAT Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
