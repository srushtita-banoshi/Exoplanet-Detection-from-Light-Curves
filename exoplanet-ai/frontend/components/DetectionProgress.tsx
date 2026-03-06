'use client';

import { motion } from 'framer-motion';

const steps = ['Loading data', 'Preprocessing', 'Feature extraction', 'ML inference', 'Complete'];

export function DetectionProgress({ progress }: { progress: number }) {
  const idx = Math.min(Math.floor(progress * steps.length), steps.length - 1);
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs text-slate-400">
        {steps.map((s, i) => (
          <span key={s} className={i <= idx ? 'text-cyan-400' : ''}>{s}</span>
        ))}
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
