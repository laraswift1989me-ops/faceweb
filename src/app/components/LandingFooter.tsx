import { MapPin, Twitter, Send, Globe, MessageCircle, TicketIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Logo } from './Logo';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-8">
            <Logo iconSize={24} textSize="text-2xl" />
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm font-medium">
              SwiftEarn Technologies, Inc. is a U.S.-registered DeFi yield platform delivering AI-powered arbitrage
              and secure USDT staking to 125,000+ users worldwide. Incorporated in Delaware, USA.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                <MapPin className="w-5 h-5 flex-shrink-0 text-cyan-500 dark:text-cyan-400 mt-0.5" />
                <address className="not-italic">
                  SwiftEarn Technologies, Inc.<br />
                  651 N Broad Street, Suite 206<br />
                  Middletown, Delaware 19709, USA
                </address>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-8">
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] italic">Platform</h4>
            <ul className="space-y-4">
              {[
                { label: 'About Us', path: '/about' },
                { label: 'Security', path: '/security' },
                { label: 'FAQ', path: '/faq' },
                { label: 'P2P Exchange', path: '/p2p-exchange' },
                { label: 'Careers', path: '/careers' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-8">
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] italic">Resources</h4>
            <ul className="space-y-4">
              {[
                { label: 'Help Center', path: '/help-center' },
                { label: 'Community', path: '/community' },
                { label: 'Submit Ticket', path: '/support' },
                { label: 'Risk Disclaimer', path: '/risk-disclaimer' },
                { label: 'Compliance', path: '/legal' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-8">
            <h4 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em] italic">Legal</h4>
            <ul className="space-y-4">
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Cookie Policy', path: '/cookies' },
                { label: 'Legal Notice', path: '/legal' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-100 dark:border-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-1">
              <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                © {currentYear} SWIFTEARN TECHNOLOGIES, INC. ALL RIGHTS RESERVED.
              </p>
              <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                Incorporated in Delaware, USA · Not a registered investment adviser · No FDIC insurance
              </p>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" aria-label="Twitter" className="text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" aria-label="Telegram" className="text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"><Send className="w-5 h-5" /></a>
              <a href="#" aria-label="Discord" className="text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" aria-label="Website" className="text-slate-400 dark:text-slate-500 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"><Globe className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
