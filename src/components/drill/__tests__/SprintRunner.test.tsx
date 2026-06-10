import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { SprintRunner } from '../SprintRunner';
import { useDrillStore } from '../../../state/drillStore';
import { DRILL_FAMILIES } from '../../../core/types/drill';
import type { DrillFamily, DrillItem, ItemSrsState, MasteryTier } from '../../../core/types/drill';

// framer-motion → plain elements (ChoiceChips uses m.button under DrillInput).
// Component type per tag must be cached so inputs keep local state across renders.
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

// ── Fixtures ──────────────────────────────────────────────────────────────────

let counter = 0;
/** Choice item whose correct answer is a unique, clickable label. */
function makeChoiceItem(id: string, family: DrillFamily): DrillItem {
  const correct = `OK${counter++}`;
  return {
    id,
    family,
    promptKey: 'drill.progress', // any resolvable key; prompt text is irrelevant
    promptParams: { current: 1, total: 1 },
    input: { format: 'choice', choices: [correct, `NO${counter++}`] },
    answer: { kind: 'choice', correct },
    whyKey: 'drill.progress',
    whyParams: { current: 1, total: 1 },
    rank: 0,
  };
}

function makeState(tier: MasteryTier): ItemSrsState {
  return {
    card: { due: 0, stability: 1, difficulty: 5, elapsed_days: 0, scheduled_days: 1, reps: 1, lapses: 0, state: 2, learning_steps: 0 },
    history: [],
    tier,
    introCorrectCount: 1,
  };
}

const ALL_ON = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, true])) as Record<DrillFamily, boolean>;

/** A bank of N eligible (review-tier) triad items + matching states. */
function eligibleBank(n: number): { bank: DrillItem[]; items: Record<string, ItemSrsState> } {
  const bank: DrillItem[] = [];
  const items: Record<string, ItemSrsState> = {};
  for (let i = 0; i < n; i++) {
    const item = makeChoiceItem(`triad:${i}`, 'triad');
    bank.push(item);
    items[item.id] = makeState('review');
  }
  return { bank, items };
}

/** Click the correct answer for the question currently on screen. */
function answerCorrect(bank: DrillItem[]) {
  // The on-screen correct label is one of the items' correct answers; find the
  // button whose text matches any item's correct choice and is present.
  for (const item of bank) {
    if (item.answer.kind !== 'choice') continue;
    const btn = screen.queryByRole('button', { name: item.answer.correct });
    if (btn) {
      fireEvent.click(btn);
      return;
    }
  }
  throw new Error('no correct answer button on screen');
}

beforeEach(() => {
  counter = 0;
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('SprintRunner — empty state', () => {
  it('shows the empty-state (no run) when fewer than 5 items are eligible', () => {
    const { bank, items } = eligibleBank(4); // below MIN_SPRINT_ITEMS
    const onRecord = vi.fn();
    render(
      <SprintRunner
        bank={bank}
        items={items}
        families={ALL_ON}
        priorBest={0}
        onRecord={onRecord}
        onExit={() => {}}
      />,
    );
    expect(screen.getByText('Nothing mastered yet to sprint on')).toBeDefined();
    // No countdown started → no timeLeft text.
    expect(screen.queryByText(/^\d+s$/)).toBeNull();
    expect(onRecord).not.toHaveBeenCalled();
  });

  it('starts a run at exactly 5 eligible items (the boundary)', () => {
    vi.useFakeTimers();
    const { bank, items } = eligibleBank(5);
    render(
      <SprintRunner bank={bank} items={items} families={ALL_ON} priorBest={0} onRecord={vi.fn()} onExit={() => {}} />,
    );
    expect(screen.queryByText('Nothing mastered yet to sprint on')).toBeNull();
    expect(screen.getByText('60s')).toBeDefined();
  });
});

describe('SprintRunner — countdown + scoring', () => {
  it('counts the timer down and stops input + records on reaching 0', () => {
    vi.useFakeTimers();
    const { bank, items } = eligibleBank(6);
    const onRecord = vi.fn();
    render(
      <SprintRunner bank={bank} items={items} families={ALL_ON} priorBest={0} onRecord={onRecord} onExit={() => {}} />,
    );

    // Answer two questions correctly.
    act(() => answerCorrect(bank));
    act(() => answerCorrect(bank));

    // Run the full 60 seconds.
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    // Recorded once with the sorted families key + the score of 2.
    expect(onRecord).toHaveBeenCalledTimes(1);
    const [key, score] = onRecord.mock.calls[0];
    expect(key).toBe([...DRILL_FAMILIES].sort().join(','));
    expect(score).toBe(2);

    // Finished view: the score line is shown; inputs are gone (no answer group).
    expect(screen.getByText('2 correct')).toBeDefined();
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('shows "New best!" only when the score beats the prior best', () => {
    vi.useFakeTimers();
    const { bank, items } = eligibleBank(6);
    render(
      <SprintRunner bank={bank} items={items} families={ALL_ON} priorBest={5} onRecord={vi.fn()} onExit={() => {}} />,
    );
    // Answer one (score 1, below prior best 5).
    act(() => answerCorrect(bank));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.queryByText('New best!')).toBeNull();
    expect(screen.getByText('Best: 5')).toBeDefined();
  });

  it('records nothing on early ✕ exit', () => {
    vi.useFakeTimers();
    const { bank, items } = eligibleBank(6);
    const onRecord = vi.fn();
    const onExit = vi.fn();
    render(
      <SprintRunner bank={bank} items={items} families={ALL_ON} priorBest={0} onRecord={onRecord} onExit={onExit} />,
    );
    act(() => answerCorrect(bank));
    // Exit via the ✕ (aria-label "End session") before the timer ends.
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    expect(onExit).toHaveBeenCalledTimes(1);
    expect(onRecord).not.toHaveBeenCalled();
  });

  it('records nothing on Escape exit', () => {
    vi.useFakeTimers();
    const { bank, items } = eligibleBank(6);
    const onRecord = vi.fn();
    const onExit = vi.fn();
    render(
      <SprintRunner bank={bank} items={items} families={ALL_ON} priorBest={0} onRecord={onRecord} onExit={onExit} />,
    );
    act(() => {
      fireEvent.keyDown(window, { key: 'Escape' });
    });
    expect(onExit).toHaveBeenCalledTimes(1);
    expect(onRecord).not.toHaveBeenCalled();
  });
});

describe('SprintRunner — SRS store untouched', () => {
  it('leaves drillStore.items deep-equal before and after a full sprint', () => {
    vi.useFakeTimers();
    const { bank, items } = eligibleBank(6);
    // Seed the REAL store with these item states; SprintRunner must not write to them.
    useDrillStore.setState({ items: { ...items } });
    const before = structuredClone(useDrillStore.getState().items);

    render(
      <SprintRunner
        bank={bank}
        items={items}
        families={ALL_ON}
        priorBest={0}
        onRecord={(k, s) => useDrillStore.getState().recordSprint(k, s)}
        onExit={() => {}}
      />,
    );
    act(() => answerCorrect(bank));
    act(() => answerCorrect(bank));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });

    // recordSprint may write sprintBests, but items (the SRS rows) are untouched.
    expect(useDrillStore.getState().items).toEqual(before);
    // And the answers did NOT inflate the lifetime counters (no recordAnswer).
    expect(useDrillStore.getState().lifetime).toEqual({ answered: 0, correct: 0 });

    useDrillStore.getState().resetDrillData();
  });
});
