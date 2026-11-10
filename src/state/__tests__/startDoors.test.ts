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
import * as startHint from '../startHint';
import { useStartHintStore, raiseStartHint, dismissStartHint } from '../startHint';
import { applyShareLinkRule, useStartScreenShown } from '../startGate';
import { noteBootAddress } from '../shareParams';
import { requestDemo, clearDemoRequest } from '../demoRequest';
import { getLearnerProfile } from '../learnerProfile';
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
  // Wave 2: 'new' opens lesson 1 of "Start with sound" (its hint still owed,
  // for the first visit to Explore); the other two open Explore.
  const SOUND_LESSON_1 = { levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m1' };
  it.each([
    ['new', 'piano', 'new', 'learn', SOUND_LESSON_1],
    ['new', 'guitar', 'new', 'learn', SOUND_LESSON_1],
    ['player', 'guitar', 'player', 'explore', null],
    ['player', 'piano', 'player', 'explore', null],
    ['theory', 'guitar', null, 'explore', null],
    ['theory', 'piano', null, 'explore', null],
  ] as const)('%s with the %s: profile, instrument, flag seen, hint %s, opens %s', (profile, instrument, hint, view, lesson) => {
    firstVisit();
    useAppStore.setState({ view: view === 'learn' ? 'explore' : 'learn' });
    chooseStartDoor(profile, instrument, localStorage);
    expect(getLearnerProfile()).toBe(profile);
    expect(useAppStore.getState().instrument).toBe(instrument);
    expect(useAppStore.getState().view).toBe(view);
    expect(useAppStore.getState().lastView).toBe(view);
    expect(useAppStore.getState().pendingLearnTarget).toEqual(lesson);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    expect(useWelcomeStore.getState()).toMatchObject({ open: false, shownThisPage: true });
    expect(owed()).toBe(hint);
    expect(shown()).toBe(hint);
    // Saved: the next load knows.
    const saved = JSON.parse(localStorage.getItem('music-theory-app')!).state;
    expect(saved.learnerProfile).toBe(profile);
    expect(saved.instrument).toBe(instrument);
    expect(saved.startHint ?? null).toBe(hint);
    expect(saved.lastView).toBe(view);
  });

  it('"new": the hint is still owed after the door, and shows the first time Explore opens (no lesson link)', () => {
    firstVisit();
    chooseStartDoor('new', 'piano', localStorage);
    expect(useAppStore.getState().view).toBe('learn');
    expect(owed()).toBe('new');
    expect(shown()).toBe('new');
    useAppStore.getState().setView('explore');
    expect(shown()).toBe('new');
    expect(startHint.startHintLesson('new')).toBeNull();
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

  it('one way into Learn, and only from the player hint: lesson 1 of the chords track, once it exists (wave 2)', () => {
    expect(Object.keys(startHint).sort()).toEqual(['dismissStartHint', 'followStartHintLesson', 'raiseStartHint', 'startHintLesson', 'useShownStartHint', 'useStartHintStore']);
    const withChords = new Set(['l1u35m1']);
    // Not written yet (this branch): no link, and following does nothing.
    expect(startHint.startHintLesson('player')).toBeNull();
    expect(startHint.startHintLesson('player', new Set())).toBeNull();
    raiseStartHint('player');
    startHint.followStartHintLesson();
    expect(useAppStore.getState().pendingLearnTarget).toBeNull();
    expect(useAppStore.getState().view).toBe('explore');
    expect(owed()).toBe('player');
    // Written: the link opens it and the hint is done.
    expect(startHint.startHintLesson('player', withChords)).toEqual({ levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m1' });
    expect(startHint.startHintLesson('new', withChords)).toBeNull();
    expect(startHint.startHintLesson(null, withChords)).toBeNull();
    startHint.followStartHintLesson(withChords);
    expect(useAppStore.getState().pendingLearnTarget).toEqual({ levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m1' });
    expect(useAppStore.getState().view).toBe('learn');
    expect(owed()).toBeNull();
    expect(shown()).toBeNull();
    // The 'new' hint never leads into Learn.
    useAppStore.setState({ view: 'explore', pendingLearnTarget: null });
    raiseStartHint('new');
    startHint.followStartHintLesson(withChords);
    expect(useAppStore.getState().pendingLearnTarget).toBeNull();
    expect(owed()).toBe('new');
  });

  it.each(['new', 'player'] as const)('%s: picking a chord in Explore is acting on it — no longer owed, but the line stays until Explore is left', (kind) => {
    raiseStartHint(kind);
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBeNull();
    expect(shown()).toBe(kind); // nothing jumps under the tap
    useAppStore.getState().setView('learn');
    expect(shown()).toBeNull();
    useAppStore.getState().setView('explore');
    expect(shown()).toBeNull();
  });

  it.each(['new', 'player'] as const)('%s: a chord picked by a playing tour does not count', (kind) => {
    raiseStartHint(kind);
    requestDemo('intro');
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBe(kind);
    clearDemoRequest();
  });

  // Final review (2026-11-10): a chord already selected (a menu tour's "Stay
  // here" keeps its D major) — the learner's next chord still ends the hint,
  // but nothing else does: not the chord staying selected while other
  // settings change, not taking the chord away.
  it.each(['new', 'player'] as const)('%s: with a chord already selected, the next chord picked ends it; nothing else does', (kind) => {
    const D = { ...G, root: { natural: 'D', accidental: '' } } as unknown as Chord;
    raiseStartHint(kind);
    requestDemo('intro', 'menu');
    useAppStore.getState().setSelectedChord(D); // the tour's chord, kept by "Stay here"
    clearDemoRequest();
    useAppStore.getState().setVolume(0.4);
    useAppStore.getState().setInstrument('guitar');
    expect(owed()).toBe(kind);
    useAppStore.getState().setSelectedChord(G); // straight from D to G
    expect(owed()).toBeNull();
    // Taking a chord away is not picking one.
    raiseStartHint(kind);
    useAppStore.getState().setSelectedChord(null);
    expect(owed()).toBe(kind);
  });

  it.each(['new', 'player'] as const)('%s: a chord a lesson shows (Learn borrowing the instrument) or one picked outside Explore does not count', (kind) => {
    raiseStartHint(kind);
    useAppStore.setState({ lessonLoan: { key: { natural: 'C', accidental: '' }, scale: 'major' } });
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBe(kind);
    useAppStore.setState({ lessonLoan: null, selectedChord: null });
    useAppStore.getState().setView('learn');
    useAppStore.getState().setSelectedChord(G);
    expect(owed()).toBe(kind);
    useAppStore.getState().setView('explore');
    expect(owed()).toBe(kind);
  });

  it.each(['new', 'player'] as const)('%s: leaving Explore while it is owed keeps it (it is Explore\'s hint, back on return)', (kind) => {
    raiseStartHint(kind);
    useAppStore.getState().setView('drill');
    expect(shown()).toBe(kind);
    expect(owed()).toBe(kind);
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
