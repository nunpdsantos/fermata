/**
 * No English in Portuguese or Spanish Drill text (audit A12, 2026-11-18).
 *
 * Every item of the bank is rendered as the learner meets it (drillCorpus.ts:
 * the question, every answer chip, the explanation, the answer the feedback
 * names) in PT and in ES, and every word is checked against the English the
 * same items show in English. A word is English when the English rendering of
 * the bank uses it and it is not on the short allow-list below (each entry is
 * a word Portuguese or Spanish also has, spelled the same). Interval
 * abbreviations in English order ("M3", "P5") count as English: the house
 * style writes "3M", "5P" / "5J" in translated text (docs/pt-diacritic-todo.md).
 *
 * What stays as written in every language, and is never checked as a word:
 * letter note names (D-18) and pitches ("B3"), chord symbols ("G7", "B♭7",
 * "V7"), Roman numerals ("ii", "vii°", positions "IX"), the chord-quality
 * symbols the explanations use ("maj7", "m7", "ø7"; D-17 keeps chord-quality
 * symbols as symbols), numbers, key-signature counts ("3♯"), PT/ES ordinals
 * ("3.ª") and guitar places ("⑥3").
 *
 * DRILL_LANG_REPORT=<file> writes the counts per language, family and field.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BANK, ambiguousLetterStarts, renderBank, type Lang, type RenderedItem } from './drillCorpus';
import type { DrillItem } from '../../../core/types/drill';
import { DRILL_TERMS } from '../../../i18n/drillTerms';
import { qualityName } from '../../../utils/qualityName';

const SPLIT = /[\s,;:!?¿¡()"“”«»…—–=·+/]+/u;

/** Words and symbols of a rendered string; hyphenated words split ("Half-Diminished"). */
export function tokens(text: string): string[] {
  return text
    .split(SPLIT)
    .flatMap((w) => w.replace(/^[.'’]+|[.'’]+$/gu, '').split('-'))
    .filter((w) => /[\p{L}\p{N}]/u.test(w));
}

const NOTE = /^[A-G](?:𝄪|𝄫|♯|♭)?$/u; // C, F♯ (letter names, D-18)
// B3 (a pitch, guitar reading), G7 / B♭7 (a chord symbol, V7 items). Shaped
// like an English-order augmented interval ("A4"), so it passes only where the
// item's own bank values carry it (ownSymbols): a translation never adds one.
const PITCH_OR_CHORD_SYMBOL = /^[A-G](?:𝄪|𝄫|♯|♭)?\d+$/u;
const ROMAN = /^[IVXivx]+(?:°|ø|\+)?7?$/u; // I, ii, vii°, V7, IX
const NUMBER_OR_ORDINAL = /^\d+(?:\.[ªº]s?|[♯♭])?$/u; // 7, 3.ª, a signature's 3♯ / 2♭
const FRET_PLACE = /^[①②③④⑤⑥]\d+$/u; // guitar reading: ⑥3 = string 6, fret 3
const CHORD_QUALITY_SYMBOLS = new Set(['maj7', 'm7', 'ø7']);
const ENGLISH_ORDER_INTERVAL = /^[PMmAd][1-8]$/u; // M3, m3, P5 (PT/ES write 3M, 3m, 5P / 5J)

/**
 * Written the same in every language: never a word to check. A pitch or chord
 * symbol counts only when `own` (the item's bank values) holds it; without
 * `own` (building the English vocabulary) any one counts.
 */
function isSymbol(token: string, own?: ReadonlySet<string>): boolean {
  if (PITCH_OR_CHORD_SYMBOL.test(token)) return own ? own.has(token) : true;
  return (
    NOTE.test(token) ||
    ROMAN.test(token) ||
    NUMBER_OR_ORDINAL.test(token) ||
    FRET_PLACE.test(token) ||
    CHORD_QUALITY_SYMBOLS.has(token)
  );
}

/**
 * Words English shares with Portuguese / Spanish, spelled the same, that the
 * translated Drill uses as Portuguese / Spanish words:
 *  - "a": PT article / preposition ("a escala", "a 3.ª"), ES preposition ("a una 3.ª menor");
 *  - "e": PT "and" (lower case; the note E is a symbol);
 *  - "as": PT article ("as letras");
 *  - "no": PT "in the" ("no fim de uma frase"), ES "no";
 *  - "natural": "menor natural" in both;
 *  - "plagal": "cadência plagal" / "cadencia plagal".
 */
