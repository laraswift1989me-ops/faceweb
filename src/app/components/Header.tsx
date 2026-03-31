import { Bell, User, Search, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate, Link } from "react-router";

export function Header() {
  const { user, unreadCount } = useApp();
  const navigate = useNavigate();

  const userName = user?.name || "User";
  const initials = userName.slice(0, 2).toUpperCase();
  const userLevel = user?.level || 1;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-black text-xs italic">S</span>
          </div>
          <span className="text-white font-black text-lg tracking-tighter italic">SWIFTEARN</span>
        </Link>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/notifications")}
            className="relative p-2 bg-slate-800/50 rounded-xl border border-slate-700/50"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900" />
            )}
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex flex-col items-center justify-center border border-white/20"
          >
            <span className="text-white font-bold text-xs leading-none">{initials}</span>
            <span className="text-[8px] text-white font-black opacity-80 leading-none mt-0.5">L{userLevel}</span>
          </button>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden lg:flex items-center justify-between px-10 py-6 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 border-b border-slate-800/50">
        <div className="flex items-center bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2 w-96">
          <Search className="w-5 h-5 text-slate-500 mr-3" />
          <input
            type="text"
            placeholder="Search markets, assets, or projects..."
            className="bg-transparent text-slate-300 text-sm outline-none w-full"
          />
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigate("/notifications")}
            className="relative p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-slate-900" />
            )}
          </button>
          <button 
            onClick={() => navigate("/profile")}
            className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-300" />
          </button>
          <div className="h-10 w-[1px] bg-slate-700/50" />
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => navigate("/profile")}
          >
            <div className="text-right">
              <p className="text-white text-sm font-bold group-hover:text-cyan-400 transition-colors">
                {userName}
              </p>
              <p className="text-cyan-400 text-[10px] font-bold tracking-widest uppercase">
                Level {userLevel}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center border border-white/20 shadow-lg shadow-cyan-500/20">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
