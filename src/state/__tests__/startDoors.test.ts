/**
 * Wave 1: the start screen's doors (state/startDoors.ts — ONE function), the
 * start hint's rules (state/startHint.ts) and when the start screen is shown
 * (state/startGate.ts: a shared link wins; hidden during a tour).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../store';
import { WELCOME_KEY, bootWelcome, useWelcomeStore } from '../welcomeGate';
import { chooseStartDoor } from '../startDoors';
import {
  FIRST_LESSON, useStartHintStore, raiseStartHint, dismissStartHint, startFirstLesson,
} from '../startHint';
import { applyShareLinkRule, useStartScreenShown } from '../startGate';
import { noteBootAddress } from '../shareParams';
import { requestDemo, clearDemoRequest } from '../demoRequest';
import { getLearnerProfile } from '../learnerProfile';
import { MODULE_INDEX } from '../../data/moduleIndex';
import type { Chord } from '../../core/types/music';

/** Boot as main.tsx does: the boot address is noted (state/shareParams.ts), then the gate decides from storage. */
function bootAt(search: string): boolean {
  noteBootAddress(search);
  return bootWelcome(localStorage);
}

const G: Chord = { root: { natural: 'G', accidental: '' }, quality: 'major', notes: [] } as unknown as Chord;
const owed = () => useAppStore.getState().startHint;
const shown = () => useStartHintStore.getState().shown;

beforeEach(() => {
  localStorage.clear();
  clearDemoRequest();
  useAppStore.setState({
    view: 'explore', lastView: 'explore', instrument: 'piano', learnerProfile: null, startHint: null,
    selectedChord: null, lessonLoan: null, pendingLearnTarget: null,
  });
  useStartHintStore.setState({ shown: null });
  localStorage.clear();
  useWelcomeStore.setState({ open: false, shownThisPage: false });
});

/** A first visit as boot sees it: empty storage, then the gate decides. */
function firstVisit(search = '') {
  localStorage.clear();
  expect(bootAt(search)).toBe(true);
}

describe('the doors (chooseStartDoor)', () => {
  it.each([
    ['new', 'piano', 'new'],
    ['new', 'guitar', 'new'],
    ['player', 'guitar', 'player'],
    ['player', 'piano', 'player'],
    ['theory', 'guitar', null],
    ['theory', 'piano', null],
  ] as const)('%s with the %s: profile, instrument, flag seen, Explore, hint %s', (profile, instrument, hint) => {
    firstVisit();
    useAppStore.setState({ view: 'learn' });
    chooseStartDoor(profile, instrument, localStorage);
    expect(getLearnerProfile()).toBe(profile);
    expect(useAppStore.getState().instrument).toBe(instrument);
    expect(useAppStore.getState().view).toBe('explore');
    expect(useAppStore.getState().lastView).toBe('explore');
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    expect(useWelcomeStore.getState()).toMatchObject({ open: false, shownThisPage: true });
    expect(owed()).toBe(hint);
    expect(shown()).toBe(hint);
    // Saved: the next load knows.
    const saved = JSON.parse(localStorage.getItem('music-theory-app')!).state;
    expect(saved.learnerProfile).toBe(profile);
    expect(saved.instrument).toBe(instrument);
    expect(saved.startHint ?? null).toBe(hint);
  });

  it('after a door the gate never opens again (the next boot, with saved data)', () => {
    firstVisit();
    chooseStartDoor('player', 'guitar', localStorage);
    useWelcomeStore.setState({ open: false, shownThisPage: false });
    expect(bootAt('')).toBe(false);
  });
});

