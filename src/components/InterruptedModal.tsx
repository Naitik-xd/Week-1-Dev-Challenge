import React from 'react';
import { AlertTriangle, RotateCcw, ArrowRight, Play } from 'lucide-react';
import { OutdoorChallenge } from '../types';

interface InterruptedModalProps {
  isOpen: boolean;
  challenge: OutdoorChallenge | null;
  onResume: () => void;
  onStartFresh: () => void;
}

export const InterruptedModal: React.FC<InterruptedModalProps> = ({
  isOpen,
  challenge,
  onResume,
  onStartFresh,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl terra-card p-6 sm:p-8 text-left shadow-2xl">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
          <AlertTriangle className="w-5 h-5" />
        </div>

        <h3 className="font-display text-xl font-bold text-[var(--terra-ink)] mb-2">
          Expedition Interrupted
        </h3>

        <p className="text-sm text-[var(--terra-ink-secondary)] mb-4 leading-relaxed">
          It looks like your browser window was closed while this outdoor challenge was underway:
        </p>

        {challenge && (
          <div className="p-4 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] mb-6">
            <div className="text-[11px] uppercase font-mono font-bold tracking-wider text-[var(--terra-ink-tertiary)] mb-0.5">
              Active Assignment
            </div>
            <div className="font-semibold text-sm text-[var(--terra-ink)]">
              {challenge.title}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-4 px-4 rounded-2xl terra-shutter-btn font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Resume Expedition</span>
          </button>

          <button
            onClick={onStartFresh}
            className="w-full py-3.5 px-4 rounded-2xl bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] text-[var(--terra-ink)] font-display font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Generate Fresh Mission</span>
          </button>
        </div>
      </div>
    </div>
  );
};
