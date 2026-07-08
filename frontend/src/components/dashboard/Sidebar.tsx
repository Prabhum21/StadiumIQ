import { Activity, Users, ShieldAlert, Navigation, ShieldPlus, Train } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeIncidents: number;
}

export function Sidebar({ sidebarOpen, activeTab, setActiveTab, activeIncidents }: SidebarProps) {
  return (
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
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${item.active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'}`}
            aria-current={item.active ? "page" : undefined}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} aria-hidden="true" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" aria-label={`${item.badge} notifications`}>{item.badge}</span>
            )}
          </button>
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
  );
}
