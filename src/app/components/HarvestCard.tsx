import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function HarvestCard() {
  const { userStakes, harvest } = useApp();
  const [isHarvesting, setIsHarvesting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Stakes not yet harvested today — these have pending yield
  const pendingStakes = userStakes.filter((s: any) => !s.harvested_today);
  const totalStaked = userStakes.reduce((sum, s: any) => sum + parseFloat(s.amount ?? 0), 0);
  const pendingYield = pendingStakes.reduce((sum: number, s: any) =>
    sum + (parseFloat(s.amount ?? 0) * parseFloat(s.daily_percent ?? 0) / 100), 0
  );

  // Use first stake's daily_percent for the badge label
  const primaryStake = userStakes[0] ?? null;
  const dailyProfitPercent = primaryStake
    ? parseFloat(primaryStake.daily_percent ?? 0)
    : 0;

  // Derived state: all stakes harvested today, or no stakes at all
  const alreadyHarvestedToday = userStakes.length > 0 && pendingStakes.length === 0;
  const canHarvest = !isHarvesting && pendingStakes.length > 0;

  // Countdown to next UTC midnight (when harvest window resets)
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
      const tomorrow = new Date(utcNow);
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - utcNow.getTime();
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleHarvest = async () => {
    if (!canHarvest) return;
    setIsHarvesting(true);
    setError(null);

    try {
      for (const stake of pendingStakes) {
        await harvest(stake.id);
      }
      setSuccessMsg(`$${pendingYield.toFixed(2)}`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Harvest failed. You may have already harvested today.');
    } finally {
      setIsHarvesting(false);
    }
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
                +{successMsg}
              </motion.h2>

              <div className="flex flex-col items-center">
                <p className="text-emerald-400 font-bold tracking-widest text-sm uppercase">
                  Profit sent to Locked Balance (90 days)
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
            DAILY HARVEST • {dailyProfitPercent > 0 ? dailyProfitPercent.toFixed(2) : '--'}% PROFIT
          </p>
        </div>

        {/* Staked Amount — principal only, not locked balance */}
        <div className="mb-6">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1.5">Current Staked</p>
          {userStakes.length > 0 ? (
            <p className="text-4xl font-black text-white tracking-tight">
              ${totalStaked.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              <span className="text-lg font-bold text-slate-500 ml-2 font-mono">USDT</span>
            </p>
          ) : (
            <p className="text-2xl font-bold text-slate-500">No active stakes</p>
          )}
        </div>

        {/* Pending Yield — today's harvestable amount */}
        <div className="mb-8">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1.5">Today's Pending Yield</p>
          {userStakes.length === 0 ? (
            <p className="text-2xl font-bold text-slate-500">—</p>
          ) : alreadyHarvestedToday ? (
            <p className="text-2xl font-bold text-emerald-500">Harvested</p>
          ) : (
            <p className="text-2xl font-black text-emerald-400 tracking-tight">
              +${pendingYield.toFixed(2)}
              <span className="text-sm font-bold text-slate-500 ml-2 font-mono">USDT</span>
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Countdown Timer (shows when harvested today) */}
        <AnimatePresence>
          {alreadyHarvestedToday && (
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
          disabled={!canHarvest}
          animate={canHarvest ? {
            scale: [1, 1.02, 1],
            boxShadow: [
              "0px 0px 0px rgba(16, 185, 129, 0)",
              "0px 0px 25px rgba(16, 185, 129, 0.4)",
              "0px 0px 0px rgba(16, 185, 129, 0)"
            ]
          } : { scale: 1, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={canHarvest ? { scale: 1.04 } : {}}
          whileTap={canHarvest ? { scale: 0.96 } : {}}
          className={`relative overflow-hidden w-full font-black py-4 rounded-2xl transition-all tracking-wide uppercase italic flex items-center justify-center gap-2
            ${!canHarvest
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950'
            }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            {isHarvesting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isHarvesting
              ? 'HARVESTING...'
              : alreadyHarvestedToday
                ? 'HARVESTED TODAY'
                : userStakes.length === 0
                  ? 'NO ACTIVE STAKES'
                  : "HARVEST TODAY'S PROFIT"
            }
          </span>

          {/* Glint Animation */}
          {canHarvest && (
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
