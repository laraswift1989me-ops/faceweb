import { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Logo } from "../Logo";
import { useApp } from "../../../context/AppContext";
import { APP_NAME } from "../../../config";

interface LoginProps {
  onLogin?: (userData?: any) => void;
  onRegister: () => void;
  onForgotPassword: () => void;
}

export function Login({
  onLogin,
  onRegister,
  onForgotPassword,
}: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull the powerful login function from our global context
  const { login } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // This single call hits the API, saves the token, and fetches all wallet/dashboard data!
      await login(email, password);

      // If the parent component needs to know we finished, call this
      if (onLogin) {
        onLogin();
      }
    } catch (err: any) {
      // Safely catch errors passed up from our api.ts interceptor
      setError(
        err.message ||
          "Invalid email or password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Logo iconSize={40} textSize="text-4xl" />
          <p className="text-slate-500 text-sm mt-3 font-medium tracking-wide uppercase">
            Institutional Grade DeFi Dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-slate-700/50 shadow-2xl">
          <h2 className="text-white text-2xl font-black mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-rose-200 text-sm leading-relaxed">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 text-xs font-bold uppercase tracking-widest block">
                  Password
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest hover:text-cyan-300 transition-colors"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500/20 transition-all cursor-pointer"
                />
                <span className="text-slate-400 text-xs font-medium group-hover:text-slate-300 transition-colors">
                  Keep me signed in
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-black py-4 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                "ACCESS DASHBOARD"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New to {APP_NAME}?{" "}
              <button
                onClick={onRegister}
                className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <p className="text-slate-600 text-[10px] text-center mt-8 font-bold uppercase tracking-tighter">
          Secured by {APP_NAME} Protocol • v2.4.0-stable
        </p>
      </div>
    </div>
  );
}