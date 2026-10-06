import React from 'react';
import { Compass, Sun, Moon, Sparkles, Trees, EyeOff } from 'lucide-react';
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
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-sm">
            <Trees className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-[var(--terra-ink)]">
                TouchGrass
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--terra-accent-glow)] text-[var(--terra-accent)] font-semibold uppercase tracking-wider">
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
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--terra-panel)] border border-[var(--terra-border)] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--terra-ink-tertiary)]">
              Session
            </span>
            <span className="font-chrono font-bold text-sm text-[var(--terra-ink)]">
              {activeSessionDuration}
            </span>
          </div>
        )}

        {/* Right Tools */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAbout}
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] hover:bg-[var(--terra-panel)] border border-transparent hover:border-[var(--terra-border)] transition-all cursor-pointer flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[var(--terra-accent)]" />
            <span className="hidden sm:inline">Manifesto</span>
          </button>

          <button
            onClick={onToggleTheme}
            aria-label={`Toggle ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="w-10 h-10 rounded-xl bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] flex items-center justify-center text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] transition-colors cursor-pointer shadow-sm"
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
