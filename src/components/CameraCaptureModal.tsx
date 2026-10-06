import React, { useState, useRef } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { OutdoorChallenge } from '../types';

interface CameraCaptureModalProps {
  isOpen: boolean;
  challenge: OutdoorChallenge;
  onClose: () => void;
  onSubmitPhoto: (imageBase64: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  challenge,
  onClose,
  onSubmitPhoto,
}) => {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  // STRICTLY Native Hardware Camera Shutter Only
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const triggerCameraShutter = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 250);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoDataUrl(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
  };

  const handleVerify = () => {
    if (photoDataUrl) {
      onSubmitPhoto(photoDataUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b100c] text-white border border-white/10 shadow-2xl overflow-hidden">
        {/* Flash snap visual effect */}
        {flashActive && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none snap-flash-effect" />
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0b100c]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Camera Shutter Only
            </div>
            <div className="text-sm font-semibold text-white/90 truncate max-w-[280px]">
              {challenge.title}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport / Photo Area */}
        <div className="relative w-full aspect-[4/3] sm:aspect-square bg-black flex items-center justify-center overflow-hidden">
          {photoDataUrl ? (
            /* Review Captured Photo */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={photoDataUrl}
                alt="Captured outdoor evidence"
                className="w-full h-full object-contain"
              />

              {/* Viewfinder Crosshair Overlay */}
              <div className="absolute inset-8 pointer-events-none border border-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
              </div>

              <div className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-emerald-300 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" />
                <span className="font-bold">Photo Captured with Camera</span>
              </div>
            </div>
          ) : (
            /* Standby / Direct Camera Shutter Trigger UI */
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
                <Camera className="w-10 h-10" />
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Snap Outdoor Evidence
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xs mb-8 leading-relaxed">
                Take a direct photo using your device camera to prove you found the target outside.
              </p>

              {/* Single Action: ONLY CAMERA SHUTTER */}
              <button
                onClick={triggerCameraShutter}
                className="w-full py-4 px-8 btn-stylish-camera text-base sm:text-lg flex items-center justify-center gap-3 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <span>Click Photo with Camera</span>
              </button>

              <span className="text-[11px] font-mono text-white/40 mt-3">
                📷 Hardware camera only
              </span>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        {photoDataUrl && (
          <div className="p-5 bg-[#0b100c] border-t border-white/10 flex items-center gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3.5 px-4 rounded-full btn-stylish-secondary text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake</span>
            </button>

            <button
              onClick={handleVerify}
              className="flex-[2] py-3.5 px-6 rounded-full btn-stylish-primary text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Verify with Gemma 4</span>
            </button>
          </div>
        )}

        {/* HTML5 Native Photo Camera Input (STRICTLY capture="environment") */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
