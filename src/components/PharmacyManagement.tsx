import React, { useState } from 'react';
import {
  Pill,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  ShieldAlert,
  Search,
  Droplet,
  Sparkles,
  Heart,
  Activity,
  FileCheck2
} from 'lucide-react';
import { MedicationOrder, PatientProfile, PatientEmotionalState, VitalSigns } from '../types';

interface PharmacyManagementProps {
  patient: PatientProfile;
  medications: MedicationOrder[];
  onAdministerMedication: (medId: string) => void;
  onOrderNewMedication: (med: Partial<MedicationOrder>) => void;
  currentState: PatientEmotionalState;
  vitals: VitalSigns;
}

export const PharmacyManagement: React.FC<PharmacyManagementProps> = ({
  patient,
  medications,
  onAdministerMedication,
  onOrderNewMedication,
  currentState,
  vitals,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormularyMed, setSelectedFormularyMed] = useState<any | null>(null);
  const [allergyWarning, setAllergyWarning] = useState<string | null>(null);

  // Available hospital formulary catalog for quick orders
  const hospitalFormulary = [
    {
      name: 'Packed Red Blood Cells (PRBC Transfusion)',
      dose: '1 Unit (approx 300 mL)',
      route: 'Intravenous (IV)',
      frequency: 'STAT once PRN severe symptomatic anemia',
      indication: 'Correction of acute/subacute low haemoglobin and extreme fatigue',
      category: 'Hematology / Blood',
      allergyRisk: [],
      effectNote: 'Increases haemoglobin by ~1.0 g/dL, improves oxygen delivery, and relieves fatigue.',
      hbDelta: 1.1,
      spo2Delta: 2,
      hrDelta: -6,
      trustDelta: 10,
    },
    {
      name: 'Morphine Sulfate',
      dose: '2 - 4 mg',
      route: 'Intravenous (IV push slow)',
      frequency: 'Every 3 hrs PRN severe acute pain',
      indication: 'Severe post-operative or ischemic cardiac pain',
      category: 'Analgesic',
      allergyRisk: ['Morphine', 'Opiates', 'Codeine'],
      effectNote: 'Substantially reduces severe physical pain perception and decreases sympathetic surge.',
      painDelta: -4,
      anxietyDelta: -15,
      hrDelta: -8,
      trustDelta: 8,
    },
    {
      name: 'Lorazepam (Ativan)',
      dose: '0.5 - 1.0 mg',
      route: 'Sublingual / Oral (PO)',
      frequency: 'STAT PRN acute panic / terror',
      indication: 'Autonomic panic attack, severe dyspnea terror, anticipatory fear',
      category: 'Anxiolytic',
      allergyRisk: ['Benzodiazepines'],
      effectNote: 'Dramatically slows heart rate, relieves muscular hyperventilation, and calms panic.',
      anxietyDelta: -28,
      hrDelta: -16,
      bpSystolicDelta: -12,
      trustDelta: 12,
    },
    {
      name: 'Supplemental Oxygen (Nasal Cannula)',
      dose: '2 - 4 L/min',
      route: 'Inhalation',
      frequency: 'Continuous titration',
      indication: 'Dyspnea, low SpO2, ischemic chest tightness',
      category: 'Other',
      allergyRisk: [],
      effectNote: 'Optimizes oxygen saturation to 99-100% and decreases cardiac workload.',
      spo2Delta: 3,
      rrDelta: -4,
      anxietyDelta: -8,
    },
    {
      name: '0.9% Normal Saline IV Bolus',
      dose: '500 mL IV bolus over 1 hr',
      route: 'Intravenous (IV)',
      frequency: 'STAT once PRN volume deficit / orthostasis',
      indication: 'Hydration and intravascular volume resuscitation',
      category: 'Fluids',
      allergyRisk: [],
      effectNote: 'Restores blood pressure and improves organ perfusion.',
      bpSystolicDelta: 10,
      hrDelta: -6,
      trustDelta: 5,
    },
    {
      name: 'Acetaminophen (Tylenol)',
      dose: '650 mg',
      route: 'Oral (PO)',
      frequency: 'Every 6 hrs PRN mild/moderate pain',
      indication: 'General somatic and surgical site aches',
      category: 'Analgesic',
      allergyRisk: ['Acetaminophen'],
      effectNote: 'Eases pain by 2 points safely without NSAID gastric bleeding risk.',
      painDelta: -2,
      trustDelta: 6,
    },
    {
      name: 'Ferrous Sulfate (Oral Iron)',
      dose: '325 mg (65 mg elemental iron)',
      route: 'Oral (PO)',
      frequency: 'Once Daily with Vitamin C',
      indication: 'Iron replenishment for low haemoglobin',
      category: 'Hematology / Blood',
      allergyRisk: [],
      effectNote: 'Initiates hematinic marrow stimulation for long-term hemoglobin synthesis.',
      hbDelta: 0.3,
      trustDelta: 6,
    },
  ];

  const handleAdminister = (med: MedicationOrder) => {
    // Check allergy safety
    const patientAllergens = patient.history.allergies.map(a => a.allergen.toLowerCase());
    const isConflict = patientAllergens.some(al => med.name.toLowerCase().includes(al));

    if (isConflict) {
      alert(`⚠️ SAFETY INTERCEPT: Patient has a documented allergy to ${med.name}! Administration blocked to prevent anaphylaxis.`);
      return;
    }

    onAdministerMedication(med.id);
  };

  const handleOrderFromFormulary = (item: typeof hospitalFormulary[0]) => {
    // Check allergy risk against patient history
    const patientAllergens = patient.history.allergies.map(a => a.allergen.toLowerCase());
    const isRisky = item.allergyRisk.some(risk => patientAllergens.some(al => al.includes(risk.toLowerCase())));

    if (isRisky) {
      setAllergyWarning(`WARNING: Patient has a documented allergy related to ${item.name}! Verify allergy before prescribing.`);
      return;
    }

    const newMed: Partial<MedicationOrder> = {
      id: `med-${Date.now()}`,
      name: item.name,
      dose: item.dose,
      route: item.route,
      frequency: item.frequency,
      indication: item.indication,
      category: item.category as any,
      status: 'active',
      responseEffect: {
        painDelta: item.painDelta,
        anxietyDelta: item.anxietyDelta,
        trustDelta: item.trustDelta,
        hrDelta: item.hrDelta,
        bpSystolicDelta: item.bpSystolicDelta,
        spo2Delta: item.spo2Delta,
        hbDelta: item.hbDelta,
        note: item.effectNote,
      },
    };

    onOrderNewMedication(newMed);
    setIsOrderModalOpen(false);
    setSelectedFormularyMed(null);
    setAllergyWarning(null);
  };

  const filteredMeds = medications.filter(m => {
    if (filterCategory === 'All') return true;
    return m.category === filterCategory;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner: Pharmacy & eMAR Overview */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Bedside Pharmacy &amp; eMAR Record
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                Closed-Loop Administration
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Verify orders, cross-check documented allergies, and administer therapeutic relief to evaluate bedside response.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Prescribe from Formulary</span>
        </button>
      </div>

      {/* Medication Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', 'Analgesic', 'Anxiolytic', 'Cardiovascular', 'Hematology / Blood', 'Fluids'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
              filterCategory === cat
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-sky-50 hover:text-sky-800 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Medication Orders List */}
      <div className="space-y-3">
        {filteredMeds.map((med) => {
          const isDone = med.status === 'administered';
          const isBloodProduct = med.category === 'Hematology / Blood';

          return (
            <div
              key={med.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                  : isBloodProduct
                  ? 'bg-rose-50/50 border-rose-200 shadow-xs'
                  : 'bg-white border-sky-100 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : isBloodProduct
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}>
                    {isBloodProduct ? <Droplet className="w-5 h-5 text-rose-600" /> : <Pill className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {med.name}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-700">
                        {med.dose} • {med.route}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                        {med.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Schedule:</strong> {med.frequency} • <strong>Indication:</strong> {med.indication}
                    </p>

                    {isDone && med.administeredAt && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-emerald-800 font-semibold bg-emerald-100/70 px-2.5 py-1 rounded-lg w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Administered at {med.administeredAt} by {med.administeredBy || 'Student Clinician'}</span>
                      </div>
                    )}

                    {isDone && med.responseEffect?.note && (
                      <div className="mt-1 text-xs text-slate-600 italic">
                        &ldquo;{med.responseEffect.note}&rdquo;
                      </div>
                    )}
                  </div>
                </div>

                {/* Administration Action Button */}
                <div className="shrink-0 flex items-center gap-2 sm:self-center">
                  {isDone ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAdminister(med)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs ${
                        isBloodProduct
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/20'
                      }`}
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>Administer to Patient</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Formulary Order Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-sky-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-sky-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Hospital Formulary &amp; Medication Order</h3>
              </div>
              <button
                onClick={() => {
                  setIsOrderModalOpen(false);
                  setAllergyWarning(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {allergyWarning && (
              <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2 font-bold animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{allergyWarning}</span>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Select an indicated pharmacological intervention to prescribe. All medications are cross-checked against documented patient allergies.
              </p>

              <div className="space-y-2.5">
                {hospitalFormulary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-sky-100 hover:border-sky-300 hover:bg-sky-50/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="text-sm font-bold text-slate-900">{item.name}</strong>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.dose} • {item.route}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        <strong>Indication:</strong> {item.indication}
                      </p>
                      <p className="text-[11px] text-sky-700 mt-0.5 italic">
                        {item.effectNote}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOrderFromFormulary(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-xs transition shrink-0"
                    >
                      Prescribe &amp; Order
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
