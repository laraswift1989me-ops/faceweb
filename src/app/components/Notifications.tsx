import { useState } from "react";
import {
  ArrowLeft,
  TrendingUp,
  Gift,
  Users,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Info,
  Bell,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface NotificationsProps {
  onBack: () => void;
}

export function Notifications({ onBack }: NotificationsProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  // Pull live data from context
  const {
    notifications,
    unreadCount,
    markAllNotificationsRead,
  } = useApp();

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: TrendingUp,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10",
        };
      case "reward":
        return {
          icon: Gift,
          color: "text-cyan-400",
          bg: "bg-cyan-500/10",
        };
      case "referral":
        return {
          icon: Users,
          color: "text-purple-400",
          bg: "bg-purple-500/10",
        };
      case "deposit":
      case "withdrawal":
        return {
          icon: Wallet,
          color: "text-blue-400",
          bg: "bg-blue-500/10",
        };
      case "warning":
        return {
          icon: AlertCircle,
          color: "text-orange-400",
          bg: "bg-orange-500/10",
        };
      default:
        return {
          icon: Info,
          color: "text-slate-400",
          bg: "bg-slate-500/10",
        };
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
  };

  // Filter logic
  const filteredNotifs = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.is_read;
    if (activeFilter !== "all") return n.type === activeFilter;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4">
      <div className="w-full max-w-6xl px-4 lg:px-10 py-6 lg:py-12 space-y-6 lg:space-y-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-white text-2xl font-black italic tracking-tight sm:text-3xl">
                Alert Center
              </h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                Real-time ecosystem updates
              </p>
            </div>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="hidden sm:flex items-center bg-slate-900 border border-slate-800 text-slate-400 px-6 py-3 rounded-2xl text-xs font-black hover:text-white transition-all shadow-lg"
          >
            MARK ALL AS READ
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 space-y-2">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic mb-4 px-2">
                Global Filters
              </h3>
              {[
                {
                  id: "all",
                  label: "All Alerts",
                  count: notifications.length,
                  icon: Bell,
                },
                {
                  id: "unread",
                  label: "Unread",
                  count: unreadCount,
                  icon: Info,
                  color: "text-cyan-400",
                },
                {
                  id: "reward",
                  label: "Rewards",
                  count: notifications.filter(
                    (n) => n.type === "reward",
                  ).length,
                  icon: Gift,
                  color: "text-yellow-400",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveFilter(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${activeFilter === item.id ? "bg-cyan-500/10 border-cyan-500/30 text-white" : "border-transparent text-slate-400 hover:bg-slate-800"}`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      className={`w-5 h-5 ${activeFilter === item.id ? "text-cyan-400" : "text-slate-600"}`}
                    />
                    <span className="font-black text-sm uppercase tracking-tighter italic">
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full ${activeFilter === item.id ? "bg-cyan-500/20 text-cyan-400" : "bg-slate-800 text-slate-500"}`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-4">
              {filteredNotifs.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/50 rounded-3xl border border-slate-800 text-slate-500">
                  No notifications found.
                </div>
              ) : (
                filteredNotifs.map((n) => {
                  const style = getNotificationStyle(n.type);
                  const Icon = style.icon;
                  return (
                    <div
                      key={n.id}
                      className={`bg-slate-900 border rounded-[32px] p-6 transition-all group hover:border-slate-700 relative overflow-hidden shadow-xl ${n.is_read ? "border-slate-800" : "border-cyan-500/30 bg-cyan-500/5"}`}
                    >
                      {!n.is_read && (
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-blue-600 shadow-[2px_0_10px_rgba(34,211,238,0.2)]" />
                      )}
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div
                          className={`w-16 h-16 rounded-2xl ${style.bg} flex items-center justify-center shrink-0 border border-white/5 shadow-inner`}
                        >
                          <Icon
                            className={`w-8 h-8 ${style.color}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-white font-black text-lg italic tracking-tight">
                              {n.title}
                            </h3>
                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap mt-1 italic">
                              {new Date(
                                n.created_at,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed mb-4">
                            {n.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}