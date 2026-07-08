'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
const EmergencyDashboard = dynamic(() => import('@/features/emergency/EmergencyDashboard'), {
  ssr: false,
});
export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <header className="h-20 glass border-b border-red-500/20 px-8 flex items-center justify-between sticky top-0 z-40 bg-red-950/10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Emergency <span className="text-red-400">Command</span>
          </h2>
          <p className="text-zinc-400 text-sm">Crisis Response & Volunteer Dispatch</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
          >
            Back to Fan App
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <EmergencyDashboard />
      </main>
    </div>
  );
}
