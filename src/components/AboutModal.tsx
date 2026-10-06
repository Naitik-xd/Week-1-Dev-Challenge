import React from 'react';
import { X, Trees, Shield, Cpu, Compass } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl terra-card p-6 sm:p-9 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] flex items-center justify-center text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--terra-accent)] font-bold mb-2">
          <Compass className="w-4 h-4" />
          <span>Field Manifesto</span>
        </div>

        <h2 className="font-display font-bold text-3xl text-[var(--terra-ink)] mb-6">
          The Anti-Screen Protocol
        </h2>

        <div className="space-y-6 text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
          <div>
            <h3 className="font-display font-bold text-base text-[var(--terra-ink)] mb-1 flex items-center gap-2">
              <Trees className="w-4 h-4 text-[var(--terra-accent)]" />
              Reclaiming Physical Presence
            </h3>
            <p>
              Contemporary software is engineered to trap human consciousness behind glass. TouchGrass uses the screen
              strictly as an initial spark: you get a brief observation target, put your device down, and step into open air.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-base text-[var(--terra-ink)] mb-1 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--terra-accent)]" />
              Gemma 4 Open-Weight AI
            </h3>
            <p>
              Built for Hacktoberfest 2026 Week 1 ("Touch Grass"), the application exclusively uses open-weight Gemma 4 models
              (<code className="font-mono text-xs text-[var(--terra-accent)]">gemma-4-26b-a4b-it</code>). Rather than generating synthetic media,
              Gemma 4 serves as an outdoor observation coach that evaluates authentic physical evidence.
            </p>
          </div>

          <div>
            <h3 className="font-display font-bold text-base text-[var(--terra-ink)] mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--terra-accent)]" />
              Zero User Tracking
            </h3>
            <p>
              No user accounts, no login portals, and no database tracking. All mission timers persist locally inside
              your browser's timestamps so you can refresh without disruption.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[var(--terra-border)] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl terra-shutter-btn font-display font-bold text-xs cursor-pointer"
          >
            Return to Field
          </button>
        </div>
      </div>
    </div>
  );
};
