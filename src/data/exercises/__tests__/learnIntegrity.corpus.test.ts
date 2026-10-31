/**
 * Learn exercise integrity, checked over every served exercise (authored +
 * generated) in English, Portuguese and Spanish:
 *
 * - W4-02 a scale-degree question names the note it asks about;
 * - W4-05 a ledger-line exercise is drawn in its authored clef, on a note
 *   that really needs ledger lines, matching what the prompt says;
 * - W4-06 a question that points at "this chord / this key signature / the
 *   indicated line" shows that notation (a staff stimulus) — otherwise it is
 *   worded as "which statement about X is true?";
 * - W4-07 an authored question does not contain its own answer;
 * - W4-09 the correct option is not a length cue: per level and language it
 *   is the strictly longest option in at most 35% of choice sets (chance,
 *   with four options, is ~25%).
 */
import { describe, it, expect } from 'vitest';
import type { NaturalNote } from '../../../core/types/music';
import { buildChord } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import type { ChordQuality, ScaleType, Accidental } from '../../../core/types/music';
import { exerciseStaff } from '../../../components/learn/exercises/exerciseStaff';
import { writtenOctave } from '../../../core/utils/degreeSpelling';
import { INTERVAL_LABELS } from '../../../core/constants/chords';
import { spelledIntervalName } from '../../../components/learn/exercises/exerciseHelpers';
import { CONTENT_LANGS, LEVELS, levelCorpus, templatesFor, authoredFor } from './learnCorpus';

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

describe('scale-degree questions name the note (W4-02)', () => {
  for (const lang of CONTENT_LANGS) {
    it(`${lang}: every scale_degree_id prompt names its note`, () => {
      const missing: string[] = [];
      for (const n of LEVELS) {
        for (const { exercise } of levelCorpus(n, lang)) {
          const c = exercise.config;
          if (c.type !== 'scale_degree_id') continue;
          const name = `${c.note}${c.noteAccidental}`;
          if (!new RegExp(`(?<![A-Za-z])${name.replace('#', '\\#')}(?![#b♯♭A-Za-z])`).test(exercise.prompt)) missing.push(`${exercise.id}: "${exercise.prompt}" (note ${name})`);
        }
      }
      expect(missing).toEqual([]);
    });
  }
});

// ── Staff-position oracle (independent of the staff renderer) ─────────────
/** Diatonic step index of a written note: C4 = 28. */
const step = (letter: NaturalNote, writtenOct: number) => writtenOct * 7 + LETTERS.indexOf(letter);
const STAFF = {
  treble: { bottom: step('E', 4), top: step('F', 5) },
  bass: { bottom: step('G', 2), top: step('A', 3) },
};
/** Ledger lines a note needs, and on which side; whether it sits ON a line. */
function ledger(letter: NaturalNote, writtenOct: number, clef: 'treble' | 'bass') {
  const p = step(letter, writtenOct);
  const { bottom, top } = STAFF[clef];
  const onLine = (p - bottom) % 2 === 0;
  if (p < bottom - 1) return { side: 'below' as const, lines: Math.floor((bottom - p) / 2), onLine };
  if (p > top + 1) return { side: 'above' as const, lines: Math.floor((p - top) / 2), onLine };
  return { side: 'none' as const, lines: 0, onLine };
}

