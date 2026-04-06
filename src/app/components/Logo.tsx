import { APP_NAME_UPPER } from "../../config";

/**
 * Logo component.
 *
 * REPLACEABLE LOGO FILES (swap these with your own brand assets):
 *   /public/logos/app-icon-dark.svg      — Square icon for dark backgrounds
 *   /public/logos/app-icon-light.svg     — Square icon for light backgrounds
 *   /public/logos/app-wordmark-dark.svg  — Full logo (icon + text) for dark bg
 *   /public/logos/app-wordmark-light.svg — Full logo (icon + text) for light bg
 *   /public/logos/favicon.svg            — Browser tab icon
 */

interface LogoProps {
  onClick?: () => void;
  iconSize?: number;
  textSize?: string;
  variant?: "icon" | "full";
}

export function Logo({ onClick, iconSize = 40, textSize = "text-2xl", variant = "full" }: LogoProps) {
  if (variant === "icon") {
    return (
      <div onClick={onClick} className={`cursor-pointer group ${onClick ? 'hover:opacity-80' : ''} transition-opacity`}>
        <img
          src="/logos/app-icon-dark.svg"
          alt={APP_NAME_UPPER}
          width={iconSize}
          height={iconSize}
          className="block dark:block hidden rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform"
        />
        <img
          src="/logos/app-icon-light.svg"
          alt={APP_NAME_UPPER}
          width={iconSize}
          height={iconSize}
          className="block dark:hidden rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`flex items-center space-x-3 cursor-pointer group ${onClick ? 'hover:opacity-80' : ''} transition-opacity`}
    >
      <img
        src="/logos/app-icon-dark.svg"
        alt=""
        width={iconSize}
        height={iconSize}
        className="rounded-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform shrink-0"
      />
      <div className="flex flex-col">
        <span className={`text-slate-900 dark:text-white font-black ${textSize} tracking-tighter leading-none italic uppercase group-hover:text-cyan-400 transition-colors`}>{APP_NAME_UPPER}</span>
        <span className="text-[10px] text-cyan-500 dark:text-cyan-400 font-bold tracking-[0.2em] leading-none mt-1 uppercase">SMART YIELD AI</span>
      </div>
    </div>
  );
}
