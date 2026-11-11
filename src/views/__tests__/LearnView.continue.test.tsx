/**
 * The seat's decision S-1 (final review of wave 2): Learn's Continue banner
 * follows the learner's track. A learner who came in by "new to music" or "I
 * play" is offered their track's first lesson not done, built from static data
 * (no level is downloaded for it). Once the track is finished, and for a
 * learner with no profile (the owner) or "I know some theory", Continue is
 * exactly what it was: the levels' next module (findNextModuleEntry). The
 * owner's whole overview is also compared with the recording made on
 * wave2/base in e2e/wave2-seams.spec.ts (seam 10).
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

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

const loads = vi.hoisted(() => ({ levels: [] as string[] }));
vi.mock('../../data/curriculumLoader', async (orig) => {
  const real = await orig<typeof import('../../data/curriculumLoader')>();
  return { ...real, loadLevel: (id: string, lang?: string) => { loads.levels.push(id); return real.loadLevel(id, lang as never); } };
});

import { LearnView } from '../LearnView';
import { useAppStore } from '../../state/store';
import { useProgressStore } from '../../state/progressStore';
import { useLearnSessionStore } from '../../state/learnSessionStore';
import { getDefaultProgress } from '../../data/curriculumLoader';
import { findNextModuleEntry } from '../../data/nextModule';
import { MODULE_INDEX } from '../../data/moduleIndex';
import type { LearnerProfile } from '../../state/storeTypes';

const title = (id: string) => MODULE_INDEX.find((m) => m.id === id)!.title;
const banner = () => screen.queryByText('Continue')?.closest('[class*="px-4"]') as HTMLElement | null;

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  loads.levels = [];
  useAppStore.setState({ language: 'en', view: 'learn', pendingLearnTarget: null, learnerProfile: null, selectedChord: null });
  useLearnSessionStore.setState({ screen: null, check: null });
});
afterEach(cleanup);

function show(profile: LearnerProfile | null, completedModules: string[]) {
  useAppStore.setState({ learnerProfile: profile });
  useProgressStore.setState({ progress: { ...getDefaultProgress(), completedModules } });
  render(<LearnView />);
}

describe('Continue follows the learner\'s track (S-1)', () => {
  const cases: [LearnerProfile, string[], string, string][] = [
    ['new', [], 'l1u34m1', 'Start with sound · Lesson 1'],
    ['new', ['l1u34m1', 'l1u34m2'], 'l1u34m3', 'Start with sound · Lesson 3'],
    ['player', [], 'l1u35m1', 'From the chords you know · Lesson 1'],
    // Out of order: the first lesson not done.
    ['player', ['l1u35m1', 'l1u35m3', 'l1u35m4'], 'l1u35m2', 'From the chords you know · Lesson 2'],
    // Level lessons done too: still the track first while it has a lesson left.
    ['new', ['l1u1m1', 'l1u1m2', 'l1u34m1'], 'l1u34m2', 'Start with sound · Lesson 2'],
  ];
  it.each(cases)('%s with %j: %s', async (profile, done, moduleId, context) => {
    show(profile, done);
    await waitFor(() => expect(banner()).not.toBeNull());
    expect(banner()!.querySelector('h3')!.textContent).toBe(title(moduleId));
    expect(banner()!.querySelector('p')!.textContent).toBe(context);
    // Static data only: no level was downloaded for it.
    expect(loads.levels).toEqual([]);
  });

  it('its tap opens that lesson', async () => {
    show('player', ['l1u35m1']);
    await waitFor(() => expect(banner()).not.toBeNull());
    fireEvent.click(banner()!);
    expect(await screen.findByRole('heading', { level: 1, name: title('l1u35m2') }, { timeout: 5000 })).toBeDefined();
  });
});

describe('Continue as before (the levels\' next module)', () => {
  const sound = ['l1u34m1', 'l1u34m2', 'l1u34m3', 'l1u34m4', 'l1u34m5'];
  const cases: [string, LearnerProfile | null, string[]][] = [
    ['the owner, nothing done', null, []],
    ['the owner, part of Level 2 done (and a track lesson)', null, ['l1u1m1', 'l1u1m2', 'l1u1m3', 'l1u2m1', 'l1u2m2', 'l1u2m3', 'l1u3m1', 'l1u3m2', 'l1u3m3', 'l1u3m4', 'l2u4m1', 'l1u35m2']],
    ['"I know some theory"', 'theory', ['l1u1m1']],
    ['a newcomer whose track is finished', 'new', sound],
  ];
  it.each(cases)('%s', async (_name, profile, done) => {
    show(profile, done);
    const want = findNextModuleEntry({ ...getDefaultProgress(), completedModules: done })!;
    await waitFor(() => expect(banner()?.querySelector('h3')?.textContent).toBe(want.title));
    expect(banner()!.querySelector('p')!.textContent).toMatch(/^Level \d/);
    expect(loads.levels).toContain(want.level);
  });
});
