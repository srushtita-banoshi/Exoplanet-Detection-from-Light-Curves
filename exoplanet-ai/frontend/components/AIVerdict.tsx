'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  planetName: string;
  radiusEarth: number;
  periodDays: number;
  habitabilityScore: number;
  planetMassEarth?: number;
  stellarFlux?: number;
};

function getSemiMajorAxisAu(periodDays: number): number {
  return (periodDays * periodDays / (365.25 * 365.25)) ** (1 / 3);
}

function inHabitableZone(periodDays: number): boolean {
  const a = getSemiMajorAxisAu(periodDays);
  return a >= 0.95 && a <= 1.37;
}

function getVerdict(hab: number): { text: string; color: string } {
  if (hab > 80) return { text: 'Potentially Habitable Earth-like Planet', color: 'text-emerald-400' };
  if (hab >= 50) return { text: 'Marginal Habitability – further study required', color: 'text-amber-400' };
  return { text: 'Unlikely to support Earth-like life', color: 'text-rose-400' };
}

function estimateGravity(radiusEarth: number, massEarth?: number): { g: number; label: string } {
  const mass = massEarth ?? Math.pow(radiusEarth, 1.5);
  const g = mass / (radiusEarth * radiusEarth);
  if (g >= 0.9 && g <= 1.15) return { g: Number(g.toFixed(2)), label: 'similar to Earth' };
  if (g < 0.7) return { g: Number(g.toFixed(2)), label: 'lower than Earth' };
  if (g > 1.3) return { g: Number(g.toFixed(2)), label: 'higher than Earth' };
  return { g: Number(g.toFixed(2)), label: 'moderate' };
}

function estimateTempC(semiMajorAxisAu: number, stellarFlux?: number): number {
  const flux = stellarFlux ?? 1 / (semiMajorAxisAu * semiMajorAxisAu);
  const teq = 280 * Math.pow(flux, 0.25);
  return Math.round(teq - 273);
}

function getWaterProbability(inZone: boolean): 'High' | 'Low' | 'Moderate' {
  if (inZone) return 'High';
  return 'Low';
}

function getExplanation(
  name: string,
  inZone: boolean,
  radiusEarth: number,
  verdict: string
): string {
  if (verdict.includes('Potentially Habitable')) {
    return `This planet orbits within the star's habitable zone and has a radius similar to Earth. These factors suggest that liquid water could exist under the right atmospheric conditions.`;
  }
  if (verdict.includes('Marginal')) {
    return `This planet shows mixed indicators. Orbital distance and size suggest further study is needed to assess habitability and potential for liquid water.`;
  }
  return `This planet's orbit or size makes it unlikely to support Earth-like life. Conditions are outside the range where liquid water would be stable at the surface.`;
}

export function AIVerdict({
  planetName,
  radiusEarth,
  periodDays,
  habitabilityScore,
  planetMassEarth,
  stellarFlux,
}: Props) {
  const [showReasoning, setShowReasoning] = useState(false);
  const semiMajorAxis = getSemiMajorAxisAu(periodDays);
  const inZone = inHabitableZone(periodDays);
  const verdict = getVerdict(habitabilityScore);
  const gravity = estimateGravity(radiusEarth, planetMassEarth);
  const tempC = estimateTempC(semiMajorAxis, stellarFlux);
  const waterProb = getWaterProbability(inZone);
  const explanation = getExplanation(planetName, inZone, radiusEarth, verdict.text);

  const gravitySimilarity = Math.min(100, 100 - Math.abs(gravity.g - 1) * 50);
  const waterBar = waterProb === 'High' ? 85 : waterProb === 'Moderate' ? 50 : 20;

  return (
    <motion.div
      className="p-5 rounded-xl bg-white/[0.02] border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.06)]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-cyan-400 font-semibold text-lg">AI Planet Verdict</h3>
        <span className="px-2 py-0.5 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-medium">
          AI Generated Analysis
        </span>
      </div>

      <p className="text-slate-300 font-medium mb-4">Planet: {planetName}</p>

      <div className="space-y-4">
        <div>
          <p className="text-slate-500 text-xs mb-1">Gravity Estimate</p>
          <p className="text-slate-200 text-sm">{gravity.g} g ({gravity.label})</p>
          <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-cyan-400/80"
              initial={{ width: 0 }}
              animate={{ width: `${gravitySimilarity}%` }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>
        </div>

        <div>
          <p className="text-slate-500 text-xs mb-1">Estimated Surface Temperature</p>
          <p className="text-slate-200 text-sm">
            ~{tempC}°C {tempC >= 0 && tempC <= 30 ? '(temperate range)' : tempC > 30 ? '(hot)' : '(cold)'}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-xs mb-1">Water Probability</p>
          <p className={`text-sm font-medium ${waterProb === 'High' ? 'text-emerald-400' : waterProb === 'Moderate' ? 'text-amber-400' : 'text-slate-400'}`}>
            {waterProb}
          </p>
          <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${waterProb === 'High' ? 'bg-emerald-400/80' : waterProb === 'Moderate' ? 'bg-amber-400/80' : 'bg-slate-500/80'}`}
              initial={{ width: 0 }}
              animate={{ width: `${waterBar}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/10">
        <p className="text-slate-500 text-xs mb-1 flex items-center gap-1.5">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              habitabilityScore > 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' :
              habitabilityScore >= 50 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
              'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
            }`}
            aria-hidden
          />
          Life Potential
        </p>
        <p className={`text-lg font-semibold ${verdict.color}`}>{verdict.text}</p>
      </div>

      <p className="text-slate-400 text-sm mt-4 leading-relaxed">{explanation}</p>

      <button
        onClick={() => setShowReasoning(!showReasoning)}
        className="mt-4 px-3 py-1.5 rounded-lg text-xs font-medium border border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
      >
        {showReasoning ? 'Hide' : 'Explain'} AI Reasoning
      </button>

      <AnimatePresence>
        {showReasoning && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 p-4 rounded-lg bg-white/[0.03] border border-white/10 space-y-2 text-xs">
              <p className="text-cyan-400 font-medium mb-2">Parameters used for this verdict</p>
              <ul className="text-slate-400 space-y-1">
                <li>• Habitability score: {Math.round(habitabilityScore)}/100 → verdict threshold</li>
                <li>• Semi-major axis: {semiMajorAxis.toFixed(3)} AU → habitable zone check</li>
                <li>• Radius: {radiusEarth} R⊕ → gravity &amp; size estimate</li>
                <li>• Orbital period: {periodDays.toFixed(2)} d → orbital distance (Kepler’s law)</li>
                <li>• In habitable zone: {inZone ? 'Yes' : 'No'} → water probability</li>
                <li>• Gravity: mass/radius² → {gravity.g} g (Earth = 1)</li>
                <li>• Temperature: from orbital distance (equilibrium temp. estimate)</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
