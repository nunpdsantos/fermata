/**
 * A whole tour, played through its real step list and the real app store,
 * with fake timers and fake audio. The DOM side (targets present and
 * settled) is stubbed: the views are not mounted here — e2e/tour.spec.ts
 * plays the same tour over the real views and repeats the no-writes proof.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../core/services/audio', async (orig) => {
  const real = await orig<typeof import('../../../core/services/audio')>();
  return {
    ...real,
    getAudioState: vi.fn(() => 'running'),
    resumeAudio: vi.fn(async () => {}),
    cancelScheduledAudio: vi.fn(),
    setMasterVolume: vi.fn(),
    // The scale "plays" for 2.3 s, then reports its completion.
    playScale: vi.fn((...args: unknown[]) => {
      const onComplete = args[6] as () => void;
      setTimeout(onComplete, 2300);
    }),
  };
});

// Every target is there at once. ▶ Chord behaves like the chord panel's:
// the chord's keys light while it sounds (1.5 s), then go out.
vi.mock('../dom', async (orig) => {
  const real = await orig<typeof import('../dom')>();
  const { useAppStore } = await import('../../../state/store');
  const element = (selector: string) => {
    const el = document.createElement('button');
    el.dataset.selector = selector;
    if (selector.includes('play-chord')) {
      el.addEventListener('click', () => {
        useAppStore.getState().addActiveNote(62);
        setTimeout(() => useAppStore.getState().removeActiveNote(62), 1500);
      });
    }
    return el;
  };
  return { ...real, waitSettled: vi.fn(async (selector: string) => element(selector)) };
});

import * as audio from '../../../core/services/audio';
import { useAppStore } from '../../../state/store';
import { TourSession } from '../session';
import { PROGRESS_KEY } from '../guards';
import { LEARN_SESSION_KEY } from '../../../state/learnSessionPersistence';
import { DRILL_STORE_KEY_LITERAL } from '../../../state/drillWork';
import { FINGERING_STORE_KEY } from '../../../state/fingeringStore';
import { RETIRED_EXERCISE_IDS } from '../../../state/retiredExerciseIds';
import drillFixture from '../../../state/__tests__/fixtures/drill-v3-before-reading.json';
import learnFixture from '../../../state/__tests__/fixtures/learn-session-v1.json';
import type { TourStep } from '../types';

const APP_KEY = 'music-theory-app';
const PROGRESS_VERSION = Math.max(1, ...RETIRED_EXERCISE_IDS.map((r) => r.version));
const KEYS = [APP_KEY, PROGRESS_KEY, DRILL_STORE_KEY_LITERAL, FINGERING_STORE_KEY, LEARN_SESSION_KEY];
const HOLD = 200;

/** A returning learner: months of progress, Drill history, teacher's fingerings, a lesson open. */
function seedReturningLearner() {
  const now = Date.now();
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({
    state: {
      progress: {
        completedModules: ['l1u1m1', 'l1u1m2'],
        moduleProgress: { l1u1m3: ['t1'] },
        exerciseResults: { l1u1m1: { attempts: 2, bestScore: 0.9, passed: true, scores: { l1u1m1e1: 1 } } },
        reviewSchedules: {
          l1u1m1: { completedAt: now - 9e8, nextReviewAt: now + 9e7, intervalLevel: 1, reviewCount: 1, lastReviewedAt: now - 9e7 },
          l1u1m2: { completedAt: now - 8e8, nextReviewAt: now + 9e7, intervalLevel: 0, reviewCount: 0, lastReviewedAt: now - 8e8 },
        },
      },
    },
    version: PROGRESS_VERSION,
  }));
  localStorage.setItem(DRILL_STORE_KEY_LITERAL, JSON.stringify(drillFixture));
  localStorage.setItem(FINGERING_STORE_KEY, JSON.stringify({ state: { overrides: {}, labelMode: 'degree' }, version: 1 }));
  localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify((learnFixture as { en: unknown }).en));
}

const rawKeys = () => Object.fromEntries(KEYS.map((k) => [k, localStorage.getItem(k)]));

