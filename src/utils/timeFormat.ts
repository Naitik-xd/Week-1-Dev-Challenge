/**
 * Formats seconds into human-friendly duration strings:
 * - While short: "14 sec"
 * - Above 60 sec: "01:24", "04:37", "12:08"
 * - Above an hour: "1h 14m"
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '0 sec';
  }

  const rounded = Math.floor(seconds);

  if (rounded < 60) {
    return `${rounded} sec`;
  }

  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;

  if (mins < 60) {
    const paddedMins = mins.toString().padStart(2, '0');
    const paddedSecs = secs.toString().padStart(2, '0');
    return `${paddedMins}:${paddedSecs}`;
  }

  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

/**
 * Detailed readable duration for summary screens:
 * e.g. "14 min 32 sec"
 */
export function formatDetailedDuration(seconds: number): string {
  const rounded = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(rounded / 60);
  const secs = rounded % 60;

  if (mins === 0) {
    return `${secs} seconds`;
  }
  return `${mins} min ${secs} sec`;
}

/**
 * Calculates elapsed seconds between a start timestamp and now (or end timestamp)
 * Never returns negative numbers.
 */
export function calculateElapsedSeconds(startTimestamp: number, endTimestamp?: number): number {
  if (!startTimestamp) return 0;
  const current = endTimestamp || Date.now();
  const diffMs = current - startTimestamp;
  return Math.max(0, Math.floor(diffMs / 1000));
}
