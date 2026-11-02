/**
 * What a waiting app version says about itself, and the "Updated" notice
 * that follows an automatic update (W9b).
 *
 * Each build publishes /version.json (vite.config.ts, from release-notes.json):
 * its newest release number, that release's one-line note in EN/PT/ES, and
 * the newest release marked critical. It is NOT precached — fetched from the
 * network it describes what the server now serves, i.e. the version that is
 * waiting. Compared with this build's own release (APP_RELEASE):
 *  - a newer release → "What's new: <note>" on the update prompt;
 *  - a critical release newer than ours → the update applies at the next safe
 *    moment even after "Later" (usePWA).
 * Offline, or no version.json: no note, not critical — the plain prompt.
 */
import { APP_RELEASE } from '../buildInfo';
import { RELEASE_LANGUAGES, type ReleaseNoteText, type VersionInfo } from '../release/releaseNotes';

export const VERSION_URL = '/version.json';
export const VERSION_FETCH_TIMEOUT_MS = 5_000;

/** The waiting version, relative to the running one. */
export interface IncomingVersion {
  /** Its note, when it is a newer release than the running one. */
  notes: ReleaseNoteText | null;
  /** A release marked critical lies between the running version and it. */
  critical: boolean;
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** /version.json as published, or null when it is not in that shape. */
export function parseVersionInfo(raw: unknown): VersionInfo | null {
  if (!isObject(raw)) return null;
  const { build, date, release, critical, criticalSince, notes } = raw;
  if (typeof build !== 'string' || typeof date !== 'string' || typeof critical !== 'boolean') return null;
  if (typeof release !== 'number' || !Number.isInteger(release) || release < 0) return null;
  if (typeof criticalSince !== 'number' || !Number.isInteger(criticalSince) || criticalSince < 0) return null;
  if (!isObject(notes) || !RELEASE_LANGUAGES.every((l) => typeof notes[l] === 'string' && notes[l] !== '')) return null;
  return { build, date, release, critical, criticalSince, notes: notes as unknown as ReleaseNoteText };
}

export function compareWithRunning(info: VersionInfo, running: number = APP_RELEASE.release): IncomingVersion {
  return {
    notes: info.release > running ? info.notes : null,
    critical: info.criticalSince > running,
  };
}

/** Fetch /version.json from the network (bounded); null offline / on any failure. */
export async function fetchIncomingVersion(): Promise<IncomingVersion | null> {
  try {
    const response = await Promise.race([
      fetch(VERSION_URL, { cache: 'no-store' }),
      new Promise<undefined>((resolve) => setTimeout(() => resolve(undefined), VERSION_FETCH_TIMEOUT_MS)),
    ]);
    if (!response?.ok) return null;
    const info = parseVersionInfo(await response.json());
    return info ? compareWithRunning(info) : null;
  } catch {
    return null;
  }
}

/** The note in the learner's language (en / pt / es; anything else reads English). */
export function noteFor(notes: ReleaseNoteText, language: string | undefined): string {
  const base = (language ?? 'en').slice(0, 2);
  return base === 'pt' || base === 'es' ? notes[base] : notes.en;
}

// ─── The "Updated" notice across the reload ──────────────────────────────────
// An automatic update reloads the page; the notice belongs to the NEXT page.
// A marker in sessionStorage (per tab, survives a reload) carries it over.

const UPDATED_KEY = 'fermata-pwa-auto-updated';
/** A marker older than this is stale (the reload it announced never came). */
export const UPDATED_MARKER_MAX_AGE_MS = 120_000;

export type AutoUpdateReason = 'fresh-start' | 'critical';

/** Before an automatic update: remember it, for the notice after the reload. */
export function markAutoUpdate(reason: AutoUpdateReason): void {
  try {
    sessionStorage.setItem(UPDATED_KEY, JSON.stringify({ fromRelease: APP_RELEASE.release, reason, at: Date.now() }));
  } catch {
    // Storage blocked: the update still applies, only the notice is lost.
  }
}

export function clearAutoUpdateMark(): void {
  try {
    sessionStorage.removeItem(UPDATED_KEY);
  } catch {
    // nothing to clear
  }
}

/** After a reload: the marker of an automatic update just applied (read once), or null. */
export function takeAutoUpdateMark(): { fromRelease: number; reason: AutoUpdateReason } | null {
  try {
    const raw = sessionStorage.getItem(UPDATED_KEY);
    if (raw === null) return null;
    sessionStorage.removeItem(UPDATED_KEY);
    const mark: unknown = JSON.parse(raw);
    if (!isObject(mark) || typeof mark.fromRelease !== 'number' || typeof mark.at !== 'number') return null;
    if (mark.reason !== 'fresh-start' && mark.reason !== 'critical') return null;
    const age = Date.now() - mark.at;
    if (age < 0 || age > UPDATED_MARKER_MAX_AGE_MS) return null;
    return { fromRelease: mark.fromRelease, reason: mark.reason };
  } catch {
    return null;
  }
}
