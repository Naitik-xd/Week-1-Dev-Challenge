import React from 'react';
import { Compass, Sun, Moon, Trees } from 'lucide-react';
import { Theme } from '../types';

interface NavbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  onOpenAbout: () => void;
  activeSessionDuration?: string;
  hasActiveTask?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenAbout,
  activeSessionDuration,
  hasActiveTask,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--terra-border)] bg-[var(--terra-bg)]/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
        {/* Brand with Gradient Typography */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Trees className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-gradient-aurora">
                TouchGrass
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider">
                Gemma 4
              </span>
            </div>
            <p className="text-[11px] text-[var(--terra-ink-tertiary)] font-mono hidden sm:block">
              Hacktoberfest '26 Week 1 · Offline Human Protocol
            </p>
          </div>
        </div>

        {/* Center Live Stopwatch */}
        {hasActiveTask && activeSessionDuration && (
          <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[var(--terra-panel)] border border-[var(--terra-border-strong)] shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--terra-ink-tertiary)] font-bold">
              Session
            </span>
            <span className="font-chrono font-extrabold text-sm text-gradient-emerald">
              {activeSessionDuration}
            </span>
          </div>
        )}

        {/* Right Tools */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAbout}
            className="px-4 py-2 rounded-full btn-stylish-secondary text-xs sm:text-sm flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Manifesto</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-10 h-10 rounded-full btn-stylish-secondary flex items-center justify-center transition-colors cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--terra-ink)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
