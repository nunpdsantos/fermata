/**
 * The test sheet in a document (src/site/testSheet/client.ts, under jsdom):
 * the page as the build writes it, the script mounted on it. Answers saved
 * under the sheet's one key and nowhere else, nothing written before the
 * first answer; "Send my answers" opening the test form from the tap with
 * the two entries; too long → nothing opens, the notice and the copy box;
 * offline → one line, nothing opens; Copy; Clear (two taps, this sheet only);
 * a reload keeps the answers; the language switch; the guide.
 * `window.open` is mocked: no test contacts Google.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_FORM } from '../../../services/feedbackForms';
import { mountSheet } from '../client';
import { testSheetHtml } from '../page';
import { sheetData } from '../resolve';
import { SHEET_STORAGE_KEY, type SheetLang } from '../model';

const DATA = sheetData();
const HTML = testSheetHtml(DATA);
const NOW = new Date(2026, 10, 14, 10, 0);

let mounted: { destroy: () => void } | null = null;
function load(address = '/test/') {
  window.history.replaceState(null, '', address);
  const parsed = new DOMParser().parseFromString(HTML, 'text/html');
  document.head.innerHTML = parsed.head.innerHTML;
  document.body.innerHTML = parsed.body.innerHTML;
  mounted?.destroy();
  mounted = mountSheet(document, window, { now: () => NOW });
}
const $ = <T extends Element = HTMLElement>(sel: string) => document.querySelector(sel) as T;
const $$ = (sel: string) => Array.from(document.querySelectorAll(sel)) as HTMLElement[];
const saved = () => JSON.parse(localStorage.getItem(SHEET_STORAGE_KEY) ?? 'null');
const go = (hash: string) => {
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
  window.dispatchEvent(new HashChangeEvent('hashchange'));
};
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
const status = () => $('#sheet-status').textContent;
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

describe('the page', () => {
  it('opens on "New to music" in the browser\'s language (English here), every task with its three results; nothing saved yet', () => {
    load();
    expect(document.documentElement.lang).toBe('en');
    expect(document.title).toBe(ui('en').title);
    expect($('h2').textContent).toBe(ui('en').tabs.new);
    expect($$('ol.tasks > li')).toHaveLength(DATA.en.sheets.new.tasks.length);
    expect($$('fieldset.result')).toHaveLength(8);
    expect($$('fieldset.result input[type="radio"]')).toHaveLength(24);
    // Each radio has its own label; each group its legend.
    for (const input of $$('fieldset.result input')) expect(document.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
    expect($$('fieldset.result legend').map((l) => l.textContent)[0]).toBe(`${ui('en').result} 1`);
    expect($('#open-app').getAttribute('href')).toBe('/?lang=en');
    expect($('#open-app').getAttribute('target')).toBe('_blank');
    expect($('#lang-switch').hidden).toBe(false);
    expect($('#progress').textContent).toBe('0 of 8 answered');
    expect(localStorage.getItem(SHEET_STORAGE_KEY)).toBeNull();
  });

  it('?lang=pt wins over the browser; ?lang=es too; the "Open Fermatina" link carries the language', () => {
    load('/test/?lang=pt');
    expect(document.documentElement.lang).toBe('pt-PT');
    expect($('#t-title').textContent).toBe(ui('pt').title);
    expect($('#open-app').getAttribute('href')).toBe('/?lang=pt');
    expect($('#lang-switch button[data-lang="pt"]').getAttribute('aria-pressed')).toBe('true');
    load('/test/?lang=es#instrument');
    expect(document.documentElement.lang).toBe('es-ES');
    expect($('h2').textContent).toBe(ui('es').tabs.instrument);
    expect($$('dl.facts').length).toBe(10);
  });

  it('the language switch: shows Spanish, saves the choice, and takes ?lang= out of the address so a reload keeps it', () => {
    load('/test/?lang=pt#player');
    ($('#lang-switch button[data-lang="es"]') as HTMLButtonElement).click();
    expect(document.documentElement.lang).toBe('es-ES');
    expect($('h2').textContent).toBe(ui('es').tabs.player);
    expect(saved().lang).toBe('es');
    expect(window.location.search).toBe('');
    expect(window.location.hash).toBe('#player');
    load(`/test/${window.location.hash}`);
    expect(document.documentElement.lang).toBe('es-ES');
  });

  it('the guide on #watching: its sections, the sentence to say in the language\'s quotation marks', () => {
    load('/test/?lang=pt#watching');
    expect($$('.guide section')).toHaveLength(6);
    expect($('.say').textContent).toBe('«Estou a testar a app, não a ti. Nada do que fizeres está errado.»');
    expect($('#tabs [aria-current="page"]').textContent).toBe(ui('pt').tabs.watching);
  });

  it('a tab chosen from the keyboard keeps the focus on the tab now shown', () => {
    load();
    const tab = $$('#tabs a')[1];
    tab.focus();
    go('#player');
    expect(document.activeElement?.textContent).toBe(ui('en').tabs.player);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

describe('saving: one key, this browser, only once the person answers', () => {
  it('an answer, a note, a hint opened and a closing answer are saved under fermatina-test-sheet-v1 and nowhere else', () => {
    localStorage.setItem('fermata-welcome-v1', 'seen');
    localStorage.setItem('music-theory-app', '{"state":{},"version":6}');
    const before = Object.keys(localStorage).sort();
    load();
    choose('n1', 'ok');
    type('#note-n1', 'Found it fast.');
    const hint = $<HTMLDetailsElement>('#hint-n2');
    hint.open = true;
    hint.dispatchEvent(new Event('toggle'));
    type('#q-new-device', 'Pixel 7, Chrome');
    expect(Object.keys(localStorage).sort()).toEqual([...before, SHEET_STORAGE_KEY].sort());
    expect(localStorage.getItem('fermata-welcome-v1')).toBe('seen');
    expect(localStorage.getItem('music-theory-app')).toBe('{"state":{},"version":6}');
    expect(saved()).toEqual({
      lang: 'en',
      a: { n1: { r: 'ok', note: 'Found it fast.', hint: false }, n2: { r: '', note: '', hint: true } },
      q: { 'q-new-device': 'Pixel 7, Chrome' },
    });
    expect($('#progress').textContent).toBe('1 of 8 answered');
  });

  it('a reload keeps the answers (and the language)', () => {
    load('/test/?lang=pt');
    choose('n3', 'hard');
    type('#note-n3', 'Não vi o piano.');
    type('#q-new-what', 'Aprender música');
    load('/test/');
    expect(document.documentElement.lang).toBe('pt-PT');
    expect($<HTMLInputElement>('#r-n3-hard').checked).toBe(true);
    expect($<HTMLTextAreaElement>('#note-n3').value).toBe('Não vi o piano.');
    expect($<HTMLTextAreaElement>('#q-new-what').value).toBe('Aprender música');
  });

  it('storage that cannot be read or written: the sheet still works', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('denied'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('denied'); });
    load();
    expect(() => choose('n1', 'no')).not.toThrow();
    expect($('#progress').textContent).toBe('1 of 8 answered');
  });

  it('"Clear this sheet" asks for a second tap, then removes this sheet\'s answers only: the other sheet\'s, the language and every other key stay', () => {
    localStorage.setItem('fermata-welcome-v1', 'seen');
    load('/test/#player');
    choose('p1', 'ok');
    go('#new');
    choose('n1', 'no');
    type('#q-new-what', 'x');
    const clear = $('#clear-btn');
    clear.click();
    expect(clear.textContent).toBe(ui('en').clear2);
    expect(saved().a.n1.r).toBe('no');
    clear.click();
    expect(saved()).toEqual({ lang: 'en', a: { p1: { r: 'ok', note: '', hint: false } }, q: {} });
    expect($<HTMLInputElement>('#r-n1-no').checked).toBe(false);
    expect(localStorage.getItem('fermata-welcome-v1')).toBe('seen');
  });
});

describe('"Send my answers"', () => {
  it('opens the test form in a new tab from the tap: the sheet, the language and the date in one box, the answers in the other', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    load('/test/?lang=pt#player');
    choose('p2', 'hard');
    type('#note-p2', 'Não encontrei «Progressão».\nDepois sim.');
    $('#send-btn').click();
    expect(open).toHaveBeenCalledTimes(1);
    const [url, target, features] = open.mock.calls[0] as [string, string, string];
    expect([target, features]).toEqual(['_blank', 'noopener,noreferrer']);
    const u = new URL(url);
    expect(`${u.origin}${u.pathname}`).toBe(TEST_FORM.url);
    expect([...u.searchParams.keys()]).toEqual(['usp', 'entry.405030784', 'entry.602393800']);
    expect(u.searchParams.get('entry.405030784')).toBe('player · pt · 2026-11-14');
    const answers = u.searchParams.get('entry.602393800')!;
    expect(answers.split('\n')[0]).toBe('Teste da Fermatina · Toco, sem teoria · 14 de novembro de 2026');
    expect(answers).toContain('   → Foi difícil\n   Não encontrei «Progressão».\n   Depois sim.');
    expect(answers.split('\n').at(-1)).toBe(`Navegador: ${navigator.userAgent}`);
    expect(status()).toBe('');
    // The line under the button says what happens.
    expect($('#send-note').textContent).toBe(ui('pt').sendNote);
    expect($('#send-btn').getAttribute('aria-describedby')).toBe('send-note');
  });

  it('too long even without the browser\'s line: nothing opens; the notice, and the text shown to copy', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    load();
    type('#note-n1', 'é'.repeat(1200));
    $('#send-btn').click();
    expect(open).not.toHaveBeenCalled();
    expect(status()).toBe(ui('en').tooLong);
    expect(status()).toContain(`“${ui('en').copy}”`);
    expect($('#sheet-status').className).toContain('warn');
    const out = $<HTMLTextAreaElement>('#out');
    expect(out.hidden).toBe(false);
    expect(out.value).toContain('é'.repeat(1200));
  });

  it('offline: one line, and nothing opens', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false);
    load('/test/?lang=es');
    $('#send-btn').click();
    expect(open).not.toHaveBeenCalled();
    expect(status()).toBe(ui('es').offline);
  });
});

describe('"Copy my answers"', () => {
  it('copies the same text Send would send (with the browser\'s line), and says so', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    load('/test/#instrument');
    choose('i1', 'ok');
    $('#copy-btn').click();
    await vi.waitFor(() => expect(status()).toBe(ui('en').copied));
    const text = writeText.mock.calls[0][0] as string;
    expect(text.split('\n')[0]).toBe('Fermatina test · Instrument and microphone · 14 November 2026');
    expect(text).toContain('   → Worked');
    expect($<HTMLTextAreaElement>('#out').value).toBe(text);
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
  });

  it('where the clipboard cannot be used: says so and selects the text to copy by hand', () => {
    Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
    load();
    $('#copy-btn').click();
    expect(status()).toBe(ui('en').copyfail);
    expect(document.activeElement).toBe($('#out'));
  });
});
