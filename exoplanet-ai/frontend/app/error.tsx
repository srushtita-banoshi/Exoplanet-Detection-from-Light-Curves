'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-6">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold text-cyan-400 mb-2">Something went wrong</h2>
        <p className="text-slate-400 mb-4 text-sm">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-900 font-semibold hover:bg-cyan-300"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
