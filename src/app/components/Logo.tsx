import { Zap } from "lucide-react";
import { APP_NAME_UPPER } from "../../config";

interface LogoProps {
  onClick?: () => void;
  iconSize?: number;
  textSize?: string;
}

export function Logo({ onClick, iconSize = 24, textSize = "text-2xl" }: LogoProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center space-x-3 cursor-pointer group ${onClick ? 'hover:opacity-80' : ''} transition-opacity`}
    >
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">
        <span className="text-white font-black text-2xl italic tracking-tighter">S</span>
      </div>
      <div className="flex flex-col">
        <span className={`text-white font-black ${textSize} tracking-tighter leading-none italic uppercase group-hover:text-cyan-400 transition-colors`}>{APP_NAME_UPPER}</span>
        <span className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] leading-none mt-1 uppercase">SMART YIELD AI</span>
      </div>
    </div>
  );
}
