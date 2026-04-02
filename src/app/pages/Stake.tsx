import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { Zap, ShieldAlert, Lock, Unlock, TrendingUp, RefreshCw, X, ArrowRight, Wallet, History } from "lucide-react";
import { toast } from "sonner";
import { fmtAmount } from "../../utils/format";

export function Stake() {
  const { stakeProjects, wallet, stake, refreshAll, user } = useApp();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshAll();
  }, []);

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !stakeAmount) return;

    const amountNum = parseFloat(stakeAmount);
    if (isNaN(amountNum) || amountNum < 20) {
      toast.error("Minimum stake amount is $20");
      return;
    }

    if (amountNum > parseFloat(wallet?.available_balance || "0")) {
      toast.error("Insufficient available balance");
      return;
    }

    setLoading(true);
    try {
      await stake(selectedProject.id, amountNum);
      toast.success(`Successfully staked $${amountNum} in ${selectedProject.name}`);
      setSelectedProject(null);
      setStakeAmount("");
    } catch (err: any) {
      toast.error(err.message || "Staking failed");
    } finally {
      setLoading(false);
    }
  };

  const calculateROI = (amount: string, dailyRoi: string) => {
    const amt = parseFloat(amount) || 0;
    const roi = parseFloat(dailyRoi) || 0;
    return (amt * (roi / 100) * 90).toFixed(2);
  };

  const userLevel = user?.level || 1;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-2">AI Yield Staking</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Select a project to generate smart yields via AI-driven quantitative trading.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center gap-6">
          <div>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Available for Staking</p>
            <p className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter">${fmtAmount(wallet?.available_balance)}</p>
          </div>
          <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800" />
          <div>
            <p className="text-cyan-500 dark:text-cyan-400 text-[10px] font-black tracking-widest uppercase mb-1">Current User Level</p>
            <p className="text-cyan-500 dark:text-cyan-400 text-xl font-black italic tracking-tighter">LEVEL {userLevel}</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stakeProjects?.map((project) => {
          const isLocked = userLevel < project.unlock_level;
          const dailyRoiStr = project.daily_roi || project.daily_roi_percent || "0";
          const dailyRoiNum = parseFloat(dailyRoiStr) || 0;
          const roi90 = (dailyRoiNum * 90).toFixed(0);

          return (
            <motion.div
              key={project.id}
              whileHover={!isLocked ? { y: -5, scale: 1.02 } : {}}
              className={`relative overflow-hidden p-6 rounded-[32px] border transition-all duration-500 ${
                isLocked
                ? "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 grayscale"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl group hover:border-cyan-500/50 dark:hover:border-cyan-500/50"
              }`}
            >
              {isLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-200/60 dark:bg-slate-950/40 backdrop-blur-[2px] p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mb-4 border border-slate-300 dark:border-slate-700">
                    <Lock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-slate-900 dark:text-white font-black italic uppercase tracking-tighter mb-1">Project Locked</p>
                  <p className="text-cyan-500 dark:text-cyan-400 text-xs font-black tracking-widest uppercase">Reach Level {project.unlock_level} to Unlock</p>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  isLocked
                  ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                  : "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-500 dark:text-cyan-400 shadow-lg shadow-cyan-500/10"
                }`}>
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <p className="text-emerald-500 dark:text-emerald-400 text-lg font-black italic tracking-tighter">{roi90}%</p>
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">90-Day Yield</p>
                </div>
              </div>

              <h3 className="text-slate-900 dark:text-white text-xl font-black italic tracking-tighter uppercase mb-2">{project.name}</h3>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mb-6 line-clamp-2">High-frequency AI trading protocol with smart liquidation protection.</p>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                  <span className="text-slate-400 dark:text-slate-500">Daily Rate</span>
                  <span className="text-slate-900 dark:text-white">{dailyRoiNum > 0 ? dailyRoiNum.toFixed(2) : '0.00'}%</span>
                </div>
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                  <span className="text-slate-400 dark:text-slate-500">Min. Stake</span>
                  <span className="text-slate-900 dark:text-white">$20.00</span>
                </div>
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                  <span className="text-slate-400 dark:text-slate-500">Duration</span>
                  <span className="text-slate-900 dark:text-white">90 Days</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isLocked}
                onClick={() => setSelectedProject(project)}
                className={`w-full py-3.5 rounded-2xl font-black italic tracking-tight uppercase flex items-center justify-center gap-2 transition-all ${
                  isLocked
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors shadow-lg"
                }`}
              >
                {isLocked ? "LOCKED" : "STAKE NOW"}
                {!isLocked && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Stake Modal */}
      {selectedProject && (
        <AnimatePresence>
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 lg:p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-48 h-48 text-cyan-400" />
              </div>

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
                  <button
                    type="button"
                    title="Close"
                    onClick={() => setSelectedProject(null)}
                    className="p-2 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleStakeSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Input Stake Amount</label>
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold">Balance: ${fmtAmount(wallet?.available_balance)}</span>
                    </div>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="number"
                        placeholder="0.00"
                        required
                        min="20"
                        step="0.01"
                        className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl py-5 pl-14 pr-16 text-2xl font-black italic text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-cyan-500/50 transition-all"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-black italic">USDT</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-950/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800/50 space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Yield Rate (90 Days)</p>
                      <p className="text-emerald-500 dark:text-emerald-400 font-black italic">
                        {((parseFloat(selectedProject.daily_roi || selectedProject.daily_roi_percent || "0")) * 90).toFixed(2)}% Total ROI
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Expected Profit</p>
                      <p className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">
                        +${calculateROI(stakeAmount, selectedProject.daily_roi || selectedProject.daily_roi_percent || "0")}
                      </p>
                    </div>
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-800" />
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 dark:text-slate-500 text-xs font-black tracking-widest uppercase">Maturity Balance</p>
                      <p className="text-cyan-500 dark:text-cyan-400 text-2xl font-black italic tracking-tighter">
                        ${(parseFloat(stakeAmount || "0") + parseFloat(calculateROI(stakeAmount, selectedProject.daily_roi || selectedProject.daily_roi_percent || "0"))).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !stakeAmount || parseFloat(stakeAmount) < 20}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><ShieldAlert className="w-6 h-6" /> CONFIRM STAKE ORDER</>}
                  </button>

                  <p className="text-slate-400 dark:text-slate-600 text-[10px] text-center font-black uppercase tracking-[0.2em]">Staking capital is locked for the investment period</p>
                </form>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
