import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { useState } from 'react';
import { useAppStore } from '../store';
import { useWelcomeStore } from '../welcomeGate';
import { clearDemoRequest, requestDemo } from '../demoRequest';
import { useToastStore } from '../toastStore';
import { pickBootView } from '../bootView';
import {
  armForTests,
  currentEntry,
  goTo,
  isHistoryEntry,
  notePlace,
  placeToOpen,
  resetAppHistoryForTests,
  useBackLayer,
  useShowPlace,
  useWorkKeeper,
  type HistoryEntry,
} from '../appHistory';
import { learnPlace, learnScreenOf } from '../../views/learnPlaces';

/**
 * The browser's Back and Forward inside the app (audit P3, the owner's ruling
 * of 18 November 2026): the model in state/appHistory.ts. jsdom's history is
 * real for pushState / replaceState / state; a Back is the popstate the
 * browser would fire, dispatched with the state of the entry it lands on, and
 * `history.go` (the model passing over an entry that shows nothing new) is
 * observed, not run.
 */

const pushes = () => (window.history.pushState as unknown as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[0] as HistoryEntry);
const pop = (state: HistoryEntry) => act(() => {
  window.dispatchEvent(new PopStateEvent('popstate', { state }));
});

let go: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  useAppStore.setState({ view: 'explore', lastView: 'explore', pendingLearnTarget: null });
  useWelcomeStore.setState({ open: false });
  clearDemoRequest();
  window.history.replaceState(null, '', '/');
  resetAppHistoryForTests();
  vi.spyOn(window.history, 'pushState');
  vi.spyOn(window.history, 'replaceState');
  go = vi.spyOn(window.history, 'go').mockImplementation(() => undefined);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  useToastStore.setState({ toasts: [] });
  useAppStore.setState(useAppStore.getInitialState(), true);
});

describe('entries', () => {
  it('a view the learner opens is a new entry; without a user activation it rewrites the entry instead (Chromium skips a document that adds entries without one)', () => {
    armForTests(false);
    act(() => useAppStore.getState().setView('learn'));
    expect(pushes()).toEqual([]);
    expect(window.history.state).toMatchObject({ fm: 1, i: 0, v: 'learn' });
    armForTests(true);
    act(() => useAppStore.getState().setView('drill'));
    expect(pushes()).toEqual([{ fm: 1, i: 1, v: 'drill', s: undefined, l: 0 }]);
    expect(window.history.state).toEqual({ fm: 1, i: 1, v: 'drill', l: 0 });
    // The address stays the app's own.
    expect(window.location.pathname).toBe('/');
  });

  it('a deep link is ONE entry naming its lesson (Quick Search, "Learn about this", Drill\'s family link)', () => {
    armForTests();
    act(() => useAppStore.getState().openLearnTarget({ levelId: 'l2', unitId: 'u5', moduleId: 'l2u5m3' }));
    expect(pushes()).toEqual([{ fm: 1, i: 1, v: 'learn', s: 'module/l2/u5/l2u5m3', l: 0 }]);
  });

  it('the same screen writes nothing; a view naming its screen rewrites the entry (no new one)', () => {
    armForTests();
    goTo('learn', '');
    goTo('learn', '');
    expect(pushes()).toHaveLength(1);
    notePlace('learn', 'level/l1');
    expect(pushes()).toHaveLength(1);
    expect(window.history.state).toMatchObject({ i: 1, v: 'learn', s: 'level/l1' });
    // A report from a view that is not the entry's is not written.
    notePlace('drill', 'mastery');
    expect(window.history.state).toMatchObject({ v: 'learn', s: 'level/l1' });
  });

  it('while the start screen is owed a door rewrites the entry (the start screen never shows again)', () => {
    armForTests();
    useWelcomeStore.setState({ open: true });
    act(() => useAppStore.getState().setView('learn'));
    expect(pushes()).toEqual([]);
    expect(window.history.state).toMatchObject({ i: 0, v: 'learn' });
  });

  it('the tour writes nothing: its views come and go without an entry', () => {
    armForTests();
    requestDemo('intro', 'menu');
    act(() => useAppStore.getState().setView('drill'));
    notePlace('drill', 'settings');
    expect(pushes()).toEqual([]);
    expect(window.history.replaceState).not.toHaveBeenCalled();
    clearDemoRequest();
  });

  it('only our own states count as entries', () => {
    expect(isHistoryEntry({ fm: 1, i: 0, v: 'learn', l: 0 })).toBe(true);
    expect(isHistoryEntry({ fm: 1, i: 0, v: 'learn', s: 'module/l1/u1/l1u1m1', l: 2 })).toBe(true);
    for (const v of [null, {}, { fm: 1, i: 0, v: 'home', l: 0 }, { fm: 2, i: 0, v: 'learn', l: 0 }, { fm: 1, i: 'x', v: 'learn', l: 0 }, { fm: 1, i: 0, v: 'learn', s: 3, l: 0 }]) {
      expect(isHistoryEntry(v)).toBe(false);
    }
  });
});

