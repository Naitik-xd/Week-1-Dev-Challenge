import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  X,
  RotateCcw,
  Sparkles,
  Check,
  RefreshCw,
  AlertCircle,
  FlipHorizontal,
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
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera stream tracks
  const stopWebcam = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      setStream(null);
    }
    setIsCameraActive(false);
  }, [stream]);

  // Start live webcam stream (works on Windows, Mac, Linux, and modern mobile browsers)
  const startWebcam = useCallback(async () => {
    setIsLoadingCamera(true);
    setCameraError(null);

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Webcam API is not available on this browser.');
      setIsLoadingCamera(false);
      return;
    }

    let activeStream: MediaStream | null = null;

    // 1st attempt: Desired facingMode
    try {
      activeStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facingMode } },
        audio: false,
      });
    } catch {
      // 2nd attempt: Generic video (standard Windows webcam)
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      } catch (err: any) {
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera permission denied. Allow camera access in your browser settings.'
            : 'Webcam could not be started. Make sure your camera is connected and not used by another application.'
        );
        setIsLoadingCamera(false);
        return;
      }
    }

    if (activeStream) {
      setStream(activeStream);
      setIsCameraActive(true);
      setIsLoadingCamera(false);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = activeStream;
        video.onloadedmetadata = () => {
          video.play().catch(() => {});
        };
      }
    }
  }, [facingMode, stream]);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPhotoDataUrl(null);
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [isOpen]);

  // Keep video.srcObject attached if element mounts after stream
  useEffect(() => {
    if (videoRef.current && stream && !photoDataUrl) {
      const video = videoRef.current;
      if (video.srcObject !== stream) {
        video.srcObject = stream;
        video.play().catch(() => {});
      }
    }
  }, [stream, photoDataUrl]);

  // Snap photo from live webcam stream
  const handleSnapFromWebcam = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 220);

    const canvas = canvasRef.current || document.createElement('canvas');
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    setPhotoDataUrl(dataUrl);

    stopWebcam();
  };

  // Flip front/back camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    stopWebcam();
    setTimeout(() => {
      startWebcam();
    }, 100);
  };

  // Mobile native camera fallback
  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 220);

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPhotoDataUrl(result);
        stopWebcam();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRetake = () => {
    setPhotoDataUrl(null);
    startWebcam();
  };

  const handleVerify = () => {
    if (photoDataUrl) {
      onSubmitPhoto(photoDataUrl);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      {/* Modal card constrained to max 84vh so buttons are never cropped on Windows */}
      <div className="relative w-full max-w-lg max-h-[84vh] rounded-3xl bg-[#090d0a] text-white border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Flash snap visual effect */}
        {flashActive && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none snap-flash-effect" />
        )}

        {/* Modal Header (Fixed height, shrink-0) */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between border-b border-white/10 bg-[#090d0a] shrink-0">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Camera Viewfinder</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white/90 truncate max-w-[240px] sm:max-w-xs">
              {challenge.title}
            </div>
          </div>

          <button
            onClick={() => {
              stopWebcam();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Area: Compact aspect-ratio so bottom controls always stay visible */}
        <div className="relative w-full flex-1 max-h-[46vh] min-h-[190px] bg-black flex items-center justify-center overflow-hidden">
          {photoDataUrl ? (
            /* Review Captured Photo */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={photoDataUrl}
                alt="Captured outdoor evidence"
                className="w-full h-full object-contain"
              />

              {/* Viewfinder Crosshair Overlay */}
              <div className="absolute inset-5 sm:inset-6 pointer-events-none border border-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                <div className="w-5 h-5 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                <div className="w-5 h-5 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                <div className="w-5 h-5 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
              </div>

              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span className="font-bold">Photo Captured</span>
              </div>
            </div>
          ) : (
            /* Live Webcam Video Feed */
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isCameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Loading Spinner */}
              {isLoadingCamera && !isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/80 z-20">
                  <div className="w-9 h-9 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-white/70 font-mono tracking-wider">
                    Connecting camera feed...
                  </span>
                </div>
              )}

              {/* Camera Error / Permission Fallback */}
              {cameraError && !isCameraActive && (
                <div className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center bg-[#090d0a] z-20">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
                    Camera Hardware Standby
                  </h4>
                  <p className="text-[11px] text-white/70 max-w-xs mb-4 leading-relaxed">
                    {cameraError}
                  </p>

                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <button
                      onClick={startWebcam}
                      className="py-2.5 px-4 rounded-xl btn-stylish-primary text-xs flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Webcam</span>
                    </button>

                    <button
                      onClick={() => mobileInputRef.current?.click()}
                      className="py-2 px-4 rounded-xl btn-stylish-secondary text-xs flex items-center justify-center gap-2"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Launch Native Shutter</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Viewfinder Reticle */}
              {isCameraActive && (
                <div className="absolute inset-5 sm:inset-6 pointer-events-none border border-white/20 rounded-2xl flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0 rounded-tl-lg" />
                  <div className="w-5 h-5 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0 rounded-tr-lg" />
                  <div className="w-5 h-5 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0 rounded-bl-lg" />
                  <div className="w-5 h-5 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0 rounded-br-lg" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400/80 animate-ping" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Controls (Fixed height, shrink-0 - completely visible on Windows) */}
        <div className="p-3 sm:p-4 bg-[#090d0a] border-t border-white/10 shrink-0">
          {photoDataUrl ? (
            /* Review Buttons */
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 px-3 rounded-full btn-stylish-secondary text-xs sm:text-sm flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                onClick={handleVerify}
                className="flex-[2] py-3 px-5 rounded-full btn-stylish-primary text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Verify with Gemma 4</span>
              </button>
            </div>
          ) : (
            /* Live Shutter Controls (Desktop & Mobile) */
            <div className="flex items-center justify-between px-2 sm:px-4">
              {/* Flip camera toggle */}
              <button
                onClick={handleToggleFacingMode}
                disabled={!isCameraActive}
                className="p-2.5 rounded-full btn-stylish-secondary disabled:opacity-40"
                title="Flip Camera"
                aria-label="Flip Camera"
              >
                <FlipHorizontal className="w-4 h-4 text-emerald-400" />
              </button>

              {/* Dominant Shutter Snap Button (Comfortable padding, never cropped) */}
              <button
                onClick={handleSnapFromWebcam}
                disabled={!isCameraActive}
                className="py-3 px-7 sm:py-3.5 sm:px-9 btn-stylish-camera text-sm sm:text-base flex items-center gap-2.5 shadow-xl active:scale-95 disabled:opacity-40 cursor-pointer"
                aria-label="Take picture"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white" />
                </div>
                <span>Click Photo</span>
              </button>

              {/* Quick Native Camera Option */}
              <button
                onClick={() => mobileInputRef.current?.click()}
                className="p-2.5 rounded-full btn-stylish-secondary cursor-pointer"
                title="Launch Native Device Camera"
                aria-label="Launch Device Camera"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          )}
        </div>

        {/* Hidden Elements */}
        <canvas ref={canvasRef} className="hidden" />
        <input
          ref={mobileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleMobileFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
