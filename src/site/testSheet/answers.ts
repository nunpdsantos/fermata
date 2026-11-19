/**
 * The test sheet's answers, as text and as a pre-filled Google Form address
 * (2026-11-14). Pure: the page's script (client.ts) calls these with the
 * browser's date, user agent and saved state; the tests call them with fixed
 * ones. Nothing here touches the network: building an address sends nothing,
 * and only the person's tap opens it.
 */
import { TEST_FORM, TEST_FORM_URL_BUDGET } from '../../services/feedbackForms';
import {
  isResult, isSheetLang,
  type ClosingId, type SheetContent, type SheetId, type SheetLang, type SheetState, type SheetText, type TaskAnswer,
} from './model';

/** The date in the answers' first line, in the sheet's language. */
export const DATE_LOCALE: Record<SheetLang, string> = { en: 'en-GB', pt: 'pt-PT', es: 'es-ES' };

export const emptyState = (): SheetState => ({ lang: null, a: {}, q: {} });

/**
 * The saved answers, read defensively: anything that is not the sheet's own
 * shape is dropped, field by field (a bad record never loses the others), and
 * storage that cannot be read gives an empty sheet.
 */
export function readState(raw: string | null): SheetState {
  const state = emptyState();
  if (!raw) return state;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return state;
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return state;
  const p = parsed as { lang?: unknown; a?: unknown; q?: unknown };
  if (isSheetLang(p.lang)) state.lang = p.lang;
  if (p.a && typeof p.a === 'object') {
    for (const [id, v] of Object.entries(p.a as Record<string, unknown>)) {
      if (!v || typeof v !== 'object') continue;
      const x = v as { r?: unknown; note?: unknown; hint?: unknown };
      state.a[id] = { r: isResult(x.r) ? x.r : '', note: typeof x.note === 'string' ? x.note : '', hint: x.hint === true };
    }
  }
  if (p.q && typeof p.q === 'object') {
    for (const [k, v] of Object.entries(p.q as Record<string, unknown>)) if (typeof v === 'string') state.q[k] = v;
  }
  return state;
}

/**
 * The sheet's language: `?lang=en|pt|es` in the address, else the one the
 * sheet saved, else the browser's (the first of its languages that is one of
 * the three, by prefix: pt-BR → pt), else English.
 */
export function chooseLanguage(search: string, saved: SheetLang | null, browserLanguages: readonly string[]): SheetLang {
  const asked = new URLSearchParams(search).get('lang');
  if (isSheetLang(asked)) return asked;
  if (saved) return saved;
  for (const tag of browserLanguages) {
    const prefix = String(tag).toLowerCase().split(/[-_]/)[0];
    if (isSheetLang(prefix)) return prefix;
  }
  return 'en';
}

export const answerOf = (state: SheetState, taskId: string): TaskAnswer => state.a[taskId] ?? { r: '', note: '', hint: false };
export const closingKey = (sheetId: SheetId, q: ClosingId) => `q-${sheetId}-${q}`;
export const answeredCount = (sheet: SheetText, state: SheetState) => sheet.tasks.filter((t) => !!answerOf(state, t.id).r).length;

/**
 * Anything to send from this sheet (audit A20): a task's result, a note that
 * is not blank, or a closing answer that is not blank. A hint opened alone is
 * not an answer.
 */
export const hasAnswers = (sheet: SheetText, sheetId: SheetId, state: SheetState) =>
  sheet.tasks.some((t) => { const a = answerOf(state, t.id); return !!a.r || !!a.note.trim(); })
  || sheet.closing.some((q) => !!(state.q[closingKey(sheetId, q)] ?? '').trim());

