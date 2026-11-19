/**
 * Test helper for britishSpelling.corpus.test.ts: the English corpus a learner
 * reads, and the rules that find an American form in it (the British spelling
 * pass, 19 November 2026; made rule-based after the independent review).
 *
 * Rules, on whole words (case ignored):
 *  - the word table's American forms (data/exercises/__tests__/respelling.ts,
 *    the one table);
 *  - -ize / -yze with any ending (realizes, analyzes, organizational…), minus
 *    the real z-words listed in IZE_WORDS, each with its reason;
 *  - from stems, with all their endings: -or (colour, honour, behaviour…),
 *    -er (centre, metre, theatre…), -og (catalogue, dialogue…), -ense
 *    (defence, offence, pretence), single l (labelled, travelling, counsellor…)
 *    and the American double l (fulfill, enroll, skillful…);
 *  - words: toward, afterward, gray, math, percent, judgment, acknowledgment,
 *    counterclockwise, aging, gotten, oftentimes, normalcy;
 *  - "practice" (the verb) and the -ward adverbs pass only inside the listed
 *    noun / adjective phrases (AMBIGUOUS);
 * and three guards:
 *  - the British verb on a noun: "practise" where "practice" would be one of
 *    the listed noun phrases ("Practise Tasks", "practise answers");
 *  - an -s adverb on a noun: "downwards resolution", "upwards motion";
 *  - British-only music vocabulary the app does not use (it keeps the
 *    American terms: quarter note, half step, neighbour TONE): crotchet,
 *    quaver, minim, semibreve…, "neighbour note", "auxiliary note".
 *    ("semitone" is the app's own word beside "half step": allowed.)
 * And American vocabulary: inclusive "through" ("0 through 11"), "different
 * than", "in back of", "off of", "on the weekend".
 * Titles, names and quotations that keep their own spelling, and what is left
 * on purpose, go in KEEP, each with its reason.
 */
import ts from 'typescript';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { EN_UNITS, overlayEntries } from '../content/__tests__/overlayEntries';
import { MODULE_INDEX } from '../../data/moduleIndex';
import { CURRICULUM_LEVELS } from '../../core/constants/levels';
import { CHORD_SCALE_MAP } from '../../core/constants/chordScaleRelationships';
import { GUIDE_TEMPLATE, SHEET_TEMPLATES, UI_TEMPLATES } from '../../site/testSheet/data';
import { renderBank } from '../../components/drill/__tests__/drillCorpus';
import { AMBIGUOUS_AMERICAN, SPELLINGS } from '../../data/exercises/__tests__/respelling';

type Phrases = readonly (readonly [RegExp, string])[];

// ─── The rules ───────────────────────────────────────────────────────────

/** The table's American forms that are never right in British English. */
export const TABLE = new Set(SPELLINGS.map(([us]) => us).filter((us) => !AMBIGUOUS_AMERICAN.has(us)));

const ENDINGS = (list: string) => `(?:${list})`;
const stems = (s: string[], endings: string) => new RegExp(`^(?:${s.join('|')})${endings}$`);

export const RULES: readonly (readonly [string, RegExp])[] = [
  ['-ize / -yze', /^[a-z]*[iy]z(?:e|es|ed|er|ers|ing|ings|ation|ations|ational|ationally|able|ably|ability)$/],
  ['-or (British -our)', stems(
    ['color', 'neighbor', 'favor', 'flavor', 'behavior', 'honor', 'humor', 'labor', 'harbor', 'rumor', 'vigor', 'savor', 'endeavor', 'odor', 'armor', 'valor', 'parlor', 'clamor', 'splendor', 'tumor', 'vapor', 'fervor', 'ardor', 'candor', 'rigor', 'savior', 'glamor', 'demeanor', 'arbor', 'rancor', 'succor'],
    // not -ous / -ary / -ific / -ation: British drops the u there too (humorous, honorary, vigorous)
    ENDINGS('|s|ed|ing|ings|ful|fully|less|ist|ists|istic|ite|ites|able|ably|er|ers|al|ally|ly|hood|hoods|ism'),
  )],
  ['-er (British -re)', stems(
    ['center', 'meter', 'theater', 'fiber', 'liter', 'caliber', 'somber', 'specter', 'scepter', 'luster', 'maneuver', 'meager', 'ocher', 'sepulcher', 'miter', 'centimeter', 'millimeter', 'kilometer', 'polymeter'],
    ENDINGS('|s|ed|ing|piece|pieces|goer|goers'),
  )],
  ['-og (British -ogue)', stems(['catalog', 'dialog', 'analog', 'monolog', 'prolog', 'epilog', 'travelog', 'demagog'], ENDINGS('|s|ed|ing'))],
  ['-ense (British -ence)', stems(['defense', 'offense', 'pretense'], ENDINGS('|s|less|lessly'))],
  ['single l (British ll)', stems(
    ['label', 'travel', 'cancel', 'model', 'signal', 'level', 'total', 'fuel', 'marvel', 'dial', 'duel', 'equal', 'rival', 'tunnel', 'channel', 'funnel', 'pedal', 'pencil', 'quarrel', 'shovel', 'swivel', 'towel', 'unravel', 'yodel', 'jewel', 'panel', 'barrel', 'chisel', 'enamel', 'grovel', 'libel', 'snorkel', 'bevel', 'cudgel', 'initial', 'stencil', 'spiral', 'counsel'],
    ENDINGS('ed|ing|ings|er|ers|ation'),
  )],
  ['single l (British ll)', /^(?:counselors?|marvelous|marvelously|jewelry|woolen|cancelation)$/],
  ['double l (British l)', /^(?:fulfill|fulfills|fulfillment|enroll|enrolls|enrollment|installment|installments|instill|instills|distill|distills|appall|appalls|enthrall|enthralls|skillful|skillfully|willful|willfully)$/],
  ['word', /^(?:toward|afterward|grays?|grayed|graying|grayish|math|percent|judgments?|acknowledgments?|counterclockwise|aging|gotten|oftentimes|normalcy)$/],
];

