import React from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Timer,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trees,
} from 'lucide-react';
import { AIValidationResult, OutdoorChallenge } from '../types';
import { formatDuration } from '../utils/timeFormat';

interface ValidationModalProps {
  isOpen: boolean;
  isValidating: boolean;
  validationResult: AIValidationResult | null;
  challenge: OutdoorChallenge;
  sessionSeconds: number;
  taskSeconds: number;
  photoPreview?: string | null;
  onPlayAgain: () => void;
  onDoneForNow: () => void;
  onRetryCapture: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  isValidating,
  validationResult,
  challenge,
  sessionSeconds,
  taskSeconds,
  photoPreview,
  onPlayAgain,
  onDoneForNow,
  onRetryCapture,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl terra-card p-6 sm:p-9 overflow-hidden shadow-2xl">
        {/* Analyzing / Loading State */}
        {isValidating ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            {photoPreview && (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-[var(--terra-border-strong)] mb-6 shadow-md">
                <img
                  src={photoPreview}
                  alt="Analyzing capture"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="w-10 h-10 border-2 border-[var(--terra-accent)] border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="font-display text-xl font-bold text-[var(--terra-ink)] mb-2">
              Evaluating Field Evidence
            </h3>
            <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] max-w-xs font-mono">
              Gemma 4 vision model is inspecting your live photo against "{challenge.title}"...
            </p>
          </div>
        ) : validationResult?.passed ? (
          /* SUCCESS STATE */
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--terra-accent-glow)] text-[var(--terra-accent)] text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-4 h-4" />
              <span>Evidence Confirmed · Verified</span>
            </div>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[var(--terra-ink)] mb-1">
              Mission accomplished.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] mb-6 font-mono">
              Documented in nature: {challenge.title}
            </p>

            {/* Photo preview & chronometer measurements */}
            <div className="flex gap-4 p-4 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] mb-6 items-center">
              {photoPreview && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[var(--terra-border)] shrink-0">
                  <img
                    src={photoPreview}
                    alt="Verified evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-1.5 flex-1">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--terra-accent)] font-bold flex items-center gap-1">
                    <Timer className="w-3 h-3 text-[var(--terra-accent)]" />
                    <span>Task Chrono Time</span>
                  </div>
                  <div className="text-2xl font-chrono font-extrabold text-[var(--terra-accent)]">
                    {formatDuration(taskSeconds)}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--terra-ink-tertiary)] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Total Session Time</span>
                  </div>
                  <div className="text-sm font-chrono font-semibold text-[var(--terra-ink)]">
                    {formatDuration(sessionSeconds)}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--terra-panel)] border border-[var(--terra-border)] mb-6">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--terra-accent)] font-bold mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemma 4 Field Assessment</span>
              </div>
              <p className="text-sm text-[var(--terra-ink)] italic leading-relaxed">
                "{validationResult.feedback}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onPlayAgain}
                className="flex-1 py-4 px-6 rounded-2xl terra-shutter-btn font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Begin Next Mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDoneForNow}
                className="py-4 px-6 rounded-2xl bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] text-[var(--terra-ink)] font-display font-bold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
              >
                <Trees className="w-4 h-4 text-[var(--terra-accent)]" />
                <span>Rest Outdoors</span>
              </button>
            </div>
          </div>
        ) : (
          /* REJECTED / RETRY STATE */
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <XCircle className="w-4 h-4" />
              <span>Evidence Inconclusive</span>
            </div>

            <h2 className="font-display font-bold text-3xl text-[var(--terra-ink)] mb-2">
              Not quite yet.
            </h2>
            <p className="text-sm text-[var(--terra-ink-secondary)] mb-6 leading-relaxed">
              {validationResult?.reason || 'The captured image did not clearly show the requested outdoor subject.'}
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <div className="text-[11px] font-mono uppercase font-bold text-amber-700 dark:text-amber-300 mb-1">
                Gemma 4 Guidance
              </div>
              <p className="text-sm text-[var(--terra-ink)] leading-relaxed">
                {validationResult?.feedback || 'Step closer or adjust the angle of the natural subject and snap again.'}
              </p>
              <p className="text-xs font-mono text-[var(--terra-ink-tertiary)] mt-2">
                Task timer is still running — take your time outdoors!
              </p>
            </div>

            <button
              onClick={onRetryCapture}
              className="w-full py-4 px-6 rounded-2xl terra-shutter-btn font-display font-bold text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again with Photo Camera</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
