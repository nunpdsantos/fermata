/**
 * Chord-spelling chips must test the quality (audit W7-03, D-8).
 *
 * Ported from the auditors' chip-coverage probe: the wrong-note chips were
 * mostly letter variants of the ROOT, so in 52 of 56 triads the 3rd had no
 * same-letter alternative (C major offered E but no E♭) and no seventh chord
 * offered the half-step 7th (C maj7 offered B but no B♭) — the item reduced
 * to picking letters. Each non-root tone must now come with its same-letter
 * neighbours a half step either side (3rd ±1, 5th ±1, 7th ±1), where such a
 * spelling exists (♭♭ … 𝄪).
 */
import { describe, expect, it } from 'vitest';
import { generateDrillBank } from '../drillBank';
import type { Accidental, Note } from '../../types/music';
import { stringToNote } from '../../types/music';

const ACC_ORDER: Accidental[] = ['bb', 'b', '', '#', '##'];
const GLYPH: Record<Accidental, string> = { bb: '𝄫', b: '♭', '': '', '#': '♯', '##': '𝄪' };
const display = (n: Note) => `${n.natural}${GLYPH[n.accidental]}`;

/** Same letter, one half step lower / higher (null past 𝄫 / 𝄪). */
function neighbours(n: Note): string[] {
  const i = ACC_ORDER.indexOf(n.accidental);
  return [ACC_ORDER[i - 1], ACC_ORDER[i + 1]]
    .filter((a): a is Accidental => a !== undefined)
    .map((a) => display({ natural: n.natural, accidental: a }));
}

const ITEMS = generateDrillBank().filter((i) => i.input.format === 'noteChips');

describe('chord-spelling chips carry the quality-defining near misses (W7-03)', () => {
  it('covers all 126 chord-spelling items', () => {
    expect(ITEMS).toHaveLength(126);
  });

  it('every 3rd, 5th and 7th has its ±1 same-letter neighbours among the chips', () => {
    const missing: string[] = [];
    for (const item of ITEMS) {
      if (item.input.format !== 'noteChips' || item.answer.kind !== 'notes') continue;
      const chips = new Set(item.input.chips);
      const tones = item.answer.notes.map(stringToNote);
      tones.slice(1).forEach((tone, k) => {
        for (const n of neighbours(tone)) {
          if (!chips.has(n)) missing.push(`${item.id}: ${['3rd', '5th', '7th'][k]} ${display(tone)} lacks ${n}`);
        }
      });
    }
    expect(missing.slice(0, 10)).toEqual([]);
  });

  it('known cases: C major offers E♭; C maj7 offers B♭; C7 offers B', () => {
    const chips = (id: string) => {
      const it = ITEMS.find((i) => i.id === id)!;
      return it.input.format === 'noteChips' ? it.input.chips : [];
    };
    expect(chips('triad:name-to-notes:C:major')).toContain('E♭');
    expect(chips('seventh:name-to-notes:C:major7')).toContain('B♭');
    expect(chips('seventh:name-to-notes:C:dominant7')).toContain('B');
  });

  it('chip sets keep their size, stay unique and still contain the answer', () => {
    for (const item of ITEMS) {
      if (item.input.format !== 'noteChips' || item.answer.kind !== 'notes') continue;
      const { chips, expectedCount } = item.input;
      expect(chips, item.id).toHaveLength(12);
      expect(new Set(chips).size, item.id).toBe(chips.length);
      for (const n of item.answer.notes) expect(chips, item.id).toContain(display(stringToNote(n)));
      expect(expectedCount).toBe(item.answer.notes.length);
    }
  });
});