/** Every protected store's data (functions dropped), loaded for real. */
async function storeStates() {
  const [{ useProgressStore }, { useDrillStore }, { useFingeringStore }, { useLearnSessionStore }] = await Promise.all([
    import('../../../state/progressStore'),
    import('../../../state/drillStore'),
    import('../../../state/fingeringStore'),
    import('../../../state/learnSessionStore'),
  ]);
  const data = (s: object) => JSON.parse(JSON.stringify(s));
  return {
    progress: data(useProgressStore.getState()),
    drill: data(useDrillStore.getState()),
    fingering: data(useFingeringStore.getState()),
    learnSession: data(useLearnSessionStore.getState()),
  };
}

function newSession(source: 'menu' | 'start' = 'menu') {
  const onDone = vi.fn();
  const session = new TourSession({ tour: 'intro', source, reducedMotion: false, holdMs: () => HOLD, onDone });
  return { session, onDone };
}

const stepId = (s: TourSession) => s.engine.current?.id;

/** Play until the end card. */
async function playToEnd(session: TourSession, visited: string[] = []) {
  session.start();
  for (let i = 0; i < 200 && !session.engine.current?.final; i++) {
    const id = stepId(session);
    if (id && visited[visited.length - 1] !== id) visited.push(id);
    await vi.advanceTimersByTimeAsync(100);
  }
  visited.push(stepId(session)!);
  return visited;
}

const appState = () => {
  const s = useAppStore.getState();
  return {
    view: s.view, lastView: s.lastView, key: s.selectedKey, scale: s.selectedScale, chord: s.selectedChord?.root ?? null,
    instrument: s.instrument, dockDetents: s.dockDetents, dockChosen: s.dockChosen, preferencesUpdatedAt: s.preferencesUpdatedAt,
  };
};

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
});
afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