describe('ledger-line exercises (W4-05)', () => {
  it('the oracle: middle C is one ledger line below treble, A3 two, A5 one above; C4 is one above bass', () => {
    expect(ledger('C', 4, 'treble')).toMatchObject({ side: 'below', lines: 1, onLine: true });
    expect(ledger('A', 3, 'treble')).toMatchObject({ side: 'below', lines: 2, onLine: true });
    expect(ledger('B', 3, 'treble')).toMatchObject({ side: 'below', lines: 1, onLine: false });
    expect(ledger('A', 5, 'treble')).toMatchObject({ side: 'above', lines: 1, onLine: true });
    expect(ledger('C', 4, 'bass')).toMatchObject({ side: 'above', lines: 1, onLine: true });
    expect(ledger('G', 5, 'treble').side).toBe('none');
  });

  const WORDS = {
    // PT/ES house terms for "treble/bass staff", "below", "above", "second ledger line".
    treble: /treble|clave de sol/i,
    bass: /\bbass (clef|staff)|clave de f[áa]/i,
    below: /\bbelow\b|abaixo|debajo|por debajo/i,
    above: /\babove\b|acima|encima|por encima/i,
    two: /second ledger line|two ledger lines|segunda linha suplementar|duas linhas suplementares|segunda línea adicional|dos líneas adicionales/i,
  };

  for (const lang of CONTENT_LANGS) {
    it(`${lang}: every note_id item in the ledger-line module is drawn in its stated clef on a real ledger-line note`, () => {
      const bad: string[] = [];
      for (const { exercise, moduleId } of levelCorpus(1, lang)) {
        const c = exercise.config;
        if (moduleId !== 'l1u1m2' || c.type !== 'note_id') continue;
        if (!c.clef) { bad.push(`${exercise.id}: no explicit clef`); continue; }
        const staff = exerciseStaff(c)!;
        const n = staff.notes[0];
        const l = ledger(n.natural, writtenOctave(n, n.octave), staff.clef);
        if (l.lines < 1) bad.push(`${exercise.id}: ${n.natural}${n.accidental} needs no ledger line in ${staff.clef}`);
        const p = exercise.prompt;
        if (WORDS.treble.test(p) && staff.clef !== 'treble') bad.push(`${exercise.id}: prompt says treble, drawn ${staff.clef}`);
        if (WORDS.bass.test(p) && staff.clef !== 'bass') bad.push(`${exercise.id}: prompt says bass, drawn ${staff.clef}`);
        if (WORDS.below.test(p) && l.side !== 'below') bad.push(`${exercise.id}: prompt says below, note is ${l.side}`);
        if (WORDS.above.test(p) && l.side !== 'above') bad.push(`${exercise.id}: prompt says above, note is ${l.side}`);
        if (WORDS.two.test(p) && !(l.lines === 2 && l.onLine)) bad.push(`${exercise.id}: prompt says second ledger line, note has ${l.lines} (onLine ${l.onLine})`);
      }
      expect(bad).toEqual([]);
    });
  }

  it('every note_id prompt that names a clef is drawn in that clef (all levels, EN)', () => {
    const bad: string[] = [];
    for (const n of LEVELS) {
      for (const { exercise } of levelCorpus(n, 'en')) {
        const c = exercise.config;
        if (c.type !== 'note_id') continue;
        const clef = exerciseStaff(c)!.clef;
        if (/treble/i.test(exercise.prompt) && clef !== 'treble') bad.push(`${exercise.id}: treble prompt, ${clef} staff`);
        if (/bass (clef|staff)/i.test(exercise.prompt) && clef !== 'bass') bad.push(`${exercise.id}: bass prompt, ${clef} staff`);
      }
    }
    expect(bad).toEqual([]);
  });
});

// ── W4-06 ──────────────────────────────────────────────────────────────────
/** Words that point at something shown: "this chord", "these keys", "the indicated line", "described", "illustrated here". */
const POINTING = /\b(this|these)\s+(?!(?:is|are|means|interval gives|scale uses)\b)\w|\bindicated\b|illustrated here|\bdescribed\b|\bthe given\b|\banswer this question\b/i;
/**
 * Prompts whose "this/these" refers back to something the prompt itself
 * states (no notation needed): "…a major triad. Why does this change in
 * harmonic minor?", "What type of cadence is this?".
 */
const SELF_CONTAINED = /\bwhy does this\b|\bis this\b|\bproduces this\b|\bdoes this (tell|mean)\b|\bthis (melody|chord|interval|scale|progression|phrase|note) (is|has|moves|lasts)\b|that guide tones illustrate|\bkeys that are how far apart\b/i;

describe('questions that point at notation show it (W4-06)', () => {
  it('the detector flags the old wording and passes a statement question', () => {
    expect(POINTING.test('Classify this cadence type based on the chords and voice leading described.')).toBe(true);
    expect(POINTING.test('Answer this question about pedal points.')).toBe(true);
    expect(POINTING.test('Which statement about cadences is true?')).toBe(false);
  });

  it('every multiple-choice prompt that points at something has a staff stimulus (EN)', () => {
    const bad: string[] = [];
    for (const n of LEVELS) {
      for (const { exercise } of levelCorpus(n, 'en')) {
        const c = exercise.config;
        if (c.type !== 'multiple_choice') continue;
        if (POINTING.test(exercise.prompt) && !SELF_CONTAINED.test(exercise.prompt) && !c.stimulus) bad.push(`${exercise.id}: ${exercise.prompt}`);
      }
    }
    expect([...new Set(bad.map((b) => b.replace(/^\S+: /, '')))]).toEqual([]);
  });

  it('a key-signature stimulus agrees with the keyed answer', () => {
    const bad: string[] = [];
    for (const n of LEVELS) {
      for (const { exercise } of levelCorpus(n, 'en')) {
        const c = exercise.config;
        if (c.type !== 'multiple_choice' || !c.stimulus?.keySignature) continue;
        const keyed = c.choices.find((x) => x.correct)!.label;
        if (!new RegExp(`^${c.stimulus.keySignature.replace('#', '\\#')} major\\b`).test(keyed)) bad.push(`${exercise.id}: signature ${c.stimulus.keySignature}, keyed "${keyed}"`);
      }
    }
    expect(bad).toEqual([]);
  });
});

