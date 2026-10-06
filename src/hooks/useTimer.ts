import { useState, useEffect } from 'react';
import { calculateElapsedSeconds } from '../utils/timeFormat';

interface UseTimerProps {
  sessionStartedAt: number | null;
  taskAssignedAt: number | null;
  isActive: boolean;
}

export function useSessionTimers({ sessionStartedAt, taskAssignedAt, isActive }: UseTimerProps) {
  const [sessionSeconds, setSessionSeconds] = useState<number>(() => {
    return sessionStartedAt ? calculateElapsedSeconds(sessionStartedAt) : 0;
  });

  const [taskSeconds, setTaskSeconds] = useState<number>(() => {
    return taskAssignedAt ? calculateElapsedSeconds(taskAssignedAt) : 0;
  });

  useEffect(() => {
    if (!isActive) return;

    // Immediately update on mount or prop change
    if (sessionStartedAt) {
      setSessionSeconds(calculateElapsedSeconds(sessionStartedAt));
    }
    if (taskAssignedAt) {
      setTaskSeconds(calculateElapsedSeconds(taskAssignedAt));
    }

    const interval = setInterval(() => {
      if (sessionStartedAt) {
        setSessionSeconds(calculateElapsedSeconds(sessionStartedAt));
      }
      if (taskAssignedAt) {
        setTaskSeconds(calculateElapsedSeconds(taskAssignedAt));
      }
    }, 500);

    return () => clearInterval(interval);
  }, [sessionStartedAt, taskAssignedAt, isActive]);

  return {
    sessionSeconds,
    taskSeconds,
  };
}
