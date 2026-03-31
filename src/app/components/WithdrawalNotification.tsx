import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, User } from 'lucide-react';

const NAMES = [
  'Alex M.', 'Sarah K.', 'John D.', 'Elena R.', 'Michael B.', 
  'David L.', 'Emma W.', 'Chris P.', 'Sophia G.', 'Daniel S.',
  'Olivia J.', 'James T.', 'Isabella M.', 'Robert H.', 'Patricia C.',
  'Linda F.', 'Thomas G.', 'Charles B.', 'Jessica V.', 'Kevin N.'
];

const AMOUNTS = [
  45.50, 120.00, 75.25, 250.00, 15.00, 
  89.90, 310.45, 50.00, 155.20, 22.10,
  450.00, 67.80, 134.50, 290.00, 18.25,
  55.40, 420.00, 95.00, 210.30, 33.75
];

export function WithdrawalNotification() {
  const [currentNotification, setCurrentNotification] = useState<{ name: string, amount: number } | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    const showNext = () => {
      const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const randomAmount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
      
      setCurrentNotification({ name: randomName, amount: randomAmount });

      const hideId = window.setTimeout(() => {
        setCurrentNotification(null);
        const nextDelay = Math.floor(Math.random() * 4000) + 4000;
        const nextId = window.setTimeout(showNext, nextDelay);
        timeoutsRef.current.push(nextId);
      }, 5000);
      
      timeoutsRef.current.push(hideId);
    };

    const initialId = window.setTimeout(showNext, Math.floor(Math.random() * 5000) + 5000);
    timeoutsRef.current.push(initialId);

    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] pointer-events-none flex justify-center">
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            /* LIGHT THEME CHANGES BELOW */
            className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-3 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] flex items-center space-x-3 max-w-[280px] pointer-events-auto"
          >
            <div className="bg-emerald-100 p-2 rounded-xl border border-emerald-200 shadow-sm">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            
            <div className="flex-1">
              <p className="text-slate-600 text-[11px] font-medium leading-tight">
                <span className="text-slate-900 font-bold">{currentNotification.name}</span> has withdrawn
              </p>
              <p className="text-emerald-600 text-sm font-extrabold mt-0.5">
                ${currentNotification.amount.toFixed(2)} USDT
              </p>
            </div>

            <div className="bg-slate-100 p-1.5 rounded-lg border border-slate-200">
              <User className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}