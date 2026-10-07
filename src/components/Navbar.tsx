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
    <header className="sticky top-0 z-40 w-full max-w-full border-b border-[var(--terra-border)] bg-[var(--terra-bg)]/90 backdrop-blur-md transition-colors overflow-hidden">
      <div className="max-w-6xl mx-auto px-3 sm:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 w-full">
        {/* Brand with Gradient Typography - shrink protected */}
        <div className="flex items-center gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Trees className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-gradient-aurora truncate">
                TouchGrass
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider shrink-0">
                Gemma 4
              </span>
            </div>
            <p className="text-[11px] text-[var(--terra-ink-tertiary)] font-mono hidden md:block">
              Hacktoberfest '26 Week 1 · Offline Human Protocol
            </p>
          </div>
        </div>

        {/* Center Live Stopwatch - hidden on small mobile to prevent any horizontal push */}
        {hasActiveTask && activeSessionDuration && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--terra-panel)] border border-[var(--terra-border-strong)] shadow-sm shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--terra-ink-tertiary)] font-bold">
              Session
            </span>
            <span className="font-chrono font-extrabold text-xs text-gradient-emerald">
              {activeSessionDuration}
            </span>
          </div>
        )}

        {/* Right Tools - strictly shrink-0 and compact on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenAbout}
            className="h-9 px-2.5 sm:px-4 rounded-full btn-stylish-secondary text-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            title="Field Manifesto"
            aria-label="Field Manifesto"
          >
            <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Manifesto</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full btn-stylish-secondary flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--terra-ink)] shrink-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
