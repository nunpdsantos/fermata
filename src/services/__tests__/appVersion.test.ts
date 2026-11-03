/**
 * version.json on the client (W9b): what the waiting version says about
 * itself, relative to the running build — its note, and whether a critical
 * release lies in between — plus the "Updated" marker across the reload.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  parseVersionInfo,
  compareWithRunning,
  noteFor,
  fetchIncomingVersion,
  markAutoUpdate,
  takeAutoUpdateMark,
  clearAutoUpdateMark,
  VERSION_FETCH_TIMEOUT_MS,
  UPDATED_MARKER_MAX_AGE_MS,
} from '../appVersion';

const NOTES = { en: 'English line', pt: 'Linha em português', es: 'Línea en español' };
const INFO = { build: 'abc1234def56', date: '2026-11-02', release: 4, critical: false, criticalSince: 2, notes: NOTES };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  sessionStorage.clear();
});

describe('parseVersionInfo', () => {
  it('accepts the published shape', () => {
    expect(parseVersionInfo(INFO)).toEqual(INFO);
  });

  it.each([
    ['not an object', 'x'],
    ['no build', { ...INFO, build: 1 }],
    ['release not a whole number', { ...INFO, release: 1.5 }],
    ['negative criticalSince', { ...INFO, criticalSince: -1 }],
    ['critical not boolean', { ...INFO, critical: 'yes' }],
    ['a language missing', { ...INFO, notes: { en: 'a', pt: 'b' } }],
    ['an empty note', { ...INFO, notes: { ...NOTES, es: '' } }],
  ])('rejects %s', (_label, raw) => {
    expect(parseVersionInfo(raw)).toBeNull();
  });
});

describe('compareWithRunning', () => {
  it('a newer release carries its note; the same or an older one does not', () => {
    expect(compareWithRunning(INFO, 3).notes).toEqual(NOTES);
    expect(compareWithRunning(INFO, 4).notes).toBeNull();
    expect(compareWithRunning(INFO, 5).notes).toBeNull();
  });

  it('critical when a critical release is newer than the running one — even if a later normal release followed it', () => {
    expect(compareWithRunning(INFO, 1).critical).toBe(true); // 2 was critical; 4 is not, but 1 skipped 2
    expect(compareWithRunning(INFO, 2).critical).toBe(false); // already has release 2
    expect(compareWithRunning({ ...INFO, criticalSince: 0 }, 0).critical).toBe(false); // never any
  });
});

describe('noteFor', () => {
  it('picks the learner\'s language (region subtags too), English otherwise', () => {
    expect(noteFor(NOTES, 'pt')).toBe(NOTES.pt);
    expect(noteFor(NOTES, 'pt-PT')).toBe(NOTES.pt);
    expect(noteFor(NOTES, 'es-ES')).toBe(NOTES.es);
    expect(noteFor(NOTES, 'en')).toBe(NOTES.en);
    expect(noteFor(NOTES, 'fr')).toBe(NOTES.en);
    expect(noteFor(NOTES, undefined)).toBe(NOTES.en);
  });
});

describe('fetchIncomingVersion', () => {
  it('reads /version.json from the network (no-store) and compares it with this build (release 0 under tests)', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => INFO }) as Response);
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchIncomingVersion()).toEqual({ notes: NOTES, critical: true });
    expect(fetchMock).toHaveBeenCalledWith('/version.json', { cache: 'no-store' });
  });

  it('null on a 404, a network error, a malformed file, or no answer in time', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) }) as Response));
    expect(await fetchIncomingVersion()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => { throw new TypeError('offline'); }));
    expect(await fetchIncomingVersion()).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ hello: 1 }) }) as Response));
    expect(await fetchIncomingVersion()).toBeNull();
    vi.useFakeTimers();
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    const pending = fetchIncomingVersion();
    await vi.advanceTimersByTimeAsync(VERSION_FETCH_TIMEOUT_MS + 1);
    expect(await pending).toBeNull();
  });
});

describe('the "Updated" marker across the reload', () => {
  beforeEach(() => sessionStorage.clear());

  it('set before the update, read once after the reload', () => {
    markAutoUpdate('critical');
    expect(takeAutoUpdateMark()).toEqual({ fromRelease: 0, reason: 'critical' });
    expect(takeAutoUpdateMark()).toBeNull();
  });

  it('cleared when the update did not happen; stale or malformed markers are ignored', () => {
    markAutoUpdate('fresh-start');
    clearAutoUpdateMark();
    expect(takeAutoUpdateMark()).toBeNull();

    vi.useFakeTimers();
    markAutoUpdate('fresh-start');
    vi.advanceTimersByTime(UPDATED_MARKER_MAX_AGE_MS + 1);
    expect(takeAutoUpdateMark()).toBeNull();

    sessionStorage.setItem('fermata-pwa-auto-updated', '{nope');
    expect(takeAutoUpdateMark()).toBeNull();
    sessionStorage.setItem('fermata-pwa-auto-updated', JSON.stringify({ fromRelease: 1, reason: 'other', at: Date.now() }));
    expect(takeAutoUpdateMark()).toBeNull();
  });

  it('storage that throws never breaks the update', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => markAutoUpdate('fresh-start')).not.toThrow();
    spy.mockRestore();
    const get = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(takeAutoUpdateMark()).toBeNull();
    get.mockRestore();
  });
});