const SHARED_WORDS: Record<'pt' | 'es', ReadonlySet<string>> = {
  pt: new Set(['a', 'e', 'as', 'no', 'natural', 'plagal']),
  es: new Set(['a', 'no', 'natural', 'plagal']),
};

const FIELDS = ['question', 'choices', 'explanation', 'answer'] as const;
type Field = (typeof FIELDS)[number];

function fieldTexts(r: RenderedItem): Record<Field, string[]> {
  return { question: [r.question], choices: r.choices, explanation: [r.explanation], answer: [r.answer] };
}

/** Every word the English rendering of the bank uses (lower case), symbols left out. */
function englishVocabulary(): Set<string> {
  const vocab = new Set<string>();
  for (const r of renderBank('en')) {
    for (const texts of Object.values(fieldTexts(r))) {
      for (const text of texts) {
        for (const tok of tokens(text)) {
          if (isSymbol(tok) || ENGLISH_ORDER_INTERVAL.test(tok)) continue;
          vocab.add(tok.toLowerCase());
        }
      }
    }
  }
  return vocab;
}

/**
 * The English words (or English-order interval abbreviations, or a pitch /
 * chord symbol the item does not carry) in one translated string.
 */
export function englishIn(text: string, lang: 'pt' | 'es', vocab: ReadonlySet<string>, own: ReadonlySet<string>): string[] {
  const found: string[] = [];
  for (const tok of tokens(text)) {
    if (isSymbol(tok, own)) continue;
    if (ENGLISH_ORDER_INTERVAL.test(tok) || PITCH_OR_CHORD_SYMBOL.test(tok)) {
      found.push(tok);
      continue;
    }
    const w = tok.toLowerCase();
    if (vocab.has(w) && !SHARED_WORDS[lang].has(w)) found.push(tok);
  }
  return found;
}

interface Leak {
  id: string;
  family: string;
  field: Field;
  text: string;
  words: string[];
}

/** The symbols an item's own bank values carry (params, chips, answer): pitches, chord symbols. */
function ownSymbols(item: DrillItem): Set<string> {
  const values: string[] = [];
  const add = (v: unknown) => {
    if (typeof v === 'string') values.push(v);
    else if (Array.isArray(v)) v.forEach(add);
    else if (v && typeof v === 'object') Object.values(v).forEach(add);
  };
  add(item.promptParams);
  add(item.whyParams);
  add(item.input);
  add(item.answer);
  return new Set(values.flatMap(tokens));
}

function leaksFor(lang: 'pt' | 'es', vocab: ReadonlySet<string>): Leak[] {
  const leaks: Leak[] = [];
  const rendered = renderBank(lang);
  for (const [i, r] of rendered.entries()) {
    const texts = fieldTexts(r);
    const own = ownSymbols(BANK[i]);
    for (const field of FIELDS) {
      for (const text of texts[field]) {
        const words = englishIn(text, lang, vocab, own);
        if (words.length) leaks.push({ id: r.id, family: r.family, field, text, words });
      }
    }
  }
  return leaks;
}

/** Items (not strings) with English, by family and by field. */
function counts(leaks: Leak[]) {
  const items = (filter: (l: Leak) => boolean) => new Set(leaks.filter(filter).map((l) => l.id)).size;
  const families = [...new Set(leaks.map((l) => l.family))].sort();
  return {
    items: items(() => true),
    byFamily: Object.fromEntries(
      families.map((f) => [
        f,
        {
          items: items((l) => l.family === f),
          ...Object.fromEntries(FIELDS.map((fd) => [fd, items((l) => l.family === f && l.field === fd)])),
        },
      ]),
    ),
  };
}

const VOCAB = englishVocabulary();
const NONE: ReadonlySet<string> = new Set();

