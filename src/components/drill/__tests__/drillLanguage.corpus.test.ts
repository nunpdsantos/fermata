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
import { writeFileSync } from 'node:fs';
import { renderBank, type Lang, type RenderedItem } from './drillCorpus';

const SPLIT = /[\s,;:!?¿¡()"“”«»…—–=·+/]+/u;

/** Words and symbols of a rendered string; hyphenated words split ("Half-Diminished"). */
export function tokens(text: string): string[] {
  return text
    .split(SPLIT)
    .flatMap((w) => w.replace(/^[.'’]+|[.'’]+$/gu, '').split('-'))
    .filter((w) => /[\p{L}\p{N}]/u.test(w));
}

const NOTE_OR_PITCH = /^[A-G](?:𝄪|𝄫|♯|♭)?\d*$/u; // C, F♯, B3 (a pitch), G7 / B♭7 (a chord symbol)
const ROMAN = /^[IVXivx]+(?:°|ø|\+)?7?$/u; // I, ii, vii°, V7, IX
const NUMBER_OR_ORDINAL = /^\d+(?:\.[ªº]s?|[♯♭])?$/u; // 7, 3.ª, a signature's 3♯ / 2♭
const FRET_PLACE = /^[①②③④⑤⑥]\d+$/u; // guitar reading: ⑥3 = string 6, fret 3
const CHORD_QUALITY_SYMBOLS = new Set(['maj7', 'm7', 'ø7']);
const ENGLISH_ORDER_INTERVAL = /^[PMmAd][1-8]$/u; // M3, m3, P5 (PT/ES write 3M, 3m, 5P / 5J)

/** Written the same in every language: never a word to check. */
function isSymbol(token: string): boolean {
  return (
    NOTE_OR_PITCH.test(token) ||
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

/** The English words (or English-order interval abbreviations) in one translated string. */
export function englishIn(text: string, lang: 'pt' | 'es', vocab: ReadonlySet<string>): string[] {
  const found: string[] = [];
  for (const tok of tokens(text)) {
    if (isSymbol(tok)) continue;
    if (ENGLISH_ORDER_INTERVAL.test(tok)) {
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

function leaksFor(lang: 'pt' | 'es', vocab: ReadonlySet<string>): Leak[] {
  const leaks: Leak[] = [];
  for (const r of renderBank(lang)) {
    const texts = fieldTexts(r);
    for (const field of FIELDS) {
      for (const text of texts[field]) {
        const words = englishIn(text, lang, vocab);
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

describe('the detector itself', () => {
  it('has a real English vocabulary to check against', () => {
    expect(VOCAB.size).toBeGreaterThan(150);
    for (const w of ['the', 'with', 'major', 'minor', 'perfect', '3rd', 'tritone', 'octave', 'dominant']) {
      expect(VOCAB.has(w), w).toBe(true);
    }
  });

  it('finds planted English and passes what stays as written', () => {
    expect(englishIn('Uma Major 3rd acima de C?', 'pt', VOCAB)).toEqual(['Major', '3rd']);
    expect(englishIn('C maior puxa home — creates rest — é essa a sua função harmónica.', 'pt', VOCAB)).toEqual([
      'home',
      'creates',
      'rest',
    ]);
    expect(englishIn('C mayor apila M3 + m3 desde la fundamental: C E G.', 'es', VOCAB)).toEqual(['M3', 'm3']);
    expect(englishIn('Soletra C Half-Diminished 7th', 'pt', VOCAB)).toEqual(['Half', 'Diminished', '7th']);
    expect(englishIn('¿Cuál es el V7 de B♭? G7, E♭7, vii°, B3, 3.ª menor, 3M + 3m, el m7 y el ø7', 'es', VOCAB)).toEqual([]);
    expect(englishIn('G maior tem 1♯; F maior 1♭. ⑥3 · ⑤8', 'pt', VOCAB)).toEqual([]);
    expect(englishIn('A escala de A menor natural: as letras e a cadência plagal no fim.', 'pt', VOCAB)).toEqual([]);
    expect(englishIn('No, a la tónica: menor natural, cadencia plagal.', 'es', VOCAB)).toEqual([]);
    // A word shared with Portuguese is still English in Spanish ("as").
    expect(englishIn('Funciona as V', 'es', VOCAB)).toEqual(['as']);
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
