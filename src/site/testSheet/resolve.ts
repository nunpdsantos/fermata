/**
 * The test sheet's words, resolved at build time (scripts/pages/build.ts):
 * every placeholder of data.ts filled in from the app's own locale files, the
 * curriculum, the sheet's own words or the public pages' reviewed sentences.
 * A key that is missing throws (`appText`), so the build fails rather than
 * ship a hint that names something the app no longer has. Pure: no DOM, no
 * file system. Runs at build time only — the page's script never imports it
 * (the curriculum stays out of /test/sheet.js).
 */
import { appText, siteLevel, type SiteLang } from '../content';
import { newText, type NewStrings } from '../strings';
import { GUIDE_TEMPLATE, SHEET_TEMPLATES, UI_TEMPLATES, type T3 } from './data';
import {
  SHEET_HTML_LANG, SHEET_IDS, SHEET_LANGS,
  type SheetContent, type SheetId, type SheetLang, type SheetText, type SheetUi,
} from './model';

/** `{{app:key}}`, `{{app:key|name=value|…}}`, `{{lesson:id}}`, `{{sheet:path}}`, `{{site:key}}`. */
export const PLACEHOLDER = /\{\{(app|lesson|sheet|site):([A-Za-z0-9_.-]+)((?:\|[A-Za-z]+=[^|}]*)*)\}\}/g;

/** One placeholder, as written in data.ts. */
export interface LabelRef {
  kind: 'app' | 'lesson' | 'sheet' | 'site';
  key: string;
  vars: Record<string, string>;
}

/** "|chord=E|fret=2" → { chord: 'E', fret: '2' }. */
const parseVars = (vars: string): Record<string, string> =>
  Object.fromEntries(vars.split('|').filter(Boolean).map((pair) => [pair.slice(0, pair.indexOf('=')), pair.slice(pair.indexOf('=') + 1)]));

/** The placeholders of a template, in order (a fresh regular expression each time: no shared lastIndex). */
export function placeholdersOf(template: string): LabelRef[] {
  return [...template.matchAll(new RegExp(PLACEHOLDER.source, 'g'))].map((m) => ({
    kind: m[1] as LabelRef['kind'],
    key: m[2],
    vars: parseVars(m[3]),
  }));
}

/** A lesson's title in a language, from the curriculum with its overlay (the public pages' own reading). */
export function lessonTitle(lang: SheetLang, id: string): string {
  const levelId = id.match(/^(l\d)u/)?.[1];
  const module = levelId ? siteLevel(levelId, lang as SiteLang).units.flatMap((u) => u.modules).find((m) => m.id === id) : undefined;
  if (!module) throw new Error(`test sheet: no lesson "${id}"`);
  return module.title;
}

/** A path into the sheet's own (already resolved) words: "copy", "tabs.new", "find.hard". */
function sheetWord(ui: SheetUi, path: string): string {
  const value = path.split('.').reduce<unknown>((node, part) => (node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined), ui);
  if (typeof value !== 'string') throw new Error(`test sheet: no sheet word "${path}"`);
  return value;
}

/** What one placeholder stands for in a language. */
export function labelFor(lang: SheetLang, ref: LabelRef, ui?: SheetUi): string {
  switch (ref.kind) {
    case 'app': return appText(lang as SiteLang, ref.key, ref.vars);
    case 'lesson': return lessonTitle(lang, ref.key);
    case 'site': return newText(lang as SiteLang, ref.key as keyof NewStrings, ref.vars);
    case 'sheet':
      if (!ui) throw new Error(`test sheet: {{sheet:${ref.key}}} used where the sheet's words are not resolved yet`);
      return sheetWord(ui, ref.key);
  }
}

/** A template with every placeholder filled in. Throws on anything unresolved. */
export function resolveText(lang: SheetLang, template: string, ui?: SheetUi): string {
  const out = template.replace(new RegExp(PLACEHOLDER.source, 'g'), (_m, kind: LabelRef['kind'], key: string, vars: string) =>
    labelFor(lang, { kind, key, vars: parseVars(vars) }, ui));
  if (/\{\{|\}\}/.test(out)) throw new Error(`test sheet: a placeholder is malformed in "${template}"`);
  return out;
}

/** Every string in an object tree, resolved (the UI's nested words). */
function resolveTree<T>(lang: SheetLang, node: T, ui?: SheetUi): T {
  if (typeof node === 'string') return resolveText(lang, node, ui) as T;
  if (Array.isArray(node)) return node.map((n) => resolveTree(lang, n, ui)) as T;
  if (node && typeof node === 'object') return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, resolveTree(lang, v, ui)])) as T;
  return node;
}

