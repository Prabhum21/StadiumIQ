'use client';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 font-sans">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-semibold tracking-tight text-blue-400 animate-pulse">
        Initializing System...
      </h2>
      <p className="text-zinc-500 text-sm mt-2">Connecting to StadiumIQ Operations</p>
    </div>
  );
}
