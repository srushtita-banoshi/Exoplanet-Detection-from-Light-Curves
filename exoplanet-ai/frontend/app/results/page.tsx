'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HabitabilityDetail } from '@/components/HabitabilityDetail';
import { LightCurveChart } from '@/components/LightCurveChart';
import { PlanetView3D } from '@/components/PlanetView3DLazy';
import { ExoplanetData3D } from '@/components/ExoplanetData3DLazy';
import { MoreAboutHabitability } from '@/components/MoreAboutHabitability';

function semiMajorAxisAu(periodDays: number): string {
  const aAu = (periodDays * periodDays / (365.25 * 365.25)) ** (1 / 3);
  return aAu.toFixed(3);
}

function inHabitableZone(periodDays: number): boolean {
  const aAu = (periodDays * periodDays / (365.25 * 365.25)) ** (1 / 3);
  return aAu >= 0.95 && aAu <= 1.37;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '';
  const name = searchParams.get('name') || 'Unknown';
  const period = parseFloat(searchParams.get('period') || '1');
  const radius = parseFloat(searchParams.get('radius') || '1');
  const hab = parseFloat(searchParams.get('hab') || '0');
  const discovery = searchParams.get('discovery') || '';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/dashboard');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router]);

  const [chartData] = useState(() => {
    const t: number[] = [];
    const f: number[] = [];
    const n = 120;
    for (let i = 0; i < n; i++) {
      const ti = (i / (n - 1)) * period * 4;
      const phase = (ti % period) / period;
      const inDip = phase >= 0.48 && phase <= 0.52;
      const flux = inDip ? 1 - 0.01 * radius : 1 + (Math.random() - 0.5) * 0.002;
      t.push(ti);
      f.push(flux);
    }
    return t.map((time, i) => ({ time, flux: f[i]! }));
  });

  const habColor = hab >= 70 ? 'text-green-400' : hab >= 40 ? 'text-amber-400' : 'text-rose-400';

  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header — compact row */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-slate-400 hover:text-cyan-400 text-sm transition-colors flex items-center gap-1"
            >
              ← Dashboard
            </Link>
            <span className="text-slate-600">|</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{name}</h1>
              <p className="text-slate-500 text-sm">{discovery}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={id ? `/compare?add=${id}` : '/compare'}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
            >
              + Compare
            </Link>
            <button
              onClick={() => {
                const txt = `Exoplanet AI – ${name}\nPeriod: ${period.toFixed(2)} d | Radius: ${radius} R⊕ | Habitability: ${hab}/100\n${discovery}`;
                const blob = new Blob([txt], { type: 'text/plain' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `${name.replace(/\s+/g, '-')}-report.txt`;
                a.click();
                URL.revokeObjectURL(a.href);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-slate-400 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors"
            >
              Export
            </button>
            <button
              onClick={() => {
                const text = `Check out ${name} on Exoplanet AI – Habitability ${hab}/100`;
                if (navigator.share) {
                  navigator.share({ title: 'Exoplanet AI', text }).catch(() => navigator.clipboard?.writeText(text));
                } else {
                  navigator.clipboard?.writeText(text);
                }
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-slate-400 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors"
            >
              Share
            </button>
          </div>
        </motion.div>

        {/* Stats pills */}
        <motion.div
          className="flex flex-wrap gap-3 mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Period', value: `${period.toFixed(2)} d` },
            { label: 'Radius', value: `${radius} R⊕` },
            { label: 'Habitability', value: `${Math.round(hab)}/100`, highlight: true },
            { label: 'Semi-major axis', value: `${semiMajorAxisAu(period)} AU` },
          ].map((s) => (
            <div
              key={s.label}
              className={`px-4 py-2 rounded-xl border text-sm ${s.highlight ? `border-cyan-400/30 bg-cyan-400/5 ${habColor}` : 'border-white/10 bg-white/[0.02] text-slate-300'}`}
            >
              <span className="text-slate-500 text-xs mr-2">{s.label}</span>
              <span className="font-medium">{s.value}</span>
            </div>
          ))}
        </motion.div>

        {/* 2-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h3 className="text-cyan-400 font-semibold text-sm mb-2">Orbit view</h3>
              <p className="text-slate-500 text-xs mb-2">Star (center) vs planet (orbiting) — scale exaggerated for visibility.</p>
              <PlanetView3D planetRadius={radius} className="rounded-xl" />
            </motion.div>
            <motion.div
              className="p-5 rounded-xl bg-white/[0.02] border border-white/10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-cyan-400 font-semibold text-sm mb-3">Orbital parameters</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-500">Period</span>
                  <p className="text-slate-200 font-medium">{period.toFixed(2)} days</p>
                </div>
                <div>
                  <span className="text-slate-500">Radius</span>
                  <p className="text-slate-200 font-medium">{radius} R⊕</p>
                </div>
                <div>
                  <span className="text-slate-500">Semi-major axis</span>
                  <p className="text-slate-200 font-medium">{semiMajorAxisAu(period)} AU</p>
                </div>
                <div>
                  <span className="text-slate-500">Transit depth</span>
                  <p className="text-slate-200 font-medium">~{(0.01 * radius * radius).toFixed(3)}%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-cyan-400 font-semibold text-sm mb-2">3D dataset visualization</h3>
              <p className="text-slate-500 text-xs mb-3">
                Planets vs star reference. Sphere size ∝ radius. X: Period, Y: Radius, Z: Habitability.
              </p>
              <ExoplanetData3D highlightId={id} />
            </motion.div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HabitabilityDetail score={hab} periodDays={period} radiusEarth={radius} name={name} />
            </motion.div>
            <motion.div
              className="rounded-xl overflow-hidden border border-white/10 bg-white/[0.02] p-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="text-cyan-400 font-semibold text-sm mb-3">Simulated light curve</h3>
              <LightCurveChart data={chartData} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <MoreAboutHabitability
                score={hab}
                inHabitableZone={inHabitableZone(period)}
                radiusEarth={radius}
                semiMajorAxisAu={semiMajorAxisAu(period)}
              />
            </motion.div>
          </div>
        </div>

        {/* Footer hint */}
        <motion.p
          className="mt-8 text-slate-600 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Esc</kbd> to return to dashboard
        </motion.p>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
