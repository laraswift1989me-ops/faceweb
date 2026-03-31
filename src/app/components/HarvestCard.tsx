import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, TrendingUp, CheckCircle2 } from 'lucide-react';

export function HarvestCard() {
  const [isHarvested, setIsHarvested] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [randomProfit, setRandomProfit] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  const currentStaked = 5420.50;
  const dailyProfitPercent = 0.95;

  // Timer Logic (Only runs after harvest)
  useEffect(() => {
    if (!isHarvested) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            hours = hours > 0 ? hours - 1 : 23;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isHarvested]);

  const handleHarvest = () => {
    // Generate a random figure around +15 (e.g., 15.00 to 15.99)
    const profit = parseFloat((15 + Math.random()).toFixed(2));
    setRandomProfit(profit);
    setShowSuccess(true);

    // Auto-hide success screen after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setIsHarvested(true);
    }, 3000);
  };

  return (
    <div className="w-full relative">
      {/* --- FULL SCREEN ANIMATION OVERLAY --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="text-center"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="bg-emerald-500/20 p-4 rounded-full mb-4 inline-block"
              >
                <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl font-black text-white mb-2"
              >
                +${randomProfit}
              </motion.h2>
              
              <div className="flex flex-col items-center">
                <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase">
                  Profit added to your balance
                </p>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="h-1 bg-emerald-500 mt-2 rounded-full"
                  transition={{ duration: 2 }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MAIN CARD --- */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-[32px] lg:rounded-[48px] p-6 lg:p-10 shadow-2xl border border-slate-700/50">
        <div className="flex items-center justify-between mb-8 lg:mb-10">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500/20 p-2.5 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl lg:text-3xl font-bold text-white tracking-tight">AI Arbitrage Pool</h2>
          </div>
          <Info className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors" />
        </div>

        {/* Profit Badge */}
        <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-emerald-400 text-[11px] font-bold tracking-wider uppercase">
            DAILY HARVEST • {dailyProfitPercent}% PROFIT
          </p>
        </div>

        {/* Staked Amount */}
        <div className="mb-8">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1.5">Current Staked</p>
          <p className="text-4xl font-black text-white tracking-tight">
            ${currentStaked.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            <span className="text-lg font-bold text-slate-500 ml-2 font-mono">USDT</span>
          </p>
        </div>

        {/* Countdown Timer (Hidden by default, shows after harvest) */}
        <AnimatePresence>
          {isHarvested && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-8 bg-slate-950/40 p-4 rounded-2xl border border-white/5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400 font-medium">Next Harvest in:</p>
                <p className="text-sm font-bold text-emerald-400 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HARVEST BUTTON */}
        <motion.button
          onClick={handleHarvest}
          disabled={isHarvested}
          animate={!isHarvested ? {
            scale: [1, 1.02, 1],
            boxShadow: [
              "0px 0px 0px rgba(16, 185, 129, 0)",
              "0px 0px 25px rgba(16, 185, 129, 0.4)",
              "0px 0px 0px rgba(16, 185, 129, 0)"
            ]
          } : { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={!isHarvested ? { scale: 1.04 } : {}}
          whileTap={!isHarvested ? { scale: 0.96 } : {}}
          className={`relative overflow-hidden w-full font-black py-4 rounded-2xl transition-all tracking-wide uppercase italic
            ${isHarvested 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
              : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950'
            }`}
        >
          <span className="relative z-10">
            {isHarvested ? 'HARVESTED' : "HARVEST TODAY'S PROFIT"}
          </span>

          {/* Glint Animation (Only if not harvested) */}
          {!isHarvested && (
            <motion.div
              animate={{ x: ['-100%', '300%'] }}
              transition={{ repeat: Infinity, duration: 1.8, repeatDelay: 3, ease: "linear" }}
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
              className="absolute inset-0 z-0"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}