describe('the intro tour, played through', () => {
  it('a returning learner: the full run writes nothing to progress, Drill, fingering or the learn session (stores and storage keys)', async () => {
    seedReturningLearner();
    useAppStore.setState({ view: 'explore', lastView: 'explore', instrument: 'piano', selectedKey: { natural: 'E', accidental: 'b' }, selectedScale: 'natural_minor', selectedChord: null });
    useAppStore.setState({}); // the app's own save, before the tour
    const storesBefore = await storeStates();
    const keysBefore = rawKeys();

    const { session, onDone } = newSession();
    const visited = await playToEnd(session);
    // Learn and Drill would write on opening here (a lesson is open, Drill has history): the tour points at their tabs.
    expect(visited).toEqual(['key', 'scale', 'chords', 'chord', 'instrument', 'learn', 'drill', 'end']);
    expect(useAppStore.getState().view).toBe('explore');
    // Mid-tour, even the settings save is untouched (a reload boots as before).
    expect(rawKeys()).toEqual(keysBefore);

    await session.finish('restore');
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(await storeStates()).toEqual(storesBefore);
    expect(rawKeys()).toEqual(keysBefore);
  });

  it('a new learner: Learn and Drill are visited, and no saved key appears', async () => {
    const { session } = newSession();
    const visited = await playToEnd(session);
    expect(visited).toContain('learn');
    expect(session.engine.steps.find((s: TourStep) => s.id === 'learn')!.target!()).toBe('#learn-panel h1');
    expect(session.engine.steps.find((s: TourStep) => s.id === 'drill')!.target!()).toBe('#drill-intro-title');
    await session.finish('restore');
    for (const k of KEYS.slice(1)) expect(localStorage.getItem(k), k).toBeNull();
  });

  it('the steps really play: G major is chosen, the scale and the chord sound, the other instrument shows', async () => {
    useAppStore.setState({ view: 'explore', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null });
    const { session } = newSession();
    session.start();
    const seen: Record<string, unknown> = {};
    for (let i = 0; i < 200 && !session.engine.current?.final; i++) {
      await vi.advanceTimersByTimeAsync(100);
      const s = useAppStore.getState();
      seen[stepId(session)!] = { key: s.selectedKey.natural, chord: s.selectedChord?.root.natural ?? null, instrument: s.instrument };
    }
    expect(seen.key).toEqual({ key: 'G', chord: null, instrument: 'piano' });
    expect(seen.chord).toEqual({ key: 'G', chord: 'D', instrument: 'piano' });
    expect(seen.instrument).toEqual({ key: 'G', chord: 'D', instrument: 'guitar' });
    expect(audio.playScale).toHaveBeenCalledTimes(1);
    // The end card is back on the viewer's own instrument.
    expect(useAppStore.getState().instrument).toBe('piano');
    await session.finish('restore');
  });

  it('stopping mid-way restores the key, scale, chord, instrument, view and dock exactly', async () => {
    const chord = { root: { natural: 'A' as const, accidental: '' as const }, quality: 'minor' as const, notes: [] };
    useAppStore.setState({
      view: 'explore', lastView: 'explore', instrument: 'guitar', selectedKey: { natural: 'F', accidental: '' }, selectedScale: 'major',
      selectedChord: chord, dockDetents: { explore: 'peek', learn: 'peek' }, dockChosen: { explore: true, learn: false }, preferencesUpdatedAt: 1234,
    });
    const before = appState();
    useAppStore.setState({});
    const saved = localStorage.getItem(APP_KEY);
    const { session, onDone } = newSession();
    session.start();
    while (stepId(session) !== 'instrument') await vi.advanceTimersByTimeAsync(100);
    await vi.advanceTimersByTimeAsync(800);
    expect(useAppStore.getState().instrument).toBe('piano'); // the tour showed the other instrument
    await session.finish('restore');
    expect(appState()).toEqual(before);
    expect(useAppStore.getState().selectedChord).toBe(chord);
    expect(localStorage.getItem(APP_KEY)).toBe(saved);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('"Stay here" keeps what the tour shows and saves it once', async () => {
    useAppStore.setState({ view: 'explore', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null });
    useAppStore.setState({});
    const { session } = newSession();
    await playToEnd(session);
    await session.finish('stay');
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'G', accidental: '' });
    expect(s.selectedChord?.root.natural).toBe('D');
    expect(s.instrument).toBe('piano');
    expect(JSON.parse(localStorage.getItem(APP_KEY)!).state.selectedKey).toEqual({ natural: 'G', accidental: '' });
  });

  it('a tour started in Learn with a lesson open ends in Explore (going back would re-save the lesson), the rest restored', async () => {
    seedReturningLearner();
    useAppStore.setState({ view: 'learn', lastView: 'learn', instrument: 'piano', selectedKey: { natural: 'D', accidental: '' }, selectedScale: 'major' });
    const { session } = newSession();
    session.start();
    await vi.advanceTimersByTimeAsync(3000);
    await session.finish('restore');
    expect(useAppStore.getState()).toMatchObject({ view: 'explore', lastView: 'explore', selectedKey: { natural: 'D', accidental: '' }, instrument: 'piano' });
  });

  it('a tour started in a quiet Learn overview goes back to it', async () => {
    useAppStore.setState({ view: 'learn', lastView: 'learn', instrument: 'piano' });
    const { session } = newSession();
    session.start();
    await vi.advanceTimersByTimeAsync(3000);
    expect(useAppStore.getState().view).toBe('explore');
    await session.finish('restore');
    expect(useAppStore.getState()).toMatchObject({ view: 'learn', lastView: 'learn' });
  });

  it('the sound toggle off: no scale, no chord played', async () => {
    useAppStore.setState({ view: 'explore', instrument: 'piano' });
    const { session } = newSession();
    session.setSound(false);
    const click = vi.spyOn(HTMLElement.prototype, 'click');
    await playToEnd(session);
    expect(audio.playScale).not.toHaveBeenCalled();
    expect(click.mock.contexts.some((el) => (el as HTMLElement).dataset?.selector?.includes('play-chord'))).toBe(false);
    click.mockRestore();
    await session.finish('restore');
  });

  it('a suspended audio context: silent, and "Tap for sound" turns it on', async () => {
    vi.mocked(audio.getAudioState).mockReturnValue('suspended');
    useAppStore.setState({ view: 'explore', instrument: 'piano' });
    const { session } = newSession();
    session.start();
    await vi.advanceTimersByTimeAsync(500);
    expect(session.store.getState().sound).toBe('blocked');
    vi.mocked(audio.getAudioState).mockReturnValue('running');
    await session.enableSound();
    expect(session.store.getState().sound).toBe('on');
    await session.finish('restore');
  });

  it('the saved volume is applied before playing', async () => {
    useAppStore.setState({ view: 'explore', instrument: 'piano', volume: 0.3 });
    const { session } = newSession();
    await playToEnd(session);
    expect(audio.setMasterVolume).toHaveBeenCalledWith(0.3);
    await session.finish('restore');
  });
});
