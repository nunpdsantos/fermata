/**
 * Wave 2: a starting track in the real LearnView, real curriculum data. The
 * overview's card opens the track's own page (its lessons in order, the next
 * one marked); a track lesson's breadcrumb names the track, not Level 1; its
 * Try This shows the notes by NAME (no staff anywhere), no "Songs" section;
 * the last lesson ends on the closing card (no next lesson), whose steps open
 * Level 1 and Explore. Level 1's page still lists its 4 units only.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const hit = cache.get(tag);
    if (hit) return hit;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy, m: proxy, useReducedMotion: () => false, useIsPresent: () => true,
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
import { useLearnSessionStore } from '../../state/learnSessionStore';
import { getDefaultProgress } from '../../data/curriculumLoader';
import { L1_UNITS } from '../../core/constants/curriculumL1';

const SOUND = L1_UNITS.find((u) => u.id === 'u34')!;
const h1 = async (name: string) => screen.findByRole('heading', { level: 1, name }, { timeout: 5000 });
const crumbs = () => within(screen.getByRole('navigation', { name: /breadcrumb/i }));

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  useAppStore.setState({ language: 'en', view: 'learn', pendingLearnTarget: null, learnerProfile: null, selectedChord: null });
  useProgressStore.setState({ progress: getDefaultProgress() });
  useLearnSessionStore.setState({ screen: null, check: null });
});
afterEach(cleanup);

describe('a track in Learn (wave 2)', () => {
  it('card → track page (lessons in order, the next marked) → lesson 1 (breadcrumb names the track; names, no staff; no Songs) → back', async () => {
    useProgressStore.setState({ progress: { ...getDefaultProgress(), completedModules: ['l1u34m1', 'l1u34m2'] } });
    render(<LearnView />);
    await h1('Learn Music Theory');
    fireEvent.click(screen.getByTestId('track-card-sound'));
    await h1('Start with sound');
    const page = screen.getByTestId('track-page-sound');
    expect(crumbs().getAllByText(/./).map((e) => e.textContent)).toEqual(['Learn', '/', 'Start with sound']);
    expect(within(page).getByTestId('track-progress').textContent).toBe('2 of 5 lessons');
    const rows = within(page).getAllByRole('listitem');
    expect(rows.map((r) => r.textContent?.includes(SOUND.modules[rows.indexOf(r)].title))).toEqual([true, true, true, true, true]);
    expect(rows.map((r) => r.getAttribute('data-next'))).toEqual([null, null, 'true', null, null]);
    expect(within(rows[2]).getByText('Next')).toBeDefined();
    // No lesson is shown locked.
    expect(page.querySelectorAll('rect')).toHaveLength(0);

    fireEvent.click(within(rows[0]).getByRole('button'));
    await h1('High and Low');
    expect(crumbs().queryByText('Level 1')).toBeNull();
    expect(crumbs().getByText('Start with sound')).toBeDefined();
    expect(crumbs().getByText('Lesson 1')).toBeDefined();
    // Every Try This shows the notes by name; no staff anywhere in the lesson.
    const tries = screen.getAllByTestId('inline-try-this');
    expect(tries).toHaveLength(4);
    expect(screen.getAllByTestId('try-this-names').map((n) => n.textContent)).toEqual([
      'ABCDEFGA', 'CC♯DD♯EFF♯GG♯AA♯BC', 'EF♯GABCDE', 'CDEFGABC',
    ]);
    expect(screen.queryAllByTestId('staff-mock')).toHaveLength(0);
    expect(within(tries[0]).getByRole('button', { name: 'Hear it' })).toBeDefined();
    expect(document.querySelector('[data-section="songs"]')).toBeNull();
    // Next lesson is the track's own.
    expect(screen.getByRole('button', { name: /Next lesson\s*The Seven Letters/ })).toBeDefined();

    fireEvent.click(crumbs().getByText('Start with sound'));
    await h1('Start with sound');
    fireEvent.click(crumbs().getByText('Learn'));
    await h1('Learn Music Theory');
  });

  it('the last lesson ends on the closing card, never on another unit; its steps open Level 1 and Explore', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m5' } });
    render(<LearnView />);
    await h1('Three Notes Make a Chord');
    expect(screen.queryByRole('button', { name: /Next lesson/ })).toBeNull();
    const ending = screen.getByTestId('track-ending');
    expect(within(ending).getByRole('heading', { level: 2 }).textContent).toBe('Where next?');
    expect(within(ending).getAllByRole('button').map((b) => b.textContent)).toEqual(['Play with these notes in Explore', 'Learn to read music: Level 1']);
    fireEvent.click(within(ending).getByRole('button', { name: 'Learn to read music: Level 1' }));
    await h1('Foundations of Music Literacy');
    // Level 1's page: its four units, not the track.
    expect(screen.queryByText('Start with sound')).toBeNull();
    expect(screen.getAllByRole('button').filter((b) => /Unit \d|Optional unit/.test(b.textContent ?? ''))).toHaveLength(4);
    expect(screen.getByText('0/10')).toBeDefined();
  });

  it('"Play with these notes in Explore" opens Explore on C major', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m5' } });
    render(<LearnView />);
    await h1('Three Notes Make a Chord');
    fireEvent.click(within(screen.getByTestId('track-ending')).getByRole('button', { name: 'Play with these notes in Explore' }));
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedKey).toEqual({ natural: 'C', accidental: '' });
    expect(s.selectedScale).toBe('major');
  });

  it('a guitar-notation lesson still has no closing card, and its last lesson still leads nowhere', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u33', moduleId: 'l1u33m3' } });
    render(<LearnView />);
    await h1('Guitar Notation: Positions and Barres');
    expect(screen.queryByTestId('track-ending')).toBeNull();
    expect(screen.queryByRole('button', { name: /Next lesson/ })).toBeNull();
    expect(crumbs().getByText('Level 1')).toBeDefined();
    // Not sound-first: the usual staff.
    expect((await screen.findAllByTestId('staff-mock')).length).toBeGreaterThan(0);
    expect(screen.queryAllByTestId('try-this-names')).toHaveLength(0);
  });
});

/**
 * A sound-first lesson opens with its first "Hear it" in reach: when the
 * button is cut off by the bottom of what the scroller shows — wholly below
 * it, or across its edge — the lesson opens at its first concept. jsdom has no
 * layout, so the boxes are given here; e2e/tracks.spec.ts measures the real
 * thing on one phone size.
 */
