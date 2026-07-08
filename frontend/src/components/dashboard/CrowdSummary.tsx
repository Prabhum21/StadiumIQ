import { Users } from 'lucide-react';

interface CrowdData {
  density: string;
  queueTime: number;
  locationId: string;
}

interface CrowdSummaryProps {
  crowdData: CrowdData[];
}

export function CrowdSummary({ crowdData }: CrowdSummaryProps) {
  return (
    <div
      className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden"
      aria-live="polite"
      aria-label="Crowd Summary Panel"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Users size={24} className="text-blue-400" /> Crowd Summary
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div
          className="p-4 bg-black/40 rounded-lg border border-white/5"
          aria-label="Density Overview"
        >
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
            Density Overview
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center p-2 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-xl font-bold text-red-400">
                {crowdData.filter((c) => c.density === 'High').length}
              </p>
              <p className="text-xs text-zinc-500">High</p>
            </div>
            <div className="flex-1 text-center p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <p className="text-xl font-bold text-orange-400">
                {crowdData.filter((c) => c.density === 'Medium').length}
              </p>
              <p className="text-xs text-zinc-500">Med</p>
            </div>
            <div className="flex-1 text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
              <p className="text-xl font-bold text-green-400">
                {crowdData.filter((c) => c.density === 'Low').length}
              </p>
              <p className="text-xs text-zinc-500">Low</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-black/40 rounded-lg border border-white/5 flex-1">
          <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
            Queue Statistics
          </p>
          <div className="space-y-3">
            {[...crowdData]
              .sort((a, b) => b.queueTime - a.queueTime)
              .slice(0, 4)
              .map((crowd, i) => (
                <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded">
                  <span className="text-sm font-medium text-zinc-300">{crowd.locationId}</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${crowd.queueTime > 15 ? 'bg-red-500/20 text-red-400' : crowd.queueTime > 5 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}
                  >
                    {crowd.queueTime} min wait
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
