import { Home, Zap, Users, Wallet, CheckSquare, LogOut, User, MessageSquare } from "lucide-react";
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
    { label: "Profile", path: "/profile", icon: User },
    { label: "Support", path: "/support-tickets", icon: MessageSquare },
  ];

  return (
    <div className="w-72 h-full flex flex-col p-8 space-y-10
                    bg-white dark:bg-slate-900/80
                    backdrop-blur-xl
                    border-r border-slate-200/80 dark:border-slate-800/50
                    transition-colors duration-200">

      {/* Logo */}
      <Link to="/dashboard" className="flex items-center space-x-3 px-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <span className="text-white font-black text-2xl italic">S</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-900 dark:text-white font-black text-xl tracking-tighter leading-none italic uppercase">SWIFTEARN</span>
          <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-bold tracking-[0.2em] leading-none mt-1">SMART YIELD AI</span>
        </div>
      </Link>

      {/* Nav items */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${isActive
                ? "bg-gradient-to-r from-cyan-500/20 to-transparent border-l-4 border-cyan-400 text-slate-900 dark:text-white shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }
            `}
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-bold text-sm tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/50">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                     text-rose-500 dark:text-rose-400
                     hover:bg-rose-50 dark:hover:bg-rose-500/10"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-bold text-sm tracking-wide">Secure Logout</span>
        </button>
      </div>
    </div>
  );
}
