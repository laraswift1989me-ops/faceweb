import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2.5 rounded-xl transition-colors
        bg-slate-100 dark:bg-slate-800/50
        border border-slate-200 dark:border-slate-700/50
        hover:bg-slate-200 dark:hover:bg-slate-700/50
        text-slate-600 dark:text-slate-300
        ${className}`}
    >
      {isDark
        ? <Sun  className="w-5 h-5 text-amber-500" />
        : <Moon className="w-5 h-5 text-slate-500" />
      }
    </button>
  );
}
