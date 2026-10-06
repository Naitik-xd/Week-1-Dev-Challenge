import { SessionData, Theme } from '../types';

const SESSION_STORAGE_KEY = 'touchgrass_session_v1';
const THEME_STORAGE_KEY = 'touchgrass_theme_v1';

export function saveSessionToStorage(session: SessionData): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('[TouchGrass] Unable to persist session to localStorage:', err);
  }
}

export function loadSessionFromStorage(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionData;
    // Validate essential timestamp fields
    if (!parsed.sessionId || !parsed.sessionStartedAt) {
      return null;
    }
    return parsed;
  } catch (err) {
    console.warn('[TouchGrass] Unable to load session from localStorage:', err);
    return null;
  }
}

export function clearSessionFromStorage(): void {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.warn('[TouchGrass] Unable to clear session from localStorage:', err);
  }
}

export function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // fallback
  }
  return 'dark'; // Default to sleek futuristic dark
}

export function saveThemePreference(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore
  }
}