/**
 * Words the -ize / -yze rule catches that are spelt with z in British English
 * too: exactly those the corpus holds (a test keeps the list to the corpus);
 * add one, with its reason, when a text needs it (seize, capsize, maize…).
 */
export const IZE_WORDS: Readonly<Record<string, string>> = {
  size: '"size" is not an -ize verb: z in British English too',
  sizes: '"size" is not an -ize verb: z in British English too',
  prize: '"prize" is not an -ize verb: z in British English too',
};

/** "-ward" before its noun is the adjective, the same in British English. */
export const WARD_ADJECTIVES: Phrases = [
  [/\bdownward resolution\b/, 'adjective before its noun'],
  [/\bupward resolution\b/, 'adjective before its noun'],
  [/\boutward resolution\b/, 'adjective before its noun'],
  [/\bdownward-resolving\b/, 'compound adjective'],
  [/\bdownward step\b/, 'adjective before its noun'],
  [/\bupward leap\b/, 'adjective before its noun'],
  [/\bupward-octave\b/, 'compound adjective'],
  [/\bbackward versions\b/, 'adjective before its noun'],
  [/\b[Uu]pward or downward motion\b/, 'adjectives before their noun'],
];

/** The noun "practice" in the phrases where the app uses it (each with its reason). */
export const PRACTICE_NOUNS: Phrases = [
  [/\bin practice\b/i, 'noun: "in practice"'],
  [/\bcommon[- ]practice\b/i, 'noun: the common-practice period'],
  [/\bclassical practice\b/, 'noun'],
  [/\bAnalysis Practice\b/, 'noun: a lesson title'],
  [/\bform practice:/, 'noun: "Sonata form practice:"'],
  [/\bup-and-down practice\b/, 'noun'],
  [/\bKodaly practice\b/, 'noun'],
  [/\bwith practice\b/, 'noun'],
  [/\bmore practice\b/, 'noun'],
  [/\bpractice tasks?\b/i, 'noun: the lesson\'s practice tasks'],
  [/· practice\b/, 'noun: "{{title}} · practice"'],
  [/\bpractice answers\b/i, 'noun: the practice round\'s answers'],
];

/** American in one use only: an occurrence passes only inside one of these phrases. */
export const AMBIGUOUS: Readonly<Record<string, Phrases>> = {
  practice: PRACTICE_NOUNS,
  ...Object.fromEntries(['upward', 'downward', 'outward', 'inward', 'onward', 'backward'].map((w) => [w, WARD_ADJECTIVES])),
};

/** Nouns an -s adverb must not qualify ("downwards resolution"). */
const WARD_NOUNS = /^ (resolutions?|steps?|leaps?|motions?|movements?|versions?|directions?|pulls?|tendency|tendencies)\b/;

/** British-only music words: the app keeps the American terms (quarter note, half step, neighbour tone). */
export const UK_MUSIC_TERMS: Phrases = [
  [/\b(?:hemidemisemiquaver|demisemiquaver|semiquaver|quaver|crotchet|minim|semibreve)s?\b/i, 'British note name: the app says sixteenth / eighth / quarter / half / whole note'],
  [/\bneighbou?r notes?\b/i, 'the app says neighbour tone'],
  [/\bauxiliary notes?\b/i, 'the app says neighbour tone'],
];

