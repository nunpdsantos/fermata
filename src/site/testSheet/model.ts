/**
 * The tester's sheet at /test/ (2026-11-14): its shapes and its one storage
 * key. Imports nothing, so the browser code (client.ts, bundled on its own
 * into /test/sheet.js) and the build (resolve.ts, page.ts) share it without
 * pulling the curriculum or the locale files into the page's script.
 */

export const SHEET_LANGS = ['en', 'pt', 'es'] as const;
export type SheetLang = (typeof SHEET_LANGS)[number];

/** `<html lang>` per language, as the app and the public pages write it. */
export const SHEET_HTML_LANG: Record<SheetLang, string> = { en: 'en', pt: 'pt-PT', es: 'es-ES' };

/** The three sheets, in the chooser's order; then the guide. */
export const SHEET_IDS = ['new', 'player', 'instrument'] as const;
export type SheetId = (typeof SHEET_IDS)[number];
export const VIEWS = [...SHEET_IDS, 'watching'] as const;
export type ViewId = (typeof VIEWS)[number];

export const RESULTS = ['ok', 'hard', 'no'] as const;
export type Result = (typeof RESULTS)[number];

export const CLOSING_IDS = ['what', 'confusing', 'again', 'surprise', 'device', 'lang'] as const;
export type ClosingId = (typeof CLOSING_IDS)[number];
/** Closing questions answered on one line (an <input>), the rest in a <textarea>. */
export const SHORT_CLOSING: readonly ClosingId[] = ['device', 'lang'];

/**
 * Where the sheet keeps its answers in the browser: `localStorage` under
 * this ONE key. The page lives on the app's own address (fermatina.com/test/),
 * so the name matters: the app's first-visit gate counts any key starting
 * `music-theory` or `fermata-` as app data (APP_KEY_PREFIXES,
 * src/state/welcomeGate.ts), and a tester who opened the sheet first would
 * then never see the start screen. `fermatina-` starts neither, so the key
 * is not app data, never enters a backup (utils/backupHelpers.ts lists its
 * keys), is cleared by no "Reset app data" (which clears `music-theory*` and
 * three named keys), and no app code reads it (welcomeGate.test.ts and
 * src/site/testSheet/__tests__/ prove each of these).
 */
export const SHEET_STORAGE_KEY = 'fermatina-test-sheet-v1';

/** The sheet's own words in one language (UI chrome, results, closing questions). */
export interface SheetUi {
  title: string;
  lead: string;
  open: string;
  appnote: string;
  languageLabel: string;
  sheetsLabel: string;
  tabs: Record<ViewId, string>;
  find: Record<Result, string>;
  check: Record<Result, string>;
  result: string;
  hint: string;
  nohint: string;
  where: string;
  expect: string;
  notes: string;
  /** "{n} of {t} answered". */
  progress: string;
  before: string;
  q: Record<ClosingId, string>;
  /** The send panel's heading. */
  send: string;
  sendtext: string;
  ua: string;
  sendButton: string;
  sendNote: string;
  tooLong: string;
  offline: string;
  copy: string;
  copied: string;
  copyfail: string;
  clear: string;
  clear2: string;
  none: string;
  hintused: string;
  browser: string;
  sheetword: string;
  noscript: string;
}

export interface SheetTask {
  id: string;
  goal: string;
  hint?: string | null;
  where?: string;
  expect?: string;
}

export interface SheetText {
  kind: 'find' | 'check';
  closing: ClosingId[];
  intro: string;
  tasks: SheetTask[];
}

export interface GuideSection {
  h: string;
  items: string[];
  /** A sentence to say out loud (shown in the language's quotation marks). */
  say?: string;
}

export interface GuideText {
  title: string;
  intro: string;
  sections: GuideSection[];
}

/** Everything the page shows in one language: what the JSON data block carries. */
export interface SheetContent {
  lang: SheetLang;
  htmlLang: string;
  ui: SheetUi;
  sheets: Record<SheetId, SheetText>;
  guide: GuideText;
}

/** One task's answer. */
export interface TaskAnswer {
  r: Result | '';
  note: string;
  hint: boolean;
}

/** What the sheet saves under SHEET_STORAGE_KEY. */
export interface SheetState {
  lang: SheetLang | null;
  /** Task id → answer. */
  a: Record<string, TaskAnswer>;
  /** `q-<sheet>-<question>` → answer. */
  q: Record<string, string>;
}

export const isSheetLang = (v: unknown): v is SheetLang => typeof v === 'string' && (SHEET_LANGS as readonly string[]).includes(v);
export const isView = (v: unknown): v is ViewId => typeof v === 'string' && (VIEWS as readonly string[]).includes(v);
export const isResult = (v: unknown): v is Result => typeof v === 'string' && (RESULTS as readonly string[]).includes(v);
