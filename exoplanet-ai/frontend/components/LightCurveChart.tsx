'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

type Point = { time: number; flux: number };

export function LightCurveChart({ data, dips = [] }: { data: Point[]; dips?: [number, number][] }) {
  const chartData = useMemo(() => data.map((d) => ({ ...d, time: Number(d.time.toFixed(2)) })), [data]);
  const yDomain = useMemo(() => {
    const fluxes = data.map((d) => d.flux);
    const minF = Math.min(...fluxes);
    const maxF = Math.max(...fluxes);
    const padding = (maxF - minF) * 0.3 || 0.01;
    return [Math.max(0, minF - padding), Math.min(1.02, maxF + padding)];
  }, [data]);
  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={yDomain as [number, number]} width={40} />
          <Tooltip
            contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            labelStyle={{ color: '#22d3ee' }}
            formatter={(value: number) => (
              <span className="text-slate-200">
                {(value * 100).toFixed(3)}% brightness
                {value < 0.998 && <span className="block text-cyan-400 text-xs mt-0.5">↓ Transit — planet blocking starlight</span>}
              </span>
            )}
            labelFormatter={(t) => `Day ${t}`}
          />
          <ReferenceLine y={1} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
          <Line type="monotone" dataKey="flux" stroke="#22d3ee" strokeWidth={2} dot={false} strokeLinecap="round" name="Flux" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