// ── W4-07 ──────────────────────────────────────────────────────────────────
describe('authored questions do not contain their answer (W4-07)', () => {
  const noteNames = (text: string) => new Set([...text.matchAll(/(?<![A-Za-z])([A-G](?:##|bb|#|b)?)(?![A-Za-z#])/g)].map((m) => m[1]));
  const pc = (s: string) => {
    const base: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const acc: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
    return (((base[s[0]] + acc[s.slice(1)]) % 12) + 12) % 12;
  };

  for (const lang of CONTENT_LANGS) {
    it(`${lang}: no build prompt lists every note to select`, () => {
      const leaks: string[] = [];
      for (const n of LEVELS) {
        for (const list of Object.values(authoredFor(n, lang))) {
          for (const ex of list) {
            const c = ex.config;
            let notes: string[] | null = null;
            if (c.type === 'chord_build') notes = buildChord({ natural: c.root as NaturalNote, accidental: c.rootAccidental as Accidental }, c.quality as ChordQuality).notes.map((x) => x.natural + x.accidental);
            if (c.type === 'scale_build') notes = buildScale({ natural: c.root as NaturalNote, accidental: c.rootAccidental as Accidental }, c.scaleType as ScaleType).notes.map((x) => x.natural + x.accidental);
            if (!notes) continue;
            const named = new Set([...noteNames(ex.prompt)].map(pc));
            if (notes.length >= 3 && notes.every((x) => named.has(pc(x)))) leaks.push(`${ex.id}: ${ex.prompt}`);
          }
        }
      }
      expect(leaks).toEqual([]);
    });
  }

  it('no interval prompt states the interval it asks for (EN)', () => {
    const leaks: string[] = [];
    const WORD: Record<string, string> = { '2nd': 'second', '3rd': 'third', '4th': 'fourth', '5th': 'fifth', '6th': 'sixth', '7th': 'seventh', '9th': 'ninth', '10th': 'tenth', '11th': 'eleventh', '13th': 'thirteenth' };
    for (const n of LEVELS) {
      for (const ex of Object.values(authoredFor(n, 'en')).flat()) {
        const c = ex.config;
        if (c.type !== 'interval_id') continue;
        const answer = (c.intervalNumber !== undefined ? spelledIntervalName(c.intervalNumber, c.targetSemitones) : INTERVAL_LABELS[c.targetSemitones]) ?? '';
        const [quality, num] = answer.split(' ');
        const said = num ? new RegExp(`\\b${quality} (${num}|${WORD[num] ?? num})\\b`, 'i') : new RegExp(`\\b${quality}\\b`, 'i');
        if (c.answer !== 'number' && c.answer !== 'step' && said.test(ex.prompt)) leaks.push(`${ex.id}: "${ex.prompt}" names ${answer}`);
      }
    }
    expect(leaks).toEqual([]);
  });
});

// ── W4-09 ──────────────────────────────────────────────────────────────────
type Choice = { label: string; correct: boolean };
function choiceSets(level: number, lang: (typeof CONTENT_LANGS)[number]): { id: string; set: Choice[] }[] {
  const out: { id: string; set: Choice[] }[] = [];
  for (const ex of Object.values(authoredFor(level, lang)).flat()) {
    if (ex.config.type === 'multiple_choice') out.push({ id: ex.id, set: ex.config.choices });
  }
  for (const cfg of templatesFor(level, lang)) {
    cfg.templates.forEach((t, i) => (t.params.choiceSets ?? []).forEach((set, j) => out.push({ id: `${cfg.moduleId}[${i}].set${j}`, set })));
  }
  return out;
}
const len = (s: string) => [...s].length;
const correctIsStrictlyLongest = (set: Choice[]) => {
  const c = set.find((x) => x.correct)!;
  return set.every((x) => x === c || len(x.label) < len(c.label));
};

describe('the correct option is not a length cue (W4-09)', () => {
  it('the measure flags a planted cue and passes a balanced set', () => {
    expect(correctIsStrictlyLongest([{ label: 'A long, careful and complete answer', correct: true }, { label: 'Short', correct: false }])).toBe(true);
    expect(correctIsStrictlyLongest([{ label: 'Right', correct: true }, { label: 'Wrong!', correct: false }])).toBe(false);
  });

  // The fix must not invert the cue: if the longest option were never right,
  // "rule out the longest" would be the new trick. Among sets with a single
  // longest option, it is the correct one at least 10% of the time.
  for (const lang of CONTENT_LANGS) {
    for (const n of LEVELS) {
      it(`${lang} L${n}: the longest option is still sometimes right (≥ 10% of sets with a single longest)`, () => {
        const withLongest = choiceSets(n, lang).filter(({ set }) => {
          const max = Math.max(...set.map((x) => len(x.label)));
          return set.filter((x) => len(x.label) === max).length === 1;
        });
        const right = withLongest.filter(({ set }) => correctIsStrictlyLongest(set));
        expect(right.length / withLongest.length, `${right.length}/${withLongest.length}`).toBeGreaterThanOrEqual(0.1);
      });
    }
  }

  for (const lang of CONTENT_LANGS) {
    for (const n of LEVELS) {
      it(`${lang} L${n}: correct option strictly longest in ≤ 35% of choice sets`, () => {
        const sets = choiceSets(n, lang);
        const cued = sets.filter((s) => correctIsStrictlyLongest(s.set));
        const share = cued.length / sets.length;
        expect(share, `${cued.length}/${sets.length} cued:\n${cued.map((s) => `  ${s.id}`).join('\n')}`).toBeLessThanOrEqual(0.35);
      });
    }
  }
});
