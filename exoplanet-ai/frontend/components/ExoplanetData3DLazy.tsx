'use client';

import dynamic from 'next/dynamic';

const ExoplanetData3D = dynamic(
  () => import('./ExoplanetData3D').then((m) => ({ default: m.ExoplanetData3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[320px] rounded-xl bg-slate-900/50 border border-white/10 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    ),
  }
);

export { ExoplanetData3D };
