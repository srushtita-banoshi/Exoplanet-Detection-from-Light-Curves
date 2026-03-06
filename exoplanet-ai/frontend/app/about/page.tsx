'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Transit photometry',
    desc: 'When a planet passes in front of its host star, the star\'s brightness dips slightly. We detect these transits from light curves (brightness vs. time) and use ML to classify exoplanet candidates and estimate orbital period. The depth of the dip relates to (R_planet/R_star)².',
  },
  {
    title: 'Habitability scoring — how we calculate it',
    desc: 'Our 0–100 habitability score combines two factors: (1) Orbital zone — we derive semi-major axis from period via Kepler\'s third law. Planets in the habitable zone (≈0.95–1.37 AU for Sun-like stars) score higher. (2) Planet size — Earth-like radii (0.8–1.5 R⊕) are preferred; too small loses atmosphere, too large may be gas giants. The final score is a weighted combination. This is not a guarantee of life — it indicates potential for liquid water and Earth-like conditions.',
  },
  {
    title: 'Explainable AI',
    desc: 'The pipeline highlights transit dips, reports confidence, and uses feature importance so predictions are interpretable — no black box. Judges and users can see why the model flagged a signal.',
  },
  {
    title: 'Data sources',
    desc: 'Demo planets use parameters from NASA Exoplanet Archive. Light curve analysis is inspired by Kepler and TESS mission pipelines. Habitability models follow established exoplanet science literature.',
  },
];

const glossary = [
  { term: 'Transit', def: 'Planet passing in front of its star; causes a brightness dip.' },
  { term: 'Light curve', def: 'Brightness vs. time; periodic dips suggest a planet.' },
  { term: 'R⊕', def: 'Earth radii; 1 R⊕ ≈ 6,371 km.' },
  { term: 'AU', def: 'Astronomical unit; 1 AU ≈ Earth-Sun distance.' },
  { term: 'Habitable zone', def: 'Orbital range where liquid water could exist on a rocky planet.' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-3xl mx-auto px-6 py-12">
        <motion.h1
          className="text-3xl md:text-4xl font-bold tracking-tight mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About the Science
        </motion.h1>
        <motion.p
          className="text-slate-400 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Technical methodology and scientific background for judges and researchers.
        </motion.p>

        <div className="space-y-6">
          {sections.map((s, i) => (
            <motion.section
              key={s.title}
              className="p-6 rounded-2xl bg-white/[0.03] border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
              whileHover={{ borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              <h2 className="text-cyan-400 font-semibold mb-2">{s.title}</h2>
              <p className="text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.section>
          ))}
        </div>

        <motion.section
          className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-cyan-400 font-semibold mb-4">Glossary</h2>
          <dl className="space-y-3">
            {glossary.map((g) => (
              <div key={g.term}>
                <dt className="text-slate-200 font-medium">{g.term}</dt>
                <dd className="text-slate-400 text-sm ml-0 mt-0.5">{g.def}</dd>
              </div>
            ))}
          </dl>
        </motion.section>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link href="/analyzer">
            <motion.span
              className="inline-block text-cyan-400 hover:text-cyan-300 transition-colors"
              whileHover={{ x: 4 }}
            >
              Try the Light Curve Analyzer →
            </motion.span>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
