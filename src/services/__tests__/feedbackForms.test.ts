/**
 * The forms module (services/feedbackForms.ts, 2026-11-14): the four Google
 * Forms' addresses and entry ids in one place that imports nothing, read by
 * the app (reportProblem.ts), the public pages and the test sheet. And the
 * menu's new words, "Feedback or a problem", with release 15 saying so.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { FORM_ADDRESSES, REPORT_FORMS, TEST_FORM, TEST_FORM_URL_BUDGET } from '../feedbackForms';
import * as reportProblem from '../reportProblem';
import { MAX_NOTE_LENGTH, parseReleaseNotes } from '../../release/releaseNotes';
import releaseNotesSource from '../../../release-notes.json?raw';
import en from '../../i18n/locales/en.json';
import pt from '../../i18n/locales/pt.json';
import es from '../../i18n/locales/es.json';

const LOCALES = { en, pt, es } as const;
const source = (file: string) => readFileSync(join(__dirname, '..', file), 'utf8');

describe('the forms module', () => {
  it('imports nothing (so src/site/ and the test sheet can read it without a store)', () => {
    const imports = source('feedbackForms.ts').split('\n').filter((l) => /^\s*import\b/.test(l));
    expect(imports).toEqual([]);
    // Known positive: the same scan sees reportProblem.ts's imports.
    expect(source('reportProblem.ts').split('\n').filter((l) => /^\s*import\b/.test(l)).length).toBeGreaterThanOrEqual(3);
  });

  it('reportProblem.ts reads the forms from it, unchanged (the same object, re-exported)', () => {
    expect(reportProblem.REPORT_FORMS).toBe(REPORT_FORMS);
    expect(source('reportProblem.ts')).not.toMatch(/docs\.google\.com/);
  });

  it('the three feedback forms are the ones the app has used since 2026-11-12 (kept literal here: a typo there must fail here)', () => {
    expect(REPORT_FORMS).toEqual({
      en: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfI4qQGg8oRbptK9oy4zASrremaS4T2n7mDRyeYVppSTpZyUw/viewform', detailsEntry: '1697729701' },
      pt: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSf2rxSG77Ob4ATDFYbblTLabkLJtVpIIPYnLGXvBH_ROtFMyQ/viewform', detailsEntry: '202781657' },
      es: { url: 'https://docs.google.com/forms/d/e/1FAIpQLSfMzJEA18XRIx3wQxFD-PKVvY7NLbPwI-XkmK4g-RceatMaUA/viewform', detailsEntry: '1963274376' },
    });
  });

  it('the test sheet\'s form: its address, its three entry ids and the 7,000-byte budget (literal here too)', () => {
    expect(TEST_FORM).toEqual({
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSfikfucnesRqOi087tAkq1vE5l-lXVY4yNsL4zexq3XXTW6iw/viewform',
      sheetEntry: '405030784',
      answersEntry: '602393800',
      anythingElseEntry: '533014578',
    });
    expect(TEST_FORM_URL_BUDGET).toBe(7000);
  });

  it('every address is a docs.google.com viewform with no query, and the list of addresses is exactly the four', () => {
    expect(FORM_ADDRESSES).toHaveLength(4);
    expect(new Set(FORM_ADDRESSES).size).toBe(4);
    for (const address of FORM_ADDRESSES) {
      const url = new URL(address);
      expect([url.protocol, url.hostname, url.search]).toEqual(['https:', 'docs.google.com', '']);
      expect(url.pathname).toMatch(/^\/forms\/d\/e\/[\w-]+\/viewform$/);
    }
  });
});

describe('"Feedback or a problem" (2026-11-14): the words', () => {
  it('the menu item in the three languages, as reviewed', () => {
    expect([en.report.menuItem, pt.report.menuItem, es.report.menuItem]).toEqual([
      'Feedback or a problem (Google form)',
      'Opinião ou problema (formulário Google)',
      'Opinión o problema (formulario de Google)',
    ]);
  });

  it('the lesson foot\'s link keeps its words; the offline line names "the form", not "the report form"', () => {
    expect(en.learn.reportMistake).toBe('Found a mistake? Tell me (Google form)');
    for (const lang of ['en', 'pt', 'es'] as const) expect(LOCALES[lang].report.offline).not.toMatch(/report|comunicar|avisar/i);
  });

  it('release 15 (the newest until release 16 of 19 November 2026): not critical, dated 2026-11-14, one line per language within 160 characters, naming the item by its new words and "⋯"', () => {
    const releases = parseReleaseNotes(JSON.parse(releaseNotesSource));
    const at = releases.findIndex((r) => r.release === 15);
    expect(at).toBeGreaterThanOrEqual(0);
    const [newest, previous] = releases.slice(at);
    expect([newest.release, newest.date, newest.critical]).toEqual([15, '2026-11-14', false]);
    expect(previous.release).toBe(14);
    for (const lang of ['en', 'pt', 'es'] as const) {
      const note = newest.notes[lang];
      expect(note.length, lang).toBeLessThanOrEqual(MAX_NOTE_LENGTH);
      // The label without its "(Google form)": what the menu row starts with.
      expect(note, lang).toContain(LOCALES[lang].report.menuItem.replace(/\s*\(.*\)$/, ''));
      expect(note, lang).toContain('⋯');
    }
  });
});
