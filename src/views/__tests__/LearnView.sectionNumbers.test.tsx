/**
 * Audit 2026-11-18, Q8: the lesson's section list repeated each concept's
 * number beside its numbered marker — "① 1 · The Five-Line Staff". The number
 * came from the app (`lesson.conceptItem` "{{n}} · {{title}}" as the label,
 * the same n in the marker), not from the content's titles. One number per
 * section now: the marker carries it, the words are the title; a screen
 * reader still hears the number (the marker is hidden from it, so the
 * button's name keeps "1 · The Five-Line Staff").
 *
 * Both places that list the sections: the laptop's rail and the phone's
 * picker (its button and its sheet), in EN, PT and ES. The public lesson
 * pages never used this label (src/site renders the concept titles alone).
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
import { getDefaultProgress, loadLevel } from '../../data/curriculumLoader';
import i18n from '../../i18n';

const realMatchMedia = window.matchMedia;
function screenWidth(laptop: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: laptop && query.includes('min-width: 1024px'),
    media: query, addEventListener: () => {}, removeEventListener: () => {}, onchange: null,
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  useAppStore.setState({ view: 'learn', pendingLearnTarget: null, learnerProfile: null, instrument: 'piano' });
  useProgressStore.setState({ progress: getDefaultProgress() });
  useLearnSessionStore.setState({ screen: null, check: null });
});
afterEach(async () => {
  cleanup();
  window.matchMedia = realMatchMedia;
  useAppStore.setState({ language: 'en' });
  await i18n.changeLanguage('en');
});

/** The visible words of a section button: its text without the marker. */
const words = (button: Element) => {
  const marker = button.querySelector('[aria-hidden="true"]');
  return { marker: marker?.textContent ?? '', text: (button.textContent ?? '').slice((marker?.textContent ?? '').length) };
};

describe('one number per section (audit Q8)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: the laptop's rail — the marker says 1, 2…, the words are the concept's title alone; the name keeps the number`, async () => {
      useAppStore.setState({ language: lang });
      await i18n.changeLanguage(lang);
      const level = (await loadLevel('l1', lang))!;
      const mod = level.units[0].modules.find((m) => m.id === 'l1u1m1')!;
      screenWidth(true);
      useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1' } });
      render(<LearnView />);
      await screen.findByRole('heading', { level: 1, name: mod.title }, { timeout: 5000 });
      const rail = screen.getByTestId('section-rail');
      mod.concepts.forEach((c, i) => {
        const button = rail.querySelector(`[data-section-link="c${i}"]`)!;
        expect(words(button)).toEqual({ marker: String(i + 1), text: c.title });
        expect(button.getAttribute('aria-label')).toBe(`${i + 1} · ${c.title}`);
      });
      // No section's words start with a number of its own.
      for (const b of rail.querySelectorAll('[data-section-link]')) expect(words(b).text).not.toMatch(/^\d+ · /);
    });
  }

  it('the phone\'s picker: its button and its sheet say the title once, the number in the marker only', async () => {
    const level = (await loadLevel('l1', 'en'))!;
    const mod = level.units[0].modules.find((m) => m.id === 'l1u1m1')!;
    screenWidth(false);
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1' } });
    useLearnSessionStore.setState({ screen: { kind: 'lesson', levelId: 'l1', unitId: 'u1', moduleId: 'l1u1m1', section: 'c0' } as never });
    render(<LearnView />);
    await screen.findByRole('heading', { level: 1, name: mod.title }, { timeout: 5000 });
    const picker = screen.getByTestId('section-picker');
    fireEvent.click(within(picker).getByRole('button', { name: /Choose a section/ }));
    const sheet = await screen.findByTestId('section-sheet');
    mod.concepts.forEach((c, i) => {
      const button = sheet.querySelector(`[data-section-link="c${i}"]`)!;
      expect(words(button)).toEqual({ marker: String(i + 1), text: c.title });
    });
  });
});
