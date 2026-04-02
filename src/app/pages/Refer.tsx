import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import {
  Users,
  Copy,
  Share2,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  TrendingUp,
  Zap,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

function StatPill({
  label,
  value,
  color = "text-slate-900 dark:text-white",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <p className={`font-black text-2xl italic tracking-tighter ${color}`}>
        {value}
      </p>
      <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black uppercase tracking-widest">
        {label}
      </p>
    </div>
  );
}

const SOCIAL_PLATFORMS = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    color: "#25D366",
    hoverBg: "hover:bg-[#25D366]",
    icon: "https://cdn.simpleicons.org/whatsapp/white",
  },
  {
    key: "telegram",
    label: "Telegram",
    color: "#229ED9",
    hoverBg: "hover:bg-[#229ED9]",
    icon: "https://cdn.simpleicons.org/telegram/white",
  },
  {
    key: "facebook",
    label: "Facebook",
    color: "#1877F2",
    hoverBg: "hover:bg-[#1877F2]",
    icon: "https://cdn.simpleicons.org/facebook/white",
  },
  {
    key: "twitter",
    label: "X (Twitter)",
    color: "#000000",
    hoverBg: "hover:bg-black",
    icon: "https://cdn.simpleicons.org/x/white",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    color: "#0A66C2",
    hoverBg: "hover:bg-[#0A66C2]",
    icon: "https://cdn.simpleicons.org/logmain/white",
  },
  {
    key: "reddit",
    label: "Reddit",
    color: "#FF4500",
    hoverBg: "hover:bg-[#FF4500]",
    icon: "https://cdn.simpleicons.org/reddit/white",
  },
];

