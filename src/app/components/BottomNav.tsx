import { Home, Wallet, Zap, CheckSquare, User, Coins } from "lucide-react";
import { NavLink } from "react-router";

export function BottomNav() {
  const navItems = [
    { label: "Home",    path: "/dashboard", icon: Home },
    { label: "Wallet",  path: "/wallet",    icon: Wallet },
    { label: "Swift",   path: "/swiftcash", icon: Coins, center: true },
    { label: "Stake",   path: "/stake",     icon: Zap },
    { label: "Tasks",   path: "/tasks",     icon: CheckSquare },
    { label: "Profile", path: "/profile",   icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-around px-2 pb-5 pt-2 lg:hidden
                    bg-white/95 dark:bg-slate-900/95
                    backdrop-blur-xl
                    border-t border-slate-200/80 dark:border-slate-800/50
                    shadow-[0_-10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)]
                    transition-colors duration-200">
      {navItems.map((item) =>
        item.center ? (
          /* ── SWIFT CENTER BUTTON — raised, large, gradient ── */
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              relative -mt-5 flex flex-col items-center gap-0.5 transition-all duration-300
            `}
          >
            {({ isActive }) => (
              <>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-500/40 scale-105"
                    : "bg-gradient-to-br from-cyan-500 to-blue-700 shadow-cyan-500/20"
                }`}>
                  <item.icon className="w-7 h-7 text-white stroke-[2.5px]" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wide leading-none mt-1 ${
                  isActive ? "text-cyan-500 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"
                }`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ) : (
          /* ── Regular nav item ── */
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
        )
      )}
    </div>
  );
}
