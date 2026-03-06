'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Planet = {
  id: string;
  name: string;
  period_days: number;
  radius_earth: number;
  habitabilty_score: number;
  discovery: string;
};

const DEMO_PLANETS: Planet[] = [
  { id: 'k22b', name: 'Kepler-22b', period_days: 289.9, radius_earth: 2.4, habitabilty_score: 72, discovery: 'Kepler (2011)' },
  { id: 't1e', name: 'TRAPPIST-1e', period_days: 6.1, radius_earth: 0.92, habitabilty_score: 85, discovery: 'Spitzer/Kepler' },
  { id: 'toi700', name: 'TOI-700 d', period_days: 37.4, radius_earth: 1.14, habitabilty_score: 82, discovery: 'TESS (2020)' },
  { id: 'k186f', name: 'Kepler-186f', period_days: 129.9, radius_earth: 1.11, habitabilty_score: 80, discovery: 'Kepler (2014)' },
  { id: 'k452b', name: 'Kepler-452b', period_days: 384.8, radius_earth: 1.63, habitabilty_score: 78, discovery: 'Kepler (2015)' },
];

export default function ComparePage() {
  const searchParams = useSearchParams();
  const addId = searchParams.get('add');
  const [selected, setSelected] = useState<Planet[]>([]);

  useEffect(() => {
    if (!addId) return;
    const p = DEMO_PLANETS.find((x) => x.id === addId);
    if (p) {
      setSelected((prev) => {
        if (prev.some((s) => s.id === p.id)) return prev;
        if (prev.length >= 3) return prev;
        return [...prev, p];
      });
    }
  }, [addId]);

  const toggle = (p: Planet) => {
    if (selected.some((s) => s.id === p.id)) {
      setSelected(selected.filter((s) => s.id !== p.id));
    } else if (selected.length < 3) {
      setSelected([...selected, p]);
    }
  };

  return (
    <main className="min-h-screen">
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Compare Planets</h1>
          <p className="text-slate-400">Select up to 3 planets to compare side-by-side.</p>
        </motion.div>

        <motion.div className="flex flex-wrap gap-3 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {DEMO_PLANETS.map((p) => (
            <motion.button
              key={p.id}
              onClick={() => toggle(p)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${selected.some((s) => s.id === p.id) ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400' : 'bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/50'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {p.name}
            </motion.button>
          ))}
        </motion.div>

        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse rounded-2xl overflow-hidden border border-white/10">
              <thead>
                <tr className="bg-white/5">
                  <th className="text-left p-4 text-cyan-400 font-semibold">Metric</th>
                  {selected.map((p) => (
                    <th key={p.id} className="text-left p-4 text-slate-200 font-semibold">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-white/10"><td className="p-4 text-slate-400">Period (days)</td>{selected.map((p) => <td key={p.id} className="p-4">{p.period_days.toFixed(1)}</td>)}</tr>
                <tr className="border-t border-white/10"><td className="p-4 text-slate-400">Radius (R⊕)</td>{selected.map((p) => <td key={p.id} className="p-4">{p.radius_earth}</td>)}</tr>
                <tr className="border-t border-white/10">
                  <td className="p-4 text-slate-400">Habitability</td>
                  {selected.map((p) => (
                    <td key={p.id} className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${p.habitabilty_score}%`,
                              backgroundColor: p.habitabilty_score >= 70 ? '#22c55e' : p.habitabilty_score >= 40 ? '#eab308' : '#ef4444',
                            }}
                          />
                        </div>
                        <span className={p.habitabilty_score >= 70 ? 'text-green-400 font-medium' : p.habitabilty_score >= 40 ? 'text-yellow-400' : 'text-red-400'}>
                          {p.habitabilty_score}/100
                        </span>
                        {p.habitabilty_score === Math.max(...selected.map((s) => s.habitabilty_score)) && selected.length > 1 && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-400">Best</span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-white/10"><td className="p-4 text-slate-400">Discovery</td>{selected.map((p) => <td key={p.id} className="p-4 text-slate-300">{p.discovery}</td>)}</tr>
              </tbody>
            </table>
          </motion.div>
        )}

        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Link href="/dashboard" className="text-cyan-400 hover:text-cyan-300 text-sm">← Back to Dashboard</Link>
        </motion.div>
      </section>
    </main>
  );
}
