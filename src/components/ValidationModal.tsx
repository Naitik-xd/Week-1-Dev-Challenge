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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl terra-card p-6 sm:p-9 overflow-hidden shadow-2xl">
        {/* Analyzing / Loading State */}
        {isValidating ? (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            {photoPreview && (
              <div className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-emerald-500/30 mb-6 shadow-xl shadow-emerald-500/10">
                <img
                  src={photoPreview}
                  alt="Analyzing capture"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="w-12 h-12 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="font-display font-bold text-2xl text-gradient-aurora mb-2">
              Evaluating Field Evidence
            </h3>
            <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] max-w-xs font-mono">
              Gemma 4 vision model is inspecting your live photo against "{challenge.title}"...
            </p>
          </div>
        ) : validationResult?.passed ? (
          /* SUCCESS STATE */
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-gradient-emerald">Evidence Confirmed · Verified</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-gradient-aurora mb-2">
              Mission accomplished.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] mb-6 font-mono">
              Documented in nature: {challenge.title}
            </p>

            {/* Photo preview & chronometer measurements */}
            <div className="flex gap-4 p-4 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] mb-6 items-center">
              {photoPreview && (
                <div className="w-22 h-22 rounded-2xl overflow-hidden border border-emerald-500/20 shrink-0 shadow-md">
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
                  <div className="text-3xl font-chrono font-extrabold text-gradient-aurora">
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
              <div className="text-[11px] font-mono uppercase tracking-wider font-bold mb-1.5 flex items-center gap-1.5 text-gradient-emerald">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemma 4 Field Assessment</span>
              </div>
              <p className="text-sm text-[var(--terra-ink)] italic leading-relaxed">
                "{validationResult.feedback}"
              </p>
            </div>

            {/* Stylish Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onPlayAgain}
                className="flex-1 py-4 px-6 rounded-full btn-stylish-primary text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Begin Next Mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onDoneForNow}
                className="py-4 px-6 rounded-full btn-stylish-secondary text-sm flex items-center justify-center gap-2"
              >
                <Trees className="w-4 h-4 text-emerald-400" />
                <span>Rest Outdoors</span>
              </button>
            </div>
          </div>
        ) : (
          /* REJECTED / RETRY STATE */
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <XCircle className="w-4 h-4 text-amber-400" />
              <span className="text-gradient-amber">Evidence Inconclusive</span>
            </div>

            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-gradient-amber mb-2">
              Not quite yet.
            </h2>
            <p className="text-sm text-[var(--terra-ink-secondary)] mb-6 leading-relaxed">
              {validationResult?.reason || 'The captured image did not clearly show the requested outdoor subject.'}
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
              <div className="text-[11px] font-mono uppercase font-bold text-amber-500 mb-1">
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
              className="w-full py-4 px-6 rounded-full btn-stylish-camera text-base flex items-center justify-center gap-2 shadow-xl"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Click Photo Again with Camera</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
