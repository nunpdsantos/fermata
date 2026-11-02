// Replaced at build time by vite.config.ts `define` (the UTC date of the
// build). Absent under Vitest, where the date reads as null.
declare const __BUILD_DATE__: string | undefined;

/** "2026-10-31" for a real build, null in unit tests. */
export const BUILD_DATE: string | null = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : null;
