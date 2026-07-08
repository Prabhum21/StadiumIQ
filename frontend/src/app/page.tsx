"use client";

import { motion } from "framer-motion";
import { Activity, Users, ShieldAlert, Navigation, Settings, Menu, LogIn, User as UserIcon, LogOut, Train, ShieldPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { seedDatabaseIfEmpty } from "@/services/firestore/seed";
import { useCrowd, useIncidents, useVolunteers, useTransport, useAlerts } from "@/hooks/useFirestore";
import dynamic from "next/dynamic";

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

  // Calculate Metrics from Firestore
  const totalAttendance = crowdData.reduce((acc, curr) => acc + curr.peopleCount, 0);
  const activeIncidents = incidentsData.filter(i => i.status !== "Resolved").length;
  const avgQueueTime = crowdData.length > 0 ? Math.round(crowdData.reduce((acc, curr) => acc + curr.queueTime, 0) / crowdData.length) : 0;
  const availableVolunteers = volunteersData.filter(v => v.availability === "Available").length;

  const dataLoading = crowdLoading || incidentsLoading || volunteersLoading || alertsLoading;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-50 w-64 h-full glass border-r border-white/10 p-6 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            IQ
          </div>
          <h1 className="text-xl font-bold tracking-tight">Stadium<span className="text-blue-400">IQ</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: "dashboard", icon: Activity, label: "Live Dashboard", active: activeTab === "dashboard" },
            { id: "crowd", icon: Users, label: "Crowd Intelligence", active: activeTab === "crowd" },
            { id: "incidents", icon: ShieldAlert, label: "Incidents", active: activeTab === "incidents", badge: activeIncidents > 0 ? activeIncidents : null },
            { id: "navigation", icon: Navigation, label: "Fan Assistant", active: activeTab === "navigation" },
            { id: "accessibility", icon: ShieldPlus, label: "Accessibility", active: activeTab === "accessibility" },
            { id: "transport", icon: Train, label: "Transport", active: activeTab === "transport" },
          ].map((item) => (
            <div 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all ${item.active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-2">
          <a href="/operations" className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all font-medium">
            <Activity size={18} />
            <span className="text-sm">Operations Center</span>
          </a>
          <a href="/emergency" className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-medium">
            <ShieldAlert size={18} />
            <span className="text-sm">Emergency Command</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-screen overflow-y-auto">
        
        {/* Header */}
        <header className="h-20 glass border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl font-semibold">Live Dashboard</h2>
              <p className="text-zinc-400 text-sm">FIFA World Cup 2026 • Lusail Stadium</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${activeIncidents > 2 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${activeIncidents > 2 ? 'bg-orange-500' : 'bg-green-500'}`}></span>
              {activeIncidents > 2 ? 'Caution' : 'System Optimal'}
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0D8ABC&color=fff`} alt="User" />
              </div>
              <div className="flex flex-col hidden md:flex">
                <span className="text-sm font-medium leading-none">{user.displayName}</span>
                <span className="text-xs text-blue-400 leading-none mt-1">{user.role}</span>
              </div>
              <button 
                onClick={logout}
                className="ml-2 text-zinc-400 hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-6 flex flex-col flex-1 min-h-0">
          
          {dataLoading ? (
            <div className="flex items-center justify-center flex-1">
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
                {[
                  { label: "Total Attendance", value: totalAttendance.toLocaleString(), trend: "Live", color: "blue" },
                  { label: "Active Incidents", value: activeIncidents.toString(), trend: "Needs Attention", color: "red" },
                  { label: "Avg Queue Time", value: `${avgQueueTime}m`, trend: "Gates A-D", color: "green" },
                  { label: "Available Volunteers", value: availableVolunteers.toString(), trend: "Ready", color: "purple" }
                ].map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="glass-card p-6 relative overflow-hidden group hover:border-white/20 transition-all"
                  >
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150`}></div>
                    <h3 className="text-zinc-400 text-sm font-medium mb-1">{stat.label}</h3>
                    <div className="flex items-end justify-between">
                      <span className="text-3xl font-bold">{stat.value}</span>
                      <span className={`text-xs font-medium ${stat.color === 'red' && activeIncidents > 0 ? 'text-red-400' : 'text-zinc-500'}`}>{stat.trend}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Grid for Features & Map */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[500px]">
                {/* Dynamic Left Panel */}
                <div className="lg:col-span-1 h-full">
                  {activeTab === "navigation" && <NavigationPanel selectedLocation={selectedMapLocation} />}
                  {activeTab === "accessibility" && <AccessibilityAssistant selectedLocation={selectedMapLocation} />}
                  {activeTab === "transport" && <TransportIntelligence />}
                  {activeTab === "dashboard" && (
                    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Activity size={24} className="text-blue-400"/> Dashboard Overview</h3>
                      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">System Status</p>
                          <p className="text-sm font-medium text-green-400 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> All Systems Operational</p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Live KPIs</p>
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
                          <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">Recent Alerts</p>
                          {alertsData.length > 0 ? (
                            <div className="space-y-3">
                              {alertsData.slice(0, 3).map((alert, i) => (
                                <div key={i} className="text-sm text-zinc-300 border-b border-white/5 pb-3 last:border-0 last:pb-0 flex items-start gap-2">
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
                  )}
                  {activeTab === "crowd" && (
                    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Users size={24} className="text-blue-400"/> Crowd Summary</h3>
                      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Density Overview</p>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 text-center p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                              <p className="text-xl font-bold text-red-400">{crowdData.filter(c => c.density === "High").length}</p>
                              <p className="text-xs text-zinc-500">High</p>
                            </div>
                            <div className="flex-1 text-center p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                              <p className="text-xl font-bold text-orange-400">{crowdData.filter(c => c.density === "Medium").length}</p>
                              <p className="text-xs text-zinc-500">Med</p>
                            </div>
                            <div className="flex-1 text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                              <p className="text-xl font-bold text-green-400">{crowdData.filter(c => c.density === "Low").length}</p>
                              <p className="text-xs text-zinc-500">Low</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5 flex-1">
                          <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">Queue Statistics</p>
                          <div className="space-y-3">
                            {crowdData.sort((a, b) => b.queueTime - a.queueTime).slice(0, 4).map((crowd, i) => (
                              <div key={i} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                <span className="text-sm font-medium text-zinc-300">{crowd.locationId}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${crowd.queueTime > 15 ? 'bg-red-500/20 text-red-400' : crowd.queueTime > 5 ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>{crowd.queueTime} min wait</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "incidents" && (
                    <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden">
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ShieldAlert size={24} className="text-red-400"/> Incident Summary</h3>
                      <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5">
                          <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Emergency Status</p>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${activeIncidents > 0 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className={`text-sm font-medium ${activeIncidents > 0 ? 'text-red-400' : 'text-green-400'}`}>
                              {activeIncidents > 0 ? `${activeIncidents} Active Incidents Detected` : 'All Clear - Safe Operations'}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-black/40 rounded-lg border border-white/5 flex-1">
                          <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">Priority Breakdown</p>
                          {incidentsData.filter(inc => inc.status !== "Resolved").length === 0 ? (
                            <p className="text-sm text-zinc-500 italic">No incidents to display.</p>
                          ) : (
                            <div className="space-y-3">
                              {incidentsData.filter(inc => inc.status !== "Resolved").sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((incident, i) => (
                                <div key={i} className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-sm font-bold text-zinc-200">{incident.type}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${incident.priority === 'High' || incident.priority === 'Critical' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>{incident.priority}</span>
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
