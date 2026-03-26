'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExoplanetExplorer3D } from '@/components/ExoplanetExplorer3DLazy';

export default function ExplorerPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <Link href="/dashboard" className="text-slate-400 hover:text-cyan-400 text-sm mb-2 inline-block">
              ← Dashboard
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">3D Exoplanet Explorer</h1>
            <p className="text-slate-500 text-sm mt-1">
              Explore exoplanets in 3D. Toggle Galaxy or Star System view, click a planet for details.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ExoplanetExplorer3D />
        </motion.div>

        <motion.p
          className="mt-4 text-slate-500 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Data inspired by NASA Exoplanet Archive. Habitability score from orbital distance and planet size.
        </motion.p>
      </div>
    </main>
  );
}
