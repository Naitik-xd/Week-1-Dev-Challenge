import React from 'react';
import { Play, ArrowRight, Compass, Eye, ShieldCheck, Sun, Sparkles, Trees, Camera } from 'lucide-react';

interface LandingHeroProps {
  onStartPlay: () => void;
  onOpenAbout: () => void;
  isLoadingChallenge: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlay,
  onOpenAbout,
  isLoadingChallenge,
}) => {
  return (
    <div className="relative pt-10 pb-20 sm:pt-20 sm:pb-32 max-w-5xl mx-auto px-4 sm:px-8 text-center">
      {/* Top Protocol Header */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--terra-panel)] border border-[var(--terra-border)] shadow-xs text-xs font-mono mb-8 text-[var(--terra-ink-secondary)]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Hacktoberfest 2026</span>
        <span className="text-[var(--terra-border-strong)]">/</span>
        <span className="text-[var(--terra-accent)] font-semibold">Week 1: Touch Grass</span>
        <span className="text-[var(--terra-border-strong)]">/</span>
        <span>Gemma 4</span>
      </div>

      {/* Main Punchy Typography */}
      <h1 className="font-display font-extrabold text-4xl sm:text-7xl md:text-8xl tracking-tight text-[var(--terra-ink)] leading-[1.04] mb-8">
        Leave the screen.{' '}
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-green-400">
          The earth is waiting.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-2xl text-[var(--terra-ink-secondary)] max-w-3xl mx-auto leading-relaxed mb-12 font-normal">
        TouchGrass is an open-weight AI expedition companion.
        Receive a short outdoor observation assignment, physically put your device down, and return with photographic proof.
      </p>

      {/* Hero CTA Console */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 max-w-lg mx-auto">
        <button
          onClick={onStartPlay}
          disabled={isLoadingChallenge}
          className="w-full sm:flex-1 py-5 px-8 rounded-2xl terra-shutter-btn font-display font-bold text-lg sm:text-xl flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
        >
          {isLoadingChallenge ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Synthesizing Task...</span>
            </>
          ) : (
            <>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-white text-white ml-0.5" />
              </div>
              <span>Initialize Expedition</span>
              <ArrowRight className="w-5 h-5 opacity-90" />
            </>
          )}
        </button>

        <button
          onClick={onOpenAbout}
          className="w-full sm:w-auto py-5 px-6 rounded-2xl bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] font-medium text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Compass className="w-4 h-4 text-[var(--terra-accent)]" />
          <span>Field Manifesto</span>
        </button>
      </div>

      {/* Expedition Protocol Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-[var(--terra-border)] pt-12">
        <div className="terra-card p-6 sm:p-7 rounded-3xl">
          <div className="font-mono text-xs text-[var(--terra-accent)] font-bold mb-3 tracking-widest uppercase">
            Phase 01 · Directive
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--terra-ink)] mb-2">
            Target Assignment
          </h3>
          <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
            Open-weight Gemma 4 crafts a safe, accessible outdoor observation mission tailored for real nature.
          </p>
        </div>

        <div className="terra-card p-6 sm:p-7 rounded-3xl">
          <div className="font-mono text-xs text-[var(--terra-accent)] font-bold mb-3 tracking-widest uppercase">
            Phase 02 · Disconnect
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--terra-ink)] mb-2">
            Screen Shutdown
          </h3>
          <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
            Put your phone in your pocket. Step outside into open air, feel the temperature, and search for the target.
          </p>
        </div>

        <div className="terra-card p-6 sm:p-7 rounded-3xl">
          <div className="font-mono text-xs text-[var(--terra-accent)] font-bold mb-3 tracking-widest uppercase">
            Phase 03 · Verification
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--terra-ink)] mb-2">
            Photo Document
          </h3>
          <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
            Snap evidence with your device photo camera. Gemma 4 analyzes what you found and logs your real offline time.
          </p>
        </div>
      </div>
    </div>
  );
};
