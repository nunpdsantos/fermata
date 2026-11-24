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

describe('release 16 (2026-11-19): the audit fixes', () => {
  it('follows release 15: not critical, one line per language within 160 characters, Drill by its name in each language', async () => {
    const releases = parseReleaseNotes(JSON.parse(releaseNotesSource));
    const at = releases.findIndex((r) => r.release === 16);
    expect(at).toBeGreaterThanOrEqual(0);
    const [note, previous] = releases.slice(at);
    expect([note.release, note.date, note.critical]).toEqual([16, '2026-11-19', false]);
    expect(previous.release).toBe(15);
    for (const lang of ['en', 'pt', 'es'] as const) expect(note.notes[lang].length, lang).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
    // The Drill is wholly in Portuguese and Spanish since this release: the note names it as the top bar does.
    const { default: pt } = await import('../../i18n/locales/pt.json');
    const { default: es } = await import('../../i18n/locales/es.json');
    expect(note.notes.pt).toContain(pt.nav.drill);
    expect(note.notes.es).toContain(es.nav.drill);
    expect(note.notes.en).toContain('British spelling');
    expect([note.notes.en.length, note.notes.pt.length, note.notes.es.length]).toEqual([157, 160, 157]);
  });
});

describe('release 17 (2026-11-20): the second audit round', () => {
  it('follows release 16: not critical, one line per language within 160 characters, the app\'s own words for what it names', async () => {
    const releases = parseReleaseNotes(JSON.parse(releaseNotesSource));
    const at = releases.findIndex((r) => r.release === 17);
    expect(at).toBeGreaterThanOrEqual(0);
    const [note, previous] = releases.slice(at);
    expect([note.release, note.date, note.critical]).toEqual([17, '2026-11-20', false]);
    expect(previous.release).toBe(16);
    for (const lang of ['en', 'pt', 'es'] as const) expect(note.notes[lang].length, lang).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
    // Drill and the lesson's "Next lesson" button, each as the app says it in that language.
    const { default: en } = await import('../../i18n/locales/en.json');
    const { default: pt } = await import('../../i18n/locales/pt.json');
    const { default: es } = await import('../../i18n/locales/es.json');
    expect(note.notes.en).toContain(en.nav.drill);
    expect(note.notes.pt).toContain(pt.nav.drill);
    expect(note.notes.es).toContain(es.nav.drill);
    expect(note.notes.en).toContain(`“${en.lesson.nextLesson}”`);
    expect(note.notes.pt).toContain(`«${pt.lesson.nextLesson}»`);
    expect(note.notes.es).toContain(`«${es.lesson.nextLesson}»`);
    expect([note.notes.en.length, note.notes.pt.length, note.notes.es.length]).toEqual([149, 160, 157]);
  });
});

describe('release 18 (2026-11-24): the leftovers round', () => {
  it('follows release 17: not critical, one line per language within 160 characters, the app\'s own words for what it names', async () => {
    const releases = parseReleaseNotes(JSON.parse(releaseNotesSource));
    const [note, previous] = releases;
    expect([note.release, note.date, note.critical]).toEqual([18, '2026-11-24', false]);
    expect(previous.release).toBe(17);
    for (const lang of ['en', 'pt', 'es'] as const) expect(note.notes[lang].length, lang).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
    // The toast's own button, the metronome and the instrument panel, each as the app says it in that language;
    // "shortcuts", not "keys" (the app's keys are the piano's), and the search by its noun in Portuguese and
    // Spanish, as release 16's note has it (the language review of 21 November 2026).
    const { default: en } = await import('../../i18n/locales/en.json');
    const { default: pt } = await import('../../i18n/locales/pt.json');
    const { default: es } = await import('../../i18n/locales/es.json');
    expect(note.notes.en).toContain(`“${en.common.tryAgain}”`);
    expect(note.notes.pt).toContain(`«${pt.common.tryAgain}»`);
    expect(note.notes.es).toContain(`«${es.common.tryAgain}»`);
    expect(note.notes.en).toContain(`${en.nav.search} shortcuts`);
    expect(note.notes.pt).toContain('atalhos da pesquisa');
    expect(note.notes.es).toContain('atajos de la búsqueda');
    for (const [lang, words] of [['en', en], ['pt', pt], ['es', es]] as const) {
      expect(note.notes[lang].toLowerCase(), lang).toContain(words.metronomeToolEntry.menuItem.toLowerCase());
      expect(note.notes[lang].toLowerCase(), lang).toContain(words.dock.handle.toLowerCase());
      expect(note.notes[lang], lang).not.toMatch(/\b(keys|teclas|sheet|folha|hoja)\b/i);
    }
    expect([note.notes.en.length, note.notes.pt.length, note.notes.es.length]).toEqual([157, 160, 160]);
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