describe('Back and Forward', () => {
  function ShowLearn({ seen }: { seen: string[] }) {
    useShowPlace('learn', (s) => seen.push(s));
    return null;
  }

  it('Back to another view shows it, and the view opens the screen the entry names (placeToOpen)', () => {
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    notePlace('learn', 'level/l2');
    act(() => useAppStore.getState().setView('drill'));
    expect(pushes()).toHaveLength(2);
    pop({ fm: 1, i: 1, v: 'learn', s: 'level/l2', l: 0 });
    expect(useAppStore.getState().view).toBe('learn');
    expect(placeToOpen('learn')).toBe('level/l2');
    // A popstate is no user activation: nothing it causes is pushed.
    expect(pushes()).toHaveLength(2);
    // Another navigation forgets the place to open at.
    armForTests();
    goTo('learn', '');
    expect(placeToOpen('learn')).toBeUndefined();
  });

  it('Back within the view shown asks the view (useShowPlace)', () => {
    const seen: string[] = [];
    render(<ShowLearn seen={seen} />);
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    goTo('learn', '');
    goTo('learn', 'level/l1');
    pop({ fm: 1, i: 1, v: 'learn', s: '', l: 0 });
    expect(seen).toEqual(['']);
    expect(go).not.toHaveBeenCalled();
  });

  it('an entry that shows nothing new is passed over in the direction of travel (at the first entry, Back leaves)', () => {
    armForTests();
    goTo('learn', undefined);
    notePlace('learn', '');
    pop({ fm: 1, i: 0, v: 'learn', s: '', l: 0 });
    expect(go).toHaveBeenCalledWith(-1);
    pop({ fm: 1, i: 1, v: 'learn', l: 0 }); // the view decides: nothing new either
    expect(go).toHaveBeenLastCalledWith(1);
  });

  it('a reload keeps the place: the boot view is the entry\'s (a ?view= still wins), else the saved one', () => {
    const kept = { fm: 1, i: 3, v: 'drill', s: 'mastery', l: 0 };
    expect(pickBootView('', 'explore', kept)).toBe('drill');
    expect(pickBootView('?view=learn', 'explore', kept)).toBe('learn');
    expect(pickBootView('', 'learn', null)).toBe('learn');
    expect(pickBootView('', 'learn', { v: 'home' })).toBe('learn');
    expect(pickBootView('', 'learn', 'drill')).toBe('learn');
  });
});

