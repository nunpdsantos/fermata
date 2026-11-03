/**
 * Release notes (W9b) — the parser shared by the build (vite.config.ts reads
 * release-notes.json at the repo root and publishes dist/version.json) and
 * its unit test. Pure: no DOM, no Node APIs.
 *
 * Each entry is a release the learner can be told about: a number that goes
 * up by one per entry, a one-line note in each app language, and a `critical`
 * flag — the emergency switch: an app on an older release applies the new
 * version at the next safe moment even after "Later".
 */

export const RELEASE_LANGUAGES = ['en', 'pt', 'es'] as const;
export type ReleaseLanguage = (typeof RELEASE_LANGUAGES)[number];
export type ReleaseNoteText = Record<ReleaseLanguage, string>;

export interface ReleaseNote {
  release: number;
  /** YYYY-MM-DD, for people reading the file. */
  date: string;
  critical: boolean;
  notes: ReleaseNoteText;
}

/** One line per language. */
export const MAX_NOTE_LENGTH = 160;

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/**
 * The releases in release-notes.json, newest first — or an Error listing
 * every problem (the build fails on it; a wrong note must never ship).
 */
export function parseReleaseNotes(raw: unknown): ReleaseNote[] {
  const problems: string[] = [];
  const list = isObject(raw) ? raw.releases : undefined;
  if (!Array.isArray(list) || list.length === 0) throw new Error('release-notes.json: "releases" must be a non-empty array');
  const out: ReleaseNote[] = [];
  list.forEach((entry: unknown, i) => {
    const at = `releases[${i}]`;
    if (!isObject(entry)) {
      problems.push(`${at} is not an object`);
      return;
    }
    const { release, date, critical, notes } = entry;
    if (typeof release !== 'number' || !Number.isInteger(release) || release < 1) problems.push(`${at}.release must be a whole number ≥ 1`);
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) problems.push(`${at}.date must be YYYY-MM-DD`);
    if (typeof critical !== 'boolean') problems.push(`${at}.critical must be true or false`);
    if (!isObject(notes)) {
      problems.push(`${at}.notes must be { en, pt, es }`);
    } else {
      for (const lang of RELEASE_LANGUAGES) {
        const text = notes[lang];
        if (typeof text !== 'string' || text.trim() === '') problems.push(`${at}.notes.${lang} is missing`);
        else if (/[\r\n]/.test(text)) problems.push(`${at}.notes.${lang} must be one line`);
        else if (text.length > MAX_NOTE_LENGTH) problems.push(`${at}.notes.${lang} is longer than ${MAX_NOTE_LENGTH} characters`);
      }
    }
    out.push(entry as unknown as ReleaseNote);
  });
  // Newest first, one number per release, no gaps: release N+1 follows N.
  for (let i = 1; i < out.length; i++) {
    if (out[i - 1].release !== out[i].release + 1) {
      problems.push(`releases must be newest first and go down by 1 (releases[${i - 1}] = ${out[i - 1].release}, releases[${i}] = ${out[i].release})`);
    }
  }
  if (problems.length > 0) throw new Error(`release-notes.json:\n  ${problems.join('\n  ')}`);
  return out;
}

/** What a build publishes about itself (dist/version.json). */
export interface VersionInfo {
  /** Commit the build came from (informational). */
  build: string;
  /** Build date, UTC, YYYY-MM-DD. */
  date: string;
  /** The newest release in this build. */
  release: number;
  /** The newest release is marked critical. */
  critical: boolean;
  /**
   * The newest release marked critical (0 = none ever). An app on an older
   * release than this must update at the next safe moment — even when a
   * later, non-critical release has shipped since (it skipped the critical one).
   */
  criticalSince: number;
  /** One line about the newest release. */
  notes: ReleaseNoteText;
}

export function versionInfo(releases: ReleaseNote[], build: string, date: string): VersionInfo {
  const newest = releases[0];
  return {
    build,
    date,
    release: newest.release,
    critical: newest.critical,
    criticalSince: releases.find((r) => r.critical)?.release ?? 0,
    notes: newest.notes,
  };
}
