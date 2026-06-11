import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyContext } from '../useKeyContext';
import { useAppStore } from '../../state/store';
import type { Note, ScaleType } from '../../core/types/music';
import { noteToString } from '../../core/types/music';
import { buildChord } from '../../core/constants/chords';
import { DEGREE_COLORS } from '../../design/tokens/colors';

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({
  natural,
  accidental,
});

function setStoreState(overrides: {
  key?: Note;
  scale?: ScaleType;
  chord?: Parameters<ReturnType<typeof useAppStore.getState>['setSelectedChord']>[0];
  inversion?: number;
  scaleOctaves?: 1 | 2;
  baseOctave?: number;
}) {
  useAppStore.setState({
    selectedKey: overrides.key ?? { natural: 'C', accidental: '' },
    selectedScale: overrides.scale ?? 'major',
    selectedChord: overrides.chord ?? null,
    chordInversion: overrides.inversion ?? 0,
    scaleOctaves: overrides.scaleOctaves ?? 1,
    baseOctave: overrides.baseOctave ?? 4,
  });
}

beforeEach(() => {
  setStoreState({});
});

// ---------------------------------------------------------------------------
// scalePitchClasses
// ---------------------------------------------------------------------------
describe('scalePitchClasses', () => {
  it('C major → {0,2,4,5,7,9,11}', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.scalePitchClasses).toEqual(new Set([0, 2, 4, 5, 7, 9, 11]));
  });

  it('D dorian → correct pitch class set', () => {
    setStoreState({ key: { natural: 'D', accidental: '' }, scale: 'dorian' });
    const { result } = renderHook(() => useKeyContext());
    // D dorian: D=2, E=4, F=5, G=7, A=9, B=11, C=0
    expect(result.current.scalePitchClasses).toEqual(new Set([0, 2, 4, 5, 7, 9, 11]));
  });

  it('G major → includes F# (pitch class 6)', () => {
    setStoreState({ key: { natural: 'G', accidental: '' }, scale: 'major' });
    const { result } = renderHook(() => useKeyContext());
    // G major: G=7, A=9, B=11, C=0, D=2, E=4, F#=6
    expect(result.current.scalePitchClasses.has(6)).toBe(true);
    expect(result.current.scalePitchClasses.has(5)).toBe(false); // F natural is NOT in G major
  });
});

// ---------------------------------------------------------------------------
// scaleMidiNumbers
// ---------------------------------------------------------------------------
describe('scaleMidiNumbers', () => {
  it('C major octave 4 produces MIDI numbers in expected range', () => {
    setStoreState({ baseOctave: 4, scaleOctaves: 1 });
    const { result } = renderHook(() => useKeyContext());
    const midi = result.current.scaleMidiNumbers;
    // C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71
    expect(midi.has(60)).toBe(true);
    expect(midi.has(62)).toBe(true);
    expect(midi.has(64)).toBe(true);
    expect(midi.has(67)).toBe(true);
    expect(midi.has(71)).toBe(true);
  });

  it('2 octaves produces more MIDI numbers than 1', () => {
    setStoreState({ scaleOctaves: 1 });
    const { result: r1 } = renderHook(() => useKeyContext());
    const count1 = r1.current.scaleMidiNumbers.size;

    setStoreState({ scaleOctaves: 2 });
    const { result: r2 } = renderHook(() => useKeyContext());
    expect(r2.current.scaleMidiNumbers.size).toBeGreaterThan(count1);
  });
});

// ---------------------------------------------------------------------------
// getNoteColor
// ---------------------------------------------------------------------------
describe('getNoteColor', () => {
  it('returns tonic color for root note', () => {
    const { result } = renderHook(() => useKeyContext());
    // C is degree 1 in C major
    const color = result.current.getNoteColor({ natural: 'C', accidental: '' });
    expect(color).toBe(DEGREE_COLORS[1]);
  });

  it('returns dominant color for 5th degree', () => {
    const { result } = renderHook(() => useKeyContext());
    // G is degree 5 in C major
    const color = result.current.getNoteColor({ natural: 'G', accidental: '' });
    expect(color).toBe(DEGREE_COLORS[5]);
  });

  it('returns undefined for out-of-scale note', () => {
    const { result } = renderHook(() => useKeyContext());
    // C# is not in C major
    const color = result.current.getNoteColor({ natural: 'C', accidental: '#' });
    expect(color).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// getNoteDegree
// ---------------------------------------------------------------------------
describe('getNoteDegree', () => {
  it('returns 1 for tonic', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.getNoteDegree({ natural: 'C', accidental: '' })).toBe(1);
  });

  it('returns 5 for dominant', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.getNoteDegree({ natural: 'G', accidental: '' })).toBe(5);
  });

  it('returns 7 for leading tone', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.getNoteDegree({ natural: 'B', accidental: '' })).toBe(7);
  });

  it('returns undefined for chromatic note', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.getNoteDegree({ natural: 'F', accidental: '#' })).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// diatonicChords
