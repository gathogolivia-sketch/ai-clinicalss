import React, { useState } from 'react';
import { X, UserPlus, Sliders } from 'lucide-react';
import { PatientProfile } from '../types';

interface CustomPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePatient: (patient: PatientProfile) => void;
}

export const CustomPatientModal: React.FC<CustomPatientModalProps> = ({
  isOpen,
  onClose,
  onCreatePatient,
}) => {
  const [name, setName] = useState('Elena Rostova');
  const [age, setAge] = useState(52);
  const [gender, setGender] = useState('Female');
  const [occupation, setOccupation] = useState('Florist');
  const [clinicalSetting, setClinicalSetting] = useState('Inpatient Oncology Floor');
  const [chiefComplaint, setChiefComplaint] = useState('Severe nausea and sudden panic following second cycle of chemotherapy.');
  const [background, setBackground] = useState('Diagnosed with breast cancer 3 months ago. Family lives out of state. She puts on a calm facade for visiting friends.');
  const [hiddenConcern, setHiddenConcern] = useState('I am terrified I will vomit in front of my daughter, and that the tumor is not shrinking despite the side effects.');
  const [demeanor, setDemeanor] = useState('Polite, anxious, pale, clutching a blanket tightly.');
  const [trust, setTrust] = useState(40);
  const [anxiety, setAnxiety] = useState(80);
  const [pain, setPain] = useState(6);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: PatientProfile = {
      id: `custom-${Date.now()}`,
      name,
      age: Number(age),
      gender,
      occupation,
      avatarSeed: name,
      clinicalSetting,
      chiefComplaint,
      background,
      hiddenConcern,
      demeanor,
      baselineState: {
        trust: Number(trust),
        anxiety: Number(anxiety),
        pain: Number(pain),
        fatigue: 75,
        comfort: 35,
        openness: 35,
      },
      baselineVitals: {
        hr: 88,
        bpSystolic: 126,
        bpDiastolic: 82,
        spo2: 97,
        rr: 19,
        temp: 37.1,
        pain: Number(pain),
        rhythm: 'Normal Sinus Rhythm',
      },
      history: {
        mrn: `CUSTOM-${Date.now().toString().slice(-4)}`,
        dob: '1974-06-21',
        room: 'Sim Room 1',
        attending: 'Clinical Preceptor, MD',
        codeStatus: 'Full Code',
        allergies: [],
        pastMedicalHistory: ['Custom simulated patient case'],
        pastSurgicalHistory: [],
        familyHistory: ['Non-contributory'],
        socialHistory: [`Occupation: ${occupation}`],
        reviewOfSystems: { General: chiefComplaint },
        physicalExam: { General: demeanor },
        homeMedications: [],
      },
      labs: [
        {
          id: 'hb',
          name: 'Haemoglobin (Hb)',
          category: 'Hematology',
          value: '12.4',
          numericValue: 12.4,
          unit: 'g/dL',
          referenceRange: '12.0 - 15.5 g/dL',
          flag: 'normal',
          interpretation: 'Baseline Haemoglobin within normal limits for custom case.',
          ordered: true,
          orderedAt: 'Admission',
        },
        {
          id: 'wbc',
          name: 'White Blood Cell Count (WBC)',
          category: 'Hematology',
          value: '6.9',
          numericValue: 6.9,
          unit: 'x10^3/uL',
          referenceRange: '4.5 - 11.0 x10^3/uL',
          flag: 'normal',
          interpretation: 'Normal leukocytes.',
          ordered: true,
          orderedAt: 'Admission',
        },
      ],
      medications: [
        {
          id: `med-cust-${Date.now()}`,
          name: 'Acetaminophen',
          dose: '650 mg',
          route: 'PO',
          frequency: 'Q6H PRN pain',
          indication: 'Somatic pain relief',
          category: 'Analgesic',
          status: 'active',
          responseEffect: {
            painDelta: -2,
            trustDelta: 6,
            note: 'Pain eased slightly.',
          },
        },
      ],
      nursingInterventions: [
        {
          id: `ni-cust-${Date.now()}`,
          title: 'Bedside Comfort & Supportive Presence',
          description: 'Provide reassurance, adjust bed positioning, and assess patient needs.',
          category: 'Comfort',
          performed: false,
          impactSummary: 'Improves patient dignity and relaxation.',
          effect: { comfortDelta: 15, anxietyDelta: -10, trustDelta: 8 },
        },
      ],
      objectives: [
        {
          id: 'obj-cust-empathy',
          title: 'Explore Hidden Emotional Concern',
          description: 'Build bedside rapport to discover the patient’s unspoken fear.',
          category: 'Communication',
          status: 'pending',
          criteria: 'Reach patient trust >= 65% through active empathetic listening.',
        },
        {
          id: 'obj-cust-labs',
          title: 'Review Labs & Haemoglobin',
          description: 'Examine complete blood count and confirm stable hemoglobin levels.',
          category: 'Diagnostics',
          status: 'pending',
          criteria: 'Check laboratory tab and note findings.',
        },
      ],
      samplePrompts: [
        `“Hello ${name}, I am a medical student here today. How are you feeling in this moment?”`,
        `“I see you are holding your blanket closely. What is feeling hardest right now?”`,
        `“Take all the time you need. I want to understand what you are going through.”`,
      ],
    };

    onCreatePatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-sky-200 rounded-2xl shadow-2xl p-5 sm:p-7 max-h-[90vh] overflow-y-auto text-slate-800">
        <div className="flex items-start justify-between pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-xs">
              <UserPlus className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Design Custom Patient Case
              </h2>
              <p className="text-xs text-slate-500">
                Create a customized patient persona to practice discussing specific emotions or clinical challenges.
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

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Patient Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  required
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Occupation / Life Role</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Clinical Setting</label>
              <input
                type="text"
                value={clinicalSetting}
                onChange={(e) => setClinicalSetting(e.target.value)}
                className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Chief Complaint &amp; Presentation</label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              required
              className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Background / Context</label>
            <textarea
              rows={2}
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Hidden Fear / Unspoken Concern (Only revealed through empathy)
            </label>
            <input
              type="text"
              value={hiddenConcern}
              onChange={(e) => setHiddenConcern(e.target.value)}
              required
              className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Initial Demeanor &amp; Non-Verbal Style</label>
            <input
              type="text"
              value={demeanor}
              onChange={(e) => setDemeanor(e.target.value)}
              className="w-full bg-sky-50/40 border border-sky-200 rounded-lg p-2 text-slate-900 focus:outline-none focus:border-sky-500 shadow-2xs"
            />
          </div>

          {/* Baseline emotional state sliders */}
          <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <Sliders className="w-3.5 h-3.5 text-sky-600" /> Baseline Emotional Vitals
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600">Baseline Trust ({trust}%)</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={trust}
                  onChange={(e) => setTrust(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600">Baseline Anxiety ({anxiety}%)</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={anxiety}
                  onChange={(e) => setAnxiety(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600">Pain Level ({pain}/10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={pain}
                  onChange={(e) => setPain(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition shadow-2xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition shadow-xs"
            >
              Start Custom Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
