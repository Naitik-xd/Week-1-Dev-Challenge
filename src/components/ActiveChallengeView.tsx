import React, { useRef } from 'react';
import {
  Camera,
  Clock,
  Timer,
  RefreshCw,
  LogOut,
  ArrowRight,
  ShieldAlert,
  Trees,
  Sparkles,
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
  onSkipChallenge: (category?: ChallengeCategory) => void;
  onEndSession: () => void;
  isSkipping?: boolean;
}

const CATEGORY_METADATA: Record<ChallengeCategory, { label: string; code: string; icon: string }> = {
  light_sky: { label: 'Sky & Atmosphere', code: 'SKY-01', icon: '☁️' },
  textures: { label: 'Bark & Textures', code: 'TEX-02', icon: '🌲' },
  botany: { label: 'Botany & Leaves', code: 'BOT-03', icon: '🌿' },
  patterns: { label: 'Natural Geometry', code: 'GEO-04', icon: '🔍' },
  color_hunt: { label: 'Outdoor Palette', code: 'COL-05', icon: '🎨' },
  mindfulness: { label: 'Mindful Observation', code: 'SNS-06', icon: '✨' },
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
  // STRICTLY Camera Shutter Only (capture="environment") - No file explorer!
  const cameraOnlyInputRef = useRef<HTMLInputElement | null>(null);

  const cat = CATEGORY_METADATA[challenge.category] || { label: 'Field Expedition', code: 'EXP-01', icon: '🌱' };

  // Detect mobile device vs Windows/Desktop
  const isMobile =
    typeof navigator !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const handleCameraTrigger = () => {
    if (isMobile && cameraOnlyInputRef.current) {
      // On mobile (Android / iOS), invoke the native mobile camera app
      cameraOnlyInputRef.current.click();
    } else {
      // On Windows / Mac / Desktop, launch the live webcam viewfinder
      onOpenCapture();
    }
  };

  const handleCameraPhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      {/* Category Theme Switcher Bar with Stylish Pills */}
      <div className="mb-8">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--terra-ink-tertiary)] mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--terra-accent)]" />
            <span className="text-gradient-emerald">Select Expedition Focus:</span>
          </span>
          <span className="text-[10px] opacity-75">Click to generate specific mission</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSkipChallenge()}
            disabled={isSkipping}
            className="px-4 py-2 rounded-full btn-stylish-secondary text-xs font-mono disabled:opacity-50"
            title="Randomize challenge"
          >
            <span>🎲</span>
            <span>Surprise Me</span>
          </button>

          <button
            onClick={() => onSkipChallenge('light_sky')}
            disabled={isSkipping}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
              challenge.category === 'light_sky'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 text-emerald-400 shadow-sm shadow-emerald-500/20 scale-105'
                : 'btn-stylish-secondary'
            }`}
          >
            <span>☁️</span>
            <span>Sky & Clouds</span>
          </button>

          <button
            onClick={() => onSkipChallenge('textures')}
            disabled={isSkipping}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
              challenge.category === 'textures'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 text-emerald-400 shadow-sm shadow-emerald-500/20 scale-105'
                : 'btn-stylish-secondary'
            }`}
          >
            <span>🌲</span>
            <span>Bark & Rocks</span>
          </button>

          <button
            onClick={() => onSkipChallenge('patterns')}
            disabled={isSkipping}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
              challenge.category === 'patterns'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 text-emerald-400 shadow-sm shadow-emerald-500/20 scale-105'
                : 'btn-stylish-secondary'
            }`}
          >
            <span>🔍</span>
            <span>Micro Moss</span>
          </button>

          <button
            onClick={() => onSkipChallenge('color_hunt')}
            disabled={isSkipping}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
              challenge.category === 'color_hunt'
                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400 text-emerald-400 shadow-sm shadow-emerald-500/20 scale-105'
                : 'btn-stylish-secondary'
            }`}
          >
            <span>🎨</span>
            <span>Color Hunt</span>
          </button>
        </div>
      </div>

      {/* Precision Chronometer Telemetry HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {/* Task Chronometer with Radiant Gradient Digits */}
        <div className="terra-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 text-gradient-emerald">
              <Timer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Task Chrono</span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="text-3xl sm:text-5xl font-chrono font-extrabold text-gradient-aurora tracking-tight">
            {formatDuration(taskSeconds)}
          </div>
        </div>

        {/* Total Session Chronometer */}
        <div className="terra-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--terra-ink-tertiary)] font-bold flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Session Total</span>
          </div>
          <div className="text-3xl sm:text-5xl font-chrono font-extrabold text-[var(--terra-ink)] tracking-tight">
            {formatDuration(sessionSeconds)}
          </div>
        </div>

        {/* Missions Completed Counter */}
        <div className="col-span-2 sm:col-span-1 terra-card p-5 sm:p-6 rounded-3xl flex flex-col justify-between">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--terra-ink-tertiary)] font-bold mb-2">
            Missions Verified
          </div>
          <div className="text-3xl sm:text-5xl font-chrono font-extrabold text-gradient-emerald">
            {completedCount} <span className="text-xs font-mono font-normal text-[var(--terra-ink-tertiary)]">completed</span>
          </div>
        </div>
      </div>

      {/* Main Field Directive Dossier */}
      <div className="terra-card p-7 sm:p-12 rounded-3xl mb-8 relative overflow-hidden">
        {/* Top Field Kicker */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono mb-6 pb-4 border-b border-[var(--terra-border)]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              {cat.code}
            </span>
            <span className="font-bold text-[var(--terra-ink)]">{cat.label}</span>
          </div>

          <div className="text-[var(--terra-ink-tertiary)] flex items-center gap-2">
            <span>Target: ~{challenge.suggestedDurationMinutes} min</span>
            <span className="text-[var(--terra-border-strong)]">/</span>
            <span className="text-gradient-emerald font-bold">Gemma 4 Vision Model</span>
          </div>
        </div>

        {/* Challenge Title in Gorgeous Multi-Stop Gradient */}
        <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-gradient-aurora tracking-tight leading-tight mb-5">
          {challenge.title}
        </h2>

        {/* Outdoor Assignment Body */}
        <p className="text-lg sm:text-xl text-[var(--terra-ink-secondary)] leading-relaxed mb-8 font-normal">
          {challenge.description}
        </p>

        {/* Step Away Directive */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--terra-panel-elevated)] border border-[var(--terra-border)] mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <div className="font-display font-bold text-base text-[var(--terra-ink)] mb-1">
                Put your screen down & explore outside
              </div>
              <p className="text-xs sm:text-sm text-[var(--terra-ink-secondary)] leading-relaxed">
                Step into the open air. Look up at the sky or scan the ground, locate your target, and return only when ready to take a live photo.
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

        {/* ============================================================== */}
        {/* CAMERA ONLY SHUTTER ACTION - ZERO FILE EXPLORER / PICKER!    */}
        {/* ============================================================== */}
        <div className="flex flex-col items-center justify-center pt-2">
          <button
            onClick={handleCameraTrigger}
            className="w-full sm:w-auto py-5 px-10 btn-stylish-camera text-base sm:text-xl flex items-center justify-center gap-3.5 shadow-2xl cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <span>Click Photo with Camera</span>
            <ArrowRight className="w-5 h-5 opacity-90" />
          </button>

          <p className="text-[11px] font-mono text-[var(--terra-ink-tertiary)] mt-3">
            📷 Hardware camera opens directly — no file selection
          </p>
        </div>

        {/* Hidden Camera-Only Input (capture="environment") */}
        <input
          ref={cameraOnlyInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraPhotoCapture}
          className="hidden"
        />
      </div>

      {/* Footer Navigation Bar with Stylish Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--terra-ink-tertiary)] px-2">
        <span>Timers calculate continuously via timestamp delta. Refreshes preserve state.</span>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSkipChallenge()}
            disabled={isSkipping}
            className="px-4 py-2 rounded-full btn-stylish-secondary text-xs flex items-center gap-2 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSkipping ? 'animate-spin' : ''}`} />
            <span>Shuffle Mission</span>
          </button>

          <button
            onClick={onEndSession}
            className="px-4 py-2 rounded-full border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Expedition</span>
          </button>
        </div>
      </div>
    </div>
  );
};
