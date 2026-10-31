/**
 * Audit W9-20 (F-26): Learn's screen-to-screen navigation had no tests
 * (LearnView 0 %, UnitDetail 0 %, ReviewQueue ~7 % line coverage). These
 * walk the real LearnView with real curriculum data:
 *   overview → level → unit → module and back; the Level page's Continue
 *   banner; a deep link from Explore / search; and starting a review from
 *   the Review Queue — which opened a BLANK screen: LearnView derived the
 *   unit id "l1u1" from "l1u1m1", but unit ids are "u1".
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const hit = cache.get(tag);
    if (hit) return hit;
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
    useIsPresent: () => true,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});
vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});

import { LearnView } from '../LearnView';
import { useAppStore } from '../../state/store';
import { useProgressStore } from '../../state/progressStore';
import { getDefaultProgress } from '../../data/curriculumLoader';
import { L1_UNITS } from '../../core/constants/curriculumL1';

const UNIT1 = L1_UNITS[0];
const MOD1 = UNIT1.modules[0];
const MOD2 = UNIT1.modules[1];

const h1 = async (name: string) => screen.findByRole('heading', { level: 1, name }, { timeout: 5000 });

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  useAppStore.setState({ language: 'en', view: 'learn', pendingLearnTarget: null });
  useProgressStore.setState({ progress: getDefaultProgress() });
});
afterEach(cleanup);

describe('LearnView navigation (W9-20)', () => {
  it('overview → level → unit → module, then back the same way', async () => {
    render(<LearnView />);
    await h1('Learn Music Theory');

    fireEvent.click(screen.getByText('Foundations of Music Literacy').closest('button')!);
    await h1('Foundations of Music Literacy');

    const unitCard = screen.getAllByRole('button').find((b) => b.textContent?.includes('Unit 1') && b.textContent.includes(UNIT1.title))!;
    fireEvent.click(unitCard);
    await h1(UNIT1.title);

    fireEvent.click(screen.getAllByRole('button').find((b) => b.textContent?.includes(MOD1.title))!);
    await h1(MOD1.title);

    // Breadcrumb back: unit, then level, then the overview.
    fireEvent.click(within(screen.getByRole('navigation', { name: /breadcrumb/i })).getByText(UNIT1.title));
    await h1(UNIT1.title);
    fireEvent.click(within(screen.getByRole('navigation', { name: /breadcrumb/i })).getByText('Level 1'));
    await h1('Foundations of Music Literacy');
    fireEvent.click(within(screen.getByRole('navigation', { name: /breadcrumb/i })).getByText('Learn'));
    await h1('Learn Music Theory');
  });

  it('the Level page Continue banner opens the next module directly (W9-09, in situ)', async () => {
    useProgressStore.setState({ progress: { ...getDefaultProgress(), completedModules: [MOD1.id] } });
    render(<LearnView />);
    await h1('Learn Music Theory');
    fireEvent.click(screen.getByText('Foundations of Music Literacy').closest('button')!);
    await h1('Foundations of Music Literacy');
    const banner = screen.getByText(/^continue$/i).closest('button, [role="button"]') as HTMLElement;
    expect(banner.textContent).toContain(MOD2.title);
    fireEvent.click(banner);
    await h1(MOD2.title);
  });

  it('a deep link from Explore / search lands on the module', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: UNIT1.id, moduleId: MOD2.id } });
    render(<LearnView />);
    await h1(MOD2.title);
    expect(useAppStore.getState().pendingLearnTarget).toBeNull();
  });

  it('starting a review from the Review Queue opens that module in review mode (was a blank screen)', async () => {
    const day = 24 * 60 * 60 * 1000;
    useProgressStore.setState({
      progress: {
        ...getDefaultProgress(),
        completedModules: [MOD1.id],
        reviewSchedules: {
          [MOD1.id]: { completedAt: Date.now() - 3 * day, nextReviewAt: Date.now() - day, intervalLevel: 0, reviewCount: 0, lastReviewedAt: Date.now() - 3 * day },
        },
      },
    });
    render(<LearnView />);
    await h1('Learn Music Theory');
    expect(screen.getByText('Review Queue')).toBeTruthy();

    const row = screen.getByTitle('Level 1 · Unit 1 · Module 1').closest('button, [role="button"]') as HTMLElement;
    await act(async () => { fireEvent.click(row); });
    await h1(MOD1.title);
    expect(screen.getAllByText('Review').length).toBeGreaterThan(0); // the review badge
  }, 15_000);
});
