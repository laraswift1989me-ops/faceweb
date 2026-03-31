import { MapPin, Mail, Phone, Twitter, Send, Globe, Disc } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from './Logo';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-8">
            <Logo iconSize={24} textSize="text-2xl" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              SwiftEarn is a leading Web3 DeFi platform providing secure, transparent, and innovative yield farming solutions. Join 85,000+ users earning passive income with TRC20 USDT staking.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                <MapPin className="w-5 h-5 flex-shrink-0 text-cyan-400" />
                <span>SwiftEarn DeFi Solutions Ltd.<br/>International Business Center, Dubai</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500 text-xs font-bold uppercase tracking-widest">
                <Mail className="w-5 h-5 flex-shrink-0 text-cyan-400" />
                <a href="mailto:support@swiftearn.us" className="hover:text-cyan-400 transition-colors">support@swiftearn.us</a>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">Network Hub</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Security Protocols', path: '/security' },
                { label: 'Platform FAQ', path: '/faq' },
                { label: 'API Ecosystem', path: '/api-docs' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">Resources</h4>
            <ul className="space-y-4">
              {[
                { label: 'Help Center', path: '/help-center' },
                { label: 'Community Feed', path: '/community' },
                { label: 'Risk Analysis', path: '/risk-disclaimer' },
                { label: 'Compliance', path: '/legal' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-8">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em] italic">Legal Framework</h4>
            <ul className="space-y-4">
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Cookie Policy', path: '/cookies' },
                { label: 'Legal Notice', path: '/legal' }
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
              © {currentYear} SWIFTEARN DEFI PROTOCOL. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center space-x-8">
              <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors"><Send className="w-5 h-5" /></a>
              <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors"><Disc className="w-5 h-5" /></a>
              <a href="#" className="text-slate-600 hover:text-cyan-400 transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
