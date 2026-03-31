import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import { ClipboardList, CheckCircle2, Zap, ShieldCheck, Share2, LogIn, TrendingUp, RefreshCw, Trophy, Star, Gift, ChevronRight, Lock, Calendar, Target } from "lucide-react";
import { toast } from "sonner";

export function Tasks() {
  const { tasks, completeTask, refreshAll, user } = useApp();
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    refreshAll();
  }, []);

  const handleCompleteTask = async (taskId: number) => {
    setLoading(taskId);
    try {
      await completeTask(taskId);
      toast.success("Task completed successfully! Reward added to your balance.");
    } catch (err: any) {
      toast.error(err.message || "Failed to complete task");
    } finally {
      setLoading(null);
    }
  };

  const oneTimeTasks = [
    { id: 1, title: "KYC Verification", description: "Complete identity verification to secure your account.", reward: "$10.00", icon: ShieldCheck, status: user?.kyc_status === "verified" ? "Completed" : "Start", type: "onetime" },
    { id: 2, title: "Telegram Community", description: "Join our official telegram group for real-time updates.", reward: "$2.00", icon: Send, status: "Start", type: "onetime" },
    { id: 3, title: "Follow Twitter", description: "Follow our official twitter handle and stay informed.", reward: "$1.50", icon: Twitter, status: "Start", type: "onetime" },
  ];

  const dailyTasks = [
    { id: 4, title: "Daily Login", description: "Access the platform daily to earn consistent bonuses.", reward: "$0.50", icon: LogIn, status: "Completed", type: "daily" },
    { id: 5, title: "Share Referral Link", description: "Share your referral link on any social platform.", reward: "$1.00", icon: Share2, status: "Start", type: "daily" },
  ];

  const weeklyStreak = [
    { day: "Mon", done: true },
    { day: "Tue", done: true },
    { day: "Wed", done: true },
    { day: "Thu", done: true },
    { day: "Fri", done: false },
    { day: "Sat", done: false },
    { day: "Sun", done: false },
  ];

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Rewards Engine</h1>
          <p className="text-slate-400 font-medium tracking-wide">Complete missions to earn additional USDT bonuses and level boosters.</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-800/50 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Gift className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Total Task Bonus</p>
              <p className="text-white text-xl font-black italic tracking-tighter">$42.50 USDT</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: TASK LISTS */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* SECTION: DAILY MISSIONS */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Daily Operations</h3>
            </div>

            <div className="space-y-4">
              {dailyTasks.map((task) => (
                <div key={task.id} className="bg-slate-900/50 backdrop-blur-md p-6 rounded-[32px] border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all shadow-lg group-hover:shadow-cyan-500/5">
                      <task.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold italic uppercase tracking-tight">{task.title}</h4>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">Reward: {task.reward}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">Daily Reset</span>
                      </div>
                    </div>
                  </div>
                  
                  {task.status === "Completed" ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                      <CheckCircle2 className="w-4 h-4" /> COMPLETED
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={loading === task.id}
                      className="px-6 py-2 rounded-xl bg-white text-slate-950 text-[10px] font-black tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
                    >
                      {loading === task.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>START MISSION <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SECTION: ONE-TIME CHALLENGES */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Global Milestones</h3>
            </div>

            <div className="space-y-4">
              {oneTimeTasks.map((task) => (
                <div key={task.id} className="bg-slate-900/50 backdrop-blur-md p-6 rounded-[32px] border border-slate-800/50 flex items-center justify-between group hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all shadow-lg group-hover:shadow-amber-500/5">
                      <task.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold italic uppercase tracking-tight">{task.title}</h4>
                      <p className="text-slate-500 text-xs font-medium mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">Bonus: {task.reward}</span>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <span className="text-slate-600 text-[10px] font-black tracking-widest uppercase">One-Time Only</span>
                      </div>
                    </div>
                  </div>
                  
                  {task.status === "Completed" ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                      <CheckCircle2 className="w-4 h-4" /> COMPLETED
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      disabled={loading === task.id}
                      className="px-6 py-2 rounded-xl bg-slate-800 text-white text-[10px] font-black tracking-widest uppercase hover:bg-slate-700 transition-colors border border-slate-700 shadow-lg flex items-center gap-2"
                    >
                      {loading === task.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>START TASK <ChevronRight className="w-4 h-4" /></>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: STREAK & STATS */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* SECTION: WEEKLY STREAK */}
          <section className="bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-slate-950 p-8 rounded-[40px] border border-indigo-500/30 shadow-2xl">
            <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-8">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Activity Streak
            </h3>

            <div className="flex items-center justify-between mb-8">
              {weeklyStreak.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                    day.done 
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-500/10" 
                    : "bg-slate-800/50 border-slate-700 text-slate-600"
                  }`}>
                    {day.done ? <CheckCircle2 className="w-4 h-4" /> : <Star className="w-4 h-4 opacity-30" />}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${day.done ? "text-white" : "text-slate-600"}`}>{day.day}</span>
                </div>
              ))}
            </div>

            <div className="p-5 bg-slate-950/50 rounded-3xl border border-slate-800/50 text-center">
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Current Multiplier</p>
              <p className="text-white text-3xl font-black italic tracking-tighter">1.25x <span className="text-cyan-400">YIELD</span></p>
              <div className="mt-4 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full w-[60%] shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              </div>
              <p className="text-slate-600 text-[10px] font-bold mt-2 uppercase tracking-wide italic">4 days remaining for 1.5x boost</p>
            </div>
          </section>

          {/* SECTION: BOOSTER INFO */}
          <section className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[40px] border border-slate-800/50">
            <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-3 mb-8">
              <Target className="w-5 h-5 text-rose-400" />
              Alpha Boosters
            </h3>

            <div className="space-y-6">
              <div className="relative flex gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-all shadow-lg group-hover:shadow-cyan-500/5 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold italic text-sm uppercase">Level 10 Achievement</h4>
                  <p className="text-slate-500 text-[10px] mt-1 font-medium">Unlock "Super Miner" mode with 15% ROI increase.</p>
                </div>
              </div>

              <div className="relative flex gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-all shadow-lg group-hover:shadow-amber-500/5 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold italic text-sm uppercase">Level 25 Achievement</h4>
                  <p className="text-slate-500 text-[10px] mt-1 font-medium">Unlock "Whale Tracker" and instant withdrawals.</p>
                </div>
              </div>

              <div className="relative flex gap-5 group">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 group-hover:bg-rose-500/10 group-hover:text-rose-400 transition-all shadow-lg group-hover:shadow-rose-500/5 shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold italic text-sm uppercase">Level 50 Achievement</h4>
                  <p className="text-slate-500 text-[10px] mt-1 font-medium">Unlock "Freezed Asset Maturity" and 0% withdrawal fees.</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Icons
import { Send, Twitter } from "lucide-react";
