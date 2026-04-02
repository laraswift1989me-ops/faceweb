import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useApp } from "../../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Lock, ShieldCheck, ArrowRight, RefreshCw, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function Register() {
  const { registerSendOtp, registerVerifyOtp } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    referral_code: searchParams.get("ref") || "",
    otp: "",
    honeypot: "", // Bot detection
  });

  const isReferralDisabled = !!searchParams.get("ref");

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Bot detected
    
    if (!formData.name || !formData.email || !formData.password || !formData.referral_code) {
      toast.error("Please fill all mandatory fields");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerSendOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        referral_code: formData.referral_code,
      });
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await registerVerifyOtp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp: formData.otp,
        referral_code: formData.referral_code,
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP or registration failed");
      // If failed, enable retry after 3 minutes (180 seconds)
      setTimer(180);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/50 rounded-[40px] p-8 lg:p-10 shadow-2xl relative">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <span className="text-white font-black text-3xl italic">S</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              {step === 1 ? "Join SwiftEarn" : "Verify Email"}
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">
              {step === 1 
                ? "Start your DeFi journey with AI-powered staking" 
                : `We've sent a 6-digit code to ${formData.email}`
              }
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-5"
              >
                {/* Honeypot field (hidden from users) */}
                <input 
                  type="text" 
                  className="hidden" 
                  value={formData.honeypot} 
                  onChange={(e) => setFormData({...formData, honeypot: e.target.value})} 
                  autoComplete="off"
                />

                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Referral Code (Mandatory)"
                      required
                      disabled={isReferralDisabled}
                      className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      value={formData.referral_code}
                      onChange={(e) => setFormData({...formData, referral_code: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="password"
                        placeholder="Password"
                        required
                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="password"
                        placeholder="Confirm"
                        required
                        className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                        value={formData.password_confirmation}
                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>CONTINUE TO VERIFY</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-6"
              >
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    className="w-full bg-slate-800/40 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-center text-2xl font-black tracking-[0.5em] text-white placeholder:text-slate-500 placeholder:text-sm placeholder:tracking-normal outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                    value={formData.otp}
                    onChange={(e) => setFormData({...formData, otp: e.target.value.replace(/[^0-9]/g, '')})}
                  />
                </div>

                {timer > 0 ? (
                  <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-center gap-2 border border-slate-700/30">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300 text-xs font-bold">Retry available in {formatTime(timer)}</span>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-cyan-400 text-xs font-black uppercase tracking-widest hover:underline w-full text-center"
                  >
                    Resend Verification Email?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading || (timer > 0 && step === 2)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 group transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>COMPLETE REGISTRATION</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-slate-400 text-sm font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 font-black hover:underline ml-1">
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
