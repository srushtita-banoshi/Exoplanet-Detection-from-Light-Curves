'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightCurveChart } from '@/components/LightCurveChart';
import { HabitabilityDetail } from '@/components/HabitabilityDetail';
import { DetectionProgress } from '@/components/DetectionProgress';
import { fireConfetti } from '@/components/Confetti';

type Point = { time: number; flux: number };

/** Client-side demo detection: fully data-driven from this light curve. */
function runDemoDetection(time: number[], flux: number[]): {
  probability: number;
  period: number;
  explanation: string;
  habitability_score: number;
  radius_earth: number;
} {
  const n = flux.length;
  if (n < 10) return { probability: 0, period: 0, explanation: 'Not enough data.', habitability_score: 0, radius_earth: 1 };
  const meanFlux = flux.reduce((a, b) => a + b, 0) / n;
  const minFlux = Math.min(...flux);
  const maxFlux = Math.max(...flux);
  const depth = maxFlux > minFlux ? (maxFlux - minFlux) / maxFlux : 0;
  const std = Math.sqrt(flux.reduce((s, f) => s + (f - meanFlux) ** 2, 0) / n) || 0.001;
  const threshold = meanFlux - 0.5 * std;

  const dipIndices: number[] = [];
  for (let i = 1; i < n - 1; i++) {
    const f = flux[i]!;
    if (f <= (flux[i - 1] ?? 1) && f <= (flux[i + 1] ?? 1) && f < meanFlux) {
      dipIndices.push(i);
    }
  }
  if (dipIndices.length === 0) {
    for (let i = 0; i < n; i++) {
      if (flux[i]! < threshold) dipIndices.push(i);
    }
  }
  const dipTimes = dipIndices.map((i) => time[i] ?? 0).filter((t) => t >= 0);
  const uniqueDips: number[] = [];
  let last = -1e9;
  for (const t of dipTimes) {
    if (t - last > (time[n - 1]! - time[0]!) / (n || 1) * 3) {
      uniqueDips.push(t);
      last = t;
    }
  }
  const dipCount = uniqueDips.length;

  let period = 0;
  if (uniqueDips.length >= 2) {
    const intervals: number[] = [];
    for (let j = 1; j < uniqueDips.length; j++) {
      const dt = uniqueDips[j]! - uniqueDips[j - 1]!;
      if (dt > 0) intervals.push(dt);
    }
    if (intervals.length > 0) {
      intervals.sort((a, b) => a - b);
      period = intervals[Math.floor(intervals.length / 2)] ?? 0;
      const intervalStd = Math.sqrt(intervals.reduce((s, d) => s + (d - period) ** 2, 0) / intervals.length) || 0;
      if (intervalStd > period * 0.5 && intervals.length >= 2) {
        const short = intervals.filter((d) => d < period * 1.5);
        if (short.length > 0) period = short[Math.floor(short.length / 2)] ?? period;
      }
    }
  }
  if (period <= 0 && n >= 20) {
    const tSpan = time[n - 1]! - time[0]!;
    let bestCorr = -1e9;
    const step = tSpan / 50;
    for (let p = step; p <= tSpan / 2; p += step) {
      let corr = 0;
      let count = 0;
      for (let i = 0; i < n; i++) {
        const ti = time[i]!;
        const j = time.findIndex((t) => Math.abs(t - (ti + p)) < (time[1]! - time[0]!) * 0.5);
        if (j >= 0 && j < n) {
          corr += (flux[i]! - meanFlux) * (flux[j]! - meanFlux);
          count++;
        }
      }
          if (count > 5 && corr > bestCorr) {
        bestCorr = corr;
        period = p;
      }
    }
  }
  if (period <= 0 && time.length >= 2) {
    const tSpan = time[n - 1]! - time[0]!;
    period = tSpan / Math.max(1, dipCount || 1);
  }

  const regularity = (() => {
    if (uniqueDips.length < 2) return 0;
    const intervals: number[] = [];
    for (let j = 1; j < uniqueDips.length; j++) intervals.push(uniqueDips[j]! - uniqueDips[j - 1]!);
    const med = intervals.sort((a, b) => a - b)[Math.floor(intervals.length / 2)] ?? 0;
    const dev = Math.sqrt(intervals.reduce((s, d) => s + (d - med) ** 2, 0) / intervals.length) || 0;
    return med > 0 ? Math.max(0, 1 - dev / med) : 0;
  })();
  const depthNorm = Math.min(1, depth / 0.03);
  // More dips → higher probability; fewer dips → lower probability (main driver)
  const dipFactor = Math.min(1, dipCount / 10);
  let probability = 0.12 + 0.52 * dipFactor + 0.2 * depthNorm + 0.1 * regularity + (period > 0 ? 0.06 : 0);
  probability = Math.min(0.96, Math.max(0.12, probability));
  if (dipCount <= 1) probability = Math.min(probability, 0.42);
  else if (dipCount >= 6) probability = Math.max(probability, 0.65);

  const radius_earth = Math.max(0.5, Math.min(3, 0.5 + 6 * Math.sqrt(Math.max(0, depth))));
  const aAu = period > 0 ? (period * period / (365.25 * 365.25)) ** (1 / 3) : 0;
  const inZone = aAu >= 0.95 && aAu <= 1.37;
  const distScore = inZone ? 100 * Math.max(0, 1 - Math.abs(aAu - 1.16) / 0.4) : 30;
  const sizeScore = 100 * Math.max(0, 1 - 0.4 * Math.abs(radius_earth - 1.1));
  const habScore = Math.round(0.55 * distScore + 0.45 * sizeScore);
  const explanation = 'Demo mode: detection and period estimated from this light curve (backend offline). Start FastAPI on port 8000 for full ML pipeline.';
  return {
    probability,
    period,
    explanation,
    habitability_score: Math.min(100, Math.max(0, habScore)),
    radius_earth,
  };
}

