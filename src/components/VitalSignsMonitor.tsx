import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  Wind,
  Thermometer,
  AlertCircle,
  Volume2,
  VolumeX,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  Siren,
  LineChart as LineChartIcon
} from 'lucide-react';
import { VitalSigns, PatientProfile, PatientEmotionalState, VitalTrendPoint, HospitalEmergencyCode } from '../types';
import { VitalTrendsChart } from './VitalTrendsChart';
import { HospitalEmergencyCodesModal } from './HospitalEmergencyCodesModal';

interface VitalSignsMonitorProps {
  patient: PatientProfile;
  vitals: VitalSigns;
  currentState: PatientEmotionalState;
  trendHistory?: VitalTrendPoint[];
  onRefreshVitals?: () => void;
  onTriggerEmergencyCode?: (code: HospitalEmergencyCode) => void;
}

export const VitalSignsMonitor: React.FC<VitalSignsMonitorProps> = ({
  patient,
  vitals,
  currentState,
  trendHistory = [],
  onRefreshVitals,
  onTriggerEmergencyCode,
}) => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isEmergencyCodesOpen, setIsEmergencyCodesOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Fallback trend history if none provided yet
  const displayHistory: VitalTrendPoint[] = trendHistory.length > 0
    ? trendHistory
    : [
        { time: '08:00', hr: vitals.hr - 6, bpSystolic: vitals.bpSystolic + 4, bpDiastolic: vitals.bpDiastolic + 2, spo2: vitals.spo2 - 1, event: 'Admission' },
        { time: '08:15', hr: vitals.hr - 2, bpSystolic: vitals.bpSystolic + 2, bpDiastolic: vitals.bpDiastolic + 1, spo2: vitals.spo2, event: 'Triage' },
        { time: '08:30', hr: vitals.hr, bpSystolic: vitals.bpSystolic, bpDiastolic: vitals.bpDiastolic, spo2: vitals.spo2, event: 'Current Telemetry' },
      ];

  // Play subtle monitor pulse beep if audio enabled
  const playPulseBeep = (freq = 880) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {
      // Audio might be blocked by browser policy until user interacts
    }
  };

  // Animated ECG canvas simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Clear initial canvas with dark monitor background
    ctx.fillStyle = '#090e17';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    const drawGrid = () => {
      ctx.strokeStyle = '#112233';
      ctx.lineWidth = 0.5;
      for (let gx = 0; gx < width; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }
    };
    drawGrid();

    // Beat interval based on HR (ms per beat)
    const bpm = Math.max(45, Math.min(180, vitals.hr));
    let lastBeatTime = Date.now();
    const beatInterval = (60 / bpm) * 1000;

    let cyclePosition = 0; // 0 to 1 inside a heartbeat wave

    const render = () => {
      const now = Date.now();
      const elapsed = now - lastBeatTime;

      if (elapsed >= beatInterval) {
        lastBeatTime = now;
        cyclePosition = 0;
        playPulseBeep(vitals.hr > 100 ? 950 : 800);
      } else {
        cyclePosition = elapsed / beatInterval;
      }

      // Calculate ECG amplitude at this cycle position (Lead II P-Q-R-S-T wave)
      let yOffset = 0;
      if (cyclePosition > 0.08 && cyclePosition < 0.16) {
        // P wave
        yOffset = -Math.sin(((cyclePosition - 0.08) / 0.08) * Math.PI) * 12;
      } else if (cyclePosition >= 0.18 && cyclePosition < 0.20) {
        // Q dip
        yOffset = 6;
      } else if (cyclePosition >= 0.20 && cyclePosition < 0.24) {
        // R spike
        const rProgress = (cyclePosition - 0.20) / 0.04;
        yOffset = -Math.sin(rProgress * Math.PI) * 58;
      } else if (cyclePosition >= 0.24 && cyclePosition < 0.26) {
        // S dip
        yOffset = 14;
      } else if (cyclePosition > 0.32 && cyclePosition < 0.46) {
        // T wave
        yOffset = -Math.sin(((cyclePosition - 0.32) / 0.14) * Math.PI) * 18;
      }

      const currentY = midY + yOffset;

      // Draw sweeping phosphor line
      ctx.fillStyle = '#090e17';
      ctx.fillRect(x, 0, 16, height);

      // Re-draw grid in that cleared area
      ctx.strokeStyle = '#112233';
      ctx.lineWidth = 0.5;
      for (let gx = Math.floor(x / 20) * 20; gx < x + 16; gx += 20) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += 20) {
        ctx.beginPath();
        ctx.moveTo(x, gy);
        ctx.lineTo(x + 16, gy);
        ctx.stroke();
      }

      // Draw green neon ECG trace
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 6;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(Math.max(0, x - 2), midY);
      ctx.lineTo(x, currentY);
      ctx.stroke();

      // Sweep head dot
      ctx.fillStyle = '#6ee7b7';
      ctx.beginPath();
      ctx.arc(x, currentY, 2.5, 0, 2 * Math.PI);
      ctx.fill();

      // Reset shadow for performance
      ctx.shadowBlur = 0;

      // Advance sweep x
      x += 2.2;
      if (x >= width) {
        x = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vitals.hr, audioEnabled]);

  // MAP calculation
  const map = Math.round(vitals.bpDiastolic + (vitals.bpSystolic - vitals.bpDiastolic) / 3);

  // Status badges
  const isTachycardic = vitals.hr > 100;
  const isHypertensive = vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90;
  const isHypoxic = vitals.spo2 < 95;
  const isHighPain = vitals.pain >= 7;

  return (
    <div className="space-y-5">
      {/* Telemetry Bedside Monitor Card */}
      <div className="bg-slate-950 text-white rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden font-mono">
        {/* Top Telemetry Header */}
        <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-sm tracking-wider uppercase text-emerald-400">
                Bedside Telemetry Monitor
              </span>
            </div>
            <span className="text-xs text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded border border-slate-700 font-sans">
              {patient.name} • Room: {patient.history.room || 'Bedside 1'}
            </span>
            <span className="text-xs text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800 font-semibold font-sans">
              LEAD II: {vitals.rhythm}
            </span>
          </div>

          {/* Controls & Emergency Codes Launcher */}
          <div className="flex items-center gap-2">
            {/* Hospital Emergency Codes Button */}
            <button
              onClick={() => setIsEmergencyCodesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-sans bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 shadow-sm transition animate-pulse"
              title="View and trigger Hospital Emergency Codes (Code Red, Code Blue, Code STEMI)"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>Hospital Codes (Red/Blue)</span>
            </button>

            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-sans border transition ${
                audioEnabled
                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle pulse audio beeper"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{audioEnabled ? 'Pulse Audio ON' : 'Muted'}</span>
            </button>

            {onRefreshVitals && (
              <button
                onClick={onRefreshVitals}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold font-sans bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
                title="Re-cycle NIBP and update vital signs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Cycle Vitals</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Waveform & Vitals Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-800">
          {/* ECG Lead II Waveform Display (7 cols) */}
          <div className="lg:col-span-7 p-4 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between bg-slate-950">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                ECG LEAD II • 25 mm/s • 10 mm/mV
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans">
                {isTachycardic && (
                  <span className="text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 animate-pulse font-bold">
                    TACHYCARDIA ALERT
                  </span>
                )}
                <span>Filter: Monitor (0.5 - 40 Hz)</span>
              </div>
            </div>

            {/* Canvas Waveform */}
            <div className="relative w-full h-36 bg-[#090e17] rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <canvas
                ref={canvasRef}
                width={540}
                height={144}
                className="w-full h-full block"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-sans">
              <span>Rhythm: <strong className="text-slate-200">{vitals.rhythm}</strong></span>
              <span>Autonomic State: <strong className={currentState.anxiety > 60 ? 'text-amber-400' : 'text-emerald-400'}>Anxiety {currentState.anxiety}%</strong></span>
            </div>
          </div>

          {/* Telemetry Digits Matrix (5 cols) */}
          <div className="lg:col-span-5 p-4 grid grid-cols-2 gap-3 bg-slate-900/50">
            {/* Heart Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  HR (bpm)
                </span>
                <span className="text-[10px] text-slate-500">60 - 100</span>
              </div>
              <div className="my-1">
                <span className={`text-4xl font-extrabold tracking-tight ${isTachycardic ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {vitals.hr}
                </span>
                <span className="text-xs text-slate-400 ml-1">bpm</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between font-sans">
                <span>{isTachycardic ? 'Sinus Tachycardia' : 'Normal Sinus'}</span>
                {vitals.hr > 100 ? (
                  <span className="text-rose-400 flex items-center font-bold"><TrendingUp className="w-3 h-3 mr-0.5" /> High</span>
                ) : (
                  <span className="text-emerald-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-0.5" /> Normal</span>
                )}
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-rose-400" />
                  NIBP (mmHg)
                </span>
                <span className="text-[10px] text-slate-500">MAP ({map})</span>
              </div>
              <div className="my-1">
                <span className={`text-3xl font-extrabold tracking-tight ${isHypertensive ? 'text-amber-400' : 'text-rose-400'}`}>
                  {vitals.bpSystolic}/{vitals.bpDiastolic}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between font-sans">
                <span>Sys / Dia</span>
                {isHypertensive ? (
                  <span className="text-amber-400 font-bold">Elevated</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Normotensive</span>
                )}
              </div>
            </div>

            {/* SpO2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-cyan-400" />
                  SpO2 (%)
                </span>
                <span className="text-[10px] text-slate-500">&gt; 95%</span>
              </div>
              <div className="my-1">
                <span className={`text-4xl font-extrabold tracking-tight ${isHypoxic ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {vitals.spo2}
                </span>
                <span className="text-xs text-slate-400 ml-1">%</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between font-sans">
                <span>Pleth: Good</span>
                <span className="text-cyan-300 font-bold">Room Air</span>
              </div>
            </div>

            {/* Respiration Rate */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  RR (/min)
                </span>
                <span className="text-[10px] text-slate-500">12 - 20</span>
              </div>
              <div className="my-1">
                <span className={`text-4xl font-extrabold tracking-tight ${vitals.rr > 22 ? 'text-rose-400' : 'text-amber-400'}`}>
                  {vitals.rr}
                </span>
                <span className="text-xs text-slate-400 ml-1">/min</span>
              </div>
              <div className="text-[10px] text-slate-400 flex items-center justify-between font-sans">
                <span>{vitals.rr > 22 ? 'Tachypnea' : 'Eupnea'}</span>
                {vitals.rr > 22 ? (
                  <span className="text-rose-400 font-bold">Fast</span>
                ) : (
                  <span className="text-emerald-400 font-bold">Normal</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Parameters Bar (Temp & Pain & Lab Alert) */}
        <div className="px-4 py-3 bg-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs font-sans">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Core Temp:</span>
              <strong className="text-slate-200 text-sm font-mono">{vitals.temp} °C</strong>
              <span className="text-[11px] text-slate-500">({((vitals.temp * 9) / 5 + 32).toFixed(1)} °F)</span>
            </div>

            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-slate-400">Patient Pain VAS:</span>
              <strong className={`text-sm font-mono ${isHighPain ? 'text-rose-400' : 'text-slate-200'}`}>
                {vitals.pain} / 10
              </strong>
              <span className="text-[11px] text-slate-500">
                ({vitals.pain >= 7 ? 'Severe' : vitals.pain >= 4 ? 'Moderate' : 'Mild'})
              </span>
            </div>

            {/* Quick link indicator to Haemoglobin / CBC */}
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
              <Droplet className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-slate-300">
                Recent Haemoglobin: <strong className={patient.labs.find(l => l.id === 'hb')?.flag === 'low' ? 'text-amber-400 font-mono' : 'text-emerald-400 font-mono'}>
                  {patient.labs.find(l => l.id === 'hb')?.value || '--'} {patient.labs.find(l => l.id === 'hb')?.unit || 'g/dL'}
                </strong>
              </span>
              {patient.labs.find(l => l.id === 'hb')?.flag === 'low' && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-800">
                  LOW Hb
                </span>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Real-time response active: Vitals dynamically shift with student empathy &amp; interventions.</span>
          </div>
        </div>
      </div>

      {/* RECHARTS VITAL TRENDS VISUALIZATION (Direct User Request) */}
      <VitalTrendsChart trendHistory={displayHistory} />

      {/* Hospital Emergency Codes Modal */}
      <HospitalEmergencyCodesModal
        isOpen={isEmergencyCodesOpen}
        onClose={() => setIsEmergencyCodesOpen(false)}
        onTriggerCode={(code) => {
          if (onTriggerEmergencyCode) {
            onTriggerEmergencyCode(code);
          }
        }}
      />
    </div>
  );
};
