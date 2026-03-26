'use client';

import dynamic from 'next/dynamic';

const ExoplanetExplorer3D = dynamic(
  () => import('./ExoplanetExplorer3D').then((m) => ({ default: m.ExoplanetExplorer3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-2xl bg-slate-900/50 border border-white/10 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    ),
  }
);

export { ExoplanetExplorer3D };
