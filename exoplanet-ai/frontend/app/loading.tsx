export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Loading Exoplanet AI...</p>
      </div>
    </div>
  );
}
