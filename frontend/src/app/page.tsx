'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { seedDatabaseIfEmpty } from '@/services/firestore/seed';
import { useCrowd, useIncidents, useVolunteers, useAlerts } from '@/hooks/useFirestore';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import dynamic from 'next/dynamic';

import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { CrowdSummary } from '@/components/dashboard/CrowdSummary';
import { IncidentSummary } from '@/components/dashboard/IncidentSummary';
import { AuthScreen } from '@/components/auth/AuthScreen';

const NavigationPanel = dynamic(() => import('@/features/navigation/NavigationPanel'), {
  ssr: false,
});
const StadiumMap = dynamic(() => import('@/components/map/StadiumMap'), { ssr: false });
const AccessibilityAssistant = dynamic(
  () => import('@/features/accessibility/AccessibilityAssistant'),
  { ssr: false }
);
const TransportIntelligence = dynamic(() => import('@/features/transport/TransportIntelligence'), {
  ssr: false,
});

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMapLocation, setSelectedMapLocation] = useState<string | undefined>();
  const { user, loading: authLoading, loginWithGoogle, loginAsGuest, logout } = useAuth();

  // Firestore Hooks
  const { data: crowdData, loading: crowdLoading } = useCrowd();
  const { data: incidentsData, loading: incidentsLoading } = useIncidents();
  const { data: volunteersData, loading: volunteersLoading } = useVolunteers();
  const { data: alertsData, loading: alertsLoading } = useAlerts();

  // Calculate Metrics from Firestore
  const { totalAttendance, activeIncidents, avgQueueTime, availableVolunteers } =
    useDashboardMetrics(crowdData, incidentsData, volunteersData);

  // Seed DB on mount
  useEffect(() => {
    seedDatabaseIfEmpty();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-sans">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen loginWithGoogle={loginWithGoogle} loginAsGuest={loginAsGuest} />;
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
                  {activeTab === 'navigation' && (
                    <NavigationPanel selectedLocation={selectedMapLocation} />
                  )}
                  {activeTab === 'accessibility' && (
                    <AccessibilityAssistant selectedLocation={selectedMapLocation} />
                  )}
                  {activeTab === 'transport' && <TransportIntelligence />}
                  {activeTab === 'dashboard' && (
                    <DashboardOverview
                      totalAttendance={totalAttendance}
                      availableVolunteers={availableVolunteers}
                      alertsData={alertsData}
                    />
                  )}
                  {activeTab === 'crowd' && <CrowdSummary crowdData={crowdData} />}
                  {activeTab === 'incidents' && (
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
