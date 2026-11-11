/**
 * A tour started while the Progression panel is open (wave 2): the panel
 * closes first (its loop stops at once and gives back the learner's chord),
 * so the tour finds the chords card's tabs; the snapshot remembers the tab
 * the panel was hiding and that the panel was open; the restore opens it
 * again ("Stay here" does not).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Callbacks = { onNotePlay: (i: number) => void; onComplete: () => void };
const calls = vi.hoisted(() => [] as { cb?: Callbacks }[]);
vi.mock('../../../core/services/audio', async (orig) => ({
  ...(await orig<object>()),
  getAudioState: vi.fn(() => 'running'),
  resumeAudio: vi.fn(async () => {}),
  cancelScheduledAudio: vi.fn(() => calls.splice(0).forEach((c) => c.cb?.onComplete())),
  playTimedNotes: vi.fn((_n: unknown, _c: unknown, cb?: Callbacks) => { calls.push({ cb }); }),
  playScale: vi.fn(),
  setMasterVolume: vi.fn(),
}));
vi.mock('../dom', async (orig) => ({
  ...(await orig<object>()),
  waitSettled: vi.fn(async (selector: string) => {
    const el = document.createElement('button');
    el.dataset.selector = selector;
    return el;
  }),
}));

import { useAppStore } from '../../../state/store';
import { TourSession } from '../session';
import { currentChordsTab, takeSnapshot } from '../snapshot';
import { isProgressionPanelOpen, openProgressionPanel, resetProgressionPanel } from '../../../state/progressionPanel';
import { isLooping, startLoop } from '../../../components/explore/progression/loopController';
import { readChords } from '../../../components/explore/progression/progressionModel';
import { buildChord } from '../../../core/constants/chords';

const mine = buildChord({ natural: 'A', accidental: '' }, 'minor');

/** The chords card as ChordsCard draws it: tabs while the panel is closed; while it is open, only `data-chords-tab`. */
function mountCard(tab: 'diatonic' | 'all' | 'build') {
  const root = document.createElement('section');
  document.body.appendChild(root);
  const draw = () => {
    root.innerHTML = '';
    if (isProgressionPanelOpen()) {
      root.setAttribute('data-chords-tab', tab);
      return;
    }
    root.removeAttribute('data-chords-tab');
    for (const t of ['diatonic', 'all', 'build']) {
      const b = document.createElement('button');
      b.id = `chords-tab-${t}`;
      b.setAttribute('aria-selected', String(t === tab));
      b.addEventListener('click', () => { tab = t as typeof tab; draw(); });
      root.appendChild(b);
    }
  };
  draw();
  return { redraw: draw, remove: () => root.remove() };
}

async function playing() {
  startLoop(readChords(['G', 'D']), 90, 4);
  await vi.advanceTimersByTimeAsync(0);
  calls[0].cb!.onNotePlay(4);
  expect(useAppStore.getState().selectedChord?.root.natural).toBe('G');
}

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  calls.splice(0);
  resetProgressionPanel();
  useAppStore.setState({ view: 'explore', lastView: 'explore', instrument: 'piano', selectedKey: { natural: 'G', accidental: '' }, selectedScale: 'major', selectedChord: mine, progression: { chords: ['G', 'D'], bpm: 90, beats: 4 } });
  openProgressionPanel();
});
afterEach(() => {
  vi.useRealTimers();
  resetProgressionPanel();
  document.body.innerHTML = '';
});

describe('a tour over the open Progression panel', () => {
  it('the snapshot closes the panel first: loop stopped, the learner\'s chord back, the hidden tab read', async () => {
    const card = mountCard('all');
    await playing();
    expect(currentChordsTab()).toBe('all');
    const snap = takeSnapshot();
    card.redraw();
    expect(isLooping()).toBe(false);
    expect(isProgressionPanelOpen()).toBe(false);
    expect(snap).toMatchObject({ progressionOpen: true, chordsTab: 'all' });
    expect(snap.app.selectedChord).toBe(mine);
    expect(document.getElementById('chords-tab-all')).not.toBeNull();
  });

  it('the restore puts the tab and then the panel back; "Stay here" leaves it closed', async () => {
    mountCard('all');
    const session = new TourSession({ tour: 'intro', source: 'menu', reducedMotion: false, holdMs: () => 200, onDone: vi.fn() });
    expect(isProgressionPanelOpen()).toBe(false);
    session.start();
    await vi.advanceTimersByTimeAsync(500);
    await session.finish('restore');
    expect(isProgressionPanelOpen()).toBe(true);
    expect(useAppStore.getState().selectedChord).toBe(mine);

    const stay = new TourSession({ tour: 'intro', source: 'menu', reducedMotion: false, holdMs: () => 200, onDone: vi.fn() });
    stay.start();
    await vi.advanceTimersByTimeAsync(500);
    await stay.finish('stay');
    expect(isProgressionPanelOpen()).toBe(false);
  });

  it('a session dropped before it started changed nothing: the panel is open again', () => {
    mountCard('diatonic');
    const session = new TourSession({ tour: 'intro', source: 'menu', reducedMotion: false, holdMs: () => 200, onDone: vi.fn() });
    expect(isProgressionPanelOpen()).toBe(false);
    session.dispose();
    expect(isProgressionPanelOpen()).toBe(true);
  });

  it('with the panel closed, the snapshot is as before (no tab from the attribute, nothing reopened)', async () => {
    resetProgressionPanel();
    mountCard('build');
    const snap = takeSnapshot();
    expect(snap).toMatchObject({ progressionOpen: false, chordsTab: 'build' });
  });
});