/** American vocabulary (not spelling) the British text does not use. */
export const US_VOCABULARY: Phrases = [
  [/\b\d+ through \d+\b/, 'inclusive "through" for a range: British "to" ("0 to 11")'],
  [/\b(?:different than|in back of|off of|on the weekend)\b/i, 'American usage'],
];

/**
 * Titles, names and quotations that keep their own spelling, and what is left
 * on purpose, each with its reason.
 */
export const KEEP: Phrases = [
  [/\((?:1 through 6|1 through 12|0 through 5|0 through 11)\) in a pitch-class set\b/,
    'the four options of a generated question (tm:l8u27m1[1]): a word change, not spelling, so the question would get a new identity and its saved score would be retired; left for the owner to decide'],
];

export interface Offender { where: string; word: string; rule: string; text: string }

const spans = (text: string, list: Phrases) =>
  list.flatMap(([re]) => [...text.matchAll(new RegExp(re.source, `${re.flags.replace('g', '')}g`))].map((m) => [m.index ?? 0, (m.index ?? 0) + m[0].length] as const));
const inside = (s: readonly (readonly [number, number])[], at: number, len: number) => s.some(([a, b]) => a <= at && at + len <= b);

/** The rule an American word breaks, or null. */
export function americanRule(word: string): string | null {
  const w = word.toLowerCase();
  if (TABLE.has(w)) return 'word table';
  if (IZE_WORDS[w] !== undefined) return null;
  for (const [name, re] of RULES) if (re.test(w)) return name;
  return null;
}

/** Every American form in one English text. */
export function americanForms(where: string, text: string): Offender[] {
  const out: Offender[] = [];
  const plain = text.replace(/\{\{[^}]*\}\}/g, (p) => ' '.repeat(p.length)); // i18n placeholders are not words
  const keep = spans(plain, KEEP);
  const at = (i: number, len: number) => plain.slice(Math.max(0, i - 40), i + len + 40).replace(/\s+/g, ' ');
  for (const m of plain.matchAll(/(?<![\p{L}\p{N}])[A-Za-z]+(?![\p{L}\p{N}])/gu)) {
    const word = m[0];
    const lw = word.toLowerCase();
    const i = m.index ?? 0;
    if (inside(keep, i, word.length)) continue;
    const kept = AMBIGUOUS[lw];
    if (kept) {
      if (!inside(spans(plain, kept), i, word.length)) out.push({ where, word, rule: `${lw} (verb / adverb only)`, text: at(i, word.length) });
      continue;
    }
    const rule = americanRule(word);
    if (rule) { out.push({ where, word, rule, text: at(i, word.length) }); continue; }
    // Guard: the British verb where the noun is meant ("Practise Tasks").
    if (lw === 'practise') {
      const asNoun = plain.slice(0, i) + (word[0] === 'P' ? 'Practice' : 'practice') + plain.slice(i + word.length);
      if (inside(spans(asNoun, PRACTICE_NOUNS), i, word.length)) out.push({ where, word, rule: 'the verb spelling on the noun', text: at(i, word.length) });
    }
    // Guard: an -s adverb qualifying a noun ("downwards resolution").
    if (/^(?:up|down|out|in|on|back)wards$/.test(lw)) {
      const asAdjective = plain.slice(0, i) + word.slice(0, -1) + plain.slice(i + word.length);
      if (WARD_NOUNS.test(plain.slice(i + word.length)) || inside(spans(asAdjective, WARD_ADJECTIVES), i, word.length - 1)) {
        out.push({ where, word, rule: 'the adverb spelling on a noun', text: at(i, word.length) });
      }
    }
  }
  for (const [re, why] of US_VOCABULARY) {
    for (const m of plain.matchAll(new RegExp(re.source, `${re.flags.replace('g', '')}g`))) {
      if (!inside(keep, m.index ?? 0, m[0].length)) out.push({ where, word: m[0], rule: why, text: at(m.index ?? 0, m[0].length) });
    }
  }
  for (const [re, why] of UK_MUSIC_TERMS) {
    for (const m of plain.matchAll(new RegExp(re.source, `${re.flags.replace('g', '')}g`))) out.push({ where, word: m[0], rule: why, text: at(m.index ?? 0, m[0].length) });
  }
  return out;
}

// ─── The corpus ──────────────────────────────────────────────────────────

/** Keys whose values the app runs or compares, never shown as text. */
const VALUE_KEYS = new Set(['id', 'unitId', 'levelId', 'icon', 'tryThisQuery', 'childTryThisQuery', 'query', 'prerequisites', 'track', 'rhythm']);

