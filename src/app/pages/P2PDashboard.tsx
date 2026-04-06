import { motion } from "motion/react";
import {
  ArrowLeftRight,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Users,
  Clock,
  Sparkles,
  Zap,
  Lock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { APP_NAME } from "../../config";

const FEATURES = [
  {
    icon: Cpu,
    title: "AI Order Matchingsss",
    description:
      "Neural network driven order pairing for optimal execution and zero slippage.",
    cardCls:
      "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30",
    iconCls: "text-cyan-500 dark:text-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Smart Escrow",
    description:
      "AI-monitored escrow contracts with automated release and dispute resolution.",
    cardCls:
      "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30",
    iconCls: "text-emerald-500 dark:text-emerald-400",
  },
  {
    icon: TrendingUp,
    title: "Dynamic Pricing",
    description:
      "Real-time market analysis drives fair rates, eliminating price manipulation.",
    cardCls:
      "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30",
    iconCls: "text-indigo-500 dark:text-indigo-400",
  },
  {
    icon: Users,
    title: "KYC Reputation",
    description:
      "Every counterparty is verified with an AI-computed on-chain reputation score.",
    cardCls:
      "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30",
    iconCls: "text-violet-500 dark:text-violet-400",
  },
];

const ROADMAP = [
  {
    phase: "Phase 1",
    label: "AI Matching Engine",
    status: "active",
    desc: "Core neural network order matching and liquidity pool integration.",
  },
  {
    phase: "Phase 2",
    label: "Smart Escrow Contracts",
    status: "planned",
    desc: "Automated escrow with AI-monitored release conditions.",
  },
  {
    phase: "Phase 3",
    label: "KYC Reputation System",
    status: "planned",
    desc: "On-chain reputation scores for verified traders.",
  },
  {
    phase: "Phase 4",
    label: "Member Beta Launch",
    status: "planned",
    desc: `Invite-only access for existing ${APP_NAME} members.`,
  },
];

export function P2PDashboard() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-700">
      {/* ── PAGE HEADER ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-2">
            P2P Exchange
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">
            AI-powered peer-to-peer trading — coming soon to {APP_NAME} members.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-[0.25em] uppercase px-4 py-2.5 rounded-xl self-start md:self-auto">
          <Clock className="w-4 h-4" />
          Under Development
        </div>
      </div>

      {/* ── HERO BANNER ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-[40px] p-8 lg:p-12 border border-slate-700/50 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 opacity-[0.04] pointer-events-none">
          <ArrowLeftRight
            className="w-full h-full text-cyan-400"
            strokeWidth={0.5}
          />
        </div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              AI Integration In Progress
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-white italic tracking-tighter uppercase leading-tight">
              The Future of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                P2P Trading
              </span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Zero intermediaries. AI-guaranteed settlement. Every trade
              matched, escrowed, and executed by {APP_NAME}'s proprietary
              intelligence layer.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 lg:gap-6 shrink-0">
            {[
              { label: "Settlement", value: "< 30s", color: "text-cyan-400" },
              { label: "AI Match", value: "99.7%", color: "text-emerald-400" },
              { label: "Slippage", value: "Zero", color: "text-indigo-400" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 text-center"
              >
                <p
                  className={`${color} text-xl font-black italic tracking-tighter`}
                >
                  {value}
                </p>
                <p className="text-slate-400 text-[9px] font-black tracking-widest uppercase mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* ── LEFT: FEATURES + ROADMAP ─────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Feature grid */}
          <section className="bg-white dark:bg-slate-900 rounded-[36px] p-7 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight">
                  Core Capabilities
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                  Powered by {APP_NAME} AI
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map(
                ({ icon: Icon, title, description, cardCls, iconCls }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 group hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${cardCls}`}
                    >
                      <Icon className={`w-5 h-5 ${iconCls}`} />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-tight mb-1">
                        {title}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </motion.div>
                ),
              )}
            </div>
          </section>

          {/* Roadmap */}
          <section className="bg-white dark:bg-slate-900 rounded-[36px] p-7 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight">
                  Development Roadmap
                </h3>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                  Q2 2025 Target
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {ROADMAP.map(({ phase, label, status, desc }) => (
                <div
                  key={phase}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    status === "active"
                      ? "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-500/20"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black border ${
                      status === "active"
                        ? "bg-cyan-100 dark:bg-cyan-500/20 border-cyan-300 dark:border-cyan-500/40 text-cyan-600 dark:text-cyan-400"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {status === "active" ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">
                        {phase}
                      </span>
                      {status === "active" && (
                        <span className="text-[9px] font-black tracking-widest uppercase bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30 px-2 py-0.5 rounded-full">
                          In Dev
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-bold text-sm uppercase tracking-tight ${status === "active" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {label}
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── RIGHT: EARLY ACCESS + INFO ───────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Early Access Card */}
          <section className="bg-white dark:bg-slate-900 rounded-[36px] p-7 border border-slate-200 dark:border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-5">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tighter text-lg mb-2">
              Early Access
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-6">
              Members who reach{" "}
              <span className="text-cyan-500 dark:text-cyan-400 font-bold">
                Level 3
              </span>{" "}
              or above will receive priority invitations when P2P launches.
            </p>

            <div className="space-y-3">
              {[
                { label: "Level 1–2", note: "Waitlist queue", met: false },
                { label: "Level 3+", note: "Priority early access", met: true },
                { label: "Level 10+", note: "Beta tester status", met: false },
              ].map(({ label, note, met }) => (
                <div
                  key={label}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    met
                      ? "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50"
                  }`}
                >
                  <div>
                    <p
                      className={`text-sm font-bold uppercase tracking-tight ${met ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
                    >
                      {label}
                    </p>
                    <p
                      className={`text-[10px] font-bold tracking-widest uppercase mt-0.5 ${met ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}
                    >
                      {note}
                    </p>
                  </div>
                  {met && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <Link
              to="/tasks"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-sm italic uppercase tracking-tight py-3.5 rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all shadow-lg"
            >
              Level Up Now <ChevronRight className="w-4 h-4" />
            </Link>
          </section>

          {/* What is P2P */}
          <section className="bg-white dark:bg-slate-900 rounded-[36px] p-7 border border-slate-200 dark:border-slate-800">
            <h3 className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-[0.2em] uppercase mb-5">
              How P2P Works
            </h3>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  text: "Post a buy or sell order at your desired rate",
                },
                {
                  step: "2",
                  text: "AI matches you with the best counterparty available",
                },
                {
                  step: "3",
                  text: "Funds locked in smart escrow during negotiation",
                },
                {
                  step: "4",
                  text: "Confirm trade — assets released automatically",
                },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 shrink-0">
                    {step}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed pt-1">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