// ---------------------------------------------------------------------------
describe('diatonicChords', () => {
  it('C major yields 7 diatonic chords', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.diatonicChords).toHaveLength(7);
  });

  it('C major chord roots are C, D, E, F, G, A, B', () => {
    const { result } = renderHook(() => useKeyContext());
    const roots = result.current.diatonicChords.map(dc => dc.chord.root.natural);
    expect(roots).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  });

  it('C major chord qualities follow major pattern', () => {
    const { result } = renderHook(() => useKeyContext());
    const qualities = result.current.diatonicChords.map(dc => dc.chord.quality);
    // I=major, ii=minor, iii=minor, IV=major, V=major, vi=minor, vii°=diminished
    expect(qualities).toEqual(['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished']);
  });

  it('degrees are numbered 1–7', () => {
    const { result } = renderHook(() => useKeyContext());
    const degrees = result.current.diatonicChords.map(dc => dc.degree);
    expect(degrees).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('pentatonic scale returns empty chords', () => {
    setStoreState({ scale: 'pentatonic_major' });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.diatonicChords).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// chordVoicingMidi
// ---------------------------------------------------------------------------
describe('chordVoicingMidi', () => {
  it('is empty when no chord selected', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.chordVoicingMidi.size).toBe(0);
  });

  it('has notes when chord is selected', () => {
    const cMajor = {
      root: { natural: 'C' as const, accidental: '' as const },
      quality: 'major' as const,
      notes: [
        { natural: 'C' as const, accidental: '' as const },
        { natural: 'E' as const, accidental: '' as const },
        { natural: 'G' as const, accidental: '' as const },
      ],
    };
    setStoreState({ chord: cMajor });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.chordVoicingMidi.size).toBeGreaterThan(0);
    expect(result.current.hasSelectedChord).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// invertedNotes
// ---------------------------------------------------------------------------
describe('invertedNotes', () => {
  const cMajor = {
    root: { natural: 'C' as const, accidental: '' as const },
    quality: 'major' as const,
    notes: [
      { natural: 'C' as const, accidental: '' as const },
      { natural: 'E' as const, accidental: '' as const },
      { natural: 'G' as const, accidental: '' as const },
    ],
  };

  it('root position returns notes in original order', () => {
    setStoreState({ chord: cMajor, inversion: 0 });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.invertedNotes.map(n => n.natural)).toEqual(['C', 'E', 'G']);
  });

  it('first inversion rotates correctly', () => {
    setStoreState({ chord: cMajor, inversion: 1 });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.invertedNotes.map(n => n.natural)).toEqual(['E', 'G', 'C']);
  });

  it('second inversion rotates correctly', () => {
    setStoreState({ chord: cMajor, inversion: 2 });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.invertedNotes.map(n => n.natural)).toEqual(['G', 'C', 'E']);
  });

  it('empty when no chord selected', () => {
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.invertedNotes).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Different key/scale combinations
// ---------------------------------------------------------------------------
describe('key/scale changes', () => {
  it('A minor has correct pitch classes', () => {
    setStoreState({ key: { natural: 'A', accidental: '' }, scale: 'natural_minor' });
    const { result } = renderHook(() => useKeyContext());
    // A natural minor: A=9, B=11, C=0, D=2, E=4, F=5, G=7
    expect(result.current.scalePitchClasses).toEqual(new Set([0, 2, 4, 5, 7, 9, 11]));
  });

  it('F# major includes sharps', () => {
    setStoreState({ key: { natural: 'F', accidental: '#' }, scale: 'major' });
    const { result } = renderHook(() => useKeyContext());
    // F#=6 is the tonic
    expect(result.current.scalePitchClasses.has(6)).toBe(true);
    expect(result.current.getNoteDegree({ natural: 'F', accidental: '#' })).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// spellPitchClass — context-aware enharmonic labels (chord > scale > key bias >
// sharp default). Display-label correctness only; positions/colours unaffected.
// ---------------------------------------------------------------------------
describe('spellPitchClass', () => {
  const label = (
    result: { current: ReturnType<typeof useKeyContext> },
    pc: number,
  ) => noteToString(result.current.spellPitchClass(pc));

  it('no selection (C major default) → sharp default', () => {
    setStoreState({});
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 1)).toBe('C#');
    expect(label(result, 6)).toBe('F#');
    expect(label(result, 10)).toBe('A#');
  });

  it('Cdim7 chord → pc 9 reads B𝄫 (Bbb), pc 6 reads G♭', () => {
    setStoreState({ chord: buildChord(N('C'), 'diminished7') });
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 0)).toBe('C');
    expect(label(result, 3)).toBe('Eb');
    expect(label(result, 6)).toBe('Gb');
    expect(label(result, 9)).toBe('Bbb');
  });

  it('C♭ major chord → pc 11 reads C♭ (not B)', () => {
    setStoreState({ chord: buildChord(N('C', 'b'), 'major') });
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 11)).toBe('Cb');
  });

  it('C♯ major scale (key only) → pc 5 reads E♯, pc 0 reads B♯', () => {
    setStoreState({ key: N('C', '#'), scale: 'major' });
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 5)).toBe('E#');
    expect(label(result, 0)).toBe('B#');
  });

  it('D♭ major key (no chord) → black pcs all flats', () => {
    setStoreState({ key: N('D', 'b'), scale: 'major' });
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 1)).toBe('Db');
    expect(label(result, 3)).toBe('Eb');
    expect(label(result, 6)).toBe('Gb');
    expect(label(result, 8)).toBe('Ab');
    expect(label(result, 10)).toBe('Bb');
  });

  it('A major key → C♯ F♯ G♯; chromatic D♯/A♯ stay sharp', () => {
    setStoreState({ key: N('A'), scale: 'major' });
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 1)).toBe('C#');
    expect(label(result, 6)).toBe('F#');
    expect(label(result, 8)).toBe('G#');
    expect(label(result, 3)).toBe('D#');
    expect(label(result, 10)).toBe('A#');
  });

  it('chord beats scale/key: G♭ chord in A-major key → pc 6 reads G♭', () => {
    setStoreState({ key: N('A'), scale: 'major', chord: buildChord(N('G', 'b'), 'major') });
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 6)).toBe('Gb'); // chord wins over scale's F#
  });

  it('exercise-input mode falls back to sharp default (no key leak)', () => {
    setStoreState({ key: N('D', 'b'), scale: 'major' });
    useAppStore.setState({ exerciseInputActive: true, highlightedNotes: [] });
    const { result } = renderHook(() => useKeyContext());
    // Even though the key is D♭ major, exercise input shows the sharp default.
    expect(label(result, 6)).toBe('F#');
    expect(label(result, 1)).toBe('C#');
    useAppStore.setState({ exerciseInputActive: false });
  });

  it('normalises out-of-range pitch-class inputs', () => {
    setStoreState({});
    const { result } = renderHook(() => useKeyContext());
    expect(label(result, 18)).toBe('F#'); // 18 % 12 = 6
    expect(label(result, -6)).toBe('F#');
  });
});

