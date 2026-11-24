import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Activity, Heart, Droplet, Wind, TrendingUp, Sparkles, Filter } from 'lucide-react';
import { VitalTrendPoint } from '../types';

interface VitalTrendsChartProps {
  trendHistory: VitalTrendPoint[];
}

export const VitalTrendsChart: React.FC<VitalTrendsChartProps> = ({ trendHistory }) => {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'hr' | 'bp' | 'spo2'>('all');

  // Custom Dark Futuristic Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload as VitalTrendPoint;
      return (
        <div className="bg-slate-950/95 border border-sky-500/40 p-3 rounded-xl shadow-2xl backdrop-blur-md text-xs font-mono">
          <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1.5 flex items-center justify-between gap-3">
            <span>Timestamp: {label}</span>
            {dataPoint.event && (
              <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800 font-sans">
                {dataPoint.event}
              </span>
            )}
          </div>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span style={{ color: entry.color }} className="font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                  {entry.name}:
                </span>
                <strong className="text-white text-sm">
                  {entry.value} {entry.dataKey === 'hr' ? 'bpm' : entry.dataKey === 'spo2' ? '%' : 'mmHg'}
                </strong>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl border-2 border-slate-800 p-4 sm:p-5 shadow-xl font-mono space-y-4">
      {/* Header & Metric Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-xs">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wider uppercase text-emerald-400 flex items-center gap-2">
              <span>Session Vital Trends (Recharts)</span>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-sans font-normal">
                {trendHistory.length} Telemetry Epochs Logged
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Continuous retrospective telemetry recording physiological responses to clinical actions.
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-sans">
          <button
            onClick={() => setSelectedMetric('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              selectedMetric === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Parameters
          </button>
          <button
            onClick={() => setSelectedMetric('hr')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              selectedMetric === 'hr'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            <Heart className="w-3 h-3 text-emerald-400" />
            <span>HR Only</span>
          </button>
          <button
            onClick={() => setSelectedMetric('bp')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              selectedMetric === 'bp'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Droplet className="w-3 h-3 text-rose-400" />
            <span>BP Only</span>
          </button>
          <button
            onClick={() => setSelectedMetric('spo2')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
              selectedMetric === 'spo2'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'text-slate-400 hover:text-cyan-400'
            }`}
          >
            <Wind className="w-3 h-3 text-cyan-400" />
            <span>SpO2 Only</span>
          </button>
        </div>
      </div>

      {/* Recharts Area Container */}
      <div className="w-full h-72 sm:h-80 bg-[#090e17] rounded-xl p-2 sm:p-4 border border-slate-800/80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#162234" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={[40, 180]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickLine={{ stroke: '#334155' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 10, fontSize: 12, fontFamily: 'sans-serif' }}
            />

            {/* Normal reference thresholds */}
            <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.4} label={{ value: 'Tachycardia (100 bpm)', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={140} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.3} label={{ value: 'Hypertension (140 mmHg)', fill: '#f59e0b', fontSize: 10 }} />

            {/* Heart Rate Line */}
            {(selectedMetric === 'all' || selectedMetric === 'hr') && (
              <Line
                type="monotone"
                dataKey="hr"
                name="Heart Rate (bpm)"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981', stroke: '#090e17', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#34d399', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}

            {/* Systolic BP Line */}
            {(selectedMetric === 'all' || selectedMetric === 'bp') && (
              <Line
                type="monotone"
                dataKey="bpSystolic"
                name="Systolic BP (mmHg)"
                stroke="#f43f5e"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#f43f5e', stroke: '#090e17', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#fb7185', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}

            {/* Diastolic BP Line */}
            {(selectedMetric === 'all' || selectedMetric === 'bp') && (
              <Line
                type="monotone"
                dataKey="bpDiastolic"
                name="Diastolic BP (mmHg)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#f59e0b', stroke: '#090e17', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#fbbf24', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}

            {/* SpO2 Line */}
            {(selectedMetric === 'all' || selectedMetric === 'spo2') && (
              <Line
                type="monotone"
                dataKey="spo2"
                name="Oxygen Saturation SpO2 (%)"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ r: 3, fill: '#06b6d4', stroke: '#090e17', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#22d3ee', stroke: '#ffffff', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Epoch Legend & Summary Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <strong className="text-slate-300">HR</strong>: Target 60–100 bpm
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <strong className="text-slate-300">SBP</strong>: Target 90–130 mmHg
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <strong className="text-slate-300">DBP</strong>: Target 60–80 mmHg
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <strong className="text-slate-300">SpO2</strong>: Target ≥ 95%
          </span>
        </div>

        <span className="text-emerald-400/90 font-mono text-[10px]">
          Live Trend Engine: Automatically logs updates after interventions &amp; dialogue shifts.
        </span>
      </div>
    </div>
  );
};
