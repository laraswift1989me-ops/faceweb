import React, { useState } from "react";
import {
  ArrowLeft, ShieldCheck, Lock, AlertTriangle, Cookie,
  Terminal, Users, Mail, Phone, MapPin, Send,
  CheckCircle2, Shield, Eye, FileText, Globe, Clock,
  TrendingUp, Zap, Award, Briefcase, MessageSquare,
  ChevronDown, ChevronUp, ExternalLink, Scale
} from "lucide-react";
import { Link } from "react-router";

// ─────────────────────────────────────────────
// Shared Layout
// ─────────────────────────────────────────────
function MarketingLayout({ title, subtitle, children }: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-32 pb-24 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-black italic uppercase tracking-widest hover:underline mb-12 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          BACK TO HOME
        </Link>
        <div className="mb-16">
          <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-2xl">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/50 rounded-[40px] p-8 lg:p-12 space-y-6 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
      {title && (
        <h2 className="text-2xl font-black text-slate-900 dark:text-white italic uppercase tracking-tighter mb-6">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// About Us
// ─────────────────────────────────────────────
export const About = () => (
  <MarketingLayout
    title="About SwiftEarn"
    subtitle="We are building the future of accessible, AI-powered DeFi yield generation — headquartered in the United States."
  >
    <div className="space-y-8">
      <Section>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Our Mission</h3>
        <p>
          SwiftEarn Technologies, Inc. was incorporated in the State of Delaware, USA in 2024 with a single
          mission: to democratize institutional-grade quantitative trading for everyday investors. Our founders
          — a team of Wall Street quants, blockchain engineers, and cybersecurity specialists — spent over two
          years designing the AI Arbitrage Engine that powers the SwiftEarn protocol today.
        </p>
        <p>
          We operate under the regulatory framework of the United States of America and are committed to full
          KYC/AML compliance, transparent on-chain reporting, and the highest standards of financial security.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: TrendingUp, title: "Founded 2024", desc: "Incorporated in Delaware, USA with a world-class engineering team.", cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20", iconClass: "text-cyan-500 dark:text-cyan-400" },
            { icon: Users, title: "125K+ Members", desc: "Active arbitrageurs across 40+ countries generating daily yield.", cardClass: "bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20", iconClass: "text-emerald-500 dark:text-emerald-400" },
            { icon: Shield, title: "Audited Protocol", desc: "Smart contracts independently audited by leading blockchain security firms.", cardClass: "bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20", iconClass: "text-indigo-500 dark:text-indigo-400" },
          ].map(({ icon: Icon, title, desc, cardClass, iconClass }, i) => (
            <div key={i} className={`p-6 rounded-3xl ${cardClass}`}>
              <Icon className={`w-8 h-8 mb-4 ${iconClass}`} />
              <h4 className="text-slate-900 dark:text-white font-black mb-2">{title}</h4>
              <p className="text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Core Values">
        <div className="space-y-6">
          {[
            { title: "Security First", desc: "Every architectural decision prioritizes the safety of user funds above growth metrics. We employ multi-signature cold storage, AES-256 encryption at rest and in transit, and real-time anomaly detection across all protocol layers." },
            { title: "Radical Transparency", desc: "All yield-generating activities are executed via on-chain smart contracts, publicly verifiable on the TRON blockchain. We publish quarterly protocol audits and maintain a public security dashboard." },
            { title: "User Sovereignty", desc: "You always maintain ultimate control over your digital assets. SwiftEarn is non-custodial at the protocol layer — we never hold your private keys." },
            { title: "Regulatory Integrity", desc: "We proactively engage with U.S. regulatory bodies and maintain a dedicated compliance team to ensure adherence to FinCEN, BSA, and applicable state money-services laws." },
          ].map((v, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              </div>
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-1">{v.title}</h4>
                <p className="text-sm">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Leadership & Team">
        <p>
          Our leadership team brings over 60 combined years of experience spanning Goldman Sachs, Coinbase,
          Chainalysis, and DARPA-funded cybersecurity programs. We are proud to be a fully remote-first
          organization with team members across the United States, United Kingdom, Singapore, and Canada.
        </p>
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {[
            { name: "James K. Whitfield", role: "Chief Executive Officer", bg: "Former VP of Quantitative Strategies, Morgan Stanley" },
            { name: "Priya Nair", role: "Chief Technology Officer", bg: "Blockchain Protocol Engineer, ex-Coinbase" },
            { name: "Dr. Marcus Chen", role: "Head of AI Research", bg: "PhD Computer Science, MIT — Quantitative Finance" },
            { name: "Elena Vasquez", role: "Chief Compliance Officer", bg: "Former FinCEN Examiner, 15 years regulatory experience" },
          ].map((p, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/30">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 flex items-center justify-center text-white font-black text-lg">
                {p.name[0]}
              </div>
              <h4 className="text-slate-900 dark:text-white font-bold">{p.name}</h4>
              <p className="text-cyan-500 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">{p.role}</p>
              <p className="text-xs text-slate-500">{p.bg}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="p-8 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 dark:from-cyan-500/10 dark:to-blue-600/10 border border-cyan-200 dark:border-cyan-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-slate-900 dark:text-white font-black text-xl mb-1">Ready to join the ecosystem?</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Start earning institutional-grade yields today.</p>
        </div>
        <Link
          to="/register"
          className="px-8 py-4 bg-white text-slate-950 font-black italic uppercase tracking-tight rounded-2xl hover:bg-cyan-400 transition-all whitespace-nowrap"
        >
          CREATE ACCOUNT
        </Link>
      </div>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-slate-200 dark:border-slate-800/60 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
        <h3 className="text-slate-900 dark:text-white font-bold text-base pr-4">{q}</h3>
        {open ? (
          <ChevronUp className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
        )}
      </div>
      {open && (
        <div className="px-6 pb-6 text-slate-500 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-200 dark:border-slate-800/60 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export const FAQ = () => (
  <MarketingLayout
    title="FAQ"
    subtitle="Frequently asked questions about SwiftEarn's platform, security, and earning mechanics."
  >
    <div className="space-y-8">
      <Section title="Getting Started">
        <div className="space-y-3">
          {[
            { q: "What is SwiftEarn?", a: "SwiftEarn is a U.S.-registered DeFi yield platform (SwiftEarn Technologies, Inc., Wilmington, Delaware) that uses proprietary AI arbitrage algorithms to generate daily passive income for users who stake TRC20 USDT. Think of it as a quantitative hedge fund accessible to everyone." },
            { q: "What is the minimum deposit?", a: "The minimum deposit is $20.00 USDT via the TRC20 network. This threshold ensures effective liquidity distribution across our arbitrage engines." },
            { q: "Do I need a referral code to register?", a: "Yes. SwiftEarn uses a Referral-Gated onboarding system to ensure a high-quality community. Ask an existing member for their referral code or reach out to our support team." },
            { q: "Is KYC mandatory?", a: "Yes. KYC verification is required to activate your referral tree and access withdrawal functions. This is a compliance requirement under U.S. anti-money-laundering (AML) law." },
          ].map((item, i) => <FAQItem key={i} {...item} />)}
        </div>
      </Section>

      <Section title="Earnings & Staking">
        <div className="space-y-3">
          {[
            { q: "How much can I earn daily?", a: "Daily ROI ranges from 1% to 5% depending on the active project pool and your staking tier. Our AI engine dynamically allocates capital to the highest-performing arbitrage paths, and returns are credited to your Locked Balance every 24 hours." },
            { q: "How does the Daily Harvest work?", a: "Each day before 00:00 UTC you must click the 'Harvest' button in your dashboard to claim that day's profits. Unclaimed daily profits are marked as 'wasted' by the system — they do not roll over. This incentivizes active engagement." },
            { q: "What is the 90-Day Lock Period?", a: "Staked capital and daily harvested profits are held in a Locked Balance for 90 days. This liquidity lock enables the AI to commit funds to longer arbitrage cycles, generating higher yields. After 90 days, funds automatically move to your Freezed Balance." },
            { q: "What is the Freezed Balance?", a: "The Freezed Balance holds matured funds (post-90-day lock). Once you reach Level 50, you can submit an Unfreeze Request to release these funds to your Available Balance for withdrawal." },
            { q: "What is the 3-Tier Referral System?", a: "When someone you referred becomes 'Active' (completes KYC + deposits $25+), you earn $10 credited directly to your Available Balance. Tier 2 (your referral's referral) earns you $2 locked for 90 days. Tier 3 earns $1 locked for 90 days." },
          ].map((item, i) => <FAQItem key={i} {...item} />)}
        </div>
      </Section>

      <Section title="Withdrawals & Fees">
        <div className="space-y-3">
          {[
            { q: "What is the minimum withdrawal amount?", a: "The minimum withdrawal is $35.00 USDT. Withdrawals up to $150 are auto-processed. Larger withdrawals are reviewed by our compliance team within 24–96 hours." },
            { q: "Are there withdrawal fees?", a: "SwiftEarn charges a flat network fee of $1–$2 USDT to cover TRON blockchain gas costs. No additional platform fees are applied." },
            { q: "How do I unfreeze my matured funds?", a: "Once you reach Level 50 on the platform, the 'Unfreeze Request' button becomes active in your Wallet section. Submit a request and our compliance team will process it within 24 hours." },
          ].map((item, i) => <FAQItem key={i} {...item} />)}
        </div>
      </Section>

      <Section title="Security & Compliance">
        <div className="space-y-3">
          {[
            { q: "Is SwiftEarn regulated?", a: "SwiftEarn Technologies, Inc. is registered in the State of Delaware, USA. We comply with U.S. FinCEN guidelines for Money Services Businesses, enforce AML/KYC procedures, and maintain data privacy standards consistent with CCPA and GDPR." },
            { q: "Is my capital safe?", a: "No investment is without risk. However, SwiftEarn maintains a Volatility Buffer Pool to mitigate slippage risk. All user deposits are held in multi-signature cold wallets requiring 5-of-7 key validation for large movements. Smart contracts are audited annually." },
            { q: "What happens if I lose access to my account?", a: "Contact support@swiftearn.us with your registered email and KYC-verified identity. Our security team will initiate an identity verification process to restore access. We cannot restore accounts to unverified identities." },
          ].map((item, i) => <FAQItem key={i} {...item} />)}
        </div>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Security
// ─────────────────────────────────────────────
export const Security = () => (
  <MarketingLayout
    title="Security"
    subtitle="Institutional-grade infrastructure protecting every layer of your digital assets."
  >
    <div className="space-y-8">
      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Shield, title: "Multi-Sig Cold Wallets", desc: "All protocol treasury funds are secured in hardware-based multi-signature wallets requiring a 5-of-7 key consensus for any large movement. Keys are geographically distributed across secure U.S. data centers.", cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20", iconClass: "text-cyan-500 dark:text-cyan-400" },
            { icon: Lock, title: "AES-256 Encryption", desc: "User data, private keys (encrypted at rest), and API credentials are protected with military-grade AES-256-GCM encryption. All data in transit uses TLS 1.3 with certificate pinning.", cardClass: "bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20", iconClass: "text-indigo-500 dark:text-indigo-400" },
            { icon: Eye, title: "Real-Time Anomaly Detection", desc: "Our AI-powered security layer monitors for anomalous withdrawal patterns, login behavior, and transaction volumes 24/7. Suspicious activity triggers immediate account holds and security alerts.", cardClass: "bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20", iconClass: "text-emerald-500 dark:text-emerald-400" },
            { icon: FileText, title: "Independent Smart Contract Audits", desc: "All SwiftEarn smart contracts on the TRON network undergo annual independent audits by leading blockchain security firms. Audit reports are publicly available in our GitHub repository.", cardClass: "bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20", iconClass: "text-purple-500 dark:text-purple-400" },
            { icon: Globe, title: "DDoS & Infrastructure Protection", desc: "Our platform infrastructure is protected by enterprise-grade DDoS mitigation, deployed across multiple availability zones with automated failover to ensure 99.99% uptime.", cardClass: "bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-200 dark:border-yellow-500/20", iconClass: "text-yellow-500 dark:text-yellow-400" },
            { icon: Award, title: "Bug Bounty Program", desc: "We operate an active Bug Bounty Program offering rewards up to $50,000 USD for critical vulnerability disclosures. Responsible security researchers can submit findings via security@swiftearn.us.", cardClass: "bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20", iconClass: "text-rose-500 dark:text-rose-400" },
          ].map(({ icon: Icon, title, desc, cardClass, iconClass }, i) => (
            <div key={i} className={`p-8 rounded-3xl ${cardClass}`}>
              <Icon className={`w-10 h-10 mb-4 ${iconClass}`} />
              <h3 className="text-slate-900 dark:text-white font-black text-lg mb-3">{title}</h3>
              <p className="text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Compliance & Certifications">
        <div className="space-y-4">
          {[
            { badge: "KYC/AML", desc: "Full KYC/AML compliance enforced for all users before financial activity. Identity verification powered by a certified third-party provider." },
            { badge: "FinCEN", desc: "SwiftEarn operates consistent with U.S. FinCEN guidance for virtual currency businesses and Money Services Businesses (MSBs)." },
            { badge: "CCPA", desc: "California Consumer Privacy Act (CCPA) compliant. U.S. residents have the right to access, delete, and opt out of the sale of their personal data." },
            { badge: "ISO 27001", desc: "Our information security management processes align with ISO/IEC 27001 standards. Formal certification audit in progress for Q3 2026." },
            { badge: "Pen Tests", desc: "Quarterly penetration testing by an independent security firm. All critical and high findings are remediated within 30 days." },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/10">
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">{item.badge}</span>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="p-8 bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 rounded-3xl">
        <h3 className="text-rose-600 dark:text-rose-400 font-black uppercase tracking-tight mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Security Notice
        </h3>
        <p className="text-rose-600/80 dark:text-rose-400/80 text-sm leading-relaxed">
          SwiftEarn will <strong>never</strong> ask for your password, private keys, or seed phrases via email, Telegram, or social media.
          If you receive any such request, it is a phishing attempt. Report immediately to security@swiftearn.us.
        </p>
      </div>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Legal / Compliance
// ─────────────────────────────────────────────
export const Legal = () => (
  <MarketingLayout
    title="Legal & Compliance"
    subtitle="SwiftEarn Technologies, Inc. — registered and operating under United States federal and state law."
  >
    <div className="space-y-8">
      <Section title="Company Registration">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-3">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Legal Name</span>
              <span className="text-slate-900 dark:text-white font-bold">SwiftEarn Technologies, Inc.</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-3">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Incorporation State</span>
              <span className="text-slate-900 dark:text-white font-bold">Delaware, USA</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-3">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Entity Type</span>
              <span className="text-slate-900 dark:text-white font-bold">C Corporation</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800/60 pb-3">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Year Established</span>
              <span className="text-slate-900 dark:text-white font-bold">2024</span>
            </div>
            <div className="flex justify-between pb-3">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">Registered Agent</span>
              <span className="text-slate-900 dark:text-white font-bold">The Corporation Trust Company</span>
            </div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/30 space-y-3 text-sm">
            <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-4">Principal Office Address</h4>
            <div className="flex items-start gap-3 text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-cyan-500 dark:text-cyan-400 mt-0.5 shrink-0" />
              <address className="not-italic leading-relaxed">
                SwiftEarn Technologies, Inc.<br />
                651 N Broad Street, Suite 206<br />
                Middletown, Delaware 19709<br />
                United States of America
              </address>
            </div>
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 pt-2">
              <Mail className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0" />
              <a href="mailto:legal@swiftearn.us" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors">legal@swiftearn.us</a>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Regulatory Framework">
        <p>
          SwiftEarn Technologies, Inc. operates in accordance with applicable U.S. federal law, including the Bank Secrecy
          Act (BSA), the USA PATRIOT Act, and FinCEN guidance for virtual currency businesses. We enforce Know Your Customer
          (KYC) and Anti-Money Laundering (AML) procedures for all users engaging in financial activity on the platform.
        </p>
        <p>
          Our platform does not constitute a registered investment adviser, broker-dealer, or securities exchange under
          the Securities Exchange Act of 1934. Participation in SwiftEarn's yield programs does not constitute an
          investment contract or securities offering. Users participate at their own discretion and risk.
        </p>
        <p>
          Users located in jurisdictions where participation in DeFi activities is prohibited — including but not limited
          to OFAC-sanctioned countries — are strictly prohibited from using this platform.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          All content, software, algorithms, trademarks, and intellectual property displayed on this platform are the
          exclusive property of SwiftEarn Technologies, Inc., protected under U.S. copyright law (Title 17, U.S. Code),
          trademark law, and applicable international intellectual property treaties.
        </p>
        <p>
          The "SwiftEarn" name and logo are registered trademarks of SwiftEarn Technologies, Inc. Unauthorized use,
          reproduction, or distribution of our intellectual property is strictly prohibited and will be pursued under law.
        </p>
      </Section>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { path: "/terms", icon: FileText, label: "Terms of Service", desc: "Full user agreement and platform rules.", cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 hover:border-cyan-400 dark:hover:border-cyan-500/40", iconClass: "text-cyan-500 dark:text-cyan-400" },
          { path: "/privacy", icon: Eye, label: "Privacy Policy", desc: "How we collect, use, and protect your data.", cardClass: "bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20 hover:border-indigo-400 dark:hover:border-indigo-500/40", iconClass: "text-indigo-500 dark:text-indigo-400" },
          { path: "/risk-disclaimer", icon: AlertTriangle, label: "Risk Disclaimer", desc: "Important disclosures about investment risks.", cardClass: "bg-rose-50 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 hover:border-rose-400 dark:hover:border-rose-500/40", iconClass: "text-rose-500 dark:text-rose-400" },
        ].map(({ path, icon: Icon, label, desc, cardClass, iconClass }, i) => (
          <Link key={i} to={path} className={`p-6 rounded-3xl transition-colors group ${cardClass}`}>
            <Icon className={`w-8 h-8 mb-4 ${iconClass}`} />
            <h4 className="text-slate-900 dark:text-white font-black mb-1 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">{label}</h4>
            <p className="text-sm text-slate-500">{desc}</p>
            <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-600 mt-4 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Terms of Service
// ─────────────────────────────────────────────
export const Terms = () => (
  <MarketingLayout title="Terms of Service" subtitle="Last updated: March 31, 2026 — Governed by the laws of the State of Delaware, USA.">
    <div className="space-y-6">
      <Section>
        <p className="text-sm leading-relaxed">
          These Terms of Service ("Terms") constitute a legally binding agreement between you ("User") and SwiftEarn
          Technologies, Inc. ("SwiftEarn," "we," "us," or "our"), a Delaware C Corporation. By accessing or using the
          SwiftEarn platform at swiftearn.us ("Platform"), you acknowledge that you have read, understood, and agree
          to be bound by these Terms and our Privacy Policy.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">1. Eligibility</h3>
        <p className="text-sm">
          You must be at least 18 years of age and have the legal capacity to enter into a binding agreement in your
          jurisdiction. By using the Platform, you represent and warrant that you are not a resident of, or located in,
          any jurisdiction subject to U.S. Office of Foreign Assets Control (OFAC) sanctions, including but not limited
          to Cuba, Iran, North Korea, Syria, and the Crimea region. Residents of jurisdictions where DeFi participation
          is prohibited by local law are not permitted to use this Platform.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">2. Account Registration & KYC</h3>
        <p className="text-sm">
          Registration requires a valid email address and a referral code from an existing member. To activate financial
          functions (withdrawals, referral bonuses), you must complete our KYC (Know Your Customer) verification process.
          You are responsible for maintaining the confidentiality of your login credentials and are fully liable for all
          activity conducted under your account. Providing false or misleading information during KYC is grounds for
          immediate account termination and may be reported to applicable law enforcement authorities.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">3. Platform Services</h3>
        <p className="text-sm">
          SwiftEarn provides a software platform enabling users to participate in automated DeFi yield strategies powered
          by an AI arbitrage engine. We are a Software-as-a-Service (SaaS) provider, not a registered investment adviser,
          broker-dealer, bank, or financial institution. Nothing on this Platform constitutes investment advice, financial
          advice, trading advice, or any other advice. Past performance of any strategy is not indicative of future results.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">4. Financial Terms</h3>
        <p className="text-sm">
          All deposits and withdrawals are denominated in USDT (TRC20 network). Minimum deposit: $20.00 USDT. Minimum
          withdrawal: $35.00 USDT. Staked capital and daily profits are subject to a 90-day liquidity lock period from
          the date of staking or harvest. Unharvested daily profits that are not claimed before 00:00 UTC are marked as
          "wasted" and are not carried forward. SwiftEarn reserves the right to adjust platform fee structures with 30
          days' notice to registered users.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">5. Prohibited Activities</h3>
        <p className="text-sm">
          You agree not to: (a) use the Platform for money laundering, terrorist financing, or any illegal purpose;
          (b) attempt to gain unauthorized access to any system or network; (c) create multiple accounts to circumvent
          referral or bonus restrictions; (d) engage in market manipulation, wash trading, or fraudulent activity;
          (e) reverse-engineer, decompile, or extract any portion of the SwiftEarn AI engine or proprietary software.
          Violation of these prohibitions may result in immediate account termination, asset freezing, and referral
          to relevant law enforcement agencies.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">6. Limitation of Liability</h3>
        <p className="text-sm">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SWIFTEARN TECHNOLOGIES, INC. AND ITS OFFICERS, DIRECTORS,
          EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF YOUR USE OF OR
          INABILITY TO USE THE PLATFORM. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT OF FEES PAID BY YOU TO SWIFTEARN
          IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">7. Dispute Resolution & Governing Law</h3>
        <p className="text-sm">
          These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United
          States of America, without regard to its conflict of law principles. Any dispute arising out of or relating
          to these Terms shall be resolved by binding arbitration under the American Arbitration Association (AAA)
          Commercial Arbitration Rules, conducted in Wilmington, Delaware. You waive any right to participate in a
          class-action lawsuit or class-wide arbitration.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">8. Modifications to Terms</h3>
        <p className="text-sm">
          SwiftEarn reserves the right to modify these Terms at any time. Material changes will be communicated via
          email to your registered address and posted on the Platform with at least 14 days' notice before taking effect.
          Continued use of the Platform after the effective date constitutes acceptance of the revised Terms.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">9. Contact</h3>
        <p className="text-sm">
          For legal inquiries: <a href="mailto:legal@swiftearn.us" className="text-cyan-500 dark:text-cyan-400 hover:underline">legal@swiftearn.us</a><br />
          SwiftEarn Technologies, Inc., 651 N Broad Street, Suite 206, Middletown, Delaware 19709, USA.
        </p>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Privacy Policy
// ─────────────────────────────────────────────
export const Privacy = () => (
  <MarketingLayout title="Privacy Policy" subtitle="Last updated: March 31, 2026 — SwiftEarn Technologies, Inc. is committed to protecting your privacy in accordance with U.S. federal and state law.">
    <div className="space-y-6">
      <Section>
        <p className="text-sm">
          This Privacy Policy describes how SwiftEarn Technologies, Inc. ("SwiftEarn," "we," "us") collects, uses,
          and protects your personal information when you access or use the SwiftEarn Platform at swiftearn.us.
          This policy is compliant with the California Consumer Privacy Act (CCPA) and incorporates principles of
          the General Data Protection Regulation (GDPR) where applicable.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">1. Information We Collect</h3>
        <div className="space-y-3 text-sm">
          <p><strong className="text-slate-900 dark:text-white">Account Information:</strong> Email address, full name, date of birth, and country of residence collected during registration.</p>
          <p><strong className="text-slate-900 dark:text-white">KYC Documentation:</strong> Government-issued photo ID and a live selfie/video, processed by a GDPR-compliant third-party KYC provider. We do not store raw ID documents on our servers.</p>
          <p><strong className="text-slate-900 dark:text-white">Wallet Data:</strong> Your TRC20 USDT wallet address for deposit crediting and withdrawal processing. We do not collect or store private keys.</p>
          <p><strong className="text-slate-900 dark:text-white">Transaction Data:</strong> Records of deposits, withdrawals, staking events, harvest history, and referral commissions.</p>
          <p><strong className="text-slate-900 dark:text-white">Technical Data:</strong> IP address, browser type, device identifiers, and session data for security and fraud prevention purposes.</p>
        </div>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">2. How We Use Your Information</h3>
        <div className="space-y-2 text-sm">
          {[
            "To provide, maintain, and improve the SwiftEarn platform and services.",
            "To verify your identity and comply with KYC/AML obligations under U.S. law.",
            "To process financial transactions and prevent fraud.",
            "To send transactional emails (deposit confirmations, withdrawal updates, security alerts).",
            "To comply with legal obligations, court orders, or regulatory requests from U.S. authorities.",
            "To monitor platform security and detect anomalous activity.",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">3. Data Sharing & Third Parties</h3>
        <p className="text-sm">
          We do not sell, rent, or trade your personal information to third parties for marketing purposes.
          We may share your data with: (a) KYC verification providers under strict data processing agreements;
          (b) payment infrastructure providers for blockchain transaction processing; (c) law enforcement or
          regulatory bodies when required by law; (d) professional advisers (lawyers, auditors) under
          confidentiality obligations.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">4. Your Rights (CCPA / GDPR)</h3>
        <p className="text-sm">
          Depending on your jurisdiction, you may have the right to: (a) access a copy of the personal data
          we hold about you; (b) request correction of inaccurate data; (c) request deletion of your personal
          data (subject to legal retention requirements); (d) opt out of the sale of personal information
          (we do not sell data); (e) data portability. To exercise any of these rights, contact
          <a href="mailto:privacy@swiftearn.us" className="text-cyan-500 dark:text-cyan-400 hover:underline ml-1">privacy@swiftearn.us</a>.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">5. Data Retention</h3>
        <p className="text-sm">
          We retain account data for the duration of your account and for a minimum of 5 years following
          account closure, in accordance with U.S. financial recordkeeping requirements (Bank Secrecy Act).
          KYC documentation is retained for 5 years from the date of collection per FinCEN rules.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">6. Security</h3>
        <p className="text-sm">
          All personal data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access is restricted
          to authorized personnel only on a need-to-know basis. We conduct annual security audits and
          penetration tests. In the event of a data breach, we will notify affected users and relevant
          authorities in accordance with applicable law within 72 hours of discovery.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">7. Contact</h3>
        <p className="text-sm">
          Privacy inquiries: <a href="mailto:privacy@swiftearn.us" className="text-cyan-500 dark:text-cyan-400 hover:underline">privacy@swiftearn.us</a><br />
          SwiftEarn Technologies, Inc., 651 N Broad Street, Suite 206, Middletown, Delaware 19709, USA.
        </p>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Risk Disclaimer
// ─────────────────────────────────────────────
export const RiskDisclaimer = () => (
  <MarketingLayout title="Risk Disclaimer" subtitle="Please read this disclosure carefully before using the SwiftEarn Platform.">
    <div className="space-y-6">
      <div className="p-8 bg-rose-50 dark:bg-rose-500/10 rounded-[32px] border border-rose-200 dark:border-rose-500/30">
        <h3 className="text-rose-600 dark:text-rose-400 font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-xl">
          <AlertTriangle className="w-6 h-6" /> IMPORTANT RISK WARNING
        </h3>
        <p className="text-rose-700 dark:text-rose-300/80 text-sm leading-relaxed">
          Cryptocurrency investments, DeFi protocols, and digital asset staking involve substantial risk of loss.
          You should only invest funds you can afford to lose entirely. Past performance is not indicative of
          future results. SwiftEarn Technologies, Inc. does not guarantee any specific return on investment.
        </p>
      </div>

      <Section>
        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">Market Risk</h3>
        <p className="text-sm">
          The value of USDT and other digital assets is subject to high market volatility. Exchange rate movements,
          liquidity events, and systemic DeFi protocol failures can impact returns. While USDT is designed as a
          stablecoin, it is not guaranteed by the U.S. government or any federal insurance scheme (such as FDIC).
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">Technology Risk</h3>
        <p className="text-sm">
          Smart contract code, despite undergoing audits, may contain undiscovered vulnerabilities. The TRON
          blockchain and SwiftEarn's protocol infrastructure may experience outages, bugs, or unforeseen interactions
          that could temporarily or permanently affect funds. No system is completely immune to technical failure.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">Liquidity Risk</h3>
        <p className="text-sm">
          Staked capital is subject to a 90-day lock period and is not accessible during this time. Users should
          not stake funds they may require access to within this window. Unfreeze requests are subject to
          Level 50 eligibility and compliance review and are not guaranteed to be processed immediately.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">Regulatory Risk</h3>
        <p className="text-sm">
          The legal and regulatory landscape for DeFi and digital assets is rapidly evolving. Changes in U.S.
          federal or state law, or international regulations, could affect the availability of SwiftEarn's services
          in certain jurisdictions or impose new compliance obligations that affect platform operations.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">No Financial Advice</h3>
        <p className="text-sm">
          Nothing on this Platform, in our communications, or in any community channel constitutes financial advice,
          investment advice, or a recommendation to buy, sell, or hold any digital asset. Always consult a licensed
          financial professional before making investment decisions. SwiftEarn Technologies, Inc. is not a registered
          investment adviser under the Investment Advisers Act of 1940.
        </p>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Cookie Policy
// ─────────────────────────────────────────────
export const CookiePolicy = () => (
  <MarketingLayout title="Cookie Policy" subtitle="Last updated: March 31, 2026">
    <div className="space-y-6">
      <Section>
        <p className="text-sm">
          This Cookie Policy explains how SwiftEarn Technologies, Inc. uses cookies and similar tracking technologies
          on the swiftearn.us Platform. By continuing to use our Platform, you consent to the use of cookies as
          described in this policy.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">What Are Cookies?</h3>
        <p className="text-sm">
          Cookies are small text files placed on your device by websites you visit. They are widely used to make
          websites work efficiently and to provide information to website owners.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">How We Use Cookies</h3>
        <div className="space-y-4">
          {[
            { type: "Essential Cookies", desc: "These cookies are strictly necessary for the Platform to function and cannot be disabled. They include session authentication tokens, CSRF protection tokens, and security identifiers. Without these, the Platform will not work.", cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20", accentClass: "text-cyan-500 dark:text-cyan-400" },
            { type: "Performance Cookies", desc: "We use anonymized analytics to measure Platform performance, page load times, and error rates. This data helps us improve the user experience. No personally identifiable information is collected via performance cookies.", cardClass: "bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20", accentClass: "text-blue-500 dark:text-blue-400" },
            { type: "Security Cookies", desc: "Security cookies help us detect and prevent fraudulent activity, bot access, and brute-force attacks on authentication endpoints.", cardClass: "bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20", accentClass: "text-emerald-500 dark:text-emerald-400" },
          ].map(({ type, desc, cardClass, accentClass }, i) => (
            <div key={i} className={`p-6 rounded-2xl ${cardClass}`}>
              <div className="flex items-center gap-3 mb-3">
                <Cookie className={`w-5 h-5 ${accentClass}`} />
                <h4 className={`font-black text-sm uppercase tracking-widest ${accentClass}`}>{type}</h4>
              </div>
              <p className="text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">No Third-Party Advertising Cookies</h3>
        <p className="text-sm">
          We do not use third-party advertising or tracking cookies. We do not share cookie data with advertising
          networks or use behavioral profiling for ad targeting.
        </p>

        <h3 className="text-slate-900 dark:text-white font-black uppercase tracking-tight text-lg">Managing Cookies</h3>
        <p className="text-sm">
          You can control and delete cookies through your browser settings. Disabling essential cookies may affect
          Platform functionality, including your ability to log in. For questions, contact
          <a href="mailto:privacy@swiftearn.us" className="text-cyan-500 dark:text-cyan-400 hover:underline ml-1">privacy@swiftearn.us</a>.
        </p>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// API Docs
// ─────────────────────────────────────────────
export const APIDocs = () => (
  <MarketingLayout
    title="Developer API"
    subtitle="Build powerful DeFi applications on top of the SwiftEarn Protocol REST API."
  >
    <div className="space-y-8">
      <Section title="Overview">
        <p className="text-sm">
          The SwiftEarn REST API allows authenticated users and developers to programmatically access wallet balances,
          transaction history, staking data, and referral analytics. All API responses are in JSON format.
          Authentication uses Laravel Sanctum Bearer tokens obtained via the login endpoint.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            { label: "Base URL", value: "https://api.swiftearn.us" },
            { label: "Protocol", value: "HTTPS / REST" },
            { label: "Auth", value: "Bearer Token (Sanctum)" },
          ].map(({ label, value }, i) => (
            <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{label}</p>
              <p className="text-cyan-400 font-mono text-sm font-bold">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Authentication">
        <pre className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed">
{`POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your_password"
}

// Response 200 OK
{
  "access_token": "1|abc123...",
  "user": { "id": 1, "level": 5, ... }
}`}
        </pre>
      </Section>

      <Section title="Key Endpoints">
        <div className="space-y-4 text-sm">
          {[
            { method: "GET", path: "/api/user/me", desc: "Returns authenticated user profile with wallet and level data." },
            { method: "GET", path: "/api/wallet", desc: "Returns real-time available, locked, and freezed balances." },
            { method: "GET", path: "/api/finance/stats", desc: "Returns total earnings, active investments, and balance summary." },
            { method: "GET", path: "/api/stake/projects", desc: "Returns available investment projects with lock/unlock status." },
            { method: "POST", path: "/api/stake", desc: "Creates a new stake. Body: { project_id, amount }." },
            { method: "POST", path: "/api/stake/{id}/harvest", desc: "Harvests today's profit for a specific stake." },
            { method: "GET", path: "/api/referrals", desc: "Returns your 3-tier referral tree and commission totals." },
            { method: "POST", path: "/api/withdrawals", desc: "Requests a withdrawal. Body: { amount, wallet_address }." },
          ].map(({ method, path, desc }, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/10">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shrink-0 ${method === "GET" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"}`}>{method}</span>
              <div>
                <p className="text-slate-900 dark:text-white font-mono font-bold mb-1">{path}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Careers
// ─────────────────────────────────────────────
export const Careers = () => (
  <MarketingLayout
    title="Careers"
    subtitle="Join the team building the future of AI-powered decentralized finance."
  >
    <div className="space-y-8">
      <Section>
        <p>
          SwiftEarn Technologies, Inc. is a remote-first company headquartered in Delaware, USA. We're a team of
          builders obsessed with democratizing professional-grade financial tools through technology. We offer
          competitive compensation, equity options, and a mission-driven culture.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {[
            { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world.", cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20", iconClass: "text-cyan-500 dark:text-cyan-400" },
            { icon: TrendingUp, title: "Equity", desc: "All employees receive stock options.", cardClass: "bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20", iconClass: "text-emerald-500 dark:text-emerald-400" },
            { icon: Award, title: "Impact", desc: "Your work reaches 125K+ users globally.", cardClass: "bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20", iconClass: "text-purple-500 dark:text-purple-400" },
          ].map(({ icon: Icon, title, desc, cardClass, iconClass }, i) => (
            <div key={i} className={`p-6 rounded-2xl text-center ${cardClass}`}>
              <Icon className={`w-8 h-8 mx-auto mb-3 ${iconClass}`} />
              <h4 className="text-slate-900 dark:text-white font-black mb-1">{title}</h4>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Open Positions">
        <div className="space-y-4">
          {[
            { title: "Senior Blockchain Engineer (TRON/Solidity)", dept: "Engineering", type: "Full-Time", location: "Remote (US preferred)" },
            { title: "AI/ML Quantitative Researcher", dept: "Research", type: "Full-Time", location: "Remote" },
            { title: "Chief Compliance Officer", dept: "Legal & Compliance", type: "Full-Time", location: "Delaware, USA" },
            { title: "Senior React Engineer", dept: "Product", type: "Full-Time", location: "Remote" },
            { title: "Security Analyst (Penetration Testing)", dept: "Security", type: "Contract", location: "Remote" },
            { title: "Community Manager (Telegram/Discord)", dept: "Growth", type: "Part-Time", location: "Remote" },
          ].map((job, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-800/10 gap-4">
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-1">{job.title}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-cyan-500 dark:text-cyan-400 font-bold uppercase tracking-widest">{job.dept}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">{job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-full">{job.type}</span>
                <a href="mailto:careers@swiftearn.us" className="px-4 py-2 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-cyan-500/30 transition-colors whitespace-nowrap">
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-6">
          Don't see a role that fits? Send your CV to <a href="mailto:careers@swiftearn.us" className="text-cyan-500 dark:text-cyan-400 hover:underline">careers@swiftearn.us</a>
        </p>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Community
// ─────────────────────────────────────────────
export const Community = () => (
  <MarketingLayout
    title="Community"
    subtitle="Connect with 125,000+ SwiftEarn arbitrageurs across the globe."
  >
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { platform: "Telegram", handle: "@SwiftEarnOfficial", members: "68K+", desc: "The primary hub for announcements, yield updates, and real-time community support. Moderated 24/7 by our team.", cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20", accentClass: "text-cyan-500 dark:text-cyan-400" },
          { platform: "Discord", handle: "discord.gg/swiftearn", members: "41K+", desc: "Our developer and power-user community. Join channels for technical discussions, AI research, and governance proposals.", cardClass: "bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20", accentClass: "text-indigo-500 dark:text-indigo-400" },
          { platform: "X (Twitter)", handle: "@SwiftEarnUS", members: "79K+", desc: "Follow for protocol updates, market commentary, performance reports, and new feature announcements.", cardClass: "bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20", accentClass: "text-blue-500 dark:text-blue-400" },
          { platform: "Medium", handle: "medium.com/@swiftearn", members: "18K+", desc: "In-depth articles covering our AI arbitrage strategy, quarterly performance reports, and DeFi industry analysis.", cardClass: "bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20", accentClass: "text-purple-500 dark:text-purple-400" },
        ].map(({ platform, handle, members, desc, cardClass, accentClass }, i) => (
          <div key={i} className={`p-8 rounded-3xl space-y-4 ${cardClass}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-black text-xl ${accentClass}`}>{platform}</h3>
              <span className="text-slate-900 dark:text-white font-black text-2xl">{members}</span>
            </div>
            <p className="text-slate-500 text-xs font-mono">{handle}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <Section title="Community Guidelines">
        <p className="text-sm">To maintain a high-quality community, all members are expected to:</p>
        <div className="space-y-3 mt-4">
          {[
            "Be respectful and constructive in all interactions.",
            "Never share, solicit, or promote unofficial SwiftEarn links or contracts.",
            "Do not provide or solicit financial advice from other community members.",
            "Report suspected scam accounts or phishing attempts immediately to moderators.",
            "No spam, self-promotion, or unauthorized advertising.",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-cyan-500 dark:text-cyan-400 font-black shrink-0">{i + 1}.</span>
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Help Center
// ─────────────────────────────────────────────
export const HelpCenter = () => (
  <MarketingLayout
    title="Help Center"
    subtitle="Everything you need to get the most out of the SwiftEarn Platform."
  >
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { icon: Zap, title: "Getting Started", articles: ["How to register with a referral code", "How to complete KYC verification", "Depositing USDT via TRC20 network", "Choosing your first investment project"], cardClass: "bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20", iconClass: "text-cyan-500 dark:text-cyan-400", dotClass: "bg-cyan-500/50" },
          { icon: TrendingUp, title: "Staking & Earning", articles: ["How the Daily Harvest works", "Understanding the 90-Day Lock Period", "What happens if I miss a harvest?", "How levels and milestones work"], cardClass: "bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20", iconClass: "text-emerald-500 dark:text-emerald-400", dotClass: "bg-emerald-500/50" },
          { icon: CheckCircle2, title: "Withdrawals & Wallet", articles: ["How to request a withdrawal", "Understanding Available vs Freezed Balance", "How to unfreeze funds at Level 50", "Withdrawal processing times"], cardClass: "bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-200 dark:border-indigo-500/20", iconClass: "text-indigo-500 dark:text-indigo-400", dotClass: "bg-indigo-500/50" },
          { icon: Users, title: "Referrals", articles: ["How the 3-Tier referral system works", "When do referral bonuses get credited?", "How to share your referral code", "Tracking your referral earnings"], cardClass: "bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20", iconClass: "text-purple-500 dark:text-purple-400", dotClass: "bg-purple-500/50" },
        ].map(({ icon: Icon, title, articles, cardClass, iconClass, dotClass }, i) => (
          <div key={i} className={`p-8 rounded-3xl space-y-5 ${cardClass}`}>
            <div className="flex items-center gap-3">
              <Icon className={`w-7 h-7 ${iconClass}`} />
              <h3 className="text-slate-900 dark:text-white font-black">{title}</h3>
            </div>
            <ul className="space-y-3">
              {articles.map((article, j) => (
                <li key={j}>
                  <Link to="/faq" className="text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                    {article}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Section>
        <div className="text-center space-y-6">
          <MessageSquare className="w-12 h-12 text-cyan-500 dark:text-cyan-400 mx-auto" />
          <h3 className="text-slate-900 dark:text-white font-black text-2xl">Still Need Help?</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-sm">
            Our support team is available 24/7. Average first response time is under 4 hours for email tickets.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/support" className="px-8 py-3 bg-cyan-500 text-white font-black uppercase tracking-widest rounded-xl hover:bg-cyan-600 transition-colors text-sm">
              Open Support Ticket
            </Link>
            <a href="mailto:support@swiftearn.us" className="px-8 py-3 border border-slate-700 text-slate-300 font-black uppercase tracking-widest rounded-xl hover:border-slate-600 transition-colors text-sm">
              Email Support
            </a>
          </div>
        </div>
      </Section>
    </div>
  </MarketingLayout>
);

// ─────────────────────────────────────────────
// Support — redirects to the ticket system
// ─────────────────────────────────────────────
export const Support = () => {
  // This component is only reached by unauthenticated / public visitors.
  // Authenticated users reach SupportTickets directly from the dashboard sidebar.

  return (
    <MarketingLayout
      title="Support Center"
      subtitle="Create a ticket and our team will respond promptly. Attach screenshots for faster resolution."
    >
      <div className="space-y-8">
        <Section>
          <div className="flex flex-col items-center text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-cyan-500 dark:text-cyan-400" />
            </div>
            <div>
              <h2 className="text-slate-900 dark:text-white text-3xl font-black italic tracking-tighter uppercase mb-3">Submit a Support Ticket</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg">
                Log into your account to submit and track support tickets, attach screenshots, and communicate directly with our team.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black italic uppercase tracking-tight text-sm px-8 py-4 rounded-2xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all shadow-xl"
              >
                Log In &amp; Submit Ticket
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black italic uppercase tracking-tight text-sm px-8 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-cyan-500/50 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        </Section>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Clock, color: "cyan",    title: "Fast Response",      desc: "Support team replies within 4 hours during business hours." },
            { icon: Shield, color: "emerald", title: "Secure Tickets",     desc: "All tickets are encrypted and visible only to you and our staff." },
            { icon: FileText, color: "indigo", title: "Full Audit Trail", desc: "Complete conversation history and activity logs for every ticket." },
          ].map(({ icon: Icon, color, title, desc }, i) => (
            <div key={i} className={`p-6 bg-${color}-50 dark:bg-${color}-500/5 border border-${color}-200 dark:border-${color}-500/20 rounded-3xl`}>
              <Icon className={`w-8 h-8 text-${color}-500 dark:text-${color}-400 mb-4`} />
              <h4 className="text-slate-900 dark:text-white font-black mb-2">{title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
};
