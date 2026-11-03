import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, DEFAULT_SETTINGS, DRILL_STORE_KEY } from '../../state/drillStore';
import { useAppStore } from '../../state/store';
import { playAnswerAudio } from '../../components/drill/answerAudio';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));
vi.mock('../../components/notation/StaffNotation', () => ({ StaffNotation: () => <div data-testid="staff" /> }));

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

const first = 'read:staff-to-fret:V:C5';
const second = 'read:staff-to-fret:open:C5';
const cell = (s: number, f: number) => document.querySelector<HTMLElement>(`[data-string-row="${s}"][data-fret="${f}"]`)!;
beforeEach(() => {
  localStorage.clear();
  useDrillStore.getState().resetDrillData();
  useDrillStore.setState({ settings: { ...DEFAULT_SETTINGS, sound: false }, activeSession: {
    id: 'reading-session', queue: [first, second], index: 0, asked: 0, correct: 0,
    startedAt: 1793613600000, seed: 42, missRequeues: {},
  } });
  useAppStore.setState({ view: 'drill' });
  vi.clearAllMocks();
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

it('tap → wrong verdict → reload the same question and reveal → Continue; right advances at 600 ms', async () => {
  render(<DrillView />);
  await screen.findByTestId('reading-board');
  expect(screen.getByText('Where is this note in position V?')).toBeDefined();
  fireEvent.click(cell(0, 5));
  expect(screen.getByText('Not quite')).toBeDefined();
  expect(cell(3, 5).dataset.answer).toBe('correct');
  expect(useDrillStore.getState().activeSession?.feedback?.itemId).toBe(first);
  expect(playAnswerAudio).not.toHaveBeenCalled();
  const saved = localStorage.getItem(DRILL_STORE_KEY)!;
  cleanup();
  useDrillStore.getState().resetDrillData();
  localStorage.setItem(DRILL_STORE_KEY, saved);
  await useDrillStore.persist.rehydrate();
  render(<DrillView />);
  await screen.findByTestId('reading-board');
  expect(screen.getByText('Not quite')).toBeDefined();
  expect(cell(3, 5).dataset.answer).toBe('correct');
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
  expect(screen.getByText(/Where is this note in the open position/)).toBeDefined();
  expect(document.querySelector('[data-answer]')).toBeNull();
  vi.useFakeTimers();
  fireEvent.click(cell(4, 1));
  expect(screen.getByText('Correct')).toBeDefined();
  expect(screen.queryByRole('button', { name: 'Continue' })).toBeNull();
  act(() => vi.advanceTimersByTime(599));
  expect(screen.getByText('Correct')).toBeDefined();
  act(() => vi.advanceTimersByTime(1));
  expect(screen.queryByText('Correct')).toBeNull();
  expect(useDrillStore.getState().activeSession?.log?.byFamily.read).toEqual({ asked: 2, correct: 1 });
});

it('a reading near miss never claims the spelling was wrong', async () => {
  useDrillStore.setState({ activeSession: { ...useDrillStore.getState().activeSession!, queue: [second, first] } });
  render(<DrillView />);
  await screen.findByTestId('reading-board');
  fireEvent.click(cell(1, 3)); // C3 instead of C4
  expect(screen.getByText(/Check octave or position/)).toBeDefined();
  expect(screen.queryByText(/wrong spelling/)).toBeNull();
  expect(useDrillStore.getState().activeSession?.feedback).toEqual({ itemId: second, correct: false, nearMiss: true });
});
