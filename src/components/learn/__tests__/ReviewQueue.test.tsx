/**
 * Audit W9-20 (F-26): ReviewQueue had ~7 % line coverage. Behaviour in
 * English (the PT/ES wording is ledger W6-17, another batch).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import type { ModuleReviewSchedule } from '../../../core/types/exercise';

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
  return { m: proxy, motion: proxy };
});

import { ReviewQueue } from '../ReviewQueue';
import { getDefaultProgress } from '../../../data/curriculumLoader';

afterEach(cleanup);

const DAY = 24 * 60 * 60 * 1000;
const schedule = (nextInDays: number): ModuleReviewSchedule => ({
  completedAt: Date.now() - 10 * DAY,
  nextReviewAt: Date.now() + nextInDays * DAY,
  intervalLevel: 1,
  reviewCount: 1,
  lastReviewedAt: Date.now() - 3 * DAY,
});
const withSchedules = (s: Record<string, ModuleReviewSchedule>) => ({ ...getDefaultProgress(), reviewSchedules: s });

describe('ReviewQueue (W9-20)', () => {
  it('renders nothing before any module has a review schedule', () => {
    const { container } = render(<ReviewQueue progress={getDefaultProgress()} onStartReview={() => {}} />);
    expect(container.textContent).toBe('');
  });

  it('nothing due → "All caught up!" with the next review time', () => {
    render(<ReviewQueue progress={withSchedules({ l1u1m1: schedule(4) })} onStartReview={() => {}} />);
    expect(screen.getByText('All caught up!')).toBeTruthy();
    expect(screen.getByText(/Next review/)).toBeTruthy();
  });

  it('due modules are listed with a count; tapping one starts its review', () => {
    const onStartReview = vi.fn();
    render(
      <ReviewQueue
        progress={withSchedules({ l1u1m1: schedule(-1), l1u1m2: schedule(-2), l2u4m1: schedule(3) })}
        onStartReview={onStartReview}
      />,
    );
    expect(screen.getByText('Review Queue')).toBeTruthy();
    expect(screen.getByText('2')).toBeTruthy(); // the due count badge
    // Rows show the module's name since W6-17; the position is the tooltip.
    fireEvent.click(screen.getByTitle('Level 1 · Unit 1 · Module 2').closest('button, [role="button"]')!);
    expect(onStartReview).toHaveBeenCalledWith('l1u1m2');
    expect(screen.queryByTitle(/Level 2 · Unit 4/)).toBeNull(); // not yet due
  });

  it('shows at most five rows and says how many more are due', () => {
    const due = Object.fromEntries(['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1', 'l1u2m2', 'l1u2m3', 'l1u3m1'].map((id) => [id, schedule(-1)]));
    render(<ReviewQueue progress={withSchedules(due)} onStartReview={() => {}} />);
    expect(screen.getAllByTitle(/^Level 1 · Unit \d · Module \d$/)).toHaveLength(5);
    expect(screen.getByText('+2 more due for review')).toBeTruthy();
  });
});
