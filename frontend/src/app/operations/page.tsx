"use client";

import dynamic from "next/dynamic";
const OrganizerDashboard = dynamic(() => import("@/features/operations/OrganizerDashboard"), { ssr: false });
export default function OperationsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans overflow-hidden">
      <header className="h-20 glass border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Operations <span className="text-blue-400">Center</span></h2>
          <p className="text-zinc-400 text-sm">Organizer Command Dashboard</p>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            Back to Fan App
          </a>
        </div>
      </header>
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
        <OrganizerDashboard />
      </main>
    </div>
  );
}
