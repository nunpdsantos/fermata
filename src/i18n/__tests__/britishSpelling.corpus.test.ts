/**
 * British spelling throughout (the owner's ruling, 18 November 2026: "British
 * throughout", knowing a reworded question loses its saved per-question score).
 *
 * Every English sentence a learner can read is checked here: the curriculum
 * (every level, the tracks, milestones and completion texts), the authored
 * exercises and the generation templates, the songs, the level cards, the
 * lesson index Cmd+K searches, the chord panel's scale notes, every English
 * namespace (the entry locales and the lazy ones: glossary, practice, tuner,
 * microphone, MIDI, metronome, moved, backup file, learn words, explore tools,
 * Drill terms), the tester's sheet and every Drill item as the learner meets it.
 *
 * - An AMERICAN form (left column) fails wherever it appears.
 * - A word that is American only in one of its uses ("practice" the verb,
 *   "upward" the adverb) fails unless the phrase around it is one of the
 *   uses listed as kept, each with its reason.
 * - TITLES, names and quotations keep their own spelling: KEEP lists each
 *   one with its reason (none at present).
 * Music vocabulary is not spelling and stays as the app has it (quarter note,
 * half step, measure, neighbour TONE). Values the app runs or compares (lesson
 * queries, ids, search keywords, Drill graded answers) are not text and are
 * not read here.
 */
import { describe, expect, it } from 'vitest';
import { EN_UNITS, overlayEntries } from '../content/__tests__/overlayEntries';
import { MODULE_INDEX } from '../../data/moduleIndex';
import { CURRICULUM_LEVELS } from '../../core/constants/levels';
import { CHORD_SCALE_MAP } from '../../core/constants/chordScaleRelationships';
import { GUIDE_TEMPLATE, SHEET_TEMPLATES, UI_TEMPLATES } from '../../site/testSheet/data';
import { renderBank } from '../../components/drill/__tests__/drillCorpus';

/** American form → British form (the word table of the spelling pass, 19 November 2026). */
const AMERICAN: Readonly<Record<string, string>> = {
  color: 'colour', colors: 'colours', colored: 'coloured', colorful: 'colourful', coloring: 'colouring', coloristic: 'colouristic',
  neighbor: 'neighbour', neighbors: 'neighbours', neighboring: 'neighbouring',
  favor: 'favour', favored: 'favoured', favorite: 'favourite', flavor: 'flavour', flavors: 'flavours', flavored: 'flavoured',
  center: 'centre', centers: 'centres', centered: 'centred', somber: 'sombre',
  meter: 'metre', meters: 'metres', polymeter: 'polymetre',
  recognize: 'recognise', recognizes: 'recognises', recognized: 'recognised', recognizing: 'recognising', recognizable: 'recognisable',
  tonicization: 'tonicisation', tonicizations: 'tonicisations', tonicize: 'tonicise', tonicizes: 'tonicises', tonicized: 'tonicised', tonicizing: 'tonicising',
  reharmonization: 'reharmonisation', harmonization: 'harmonisation', harmonizations: 'harmonisations',
  harmonize: 'harmonise', harmonized: 'harmonised', harmonizing: 'harmonising',
  emphasize: 'emphasise', emphasizes: 'emphasises', emphasized: 'emphasised', emphasizing: 'emphasising',
  organize: 'organise', organizes: 'organises', organized: 'organised', organization: 'organisation',
  realize: 'realise', realized: 'realised', realizing: 'realising', realization: 'realisation',
  characterize: 'characterise', characterizes: 'characterises', characterized: 'characterised',
  epitomize: 'epitomise', internalize: 'internalise', internalizes: 'internalises', internalized: 'internalised',
  memorize: 'memorise', memorizing: 'memorising', minimizes: 'minimises', maximizes: 'maximises',
  synchronization: 'synchronisation', synchronized: 'synchronised', hybridizes: 'hybridises', normalized: 'normalised',
  specialized: 'specialised', energizes: 'energises', categorize: 'categorise', stylized: 'stylised', popularized: 'popularised',
  analyze: 'analyse', analyzed: 'analysed', analyzing: 'analysing',
  totaling: 'totalling', signaling: 'signalling', labeling: 'labelling', labeled: 'labelled',
  toward: 'towards', catalog: 'catalogue', dialog: 'dialogue', gray: 'grey', math: 'maths', percent: 'per cent', judgment: 'judgement',
  practicing: 'practising', practiced: 'practised', program: 'programme', programs: 'programmes',
};

/** "-ward" before its noun is the adjective, the same in British English. */
const WARD_ADJECTIVES = [
  [/\bdownward resolution\b/, 'adjective before its noun'],
  [/\bupward resolution\b/, 'adjective before its noun'],
  [/\boutward resolution\b/, 'adjective before its noun'],
  [/\bdownward-resolving\b/, 'compound adjective'],
  [/\bdownward step\b/, 'adjective before its noun'],
  [/\bupward leap\b/, 'adjective before its noun'],
  [/\bupward-octave\b/, 'compound adjective'],
  [/\bbackward versions\b/, 'adjective before its noun'],
  [/\b[Uu]pward or downward motion\b/, 'adjectives before their noun'],
] as const;

/** American in one use only: an occurrence passes only inside one of these phrases. */
const AMBIGUOUS: Readonly<Record<string, { british: string; kept: readonly (readonly [RegExp, string])[] }>> = {
  practice: {
    british: 'practise (the verb)',
    kept: [
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
      [/\bPractice answers\b/, 'noun: the practice round\'s answers'],
    ],
  },
  ...Object.fromEntries(['upward', 'downward', 'outward', 'inward', 'onward', 'backward'].map((w) => [w, { british: `${w}s (the adverb)`, kept: WARD_ADJECTIVES }])),
};

