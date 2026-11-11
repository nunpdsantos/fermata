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
import { PROGRESS_STORAGE_KEY, followExcluded } from '../../services/drillFollow';
import { nextUnlock } from '../../data/drillUnlocks';
import { TRACKS } from '../../data/tracks';
import i18n from '../../i18n';
import { DRILL_FAMILIES, type DrillFamily } from '../../core/types/drill';
import { sprintFamiliesKey } from '../../components/drill/sprintSelectors';
import v2Fixture from '../../state/__tests__/fixtures/drill-v2-store.json';

vi.mock('../../components/drill/answerAudio', () => ({ playAnswerAudio: vi.fn() }));

const BANK = generateDrillBank({ includeRead: true });
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const TRACK_CHORDS = ['C:major', 'G:major', 'F:major', 'A:minor'];

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
    // Integration: the sound track's lessons are in the module index, so the intro names the lesson.
    expect(screen.getByTestId('drill-follow-empty').textContent).toBe(
      'Nothing to ask yet. The first questions come with the lesson “A Scale Is a Ladder”.',
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
    // scale, triad: the track's own lessons, named now that they are in the module index (integration)
    expect(screen.getAllByText('Unlocks with “A Scale Is a Ladder”').length).toBe(1);
    expect(screen.getAllByText('Unlocks with “Three Notes Make a Chord”').length).toBe(1);
    expect(screen.queryByText('Unlocks with a later lesson')).toBeNull();
    // The family names are labels, not toggles, while following.
    expect(screen.queryByRole('button', { name: 'Key signatures' })).toBeNull();
  });

  it('integration: a locked topic\'s caption opens the lesson that unlocks it (the track lesson, in its unit)', () => {
    // On the guitar, every topic has a lesson that opens it (on the piano, reading does not: S-2, below).
    useAppStore.setState({ instrument: 'guitar' });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Choose topics myself' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: /^Choose topics$/ })));
    act(() => fireEvent.click(screen.getByTestId('drill-follow-switch')));
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    // Every locked caption that names a lesson is a button.
    expect(document.querySelectorAll('[data-follow-caption="locked"] button').length).toBe(10);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Unlocks with “Three Notes Make a Chord”' })));
    expect(useAppStore.getState().pendingLearnTarget).toEqual({ levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m5' });
    expect(useAppStore.getState().view).toBe('learn');
  });
});

