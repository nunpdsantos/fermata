import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store.ts';
import type { Chord } from '../../core/types/music.ts';

const C_MAJOR: Chord = {
  root: { natural: 'C', accidental: '' },
  quality: 'major',
  notes: [{ natural: 'C', accidental: '' }, { natural: 'E', accidental: '' }, { natural: 'G', accidental: '' }],
};

const A_MINOR: Chord = {
  root: { natural: 'A', accidental: '' },
  quality: 'minor',
  notes: [{ natural: 'A', accidental: '' }, { natural: 'C', accidental: '' }, { natural: 'E', accidental: '' }],
};

// Reset store to defaults before each test
beforeEach(() => {
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
    view: 'explore',
    detailPanelOpen: false,
    quickSearchOpen: false,
    colorMode: 'functional',
    scaleOctaves: 1,
    baseOctave: 4,
    guitarTuningId: 'standard',
    themeMode: 'fermata',
    comparisonScale: null,
    language: 'en',
  });
});

describe('store defaults', () => {
  it('has correct initial state', () => {
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'C', accidental: '' });
    expect(s.selectedScale).toBe('major');
    expect(s.selectedChord).toBeNull();
    expect(s.selectedDegree).toBeNull();
    expect(s.chordInversion).toBe(0);
    expect(s.instrument).toBe('piano');
    expect(s.activeNotes.size).toBe(0);
    expect(s.guitarScalePosition).toBeNull();
    expect(s.view).toBe('explore');
    expect(s.detailPanelOpen).toBe(false);
    expect(s.colorMode).toBe('functional');
    expect(s.baseOctave).toBe(4);
    expect(s.volume).toBe(0.7);
  });
});

describe('music actions', () => {
  it('setKey updates key and resets chord/degree/guitarScalePosition', () => {
    const { setSelectedChord, setSelectedDegree, setGuitarScalePosition, setKey } = useAppStore.getState();

    // Set up transient state
    setSelectedChord(C_MAJOR);
    setSelectedDegree(1);
    setGuitarScalePosition(2);

    // Verify state was set
    expect(useAppStore.getState().selectedChord).not.toBeNull();
    expect(useAppStore.getState().selectedDegree).toBe(1);
    expect(useAppStore.getState().guitarScalePosition).toBe(2);

    // Change key
    setKey({ natural: 'D', accidental: '' });

    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'D', accidental: '' });
    expect(s.selectedChord).toBeNull();
    expect(s.selectedDegree).toBeNull();
    expect(s.guitarScalePosition).toBeNull();
  });

  it('setScale updates scale and resets chord/degree/guitarScalePosition', () => {
    const { setSelectedChord, setSelectedDegree, setGuitarScalePosition, setScale } = useAppStore.getState();

    setSelectedChord(C_MAJOR);
    setSelectedDegree(3);
    setGuitarScalePosition(1);

    setScale('natural_minor');

    const s = useAppStore.getState();
    expect(s.selectedScale).toBe('natural_minor');
    expect(s.selectedChord).toBeNull();
    expect(s.selectedDegree).toBeNull();
    expect(s.guitarScalePosition).toBeNull();
  });

  it('setSelectedChord resets inversion and does NOT auto-open the detail panel', () => {
    const { setChordInversion, setSelectedChord } = useAppStore.getState();

    setChordInversion(2);
    expect(useAppStore.getState().chordInversion).toBe(2);

    setSelectedChord(A_MINOR);

    const s = useAppStore.getState();
    expect(s.selectedChord).toEqual(A_MINOR);
    // WS4: selecting a chord no longer pops a sidebar — detailPanelOpen is untouched.
    expect(s.detailPanelOpen).toBe(false);
    expect(s.chordInversion).toBe(0);
  });

  it('setSelectedChord(null) clears the chord without touching the detail panel', () => {
    const { setSelectedChord } = useAppStore.getState();

    setSelectedChord(C_MAJOR);
    expect(useAppStore.getState().selectedChord).toEqual(C_MAJOR);
    // No auto-open side-effect either way.
    expect(useAppStore.getState().detailPanelOpen).toBe(false);

    setSelectedChord(null);
    expect(useAppStore.getState().selectedChord).toBeNull();
    expect(useAppStore.getState().detailPanelOpen).toBe(false);
  });

  it('setChordInversion sets inversion', () => {
    useAppStore.getState().setChordInversion(1);
    expect(useAppStore.getState().chordInversion).toBe(1);
  });

  it('setSelectedDegree sets degree', () => {
    useAppStore.getState().setSelectedDegree(5);
    expect(useAppStore.getState().selectedDegree).toBe(5);
  });
});

