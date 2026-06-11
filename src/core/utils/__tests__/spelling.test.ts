import { describe, it, expect } from 'vitest';
import {
  buildSpellingMap,
  scalePrefersFlats,
  spellSharpDefault,
  SHARP_SPELLING,
  FLAT_SPELLING,
} from '../spelling';
import { buildScale } from '../../constants/scales';
import { buildChord } from '../../constants/chords';
import { midiToNote } from '../pianoLayout';
import { noteToString } from '../../types/music';
import type { Note, ScaleType, ChordQuality } from '../../types/music';

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({
  natural,
  accidental,
});

/** Spell every pitch class through a built map and return ASCII strings. */
function spellAll(chord: Parameters<typeof buildSpellingMap>[0], scale: Parameters<typeof buildSpellingMap>[1]): string[] {
  const map = buildSpellingMap(chord, scale);
  return Array.from({ length: 12 }, (_, pc) => noteToString(map.get(pc)!));
}

const scaleOf = (root: Note, type: ScaleType) => buildScale(root, type);
const chordOf = (root: Note, quality: ChordQuality) => buildChord(root, quality);

describe('spelling: sharp/flat default tables', () => {
  it('SHARP_SPELLING matches the legacy midiToNote letters', () => {
    expect(noteToString(SHARP_SPELLING[0])).toBe('C');
    expect(noteToString(SHARP_SPELLING[1])).toBe('C#');
    expect(noteToString(SHARP_SPELLING[6])).toBe('F#');
    expect(noteToString(SHARP_SPELLING[10])).toBe('A#');
    expect(noteToString(SHARP_SPELLING[11])).toBe('B');
  });

  it('SHARP_SPELLING is byte-for-byte the midiToNote map (regression invariant)', () => {
    // The no-selection fallback MUST reproduce the pre-existing label exactly.
    // midiToNote(60 + pc) yields the C4-octave note for each pitch class.
    for (let pc = 0; pc < 12; pc++) {
      const legacy = midiToNote(60 + pc);
      expect(noteToString(SHARP_SPELLING[pc])).toBe(noteToString(legacy));
    }
  });

  it('FLAT_SPELLING differs from SHARP only on the 5 black pcs', () => {
    for (let pc = 0; pc < 12; pc++) {
      if ([1, 3, 6, 8, 10].includes(pc)) {
        expect(noteToString(FLAT_SPELLING[pc])).not.toBe(noteToString(SHARP_SPELLING[pc]));
        expect(FLAT_SPELLING[pc].accidental).toBe('b');
      } else {
        expect(noteToString(FLAT_SPELLING[pc])).toBe(noteToString(SHARP_SPELLING[pc]));
      }
    }
  });

  it('spellSharpDefault wraps and normalises out-of-range pcs', () => {
    expect(noteToString(spellSharpDefault(6))).toBe('F#');
    expect(noteToString(spellSharpDefault(18))).toBe('F#'); // 18 % 12 = 6
    expect(noteToString(spellSharpDefault(-6))).toBe('F#'); // -6 → 6
  });
});

describe('scalePrefersFlats', () => {
  it('flat keys prefer flats (F, D♭ major)', () => {
    expect(scalePrefersFlats(scaleOf(N('F'), 'major').notes)).toBe(true); // has Bb
    expect(scalePrefersFlats(scaleOf(N('D', 'b'), 'major').notes)).toBe(true); // 5 flats
  });

  it('sharp keys prefer sharps (G, A, C♯ major)', () => {
    expect(scalePrefersFlats(scaleOf(N('G'), 'major').notes)).toBe(false); // has F#
    expect(scalePrefersFlats(scaleOf(N('A'), 'major').notes)).toBe(false); // 3 sharps
    expect(scalePrefersFlats(scaleOf(N('C', '#'), 'major').notes)).toBe(false); // 7 sharps
  });

  it('all-natural scales (C major, A natural minor) default to sharps', () => {
    expect(scalePrefersFlats(scaleOf(N('C'), 'major').notes)).toBe(false);
    expect(scalePrefersFlats(scaleOf(N('A'), 'natural_minor').notes)).toBe(false);
  });
});

describe('buildSpellingMap — no selection → sharp default (regression guard)', () => {
  it('null chord + null scale reproduces the sharp-default map exactly', () => {
    const map = buildSpellingMap(null, null);
    for (let pc = 0; pc < 12; pc++) {
      expect(noteToString(map.get(pc)!)).toBe(noteToString(SHARP_SPELLING[pc]));
    }
  });
});

