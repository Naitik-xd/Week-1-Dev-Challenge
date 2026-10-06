import React from 'react';
import { Play, ArrowRight, Compass, Sparkles, Trees } from 'lucide-react';
import { ChallengeCategory } from '../types';
import { TerraGlobe3D } from './TerraGlobe3D';

interface LandingHeroProps {
  onStartPlay: (category?: ChallengeCategory) => void;
  onOpenAbout: () => void;
  isLoadingChallenge: boolean;
  isDark?: boolean;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartPlay,
  onOpenAbout,
  isLoadingChallenge,
  isDark = true,
}) => {
  return (
    <div className="relative pt-6 pb-20 sm:pt-12 sm:pb-32 max-w-6xl mx-auto px-4 sm:px-8">
      {/* Top Protocol Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-8 pb-4 border-b border-[var(--terra-border)]">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-[var(--terra-ink)]">TERRA PROTOCOL // HF '26</span>
          <span className="text-[var(--terra-border-strong)]">/</span>
          <span className="text-gradient-emerald font-bold">Week 1: Touch Grass</span>
        </div>

        <div className="flex items-center gap-3 text-[var(--terra-ink-tertiary)] hidden sm:flex">
          <span className="text-gradient-aurora font-semibold">GEMMA 4 OPEN-WEIGHT VISION</span>
          <span className="text-[var(--terra-border-strong)]">/</span>
          <span className="text-[var(--terra-ink-secondary)] font-medium">100% OFFLINE FOCUS</span>
        </div>
      </div>

      {/* Hero Center Grid: Dynamic Split Layout with 3D Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16">
        {/* Left Column: Explosive Editorial Typography with Rich Gradients */}
        <div className="lg:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider shadow-sm">
            <Trees className="w-3.5 h-3.5" />
            <span>Anti-Screen Field Instrument</span>
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--terra-ink)] leading-[1.03]">
            The digital screen is a cage.{' '}
            <span className="block text-gradient-aurora">
              The earth is real.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-[var(--terra-ink-secondary)] leading-relaxed max-w-xl font-normal">
            TouchGrass breaks screen addiction through micro outdoor expeditions.
            Gemma 4 assigns diverse sensory tasks from cloud formations to tree bark — put your device away, explore outside, and return with camera proof.
          </p>

          {/* Ultra-Stylish CTAs & Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
            <button
              onClick={() => onStartPlay()}
              disabled={isLoadingChallenge}
              className="w-full sm:w-auto py-5 px-10 btn-stylish-primary text-base sm:text-xl flex items-center justify-center gap-3.5 shadow-2xl cursor-pointer disabled:opacity-50"
            >
              {isLoadingChallenge ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Task...</span>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                    <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                  </div>
                  <span>Initialize Expedition</span>
                  <ArrowRight className="w-5 h-5 opacity-90" />
                </>
              )}
            </button>

            <button
              onClick={onOpenAbout}
              className="w-full sm:w-auto py-5 px-8 btn-stylish-secondary text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Field Manifesto</span>
            </button>
          </div>

          {/* Quick Start Buttons in Gradient Badges */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="text-xs font-mono font-bold text-gradient-emerald">Quick Start:</span>
            <button
              onClick={() => onStartPlay('light_sky')}
              disabled={isLoadingChallenge}
              className="px-3.5 py-1.5 rounded-full btn-stylish-secondary text-xs font-mono disabled:opacity-50"
            >
              ☁️ Sky & Clouds
            </button>
            <button
              onClick={() => onStartPlay('textures')}
              disabled={isLoadingChallenge}
              className="px-3.5 py-1.5 rounded-full btn-stylish-secondary text-xs font-mono disabled:opacity-50"
            >
              🌲 Tree Bark
            </button>
            <button
              onClick={() => onStartPlay('color_hunt')}
              disabled={isLoadingChallenge}
              className="px-3.5 py-1.5 rounded-full btn-stylish-secondary text-xs font-mono disabled:opacity-50"
            >
              🎨 Color Hunt
            </button>
          </div>

          {/* Telemetry Micro Status */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--terra-ink-tertiary)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-gradient-emerald font-bold">Randomized Biomarker Engine Active</span>
            </div>
            <span>·</span>
            <div>Zero Stored Accounts</div>
          </div>
        </div>

        {/* Right Column: Interactive 3D Terra Biosphere */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[420px] rounded-3xl terra-card p-4 overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Top Telemetry Stamp inside 3D card */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-[var(--terra-panel)]/85 px-3 py-1.5 rounded-full backdrop-blur-md border border-[var(--terra-border)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-gradient-emerald">3D Terra Biosphere · Live</span>
            </div>

            <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-[var(--terra-ink-tertiary)] bg-[var(--terra-panel)]/85 px-3 py-1.5 rounded-full backdrop-blur-md border border-[var(--terra-border)]">
              Interact: Move cursor to rotate
            </div>

            {/* The 3D WebGL Canvas */}
            <TerraGlobe3D isDark={isDark} />
          </div>
        </div>
      </div>

      {/* Bottom 3-Card Diverse Expedition Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-[var(--terra-border)] pt-12">
        <div className="terra-card p-6 sm:p-7 rounded-3xl hover:border-emerald-500/50 transition-all hover:scale-[1.01]">
          <div className="font-mono text-xs font-bold mb-2 tracking-widest uppercase text-gradient-emerald">
            01 · Micro-Forests & Lichen
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--terra-ink)] mb-2">
            Macro Ground Textures
          </h3>
          <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
            Spot miniature moss forests in sidewalk seams, mineral sediment rings on pebbles, or textured bark that looks like topographic canyons.
          </p>
        </div>

        <div className="terra-card p-6 sm:p-7 rounded-3xl hover:border-emerald-500/50 transition-all hover:scale-[1.01]">
          <div className="font-mono text-xs font-bold mb-2 tracking-widest uppercase text-gradient-aurora">
            02 · Atmospheric Geometry
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--terra-ink)] mb-2">
            Sun Shadows & Sky Reflections
          </h3>
          <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
            Observe the longest daylight shadow on stone, upside-down cloud reflections inside a puddle, or dynamic branch forks forming architectural Y-junctions.
          </p>
        </div>

        <div className="terra-card p-6 sm:p-7 rounded-3xl hover:border-emerald-500/50 transition-all hover:scale-[1.01]">
          <div className="font-mono text-xs font-bold mb-2 tracking-widest uppercase text-gradient-amber">
            03 · Sensory Disconnect
          </div>
          <h3 className="font-display text-xl font-bold text-[var(--terra-ink)] mb-2">
            100% Real-World Presence
          </h3>
          <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
            No endless feeds. Receive your task in 10 seconds, pocket your device, breathe fresh air, and snap photographic proof only when you return.
          </p>
        </div>
      </div>
    </div>
  );
};
