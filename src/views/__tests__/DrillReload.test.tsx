/**
 * W9b — a reload (an app update, the OS killing the page) resumes Drill
 * EXACTLY: the same question, in the same phase (its verdict still on
 * screen), the same counters, the same summary to come; a Sprint comes back
 * with the same questions, score and time left, and is never recorded twice.
 *
 * A "reload" here is a fresh module graph (vi.resetModules): new drill store
 * and view modules, the store rehydrating from localStorage — the same thing
 * a page load does. `pagehide` is fired first, as the browser does.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, within } from '@testing-library/react';
import { generateDrillBank } from '../../core/utils/drillBank';
import type { DrillFamily, DrillItem } from '../../core/types/drill';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const cached = cache.get(tag);
    if (cached) return cached;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

const BANK: DrillItem[] = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const CHOICE_FAMILIES: Record<DrillFamily, boolean> = {
  keysig: true, circle: true, degree: true, scale: false, interval: false, triad: false, seventh: false, roman: false, function: false, read: false,
};

type DrillStoreModule = typeof import('../../state/drillStore');
let store: DrillStoreModule['useDrillStore'];

/** Load the app's Drill modules afresh (a page load) and render the view. */
async function pageLoad() {
  vi.resetModules();
  const { DrillView } = await import('../DrillView');
  store = (await import('../../state/drillStore')).useDrillStore;
  render(<DrillView />);
}

/** The browser leaves the page (pagehide), then loads it again. */
async function reload() {
  act(() => {
    window.dispatchEvent(new Event('pagehide'));
  });
  cleanup();
  await pageLoad();
}

function currentItem(): DrillItem {
  const s = store.getState().activeSession!;
  const fb = s.feedback;
  return BY_ID.get(fb ? fb.itemId : s.queue[s.index])!;
}
function answer(correct: boolean) {
  const item = currentItem();
  if (item.answer.kind !== 'choice' || item.input.format !== 'choice') throw new Error('choice item expected');
  const right = item.answer.correct;
  const label = correct ? right : item.input.choices.find((c) => c !== right)!;
  fireEvent.click(screen.getByRole('button', { name: label }));
}
const choiceNames = () => {
  const item = currentItem();
  return item.input.format === 'choice' ? item.input.choices : [];
};

beforeEach(async () => {
  vi.useFakeTimers();
  localStorage.clear();
  await pageLoad();
  act(() => {
    store.getState().resetDrillData();
    store.getState().updateSettings({ families: CHOICE_FAMILIES, length: 12, newPerSession: 12 });
    store.getState().endSession();
    store.setState({ introDone: true }); // past the first-visit intro
  });
  cleanup();
  await pageLoad(); // a clean session with these settings
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  localStorage.clear();
});

describe('a running Drill session survives a reload exactly', () => {
  it('a wrong answer\'s verdict is still on screen after the reload, on the same question; Continue goes on; the summary counts every answer', async () => {
    expect(screen.getByText(/1 of 12/)).toBeTruthy();
    answer(true);
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByText(/2 of 12/)).toBeTruthy();
    answer(false);
    const question = currentItem().id;
    const choices = choiceNames();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();

    await reload();

    // Same question, its verdict (wrong → Continue + "Learn about this"), same number.
    expect(currentItem().id).toBe(question);
    expect(screen.getByText(/2 of 12/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
    for (const c of choices) expect(screen.getByRole('button', { name: c })).toBeTruthy();
    expect(store.getState().activeSession!.asked).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText(/3 of 12/)).toBeTruthy();
    expect(store.getState().activeSession!.feedback).toBeNull();

    // Another reload mid-question (answering): the same question again.
    const third = currentItem().id;
    await reload();
    expect(currentItem().id).toBe(third);
    expect(screen.getByText(/3 of 12/)).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();

    // Finish: the summary counts the answers from before the reloads too.
    for (let i = 3; i <= 12; i++) {
      answer(true);
      act(() => vi.advanceTimersByTime(600));
    }
    expect(screen.getByText('11 of 12 correct')).toBeTruthy();
    const topics = screen.getByRole('list', { name: 'Topics' });
    const asked = within(topics)
      .getAllByText(/^\d+\/\d+$/)
      .map((el) => Number(el.textContent!.split('/')[1]))
      .reduce((a, b) => a + b, 0);
    expect(asked).toBe(12);

    // A reload on the summary keeps it, breakdown included.
    await reload();
    expect(screen.getByText('11 of 12 correct')).toBeTruthy();
    expect(screen.getByRole('list', { name: 'Topics' })).toBeTruthy();
  });

  it('a correct answer\'s verdict resumes too, and auto-advances as it would have', async () => {
    answer(true);
    await reload();
    expect(screen.getByText(/1 of 12/)).toBeTruthy(); // the answered question, still on screen
    expect(store.getState().activeSession!.feedback?.correct).toBe(true);
    act(() => vi.advanceTimersByTime(600));
    expect(screen.getByText(/2 of 12/)).toBeTruthy();
    expect(store.getState().activeSession!.feedback).toBeNull();
  });
});

