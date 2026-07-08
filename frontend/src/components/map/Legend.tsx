"use client";

export default function Legend() {
  return (
    <div className="absolute bottom-4 right-4 z-[400] glass-card p-3 rounded-lg text-sm pointer-events-none">
      <h4 className="font-semibold mb-2">Crowd Density</h4>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500"></span> Low
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-orange-500"></span> Medium
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span> High
        </div>
      </div>
    </div>
  );
}
