import { Menu, LogOut } from 'lucide-react';
import type { UserProfile } from '@/context/AuthContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeIncidents: number;
  user: UserProfile;
  logout: () => void;
}

export function Header({
  sidebarOpen,
  setSidebarOpen,
  activeIncidents,
  user,
  logout,
}: HeaderProps) {
  return (
    <header className="h-20 glass border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
        >
          <Menu size={24} aria-hidden="true" />
        </button>
        <div>
          <h2 className="text-2xl font-semibold">Live Dashboard</h2>
          <p className="text-zinc-400 text-sm">FIFA World Cup 2026 • Lusail Stadium</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${activeIncidents > 2 ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}
        >
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${activeIncidents > 2 ? 'bg-orange-500' : 'bg-green-500'}`}
          ></span>
          {activeIncidents > 2 ? 'Caution' : 'System Optimal'}
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=0D8ABC&color=fff`}
              alt="User"
            />
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
  );
}
