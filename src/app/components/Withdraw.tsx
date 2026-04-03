import {
  ArrowLeft,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { walletApi } from "../../services/api";
import { toast } from "sonner";

interface WithdrawProps {
  onBack: () => void;
}

export function Withdraw({ onBack }: WithdrawProps) {
  const { user, wallet, transactions, refreshAll } = useApp();
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");
  const [ownershipVerified, setOwnershipVerified] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const availableBalance = wallet?.available || 0;
  const minWithdraw = 35; // Minimum withdrawal amount
  const withdrawalFee = parseFloat(amount) >= 150 ? 0 : 3; // $0 for ≥$150, $3 otherwise

  // Filter global transactions to only show withdrawals
  const withdrawals = useMemo(() => {
    return transactions.filter(
      (tx) => tx.type === "withdrawal",
    );
  }, [transactions]);

  const handleMaxAmount = () => {
    const max = availableBalance - withdrawalFee;
    if (max > 0) setAmount(max.toFixed(2));
  };

  const handleWithdraw = async () => {
    if (!ownershipVerified) {
      toast.error("Please verify wallet ownership");
      return;
    }
    if (parseFloat(amount) < minWithdraw) {
      toast.error(
        `Minimum withdrawal amount is ${minWithdraw} USDT`,
      );
      return;
    }
    if (parseFloat(amount) > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    try {
      setLoading(true);
      // Calls the correct backend payload
      await walletApi.requestWithdrawal({
        amount: parseFloat(amount),
        wallet_address: withdrawAddress,
      });

      toast.success(
        "Withdrawal request submitted successfully!",
      );

      setWithdrawAddress("");
      setAmount("");
      setPassword("");
      setOwnershipVerified(false);

      // Instantly refresh balances and transaction history
      await refreshAll();
    } catch (error: any) {
      toast.error(error.message || "Withdrawal request failed");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "processing":
        return (
          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
            Processing
          </span>
        );
      case "pending":
        return (
          <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded">
            Pending Approval
          </span>
        );
      case "failed":
      case "rejected":
        return (
          <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-1 rounded">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center w-full">
      <div className="w-full max-w-2xl bg-slate-900/30 lg:my-8 lg:rounded-3xl lg:border lg:border-slate-800">
        <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
          <button
            onClick={onBack}
            className="text-white hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold text-lg">
            Withdraw USDT
          </h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4 space-y-4">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Wallet className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-slate-400 text-sm">
                  Available Balance
                </p>
                <p className="text-white text-2xl font-bold">
                  ${availableBalance.toFixed(2)} USDT
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">
                  Min Withdraw
                </p>
                <p className="text-white font-bold">
                  ${minWithdraw} USDT
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-slate-400 text-xs mb-1">
                  Network Fee
                </p>
                <p className="text-orange-400 font-bold">
                  {parseFloat(amount) >= 150 ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : "$3 USDT"}
                </p>
                <p className="text-slate-500 text-[10px] mt-0.5">$0 for ≥$150</p>
              </div>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-white font-bold mb-4">
              Withdrawal Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm mb-2 block">
                  Destination Wallet Address (TRC20)
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) =>
                    setWithdrawAddress(e.target.value)
                  }
                  placeholder="Enter TRC20 wallet address"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 font-mono text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-slate-300 text-sm">
                    Withdrawal Amount
                  </label>
                  <button
                    onClick={handleMaxAmount}
                    className="text-cyan-400 text-xs font-medium hover:text-cyan-300"
                  >
                    MAX
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500"
                    step="0.01"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    USDT
                  </span>
                </div>
                {amount && (
                  <p className="text-slate-400 text-xs mt-2">
                    You will receive:{" "}
                    <span className="text-emerald-400 font-bold">
                      {Math.max(
                        0,
                        parseFloat(amount) - withdrawalFee,
                      ).toFixed(2)}{" "}
                      USDT
                    </span>
                  </p>
                )}
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ownershipVerified}
                    onChange={(e) =>
                      setOwnershipVerified(e.target.checked)
                    }
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <p className="text-white font-medium text-sm mb-1">
                      I verify ownership of this wallet
                    </p>
                    <p className="text-slate-400 text-[10px] leading-tight">
                      I confirm that I own and have access to
                      the destination wallet address. Sending
                      funds to an incorrect network will result
                      in permanent loss.
                    </p>
                  </div>
                </label>
              </div>

              <button
                onClick={handleWithdraw}
                disabled={
                  !withdrawAddress ||
                  !amount ||
                  !ownershipVerified ||
                  loading
                }
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : "Submit Withdrawal"}
              </button>
            </div>
          </div>

          {/* History */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-white font-bold mb-4">
              Withdrawal Ledger
            </h3>
            <div className="space-y-3">
              {withdrawals.length > 0 ? (
                withdrawals.slice(0, 5).map((w) => (
                  <div
                    key={w.id}
                    className="bg-slate-800/50 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-red-400 font-bold">
                        -{Math.abs(parseFloat(w.amount))} USDT
                      </span>
                      {getStatusBadge(w.status)}
                    </div>
                    <p className="text-slate-400 text-xs mb-2">
                      {formatDate(w.created_at)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No withdrawals found
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}