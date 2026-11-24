import React from 'react';
import {
  FileText,
  AlertTriangle,
  Heart,
  Activity,
  UserCheck,
  Building2,
  Stethoscope,
  Pill,
  Users,
  Briefcase,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { PatientProfile } from '../types';

interface PatientHistoryViewProps {
  patient: PatientProfile;
  onOpenConsultation?: () => void;
}

export const PatientHistoryView: React.FC<PatientHistoryViewProps> = ({
  patient,
  onOpenConsultation,
}) => {
  const { history } = patient;

  return (
    <div className="space-y-5">
      {/* EHR Header Banner */}
      <div className="bg-white border border-sky-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sky-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-extrabold text-xl shadow-sm">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-slate-900">{patient.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-bold">
                  MRN: {history.mrn}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                  DOB: {history.dob} ({patient.age}y)
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  {history.codeStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                <strong>Attending:</strong> {history.attending} • <strong>Location:</strong> {history.room} ({patient.clinicalSetting})
              </p>
            </div>
          </div>

          {onOpenConsultation && (
            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-xs transition shrink-0"
            >
              Resume Bedside Dialogue
            </button>
          )}
        </div>

        {/* Allergy Alert Strip */}
        <div className="mt-3.5 pt-1">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Documented Allergies &amp; Adverse Reactions:</span>
          </div>

          {history.allergies && history.allergies.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {history.allergies.map((allergy, i) => (
                <div
                  key={i}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${
                    allergy.severity === 'severe'
                      ? 'bg-rose-50 text-rose-800 border-rose-300'
                      : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className="font-bold">{allergy.allergen}:</span>
                  <span>{allergy.reaction}</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-1 rounded bg-white/70">
                    {allergy.severity}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              No Known Drug Allergies (NKDA)
            </span>
          )}
        </div>
      </div>

      {/* Main Clinical History Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Column 1: Chief Complaint & PMHx & PSHx */}
        <div className="space-y-5">
          {/* Chief Complaint & HPI */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-sky-50 pb-2">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Chief Complaint &amp; History of Present Illness (HPI)</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-sky-900 bg-sky-50 p-2.5 rounded-lg border border-sky-100">
                &ldquo;{patient.chiefComplaint}&rdquo;
              </p>
              <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                {patient.background}
              </p>
            </div>
          </div>

          {/* Past Medical History (PMHx) */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-sky-50 pb-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Past Medical History (PMHx)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {history.pastMedicalHistory.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Past Surgical History (PSHx) */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-sky-50 pb-2">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>Past Surgical History (PSHx)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {history.pastSurgicalHistory.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Family & Social History */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-sky-50 pb-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>Family &amp; Social History</span>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <strong className="text-slate-800 block mb-1">Family Medical Risk:</strong>
                <ul className="space-y-1 text-slate-600">
                  {history.familyHistory.map((fh, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-500">•</span>
                      <span>{fh}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-slate-800 block mb-1">Social Background:</strong>
                <ul className="space-y-1 text-slate-600">
                  {history.socialHistory.map((sh, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-sky-500">•</span>
                      <span>{sh}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Home Medications, ROS, and Physical Exam */}
        <div className="space-y-5">
          {/* Home Medications Table */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-sky-50 pb-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Pill className="w-4 h-4 text-sky-600" />
                <span>Home Medications &amp; Outpatient Regimen</span>
              </div>
              <span className="text-xs text-slate-500">
                {history.homeMedications.length} active
              </span>
            </div>

            {history.homeMedications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-sky-50/60 text-slate-700">
                      <th className="p-2 font-semibold rounded-l-lg">Medication</th>
                      <th className="p-2 font-semibold">Dose &amp; Route</th>
                      <th className="p-2 font-semibold">Frequency</th>
                      <th className="p-2 font-semibold rounded-r-lg">Indication</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    {history.homeMedications.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-800">{med.name}</td>
                        <td className="p-2">{med.dosage} {med.route}</td>
                        <td className="p-2">{med.frequency}</td>
                        <td className="p-2 text-slate-500 italic">{med.indication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No regular prescription medications recorded.</p>
            )}
          </div>

          {/* Review of Systems (ROS) */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-sky-50 pb-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span>Review of Systems (ROS)</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {Object.entries(history.reviewOfSystems).map(([system, details], idx) => (
                <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <strong className="text-slate-800">{system}: </strong>
                  <span className="text-slate-600">{details}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Examination Findings */}
          <div className="bg-white border border-sky-100 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-sky-50 pb-2">
              <Stethoscope className="w-4 h-4 text-sky-600" />
              <span>Objective Physical Examination</span>
            </div>
            <div className="space-y-2 text-xs">
              {Object.entries(history.physicalExam).map(([system, findings], idx) => (
                <div key={idx} className="p-2 rounded-lg bg-sky-50/40 border border-sky-100">
                  <strong className="text-sky-950 capitalize">{system}: </strong>
                  <span className="text-slate-700">{findings}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
