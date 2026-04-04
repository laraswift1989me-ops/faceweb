import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { swiftCashApi } from "../../services/api";
import { motion, AnimatePresence } from "motion/react";
import {
  Coins, ArrowDownCircle, ArrowUpCircle, Users, CheckCircle2, Lock,
  Loader2, Gift, TrendingUp, Sparkles, ShieldCheck, Zap, RefreshCw,
  CircleDollarSign, ArrowRight, Copy, Share2,
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

  const fetchStatus = async () => {
    try {
      const res = await swiftCashApi.getStatus();
      setData(res);
    } catch { /* silent */ }
    setLoading(false);
  };

  useEffect(() => { fetchStatus(); }, []);

  // KYC required
  if (!loading && data?.kyc_required) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 animate-in fade-in duration-700">
        <div className="text-center bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 p-10">
          <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-500/10 border-2 border-amber-200 dark:border-amber-500/30 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-3">Verification Required</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-sm mx-auto">Complete KYC verification to unlock SwiftCash Instant Earn game.</p>
          <Link to="/profile?kyc=open"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/20 transition-all hover:opacity-90">
            <ShieldCheck className="w-5 h-5" /> Complete Verification
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="flex items-center justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>;

  const s = data?.settings || { buy_rate: 1.8, sell_rate: 1.9, min_buy_usdt: 10, min_sell_sc: 180, ref_bonus_pct: 25, refs_required: 5 };
  const w = data?.wallet || { balance: 0, total_bought: 0, referral_bonus: 0, total_sold: 0 };
  const task = data?.task || { referral_count: 0, refs_required: 5, task_completed: false };
  const canSell = !!data?.can_sell;
  const hasStarted = (w.total_bought || 0) > 0;
  const gameComplete = (w.total_sold || 0) > 0;
  const buyRate = s.buy_rate || 1.8;
  const sellRate = s.sell_rate || 1.9;
  const minBuy = s.min_buy_usdt || 10;

  const previewSc = buyAmount ? (parseFloat(buyAmount) * buyRate).toFixed(2) : "0.00";
  const sellPreviewUsdt = w.balance > 0 ? (w.balance / sellRate).toFixed(2) : "0.00";

  // Step logic: 1=Buy, 2=Referral Task, 3=Sell
  const currentStep = !hasStarted ? 1 : !task.task_completed ? 2 : 3;

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(buyAmount);
    if (!amt || amt < minBuy) { toast.error(`Minimum $${minBuy} USDT required.`); return; }
    if (amt > parseFloat(String(wallet?.available_balance ?? 0))) { toast.error("Insufficient available USDT."); return; }
    setBuyLoading(true);
    try {
      const res = await swiftCashApi.buy(amt);
      toast.success(res.message);
      setBuyAmount("");
      fetchStatus();
    } catch (err: any) { toast.error(err.message || "Purchase failed."); }
    finally { setBuyLoading(false); }
  };

  const handleSell = async () => {
    setSellLoading(true);
    try {
      const res = await swiftCashApi.sell();
      toast.success(res.message);
      fetchStatus();
    } catch (err: any) { toast.error(err.message || "Sell failed."); }
    finally { setSellLoading(false); }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(user?.referral_code || "");
    toast.success("Referral code copied!");
  };

  const txs = data?.transactions || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">SwiftCash Instant Earn</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Buy · Refer · Sell · Earn</p>
          </div>
        </div>
        <button onClick={() => { setLoading(true); fetchStatus(); }} className="p-2 text-slate-400 hover:text-cyan-500 transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Step Progress Indicator */}
      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 p-5">
        <div className="flex items-center gap-0">
          {[
            { n: 1, label: "Buy SC", icon: CircleDollarSign, done: hasStarted },
            { n: 2, label: "Refer 5", icon: Users, done: task.task_completed },
            { n: 3, label: "Sell & Earn", icon: TrendingUp, done: gameComplete },
          ].map((step, i, arr) => (
            <div key={step.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all
                  ${step.done ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : currentStep === step.n ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"}`}>
                  {step.done ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-[9px] font-black tracking-widest uppercase mt-2 ${step.done ? "text-emerald-500" : currentStep === step.n ? "text-amber-500" : "text-slate-400 dark:text-slate-600"}`}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`h-0.5 w-full mx-2 mb-5 rounded-full ${step.done ? "bg-emerald-500/50" : "bg-slate-200 dark:bg-slate-800"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Balance Strip */}
      {hasStarted && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "SC Balance", value: fmtAmount(w.balance), color: "text-amber-500 dark:text-amber-400", icon: Coins },
            { label: "Ref Bonus", value: fmtAmount(w.referral_bonus), color: "text-indigo-500 dark:text-indigo-400", icon: Gift },
            { label: "USDT Available", value: `$${fmtAmount(wallet?.available_balance)}`, color: "text-slate-900 dark:text-white", icon: CircleDollarSign },
          ].map(c => (
            <div key={c.label} className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-1.5 mb-1"><c.icon className="w-3 h-3 text-slate-400" /><span className="text-slate-400 dark:text-slate-500 text-[9px] font-black tracking-widest uppercase">{c.label}</span></div>
              <p className={`text-xl lg:text-2xl font-black italic tracking-tighter ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════ STEP 1: BUY ═══════════════ */}
      <motion.div layout className={`bg-white dark:bg-slate-900 rounded-[32px] border-2 transition-colors overflow-hidden
        ${currentStep === 1 ? "border-amber-300 dark:border-amber-500/40 shadow-xl shadow-amber-500/10" : "border-slate-200 dark:border-slate-800"}`}>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${hasStarted ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                {hasStarted ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Buy SwiftCash</h3>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              <span className="text-amber-500 text-[10px] font-black">1 USDT = {buyRate} SC</span>
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-6 ml-11">Convert your available USDT to SwiftCash tokens to start the Instant Earn game.</p>

          <form onSubmit={handleBuy} className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <CircleDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input type="number" required min={minBuy} step="0.01" placeholder={`Min $${minBuy} USDT`}
                  className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-lg font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-amber-500/50 transition-all"
                  value={buyAmount} onChange={e => setBuyAmount(e.target.value)} />
              </div>
              <button type="submit" disabled={buyLoading}
                className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black px-6 lg:px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50 transition-all hover:opacity-90 shrink-0">
                {buyLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Buy</>}
              </button>
            </div>

            {buyAmount && parseFloat(buyAmount) > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 text-xs font-bold">You'll receive</span>
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  <span className="text-xl font-black text-amber-500 italic">{previewSc} SC</span>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>

      {/* ═══════════════ STEP 2: REFERRAL TASK ═══════════════ */}
      <motion.div layout className={`bg-white dark:bg-slate-900 rounded-[32px] border-2 transition-colors overflow-hidden
        ${currentStep === 2 ? "border-indigo-300 dark:border-indigo-500/40 shadow-xl shadow-indigo-500/10" : !hasStarted ? "opacity-50 pointer-events-none border-slate-200 dark:border-slate-800" : "border-slate-200 dark:border-slate-800"}`}>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${task.task_completed ? "bg-emerald-500 text-white" : currentStep === 2 ? "bg-indigo-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
                {task.task_completed ? <CheckCircle2 className="w-4 h-4" /> : "2"}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Referral Task</h3>
            </div>
            <span className={`text-xs font-black ${task.task_completed ? "text-emerald-500" : "text-indigo-500 dark:text-indigo-400"}`}>
              {task.referral_count || 0}/{task.refs_required || 5}
            </span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-5 ml-11">
            Invite {task.refs_required || 5} direct referrals to buy SwiftCash (min ${minBuy}). Earn <span className="text-indigo-500 font-black">{s.ref_bonus_pct || 25}%</span> SC bonus on each!
          </p>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(((task.referral_count || 0) / (task.refs_required || 5)) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${task.task_completed ? "bg-emerald-500" : "bg-gradient-to-r from-indigo-500 to-cyan-400"}`}
              />
            </div>
          </div>

          {/* Step dots */}
          <div className="flex gap-2 mb-5">
            {Array.from({ length: task.refs_required || 5 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-full h-2.5 rounded-full transition-all ${i < (task.referral_count || 0) ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"}`} />
                <span className={`text-[8px] font-black ${i < (task.referral_count || 0) ? "text-emerald-500" : "text-slate-400 dark:text-slate-600"}`}>
                  #{i + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Share referral code */}
          {hasStarted && !task.task_completed && (
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded-2xl p-4">
              <p className="text-indigo-700 dark:text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-2">Your Referral Code</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl px-4 py-3 font-mono text-sm font-bold text-slate-900 dark:text-white border border-indigo-200 dark:border-indigo-500/20">
                  {user?.referral_code || "—"}
                </div>
                <button onClick={copyCode} className="p-3 bg-indigo-500 text-white rounded-xl hover:bg-indigo-400 transition-colors"><Copy className="w-4 h-4" /></button>
                <button onClick={copyCode} className="p-3 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"><Share2 className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {!hasStarted && (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/30 flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">Buy SwiftCash first to unlock this step.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══════════════ STEP 3: SELL & EARN ═══════════════ */}
      <motion.div layout className={`bg-white dark:bg-slate-900 rounded-[32px] border-2 transition-colors overflow-hidden
        ${currentStep === 3 ? "border-emerald-300 dark:border-emerald-500/40 shadow-xl shadow-emerald-500/10" : !task.task_completed ? "opacity-50 pointer-events-none border-slate-200 dark:border-slate-800" : "border-slate-200 dark:border-slate-800"}`}>
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${gameComplete ? "bg-emerald-500 text-white" : currentStep === 3 ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-400"}`}>
                {gameComplete ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Sell & Earn USDT</h3>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
              <span className="text-emerald-500 text-[10px] font-black">{sellRate} SC = 1 USDT</span>
            </div>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mb-6 ml-11">Sell your SwiftCash balance (including referral bonuses) for USDT at the sell rate.</p>

          {canSell ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-5 text-center">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black tracking-widest uppercase mb-1">You'll Receive</p>
                <p className="text-4xl font-black text-emerald-500 italic tracking-tighter">${sellPreviewUsdt}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">for {fmtAmount(w.balance)} SwiftCash</p>
              </div>
              <button onClick={handleSell} disabled={sellLoading}
                className="w-full bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 disabled:opacity-50 transition-all text-lg">
                {sellLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><ArrowUpCircle className="w-6 h-6" /> Sell {fmtAmount(w.balance)} SC for ${sellPreviewUsdt} USDT</>}
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/30 flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-400 shrink-0" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                {!hasStarted ? "Buy SwiftCash and complete referral task first." : "Complete the referral task to unlock selling."}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Rates + History side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rates */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic tracking-tighter flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-cyan-500" /> Exchange Rates
          </h3>
          {[
            { label: "Buy Rate", value: `1 USDT = ${buyRate} SC`, color: "text-amber-500" },
            { label: "Sell Rate", value: `${sellRate} SC = 1 USDT`, color: "text-emerald-500" },
            { label: "Min Purchase", value: `$${minBuy} USDT`, color: "text-slate-600 dark:text-slate-300" },
            { label: "Min to Sell", value: `${s.min_sell_sc || 180} SC`, color: "text-slate-600 dark:text-slate-300" },
            { label: "Ref Bonus", value: `${s.ref_bonus_pct || 25}% SC`, color: "text-indigo-500" },
            { label: "Refs Needed", value: `${task.refs_required || 5} referrals`, color: "text-indigo-500" },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-1">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">{r.label}</span>
              <span className={`text-xs font-bold ${r.color}`}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200 dark:border-slate-800">
          <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic tracking-tighter mb-4">Transaction History</h3>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {txs.length > 0 ? txs.map((tx: any) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    tx.type === 'buy' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' :
                    tx.type === 'sell' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' :
                    'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500'}`}>
                    {tx.type === 'buy' ? <ArrowDownCircle className="w-4 h-4" /> : tx.type === 'sell' ? <ArrowUpCircle className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-xs font-bold capitalize">{tx.type === 'referral_bonus' ? 'Ref Bonus' : tx.type}</p>
                    <p className="text-slate-400 dark:text-slate-600 text-[10px]">{format(new Date(tx.created_at), "MMM dd, HH:mm")}</p>
                  </div>
                </div>
                <p className={`text-xs font-black ${tx.type === 'sell' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {tx.type === 'sell' ? `+$${fmtAmount(tx.usdt_amount)}` : tx.type === 'buy' ? `-$${fmtAmount(tx.usdt_amount)}` : `+${fmtAmount(tx.sc_amount)} SC`}
                </p>
              </div>
            )) : (
              <p className="text-slate-400 dark:text-slate-600 text-xs text-center py-8">No transactions yet. Buy SwiftCash to get started!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
