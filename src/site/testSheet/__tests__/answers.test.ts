/**
 * The test sheet's answers (src/site/testSheet/answers.ts): the saved state
 * read defensively, the language chosen, the answers' text (the same for
 * Copy and Send), and the pre-filled test-form address — its two entries,
 * the encoding, line breaks, the 7,000-byte budget at its very edge with
 * accented text, dropping the browser's line first, and "too long".
 */
import { describe, expect, it } from 'vitest';
import { TEST_FORM, TEST_FORM_URL_BUDGET } from '../../../services/feedbackForms';
import {
  answersText, chooseLanguage, closingKey, emptyState, isoDate, planSend, readState, sheetLine, testFormUrl, urlBytes, wellFormed,
} from '../answers';
import { sheetContent } from '../resolve';
import { SHEET_STORAGE_KEY, type SheetState } from '../model';

const NOW = new Date(2026, 10, 14, 15, 30); // 14 November 2026, local time
const UA = 'TestBrowser/1.0 (Phone; like Gecko)';
const en = sheetContent('en');
const pt = sheetContent('pt');

/** The two boxes as Google would read them off the address. */
const entries = (url: string) => {
  const u = new URL(url);
  return { base: `${u.origin}${u.pathname}`, keys: [...u.searchParams.keys()], usp: u.searchParams.get('usp'), sheet: u.searchParams.get(`entry.${TEST_FORM.sheetEntry}`), answers: u.searchParams.get(`entry.${TEST_FORM.answersEntry}`) };
};

describe('the saved answers', () => {
  it('the key is fermatina-test-sheet-v1', () => {
    expect(SHEET_STORAGE_KEY).toBe('fermatina-test-sheet-v1');
  });

  it('reads the sheet\'s own shape and drops anything else, field by field', () => {
    expect(readState(null)).toEqual(emptyState());
    expect(readState('not json')).toEqual(emptyState());
    expect(readState('[1,2]')).toEqual(emptyState());
    expect(readState('"x"')).toEqual(emptyState());
    const raw = JSON.stringify({
      lang: 'pt',
      a: { n1: { r: 'ok', note: 'fine', hint: true }, n2: { r: 'maybe', note: 7, hint: 'yes' }, n3: null, n4: 'x' },
      q: { 'q-new-what': 'learning', 'q-new-device': 3 },
      extra: 'ignored',
    });
    expect(readState(raw)).toEqual({
      lang: 'pt',
      a: { n1: { r: 'ok', note: 'fine', hint: true }, n2: { r: '', note: '', hint: false } },
      q: { 'q-new-what': 'learning' },
    });
    expect(readState(JSON.stringify({ lang: 'fr' })).lang).toBeNull();
  });
});

describe('the language', () => {
  it('?lang= first, then the saved choice, then the browser\'s languages by prefix, then English', () => {
    expect(chooseLanguage('?lang=es', 'pt', ['en-GB'])).toBe('es');
    expect(chooseLanguage('?lang=fr', 'pt', ['en-GB'])).toBe('pt');
    expect(chooseLanguage('', null, ['fr-FR', 'pt-BR', 'en'])).toBe('pt');
    expect(chooseLanguage('', null, ['es_ES'])).toBe('es');
    expect(chooseLanguage('', null, ['de-DE', 'fr'])).toBe('en');
    expect(chooseLanguage('', null, [])).toBe('en');
  });
});

describe('the answers\' text', () => {
  const state: SheetState = {
    lang: 'en',
    a: { n1: { r: 'ok', note: '', hint: false }, n2: { r: 'hard', note: 'Took a while.\n\nThen found it.', hint: true } },
    q: { [closingKey('new', 'what')]: '  Learning chords  ', [closingKey('new', 'device')]: 'iPhone 13, Safari' },
  };

  it('header, each task with its result (and "hint used"), its note, the closing answers, the browser last', () => {
    const text = answersText(en, 'new', state, { now: NOW, userAgent: UA, withBrowser: true });
    const lines = text.split('\n');
    expect(lines[0]).toBe('Fermatina test · New to music · 14 November 2026');
    expect(lines[1]).toBe('');
    expect(lines[2]).toBe(`1. ${en.sheets.new.tasks[0].goal}`);
    expect(lines[3]).toBe('   → Did it');
    expect(lines[4]).toBe(`2. ${en.sheets.new.tasks[1].goal}`);
    expect(lines[5]).toBe('   → Hard to find (hint used)');
    expect(lines[6]).toBe('   Took a while.');
    expect(lines[7]).toBe('   Then found it.');
    expect(lines[8]).toBe(`3. ${en.sheets.new.tasks[2].goal}`);
    expect(lines[9]).toBe('   → not answered');
    expect(text).toContain(`${en.ui.q.what}\n   Learning chords\n${en.ui.q.confusing}\n   not answered`);
    expect(text).toContain(`${en.ui.q.device}\n   iPhone 13, Safari`);
    expect(lines.slice(-2)).toEqual(['', `Browser: ${UA}`]);
    // Every task is listed, in order.
    expect(text.match(/^\d+\. /gm)).toHaveLength(en.sheets.new.tasks.length);
  });

  it('without the browser\'s line: the same text, the last two lines gone', () => {
    const full = answersText(en, 'new', state, { now: NOW, userAgent: UA, withBrowser: true });
    const short = answersText(en, 'new', state, { now: NOW, userAgent: UA, withBrowser: false });
    expect(`${short}\n\nBrowser: ${UA}`).toBe(full);
  });

  it('in Portuguese, the Portuguese words and date; a "check" sheet uses its own result words', () => {
    const text = answersText(pt, 'instrument', { lang: 'pt', a: { i1: { r: 'no', note: '', hint: false } }, q: {} }, { now: NOW, userAgent: UA, withBrowser: true });
    expect(text.split('\n')[0]).toBe('Teste da Fermatina · Instrumento e microfone · 14 de novembro de 2026');
    expect(text).toContain('   → Não funcionou');
    expect(text.split('\n').at(-1)).toBe(`Navegador: ${UA}`);
  });
});

