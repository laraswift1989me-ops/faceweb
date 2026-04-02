import { Home, Zap, Users, Wallet, CheckSquare } from "lucide-react";
import { NavLink } from "react-router";

export function BottomNav() {
  const navItems = [
    { label: "Home",   path: "/dashboard", icon: Home },
    { label: "Stake",  path: "/stake",     icon: Zap },
    { label: "Refer",  path: "/refer",     icon: Users },
    { label: "Wallet", path: "/wallet",    icon: Wallet },
    { label: "Tasks",  path: "/tasks",     icon: CheckSquare },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-3 pb-6 lg:hidden
                    bg-white/90 dark:bg-slate-900/90
                    backdrop-blur-xl
                    border-t border-slate-200/80 dark:border-slate-800/50
                    shadow-[0_-10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
                    transition-colors duration-200">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center gap-1.5 p-2 px-3 rounded-2xl transition-all duration-300
            ${isActive
              ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-500 dark:text-cyan-400 scale-110 shadow-lg shadow-cyan-500/20"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200"
            }
          `}
        >
          {({ isActive }) => (
            <>
              <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110 stroke-[2.5px]" : "stroke-[1.5px]"}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}
