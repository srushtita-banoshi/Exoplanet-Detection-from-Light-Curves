'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  score: number;
  inHabitableZone: boolean;
  radiusEarth: number;
  semiMajorAxisAu: string;
};

export function MoreAboutHabitability({ score, inHabitableZone, radiusEarth, semiMajorAxisAu }: Props) {
  const [open, setOpen] = useState(false);

  const items = [
    {
      title: 'What makes a planet habitable?',
      text: 'Liquid water requires the right temperature. Too close to the star = too hot (runaway greenhouse). Too far = frozen. The habitable zone (0.95–1.37 AU for Sun-like stars) is where surface water could exist.',
    },
    {
      title: 'Why does planet size matter?',
      text: 'Earth-like radii (0.8–1.5 R⊕) are preferred. Smaller planets lose atmosphere to space; larger ones may be mini-Neptunes with thick gas envelopes. Rocky worlds in this range are prime candidates.',
    },
    {
      title: 'Orbital distance & Kepler\'s law',
      text: `This planet orbits at ${semiMajorAxisAu} AU — ${inHabitableZone ? 'within the habitable zone.' : 'outside the optimal range for liquid water.'} Distance is derived from orbital period via Kepler\'s third law: a³ ∝ P².`,
    },
    {
      title: 'Limitations of the score',
      text: `For this planet we score ${score}/100 — a heuristic, not a guarantee. Real habitability depends on atmosphere, magnetic field, stellar activity, and more. It indicates potential, not certainty.`,
    },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-cyan-400 font-semibold text-sm">More about habitability</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400"
        >
          ▼
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
              {items.map((item, i) => (
                <div key={item.title} className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                  <h4 className="text-slate-200 font-medium text-xs mb-1">{item.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
