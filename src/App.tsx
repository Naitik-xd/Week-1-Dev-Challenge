/**
 * TouchGrass — Hacktoberfest 2026 Week 1
 * Turn screen time into real-world outdoor time with open-weight AI.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  OutdoorChallenge,
  SessionData,
  SessionStatus,
  AIValidationResult,
  Theme,
  CompletedChallengeRecord,
} from './types';
import {
  loadSessionFromStorage,
  saveSessionToStorage,
  clearSessionFromStorage,
  getInitialTheme,
  saveThemePreference,
} from './utils/storage';
import { fetchOutdoorChallenge, validateOutdoorEvidence } from './services/api';
import { useSessionTimers } from './hooks/useTimer';
import { formatDuration } from './utils/timeFormat';

import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { ActiveChallengeView } from './components/ActiveChallengeView';
import { CameraCaptureModal } from './components/CameraCaptureModal';
import { ValidationModal } from './components/ValidationModal';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { InterruptedModal } from './components/InterruptedModal';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Core Session State
  const [session, setSession] = useState<SessionData | null>(() => {
    return loadSessionFromStorage();
  });

  // UI Flow & Modals State
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isInterruptedModalOpen, setIsInterruptedModalOpen] = useState<boolean>(false);
  const [isLoadingChallenge, setIsLoadingChallenge] = useState<boolean>(false);

  // Evidence & Validation State
  const [isValidatingPhoto, setIsValidatingPhoto] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<AIValidationResult | null>(null);
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState<string | null>(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState<boolean>(false);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    saveThemePreference(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Active timers hook (refresh-safe, calculated directly from timestamps)
  const isSessionActive = Boolean(
    session &&
      session.sessionStatus === 'active_task' &&
      session.sessionStartedAt &&
      session.taskAssignedAt
  );

  const { sessionSeconds, taskSeconds } = useSessionTimers({
    sessionStartedAt: session?.sessionStartedAt || null,
    taskAssignedAt: session?.taskAssignedAt || null,
    isActive: isSessionActive,
  });

  // Persist session changes to localStorage
  useEffect(() => {
    if (session) {
      saveSessionToStorage(session);
    }
  }, [session]);

  // Handle browser lifecycle / tab abandon warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (session && session.sessionStatus === 'active_task') {
        // Mark as potentially interrupted in storage so return can be handled gracefully
        const updated = { ...session, sessionStatus: 'interrupted' as SessionStatus };
        saveSessionToStorage(updated);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [session]);

  // Check if session was interrupted on initial mount
  useEffect(() => {
    if (session && session.sessionStatus === 'interrupted' && session.currentTask) {
      setIsInterruptedModalOpen(true);
    }
  }, []);

  // START NEW SESSION / PLAY
  const handleStartPlay = async () => {
    setIsLoadingChallenge(true);
    try {
      const { challenge } = await fetchOutdoorChallenge();
      const now = Date.now();
      const newSession: SessionData = {
        sessionId: `session-${now}-${Math.random().toString(36).substring(2, 6)}`,
        sessionStartedAt: now,
        currentTask: challenge,
        taskAssignedAt: now,
        sessionStatus: 'active_task',
        completedChallenges: [],
      };

      setSession(newSession);
      saveSessionToStorage(newSession);
    } catch (err) {
      console.error('[TouchGrass] Start play error:', err);
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  // SKIP / GET ANOTHER CHALLENGE (while in session)
  const handleSkipChallenge = async () => {
    if (!session) return;
    setIsLoadingChallenge(true);
    try {
      const { challenge } = await fetchOutdoorChallenge();
      const now = Date.now();
      const updated: SessionData = {
        ...session,
        currentTask: challenge,
        taskAssignedAt: now, // Reset task timer for new challenge
        sessionStatus: 'active_task',
      };
      setSession(updated);
      saveSessionToStorage(updated);
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  // CAMERA: OPEN & CAPTURE
  const handleOpenCapture = () => {
    setIsCameraOpen(true);
  };

  // SUBMIT CAPTURED PHOTO TO SERVER AI
  const handleSubmitPhoto = async (imageBase64: string) => {
    if (!session || !session.currentTask) return;

    setIsCameraOpen(false);
    setCapturedPhotoPreview(imageBase64);
    setIsValidationModalOpen(true);
    setIsValidatingPhoto(true);
    setValidationResult(null);

    const activeTask = session.currentTask;

    try {
      const result = await validateOutdoorEvidence(imageBase64, activeTask);
      setValidationResult(result);

      if (result.passed) {
        // Record completed challenge
        const now = Date.now();
        const finalTaskSeconds = taskSeconds || 1;
        const record: CompletedChallengeRecord = {
          id: `completed-${now}`,
          challenge: activeTask,
          taskDurationSeconds: finalTaskSeconds,
          completedAt: now,
          feedback: result.feedback,
          reason: result.reason,
          photoPreview: imageBase64,
        };

        const updatedSession: SessionData = {
          ...session,
          completedChallenges: [...(session.completedChallenges || []), record],
        };
        setSession(updatedSession);
        saveSessionToStorage(updatedSession);
      }
    } catch (err) {
      console.error('[TouchGrass] Validation error:', err);
    } finally {
      setIsValidatingPhoto(false);
    }
  };

  // AFTER PASS: PLAY AGAIN (starts next challenge in same session)
  const handlePlayNextChallenge = async () => {
    setIsValidationModalOpen(false);
    setValidationResult(null);
    setCapturedPhotoPreview(null);
    setIsLoadingChallenge(true);

    try {
      const { challenge } = await fetchOutdoorChallenge();
      const now = Date.now();

      if (session) {
        const updated: SessionData = {
          ...session,
          currentTask: challenge,
          taskAssignedAt: now, // New task assigned timestamp
          sessionStatus: 'active_task',
        };
        setSession(updated);
        saveSessionToStorage(updated);
      }
    } finally {
      setIsLoadingChallenge(false);
    }
  };

  // AFTER PASS: DONE FOR NOW (conclude session, put phone away)
  const handleDoneForNow = () => {
    setIsValidationModalOpen(false);
    setIsSummaryOpen(true);
  };

  // RETRY REJECTED EVIDENCE (camera opens again, taskAssignedAt is NOT reset)
  const handleRetryCapture = () => {
    setIsValidationModalOpen(false);
    setValidationResult(null);
    setIsCameraOpen(true);
  };

  // END SESSION EXPLICITLY
  const handleEndSession = () => {
    setIsSummaryOpen(true);
  };

  // START FRESH SESSION AFTER SUMMARY
  const handleStartFreshSession = () => {
    clearSessionFromStorage();
    setSession(null);
    setIsSummaryOpen(false);
    handleStartPlay();
  };

  // CLOSE SUMMARY & RETURN TO IDLE
  const handleCloseSummary = () => {
    clearSessionFromStorage();
    setSession(null);
    setIsSummaryOpen(false);
  };

  // RESUME INTERRUPTED SESSION
  const handleResumeInterrupted = () => {
    if (session) {
      const resumed: SessionData = {
        ...session,
        sessionStatus: 'active_task',
      };
      setSession(resumed);
      saveSessionToStorage(resumed);
    }
    setIsInterruptedModalOpen(false);
  };

  // START FRESH FROM INTERRUPTED MODAL
  const handleStartFreshFromInterrupted = () => {
    clearSessionFromStorage();
    setSession(null);
    setIsInterruptedModalOpen(false);
    handleStartPlay();
  };

  return (
    <div className="min-h-screen flex flex-col terra-topo-bg text-[var(--terra-ink)] selection:bg-[var(--terra-accent)] selection:text-white">

      {/* Main Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
        activeSessionDuration={session ? formatDuration(sessionSeconds) : undefined}
        hasActiveTask={isSessionActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        {!session || session.sessionStatus === 'idle' ? (
          /* Landing Screen */
          <LandingHero
            onStartPlay={handleStartPlay}
            onOpenAbout={() => setIsAboutOpen(true)}
            isLoadingChallenge={isLoadingChallenge}
          />
        ) : (
          /* Active Challenge Experience */
          session.currentTask && (
            <ActiveChallengeView
              challenge={session.currentTask}
              sessionSeconds={sessionSeconds}
              taskSeconds={taskSeconds}
              completedCount={session.completedChallenges?.length || 0}
              onOpenCapture={handleOpenCapture}
              onDirectNativeUpload={handleSubmitPhoto}
              onSkipChallenge={handleSkipChallenge}
              onEndSession={handleEndSession}
              isSkipping={isLoadingChallenge}
            />
          )
        )}
      </main>

      {/* Camera Capture Modal */}
      {session?.currentTask && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          challenge={session.currentTask}
          onClose={() => setIsCameraOpen(false)}
          onSubmitPhoto={handleSubmitPhoto}
        />
      )}

      {/* AI Validation Result Modal */}
      {session?.currentTask && (
        <ValidationModal
          isOpen={isValidationModalOpen}
          isValidating={isValidatingPhoto}
          validationResult={validationResult}
          challenge={session.currentTask}
          sessionSeconds={sessionSeconds}
          taskSeconds={taskSeconds}
          photoPreview={capturedPhotoPreview}
          onPlayAgain={handlePlayNextChallenge}
          onDoneForNow={handleDoneForNow}
          onRetryCapture={handleRetryCapture}
        />
      )}

      {/* Session Summary Modal */}
      {session && (
        <SessionSummaryModal
          isOpen={isSummaryOpen}
          session={session}
          totalSessionSeconds={sessionSeconds}
          onStartNewSession={handleStartFreshSession}
          onClose={handleCloseSummary}
        />
      )}

      {/* Interrupted Challenge Modal */}
      <InterruptedModal
        isOpen={isInterruptedModalOpen}
        challenge={session?.currentTask || null}
        onResume={handleResumeInterrupted}
        onStartFresh={handleStartFreshFromInterrupted}
      />

      {/* About & Philosophy Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Professional Hacktoberfest Footer */}
      <Footer />
    </div>
  );
}
