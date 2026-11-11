/**
 * What stops the Progression loop, and what it does to the selected chord:
 * ■, the panel closing (also from a tour), a view change, the page hidden, a
 * new key or scale, a changed chord list, another playback. While it plays it
 * is work in progress, and the sounding chord is Explore's selected chord;
 * afterwards the chord selected before ▶ comes back.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

type Callbacks = { onNotePlay: (i: number) => void; onComplete: () => void };
const audio = vi.hoisted(() => ({ calls: [] as { cb?: Callbacks; notes?: unknown[] }[], cancelled: 0 }));
vi.mock('../../../../core/services/audio', async (orig) => ({
  ...(await orig<object>()),
  resumeAudio: () => Promise.resolve(),
  playTimedNotes: (n: unknown[], _c: unknown, cb?: Callbacks) => { audio.calls.push({ cb, notes: n }); },
  cancelScheduledAudio: () => {
    audio.cancelled++;
    audio.calls.splice(0).forEach((c) => c.cb?.onComplete());
  },
}));

import { useAppStore } from '../../../../state/store';
import { closeProgressionPanel, openProgressionPanel, resetProgressionPanel } from '../../../../state/progressionPanel';
import { hasWorkInProgress } from '../../../../services/workInProgress';
import { isLooping, startLoop, stopLoop, useLoopState } from '../loopController';
import { readChords } from '../progressionModel';
import { buildChord } from '../../../../core/constants/chords';

const flush = () => new Promise((r) => setTimeout(r, 0));
const chords = readChords(['G', 'D', 'Em', 'C']);
const before = buildChord({ natural: 'A', accidental: '' }, 'minor');

async function play() {
  startLoop(chords, 90, 4);
  await flush();
  // The first chord's first beat.
  audio.calls[0].cb!.onNotePlay(4);
}

beforeEach(() => {
  audio.calls = [];
  audio.cancelled = 0;
  resetProgressionPanel();
  useAppStore.setState({ view: 'explore', selectedKey: { natural: 'G', accidental: '' }, selectedScale: 'major', selectedChord: before, chordInversion: 1, progression: { chords: ['G', 'D', 'Em', 'C'], bpm: 90, beats: 4 } });
  openProgressionPanel();
});
afterEach(() => stopLoop('user'));

describe('while it plays', () => {
  it('the sounding chord is the selected chord, the chip index is known, and it is work in progress', async () => {
    await play();
    expect(isLooping()).toBe(true);
    expect(useAppStore.getState().selectedChord).toBe(chords[0]);
    expect(useLoopState.getState()).toMatchObject({ playing: true, index: 0 });
    expect(hasWorkInProgress()).toBe(true);
    stopLoop('user');
    expect(hasWorkInProgress()).toBe(false);
  });
  it('each chord in turn is the selected chord and the chip marked as sounding (final review of wave 2)', async () => {
    startLoop(chords, 90, 4);
    await flush();
    const { cb, notes } = audio.calls[0];
    const shown: (string | null)[] = [];
    const marked: (number | null)[] = [];
    for (let i = 0; i < notes!.length; i++) {
      cb!.onNotePlay(i);
      const sel = useAppStore.getState().selectedChord;
      if (shown[shown.length - 1] !== (sel === before ? null : `${sel?.root.natural}${sel?.quality}`)) {
        shown.push(sel === before ? null : `${sel?.root.natural}${sel?.quality}`);
        marked.push(useLoopState.getState().index);
      }
    }
    // The count-in leaves the chord alone, then G, D, Em, C, each once, in order.
    expect(shown).toEqual([null, 'Gmajor', 'Dmajor', 'Eminor', 'Cmajor']);
    expect(marked).toEqual([null, 0, 1, 2, 3]);
  });
  it('a new tempo or beats does not stop it', async () => {
    await play();
    useAppStore.getState().setProgression({ chords: useAppStore.getState().progression!.chords, bpm: 120, beats: 2 });
    expect(isLooping()).toBe(true);
  });
});

describe('what stops it', () => {
  const stops: [string, () => void, string][] = [
    ['■', () => stopLoop('user'), 'user'],
    ['the panel closing (the ‹ Chords button, a tour)', () => closeProgressionPanel(), 'closed'],
    ['a view change', () => useAppStore.getState().setView('learn'), 'closed'],
    ['a new key', () => useAppStore.getState().setKey({ natural: 'A', accidental: '' }), 'changed'],
    ['a new scale', () => useAppStore.getState().setScale('dorian'), 'changed'],
    ['a changed list of chords', () => useAppStore.getState().setProgression({ chords: ['G', 'D'], bpm: 90, beats: 4 }), 'changed'],
    // Same length, new order (a chip moved; a common progression of the same size) — final review of wave 2.
    ['the chips reordered', () => useAppStore.getState().setProgression({ chords: ['G', 'Em', 'D', 'C'], bpm: 90, beats: 4 }), 'changed'],
    ['the list replaced by another of the same length', () => useAppStore.getState().setProgression({ chords: ['C', 'G', 'Am', 'F'], bpm: 90, beats: 4 }), 'changed'],
    ['the page hidden', () => {
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    }, 'hidden'],
    ['another playback (cancelScheduledAudio)', () => audio.calls.splice(0).forEach((c) => c.cb?.onComplete()), 'cancelled'],
  ];
  for (const [what, act, reason] of stops) {
    it(`${what}: stopped at once, the button back to ▶, its sound cancelled`, async () => {
      await play();
      const cancelled = audio.cancelled;
      act();
      expect(isLooping()).toBe(false);
      expect(useLoopState.getState()).toMatchObject({ playing: false, index: null, lastStop: reason });
      // Its own sound is cancelled, except when someone else already did.
      expect(audio.cancelled).toBe(reason === 'cancelled' ? cancelled : cancelled + 1);
      expect(audio.calls).toHaveLength(0);
      expect(hasWorkInProgress()).toBe(false);
    });
  }
});

describe('the selected chord afterwards', () => {
  it('■ gives back the chord (and inversion) selected before ▶', async () => {
    await play();
    stopLoop('user');
    expect(useAppStore.getState().selectedChord).toBe(before);
    expect(useAppStore.getState().chordInversion).toBe(1);
  });
  it('a key change clears the chord: it stays cleared', async () => {
    await play();
    useAppStore.getState().setKey({ natural: 'A', accidental: '' });
    expect(useAppStore.getState().selectedChord).toBeNull();
  });
  it('a chord the learner picked meanwhile stays', async () => {
    await play();
    const mine = buildChord({ natural: 'B', accidental: '' }, 'minor');
    useAppStore.getState().setSelectedChord(mine);
    stopLoop('user');
    expect(useAppStore.getState().selectedChord).toBe(mine);
  });
  it('stopped during the count-in (no chord shown yet): the selection was never touched', async () => {
    startLoop(chords, 90, 4);
    await flush();
    stopLoop('user');
    expect(useAppStore.getState().selectedChord).toBe(before);
  });
});

it('no chords: nothing starts', () => {
  startLoop([], 90, 4);
  expect(isLooping()).toBe(false);
});
