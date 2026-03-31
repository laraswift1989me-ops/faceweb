import { ArrowLeft, ShieldCheck, HelpCircle, FileText, Scale, Cookie, Terminal, Users, Info } from "lucide-react";
import { Link } from "react-router";

function MarketingLayout({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-slate-950 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-cyan-400 font-black italic uppercase tracking-widest hover:underline mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK TO HOME
        </Link>
        <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter uppercase mb-16">{title}</h1>
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[48px] p-8 lg:p-16 text-slate-400 font-medium leading-relaxed space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export const About = () => (
  <MarketingLayout title="Alpha Core Architecture">
    <p>SwiftEarn is at the forefront of the decentralized finance (DeFi) revolution, providing high-performance yield generation tools powered by proprietary AI algorithms. Our mission is to bridge the gap between institutional quantitative trading and everyday retail investors.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
      <div className="p-8 bg-slate-800/20 rounded-3xl border border-slate-700/30">
        <h3 className="text-white font-black italic uppercase tracking-tight mb-3">Visionary Yields</h3>
        <p className="text-sm">We believe in a future where financial freedom is automated and accessible via secure blockchain protocols.</p>
      </div>
      <div className="p-8 bg-slate-800/20 rounded-3xl border border-slate-700/30">
        <h3 className="text-white font-black italic uppercase tracking-tight mb-3">Secure Operations</h3>
        <p className="text-sm">Our infrastructure is built on the TRON network, ensuring millisecond transaction finality and minimal gas fees.</p>
      </div>
    </div>
  </MarketingLayout>
);

export const FAQ = () => (
  <MarketingLayout title="System Intelligence FAQ">
    <div className="space-y-10">
      <div className="space-y-4">
        <h3 className="text-white font-black italic uppercase tracking-tight text-xl">What is the minimum stake?</h3>
        <p>The minimum stake amount is $20.00 USDT. This ensures that the AI can effectively distribute liquidity across multiple arbitrage paths.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-white font-black italic uppercase tracking-tight text-xl">How often can I harvest?</h3>
        <p>Harvesting is available once every 24 hours. The cycle resets at 00:00 UTC daily across all active projects.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-white font-black italic uppercase tracking-tight text-xl">Is my capital protected?</h3>
        <p>We maintain a "Volatility Buffer Pool" which covers potential slippage during extreme market conditions, ensuring a stable daily ROI for all participants.</p>
      </div>
    </div>
  </MarketingLayout>
);

export const Security = () => (
  <MarketingLayout title="Fortress Security">
    <div className="space-y-8">
      <div className="flex gap-6">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shrink-0"><ShieldCheck className="w-8 h-8" /></div>
        <div>
          <h3 className="text-white font-black italic uppercase text-xl mb-2">Multi-Sig Custody</h3>
          <p>All core protocol funds are stored in hardware-secured multi-signature cold wallets, requiring 5-of-7 validation for large movements.</p>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/30 shrink-0"><Lock className="w-8 h-8" /></div>
        <div>
          <h3 className="text-white font-black italic uppercase text-xl mb-2">AES-256 Encryption</h3>
          <p>User data and API keys are encrypted at rest and in transit using military-grade encryption standards.</p>
        </div>
      </div>
    </div>
  </MarketingLayout>
);

export const Legal = () => (
  <MarketingLayout title="Legal Framework">
    <p>SwiftEarn DeFi Protocol operates as an autonomous decentralized organization (DAO). By interacting with the protocol, users acknowledge the inherent risks associated with blockchain technology and digital assets.</p>
    <div className="space-y-6 mt-10 p-8 bg-slate-800/10 rounded-3xl border border-slate-800 border-dashed">
      <h3 className="text-white font-black italic uppercase tracking-tight">Governance & Compliance</h3>
      <p className="text-sm italic">"The protocol is governed by its community and does not operate under traditional centralized banking jurisdictions. All yield activities are executed via immutable smart contracts."</p>
    </div>
  </MarketingLayout>
);

export const Terms = () => (
  <MarketingLayout title="Terms of Engagement">
    <div className="space-y-8">
      <section>
        <h3 className="text-white font-black italic uppercase tracking-tight mb-3">1. Eligibility</h3>
        <p>Users must be of legal age in their respective jurisdictions to participate in DeFi activities and utilize the SwiftEarn AI engine.</p>
      </section>
      <section>
        <h3 className="text-white font-black italic uppercase tracking-tight mb-3">2. Service Scope</h3>
        <p>SwiftEarn provides software-as-a-service (SaaS) for quantitative trading automation. We do not provide financial advice.</p>
      </section>
    </div>
  </MarketingLayout>
);

export const Privacy = () => (
  <MarketingLayout title="Data Sovereignty">
    <p>We respect your privacy. As a Web3-first platform, we collect minimal PII (Personally Identifiable Information). Our focus is on wallet-based authentication and secure transactional data.</p>
  </MarketingLayout>
);

export const RiskDisclaimer = () => (
  <MarketingLayout title="Risk Intelligence">
    <div className="p-8 bg-rose-500/10 rounded-3xl border border-rose-500/20">
      <h3 className="text-rose-400 font-black italic uppercase tracking-tight mb-4 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5" /> CAPITAL RISK WARNING
      </h3>
      <p className="text-rose-400/80 text-sm leading-relaxed">Cryptocurrency investments are subject to high market volatility. Staking involves a lock-up period of 90 days. Never invest more than you can afford to lose. Past performance of AI models is not indicative of future results.</p>
    </div>
  </MarketingLayout>
);

export const CookiePolicy = () => (
  <MarketingLayout title="Protocol Cookies">
    <p>Our platform uses essential session cookies to maintain your secure login and performance monitoring. We do not use tracking cookies for third-party advertising.</p>
  </MarketingLayout>
);

export const APIDocs = () => (
  <MarketingLayout title="Developer API Hub">
    <p>Build on top of the SwiftEarn engine. Our REST API allows for programmatic staking, balance tracking, and referral network monitoring.</p>
    <div className="mt-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto">
      <p className="text-cyan-400">GET /api/finance/stats</p>
      <p className="text-slate-600 mt-2">// Response 200 OK</p>
      <p className="text-white">{"{ \"total_earned\": \"1250.00\" }"}</p>
    </div>
  </MarketingLayout>
);

export const Careers = () => (
  <MarketingLayout title="Join the Alpha Team">
    <p>We are always looking for quantitative researchers, blockchain engineers, and DeFi enthusiasts to help scale our protocol.</p>
  </MarketingLayout>
);

export const Community = () => (
  <MarketingLayout title="The Global DAO">
    <p>Join over 125,000 members across Twitter, Telegram, and Discord. Participate in governance votes and earn community bonuses.</p>
  </MarketingLayout>
);

export const HelpCenter = () => (
  <MarketingLayout title="Support Nexus">
    <p>Our 24/7 support team is available via the community channels and official support email. For critical account issues, please use the ticket system in your profile.</p>
  </MarketingLayout>
);
