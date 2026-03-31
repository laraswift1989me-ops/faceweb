import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion } from "motion/react";
import { Users, Copy, Share2, Twitter, MessageCircle, Send, Globe, ChevronRight, TrendingUp, UserPlus, Zap, CheckCircle2, Info, Network } from "lucide-react";
import { toast } from "sonner";

export function Refer() {
  const { referralData, user, refreshAll } = useApp();
  
  const referralCode = user?.referral_code || "SWIFT-XXXX-XXXX";
  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;
  
  const shareText = `🚀 Join SwiftEarn - The ultimate AI-powered DeFi staking platform! Earn 1.0% daily ROI and grow your network with a 3-tier bonus system. Join now: ${referralLink}`;

  useEffect(() => {
    refreshAll();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const shareSocial = (platform: string) => {
    let url = "";
    switch(platform) {
      case 'twitter': url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`; break;
      case 'telegram': url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(shareText)}`; break;
      case 'whatsapp': url = `https://wa.me/?text=${encodeURIComponent(shareText)}`; break;
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`; break;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Network Hub</h1>
          <p className="text-slate-400 font-medium tracking-wide">Grow your community and earn passive rewards across 3 tiers of influence.</p>
        </div>
        <div className="bg-slate-900/50 backdrop-blur-md px-6 py-4 rounded-3xl border border-slate-800/50 flex items-center gap-6">
          <div>
            <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Total Team Size</p>
            <p className="text-white text-xl font-black italic tracking-tighter">{referralData?.total_referrals || 0} Members</p>
          </div>
          <div className="w-[1px] h-10 bg-slate-800" />
          <div>
            <p className="text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-1">Active Referrals</p>
            <p className="text-emerald-400 text-xl font-black italic tracking-tighter">{referralData?.active_referrals || 0} Active</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: SHARE & STATS */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* SECTION 1: REFERRAL LINK */}
          <section className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 p-8 rounded-[40px] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <UserPlus className="w-32 h-32 text-cyan-400" />
            </div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                <Share2 className="w-5 h-5 text-cyan-400" />
                Invite Your Network
              </h3>

              <div className="space-y-4">
                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group/code">
                  <div>
                    <p className="text-slate-600 text-[10px] font-black tracking-widest uppercase mb-1">Your Unique Referral Code</p>
                    <p className="text-white text-lg font-black italic tracking-tighter">{referralCode}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(referralCode, "Code")}
                    className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group/link">
                  <div className="overflow-hidden">
                    <p className="text-slate-600 text-[10px] font-black tracking-widest uppercase mb-1">Direct Invitation Link</p>
                    <p className="text-white text-sm font-mono truncate max-w-[300px]">{referralLink}</p>
                  </div>
                  <button 
                    onClick={() => copyToClipboard(referralLink, "Link")}
                    className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* SECTION 2: SOCIAL SHARING */}
              <div className="pt-4 space-y-4">
                <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase text-center">Share via Global Channels</p>
                <div className="flex items-center justify-center gap-4">
                  <button onClick={() => shareSocial('twitter')} className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all shadow-lg hover:shadow-cyan-500/10">
                    <Twitter className="w-6 h-6" />
                  </button>
                  <button onClick={() => shareSocial('telegram')} className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-[#229ED9] hover:text-white transition-all shadow-lg hover:shadow-cyan-500/10">
                    <Send className="w-6 h-6" />
                  </button>
                  <button onClick={() => shareSocial('whatsapp')} className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white transition-all shadow-lg hover:shadow-cyan-500/10">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                  <button onClick={() => shareSocial('facebook')} className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all shadow-lg hover:shadow-cyan-500/10">
                    <Globe className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: TIER STATS */}
          <section className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[40px] border border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                <Network className="w-5 h-5 text-indigo-400" />
                Network Architecture
              </h3>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-3xl border border-slate-700/30 text-center">
                <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Tier 1</p>
                <p className="text-white text-2xl font-black italic">{referralData?.tree?.tier1 || 0}</p>
                <p className="text-cyan-400 text-[8px] font-black uppercase mt-1">Direct</p>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-3xl border border-slate-700/30 text-center">
                <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Tier 2</p>
                <p className="text-white text-2xl font-black italic">{referralData?.tree?.tier2 || 0}</p>
                <p className="text-indigo-400 text-[8px] font-black uppercase mt-1">Indirect</p>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-3xl border border-slate-700/30 text-center">
                <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Tier 3</p>
                <p className="text-white text-2xl font-black italic">{referralData?.tree?.tier3 || 0}</p>
                <p className="text-blue-400 text-[8px] font-black uppercase mt-1">Passive</p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: HIERARCHY VISUALIZATION */}
        <div className="lg:col-span-5 space-y-8">
          
          <section className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[40px] border border-slate-800/50 h-full flex flex-col">
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase mb-8 flex items-center gap-3">
              <Zap className="w-5 h-5 text-amber-400" />
              Growth Roadmap
            </h3>

            <div className="flex-1 space-y-10 relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gradient-to-b from-cyan-500/50 via-indigo-500/50 to-transparent" />
              
              <div className="relative flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 z-10 shrink-0 shadow-lg shadow-cyan-500/10 group-hover:scale-110 transition-transform">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h4 className="text-white font-black italic text-sm uppercase tracking-tight">Step 1: Invite Friends</h4>
                  <p className="text-slate-500 text-xs font-medium mt-1">Share your unique link via social media or direct message to build Tier 1.</p>
                </div>
              </div>

              <div className="relative flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 z-10 shrink-0 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h4 className="text-white font-black italic text-sm uppercase tracking-tight">Step 2: Activation</h4>
                  <p className="text-slate-500 text-xs font-medium mt-1">Your referral stakes $20+ in any AI project. They become an "Active Member".</p>
                </div>
              </div>

              <div className="relative flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 z-10 shrink-0 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="pt-1">
                  <h4 className="text-white font-black italic text-sm uppercase tracking-tight">Step 3: Earn Bonuses</h4>
                  <p className="text-slate-500 text-xs font-medium mt-1">Receive instant commissions on their stakes and daily harvesting activities.</p>
                </div>
              </div>

              <div className="mt-10 p-6 bg-slate-950/50 rounded-[32px] border border-slate-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-cyan-400" />
                  <p className="text-white text-xs font-black uppercase tracking-widest italic">Tier Commission Rates</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 italic">Tier 1 (Direct)</span>
                    <span className="text-cyan-400">10% Bonus</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 italic">Tier 2 (Level 2)</span>
                    <span className="text-indigo-400">5% Bonus</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500 italic">Tier 3 (Level 3)</span>
                    <span className="text-blue-400">2% Bonus</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
