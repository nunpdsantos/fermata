/**
 * Learn's two Continue banners.
 *  W9-09  The Level page's banner names a module — it must open THAT module
 *         (it opened the unit list, one more tap away), as the overview's does.
 *  W9-10  Opening Learn must not download all nine levels just to show the
 *         overview banner: the next module comes from the static index and
 *         only its own level is loaded (for translated titles).
 *  W9-19  If that download fails (offline), the banner still shows — from the
 *         static index — instead of silently vanishing and showing a new
 *         learner the Welcome card; a stale load (language switched mid-way)
 *         never overwrites the current one; no unhandled rejection.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import type { CurriculumLevel } from '../../../core/types/curriculum';
import { L1_UNITS } from '../../../core/constants/curriculumL1';

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
    useIsPresent: () => true,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

type Loader = typeof import('../../../data/curriculumLoader');
const loader = vi.hoisted(() => ({
  loadLevel: vi.fn(),
  loadAllLevels: vi.fn(),
  original: null as null | Loader,
  restore() {
    this.loadLevel.mockReset();
    this.loadAllLevels.mockReset();
    this.loadLevel.mockImplementation(this.original!.loadLevel);
    this.loadAllLevels.mockImplementation(this.original!.loadAllLevels);
  },
}));
vi.mock('../../../data/curriculumLoader', async (importOriginal) => {
  const original = await importOriginal<Loader>();
  loader.original = original;
  loader.restore();
  return { ...original, loadLevel: loader.loadLevel, loadAllLevels: loader.loadAllLevels };
});

import { LevelsOverview } from '../LevelsOverview';
import { LevelDetail } from '../LevelDetail';
import { getDefaultProgress } from '../../../data/curriculumLoader';
import { useAppStore } from '../../../state/store';

const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 30)); });

const L1: CurriculumLevel = {
  id: 'l1', number: 1, title: 'Foundations of Music Literacy', description: '', difficulty: 'beginner',
  difficultyLabel: '', accentColor: '#3b82f6', prerequisites: [], units: L1_UNITS,
};

// Node's process (vitest runs in Node) — typed locally; the app tsconfig has no Node types.
const nodeProcess = (globalThis as unknown as {
  process: { on(e: string, f: (r: unknown) => void): void; off(e: string, f: (r: unknown) => void): void };
}).process;
let unhandled: unknown[] = [];
const onUnhandled = (reason: unknown) => { unhandled.push(reason); };

beforeEach(() => {
  unhandled = [];
  nodeProcess.on('unhandledRejection', onUnhandled);
  useAppStore.setState({ language: 'en' });
});
afterEach(() => {
  nodeProcess.off('unhandledRejection', onUnhandled);
  cleanup();
  loader.restore();
});

describe('Level page Continue banner (W9-09)', () => {
  it('opens the module it names, not the unit list', () => {
    const progress = getDefaultProgress();
    progress.completedModules = ['l1u1m1'];
    const onOpenUnit = vi.fn();
    const onOpenModule = vi.fn();
    render(
      <LevelDetail
        level={L1}
        progress={progress}
        isModuleCompleted={(id) => progress.completedModules.includes(id)}
        getUnitCompletedModuleCount={() => 0}
        onOpenUnit={onOpenUnit}
        onOpenModule={onOpenModule}
        onBack={() => {}}
      />,
    );
    const banner = screen.getByText(L1_UNITS[0].modules[1].title).closest('[role="button"], button')!;
    fireEvent.click(banner);
    expect(onOpenModule).toHaveBeenCalledWith(L1_UNITS[0].modules[1].id, L1_UNITS[0].id);
    expect(onOpenUnit).not.toHaveBeenCalled();
  });
});

describe('Learn overview Continue banner (W9-10, W9-19)', () => {
  const overview = (progress = getDefaultProgress()) => (
    <LevelsOverview progress={progress} onOpenLevel={() => {}} onOpenModule={() => {}} />
  );

  it('loads only the next module\'s level — not all nine', async () => {
    const progress = getDefaultProgress();
    progress.completedModules = L1_UNITS.flatMap((u) => u.modules.map((m) => m.id)); // L1 done → next is in L2
    render(overview(progress));
    expect(await screen.findByText(/^continue$/i, undefined, { timeout: 5000 })).toBeTruthy();
    expect(loader.loadAllLevels).not.toHaveBeenCalled();
    expect(loader.loadLevel.mock.calls.map((c) => c[0])).toEqual(['l2']);
  });

  it('a fresh learner sees the Continue banner for the first module', async () => {
    render(overview());
    expect(await screen.findByText(L1_UNITS[0].modules[0].title, undefined, { timeout: 5000 })).toBeTruthy();
    expect(screen.queryByText(/start level 1/i)).toBeNull();
  });

  it('offline: the level fails to load → the banner still shows (static index), no Welcome card, no unhandled rejection', async () => {
    const offline = new TypeError('Failed to fetch dynamically imported module');
    loader.loadLevel.mockRejectedValue(offline);
    loader.loadAllLevels.mockRejectedValue(offline);
    render(overview());
    await flush();
    expect(screen.getByText(/^continue$/i)).toBeTruthy();
    expect(screen.getByText(L1_UNITS[0].modules[0].title)).toBeTruthy();
    expect(screen.queryByText(/start level 1/i)).toBeNull();
    expect(unhandled).toEqual([]);
  });

  it('a stale load (language switched mid-download) never overwrites the current language', async () => {
    let resolveStale: (l: CurriculumLevel) => void = () => {};
    loader.loadLevel.mockImplementationOnce(() => new Promise((r) => { resolveStale = r; }));
    render(overview());
    act(() => useAppStore.setState({ language: 'pt' }));
    await screen.findByText(/^continue$/i, undefined, { timeout: 5000 }); // the PT load (real loader) resolved
    const ptTitle = screen.getByText(/^continue$/i).parentElement!.querySelector('h3')!.textContent;
    expect(ptTitle).toBeTruthy();
    expect(ptTitle).not.toBe(L1_UNITS[0].modules[0].title); // known positive: the PT overlay applied
    await act(async () => {
      resolveStale({ ...L1, units: [{ ...L1_UNITS[0], modules: [{ ...L1_UNITS[0].modules[0], title: 'STALE ENGLISH' }] }] });
    });
    expect(screen.queryByText('STALE ENGLISH')).toBeNull();
    expect(screen.getByText(/^continue$/i).parentElement!.querySelector('h3')!.textContent).toBe(ptTitle);
  });
});
