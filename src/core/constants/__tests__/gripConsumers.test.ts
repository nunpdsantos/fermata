/**
 * What the grip work of music audit 2 changes OUTSIDE the Explore board's
 * chips (the review of builder K, item 6), pinned against the recording in
 * fixtures/grip-consumers.json (12 roots × every quality, with no bass and
 * each of 12 slash basses):
 *  - the Progression panel's capo ideas ask `hasOpenGrip`: it may say yes
 *    where it said no at 153caab (the board now finds an open grip with the
 *    bass), never the other way; each new yes is a real open-position grip;
 *  - `getChordShapesWithFallback`'s first grip (the practice studies'
 *    `placeChord` reads it) changes only where the chord names a tone the old
 *    first grip may have lacked, and the new one sounds every named tone;
 *  - the practice sheet's right-hand studies (major, minor and dominant
 *    seventh grips) are byte for byte those of 153caab.
 */
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { buildChord, CHORD_FORMULAS } from '../chords';
import { chordShapesForCapo, getChordShapesWithFallback, gripLeavesOut, isPlayableChordShape, sortShapesForDefault } from '../guitarChordShapes';
import { hasOpenGrip } from '../../utils/progression/capo';
import { rightHandStudy, RIGHT_HAND_PATTERNS } from '../../utils/rightHandPatterns';
import type { ChordQuality, Note } from '../../types/music';
import recorded from './fixtures/grip-consumers.json';

const R12 = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
const OPEN = [40, 45, 50, 55, 59, 64];
const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (n: Note) => (LETTER[n.natural] + [...n.accidental].reduce((a, c) => a + (c === '#' ? 1 : -1), 0) + 24) % 12;
type Placed = { shape: { strings: { fret: number | null; finger?: unknown }[]; type: string }; baseFret: number };
const grip = (e: Placed | undefined) =>
  e ? `${e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-')} ${e.shape.strings.map((p) => (p.fret === null ? 'x' : String(p.finger))).join(' ')}` : '(none)';
const request = (key: string) => {
  const [root, quality, bass] = key.split('|');
  const chord = buildChord(N(root), quality as ChordQuality);
  return bass ? { ...chord, bassNote: N(bass) } : chord;
};

describe('the Progression panel\'s capo ideas (hasOpenGrip)', () => {
  const now: string[] = [];
  for (const root of R12) for (const quality of Object.keys(CHORD_FORMULAS)) for (const bass of ['', ...R12]) {
    const key = `${root}|${quality}|${bass}`;
    if (hasOpenGrip(request(key))) now.push(key);
  }

  it('says yes exactly where the recording says, of 7,956 chords and slash chords (338; 224 at 153caab)', () => {
    expect(now).toEqual(recorded.open.now);
    expect(recorded.open.now).toHaveLength(338);
  });

  it('says no where it said yes at 153caab only for these six, each for the board\'s own reason', () => {
    // The panel reads the board's own list for a slash chord, and counts a
    // library open shape there. Since the second review of builder K:
    //  - D maj7/E, Dm7/E, D7/E: their open grip 0 x 0 2 … leaves the A muted
    //    between two open strings, which no finger can damp (item 3);
    //  - Dm7/G 3 x 0 2 1 1 is 3 0 0 2 1 1 with a string muted, Esus4/A
    //    x x x 2 0 0 and Em6/G x x x 0 2 0 are three strings: each now after
    //    the fuller grips, past the board's eight (item 4 and the ruling).
    expect(recorded.open.atBase.filter((k) => !now.includes(k))).toEqual(['D|major7|E', 'D|minor7|E', 'D|minor7|G', 'D|dominant7|E', 'E|minor6|G', 'E|sus4|A']);
    expect(recorded.open.atBase).toHaveLength(224);
  });

  it('each new yes is an open-position grip the board offers: the strings at the nut, nothing past fret 5, the bass lowest, only the chord\'s tones', () => {
    const wrong: string[] = [];
    for (const key of now.filter((k) => !recorded.open.atBase.includes(k))) {
      const chord = request(key);
      const bassPc = chord.bassNote ? pcOf(chord.bassNote) : pcOf(chord.root);
      const allowed = new Set([...chord.notes.map(pcOf), bassPc]);
      const ok = chordShapesForCapo(chord, 0, 0).shapes.some((e) => {
        const frets = e.shape.strings.map((p) => (p.fret === null ? null : e.baseFret + p.fret));
        const midis = frets.flatMap((f, s) => (f === null ? [] : [OPEN[s] + f]));
        return e.shape.type === 'open' && e.baseFret === 0 && isPlayableChordShape(e) && frets.every((f) => f === null || f <= 5) &&
          Math.min(...midis) % 12 === bassPc && midis.every((m) => allowed.has(m % 12));
      });
      if (!ok) wrong.push(key);
    }
    expect(wrong).toEqual([]);
  });
});

describe('getChordShapesWithFallback\'s first grip (what the practice studies read)', () => {
  it('is the recorded one for every root and quality; where it changed since 153caab, the new one sounds every tone the name carries', () => {
    const got: Record<string, string> = {};
    const incomplete: string[] = [];
    for (const root of R12) for (const quality of Object.keys(CHORD_FORMULAS)) {
      const chord = buildChord(N(root), quality as ChordQuality);
      const first = sortShapesForDefault(getChordShapesWithFallback(chord))[0];
      got[`${root}|${quality}`] = grip(first);
      if (got[`${root}|${quality}`] !== (recorded.first.atBase as Record<string, string>)[`${root}|${quality}`] && gripLeavesOut(first, chord).length > 0) incomplete.push(`${root}|${quality}`);
    }
    expect(got).toEqual(recorded.first.now);
    const changed = Object.keys(got).filter((k) => got[k] !== (recorded.first.atBase as Record<string, string>)[k]);
    expect(changed).toHaveLength(22);
    expect(changed.every((k) => /\|(major11|minor11|dominant9|dominant9sharp11|major9sharp11)$/.test(k))).toBe(true);
    expect(incomplete).toEqual([]);
  });
});

describe('the practice sheet\'s right-hand studies', () => {
  it('every study (key × major / minor × pattern) is byte for byte the one of 153caab', () => {
    const KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'G#', 'D#', 'A#'];
    const differ: string[] = [];
    let n = 0;
    for (const key of KEYS) for (const mode of ['major', 'minor'] as const) for (const p of RIGHT_HAND_PATTERNS) {
      const id = `${key}|${mode}|${p.id}`;
      const want = (recorded.studies as Record<string, string>)[id];
      expect(want, id).toBeDefined();
      n++;
      const hash = createHash('sha256').update(JSON.stringify(rightHandStudy(N(key), mode, p.id))).digest('hex').slice(0, 16);
      if (hash !== want) differ.push(id);
    }
    expect(n).toBe(Object.keys(recorded.studies).length);
    expect(differ).toEqual([]);
  });
});