export default function AnalyzerPage() {
  const [time, setTime] = useState<number[]>([]);
  const [flux, setFlux] = useState<number[]>([]);
  const [fileError, setFileError] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState<{
    probability?: number;
    period_used?: number;
    explanation?: string;
    transit_dips?: [number, number][];
  } | null>(null);
  const [periodEst, setPeriodEst] = useState<{ period?: number } | null>(null);
  const [habResult, setHabResult] = useState<{ habitabilty_score?: number; radius_earth?: number } | null>(null);
  const [progress, setProgress] = useState(0);

  const chartData: Point[] = time.map((t, i) => ({ time: t, flux: flux[i] ?? 0 })).filter((d) => d.flux !== undefined);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    setResult(null);
    setPeriodEst(null);
    setHabResult(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setFileError('CSV needs header + data rows');
      return;
    }
    const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const timeIdx = headers.findIndex((h) => h === 'time');
    const fluxIdx = headers.findIndex((h) => h === 'flux');
    if (timeIdx < 0 || fluxIdx < 0) {
      setFileError('CSV must have "time" and "flux" columns');
      return;
    }
    const t: number[] = [];
    const f: number[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cells = lines[i].split(',');
      const tv = parseFloat(cells[timeIdx]);
      const fv = parseFloat(cells[fluxIdx]);
      if (!Number.isNaN(tv) && !Number.isNaN(fv)) {
        t.push(tv);
        f.push(fv);
      }
    }
    if (t.length < 10) {
      setFileError('Need at least 10 valid (time, flux) points');
      return;
    }
    setTime(t);
    setFlux(f);
  };

  const runPrediction = async () => {
    if (time.length < 10 || flux.length < 10) return;
    setPredicting(true);
    setResult(null);
    setPeriodEst(null);
    setHabResult(null);
    setProgress(0);
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const steps = [0.2, 0.4, 0.6, 0.8, 1];
    let stepIdx = 0;
    const advance = () => { if (stepIdx < steps.length) setProgress(steps[stepIdx++]); };
    try {
      advance();
      const [predRes, periodRes] = await Promise.all([
        fetch(`${base}/api/predict-exoplanet`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ time, flux }) }),
        fetch(`${base}/api/estimate-period`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ time, flux }) }),
      ]);
      advance();
      const pred = await predRes.json().catch(() => ({}));
      const period = await periodRes.json().catch(() => ({}));
      advance();
      const backendOk = predRes.ok && periodRes.ok && (pred.probability != null || period.period != null);
      if (backendOk) {
        setResult({ ...pred, period_used: pred.period_used ?? period.period });
        setPeriodEst(period);
        if (period?.period) {
          try {
            const habRes = await fetch(`${base}/api/habitabilty-score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ period_days: period.period, planet_radius_earth: 1.2 }) });
            if (habRes.ok) {
              const hab = await habRes.json();
              setHabResult(hab);
            }
          } catch {
            setHabResult({ habitabilty_score: Math.min(100, Math.round(50 + period.period * 0.05)) });
          }
        }
        if ((pred.probability ?? 0) > 0.5) fireConfetti();
      } else {
        const demo = runDemoDetection(time, flux);
        setResult({
          probability: demo.probability,
          period_used: demo.period,
          explanation: demo.explanation,
        });
        setPeriodEst({ period: demo.period });
        setHabResult({ habitabilty_score: demo.habitability_score, radius_earth: demo.radius_earth });
        if (demo.probability > 0.5) fireConfetti();
      }
      advance();
      setProgress(1);
    } catch (e) {
      const demo = runDemoDetection(time, flux);
      setResult({
        probability: demo.probability,
        period_used: demo.period,
        explanation: demo.explanation,
      });
      setPeriodEst({ period: demo.period });
      setHabResult({ habitabilty_score: demo.habitability_score, radius_earth: demo.radius_earth });
      if (demo.probability > 0.5) fireConfetti();
    } finally {
      setPredicting(false);
      setProgress(0);
    }
  };

  return (
    <main className="min-h-screen">
      <section className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Light Curve Analyzer</h1>
          <p className="text-slate-400">Upload a CSV (time, flux) or use sample data. Run detection to get probability, period, and habitability.</p>
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label>
            <motion.span
              className="inline-block px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 cursor-pointer"
              whileHover={{ borderColor: 'rgba(34, 211, 238, 0.5)', backgroundColor: 'rgba(255,255,255,0.08)' }}
              whileTap={{ scale: 0.98 }}
            >
              Upload CSV
            </motion.span>
            <input type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />
          </label>
          <motion.button
            onClick={runPrediction}
            disabled={time.length < 10 || predicting}
            className="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-900 font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={time.length >= 10 && !predicting ? { scale: 1.02, boxShadow: '0 0 24px rgba(34, 211, 238, 0.4)' } : {}}
            whileTap={{ scale: 0.98 }}
          >
            {predicting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Running...
              </span>
            ) : (
              'Detect exoplanet'
            )}
          </motion.button>
        </motion.div>

        {predicting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 rounded-xl bg-white/[0.03] border border-white/10">
            <DetectionProgress progress={progress} />
          </motion.div>
        )}

        {fileError && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-400 text-sm mb-6"
          >
            {fileError}
          </motion.p>
        )}

        <AnimatePresence mode="wait">
          {chartData.length > 0 ? (
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] p-4 mb-8">
                <LightCurveChart data={chartData} dips={result?.transit_dips || []} />
              </div>
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
                  >
                    <h3 className="text-cyan-400 font-semibold mb-4">Detection result</h3>
                    <div className="space-y-2 text-slate-300">
                      <p>Probability: <span className="text-cyan-400 font-medium">{Math.round((result.probability ?? 0) * 100)}%</span></p>
                      <p>Period: <span className="text-cyan-400 font-medium">{(result.period_used ?? periodEst?.period) != null ? Number(result.period_used ?? periodEst?.period).toFixed(2) : '—'} d</span></p>
                    </div>
                    {habResult?.habitabilty_score != null && periodEst?.period != null && (
                      <div className="mt-6">
                        <HabitabilityDetail score={habResult.habitabilty_score} periodDays={periodEst.period} radiusEarth={habResult.radius_earth ?? 1.2} name="Detected candidate" />
                      </div>
                    )}
                    <p className="text-slate-400 mt-4 text-sm leading-relaxed">{result.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-12 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] text-center"
            >
              <p className="text-slate-500 mb-2">Upload a CSV with columns <code className="text-cyan-400/80 px-1.5 py-0.5 rounded bg-white/5">time</code>, <code className="text-cyan-400/80 px-1.5 py-0.5 rounded bg-white/5">flux</code></p>
              <p className="text-slate-600 text-sm">to visualize and run detection.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
