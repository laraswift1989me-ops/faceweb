import { useState, useEffect } from 'react';
import { Shield, Mail, CheckCircle2 } from 'lucide-react';

interface VerifyEmailProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
}

export function VerifyEmail({ email, onVerified, onResend }: VerifyEmailProps) {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.every(digit => digit !== '')) {
      onVerified();
    }
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    onResend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center mb-4">
            <Mail className="w-12 h-12 text-slate-900" />
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">Verify Your Email</h1>
          <p className="text-slate-400 text-sm text-center">
            We've sent a 6-digit code to
          </p>
          <p className="text-cyan-400 text-sm font-medium">{email}</p>
        </div>

        {/* Verification Form */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-slate-300 text-sm mb-4 block text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 bg-slate-800/50 border border-slate-700 rounded-xl text-white text-center text-xl font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-900 font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={verificationCode.some(digit => digit === '')}
            >
              Verify Email
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
            {canResend ? (
              <button onClick={handleResend} className="text-cyan-400 font-medium hover:text-cyan-300">
                Resend Code
              </button>
            ) : (
              <p className="text-slate-500 text-sm">
                Resend in {countdown}s
              </p>
            )}
          </div>

          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <p className="text-emerald-400 text-sm">
                Email verification helps secure your account
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
