import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp, CheckCircle2, LogIn, Share2, RefreshCw,
  ChevronRight, Users, Zap, Trophy, ArrowUpRight, Flame,
  Lock, Smartphone, Star, ShieldCheck, Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

function ProgressBar({ value, max, color = "cyan" }: { value: number; max: number; color?: "cyan" | "emerald" | "amber" }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const colors = {
    cyan:    "from-cyan-400 to-blue-500",
    emerald: "from-emerald-400 to-teal-500",
    amber:   "from-amber-400 to-orange-500",
  };
  return (
    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`h-full rounded-full bg-gradient-to-r ${colors[color]}`}
      />
    </div>
  );
}

export function Tasks() {
  const { tasks, completeTask, refreshAll, refreshTasks, user, streakProgress, milestoneBonus, levelProgress, levelUp, claimStreakBonus, claimMilestoneBonus } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<number | string | null>(null);
  const [streakClaiming, setStreakClaiming] = useState(false);
  const [milestoneClaiming, setMilestoneClaiming] = useState(false);
  const [levelUpLoading, setLevelUpLoading] = useState(false);
  const [shareReady, setShareReady] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(true);
  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  useEffect(() => {
    refreshTasks().finally(() => setTasksLoading(false));
  }, []);

  const dailyTasks   = tasks.filter((t: any) => t.type === "daily");
  const oneTimeTasks = tasks.filter((t: any) => t.type === "one_time");

  const handleClaim = async (taskId: number) => {
    setLoading(taskId);
    try {
      await completeTask(taskId);
      toast.success("Reward claimed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to claim task");
    } finally {
      setLoading(null);
    }
  };

  const referralLink = `${window.location.origin}/register?ref=${user?.referral_code ?? ""}`;
  const shareTaskId  = dailyTasks.find((t: any) => t.action_key === "social_share")?.id ?? null;
  const shareTask    = dailyTasks.find((t: any) => t.action_key === "social_share") ?? null;

  const openShare = async (platform?: "whatsapp" | "telegram" | "facebook") => {
    const text = `Join SwiftEarn — AI-powered DeFi staking! Use my link: ${referralLink}`;

    if (!platform && canNativeShare) {
      try {
        await navigator.share({ title: "SwiftEarn", text, url: referralLink });
        setShareReady(true);
      } catch { /* user cancelled */ }
      return;
    }

    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent("Join SwiftEarn — AI-powered DeFi staking!")}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
    };
    window.open(urls[platform!], "_blank", "noopener,noreferrer");
    setShareReady(true);
  };

  const handleClaimShare = async () => {
    if (!shareTaskId) return;
    await handleClaim(shareTaskId);
    setShareReady(false);
  };

  const currentStreak = streakProgress?.current_streak_days ?? 0;
  const streakTarget  = streakProgress?.target_days        ?? 7;

  const lp              = levelProgress;
  const currentLevel    = lp?.current_level           ?? user?.level ?? 0;
  const nextLevel       = lp?.next_level               ?? currentLevel + 1;
  const currentRefs     = lp?.current?.refs            ?? 0;
  const requiredRefs    = lp?.requirements?.required_refs   ?? 3;
  const currentStake    = lp?.current?.stake           ?? 0;
  const requiredStake   = lp?.requirements?.required_stake  ?? 0;
  const currentLocked   = lp?.current?.locked          ?? 0;
  const refsMet         = lp?.met?.refs                ?? false;
  const stakeMet        = lp?.met?.stake               ?? false;
  const lockedMet       = lp?.met?.locked              ?? false;
  const canLevelUp      = lp?.can_level_up             ?? false;

  const isLevel0        = currentLevel === 0;
  const kycMet          = lp?.met?.kyc                 ?? false;
  const depositMet      = lp?.met?.deposit             ?? false;
  const currentDeposit  = lp?.current?.deposit         ?? 0;
  const depositRequired = lp?.requirements?.requires_deposit ?? 25;

  const handleLevelUp = async () => {
    setLevelUpLoading(true);
    try {
      const result = await levelUp();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Level up failed");
    } finally {
      setLevelUpLoading(false);
    }
  };

  const handleClaimStreak = async () => {
    setStreakClaiming(true);
    try {
      await claimStreakBonus();
      toast.success("$5.00 streak bonus claimed and locked successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to claim streak bonus");
    } finally {
      setStreakClaiming(false);
    }
  };

  const handleClaimMilestone = async () => {
    setMilestoneClaiming(true);
    try {
      await claimMilestoneBonus();
      toast.success(`Level ${milestoneBonus?.milestone_level} milestone bonus claimed!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to claim milestone bonus");
    } finally {
      setMilestoneClaiming(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-1">Tasks & Rewards</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Complete tasks, level up, and earn USDT bonuses.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 space-y-8">

          {/* ── SECTION 1: LEVEL UP TRACKER ─────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900 rounded-[36px] p-7 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight">Level Up Tracker</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">Progress to next level</p>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="text-right">
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">Current</p>
                  <p className="text-slate-900 dark:text-white font-black text-xl italic">Lv.{currentLevel}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                <div className="text-right">
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">Next</p>
                  <p className="text-cyan-500 dark:text-cyan-400 font-black text-xl italic">Lv.{nextLevel}</p>
                </div>
              </div>
            </div>

            {/* Level 0 → 1: KYC + Deposit + Stake + 3 Referrals */}
            {isLevel0 ? (
              <div className="space-y-4">
                <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">
                  Complete all 4 requirements to unlock Level 1
                </p>

                {/* KYC */}
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                  kycMet ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800/50"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      kycMet ? "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                      <CheckCircle2 className={`w-4 h-4 ${kycMet ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                    </div>
                    <div>
                      <p className={`text-sm font-bold uppercase tracking-tight ${kycMet ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                        KYC Verification
                      </p>
                      <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">Complete identity verification</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                    kycMet ? "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                  }`}>
                    {kycMet ? "✓ Verified" : "Pending"}
                  </span>
                </div>

                {/* $25 Stake */}
                <div className={`p-4 rounded-2xl border ${
                  stakeMet ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800/50"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        stakeMet ? "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                        <TrendingUp className={`w-4 h-4 ${stakeMet ? "text-emerald-500 dark:text-emerald-400" : "text-cyan-500 dark:text-cyan-400"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-tight ${stakeMet ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                          Stake $25
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">Stake at least $25 in any project</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                      stakeMet ? "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-cyan-500 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20"
                    }`}>
                      ${currentStake.toFixed(0)} / $25
                    </span>
                  </div>
                  <ProgressBar value={currentStake} max={25} color="cyan" />
                </div>

                {/* 3 Referrals */}
                <div className={`p-4 rounded-2xl border ${
                  refsMet ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800/50"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        refsMet ? "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                        <Users className={`w-4 h-4 ${refsMet ? "text-emerald-500 dark:text-emerald-400" : "text-indigo-500 dark:text-indigo-400"}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-bold uppercase tracking-tight ${refsMet ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                          3 Active Referrals
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">Invite 3 people who each reach Level 1</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                      refsMet ? "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                    }`}>
                      {currentRefs}/{requiredRefs}
                    </span>
                  </div>
                  <ProgressBar value={currentRefs} max={requiredRefs} color="cyan" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Referral progress */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Active Referrals</span>
                    </div>
                    {refsMet && (
                      <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 text-[10px] font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" /> MET
                      </span>
                    )}
                  </div>
                  <div className="flex items-end justify-between mb-3">
                    <p className={`text-3xl font-black italic tracking-tighter ${refsMet ? "text-emerald-500 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                      {currentRefs}
                      <span className="text-slate-400 dark:text-slate-500 text-lg">/{requiredRefs}</span>
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                      {refsMet ? "Requirement met!" : `Need ${Math.max(0, requiredRefs - currentRefs)} more`}
                    </p>
                  </div>
                  <ProgressBar value={currentRefs} max={requiredRefs} color="cyan" />
                </div>

                {/* Stake progress */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">Total Staked</span>
                    </div>
                    {stakeMet && (
                      <span className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400 text-[10px] font-black">
                        <CheckCircle2 className="w-3.5 h-3.5" /> MET
                      </span>
                    )}
                  </div>
                  {requiredStake > 0 ? (
                    <>
                      <div className="flex items-end justify-between mb-3">
                        <p className={`text-3xl font-black italic tracking-tighter ${stakeMet ? "text-emerald-500 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                          ${currentStake.toFixed(0)}
                          <span className="text-slate-400 dark:text-slate-500 text-lg">/${requiredStake}</span>
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
                          {stakeMet ? "Requirement met!" : `Need $${Math.max(0, requiredStake - currentStake).toFixed(0)} more`}
                        </p>
                      </div>
                      <ProgressBar value={currentStake} max={requiredStake} color="amber" />
                    </>
                  ) : (
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      <p className="text-emerald-500 dark:text-emerald-400 text-sm font-bold">No stake required for this level</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Locked Balance requirement — always shown */}
            <div className={`mt-4 p-4 rounded-2xl border ${
              lockedMet ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800/50"}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                    lockedMet ? "bg-emerald-100 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                    <Lock className={`w-4 h-4 ${lockedMet ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold uppercase tracking-tight ${lockedMet ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>
                      Locked Balance ≥ $30
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-0.5">Need at least $30 in locked balance to unlock</p>
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                  lockedMet ? "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                }`}>
                  ${currentLocked.toFixed(2)} / $30
                </span>
              </div>
              <ProgressBar value={currentLocked} max={30} color="emerald" />
            </div>

            {/* Unlock $30 button row */}
            <div className="mt-5 p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4
              bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800/40">
              <div className="space-y-1">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Level {nextLevel} Reward</p>
                <p className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">
                  ~$30
                  <span className="text-slate-400 dark:text-slate-500 text-sm ml-1 font-normal not-italic">→ Unlocked to Available Balance</span>
                </p>
                
              </div>
              {canLevelUp ? (
                <button
                  type="button"
                  onClick={handleLevelUp}
                  disabled={levelUpLoading}
                  className="shrink-0 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[11px] font-black uppercase tracking-widest shadow-lg hover:opacity-90 disabled:opacity-60 flex items-center gap-2 transition-opacity"
                >
                  {levelUpLoading ? (
                    <><ArrowUpRight className="w-4 h-4 animate-spin" /> Unlocking…</>
                  ) : (
                    <><Trophy className="w-4 h-4" /> Unlock $30 — Level {nextLevel}</>
                  )}
                </button>
              ) : (
                <div className="shrink-0 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest border bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700">
                  {isLevel0
                    ? `${[!kycMet && "KYC", !stakeMet && "$25 Stake", !refsMet && "3 Refs", !lockedMet && "$30 Locked"].filter(Boolean).join(" • ")} needed`
                    : `${[!refsMet && "Referrals", !stakeMet && "Stake", !lockedMet && "$30 Locked"].filter(Boolean).join(" • ")} needed`
                  }
                </div>
              )}
            </div>
          </section>

          {/* ── SECTION 2: DAILY TASKS ───────────────────────────────────── */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <Flame className="w-5 h-5 text-orange-400" />
              <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight">Daily Tasks</h3>
              <span className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-auto">Resets Daily</span>
            </div>

            <div className="space-y-4">
              {tasksLoading && (
                <div className="flex items-center justify-center py-10 text-slate-400 dark:text-slate-500 gap-3">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Loading tasks…</span>
                </div>
              )}

              {/* ── Daily Check-in ── */}
              {!tasksLoading && (() => {
                const t = dailyTasks.find((t: any) => t.action_key === "daily_checkin" || t.action_key === "login" || t.action_key === "daily_login");
                if (!t) return null;
                const claimed = t.status === "Claimed";
                return (
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                        claimed ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                        <LogIn className={`w-6 h-6 ${claimed ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold uppercase tracking-tight">{t.title}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{t.description || "Log in daily to earn your bonus."}</p>
                        <p className="text-emerald-500 dark:text-emerald-400 text-[10px] font-black tracking-widest mt-1.5">+${t.reward} USDT Reward</p>
                      </div>
                    </div>
                    {claimed ? (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-black tracking-widest border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                        <CheckCircle2 className="w-4 h-4" /> CLAIMED
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClaim(t.id)}
                        disabled={loading === t.id}
                        className="shrink-0 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-[10px] font-black tracking-widest hover:bg-cyan-500 dark:hover:bg-cyan-400 transition-colors flex items-center gap-2 shadow-lg"
                      >
                        {loading === t.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <>CLAIM <ChevronRight className="w-4 h-4" /></>}
                      </button>
                    )}
                  </div>
                );
              })()}

              {/* ── Share Referral ── */}
              {!tasksLoading && shareTask && (() => {
                const claimed = shareTask.status === "Claimed";
                return (
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                          claimed ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
                          <Share2 className={`w-6 h-6 ${claimed ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-bold uppercase tracking-tight">Share Referral Link</p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">Share your referral on social media to earn daily.</p>
                          <p className="text-emerald-500 dark:text-emerald-400 text-[10px] font-black tracking-widest mt-1.5">+${shareTask.reward} USDT Reward</p>
                        </div>
                      </div>
                      {claimed && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-black tracking-widest border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> CLAIMED
                        </div>
                      )}
                      {!claimed && !canNativeShare && (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest border border-slate-200 dark:border-slate-700 shrink-0">
                          <Smartphone className="w-4 h-4" /> APP ONLY
                        </div>
                      )}
                    </div>

                    {!claimed && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50 space-y-3">
                        {canNativeShare ? (
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => openShare()}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black tracking-widest hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors"
                            >
                              <Share2 className="w-4 h-4" /> SHARE NOW
                            </button>
                            {shareReady && (
                              <button
                                type="button"
                                onClick={handleClaimShare}
                                disabled={loading === shareTaskId}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-colors"
                              >
                                {loading === shareTaskId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> CONFIRM & CLAIM</>}
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                              Share on social media, then confirm to claim:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {(["whatsapp", "telegram", "facebook"] as const).map((p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => openShare(p)}
                                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:border-cyan-300 dark:hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all capitalize"
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                            {shareReady && (
                              <button
                                type="button"
                                onClick={handleClaimShare}
                                disabled={loading === shareTaskId}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-colors mt-1"
                              >
                                {loading === shareTaskId ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> I SHARED — CLAIM REWARD</>}
                              </button>
                            )}
                            <p className="text-slate-400 dark:text-slate-600 text-[9px] italic">
                              * Validated by platform activity monitoring. Abuse may result in account suspension.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}

              {!tasksLoading && dailyTasks.length === 0 && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                  <p className="text-sm font-medium">No daily tasks available right now.</p>
                </div>
              )}
            </div>
          </section>

          {/* ── SECTION 3: ONE-TIME TASKS ─────────────────────────────────── */}
          {oneTimeTasks.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight">One-Time Milestones</h3>
                <span className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest ml-auto">Claim When Ready</span>
              </div>
              <div className="space-y-4">
                {oneTimeTasks.map((t: any) => {
                  const claimed = t.status === "Claimed";
                  const isDeposit = t.action_key === "initial_deposit";
                  const isKyc = t.action_key === "kyc_completion";

                  const icon = claimed
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                    : isDeposit
                      ? <Wallet className="w-6 h-6 text-amber-500 dark:text-amber-400" />
                      : isKyc
                        ? <ShieldCheck className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                        : <Lock className="w-6 h-6 text-slate-400" />;

                  return (
                    <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                          claimed
                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                            : isDeposit
                              ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                              : isKyc
                                ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20"
                                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        }`}>
                          {icon}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-bold uppercase tracking-tight">{t.title}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">{t.description}</p>
                          <p className="text-cyan-500 dark:text-cyan-400 text-[10px] font-black tracking-widest mt-1.5">
                            +${t.reward} USDT Reward • Locked Reward
                          </p>
                        </div>
                      </div>
                      {claimed ? (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-black tracking-widest border border-emerald-200 dark:border-emerald-500/20 shrink-0">
                          <CheckCircle2 className="w-4 h-4" /> DONE
                        </div>
                      ) : t.claimable ? (
                        <button
                          type="button"
                          onClick={() => handleClaim(t.id)}
                          disabled={loading === t.id}
                          className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black tracking-widest hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                        >
                          {loading === t.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> CLAIM</>}
                        </button>
                      ) : isDeposit ? (
                        <button
                          type="button"
                          onClick={() => navigate("/wallet?deposit=open")}
                          className="shrink-0 px-5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-widest hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all flex items-center gap-2"
                        >
                          <Wallet className="w-4 h-4" /> DEPOSIT NOW
                        </button>
                      ) : isKyc ? (
                        <button
                          type="button"
                          onClick={() => navigate("/profile?kyc=open")}
                          className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" /> VERIFY NOW
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-widest border border-slate-200 dark:border-slate-700 shrink-0">
                          PENDING
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* ══ RIGHT COLUMN ═══════════════════════════════════════════════════ */}
        <div className="lg:col-span-4 space-y-8">

          {/* ── 7-DAY STREAK ─────────────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900 p-7 rounded-[36px] border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Flame className="w-5 h-5 text-orange-400" />
              <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">7-Day Streak</h3>
            </div>

            <div className="flex items-center justify-between mb-6">
              {Array.from({ length: streakTarget }, (_, i) => {
                const done = i < currentStreak;
                const isToday = i === currentStreak && currentStreak < streakTarget;
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={false}
                      animate={done ? { scale: [1, 1.15, 1] } : {}}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                        done
                          ? "bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                          : isToday
                            ? "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-500/40 border-dashed"
                            : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/50"
                      }`}
                    >
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                        : <Star className={`w-4 h-4 ${isToday ? "text-cyan-500" : "text-slate-300 dark:text-slate-600"}`} />
                      }
                    </motion.div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${
                      done ? "text-emerald-500 dark:text-emerald-400" : isToday ? "text-cyan-500 dark:text-cyan-400" : "text-slate-300 dark:text-slate-600"
                    }`}>D{i + 1}</span>
                  </div>
                );
              })}
            </div>

            <ProgressBar value={currentStreak} max={streakTarget} color="emerald" />

            <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center">
              {streakProgress?.bonus_available ? (
                <div className="space-y-3">
                  <p className="text-emerald-500 dark:text-emerald-400 text-xs font-black uppercase tracking-widest">Streak Complete!</p>
                  <p className="text-slate-900 dark:text-white font-black text-xl italic">$5.00 <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">Locked Reward</span></p>
                  <button
                    type="button"
                    onClick={handleClaimStreak}
                    disabled={streakClaiming}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {streakClaiming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> CLAIM $5 BONUS</>}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Complete All Daily Tasks Each Day</p>
                  <p className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter">
                    {currentStreak}<span className="text-slate-400 dark:text-slate-500">/{streakTarget}</span>
                    <span className="text-cyan-500 dark:text-cyan-400 text-sm ml-2">days</span>
                  </p>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-2">
                    {streakTarget - currentStreak} more day{streakTarget - currentStreak !== 1 ? "s" : ""} to earn{" "}
                    <span className="text-amber-500 dark:text-amber-400 font-bold">$5.00 Bonus</span>
                  </p>
                  {currentStreak > 0 && (
                    <p className="text-rose-400/70 text-[9px] mt-1 italic">⚠ Missing a day resets your streak to Day 1</p>
                  )}
                </>
              )}
            </div>
          </section>

          {/* ── LEVEL MILESTONE BONUS ────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900 p-7 rounded-[36px] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-5">
              <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <h3 className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-widest">Level Milestones</h3>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-5 leading-relaxed">
              Earn <span className="text-amber-500 dark:text-amber-400 font-bold">$5.00</span> locked bonus every 10 levels (Level 10, 20, 30…). Claim manually after reaching the milestone.
            </p>
            {milestoneBonus?.available ? (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-widest">Level {milestoneBonus.milestone_level} Reached!</p>
                    <p className="text-slate-900 dark:text-white font-black text-lg italic mt-0.5">$5.00 <span className="text-slate-400 dark:text-slate-500 text-xs font-normal">Locked Reward</span></p>
                  </div>
                  <Trophy className="w-8 h-8 text-amber-500 dark:text-amber-400" />
                </div>
                <button
                  type="button"
                  onClick={handleClaimMilestone}
                  disabled={milestoneClaiming}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {milestoneClaiming ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Trophy className="w-4 h-4" /> CLAIM MILESTONE BONUS</>}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 text-center">
                <p className="text-slate-400 dark:text-slate-500 text-xs">
                  Next milestone: <span className="text-amber-500 dark:text-amber-400 font-bold">Level {milestoneBonus?.next_milestone ?? 10}</span>
                </p>
              </div>
            )}
          </section>

        </div>
      </div>
    </div>
  );
}