describe('instrument actions', () => {
  it('setInstrument changes instrument', () => {
    useAppStore.getState().setInstrument('guitar');
    expect(useAppStore.getState().instrument).toBe('guitar');
  });

  it('addActiveNote adds MIDI number to set', () => {
    const { addActiveNote } = useAppStore.getState();

    addActiveNote(60);
    addActiveNote(64);
    addActiveNote(67);

    const notes = useAppStore.getState().activeNotes;
    expect(notes.has(60)).toBe(true);
    expect(notes.has(64)).toBe(true);
    expect(notes.has(67)).toBe(true);
    expect(notes.size).toBe(3);
  });

  it('removeActiveNote removes specific MIDI number', () => {
    const { addActiveNote, removeActiveNote } = useAppStore.getState();

    addActiveNote(60);
    addActiveNote(64);
    removeActiveNote(60);

    const notes = useAppStore.getState().activeNotes;
    expect(notes.has(60)).toBe(false);
    expect(notes.has(64)).toBe(true);
    expect(notes.size).toBe(1);
  });

  it('clearActiveNotes empties the set', () => {
    const { addActiveNote, clearActiveNotes } = useAppStore.getState();

    addActiveNote(60);
    addActiveNote(64);
    addActiveNote(67);
    expect(useAppStore.getState().activeNotes.size).toBe(3);

    clearActiveNotes();
    expect(useAppStore.getState().activeNotes.size).toBe(0);
  });

  it('setGuitarScalePosition sets position index', () => {
    useAppStore.getState().setGuitarScalePosition(3);
    expect(useAppStore.getState().guitarScalePosition).toBe(3);

    useAppStore.getState().setGuitarScalePosition(null);
    expect(useAppStore.getState().guitarScalePosition).toBeNull();
  });

  it('setGuitarTuningId changes tuning and resets scale position', () => {
    useAppStore.getState().setGuitarScalePosition(2);
    expect(useAppStore.getState().guitarScalePosition).toBe(2);

    useAppStore.getState().setGuitarTuningId('drop-d');
    expect(useAppStore.getState().guitarTuningId).toBe('drop-d');
    expect(useAppStore.getState().guitarScalePosition).toBeNull();
  });

  it('has standard tuning as default', () => {
    expect(useAppStore.getState().guitarTuningId).toBe('standard');
  });
});

describe('navigation actions', () => {
  it('setView changes view and resets transient state', () => {
    const { setSelectedChord, setSelectedDegree, setDetailPanelOpen, setView } = useAppStore.getState();

    setSelectedChord(C_MAJOR);
    setSelectedDegree(1);
    setDetailPanelOpen(true);

    setView('learn');

    const s = useAppStore.getState();
    expect(s.view).toBe('learn');
    expect(s.detailPanelOpen).toBe(false);
    expect(s.selectedChord).toBeNull();
    expect(s.selectedDegree).toBeNull();
  });

  it('setDetailPanelOpen toggles panel', () => {
    useAppStore.getState().setDetailPanelOpen(true);
    expect(useAppStore.getState().detailPanelOpen).toBe(true);

    useAppStore.getState().setDetailPanelOpen(false);
    expect(useAppStore.getState().detailPanelOpen).toBe(false);
  });

  it('setQuickSearchOpen toggles quick search', () => {
    useAppStore.getState().setQuickSearchOpen(true);
    expect(useAppStore.getState().quickSearchOpen).toBe(true);

    useAppStore.getState().setQuickSearchOpen(false);
    expect(useAppStore.getState().quickSearchOpen).toBe(false);
  });

  it('setComparisonScale sets and clears comparison', () => {
    useAppStore.getState().setComparisonScale('natural_minor');
    expect(useAppStore.getState().comparisonScale).toBe('natural_minor');

    useAppStore.getState().setComparisonScale(null);
    expect(useAppStore.getState().comparisonScale).toBeNull();
  });

  it('setScale resets comparisonScale', () => {
    useAppStore.getState().setComparisonScale('dorian');
    expect(useAppStore.getState().comparisonScale).toBe('dorian');

    useAppStore.getState().setScale('harmonic_minor');
    expect(useAppStore.getState().comparisonScale).toBeNull();
  });
});