/** YYYY-MM-DD, in the device's own time zone (the day the tester sent it). */
export function isoDate(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export interface TextOptions {
  now: Date;
  userAgent: string;
  /** The browser's own description as the last line (dropped first when the address is too long). */
  withBrowser: boolean;
}

/**
 * The answers as one text, the same for "Copy my answers" and "Send my
 * answers": a header (the sheet, the date), each task's result (and "hint
 * used"), its note, the closing answers, and the browser's description last.
 */
export function answersText(content: SheetContent, sheetId: SheetId, state: SheetState, opts: TextOptions): string {
  const { ui } = content;
  const sheet = content.sheets[sheetId];
  const labels = ui[sheet.kind];
  const lines: string[] = [];
  let when = '';
  try {
    when = opts.now.toLocaleDateString(DATE_LOCALE[content.lang], { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    when = '';
  }
  lines.push(`${ui.sheetword} · ${ui.tabs[sheetId]}${when ? ` · ${when}` : ''}`);
  lines.push('');
  sheet.tasks.forEach((task, i) => {
    const a = answerOf(state, task.id);
    lines.push(`${i + 1}. ${task.goal}\n   → ${a.r ? labels[a.r] : ui.none}${a.hint ? ` (${ui.hintused})` : ''}`);
    if (a.note.trim()) lines.push(`   ${a.note.trim().replace(/\n+/g, '\n   ')}`);
  });
  lines.push('');
  for (const q of sheet.closing) {
    const v = (state.q[closingKey(sheetId, q)] ?? '').trim();
    lines.push(`${ui.q[q]}\n   ${v || ui.none}`);
  }
  if (opts.withBrowser) {
    lines.push('');
    lines.push(`${ui.browser}: ${opts.userAgent}`);
  }
  return lines.join('\n');
}

/** The form's "Test sheet" box: `<sheet id> · <lang> · <date>`. */
export const sheetLine = (sheetId: SheetId, lang: SheetLang, now: Date) => `${sheetId} · ${lang} · ${isoDate(now)}`;

/**
 * A text that `encodeURIComponent` can always encode: a lone surrogate (half
 * of an emoji, from a broken paste) becomes U+FFFD instead of throwing.
 */
export function wellFormed(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += text[i] + text[i + 1];
        i++;
      } else out += '�';
    } else if (c >= 0xdc00 && c <= 0xdfff) out += '�';
    else out += text[i];
  }
  return out;
}

/** The test form, its two boxes filled in: `…/viewform?usp=pp_url&entry.<sheet>=…&entry.<answers>=…`. */
export function testFormUrl(sheet: string, answers: string): string {
  return `${TEST_FORM.url}?usp=pp_url&entry.${TEST_FORM.sheetEntry}=${encodeURIComponent(wellFormed(sheet))}&entry.${TEST_FORM.answersEntry}=${encodeURIComponent(wellFormed(answers))}`;
}

/** An address's size in bytes, as sent (after encoding it is plain ASCII, so bytes = characters; counted, not assumed). */
export const urlBytes = (url: string) => new TextEncoder().encode(url).length;

export type SendPlan =
  | { kind: 'open'; url: string; bytes: number; withBrowser: boolean }
  | { kind: 'tooLong'; bytes: number };

/**
 * What "Send my answers" does: the address with everything, if it fits the
 * budget; else the same without the browser's description; else nothing
 * (the page says the answers are too long and shows the copy box).
 */
export function planSend(
  content: SheetContent, sheetId: SheetId, state: SheetState,
  opts: { now: Date; userAgent: string; budget?: number },
): SendPlan {
  const budget = opts.budget ?? TEST_FORM_URL_BUDGET;
  const head = sheetLine(sheetId, content.lang, opts.now);
  let bytes = 0;
  for (const withBrowser of [true, false]) {
    const url = testFormUrl(head, answersText(content, sheetId, state, { now: opts.now, userAgent: opts.userAgent, withBrowser }));
    bytes = urlBytes(url);
    if (bytes <= budget) return { kind: 'open', url, bytes, withBrowser };
  }
  return { kind: 'tooLong', bytes };
}
