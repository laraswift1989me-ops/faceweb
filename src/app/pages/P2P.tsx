import { motion } from "motion/react";
import { ArrowLeft, Cpu, Zap, ShieldCheck, TrendingUp, Clock, Users, Sparkles } from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    icon: Cpu,
    color: "cyan",
    title: "AI-Powered Matching",
    description: "Intelligent order matching using deep learning to ensure optimal trade execution and minimal slippage.",
  },
  {
    icon: ShieldCheck,
    color: "emerald",
    title: "Smart Escrow Protocol",
    description: "Funds are held in AI-monitored smart escrow contracts with automated dispute resolution.",
  },
  {
    icon: TrendingUp,
    color: "indigo",
    title: "Dynamic Pricing Engine",
    description: "Real-time market analysis drives fair pricing, eliminating manipulation and ensuring best rates.",
  },
  {
    icon: Users,
    color: "violet",
    title: "Verified Counterparties",
    description: "KYC-verified trading partners with AI-computed reputation scores for every transaction.",
  },
];

export function P2P() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-24 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">

        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-black italic uppercase tracking-widest hover:underline mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800/60 dark:to-slate-950 border border-slate-200 dark:border-slate-700/50 rounded-[40px] p-10 lg:p-16 mb-12 shadow-xl">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 opacity-[0.04] dark:opacity-[0.06]">
            <Cpu className="w-full h-full text-cyan-500" />
          </div>
          <div className="absolute -bottom-10 -left-10 w-64 h-64 opacity-[0.03] dark:opacity-[0.05]">
            <Zap className="w-full h-full text-indigo-500" />
          </div>

          <div className="relative z-10">
            {/* Coming Soon Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase px-4 py-2 rounded-full mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              Coming Soon
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-6 leading-none"
            >
              AI P2P<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-indigo-500">
                Exchange
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl mb-10 leading-relaxed"
            >
              The next evolution of peer-to-peer trading — powered entirely by artificial intelligence.
              Zero intermediaries, maximum security, AI-guaranteed settlement.
            </motion.p>

            {/* Stats preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-8"
            >
              {[
                { label: "Avg. Settlement", value: "< 30s", color: "cyan" },
                { label: "AI Match Rate", value: "99.7%", color: "emerald" },
                { label: "Zero Slippage", value: "Guaranteed", color: "indigo" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className={`text-${color}-500 dark:text-${color}-400 text-2xl font-black italic tracking-tighter`}>{value}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map(({ icon: Icon, color, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/50 rounded-[28px] p-7 flex gap-5 group hover:border-slate-300 dark:hover:border-slate-600 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-200 dark:border-${color}-500/30 flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 text-${color}-500 dark:text-${color}-400`} />
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black italic uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline / Roadmap */}
        <div className="bg-white dark:bg-gradient-to-br dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-[32px] p-8 lg:p-10 mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-black italic uppercase tracking-tighter">Development Roadmap</h2>
          </div>
          <div className="space-y-4">
            {[
              { phase: "Phase 1", label: "AI Matching Engine", status: "in_dev", desc: "Core neural network order matching and liquidity pool integration." },
              { phase: "Phase 2", label: "Smart Escrow Contracts", status: "planned", desc: "Automated escrow with AI-monitored release conditions and dispute resolution." },
              { phase: "Phase 3", label: "KYC Reputation System", status: "planned", desc: "On-chain reputation scores for verified traders using behavioral analysis." },
              { phase: "Phase 4", label: "Public Beta Launch", status: "planned", desc: "Invite-only beta rollout to existing SwiftEarn members." },
            ].map(({ phase, label, status, desc }) => (
              <div key={phase} className="flex gap-5 items-start">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${status === 'in_dev' ? 'bg-cyan-500 ring-4 ring-cyan-500/20' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700/50 mt-2 min-h-[20px]" />
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">{phase}</span>
                    {status === 'in_dev' && (
                      <span className="text-[9px] font-black tracking-widest uppercase bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full">In Development</span>
                    )}
                  </div>
                  <p className="text-slate-900 dark:text-white font-black italic tracking-tight mb-1">{label}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify CTA */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 dark:from-cyan-500/5 dark:to-indigo-500/5 border border-cyan-200 dark:border-cyan-500/20 rounded-[32px] p-8 lg:p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-7 h-7 text-cyan-500 dark:text-cyan-400" />
          </div>
          <h3 className="text-slate-900 dark:text-white text-2xl font-black italic tracking-tighter uppercase mb-3">Be First to Trade</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-8">
            SwiftEarn P2P is currently under development. Existing members with Level 3+ will receive early access invitations upon launch.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-sm italic uppercase tracking-tight px-8 py-4 rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all shadow-xl"
          >
            <Zap className="w-5 h-5" />
            Go to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
}
