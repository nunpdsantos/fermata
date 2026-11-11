/**
 * Seam 3, the sound (wave 2 integration): with a capo on, the Progression
 * loop still sounds the chords it NAMES, in Explore's register for the guitar
 * (A minor sounds A3–A4), never the grip the neck draws. Read from what the
 * loop hands to core audio, against an independent reading of the chords.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { PitchedNote } from '../core/types/music';

const audio = vi.hoisted(() => ({ cycles: [] as { note: PitchedNote; at: number }[][] }));
vi.mock('../core/services/audio', async (orig) => ({
  ...(await orig<object>()),
  resumeAudio: () => Promise.resolve(),
  playTimedNotes: (notes: { note: PitchedNote; at: number }[]) => { audio.cycles.push(notes); },
  cancelScheduledAudio: () => {},
}));

import { useAppStore } from '../state/store';
import { setCapoFret } from '../state/capo';
import { openProgressionPanel, resetProgressionPanel } from '../state/progressionPanel';
import { startLoop, stopLoop } from '../components/explore/progression/loopController';
import { readChords } from '../components/explore/progression/progressionModel';
import { COUNT_IN_BEATS } from '../components/explore/progression/progressionLoop';
import { getPitchClass } from '../core/constants/notes';

const flush = () => new Promise((r) => setTimeout(r, 0));
const midi = (n: PitchedNote) => (n.octave + 1) * 12 + getPitchClass(n);

/** The chord pitches the loop sounds, chord by chord (beat 1 of each), count-in left out. */
async function sounded(capo: number, symbols: string[]): Promise<number[][]> {
  audio.cycles = [];
  setCapoFret(capo);
  startLoop(readChords(symbols), 120, 2);
  await flush();
  const cycle = audio.cycles[0];
  stopLoop('user');
  const beats = cycle.slice(COUNT_IN_BEATS);
  const byTime = new Map<number, number[]>();
  for (const n of beats) byTime.set(n.at, [...(byTime.get(n.at) ?? []), midi(n.note)]);
  // Two beats a chord: take every other beat (the chord's first).
  return [...byTime.entries()].sort((a, b) => a[0] - b[0]).filter((_, i) => i % 2 === 0).map(([, ms]) => ms.sort((a, b) => a - b));
}

beforeEach(() => {
  resetProgressionPanel();
  useAppStore.setState({
    view: 'explore', instrument: 'guitar', guitarTuningId: 'standard', baseOctave: 4,
    selectedKey: { natural: 'B', accidental: 'b' }, selectedScale: 'major', selectedChord: null,
    progression: { chords: ['Bb', 'Eb', 'F'], bpm: 120, beats: 2 },
  } as never);
  openProgressionPanel();
});
afterEach(() => {
  stopLoop('user');
  setCapoFret(0);
});

describe('seam 3: the loop with a capo sounds the named chords', () => {
  it('B♭ E♭ F with a capo on 3 sounds B♭, E♭ and F (not the G, C, D grips), exactly as with no capo', async () => {
    const withCapo = await sounded(3, ['Bb', 'Eb', 'F']);
    const without = await sounded(0, ['Bb', 'Eb', 'F']);
    expect(withCapo).toEqual(without);
    // Independently: the chord tones, root position, in the guitar's Explore
    // register (a written octave-4 chord sounding an octave lower).
    // B♭3 D4 F4 · E♭3 G3 B♭3 · F3 A3 C4.
    expect(withCapo).toEqual([[58, 62, 65], [51, 55, 58], [53, 57, 60]]);
    // Not the shapes' pitch classes (G B D, C E G, D F♯ A).
    expect(withCapo.map((c) => c.map((m) => m % 12))).not.toContainEqual([7, 11, 2]);
  });

  it('every capo fret 1–9 leaves the loop\'s pitches as they are without one', async () => {
    const without = await sounded(0, ['G', 'D', 'Em', 'C']);
    for (let capo = 1; capo <= 9; capo++) expect(await sounded(capo, ['G', 'D', 'Em', 'C'])).toEqual(without);
  });
});
