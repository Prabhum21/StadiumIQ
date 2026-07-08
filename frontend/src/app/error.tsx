"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
        <AlertTriangle className="text-red-400" size={32} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">System Interruption</h2>
      <p className="text-zinc-400 max-w-md mb-8">
        The StadiumIQ platform encountered an unexpected error. Please refresh the page or try again. Our operations team has been notified.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors border border-white/20"
      >
        Attempt Recovery
      </button>
    </div>
  );
}