describe('buildSpellingMap — chord priority (a)', () => {
  it('Cdim7 → C, E♭, G♭, B𝄫 on their pcs (double-flat carried)', () => {
    const map = buildSpellingMap(chordOf(N('C'), 'diminished7'), null);
    expect(noteToString(map.get(0)!)).toBe('C');
    expect(noteToString(map.get(3)!)).toBe('Eb');
    expect(noteToString(map.get(6)!)).toBe('Gb');
    expect(noteToString(map.get(9)!)).toBe('Bbb'); // physical A reads B𝄫
  });

  it('C♭ major chord → pc 11 reads C♭ (not B)', () => {
    const map = buildSpellingMap(chordOf(N('C', 'b'), 'major'), null);
    expect(noteToString(map.get(11)!)).toBe('Cb');
    expect(noteToString(map.get(3)!)).toBe('Eb');
    expect(noteToString(map.get(6)!)).toBe('Gb');
  });
});

describe('buildSpellingMap — scale priority (b)', () => {
  it('C♯ major scale spells E♯ (pc 5) and B♯ (pc 0)', () => {
    const map = buildSpellingMap(null, scaleOf(N('C', '#'), 'major'));
    expect(noteToString(map.get(5)!)).toBe('E#'); // physical F reads E♯
    expect(noteToString(map.get(0)!)).toBe('B#'); // physical C reads B♯
    expect(noteToString(map.get(1)!)).toBe('C#');
    expect(noteToString(map.get(6)!)).toBe('F#');
  });
});

describe('buildSpellingMap — key-signature bias (c) for chromatic pcs', () => {
  it('D♭ major key (no chord) → black pcs read D♭ E♭ G♭ A♭ B♭', () => {
    const labels = spellAll(null, scaleOf(N('D', 'b'), 'major'));
    expect(labels[1]).toBe('Db');
    expect(labels[3]).toBe('Eb');
    expect(labels[6]).toBe('Gb');
    expect(labels[8]).toBe('Ab');
    expect(labels[10]).toBe('Bb');
    // No sharps anywhere
    expect(labels.some((l) => l.includes('#'))).toBe(false);
  });

  it('A major key → C♯ F♯ G♯, and chromatic D♯/A♯ stay sharp (bias)', () => {
    const labels = spellAll(null, scaleOf(N('A'), 'major'));
    expect(labels[1]).toBe('C#'); // in scale
    expect(labels[6]).toBe('F#'); // in scale
    expect(labels[8]).toBe('G#'); // in scale
    expect(labels[3]).toBe('D#'); // chromatic, sharp bias
    expect(labels[10]).toBe('A#'); // chromatic, sharp bias
    expect(labels.some((l) => l.includes('b'))).toBe(false);
  });

  it('F major key → B♭ (in scale) and remaining black pcs read flat (bias)', () => {
    const labels = spellAll(null, scaleOf(N('F'), 'major'));
    expect(labels[10]).toBe('Bb'); // in scale
    expect(labels[1]).toBe('Db'); // chromatic, flat bias
    expect(labels[3]).toBe('Eb');
    expect(labels[6]).toBe('Gb');
    expect(labels[8]).toBe('Ab');
  });

  it('C major key → sharp default (no accidental signal)', () => {
    const labels = spellAll(null, scaleOf(N('C'), 'major'));
    expect(labels[1]).toBe('C#');
    expect(labels[6]).toBe('F#');
    expect(labels[10]).toBe('A#');
  });
});

describe('buildSpellingMap — chord beats scale/key on shared tones (priority)', () => {
  it('chord says G♭ while A-major scale says F♯ → pc 6 reads G♭', () => {
    const map = buildSpellingMap(chordOf(N('G', 'b'), 'major'), scaleOf(N('A'), 'major'));
    expect(noteToString(map.get(6)!)).toBe('Gb'); // chord wins
    // A pc the chord does NOT cover but the scale does keeps the scale spelling:
    expect(noteToString(map.get(8)!)).toBe('G#'); // G# is in A major, not in Gb chord
  });

  it('the map always has all 12 pitch classes', () => {
    const map = buildSpellingMap(chordOf(N('C'), 'diminished7'), scaleOf(N('C'), 'major'));
    expect(map.size).toBe(12);
    for (let pc = 0; pc < 12; pc++) expect(map.has(pc)).toBe(true);
  });
});

describe('buildSpellingMap — bassNote fills only an unclaimed pc', () => {
  it('slash bass adds its pc spelling when not already in the chord body', () => {
    // D minor 7 over G (Dm7/G): bass G is not a chord tone (D F A C), so pc 7
    // should be spelled by the bass note "G".
    const dm7 = chordOf(N('D'), 'minor7');
    const withBass = { ...dm7, bassNote: N('G') };
    const map = buildSpellingMap(withBass, null);
    expect(noteToString(map.get(7)!)).toBe('G');
  });
});
