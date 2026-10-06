import React, { useRef } from 'react';
import {
  Camera,
  Clock,
  Timer,
  RefreshCw,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Upload,
  Trees,
  CheckCircle2,
} from 'lucide-react';
import { OutdoorChallenge, ChallengeCategory } from '../types';
import { formatDuration } from '../utils/timeFormat';

interface ActiveChallengeViewProps {
  challenge: OutdoorChallenge;
  sessionSeconds: number;
  taskSeconds: number;
  completedCount: number;
  onOpenCapture: () => void;
  onDirectNativeUpload: (base64: string) => void;
  onSkipChallenge: () => void;
  onEndSession: () => void;
  isSkipping?: boolean;
}

const CATEGORY_METADATA: Record<ChallengeCategory, { label: string; code: string }> = {
  botany: { label: 'Botany & Leaves', code: 'BOT-01' },
  textures: { label: 'Organic Textures', code: 'TEX-02' },
  light_sky: { label: 'Atmospheric Light', code: 'SKY-03' },
  patterns: { label: 'Natural Geometry', code: 'GEO-04' },
  mindfulness: { label: 'Sensory Observation', code: 'SNS-05' },
  color_hunt: { label: 'Outdoor Palette', code: 'COL-06' },
};

export const ActiveChallengeView: React.FC<ActiveChallengeViewProps> = ({
  challenge,
  sessionSeconds,
  taskSeconds,
  completedCount,
  onOpenCapture,
  onDirectNativeUpload,
  onSkipChallenge,
  onEndSession,
  isSkipping,
}) => {
  const directCameraInputRef = useRef<HTMLInputElement | null>(null);
  const directFileInputRef = useRef<HTMLInputElement | null>(null);

  const cat = CATEGORY_METADATA[challenge.category] || { label: 'Field Expedition', code: 'EXP-01' };

  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onDirectNativeUpload(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
      {/* Precision Chronometer Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {/* Task Chronometer */}
        <div className="terra-card p-5 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--terra-accent)] font-bold flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" />
              <span>Task Chrono</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[var(--terra-accent)] animate-ping" />
          </div>
          <div className="text-3xl sm:text-4xl font-chrono font-extrabold text-[var(--terra-accent)] tracking-tight">
            {formatDuration(taskSeconds)}
          </div>
        </div>

        {/* Total Session Chronometer */}
        <div className="terra-card p-5 rounded-3xl flex flex-col justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--terra-ink-tertiary)] font-bold flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Session Total</span>
          </div>
          <div className="text-3xl sm:text-4xl font-chrono font-extrabold text-[var(--terra-ink)] tracking-tight">
            {formatDuration(sessionSeconds)}
          </div>
        </div>

        {/* Missions Completed Counter */}
        <div className="col-span-2 sm:col-span-1 terra-card p-5 rounded-3xl flex flex-col justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--terra-ink-tertiary)] font-bold mb-2">
            Missions Verified
          </div>
          <div className="text-3xl sm:text-4xl font-chrono font-extrabold text-[var(--terra-ink)]">
            {completedCount} <span className="text-xs font-mono font-normal text-[var(--terra-ink-tertiary)]">missions</span>
          </div>
        </div>
      </div>

      {/* Main Field Directive Dossier */}
      <div className="terra-card p-7 sm:p-12 rounded-3xl mb-8 relative overflow-hidden">
        {/* Top Field Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6 pb-4 border-b border-[var(--terra-border)]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] text-[var(--terra-accent)] font-bold">
              {cat.code}
            </span>
            <span className="font-semibold text-[var(--terra-ink)]">{cat.label}</span>
          </div>

          <div className="text-[var(--terra-ink-tertiary)] flex items-center gap-2">
            <span>Target: ~{challenge.suggestedDurationMinutes} min</span>
            <span className="text-[var(--terra-border-strong)]">/</span>
            <span className="text-[var(--terra-accent)] font-semibold">Gemma 4 Field Vision</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl text-[var(--terra-ink)] tracking-tight leading-tight mb-5">
          {challenge.title}
        </h2>

        {/* Outdoor Assignment Body */}
        <p className="text-lg sm:text-xl text-[var(--terra-ink-secondary)] leading-relaxed mb-8 font-normal">
          {challenge.description}
        </p>

        {/* Step Away Directive */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] mb-8">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--terra-accent-glow)] text-[var(--terra-accent)] flex items-center justify-center shrink-0 mt-0.5">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-[var(--terra-ink)] mb-1">
                Put your phone away and step into nature
              </div>
              <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
                Disconnect from this screen. Go outside into the wind and sunlight, locate your natural target, and return only when ready to take a photo.
              </p>
            </div>
          </div>
        </div>

        {/* Safety Note */}
        <div className="flex items-start gap-2.5 text-xs text-[var(--terra-ink-tertiary)] font-mono mb-10">
          <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span>
            <strong className="text-[var(--terra-ink-secondary)]">Field Safety:</strong> {challenge.safetyTip}
          </span>
        </div>

        {/* Dominant Hardware Photo Capture Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Primary Action 1: Directly Opens Native Photo Camera Shutter */}
          <button
            onClick={() => directCameraInputRef.current?.click()}
            className="py-5 px-6 rounded-2xl terra-shutter-btn font-display font-bold text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <Camera className="w-5 h-5 text-white" />
            <span>Snap Photo with Camera</span>
            <ArrowRight className="w-4 h-4 opacity-90" />
          </button>

          {/* Action 2: Open In-App Viewfinder or File Select */}
          <button
            onClick={onOpenCapture}
            className="py-5 px-6 rounded-2xl bg-[var(--terra-panel)] hover:bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] hover:border-[var(--terra-border-strong)] text-[var(--terra-ink)] font-display font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4 text-[var(--terra-accent)]" />
            <span>Select / Review Photo</span>
          </button>
        </div>

        {/* Hidden Direct Shutter HTML5 Native Inputs */}
        <input
          ref={directCameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileCapture}
          className="hidden"
        />
        <input
          ref={directFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileCapture}
          className="hidden"
        />
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--terra-ink-tertiary)] px-2">
        <span>Timers calculate continuously via timestamp delta. Refreshes preserve state.</span>

        <div className="flex items-center gap-5">
          <button
            onClick={onSkipChallenge}
            disabled={isSkipping}
            className="hover:text-[var(--terra-ink)] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSkipping ? 'animate-spin' : ''}`} />
            <span>Next Task</span>
          </button>

          <span className="text-[var(--terra-border-strong)]">/</span>

          <button
            onClick={onEndSession}
            className="hover:text-rose-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Expedition</span>
          </button>
        </div>
      </div>
    </div>
  );
};
