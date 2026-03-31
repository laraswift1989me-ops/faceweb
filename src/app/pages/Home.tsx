import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import { TrendingUp, Wallet, Zap, Users, Trophy, ClipboardList, History, ArrowUpRight, ArrowDownLeft, Clock, RefreshCw, ChevronRight, CheckCircle2, ShieldCheck, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function Home() {
  const { stats, wallet, leaderboard, tasks, transactions, harvest, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [nextHarvestTime, setNextHarvestTime] = useState("");

  useEffect(() => {
    // Calculate time until 00:00 UTC
    const timer = setInterval(() => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const tomorrow = new Date(utcNow);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      
      const diff = tomorrow.getTime() - utcNow.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      
      setNextHarvestTime(`${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleHarvest = async () => {
    setLoading(true);
    try {
      // In a real app, we'd pass a project ID or a global harvest endpoint
      const amount = await harvest(0); 
      toast.success(`Harvest Successful! +$${amount} added to locked balance.`);
    } catch (err: any) {
      toast.error(err.message || "Failed to harvest profit");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      {/* SECTION 1: HERO STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-[32px] border border-slate-700/50 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-cyan-500/10 blur-2xl rounded-full group-hover:bg-cyan-500/20 transition-all" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total All-Time Earnings</p>
              <h2 className="text-3xl font-black text-white italic tracking-tighter">${stats?.total_earned || "0.00"}</h2>
            </div>
          </div>
          <p className="text-emerald-400 text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Includes Bonuses & Referrals
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-[32px] border border-slate-700/50 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:bg-blue-500/20 transition-all" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Stakes</p>
              <h2 className="text-3xl font-black text-white italic tracking-tighter">${stats?.active_investments || "0.00"}</h2>
            </div>
          </div>
          <p className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">Yielding 1.0% Daily ROI</p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-6 rounded-[32px] border border-slate-700/50 shadow-xl relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Network Bonus</p>
              <h2 className="text-3xl font-black text-white italic tracking-tighter">${stats?.referral_bonus_total || "0.00"}</h2>
            </div>
          </div>
          <p className="text-indigo-400 text-[10px] font-black tracking-widest uppercase">From 3-Tier Network Growth</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
          
          {/* SECTION 2: HARVEST DASHBOARD */}
          <section className="bg-gradient-to-br from-slate-900 via-slate-800/40 to-slate-900 p-8 rounded-[40px] border border-slate-700/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-32 h-32 text-cyan-400" strokeWidth={1} />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-[0.2em] uppercase">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Yield Processor Active
                </div>
                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Daily AI Profit Pool</h3>
                <div className="grid grid-cols-2 gap-8 pt-2">
                  <div>
                    <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mb-1">Staked Amount</p>
                    <p className="text-white text-2xl font-black">${wallet?.locked_balance || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-1">Pending Yield</p>
                    <p className="text-cyan-400 text-2xl font-black">+$4.25</p>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto text-center space-y-4">
                <div className="bg-slate-950/50 backdrop-blur-md p-4 rounded-3xl border border-slate-800/50">
                  <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Next Cycle Reset (UTC)</p>
                  <div className="flex items-center justify-center gap-2 text-white font-mono text-2xl font-black italic">
                    <Clock className="w-5 h-5 text-cyan-400" />
                    {nextHarvestTime}
                  </div>
                </div>
                <button 
                  onClick={handleHarvest}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" /> HARVEST PROFITS</>}
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 5: PENDING TASKS */}
          <section className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[40px] border border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <ClipboardList className="w-6 h-6 text-indigo-400" />
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Pending Operations</h3>
              </div>
              <span className="text-slate-500 text-[10px] font-black tracking-widest uppercase">Verified Tasks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 p-5 rounded-[28px] border border-slate-700/30 flex items-center justify-between group hover:bg-slate-800/60 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <ShieldCheck className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">KYC Verification</p>
                    <p className="text-indigo-400 text-[10px] font-black tracking-widest uppercase">+$10.00 Reward</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors" />
              </div>

              <div className="bg-slate-800/40 p-5 rounded-[28px] border border-slate-700/30 flex items-center justify-between group hover:bg-slate-800/60 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Daily System Login</p>
                    <p className="text-emerald-400 text-[10px] font-black tracking-widest uppercase">+$0.50 Daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  DONE
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 6: RECENT TRANSACTIONS */}
          <section className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[40px] border border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-slate-400" />
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Activity Ledger</h3>
              </div>
              <button className="text-cyan-400 text-[10px] font-black tracking-widest uppercase hover:underline">View All History</button>
            </div>

            <div className="space-y-4">
              {transactions?.length > 0 ? (
                transactions.slice(0, 5).map((tx: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800/20 rounded-2xl border border-slate-700/20">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === "deposit" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {tx.type === "deposit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold uppercase tracking-tight">{tx.description || "System Transaction"}</p>
                        <p className="text-slate-500 text-[10px] font-medium">{format(new Date(tx.created_at || Date.now()), "MMM dd, yyyy • HH:mm")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black italic ${
                        tx.type === "deposit" ? "text-emerald-400" : "text-rose-400"
                      }`}>
                        {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                      </p>
                      <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{tx.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 text-sm font-black uppercase tracking-[0.2em]">No Recent Activity Found</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          
          {/* SECTION 3: MY WALLET SUMMARY */}
          <section className="bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-slate-950 p-6 rounded-[32px] border border-indigo-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" />
                Wallet Matrix
              </h3>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            <div className="space-y-5">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800/50">
                <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Available Liquidity</p>
                <p className="text-white text-3xl font-black italic tracking-tighter">${wallet?.available_balance || "0.00"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                  <p className="text-slate-500 text-[9px] font-black tracking-widest uppercase mb-1">Locked</p>
                  <p className="text-cyan-400 text-lg font-black">${wallet?.locked_balance || "0.00"}</p>
                </div>
                <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                  <p className="text-slate-500 text-[9px] font-black tracking-widest uppercase mb-1">Freezed</p>
                  <p className="text-blue-400 text-lg font-black">${wallet?.freezed_balance || "0.00"}</p>
                </div>
              </div>

              <div className="bg-slate-950/50 p-3 rounded-2xl border border-slate-800/50 flex items-center justify-between group">
                <div className="overflow-hidden">
                  <p className="text-slate-600 text-[8px] font-black tracking-widest uppercase mb-1">TRC20 USDT Address</p>
                  <p className="text-white text-[11px] font-mono truncate max-w-[150px]">{wallet?.trc20_address || "T..."}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(wallet?.trc20_address || "")}
                  className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4: LEADERBOARD */}
          <section className="bg-slate-900/50 backdrop-blur-md p-6 rounded-[32px] border border-slate-800/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Alpha Whales
              </h3>
              <span className="text-slate-500 text-[9px] font-black uppercase">Top 15</span>
            </div>

            <div className="space-y-3">
              {leaderboard?.slice(0, 10).map((whale: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-800/20 rounded-2xl border border-slate-700/20 group hover:bg-slate-800/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${
                      i === 0 ? "bg-amber-400 text-black shadow-lg shadow-amber-500/20" : 
                      i === 1 ? "bg-slate-300 text-black" : 
                      i === 2 ? "bg-amber-700 text-white" : "bg-slate-700 text-slate-400"
                    }`}>
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold truncate max-w-[100px]">{whale.name}</p>
                      <p className="text-cyan-400 text-[9px] font-black tracking-widest uppercase">Level {whale.level}</p>
                    </div>
                  </div>
                  <p className="text-white text-xs font-black italic tracking-tight">${whale.total_earned}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 7: NETWORK STATUS */}
          <section className="bg-slate-900/80 p-5 rounded-[28px] border border-slate-800/50">
            <p className="text-slate-600 text-[10px] font-black tracking-[0.2em] uppercase mb-4">Core Infrastructure</p>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-slate-400 text-[10px] font-bold">TRON NODE 01</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-black">9ms • SECURE</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-slate-400 text-[10px] font-bold">SWIFT AI ENGINE</span>
                </div>
                <span className="text-emerald-400 text-[10px] font-black">STABLE</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                  <span className="text-slate-400 text-[10px] font-bold">API STATUS</span>
                </div>
                <span className="text-cyan-400 text-[10px] font-black">OPERATIONAL</span>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
