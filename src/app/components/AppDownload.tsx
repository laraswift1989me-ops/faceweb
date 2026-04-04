import { useState } from "react";
import { Download, Smartphone } from "lucide-react";

/**
 * Inline download section — use on Landing page
 */
export function AppDownloadSection() {
  const isAndroid = /Android/.test(navigator.userAgent);
  const isMobile = /Android|iPhone|iPad|iPod/.test(navigator.userAgent);

  return (
    <section className="relative overflow-hidden">
      <div className="bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-indigo-600/10 border border-cyan-500/20 rounded-[40px] p-8 lg:p-12">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30 shrink-0">
            <Smartphone className="w-10 h-10 text-white" />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">
              Get the SwiftEarn App
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-lg">
              Download our Android app for instant access, faster performance, and a full native experience on your phone.
            </p>
          </div>

          <a href="/SwiftEarn.apk" download
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all shrink-0">
            <Download className="w-5 h-5" /> Download Android App
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Compact download button for navbar
 */
export function DownloadAppButton({ className = "" }: { className?: string }) {
  return (
    <a href="/SwiftEarn.apk" download
      className={`flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-cyan-500/20 transition-all ${className}`}>
      <Download className="w-3.5 h-3.5" /> Get App
    </a>
  );
}
