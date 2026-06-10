import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, type ActiveSession, DEFAULT_SETTINGS } from '../../state/drillStore';
import { generateDrillBank } from '../../core/utils/drillBank';
import type { DrillFamily, DrillItem } from '../../core/types/drill';

// ── framer-motion → plain elements (mirrors sibling view tests) ───────────────
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  function makeMotion(tag: string) {
    return function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
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

// The runner memoizes generateDrillBank() at module level; it is deterministic,
// so a fresh call here is deep-equal (same ids + answers) and lets us look up
// the correct choice for whichever question is on screen.
const BANK: DrillItem[] = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));

// Only choice-format families — guarantees ChoiceChips renders for every
// question (UnsupportedInput never appears).
const CHOICE_FAMILIES: Record<DrillFamily, boolean> = {
  keysig: true,
  circle: true,
  degree: true,
  scale: false,
  interval: false,
  triad: false,
  seventh: false,
  roman: false,
  function: false,
};

function resetStore(length: 12 | 24 | 40 = 24) {
  useDrillStore.getState().resetDrillData();
  // High newPerSession so the initial queue fills to `length` deterministically
  // (a fresh store has no due/review items — only fresh ones populate the queue).
  useDrillStore.getState().updateSettings({
    families: CHOICE_FAMILIES,
    length,
    newPerSession: length,
  });
}

/** Read the answer.correct for the question currently on screen, then tap it. */
function answerCurrentCorrectly() {
  const session = useDrillStore.getState().activeSession!;
  const id = session.queue[session.index];
  const item = BY_ID.get(id)!;
  const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
  const btn = screen.getByRole('button', { name: correct });
  fireEvent.click(btn);
}

/** Read the current question's answer + return a WRONG choice to tap. */
function currentWrongChoice(): string {
  const session = useDrillStore.getState().activeSession!;
  const item = BY_ID.get(session.queue[session.index])!;
  const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
  const choices = item.input.format === 'choice' ? item.input.choices : [];
  return choices.find((c) => c !== correct)!;
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  useDrillStore.getState().resetDrillData();
  localStorage.clear();
});

beforeEach(() => {
  localStorage.clear();
  resetStore();
});

describe('DrillView — auto-start', () => {
  it('auto-starts a session on mount (null → active) and renders a question', () => {
    expect(useDrillStore.getState().activeSession).toBeNull();
    render(<DrillView />);
    const session = useDrillStore.getState().activeSession;
    expect(session).not.toBeNull();
    // A choice question is on screen: its group of chips renders.
    expect(screen.getByRole('group')).toBeDefined();
    // Progress shows "1 of 24".
    expect(screen.getByText(/1 of 24/)).toBeDefined();
  });
});

describe('DrillView — answering flow', () => {
  it('correct answer shows feedback, then auto-advances after 600ms', () => {
    vi.useFakeTimers();
    render(<DrillView />);

    const beforeId = useDrillStore.getState().activeSession!.queue[0];
    act(() => answerCurrentCorrectly());

    // Feedback strip: the "Correct" line is present.
    expect(screen.getByText('Correct')).toBeDefined();
    // Store recorded the answer.
    expect(useDrillStore.getState().activeSession!.asked).toBe(1);

    // Auto-advance fires after 600ms → feedback gone, next question shown.
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.queryByText('Correct')).toBeNull();
    // Progress advanced to question 2.
    expect(screen.getByText(/2 of 24/)).toBeDefined();
    const afterId = useDrillStore.getState().activeSession!.queue[useDrillStore.getState().activeSession!.index];
    expect(afterId).not.toBe(beforeId);
  });

  it('wrong answer holds feedback until Continue is tapped (no auto-advance)', () => {
    vi.useFakeTimers();
    render(<DrillView />);

    const wrong = currentWrongChoice();
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: wrong }));
    });

    // "Not quite" + a Continue button appear.
    expect(screen.getByText('Not quite')).toBeDefined();
    const cont = screen.getByRole('button', { name: 'Continue' });

    // Time passes — still on feedback (no auto-advance for wrong answers).
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('Not quite')).toBeDefined();

    // Continue advances to the next question.
    act(() => {
      fireEvent.click(cont);
    });
    expect(screen.queryByText('Not quite')).toBeNull();
    expect(screen.getByText(/2 of 24/)).toBeDefined();
  });
});

describe('DrillView — end session + summary', () => {
  it('end-session ✕ ends the session and shows the summary', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    expect(useDrillStore.getState().activeSession).toBeNull();
    // Summary: "New session" button present.
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();
  });

  it('shows the summary after `length` questions are answered', () => {
    vi.useFakeTimers();
    resetStore(12);
    render(<DrillView />);

    // Answer 12 correctly, flushing each auto-advance.
    for (let i = 0; i < 12; i++) {
      act(() => answerCurrentCorrectly());
      act(() => {
        vi.advanceTimersByTime(600);
      });
    }

    expect(useDrillStore.getState().activeSession!.asked).toBe(12);
    // Summary score line renders (e.g. "12 of 12 correct").
    expect(screen.getByText(/of 12 correct/)).toBeDefined();
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();
  });

  it('New session resets and presents a fresh question', () => {
    render(<DrillView />);
    fireEvent.click(screen.getByRole('button', { name: 'End session' }));
    expect(screen.getByRole('button', { name: 'New session' })).toBeDefined();

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'New session' }));
    });
    expect(useDrillStore.getState().activeSession).not.toBeNull();
    expect(screen.getByRole('group')).toBeDefined();
    expect(screen.getByText(/1 of/)).toBeDefined();
  });
});

describe('DrillView — resume', () => {
  it('resumes an existing session at its stored index (no restart)', () => {
    // Pre-seed an active session positioned at index 3 with a known choice queue.
    const choiceIds = BANK.filter((i) => i.input.format === 'choice').slice(0, 8).map((i) => i.id);
    const session: ActiveSession = {
      id: 's-resume',
      queue: choiceIds,
      index: 3,
      asked: 3,
      correct: 2,
      startedAt: 1,
      seed: 1,
      missRequeues: {},
    };
    useDrillStore.setState({ activeSession: session, settings: { ...DEFAULT_SETTINGS, families: CHOICE_FAMILIES } });

    render(<DrillView />);

    // Did NOT restart: same session id, still at index 3.
    expect(useDrillStore.getState().activeSession!.id).toBe('s-resume');
    expect(useDrillStore.getState().activeSession!.index).toBe(3);
    // Question 4 is on screen (asked 3 → "4 of …").
    expect(screen.getByText(/4 of/)).toBeDefined();
    // It renders the 4th queued item's prompt.
    const expectedItem = BY_ID.get(choiceIds[3])!;
    const expectedChoices = expectedItem.input.format === 'choice' ? expectedItem.input.choices : [];
    for (const c of expectedChoices) {
      expect(screen.getByRole('button', { name: c })).toBeDefined();
    }
  });
});

describe('DrillView — instrument area absent', () => {
  it('does not render the instrument region inside the drill view subtree', () => {
    // DrillView itself must not contain any instrument area; AppShell gates it.
    const { container } = render(<DrillView />);
    expect(container.querySelector('[data-tour="play-note"]')).toBeNull();
  });
});
