'use client';

import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('./Scene3D').then((m) => m.Scene3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[280px] flex items-center justify-center bg-slate-900/30 rounded-2xl">
      <div className="w-8 h-8 border-2 border-cyan-400/50 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  ),
});

export function Scene3DClient({ className, mode }: { className?: string; mode?: 'hero' | 'detail' }) {
  return <Scene3D className={className} mode={mode} />;
}