describe('a new learner after lessons', () => {
  beforeEach(() => useAppStore.setState({ learnerProfile: 'new' }));

  it('after l1u34m5: the intro shows what is unlocked and next; a session asks only those triads', () => {
    seedLessons(['l1u34m5']);
    render(<DrillView />);
    const summary = screen.getByTestId('drill-follow-summary');
    expect(within(summary).getByText(/^Triads/).textContent).toBe('Triads · So far: C, G, F, Am');
    expect(screen.getByTestId('drill-follow-next').textContent).toBe('Next: Scales, with the lesson “A Scale Is a Ladder”.');
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
    // On the guitar too, reading is NOT among them: since wave 3 it opens with
    // its own lesson, the guitar-notation unit's first (l1u33m1); on the piano
    // never (S-2, below).
    useAppStore.setState({ instrument: 'guitar' });
    seedLessons(['l2u7m3']);
    useDrillStore.getState().updateSettings({ newPerSession: 8, length: 40 });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    const families = new Set(useDrillStore.getState().activeSession!.queue.map((id) => BY_ID.get(id)!.family));
    expect([...families].every((f) => ['triad', 'interval', 'keysig', 'circle', 'degree', 'scale'].includes(f))).toBe(true);
    expect(families.has('triad')).toBe(true);
    // Whole: the summary lists Triads with no "So far", and the map gives it no caption.
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(within(screen.getByTestId('drill-follow-summary')).getByText(/^Triads/).textContent).toBe('Triads');
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(document.querySelectorAll('[data-follow-caption]').length).toBe(4); // read, seventh, roman, function: locked
    expect(screen.getByText('Unlocks with “Seventh Chords: The Five Qualities”')).toBeDefined();
    expect(screen.getByText('Unlocks with “Guitar Notation: Clef and Strings”')).toBeDefined();
    expect(document.querySelector('[data-follow-lesson="l1u33m1"]')).not.toBeNull();
  });

  it('the lessons are re-read when the page is shown again', () => {
    render(<DrillView />);
    expect(screen.queryByTestId('drill-follow-empty')).not.toBeNull();
    seedLessons(['l1u34m4']);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(screen.queryByTestId('drill-follow-empty')).toBeNull();
    expect(within(screen.getByTestId('drill-follow-summary')).getByText(/^Scales/).textContent).toBe('Scales · So far: C, G'); // integration: F major left out of l1u34m4
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

describe('the seat\'s decision S-2: no guitar reading for a piano learner while following', () => {
  const families = () => new Set(useDrillStore.getState().activeSession!.queue.map((id) => BY_ID.get(id)!.family));
  beforeEach(() => {
    useAppStore.setState({ learnerProfile: 'new' });
    seedLessons(['l1u33m1', 'l2u7m3']); // Guitar Notation: Clef and Strings (reading's lesson since wave 3), then a Level 2 lesson
    useDrillStore.getState().updateSettings({ newPerSession: 8, length: 40 });
  });
  afterEach(() => useAppStore.setState({ instrument: 'piano' }));

  it('piano: not unlocked (summary, sessions), not next, and the map says why', () => {
    useAppStore.setState({ instrument: 'piano' });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    expect(families().has('read')).toBe(false);
    expect(families().has('triad')).toBe(true);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    const summary = screen.getByTestId('drill-follow-summary');
    expect(summary.querySelector('[data-family="read"]')).toBeNull();
    expect(screen.getByTestId('drill-follow-next').textContent).not.toMatch(/Reading/);
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(screen.getByText('Unlocks only with the guitar as your instrument')).toBeDefined();
    expect(document.querySelector('[data-follow-lesson="l1u33m1"]')).toBeNull();
  });

  it('guitar: reading opens with its lesson (l1u33m1)', () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(screen.getByTestId('drill-follow-summary').querySelector('[data-family="read"]')).not.toBeNull();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(screen.queryByText('Unlocks only with the guitar as your instrument')).toBeNull();
  });

  it('guitar, The Staff and Clefs done but not the guitar-notation lesson: no reading yet, and the map names l1u33m1 (wave 3)', () => {
    useAppStore.setState({ instrument: 'guitar' });
    seedLessons(['l1u1m1', 'l2u7m3']);
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    expect(families().has('read')).toBe(false);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    expect(screen.getByTestId('drill-follow-summary').querySelector('[data-family="read"]')).toBeNull();
    act(() => fireEvent.click(screen.getByRole('button', { name: /Mastery map/ })));
    expect(screen.getByText('Unlocks with “Guitar Notation: Clef and Strings”')).toBeDefined();
    expect(document.querySelector('[data-follow-lesson="l1u1m1"]')).toBeNull();
  });

  it('piano, the switch off: today\'s Drill (reading among the topics, by its chip)', () => {
    useAppStore.setState({ instrument: 'piano' });
    useDrillStore.getState().updateSettings({ followLessons: false, families: Object.fromEntries(DRILL_FAMILIES.map((f) => [f, f === 'read'])) as Record<DrillFamily, boolean> });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    // Only the reading chip on: a session of reading questions, as on main.
    expect([...families()]).toEqual(['read']);
  });

  it('next: a piano learner of the sound track is never sent to reading; a guitar learner is', () => {
    const done = ['l1u34m4', 'l1u34m5'];
    const all: string[] = [];
    let n = nextUnlock(done, TRACKS.sound, followExcluded('piano'));
    while (n) {
      all.push(...n.families);
      done.push(n.moduleId);
      n = nextUnlock(done, TRACKS.sound, followExcluded('piano'));
    }
    expect(all).not.toContain('read');
    expect(nextUnlock(['l1u34m4', 'l1u34m5', 'l1u3m3'], TRACKS.sound, followExcluded('guitar'))).toEqual({ moduleId: 'l1u33m1', families: ['read'] });
    expect(nextUnlock(['l1u34m4', 'l1u34m5', 'l1u3m3'], TRACKS.sound, followExcluded('piano'))!.families).not.toContain('read');
  });
});

describe('keyboard focus when the switch changes the screen (final review of wave 2)', () => {
  it('intro, nothing to ask: "Choose topics myself" → the switch (now off) has focus, not <body>', () => {
    useAppStore.setState({ learnerProfile: 'new' });
    render(<DrillView />);
    const choose = screen.getByRole('button', { name: 'Choose topics myself' });
    choose.focus();
    act(() => fireEvent.click(choose));
    expect(document.activeElement).toBe(screen.getByTestId('drill-follow-switch'));
    // And back on: the empty intro has no switch, so its main action takes focus.
    act(() => fireEvent.click(screen.getByTestId('drill-follow-switch')));
    expect(document.activeElement).not.toBe(document.body);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open the lesson' }));
  });

  it('settings: "Choose topics myself" → the switch has focus', () => {
    useAppStore.setState({ learnerProfile: 'player' });
    seedLessons(['l1u35m2']);
    useDrillStore.setState({ introDone: true, settings: { ...DEFAULT_SETTINGS, followLessons: true } });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    const choose = screen.getByRole('button', { name: 'Choose topics myself' });
    choose.focus();
    act(() => fireEvent.click(choose));
    expect(document.activeElement).toBe(screen.getByTestId('drill-follow-switch'));
  });
});

describe('no empty session can start (final review of wave 2)', () => {
  it('nothing done, the switch turned on mid-session, End, New session: back to the empty intro, never "0 of 0"', () => {
    useAppStore.setState({ learnerProfile: 'new' });
    render(<DrillView />);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Choose topics myself' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Start' })));
    expect(useDrillStore.getState().activeSession!.queue.length).toBeGreaterThan(0);
    act(() => fireEvent.click(screen.getByRole('button', { name: 'Drill settings' })));
    act(() => fireEvent.click(screen.getByTestId('drill-follow-switch')));
    expect(useDrillStore.getState().settings.followLessons).toBe(true);
    act(() => fireEvent.click(screen.getAllByRole('button', { name: 'Back' })[0]));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'End session' })));
    act(() => fireEvent.click(screen.getByRole('button', { name: 'New session' })));
    // No session with nothing in it; the intro says which lesson opens the first
    // questions and offers the way back to the topics.
    expect(useDrillStore.getState().activeSession).toBeNull();
    expect(intro()).not.toBeNull();
    expect(screen.getByTestId('drill-follow-empty')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Choose topics myself' })).toBeDefined();
    expect(screen.queryByText(/0 of 0/)).toBeNull();
  });

  it('the store itself never saves an empty session while following', () => {
    useDrillStore.getState().startSession(BANK, Date.now(), { followLessons: true, unlocked: () => false });
    expect(useDrillStore.getState().activeSession).toBeNull();
    // Not following: as before (the owner's path is unchanged).
    useDrillStore.getState().startSession(BANK, Date.now());
    expect(useDrillStore.getState().activeSession!.queue.length).toBeGreaterThan(0);
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