/** Titles, names and quotations that keep their own spelling (none at present). */
const KEEP: readonly (readonly [RegExp, string])[] = [];

interface Offender { where: string; word: string; text: string }

/** The check itself: every American form in one English text. */
function americanForms(where: string, text: string): Offender[] {
  const out: Offender[] = [];
  const plain = text.replace(/\{\{[^}]*\}\}/g, (p) => ' '.repeat(p.length)); // i18n placeholders are not words
  /** Spans of `text` matched by any of these phrases. */
  const spans = (list: readonly (readonly [RegExp, string])[]) =>
    list.flatMap(([re]) => [...plain.matchAll(new RegExp(re.source, `${re.flags.replace('g', '')}g`))].map((m) => [m.index ?? 0, (m.index ?? 0) + m[0].length] as const));
  const inside = (s: readonly (readonly [number, number])[], at: number, len: number) => s.some(([a, b]) => a <= at && at + len <= b);
  const keep = spans(KEEP);
  for (const m of plain.matchAll(/(?<![\p{L}\p{N}])[A-Za-z]+(?![\p{L}\p{N}])/gu)) {
    const word = m[0].toLowerCase();
    const at = m.index ?? 0;
    if (inside(keep, at, word.length)) continue;
    const amb = AMBIGUOUS[word];
    if (AMERICAN[word] || (amb && !inside(spans(amb.kept), at, word.length))) {
      out.push({ where, word: m[0], text: plain.slice(Math.max(0, at - 40), at + word.length + 40).replace(/\s+/g, ' ') });
    }
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

const NAMESPACES = import.meta.glob<{ default: unknown }>(['../locales/en.json', '../*/en.json', '../*/*.en.json'], { eager: true });

function englishCorpus(): [string, string][] {
  const out: [string, string][] = [];
  for (const e of overlayEntries()) out.push([e.key, e.en]); // curriculum, exercises, templates, songs, level cards
  for (const [n, units] of Object.entries(EN_UNITS)) walk(units, `curriculumL${n}`, out); // + completion texts
  for (const m of MODULE_INDEX) out.push([`moduleIndex:${m.id}.title`, m.title], [`moduleIndex:${m.id}.subtitle`, m.subtitle]);
  for (const l of CURRICULUM_LEVELS) out.push([`levels:${l.id}.title`, l.title], [`levels:${l.id}.description`, l.description], [`levels:${l.id}.difficultyLabel`, l.difficultyLabel]);
  for (const [q, list] of Object.entries(CHORD_SCALE_MAP)) list.forEach((s, i) => s.context && out.push([`chordScale:${q}[${i}]`, s.context]));
  for (const [file, mod] of Object.entries(NAMESPACES)) walk(mod.default, file.replace('../', 'i18n/'), out);
  walkEn({ ui: UI_TEMPLATES, sheets: SHEET_TEMPLATES, guide: GUIDE_TEMPLATE }, 'testSheet', out);
  for (const r of renderBank('en')) out.push([`drill:${r.id}`, [r.question, ...r.choices, r.explanation, r.answer].join(' | ')]);
  return out;
}

describe('English is spelt the British way (the owner\'s ruling, 18 November 2026)', () => {
  const corpus = englishCorpus();

  it('reads the whole corpus', () => {
    const where = (p: string) => corpus.filter(([w]) => w.startsWith(p)).length;
    expect(where('cur:')).toBeGreaterThan(2500);
    expect(where('ex:')).toBeGreaterThan(2500);
    expect(where('tm:')).toBeGreaterThan(1700);
    expect(where('song:')).toBeGreaterThan(70);
    expect(where('lvl:')).toBe(27);
    expect(where('moduleIndex:')).toBe(2 * MODULE_INDEX.length);
    expect(where('drill:')).toBe(1615);
    // every English namespace file: the entry locales and the eleven lazy ones
    expect(Object.keys(NAMESPACES).sort()).toEqual([
      '../backupFile/en.json', '../drillTerms/en.json', '../exploreTools/en.json', '../glossary/en.json', '../learnWords/en.json',
      '../locales/en.json', '../metronomeTool/en.json', '../midiInput/en.json', '../moved/en.json', '../practice/en.json',
      '../tuner/en.json', '../tuner/mic.en.json',
    ]);
    expect(where('testSheet')).toBeGreaterThan(100);
  });

  it('no American form in any English text a learner reads', () => {
    const found = corpus.flatMap(([where, text]) => americanForms(where, text));
    expect(found.length, found.slice(0, 40).map((f) => `${f.where}: "${f.word}" in …${f.text}…`).join('\n')).toBe(0);
  });

  it('every kept phrase is still used (the list does not rot)', () => {
    const text = corpus.map(([, t]) => t).join('\n');
    const unused = [...Object.values(AMBIGUOUS).flatMap((a) => a.kept), ...KEEP].filter(([re]) => !re.test(text)).map(([re]) => String(re));
    expect([...new Set(unused)]).toEqual([]);
  });

  it('the check fires on planted American forms and passes the kept uses', () => {
    const planted = 'Practice identifying the color of a tonal center. In practice, the 7th resolves downward by step; a downward step; analyze it; {{color}}.';
    expect(americanForms('planted', planted).map((f) => f.word)).toEqual(['Practice', 'color', 'center', 'downward', 'analyze']);
    expect(americanForms('planted', 'Practise identifying the colour of a tonal centre; it resolves downwards; analyse it.')).toEqual([]);
  });
});
