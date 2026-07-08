import { motion } from 'framer-motion';

interface DashboardCardsProps {
  totalAttendance: number;
  activeIncidents: number;
  avgQueueTime: number;
  availableVolunteers: number;
}

export function DashboardCards({
  totalAttendance,
  activeIncidents,
  avgQueueTime,
  availableVolunteers,
}: DashboardCardsProps) {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0"
      aria-label="Dashboard Statistics"
      aria-live="polite"
    >
      {[
        {
          label: 'Total Attendance',
          value: totalAttendance.toLocaleString(),
          trend: 'Live',
          color: 'blue',
        },
        {
          label: 'Active Incidents',
          value: activeIncidents.toString(),
          trend: 'Needs Attention',
          color: 'red',
        },
        { label: 'Avg Queue Time', value: `${avgQueueTime}m`, trend: 'Gates A-D', color: 'green' },
        {
          label: 'Available Volunteers',
          value: availableVolunteers.toString(),
          trend: 'Ready',
          color: 'purple',
        },
      ].map((stat, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          key={i}
          className="glass-card p-6 relative overflow-hidden group hover:border-white/20 transition-all"
          aria-label={`${stat.label}: ${stat.value}`}
        >
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150`}
          ></div>
          <h3 className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</h3>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold">{stat.value}</span>
            <span
              className={`text-xs font-medium ${stat.color === 'red' && activeIncidents > 0 ? 'text-red-400' : 'text-zinc-500'}`}
            >
              {stat.trend}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
