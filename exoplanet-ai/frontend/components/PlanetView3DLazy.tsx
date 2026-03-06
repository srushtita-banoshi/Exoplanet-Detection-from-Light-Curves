'use client';

import dynamic from 'next/dynamic';

const PlanetView3D = dynamic(() => import('./PlanetView3D').then((m) => ({ default: m.PlanetView3D })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  ),
});

export { PlanetView3D };
