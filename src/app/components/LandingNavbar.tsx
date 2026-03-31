import React from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { Logo } from './Logo';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
    { path: '/security', label: 'Security' },
    { path: '/support', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/">
          <Logo iconSize={24} textSize="text-2xl" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                isActive(item.path) ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Link 
            to="/login"
            className="text-white font-black text-xs uppercase tracking-widest hover:text-cyan-400 transition-colors px-6 py-3"
          >
            SECURE LOGIN
          </Link>
          <Link 
            to="/register"
            className="bg-white text-slate-950 font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-white/5"
          >
            JOIN NOW
          </Link>
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
            <div className="p-8 space-y-6 flex flex-col items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-black uppercase tracking-widest ${
                    isActive(item.path) ? 'text-cyan-400' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-full pt-6 border-t border-slate-800 space-y-4">
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-white font-black py-4 rounded-xl border border-slate-700 text-xs uppercase tracking-widest"
                >
                  LOG IN
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-cyan-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
