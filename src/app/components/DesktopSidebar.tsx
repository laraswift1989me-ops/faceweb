import { Home, Zap, Users, Wallet, CheckSquare, LogOut, User, MessageSquare, ArrowLeftRight } from "lucide-react";
import { NavLink, Link } from "react-router";
import { useApp } from "../../context/AppContext";

export function DesktopSidebar() {
  const { logout } = useApp();

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "AI Staking", path: "/stake", icon: Zap },
    { label: "My Network", path: "/refer", icon: Users },
    { label: "Wallet & DeFi", path: "/wallet", icon: Wallet },
    { label: "Tasks", path: "/tasks", icon: CheckSquare },
    { label: "P2P Exchange", path: "/p2p", icon: ArrowLeftRight },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Support", path: "/support-tickets", icon: MessageSquare },
  ];

  return (
    <div className="w-72 h-full flex flex-col p-6 space-y-8
                    bg-white dark:bg-slate-900
                    border-r border-slate-200 dark:border-slate-800
                    transition-colors duration-200">

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center space-x-3 px-3 pt-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <span className="text-white font-black text-2xl italic">S</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-900 dark:text-white font-black text-xl tracking-tighter leading-none italic uppercase">SWIFTEARN</span>
          <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-bold tracking-[0.2em] leading-none mt-1">SMART YIELD AI</span>
        </div>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${isActive
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"}`} />
                <span className="font-semibold text-sm">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                     text-slate-500 dark:text-slate-400
                     hover:bg-rose-50 dark:hover:bg-rose-500/10
                     hover:text-rose-600 dark:hover:text-rose-400"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="font-semibold text-sm">Secure Logout</span>
        </button>
      </div>
    </div>
  );
}
