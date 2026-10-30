import { describe, it, expect } from 'vitest';
import { CHORD_SCALE_MAP } from '../chordScaleRelationships';
import { CHORD_FORMULAS } from '../chords';
import { SCALE_FORMULAS } from '../scales';
import type { ChordQuality, ScaleType } from '../../types/music';

// ---------------------------------------------------------------------------
// Chord–scale map integrity (audit W2-05 / C-14 / C-53, decision D-14).
//
// The Explore "Compatible Scales" chips must not contradict their own chord.
// Rule: every PRIMARY or SECONDARY suggestion contains every chord tone, with
// two narrow, documented exceptions:
//   1. Pentatonic (≤ 5-note) subset scales may leave a chord tone out, as long
//      as none of their extra notes sits a half step from a chord tone — they
//      thin the chord, they never contradict it.
//   2. Blues idioms, where the scale's b3 against the chord's major 3rd IS the
//      sound (listed explicitly below).
// COLOR suggestions may drop or alter chord tones; their context text must say
// so (checked for the specific entries this audit corrected).
// ---------------------------------------------------------------------------

const IDIOMATIC_EXCEPTIONS = new Set(['dominant7:blues', 'dominant7sharp9:blues']);

const pcs = (semis: number[]) => new Set(semis.map((s) => ((s % 12) + 12) % 12));
const chordPcs = (q: ChordQuality) => pcs(CHORD_FORMULAS[q]);
const scalePcs = (s: ScaleType) => pcs(SCALE_FORMULAS[s]);

function clashes(chord: Set<number>, scale: Set<number>): number[] {
  // Scale notes that are not chord tones but lie one semitone from a chord tone.
  return [...scale].filter(
    (pc) => !chord.has(pc) && (chord.has((pc + 1) % 12) || chord.has((pc + 11) % 12)),
  );
}

describe('CHORD_SCALE_MAP — suggestions agree with their chord', () => {
  const entries = Object.entries(CHORD_SCALE_MAP) as [ChordQuality, (typeof CHORD_SCALE_MAP)[ChordQuality]][];

  it('covers a non-trivial number of suggestions (guards against an empty map)', () => {
    expect(entries.length).toBeGreaterThan(40);
    expect(entries.flatMap(([, s]) => s).length).toBeGreaterThan(90);
  });

  for (const [quality, suggestions] of entries) {
    for (const s of suggestions) {
      if (s.fit === 'color') continue;
      const key = `${quality}:${s.scale}`;
      it(`${key} (${s.fit}) contains every chord tone`, () => {
        if (IDIOMATIC_EXCEPTIONS.has(key)) return;
        const chord = chordPcs(quality);
        const scale = scalePcs(s.scale);
        const missing = [...chord].filter((pc) => !scale.has(pc));
        if (missing.length === 0) return;
        // Exception 1: a pentatonic subset that never clashes with the chord.
        expect(scale.size, `${key} misses chord tones ${missing} and is not a pentatonic subset`).toBeLessThanOrEqual(5);
        expect(clashes(chord, scale), `${key} pentatonic clashes with a chord tone`).toEqual([]);
      });
    }
  }

  it('the idiomatic-exception list only names entries that exist', () => {
    for (const key of IDIOMATIC_EXCEPTIONS) {
      const [q, scale] = key.split(':');
      expect(CHORD_SCALE_MAP[q as ChordQuality].some((s) => s.scale === scale)).toBe(true);
    }
  });
});

describe('CHORD_SCALE_MAP — rankings decided in D-14', () => {
  const primary = (q: ChordQuality) => CHORD_SCALE_MAP[q].filter((s) => s.fit === 'primary').map((s) => s.scale);

  it('maj11 and add11 list Major first; Lydian (which lacks the natural 11) is only a colour', () => {
    // Cmaj11 = C G B D F and Cadd11 = C E G F: both contain F; C Lydian has F#, not F.
    expect(chordPcs('major11').has(5)).toBe(true);
    expect(chordPcs('add11').has(5)).toBe(true);
    expect(scalePcs('lydian').has(5)).toBe(false);
    for (const q of ['major11', 'add11'] as const) {
      expect(CHORD_SCALE_MAP[q][0].scale).toBe('major');
      expect(primary(q)).toEqual(['major']);
      expect(CHORD_SCALE_MAP[q].find((s) => s.scale === 'lydian')?.fit).toBe('color');
    }
  });

  it('7#9 lists half-whole diminished first, blues second, altered as the 7alt colour', () => {
    // C7#9 = C E G Bb D#: the half-whole scale (C Db Eb E F# G A Bb) holds all five;
    // the altered scale (C Db Eb E Gb Ab Bb) has no perfect 5th.
    const order = CHORD_SCALE_MAP.dominant7sharp9.map((s) => `${s.scale}:${s.fit}`);
    expect(order).toEqual(['diminished_half_whole:primary', 'blues:secondary', 'altered:color']);
    expect(scalePcs('altered').has(7)).toBe(false);
  });

  it('sus chords no longer suggest major pentatonic (it has the 3rd and lacks the 4th)', () => {
    for (const q of ['sus4', 'sus2sus4'] as const) {
      expect(CHORD_SCALE_MAP[q].some((s) => s.scale === 'pentatonic_major')).toBe(false);
      for (const s of CHORD_SCALE_MAP[q]) expect(s.context ?? '').not.toMatch(/no clash with 3rd/i);
    }
  });

  it('no suggestion keeps the prose the audit found false', () => {
    const all = Object.values(CHORD_SCALE_MAP).flat().map((s) => s.context ?? '');
    expect(all.some((c) => /Every note is aug chord tone/i.test(c))).toBe(false);
    expect(all.some((c) => /THE Hendrix chord scale/i.test(c))).toBe(false);
    expect(all.some((c) => /#11 matches the lydian 4th/i.test(c))).toBe(false);
  });
});
