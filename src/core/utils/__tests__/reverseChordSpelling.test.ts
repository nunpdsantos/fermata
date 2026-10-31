/**
 * Audit W1-19 (D-21) — naming a chord from typed notes must not respell them.
 *
 * Symmetric chords (augmented, diminished 7th) have several equally good
 * names; ties are broken in favour of the name whose spelling matches the
 * written notes. Pre-fix, "E G# C" was named E augmented [E G# B#] (94 of 745
 * inputs were respelled). Inputs are spelled by the independent oracle.
 */
import { describe, it, expect } from 'vitest';
import type { Note } from '../../types/music';
import { identifyChordFromNotes } from '../reverseChordParser';
import { spellDegree, pcOf, LETTERS } from './theoryOracle';

const QUALITY_DEGREES: Record<string, string[]> = {
  major: ['1', '3', '5'],
  minor: ['1', 'b3', '5'],
  diminished: ['1', 'b3', 'b5'],
  augmented: ['1', '3', '#5'],
  major7: ['1', '3', '5', '7'],
  dominant7: ['1', '3', '5', 'b7'],
  minor7: ['1', 'b3', '5', 'b7'],
  half_diminished7: ['1', 'b3', 'b5', 'b7'],
  diminished7: ['1', 'b3', 'b5', 'bb7'],
  minor_major7: ['1', 'b3', '5', '7'],
};

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const str = (n: Note) => `${n.natural}${n.accidental}`;

describe('W1-19 — notes to name keeps the written spelling', () => {
  it('names every inversion of 210 oracle-spelled chords without respelling them', () => {
    const respelled: string[] = [];
    const wrongPitches: string[] = [];
    let cases = 0;
    for (const L of LETTERS) {
      for (const a of ['', '#', 'b']) {
        const root = L + a;
        for (const [quality, degrees] of Object.entries(QUALITY_DEGREES)) {
          const tones = degrees.map((d) => spellDegree(root, d));
          if (tones.some((t) => t === null)) continue;
          for (let inv = 0; inv < tones.length; inv++) {
            const input = [...tones.slice(inv), ...tones.slice(0, inv)] as string[];
            cases++;
            const top = identifyChordFromNotes(input.map(toNote)).results[0];
            const label = `${input.join(' ')} (${root} ${quality}, inv ${inv})`;
            const topPcs = [...new Set(top.chord.notes.map((n) => pcOf(str(n))))].sort().join();
            const inPcs = [...new Set(input.map(pcOf))].sort().join();
            if (topPcs !== inPcs) { wrongPitches.push(label); continue; }
            const sameSpelling = top.chord.notes.map(str).sort().join() === [...input].sort().join();
            if (!sameSpelling) respelled.push(`${label} -> ${str(top.chord.root)} ${top.chord.quality} [${top.chord.notes.map(str).join(' ')}]`);
          }
        }
      }
    }
    expect(cases).toBeGreaterThan(700);
    expect(wrongPitches).toEqual([]);
    expect(respelled).toEqual([]);
  }, 60_000);

  it('E G# C is C augmented, Eb Gb Bbb C is C diminished 7th', () => {
    const name = (ns: string[]) => {
      const top = identifyChordFromNotes(ns.map(toNote)).results[0];
      return `${str(top.chord.root)} ${top.chord.quality}`;
    };
    expect(name(['E', 'G#', 'C'])).toBe('C augmented');
    expect(name(['Eb', 'Gb', 'Bbb', 'C'])).toBe('C diminished7');
    // unchanged where only one name matches the spelling
    expect(name(['C', 'E', 'G'])).toBe('C major');
  });
});