describe('sheets and dialogs (layers)', () => {
  function Sheetish({ open, onClose }: { open: boolean; onClose: () => void }) {
    useBackLayer(open, onClose);
    return null;
  }
  function Two() {
    const [a, setA] = useState(true);
    const [b, setB] = useState(true);
    return (
      <>
        <Sheetish open={a} onClose={() => setA(false)} />
        {a && <span data-testid="a" />}
        <Sheetish open={b} onClose={() => setB(false)} />
        {b && <span data-testid="b" />}
      </>
    );
  }

  it('each one opened by the learner is an entry; Back closes the top one first and moves nowhere else', () => {
    armForTests();
    const view = render(<Two />);
    expect(pushes().map((e) => e.l)).toEqual([1, 2]);
    pop({ fm: 1, i: 1, v: 'explore', l: 1 });
    expect(view.queryByTestId('b')).toBeNull();
    expect(view.queryByTestId('a')).not.toBeNull();
    expect(useAppStore.getState().view).toBe('explore');
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    expect(view.queryByTestId('a')).toBeNull();
    expect(go).not.toHaveBeenCalled();
  });

  it('one closed by itself leaves its entry, which the next one reuses (and StrictMode\'s second mount pushes nothing)', () => {
    armForTests();
    const one = render(<Sheetish open onClose={() => undefined} />);
    one.unmount();
    render(<Sheetish open onClose={() => undefined} />);
    expect(pushes()).toHaveLength(1);
  });

  it('a layer with no entry of its own (opened without a user activation): Back closes it and returns to the entry it was on', () => {
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    armForTests(false);
    let closed = 0;
    render(<Sheetish open onClose={() => { closed += 1; }} />);
    expect(pushes()).toHaveLength(1);
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    expect(closed).toBe(1);
    expect(useAppStore.getState().view).toBe('learn');
    expect(go).toHaveBeenCalledWith(1);
    // Its return is ours: nothing more happens.
    pop({ fm: 1, i: 1, v: 'learn', l: 0 });
    expect(closed).toBe(1);
  });

  it('Forward never reopens a closed one', () => {
    armForTests();
    let closed = 0;
    render(<Sheetish open onClose={() => { closed += 1; }} />);
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    expect(closed).toBe(1);
    pop({ fm: 1, i: 1, v: 'explore', l: 1 });
    expect(closed).toBe(1);
  });
});

describe('work in progress', () => {
  function Keeper({ text }: { text: string | null }) {
    useWorkKeeper('drill', text === null ? null : (to) => (to.v === 'drill' ? null : text));
    return null;
  }

  it('leaving it by Back says it is kept, with Continue (Forward); its own screen does not', () => {
    armForTests();
    act(() => useAppStore.getState().setView('drill'));
    render(<Keeper text="Your Drill session is kept, on the question you were on." />);
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    const [toast] = useToastStore.getState().toasts;
    expect(toast.message).toBe('Your Drill session is kept, on the question you were on.');
    expect(toast.action?.label).toBe('Continue');
    toast.action!.onSelect();
    expect(go).toHaveBeenCalledWith(1);
  });

  it('nothing is said when there is nothing kept, or when Back stays on its screen', () => {
    armForTests();
    act(() => useAppStore.getState().setView('drill'));
    goTo('drill', 'settings');
    render(<Keeper text="kept" />);
    pop({ fm: 1, i: 1, v: 'drill', s: '', l: 0 });
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('the toast goes when the learner moves on (its way back would no longer be next door)', () => {
    armForTests();
    act(() => useAppStore.getState().setView('drill'));
    render(<Keeper text="kept" />);
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    expect(useToastStore.getState().toasts).toEqual([]);
  });
});

describe('Learn\'s places', () => {
  it('every screen round-trips; ids the curriculum lacks are refused', () => {
    const screens = [
      { type: 'levels' as const },
      { type: 'level' as const, levelId: 'l2' },
      { type: 'unit' as const, levelId: 'l1', unitId: 'u34' },
      { type: 'module' as const, levelId: 'l2', unitId: 'u5', moduleId: 'l2u5m3', run: false },
      { type: 'module' as const, levelId: 'l2', unitId: 'u5', moduleId: 'l2u5m3', run: true },
      { type: 'review' as const, levelId: 'l1', unitId: 'u2', moduleId: 'l1u2m1' },
    ];
    for (const s of screens) expect(learnScreenOf(learnPlace(s))).toEqual(s);
    expect(learnPlace({ type: 'module', levelId: 'l2', unitId: 'u5', moduleId: 'l2u5m3', run: true })).toBe('module/l2/u5/l2u5m3/run');
    for (const bad of ['level/l99', 'unit/l1/u99', 'module/l1/u2/l2u5m3', 'module/l2/u5/l2u5m3/again', 'review/l1/u2/l1u2m1/run', 'lesson/l1', 'level/l1/u1/x/y/z']) {
      expect(learnScreenOf(bad), bad).toBeNull();
    }
  });
});

it('the entry on screen is kept in step with history.state', () => {
  armForTests();
  goTo('drill', '');
  expect(currentEntry()).toEqual(window.history.state);
});
