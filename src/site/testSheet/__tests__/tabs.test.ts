/**
 * The test sheet with another tab open (audit A5) and an empty "Send my
 * answers" (audit A20), under jsdom. The other tab is played by writing the
 * sheet's key as that tab would and firing the `storage` event the browser
 * fires in every OTHER tab. The browser proof is e2e/test-sheet-tabs.spec.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountSheet } from '../client';
import { testSheetHtml } from '../page';
import { sheetData } from '../resolve';
import { hasAnswers, readState } from '../answers';
import { SHEET_STORAGE_KEY, type SheetLang } from '../model';

const DATA = sheetData();
const HTML = testSheetHtml(DATA);

let mounted: { destroy: () => void } | null = null;
function load(address = '/test/') {
  window.history.replaceState(null, '', address);
  const parsed = new DOMParser().parseFromString(HTML, 'text/html');
  document.head.innerHTML = parsed.head.innerHTML;
  document.body.innerHTML = parsed.body.innerHTML;
  mounted?.destroy();
  mounted = mountSheet(document, window, { now: () => new Date(2026, 10, 18, 10, 0) });
}
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T;
const saved = () => JSON.parse(localStorage.getItem(SHEET_STORAGE_KEY) ?? 'null');
const choose = (taskId: string, r: 'ok' | 'hard' | 'no') => {
  const input = $<HTMLInputElement>(`#r-${taskId}-${r}`);
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
};
const type = (sel: string, value: string) => {
  const el = $<HTMLTextAreaElement | HTMLInputElement>(sel);
  el.value = value;
  el.dispatchEvent(new Event('input', { bubbles: true }));
};
/** Another tab saves `state` (what its own commit would write) and the browser tells this one. */
function otherTabSaves(state: unknown) {
  localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new StorageEvent('storage', { key: SHEET_STORAGE_KEY }));
}
const ui = (lang: SheetLang) => DATA[lang].ui;

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  mounted?.destroy();
  mounted = null;
  vi.restoreAllMocks();
});

describe('another tab of the sheet (A5)', () => {
  it('a save writes this answer on what is saved NOW: the other tab\'s answers, made after this page opened, stay', () => {
    load('/test/#new');
    // The other tab (opened at the same time, on "I play, no theory") answers first; this page never heard of it.
    localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify({ lang: 'en', a: { p1: { r: 'hard', note: 'theirs', hint: true } }, q: { 'q-player-what': 'their answer' } }));
    choose('n1', 'ok');
    expect(saved()).toEqual({
      lang: 'en',
      a: { p1: { r: 'hard', note: 'theirs', hint: true }, n1: { r: 'ok', note: '', hint: false } },
      q: { 'q-player-what': 'their answer' },
    });
    type('#note-n1', 'mine');
    type('#q-new-what', 'my answer');
    expect(saved().a.p1).toEqual({ r: 'hard', note: 'theirs', hint: true });
    expect(saved().q).toEqual({ 'q-player-what': 'their answer', 'q-new-what': 'my answer' });
  });

  it('the same task changed in both tabs: each field is the latest tab\'s; the other fields stay', () => {
    load('/test/#new');
    choose('n1', 'ok');
    localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify({ lang: 'en', a: { n1: { r: 'ok', note: 'their note', hint: false } }, q: {} }));
    choose('n1', 'no');
    expect(saved().a.n1).toEqual({ r: 'no', note: 'their note', hint: false });
  });

  it('the other tab\'s answers show here as they are saved: results, notes, closing answers and the count — never in the box being typed in', () => {
    load('/test/#new');
    $<HTMLTextAreaElement>('#note-n2').focus();
    otherTabSaves({ lang: 'en', a: { n1: { r: 'hard', note: 'seen here', hint: false }, n2: { r: 'ok', note: 'not over my typing', hint: false } }, q: { 'q-new-what': 'theirs' } });
    expect($<HTMLInputElement>('#r-n1-hard').checked).toBe(true);
    expect($<HTMLInputElement>('#r-n2-ok').checked).toBe(true);
    expect($<HTMLTextAreaElement>('#note-n1').value).toBe('seen here');
    expect($<HTMLTextAreaElement>('#note-n2').value).toBe('');
    expect($<HTMLInputElement>('#q-new-what').value).toBe('theirs');
    expect($('#progress').textContent).toBe('2 of 8 answered');
  });

  it('"Copy my answers" copies what is saved, the other tab\'s answers included', () => {
    load('/test/#new');
    localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify({ lang: 'en', a: { n3: { r: 'no', note: 'from the other tab', hint: false } }, q: {} }));
    $('#copy-btn').click();
    expect($<HTMLTextAreaElement>('#out').value).toContain('from the other tab');
  });

  it('"Clear this sheet" clears this sheet only, on what is saved now: the other tab\'s other sheet stays', () => {
    load('/test/#new');
    choose('n1', 'ok');
    localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify({ ...saved(), a: { ...saved().a, p2: { r: 'ok', note: '', hint: false } } }));
    $('#clear-btn').click();
    $('#clear-btn').click();
    expect(saved()).toEqual({ lang: 'en', a: { p2: { r: 'ok', note: '', hint: false } }, q: {} });
  });

  it('this page\'s language stays its own, and is saved with its answers as before', () => {
    load('/test/?lang=pt#new');
    otherTabSaves({ lang: 'es', a: {}, q: {} });
    expect(document.documentElement.lang).toBe('pt-PT');
    choose('n1', 'ok');
    expect(saved().lang).toBe('pt');
  });
});

describe('"Send my answers" with nothing answered (A20)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: nothing opens; one line says what to do; one answer then opens the form`, () => {
      const open = vi.spyOn(window, 'open').mockReturnValue(null);
      vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
      load(`/test/?lang=${lang}#new`);
      $('#send-btn').click();
      expect(open).not.toHaveBeenCalled();
      expect($('#sheet-status').textContent).toBe(ui(lang).empty);
      expect($('#sheet-status').className).toContain('warn');
      choose('n1', 'hard');
      $('#send-btn').click();
      expect(open).toHaveBeenCalledTimes(1);
      expect($('#sheet-status').textContent).toBe('');
    });
  }

  it('what counts as an answer: a result, a note or a closing answer that is not blank — not a hint opened, not blank space, not another sheet\'s answers', () => {
    const sheet = DATA.en.sheets.new;
    const none = readState(null);
    expect(hasAnswers(sheet, 'new', none)).toBe(false);
    expect(hasAnswers(sheet, 'new', { ...none, a: { n2: { r: '', note: '  \n ', hint: true } } })).toBe(false);
    expect(hasAnswers(sheet, 'new', { ...none, a: { p1: { r: 'ok', note: 'x', hint: false } }, q: { 'q-player-what': 'x' } })).toBe(false);
    expect(hasAnswers(sheet, 'new', { ...none, a: { n2: { r: 'no', note: '', hint: false } } })).toBe(true);
    expect(hasAnswers(sheet, 'new', { ...none, a: { n2: { r: '', note: 'a note', hint: false } } })).toBe(true);
    expect(hasAnswers(sheet, 'new', { ...none, q: { 'q-new-lang': 'Português' } })).toBe(true);
  });

  it('the line is the sheet\'s own words in each language, and plain', () => {
    expect(ui('en').empty).toBe('Nothing to send yet: mark at least one task, or write a note or an answer.');
    expect(ui('pt').empty).toBe('Ainda não há nada para enviar: marca pelo menos uma tarefa ou escreve uma nota ou uma resposta.');
    expect(ui('es').empty).toBe('Todavía no hay nada que enviar: marca al menos una tarea o escribe una nota o una respuesta.');
  });
});
