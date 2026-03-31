import { Home, Coins, Users, Wallet, CheckSquare } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'earn', label: 'Earn', icon: Coins },
    { id: 'refer', label: 'Refer', icon: Users },
    { id: 'wallet', label: 'Wallet', icon: Wallet }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-700/50 backdrop-blur-lg">
      <div className="max-w-md mx-auto grid grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-3 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-xs">{tab.label}</span>
              {isActive && tab.id === 'wallet' && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}