"use client";

import { Incident } from "@/types";

export default function IncidentDetailPanel({ incident }: { incident: Incident }) {
  if (!incident) return null;
  
  return (
    <div className="glass-card p-6">
      <h3 className="font-semibold mb-4 text-white">Incident Details</h3>
      
      <div className="space-y-4">
        <div>
          <span className="text-xs text-zinc-400 block mb-1">Description</span>
          <div className="bg-white/5 p-3 rounded-lg text-sm text-zinc-300 min-h-[60px]">
            {incident.description || "No description provided."}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-zinc-400 block mb-1">Reporter Role</span>
            <div className="text-sm">{incident.reporterRole || "Unknown"}</div>
          </div>
          <div>
            <span className="text-xs text-zinc-400 block mb-1">Time Reported</span>
            <div className="text-sm">{new Date(incident.timestamp).toLocaleString()}</div>
          </div>
        </div>
        
        <div>
           <span className="text-xs text-zinc-400 block mb-1">Assigned Personnel</span>
           <div className="text-sm">{incident.assignedVolunteer || "Pending AI Dispatch..."}</div>
        </div>
      </div>
    </div>
  );
}