describe('a sound-first lesson opens with "Hear it" in reach', () => {
  type Box = { top: number; bottom: number };
  function layout(hear: Box) {
    const real = Element.prototype.getBoundingClientRect;
    const box = (b: Box) => ({ top: b.top, bottom: b.bottom, left: 0, right: 300, width: 300, height: b.bottom - b.top, x: 0, y: b.top, toJSON: () => ({}) }) as DOMRect;
    Element.prototype.getBoundingClientRect = function (this: Element) {
      if (this.matches('[data-learn-scroll]')) return box({ top: 0, bottom: 700 });
      if (this.matches('button') && this.closest('[data-section="c0"] [data-testid="inline-try-this"]')) return box(hear);
      return box({ top: 0, bottom: 0 });
    };
    return () => { Element.prototype.getBoundingClientRect = real; };
  }
  const openedAtFirstConcept = () =>
    (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mock.contexts.some((el) => (el as Element).getAttribute('data-section') === 'c0');

  for (const [name, hear, expected] of [
    ['wholly below the fold', { top: 760, bottom: 804 }, true],
    ['across the fold (top shown, bottom cut off)', { top: 680, bottom: 724 }, true],
    ['wholly in view', { top: 600, bottom: 644 }, false],
  ] as const) {
    it(`"Hear it" ${name}: ${expected ? 'opens at the first concept' : 'stays at the top'}`, async () => {
      (Element.prototype.scrollIntoView as ReturnType<typeof vi.fn>).mockClear();
      const restore = layout(hear);
      try {
        useAppStore.setState({ learnerProfile: 'new', pendingLearnTarget: { levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m1' } });
        render(<LearnView />);
        await h1(SOUND.modules[0].title);
        await new Promise((r) => requestAnimationFrame(() => r(null)));
        await new Promise((r) => setTimeout(r, 0));
        expect(openedAtFirstConcept()).toBe(expected);
      } finally {
        restore();
      }
    });
  }
});
