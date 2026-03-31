import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert, Zap, ArrowRight, Trash2, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export function Notifications() {
  const { notifications, unreadCount, markNotificationRead, refreshAll } = useApp();

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Alpha Signal Hub</h1>
          <p className="text-slate-400 font-medium tracking-wide">Stay informed with real-time system alerts, profit signals, and security updates.</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-800/50 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
              <Bell className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Unread Alerts</p>
              <p className="text-white text-xl font-black italic tracking-tighter">{unreadCount} Pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notifications?.length > 0 ? (
          notifications.map((notif, i) => {
            const Icon = notif.type === 'success' ? CheckCircle2 : 
                         notif.type === 'warning' ? ShieldAlert : 
                         notif.type === 'error' ? AlertCircle : Info;
            
            const colorClass = notif.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 
                               notif.type === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 
                               notif.type === 'error' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group p-6 rounded-[32px] border backdrop-blur-md transition-all ${
                  notif.is_read 
                  ? "bg-slate-900/40 border-slate-800/50 opacity-80" 
                  : "bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 shadow-xl"
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${colorClass} ${!notif.is_read ? "shadow-lg" : ""}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-black italic text-lg tracking-tight uppercase ${notif.is_read ? "text-slate-300" : "text-white"}`}>
                        {notif.title}
                      </h4>
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        {format(new Date(notif.created_at || Date.now()), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <p className={`text-sm font-medium leading-relaxed ${notif.is_read ? "text-slate-500" : "text-slate-300"}`}>
                      {notif.message}
                    </p>
                    
                    {!notif.is_read && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest italic">New Signal Received</span>
                        </div>
                        <button 
                          onClick={() => handleMarkRead(notif.id)}
                          className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-800 text-white text-[10px] font-black tracking-widest uppercase hover:bg-slate-700 transition-colors border border-slate-700"
                        >
                          <CheckSquare className="w-4 h-4" /> Mark Read
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-32 bg-slate-900/50 rounded-[40px] border border-dashed border-slate-800">
            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-700 mx-auto mb-6">
              <Bell className="w-10 h-10" />
            </div>
            <h3 className="text-white font-black italic text-xl uppercase tracking-tighter mb-2">All Signals Cleared</h3>
            <p className="text-slate-500 text-sm font-medium">Your hub is up to date. New signals will appear here in real-time.</p>
          </div>
        )}
      </div>

      <div className="p-8 bg-slate-900/80 rounded-[40px] border border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white font-bold italic uppercase tracking-tight">Security Alert Integration</p>
            <p className="text-slate-500 text-xs font-medium">Notifications are end-to-end encrypted and verified by SwiftEarn Alpha Core.</p>
          </div>
        </div>
        <button className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
          NOTIFICATION PREFERENCES <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
