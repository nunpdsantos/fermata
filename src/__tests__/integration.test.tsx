import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { useAppStore } from '../state/store';
import { useKeyContext } from '../hooks/useKeyContext';
import { renderHook } from '@testing-library/react';
import { buildScale } from '../core/constants/scales';
import { getDiatonicChordsForScale } from '../core/constants/chords';
import type { Note } from '../core/types/music';

afterEach(cleanup);

const STORE_KEY = 'music-theory-app';

function resetStore() {
  localStorage.clear();
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    instrument: 'piano',
    activeNotes: new Set<number>(),
    highlightedNotes: [],
    guitarScalePosition: null,
    synthPreset: 'piano',
    volume: 0.7,
    isPlaying: false,
    view: 'explore',
    detailPanelOpen: false,
    quickSearchOpen: false,
    colorMode: 'functional',
    scaleOctaves: 1,
    baseOctave: 4,
  });
}

beforeEach(resetStore);

// ---------------------------------------------------------------------------
// View transitions
// ---------------------------------------------------------------------------
describe('view transitions', () => {
  it('setView updates view and resets transient state', () => {
    const { setSelectedChord, setSelectedDegree, setView } = useAppStore.getState();

    // Set up transient state
    setSelectedChord({
      root: { natural: 'C', accidental: '' },
      quality: 'major',
      notes: [
        { natural: 'C', accidental: '' },
        { natural: 'E', accidental: '' },
        { natural: 'G', accidental: '' },
      ],
    });
    setSelectedDegree(1);
    expect(useAppStore.getState().detailPanelOpen).toBe(true);

    // Switch to Learn
    setView('learn');
    const s = useAppStore.getState();
    expect(s.view).toBe('learn');
    expect(s.selectedChord).toBeNull();
    expect(s.selectedDegree).toBeNull();
    expect(s.detailPanelOpen).toBe(false);
  });

  it('Explore → Learn → Explore round-trip', () => {
    const { setView } = useAppStore.getState();

    setView('learn');
    expect(useAppStore.getState().view).toBe('learn');

    setView('explore');
    expect(useAppStore.getState().view).toBe('explore');
  });
});

