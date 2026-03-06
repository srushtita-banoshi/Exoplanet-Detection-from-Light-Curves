'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PlanetCard } from '@/components/PlanetCard';
import { SpaceScene3D } from '@/components/SpaceScene3DLazy';
import { ExoplanetData3D } from '@/components/ExoplanetData3DLazy';

type Planet = {
  id: string;
  name: string;
  period_days: number;
  radius_earth: number;
  habitabilty_score: number;
  discovery: string;
  description?: string;
};

export default function DashboardPage() {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'hab' | 'period' | 'radius'>('hab');

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api/get-demo-data` : '/api/get-demo-data')
      .then((r) => r.json())
      .then((d) => {
        setPlanets(d.planets || []);
        setLoading(false);
      })
      .catch(() => {
        setPlanets([
          { id: 'k22b', name: 'Kepler-22b', period_days: 289.9, radius_earth: 2.4, habitabilty_score: 72, discovery: 'Kepler (2011)' },
          { id: 't1e', name: 'TRAPPIST-1e', period_days: 6.1, radius_earth: 0.92, habitabilty_score: 85, discovery: 'Spitzer/Kepler' },
          { id: 'toi700', name: 'TOI-700 d', period_days: 37.4, radius_earth: 1.14, habitabilty_score: 82, discovery: 'TESS (2020)' },
          { id: 'k186f', name: 'Kepler-186f', period_days: 129.9, radius_earth: 1.11, habitabilty_score: 80, discovery: 'Kepler (2014)' },
          { id: 'k452b', name: 'Kepler-452b', period_days: 384.8, radius_earth: 1.63, habitabilty_score: 78, discovery: 'Kepler (2015)' },
        ]);
        setLoading(false);
      });
  }, []);

  const sorted = [...planets].sort((a, b) => {
    if (sortBy === 'hab') return b.habitabilty_score - a.habitabilty_score;
    if (sortBy === 'period') return a.period_days - b.period_days;
    return a.radius_earth - b.radius_earth;
  });

  return (
    <main className="min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">Detection Leaderboard</h1>
            <p className="text-slate-500 text-sm">Click a planet for full analysis. Compare up to 3.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">Sort by</span>
            {(['hab', 'period', 'radius'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${sortBy === s ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30' : 'text-slate-400 border border-white/10 hover:border-cyan-400/20'}`}
              >
                {s === 'hab' ? 'Habitability' : s === 'period' ? 'Period' : 'Radius'}
              </button>
            ))}
            <Link href="/compare" className="ml-2">
              <motion.span
                className="inline-block px-3 py-1.5 rounded-lg border border-cyan-400/40 text-cyan-400 text-xs font-medium"
                whileHover={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
              >
                Compare →
              </motion.span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <SpaceScene3D compact />
        </motion.div>

        {loading ? (
          <motion.div className="flex items-center gap-3 text-slate-400 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-4 h-4 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin" />
            Loading...
          </motion.div>
        ) : (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            >
              {sorted.map((p, i) => (
                <PlanetCard key={p.id} planet={p} index={i} />
              ))}
            </motion.div>

            <motion.div
              className="mt-10 p-5 rounded-xl bg-white/[0.02] border border-white/10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-cyan-400 font-semibold text-sm mb-2">3D dataset visualization</h3>
              <p className="text-slate-500 text-xs mb-4">
                Planets vs star reference. Sphere size ∝ radius. Period (X), Radius (Y), Habitability (Z). Drag to rotate.
              </p>
              <ExoplanetData3D />
            </motion.div>
          </>
        )}
      </section>
    </main>
  );
}
