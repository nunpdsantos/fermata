/**
 * Wave 2, "From the chords you know" (u35) in the real LearnView, real data.
 * Lesson 1 opens under its track; its chord-list Try This shows the chords
 * (no staff), "Hear it" plays them in order once, a chord button shows that
 * chord on the instrument, "Open in Explore" asks for the Progression panel
 * with exactly those chords (`requestProgression`, the progression branch's
 * contract: nothing consumes it in this branch) and shows Explore. Every
 * other Try This writes its notes by name. Lesson 10 ends on the closing
 * card: the Progression panel with the learner's own progression, and Level 2.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within, waitFor } from '@testing-library/react';

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
const played = vi.hoisted(() => ({ timed: [] as { note: { natural: string; accidental: string; octave: number }; at: number }[][], chords: [] as string[][] }));
vi.mock('../../core/services/audio', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../core/services/audio')>();
  return {
    ...actual,
    resumeAudio: async () => {},
    cancelScheduledAudio: () => {},
    playTimedNotes: (notes: { note: { natural: string; accidental: string; octave: number }; at: number }[]) => { played.timed.push(notes); },
    playChordVoiced: (notes: { natural: string; accidental: string }[]) => { played.chords.push(notes.map((n) => `${n.natural}${n.accidental}`)); },
    playScale: () => {},
  };
});

import { LearnView } from '../LearnView';
import { useAppStore } from '../../state/store';
import { useProgressStore } from '../../state/progressStore';
import { useLearnSessionStore } from '../../state/learnSessionStore';
import { getDefaultProgress } from '../../data/curriculumLoader';
import { clearProgressionRequest, getProgressionRequest } from '../../state/progressionRequest';
import { buildChord } from '../../core/constants/chords';
import { getPitchClass } from '../../core/constants/notes';
import { stringToNote } from '../../core/types/music';

const h1 = async (name: string) => screen.findByRole('heading', { level: 1, name }, { timeout: 5000 });
const crumbs = () => within(screen.getByRole('navigation', { name: /breadcrumb/i }));

beforeAll(() => {
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  useAppStore.setState({ language: 'en', view: 'learn', pendingLearnTarget: null, learnerProfile: 'player', selectedChord: null, instrument: 'guitar' });
  useProgressStore.setState({ progress: getDefaultProgress() });
  useLearnSessionStore.setState({ screen: null, check: null });
  clearProgressionRequest();
  played.timed = [];
  played.chords = [];
});
afterEach(cleanup);

describe('"From the chords you know" in Learn (wave 2)', () => {
  it('the card opens the track page with its ten lessons; lesson 1 sits under the track, not Level 1', async () => {
    render(<LearnView />);
    await h1('Learn Music Theory');
    fireEvent.click(within(screen.getByTestId('tracks-start-here')).getByTestId('track-card-chords'));
    await h1('From the chords you know');
    const page = screen.getByTestId('track-page-chords');
    expect(within(page).getAllByRole('listitem')).toHaveLength(10);
    expect(within(page).getByTestId('track-progress').textContent).toBe('0 of 10 lessons');
    fireEvent.click(within(within(page).getAllByRole('listitem')[0]).getByRole('button'));
    await h1('Your Chords Live in a Key');
    expect(crumbs().queryByText('Level 1')).toBeNull();
    expect(crumbs().getByText('From the chords you know')).toBeDefined();
    expect(screen.getByRole('button', { name: /Next lesson\s*One, Four, Five/ })).toBeDefined();
  });

  it('lesson 1: the chord list shows its chords, sounds them once in order, shows one on the guitar, and opens them in the Progression panel', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m1' } });
    render(<LearnView />);
    await h1('Your Chords Live in a Key');
    const tries = screen.getAllByTestId('inline-try-this');
    expect(tries).toHaveLength(4);
    // No staff anywhere; the chord lists show chords, the others note names.
    expect(screen.queryAllByTestId('staff-mock')).toHaveLength(0);
    const lists = screen.getAllByTestId('try-this-chords');
    expect(lists.map((l) => within(l).getAllByRole('button').map((b) => b.textContent))).toEqual([['G', 'C', 'D', 'Em'], ['C', 'F', 'G', 'Am']]);
    expect(screen.getAllByTestId('try-this-names').map((n) => n.textContent)).toEqual(['GABCDEF♯G', 'GABCDEF♯G']);
    const first = tries[0];
    expect(within(first).queryByRole('button', { name: 'Show on the guitar' })).toBeNull();
    expect(within(first).getByRole('group', { name: 'The chords, in order' })).toBeDefined();

    // Hear it: each chord once, one per second, in order.
    fireEvent.click(within(first).getByRole('button', { name: 'Hear it' }));
    await waitFor(() => expect(played.timed).toHaveLength(1));
    const byTime = new Map<number, Set<number>>();
    for (const n of played.timed[0]) byTime.set(n.at, (byTime.get(n.at) ?? new Set()).add(getPitchClass(n.note as never)));
    expect([...byTime.keys()]).toEqual([0, 1, 2, 3]);
    const pcs = (s: string, q: 'major' | 'minor') => new Set(buildChord(stringToNote(s), q).notes.map(getPitchClass));
    expect([...byTime.values()]).toEqual([pcs('G', 'major'), pcs('C', 'major'), pcs('D', 'major'), pcs('E', 'minor')]);

    // A chord button: that chord on the guitar (selected) and sounding.
    fireEvent.click(within(first).getByRole('button', { name: 'Em: hear it and show it on the guitar' }));
    await waitFor(() => expect(played.chords).toEqual([['E', 'G', 'B']]));
    expect(useAppStore.getState().selectedChord).toMatchObject({ root: { natural: 'E', accidental: '' }, quality: 'minor' });
    expect(useAppStore.getState().view).toBe('learn');

    // Open in Explore: the Progression panel is asked for, with exactly these chords.
    expect(getProgressionRequest()).toBeNull();
    fireEvent.click(within(first).getByRole('button', { name: 'Open in Explore' }));
    expect(getProgressionRequest()).toEqual({ chords: ['G', 'C', 'D', 'Em'] });
    expect(useAppStore.getState().view).toBe('explore');
  });

  it('the twelve-bar Try This of lesson 7 asks for all twelve bars, in order', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m7' } });
    render(<LearnView />);
    await h1('The Seventh');
    const blues = screen.getAllByTestId('inline-try-this')[3];
    fireEvent.click(within(blues).getByRole('button', { name: 'Open in Explore' }));
    expect(getProgressionRequest()).toEqual({ chords: ['G7', 'G7', 'G7', 'G7', 'C7', 'C7', 'G7', 'G7', 'D7', 'C7', 'G7', 'D7'] });
  });

  it('lesson 10 ends on the closing card: the Progression panel (the learner\'s own progression) and Level 2', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m10' } });
    render(<LearnView />);
    await h1('A Chord from Outside');
    expect(screen.queryByRole('button', { name: /Next lesson/ })).toBeNull();
    const ending = screen.getByTestId('track-ending');
    expect(within(ending).getByText('You have reached the end of “From the chords you know”. Two ways to go on:')).toBeDefined();
    expect(within(ending).getAllByRole('button').map((b) => b.textContent)).toEqual(['Loop your own songs in the Progression panel', 'Go deeper: Level 2']);
    fireEvent.click(within(ending).getByRole('button', { name: 'Go deeper: Level 2' }));
    await h1('Expanding Fundamentals');
  });

  it('"Loop your own songs" asks for the panel with no chords and shows Explore', async () => {
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m10' } });
    render(<LearnView />);
    await h1('A Chord from Outside');
    fireEvent.click(within(screen.getByTestId('track-ending')).getByRole('button', { name: 'Loop your own songs in the Progression panel' }));
    expect(getProgressionRequest()).toEqual({});
    expect(useAppStore.getState().view).toBe('explore');
  });
});
