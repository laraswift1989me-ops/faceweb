import { Bell, User, Search, Settings } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate, Link } from "react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const { user, unreadCount } = useApp();
  const navigate = useNavigate();

  const userName = user?.name || "User";
  const initials = userName.slice(0, 2).toUpperCase();
  const userLevel = user?.level || 1;

  const iconBtn = "relative p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors";

  return (
    <>
      {/* ── Mobile Header ─────────────────────────────────────────────────── */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4
                      bg-white dark:bg-slate-900
                      border-b border-slate-200 dark:border-slate-800
                      sticky top-0 z-50">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-black text-xs italic">S</span>
          </div>
          <span className="text-slate-900 dark:text-white font-black text-lg tracking-tighter italic">SWIFTEARN</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className={iconBtn}
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/25"
          >
            <span className="text-white font-bold text-xs leading-none">{initials}</span>
            <span className="text-[8px] text-white/80 font-black leading-none mt-0.5">L{userLevel}</span>
          </button>
        </div>
      </div>

      {/* ── Desktop Top Bar ───────────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-4
                      bg-white dark:bg-slate-900
                      sticky top-0 z-20
                      border-b border-slate-200 dark:border-slate-800">

        {/* Search bar */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 w-80 gap-3">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Search markets, assets…"
            className="bg-transparent text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 text-sm outline-none w-full"
          />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button type="button" onClick={() => navigate("/notifications")} className={iconBtn}>
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900" />
            )}
          </button>

          <button type="button" onClick={() => navigate("/profile")} className={iconBtn}>
            <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

          <button
            type="button"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            onClick={() => navigate("/profile")}
          >
            <div className="text-right">
              <p className="text-slate-900 dark:text-white text-sm font-bold">{userName}</p>
              <p className="text-cyan-500 dark:text-cyan-400 text-[10px] font-bold tracking-widest uppercase">Level {userLevel}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <User className="w-5 h-5 text-white" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
