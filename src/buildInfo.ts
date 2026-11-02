import type { ReleaseNoteText } from './release/releaseNotes';

// Replaced at build time by vite.config.ts `define` (the UTC date of the
// build). Absent under Vitest, where the date reads as null.
declare const __BUILD_DATE__: string | undefined;

/** "2026-10-31" for a real build, null in unit tests. */
export const BUILD_DATE: string | null = typeof __BUILD_DATE__ === 'string' ? __BUILD_DATE__ : null;

// The newest entry of release-notes.json at build time (W9b), replaced by
// vite.config.ts `define`. Only the release number and its note: the build id
// stays out of the bundle, so a commit that changes no code ships no update
// the same UTC day. (The build DATE above IS in the bundle: a deploy on a
// later day is a new version even without code changes — kept, because the
// Settings footer shows it; review W9b-b, CLAUDE.md.)
declare const __APP_RELEASE__: { release: number; notes: ReleaseNoteText } | undefined;

/** This build's release (0 and no note under Vitest, where the define is absent). */
export const APP_RELEASE: { release: number; notes: ReleaseNoteText | null } =
  typeof __APP_RELEASE__ === 'object' && __APP_RELEASE__ !== null ? __APP_RELEASE__ : { release: 0, notes: null };
