import React from 'react';
import {
  Clock,
  Trees,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';
import { SessionData } from '../types';
import { formatDetailedDuration } from '../utils/timeFormat';

interface SessionSummaryModalProps {
  isOpen: boolean;
  session: SessionData;
  totalSessionSeconds: number;
  onStartNewSession: () => void;
  onClose: () => void;
}

export const SessionSummaryModal: React.FC<SessionSummaryModalProps> = ({
  isOpen,
  session,
  totalSessionSeconds,
  onStartNewSession,
  onClose,
}) => {
  if (!isOpen) return null;

  const completedList = session.completedChallenges || [];
  const count = completedList.length;
  const latestTask = completedList[completedList.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl terra-card p-6 sm:p-9 text-left shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] flex items-center justify-center text-[var(--terra-ink-secondary)] hover:text-[var(--terra-ink)] transition-colors cursor-pointer"
          aria-label="Close summary"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--terra-accent)] font-bold mb-2">
          <Trees className="w-4 h-4" />
          <span>Expedition Debrief</span>
        </div>

        <h2 className="font-display font-bold text-3xl text-[var(--terra-ink)] mb-6">
          Session Summary Log
        </h2>

        {/* Total Time & Count Stats */}
        <div className="grid grid-cols-2 gap-4 p-5 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] mb-6">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--terra-ink-tertiary)] font-bold mb-1">
              Real-World Time
            </div>
            <div className="text-2xl font-chrono font-extrabold text-[var(--terra-ink)]">
              {formatDetailedDuration(totalSessionSeconds)}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--terra-accent)] font-bold mb-1">
              Tasks Completed
            </div>
            <div className="text-2xl font-chrono font-extrabold text-[var(--terra-accent)]">
              {count}
            </div>
          </div>
        </div>

        {/* Latest challenge feedback */}
        {latestTask && (
          <div className="p-4 rounded-xl bg-[var(--terra-panel)] border border-[var(--terra-border)] mb-6">
            <div className="text-[11px] font-mono font-bold text-[var(--terra-ink)] mb-1">
              Final Task: {latestTask.challenge.title}
            </div>
            <p className="text-xs text-[var(--terra-ink-secondary)] italic">
              "{latestTask.feedback}"
            </p>
          </div>
        )}

        {/* Gentle departure nudge */}
        <div className="p-5 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] text-center mb-6">
          <p className="text-xs text-[var(--terra-ink-secondary)] leading-relaxed">
            You replaced mindless screen time with sensory natural light and presence today. Put this device away and enjoy the outdoors.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onStartNewSession}
            className="flex-1 py-4 px-5 rounded-2xl terra-shutter-btn font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Begin New Expedition</span>
          </button>

          <button
            onClick={onClose}
            className="py-4 px-6 rounded-2xl bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] text-[var(--terra-ink)] font-display font-bold text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
