import React, { useState } from 'react';
import {
  User,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Heart,
  ShieldCheck,
  Brain
} from 'lucide-react';
import { ChatMessage, PatientProfile } from '../types';
import { speakPatientText, stopSpeaking } from '../utils/speech';

interface DialogueStreamProps {
  messages: ChatMessage[];
  patient: PatientProfile;
  isLoading: boolean;
}

export const DialogueStream: React.FC<DialogueStreamProps> = ({
  messages,
  patient,
  isLoading,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [revealedMonologues, setRevealedMonologues] = useState<Record<string, boolean>>({});
  const [revealedFeedback, setRevealedFeedback] = useState<Record<string, boolean>>({});

  const handleSpeak = (id: string, text: string, gender: string = patient.gender) => {
    if (playingId === id) {
      stopSpeaking();
      setPlayingId(null);
    } else {
      speakPatientText(text, gender);
      setPlayingId(id);
    }
  };

  const toggleMonologue = (id: string) => {
    setRevealedMonologues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFeedback = (id: string) => {
    setRevealedFeedback(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4 py-2">
      {messages.length === 0 && (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-sky-200 bg-sky-50/40">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-3 shadow-2xs">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Clinical Bedside Encounter &amp; Feeling Dialogue
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {patient.name} is waiting in the {patient.clinicalSetting.toLowerCase()}.
            You can converse as a medical student, or switch to the free-text input to express how {patient.name.split(' ')[0]} feels and witness AI empathetic validation.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {patient.samplePrompts.slice(0, 2).map((prompt, i) => (
              <span
                key={i}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-sky-200 italic shadow-2xs"
              >
                {prompt}
              </span>
            ))}
          </div>
        </div>
      )}

      {messages.map((message) => {
        // 1. Role: Medical Student
        if (message.role === 'student') {
          return (
            <div key={message.id} className="flex justify-end items-start gap-2.5 sm:gap-3 group">
              <div className="max-w-2xl bg-sky-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold text-sky-100 flex items-center gap-1">
                    <User className="w-3 h-3" /> Medical Student
                  </span>
                  <span className="text-[10px] text-sky-200">{message.timestamp}</span>
                </div>
                <p className="text-sm text-white font-medium leading-relaxed">
                  {message.text}
                </p>
                {message.inquiryMode && message.inquiryMode !== 'natural' && (
                  <span className="mt-2 inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-700 text-sky-100 border border-sky-500/40">
                    Mode: {message.inquiryMode} inquiry
                  </span>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-sky-700 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
                You
              </div>
            </div>
          );
        }

        // 2. Role: Clinician Empathetic Response (Acknowledging & Validating)
        if (message.role === 'clinician') {
          const analysis = message.emotionalAnalysis;
          return (
            <div key={message.id} className="flex justify-end items-start gap-2.5 sm:gap-3 group">
              <div className="max-w-3xl bg-sky-50/90 border-2 border-sky-300 text-slate-800 rounded-2xl rounded-tr-sm p-4 sm:p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-sky-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
                    <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-sky-600" />
                      AI Clinician: Empathetic Acknowledgment &amp; Validation
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSpeak(message.id, message.text, 'Female')}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-white hover:bg-sky-100 text-sky-700 border border-sky-200 transition shadow-2xs"
                    >
                      {playingId === message.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                          <span className="text-rose-600">Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-800 font-medium leading-relaxed pl-3 border-l-2 border-sky-500">
                  {message.text}
                </p>

                {analysis && (
                  <div className="bg-white rounded-xl p-3 border border-sky-200 space-y-1.5 text-xs shadow-2xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block">
                      Empathy In Action:
                    </span>
                    <div className="text-slate-700">
                      <strong className="text-sky-800">Validation: </strong>
                      {analysis.empatheticResponse.validation}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
                MD
              </div>
            </div>
          );
        }

        // 3. Role: Patient (including free-text feeling disclosures)
        const isFreeTextExpression = message.inquiryMode === 'patient-expression';
        const details = message.details;
        const analysis = message.emotionalAnalysis;
        const isMonologueRevealed = revealedMonologues[message.id] ?? true;
        const isFeedbackRevealed = revealedFeedback[message.id] ?? true;

        return (
          <div key={message.id} className="flex items-start gap-2.5 sm:gap-3 group">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
              isFreeTextExpression
                ? 'bg-rose-100 border-rose-300 text-rose-800'
                : 'bg-sky-100 border-sky-300 text-sky-800'
            }`}>
              {patient.name.charAt(0)}
            </div>

            <div className={`max-w-3xl flex-1 bg-white border rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-xs space-y-3.5 ${
              isFreeTextExpression ? 'border-rose-300 bg-rose-50/20' : 'border-sky-200'
            }`}>
              {/* Header with name, audio, and feeling badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-sky-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {patient.name}
                  </span>
                  {isFreeTextExpression ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500" />
                      Free-Text Feeling Expression
                    </span>
                  ) : details?.immediateFeeling ? (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-sky-500" />
                      {details.immediateFeeling}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(message.id, message.text)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition shadow-2xs"
                    title="Read response aloud with patient voice"
                  >
                    {playingId === message.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span className="text-rose-600">Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-sky-600" />
                        <span>Listen</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-slate-400">{message.timestamp}</span>
                </div>
              </div>

              {/* Spoken Verbal Reply */}
              <div className="text-slate-800 text-sm leading-relaxed">
                {message.text.split(/(\*[^*]+\*)/g).map((part, index) => {
                  if (part.startsWith('*') && part.endsWith('*')) {
                    return (
                      <span key={index} className="text-amber-800 italic font-medium bg-amber-50 px-1 py-0.5 rounded mx-0.5 border border-amber-200/60">
                        {part.replace(/\*/g, '')}
                      </span>
                    );
                  }
                  return <span key={index}>{part}</span>;
                })}
              </div>

              {/* Free-text Emotional Analysis pill if available */}
              {analysis && (
                <div className="rounded-xl p-3 bg-rose-50/50 border border-rose-200 text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-800 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-rose-600" />
                      AI Emotional State Decoded: {analysis.primaryEmotion}
                    </span>
                    <span className="text-[11px] text-rose-700 font-semibold">{analysis.intensity}% Distress</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <strong>Somatic Signals:</strong> {analysis.somaticManifestations.join(', ')} • <strong>Unmet Need:</strong> {analysis.unmetNeeds[0]}
                  </div>
                </div>
              )}

              {/* Inner Monologue Layer: "What Patient Felt Inside" */}
              {details?.innerMonologue && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/50 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => toggleMonologue(message.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-blue-900 hover:bg-blue-100/50 transition"
                  >
                    <span className="flex items-center gap-1.5">
                      {isMonologueRevealed ? <EyeOff className="w-3.5 h-3.5 text-blue-600" /> : <Eye className="w-3.5 h-3.5 text-blue-600" />}
                      Inner Monologue (What {patient.name.split(' ')[0]} felt but didn&apos;t say)
                    </span>
                    {isMonologueRevealed ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  {isMonologueRevealed && (
                    <div className="px-3 pb-3 pt-1 text-xs text-blue-950 italic leading-relaxed border-t border-blue-200/80">
                      &ldquo;{details.innerMonologue}&rdquo;
                      {details.emotionalImpactExplanation && (
                        <div className="mt-1.5 text-[11px] not-italic text-blue-800">
                          <strong>Why they felt this:</strong> {details.emotionalImpactExplanation}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Communication Feedback & Calgary-Cambridge Coaching */}
              {details?.studentFeedback && (
                <div className="rounded-xl border border-sky-200 bg-sky-50/50 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => toggleFeedback(message.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-sky-900 hover:bg-sky-100/50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-sky-600" />
                      <span>Bedside Empathy Feedback:</span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold border border-sky-200">
                        {details.studentFeedback.empathyScore}/100
                      </span>
                      <span className="text-[10px] text-sky-700 font-normal hidden sm:inline">
                        • {details.studentFeedback.calgaryCambridgeSkill}
                      </span>
                    </div>
                    {isFeedbackRevealed ? <ChevronUp className="w-3.5 h-3.5 text-sky-600" /> : <ChevronDown className="w-3.5 h-3.5 text-sky-600" />}
                  </button>

                  {isFeedbackRevealed && (
                    <div className="px-3 pb-3 pt-1.5 text-xs text-slate-700 space-y-1.5 border-t border-sky-200">
                      {details.studentFeedback.strengths.length > 0 && (
                        <div>
                          <strong className="text-sky-900 text-[11px]">Key Strength: </strong>
                          <span className="text-slate-700">{details.studentFeedback.strengths.join(' • ')}</span>
                        </div>
                      )}
                      {details.studentFeedback.learningOpportunity && (
                        <div>
                          <strong className="text-amber-800 text-[11px]">Pro-Tip for Next Question: </strong>
                          <span className="text-slate-700">{details.studentFeedback.learningOpportunity}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-xs font-bold text-sky-700 shrink-0 animate-pulse">
            {patient.name.charAt(0)}
          </div>
          <div className="bg-white border border-sky-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-xs text-slate-500 italic">
              Processing dialogue and emotional resonance...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
