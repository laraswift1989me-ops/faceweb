import React from 'react';
import { Coins, Zap } from 'lucide-react';

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  hideText?: boolean;
}

export function Logo({ className = "", iconSize = 24, textSize = "text-2xl", hideText = false }: LogoProps) {
  return (
    <div className={`flex items-center space-x-2.5 group cursor-pointer ${className}`}>
      <div className="relative">
        {/* Main Icon Container */}
        <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2 rounded-xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3">
          <Coins 
            size={iconSize} 
            className="text-white relative z-10" 
          />
        </div>
        
        {/* Accent "Swift" Element */}
        <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1 border-2 border-slate-950 group-hover:scale-110 transition-transform duration-300">
          <Zap size={iconSize * 0.4} className="text-slate-950 fill-slate-950" />
        </div>

        {/* Decorative Ring */}
        <div className="absolute inset-0 rounded-xl border border-white/20 scale-110 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>

      {!hideText && (
        <span className={`${textSize} font-black text-white tracking-tighter italic`}>
          Swift<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Earn</span>
        </span>
      )}
    </div>
  );
}
