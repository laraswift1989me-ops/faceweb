import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import {
  TrendingUp, Wallet, Zap, Users, Trophy, History,
  ArrowUpRight, ArrowDownLeft, Clock, RefreshCw, ChevronRight,
  CheckCircle2, ShieldCheck, Copy, ArrowLeftRight, Coins,
  Fingerprint, Sparkles, Lock, Eye, Gift,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { fmtAmount } from "../../utils/format";
import { APP_NAME, TOKEN_NAME } from "../../config";

export function Home() {
  const { stats, wallet, leaderboard, tasks, transactions, harvest, user, userStakes } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [nextHarvestTime, setNextHarvestTime] = useState({ h: "00", m: "00", s: "00" });

  const kycVerified = !!user?.is_kyc_verified;
  const userName = user?.name?.split(" ")[0] || "User";
  const userLevel = user?.level || 0;

  // Harvest calculations — use active_investments from stats (correct staked amount)
  const totalStaked = parseFloat(stats?.active_investments ?? "0");
  const pendingStakes = (userStakes ?? []).filter((s: any) => !s.harvested_today);
  const pendingYield = pendingStakes.reduce((sum: number, s: any) =>
    sum + (parseFloat(s.amount ?? 0) * parseFloat(s.daily_percent ?? 0) / 100), 0
  );
  const allHarvestedToday = (userStakes?.length ?? 0) > 0 && pendingStakes.length === 0;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const tomorrow = new Date(utcNow);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - utcNow.getTime();
      setNextHarvestTime({
        h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHarvest = async () => {
    if (pendingStakes.length === 0) {
      toast.error(userStakes?.length === 0 ? "No active stakes to harvest." : "Already harvested today.");
      return;
    }
    setLoading(true);
    try {
      for (const stake of pendingStakes) await harvest(stake.id);
      toast.success("Harvest successful! Profits credited.");
    } catch (err: any) {
      toast.error(err.message || "Failed to harvest");
    } finally {
      setLoading(false);
    }
  };

  const copyAddr = () => {
    navigator.clipboard.writeText(wallet?.trc20_address || "");
    toast.success("Address copied!");
  };

  // Tasks
  const loginTask = tasks.find((t: any) => ["daily_checkin", "login", "daily_login"].includes(t.action_key));
  const loginClaimed = loginTask?.status === "Claimed";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ═══════════ KYC BANNER (non-verified only) ═══════════ */}
      {!kycVerified && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate("/profile?kyc=open")}
          className="cursor-pointer group relative overflow-hidden rounded-3xl border-2 border-dashed border-amber-300 dark:border-amber-500/40 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-500/10 dark:via-orange-500/5 dark:to-yellow-500/5 p-5 lg:p-6"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-400/20 blur-3xl rounded-full" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/30 flex items-center justify-center shrink-0">
              <Fingerprint className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-amber-900 dark:text-amber-300 font-extrabold text-base lg:text-lg">Complete KYC to Unlock Full Access</h3>
              <p className="text-amber-700/80 dark:text-amber-400/70 text-sm mt-0.5">Verify your identity to unlock staking, withdrawals, referral bonuses, and {TOKEN_NAME}.</p>
            </div>
            <div className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/30 group-hover:bg-amber-600 transition-colors">
              Verify Now
            </div>
          </div>
        </motion.div>
      )}

      {/* ═══════════ GREETING + AVATAR ═══════════ */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="relative shrink-0 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 group-hover:scale-105 transition-all">
              <span className="text-white font-black text-xl">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </button>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Welcome back,</p>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{userName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
            <span className="text-cyan-600 dark:text-cyan-400 text-sm font-bold">Lv {userLevel}</span>
          </div>
        </div>
      </div>

      {/* ═══════════ HERO STAT CARDS ═══════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Earnings", value: fmtAmount(stats?.total_earned), sub: "All-time profit & bonuses", color: "emerald", Icon: TrendingUp },
          { label: "Active Stakes", value: fmtAmount(stats?.active_investments), sub: "Capital generating yield", color: "cyan", Icon: Zap },
          { label: "Network Bonus", value: fmtAmount(stats?.referral_bonus_total), sub: "3-tier referral earnings", color: "indigo", Icon: Users },
        ].map(({ label, value, sub, color, Icon }) => (
          <motion.div key={label} whileHover={{ y: -4 }} className={`relative overflow-hidden p-6 rounded-2xl border transition-all bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl`}>
            <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full bg-${color}-500/8 blur-2xl`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-${color}-50 dark:bg-${color}-500/15 flex items-center justify-center border border-${color}-200 dark:border-${color}-500/25`}>
                  <Icon className={`w-5 h-5 text-${color}-500 dark:text-${color}-400`} />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500/50" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white tracking-tight">${value}</p>
              <p className={`text-${color}-600 dark:text-${color}-400 text-xs font-medium mt-2`}>{sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ═══════════ LEFT COLUMN ═══════════ */}
        <div className="lg:col-span-8 space-y-6">

          {/* ── HARVEST CARD ── */}
          <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-slate-700/50 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest">AI Yield Processor Active</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-5 flex-1">
                  <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">Daily Harvest</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                      <p className="text-slate-400 text-xs font-semibold mb-1">Staked Capital</p>
                      <p className="text-white text-2xl lg:text-3xl font-black">${fmtAmount(totalStaked)}</p>
                    </div>
                    <div className="bg-cyan-500/10 backdrop-blur rounded-2xl p-4 border border-cyan-500/20">
                      <p className="text-cyan-400 text-xs font-semibold mb-1">Pending Yield</p>
                      <p className="text-cyan-400 text-2xl lg:text-3xl font-black">
                        {allHarvestedToday ? "Collected" : userStakes?.length ? `+$${pendingYield.toFixed(2)}` : "$0.00"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 md:min-w-[200px]">
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center w-full">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Resets In</p>
                    <div className="flex items-center justify-center gap-1 text-white font-mono text-xl font-black">
                      <Clock className="w-4 h-4 text-cyan-400 mr-1" />
                      <span>{nextHarvestTime.h}</span><span className="text-slate-600">:</span>
                      <span>{nextHarvestTime.m}</span><span className="text-slate-600">:</span>
                      <span>{nextHarvestTime.s}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleHarvest}
                    disabled={loading || allHarvestedToday || !userStakes?.length}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                    {loading ? "Harvesting..." : allHarvestedToday ? "Harvested Today" : "Harvest Profits"}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── SWIFTCASH INSTANT EARN PROMO ── */}
          <motion.section
            whileHover={{ scale: 1.005 }}
            onClick={() => navigate("/swiftcash")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10 p-6 lg:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform">
                <Coins className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-yellow-300 text-xs font-bold uppercase tracking-widest">Instant Earn</span>
                </div>
                <h3 className="text-white text-xl lg:text-2xl font-black tracking-tight mb-1">{TOKEN_NAME} — Buy, Refer & Earn</h3>
                <p className="text-white/70 text-sm lg:text-base">Convert USDT to {TOKEN_NAME}, invite 5 friends, then sell at profit. Start from just $10.</p>
              </div>
              <div className="shrink-0 px-6 py-3 rounded-xl bg-white text-fuchsia-700 font-extrabold text-sm shadow-xl group-hover:bg-yellow-300 group-hover:text-slate-900 transition-all">
                Start Earning
              </div>
            </div>
          </motion.section>

          {/* ── QUICK ACTIONS ROW ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "KYC", sub: kycVerified ? "Verified" : "Pending", Icon: ShieldCheck, path: "/profile?kyc=open", done: kycVerified, color: "emerald" },
              { label: "Daily Login", sub: loginClaimed ? "Claimed" : "Claim Now", Icon: Gift, path: "/tasks", done: loginClaimed, color: "amber" },
              { label: "Stake", sub: "Earn Daily", Icon: Zap, path: "/stake", done: false, color: "cyan" },
              { label: "Refer", sub: "Earn $10+", Icon: Users, path: "/refer", done: false, color: "indigo" },
            ].map(({ label, sub, Icon, path, done, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -2 }}
                onClick={() => navigate(path)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${
                  done
                    ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center bg-${color}-50 dark:bg-${color}-500/15 border border-${color}-200 dark:border-${color}-500/25`}>
                  <Icon className={`w-5 h-5 ${done ? "text-emerald-500 dark:text-emerald-400" : `text-${color}-500 dark:text-${color}-400`}`} />
                </div>
                <p className="text-slate-900 dark:text-white font-bold text-sm">{label}</p>
                <p className={`text-xs font-semibold mt-0.5 ${done ? "text-emerald-500 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400"}`}>{sub}</p>
              </motion.div>
            ))}
          </div>

          {/* ── P2P EXCHANGE SECTION ── */}
          <section
            onClick={() => navigate("/p2p")}
            className="relative overflow-hidden rounded-3xl cursor-pointer group bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-500/10 dark:via-blue-500/5 dark:to-purple-500/5 border border-indigo-200 dark:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/10 transition-all"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-400/15 blur-3xl rounded-full" />
            <div className="relative z-10 p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-slate-900 dark:text-white font-extrabold text-base">P2P Exchange</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">Coming Soon</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Trade USDT peer-to-peer. Zero fees, instant settlement, escrow-protected.</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors shrink-0" />
            </div>
          </section>

          {/* ── RECENT TRANSACTIONS ── */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-slate-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              </div>
              <button type="button" onClick={() => navigate("/wallet")} className="text-cyan-500 text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="px-6 pb-6 space-y-3">
              {transactions?.length > 0 ? (
                transactions.slice(0, 5).map((tx: any, i: number) => {
                  const isIncome = ["deposit", "earn", "reward"].includes(tx.category) || tx.type === "deposit";
                  return (
                    <div key={i} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isIncome ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500" : "bg-rose-50 dark:bg-rose-500/10 text-rose-500"
                        }`}>
                          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white text-sm font-semibold">{tx.description || "Transaction"}</p>
                          <p className="text-slate-400 text-xs">{format(new Date(tx.created_at || Date.now()), "MMM dd, HH:mm")}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isIncome ? "text-emerald-500" : "text-rose-500"}`}>
                          {isIncome ? "+" : "-"}${fmtAmount(tx.amount)}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase">{tx.status}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10">
                  <History className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">No activity yet</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ═══════════ RIGHT COLUMN ═══════════ */}
        <div className="lg:col-span-4 space-y-6">

          {/* ── WALLET SUMMARY ── */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-500" /> Wallet
              </h3>
              <button type="button" onClick={() => navigate("/wallet")} className="text-cyan-500 text-xs font-semibold hover:underline flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Details
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-500/10 dark:to-blue-500/5 p-4 rounded-2xl border border-cyan-100 dark:border-cyan-500/20">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Available Balance</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${fmtAmount(wallet?.available_balance)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lock className="w-3 h-3 text-cyan-500" />
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase">Locked</p>
                  </div>
                  <p className="text-cyan-600 dark:text-cyan-400 text-lg font-bold">${fmtAmount(wallet?.locked_balance)}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Lock className="w-3 h-3 text-blue-500" />
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-semibold uppercase">Freezed</p>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 text-lg font-bold">${fmtAmount(wallet?.freezed_balance)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/30">
                <div className="overflow-hidden">
                  <p className="text-slate-400 text-[9px] font-semibold uppercase mb-0.5">TRC20 Address</p>
                  <p className="text-slate-700 dark:text-slate-300 text-xs font-mono truncate max-w-[140px]">{wallet?.trc20_address || "T..."}</p>
                </div>
                <button type="button" title="Copy" onClick={copyAddr} className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>

          {/* ── LEADERBOARD ── */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Top Earners
              </h3>
              <span className="text-slate-400 text-[10px] font-bold uppercase">Top 10</span>
            </div>
            <div className="p-4 space-y-2">
              {leaderboard?.slice(0, 8).map((w: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${
                      i === 0 ? "bg-amber-400 text-black" : i === 1 ? "bg-slate-300 text-black" : i === 2 ? "bg-amber-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-xs font-semibold truncate max-w-[90px]">{w.name}</p>
                      <p className="text-cyan-500 text-[10px] font-medium">Lv {w.level}</p>
                    </div>
                  </div>
                  <p className="text-slate-900 dark:text-white text-xs font-bold">${fmtAmount(w.total_earned || w.harvests_sum_amount)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── SYSTEM STATUS ── */}
          <section className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-3">System Status</p>
            <div className="space-y-3">
              {[
                { name: "TRON Network", status: "Online", ms: "9ms" },
                { name: "AI Engine", status: "Stable" },
                { name: "API Gateway", status: "Operational" },
              ].map(({ name, status, ms }) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{name}</span>
                  </div>
                  <span className="text-emerald-500 text-xs font-semibold">{ms ? `${ms} · ` : ""}{status}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