describe('the detector itself', () => {
  it('has a real English vocabulary to check against', () => {
    expect(VOCAB.size).toBeGreaterThan(150);
    for (const w of ['the', 'with', 'major', 'minor', 'perfect', '3rd', 'tritone', 'octave', 'dominant']) {
      expect(VOCAB.has(w), w).toBe(true);
    }
  });

  it('finds planted English and passes what stays as written', () => {
    expect(englishIn('Uma Major 3rd acima de C?', 'pt', VOCAB, NONE)).toEqual(['Major', '3rd']);
    expect(englishIn('C maior puxa home — creates rest — é essa a sua função harmónica.', 'pt', VOCAB, NONE)).toEqual([
      'home',
      'creates',
      'rest',
    ]);
    expect(englishIn('C mayor apila M3 + m3 desde la fundamental: C E G.', 'es', VOCAB, NONE)).toEqual(['M3', 'm3']);
    expect(englishIn('Soletra C Half-Diminished 7th', 'pt', VOCAB, NONE)).toEqual(['Half', 'Diminished', '7th']);
    expect(englishIn('¿Cuál es el V7 de B♭? G7, E♭7, vii°, B3, 3.ª menor, 3M + 3m, el m7 y el ø7', 'es', VOCAB, new Set(['G7', 'E♭7', 'B3']))).toEqual([]);
    expect(englishIn('G maior tem 1♯; F maior 1♭. ⑥3 · ⑤8', 'pt', VOCAB, NONE)).toEqual([]);
    expect(englishIn('A escala de A menor natural: as letras e a cadência plagal no fim.', 'pt', VOCAB, NONE)).toEqual([]);
    expect(englishIn('No, a la tónica: menor natural, cadencia plagal.', 'es', VOCAB, NONE)).toEqual([]);
    // An English-order augmented interval shaped like a pitch is caught, unless the item carries that pitch.
    expect(englishIn('Uma A4 acima de C; de C a A5.', 'pt', VOCAB, NONE)).toEqual(['A4', 'A5']);
    expect(englishIn('A4 escrito soa A3.', 'pt', VOCAB, new Set(['A4', 'A3']))).toEqual([]);
    expect(englishIn('A4 escrito soa A3.', 'pt', VOCAB, new Set(['A4']))).toEqual(['A3']);
    // A word shared with Portuguese is still English in Spanish ("as").
    expect(englishIn('Funciona as V', 'es', VOCAB, NONE)).toEqual(['as']);
  });
});

describe('no English in Portuguese or Spanish Drill text (A12)', () => {
  const report: Record<string, unknown> = {};
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: every question, chip, explanation and feedback answer of the bank`, () => {
      const leaks = leaksFor(lang, VOCAB);
      report[lang] = { ...counts(leaks), sample: leaks.slice(0, 400) };
      if (process.env.DRILL_LANG_REPORT) writeFileSync(process.env.DRILL_LANG_REPORT, JSON.stringify(report, null, 1));
      expect(leaks.map((l) => `${l.id} [${l.field}] ${l.words.join(' ')}: ${l.text}`).slice(0, 25)).toEqual([]);
    });

    it(`${lang.toUpperCase()}: no unrendered key or token`, () => {
      for (const r of renderBank(lang)) {
        for (const texts of Object.values(fieldTexts(r))) {
          for (const text of texts) {
            expect(text, r.id).not.toMatch(/\{\{|\}\}|\bdrill(?:Terms)?\.[a-z]/);
            expect(text.trim().length, r.id).toBeGreaterThan(0);
          }
        }
      }
    });
  }
});

export type { Lang };

// ─── Sentences, not only words (fix pass after the review of 2d07ebe) ─────────

/** The body of a function named `name` in a source file, whitespace folded. */
function functionBody(path: string, name: string): string {
  const src = readFileSync(resolve(process.cwd(), path), 'utf8');
  const at = src.indexOf(`export function ${name}(`);
  expect(at, `${name} in ${path}`).toBeGreaterThan(-1);
  const open = src.indexOf('{', src.indexOf(')', at));
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(open, i + 1).replace(/\s+/g, ' ');
  }
  throw new Error(`unbalanced ${name}`);
}

/** Every question and explanation of the bank in one language (sentences; chips are labels). */
function sentences(lang: 'pt' | 'es'): Array<{ id: string; text: string }> {
  return renderBank(lang).flatMap((r) => [
    { id: `${r.id} [question]`, text: r.question },
    { id: `${r.id} [explanation]`, text: r.explanation },
  ]);
}

describe('PT / ES Drill sentences never open on a bare note letter that reads as a word (noun rule)', () => {
  it('the rule is the lessons\' own, word for word (noteNames.test.ts)', () => {
    expect(functionBody('src/components/drill/__tests__/drillCorpus.ts', 'ambiguousLetterStarts')).toBe(
      functionBody('src/i18n/content/__tests__/noteNames.test.ts', 'ambiguousLetterStarts'),
    );
  });

  it('it catches what it should, on Drill sentences', () => {
    expect(ambiguousLetterStarts('pt', 'A menor puxa para casa — cria repouso.')).toEqual(['A menor']);
    expect(ambiguousLetterStarts('pt', 'E menor é o acorde diatónico.')).toEqual(['E menor']);
    expect(ambiguousLetterStarts('es', 'A menor tira hacia casa.')).toEqual(['A menor']);
    expect(ambiguousLetterStarts('pt', 'Conta as letras. C: A menor.')).toEqual(['A menor']);
    expect(ambiguousLetterStarts('pt', 'O acorde de A menor puxa para casa.')).toEqual([]);
    expect(ambiguousLetterStarts('es', 'La relativa de C es A menor.')).toEqual([]);
  });

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: no question or explanation of the bank breaks it`, () => {
      const hits = sentences(lang).filter((s) => ambiguousLetterStarts(lang, s.text).length > 0);
      expect(hits.slice(0, 20)).toEqual([]);
    });
  }
});

