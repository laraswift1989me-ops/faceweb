import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../../../context/AppContext";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, RefreshCw, LogIn } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success("Welcome back to SwiftEarn!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
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
              Secure Login
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium tracking-wide">
              Enter your credentials to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
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
                  <span>SECURE ACCESS</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center space-y-4">
            <p className="text-slate-400 text-sm font-medium">
              New to SwiftEarn?{" "}
              <Link to="/register" className="text-cyan-400 font-black hover:underline ml-1 uppercase">
                Create Account
              </Link>
            </p>
            <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">
              Encrypted by AES-256 Protocol
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
