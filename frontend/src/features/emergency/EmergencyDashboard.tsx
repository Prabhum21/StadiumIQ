"use client";

import { useState } from "react";
import { useIncidents, useVolunteers } from "@/hooks/useFirestore";
import { Incident } from "@/types";
import EmergencyReportForm from "./EmergencyReportForm";
import VolunteerDispatchPanel from "./VolunteerDispatchPanel";
import IncidentDetailPanel from "./IncidentDetailPanel";
import { Siren, CheckCircle, Users } from "lucide-react";

export default function EmergencyDashboard() {
  const { data: incidentsData } = useIncidents();
  const { data: volunteersData } = useVolunteers();
  
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const openIncidents = incidentsData.filter(i => i.status !== "Resolved");
  const resolvedIncidents = incidentsData.filter(i => i.status === "Resolved");
  const criticalIncidents = openIncidents.filter(i => i.priority === "Critical");
  
  const availableVolunteers = volunteersData.filter(v => v.availability === "Available");

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      
      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open Emergencies", value: openIncidents.length, icon: Siren, color: "orange" },
          { label: "Resolved", value: resolvedIncidents.length, icon: CheckCircle, color: "green" },
          { label: "Critical", value: criticalIncidents.length, icon: Siren, color: "red" },
          { label: "Nearest Volunteers", value: availableVolunteers.length, icon: Users, color: "blue" }
        ].map((stat, i) => (
          <div key={i} className={`glass-card p-4 rounded-xl border border-${stat.color}-500/20 bg-white/5 flex items-center justify-between`}>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-zinc-400 mt-1">{stat.label}</div>
            </div>
            <div className={`text-${stat.color}-400 bg-${stat.color}-500/10 p-3 rounded-full`}><stat.icon size={24} /></div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Report Form & Open Incidents */}
        <div className="lg:col-span-1 space-y-6">
          <EmergencyReportForm />
          
          <div className="glass-card p-6 h-[400px] flex flex-col">
            <h3 className="font-semibold mb-4 text-white">Active Incidents</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {openIncidents.map(inc => (
                <div 
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded-xl border cursor-pointer transition-colors ${selectedIncident?.id === inc.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{inc.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${inc.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{inc.priority}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{inc.location}</p>
                </div>
              ))}
              {openIncidents.length === 0 && <p className="text-sm text-zinc-500 text-center py-4">No active incidents.</p>}
            </div>
          </div>
        </div>

        {/* Right Col: Dispatch & Detail Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIncident ? (
            <>
              <VolunteerDispatchPanel incident={selectedIncident} volunteers={volunteersData} />
              <IncidentDetailPanel incident={selectedIncident} />
            </>
          ) : (
            <div className="glass-card p-6 h-full flex items-center justify-center text-zinc-500">
              Select an active incident from the list to view dispatch options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