describe('the start hint', () => {
  it('✕ ends it for good, either kind', () => {
    for (const kind of ['new', 'player'] as const) {
      raiseStartHint(kind);
      dismissStartHint();
      expect(owed()).toBeNull();
      expect(shown()).toBeNull();
      expect(JSON.parse(localStorage.getItem('music-theory-app')!).state).not.toHaveProperty('startHint');
    }
  });

  it('"Start lesson 1 →" ends it and opens the first lesson of the course', () => {
    raiseStartHint('new');
    startFirstLesson();
    expect(owed()).toBeNull();
    expect(shown()).toBeNull();
    expect(useAppStore.getState().view).toBe('learn');
    expect(useAppStore.getState().pendingLearnTarget).toEqual(FIRST_LESSON);
    // Known positive: it really is the first module of the index.
    const first = MODULE_INDEX[0];
    expect(FIRST_LESSON).toEqual({ levelId: first.level, unitId: first.unitId, moduleId: first.id });
  });

  it('player: picking a chord in Explore is acting on it — no longer owed, but the line stays until Explore is left', () => {
    raiseStartHint('player');
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBeNull();
    expect(shown()).toBe('player'); // nothing jumps under the tap
    useAppStore.getState().setView('learn');
    expect(shown()).toBeNull();
    useAppStore.getState().setView('explore');
    expect(shown()).toBeNull();
  });

  it('player: a chord picked by a playing tour does not count', () => {
    raiseStartHint('player');
    requestDemo('intro');
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBe('player');
    clearDemoRequest();
  });

  it('new: a chord pick does not end it; leaving Explore while it is owed keeps it (it is Explore\'s hint, back on return)', () => {
    raiseStartHint('new');
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBe('new');
    useAppStore.getState().setView('drill');
    expect(shown()).toBe('new');
    expect(owed()).toBe('new');
  });

  it('a reload while owed shows it again (the shown state starts from the save)', async () => {
    raiseStartHint('player');
    const save = localStorage.getItem('music-theory-app')!;
    vi.resetModules();
    localStorage.setItem('music-theory-app', save);
    const fresh = await import('../startHint');
    expect(fresh.useStartHintStore.getState().shown).toBe('player');
  });

  it('nothing owed after a plain reload of someone who never chose a door', async () => {
    vi.resetModules();
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'explore' }, version: 6 }));
    const fresh = await import('../startHint');
    expect(fresh.useStartHintStore.getState().shown).toBeNull();
  });
});

describe('when the start screen shows (startGate)', () => {
  it('a shared link in the boot address wins: not shown this visit, still owed (pending) for the next plain one', () => {
    firstVisit('?key=D&scale=dorian');
    expect(applyShareLinkRule()).toBe(true);
    expect(useWelcomeStore.getState()).toMatchObject({ open: false, shownThisPage: false });
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    // Next plain visit: this visit saved settings, but the flag says it is owed.
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'explore' }, version: 6 }));
    expect(bootAt('')).toBe(true);
    expect(applyShareLinkRule()).toBe(false);
    expect(useWelcomeStore.getState().open).toBe(true);
  });

  it('a shared-link visitor who then really uses the app (progress saved) is a returning learner: the next plain visit does not show it', () => {
    firstVisit('?key=D&scale=dorian');
    expect(applyShareLinkRule()).toBe(true);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    // Weeks in Learn and Drill since.
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { lastView: 'learn' }, version: 6 }));
    localStorage.setItem('music-theory-progress', JSON.stringify({ state: {}, version: 1 }));
    expect(bootAt('')).toBe(false);
    expect(applyShareLinkRule()).toBe(false);
    expect(useWelcomeStore.getState().open).toBe(false);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
  });

  it.each(['', '?view=drill', '?foo=1'])('no shared link (%s): shown', (search) => {
    firstVisit(search);
    expect(applyShareLinkRule()).toBe(false);
    expect(useWelcomeStore.getState().open).toBe(true);
  });

  it('with saved data a shared link changes nothing (no flag written)', () => {
    localStorage.setItem('music-theory-progress', '{}');
    expect(bootAt('?chord=G')).toBe(false);
    expect(applyShareLinkRule()).toBe(false);
    expect(localStorage.getItem(WELCOME_KEY)).toBeNull();
  });

  it('hidden while a tour is requested; back when the request clears and no door was chosen', () => {
    firstVisit();
    const { result } = renderHook(() => useStartScreenShown());
    expect(result.current).toBe(true);
    act(() => requestDemo('intro'));
    expect(result.current).toBe(false);
    expect(useWelcomeStore.getState().open).toBe(true); // still owed
    act(() => clearDemoRequest());
    expect(result.current).toBe(true);
    act(() => chooseStartDoor('theory', 'piano', localStorage));
    expect(result.current).toBe(false);
    act(() => { requestDemo('intro'); clearDemoRequest(); });
    expect(result.current).toBe(false);
  });
});
