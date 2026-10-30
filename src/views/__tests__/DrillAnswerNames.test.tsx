/**
 * Audit W1-10 (D-7) — Drill's "Not quite — …" line names the answer the way
 * the chips do: note names with ♯/♭/𝄪 and chord-quality names, never the
 * internal enum ("C# half_diminished7") or ASCII spellings ("G##").
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, DEFAULT_SETTINGS } from '../../state/drillStore';
import { generateDrillBank } from '../../core/utils/drillBank';
import type { DrillItem } from '../../core/types/drill';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  const make = (tag: string) => {
    if (cache.has(tag)) return cache.get(tag)!;
    const C = (props: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      return React.createElement(tag, clean);
    };
    cache.set(tag, C);
    return C;
  };
  const proxy = new Proxy({}, { get: (_t: unknown, p: string) => make(p) });
  return { motion: proxy, m: proxy, useReducedMotion: () => false, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

const BANK: DrillItem[] = generateDrillBank();

afterEach(() => {
  cleanup();
  useDrillStore.getState().resetDrillData();
  localStorage.clear();
});

function startWith(id: string) {
  useDrillStore.setState({
    settings: { ...DEFAULT_SETTINGS, sound: false },
    activeSession: { id: 's-names', queue: [id], index: 0, asked: 0, correct: 0, startedAt: 1, seed: 1, missRequeues: {} },
  });
  render(<DrillView />);
}

describe('W1-10 — Drill names the answer like the chips', () => {
  it('a missed C♯ half-diminished 7th reads "C♯ Half-Diminished 7th"', () => {
    const item = BANK.find((i) => i.answer.kind === 'rootQuality' && i.answer.root === 'C#' && i.answer.quality === 'half_diminished7')!;
    expect(item).toBeDefined();
    startWith(item.id);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'C♯' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Minor 7th' })));
    const text = document.body.textContent ?? '';
    expect(text).toContain(' — C♯ Half-Diminished 7th');
    expect(text).not.toContain('half_diminished7');
  });

  it('a missed spelling item shows ♯/𝄪 glyphs, not ASCII', () => {
    const item = BANK.find((i) => i.answer.kind === 'notes' && i.answer.notes.some((n) => n.endsWith('##')))!;
    expect(item).toBeDefined();
    startWith(item.id);
    // Tap any wrong chips until the item grades (count = answer length).
    const want = item.answer.kind === 'notes' ? item.answer.notes : [];
    const chips = screen.getAllByRole('button').filter((b) => b.closest('[role="group"]'));
    let tapped = 0;
    for (const chip of chips) {
      if (tapped >= want.length) break;
      act(() => fireEvent.click(chip));
      tapped++;
    }
    const text = document.body.textContent ?? '';
    expect(text).toContain('𝄪');
    expect(text).not.toMatch(/[A-G]##/);
  });
});
