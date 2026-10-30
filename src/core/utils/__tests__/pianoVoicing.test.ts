/**
 * Audit W2-07 (A-27) — low-octave piano chords keep their bass note lowest.
 * Pre-fix, the open voicing put the 5th at the root's octave even when it is
 * lower than the root (F major at octave 1 lit C1 F1 A2: C in the bass).
 * Every quality x 12 roots x octaves 0–3 x every inversion is checked.
 */
import { describe, it, expect } from 'vitest';
import type { ChordQuality, Note } from '../../types/music';
import { buildChord, CHORD_FORMULAS } from '../../constants/chords';
import { getVoicedChordNotes, getMidiNumber, octaveFitsKeyboard } from '../pianoLayout';
import { buildScale } from '../../constants/scales';

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const pc = (n: Note) => getMidiNumber(n, 0) % 12;

describe('W2-07 — voiced chords keep the bass lowest and ascend', () => {
  it('every quality x root x octave 0–4 x inversion', () => {
    const bad: string[] = [];
    for (const q of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
      for (const r of ROOTS) {
        const notes = buildChord(toNote(r), q).notes;
        for (let inv = 0; inv < notes.length; inv++) {
          const ordered = [...notes.slice(inv), ...notes.slice(0, inv)];
          for (let oct = 0; oct <= 4; oct++) {
            const voiced = getVoicedChordNotes(ordered, oct);
            const midi = voiced.map((n) => getMidiNumber(n, n.octave));
            const tag = `${r}${q} inv${inv} @${oct}`;
            if (pc(voiced[0]) !== pc(ordered[0])) bad.push(`${tag}: bass ${voiced[0].natural}${voiced[0].accidental}`);
            if (midi.some((m, i) => i > 0 && m <= midi[i - 1])) bad.push(`${tag}: not ascending ${midi.join(',')}`);
            if (voiced.map(pc).sort().join() !== ordered.map(pc).sort().join()) bad.push(`${tag}: notes changed`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('F major at octave 1 is F1 C2 A2 (root in the bass, open)', () => {
    const v = getVoicedChordNotes(buildChord(toNote('F'), 'major').notes, 1);
    expect(v.map((n) => `${n.natural}${n.accidental}${n.octave}`)).toEqual(['F1', 'C2', 'A2']);
  });

  it('C major at octave 3 keeps the documented open voicing C3 G3 E4', () => {
    const v = getVoicedChordNotes(buildChord(toNote('C'), 'major').notes, 3);
    expect(v.map((n) => `${n.natural}${n.octave}`)).toEqual(['C3', 'G3', 'E4']);
  });
});

describe('W2-07 — which octaves keep a scale on the 88 keys', () => {
  it('G major does not fit from C8; C major does not fit from C0; both fit from C4', () => {
    expect(octaveFitsKeyboard(buildScale(toNote('G'), 'major').notes, 8)).toBe(false);
    expect(octaveFitsKeyboard(buildScale(toNote('C'), 'major').notes, 0)).toBe(false);
    expect(octaveFitsKeyboard(buildScale(toNote('B'), 'major').notes, 7)).toBe(false);
    expect(octaveFitsKeyboard(buildScale(toNote('B'), 'major').notes, 6)).toBe(true);
    expect(octaveFitsKeyboard(buildScale(toNote('A'), 'major').notes, 0)).toBe(true);
    expect(octaveFitsKeyboard(buildScale(toNote('C'), 'major').notes, 4)).toBe(true);
  });
});
