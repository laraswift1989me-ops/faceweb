import {
  Users,
  Share2,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  UserPlus,
  Loader2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

interface ReferralTreeProps {
  onShareClick?: () => void;
}

export function ReferralTree({
  onShareClick,
}: ReferralTreeProps) {
  // Pull live user and referral data from our global state
  const { user, referralStats, referralsLoading } = useApp();

  // Map the backend API response to the component's expected structure
  const stats = {
    totalReferrals: referralStats?.overview?.total_team || 0,
    totalEarnings: referralStats?.overview?.total_earned || 0.0,
    level1: {
      count: referralStats?.tiers?.level_1?.members || 0,
      earnings: referralStats?.tiers?.level_1?.earnings || 0.0,
    },
    level2: {
      count: referralStats?.tiers?.level_2?.members || 0,
      earnings: referralStats?.tiers?.level_2?.earnings || 0.0,
    },
    level3: {
      count: referralStats?.tiers?.level_3?.members || 0,
      earnings: referralStats?.tiers?.level_3?.earnings || 0.0,
    },
  };

  const avatarColors = [
    "from-blue-400 to-cyan-500",
    "from-purple-400 to-pink-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-500",
    "from-yellow-400 to-amber-500",
    "from-indigo-400 to-purple-500",
    "from-rose-400 to-pink-500",
    "from-teal-400 to-cyan-500",
  ];

  const generateUserInitials = (index: number) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[index % 26] + letters[(index + 5) % 26];
  };

  if (referralsLoading && !referralStats) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Loading Network Data...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-10 overflow-x-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Premium Dashboard Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-[24px] md:rounded-[32px] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-cyan-500/5 blur-3xl rounded-full -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 relative z-10 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">
                Accelerator Active
              </span>
            </div>
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-black italic tracking-tighter uppercase mb-2">
              Global Network
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              Monitor your 3-tier empire and instant
              commissions.
            </p>
          </div>

          <button
            onClick={onShareClick}
            className="group bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-900 font-black px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl shadow-cyan-500/10 active:scale-95"
          >
            <Share2 className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform" />
            <span className="italic uppercase tracking-tighter text-sm md:text-base">
              Expand Network
            </span>
          </button>
        </div>

        {/* Major Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-10">
          <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="bg-cyan-500/10 p-2.5 md:p-3 rounded-xl border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20 transition-all shrink-0">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest italic truncate">
                  Total Partners
                </p>
                <p className="text-white text-xl md:text-3xl font-black italic tracking-tighter truncate">
                  {stats.totalReferrals}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-700 group-hover:text-cyan-400 transition-all shrink-0" />
          </div>

          <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
              <div className="bg-emerald-500/10 p-2.5 md:p-3 rounded-xl border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20 transition-all shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest italic truncate">
                  Total Yield
                </p>
                <p className="text-emerald-400 text-xl md:text-3xl font-black italic tracking-tighter truncate">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-700 group-hover:text-emerald-400 transition-all shrink-0" />
          </div>
        </div>
      </div>

      {/* Network Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-[28px] md:rounded-[40px] p-6 sm:p-8 md:p-12 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 shrink-0">
            <Award className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg md:text-xl italic tracking-tighter uppercase">
              Commission Hierarchy
            </h3>
            <p className="text-slate-500 text-[9px] md:text-xs font-bold uppercase tracking-widest italic">
              Automated Distribution Engine
            </p>
          </div>
        </div>

        {/* Tree Root - YOU */}
        <div className="flex flex-col items-center mb-12 md:mb-16 relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-[32px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center border-4 border-slate-900 shadow-2xl shadow-cyan-500/20 relative z-10 group cursor-pointer active:scale-95 transition-all">
            <span className="text-white font-black text-xl md:text-2xl italic tracking-tighter">
              {user?.name
                ? user.name.slice(0, 2).toUpperCase()
                : "AU"}
            </span>
            <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-emerald-500 rounded-full p-1.5 md:p-2 border-2 md:border-4 border-slate-900 shadow-lg">
              <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-white font-black italic uppercase tracking-tighter text-base md:text-lg leading-none">
              System Root
            </p>
            <p className="text-cyan-400 text-[10px] md:text-xs font-bold uppercase tracking-widest italic mt-1">
              {user?.referral_code || "Loading..."}
            </p>
          </div>
          {/* Vertical Linkage */}
          <div className="absolute top-20 md:top-24 w-0.5 h-10 md:h-12 bg-gradient-to-b from-cyan-500/50 to-transparent" />
        </div>

        {/* Tiers Grid */}
        <div className="space-y-4 md:space-y-6">
          {[
            {
              id: "L1",
              title: "Tier 1 - Primary",
              rate: "10%",
              data: stats.level1,
              color: "text-cyan-400",
              borderColor: "border-cyan-500/30",
              bgColor: "bg-cyan-500/5",
            },
            {
              id: "L2",
              title: "Tier 2 - Secondary",
              rate: "5%",
              data: stats.level2,
              color: "text-blue-400",
              borderColor: "border-blue-500/30",
              bgColor: "bg-blue-500/5",
            },
            {
              id: "L3",
              title: "Tier 3 - Tertiary",
              rate: "2%",
              data: stats.level3,
              color: "text-purple-400",
              borderColor: "border-purple-500/30",
              bgColor: "bg-purple-500/5",
            },
          ].map((tier, idx) => (
            <div
              key={tier.id}
              className={`bg-slate-950/40 border ${tier.borderColor} rounded-2xl md:rounded-[32px] p-5 md:p-8 hover:bg-slate-950/60 transition-all group`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
                <div className="flex items-center gap-4 md:gap-5 overflow-hidden">
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${tier.bgColor} border ${tier.borderColor} flex flex-col items-center justify-center shrink-0`}
                  >
                    <span
                      className={`${tier.color} font-black text-[10px] italic tracking-tighter leading-none mb-0.5`}
                    >
                      {tier.id}
                    </span>
                    <UserPlus
                      className={`w-4 h-4 md:w-5 md:h-5 ${tier.color}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-black italic uppercase tracking-tighter text-base md:text-lg truncate">
                      {tier.title}
                    </h4>
                    <div className="flex items-center gap-2 md:gap-3">
                      <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest italic truncate">
                        {tier.data.count} Members
                      </p>
                      <div className="w-1 h-1 bg-slate-800 rounded-full shrink-0" />
                      <p
                        className={`${tier.color} text-[8px] md:text-[10px] font-black uppercase tracking-widest italic truncate`}
                      >
                        {tier.rate} Bonus
                      </p>
                    </div>
                  </div>
                </div>

                {/* Micro Avatars Grid */}
                <div className="flex -space-x-2 md:-space-x-3 overflow-hidden px-1">
                  {[...Array(Math.min(tier.data.count, 5))].map(
                    (_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br ${avatarColors[(i + idx * 3) % avatarColors.length]} border-2 md:border-4 border-slate-900 flex items-center justify-center shadow-lg transition-all hover:-translate-y-1 hover:z-10 cursor-pointer shrink-0`}
                      >
                        <span className="text-white font-black text-[9px] md:text-[10px] italic">
                          {generateUserInitials(i + idx * 10)}
                        </span>
                      </div>
                    ),
                  )}
                  {tier.data.count > 5 && (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-800 border-2 md:border-4 border-slate-900 flex items-center justify-center text-slate-400 text-[8px] md:text-[10px] font-black italic shrink-0">
                      +{tier.data.count - 5}
                    </div>
                  )}
                  {tier.data.count === 0 && (
                    <div className="text-slate-600 text-[10px] font-bold italic tracking-widest ml-4">
                      No Members Yet
                    </div>
                  )}
                </div>

                <div className="bg-slate-900/50 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl border border-white/5 text-right min-w-[120px] md:min-w-[140px] self-end md:self-center">
                  <p className="text-slate-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest italic mb-0.5 md:mb-1">
                    Yield
                  </p>
                  <p className="text-emerald-400 text-lg md:text-xl font-black italic tracking-tighter">
                    ${tier.data.earnings.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructional Footer */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[28px] md:rounded-[32px] p-6 md:p-8">
        <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              step: "01",
              title: "Broadcast",
              desc: "Share your link",
            },
            {
              step: "02",
              title: "Register",
              desc: "Users join network",
            },
            {
              step: "03",
              title: "Profit",
              desc: "Instant payouts",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-1 md:space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-cyan-400 font-black italic text-lg md:text-xl">
                  {item.step}
                </span>
                <div className="h-px flex-1 bg-cyan-500/20" />
              </div>
              <p className="text-white font-black italic uppercase tracking-tighter text-sm md:text-base leading-none">
                {item.title}
              </p>
              <p className="text-slate-500 text-[10px] md:text-xs font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}