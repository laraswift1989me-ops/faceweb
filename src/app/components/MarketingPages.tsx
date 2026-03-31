import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Shield, Zap, ChevronRight, PieChart, Users, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ViewProps {
  onLogin: () => void;
  onRegister: () => void;
}

export function MarketingHome({ onLogin, onRegister }: ViewProps) {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl -z-10" />
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-slate-800/50 border border-slate-700/50 rounded-full px-4 py-1.5">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">v2.0 LIVE: NEXT-GEN DEFI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Earn Passive <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Wealth in Web3</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed">
              Join the world's most secure DeFi dashboard. Stake TRC20 USDT, complete daily tasks, and watch your assets grow with AI-powered arbitrage.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={onRegister}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform flex items-center justify-center space-x-2"
              >
                <span>Start Earning Now</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                Log In
              </button>
            </div>
            <div className="flex items-center space-x-6 text-slate-500 text-sm">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Audited Smart Contracts</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Instant Withdrawals</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="relative z-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[40px] p-2 shadow-2xl">
              <ImageWithFallback 
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
                alt="SwiftEarn Dashboard" 
                className="rounded-[32px] w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-xl animate-bounce">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Daily Profit</p>
                    <p className="text-white font-bold">+12.5% USDT</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Background blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[100px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-slate-800/30 border border-slate-700/50 rounded-[40px] p-10 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-white">$420M+</h3>
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Total Volume</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-white">85K+</h3>
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Active Users</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-white">100%</h3>
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Payout Success</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-white">30s</h3>
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Avg Withdrawal</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-white">Why SwiftEarn?</h2>
          <p className="text-slate-400 text-lg">We provide a secure and transparent ecosystem for maximizing your digital assets.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              icon: Rocket, 
              title: 'High Yield Pools', 
              desc: 'Access exclusive 10-level booster systems with up to 30% daily profit ranges.',
              color: 'text-cyan-400',
              bg: 'bg-cyan-400/10'
            },
            { 
              icon: PieChart, 
              title: 'AI Arbitrage', 
              desc: 'Our proprietary bots scan 50+ exchanges to find the best spread for your staked USDT.',
              color: 'text-purple-400',
              bg: 'bg-purple-400/10'
            },
            { 
              icon: Users, 
              title: '3-Tier Rewards', 
              desc: 'Invite friends and earn from 3 levels of referrals. Build your network, earn together.',
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10'
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[32px] space-y-6"
            >
              <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function MarketingAbout() {
  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-6xl font-black text-white">The Future of <br/><span className="text-cyan-400">Yield Farming</span></h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Founded in 2024, SwiftEarn was born from a simple vision: making professional-grade DeFi tools accessible to everyone. Our team of quantitative traders and blockchain engineers worked for two years to develop the AI Arbitrage Engine that powers our platform today.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-emerald-500/20 p-3 rounded-xl mt-1">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Safety First</h4>
                <p className="text-slate-500">Multisig wallets and cold storage for all user funds.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-cyan-500/20 p-3 rounded-xl mt-1">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Transparency</h4>
                <p className="text-slate-500">Real-time on-chain reporting for all investment projects.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 p-2 rounded-[40px]">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop" 
            alt="Team working" 
            className="rounded-[32px] grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </div>
  );
}

export function MarketingEarn() {
  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-black text-white">Multiple Ways to <span className="text-emerald-400">Profit</span></h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">Diversify your portfolio with our curated investment strategies.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[40px] p-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full inline-block">MOST POPULAR</div>
              <h3 className="text-3xl font-black text-white">USDT Booster</h3>
            </div>
            <ArrowUpRight className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">A tiered staking system where your rewards increase as your stake grows. From Level 1 to Level 10, unlock unprecedented yields.</p>
          <ul className="space-y-3">
            {['Up to 30% Daily Profit', 'Instant Withdrawal', 'TRC20 Compatibility', 'Secure Lock-in Options'].map((item, i) => (
              <li key={i} className="flex items-center space-x-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[40px] p-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full inline-block">HIGH LIQUIDITY</div>
              <h3 className="text-3xl font-black text-white">Arbitrage Pool</h3>
            </div>
            <ArrowUpRight className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400">Participate in short-term arbitrage opportunities. Funds are cycled through exchange spreads every 24 hours.</p>
          <ul className="space-y-3">
            {['1% - 50% Daily Ranges', 'Daily Harvest Cycles', 'No Long-term Lockup', 'AI Driven Selection'].map((item, i) => (
              <li key={i} className="flex items-center space-x-3 text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function MarketingSupport() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto bg-slate-800/40 border border-slate-700/50 rounded-[40px] p-12 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white">Need Assistance?</h2>
          <p className="text-slate-400">Our 24/7 global support team is here to help you navigate the DeFi space.</p>
        </div>
        
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-slate-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-cyan-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold">Live Chat</h4>
            <p className="text-slate-500 text-sm">Response time: &lt; 5 mins</p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-slate-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold">Security Center</h4>
            <p className="text-slate-500 text-sm">Account & Access help</p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-slate-700/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-yellow-400">
              <PieChart className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold">Knowledge Base</h4>
            <p className="text-slate-500 text-sm">Guides and Tutorials</p>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-700/50 text-center space-y-6">
          <h3 className="text-xl font-bold text-white">Can't find what you're looking for?</h3>
          <button className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors">
            Contact Official Telegram
          </button>
        </div>
      </div>
    </div>
  );
}
