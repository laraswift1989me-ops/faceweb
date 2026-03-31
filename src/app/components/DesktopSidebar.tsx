import React from 'react';
import { Home, Coins, Users, Wallet, CheckSquare, LogOut, Bell, User } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  onNotifications: () => void;
  onProfile: () => void;
}

export function DesktopSidebar({ activeTab, onTabChange, onLogout, onNotifications, onProfile }: SidebarProps) {
  const tabs = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Daily Tasks', icon: CheckSquare },
    { id: 'earn', label: 'Invest & Stake', icon: Coins },
    { id: 'refer', label: 'Referrals', icon: Users },
    { id: 'wallet', label: 'My Wallet', icon: Wallet }
  ];

  return (
    <div className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-8">
        <div className="mb-10">
          <Logo iconSize={24} textSize="text-2xl" />
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="font-bold text-sm uppercase tracking-widest">{tab.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-slate-800 space-y-4">
        <button 
          onClick={onNotifications}
          className="w-full flex items-center space-x-4 px-4 py-3 text-slate-400 hover:text-white transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-widest">Notifications</span>
        </button>
        <button 
          onClick={onProfile}
          className="w-full flex items-center space-x-4 px-4 py-3 text-slate-400 hover:text-white transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-widest">My Profile</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-4 px-4 py-3 text-rose-400 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm uppercase tracking-widest">Secure Logout</span>
        </button>
      </div>
    </div>
  );
}
