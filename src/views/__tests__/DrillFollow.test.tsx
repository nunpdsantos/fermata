/**
 * Drill follows the lessons (wave 2), in the view.
 *
 *  - A new learner (door 'new') with nothing completed sees the "follows your
 *    lessons" intro, the lesson that opens the first questions, no Start —
 *    no empty session can begin.
 *  - After l1u34m5 is completed (Learn's saved shape seeded), a session asks
 *    only triads in the listed chords; a Level 2 lesson opens its family whole.
 *  - "Choose topics myself" (intro or settings) gives today's Drill back.
 *  - The owner (no profile, a frozen production save) sees Drill as before:
 *    no follow summary, the mastery map's chips, no field written.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, within } from '@testing-library/react';
import { DrillView } from '../DrillView';
import { useDrillStore, DEFAULT_SETTINGS, DRILL_STORE_KEY } from '../../state/drillStore';
import { useAppStore } from '../../state/store';
import { generateDrillBank } from '../../core/utils/drillBank';
import { PROGRESS_STORAGE_KEY } from '../../services/drillFollow';
import i18n from '../../i18n';
import { DRILL_FAMILIES, type DrillFamily } from '../../core/types/drill';
import { sprintFamiliesKey } from '../../components/drill/sprintSelectors';
import v2Fixture from '../../state/__tests__/fixtures/drill-v2-store.json';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));

const BANK = generateDrillBank({ includeRead: true });
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const TRACK_CHORDS = ['C:major', 'G:major', 'F:major', 'A:minor', 'E:minor', 'D:minor'];

const intro = () => screen.queryByTestId('drill-intro');
const seedLessons = (ids: string[]) =>
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({
    state: { progress: { completedModules: ids, moduleProgress: {}, exerciseResults: {}, reviewSchedules: {} } },
    version: 4,
  }));

beforeEach(() => {
  localStorage.clear();
  useDrillStore.getState().resetDrillData();
  useAppStore.setState({ learnerProfile: null, pendingLearnTarget: null });
});

afterEach(async () => {
  cleanup();
  useDrillStore.getState().resetDrillData();
  useAppStore.setState({ learnerProfile: null, pendingLearnTarget: null, view: 'explore' });
  localStorage.clear();
  await i18n.changeLanguage('en');
});

describe('a new learner with nothing completed', () => {
  beforeEach(() => useAppStore.setState({ learnerProfile: 'new' }));

  it('sees that Drill follows the lessons, which lesson opens the first questions, and no Start', () => {
    render(<DrillView />);
    expect(intro()).not.toBeNull();
    expect(screen.getByRole('heading', { name: 'Quick questions on music facts' })).toBeDefined();
    expect(screen.getByTestId('drill-follow-lead').textContent).toBe(
      'Drill follows your lessons: it asks about what they have covered, and adds more as you go.',
    );
    // The sound track's first lessons are not in this branch's module index: no title to name.
    expect(screen.getByTestId('drill-follow-empty').textContent).toBe(
      'Nothing to ask yet. The first questions come with your lessons.',
    );
    expect(screen.queryByRole('button', { name: 'Start' })).toBeNull();
    expect(useDrillStore.getState().activeSession).toBeNull();
  });

  it('"Open the lesson" opens the lesson that unlocks the first questions (l1u34m4)', () => {
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Open the lesson' })));
    expect(useAppStore.getState().pendingLearnTarget).toEqual({ levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m4' });
    expect(useAppStore.getState().view).toBe('learn');
  });

  it('a player is sent to the chords track\'s first unlocking lesson (l1u35m2)', () => {
    useAppStore.setState({ learnerProfile: 'player' });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Open the lesson' })));
    expect(useAppStore.getState().pendingLearnTarget).toEqual({ levelId: 'l1', unitId: 'u35', moduleId: 'l1u35m2' });
  });

  it('"Choose topics myself" gives today\'s intro back, with Start, and saves the choice', () => {
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Choose topics myself' })));
    expect(useDrillStore.getState().settings.followLessons).toBe(false);
    expect(screen.getByRole('button', { name: 'Start' })).toBeDefined();
    expect(screen.getByText('Key signatures')).toBeDefined();
    expect(screen.queryByTestId('drill-follow-lead')).toBeNull();
    // The switch is offered again on the intro, off.
    expect(screen.getByTestId('drill-follow-switch').getAttribute('aria-pressed')).toBe('false');
  });

  it('the mastery map marks every topic locked, with the lesson that opens it', () => {
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Choose topics myself' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: /^Choose topics$/ })));
    act(() => fireEvent.click(screen.getByTestId('drill-follow-switch'))); // back on, from the settings
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    const captions = document.querySelectorAll('[data-follow-caption="locked"]');
    expect(captions.length).toBe(10);
    expect(screen.getAllByText('Unlocks with “All Major Keys and the Circle of Fifths”').length).toBe(2); // keysig + circle, l2u4m1
    expect(screen.getAllByText('Unlocks with a later lesson').length).toBe(2); // scale, triad: the track's own lessons
    // The family names are labels, not toggles, while following.
    expect(screen.queryByRole('button', { name: 'Key signatures' })).toBeNull();
  });
});

describe('a new learner after lessons', () => {
  beforeEach(() => useAppStore.setState({ learnerProfile: 'new' }));

  it('after l1u34m5: the intro shows what is unlocked and next; a session asks only those triads', () => {
    seedLessons(['l1u34m5']);
    render(<DrillView />);
    const summary = screen.getByTestId('drill-follow-summary');
    expect(within(summary).getByText(/^Triads/).textContent).toBe('Triads · So far: C, G, F, Am, Em, Dm');
    expect(screen.getByTestId('drill-follow-next').textContent).toBe('Next: Scales, with a later lesson.');
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    const session = useDrillStore.getState().activeSession!;
    expect(session.queue.length).toBe(4); // the 4 new facts (their second looks join as they are answered)
    for (const id of session.queue) {
      const item = BY_ID.get(id)!;
      expect(item.family).toBe('triad');
      expect(TRACK_CHORDS).toContain(`${item.chord!.root}:${item.chord!.quality}`);
    }
    // The first session saved the value in force.
    expect(JSON.parse(localStorage.getItem(DRILL_STORE_KEY)!).state.settings.followLessons).toBe(true);
  });

  it('a Level 2 lesson (l2u7m3) opens the whole triad family, and the families before it', () => {
    seedLessons(['l2u7m3']);
    useDrillStore.getState().updateSettings({ newPerSession: 8, length: 40 });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    const families = new Set(useDrillStore.getState().activeSession!.queue.map((id) => BY_ID.get(id)!.family));
    expect([...families].every((f) => ['triad', 'read', 'interval', 'keysig', 'circle', 'degree', 'scale'].includes(f))).toBe(true);
    expect(families.has('triad')).toBe(true);
    // Whole: the summary lists Triads with no "So far", and the map gives it no caption.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(within(screen.getByTestId('drill-follow-summary')).getByText(/^Triads/).textContent).toBe('Triads');
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(document.querySelectorAll('[data-follow-caption]').length).toBe(3); // seventh, roman, function: locked
    expect(screen.getByText('Unlocks with “Seventh Chords: The Five Qualities”')).toBeDefined();
  });

  it('the lessons are re-read when the page is shown again', () => {
    render(<DrillView />);
    expect(screen.queryByTestId('drill-follow-empty')).not.toBeNull();
    seedLessons(['l1u34m4']);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(screen.queryByTestId('drill-follow-empty')).toBeNull();
    expect(within(screen.getByTestId('drill-follow-summary')).getByText(/^Scales/).textContent).toBe('Scales · So far: C, G, F');
  });
});

describe('the switch in the settings', () => {
  it('on: the topic chips are replaced; "Choose topics myself" gives them back', () => {
    useAppStore.setState({ learnerProfile: 'player' });
    seedLessons(['l1u35m2']);
    useDrillStore.setState({ introDone: true, settings: { ...DEFAULT_SETTINGS, followLessons: true } });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(screen.getByTestId('drill-follow-switch').getAttribute('aria-pressed')).toBe('true');
    expect(screen.queryByRole('group', { name: 'Topics' })).toBeNull();
    expect(within(screen.getByTestId('drill-follow-summary')).getByText(/^Roman numerals/).textContent)
      .toBe('Roman numerals · So far: chords I, IV, V in the keys G, C, D, A, E');
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Choose topics myself' })));
    expect(useDrillStore.getState().settings.followLessons).toBe(false);
    expect(screen.getByRole('group', { name: 'Topics' })).toBeDefined();
  });

  it('a session already running when the switch turns on keeps its questions; the next one follows', () => {
    useDrillStore.setState({ introDone: true });
    render(<DrillView />);
    const first = useDrillStore.getState().activeSession!.queue;
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    act(() => fireEvent.click(screen.getByTestId('drill-follow-switch')));
    expect(useDrillStore.getState().activeSession!.queue).toEqual(first);
  });
});

describe('the owner: no profile, months of history', () => {
  it('Drill as before: a resumed session, the topic chips, the map\'s toggles, nothing written', async () => {
    localStorage.setItem(DRILL_STORE_KEY, JSON.stringify(v2Fixture));
    await useDrillStore.persist.rehydrate();
    const settingsBefore = JSON.stringify(useDrillStore.getState().settings);
    render(<DrillView />);
    expect(intro()).toBeNull();
    expect(screen.getByText(/^\d+ of \d+$/)).toBeDefined();
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(screen.getByTestId('drill-follow-switch').getAttribute('aria-pressed')).toBe('false');
    expect(screen.getByRole('group', { name: 'Topics' })).toBeDefined();
    expect(screen.queryByTestId('drill-follow-summary')).toBeNull();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(document.querySelector('[data-follow-caption]')).toBeNull();
    expect(screen.getByRole('button', { name: 'Key signatures' })).toBeDefined();
    expect(JSON.stringify(useDrillStore.getState().settings)).toBe(settingsBefore);
    expect('followLessons' in useDrillStore.getState().settings).toBe(false);
  });

  it('a player who already drills is not switched over', () => {
    useAppStore.setState({ learnerProfile: 'player' });
    useDrillStore.setState({ introDone: true });
    render(<DrillView />);
    expect(intro()).toBeNull();
    expect(useDrillStore.getState().activeSession!.queue.length).toBeGreaterThan(0);
  });
});

describe('following with facts already met but nothing unlocked', () => {
  it('the scheduled facts still come (never dropped)', () => {
    const met = BANK.find((i) => i.family === 'keysig')!;
    useDrillStore.getState().startSession([met], 1_000);
    useDrillStore.getState().recordAnswer(met, true, 900, 2_000);
    useDrillStore.getState().endSession();
    useDrillStore.getState().updateSettings({ followLessons: true });
    render(<DrillView />);
    expect(intro()).toBeNull();
    expect(useDrillStore.getState().activeSession!.queue).toContain(met.id);
  });
});

describe('Sprint while following', () => {
  it('draws from the unlocked pool, not the topic chips, and keeps its best under that set', () => {
    // Topic chips: key signatures only. Known facts: eight triads (review tier).
    const known = BANK.filter((i) => i.family === 'triad').slice(0, 8);
    const items = Object.fromEntries(known.map((i) => [i.id, {
      card: { due: 0, stability: 5, difficulty: 5, elapsed_days: 0, scheduled_days: 5, reps: 3, lapses: 0, state: 2, learning_steps: 0 },
      history: [], tier: 'review' as const, introCorrectCount: 1,
    }]));
    const chips = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, f === 'keysig'])) as Record<DrillFamily, boolean>;
    const followSet = Object.fromEntries(DRILL_FAMILIES.map((f) => [f, f === 'triad'])) as Record<DrillFamily, boolean>;
    useAppStore.setState({ learnerProfile: 'new' });
    useDrillStore.setState({
      introDone: true,
      items,
      settings: { ...DEFAULT_SETTINGS, families: chips, followLessons: true },
      sprintBests: { [sprintFamiliesKey(followSet)]: 3 },
    });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'End session' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Sprint' })));
    const run = useDrillStore.getState().sprint!;
    expect(run).not.toBeNull();
    expect(run.familiesKey).toBe(sprintFamiliesKey(followSet));
    expect(run.priorBest).toBe(3);
    expect([...run.pool].sort()).toEqual(known.map((i) => i.id).sort());
    // The chips are set aside, not changed.
    expect(useDrillStore.getState().settings.families).toEqual(chips);
  });
});

describe('following, with Drill history but nothing left to ask (a progress reset)', () => {
  it('no session starts by itself: the empty intro stands in, until a lesson opens something', () => {
    useAppStore.setState({ learnerProfile: 'new' });
    useDrillStore.setState({ introDone: true, settings: { ...DEFAULT_SETTINGS, followLessons: true } });
    render(<DrillView />);
    expect(intro()).not.toBeNull();
    expect(screen.getByTestId('drill-follow-empty')).toBeDefined();
    expect(useDrillStore.getState().activeSession).toBeNull();
    // A lesson finished elsewhere: the intro offers Start (the runner did not start on its own).
    seedLessons(['l1u34m5']);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    expect(useDrillStore.getState().activeSession!.queue.every((id) => BY_ID.get(id)!.family === 'triad')).toBe(true);
  });
});

describe('PT and ES: what the settings say while following', () => {
  const CASES = [
    {
      lang: 'pt',
      row: 'Numerais romanos · Por agora: acordes I, IV, V nas tonalidades G, C, D, A, E',
      hint: 'O Treino pergunta o que as tuas lições já ensinaram e acrescenta mais à medida que avanças.',
    },
    {
      lang: 'es',
      row: 'Numerales romanos · Por ahora: acordes I, IV, V en las tonalidades G, C, D, A, E',
      hint: 'La Práctica pregunta lo que tus lecciones ya han enseñado y añade más a medida que avanzas.',
    },
  ] as const;
  for (const c of CASES) {
    it(`${c.lang}: the part a track lesson opened, and the switch's line`, async () => {
      await i18n.changeLanguage(c.lang);
      useAppStore.setState({ learnerProfile: 'player' });
      seedLessons(['l1u35m2']);
      useDrillStore.setState({ introDone: true, settings: { ...DEFAULT_SETTINGS, followLessons: true } });
      render(<DrillView />);
      act(() => fireEvent.click(screen.getByRole('button', { name: i18n.t('drill.settings.title') })));
      const summary = screen.getByTestId('drill-follow-summary');
      expect(within(summary).getByText(new RegExp(`^${c.row.split(' · ')[0]}`)).textContent).toBe(c.row);
      expect(document.getElementById('drill-follow-hint')!.textContent).toBe(c.hint);
    });
  }
});

describe('PT', () => {
  it('the empty intro is Portuguese', async () => {
    await i18n.changeLanguage('pt');
    useAppStore.setState({ learnerProfile: 'new' });
    render(<DrillView />);
    expect(screen.getByTestId('drill-follow-lead').textContent).toBe(
      'O Treino segue as tuas lições: pergunta o que elas já ensinaram e acrescenta mais à medida que avanças.',
    );
    expect(screen.getByRole('button', { name: 'Abrir a lição' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Escolher eu os tópicos' })).toBeDefined();
  });
});
