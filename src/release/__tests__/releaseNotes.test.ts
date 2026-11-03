/**
 * release-notes.json (W9b): the source of the update prompt's "What's new"
 * line and of the critical switch. The build parses it with the same
 * function and fails on any problem; this test fails first.
 */
import { describe, it, expect } from 'vitest';
import releaseNotesSource from '../../../release-notes.json?raw';
import { parseReleaseNotes, versionInfo, MAX_NOTE_LENGTH, type ReleaseNote } from '../releaseNotes';

const NOTES = { en: 'One line.', pt: 'Uma linha.', es: 'Una línea.' };
const entry = (release: number, critical = false): ReleaseNote => ({ release, date: '2026-11-02', critical, notes: NOTES });

describe('the shipped release-notes.json', () => {
  const releases = parseReleaseNotes(JSON.parse(releaseNotesSource));

  it('parses (newest first, numbered without gaps)', () => {
    expect(releases.length).toBeGreaterThan(0);
    releases.forEach((r, i) => expect(r.release).toBe(releases[0].release - i));
  });

  it('every note is translated (PT and ES differ from the English line)', () => {
    for (const r of releases) {
      expect(r.notes.pt).not.toBe(r.notes.en);
      expect(r.notes.es).not.toBe(r.notes.en);
    }
  });
});

describe('parseReleaseNotes rejects what must never ship', () => {
  const problem = (raw: unknown) => {
    try {
      parseReleaseNotes(raw);
      return '';
    } catch (e) {
      return (e as Error).message;
    }
  };

  it('accepts a well-formed list', () => {
    expect(problem({ releases: [entry(2, true), entry(1)] })).toBe('');
  });

  it.each([
    ['no list', {}, 'non-empty array'],
    ['an empty list', { releases: [] }, 'non-empty array'],
    ['a release that is not a whole number', { releases: [{ ...entry(1), release: 1.5 }] }, 'whole number'],
    ['a bad date', { releases: [{ ...entry(1), date: '2 Nov' }] }, 'YYYY-MM-DD'],
    ['critical not a boolean', { releases: [{ ...entry(1), critical: 'no' }] }, 'true or false'],
    ['a missing language', { releases: [{ ...entry(1), notes: { en: 'a', pt: 'b' } }] }, 'notes.es is missing'],
    ['a two-line note', { releases: [{ ...entry(1), notes: { ...NOTES, pt: 'a\nb' } }] }, 'one line'],
    ['a note too long', { releases: [{ ...entry(1), notes: { ...NOTES, en: 'x'.repeat(MAX_NOTE_LENGTH + 1) } }] }, 'longer than'],
    ['oldest first', { releases: [entry(1), entry(2)] }, 'newest first'],
    ['a gap', { releases: [entry(3), entry(1)] }, 'go down by 1'],
  ])('%s', (_label, raw, message) => {
    expect(problem(raw)).toContain(message);
  });
});

describe('versionInfo (dist/version.json)', () => {
  it('describes the newest release; criticalSince = the newest critical one', () => {
    const info = versionInfo([entry(5), entry(4, true), entry(3), entry(2, true), entry(1)], 'abc1234def56', '2026-11-02');
    expect(info).toEqual({ build: 'abc1234def56', date: '2026-11-02', release: 5, critical: false, criticalSince: 4, notes: NOTES });
  });

  it('criticalSince 0 when no release was ever critical', () => {
    expect(versionInfo([entry(2), entry(1)], 'b', 'd').criticalSince).toBe(0);
  });
});
