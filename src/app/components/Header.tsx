import { Bell } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "../../context/AppContext";

interface HeaderProps {
  onBellClick?: () => void;
  onAvatarClick?: () => void;
}

export function Header({
  onBellClick,
  onAvatarClick,
}: HeaderProps) {
  // Pull the live user data and notification count from our global state
  const { user, unreadCount } = useApp();

  const userName = user?.name || "User";
  const initials = userName.slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
      <Logo iconSize={18} textSize="text-lg" />

      <div className="flex items-center gap-4">
        <button
          onClick={onBellClick}
          className="relative hover:opacity-80 transition-opacity"
        >
          <Bell className="w-6 h-6 text-slate-300" />
          {/* Only show the red dot if there are actually unread notifications */}
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] text-white font-bold">
              {unreadCount}
            </div>
          )}
        </button>

        <button
          onClick={onAvatarClick}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center hover:opacity-80 transition-opacity border-2 border-slate-700"
        >
          <span className="text-white font-bold text-xs">
            {initials}
          </span>
        </button>
      </div>
    </div>
  );
}