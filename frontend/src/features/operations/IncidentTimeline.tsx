"use client";

import { motion } from "framer-motion";
import { Incident } from "@/types";

export default function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  // Sort by newest first
  const sorted = [...(incidents || [])].sort((a, b) => b.timestamp - a.timestamp);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Open": return "bg-red-500";
      case "In Progress": return "bg-orange-500";
      case "Resolved": return "bg-green-500";
      default: return "bg-zinc-500";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 h-full flex flex-col"
    >
      <h3 className="text-lg font-semibold mb-6">Incident Timeline</h3>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 relative">
        {/* Timeline line */}
        <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-white/10 z-0"></div>

        {sorted.map((inc, i) => (
          <div key={inc.id || i} className="relative z-10 pl-8">
            {/* Timeline dot */}
            <div className={`absolute left-0 top-1.5 w-5 h-5 rounded-full border-4 border-black ${getStatusColor(inc.status)}`}></div>
            
            <div className="bg-white/5 border border-white/5 p-3 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-semibold text-sm">{inc.type} - {inc.location}</h4>
                <span className="text-[10px] text-zinc-500 shrink-0">{new Date(inc.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${inc.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : inc.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {inc.priority} Priority
                </span>
                <span className="text-[10px] text-zinc-400">Status: {inc.status}</span>
              </div>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div className="text-sm text-zinc-500 text-center mt-10">No incidents reported.</div>
        )}
      </div>
    </motion.div>
  );
}
