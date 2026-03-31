import {
  Copy,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  Gift,
  CheckCircle2,
  Wallet,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";

interface WalletCardProps {
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export function WalletCard({
  onDeposit,
  onWithdraw,
}: WalletCardProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Pull all live financial data from the global context
  const { user, wallet, transactions } = useApp();

  // Safely fallback to 0 if data is still loading
  const availableBalance = wallet?.available || 0;
  const lockedBalance = wallet?.locked || 0;
  const totalBalance = wallet?.total || 0;

  const trc20Address = user?.trc20_address || "";
  const trc20AddressShort = trc20Address
    ? `${trc20Address.slice(0, 5)}...${trc20Address.slice(-4)}`
    : "Generating...";

  const kycStatus = user?.kyc_status
    ? user.kyc_status.charAt(0).toUpperCase() +
      user.kyc_status.slice(1)
    : "Unverified";

  // Dynamically calculate Stats from the Transactions Array
  const { totalProfit, totalDeposits } = useMemo(() => {
    let profit = 0;
    let deposits = 0;

    transactions.forEach((tx) => {
      const amount = parseFloat(tx.amount);
      if (tx.type === "deposit") deposits += amount;
      if (
        [
          "harvest_stake",
          "referral_bonus",
          "task_reward",
        ].includes(tx.type)
      )
        profit += amount;
    });

    return { totalProfit: profit, totalDeposits: deposits };
  }, [transactions]);

  const handleCopyAddress = () => {
    if (!trc20Address) return;
    navigator.clipboard.writeText(trc20Address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const getTransactionDetails = (type: string) => {
    switch (type) {
      case "withdrawal":
        return {
          icon: (
            <ArrowUpFromLine className="w-5 h-5 text-red-400" />
          ),
          name: "Withdrawal",
        };
      case "deposit":
        return {
          icon: (
            <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
          ),
          name: "USDT Deposit",
        };
      case "harvest_stake":
        return {
          icon: (
            <TrendingUp className="w-5 h-5 text-cyan-400" />
          ),
          name: "Profit Harvest",
        };
      case "referral_bonus":
        return {
          icon: <Gift className="w-5 h-5 text-purple-400" />,
          name: "Referral Bonus",
        };
      case "task_reward":
        return {
          icon: (
            <CheckCircle2 className="w-5 h-5 text-blue-400" />
          ),
          name: "Task Reward",
        };
      default:
        return {
          icon: <Wallet className="w-5 h-5 text-slate-400" />,
          name: "Transaction",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-[32px] lg:rounded-[40px] p-6 lg:p-8 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white text-xl lg:text-2xl font-bold">
            My Wallet
          </h2>
          <div
            className={`border px-3 py-1 lg:px-4 lg:py-2 rounded-full flex items-center gap-2 ${
              kycStatus === "Verified"
                ? "bg-emerald-500/20 border-emerald-500/50"
                : "bg-orange-500/20 border-orange-500/50"
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 ${kycStatus === "Verified" ? "text-emerald-400" : "text-orange-400"}`}
            />
            <span
              className={`text-xs lg:text-sm font-bold ${kycStatus === "Verified" ? "text-emerald-400" : "text-orange-400"}`}
            >
              {kycStatus}
            </span>
          </div>
        </div>

        {/* Total Balance */}
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl lg:rounded-3xl p-6 lg:p-10 mb-8">
          <p className="text-slate-400 text-sm lg:text-base mb-2">
            Total Balance
          </p>
          <p className="text-white text-4xl lg:text-5xl font-black mb-6">
            ${totalBalance.toFixed(2)}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5">
              <p className="text-slate-500 text-[10px] lg:text-xs uppercase tracking-widest font-bold mb-1">
                Available
              </p>
              <p className="text-emerald-400 text-lg lg:text-xl font-bold">
                ${availableBalance.toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5">
              <p className="text-slate-500 text-[10px] lg:text-xs uppercase tracking-widest font-bold mb-1">
                Locked (72h)
              </p>
              <p className="text-orange-400 text-lg lg:text-xl font-bold">
                ${lockedBalance.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Wallet Address */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-2">
            TRC20 Wallet Address
          </p>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm">
                  {trc20AddressShort}
                </p>
                <p className="text-slate-500 text-xs">
                  Tron Network (TRC20)
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyAddress}
              className="ml-2 p-2 bg-cyan-500/20 border border-cyan-500 rounded-lg hover:bg-cyan-500/30 transition-colors flex-shrink-0"
            >
              {copiedAddress ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <Copy className="w-4 h-4 text-cyan-400" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDeposit}
            className="bg-gradient-to-r from-emerald-400 to-green-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <ArrowDownToLine className="w-5 h-5" />
            Deposit
          </button>
          <button
            onClick={onWithdraw}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <ArrowUpFromLine className="w-5 h-5" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
        <h3 className="text-white font-bold mb-4">Overview</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">
                  Total Profit Earned
                </p>
                <p className="text-emerald-400 font-bold text-lg">
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <ArrowDownToLine className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">
                  Total Deposits
                </p>
                <p className="text-cyan-400 font-bold text-lg">
                  ${totalDeposits.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">
            Recent Transactions
          </h3>
          <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 flex items-center gap-1">
            View All
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {transactions.slice(0, 5).map((tx) => {
            const details = getTransactionDetails(tx.type);
            const amount = parseFloat(tx.amount);
            const dateObj = new Date(tx.created_at);

            return (
              <div
                key={tx.id}
                className="bg-slate-800/50 rounded-xl p-4 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {details.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-white font-medium text-sm">
                        {details.name}
                      </p>
                      <p
                        className={`font-bold ${amount < 0 ? "text-red-400" : "text-emerald-400"}`}
                      >
                        {amount > 0 ? "+" : ""}
                        {amount.toFixed(2)} USDT
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-xs">
                        {dateObj.toLocaleDateString()} •{" "}
                        {dateObj.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded capitalize ${
                          tx.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : tx.status === "cooling_down"
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-slate-500/20 text-slate-400"
                        }`}
                      >
                        {tx.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {transactions.length === 0 && (
            <div className="text-center py-6 text-slate-500 text-sm">
              No transactions yet. Make a deposit to start
              earning!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}