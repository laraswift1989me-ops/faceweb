import {
  ArrowLeft,
  Copy,
  Shield,
  Users,
  TrendingUp,
  Award,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  History,
  HelpCircle,
  Bell,
  Share2,
  Lock,
  Smartphone,
  XCircle,
  Loader2,
  Ban,
} from "lucide-react";
import { useState } from "react";
import { KYCModal } from "./KYCModal";
import { useApp } from "../../context/AppContext";

interface UserProfileProps {
  user: any;
  onBack: () => void;
  onLogout?: () => void;
  onShareReferral?: () => void;
}

export function UserProfile({
  user,
  onBack,
  onLogout,
  onShareReferral,
}: UserProfileProps) {
  const { refreshUser, unreadCount } = useApp();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [showPasswordUpdate, setShowPasswordUpdate] =
    useState(false);
  const [showTransactions, setShowTransactions] =
    useState(false);

  // 1. Safely grab the status and the number of attempts (defaulting to 0)
  const rawStatus = (
    user?.kyc_status ||
    user?.kyc_doc ||
    "unverified"
  ).toLowerCase();
  const kycAttempts = parseInt(user?.kyc_attempts || "0", 10);
  const MAX_ATTEMPTS = 3;

  // 2. Normalize the status to UI states, adding 'Locked' for max attempts
  let kycStatusUI:
    | "Unverified"
    | "Pending"
    | "Verified"
    | "Rejected"
    | "Locked" = "Unverified";

  if (["pending", "processing"].includes(rawStatus)) {
    kycStatusUI = "Pending";
  } else if (
    ["verified", "approved", "completed"].includes(rawStatus)
  ) {
    kycStatusUI = "Verified";
  } else if (kycAttempts >= MAX_ATTEMPTS) {
    kycStatusUI = "Locked"; // Override Unverified/Rejected if they hit the limit
  } else if (["rejected", "failed"].includes(rawStatus)) {
    kycStatusUI = "Rejected";
  }

  // 3. UI Configuration for each state
  const statusConfig = {
    Unverified: {
      colorClass: "text-slate-400",
      borderClass: "border-slate-700",
      bgClass: "bg-slate-800/50",
      icon: AlertCircle,
      title: "Identity Unverified",
      desc: "Your account is currently unverified. Verify to unlock premium pools.",
      buttonText: "VERIFY YOUR IDENTITY",
      buttonAction: () => setShowKYC(true),
      buttonStyle: "from-cyan-400 to-blue-500 text-slate-900",
    },
    Pending: {
      colorClass: "text-yellow-500",
      borderClass: "border-yellow-500/30",
      bgClass: "bg-yellow-500/10",
      icon: Loader2,
      title: "Verification Pending",
      desc: "Your documents are being processed by our AI compliance engine. This usually takes a few minutes.",
    },
    Verified: {
      colorClass: "text-emerald-500",
      borderClass: "border-emerald-500/30",
      bgClass: "bg-emerald-500/10",
      icon: ShieldCheck,
      title: "Identity Verified",
      desc: "Congratulations! You have full, unrestricted access to the SwiftEarn ecosystem.",
    },
    Rejected: {
      colorClass: "text-rose-500",
      borderClass: "border-rose-500/30",
      bgClass: "bg-rose-500/10",
      icon: XCircle,
      title: `Verification Rejected (${kycAttempts}/${MAX_ATTEMPTS})`,
      desc: "Your submitted documents were rejected. Please ensure the images are clear, well-lit, and try again.",
      buttonText: "RETRY VERIFICATION",
      buttonAction: () => setShowKYC(true),
      buttonStyle: "from-rose-500 to-red-600 text-white",
    },
    Locked: {
      colorClass: "text-slate-500",
      borderClass: "border-rose-900/50",
      bgClass: "bg-slate-900",
      icon: Ban,
      title: "Verification Locked",
      desc: `You have reached the maximum number of attempts (${MAX_ATTEMPTS}/${MAX_ATTEMPTS}). Please contact support for manual verification.`,
      buttonText: "CONTACT SUPPORT",
      buttonAction: () => handleOpenTelegram(),
      buttonStyle:
        "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700",
    },
  };

  const currentConfig = statusConfig[kycStatusUI];
  const StatusIcon = currentConfig.icon;

  const userData = {
    username: user?.name || "anonymous_U_01",
    joinDate: user?.created_at
      ? new Date(user.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "January 15, 2026",
    trc20Address: user?.trc20_address
      ? `${user.trc20_address.slice(0, 6)}...${user.trc20_address.slice(-6)}`
      : "TXy9K...mX6YK",
    fullAddress:
      user?.trc20_address ||
      "TXy9K8vN2mPqL4sR6tU8wV9xY0zAmX6YK",
    referralCode: user?.referral_code || "SWFT_U01",
    totalEarnings: parseFloat(user?.wallet_balance || "0"),
    totalStaked: parseFloat(user?.staked_balance || "0"),
    referrals: user?.cached_referral_count || 0,
    memberLevel:
      user?.mining_booster > 1
        ? `Level ${user.mining_booster}`
        : "Basic",
    accountScore:
      kycStatusUI === "Verified"
        ? 950
        : kycStatusUI === "Locked"
          ? 200
          : 450,
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(userData.fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleOpenTelegram = () => {
    window.open("https://t.me/swiftearn_support", "_blank");
  };

  const stats = [
    {
      label: "Total Earnings",
      value: `$${userData.totalEarnings.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Total Staked",
      value: `$${userData.totalStaked.toFixed(2)}`,
      icon: Shield,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      label: "Team Size",
      value: userData.referrals,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Account Level",
      value: userData.memberLevel,
      icon: Award,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      {showKYC && (
        <KYCModal
          onClose={() => setShowKYC(false)}
          onSuccess={() => {
            setShowKYC(false);
            refreshUser();
          }}
        />
      )}

      <div className="w-full max-w-5xl px-4 lg:px-10 py-6 lg:py-12 space-y-6 lg:space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl group-hover:bg-slate-800 transition-all">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <span className="font-black tracking-widest text-xs uppercase hidden sm:inline">
              Back to Dashboard
            </span>
          </button>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button className="relative p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900 text-[8px] font-bold flex items-center justify-center text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Column: Profile Card & Verification */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-10 -mt-10" />

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 p-1 shadow-2xl shadow-cyan-500/20">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border-4 border-slate-900">
                      <span className="text-white font-black text-4xl italic">
                        {userData.username
                          .charAt(0)
                          .toUpperCase()}
                        1
                      </span>
                    </div>
                  </div>
                  {kycStatusUI === "Verified" && (
                    <div className="absolute bottom-1 right-1 bg-emerald-500 rounded-full p-2 border-4 border-slate-900 shadow-xl shadow-emerald-500/20">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <h2 className="text-white text-2xl font-black mb-1">
                  {userData.username}
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Joined {userData.joinDate}
                </p>

                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-2xl border border-slate-800/50">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                      Member Rank
                    </span>
                    <span className="text-yellow-400 font-black flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      {userData.memberLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-2xl border border-slate-800/50">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                      Safety Score
                    </span>
                    <span
                      className={`${kycStatusUI === "Verified" ? "text-emerald-400" : kycStatusUI === "Locked" ? "text-rose-500" : "text-slate-400"} font-black`}
                    >
                      {userData.accountScore} / 1000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC VERIFICATION STATUS CARD */}
            <div
              className={`bg-slate-900 border rounded-[32px] p-8 transition-all ${currentConfig.borderClass}`}
            >
              <div className="flex items-start gap-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${currentConfig.bgClass} ${currentConfig.borderClass} ${currentConfig.colorClass}`}
                >
                  <StatusIcon
                    className={`w-7 h-7 ${kycStatusUI === "Pending" ? "animate-spin" : ""}`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-black text-lg">
                    {currentConfig.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {currentConfig.desc}
                  </p>
                </div>
              </div>

              {/* Dynamic Action Button (Shows for Unverified, Rejected, and Locked states) */}
              {currentConfig.buttonText &&
                currentConfig.buttonAction && (
                  <button
                    onClick={currentConfig.buttonAction}
                    className={`w-full mt-6 bg-gradient-to-r ${currentConfig.buttonStyle} font-black py-4 rounded-2xl shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
                  >
                    {kycStatusUI === "Locked" ? (
                      <HelpCircle className="w-5 h-5" />
                    ) : (
                      <ShieldCheck className="w-5 h-5" />
                    )}
                    <span>{currentConfig.buttonText}</span>
                  </button>
                )}

              {kycStatusUI === "Pending" && (
              
                <div className="mt-6 flex flex-col items-center">
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="w-[65%] h-full bg-yellow-500 animate-pulse" />
                  </div>
                  <p className="text-yellow-500 text-[10px] font-black mt-3 uppercase tracking-widest italic">
                    KYC IN PENDING STATE
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stats & Settings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-6 transition-all hover:border-slate-700"
                  >
                    <div
                      className={`${stat.bgColor} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest italic mb-1">
                      {stat.label}
                    </p>
                    <p className="text-white text-2xl font-black">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Address Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest italic">
                    Staking Wallet
                  </h3>
                  <div className="bg-cyan-500/10 text-cyan-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-cyan-500/20">
                    TRC20
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-mono text-xs">
                    {userData.trc20Address}
                  </span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-cyan-400 hover:text-white transition-colors"
                  >
                    {copiedAddress ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-center">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-black text-sm uppercase tracking-widest italic">
                    Referral Program
                  </h3>
                  <div className="bg-purple-500/10 text-purple-400 text-[10px] font-black px-2 py-0.5 rounded-full border border-purple-500/20">
                    ACTIVE
                  </div>
                </div>
                <button
                  onClick={onShareReferral}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-500/10 hover:opacity-90 transition-all flex items-center justify-center gap-2 group"
                >
                  <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  SHARE REFERRAL LINK
                </button>
                <p className="text-slate-500 text-[10px] mt-3 text-center font-bold uppercase tracking-widest italic">
                  Earn up to 17% commission from 3-tiers
                </p>
              </div>
            </div>

            {/* Menu Sections */}
            <div className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden">
              <div className="p-8 border-b border-slate-800">
                <h3 className="text-white font-black text-lg">
                  Account Management
                </h3>
              </div>

              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => setShowPasswordUpdate(true)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <Lock className="w-5 h-5 text-emerald-400" />
                      <span className="text-slate-300 font-bold text-sm">
                        Security Center
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => setShowTransactions(true)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <History className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-300 font-bold text-sm">
                        Transaction History
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
                <div className="p-4 space-y-2">
                  <button
                    onClick={handleOpenTelegram}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <HelpCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-slate-300 font-bold text-sm">
                        Help & Support
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <LogOut className="w-5 h-5 text-slate-400" />
                      <span className="text-rose-500 font-bold text-sm">
                        Logout SwiftEarn
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}