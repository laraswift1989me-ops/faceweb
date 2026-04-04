import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { swiftCashApi } from "../../services/api";
import { motion, AnimatePresence } from "motion/react";
import {
  Coins, ArrowDownCircle, ArrowUpCircle, Users, CheckCircle2, Lock,
  Loader2, AlertCircle, Gift, TrendingUp, Sparkles, ShieldCheck,
  ChevronRight, Zap, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { fmtAmount } from "../../utils/format";
import { format } from "date-fns";
import { Link } from "react-router";

export function SwiftCash() {
  const { wallet, user } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [buyAmount, setBuyAmount] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const [showBuy, setShowBuy] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await swiftCashApi.getStatus();
      setData(res);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  // KYC Required
  if (!loading && data?.kyc_required) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-amber-500 dark:text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-3">KYC Verification Required</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8">Complete identity verification to access SwiftCash Instant Earn and start earning.</p>
          <Link to="/profile?kyc=open"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5" /> Complete Verification
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const s = data?.settings || {};
  const w = data?.wallet || {};
  const task = data?.task || {};
  const canSell = data?.can_sell;
  const hasStarted = w.total_bought > 0;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(buyAmount);
    if (!amt || amt < s.min_buy_usdt) {
      toast.error(`Minimum ${s.min_buy_usdt} USDT required.`);
      return;
    }
    if (amt > parseFloat(String(wallet?.available_balance ?? 0))) {
      toast.error("Insufficient available USDT.");
      return;
    }
    setBuyLoading(true);
    try {
      const res = await swiftCashApi.buy(amt);
      toast.success(res.message);
      setBuyAmount("");
      setShowBuy(false);
      fetchStatus();
    } catch (err: any) {
      toast.error(err.message || "Buy failed.");
    } finally {
      setBuyLoading(false);
    }
  };

  const handleSell = async () => {
    setSellLoading(true);
    try {
      const res = await swiftCashApi.sell();
      toast.success(res.message);
      fetchStatus();
    } catch (err: any) {
      toast.error(err.message || "Sell failed.");
    } finally {
      setSellLoading(false);
    }
  };

  const previewSc = buyAmount ? (parseFloat(buyAmount) * s.buy_rate).toFixed(2) : "0.00";
  const sellPreviewUsdt = w.balance ? (w.balance / s.sell_rate).toFixed(2) : "0.00";
  const refProgress = Math.min((task.referral_count / task.refs_required) * 100, 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">SwiftCash</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Buy SwiftCash, complete referral tasks, sell for profit. Instant earnings.</p>
        </div>
        <button onClick={() => { setLoading(true); fetchStatus(); }}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 text-xs font-bold uppercase tracking-widest transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">SC Balance</p>
          <h3 className="text-3xl font-black text-amber-500 dark:text-amber-400 italic tracking-tighter">{fmtAmount(w.balance)}</h3>
          <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black tracking-widest uppercase mt-2 flex items-center gap-1"><Coins className="w-3 h-3" /> SwiftCash</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Referral Bonus</p>
          <h3 className="text-3xl font-black text-emerald-500 dark:text-emerald-400 italic tracking-tighter">{fmtAmount(w.referral_bonus)}</h3>
          <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black tracking-widest uppercase mt-2 flex items-center gap-1"><Gift className="w-3 h-3" /> SC Earned</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-1">Available USDT</p>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">${fmtAmount(wallet?.available_balance)}</h3>
          <p className="text-slate-400 dark:text-slate-600 text-[9px] font-black tracking-widest uppercase mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> For Buying SC</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Buy + Sell */}
        <div className="lg:col-span-7 space-y-6">

          {/* Buy Section */}
          {!showBuy ? (
            <button onClick={() => setShowBuy(true)}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-white font-black py-5 rounded-[28px] shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all text-lg uppercase italic tracking-tight">
              <ArrowDownCircle className="w-6 h-6" /> Buy SwiftCash
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-amber-200 dark:border-amber-500/20">
              <div className="flex items-center gap-3 mb-6">
                <ArrowDownCircle className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Buy SwiftCash</h3>
              </div>

              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 mb-6">
                <p className="text-amber-700 dark:text-amber-400 text-xs font-bold">
                  Rate: 1 USDT = {s.buy_rate} SC &middot; Minimum: ${s.min_buy_usdt} USDT
                </p>
              </div>

              <form onSubmit={handleBuy} className="space-y-4">
                <div>
                  <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2 block">USDT Amount</label>
                  <input type="number" required min={s.min_buy_usdt} step="0.01" placeholder={`Min ${s.min_buy_usdt}`}
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-xl font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-amber-500/50 transition-all"
                    value={buyAmount} onChange={e => setBuyAmount(e.target.value)} />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/30">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">You'll receive</span>
                    <span className="text-2xl font-black text-amber-500 dark:text-amber-400 italic">{previewSc} SC</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={buyLoading}
                    className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                    {buyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Confirm Purchase</>}
                  </button>
                  <button type="button" onClick={() => setShowBuy(false)}
                    className="px-6 py-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold rounded-2xl">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Sell Section */}
          <div className={`bg-white dark:bg-slate-900 p-8 rounded-[32px] border ${canSell ? 'border-emerald-200 dark:border-emerald-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center gap-3 mb-6">
              <ArrowUpCircle className={`w-6 h-6 ${canSell ? 'text-emerald-500' : 'text-slate-400'}`} />
              <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Sell SwiftCash</h3>
            </div>

            {!hasStarted ? (
              <p className="text-slate-400 dark:text-slate-500 text-sm">Buy SwiftCash first to start the game.</p>
            ) : !task.task_completed ? (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/30">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Complete the referral task to unlock selling. ({task.referral_count}/{task.refs_required} referrals)
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/30 flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">Sell Rate</span>
                  <span className="text-slate-600 dark:text-slate-300 text-xs font-bold">{s.sell_rate} SC = 1 USDT</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4">
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    Task complete! You can sell your entire balance of {fmtAmount(w.balance)} SC.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/30 flex justify-between items-center">
                  <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">You'll receive</span>
                  <span className="text-2xl font-black text-emerald-500 dark:text-emerald-400 italic">${sellPreviewUsdt} USDT</span>
                </div>
                <button onClick={handleSell} disabled={sellLoading || !canSell}
                  className="w-full bg-gradient-to-r from-emerald-400 to-green-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                  {sellLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><ArrowUpCircle className="w-5 h-5" /> Sell {fmtAmount(w.balance)} SC for ${sellPreviewUsdt}</>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Referral Task + History */}
        <div className="lg:col-span-5 space-y-6">

          {/* Referral Task */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-5">
              <Users className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic tracking-tighter">Referral Task</h3>
              {task.task_completed && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
              Ask {task.refs_required} direct referrals to buy SwiftCash (min ${s.min_buy_usdt} USDT each). You earn {s.ref_bonus_pct}% bonus on each purchase!
            </p>

            <div className="mb-4">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                <span>Progress</span>
                <span className={task.task_completed ? "text-emerald-500" : ""}>{task.referral_count}/{task.refs_required}</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700/30">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${refProgress}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${task.task_completed ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-cyan-400"}`}
                />
              </div>
            </div>

            {/* Step indicators */}
            <div className="flex gap-1.5">
              {Array.from({ length: task.refs_required }).map((_, i) => (
                <div key={i} className={`flex-1 h-2 rounded-full ${i < task.referral_count ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
              ))}
            </div>
          </div>

          {/* Rates Info */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic tracking-tighter flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Exchange Rates
            </h3>
            {[
              { label: "Buy Rate", value: `1 USDT = ${s.buy_rate} SC`, color: "text-amber-500 dark:text-amber-400" },
              { label: "Sell Rate", value: `${s.sell_rate} SC = 1 USDT`, color: "text-emerald-500 dark:text-emerald-400" },
              { label: "Min Buy", value: `$${s.min_buy_usdt} USDT`, color: "text-slate-600 dark:text-slate-300" },
              { label: "Min Sell", value: `${s.min_sell_sc} SC`, color: "text-slate-600 dark:text-slate-300" },
              { label: "Referral Bonus", value: `${s.ref_bonus_pct}%`, color: "text-indigo-500 dark:text-indigo-400" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{r.label}</span>
                <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
              </div>
            ))}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
            <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic tracking-tighter mb-4">History</h3>
            <div className="space-y-3">
              {data?.transactions?.length > 0 ? data.transactions.slice(0, 8).map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      tx.type === 'buy' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                      tx.type === 'sell' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' :
                      'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {tx.type === 'buy' ? <ArrowDownCircle className="w-4 h-4" /> :
                       tx.type === 'sell' ? <ArrowUpCircle className="w-4 h-4" /> :
                       <Gift className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white text-xs font-bold capitalize">{tx.type === 'referral_bonus' ? 'Ref Bonus' : tx.type}</p>
                      <p className="text-slate-400 dark:text-slate-600 text-[10px]">{format(new Date(tx.created_at), "MMM dd, HH:mm")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-black ${tx.type === 'sell' ? 'text-emerald-500' : 'text-amber-500 dark:text-amber-400'}`}>
                      {tx.type === 'sell' ? `+$${fmtAmount(tx.usdt_amount)}` : `${tx.type === 'buy' ? '-$' + fmtAmount(tx.usdt_amount) + ' → ' : '+'}${fmtAmount(tx.sc_amount)} SC`}
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 dark:text-slate-600 text-xs text-center py-6">No transactions yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
