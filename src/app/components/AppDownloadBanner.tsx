import { useState } from "react";
import { Download, X } from "lucide-react";
import { APP_NAME, DOWNLOAD_URL } from "../../config";

/**
 * Sticky top banner for mobile — shows on all pages.
 * Dismissible for 24 hours.
 */
export function AppDownloadBanner() {
  const [dismissed, setDismissed] = useState(() => {
    const ts = localStorage.getItem("apk_banner_dismissed");
    return ts ? Date.now() - parseInt(ts) < 24 * 60 * 60 * 1000 : false;
  });

  // Only show on mobile
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  // Don't show if already running as installed app (standalone PWA or webview)
  const isStandalone = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone);

  if (dismissed || !isMobile || isStandalone) return null;

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 flex items-center justify-between gap-3 z-[101] relative">
      <div className="flex items-center gap-2.5 min-w-0">
        <img src="/logos/app-icon-light.svg" alt="" className="w-8 h-8 rounded-lg shrink-0" />
        <p className="text-xs font-bold truncate">Get {APP_NAME} App for better experience</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <a href={DOWNLOAD_URL} download
          className="bg-white text-cyan-600 font-black text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-lg flex items-center gap-1">
          <Download className="w-3 h-3" /> Install
        </a>
        <button onClick={() => { setDismissed(true); localStorage.setItem("apk_banner_dismissed", Date.now().toString()); }}
          className="p-1 text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
