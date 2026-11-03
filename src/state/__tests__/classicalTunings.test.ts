import { afterEach, describe, expect, it } from 'vitest';
import { GUITAR_TUNINGS, getTuningById } from '../../core/constants/guitarTunings';
import { useAppStore, sanitizePersistedAppState } from '../store';
import { tuningOpenMidi, getGuitarPosition } from '../../core/utils/guitarPositions';
import { buildScale } from '../../core/constants/scales';
import { getPitchClass } from '../../core/constants/notes';
import type { Note } from '../../core/types/music';

// All six pre-W10-UI-d persisted IDs and their original sounding strings.
const legacy: Record<string, number[]> = {
  standard: [40, 45, 50, 55, 59, 64], 'drop-d': [38, 45, 50, 55, 59, 64],
  'half-step-down': [39, 44, 49, 54, 58, 63], 'open-g': [38, 43, 50, 55, 59, 62],
  'open-d': [38, 45, 50, 54, 57, 62], dadgad: [38, 45, 50, 55, 57, 62],
};
// Production-shaped v6 preferences, including settings unrelated to tuning.
const state = {
  selectedKey: { natural: 'F', accidental: '#' }, selectedScale: 'harmonic_minor',
  instrument: 'guitar', guitarTuningId: 'standard', guitarScalePosition: 7,
  baseOctave: 3, colorMode: 'functional', scaleOctaves: 2, volume: 0.4,
  themeMode: 'fermata-night', language: 'pt', preferencesUpdatedAt: 1793700000000,
  lastView: 'explore', dockDetents: { explore: 'half', learn: 'peek' },
  dockChosen: { explore: true, learn: false }, exploreCircleOpen: true,
};
afterEach(() => localStorage.clear());

describe('classical tuning list and saved IDs', () => {
  it('puts classical tunings first and keeps every legacy ID and pitch', () => {
    expect(GUITAR_TUNINGS.map((t) => t.id)).toEqual(['standard', 'drop-d', 'd-g', 'half-step-down', 'open-g', 'open-d', 'dadgad']);
    for (const [id, pitches] of Object.entries(legacy)) expect(tuningOpenMidi(getTuningById(id))).toEqual(pitches);
    expect(tuningOpenMidi(getTuningById('d-g'))).toEqual([38, 43, 50, 55, 59, 64]);
  });
  it.each([...Object.keys(legacy), 'd-g'])('rehydrates and writes %s unchanged in a full v6 envelope', async (id) => {
    const saved = { ...state, guitarTuningId: id };
    localStorage.setItem('music-theory-app', JSON.stringify({ state: saved, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject(saved);
    expect(sanitizePersistedAppState(saved)).toEqual(saved);
    // Force the real persist serializer, without changing a preference.
    useAppStore.setState({ guitarTuningId: id });
    expect(JSON.parse(localStorage.getItem('music-theory-app')!)).toEqual({ state: saved, version: 6 });
  });
  it('known-bad ID is rejected rather than treated as a new tuning', () => {
    expect(sanitizePersistedAppState({ ...state, guitarTuningId: 'drop-z' })).not.toHaveProperty('guitarTuningId');
    expect(getTuningById('drop-z').id).toBe('standard');
  });
  it.each(['C', 'D', 'G'] as const)('generates Drop D positions for %s, with an independent string/pitch oracle', (natural) => {
    const root: Note = { natural, accidental: '' };
    const pcs = buildScale(root, 'major').notes.map(getPitchClass);
    for (const position of [0, 2, 5, 9, 12]) {
      const p = getGuitarPosition(root, 'major', position, getTuningById('drop-d'));
      expect(p.notes.length).toBeGreaterThan(10);
      for (const n of p.notes) {
        expect(legacy['drop-d'][n.stringIndex] + n.fret).toBe(n.midi);
        expect(pcs).toContain(n.midi % 12);
      }
    }
    // A standard-tuning map would put low E at fret 0: Drop D must not.
    const open = getGuitarPosition(root, 'major', 0, getTuningById('drop-d'));
    expect(open.notes.find((n) => n.stringIndex === 0 && n.fret === 0)?.midi).toBe(38);
  });
});
