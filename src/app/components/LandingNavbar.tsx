import React from 'react';
import { Menu, X, LayoutDashboard, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';
import { Logo } from './Logo';
import { useApp } from '../../context/AppContext';
import { ThemeToggle } from './ThemeToggle';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useApp();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/faq', label: 'FAQ' },
    { path: '/security', label: 'Security' },
    { path: '/support', label: 'Support' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/50 transition-colors duration-300">
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
                isActive(item.path)
                  ? 'text-cyan-500 dark:text-cyan-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
            >
              <UserCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
              <span className="hidden sm:inline">{user?.name?.split(' ')[0] ?? 'Dashboard'}</span>
              <LayoutDashboard className="w-4 h-4 text-slate-400 dark:text-slate-400" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-slate-700 dark:text-white font-black text-xs uppercase tracking-widest hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors px-6 py-3"
              >
                SECURE LOGIN
              </Link>
              <Link
                to="/register"
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-white transition-all shadow-lg"
              >
                JOIN NOW
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="text-slate-700 dark:text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-8 space-y-6 flex flex-col items-center">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-black uppercase tracking-widest ${
                    isActive(item.path)
                      ? 'text-cyan-500 dark:text-cyan-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-full pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-3 w-full text-center bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs uppercase tracking-widest"
                  >
                    <UserCircle className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center text-slate-900 dark:text-white font-black py-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs uppercase tracking-widest"
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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
