import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const NAMES = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Isabella", "Jack", "Kate", "Liam", "Mia", "Noah", "Olivia", "Paul", "Quinn", "Ryan", "Sophia", "Thomas"];
const AMOUNTS = [45.50, 120.00, 32.75, 500.00, 15.00, 88.20, 210.45, 65.00, 1000.00, 25.50];

export function WithdrawalNotification() {
  const [notification, setNotification] = useState<{ name: string; amount: number } | null>(null);

  useEffect(() => {
    const triggerNotification = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
      
      setNotification({ name, amount });

      // Hide after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    };

    // Trigger every 15-30 seconds
    const interval = setInterval(() => {
      triggerNotification();
    }, Math.random() * (30000 - 15000) + 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, x: -100, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 0 }}
          className="fixed bottom-24 left-6 z-[200] max-w-[280px] bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-2xl shadow-2xl shadow-emerald-500/10 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-white text-[10px] font-black uppercase tracking-widest italic leading-tight">Live Settlement</p>
            <p className="text-slate-300 text-xs mt-1">
              <span className="text-white font-bold">{notification.name}***</span> just withdrew <span className="text-emerald-400 font-black italic">${notification.amount} USDT</span>
            </p>
          </div>
          <ArrowUpRight className="w-4 h-4 text-emerald-500/50 shrink-0 self-start" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
