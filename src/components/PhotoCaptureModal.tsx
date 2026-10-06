import React, { useState, useRef } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  Sparkles,
  Check,
  Upload,
  Image as ImageIcon,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { OutdoorChallenge } from '../types';

interface PhotoCaptureModalProps {
  isOpen: boolean;
  challenge: OutdoorChallenge;
  onClose: () => void;
  onSubmitPhoto: (imageBase64: string) => void;
}

export const PhotoCaptureModal: React.FC<PhotoCaptureModalProps> = ({
  isOpen,
  challenge,
  onClose,
  onSubmitPhoto,
}) => {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [flashActive, setFlashActive] = useState<boolean>(false);

  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  // Trigger direct device photo camera (Native camera shutter)
  const openDeviceCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // Trigger file / photo selection
  const openGallerySelect = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  // Process captured image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 250);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoDataUrl(result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);

    // Reset input so taking another photo triggers event again
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
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0f1411] text-white border border-white/10 shadow-2xl overflow-hidden">
        {/* Flash snap visual effect */}
        {flashActive && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none snap-flash-effect" />
        )}

        {/* Modal Header */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0f1411]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
              Outdoor Evidence Camera
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

              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Photo Staged for Gemma 4</span>
              </div>
            </div>
          ) : (
            /* Standby / Direct Camera Shutter Trigger UI */
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 shadow-inner">
                <Camera className="w-10 h-10" />
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                Capture Still Photo
              </h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-xs mb-8 leading-relaxed">
                Take a direct photo using your device camera to document your discovery outdoors.
              </p>

              <div className="flex flex-col gap-3 w-full max-w-xs">
                {/* Primary Button: OPENS CAMERA DIRECTLY */}
                <button
                  onClick={openDeviceCamera}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span>Open Camera Shutter</span>
                </button>

                {/* Secondary: Choose from photos */}
                <button
                  onClick={openGallerySelect}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl border border-white/15 hover:bg-white/10 text-white/80 font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Select from Camera Roll / Files</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        {photoDataUrl && (
          <div className="p-5 bg-[#0f1411] border-t border-white/10 flex items-center gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3.5 px-4 rounded-xl border border-white/15 hover:bg-white/10 text-white/80 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Photo</span>
            </button>

            <button
              onClick={handleVerify}
              className="flex-[2] py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-100" />
              <span>Analyze with Gemma 4</span>
            </button>
          </div>
        )}

        {/* Hidden HTML5 Native Camera File Inputs */}
        {/* capture="environment" specifically instructs mobile OS to launch native photo camera directly */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Standard file selector without forced camera lock */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