export function Refer() {
  const { referralData, user, refreshAll } = useApp();
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const referralCode = user?.referral_code ?? "SWIFT-XXXX";
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
  const shareMessage = `Join SwiftEarn — AI-powered DeFi staking! Earn 1% daily ROI. Use my link to sign up: ${referralLink}`;

  useEffect(() => {
    refreshAll();
  }, []);

  const copy = (text: string, kind: "code" | "link") => {
    navigator.clipboard.writeText(text);
    setCopied(kind);
    toast.success(
      kind === "code" ? "Referral code copied!" : "Referral link copied!",
    );
    setTimeout(() => setCopied(null), 2000);
  };

  const share = (platform: string) => {
    const enc = encodeURIComponent;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${enc(shareMessage)}`,
      telegram: `https://t.me/share/url?url=${enc(referralLink)}&text=${enc("Join SwiftEarn — AI-powered DeFi staking! Earn 1% daily ROI.")}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${enc(shareMessage)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(referralLink)}`,
      reddit: `https://reddit.com/submit?url=${enc(referralLink)}&title=${enc("SwiftEarn — AI DeFi Staking")}`,
    };
    window.open(
      urls[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  const ov = referralData?.overview;
  const t1 = referralData?.tiers?.tier_1;
  const t2 = referralData?.tiers?.tier_2;
  const t3 = referralData?.tiers?.tier_3;
  const recents = referralData?.recent_referrals ?? [];

  const tiers = [
    {
      label: "Tier 1",
      sub: "Direct",
      data: t1,
      reward: "$10",
      rewardNote: "→ Available Balance",
      rewardColor: "text-emerald-500 dark:text-emerald-400",
      ringColor: "border-cyan-300 dark:border-cyan-500/40",
      dotColor: "bg-cyan-400",
      badgeColor:
        "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20",
    },
    {
      label: "Tier 2",
      sub: "2nd Level",
      data: t2,
      reward: "$2",
      rewardNote: "→ Locked 90 days",
      rewardColor: "text-indigo-500 dark:text-indigo-400",
      ringColor: "border-indigo-300 dark:border-indigo-500/40",
      dotColor: "bg-indigo-400",
      badgeColor:
        "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20",
    },
    {
      label: "Tier 3",
      sub: "3rd Level",
      data: t3,
      reward: "$1",
      rewardNote: "→ Locked 90 days",
      rewardColor: "text-blue-500 dark:text-blue-400",
      ringColor: "border-blue-300 dark:border-blue-500/40",
      dotColor: "bg-blue-400",
      badgeColor:
        "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── HERO HEADER ──────────────────────────────────────────────────── */}
      <div className="relative bg-white dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/90 rounded-[36px] p-7 lg:p-10 border border-slate-200 dark:border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-cyan-400 blur-3xl" />
          <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-indigo-400 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-500 dark:text-emerald-400 text-[10px] font-black tracking-[0.25em] uppercase">
                3-Tier Referral Network
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase leading-none mb-2">
              Network Hub
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-sm">
              Invite friends, they activate by completing KYC and depositing
              $25, and you earn instantly.
            </p>
          </div>

          {/* Network stats bar */}
          <div className="flex items-center gap-6 lg:gap-10 bg-slate-50 dark:bg-slate-950/50 backdrop-blur px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800/50 flex-wrap">
            <StatPill label="Total Team" value={ov?.total_team ?? 0} />
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <StatPill
              label="Active Members"
              value={ov?.total_active ?? 0}
              color="text-emerald-500 dark:text-emerald-400"
            />
            <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
            <StatPill
              label="Total Earned"
              value={`$${(ov?.total_earned ?? 0).toFixed(2)}`}
              color="text-cyan-500 dark:text-cyan-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ══ LEFT COLUMN ════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-7">
          {/* ── REFERRAL LINK CARD ───────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900/60 backdrop-blur-xl rounded-[32px] p-7 border border-slate-200 dark:border-slate-700/50 shadow-xl space-y-5">
            <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />{" "}
              Your Invitation Link
            </h3>

            {/* Code row */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4">
              <div>
                <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black tracking-[0.2em] uppercase mb-1">
                  Referral Code
                </p>
                <p className="text-slate-900 dark:text-white text-lg font-black italic tracking-wider">
                  {referralCode}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copy(referralCode, "code")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  copied === "code"
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {copied === "code" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied === "code" ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Link row */}
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 gap-4">
              <div className="overflow-hidden">
                <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black tracking-[0.2em] uppercase mb-1">
                  Direct Invite Link
                </p>
                <p className="text-slate-900 dark:text-white text-xs font-mono truncate">
                  {referralLink}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copy(referralLink, "link")}
                className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  copied === "link"
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                {copied === "link" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied === "link" ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Social share buttons */}
            <div className="pt-2">
              <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black tracking-[0.2em] uppercase mb-3 text-center">
                Share on Social Platforms
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {SOCIAL_PLATFORMS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => share(p.key)}
                    title={`Share on ${p.label}`}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400 ${p.hoverBg} hover:text-white hover:border-transparent transition-all group`}
                  >
                    <img
                      src={p.icon}
                      alt={p.label}
                      className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none">
                      {p.label.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* ── TIER BREAKDOWN ───────────────────────────────────────────── */}
          <section className="space-y-4">
            <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />{" "}
              Network Tiers
            </h3>

            {tiers.map((tier) => (
              <motion.div
                key={tier.label}
                whileHover={{ y: -2 }}
                className={`bg-white dark:bg-slate-900/60 rounded-[28px] p-6 border ${tier.ringColor} shadow-lg`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl border ${tier.ringColor} flex items-center justify-center shrink-0`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${tier.dotColor}`}
                      />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-black uppercase tracking-tight italic">
                        {tier.label}
                        <span className="text-slate-400 dark:text-slate-500 text-xs ml-2 not-italic normal-case font-normal">
                          {tier.sub}
                        </span>
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 dark:text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" />
                          {tier.data?.active ?? 0} active
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                          <UserX className="w-3.5 h-3.5" />
                          {tier.data?.inactive ?? 0} pending
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">
                          {tier.data?.total ?? 0} total
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${tier.badgeColor}`}
                    >
                      {tier.reward} per active
                    </div>
                    <div className="mt-1.5">
                      <p className={`text-[9px] font-bold ${tier.rewardColor}`}>
                        {tier.rewardNote}
                      </p>
                      <p className="text-slate-900 dark:text-white text-sm font-black italic mt-0.5">
                        Earned:{" "}
                        <span>${(tier.data?.earnings ?? 0).toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </section>

          {/* ── RECENT REFERRALS ─────────────────────────────────────────── */}
          {recents.length > 0 && (
            <section className="bg-white dark:bg-slate-900/60 rounded-[28px] p-6 border border-slate-200 dark:border-slate-800/50">
              <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />{" "}
                Recent Direct Referrals
              </h3>
              <div className="space-y-3">
                {recents.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/20"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                          r.is_active
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                            : "bg-slate-100 dark:bg-slate-700/50 text-slate-500 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white text-sm font-bold truncate max-w-[140px]">
                          {r.name}
                        </p>
                        <p className="text-slate-400 dark:text-slate-600 text-[9px] font-medium">
                          {r.joined_at}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.kyc && (
                        <span className="flex items-center gap-1 text-[9px] font-black text-cyan-500 dark:text-cyan-400 px-2 py-1 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg border border-cyan-200 dark:border-cyan-500/20">
                          <ShieldCheck className="w-3 h-3" /> KYC
                        </span>
                      )}
                      <span
                        className={`flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-lg border ${
                          r.is_active
                            ? "text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                            : "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50"
                        }`}
                      >
                        {r.is_active ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Pending
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ══ RIGHT COLUMN ═══════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-7">
          {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900/60 rounded-[32px] p-7 border border-slate-200 dark:border-slate-800/50 space-y-6">
            <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" /> How
              Activation Works
            </h3>

            <div className="relative space-y-0">
              <div className="absolute left-5 top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-500/40 via-indigo-500/30 to-transparent" />

              {[
                {
                  step: "1",
                  color:
                    "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
                  title: "Share Your Link",
                  desc: "Send your unique referral link via WhatsApp, Telegram, or any social platform.",
                },
                {
                  step: "2",
                  color:
                    "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
                  title: "Friend Registers",
                  desc: "Your friend signs up using your referral code — they join your Tier 1.",
                },
                {
                  step: "3",
                  color:
                    "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400",
                  title: "KYC + $25 Deposit",
                  desc: "They complete identity verification (KYC) AND deposit at least $25 USDT.",
                },
                {
                  step: "4",
                  color:
                    "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
                  title: "You Earn Instantly",
                  desc: "$10 credited to your Available Balance immediately. No waiting, no locks.",
                },
              ].map((s) => (
                <div
                  key={s.step}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 z-10 font-black text-sm ${s.color}`}
                  >
                    {s.step}
                  </div>
                  <div className="pt-1.5">
                    <p className="text-slate-900 dark:text-white font-bold text-sm uppercase italic tracking-tight">
                      {s.title}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-0.5 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── COMMISSION SUMMARY ───────────────────────────────────────── */}
          <section className="bg-white dark:bg-slate-900/60 rounded-[32px] p-7 border border-slate-200 dark:border-slate-800/50 space-y-5">
            <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />{" "}
              Commission Rates
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-black uppercase italic">
                      Tier 1 — Direct
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">
                      One-time per activation
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-emerald-500 dark:text-emerald-400 font-black text-lg italic">
                    $10
                  </p>
                  <p className="text-emerald-500/70 dark:text-emerald-400/70 text-[9px] font-bold uppercase">
                    Available Now
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-black uppercase italic">
                      Tier 2 — Indirect
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">
                      One-time per activation
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-indigo-500 dark:text-indigo-400 font-black text-lg italic">
                    $2
                  </p>
                  <p className="text-indigo-500/70 dark:text-indigo-400/70 text-[9px] font-bold uppercase">
                    Locked 90 days
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-black uppercase italic">
                      Tier 3 — Passive
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-medium">
                      One-time per activation
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-blue-500 dark:text-blue-400 font-black text-lg italic">
                    $1
                  </p>
                  <p className="text-blue-500/70 dark:text-blue-400/70 text-[9px] font-bold uppercase">
                    Locked 90 days
                  </p>
                </div>
              </div>
            </div>

            <p className="text-slate-400 dark:text-slate-600 text-[10px] font-medium leading-relaxed border-t border-slate-200 dark:border-slate-800/50 pt-4">
              Active = completed KYC identity verification{" "}
              <span className="text-cyan-500 dark:text-cyan-400 font-bold">
                AND
              </span>{" "}
              deposited min. $25 USDT. Tier 1 reward goes directly to your
              available balance. Tier 2 &amp; 3 go to locked balance for 90
              days.
            </p>
          </section>

          {/* ── QUICK STATS ──────────────────────────────────────────────── */}
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900/60 rounded-[24px] p-5 border border-slate-200 dark:border-slate-800/50 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-2">
                Direct Active
              </p>
              <p className="text-3xl font-black italic text-emerald-500 dark:text-emerald-400">
                {t1?.active ?? 0}
              </p>
              <p className="text-slate-400 dark:text-slate-600 text-[9px] font-bold mt-1">
                {t1?.inactive ?? 0} pending
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/60 rounded-[24px] p-5 border border-slate-200 dark:border-slate-800/50 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-2">
                T1 Earnings
              </p>
              <p className="text-3xl font-black italic text-cyan-500 dark:text-cyan-400">
                ${(t1?.earnings ?? 0).toFixed(0)}
              </p>
              <p className="text-slate-400 dark:text-slate-600 text-[9px] font-bold mt-1">
                available balance
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/60 rounded-[24px] p-5 border border-slate-200 dark:border-slate-800/50 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-2">
                T2 + T3 Active
              </p>
              <p className="text-3xl font-black italic text-indigo-500 dark:text-indigo-400">
                {(t2?.active ?? 0) + (t3?.active ?? 0)}
              </p>
              <p className="text-slate-400 dark:text-slate-600 text-[9px] font-bold mt-1">
                indirect network
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900/60 rounded-[24px] p-5 border border-slate-200 dark:border-slate-800/50 text-center">
              <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-2">
                T2 + T3 Earned
              </p>
              <p className="text-3xl font-black italic text-blue-500 dark:text-blue-400">
                ${((t2?.earnings ?? 0) + (t3?.earnings ?? 0)).toFixed(0)}
              </p>
              <p className="text-slate-400 dark:text-slate-600 text-[9px] font-bold mt-1">
                locked balance
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