/**
 * A chip's name stands capitalised on its own ("Trítono", "Meio-diminuto");
 * inside running text the Drill writes it in lower case ("formam um trítono",
 * "C♯ meio-diminuto"). No such name may stand capitalised in the middle of a
 * sentence — today none can (no pair-to-name item answers a tritone, unison
 * or octave), so this guards "A resposta é Trítono." for later.
 */
function capitalisedNames(lang: 'pt' | 'es'): string[] {
  const intervals = Object.values((DRILL_TERMS[lang] as { interval: Record<string, string> }).interval);
  const qualities = (['major', 'minor', 'diminished', 'augmented', 'major7', 'dominant7', 'minor7', 'half_diminished7', 'diminished7'] as const).map(
    (q) => qualityName(q, lang),
  );
  return [...intervals, ...qualities].filter((n) => /^\p{Lu}/u.test(n));
}

export function capitalisedMidSentence(text: string, names: readonly string[]): string[] {
  const found: string[] = [];
  for (const name of names) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`, 'gu');
    for (const m of text.matchAll(re)) {
      const before = text.slice(0, m.index);
      if (!/(?:^|[.!?]\s+|[¿¡]|—\s+)$/u.test(before)) found.push(name);
    }
  }
  return found;
}

describe('no chip name stands capitalised inside running text', () => {
  it('the names it watches, and planted cases', () => {
    expect(capitalisedNames('pt')).toEqual(expect.arrayContaining(['Uníssono', 'Trítono', 'Oitava', 'Meio-diminuto', 'Sétima da dominante']));
    expect(capitalisedNames('es')).toEqual(expect.arrayContaining(['Unísono', 'Tritono', 'Octava', 'Semidisminuido', 'Séptima de dominante']));
    const pt = capitalisedNames('pt');
    expect(capitalisedMidSentence('Conta primeiro as letras. A resposta é Trítono.', pt)).toEqual(['Trítono']);
    expect(capitalisedMidSentence('Isso dá C♯ Meio-diminuto.', pt)).toEqual(['Meio-diminuto']);
    expect(capitalisedMidSentence('Trítono é o nome. 6 meios-tons formam um trítono.', pt)).toEqual([]);
    expect(capitalisedMidSentence('¿Tritono o 5.ª justa?', capitalisedNames('es'))).toEqual([]);
  });

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang.toUpperCase()}: none in any question or explanation of the bank`, () => {
      const names = capitalisedNames(lang);
      const hits = sentences(lang).flatMap((s) => capitalisedMidSentence(s.text, names).map((n) => `${s.id}: ${n} in "${s.text}"`));
      expect(hits.slice(0, 20)).toEqual([]);
    });
  }
});
