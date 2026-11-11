/**
 * The bank's explicit `key` / `chord` / `degree` fields (wave 2, "Drill
 * follows the lessons").
 *
 *  1. The bank is otherwise unchanged: every id and rank, in order, equals
 *     the base commit's (`fixtures/drill-bank-ids-ranks-main.json`, recorded
 *     from wave2/base 11f2cc6 before the fields were added).
 *  2. Each field agrees with an INDEPENDENT reading of the item: the key from
 *     the prompt's display text ("F♯ major", "A natural minor") and the
 *     answer, the chord by rebuilding its notes, the degree from the numeral
 *     the item shows. Never from the id the generator built.
 */
import { describe, it, expect } from 'vitest';
import { generateDrillBank } from '../drillBank';
import type { DrillItem } from '../../types/drill';
import { buildChord } from '../../constants/chords';
import { stringToNote, noteToString } from '../../types/music';
import idsRanksMain from './fixtures/drill-bank-ids-ranks-main.json';

const BANK = generateDrillBank({ includeRead: true });

/** "F♯ major" / "B♭ natural minor" / "A minor" → 'F#' / 'bb' / 'a'. */
function keyFromDisplay(display: string): string {
  const [tonicGlyphs, ...mode] = display.split(' ');
  const ascii = tonicGlyphs.replace(/♯/g, '#').replace(/♭/g, 'b');
  const isMajor = mode.join(' ') === 'major';
  return isMajor ? ascii : ascii.charAt(0).toLowerCase() + ascii.slice(1);
}

/** 'I' 'ii' 'iii°' 'vii°' 'VI' → 1..7 */
function degreeFromNumeral(numeral: string): number {
  const bare = numeral.replace(/[°+ø]/g, '').toUpperCase();
  const n = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].indexOf(bare) + 1;
  if (n === 0) throw new Error(`not a numeral: ${numeral}`);
  return n;
}

const p = (item: DrillItem, k: string) => String(item.promptParams[k]);

describe('the bank is unchanged but for the new fields', () => {
  it('ids and ranks, in order, equal the base commit\'s (1,615 items)', () => {
    expect(BANK.map((i) => [i.id, i.rank])).toEqual(idsRanksMain);
    expect(BANK.length).toBe(1615);
  });

  it('the theory-only bank keeps its order too (the first 1,321)', () => {
    const theory = generateDrillBank();
    expect(theory.length).toBe(1321);
    expect(theory.map((i) => i.id)).toEqual(BANK.filter((i) => i.family !== 'read').map((i) => i.id));
  });
});

describe('key, against the prompt and the answer', () => {
  it('scale: the key the prompt names; a spelled scale starts on its tonic', () => {
    const scales = BANK.filter((i) => i.family === 'scale');
    expect(scales.length).toBeGreaterThan(0);
    for (const item of scales) {
      const display = item.promptKey === 'drill.prompts.spellScale' ? p(item, 'scale') : p(item, 'key');
      // "A harmonic minor" is in A minor, like "A natural minor".
      const keyed = display.replace(/ (natural|harmonic|melodic) minor$/, ' minor');
      expect(item.key, item.id).toBe(keyFromDisplay(keyed));
      if (item.answer.kind === 'accidentals') {
        expect(item.answer.spelled[0].toLowerCase()).toBe(item.key!.toLowerCase());
      }
      expect(item.chord).toBeUndefined();
      expect(item.degree).toBeUndefined();
    }
  });

  it('roman: the key the prompt names, the degree of the numeral shown (or answered)', () => {
    const keyed = BANK.filter((i) => i.family === 'roman' && 'key' in i.promptParams);
    expect(keyed.length).toBe(30 * 14 + 20);
    for (const item of keyed) {
      expect(item.key, item.id).toBe(keyFromDisplay(p(item, 'key')));
      const numeral = item.promptKey === 'drill.prompts.degreeToChord'
        ? p(item, 'numeral')
        : item.promptKey === 'drill.prompts.chordToDegree'
          ? (item.answer as { correct: string }).correct
          : String(item.whyParams.numeral);
      expect(item.degree, item.id).toBe(degreeFromNumeral(numeral));
    }
  });

  it('roman: the pattern and harmonic-minor facts name no key and no degree', () => {
    const general = BANK.filter((i) => i.family === 'roman' && !('key' in i.promptParams));
    expect(general.length).toBe(16);
    for (const item of general) {
      expect(item.key).toBeUndefined();
      expect(item.degree).toBeUndefined();
    }
  });

  it('function: chord function in the key named, degree of its numeral; V7-of in its key; cadences none', () => {
    for (const item of BANK.filter((i) => i.family === 'function')) {
      if (item.promptKey === 'drill.prompts.chordFunction') {
        expect(item.key, item.id).toBe(keyFromDisplay(p(item, 'key')));
        const numeral = /\(([^)]+)\)$/.exec(p(item, 'chord'))![1];
        expect(item.degree).toBe(degreeFromNumeral(numeral));
      } else if (item.promptKey === 'drill.prompts.v7Of') {
        expect(item.key).toBe(keyFromDisplay(`${p(item, 'key')} major`));
        expect(item.degree).toBeUndefined();
      } else {
        expect(item.key).toBeUndefined();
        expect(item.degree).toBeUndefined();
      }
    }
  });
});

describe('chord, against the notes', () => {
  it('triad and seventh: rebuilding the chord from the field gives the answer', () => {
    const chords = BANK.filter((i) => i.family === 'triad' || i.family === 'seventh');
    expect(chords.length).toBe(14 * 4 * 2 + 14 * 5 * 2);
    for (const item of chords) {
      const c = item.chord!;
      expect(c, item.id).toBeDefined();
      const notes = buildChord(stringToNote(c.root), c.quality).notes.map(noteToString);
      if (item.answer.kind === 'notes') expect(item.answer.notes).toEqual(notes);
      else if (item.answer.kind === 'rootQuality') {
        expect(item.answer.root).toBe(c.root);
        expect(item.answer.quality).toBe(c.quality);
        // The prompt lists the same notes, in its own order.
        const shown = p(item, 'notes').split(' – ').map((n) => n.replace(/♯/g, '#').replace(/♭/g, 'b').replace(/𝄪/g, '##').replace(/𝄫/g, 'bb'));
        expect([...shown].sort()).toEqual([...notes].sort());
      } else throw new Error(`unexpected answer for ${item.id}`);
      expect(item.key).toBeUndefined();
    }
  });
});

describe('the other families carry none of the fields', () => {
  it('keysig, circle, degree, interval, read', () => {
    for (const item of BANK.filter((i) => ['keysig', 'circle', 'degree', 'interval', 'read'].includes(i.family))) {
      expect(item.key).toBeUndefined();
      expect(item.chord).toBeUndefined();
      expect(item.degree).toBeUndefined();
    }
  });
});
