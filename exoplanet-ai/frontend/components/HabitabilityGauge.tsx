'use client';

import { motion } from 'framer-motion';

export function HabitabilityGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color = clamped >= 70 ? '#22c55e' : clamped >= 40 ? '#eab308' : '#ef4444';
  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <motion.div
        className="text-4xl font-bold tracking-tight"
        style={{ color }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {clamped}/100
      </motion.div>
      <p className="text-slate-500 text-sm">Habitability score</p>
      <div className="w-56 h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
