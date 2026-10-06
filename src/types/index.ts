export type ChallengeCategory =
  | 'botany'
  | 'textures'
  | 'light_sky'
  | 'patterns'
  | 'mindfulness'
  | 'color_hunt';

export interface OutdoorChallenge {
  id: string;
  title: string;
  description: string;
  suggestedDurationMinutes: number;
  evidenceType: 'photo';
  category: ChallengeCategory;
  safetyTip: string;
  tags?: string[];
  source?: 'gemma_4_openweight' | 'curated_fallback';
}

export type SessionStatus =
  | 'idle'
  | 'generating'
  | 'active_task'
  | 'validating'
  | 'completed'
  | 'interrupted'
  | 'ended';

export interface CompletedChallengeRecord {
  id: string;
  challenge: OutdoorChallenge;
  taskDurationSeconds: number;
  completedAt: number;
  feedback: string;
  reason?: string;
  photoPreview?: string;
}

export interface SessionData {
  sessionId: string;
  sessionStartedAt: number; // Date.now() timestamp
  currentTask: OutdoorChallenge | null;
  taskAssignedAt: number | null; // Date.now() timestamp
  sessionStatus: SessionStatus;
  completedChallenges: CompletedChallengeRecord[];
  interruptedReason?: string;
}

export interface AIValidationResult {
  passed: boolean;
  confidence: number;
  reason: string;
  feedback: string;
  aiEnabled?: boolean;
  fallbackNotice?: string;
}

export type Theme = 'dark' | 'light';
