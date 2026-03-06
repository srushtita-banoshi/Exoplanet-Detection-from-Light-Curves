'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

type Planet = {
  id: string;
  name: string;
  period_days: number;
  radius_earth: number;
  habitabilty_score: number;
  discovery: string;
};

export function PlanetCard({ planet, index = 0 }: { planet: Planet; index?: number }) {
  const href = `/results?id=${planet.id}&name=${encodeURIComponent(planet.name)}&period=${planet.period_days}&radius=${planet.radius_earth}&hab=${planet.habitabilty_score}&discovery=${encodeURIComponent(planet.discovery)}`;
  const habColor = planet.habitabilty_score >= 70 ? 'text-emerald-400' : planet.habitabilty_score >= 40 ? 'text-amber-400' : 'text-slate-400';
  return (
    <Link href={href}>
      <motion.div
        className="block p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-cyan-400/25 transition-all duration-200"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.05 }}
        whileHover={{ y: -4, borderColor: 'rgba(34, 211, 238, 0.35)', backgroundColor: 'rgba(255,255,255,0.04)' }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-slate-100 truncate">{planet.name}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-md shrink-0 ${habColor} ${planet.habitabilty_score >= 70 ? 'bg-emerald-400/10' : planet.habitabilty_score >= 40 ? 'bg-amber-400/10' : 'bg-white/5'}`}>
            {planet.habitabilty_score}/100
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-500 text-xs">
          <span>{planet.period_days.toFixed(1)} d</span>
          <span>•</span>
          <span>{planet.radius_earth} R⊕</span>
        </div>
        <p className="text-slate-600 text-xs mt-1 truncate">{planet.discovery}</p>
      </motion.div>
    </Link>
  );
}