// ---------------------------------------------------------------------------
// Exercise instrument-input mode (WS6) — Explore visuals must not leak into
// exercises, and the learner's toggled notes surface via the chord channel.
// ---------------------------------------------------------------------------
describe('exercise input mode', () => {
  it('suppresses scale/degree visuals and surfaces toggled notes on all octaves', () => {
    setStoreState({});
    useAppStore.setState({
      exerciseInputActive: true,
      highlightedNotes: [
        { natural: 'D', accidental: '', octave: 4 },
        { natural: 'F', accidental: '#', octave: 4 },
      ],
    });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.scaleMidiNumbers.size).toBe(0);
    expect(result.current.scalePitchClasses.size).toBe(0);
    expect(result.current.getNoteColor({ natural: 'C', accidental: '' })).toBeUndefined();
    expect(result.current.chordPitchClasses).toEqual(new Set([2, 6]));
    expect(result.current.chordVoicingMidi.has(62)).toBe(true); // D4
    expect(result.current.chordVoicingMidi.has(74)).toBe(true); // D5 — every octave
    expect(result.current.hasSelectedChord).toBe(true);
    useAppStore.setState({ exerciseInputActive: false, highlightedNotes: [] });
  });

  it('with nothing toggled, shows a neutral instrument (no dimming)', () => {
    setStoreState({});
    useAppStore.setState({ exerciseInputActive: true, highlightedNotes: [] });
    const { result } = renderHook(() => useKeyContext());
    expect(result.current.hasSelectedChord).toBe(false);
    expect(result.current.chordVoicingMidi.size).toBe(0);
    useAppStore.setState({ exerciseInputActive: false });
  });
});
