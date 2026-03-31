import { motion } from "motion/react";
import { Logo } from "./Logo";

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex flex-col items-center justify-center gap-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-8"
      >
        <Logo iconSize={40} textSize="text-3xl" />

        {/* Spinner ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase">
          Securing Your Session...
        </p>
      </motion.div>
    </div>
  );
}