/** The language's quotation marks around a sentence said out loud. */
export const SAY_QUOTES: Record<SheetLang, [string, string]> = { en: ['“', '”'], pt: ['«', '»'], es: ['«', '»'] };

/** The sheet's words in one language, every placeholder filled in. */
export function sheetContent(lang: SheetLang): SheetContent {
  // The sheet's own words first, without {{sheet:…}} (they may quote each other once: tooLong quotes "copy").
  const draft = resolveTree(lang, { ...UI_TEMPLATES[lang], tooLong: '' });
  const ui: SheetUi = { ...draft, tooLong: resolveText(lang, UI_TEMPLATES[lang].tooLong, draft) };
  const t = (x: T3) => resolveText(lang, x[lang], ui);
  const sheets = Object.fromEntries(SHEET_IDS.map((id) => {
    const s = SHEET_TEMPLATES[id];
    const text: SheetText = {
      kind: s.kind,
      closing: [...s.closing],
      intro: t(s.intro),
      tasks: s.tasks.map((task) => ({
        id: task.id,
        goal: t(task.goal),
        ...(task.hint !== undefined ? { hint: task.hint === null ? null : t(task.hint) } : {}),
        ...(task.where ? { where: t(task.where) } : {}),
        ...(task.expect ? { expect: t(task.expect) } : {}),
      })),
    };
    return [id, text];
  })) as Record<SheetId, SheetText>;
  const [open, close] = SAY_QUOTES[lang];
  return {
    lang,
    htmlLang: SHEET_HTML_LANG[lang],
    ui,
    sheets,
    guide: {
      title: t(GUIDE_TEMPLATE.title),
      intro: t(GUIDE_TEMPLATE.intro),
      sections: GUIDE_TEMPLATE.sections.map((s) => ({
        h: t(s.h),
        items: s.items.map(t),
        ...(s.say ? { say: `${open}${t(s.say)}${close}` } : {}),
      })),
    },
  };
}

/** The page's data block: the three languages. */
export function sheetData(): Record<SheetLang, SheetContent> {
  return Object.fromEntries(SHEET_LANGS.map((lang) => [lang, sheetContent(lang)])) as Record<SheetLang, SheetContent>;
}

/** Every template string of data.ts with where it sits ("tasks n1 hint"), per language: for the tests and the docs. */
export function allTemplates(): { where: string; field: 'goal' | 'hint' | 'where' | 'expect' | 'intro' | 'ui' | 'guide'; lang: SheetLang; text: string }[] {
  const out: ReturnType<typeof allTemplates> = [];
  for (const lang of SHEET_LANGS) {
    const walk = (node: unknown, where: string) => {
      if (typeof node === 'string') out.push({ where, field: 'ui', lang, text: node });
      else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) walk(v, `${where}.${k}`);
    };
    walk(UI_TEMPLATES[lang], 'ui');
    for (const id of SHEET_IDS) {
      const s = SHEET_TEMPLATES[id];
      out.push({ where: `${id} intro`, field: 'intro', lang, text: s.intro[lang] });
      for (const task of s.tasks) {
        for (const field of ['goal', 'hint', 'where', 'expect'] as const) {
          const v = task[field];
          if (v) out.push({ where: `${id} ${task.id} ${field}`, field, lang, text: v[lang] });
        }
      }
    }
    out.push({ where: 'guide title', field: 'guide', lang, text: GUIDE_TEMPLATE.title[lang] });
    out.push({ where: 'guide intro', field: 'guide', lang, text: GUIDE_TEMPLATE.intro[lang] });
    GUIDE_TEMPLATE.sections.forEach((s, i) => {
      out.push({ where: `guide ${i} h`, field: 'guide', lang, text: s.h[lang] });
      s.items.forEach((item, j) => out.push({ where: `guide ${i}.${j}`, field: 'guide', lang, text: item[lang] }));
      if (s.say) out.push({ where: `guide ${i} say`, field: 'guide', lang, text: s.say[lang] });
    });
  }
  return out;
}

/** The app's locale keys the sheet quotes (sorted, each once). */
export function usedAppKeys(): string[] {
  return [...new Set(allTemplates().flatMap((t) => placeholdersOf(t.text).filter((r) => r.kind === 'app').map((r) => r.key)))].sort();
}
