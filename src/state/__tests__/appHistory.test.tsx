import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Menu } from '../../components/ui/Menu';
import { useState } from 'react';
import { useAppStore } from '../store';
import { useWelcomeStore } from '../welcomeGate';
import { clearDemoRequest, requestDemo } from '../demoRequest';
import { useToastStore } from '../toastStore';
import { pickBootView } from '../bootView';
import {
  activates,
  armForTests,
  backTo,
  currentEntry,
  goTo,
  isArmedForTests,
  onPageShow,
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
    useShowPlace('learn', (s) => seen.push(s ?? "(the tab)"));
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
  });

  it('an entry with no screen named is no screen of the view shown (review A10): it is shown as the tab would, not passed over', () => {
    const seen: string[] = [];
    render(<ShowLearn seen={seen} />);
    armForTests();
    act(() => useAppStore.getState().setView('learn')); // {learn} with no screen yet (a tab tapped and tapped back at once)
    goTo('learn', 'level/l1');
    pop({ fm: 1, i: 1, v: 'learn', l: 0 });
    expect(go).not.toHaveBeenCalled();
    expect(seen).toEqual(['(the tab)']);
  });

  it('an equal index is not Back nor Forward: landing on ours again from an entry the app did not write moves nothing (review A1)', () => {
    const seen: string[] = [];
    render(<ShowLearn seen={seen} />);
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    notePlace('learn', '');
    const here = currentEntry();
    pop(null as unknown as HistoryEntry); // the skip link's old entry, or any other
    pop(here);
    expect(go).not.toHaveBeenCalled();
    expect(seen).toEqual([]);
    // And an equal index without a foreign entry between: no bounce either.
    pop(here);
    expect(go).not.toHaveBeenCalled();
  });

  it('a fragment link\'s entry is rewritten as ours, under the next index, and the address keeps no fragment', () => {
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    notePlace('learn', '');
    window.history.pushState(null, '', '/#main-content'); // what a plain href="#…" does
    act(() => {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(window.history.state).toEqual({ fm: 1, i: 2, v: 'learn', s: '', l: 0 });
    expect(window.location.hash).toBe('');
    // Back from it shows nothing new: passed over.
    pop({ fm: 1, i: 1, v: 'learn', s: '', l: 0 });
    expect(go).toHaveBeenCalledWith(-1);
  });

  it('a traversal of the app\'s own holds every write until it lands (review A9: a replaceState landed on the wrong entry)', () => {
    armForTests();
    act(() => useAppStore.getState().setView('learn'));
    notePlace('learn', 'module/l1/u3/l1u3m4');
    let closed = 0;
    armForTests(false);
    const layer = render(<Sheetish open onClose={() => { closed += 1; }} />); // no entry of its own (no activation)
    pop({ fm: 1, i: 0, v: 'explore', l: 0 }); // Back: the layer closes, and the app goes back to entry 1
    expect(closed).toBe(1);
    expect(go).toHaveBeenLastCalledWith(1);
    (window.history.replaceState as unknown as ReturnType<typeof vi.fn>).mockClear();
    notePlace('learn', ''); // the screen changed meanwhile
    expect(window.history.replaceState).not.toHaveBeenCalled();
    pop({ fm: 1, i: 1, v: 'learn', s: 'module/l1/u3/l1u3m4', l: 0 }); // the hop lands
    expect(window.history.replaceState).toHaveBeenLastCalledWith({ fm: 1, i: 1, v: 'learn', s: '', l: 0 }, '');
    layer.unmount();
  });

  it('the app\'s own way back is Back to the screen\'s earlier entry in this view, when the tab has one; else it rewrites the entry', () => {
    armForTests();
    act(() => useAppStore.getState().setView('drill'));
    notePlace('drill', '');
    goTo('drill', 'settings');
    goTo('drill', 'mastery');
    backTo('drill', ''); // "← Mastery"
    expect(go).toHaveBeenLastCalledWith(-3 + 1);
    pop({ fm: 1, i: 1, v: 'drill', s: '', l: 0 });
    expect(currentEntry()).toMatchObject({ i: 1, s: '' });
    // Nothing earlier names it: the entry is rewritten.
    go.mockClear();
    backTo('drill', 'never-seen');
    expect(go).not.toHaveBeenCalled();
    expect(currentEntry()).toMatchObject({ i: 1, s: 'never-seen' });
    // Another view between: rewritten, not traversed past it.
    act(() => useAppStore.getState().setView('learn'));
    notePlace('learn', '');
    armForTests();
    goTo('learn', 'level/l1');
    act(() => useAppStore.getState().setView('drill'));
    backTo('drill', '');
    expect(go).not.toHaveBeenCalled();
  });

  it('a reload keeps the place: the boot view is the entry\'s (a ?view= still wins), else the saved one', () => {
    const kept = { fm: 1, i: 3, v: 'drill', s: 'mastery', l: 0 };
    expect(pickBootView('', 'explore', kept)).toBe('drill');
    // Every view, Explore included: this tab on Explore while another tab moved on to Learn stays on Explore (review A5).
    for (const v of ['explore', 'learn', 'drill'] as const) {
      for (const last of ['explore', 'learn', 'drill'] as const) expect(pickBootView('', last, { fm: 1, i: 0, v, l: 0 }), `${v} over ${last}`).toBe(v);
    }
    expect(pickBootView('?view=learn', 'explore', kept)).toBe('learn');
    expect(pickBootView('', 'learn', null)).toBe('learn');
    expect(pickBootView('', 'learn', { v: 'home' })).toBe('learn');
    expect(pickBootView('', 'learn', 'drill')).toBe('learn');
  });
});

