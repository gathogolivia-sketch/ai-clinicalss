import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  GitCompare,
  Heart,
  Brain,
  Shield,
  CornerDownLeft,
  User
} from 'lucide-react';
import { PatientProfile } from '../types';

interface StudentActionBarProps {
  patient: PatientProfile;
  onSendMessage: (
    message: string,
    mode?: 'natural' | 'physical' | 'emotional' | 'social' | 'reassurance' | 'patient-expression',
    asRole?: 'student' | 'patient'
  ) => void;
  onOpenCompare: (topic?: string) => void;
  onScrollToExpressPortal?: () => void;
  isLoading: boolean;
  prefilledText?: string;
}

export const StudentActionBar: React.FC<StudentActionBarProps> = ({
  patient,
  onSendMessage,
  onOpenCompare,
  onScrollToExpressPortal,
  isLoading,
  prefilledText = '',
}) => {
  const [input, setInput] = useState(prefilledText);
  const [isListening, setIsListening] = useState(false);
  const [activeRole, setActiveRole] = useState<'student' | 'patient'>('student');
  const [selectedMode, setSelectedMode] = useState<'natural' | 'physical' | 'emotional' | 'social' | 'reassurance' | 'patient-expression'>('natural');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (prefilledText) {
      setInput(prefilledText);
    }
  }, [prefilledText]);

  // Speech Recognition setup (Voice-to-Text)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech-to-text is not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (activeRole === 'patient') {
      onSendMessage(input.trim(), 'patient-expression', 'patient');
    } else {
      onSendMessage(input.trim(), selectedMode, 'student');
    }

    setInput('');
  };

  const handleQuickPrompt = (promptText: string, mode: 'natural' | 'physical' | 'emotional' | 'social' | 'reassurance') => {
    setInput(promptText.replace(/[“”]/g, ''));
    setSelectedMode(mode);
    setActiveRole('student');
  };

  return (
    <div className="bg-white border-t border-sky-100 p-3 sm:p-4 shadow-lg">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Controls: Role Switcher & Feeling Quick Probes */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Conversational Role Toggle */}
          <div className="flex items-center bg-sky-50/80 p-1 rounded-xl border border-sky-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setActiveRole('student');
                setSelectedMode('natural');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                activeRole === 'student'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Inquire as Student</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveRole('patient');
                setSelectedMode('patient-expression');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition ${
                activeRole === 'patient'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Express as Patient (Free-Text)</span>
            </button>
          </div>

          {/* Quick Feeling Discovery Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {activeRole === 'student' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt(`“How is your physical body feeling in this exact moment, ${patient.name.split(' ')[0]}?”`, 'physical')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-slate-700 border border-sky-200 hover:border-rose-300 flex items-center gap-1 transition shadow-2xs"
                >
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>Physical Check</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt(`“What thoughts or worries are running through your mind right now?”`, 'emotional')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-slate-700 border border-sky-200 hover:border-amber-300 flex items-center gap-1 transition shadow-2xs"
                >
                  <Brain className="w-3 h-3 text-amber-500" />
                  <span>Emotional Check</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPrompt(`“I can see how terrifying this feels. Take your time, I am right here with you.”`, 'reassurance')}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-slate-700 border border-sky-200 hover:border-sky-400 flex items-center gap-1 transition shadow-2xs"
                >
                  <Shield className="w-3 h-3 text-sky-600" />
                  <span>Empathy &amp; Validation</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setInput(`I'm terrified this chest pressure won't stop and that I'm going to have another heart attack.`)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100 flex items-center gap-1 transition italic shadow-2xs"
                >
                  “Terrified of another heart attack...”
                </button>
                <button
                  type="button"
                  onClick={() => setInput(`I feel like nobody is listening to me. They just stare at the monitors and rush out.`)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 flex items-center gap-1 transition italic shadow-2xs"
                >
                  “Nobody is listening to me...”
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => onOpenCompare(input || "Inquiring about their main symptom and fear")}
              className="shrink-0 px-2.5 py-1 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-200 flex items-center gap-1 transition font-semibold shadow-2xs"
              title="See how 3 different questioning styles will change the patient's reply"
            >
              <GitCompare className="w-3 h-3 text-sky-600" />
              <span>Compare Phrasings</span>
            </button>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                activeRole === 'patient'
                  ? `Express what ${patient.name.split(' ')[0]} is feeling right now in free text (AI will decode emotions & validate)...`
                  : `Ask or reflect with ${patient.name} (e.g. "I can see how frightening this feels. How is your body right now?")...`
              }
              disabled={isLoading}
              className={`w-full bg-sky-50/40 border rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-2xs ${
                activeRole === 'patient'
                  ? 'border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                  : 'border-sky-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
              }`}
            />

            {/* Mic button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              title={isListening ? "Listening... click to stop" : "Speak your message via microphone"}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
                isListening
                  ? 'bg-rose-100 text-rose-600 animate-pulse border border-rose-200'
                  : 'text-slate-400 hover:text-sky-600 hover:bg-sky-100'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-3 rounded-xl font-semibold text-sm transition shadow-md bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <span>{activeRole === 'patient' ? 'Express Feeling' : 'Discuss'}</span>
            <CornerDownLeft className="w-4 h-4 hidden sm:inline" />
          </button>
        </form>
      </div>
    </div>
  );
};
