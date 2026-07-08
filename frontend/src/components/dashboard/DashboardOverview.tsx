import { Activity } from 'lucide-react';

interface AlertData {
  message: string;
}

interface DashboardOverviewProps {
  totalAttendance: number;
  availableVolunteers: number;
  alertsData: AlertData[];
}

export function DashboardOverview({
  totalAttendance,
  availableVolunteers,
  alertsData,
}: DashboardOverviewProps) {
  return (
    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Activity size={24} className="text-blue-400" /> Dashboard Overview
      </h3>
      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
            System Status
          </p>
          <p className="text-sm font-medium text-green-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> All Systems
            Operational
          </p>
        </div>
        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
            Live KPIs
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-white">{totalAttendance.toLocaleString()}</p>
              <p className="text-xs text-zinc-500">Total Fan Count</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{availableVolunteers}</p>
              <p className="text-xs text-zinc-500">Active Volunteers</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-black/40 rounded-lg border border-white/5 flex-1">
          <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
            Recent Alerts
          </p>
          {alertsData.length > 0 ? (
            <div className="space-y-3">
              {alertsData.slice(0, 3).map((alert, i) => (
                <div
                  key={i}
                  className="text-sm text-zinc-300 border-b border-white/5 pb-3 last:border-0 last:pb-0 flex items-start gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                  <p>{alert.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic">No recent alerts recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
