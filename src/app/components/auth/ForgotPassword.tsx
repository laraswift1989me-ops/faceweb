import { useState } from 'react';
import { ArrowLeft, Shield, Mail } from 'lucide-react';

interface ForgotPasswordProps {
  onBack: () => void;
  onResetSent: () => void;
}

export function ForgotPassword({ onBack, onResetSent }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResetSent();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button onClick={onBack} className="text-slate-400 hover:text-white mb-6 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-slate-900" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm text-center">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              Send Reset Link
            </button>
          </form>

          <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <p className="text-cyan-400 text-sm text-center">
              💡 Check your spam folder if you don't receive the email within 5 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
