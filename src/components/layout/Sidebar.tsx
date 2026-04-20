import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Key, Settings, ToggleRight, FileText, Shield, Lock, LayoutDashboard } from 'lucide-react';
import { EntityType } from '../../hooks/useDashboardData.ts';

interface SidebarProps {
  activeTab: EntityType | 'admin_home';
  onTabChange: (tab: EntityType | 'admin_home') => void;
  customNav?: React.ReactNode;
}

const navItems = [
  { id: 'admin_home', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin_home' },
  { id: 'users', label: 'Users', icon: Users, path: '/dashboard/users' },
  { id: 'roles', label: 'Roles', icon: Shield, path: '/dashboard/roles' },
  { id: 'permissions', label: 'Perms', icon: Lock, path: '/dashboard/permissions' },
  { id: 'tokens', label: 'Tokens', icon: Key, path: '/dashboard/tokens' },
  { id: 'config', label: 'Config', icon: Settings, path: '/dashboard/config' },
  { id: 'feature-switches', label: 'Switches', icon: ToggleRight, path: '/dashboard/feature-switches' },
  { id: 'event-logs', label: 'Logs', icon: FileText, path: '/dashboard/event-logs' },
] as const;

export default function Sidebar({ activeTab, onTabChange, customNav }: SidebarProps) {
  return (
    <aside className="w-16 md:w-56 border-r border-[#141414] py-4 flex flex-col gap-2 shrink-0 bg-[#E4E3E0] z-20 overflow-y-auto">
      {customNav}
      {navItems.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          className={({ isActive }) => `flex items-center gap-4 px-4 py-4 transition-all duration-200 outline-none group ${
            isActive 
              ? 'bg-[#141414] text-[#E4E3E0] translate-x-1' 
              : 'hover:bg-[#d8d7d4] text-[#141414]/60 hover:text-[#141414]'
          }`}
        >
          <item.icon className={`w-5 h-5 shrink-0`} />
          <span className="hidden md:block font-mono text-xs uppercase tracking-widest font-bold">
            {item.label}
          </span>
        </NavLink>
      ))}
      
      <div className="mt-auto px-4 py-8 hidden md:block opacity-40 hover:opacity-100 transition-opacity">
        <div className="text-[10px] font-mono leading-relaxed p-3 border border-[#141414]/20 bg-white/30 backdrop-blur-sm">
          <p className="text-[#141414]/80">RUNTIME_ID: <span className="text-blue-600">892F2</span></p>
          <p className="text-[#141414]/80">DB_ENGINE: <span className="text-green-600">SQLITE3</span></p>
          <p className="text-[#141414]/80 text-[8px] mt-2 italic">ESTABLISHED: APR_2026</p>
        </div>
      </div>
    </aside>
  );
}
