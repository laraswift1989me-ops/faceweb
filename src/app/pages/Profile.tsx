import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import {
  User, ShieldCheck, TrendingUp, Users, Zap, ExternalLink,
  HelpCircle, FileText, Lock, Bell, LogOut, ChevronRight,
  CheckCircle2, AlertCircle, Mail, Network, Gift, ShieldAlert,
  Shield, Fingerprint, Clock, XCircle, Star,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { KYCModal } from "../components/KYCModal";

const MAX_KYC_ATTEMPTS = 3;

export function Profile() {
  const { user, stats, referralData, logout, wallet, refreshUser } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showKycModal, setShowKycModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("kyc") === "open") {
      setShowKycModal(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out safely.");
    navigate("/login");
  };

  const userName        = user?.name || "User Account";
  const userLevel       = user?.level || 1;
  const kycStatus       = user?.kyc_status || null;
  const kycAttempts     = user?.kyc_attempts ?? 0;
  const attemptsLeft    = Math.max(0, MAX_KYC_ATTEMPTS - kycAttempts);
  const isKycVerified   = user?.is_kyc_verified || kycStatus === "Verified";
  const isProcessing    = kycStatus === "Processing";
  const isKycPending    = kycStatus === "Pending" || isProcessing;
  const isKycRejected   = kycStatus === "Rejected";
  const maxAttemptsReached = isKycRejected && kycAttempts >= MAX_KYC_ATTEMPTS;
  const canStartKyc     = !isKycVerified && !isKycPending && !maxAttemptsReached;

  const kycTheme = (() => {
    if (isKycVerified)      return { accent: "emerald", label: "Verified",   icon: ShieldCheck, glow: "shadow-emerald-500/20" };
    if (isProcessing)       return { accent: "blue",    label: "Processing", icon: Clock,       glow: "shadow-blue-500/20"    };
    if (isKycPending)       return { accent: "amber",   label: "Pending",    icon: Clock,       glow: "shadow-amber-500/20"   };
    if (maxAttemptsReached) return { accent: "red",     label: "Blocked",    icon: XCircle,     glow: "shadow-red-500/20"     };
    if (isKycRejected)      return { accent: "rose",    label: "Rejected",   icon: XCircle,     glow: "shadow-rose-500/20"    };
    return                         { accent: "slate",   label: "Unverified", icon: ShieldAlert, glow: "shadow-slate-500/10"   };
  })();

  const KycIcon = kycTheme.icon;
  const ac = kycTheme.accent;

  // Light/dark bg for KYC section
  const kycLightBg = isKycVerified ? "bg-emerald-50" : isProcessing ? "bg-blue-50" : isKycPending ? "bg-amber-50" : maxAttemptsReached ? "bg-red-50" : isKycRejected ? "bg-rose-50" : "bg-cyan-50";
  const kycDarkBg  = "dark:bg-slate-900";

  return (
    <div className="space-y-8 lg:space-y-10 animate-in fade-in duration-700">

      {showKycModal && (
        <KYCModal
          onClose={() => setShowKycModal(false)}
          onSuccess={async () => { await refreshUser(); toast.success("KYC submitted! Under review."); }}
        />
      )}

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-8 lg:p-10 rounded-[40px] border border-slate-700/50 shadow-2xl overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-[32px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20 ring-4 ring-slate-700">
              <span className="text-white font-black text-5xl italic">{userName.slice(0,1).toUpperCase()}</span>
            </div>
            <div className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-xl flex items-center justify-center border-4 border-slate-800 shadow-lg ${isKycVerified ? "bg-emerald-500" : isKycPending ? "bg-amber-500" : "bg-slate-600"}`}>
              {isKycVerified ? <CheckCircle2 className="w-4 h-4 text-white" /> : <AlertCircle className="w-4 h-4 text-white" />}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">{userName}</h1>
              <p className="text-slate-400 text-sm mt-1.5 flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />{user?.email}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5">
                <Zap className="w-3 h-3" /> LVL {userLevel}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5 border
                bg-${ac}-50 dark:bg-${ac}-500/10 border-${ac}-200 dark:border-${ac}-500/20 text-${ac}-600 dark:text-${ac}-400`}>
                <KycIcon className="w-3 h-3" /> KYC {kycTheme.label}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/50 text-slate-400 text-[10px] font-black tracking-widest uppercase">
                TRC20
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => navigate("/refer")}
            className="shrink-0 w-full md:w-auto px-8 py-3.5 rounded-2xl bg-white text-slate-950 font-black italic uppercase hover:bg-cyan-400 transition-colors shadow-xl flex items-center justify-center gap-2 text-sm"
          >
            <Network className="w-4 h-4" /> Expand Network
          </button>
        </div>
      </section>

      {/* ── KYC SECTION ──────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`relative rounded-[40px] overflow-hidden border shadow-2xl ${
          isKycVerified      ? "border-emerald-200 dark:border-emerald-500/30 shadow-emerald-500/10"
          : isProcessing     ? "border-blue-200 dark:border-blue-500/30 shadow-blue-500/10"
          : isKycPending     ? "border-amber-200 dark:border-amber-500/30 shadow-amber-500/10"
          : maxAttemptsReached ? "border-red-200 dark:border-red-500/30 shadow-red-500/10"
          : isKycRejected    ? "border-rose-200 dark:border-rose-500/30 shadow-rose-500/10"
          :                    "border-cyan-200 dark:border-cyan-500/20 shadow-cyan-500/10"
        }`}
      >
        {/* bg */}
        <div className={`absolute inset-0 ${kycLightBg} ${kycDarkBg}`} />
        {/* decorative shield */}
        <div className="absolute top-0 right-0 p-6 opacity-[0.04] pointer-events-none">
          <Fingerprint className="w-56 h-56" />
        </div>

        <div className="relative z-10 p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">

            {/* Left: icon + headline */}
            <div className="flex items-start gap-5">
              <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shrink-0 shadow-xl ${
                isKycVerified      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/20"
                : isProcessing     ? "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-blue-500/20"
                : isKycPending     ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 shadow-amber-500/20"
                : maxAttemptsReached ? "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 shadow-red-500/20"
                : isKycRejected    ? "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-rose-500/20"
                :                    "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 shadow-cyan-500/20"
              }`}>
                <KycIcon className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Identity Verification</p>
                <h2 className={`text-2xl font-black italic tracking-tighter uppercase ${
                  isKycVerified      ? "text-emerald-600 dark:text-emerald-400"
                  : isProcessing     ? "text-blue-600 dark:text-blue-400"
                  : isKycPending     ? "text-amber-600 dark:text-amber-400"
                  : maxAttemptsReached ? "text-red-600 dark:text-red-400"
                  : isKycRejected    ? "text-rose-600 dark:text-rose-400"
                  :                    "text-cyan-600 dark:text-cyan-400"
                }`}>
                  {isKycVerified      ? "Identity Verified"
                  : isProcessing     ? "AI Processing"
                  : isKycPending     ? "Under Review"
                  : maxAttemptsReached ? "Verification Blocked"
                  : isKycRejected    ? "Verification Rejected"
                  :                    "Not Yet Verified"}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-sm">
                  {isKycVerified      ? "Your identity has been confirmed. You have full platform access and maximum withdrawal limits."
                  : isProcessing     ? "Our AI engine is reviewing your documents. This usually takes a few minutes."
                  : isKycPending     ? "Your documents are in our review queue. You'll be notified within 24 hours."
                  : maxAttemptsReached ? `All ${MAX_KYC_ATTEMPTS} verification attempts used. Contact support for manual review.`
                  : isKycRejected    ? "Your submission was rejected. Re-submit with a clear document showing your English name and photo."
                  :                    "Verify your identity to unlock full withdrawal limits, staking bonuses, and platform features."}
                </p>
              </div>
            </div>

            {/* Right: status visual + attempts */}
            <div className="lg:ml-auto flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-4 shrink-0">

              {!isKycVerified && (
                <div className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 min-w-[180px]">
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-3">Verification Attempts</p>
                  <div className="flex items-center gap-2 mb-3">
                    {Array.from({ length: MAX_KYC_ATTEMPTS }).map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-2.5 rounded-full transition-all ${
                          i < kycAttempts
                            ? isKycRejected ? "bg-rose-500" : "bg-emerald-500"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">{kycAttempts} used</span>
                    <span className={`text-xs font-black ${attemptsLeft > 0 ? "text-slate-900 dark:text-white" : "text-red-500 dark:text-red-400"}`}>
                      {attemptsLeft} left
                    </span>
                  </div>
                </div>
              )}

              {isKycVerified && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-emerald-600 dark:text-emerald-400 font-black text-sm uppercase italic">Full Access</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">No restrictions</p>
                  </div>
                </div>
              )}

              {canStartKyc && (
                <button
                  type="button"
                  onClick={() => setShowKycModal(true)}
                  className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-tight transition-all shadow-xl flex items-center justify-center gap-2 ${
                    isKycRejected
                      ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:opacity-90 shadow-rose-500/20"
                      : "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 hover:opacity-90 shadow-cyan-500/20"
                  }`}
                >
                  <Fingerprint className="w-5 h-5" />
                  {isKycRejected ? "Retry Verification" : "Start Verification"}
                </button>
              )}

              {maxAttemptsReached && (
                <Link
                  to="/help-center"
                  className="px-8 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-black text-sm uppercase tracking-tight hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <HelpCircle className="w-4 h-4" /> Contact Support
                </Link>
              )}
            </div>
          </div>

          {/* Status timeline strip */}
          {!isKycVerified && !maxAttemptsReached && (
            <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/60">
              <div className="flex items-center gap-0">
                {[
                  { id: "submit",  label: "Submit Docs",  done: kycAttempts > 0 || isKycPending || isKycRejected },
                  { id: "review",  label: "Under Review", done: isKycPending || isProcessing },
                  { id: "process", label: "AI Processing",done: isProcessing },
                  { id: "done",    label: "Verified",     done: false },
                ].map((s, i, arr) => (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5 flex-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                        s.done
                          ? "bg-cyan-500 border-cyan-500 text-white dark:text-slate-900"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                      }`}>
                        {s.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-[9px] font-black tracking-widest uppercase text-center whitespace-nowrap ${s.done ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-600"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full transition-all ${s.done ? "bg-cyan-500/50" : "bg-slate-200 dark:bg-slate-800"}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── STATS + NETWORK + NAV ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Stats */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { label: "Total Earned",   value: `$${stats?.total_earned || "0.00"}`,        sub: "Profit & Dividends", color: "emerald", Icon: Gift },
              { label: "Capital Staked", value: `$${wallet?.locked_balance || "0.00"}`,     sub: "Active Staking",     color: "indigo",  Icon: Zap  },
              { label: "Available",      value: `$${wallet?.available_balance || "0.00"}`,  sub: "Withdrawable",       color: "cyan",    Icon: TrendingUp },
            ].map(({ label, value, sub, color, Icon }) => (
              <div key={label} className={`bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-${color}-300 dark:hover:border-${color}-500/30 transition-all`}>
                <div>
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-1">{label}</p>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">{value}</h4>
                  <p className={`text-${color}-500 dark:text-${color}-400 text-[9px] font-black tracking-widest uppercase mt-2 flex items-center gap-1`}>
                    <Icon className="w-3 h-3" /> {sub}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-${color}-50 dark:group-hover:bg-${color}-500/10 group-hover:text-${color}-500 dark:group-hover:text-${color}-400 transition-all shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            ))}
          </div>

          {/* Network */}
          <section className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-6 flex items-center gap-3">
              <Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Organization Dynamics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Team",    val: referralData?.total_referrals || 0, color: "text-slate-900 dark:text-white"    },
                { label: "Direct Tier 1", val: referralData?.tree?.tier1 || 0,    color: "text-cyan-500 dark:text-cyan-400"   },
                { label: "Tier 2",        val: referralData?.tree?.tier2 || 0,    color: "text-indigo-500 dark:text-indigo-400"},
                { label: "Tier 3",        val: referralData?.tree?.tier3 || 0,    color: "text-blue-500 dark:text-blue-400"   },
              ].map(({ label, val, color }) => (
                <div key={label} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/30 text-center">
                  <p className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase mb-1">{label}</p>
                  <p className={`${color} text-xl font-black italic`}>{val}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Nav */}
        <div className="lg:col-span-4 space-y-5">
          <section className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 pb-2">Management</p>

            <NavRow to="/notifications" Icon={Bell} label="System Alerts" hoverColor="cyan" />
            <NavRow to="/tasks" Icon={CheckCircle2} label="Task Rewards" hoverColor="emerald" />

            <button
              type="button"
              onClick={canStartKyc ? () => setShowKycModal(true) : undefined}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all group ${canStartKyc ? "hover:bg-cyan-50 dark:hover:bg-cyan-500/10 cursor-pointer" : "cursor-default"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all text-sm
                  ${isKycVerified ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : isKycPending ? "bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400" : isKycRejected ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500 dark:text-rose-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-cyan-50 dark:group-hover:bg-cyan-500/10 group-hover:text-cyan-500 dark:group-hover:text-cyan-400"}`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-slate-900 dark:text-white font-bold text-sm tracking-tight uppercase leading-none">KYC Status</p>
                  <p className={`text-[9px] font-black tracking-widest uppercase mt-0.5 ${
                    isKycVerified ? "text-emerald-500 dark:text-emerald-400" : isKycPending ? "text-amber-500 dark:text-amber-400" : maxAttemptsReached ? "text-red-500 dark:text-red-400" : isKycRejected ? "text-rose-500 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"
                  }`}>
                    {isKycVerified ? "✓ Verified" : isKycPending ? kycStatus : maxAttemptsReached ? "Blocked" : isKycRejected ? `Rejected · ${attemptsLeft} attempts left` : "Unverified · Tap to start"}
                  </p>
                </div>
              </div>
              {isKycVerified
                ? <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                : canStartKyc
                ? <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors shrink-0" />
                : null
              }
            </button>

            <NavRow Icon={Lock} label="Security Key" hoverColor="indigo" />
          </section>

          <section className="bg-white dark:bg-slate-900 p-5 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-1">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 pb-2">Support & Legal</p>
            <NavRow to="/faq"   Icon={HelpCircle} label="Help Center"        hoverColor="slate" external />
            <NavRow to="/legal" Icon={FileText}   label="Compliance & Legal" hoverColor="slate" external />
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-rose-500 dark:text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-rose-500 dark:text-rose-400 font-black text-sm tracking-tight uppercase">Secure Logout</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function NavRow({
  to, Icon, label, hoverColor, external,
}: { to?: string; Icon: React.ElementType; label: string; hoverColor: string; external?: boolean }) {
  const inner = (
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-${hoverColor}-500 dark:group-hover:text-${hoverColor}-400 group-hover:bg-${hoverColor}-50 dark:group-hover:bg-${hoverColor}-500/10 transition-all`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-slate-700 dark:text-slate-300 font-bold text-sm tracking-tight uppercase">{label}</span>
    </div>
  );
  const cls = "w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group";
  if (to) return (
    <Link to={to} className={cls}>
      {inner}
      {external ? <ExternalLink className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" /> : <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />}
    </Link>
  );
  return (
    <button type="button" className={cls}>
      {inner}
      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
    </button>
  );
}