describe('the test form\'s address', () => {
  it('<form>?usp=pp_url&entry.405030784=<sheet · lang · date>&entry.602393800=<answers>, nothing else', () => {
    const url = testFormUrl(sheetLine('player', 'pt', NOW), 'a\nb');
    const e = entries(url);
    expect(e.base).toBe(TEST_FORM.url);
    expect(e.keys).toEqual(['usp', 'entry.405030784', 'entry.602393800']);
    expect(e.usp).toBe('pp_url');
    expect(e.sheet).toBe('player · pt · 2026-11-14');
    expect(e.answers).toBe('a\nb');
    expect(url).toContain('&entry.602393800=a%0Ab');
  });

  it('accents, « », ·, &, #, +, = and line breaks survive the trip; nothing is left raw', () => {
    const text = 'Não consegui «Progressão» · 50% & #1 + x=y?\nok';
    const url = testFormUrl('new · pt · 2026-11-14', text);
    expect(entries(url).answers).toBe(text);
    const value = url.split('&entry.602393800=')[1];
    expect(value).not.toMatch(/[\s&#+=?«»·ã]/);
    expect(value).toContain('N%C3%A3o'); // ã = 6 bytes once encoded
  });

  it('a lone surrogate (half an emoji) does not throw: it becomes U+FFFD', () => {
    expect(wellFormed('a\uD83Db')).toBe('a�b');
    expect(wellFormed('a\uDE00b')).toBe('a�b');
    expect(wellFormed('a😀b')).toBe('a😀b');
    expect(() => testFormUrl('x', 'broken \uD83D paste')).not.toThrow();
  });

  it('counts bytes as sent: an accented letter is 6, a space or a line break 3', () => {
    const base = urlBytes(testFormUrl('x', ''));
    expect(urlBytes(testFormUrl('x', 'é'))).toBe(base + 6);
    expect(urlBytes(testFormUrl('x', ' '))).toBe(base + 3);
    expect(urlBytes(testFormUrl('x', '\n'))).toBe(base + 3);
    expect(urlBytes(testFormUrl('x', 'a'))).toBe(base + 1);
  });
});

describe('"Send my answers": the budget', () => {
  expect(TEST_FORM_URL_BUDGET).toBe(7000);
  const withNote = (note: string): SheetState => ({ lang: 'pt', a: { n1: { r: 'ok', note, hint: false } }, q: {} });
  const opts = { now: NOW, userAgent: UA };
  /** The address's size with a note of `n` accented letters and `m` ASCII ones. */
  const size = (accented: number, ascii: number, withBrowser: boolean) =>
    urlBytes(testFormUrl(sheetLine('new', 'pt', NOW), answersText(pt, 'new', withNote('é'.repeat(accented) + 'a'.repeat(ascii)), { ...opts, withBrowser })));
  /** A note (accented letters, topped up with ASCII) that makes the FULL address exactly `target` bytes. */
  const noteFor = (target: number, withBrowser: boolean) => {
    // A note adds its own line ("\n   " + note); measured with one letter, then grown.
    const fixed = size(0, 1, withBrowser) - 1;
    const room = target - fixed;
    const accented = Math.floor((room - 1) / 6) - 1;
    const ascii = room - accented * 6;
    expect(size(accented, ascii, withBrowser)).toBe(target);
    return 'é'.repeat(accented) + 'a'.repeat(ascii);
  };

  it('an address of exactly 7,000 bytes opens with everything', () => {
    const plan = planSend(pt, 'new', withNote(noteFor(7000, true)), opts);
    expect(plan).toMatchObject({ kind: 'open', bytes: 7000, withBrowser: true });
  });

  it('one byte more: the browser\'s line is dropped first, and it opens', () => {
    const plan = planSend(pt, 'new', withNote(noteFor(7001, true)), opts);
    expect(plan.kind).toBe('open');
    if (plan.kind !== 'open') return;
    expect(plan.withBrowser).toBe(false);
    expect(plan.bytes).toBe(7001 - urlBytes(encodeURIComponent(`\n\nNavegador: ${UA}`)));
    expect(entries(plan.url).answers).not.toContain('Navegador:');
  });

  it('without the browser\'s line exactly 7,000 bytes still opens; one more and nothing opens ("too long")', () => {
    expect(planSend(pt, 'new', withNote(noteFor(7000, false)), opts)).toMatchObject({ kind: 'open', bytes: 7000, withBrowser: false });
    expect(planSend(pt, 'new', withNote(noteFor(7001, false)), opts)).toEqual({ kind: 'tooLong', bytes: 7001 });
  });

  it('a short sheet opens at once, with everything, its entries as typed', () => {
    const state: SheetState = { lang: 'en', a: { p1: { r: 'ok', note: 'Easy.', hint: false } }, q: { [closingKey('player', 'lang')]: 'English' } };
    const plan = planSend(en, 'player', state, opts);
    expect(plan.kind).toBe('open');
    if (plan.kind !== 'open') return;
    expect(plan.withBrowser).toBe(true);
    expect(plan.bytes).toBeLessThan(TEST_FORM_URL_BUDGET);
    const e = entries(plan.url);
    expect(e.sheet).toBe('player · en · 2026-11-14');
    expect(e.answers).toBe(answersText(en, 'player', state, { ...opts, withBrowser: true }));
  });

  it('isoDate is the device\'s own day, zero-padded', () => {
    expect(isoDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});
