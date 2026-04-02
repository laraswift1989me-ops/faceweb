import React from 'react';
import { LayoutDashboard, Menu, X, Coins, MapPin, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Logo } from './Logo';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  onLogin: () => void;
  onRegister: () => void;
}

export function LandingNavbar({ activePage, setActivePage, onLogin, onRegister }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'earn', label: 'Earn' },
    { id: 'support', label: 'Support' }
  ];

  return (
    <nav className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Logo 
          onClick={() => setActivePage('home')}
          iconSize={24}
          textSize="text-2xl"
        />

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                activePage === item.id ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={onLogin}
            className="text-white font-bold hover:text-cyan-400 transition-colors px-4 py-2"
          >
            Log In
          </button>
          <button 
            onClick={onRegister}
            className="bg-cyan-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20"
          >
            Create Account
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="p-6 space-y-6 flex flex-col items-center">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`text-lg font-bold uppercase tracking-widest ${
                    activePage === item.id ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="w-full pt-6 border-t border-slate-800 space-y-4">
                <button 
                  onClick={() => {
                    onLogin();
                    setIsOpen(false);
                  }}
                  className="w-full text-white font-bold py-3 rounded-xl border border-slate-700"
                >
                  Log In
                </button>
                <button 
                  onClick={() => {
                    onRegister();
                    setIsOpen(false);
                  }}
                  className="w-full bg-cyan-500 text-white font-bold py-3 rounded-xl"
                >
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function LandingFooter({ onPageChange }: { onPageChange?: (page: string) => void }) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (page: string) => {
    if (onPageChange) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Logo iconSize={24} textSize="text-2xl" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              SwiftEarn is a leading Web3 DeFi platform providing secure, transparent, and innovative yield farming solutions. Join 85,000+ users earning passive income with TRC20 USDT staking.
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-400" />
                <span>SwiftEarn DeFi Solutions Ltd.<br/>International Business Center, Dubai</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                <a href="mailto:support@swiftearn.us" className="hover:text-cyan-400 transition-colors">support@swiftearn.us</a>
              </div>
              <div className="flex items-center space-x-3 text-slate-500 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                <span>24/7 Support Available</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', page: 'about' },
                { label: 'How It Works', page: 'how-it-works' },
                { label: 'Security', page: 'security' },
                { label: 'Careers', page: 'careers' }
              ].map((link) => (
                <li key={link.page}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: 'Help Center', page: 'help-center' },
                { label: 'FAQ', page: 'faq' },
                { label: 'Community', page: 'community' }
              ].map((link) => (
                <li key={link.page}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {[
                { label: 'Privacy Policy', page: 'privacy' },
                { label: 'Terms of Service', page: 'terms' },
                { label: 'Cookie Policy', page: 'cookies' },
                { label: 'Risk Disclaimer', page: 'risk-disclaimer' }
              ].map((link) => (
                <li key={link.page}>
                  <button 
                    onClick={() => handleLinkClick(link.page)}
                    className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-600 text-xs font-bold uppercase tracking-[2px]">
              © {currentYear} SwiftEarn DeFi Solutions. All Rights Reserved.
            </p>
            <div className="flex items-center space-x-6">
              <a 
                href="https://twitter.com/swiftearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Twitter
              </a>
              <a 
                href="https://t.me/swiftearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Telegram
              </a>
              <a 
                href="https://medium.com/@swiftearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Medium
              </a>
              <a 
                href="https://discord.gg/swiftearn" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-wider"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}