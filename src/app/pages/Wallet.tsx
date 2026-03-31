import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, Copy, QrCode, ShieldAlert, History, RefreshCw, X, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle, ExternalLink, Lock } from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import { format } from "date-fns";

export function Wallet() {
  const { wallet, transactions, refreshAll, user, withdraw, unfreeze } = useApp();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Withdraw Form
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");

  useEffect(() => {
    refreshAll();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(withdrawAmount);
    
    if (amountNum < 30) {
      toast.error("Minimum withdrawal is $30");
      return;
    }

    if (amountNum > parseFloat(wallet?.available_balance || "0")) {
      toast.error("Insufficient available balance");
      return;
    }

    setLoading(true);
    try {
      await withdraw(amountNum, withdrawAddress);
      toast.success("Withdrawal request submitted successfully!");
      setShowWithdraw(false);
      setWithdrawAmount("");
      setWithdrawAddress("");
    } catch (err: any) {
      toast.error(err.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUnfreeze = async () => {
    if ((user?.level || 0) < 50) {
      toast.error("Unfreeze request requires Level 50 maturity");
      return;
    }

    setLoading(true);
    try {
      await unfreeze(parseFloat(wallet?.freezed_balance || "0"));
      toast.success("Unfreeze request submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Unfreeze request failed");
    } finally {
      setLoading(false);
    }
  };

  const receiveAmount = parseFloat(withdrawAmount) ? (parseFloat(withdrawAmount) - 3).toFixed(2) : "0.00";

  return (
    <div className="space-y-8 lg:space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-2">Vault & Assets</h1>
          <p className="text-slate-400 font-medium tracking-wide">Manage your liquidity, staking locks, and secure TRC20 transactions.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowDeposit(true)}
            className="bg-white text-slate-950 font-black italic tracking-tighter px-8 py-4 rounded-2xl hover:bg-cyan-400 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
          >
            <ArrowDownLeft className="w-5 h-5" /> DEPOSIT
          </button>
          <button 
            onClick={() => setShowWithdraw(true)}
            className="bg-slate-800 text-white font-black italic tracking-tighter px-8 py-4 rounded-2xl hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-2"
          >
            <ArrowUpRight className="w-5 h-5" /> WITHDRAW
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: BALANCES & UNFREEZE */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5"><CheckCircle2 className="w-20 h-20 text-emerald-400" /></div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Available</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">${wallet?.available_balance || "0.00"}</h3>
              <p className="text-emerald-400 text-[9px] font-black tracking-widest uppercase mt-4">Unrestricted Liquidity</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5"><Lock className="w-20 h-20 text-cyan-400" /></div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Locked</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">${wallet?.locked_balance || "0.00"}</h3>
              <p className="text-cyan-400 text-[9px] font-black tracking-widest uppercase mt-4">Staking AI Pool</p>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] border border-slate-700/50 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldAlert className="w-20 h-20 text-blue-400" /></div>
              <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-2">Freezed</p>
              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">${wallet?.freezed_balance || "0.00"}</h3>
              <button 
                onClick={handleUnfreeze}
                disabled={(user?.level || 0) < 50 || parseFloat(wallet?.freezed_balance || "0") === 0}
                className={`mt-4 w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  (user?.level || 0) >= 50 && parseFloat(wallet?.freezed_balance || "0") > 0
                  ? "bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                  : "bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {(user?.level || 0) < 50 ? "LEVEL 50 REQUIRED" : "UNFREEZE REQUEST"}
              </button>
            </div>
          </div>

          <section className="bg-slate-900/50 backdrop-blur-md p-8 rounded-[40px] border border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                <History className="w-5 h-5 text-slate-400" />
                Ledger Operations
              </h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Real-time Sync</span>
              </div>
            </div>

            <div className="space-y-4">
              {transactions?.map((tx: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-800/20 rounded-3xl border border-slate-700/20 group hover:border-slate-600 transition-all">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      tx.type === "deposit" ? "bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5" : "bg-rose-500/10 text-rose-400 shadow-lg shadow-rose-500/5"
                    }`}>
                      {tx.type === "deposit" ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-white font-bold italic uppercase tracking-tight">{tx.description || "TRC20 Transaction"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-slate-500 text-[10px] font-medium">{format(new Date(tx.created_at || Date.now()), "MMM dd, yyyy • HH:mm")}</p>
                        <span className="w-1 h-1 bg-slate-700 rounded-full" />
                        <p className="text-slate-600 text-[10px] font-mono">{tx.id.toString().padStart(6, '0')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black italic tracking-tighter ${
                      tx.type === "deposit" ? "text-emerald-400" : "text-rose-400"
                    }`}>
                      {tx.type === "deposit" ? "+" : "-"}${tx.amount}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-1">
                      {tx.status === "completed" ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />}
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{tx.status}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!transactions || transactions.length === 0) && (
                <div className="text-center py-20 bg-slate-800/10 rounded-[32px] border border-dashed border-slate-800">
                  <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-600 text-sm font-black uppercase tracking-widest italic">No Ledger Records Found</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: WALLET INFO */}
        <div className="lg:col-span-4 space-y-8">
          
          <section className="bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-slate-950 p-8 rounded-[40px] border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <ShieldCheck className="w-32 h-32 text-cyan-400" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <WalletIcon className="w-6 h-6 text-cyan-400" />
                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Secure Address</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-950/80 p-6 rounded-[32px] border border-slate-800/50 flex flex-col items-center">
                  <div className="p-4 bg-white rounded-3xl mb-6 shadow-2xl shadow-white/5">
                    <QRCodeSVG value={wallet?.trc20_address || "T..."} size={160} />
                  </div>
                  <p className="text-slate-500 text-[10px] font-black tracking-widest uppercase mb-3">TRC20 USDT DEPOSIT ADDRESS</p>
                  <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between group/addr">
                    <p className="text-white text-xs font-mono truncate max-w-[200px]">{wallet?.trc20_address || "T..."}</p>
                    <button 
                      onClick={() => copyToClipboard(wallet?.trc20_address || "", "Address")}
                      className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-slate-900/40 rounded-[32px] border border-slate-800/50 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-xs uppercase italic">Deposit Rule</p>
                      <p className="text-slate-500 text-[10px] mt-1 leading-relaxed">Only send TRC20 USDT to this address. Other assets will be permanently lost.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900/50 p-8 rounded-[40px] border border-slate-800/50">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 italic">Security Protocol</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-black uppercase">Withdrawal Min</span>
                <span className="text-white text-xs font-bold">$30.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-black uppercase">Network Fee</span>
                <span className="text-rose-400 text-xs font-bold">$3.00 Flat</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-black uppercase">Processing</span>
                <span className="text-cyan-400 text-[10px] font-black">2-12 HOURS</span>
              </div>
              <div className="h-[1px] bg-slate-800 my-2" />
              <div className="flex items-center justify-between">
                <span className="text-slate-500 text-[10px] font-black uppercase">Encryption</span>
                <span className="text-emerald-400 text-[9px] font-black tracking-widest uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> SSL SECURE
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdraw(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[40px] p-8 lg:p-10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/30 text-rose-400">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">Secure Withdrawal</h3>
                    <p className="text-rose-400 text-[10px] font-black tracking-widest uppercase">Available: ${wallet?.available_balance || "0.00"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowWithdraw(false)}
                  className="p-2 bg-slate-800/50 rounded-xl text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div className="space-y-4">
                  <label className="text-slate-500 text-xs font-black tracking-widest uppercase">Amount to Withdraw</label>
                  <div className="relative group">
                    <input
                      type="number"
                      placeholder="0.00"
                      required
                      min="30"
                      step="0.01"
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-5 px-6 text-2xl font-black italic text-white placeholder:text-slate-700 outline-none focus:border-rose-500/50 transition-all"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black italic">USDT</span>
                  </div>
                  
                  <label className="text-slate-500 text-xs font-black tracking-widest uppercase">Recipient TRC20 Address</label>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Enter TRC20 address (T...)"
                      required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-5 px-6 text-sm font-mono text-white placeholder:text-slate-700 outline-none focus:border-rose-500/50 transition-all"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-slate-950/50 rounded-3xl p-6 border border-slate-800/50 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-500">Network Processing Fee</span>
                    <span className="text-rose-400">$3.00 USDT</span>
                  </div>
                  <div className="h-[1px] bg-slate-800" />
                  <div className="flex justify-between items-center">
                    <p className="text-slate-500 text-xs font-black tracking-widest uppercase">Total Settlement</p>
                    <p className="text-white text-2xl font-black italic tracking-tighter">
                      ${receiveAmount}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !withdrawAmount || !withdrawAddress || parseFloat(withdrawAmount) < 30}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><ShieldCheck className="w-6 h-6" /> INITIATE WITHDRAWAL</>}
                </button>

                <p className="text-slate-600 text-[10px] text-center font-black uppercase tracking-[0.2em]">Transaction requires TRC20 blockchain validation</p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Deposit Modal */}
      <AnimatePresence>
        {showDeposit && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeposit(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[40px] p-8 lg:p-10 shadow-2xl flex flex-col items-center"
            >
              <button 
                onClick={() => setShowDeposit(false)}
                className="absolute top-6 right-6 p-2 bg-slate-800/50 rounded-xl text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/30 text-cyan-400 mb-6">
                <QrCode className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-2">Deposit Assets</h3>
              <p className="text-slate-500 text-xs font-medium text-center mb-8">Scan the QR code or copy the address below to deposit TRC20 USDT.</p>

              <div className="p-4 bg-white rounded-3xl mb-8 shadow-2xl">
                <QRCodeSVG value={wallet?.trc20_address || "T..."} size={200} />
              </div>

              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-5 flex items-center justify-between mb-8">
                <div className="overflow-hidden">
                  <p className="text-slate-600 text-[10px] font-black tracking-widest uppercase mb-1">Your Deposit Address</p>
                  <p className="text-white text-xs font-mono truncate max-w-[240px]">{wallet?.trc20_address || "T..."}</p>
                </div>
                <button 
                  onClick={() => copyToClipboard(wallet?.trc20_address || "", "Address")}
                  className="p-3 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>

              <div className="w-full p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-amber-500/80 text-[10px] font-bold leading-relaxed">
                  DEPOSIT ONLY TRC20 USDT. Minimum deposit: $1. Deposits are automatically credited after 1 blockchain confirmation.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
