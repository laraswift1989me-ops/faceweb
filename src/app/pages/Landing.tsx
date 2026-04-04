import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Users,
  Globe,
  TrendingUp,
  ChevronRight,
  PlayCircle,
  BarChart3,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { AppDownloadSection } from "../components/AppDownload";

export function Landing() {
  return (
    <div className="bg-slate-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 lg:pt-40 lg:pb-52 flex flex-col items-center">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 -left-1/4 w-3/4 h-3/4 bg-cyan-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-3/4 h-3/4 bg-blue-600/10 blur-[150px] rounded-full" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-black tracking-[0.2em] uppercase mb-10"
          >
            <Zap className="w-4 h-4 animate-pulse" />
            V4.0 AI ENGINE NOW ACTIVE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-9xl font-black text-white italic tracking-tighter uppercase leading-[0.85] mb-10"
          >
            SMART YIELDSS <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              AI PROTOCOL
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto text-slate-400 text-lg lg:text-xl font-medium leading-relaxed mb-12"
          >
            SwiftEarn leverages advanced quantitative AI to automate your DeFi
            staking strategy. Earn up to 1.0% daily ROI with institutional-grade
            security and transparency.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/register"
              className="w-full sm:w-auto px-12 py-5 rounded-[24px] bg-white text-slate-950 font-black italic tracking-tight uppercase text-lg hover:bg-cyan-400 transition-all shadow-2xl shadow-white/5 flex items-center justify-center gap-3 group"
            >
              START EARNING NOW
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto px-12 py-5 rounded-[24px] bg-slate-900 text-white border border-slate-800 font-black italic tracking-tight uppercase text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
            >
              <PlayCircle className="w-5 h-5 text-cyan-400" />
              WHITEPAPER V2
            </Link>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-24 pt-12 border-t border-slate-900 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          >
            <div>
              <p className="text-white text-3xl font-black italic tracking-tighter">
                $85M+
              </p>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mt-1">
                Total Value Locked
              </p>
            </div>
            <div>
              <p className="text-white text-3xl font-black italic tracking-tighter">
                125K+
              </p>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mt-1">
                Active Arbitrageurs
              </p>
            </div>
            <div>
              <p className="text-white text-3xl font-black italic tracking-tighter">
                1.0%
              </p>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mt-1">
                Avg Daily ROI
              </p>
            </div>
            <div>
              <p className="text-white text-3xl font-black italic tracking-tighter">
                TRC20
              </p>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mt-1">
                Native Protocol
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-slate-900/20 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-6">
                ENGINEERED FOR{" "}
                <span className="text-cyan-400">YIELD MAXIMIZATION</span>
              </h2>
              <p className="text-slate-500 text-lg font-medium">
                Our proprietary AI core monitors 40+ decentralized exchanges
                24/7 to capture market inefficiencies before they vanish.
              </p>
            </div>
            <Link
              to="/about"
              className="text-cyan-400 font-black italic uppercase tracking-widest flex items-center gap-2 hover:underline"
            >
              EXPLORE ARCHITECTURE <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[48px] bg-slate-900/50 border border-slate-800/50 group hover:border-cyan-500/30 transition-all">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-10 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">
                QUANTITATIVE AI
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Advanced machine learning models predict price movements and
                execute trades with sub-millisecond latency.
              </p>
            </div>

            <div className="p-10 rounded-[48px] bg-slate-900/50 border border-slate-800/50 group hover:border-indigo-500/30 transition-all">
              <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">
                IMMUTABLE SECURITY
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Non-custodial infrastructure where your assets are protected by
                audited smart contracts and AES-256 encryption.
              </p>
            </div>

            <div className="p-10 rounded-[48px] bg-slate-900/50 border border-slate-800/50 group hover:border-blue-500/30 transition-all">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-10 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-4">
                3-TIER NETWORK
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Scale your earnings beyond staking with our industry-leading
                multi-tier referral ecosystem and real-time bonuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-800 rounded-[64px] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-cyan-500/20">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <ShieldAlert className="w-64 h-64 text-white" strokeWidth={1} />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9] mb-10">
                READY TO UPGRADE YOUR <br /> FINANCIAL OPERATING SYSTEM?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-12 py-5 rounded-[24px] bg-white text-slate-950 font-black italic tracking-tight uppercase text-lg hover:bg-slate-950 hover:text-white transition-all shadow-2xl shadow-black/10 flex items-center justify-center gap-3 group"
                >
                  JOIN THE ECOSYSTEM
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex items-center gap-3 px-6 py-4">
                  <div className="flex -space-x-4">
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500 bg-slate-800" />
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500 bg-slate-700" />
                    <div className="w-10 h-10 rounded-full border-2 border-cyan-500 bg-slate-600" />
                  </div>
                  <p className="text-white/80 text-xs font-black uppercase tracking-widest">
                    +12.4k Joining Today
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="container mx-auto px-6 pb-20">
        <AppDownloadSection />
      </section>
    </div>
  );
}