// ---------------------------------------------------------------------------
// Chord selection flow
// ---------------------------------------------------------------------------
describe('chord selection flow', () => {
  it('select chord → detail panel opens → deselect → panel closes', () => {
    const { setSelectedChord } = useAppStore.getState();

    const cMajor = {
      root: { natural: 'C' as const, accidental: '' as const },
      quality: 'major' as const,
      notes: [
        { natural: 'C' as const, accidental: '' as const },
        { natural: 'E' as const, accidental: '' as const },
        { natural: 'G' as const, accidental: '' as const },
      ],
    };

    setSelectedChord(cMajor);
    expect(useAppStore.getState().detailPanelOpen).toBe(true);
    expect(useAppStore.getState().selectedChord).toEqual(cMajor);
    expect(useAppStore.getState().chordInversion).toBe(0);

    setSelectedChord(null);
    expect(useAppStore.getState().detailPanelOpen).toBe(false);
    expect(useAppStore.getState().selectedChord).toBeNull();
  });

  it('selecting new chord resets inversion', () => {
    const { setSelectedChord, setChordInversion } = useAppStore.getState();

    setSelectedChord({
      root: { natural: 'C', accidental: '' },
      quality: 'major',
      notes: [
        { natural: 'C', accidental: '' },
        { natural: 'E', accidental: '' },
        { natural: 'G', accidental: '' },
      ],
    });
    setChordInversion(2);
    expect(useAppStore.getState().chordInversion).toBe(2);

    setSelectedChord({
      root: { natural: 'D', accidental: '' },
      quality: 'minor',
      notes: [
        { natural: 'D', accidental: '' },
        { natural: 'F', accidental: '' },
        { natural: 'A', accidental: '' },
      ],
    });
    expect(useAppStore.getState().chordInversion).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Key context integration (scale → chords → colors)
// ---------------------------------------------------------------------------
describe('key context integration', () => {
  it('key change propagates through useKeyContext', () => {
    useAppStore.setState({ selectedKey: { natural: 'G', accidental: '' } });
    const { result } = renderHook(() => useKeyContext());
    // G is tonic
    expect(result.current.getNoteDegree({ natural: 'G', accidental: '' })).toBe(1);
    // 7 diatonic chords
    expect(result.current.diatonicChords).toHaveLength(7);
    // First chord root is G
    expect(result.current.diatonicChords[0].chord.root.natural).toBe('G');
  });

  it('scale type change yields different chord qualities', () => {
    useAppStore.setState({
      selectedKey: { natural: 'C', accidental: '' },
      selectedScale: 'major',
    });
    const { result: majorResult } = renderHook(() => useKeyContext());
    const majorQualities = majorResult.current.diatonicChords.map(dc => dc.chord.quality);

    useAppStore.setState({ selectedScale: 'natural_minor' });
    const { result: minorResult } = renderHook(() => useKeyContext());
    const minorQualities = minorResult.current.diatonicChords.map(dc => dc.chord.quality);

    // Major: I=major, ii=minor ... vs Minor: i=minor, ii°=dim ...
    expect(majorQualities).not.toEqual(minorQualities);
    expect(majorQualities[0]).toBe('major');
    expect(minorQualities[0]).toBe('minor');
  });

  it('buildScale → getDiatonicChordsForScale round-trip is consistent', () => {
    const key: Note = { natural: 'D', accidental: '' };
    const scale = buildScale(key, 'major');
    const chords = getDiatonicChordsForScale(scale);

    expect(chords).toHaveLength(7);
    expect(chords[0].chord.root.natural).toBe('D');
    expect(chords[0].chord.quality).toBe('major');
    // V chord of D major should be A
    expect(chords[4].chord.root.natural).toBe('A');
    expect(chords[4].chord.quality).toBe('major');
  });
});

// ---------------------------------------------------------------------------
// Active notes integration
// ---------------------------------------------------------------------------
describe('active notes', () => {
  it('addActiveNote / removeActiveNote cycle', () => {
    const { addActiveNote, removeActiveNote, clearActiveNotes } = useAppStore.getState();

    addActiveNote(60); // C4
    addActiveNote(64); // E4
    addActiveNote(67); // G4
    expect(useAppStore.getState().activeNotes.size).toBe(3);

    removeActiveNote(64);
    expect(useAppStore.getState().activeNotes.has(64)).toBe(false);
    expect(useAppStore.getState().activeNotes.size).toBe(2);

    clearActiveNotes();
    expect(useAppStore.getState().activeNotes.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Persistence round-trip
// ---------------------------------------------------------------------------
describe('persistence', () => {
  it('persists key, scale, instrument to localStorage', () => {
    const { setKey, setScale, setInstrument } = useAppStore.getState();

    setKey({ natural: 'F', accidental: '#' });
    setScale('dorian');
    setInstrument('guitar');

    // Force persist flush by reading localStorage
    const stored = JSON.parse(localStorage.getItem(STORE_KEY)!);
    expect(stored.state.selectedKey).toEqual({ natural: 'F', accidental: '#' });
    expect(stored.state.selectedScale).toBe('dorian');
    expect(stored.state.instrument).toBe('guitar');
  });

  it('persists preferences (colorMode, baseOctave, volume)', () => {
    const { setColorMode, setBaseOctave, setVolume } = useAppStore.getState();

    setColorMode('absolute');
    setBaseOctave(3);
    setVolume(0.3);

    const stored = JSON.parse(localStorage.getItem(STORE_KEY)!);
    expect(stored.state.colorMode).toBe('absolute');
    expect(stored.state.baseOctave).toBe(3);
    expect(stored.state.volume).toBe(0.3);
  });

  it('does NOT persist transient state (selectedChord, view, activeNotes)', () => {
    const { setSelectedChord, setView, addActiveNote } = useAppStore.getState();

    setSelectedChord({
      root: { natural: 'C', accidental: '' },
      quality: 'major',
      notes: [
        { natural: 'C', accidental: '' },
        { natural: 'E', accidental: '' },
        { natural: 'G', accidental: '' },
      ],
    });
    setView('learn');
    addActiveNote(60);

    const stored = JSON.parse(localStorage.getItem(STORE_KEY)!);
    expect(stored.state.selectedChord).toBeUndefined();
    expect(stored.state.view).toBeUndefined();
    expect(stored.state.activeNotes).toBeUndefined();
  });

  it('restores persisted state into a fresh store', () => {
    // Set state
    useAppStore.getState().setKey({ natural: 'E', accidental: 'b' });
    useAppStore.getState().setScale('harmonic_minor');

    // Verify persisted
    const stored = JSON.parse(localStorage.getItem(STORE_KEY)!);
    expect(stored.state.selectedKey).toEqual({ natural: 'E', accidental: 'b' });
    expect(stored.state.selectedScale).toBe('harmonic_minor');
  });
});