describe('audio actions', () => {
  it('setVolume updates volume', () => {
    useAppStore.getState().setVolume(0.5);
    expect(useAppStore.getState().volume).toBe(0.5);
  });
});

describe('preferences actions', () => {
  it('setColorMode changes color mode', () => {
    useAppStore.getState().setColorMode('absolute');
    expect(useAppStore.getState().colorMode).toBe('absolute');
  });

  it('setScaleOctaves changes octave count', () => {
    useAppStore.getState().setScaleOctaves(2);
    expect(useAppStore.getState().scaleOctaves).toBe(2);
  });

  it('setBaseOctave changes base octave', () => {
    useAppStore.getState().setBaseOctave(3);
    expect(useAppStore.getState().baseOctave).toBe(3);
  });

  it('setThemeMode changes theme', () => {
    useAppStore.getState().setThemeMode('fermata-night');
    expect(useAppStore.getState().themeMode).toBe('fermata-night');

    useAppStore.getState().setThemeMode('fermata');
    expect(useAppStore.getState().themeMode).toBe('fermata');
  });

  it('has fermata theme as default', () => {
    expect(useAppStore.getState().themeMode).toBe('fermata');
  });

  it('setLanguage changes language', () => {
    useAppStore.getState().setLanguage('pt');
    expect(useAppStore.getState().language).toBe('pt');

    useAppStore.getState().setLanguage('en');
    expect(useAppStore.getState().language).toBe('en');
  });

  it('has English as default language', () => {
    expect(useAppStore.getState().language).toBe('en');
  });
});

describe('appStore persistence shape guard', () => {
  const KEY = 'music-theory-app';

  const seed = (state: unknown, version = 5) => {
    localStorage.setItem(KEY, JSON.stringify({ state, version }));
  };

  it('falls back to default selectedKey when natural is out of range, keeping other fields', async () => {
    seed({ selectedKey: { natural: 'H', accidental: '' }, volume: 0.42 });
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'C', accidental: '' });
    expect(s.volume).toBe(0.42);
  });

  it('falls back to default selectedKey on an invalid accidental', async () => {
    seed({ selectedKey: { natural: 'D', accidental: 'x' } });
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'C', accidental: '' });
  });

  it('falls back to default selectedScale on an unknown scale, keeping other fields', async () => {
    seed({ selectedScale: 'mega_locrian', selectedKey: { natural: 'G', accidental: '#' } });
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState();
    expect(s.selectedScale).toBe('major');
    expect(s.selectedKey).toEqual({ natural: 'G', accidental: '#' });
  });

  it('falls back per-field on non-numeric numeric fields without nuking valid ones', async () => {
    seed({ volume: 'loud', baseOctave: null, scaleOctaves: 2, selectedScale: 'dorian' });
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState();
    expect(s.volume).toBe(0.7);
    expect(s.baseOctave).toBe(4);
    expect(s.scaleOctaves).toBe(2);
    expect(s.selectedScale).toBe('dorian');
  });

  it('rehydrates to current defaults without throwing when the whole state is garbage', async () => {
    seed('total garbage');
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'C', accidental: '' });
    expect(s.selectedScale).toBe('major');
    expect(s.volume).toBe(0.7);
  });

  it('keeps a fully valid persisted state intact', async () => {
    seed({
      selectedKey: { natural: 'E', accidental: 'b' },
      selectedScale: 'harmonic_minor',
      volume: 0.25,
      baseOctave: 3,
      scaleOctaves: 2,
      preferencesUpdatedAt: 123,
    });
    await useAppStore.persist.rehydrate();
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'E', accidental: 'b' });
    expect(s.selectedScale).toBe('harmonic_minor');
    expect(s.volume).toBe(0.25);
    expect(s.baseOctave).toBe(3);
    expect(s.scaleOctaves).toBe(2);
    expect(s.preferencesUpdatedAt).toBe(123);
  });
});
