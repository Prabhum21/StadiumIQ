"use client";

import { motion } from "framer-motion";
import { LogIn, User as UserIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { seedDatabaseIfEmpty } from "@/services/firestore/seed";
import { useCrowd, useIncidents, useVolunteers, useTransport, useAlerts } from "@/hooks/useFirestore";
import dynamic from "next/dynamic";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { CrowdSummary } from "@/components/dashboard/CrowdSummary";
import { IncidentSummary } from "@/components/dashboard/IncidentSummary";

const NavigationPanel = dynamic(() => import("@/features/navigation/NavigationPanel"), { ssr: false });
const StadiumMap = dynamic(() => import("@/components/map/StadiumMap"), { ssr: false });
const AccessibilityAssistant = dynamic(() => import("@/features/accessibility/AccessibilityAssistant"), { ssr: false });
const TransportIntelligence = dynamic(() => import("@/features/transport/TransportIntelligence"), { ssr: false });

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMapLocation, setSelectedMapLocation] = useState<string | undefined>();
  const { user, loading: authLoading, loginWithGoogle, loginAsGuest, logout } = useAuth();

  // Firestore Hooks
  const { data: crowdData, loading: crowdLoading } = useCrowd();
  const { data: incidentsData, loading: incidentsLoading } = useIncidents();
  const { data: volunteersData, loading: volunteersLoading } = useVolunteers();
  const { data: alertsData, loading: alertsLoading } = useAlerts();

  // Calculate Metrics from Firestore (Memoized)
  const totalAttendance = useMemo(() => crowdData.reduce((acc, curr) => acc + curr.peopleCount, 0), [crowdData]);
  const activeIncidents = useMemo(() => incidentsData.filter(i => i.status !== "Resolved").length, [incidentsData]);
  const avgQueueTime = useMemo(() => crowdData.length > 0 ? Math.round(crowdData.reduce((acc, curr) => acc + curr.queueTime, 0) / crowdData.length) : 0, [crowdData]);
  const availableVolunteers = useMemo(() => volunteersData.filter(v => v.availability === "Available").length, [volunteersData]);

  // Seed DB on mount
  useEffect(() => {
    seedDatabaseIfEmpty();
  }, []);

  if (authLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-black text-white flex items-center justify-center font-sans p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-10 max-w-md w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-3xl shadow-[0_0_20px_rgba(59,130,246,0.6)] mb-6">
            IQ
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Stadium<span className="text-blue-400">IQ</span></h1>
          <p className="text-zinc-400 mb-10 text-sm">FIFA World Cup 2026 Smart Platform</p>

          <div className="space-y-4">
            <button 
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 glass py-3 rounded-lg hover:bg-white/10 transition-colors font-medium border-white/20"
            >
              <LogIn size={18} />
              Sign in with Google
            </button>
            <button 
              onClick={loginAsGuest}
              className="w-full flex items-center justify-center gap-3 bg-blue-600/20 text-blue-400 border border-blue-500/30 py-3 rounded-lg hover:bg-blue-600/30 transition-colors font-medium"
            >
              <UserIcon size={18} />
              Continue as Guest Fan
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const dataLoading = crowdLoading || incidentsLoading || volunteersLoading || alertsLoading;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        activeIncidents={activeIncidents} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          activeIncidents={activeIncidents} 
          user={user} 
          logout={logout} 
        />

        {/* Dashboard Content */}
        <div className="p-8 space-y-6 flex flex-col flex-1 min-h-0">
          
          {dataLoading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              <DashboardCards 
                totalAttendance={totalAttendance} 
                activeIncidents={activeIncidents} 
                avgQueueTime={avgQueueTime} 
                availableVolunteers={availableVolunteers} 
              />

              {/* Main Grid for Features & Map */}
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
            </>
          )}

        </div>
      </main>
    </div>
  );
}
