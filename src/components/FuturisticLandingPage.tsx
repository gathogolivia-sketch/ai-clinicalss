import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Sparkles,
  Play,
  ArrowRight,
  ShieldCheck,
  Brain,
  Award,
  BookOpen,
  Youtube,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  FlaskConical,
  Pill,
  Stethoscope,
  Siren,
  LineChart,
  CheckCircle2,
  Layers,
  HelpCircle,
  Mail,
  Send,
  Instagram
} from 'lucide-react';
import { PatientProfile } from '../types';

interface FuturisticLandingPageProps {
  onStartSimulation: (patientId?: string) => void;
  patients: PatientProfile[];
}

// Bespoke AI Robot Head Logo with Medical Crest (Clean Blue & White Theme)
export const RobotHeadLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "w-10 h-10",
  size = 40
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="blueWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="lightCyan" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>

    {/* Robot Head Outer Shell */}
    <rect x="12" y="14" width="40" height="36" rx="10" fill="#ffffff" stroke="url(#blueWhiteGrad)" strokeWidth="2.5" />
    
    {/* Forehead Circuit Lines */}
    <path d="M22 14V8H26V14" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 14V8H38V14" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <circle cx="26" cy="7" r="2" fill="#0284c7" />
    <circle cx="38" cy="7" r="2" fill="#0284c7" />

    {/* Central Medical Cross on Forehead */}
    <path d="M32 19V25M29 22H35" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />

    {/* Eye Visor Plate */}
    <rect x="17" y="27" width="30" height="11" rx="4" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.5" />

    {/* Cybernetic Glowing Eyes */}
    <circle cx="25" cy="32.5" r="3.2" fill="#0284c7" />
    <circle cx="39" cy="32.5" r="3.2" fill="#0284c7" />
    <circle cx="25" cy="32.5" r="1.2" fill="#ffffff" />
    <circle cx="39" cy="32.5" r="1.2" fill="#ffffff" />

    {/* Cheek Cybernetic Neural Nodes */}
    <circle cx="16" cy="42" r="1.5" fill="#3b82f6" />
    <circle cx="48" cy="42" r="1.5" fill="#3b82f6" />

    {/* Audio / Voice Synthesizer Grill (Mouth) */}
    <path d="M24 44H40" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    <path d="M27 47H37" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />

    {/* Left and Right Temporal Audio Receivers */}
    <rect x="7" y="24" width="5" height="14" rx="2.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
    <rect x="52" y="24" width="5" height="14" rx="2.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.5" />
  </svg>
);

