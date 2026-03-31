import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Logo } from "../Logo";
import { useApp } from "../../../context/AppContext";
import { authApi } from "../../../services/api";

interface RegisterProps {
  onRegister?: () => void;
  onLoginClick: () => void;
  onBack?: () => void;
}

export function Register({
  onRegister,
  onLoginClick,
  onBack,
}: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReferralLocked, setIsReferralLocked] =
    useState(false);

  // Anti-Bot States
  const [captchaToken, setCaptchaToken] = useState<
    string | null
  >(null);
  const [honeypot, setHoneypot] = useState(""); // Hidden field state

  const { login } = useApp();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    agreeTerms: false,
  });

  // Auto-fill referral code if they clicked a tracking link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code =
      params.get("ref") || params.get("referral_code");
    if (code) {
      setFormData((prev) => ({ ...prev, referralCode: code }));
      setIsReferralLocked(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Honeypot Check: If a bot filled out the hidden field, silently reject
    if (honeypot.length > 0) {
      console.warn("Bot activity blocked.");
      setError("Registration failed. Please try again.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // STRICT REFERRAL CHECK
    if (
      !formData.referralCode ||
      formData.referralCode.trim() === ""
    ) {
      setError(
        "A referral code is mandatory to join SwiftEarn.",
      );
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create the user via API
      await authApi.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        referred_by: formData.referralCode.trim(), // Sent strictly
        // captcha_token: captchaToken // Uncomment if using Cloudflare Turnstile
      });

      // 2. Automatically log them in using the AppContext
      await login(formData.email, formData.password);

      // 3. Trigger parent callback to redirect to Dashboard
      if (onRegister) {
        onRegister();
      }
    } catch (err: any) {
      setError(
        err.message ||
          "Registration failed. Please check your details.",
      );
      setCaptchaToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo iconSize={40} textSize="text-4xl" />
          <p className="text-slate-500 text-sm mt-3 font-medium tracking-wide uppercase">
            Join the Future of Yield Farming
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {/* Progress Indicator */}
          <div
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
            style={{
              width: formData.agreeTerms ? "100%" : "75%",
            }}
          />

          <h2 className="text-white text-2xl font-black mb-6 flex items-center gap-2">
            Create Account
            <span className="text-cyan-400 text-xs font-bold bg-cyan-400/10 px-2 py-0.5 rounded-full border border-cyan-400/20">
              WEB3.0
            </span>
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-rose-200 text-sm leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* HONEYPOT FIELD - Invisible to humans, bots will fill it */}
            <input
              type="text"
              name="website_url_catch"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="absolute opacity-0 -z-10 w-0 h-0"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                  Referral Code{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  disabled={isReferralLocked}
                  placeholder="Enter mandatory referral code"
                  className={`w-full bg-slate-800/50 border ${!formData.referralCode && error ? "border-rose-500" : "border-slate-700"} rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all ${isReferralLocked ? "opacity-60 cursor-not-allowed border-emerald-500/50" : ""}`}
                  required
                />
                <p
                  className={`text-[10px] mt-1.5 font-medium italic ${isReferralLocked ? "text-emerald-400" : "text-slate-500"}`}
                >
                  {isReferralLocked
                    ? "Referral code successfully applied from invite link."
                    : "A referral code is required to participate in the staking ecosystem."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword,
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-6">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20 transition-all cursor-pointer"
                  required
                />
              </div>
              <span className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors">
                I agree to the{" "}
                <button
                  type="button"
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-cyan-400 font-bold hover:underline"
                >
                  Privacy Policy
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-black py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-xl shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  CREATING ACCOUNT...
                </>
              ) : (
                "JOIN SWIFTEARN"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <button
                onClick={onLoginClick}
                className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        <p className="text-slate-600 text-[10px] text-center mt-8 font-bold uppercase tracking-tighter">
          SwiftEarn Foundation • Secure Multi-Sig Infrastructure
        </p>
      </div>
    </div>
  );
}