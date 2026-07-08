import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CrowdSummary } from "@/components/dashboard/CrowdSummary";
import { IncidentSummary } from "@/components/dashboard/IncidentSummary";

const NavigationPanel = dynamic(() => import("@/features/navigation/NavigationPanel"), { ssr: false });
const StadiumMap = dynamic(() => import("@/components/map/StadiumMap"), { ssr: false });
const AccessibilityAssistant = dynamic(() => import("@/features/accessibility/AccessibilityAssistant"), { ssr: false });
const TransportIntelligence = dynamic(() => import("@/features/transport/TransportIntelligence"), { ssr: false });

interface DashboardContentProps {
  activeTab: string;
  selectedMapLocation?: string;
  setSelectedMapLocation: (loc?: string) => void;
  totalAttendance: number;
  availableVolunteers: number;
  alertsData: any;
  crowdData: any;
  incidentsData: any;
  activeIncidents: number;
}

export function DashboardContent({
  activeTab,
  selectedMapLocation,
  setSelectedMapLocation,
  totalAttendance,
  availableVolunteers,
  alertsData,
  crowdData,
  incidentsData,
  activeIncidents
}: DashboardContentProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
      {/* Dynamic Left Panel */}
      <div className="lg:col-span-1 h-full">
        {activeTab === "navigation" && <NavigationPanel selectedLocation={selectedMapLocation} />}
        {activeTab === "accessibility" && <AccessibilityAssistant selectedLocation={selectedMapLocation} />}
        {activeTab === "transport" && <TransportIntelligence />}
        {activeTab === "dashboard" && (
          <DashboardOverview 
            totalAttendance={totalAttendance} 
            availableVolunteers={availableVolunteers} 
            alertsData={alertsData} 
          />
        )}
        {activeTab === "crowd" && (
          <CrowdSummary crowdData={crowdData} />
        )}
        {activeTab === "incidents" && (
          <IncidentSummary 
            activeIncidents={activeIncidents} 
            incidentsData={incidentsData} 
          />
        )}
      </div>

      {/* Live Interactive Map */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="lg:col-span-2 glass-card p-0 overflow-hidden relative h-full"
      >
        <StadiumMap onLocationClick={setSelectedMapLocation} />
      </motion.div>
    </div>
  );
}