function walk(node: unknown, path: string, out: [string, string][]) {
  if (typeof node === 'string') out.push([path, node]);
  else if (Array.isArray(node)) node.forEach((x, i) => walk(x, `${path}[${i}]`, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) if (!VALUE_KEYS.has(k)) walk(v, `${path}.${k}`, out);
  }
}

/** Only the English of { en, pt, es } records (the tester's sheet). */
function walkEn(node: unknown, path: string, out: [string, string][]) {
  if (Array.isArray(node)) node.forEach((x, i) => walkEn(x, `${path}[${i}]`, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === 'en') walk(v, `${path}.en`, out);
      else if (k !== 'pt' && k !== 'es') walkEn(v, `${path}.${k}`, out);
    }
  }
}

export const NAMESPACES = import.meta.glob<{ default: unknown }>(['../locales/en.json', '../*/en.json', '../*/*.en.json'], { eager: true });

// ─── English in code ─────────────────────────────────────────────────────

const ROOT = process.cwd();

/**
 * Source files under src/ that are NOT read for English in code, each with
 * why. Every other non-test .ts / .tsx file is read with the TypeScript parser
 * (string literals, template pieces, JSX text), less what is code: imports,
 * types, property names, keys passed to t(), selectors, class lists, CSS,
 * attributes that are not words (className, style, data-*, role…), and lone
 * lower-case tokens (ids, keys, classes).
 */
