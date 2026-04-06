import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../../../context/AppContext";
import { authApi } from "../../../services/api";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, ArrowRight, RefreshCw, X, KeyRound, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "../../components/ThemeToggle";
import { APP_NAME } from "../../../config";

type ResetStep = "email" | "otp" | "done";

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Forgot password state
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success(`Welcome back to ${APP_NAME}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await authApi.forgotPassword({ email: resetEmail });
      toast.success("If the email exists, a reset code has been sent.");
      setResetStep("otp");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset code.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword !== resetConfirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setResetLoading(true);
    try {
      await authApi.resetPassword({
        email: resetEmail,
        otp: resetOtp,
        password: resetPassword,
        password_confirmation: resetConfirm,
      });
      toast.success("Password reset! Please log in.");
      setResetStep("done");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    setShowReset(false);
    setResetStep("email");
    setResetEmail("");
    setResetOtp("");
    setResetPassword("");
    setResetConfirm("");
  };

  const inputCls = "w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute top-5 right-5 z-10"><ThemeToggle /></div>
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/50 rounded-[40px] p-8 lg:p-10 shadow-2xl relative">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white font-black text-3xl italic">S</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Secure Login</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium tracking-wide">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                <input type="email" placeholder="Email Address" required className={inputCls}
                  value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                <input type="password" placeholder="Password" required className={inputCls}
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>

            {/* Forgot password link */}
            <div className="text-right">
              <button type="button" onClick={() => setShowReset(true)}
                className="text-cyan-500 dark:text-cyan-400 text-xs font-bold hover:underline">
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group transition-all disabled:opacity-50">
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><span>SECURE ACCESS</span><ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800/50 text-center space-y-4">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              New to {APP_NAME}?{" "}
              <Link to="/register" className="text-cyan-500 dark:text-cyan-400 font-black hover:underline ml-1 uppercase">Create Account</Link>
            </p>
            <p className="text-slate-400 dark:text-slate-600 text-xs font-bold tracking-widest uppercase">Encrypted by AES-256 Protocol</p>
          </div>
        </div>
      </motion.div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      <AnimatePresence>
        {showReset && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center border border-cyan-200 dark:border-cyan-500/20">
                    <KeyRound className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-black uppercase italic tracking-tight">Reset Password</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold tracking-widest uppercase">
                      {resetStep === "email" ? "Step 1 — Enter Email" : resetStep === "otp" ? "Step 2 — Verify & Reset" : "Complete"}
                    </p>
                  </div>
                </div>
                <button onClick={closeReset} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Step 1: Enter email */}
                {resetStep === "email" && (
                  <form onSubmit={handleSendResetOtp} className="space-y-5">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your account email. We'll send a 6-digit reset code.</p>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="email" required placeholder="Your email address" className={inputCls}
                        value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
                    </div>
                    <button type="submit" disabled={resetLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                      {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
                    </button>
                  </form>
                )}

                {/* Step 2: Enter OTP + new password */}
                {resetStep === "otp" && (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Enter the 6-digit code sent to <strong className="text-slate-900 dark:text-white">{resetEmail}</strong> and set your new password.</p>

                    <div className="space-y-2">
                      <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Reset Code</label>
                      <input type="text" required placeholder="000000" maxLength={6} pattern="\d{6}"
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-4 px-6 text-center text-2xl font-black font-mono tracking-[0.5em] text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 outline-none focus:border-cyan-500/50 transition-all"
                        value={resetOtp} onChange={e => setResetOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type={showPw ? "text" : "password"} required placeholder="Min 8 characters" minLength={8}
                          className={inputCls} value={resetPassword} onChange={e => setResetPassword(e.target.value)} />
                        <button type="button" onClick={() => setShowPw(!showPw)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="password" required placeholder="Re-enter password"
                          className={inputCls} value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} />
                      </div>
                    </div>

                    <button type="submit" disabled={resetLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                      {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
                    </button>
                  </form>
                )}

                {/* Step 3: Done */}
                {resetStep === "done" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-slate-900 dark:text-white text-xl font-black italic uppercase tracking-tighter">Password Reset!</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">You can now log in with your new password.</p>
                    <button onClick={closeReset}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-black py-4 rounded-2xl transition-colors uppercase tracking-tight">
                      Back to Login
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
