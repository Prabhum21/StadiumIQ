import { ShieldAlert } from 'lucide-react';

interface IncidentData {
  status: string;
  timestamp: number;
  type: string;
  priority: string;
  location: string;
}

interface IncidentSummaryProps {
  activeIncidents: number;
  incidentsData: IncidentData[];
}

export function IncidentSummary({ activeIncidents, incidentsData }: IncidentSummaryProps) {
  return (
    <div
      className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden"
      aria-live="assertive"
      aria-label="Incident Summary Panel"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <ShieldAlert size={24} className="text-red-400" /> Incident Summary
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div
          className="p-4 bg-black/40 rounded-lg border border-white/5"
          aria-label="Emergency Status"
        >
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
            Emergency Status
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${activeIncidents > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
            ></div>
            <span
              className={`text-sm font-medium ${activeIncidents > 0 ? 'text-red-400' : 'text-green-400'}`}
            >
              {activeIncidents > 0
                ? `${activeIncidents} Active Incidents Detected`
                : 'All Clear - Safe Operations'}
            </span>
          </div>
        </div>
        <div className="p-4 bg-black/40 rounded-lg border border-white/5 flex-1">
          <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
            Priority Breakdown
          </p>
          {incidentsData.filter((inc) => inc.status !== 'Resolved').length === 0 ? (
            <p className="text-sm text-zinc-500 italic">No incidents to display.</p>
          ) : (
            <div className="space-y-3">
              {incidentsData
                .filter((inc) => inc.status !== 'Resolved')
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((incident, i) => (
                  <div key={i} className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-zinc-200">{incident.type}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${incident.priority === 'High' || incident.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}
                      >
                        {incident.priority}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 flex items-center gap-1 mt-2">
                      <span>📍 {incident.location}</span>
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
