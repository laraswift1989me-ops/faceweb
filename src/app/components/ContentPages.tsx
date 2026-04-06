import React from 'react';
import { motion } from 'motion/react';
import {
  Shield, Lock, Eye, CheckCircle2, FileText, Scale,
  Cookie, AlertTriangle, Users, Target, Award, Briefcase,
  Book, MessageCircle, Code, HelpCircle, ChevronRight,
  Zap, TrendingUp, Rocket, Globe
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { APP_NAME, COMPANY_NAME, PRIVACY_EMAIL, API_BASE_URL, TELEGRAM_URL, DISCORD_URL, TWITTER_URL, MEDIUM_URL } from '../../config';

// How It Works Page
export function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Create Account',
      desc: 'Register with a valid referral code and complete KYC verification to ensure platform security.',
      icon: Users,
      color: 'cyan'
    },
    {
      num: '02',
      title: 'Deposit USDT',
      desc: 'Fund your wallet using TRC20 USDT. Minimum deposit is $20.',
      icon: Zap,
      color: 'emerald'
    },
    {
      num: '03',
      title: 'Choose Strategy',
      desc: 'Select from our 10-level booster system or AI arbitrage pools based on your risk appetite.',
      icon: Target,
      color: 'purple'
    },
    {
      num: '04',
      title: 'Earn Daily',
      desc: 'Watch your profits compound daily. Harvest anytime and withdraw instantly to your wallet.',
      icon: TrendingUp,
      color: 'yellow'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white">
          How <span className="text-cyan-400">{APP_NAME}</span> Works
        </h1>
        <p className="text-slate-400 text-lg">
          Four simple steps to start earning passive income with Web3 DeFi technology.
        </p>
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 space-y-6"
          >
            <div className="flex items-start justify-between">
              <div className={`bg-${step.color}-500/20 p-4 rounded-2xl`}>
                <step.icon className={`w-8 h-8 text-${step.color}-400`} />
              </div>
              <span className="text-6xl font-black text-slate-800">{step.num}</span>
            </div>
            <h3 className="text-2xl font-bold text-white">{step.title}</h3>
            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[40px] p-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">AI-Powered Arbitrage Engine</h2>
            <p className="text-slate-400 leading-relaxed">
              Our proprietary algorithm scans 50+ centralized and decentralized exchanges in real-time, 
              identifying profitable price discrepancies. Your staked USDT is automatically allocated 
              to high-yield opportunities while maintaining maximum security through multi-signature wallets.
            </p>
            <ul className="space-y-3">
              {[
                'Real-time market scanning',
                'Automated fund allocation',
                'Risk-adjusted portfolio balancing',
                'Daily profit distribution'
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-900/50 rounded-3xl p-2">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
              alt="Analytics Dashboard"
              className="rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Security Page
export function SecurityPage() {
  const features = [
    {
      icon: Shield,
      title: 'Multi-Signature Wallets',
      desc: 'All user funds are stored in multi-sig cold wallets requiring 3/5 signature consensus for any withdrawal.'
    },
    {
      icon: Lock,
      title: 'Bank-Grade Encryption',
      desc: 'AES-256 encryption for all sensitive data, both in transit and at rest.'
    },
    {
      icon: Eye,
      title: 'Real-Time Monitoring',
      desc: '24/7 security operations center monitoring for suspicious activities and potential threats.'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full px-4 py-1.5 mb-4">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-xs font-bold tracking-wider uppercase">AUDITED & VERIFIED</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white">
          Your Security is Our <span className="text-emerald-400">Priority</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Industry-leading security measures to protect your digital assets.
        </p>
      </div>

      {/* Security Features */}
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 space-y-6">
            <div className="bg-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center">
              <feature.icon className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Compliance */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-[40px] p-12">
        <h2 className="text-3xl font-bold text-white mb-8">Compliance & Audits</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-400">✓ Smart Contract Audits</h4>
            <p className="text-slate-400">Independently audited by CertiK and Hacken in Q4 2025.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-400">✓ KYC/AML Compliance</h4>
            <p className="text-slate-400">Multi-stage verification with liveness detection to prevent fraud.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-400">✓ Insurance Coverage</h4>
            <p className="text-slate-400">$10M insurance policy covering smart contract exploits.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-emerald-400">✓ Regular Penetration Tests</h4>
            <p className="text-slate-400">Quarterly security assessments by third-party white-hat teams.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Careers Page
export function CareersPage() {
  const positions = [
    {
      title: 'Senior Blockchain Developer',
      dept: 'Engineering',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'DeFi Product Manager',
      dept: 'Product',
      location: 'Dubai / Remote',
      type: 'Full-time'
    },
    {
      title: 'Security Analyst',
      dept: 'Security',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      title: 'Community Manager',
      dept: 'Marketing',
      location: 'Remote',
      type: 'Contract'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white">
          Join the <span className="text-cyan-400">Future</span> of Finance
        </h1>
        <p className="text-slate-400 text-lg">
          We're building the next generation of DeFi infrastructure. Come shape the future with us.
        </p>
      </div>

      {/* Values */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Rocket, title: 'Innovation First', desc: 'Push boundaries and challenge the status quo.' },
          { icon: Users, title: 'Team Culture', desc: 'Collaborative, inclusive, and globally distributed.' },
          { icon: Award, title: 'Growth Mindset', desc: 'Continuous learning and professional development.' }
        ].map((value, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 text-center space-y-4">
            <div className="bg-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
              <value.icon className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white">{value.title}</h3>
            <p className="text-slate-400">{value.desc}</p>
          </div>
        ))}
      </div>

      {/* Open Positions */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-white">Open Positions</h2>
        <div className="space-y-4">
          {positions.map((pos, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:border-cyan-500/50 transition-colors cursor-pointer"
            >
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{pos.title}</h3>
                <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{pos.dept}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{pos.location}</span>
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">{pos.type}</span>
                </div>
              </div>
              <button className="px-6 py-2 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors flex items-center space-x-2">
                <span>Apply Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Help Center Page
export function HelpCenterPage() {
  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      articles: ['How to create an account', 'Completing KYC verification', 'Making your first deposit', 'Understanding booster levels']
    },
    {
      icon: Zap,
      title: 'Deposits & Withdrawals',
      articles: ['Deposit methods', 'Withdrawal process', 'Transaction fees', 'Processing times']
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      articles: ['Two-factor authentication', 'Account recovery', 'Privacy settings', 'Reporting suspicious activity']
    },
    {
      icon: Users,
      title: 'Referral Program',
      articles: ['How referrals work', 'Commission structure', '3-tier system explained', 'Tracking your referrals']
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white">
          How Can We <span className="text-cyan-400">Help?</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Search our knowledge base or browse categories below.
        </p>
        <div className="max-w-2xl mx-auto mt-8">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid md:grid-cols-2 gap-8">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="bg-cyan-500/20 p-3 rounded-xl">
                <cat.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
            </div>
            <ul className="space-y-3">
              {cat.articles.map((article, i) => (
                <li key={i}>
                  <button className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center space-x-2 w-full text-left">
                    <ChevronRight className="w-4 h-4" />
                    <span>{article}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-[40px] p-12 text-center space-y-6">
        <MessageCircle className="w-16 h-16 text-cyan-400 mx-auto" />
        <h2 className="text-3xl font-bold text-white">Still need help?</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Our support team is available 24/7 to assist you with any questions.
        </p>
        <button className="px-8 py-3 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}

// FAQ Page
export function FAQPage() {
  const faqs = [
    {
      q: `What is ${APP_NAME}?`,
      a: `${APP_NAME} is a Web3 DeFi platform that allows users to earn passive income through TRC20 USDT staking, AI-powered arbitrage, and a multi-level referral system.`
    },
    {
      q: 'How much can I earn?',
      a: 'Daily profit ranges from 1% to 50% depending on your booster level and the arbitrage opportunities our AI identifies. Higher stakes unlock higher tiers with better returns.'
    },
    {
      q: 'Is there a minimum deposit?',
      a: 'Yes, the minimum deposit is $20 USDT (TRC20). Deposits below $20 after network fees will not be credited to your wallet.'
    },
    {
      q: 'How do withdrawals work?',
      a: 'Withdrawals are processed instantly to your TRC20 wallet address. There is a small network fee (typically $1-2) to cover blockchain transaction costs.'
    },
    {
      q: 'What is the referral program?',
      a: `${APP_NAME} uses a mandatory 3-tier referral system. You earn commissions from your direct referrals (Tier 1), their referrals (Tier 2), and their referrals (Tier 3).`
    },
    {
      q: 'Is KYC required?',
      a: 'Yes, all users must complete a multi-stage KYC process including ID verification and liveness video to comply with anti-money laundering regulations.'
    },
    {
      q: 'How is my money secured?',
      a: 'All user funds are stored in multi-signature cold wallets with 3/5 consensus required for withdrawals. We also carry $10M insurance coverage.'
    },
    {
      q: `Can I use ${APP_NAME} on mobile?`,
      a: `Yes! ${APP_NAME} is fully responsive and optimized for mobile devices with a dedicated 5-tab navigation system.`
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white">
          Frequently Asked <span className="text-cyan-400">Questions</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Everything you need to know about {APP_NAME}.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, idx) => (
          <details 
            key={idx}
            className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 group"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h3 className="text-lg font-bold text-white">{faq.q}</h3>
              <ChevronRight className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-4 text-slate-400 leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

// API Documentation Page
export function APIDocsPage() {
  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/50 rounded-full px-4 py-1.5 mb-4">
          <Code className="w-4 h-4 text-purple-400" />
          <span className="text-purple-400 text-xs font-bold tracking-wider uppercase">API v2.0</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white">
          Developer <span className="text-purple-400">Documentation</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Build on top of {APP_NAME}'s powerful DeFi infrastructure.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: 'REST API', desc: 'RESTful endpoints for all platform features', endpoint: '/api/v2' },
          { title: 'WebSocket', desc: 'Real-time price feeds and notifications', endpoint: `wss://${API_BASE_URL.replace(/^https?:\/\//, '')}` },
          { title: 'GraphQL', desc: 'Flexible queries for complex data', endpoint: '/graphql' }
        ].map((api, idx) => (
          <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 space-y-4">
            <h3 className="text-2xl font-bold text-white">{api.title}</h3>
            <p className="text-slate-400">{api.desc}</p>
            <code className="block bg-slate-900 px-4 py-2 rounded-lg text-cyan-400 text-sm">
              {api.endpoint}
            </code>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-[40px] p-12">
        <h2 className="text-3xl font-bold text-white mb-8">Quick Start</h2>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-cyan-400 mb-2">1. Authentication</h4>
            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-emerald-400 text-sm">
                POST {API_BASE_URL}/v2/auth/login<br/>
                {`{ "email": "user@example.com", "password": "***" }`}
              </code>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-cyan-400 mb-2">2. Get User Balance</h4>
            <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-emerald-400 text-sm">
                GET {API_BASE_URL}/v2/wallet/balance<br/>
                Authorization: Bearer {`{access_token}`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Community Page
export function CommunityPage() {
  const platforms = [
    {
      name: 'Telegram',
      members: '45K+',
      desc: 'Join our main community chat',
      link: TELEGRAM_URL,
      color: 'cyan'
    },
    {
      name: 'Discord',
      members: '28K+',
      desc: 'Developer community and support',
      link: DISCORD_URL,
      color: 'purple'
    },
    {
      name: 'Twitter',
      members: '62K+',
      desc: 'Latest news and updates',
      link: TWITTER_URL,
      color: 'blue'
    },
    {
      name: 'Medium',
      members: '12K+',
      desc: 'Educational content and guides',
      link: MEDIUM_URL,
      color: 'emerald'
    }
  ];

  return (
    <div className="container mx-auto px-6 py-20 space-y-20">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-white">
          Join Our <span className="text-cyan-400">Community</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Connect with 85,000+ {APP_NAME} users worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {platforms.map((platform, idx) => (
          <a
            key={idx}
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 hover:border-cyan-500/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{platform.name}</h3>
                <p className="text-slate-400">{platform.desc}</p>
              </div>
              <ChevronRight className="w-6 h-6 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
            <div className={`text-3xl font-black text-${platform.color}-400`}>
              {platform.members}
            </div>
          </a>
        ))}
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-[40px] p-12 text-center space-y-6">
        <Users className="w-16 h-16 text-cyan-400 mx-auto" />
        <h2 className="text-3xl font-bold text-white">Community Guidelines</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We're building a respectful, helpful community. Please be kind, avoid spam, 
          and help newcomers learn the ropes. Together we grow stronger.
        </p>
      </div>
    </div>
  );
}

// Privacy Policy Page
export function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: March 27, 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
            <p className="text-slate-400 leading-relaxed">
              {COMPANY_NAME} ("we," "us," or "our") collects information necessary to provide
              our DeFi platform services. This includes:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
              <li>Personal identification information (name, email, phone number)</li>
              <li>KYC documentation (government-issued ID, proof of address)</li>
              <li>Wallet addresses and transaction history</li>
              <li>Device information and IP addresses</li>
              <li>Usage data and analytics</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
            <p className="text-slate-400 leading-relaxed">
              We use collected information to:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
              <li>Verify your identity and comply with KYC/AML regulations</li>
              <li>Process deposits, withdrawals, and investment transactions</li>
              <li>Detect and prevent fraud or security threats</li>
              <li>Improve our platform and user experience</li>
              <li>Send important notifications about your account</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
            <p className="text-slate-400 leading-relaxed">
              We implement industry-leading security measures including AES-256 encryption, 
              multi-signature wallets, and regular security audits. However, no internet transmission 
              is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Data Sharing</h2>
            <p className="text-slate-400 leading-relaxed">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
              <li>KYC verification partners (e.g., Jumio, Onfido)</li>
              <li>Legal authorities when required by law</li>
              <li>Service providers under strict confidentiality agreements</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Your Rights</h2>
            <p className="text-slate-400 leading-relaxed">
              You have the right to access, correct, or delete your personal information. 
              Contact us at {PRIVACY_EMAIL} to exercise these rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
            <p className="text-slate-400 leading-relaxed">
              For privacy-related questions, email us at {PRIVACY_EMAIL} or write to:<br/>
              {COMPANY_NAME}<br/>
              International Business Center<br/>
              Dubai, United Arab Emirates
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// Terms of Service Page
export function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white">Terms of Service</h1>
          <p className="text-slate-400">Last updated: March 27, 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-400 leading-relaxed">
              By accessing or using {APP_NAME}'s platform, you agree to be bound by these Terms of Service.
              If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Eligibility</h2>
            <p className="text-slate-400 leading-relaxed">
              You must be at least 18 years old and legally capable of entering into contracts. 
              You must not be located in a restricted jurisdiction (e.g., United States, North Korea, Iran).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Account Registration</h2>
            <p className="text-slate-400 leading-relaxed">
              Registration requires a valid referral code. You must complete KYC verification before 
              making deposits or withdrawals. Providing false information may result in account termination.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Investment Risks</h2>
            <p className="text-slate-400 leading-relaxed">
              Cryptocurrency investments carry inherent risks. Past performance does not guarantee future 
              results. You may lose some or all of your invested capital. {APP_NAME} does not provide
              financial advice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Fees and Commissions</h2>
            <p className="text-slate-400 leading-relaxed">
              {APP_NAME} charges network fees for withdrawals (typically $1-2 USDT). Referral commissions
              are distributed according to the published 3-tier structure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Prohibited Activities</h2>
            <p className="text-slate-400 leading-relaxed">
              Users may not engage in fraud, money laundering, market manipulation, or any illegal activity. 
              Multiple accounts per user are prohibited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Termination</h2>
            <p className="text-slate-400 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms or engage 
              in suspicious activity.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Governing Law</h2>
            <p className="text-slate-400 leading-relaxed">
              These terms are governed by the laws of the United Arab Emirates. Disputes will be 
              resolved through binding arbitration in Dubai.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// Cookie Policy Page
export function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full px-4 py-1.5 mb-4">
            <Cookie className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold tracking-wider uppercase">COOKIES</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white">Cookie Policy</h1>
          <p className="text-slate-400">Last updated: March 27, 2026</p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">What Are Cookies?</h2>
            <p className="text-slate-400 leading-relaxed">
              Cookies are small text files stored on your device when you visit our website. 
              They help us provide a better user experience and understand how you interact with our platform.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Types of Cookies We Use</h2>
            <div className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-cyan-400 mb-2">Essential Cookies</h4>
                <p className="text-slate-400">Required for the platform to function. These cannot be disabled.</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-emerald-400 mb-2">Analytics Cookies</h4>
                <p className="text-slate-400">Help us understand how users interact with the platform to improve UX.</p>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-purple-400 mb-2">Marketing Cookies</h4>
                <p className="text-slate-400">Track your preferences to show relevant content and advertisements.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Managing Cookies</h2>
            <p className="text-slate-400 leading-relaxed">
              You can control cookies through your browser settings. Note that disabling cookies 
              may affect platform functionality. For more information, visit your browser's help section.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

// Risk Disclaimer Page
export function RiskDisclaimerPage() {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/50 rounded-full px-4 py-1.5 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-xs font-bold tracking-wider uppercase">IMPORTANT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white">Risk Disclaimer</h1>
          <p className="text-slate-400">Please read carefully before investing</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
          <p className="text-red-400 font-bold text-lg mb-4">⚠️ High-Risk Investment Warning</p>
          <p className="text-slate-300 leading-relaxed">
            Cryptocurrency and DeFi investments carry substantial risk. You should only invest money 
            you can afford to lose. {APP_NAME} does not guarantee profits or protection against losses.
          </p>
        </div>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Market Volatility</h2>
            <p className="text-slate-400 leading-relaxed">
              Cryptocurrency markets are highly volatile. Values can fluctuate dramatically in short periods. 
              Daily profit ranges (1%-50%) are estimates based on historical arbitrage opportunities and 
              are not guaranteed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Regulatory Risk</h2>
            <p className="text-slate-400 leading-relaxed">
              Cryptocurrency regulations vary by jurisdiction and are subject to change. Future regulatory 
              actions may affect the platform's availability or functionality in certain regions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Technology Risk</h2>
            <p className="text-slate-400 leading-relaxed">
              Despite security measures, smart contracts and blockchain technology carry inherent risks 
              including bugs, exploits, and network failures. We maintain insurance coverage but cannot 
              guarantee 100% protection.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">No Financial Advice</h2>
            <p className="text-slate-400 leading-relaxed">
              Nothing on this platform constitutes financial, investment, legal, or tax advice. 
              You should consult with qualified professionals before making investment decisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Past Performance</h2>
            <p className="text-slate-400 leading-relaxed">
              Historical returns, testimonials, and case studies do not guarantee future results. 
              Individual results may vary significantly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Acknowledgment</h2>
            <p className="text-slate-400 leading-relaxed">
              By using {APP_NAME}, you acknowledge that you understand these risks and accept full 
              responsibility for your investment decisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
