/**
 * Wave 2: the starting tracks on Learn's overview. Static data only (no level
 * download for them); a guided learner's own track at the top under "Start
 * here", the other after it; everyone else — the owner, profile absent —
 * both BELOW the level grid under "Other ways in", nothing above it moved.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const proxy = new Proxy({}, {
    get: (_t: unknown, tag: string) => (props: Record<string, unknown>) => {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) if (k === 'children' || !/^(while|initial|animate|exit|transition|layout|variants|drag)/.test(k)) clean[k] = v;
      return React.createElement(tag, clean);
    },
  });
  return { m: proxy, motion: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children };
});
const loads = vi.hoisted(() => ({ levels: [] as string[] }));
vi.mock('../../../../data/curriculumLoader', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../../../data/curriculumLoader')>();
  return { ...actual, loadLevel: (id: string, lang?: 'en' | 'pt' | 'es') => { loads.levels.push(id); return actual.loadLevel(id, lang); } };
});

import i18n from '../../../../i18n';
import { useAppStore } from '../../../../state/store';
import { LevelsOverview } from '../../LevelsOverview';
import { overviewTracks, trackProgress, isTrackListed, writtenLessons } from '../trackOverview';
import { TRACKS } from '../../../../data/tracks';
import { getDefaultProgress } from '../../../../data/curriculumLoader';
import type { CurriculumProgress } from '../../../../core/types/curriculum';
import { MODULE_INDEX } from '../../../../data/moduleIndex';
import { isOptionalModuleId } from '../../../../core/constants/optionalCurriculum';
import type { LearnerProfile } from '../../../../state/storeTypes';

const withChords = new Set([...TRACKS.sound.moduleIds, ...TRACKS.chords.moduleIds]);
const soundOnly = new Set(TRACKS.sound.moduleIds);

beforeEach(async () => {
  await i18n.changeLanguage('en');
  useAppStore.setState({ language: 'en', learnerProfile: null });
  loads.levels = [];
});
afterEach(cleanup);

describe('overviewTracks / trackProgress (pure)', () => {
  it.each([
    ['new', 'sound', ['chords'], 'top'],
    ['player', 'chords', ['sound'], 'top'],
    ['theory', null, ['sound', 'chords'], 'below'],
    [null, null, ['sound', 'chords'], 'below'],
  ] as const)('profile %s: start here %s, others %j, %s (both tracks written)', (profile, own, others, place) => {
    const o = overviewTracks(profile as LearnerProfile | null, withChords);
    expect(o.startHere?.id ?? null).toBe(own);
    expect(o.others.map((t) => t.id)).toEqual(others);
    expect(o.place).toBe(place);
  });

  it('a track with no lesson in the index has no card; a player then has no "Start here"', () => {
    expect(isTrackListed(TRACKS.chords, soundOnly)).toBe(false);
    expect(overviewTracks('player', soundOnly)).toEqual({ startHere: null, others: [TRACKS.sound], place: 'below' });
    expect(overviewTracks('new', soundOnly)).toEqual({ startHere: TRACKS.sound, others: [], place: 'top' });
    expect(writtenLessons(TRACKS.chords, soundOnly)).toEqual([]);
  });

  it('progress counts the written lessons done and names the first not done, in track order', () => {
    expect(trackProgress(TRACKS.sound, [], soundOnly)).toEqual({ done: 0, total: 5, next: 'l1u34m1' });
    expect(trackProgress(TRACKS.sound, ['l1u34m2', 'l1u34m1', 'l1u34m4', 'l1u1m1'], soundOnly)).toEqual({ done: 3, total: 5, next: 'l1u34m3' });
    expect(trackProgress(TRACKS.sound, TRACKS.sound.moduleIds, soundOnly)).toEqual({ done: 5, total: 5, next: null });
  });
});

function overview(progress: CurriculumProgress = getDefaultProgress(), onOpenTrack = vi.fn()) {
  render(<LevelsOverview progress={progress} onOpenLevel={() => {}} onOpenModule={() => {}} onOpenTrack={onOpenTrack} />);
  return onOpenTrack;
}

/** Document order: is `a` before `b`? */
const before = (a: Element, b: Element) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe('LevelsOverview with the tracks (both written: "Start with sound" and "From the chords you know")', () => {
  it('the written set the overview reads by default holds both tracks', () => {
    expect(writtenLessons(TRACKS.chords)).toEqual(TRACKS.chords.moduleIds);
    expect(writtenLessons(TRACKS.sound)).toEqual(TRACKS.sound.moduleIds);
  });

  it('the owner (no profile): both cards BELOW the grid under "Other ways in", sound then chords; nothing at the top; no level downloaded for them', () => {
    // Levels 1–2 done, so the Continue banner's module is in Level 3: any
    // Level 1 download would be the tracks'.
    const l1l2 = MODULE_INDEX.filter((m) => (m.level === 'l1' || m.level === 'l2') && !isOptionalModuleId(m.id)).map((m) => m.id);
    const open = overview({ ...getDefaultProgress(), completedModules: [...l1l2, 'l1u34m1', 'l1u34m2', 'l1u34m3'] });
    expect(screen.queryByTestId('tracks-start-here')).toBeNull();
    const other = screen.getByTestId('tracks-other');
    expect(within(other).getByRole('heading', { level: 2 }).textContent).toBe('Other ways in');
    const grid = screen.getByText('Foundations of Music Literacy').closest('button')!;
    const parallel = screen.getByText('Ear Training & Aural Skills').closest('button')!;
    expect(before(grid, other) && before(parallel, other)).toBe(true);
    const card = within(other).getByTestId('track-card-sound');
    expect(card.textContent).toContain('Start with sound');
    expect(within(card).getByTestId('track-progress').textContent).toBe('3 of 5 lessons');
    const chords = within(other).getByTestId('track-card-chords');
    expect(chords.textContent).toContain('From the chords you know');
    expect(within(chords).getByTestId('track-progress').textContent).toBe('0 of 10 lessons');
    expect(before(card, chords)).toBe(true);
    // The Continue banner loads the next REQUIRED module's level; the tracks load none.
    expect(loads.levels).toEqual(['l3']);
    fireEvent.click(card);
    expect(open).toHaveBeenCalledWith(TRACKS.sound);
    fireEvent.click(chords);
    expect(open).toHaveBeenLastCalledWith(TRACKS.chords);
  });

  it('"I know some theory": the same as the owner', () => {
    useAppStore.setState({ learnerProfile: 'theory' });
    overview();
    expect(screen.queryByTestId('tracks-start-here')).toBeNull();
    expect(within(screen.getByTestId('tracks-other')).getByTestId('track-card-sound')).toBeDefined();
    expect(within(screen.getByTestId('tracks-other')).getByTestId('track-card-chords')).toBeDefined();
  });

  it('"new": "Start here" with the sound card at the very top, the chords card after it, both above the level grid', () => {
    useAppStore.setState({ learnerProfile: 'new' });
    overview();
    const top = screen.getByTestId('tracks-start-here');
    expect(within(top).getByRole('heading', { level: 2 }).textContent).toBe('Start here');
    expect(within(top).getByTestId('track-card-sound').textContent).toContain('0 of 5 lessons');
    const grid = screen.getByText('Foundations of Music Literacy').closest('button')!;
    expect(before(top, grid)).toBe(true);
    expect(before(screen.getByRole('heading', { level: 1 }), top)).toBe(true);
    // The other track after it, still above the grid; no second copy anywhere.
    const other = screen.getByTestId('tracks-other');
    expect(within(other).getByTestId('track-card-chords').textContent).toContain('0 of 10 lessons');
    expect(before(top, other) && before(other, grid)).toBe(true);
    expect(screen.getAllByTestId('track-card-sound')).toHaveLength(1);
    expect(screen.getAllByTestId('track-card-chords')).toHaveLength(1);
    expect(within(other).queryByTestId('track-card-sound')).toBeNull();
  });

  it('"player": "Start here" with the chords card at the very top, the sound card after it, both above the level grid; progress counts its lessons', () => {
    useAppStore.setState({ learnerProfile: 'player' });
    overview({ ...getDefaultProgress(), completedModules: ['l1u35m1', 'l1u35m2', 'l1u34m1'] });
    const top = screen.getByTestId('tracks-start-here');
    expect(within(top).getByRole('heading', { level: 2 }).textContent).toBe('Start here');
    const chords = within(top).getByTestId('track-card-chords');
    expect(within(chords).getByTestId('track-progress').textContent).toBe('2 of 10 lessons');
    const other = screen.getByTestId('tracks-other');
    expect(within(other).getByTestId('track-card-sound').textContent).toContain('1 of 5 lessons');
    const grid = screen.getByText('Foundations of Music Literacy').closest('button')!;
    expect(before(top, other) && before(other, grid)).toBe(true);
    expect(screen.getAllByTestId('track-card-chords')).toHaveLength(1);
  });

  it('without onOpenTrack (other callers), no track cards', () => {
    render(<LevelsOverview progress={getDefaultProgress()} onOpenLevel={() => {}} onOpenModule={() => {}} />);
    expect(screen.queryByTestId('track-card-sound')).toBeNull();
  });

  it('PT and ES', async () => {
    useAppStore.setState({ learnerProfile: 'new', language: 'pt' });
    await i18n.changeLanguage('pt');
    overview();
    expect(screen.getByTestId('tracks-start-here').textContent).toContain('Começa aqui');
    expect(screen.getByTestId('track-card-sound').textContent).toContain('Começa pelo som');
    expect(within(screen.getByTestId('track-card-sound')).getByTestId('track-progress').textContent).toBe('0 de 5 lições');
    expect(within(screen.getByTestId('track-card-chords')).getByTestId('track-progress').textContent).toBe('0 de 10 lições');
    expect(screen.getByTestId('track-card-chords').textContent).toContain('A partir dos acordes que conheces');
    cleanup();
    useAppStore.setState({ learnerProfile: null, language: 'es' });
    await i18n.changeLanguage('es');
    overview();
    expect(screen.getByTestId('tracks-other').textContent).toContain('Otras formas de empezar');
    expect(screen.getByTestId('track-card-sound').textContent).toContain('Empieza por el sonido');
    expect(screen.getByTestId('track-card-chords').textContent).toContain('Desde los acordes que conoces');
    expect(within(screen.getByTestId('track-card-chords')).getByTestId('track-progress').textContent).toBe('0 de 10 lecciones');
  });
});
