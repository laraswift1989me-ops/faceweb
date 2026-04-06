import { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import { Bell, CheckCircle2, AlertCircle, Info, ShieldAlert, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { APP_NAME } from "../../config";

export function Notifications() {
  const { notifications, unreadCount, markNotificationRead } = useApp();
  const hasMarkedRef = useRef(false);

  // Auto-mark all as read when user opens the page
  useEffect(() => {
    if (unreadCount > 0 && !hasMarkedRef.current) {
      hasMarkedRef.current = true;
      markNotificationRead(0); // marks all read
    }
  }, [unreadCount]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-2">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Stay informed with real-time system alerts, profit signals, and security updates.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
              <Bell className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Total Alerts</p>
              <p className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter">{notifications?.length ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {notifications?.length > 0 ? (
          notifications.map((notif: any, i: number) => {
            const Icon = notif.type === 'success' ? CheckCircle2 :
                         notif.type === 'warning' ? ShieldAlert :
                         notif.type === 'error' ? AlertCircle : Info;

            const colorClass = notif.type === 'success'
              ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20'
              : notif.type === 'warning'
              ? 'text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20'
              : notif.type === 'error'
              ? 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20'
              : 'text-cyan-500 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20';

            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group p-6 rounded-[32px] border backdrop-blur-md transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-start gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${colorClass}`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black italic text-lg tracking-tight uppercase text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        {format(new Date(notif.created_at || Date.now()), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                      {notif.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-32 bg-slate-50 dark:bg-slate-800/40 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700/50">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
              <Bell className="w-10 h-10" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-black italic text-xl uppercase tracking-tighter mb-2">No Notifications Yet</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Alerts for deposits, harvests, referrals, and security events will appear here.</p>
          </div>
        )}
      </div>

      <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white font-bold italic uppercase tracking-tight">Security Alert Integration</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Notifications are end-to-end encrypted and verified by {APP_NAME} Alpha Core.</p>
          </div>
        </div>
        <button className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-700 dark:hover:text-white transition-colors flex items-center gap-2">
          NOTIFICATION PREFERENCES <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
