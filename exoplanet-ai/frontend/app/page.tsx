'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SpaceScene3D } from '@/components/SpaceScene3DLazy';
import { ExoplanetData3D } from '@/components/ExoplanetData3DLazy';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { Tooltip } from '@/components/Tooltip';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero + 3D + CTAs — single cohesive block */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-400/80 mb-4">Hackathon Project</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              AI-Powered Exoplanet{' '}
              <motion.span
                className="bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] inline-block"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                Detection & Habitability
              </motion.span>
            </h1>
            <p className="text-slate-400 mb-8 max-w-md">
              ML-based transit detection, Lomb-Scargle period estimation, and multi-factor habitability scoring. <Tooltip text="Planet passing in front of star causes brightness dip">Transit photometry</Tooltip> meets explainable AI.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/dashboard">
                <motion.span
                  className="inline-block px-6 py-3 rounded-xl font-semibold bg-cyan-400 text-slate-900"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(34, 211, 238, 0.35)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Dashboard
                </motion.span>
              </Link>
              <Link href="/analyzer">
                <motion.span
                  className="inline-block px-6 py-3 rounded-xl font-semibold border border-cyan-400/50 text-cyan-400"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(34, 211, 238, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Light Curve Analyzer
                </motion.span>
              </Link>
              <Link href="/compare">
                <motion.span
                  className="inline-block px-6 py-3 rounded-xl font-medium text-slate-400 border border-white/10 hover:border-cyan-400/30 hover:text-cyan-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Compare Planets
                </motion.span>
              </Link>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="text-xl font-bold text-cyan-400"><AnimatedCounter end={5500} suffix="+" /></div>
                <div className="text-slate-500 text-xs">Exoplanets</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-400"><AnimatedCounter end={95} suffix="%" /></div>
                <div className="text-slate-500 text-xs">Detection AUC</div>
              </div>
              <div>
                <div className="text-xl font-bold text-cyan-400"><AnimatedCounter end={3} /></div>
                <div className="text-slate-500 text-xs">Languages</div>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <SpaceScene3D />
          </motion.div>
        </div>

        {/* Features + Highlights — 2-column grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <motion.section
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-cyan-400 font-semibold mb-4">Capabilities</h2>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• ML-based transit detection (&gt;95% AUC)</li>
              <li>• Lomb-Scargle period estimation</li>
              <li>• Multi-factor habitability scoring (0–100)</li>
              <li>• 3D orbit visualization</li>
              <li>• Explainable AI — no black box</li>
              <li>• Side-by-side planet comparison</li>
            </ul>
          </motion.section>
          <motion.section
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-cyan-400 font-semibold mb-4">Data & methodology</h2>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• NASA Exoplanet Archive–inspired parameters</li>
              <li>• Kepler & TESS transit photometry pipelines</li>
              <li>• Habitability: orbital zone + planet size</li>
              <li>• Earth-like zone ≈ 0.95–1.37 AU (Sun-like stars)</li>
            </ul>
          </motion.section>
        </div>

        {/* Feature cards — 3-column grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { title: 'Transit detection', desc: 'ML-based detection with explainable results.', href: '/analyzer' },
            { title: 'Habitability analysis', desc: '0–100 score with factor breakdown.', href: '/dashboard' },
            { title: 'Compare planets', desc: 'Side-by-side comparison up to 3 planets.', href: '/compare' },
          ].map((card, i) => (
            <Link key={card.title} href={card.href}>
              <motion.div
                className="p-5 rounded-xl bg-white/[0.03] border border-white/10 h-full"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                whileHover={{ borderColor: 'rgba(34, 211, 238, 0.3)', backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <h3 className="text-cyan-400 font-semibold mb-1">{card.title}</h3>
                <p className="text-slate-400 text-sm">{card.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 3D dataset visualization */}
        <motion.section
          className="mb-16 p-6 rounded-2xl bg-white/[0.03] border border-white/10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h2 className="text-cyan-400 font-semibold mb-2">3D dataset visualization</h2>
          <p className="text-slate-500 text-sm mb-4">
            Planets vs star reference. Sphere size ∝ planet radius. Period (X), Radius (Y), Habitability (Z). Drag to rotate.
          </p>
          <ExoplanetData3D />
        </motion.section>

        {/* Tech stack + FAQ — compact row */}
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.section
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-cyan-400 font-semibold mb-4">Tech stack</h2>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'FastAPI', 'LightGBM', 'Three.js', 'Framer Motion', 'Recharts', 'Tailwind'].map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-xs border border-white/5">
                  {t}
                </span>
              ))}
            </div>
          </motion.section>
          <motion.section
            className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <h2 className="text-cyan-400 font-semibold mb-4">Quick reference</h2>
            <div className="space-y-2 text-sm">
              <p className="text-slate-400"><span className="text-slate-200">Light curve:</span> Brightness vs. time; periodic dips indicate transits.</p>
              <p className="text-slate-400"><span className="text-slate-200">Habitability:</span> 0–100 from orbital distance and planet size.</p>
            </div>
          </motion.section>
        </div>

        {/* Footer CTA */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/about" className="text-cyan-400 hover:text-cyan-300 text-sm">
            Full methodology & glossary →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
