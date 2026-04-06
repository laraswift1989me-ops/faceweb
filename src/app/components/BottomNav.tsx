import { Home, Wallet, Zap, CheckSquare, Coins, Users, ArrowLeftRight } from "lucide-react";
import { NavLink } from "react-router";

export function BottomNav() {
  const sideItems = [
    { label: "Home",    path: "/dashboard", icon: Home },
    { label: "Wallet",  path: "/wallet",    icon: Wallet },
    { label: "Stake",   path: "/stake",     icon: Zap },
  ];

  const rightItems = [
    { label: "Network", path: "/refer",     icon: Users },
    { label: "Tasks",   path: "/tasks",     icon: CheckSquare },
    { label: "P2P",     path: "/p2p",       icon: ArrowLeftRight },
  ];

  const navCls = (isActive: boolean) => `
    flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all duration-200
    ${isActive
      ? "text-cyan-500 dark:text-cyan-400"
      : "text-slate-400 dark:text-slate-500"
    }
  `;

  const iconCls = (isActive: boolean) =>
    `w-[22px] h-[22px] transition-all ${isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Frosted glass bar */}
      <div className="relative flex items-end justify-around px-1 pt-1.5 pb-6
                      bg-white/90 dark:bg-slate-900/90
                      backdrop-blur-2xl
                      border-t border-slate-200/60 dark:border-slate-800/50
                      shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)]">

        {/* Left side items */}
        {sideItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => navCls(isActive)}>
            {({ isActive }) => (
              <>
                <item.icon className={iconCls(isActive)} />
                <span className={`text-[9px] font-bold leading-none ${isActive ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* ═══ CENTER SWIFT BUTTON — elevated, glowing ═══ */}
        <NavLink to="/swiftcash" className="relative -mt-7 flex flex-col items-center">
          {({ isActive }) => (
            <>
              {/* Outer glow ring */}
              <div className={`absolute top-1 w-[60px] h-[60px] rounded-[20px] transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-cyan-400 to-blue-500 opacity-40 blur-lg scale-110"
                  : "bg-gradient-to-br from-cyan-500 to-blue-600 opacity-25 blur-md"
              }`} />

              {/* Main button */}
              <div className={`relative w-[56px] h-[56px] rounded-[18px] flex items-center justify-center shadow-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 shadow-cyan-500/50 scale-105"
                  : "bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 shadow-cyan-500/30 hover:scale-105"
              }`}>
                <img src="/logos/token-icon-dark.svg" alt="" className="w-8 h-8 rounded-lg drop-shadow-lg" />
              </div>

              <span className={`text-[9px] font-extrabold mt-1 leading-none tracking-wide ${
                isActive ? "text-cyan-500 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"
              }`}>Swift</span>
            </>
          )}
        </NavLink>

        {/* Right side items */}
        {rightItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => navCls(isActive)}>
            {({ isActive }) => (
              <>
                <item.icon className={iconCls(isActive)} />
                <span className={`text-[9px] font-bold leading-none ${isActive ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"}`}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
