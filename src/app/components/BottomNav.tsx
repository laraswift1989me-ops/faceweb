import { Home, Zap, Users, Wallet, CheckSquare, ArrowLeftRight, MessageSquare, Coins } from "lucide-react";
import { NavLink } from "react-router";

export function BottomNav() {
  const navItems = [
    { label: "Home",    path: "/dashboard",      icon: Home },
    { label: "Stake",   path: "/stake",          icon: Zap },
    { label: "Refer",   path: "/refer",          icon: Users },
    { label: "Wallet",  path: "/wallet",         icon: Wallet },
    { label: "Tasks",   path: "/tasks",          icon: CheckSquare },
    { label: "Swift",   path: "/swiftcash",      icon: Coins },
    { label: "P2P",     path: "/p2p",            icon: ArrowLeftRight },
    { label: "Support", path: "/support-tickets", icon: MessageSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 py-2 pb-5 lg:hidden
                    bg-white/95 dark:bg-slate-900/95
                    backdrop-blur-xl
                    border-t border-slate-200/80 dark:border-slate-800/50
                    shadow-[0_-10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
                    transition-colors duration-200">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1 p-1.5 px-2 rounded-xl transition-all duration-300
            ${isActive
              ? "bg-cyan-500/15 text-cyan-500 dark:text-cyan-400"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
            }
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              <span className="text-[9px] font-black uppercase tracking-wide leading-none">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
