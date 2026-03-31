import {
  ArrowLeft,
  Copy,
  CheckCircle2,
  QrCode,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import QRCodeLib from "qrcode";

interface DepositProps {
  onBack: () => void;
}

export function Deposit({ onBack }: DepositProps) {
  // Pull live user and transaction data from the global context
  const { user, transactions } = useApp();
  const [copiedAddress, setCopiedAddress] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const walletAddress = user?.trc20_address || "Generating...";
  const networkName = "TRC20 (Tron Network)";

  // Filter the global transactions list to only show deposits
  const deposits = useMemo(() => {
    return transactions.filter((tx) => tx.type === "deposit");
  }, [transactions]);

  useEffect(() => {
    generateQRCode();
  }, [walletAddress]);

  async function generateQRCode() {
    if (
      qrCanvasRef.current &&
      walletAddress &&
      walletAddress !== "Generating..."
    ) {
      try {
        await QRCodeLib.toCanvas(
          qrCanvasRef.current,
          walletAddress,
          {
            width: 280,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          },
        );
      } catch (error) {
        console.error("QR Code generation failed:", error);
      }
    }
  }

  const handleCopyAddress = () => {
    if (walletAddress === "Generating...") return;
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const formatDepositDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded">
            Completed
          </span>
        );
      case "pending":
        return (
          <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="bg-rose-500/20 text-rose-400 text-xs px-2 py-1 rounded">
            Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center w-full">
      <div className="w-full max-w-2xl bg-slate-900/30 lg:my-8 lg:rounded-3xl lg:border lg:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
          <button
            onClick={onBack}
            className="text-white hover:opacity-80"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold text-lg">
            Deposit USDT
          </h1>
          <div className="w-6"></div>
        </div>

        <div className="p-4 space-y-4">
          {/* QR Code Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
            <div className="text-center mb-6">
              <QrCode className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
              <h2 className="text-white text-xl font-bold mb-2">
                Scan QR Code
              </h2>
              <p className="text-slate-400 text-sm">
                Send USDT to this address using {networkName}
              </p>
            </div>

            {/* QR Code Display */}
            <div className="bg-white rounded-2xl p-6 mb-6">
              <div className="aspect-square bg-white rounded-lg flex items-center justify-center">
                <canvas
                  ref={qrCanvasRef}
                  className="w-full h-full max-w-[280px]"
                ></canvas>
              </div>
            </div>

            {/* Network Badge */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 mb-4 text-center">
              <p className="text-cyan-400 text-sm font-bold">
                {networkName}
              </p>
            </div>
          </div>

          {/* Wallet Address Card */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-white font-bold mb-4">
              Deposit Address
            </h3>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <p className="text-slate-400 text-xs mb-2">
                WALLET ADDRESS
              </p>
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-3 mb-3">
                <p className="text-white text-sm break-all font-mono text-center">
                  {walletAddress}
                </p>
              </div>

              <button
                onClick={handleCopyAddress}
                className="w-full bg-cyan-500/20 border border-cyan-500 text-cyan-400 font-bold py-3 rounded-lg hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-2"
              >
                {copiedAddress ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Address
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" /> Copy Address
                  </>
                )}
              </button>
            </div>

            {/* Minimum Deposit */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 text-sm">
                  Minimum Deposit
                </span>
                <span className="text-emerald-400 font-bold">
                  10 USDT
                </span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-6 h-6 text-orange-400" />
              <h3 className="text-orange-400 font-bold">
                Important Notes
              </h3>
            </div>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">
                  •
                </span>
                <p>
                  Only send USDT to this address using the TRC20
                  network
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">
                  •
                </span>
                <p>
                  Sending any other token or using a different
                  network may result in permanent loss
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-orange-400 font-bold">
                  •
                </span>
                <p>
                  Minimum deposit is 10 USDT. Deposits below
                  this amount will not be credited
                </p>
              </div>
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-white font-bold mb-4">
              Recent Deposits
            </h3>

            <div className="space-y-3">
              {deposits.length > 0 ? (
                deposits.slice(0, 5).map((deposit) => (
                  <div
                    key={deposit.id}
                    className="bg-slate-800/50 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-emerald-400 font-bold">
                        +{parseFloat(deposit.amount).toFixed(2)}{" "}
                        USDT
                      </span>
                      {getStatusBadge(deposit.status)}
                    </div>
                    <p className="text-slate-400 text-xs">
                      {formatDepositDate(deposit.created_at)}
                    </p>
                    {/* Note: Changed tx_hash to txid to match our backend database column! */}
                    {deposit.txid && (
                      <p className="text-slate-500 text-xs font-mono mt-1">
                        TX: {deposit.txid.slice(0, 6)}...
                        {deposit.txid.slice(-6)}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm">
                  No recent deposits found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}