function Sheetish({ open, onClose }: { open: boolean; onClose: () => void }) {
  useBackLayer(open, onClose);
  return null;
}

describe('sheets and dialogs (layers)', () => {
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

  it('a "⋯" menu is one too (seen from here: Menu is in the entry bundle): Back closes it, as Escape does', () => {
    armForTests();
    render(<Menu label="More" items={[{ id: 'a', label: 'Settings', onSelect: () => undefined }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    expect(screen.queryByRole('menu')).not.toBeNull();
    expect(pushes().map((e) => e.l)).toEqual([1]);
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(go).not.toHaveBeenCalled();
    // Closed by its own item: gone without telling, and the next layer reuses its entry.
    armForTests(); // the next tap (a Back is no user activation)
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    expect(screen.queryByRole('menu')).toBeNull();
    render(<Sheetish open onClose={() => undefined} />);
    expect(pushes()).toHaveLength(2);
  });

  it('Forward onto an entry that shows nothing new, with none known beyond it: no traversal, nothing held — a sheet opened next gets its own entry', () => {
    armForTests();
    const first = render(<Sheetish open onClose={() => undefined} />);
    first.unmount(); // closed by its own control: its entry (1) stays
    pop({ fm: 1, i: 0, v: 'explore', l: 0 }); // Back: passed over
    go.mockClear();
    pop({ fm: 1, i: 1, v: 'explore', l: 1 }); // Forward onto it: nothing beyond
    expect(go).not.toHaveBeenCalled();
    armForTests();
    render(<Sheetish open onClose={() => undefined} />);
    render(<Sheetish open onClose={() => undefined} />);
    expect(pushes().map((e) => e.l)).toEqual([1, 2]);
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

describe('what arms a push (the HTML Standard\'s activation-triggering events, and less)', () => {
  it('a back/forward-cache restore (pageshow, persisted) disarms; a normal load arms nothing (review A12)', () => {
    armForTests(true);
    onPageShow(new PageTransitionEvent('pageshow', { persisted: true }));
    expect(isArmedForTests()).toBe(false);
    onPageShow(new PageTransitionEvent('pageshow', { persisted: false }));
    expect(isArmedForTests()).toBe(false);
    armForTests(true);
    onPageShow(new PageTransitionEvent('pageshow', { persisted: false }));
    expect(isArmedForTests()).toBe(true);
  });

  it('a trusted keydown, mousedown or a tap\'s pointerup activates; untrusted events, Escape, a modifier alone, a shortcut, a mouse\'s pointerup and touchend do not (the real events: e2e)', () => {
    const t = (e: Record<string, unknown>) => activates({ isTrusted: true, ...e } as Parameters<typeof activates>[0]);
    expect(t({ type: 'keydown', key: 'Enter' })).toBe(true);
    expect(t({ type: 'keydown', key: 'ArrowRight' })).toBe(true);
    expect(t({ type: 'mousedown' })).toBe(true);
    expect(t({ type: 'pointerup', pointerType: 'touch' })).toBe(true);
    expect(t({ type: 'pointerup', pointerType: 'pen' })).toBe(true);
    expect(activates({ isTrusted: false, type: 'keydown', key: 'Enter' })).toBe(false);
    expect(activates({ isTrusted: false, type: 'mousedown' })).toBe(false);
    for (const key of ['Escape', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'NumLock']) expect(t({ type: 'keydown', key }), key).toBe(false);
    expect(t({ type: 'keydown', key: 'ArrowLeft', altKey: true })).toBe(false); // the browser's Back
    expect(t({ type: 'keydown', key: '[', metaKey: true })).toBe(false);
    expect(t({ type: 'keydown', key: 'k', ctrlKey: true })).toBe(false);
    expect(t({ type: 'pointerup', pointerType: 'mouse' })).toBe(false);
    expect(t({ type: 'touchend' })).toBe(false);
    expect(t({ type: 'pointerdown', pointerType: 'touch' })).toBe(false);
    // jsdom's events are untrusted: none of them arms.
    armForTests(false);
    for (const e of [new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }), new MouseEvent('mousedown', { bubbles: true })]) window.dispatchEvent(e);
    expect(isArmedForTests()).toBe(false);
  });
});

describe('the active tab, menus and the tour', () => {
  function Shows({ view, seen }: { view: 'learn' | 'drill'; seen: string[] }) {
    useShowPlace(view, (s) => seen.push(s ?? '(the tab)'));
    return <button role="tab" data-tab={view} aria-selected="true">tab</button>;
  }

  it('tapping the selected Drill tab on a sub-screen opens Drill\'s first screen as a screen of its own (P10), through the keepers', () => {
    const seen: string[] = [];
    render(<><Shows view="drill" seen={seen} /><KeeperOf view="drill" text="Your Sprint is paused, with the time it had left." /></>);
    armForTests();
    act(() => useAppStore.getState().setView('drill'));
    goTo('drill', 'sprint');
    fireEvent.click(screen.getByRole('tab'));
    expect(seen).toEqual(['']);
    expect(currentEntry()).toMatchObject({ v: 'drill', s: '' });
    expect(pushes().at(-1)).toMatchObject({ s: '' });
    const [toast] = useToastStore.getState().toasts;
    expect(toast.message).toBe('Your Sprint is paused, with the time it had left.');
    toast.action!.onSelect();
    expect(go).toHaveBeenLastCalledWith(-1);
    // On its first screen already, the tab does nothing more.
    fireEvent.click(screen.getByRole('tab'));
    expect(seen).toEqual(['']);
  });

  it('a menu opened from the keyboard (ArrowDown on its button) is a layer too', () => {
    armForTests();
    render(<Menu label="More" items={[{ id: 'a', label: 'Settings', onSelect: () => undefined }]} />);
    fireEvent.keyDown(screen.getByRole('button', { name: 'More' }), { key: 'ArrowDown' });
    expect(screen.queryByRole('menu')).not.toBeNull();
    expect(pushes().map((e) => e.l)).toEqual([1]);
  });

  it('a menu closed by its own item is dropped before Back counts what is open (prune): Back then passes over its entry', () => {
    armForTests();
    render(<Menu label="More" items={[{ id: 'a', label: 'Settings', onSelect: () => undefined }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Settings' }));
    pop({ fm: 1, i: 0, v: 'explore', l: 0 });
    expect(go).toHaveBeenLastCalledWith(-1);
  });

  it('while the tour plays, only its own layer is written; when it ends elsewhere ("Stay here"), the entry follows the view shown', () => {
    armForTests();
    requestDemo('intro', 'menu');
    const sheet = render(<Sheetish open onClose={() => undefined} />);
    expect(pushes()).toEqual([]);
    sheet.unmount();
    function TourLayer() {
      useBackLayer(true, () => undefined, true);
      return null;
    }
    const tour = render(<TourLayer />);
    expect(pushes().map((e) => e.l)).toEqual([1]);
    act(() => useAppStore.getState().setView('drill')); // the tour's own screens: not written
    expect(currentEntry().v).toBe('explore');
    clearDemoRequest();
    tour.unmount(); // "Stay here": the tour ends on Drill
    expect(currentEntry()).toMatchObject({ v: 'drill' });
    expect(window.history.state).toMatchObject({ v: 'drill' });
  });
});

function KeeperOf({ view, text }: { view: 'learn' | 'drill'; text: string }) {
  useWorkKeeper(view, () => text);
  return null;
}

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