export const FuturisticLandingPage: React.FC<FuturisticLandingPageProps> = ({
  onStartSimulation,
  patients,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | 'Easy' | 'Intermediate' | 'Difficult'>('All');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Video tutorial state
  const [videoUrl, setVideoUrl] = useState('https://youtu.be/heJ1Jr19sDg');
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoInputText, setVideoInputText] = useState(videoUrl);
  const [activeGuideTab, setActiveGuideTab] = useState<'nurse' | 'labs' | 'vitals' | 'codes'>('nurse');

  // Contact form state
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const filteredPatients = patients.filter(p => {
    if (selectedDifficulty === 'All') return true;
    return p.difficulty === selectedDifficulty;
  });

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

  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (videoInputText.trim()) {
      setVideoUrl(videoInputText.trim());
      alert('YouTube Video Resource URL updated successfully!');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  const faqs = [
    {
      q: 'How does the Clinical AI Simulator evaluate students?',
      a: 'The simulator evaluates students across 5 critical dimensions: Calgary-Cambridge communication, the NURSE empathy framework (Naming, Understanding, Respecting, Supporting, Exploring), diagnostic lab reasoning (including monitoring Haemoglobin and critical blood markers), closed-loop medication safety, and bedside nursing interventions. An interactive OSCE scoring engine provides letter grades, numerical percentages, and preceptor feedback.'
    },
    {
      q: 'What is the significance of the Haemoglobin and Labs station?',
      a: 'Real clinical patients frequently present with occult blood loss, acute anemia, or chronic inflammatory anemia (such as post-stent recovery or autoimmune flares). The labs section allows students to order Complete Blood Counts, evaluate Haemoglobin (Hb) levels against standard reference ranges, and observe the physiological impact of treatments like PRBC transfusions.'
    },
    {
      q: 'Can instructors customize or create new patient cases?',
      a: 'Yes! In addition to the 8 pre-configured cases spanning Easy, Intermediate, and Difficult tiers, the system includes a "Design Custom Patient Case" studio where educators can define custom chief complaints, hidden emotional fears, baseline emotional vitals, and laboratory parameters.'
    },
    {
      q: 'What are the Hospital Emergency Codes in the simulator?',
      a: 'The simulator embeds standard international hospital emergency codes including Code Blue (Cardiac/Medical Arrest), Code Red (Fire/Smoke), Code STEMI (Acute Infarction), Code Sepsis, and Code Orange. Students can review clinical action checklists and trigger rapid emergency responses.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Soft Blue Ambient Gradient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-sky-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl" />
      </div>

      {/* Clean White and Blue Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center bg-white rounded-xl">
              <img
                src="/assets/aistudio/ai_clinical_simulator_66b1e337.jpeg"
                alt="AI Clinical Simulation Assistant — Learn, Practice, Excel"
                className="h-12 sm:h-14 w-auto object-contain"
              />
              <span className="hidden xl:inline-block ml-2 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                BEDSIDE LEARNING
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-600">
            <a href="#hero" className="hover:text-blue-600 transition">Home</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#cases" className="hover:text-blue-600 transition">Clinical Cases</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <a href="#study-guide" className="hover:text-blue-600 transition">Study Guide &amp; Media</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#faq" className="hover:text-blue-600 transition">FAQ</a>
            <a href="#contact" className="hover:text-blue-600 transition">Contact</a>
          </nav>

          {/* Launch CTA Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onStartSimulation()}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 transition-all duration-300 active:scale-95"
            >
              <span>Start Simulation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section id="hero" className="relative z-10 pt-14 sm:pt-20 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wider uppercase shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Clinical AI Simulator • Healthcare Education Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
              Experience the Future of <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-600">
                Clinical Learning.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Immerse yourself in authentic bedside healthcare simulations powered by multidimensional emotion modeling. Master the Calgary-Cambridge and NURSE empathy protocols, evaluate real-time telemetry and ECG trends, examine diagnostic labs like <strong>Haemoglobin</strong>, administer safe closed-loop pharmacy orders, and receive instant AI Preceptor OSCE performance grading.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onStartSimulation()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all duration-300 active:scale-95"
              >
                <span>Launch Clinical Simulator</span>
                <Play className="w-4 h-4 fill-current" />
              </button>

              <a
                href="#study-guide"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-white hover:bg-sky-50 text-slate-800 border border-sky-200 hover:border-blue-400 transition-all duration-300 shadow-xs"
              >
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Study Guide &amp; Video</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-sky-100 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-2xl font-extrabold text-blue-600">8 Cases</div>
                <div className="text-[11px] text-slate-500 font-medium">Easy, Med &amp; Difficult</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-sky-600">1-Click</div>
                <div className="text-[11px] text-slate-500 font-medium">NURSE Empathy HUD</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-emerald-600">100%</div>
                <div className="text-[11px] text-slate-500 font-medium">Closed-Loop eMAR &amp; Labs</div>
              </div>
            </div>
          </div>

          {/* Hero Right: Clean White & Blue Clinical Telemetry Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-white border-2 border-sky-200 p-5 shadow-xl shadow-sky-500/10 space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">
                    Bedside Telemetry Tele-Link
                  </span>
                </div>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                  Simulation Ready
                </span>
              </div>

              {/* Simulated Waveform Preview on Dark/Navy Monitor Glass */}
              <div className="bg-[#091122] rounded-2xl p-3.5 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> LEAD II (Normal Sinus)
                  </span>
                  <span>Sweep: 25 mm/s</span>
                </div>
                <div className="h-16 flex items-center justify-center overflow-hidden relative">
                  <svg className="w-full h-12 stroke-emerald-400 fill-none stroke-[2] opacity-90 drop-shadow-[0_0_8px_#10b981]" viewBox="0 0 300 40">
                    <path d="M0,20 L50,20 L55,14 L60,20 L65,20 L70,3 L75,37 L80,20 L85,20 L95,12 L105,20 L150,20 L155,14 L160,20 L165,20 L170,3 L175,37 L180,20 L185,20 L195,12 L205,20 L250,20 L255,14 L260,20 L265,20 L270,3 L275,37 L280,20 L300,20" />
                  </svg>
                </div>
              </div>

              {/* Digits Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] font-bold text-slate-600 block">HR</span>
                  <span className="text-xl font-extrabold text-emerald-600">82</span>
                  <span className="text-[9px] text-slate-500 block">bpm</span>
                </div>
                <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-[10px] font-bold text-slate-600 block">NIBP</span>
                  <span className="text-xl font-extrabold text-rose-600">128/78</span>
                  <span className="text-[9px] text-slate-500 block">mmHg</span>
                </div>
                <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-bold text-slate-600 block">SpO2</span>
                  <span className="text-xl font-extrabold text-blue-600">96%</span>
                  <span className="text-[9px] text-slate-500 block">Room air</span>
                </div>
              </div>

              {/* Haemoglobin & Empathy Readout */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-semibold flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-blue-600" />
                    Spotlight Lab: <strong>Haemoglobin</strong>
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    9.2 g/dL (Low)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 italic">
                  &ldquo;I notice you are holding your chest very still. What is that sensation like right now?&rdquo;
                </p>
              </div>

              {/* Direct Quick Launch */}
              <button
                onClick={() => onStartSimulation()}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
              >
                Enter Consultation Room Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS SECTION */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Core Simulation Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Designed for Rigorous Clinical Mastery
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Everything medical, nursing, and allied health students need to practice empathetic communication, diagnostic reasoning, and emergency safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Clinical Cases */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Graded Clinical Cases</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore 8 authentic cases organized into <strong>Easy, Intermediate, and Difficult</strong> difficulty levels with deep medical histories, documented allergies, and hidden fears.
            </p>
          </div>

          {/* Card 2: AI Assistant & Dialogue */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multidimensional AI Assistant</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Natural spoken dialogue coupled with inner monologues, non-verbal somatic cues, and multidimensional mapping across physical, emotional, social, and existential domains.
            </p>
          </div>

          {/* Card 3: Patient Assessment & Vitals */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Telemetry &amp; Recharts Vital Trends</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Live Lead II ECG waveform sweep and historical trend charts for Heart Rate, Blood Pressure, and SpO2 using Recharts to visualize patient recovery over time.
            </p>
          </div>

          {/* Card 4: Performance Tracking */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">OSCE Preceptor Grading</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Real-time rubric grading generating letter grades (A+, A, B, C), numerical scores (0–100%), preceptor appraisals, and actionable Calgary-Cambridge communication tips.
            </p>
          </div>

          {/* Card 5: Diagnostic Labs & Haemoglobin */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Diagnostic Labs (Haemoglobin Focus)</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Track Haemoglobin (Hb) to detect peri-operative blood loss or chronic illness anemia. Includes CBC, Troponin, BMP, and STAT lab draws with point-of-care turnaround.
            </p>
          </div>

          {/* Card 6: Emergency Codes */}
          <div className="p-6 rounded-3xl bg-white border border-sky-100 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
              <Siren className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Hospital Emergency Codes</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standard emergency codes (Code Red, Code Blue, Code STEMI, Code Sepsis) with interactive activation and step-by-step clinical action protocols.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION (3 Steps) */}
      <section id="how-it-works" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Interactive Learning Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            How the Simulation Works in 3 Steps
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            A frictionless workflow designed to build clinical empathy, diagnostic intuition, and safety reflex.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-sky-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-blue-600/30">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900">Select Scenario &amp; Review Chart</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Choose from Easy, Intermediate, or Difficult cases. Review the electronic patient chart (EHR) including past medical history, family genetics, and documented allergies.
            </p>
            <div className="pt-2 text-xs text-blue-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Full EHR &amp; Allergy Reconciliation</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-sky-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-sky-600/30">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900">Bedside Dialogue &amp; Interventions</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Use 1-click empathy shortcuts or natural questions. Order blood tests (Haemoglobin), execute nursing comfort measures, and administer pharmacy medications while observing vitals shift.
            </p>
            <div className="pt-2 text-xs text-sky-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Live Telemetry &amp; Multidimensional Shifts</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-sky-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900">Receive OSCE Preceptor Grade</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              View your personalized letter grade, rubric breakdowns across communication, diagnostic labs, and patient safety, and read the patient’s final retrospective impression.
            </p>
            <div className="pt-2 text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Granular OSCE Rubrics &amp; AI Debrief</span>
            </div>
          </div>
        </div>
      </section>

      {/* CLINICAL CASES BROWSER SECTION */}
      <section id="cases" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Curated Patient Scenarios
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Explore 8 Standardized Cases
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Filter by clinical difficulty to practice fundamental rapport building or high-stakes acute emergencies.
            </p>
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-sky-200 shadow-2xs">
            {(['All', 'Easy', 'Intermediate', 'Difficult'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedDifficulty === diff
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-sky-50'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPatients.map((patient) => {
            const hb = patient.labs.find(l => l.id === 'hb');
            return (
              <div
                key={patient.id}
                className="p-5 rounded-3xl bg-white border border-sky-200 hover:border-blue-400 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getDifficultyBadge(patient.difficulty)}`}>
                      {patient.difficulty || 'Intermediate'}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {patient.age}y • {patient.gender}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {patient.name}
                  </h3>
                  <span className="text-xs text-blue-700 block mb-2 font-semibold">
                    {patient.clinicalSetting}
                  </span>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {patient.chiefComplaint}
                  </p>

                  {/* Key Biomarkers Spotlight */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-500">HR: <strong className="text-slate-800">{patient.baselineVitals.hr}</strong></span>
                    <span className="text-slate-500">BP: <strong className="text-slate-800">{patient.baselineVitals.bpSystolic}/{patient.baselineVitals.bpDiastolic}</strong></span>
                    {hb && (
                      <span className="text-slate-500">
                        Hb: <strong className={hb.flag === 'low' ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>{hb.value}</strong>
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onStartSimulation(patient.id)}
                  className="w-full py-2.5 rounded-xl bg-sky-50 group-hover:bg-blue-600 group-hover:text-white text-blue-700 border border-sky-200 group-hover:border-transparent font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Launch Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* STUDY GUIDE & YOUTUBE / SOCIAL MEDIA HUB */}
      <section id="study-guide" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Educational Resources &amp; Media Launch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Study Guides, Video Tutorials &amp; Community
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Essential reference materials, YouTube video link integration, and official social media launch channels for learners and educators.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Study Guide Tabs (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-sky-200 p-6 sm:p-7 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-lg text-slate-900">Clinical Preceptor Study Guide</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Reference Edition 2026</span>
            </div>

            {/* Guide Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveGuideTab('nurse')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeGuideTab === 'nurse'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                NURSE Empathy Protocol
              </button>
              <button
                onClick={() => setActiveGuideTab('labs')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeGuideTab === 'labs'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Haemoglobin &amp; Blood Work
              </button>
              <button
                onClick={() => setActiveGuideTab('vitals')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeGuideTab === 'vitals'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Telemetry &amp; Vital Signs
              </button>
              <button
                onClick={() => setActiveGuideTab('codes')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeGuideTab === 'codes'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                Hospital Emergency Codes
              </button>
            </div>

            {/* Guide Content Display */}
            <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 border border-sky-100 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3 font-normal">
              {activeGuideTab === 'nurse' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-blue-900">The NURSE Empathy Framework</h4>
                  <p className="text-slate-600 text-xs">
                    Designed to address intense patient emotions without deflecting or giving premature medical lectures:
                  </p>
                  <ul className="space-y-2 text-xs">
                    <li><strong className="text-blue-800">N - Naming:</strong> Explicitly state the emotion observed (&ldquo;It sounds like you are feeling overwhelmed right now.&rdquo;)</li>
                    <li><strong className="text-blue-800">U - Understanding:</strong> Validate why the emotion is completely normal (&ldquo;Given this sudden diagnosis, it makes total sense you feel this way.&rdquo;)</li>
                    <li><strong className="text-blue-800">R - Respecting:</strong> Praise the patient’s resilience (&ldquo;You have handled so much pain over these past two weeks.&rdquo;)</li>
                    <li><strong className="text-blue-800">S - Supporting:</strong> Express ongoing presence (&ldquo;We are in this together; I will be here every step of the way.&rdquo;)</li>
                    <li><strong className="text-blue-800">E - Exploring:</strong> Gently invite them to elaborate (&ldquo;What part feels heaviest on your mind right now?&rdquo;)</li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'labs' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-blue-900">Haemoglobin &amp; Hematology Essentials</h4>
                  <p className="text-slate-600 text-xs">
                    Haemoglobin (Hb) reflects the oxygen-carrying capacity of red blood cells. Normal female range: 12.0–15.5 g/dL; male: 13.8–17.2 g/dL.
                  </p>
                  <div className="space-y-1.5 text-xs">
                    <p><strong className="text-blue-800">Mild/Moderate Anemia (8.0–10.9 g/dL):</strong> Presents as orthostatic fatigue, pallor, mild dyspnea, and tachycardia. In post-stent patients (Eleanor Vance, Hb 9.2), look for hematoma or blood loss.</p>
                    <p><strong className="text-blue-800">Anemia of Chronic Disease (Sarah Jenkins, Hb 10.1):</strong> Caused by autoimmune inflammation (elevated ESR/CRP), blunted erythropoietin response, and hepcidin sequestration of iron.</p>
                    <p><strong className="text-blue-800">Transfusion Threshold:</strong> Generally PRBC is considered for symptomatic cardiovascular patients with Hb &lt; 9.0–10.0 g/dL.</p>
                  </div>
                </div>
              )}

              {activeGuideTab === 'vitals' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-blue-900">Telemetry &amp; Waveform Interpretation</h4>
                  <p className="text-slate-600 text-xs">
                    The simulator monitors live physiological changes in response to empathy, positioning, and medications:
                  </p>
                  <ul className="space-y-2 text-xs">
                    <li><strong className="text-blue-800">Heart Rate (HR):</strong> Normal 60–100 bpm. Panic triggers autonomic tachycardia (Marcus Reyes, HR 118 bpm); empathetic de-escalation activates the vagus nerve and slows HR.</li>
                    <li><strong className="text-blue-800">Blood Pressure (NIBP):</strong> MAP = DBP + (SBP - DBP)/3. Sepsis produces distributive shock (Dr. Chen SBP 98/58); fluid resuscitation restores preload.</li>
                    <li><strong className="text-blue-800">SpO2:</strong> Target ≥ 95%. Asthma or anaphylaxis causes bronchospasm dropping SpO2 below 92%; nebulizers or Epinephrine reverse narrowing.</li>
                  </ul>
                </div>
              )}

              {activeGuideTab === 'codes' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-blue-900">Hospital Emergency Codes Summary</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                      <strong className="text-blue-800 block">CODE BLUE</strong>
                      Adult cardiac/respiratory arrest. Call 2222, start CPR immediately.
                    </div>
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                      <strong className="text-rose-800 block">CODE RED</strong>
                      Active fire/smoke. Follow RACE: Rescue, Alarm, Confine, Extinguish.
                    </div>
                    <div className="p-2.5 rounded-lg bg-orange-50 border border-orange-200">
                      <strong className="text-orange-800 block">CODE STEMI</strong>
                      Acute MI. Cath lab activation &lt;90 min door-to-balloon.
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50 border border-purple-200">
                      <strong className="text-purple-800 block">CODE SEPSIS</strong>
                      Lactate &gt;2, blood cultures, 30mL/kg IV fluid, broad-spectrum antibiotics &lt;1h.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: YouTube Video Launcher & Social Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* YouTube Video Resource Card */}
            <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Youtube className="w-6 h-6 text-rose-600" />
                <h3 className="font-extrabold text-base">Tutorial Video &amp; Walkthrough</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch the step-by-step video tutorial to learn how to navigate bedside dialogues, use empathy shortcuts, order haemoglobin tests, and interpret OSCE debriefs.
              </p>

              {/* Video Player Launcher Box */}
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="relative h-44 rounded-2xl bg-gradient-to-tr from-sky-100 via-blue-50 to-slate-100 border-2 border-sky-200 hover:border-blue-400 cursor-pointer overflow-hidden group flex items-center justify-center transition-all shadow-inner"
              >
                <div className="w-14 h-14 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-transform group-hover:scale-110">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
                <span className="absolute bottom-3 left-4 text-xs font-bold text-slate-800 bg-white/90 px-2.5 py-1 rounded-md border border-sky-200 shadow-2xs">
                  Click to Launch Video Tutorial
                </span>
              </div>

              {/* Configure/Edit Video URL */}
              <form onSubmit={handleSaveVideoUrl} className="pt-2 space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Configure YouTube Link:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={videoInputText}
                    onChange={(e) => setVideoInputText(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                  >
                    Save Link
                  </button>
                </div>
              </form>
            </div>

            {/* Official Social Media Channels */}
            <div className="bg-white rounded-3xl border border-sky-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 text-slate-900">
                <Share2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base">Community &amp; Social Channels</h3>
              </div>
              <p className="text-xs text-slate-600">
                Connect with our medical AI community, share debrief summaries, and access latest OSCE research.
              </p>

              <div>
                <a
                  href="https://www.instagram.com/aiassistantclinicalsimulation?utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 hover:from-pink-100 hover:to-amber-100 border border-pink-200 hover:border-pink-400 flex items-center justify-between gap-2.5 text-xs text-slate-800 font-bold transition shadow-2xs"
                >
                  <span className="flex items-center gap-2.5">
                    <Instagram className="w-5 h-5 text-pink-600 shrink-0" />
                    <span>Instagram (@aiassistantclinicalsimulation)</span>
                  </span>
                  <ExternalLink className="w-4 h-4 text-pink-600 shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT & PEDAGOGY SECTION */}
      <section id="about" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-sky-100">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Evidence-Based Clinical Pedagogy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Bridging Biological Precision with Deep Human Empathy
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Traditional simulation tools often isolate medical trivia from emotional reality. Clinical AI Simulator models patients as complete human beings—whose physiological vitals, fear thresholds, and clinical outcomes shift dynamically based on whether their healthcare provider listens empathetically or interrogates with rushed indifference.
            </p>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Validated against the Calgary-Cambridge Clinical Observation Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Full Closed-Loop Medication Administration (eMAR) with allergy intercepts</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Objective blood panel diagnostics focusing on Haemoglobin, cardiac enzymes, and electrolytes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-gradient-to-tr from-sky-50 to-blue-50 rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="px-3 py-2 rounded-2xl bg-white border border-sky-200 shadow-xs inline-flex items-center">
                <img
                  src="/assets/aistudio/ai_clinical_simulator_66b1e337.jpeg"
                  alt="AI Clinical Simulation Assistant"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">The Clinical AI Simulator Engine</h3>
                <span className="text-xs text-blue-700 font-semibold">Dynamic Latent State Modulation</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every turn is parsed by high-speed neural models trained on medical communication frameworks. When you validate a patient’s unspoken fear, their trust score increases, non-verbal muscle tension dissolves, and simulated heart rate normalizes.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onStartSimulation()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition"
              >
                Experience Live Simulation Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-sky-100">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Common Inquiries
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-sky-200 overflow-hidden shadow-2xs transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-blue-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                </button>
                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-sky-100 font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-sky-100">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Institutional &amp; Preceptor Inquiries
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Connect with Our Clinical Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Have questions about integrating Clinical AI Simulator into your nursing school, medical residency, or OSCE curriculum?
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-sky-200 shadow-sm">
          {contactSent ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2 text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-extrabold text-base text-emerald-950">Message Transmitted</h3>
              <p className="text-xs text-emerald-800">Thank you for reaching out. A clinical education liaison will contact you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Dr. Jordan Hayes, RN, MD"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jordan.hayes@med.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Institution or Program</label>
                <input
                  type="text"
                  placeholder="School of Medicine &amp; Health Sciences"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Share details regarding your clinical simulation, OSCE evaluation needs, or feature questions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Preceptor Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-sky-100 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/ai_clinical_simulator_66b1e337.jpeg"
              alt="AI Clinical Simulation Assistant"
              className="h-14 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-blue-600 transition">Home</a>
            <a href="#cases" className="hover:text-blue-600 transition">Cases</a>
            <a href="#study-guide" className="hover:text-blue-600 transition">Study Guide</a>
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <button
              onClick={() => onStartSimulation()}
              className="text-blue-600 hover:underline font-bold"
            >
              Start Simulator
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            &copy; 2026 Clinical AI Simulator. All rights reserved. For educational simulation only.
          </div>
        </div>
      </footer>

      {/* YouTube Video Modal Player */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl bg-white border border-sky-200 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Youtube className="w-5 h-5 text-rose-600" />
                <span>Clinical Simulator Video Walkthrough &amp; Orientation</span>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Embedded Video Area */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 flex items-center justify-center">
              {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                <iframe
                  title="Clinical Simulator Video Tutorial"
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${
                    videoUrl.includes('v=')
                      ? videoUrl.split('v=')[1]?.split('&')[0]
                      : videoUrl.split('/').pop()?.split('?')[0]
                  }`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Play className="w-12 h-12 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600">Custom video URL linked: {videoUrl}</p>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
                  >
                    <span>Open External Video Stream</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
              <span>Configured link: <strong className="text-slate-800">{videoUrl}</strong></span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
              >
                Close Video Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