export const NOT_READ_AS_CODE: readonly (readonly [RegExp, string])[] = [
  [/\.(test|spec)\.tsx?$|\/__tests__\//, 'tests'],
  [/^src\/core\/constants\/curriculumL\d\.ts$|^src\/core\/constants\/optionalCurriculum\.ts$|^src\/data\/exercises\/(exercises|templates)L\d\.ts$|^src\/data\/(songReferences|levelMetadata|moduleIndex|tracks)\.ts$|^src\/core\/constants\/(levels|chordScaleRelationships)\.ts$|^src\/site\/testSheet\/data\.ts$/,
    'content: read as data above (its queries and ids are values, not text)'],
  [/^src\/i18n\/content\/(pt|es)\//, 'Portuguese / Spanish overlays'],
  [/^src\/(i18n\/(scaleSuggestionContext|chordQualityNames)|i18n\/content\/musicTerms|data\/moduleIndexI18n|data\/moduleTitles\.(pt|es)|components\/theory\/chordCategoryLabel)\.tsx?$/,
    'Portuguese / Spanish words (an English key here repeats an English text read elsewhere)'],
  [/^src\/site\//, 'the public pages\' and the test sheet\'s own code: another builder\'s area this round; the pages print the curriculum, read above'],
  [/^src\/core\/utils\/rhythm\.ts$|^src\/release\/releaseNotes\.ts$/, 'messages for whoever writes lessons or release notes (validation that fails a test or the build), never shown to a learner'],
  [/\.d\.ts$/, 'type declarations'],
];

function sourceFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sourceFiles(p, out);
    else if (/\.tsx?$/.test(name)) out.push(relative(ROOT, p));
  }
  return out;
}

const CODE_ATTRS = /^(className|style|data-[\w-]+|role|id|key|href|src|type|htmlFor|aria-haspopup|aria-controls|aria-labelledby|aria-describedby|aria-live|aria-current|testId|viewBox|d|fill|stroke|target|rel|lang|dir|name|autoComplete|inputMode|method|accept|tabIndex|xmlns|points|transform|strokeLinecap|strokeLinejoin|fillRule|clipRule)$/;
const CODE_CALLS = /(^|\.)(t|getFixedT\([^)]*\)|querySelector|querySelectorAll|closest|matches|matchMedia|getPropertyValue|setProperty|removeProperty|addEventListener|removeEventListener|getItem|setItem|removeItem|startsWith|endsWith|includes|indexOf|split|createElement|createElementNS|setAttribute|getAttribute|hasAttribute|removeAttribute|toggleAttribute|Symbol|require|postMessage|BroadcastChannel|registerWorkInProgress|test)$|^console\./;
const CODE_PROPS = /^(id|key|type|kind|mode|fit|variant|tone|className|classes|style|color|backgroundColor|borderColor|transition|testId|role|query|tryThisQuery|scale|scaleType|quality|family|format|storageKey|path|href|src|selector)$/;
const looksLikeCode = (t: string) => {
  const s = t.trim();
  if (!/[A-Za-z]{3}/.test(s)) return true;
  // one token that is an id, a key, a class or a path (lower case, dotted, camelCase); a capitalised word ("Major") is text
  if (!/\s/.test(s) && (/^[a-z0-9]/.test(s) || /[._:/#[\]=*@%$-]/.test(s) || /[a-z][A-Z]/.test(s))) return true;
  if (/^[[.#<:(]|\[data-|\bvar\(--|color-mix|rgba?\(|\b\d+(px|rem|em|ms|s|%|deg)\b|prefers-|pointer:|hover:|cubic-bezier|translate\(|solid #/.test(s)) return true;
  const tokens = s.split(/\s+/);
  return tokens.every((w) => /^[a-z0-9:[\]/.%#()_!>&*=,+@"'-]+$/.test(w)) && tokens.some((w) => /[-:]/.test(w)); // a class list
};

function propOf(n: ts.Node): string | undefined {
  for (let p = n.parent, d = 0; p && d < 4; p = p.parent, d++) {
    if (ts.isPropertyAssignment(p) && !(p.name === n)) return ts.isIdentifier(p.name) || ts.isStringLiteral(p.name) ? p.name.text : undefined;
    if (ts.isVariableDeclaration(p) || ts.isCallExpression(p) || ts.isJsxAttribute(p)) return undefined;
  }
  return undefined;
}

/** English text in one source file's code. */
export function codeTexts(file: string): [string, string][] {
  const src = readFileSync(join(ROOT, file), 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const out: [string, string][] = [];
  const visit = (node: ts.Node) => {
    let text: string | undefined;
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node) || ts.isJsxText(node)) text = node.text;
    if (text !== undefined && !looksLikeCode(text) && !isCodePosition(node)) {
      out.push([`${file}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`, text]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

function isCodePosition(node: ts.Node): boolean {
  const p = node.parent;
  if (!p) return true;
  if (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || ts.isExternalModuleReference(p) || ts.isLiteralTypeNode(p)) return true;
  if ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isPropertyDeclaration(p) || ts.isEnumMember(p)) && p.name === node) return true;
  if (ts.isElementAccessExpression(p) && p.argumentExpression === node) return true;
  if (ts.isCaseClause(p)) return true;
  if (ts.isBinaryExpression(p) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(p.operatorToken.kind)) return true;
  if (ts.isCallExpression(p) && (p.expression.kind === ts.SyntaxKind.ImportKeyword || CODE_CALLS.test(p.expression.getText()))) return true;
  for (let q: ts.Node | undefined = p; q; q = q.parent) {
    if (ts.isTypeNode(q) && !ts.isTypeQueryNode(q)) return true;
    if (ts.isJsxAttribute(q)) return CODE_ATTRS.test(q.name.getText());
    if (ts.isTemplateExpression(q) && q.parent && ts.isJsxExpression(q.parent) && ts.isJsxAttribute(q.parent.parent) && CODE_ATTRS.test(q.parent.parent.name.getText())) return true;
  }
  const prop = propOf(node);
  return prop !== undefined && CODE_PROPS.test(prop);
}

/** The source files read for English in code (every one not listed in NOT_READ_AS_CODE). */
export const codeFiles = () => sourceFiles(join(ROOT, 'src')).filter((f) => !NOT_READ_AS_CODE.some(([re]) => re.test(f))).sort();

export function englishCorpus(): [string, string][] {
  const out: [string, string][] = [];
  for (const e of overlayEntries()) out.push([e.key, e.en]); // curriculum, exercises, templates, songs, level cards
  for (const [n, units] of Object.entries(EN_UNITS)) walk(units, `curriculumL${n}`, out); // + completion texts
  for (const m of MODULE_INDEX) out.push([`moduleIndex:${m.id}.title`, m.title], [`moduleIndex:${m.id}.subtitle`, m.subtitle]);
  for (const l of CURRICULUM_LEVELS) out.push([`levels:${l.id}.title`, l.title], [`levels:${l.id}.description`, l.description], [`levels:${l.id}.difficultyLabel`, l.difficultyLabel]);
  for (const [q, list] of Object.entries(CHORD_SCALE_MAP)) list.forEach((s, i) => s.context && out.push([`chordScale:${q}[${i}]`, s.context]));
  for (const [file, mod] of Object.entries(NAMESPACES)) walk(mod.default, file.replace('../', 'i18n/'), out);
  walkEn({ ui: UI_TEMPLATES, sheets: SHEET_TEMPLATES, guide: GUIDE_TEMPLATE }, 'testSheet', out);
  for (const r of renderBank('en')) out.push([`drill:${r.id}`, [r.question, ...r.choices, r.explanation, r.answer].join(' | ')]);
  for (const f of codeFiles()) out.push(...codeTexts(f));
  return out;
}
