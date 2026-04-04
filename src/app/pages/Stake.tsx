import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap, ShieldAlert, Lock, TrendingUp, RefreshCw, X, ArrowRight,
  Wallet, CheckCircle2, Clock, DollarSign, Calendar, BarChart3, Layers
} from "lucide-react";
import { toast } from "sonner";
import { fmtAmount } from "../../utils/format";
import { format, formatDistanceToNow } from "date-fns";

export function Stake() {
  const { stakeProjects, userStakes, wallet, stake, harvest, refreshAll, user } = useApp();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [harvestingId, setHarvestingId] = useState<number | null>(null);
  const [tab, setTab] = useState<"projects" | "stakes">("projects");

  useEffect(() => { refreshAll(); }, []);

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !stakeAmount) return;
    const amountNum = parseFloat(stakeAmount);
    if (isNaN(amountNum) || amountNum < 20) { toast.error("Minimum stake amount is $20"); return; }
    if (amountNum > parseFloat(String(wallet?.available_balance || "0"))) { toast.error("Insufficient available balance"); return; }
    setLoading(true);
    try {
      await stake(selectedProject.id, amountNum);
      toast.success(`Successfully staked $${amountNum} in ${selectedProject.name}`);
      setSelectedProject(null);
      setStakeAmount("");
      setTab("stakes");
    } catch (err: any) { toast.error(err.message || "Staking failed"); }
    finally { setLoading(false); }
  };

  const handleHarvest = async (stakeId: number) => {
    setHarvestingId(stakeId);
    try {
      const msg = await harvest(stakeId);
      toast.success(msg || "Harvest successful!");
    } catch (err: any) { toast.error(err.message || "Harvest failed"); }
    finally { setHarvestingId(null); }
  };

  const userLevel = user?.level || 0;
  const totalStaked = userStakes?.reduce((s: number, st: any) => s + parseFloat(st.amount || 0), 0) || 0;
  const totalDailyYield = userStakes?.reduce((s: number, st: any) => s + (parseFloat(st.amount || 0) * parseFloat(st.daily_percent || 0) / 100), 0) || 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-2">AI Yield Staking</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Select a project to generate smart yields via AI-driven quantitative trading.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Available</p>
            <p className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter">${fmtAmount(wallet?.available_balance)}</p>
          </div>
          <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800" />
          <div>
            <p className="text-cyan-500 dark:text-cyan-400 text-[10px] font-black tracking-widest uppercase mb-1">Level</p>
            <p className="text-cyan-500 dark:text-cyan-400 text-xl font-black italic tracking-tighter">{userLevel}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-full md:w-auto md:inline-flex">
        <button onClick={() => setTab("projects")}
          className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-black uppercase tracking-tight transition-all ${
            tab === "projects" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}>
          Projects
        </button>
        <button onClick={() => setTab("stakes")}
          className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-sm font-black uppercase tracking-tight transition-all flex items-center justify-center gap-2 ${
            tab === "stakes" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}>
          My Stakes
          {userStakes?.length > 0 && (
            <span className="bg-cyan-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{userStakes.length}</span>
          )}
        </button>
      </div>

      {/* ═══ TAB: PROJECTS ═══ */}
      {tab === "projects" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stakeProjects?.map((project: any) => {
            const isLocked = userLevel < project.unlock_level;
            const dailyRoiNum = parseFloat(project.daily_roi || project.daily_roi_percent || "0");
            const roi90 = (dailyRoiNum * 90).toFixed(0);

            return (
              <motion.div key={project.id} whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
                className={`relative overflow-hidden p-6 rounded-[32px] border transition-all duration-500 ${
                  isLocked
                    ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl group hover:border-cyan-500/50 dark:hover:border-cyan-500/50"
                }`}>
                {isLocked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-200/60 dark:bg-slate-950/40 backdrop-blur-[2px] p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-300 dark:border-slate-700">
                      <Lock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-tighter mb-1">Locked</p>
                    <p className="text-cyan-500 dark:text-cyan-400 text-xs font-black tracking-widest uppercase">Level {project.unlock_level} Required</p>
                  </div>
                )}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                    isLocked ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400" : "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-500 dark:text-cyan-400 shadow-lg shadow-cyan-500/10"
                  }`}>
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-500 dark:text-emerald-400 text-lg font-black italic tracking-tighter">{roi90}%</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">Projected Yield</p>
                  </div>
                </div>
                <h3 className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter uppercase mb-2">{project.name}</h3>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-6 line-clamp-2">AI-powered quantitative trading with smart liquidation protection.</p>
                <div className="space-y-3 mb-6">
                  {[
                    ["Daily Rate", `${dailyRoiNum.toFixed(2)}%`],
                    ["Min. Stake", "$20.00"],
                    ["Duration", "Lock Period"],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                      <span className="text-slate-400 dark:text-slate-500">{label}</span>
                      <span className="text-slate-900 dark:text-white">{val}</span>
                    </div>
                  ))}
                </div>
                <button type="button" disabled={isLocked} onClick={() => setSelectedProject(project)}
                  className={`w-full py-3.5 rounded-2xl font-black italic tracking-tight uppercase flex items-center justify-center gap-2 transition-all ${
                    isLocked ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600" : "bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-cyan-500 dark:hover:bg-cyan-400 shadow-lg"
                  }`}>
                  {isLocked ? "LOCKED" : "STAKE NOW"}{!isLocked && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══ TAB: MY ACTIVE STAKES ═══ */}
      {tab === "stakes" && (
        <div className="space-y-8">
          {/* Summary Cards */}
          {userStakes?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
                    <Layers className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Total Staked</p>
                </div>
                <p className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">${fmtAmount(totalStaked)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
                    <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Daily Yield</p>
                </div>
                <p className="text-emerald-500 dark:text-emerald-400 text-2xl font-black italic tracking-tighter">+${fmtAmount(totalDailyYield)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                    <BarChart3 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Active Pools</p>
                </div>
                <p className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">{userStakes.length}</p>
              </div>
            </div>
          )}

          {/* Stakes List */}
          <div className="space-y-5">
            {userStakes?.length > 0 ? userStakes.map((s: any) => {
              const dailyPercent = parseFloat(s.daily_percent || 0);
              const amount = parseFloat(s.amount || 0);
              const dailyProfit = amount * (dailyPercent / 100);
              const harvestedToday = s.harvested_today;
              const isHarvesting = harvestingId === s.id;
              const createdAt = s.created_at ? new Date(s.created_at) : null;
              const roi90Total = amount * (dailyPercent / 100) * 90;

              return (
                <motion.div key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg"
                >
                  {/* Stake Header */}
                  <div className="p-6 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/30 shrink-0">
                        <Zap className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-slate-900 dark:text-white text-lg font-black italic tracking-tighter uppercase">{s.project_name}</h3>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-0.5">
                          {createdAt ? `Staked ${formatDistanceToNow(createdAt, { addSuffix: true })} • ${format(createdAt, "MMM dd, yyyy")}` : "Active"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest uppercase shrink-0">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active
                    </span>
                  </div>

                  {/* Stats Grid */}
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">Staked</p>
                      </div>
                      <p className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter">${fmtAmount(amount)}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">Daily Yield</p>
                      </div>
                      <p className="text-emerald-500 dark:text-emerald-400 text-xl font-black italic tracking-tighter">+${fmtAmount(dailyProfit)}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">Daily Rate</p>
                      </div>
                      <p className="text-cyan-500 dark:text-cyan-400 text-xl font-black italic tracking-tighter">{dailyPercent.toFixed(2)}%</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">Total ROI</p>
                      </div>
                      <p className="text-indigo-500 dark:text-indigo-400 text-xl font-black italic tracking-tighter">+${fmtAmount(roi90Total)}</p>
                    </div>
                  </div>

                  {/* Harvest Action Bar */}
                  <div className="px-6 pb-6">
                    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl border ${
                      harvestedToday
                        ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20"
                        : "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-500/20"
                    }`}>
                      <div className="flex items-center gap-3">
                        {harvestedToday
                          ? <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                          : <Clock className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                        }
                        <div>
                          <p className={`text-sm font-black uppercase italic tracking-tight ${
                            harvestedToday ? "text-emerald-600 dark:text-emerald-400" : "text-cyan-600 dark:text-cyan-400"
                          }`}>
                            {harvestedToday ? "Harvested Today" : `$${fmtAmount(dailyProfit)} Available to Harvest`}
                          </p>
                          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-0.5">
                            {harvestedToday ? "Come back tomorrow for the next harvest" : "Harvest before 00:00 UTC or profit is lost"}
                          </p>
                        </div>
                      </div>
                      {!harvestedToday && (
                        <button onClick={() => handleHarvest(s.id)} disabled={isHarvesting}
                          className="w-full sm:w-auto bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-black py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90">
                          {isHarvesting
                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                            : <><TrendingUp className="w-4 h-4" /> Harvest</>
                          }
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="text-center py-24 bg-slate-50 dark:bg-slate-800/40 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700/50">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
                  <Zap className="w-10 h-10" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-black italic text-xl uppercase tracking-tighter mb-2">No Active Stakes</h3>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-6">Start staking to earn daily AI-driven yields.</p>
                <button onClick={() => setTab("projects")}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black px-8 py-3 rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors shadow-lg inline-flex items-center gap-2">
                  Browse Projects <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ STAKE MODAL ═══ */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 lg:p-10 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-48 h-48 text-cyan-400" /></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/30 text-cyan-500 dark:text-cyan-400">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">{selectedProject.name}</h3>
                      <p className="text-cyan-500 dark:text-cyan-400 text-[10px] font-black tracking-widest uppercase">Staking Configuration</p>
                    </div>
                  </div>
                  <button type="button" title="Close" onClick={() => setSelectedProject(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleStakeSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Stake Amount</label>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold">Balance: ${fmtAmount(wallet?.available_balance)}</span>
                    </div>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                      <input type="number" placeholder="0.00" required min="20" step="0.01"
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 pl-14 pr-16 text-2xl font-black italic text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-cyan-500/50 transition-all"
                        value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black italic">USDT</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/50 space-y-4">
                    {(() => {
                      const roi = parseFloat(selectedProject.daily_roi || selectedProject.daily_roi_percent || "0");
                      const amt = parseFloat(stakeAmount || "0");
                      const profit90 = amt * (roi / 100) * 90;
                      return (
                        <>
                          <div className="flex justify-between items-center">
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Daily Rate</p>
                            <p className="text-emerald-500 dark:text-emerald-400 font-black italic">{roi.toFixed(2)}%</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Estimated Profit</p>
                            <p className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">+${fmtAmount(profit90)}</p>
                          </div>
                          <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />
                          <div className="flex justify-between items-center">
                            <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Maturity Value</p>
                            <p className="text-cyan-500 dark:text-cyan-400 text-2xl font-black italic tracking-tighter">${fmtAmount(amt + profit90)}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  <button type="submit" disabled={loading || !stakeAmount || parseFloat(stakeAmount) < 20}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                    {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><ShieldAlert className="w-6 h-6" /> CONFIRM STAKE</>}
                  </button>
                  <p className="text-slate-400 dark:text-slate-600 text-[10px] text-center font-black uppercase tracking-[0.2em]">Staking capital is locked for the investment period</p>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
