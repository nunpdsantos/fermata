import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../../store.ts';
import type { Chord } from '../../../core/types/music.ts';

const C_MAJOR: Chord = {
  root: { natural: 'C', accidental: '' },
  quality: 'major',
  notes: [
    { natural: 'C', accidental: '' },
    { natural: 'E', accidental: '' },
    { natural: 'G', accidental: '' },
  ],
};

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    detailPanelOpen: false,
  });
});

describe('musicSlice — setSelectedChord no longer auto-opens the sidebar', () => {
  it('selecting a chord leaves detailPanelOpen === false and resets inversion', () => {
    useAppStore.getState().setChordInversion(2);
    expect(useAppStore.getState().chordInversion).toBe(2);

    useAppStore.getState().setSelectedChord(C_MAJOR);

    const s = useAppStore.getState();
    expect(s.selectedChord).toEqual(C_MAJOR);
    expect(s.chordInversion).toBe(0);
    // The auto-pop side-effect is gone: selecting a chord must NOT open the panel.
    expect(s.detailPanelOpen).toBe(false);
  });

  it('selecting a chord while the panel is already open does not change detailPanelOpen', () => {
    useAppStore.setState({ detailPanelOpen: true });

    useAppStore.getState().setSelectedChord(C_MAJOR);

    expect(useAppStore.getState().selectedChord).toEqual(C_MAJOR);
    // No side-effect either way — the flag is left untouched.
    expect(useAppStore.getState().detailPanelOpen).toBe(true);
  });

  it('clearing the selection does not toggle detailPanelOpen', () => {
    useAppStore.setState({ selectedChord: C_MAJOR, detailPanelOpen: false });

    useAppStore.getState().setSelectedChord(null);

    expect(useAppStore.getState().selectedChord).toBeNull();
    expect(useAppStore.getState().detailPanelOpen).toBe(false);
  });
});
