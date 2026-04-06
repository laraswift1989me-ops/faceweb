import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useApp } from "../../../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Mail, Lock, ShieldCheck, ArrowRight, RefreshCw,
  KeyRound, CheckCircle2, AlertCircle, Phone, MapPin,
  Building2, Hash, ChevronDown, Search,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "../../components/ThemeToggle";
import { COUNTRIES } from "../../data/countries";
import { APP_NAME } from "../../../config";

export function Register() {
  const { registerSendOtp, registerVerifyOtp } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  // Country picker state
  const [countryOpen, setCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    referral_code: searchParams.get("ref") || "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    country_code: "",
    country_flag: "",
    otp: "",
    honeypot: "",
  });

  const isReferralDisabled = !!searchParams.get("ref");

  // Close country dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
        setCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => setTimer((p) => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const filteredCountries = countrySearch.trim()
    ? COUNTRIES.filter((c) =>
        c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        c.dialCode.includes(countrySearch) ||
        c.code.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : COUNTRIES;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    if (
      !formData.name || !formData.email || !formData.password ||
      !formData.referral_code || !formData.phone ||
      !formData.street_address || !formData.city || !formData.state ||
      !formData.postal_code || !formData.country_code
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    // Basic phone validation
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length < 7) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      await registerSendOtp({
        name:           formData.name,
        email:          formData.email,
        password:       formData.password,
        password_confirmation: formData.password_confirmation,
        referral_code:  formData.referral_code,
        phone:          formData.phone,
        street_address: formData.street_address,
        city:           formData.city,
        state:          formData.state,
        postal_code:    formData.postal_code,
        country:        formData.country,
        country_code:   formData.country_code,
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
        name:           formData.name,
        email:          formData.email,
        password:       formData.password,
        otp:            formData.otp,
        referral_code:  formData.referral_code,
        phone:          formData.phone,
        street_address: formData.street_address,
        city:           formData.city,
        state:          formData.state,
        postal_code:    formData.postal_code,
        country:        formData.country,
        country_code:   formData.country_code,
      });
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP or registration failed");
      setTimer(180);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const inputCls =
    "w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm";

  const sectionLabel =
    "text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>

      {/* Background Glows */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl py-8"
      >
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800/50 rounded-[40px] p-6 lg:p-10 shadow-2xl relative">

          {/* REPLACEABLE: /public/logos/app-icon-dark.svg */}
          <div className="flex justify-center mb-6">
            <img src="/logos/app-icon-dark.svg" alt="Logo" className="w-14 h-14 rounded-2xl shadow-lg shadow-cyan-500/30" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">
              {step === 1 ? `Join ${APP_NAME}` : "Verify Email"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
              {step === 1
                ? "Create your account to start earning"
                : `We've sent a 6-digit code to ${formData.email}`}
            </p>
          </div>

          {/* Honeypot */}
          <input
            type="text"
            title="Leave this field empty"
            className="hidden"
            value={formData.honeypot}
            onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            autoComplete="off"
            tabIndex={-1}
          />

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp}
                className="space-y-6"
              >
                {/* ── SECTION 1: Account Info ─────────────────────────── */}
                <div>
                  <p className={sectionLabel}>
                    <User className="w-3 h-3" /> Account Information
                  </p>
                  <div className="space-y-3">

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Full Name */}
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="Full Name *"
                          required
                          className={inputCls}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>

                      {/* Email */}
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="email"
                          placeholder="Email Address *"
                          required
                          className={inputCls}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Referral Code */}
                    <div className="relative group">
                      <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Referral Code (Mandatory) *"
                        required
                        disabled={isReferralDisabled}
                        className={`${inputCls} disabled:opacity-50 disabled:cursor-not-allowed`}
                        value={formData.referral_code}
                        onChange={(e) => setFormData({ ...formData, referral_code: e.target.value })}
                      />
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="password"
                          placeholder="Password *"
                          required
                          className={inputCls}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="password"
                          placeholder="Confirm Password *"
                          required
                          className={inputCls}
                          value={formData.password_confirmation}
                          onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 2: Contact & Address ────────────────────── */}
                <div>
                  <p className={sectionLabel}>
                    <MapPin className="w-3 h-3" /> Contact & Address
                  </p>
                  <div className="space-y-3">

                    {/* Phone Number */}
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="tel"
                        placeholder="Phone Number (e.g. +1 555 000 0000) *"
                        required
                        className={inputCls}
                        value={formData.phone}
                        onChange={(e) => {
                          // Allow +, digits, spaces, dashes, parentheses only
                          const val = e.target.value.replace(/[^\d\s\+\-\(\)]/g, "");
                          setFormData({ ...formData, phone: val });
                        }}
                      />
                    </div>

                    {/* Street Address */}
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        placeholder="Street Address *"
                        required
                        className={inputCls}
                        value={formData.street_address}
                        onChange={(e) => setFormData({ ...formData, street_address: e.target.value })}
                      />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="City *"
                          required
                          className={inputCls}
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="State / Province *"
                          required
                          className={inputCls}
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* ZIP + Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                      {/* ZIP / Postal Code */}
                      <div className="relative group">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                        <input
                          type="text"
                          placeholder="ZIP / Postal Code *"
                          required
                          className={inputCls}
                          value={formData.postal_code}
                          onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        />
                      </div>

                      {/* Country Picker */}
                      <div ref={countryRef} className="relative">
                        <button
                          type="button"
                          onClick={() => { setCountryOpen(!countryOpen); setCountrySearch(""); }}
                          className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-3.5 pl-4 pr-10 text-left outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm flex items-center gap-2"
                        >
                          {formData.country_code ? (
                            <>
                              <span className="text-xl leading-none">{formData.country_flag}</span>
                              <span className="text-slate-900 dark:text-white font-medium truncate">
                                {formData.country}
                              </span>
                            </>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">Country *</span>
                          )}
                          <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${countryOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                          {countryOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.97 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-950/80 overflow-hidden"
                            >
                              {/* Search */}
                              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                                  <input
                                    type="text"
                                    placeholder="Search country..."
                                    autoFocus
                                    className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-cyan-500/50 transition-all"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                  />
                                </div>
                              </div>

                              {/* Options */}
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCountries.length === 0 ? (
                                  <p className="text-center text-slate-400 dark:text-slate-500 text-xs py-4">No countries found</p>
                                ) : (
                                  filteredCountries.map((c) => (
                                    <button
                                      key={c.code}
                                      type="button"
                                      onClick={() => {
                                        setFormData({
                                          ...formData,
                                          country: c.name,
                                          country_code: c.code,
                                          country_flag: c.flag,
                                          // Pre-fill dial code if phone is empty
                                          phone: formData.phone || c.dialCode + " ",
                                        });
                                        setCountryOpen(false);
                                        setCountrySearch("");
                                      }}
                                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors ${
                                        formData.country_code === c.code ? "bg-cyan-50 dark:bg-cyan-500/10" : ""
                                      }`}
                                    >
                                      <span className="text-xl leading-none w-6 text-center">{c.flag}</span>
                                      <span className="text-slate-900 dark:text-white text-xs font-medium flex-1">{c.name}</span>
                                      <span className="text-slate-400 dark:text-slate-500 text-[10px] font-mono">{c.dialCode}</span>
                                    </button>
                                  ))
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

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
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-center text-2xl font-black tracking-[0.5em] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:text-sm placeholder:tracking-normal outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/[^0-9]/g, "") })}
                  />
                </div>

                {timer > 0 ? (
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700/30">
                    <AlertCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    <span className="text-slate-600 dark:text-slate-300 text-xs font-bold">Retry available in {formatTime(timer)}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-cyan-500 dark:text-cyan-400 text-xs font-black uppercase tracking-widest hover:underline w-full text-center"
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

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/50 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-500 dark:text-cyan-400 font-black hover:underline ml-1">
                LOGIN HERE
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
