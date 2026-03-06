'use client';

import { motion } from 'framer-motion';

type Props = {
  score: number;
  periodDays: number;
  radiusEarth: number;
  name?: string;
};

function getFactors(period: number, radius: number) {
  const aAu = (period * period / (365.25 * 365.25)) ** (1 / 3);
  const inZone = aAu >= 0.95 && aAu <= 1.37;
  const distScore = inZone ? 100 * Math.max(0, 1 - Math.abs(aAu - 1.16) / 0.4) : 30;
  const sizeScore = 100 * Math.max(0, 1 - 0.4 * Math.abs(radius - 1.1));
  const combined = 0.55 * distScore + 0.45 * sizeScore;
  return {
    orbitalZone: Math.round(distScore),
    planetSize: Math.round(sizeScore),
    inHabitableZone: inZone,
    semiMajorAxisAu: aAu.toFixed(3),
    interpretation: combined >= 70 ? 'Potentially habitable' : combined >= 40 ? 'Marginal — further study needed' : 'Unlikely to support life as we know it',
  };
}

export function HabitabilityDetail({ score, periodDays, radiusEarth, name }: Props) {
  const factors = getFactors(periodDays, radiusEarth);
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444';

  return (
    <motion.div
      className="p-5 rounded-xl bg-white/[0.02] border border-white/10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-cyan-400 font-semibold text-sm mb-1">Habitability Analysis</h3>
      <p className="text-slate-500 text-xs mb-4">Breakdown for {name || 'this planet'}</p>

      <div className="flex flex-col items-center mb-6">
        <motion.div
          className="text-4xl font-bold tracking-tight"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {Math.round(score)}/100
        </motion.div>
        <p className="text-slate-400 text-sm mt-1">Overall habitability score</p>
        <div className="w-full max-w-xs h-3 rounded-full bg-white/10 overflow-hidden mt-3">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Orbital zone (distance from star)</span>
            <span className={factors.orbitalZone >= 60 ? 'text-green-400' : factors.orbitalZone >= 30 ? 'text-yellow-400' : 'text-red-400'}>{factors.orbitalZone}/100</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-cyan-400/80"
              initial={{ width: 0 }}
              animate={{ width: `${factors.orbitalZone}%` }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-1">Semi-major axis: {factors.semiMajorAxisAu} AU {factors.inHabitableZone ? '✓ In habitable zone' : '✗ Outside optimal range'}</p>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-400">Planet size (Earth-like preferred)</span>
            <span className={factors.planetSize >= 60 ? 'text-green-400' : factors.planetSize >= 30 ? 'text-yellow-400' : 'text-red-400'}>{factors.planetSize}/100</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-teal-400/80"
              initial={{ width: 0 }}
              animate={{ width: `${factors.planetSize}%` }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-1">Radius: {radiusEarth} R⊕ (1 R⊕ = Earth size)</p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <p className="text-slate-300 text-xs font-medium mb-0.5">Interpretation</p>
        <p className="text-slate-400 text-xs">{factors.interpretation}</p>
      </div>

      <p className="text-slate-500 text-xs mt-3 leading-relaxed">
        Based on Kepler&apos;s third law for orbital distance and empirical habitability models. Not a guarantee of life — indicates potential for liquid water and Earth-like conditions.
      </p>
    </motion.div>
  );
}