describe('a Sprint survives a reload exactly', () => {
  async function openSprint() {
    // Sprint needs ≥ 5 facts already known (review / byHeart).
    act(() => {
      const known = BANK.filter((i) => CHOICE_FAMILIES[i.family]).slice(0, 8);
      const items = Object.fromEntries(known.map((i) => [i.id, {
        card: { due: 0, stability: 5, difficulty: 5, elapsed_days: 0, scheduled_days: 5, reps: 3, lapses: 0, state: 2, learning_steps: 0 },
        history: [], tier: 'review' as const, introCorrectCount: 1,
      }]));
      store.setState({ items, sprintBests: {} });
    });
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sprint' }));
    expect(screen.getByText('60s')).toBeTruthy();
  }

  /** Answer the Sprint question on screen correctly (lap 0: pool[step], from the saved run). */
  function answerSprint() {
    const run = store.getState().sprint!;
    const item = BY_ID.get(run.pool[run.step % run.pool.length])!;
    if (item.answer.kind !== 'choice') throw new Error('choice item expected');
    fireEvent.click(screen.getByRole('button', { name: item.answer.correct }));
  }

  it('same run, same score, same time left after a reload; the score is recorded once, "New best!" shown', async () => {
    await openSprint();
    answerSprint();
    answerSprint();
    act(() => vi.advanceTimersByTime(7_000));
    expect(screen.getByText('53s')).toBeTruthy();
    expect(screen.getByText('2 correct')).toBeTruthy();
    const run = store.getState().sprint!;

    await reload();

    // Straight back into the Sprint: same seed / order, score, step and clock.
    expect(screen.getByText('53s')).toBeTruthy();
    expect(screen.getByText('2 correct')).toBeTruthy();
    expect(store.getState().sprint).toMatchObject({ seed: run.seed, pool: run.pool, step: 2, correct: 2, secondsLeft: 53 });

    answerSprint();
    act(() => vi.advanceTimersByTime(53_000));
    expect(screen.getByText('3 correct')).toBeTruthy();
    expect(screen.getByText('New best!')).toBeTruthy();
    const key = run.familiesKey;
    expect(store.getState().sprintBests[key]).toBe(3);
    expect(store.getState().sprint).toMatchObject({ secondsLeft: 0, recorded: true });

    // A reload on the score screen: the same screen, nothing recorded again.
    await reload();
    const recordSprint = vi.spyOn(store.getState(), 'recordSprint');
    expect(screen.getByText('3 correct')).toBeTruthy();
    expect(screen.getByText('New best!')).toBeTruthy();
    act(() => vi.advanceTimersByTime(5_000));
    expect(recordSprint).not.toHaveBeenCalled();

    // Done closes it: a reload is back to the normal Drill.
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(store.getState().sprint).toBeNull();
    await reload();
    expect(screen.queryByText('3 correct')).toBeNull();
  });

  it('"New best!" when the run beats the old best (the best is taken BEFORE the run — the live store value already includes this score)', async () => {
    await openSprint();
    act(() => store.setState({ sprintBests: { [store.getState().sprint!.familiesKey]: 1 } }));
    answerSprint();
    answerSprint();
    act(() => vi.advanceTimersByTime(60_000));
    expect(screen.getByText('2 correct')).toBeTruthy();
    expect(screen.getByText('New best!')).toBeTruthy();
  });

  it('✕ closes the run: nothing to resume', async () => {
    await openSprint();
    answerSprint();
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    expect(store.getState().sprint).toBeNull();
    await reload();
    expect(screen.queryByText(/^\d+s$/)).toBeNull();
  });
});
