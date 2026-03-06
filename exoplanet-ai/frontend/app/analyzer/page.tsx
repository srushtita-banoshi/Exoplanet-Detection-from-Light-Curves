'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LightCurveChart } from '@/components/LightCurveChart';
import { HabitabilityDetail } from '@/components/HabitabilityDetail';
import { DetectionProgress } from '@/components/DetectionProgress';
import { fireConfetti } from '@/components/Confetti';

type Point = { time: number; flux: number };

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
  const [habResult, setHabResult] = useState<{ habitabilty_score?: number } | null>(null);
  const [progress, setProgress] = useState(0);

  const chartData: Point[] = time.map((t, i) => ({ time: t, flux: flux[i] ?? 0 })).filter((d) => d.flux !== undefined);

  const downloadSample = () => {
    const csv = 'time,flux\n0,1\n0.5,0.999\n1,0.998\n1.5,0.992\n2,0.99\n2.5,0.992\n3,0.998\n3.5,1\n4,1\n4.5,0.999\n5,0.998\n5.5,0.991\n6,0.99\n6.5,0.991\n7,0.998\n7.5,1\n8,1';
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'sample_lightcurve.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

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
      const pred = await predRes.json();
      const period = await periodRes.json();
      advance();
      setResult(pred);
      setPeriodEst(period);
      if (period?.period) {
        const habRes = await fetch(`${base}/api/habitabilty-score`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ period_days: period.period, planet_radius_earth: 1.2 }) });
        const hab = await habRes.json();
        setHabResult(hab);
      }
      advance();
      setProgress(1);
      if ((pred.probability ?? 0) > 0.5) fireConfetti();
    } catch (e) {
      setResult({ explanation: 'Backend unavailable. Start FastAPI (port 8000) and try again.' });
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
          <motion.button
            onClick={downloadSample}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm"
            whileHover={{ borderColor: 'rgba(34, 211, 238, 0.5)' }}
          >
            Download sample CSV
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
                      <p>Probability: <span className="text-cyan-400 font-medium">{(result.probability ?? 0) * 100}%</span></p>
                      <p>Period: <span className="text-cyan-400 font-medium">{result.period_used?.toFixed(2) ?? periodEst?.period?.toFixed(2) ?? '—'} d</span></p>
                    </div>
                    {habResult?.habitabilty_score != null && periodEst?.period && (
                      <div className="mt-6">
                        <HabitabilityDetail score={habResult.habitabilty_score} periodDays={periodEst.period} radiusEarth={1.2} name="Detected candidate" />
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
