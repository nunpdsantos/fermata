/**
 * W4b — the Learn flow on real lesson content (l1u1m1, The Staff and Clefs):
 * the section rail (laptop) / section picker (phone), Start the check, the
 * result screen (score, pass mark, the missed question with what was said and
 * what it is, and always a next step), an unscored practice round, Re-read ›
 * back into the lesson, and a check that survives a reload. Plus, through
 * LearnView: the unit milestone at unit completion (once), "Unlock anyway",
 * and Level 9's "Pairs with Level n" badges.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import type { ExerciseDefinition } from '../../../core/types/exercise';
import type { CurriculumLevel } from '../../../core/types/curriculum';

vi.mock('../../notation/StaffNotation', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff-mock' }) };
});
vi.mock('../../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../core/services/audio')>();
  return { ...original, resumeAudio: vi.fn().mockResolvedValue(undefined), playNote: vi.fn(), playPitchedNotes: vi.fn(), playScale: vi.fn(), playChordVoiced: vi.fn(), playTimedNotes: vi.fn(), cancelScheduledAudio: vi.fn(), stopPlayback: vi.fn() };
});

import { ModuleView } from '../ModuleView';
import { LevelDetail } from '../LevelDetail';
import { UnitDetail } from '../UnitDetail';
import { LearnView } from '../../../views/LearnView';
import { L1_UNITS } from '../../../core/constants/curriculumL1';
import { L3_UNITS } from '../../../core/constants/curriculumL3';
import { L9_UNITS } from '../../../core/constants/curriculumL9';
import { useLearnSessionStore } from '../../../state/learnSessionStore';
import { useProgressStore } from '../../../state/progressStore';
import { useAppStore } from '../../../state/store';
import { getDefaultProgress, LEVEL_METADATA } from '../../../data/curriculumLoader';

const UNIT = L1_UNITS[0];
const MOD = UNIT.modules[0];
const LEVEL = { ...LEVEL_METADATA[0], units: L1_UNITS } as unknown as CurriculumLevel;

const q = (id: string): ExerciseDefinition => ({
  id, type: 'multiple_choice', prompt: `Where does the treble clef curl (${id})?`,
  config: { type: 'multiple_choice', choices: [{ label: 'yes', correct: true }, { label: 'no', correct: false }, { label: 'maybe', correct: false }] },
  hint: 'Around the second line.',
});
const EXERCISES = [q(`${MOD.id}e1`), q(`${MOD.id}e2`), q(`${MOD.id}e3`)];

function setWide(wide: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: wide && query.includes('min-width: 1024px'),
    media: query, addEventListener: () => {}, removeEventListener: () => {}, onchange: null,
    addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function renderModule(overrides: Partial<Parameters<typeof ModuleView>[0]> = {}) {
  const props = {
    onRecordExerciseResult: vi.fn(),
    onExercisesComplete: vi.fn(),
    onCompleteModule: vi.fn(),
  };
  const view = render(
    <div data-learn-scroll="">
      <ModuleView
        module={MOD} unit={UNIT} level={LEVEL} unitIndex={0} moduleIndex={0}
        isModuleCompleted={false} isTaskCompleted={() => false} completedTaskCount={0}
        exercises={EXERCISES} exercisesState="ready" exercisesPassed={false} levelCompletedModuleCount={0}
        onToggleTask={() => {}} onBack={() => {}} onBackToLevels={() => {}} onNavigateModule={() => {}}
        {...props} {...overrides}
      />
    </div>,
  );
  return { ...props, ...view };
}

const click = (name: string | RegExp) => fireEvent.click(screen.getByRole('button', { name }));
function answer(label: string) {
  click(new RegExp(`^${label}$`));
  click('Submit');
}

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo;
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
beforeEach(() => {
  localStorage.clear();
  useLearnSessionStore.setState({ screen: null, check: null });
  useProgressStore.setState({ progress: getDefaultProgress() });
  useAppStore.setState({ language: 'en', view: 'learn', pendingLearnTarget: null });
  setWide(true);
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('the lesson: sections, Try This in place, the check one tap away', () => {
  it('laptop: a rail lists every section, Check last, with the next lesson', () => {
    renderModule();
    const rail = screen.getByRole('navigation', { name: 'Lesson sections' });
    const items = within(rail).getAllByRole('button').map((b) => b.getAttribute('aria-label') ?? b.textContent);
    expect(items[0]).toMatch(/^What you'll learn/);
    expect(items).toContain(`1 · ${MOD.concepts[0].title}`);
    expect(items.some((i) => i?.startsWith('Check · 3 questions'))).toBe(true);
    expect(within(rail).getByText('Next lesson')).toBeTruthy();
    // Every concept has its Try This in place (no jump to Explore).
    expect(screen.getAllByTestId('inline-try-this')).toHaveLength(MOD.concepts.length);
    expect(screen.getAllByRole('button', { name: 'Show on the piano' }).length).toBeGreaterThan(0);
    fireEvent.click(within(rail).getByRole('button', { name: /^Check/ }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it('phone: the rail folds into "1 / n  Section ▾" with Check beside it', () => {
    setWide(false);
    renderModule();
    expect(screen.queryByRole('navigation', { name: 'Lesson sections' })).toBeNull();
    const picker = screen.getByTestId('section-picker');
    expect(within(picker).getByRole('button', { name: /^Section 1 of \d+: What you'll learn/ })).toBeTruthy();
    expect(within(picker).getByRole('button', { name: 'Check' })).toBeTruthy();
    fireEvent.click(within(picker).getByRole('button', { name: /^Section 1 of/ }));
    expect(screen.getByRole('dialog', { name: 'Lesson sections' })).toBeTruthy();
  });
});

describe('check → result → practice', () => {
  it('a failed set ends on the result screen with the missed question and three ways on', () => {
    const { onRecordExerciseResult, onExercisesComplete } = renderModule();
    click('Start the check');
    expect(screen.getByTestId('focused-check')).toBeTruthy();
    // One question missed twice, two right first time: 2 of 3 < 2.5 (80 %).
    answer('no');
    expect(screen.getByText('Not no — have another go.')).toBeTruthy();
    answer('maybe');
    click('Continue');
    answer('yes');
    click('Continue');
    answer('yes');
    click('Continue');
    expect(onRecordExerciseResult).toHaveBeenCalledTimes(3);
    expect(onExercisesComplete).toHaveBeenCalledWith(false);
    const result = screen.getByTestId('check-result');
    expect(within(result).getByTestId('result-score').textContent).toBe('2 of 3');
    expect(result.textContent).toContain('You need 2.5 of 3 to pass.');
    expect(result.textContent).toContain('Nothing is lost — try the ones you missed.');
    const missed = within(result).getAllByTestId('missed-question');
    expect(missed).toHaveLength(1);
    expect(missed[0].textContent).toMatch(/you said no, then maybe · it is yes/);
    for (const name of ["Practise the one I didn't get first time", 'Start over', 'Back to the lesson']) expect(screen.getByRole('button', { name })).toBeTruthy();

    // Practice: only the missed one, nothing recorded.
    click("Practise the one I didn't get first time");
    expect(screen.getByTestId('check-position').textContent).toBe('1 / 1');
    answer('yes');
    click('Continue');
    expect(onRecordExerciseResult).toHaveBeenCalledTimes(3);
    expect(screen.getByTestId('result-score').textContent).toBe('1 of 1 right');
    expect(screen.getByRole('button', { name: 'Start the check' })).toBeTruthy();
  });

  it('Re-read › goes back into the lesson at a concept', () => {
    renderModule();
    click('Start the check');
    for (let i = 0; i < 3; i++) {
      answer('no');
      answer('maybe');
      click('Continue');
    }
    const reread = screen.getAllByRole('button', { name: /^Re-read: \d · / });
    expect(reread).toHaveLength(3);
    fireEvent.click(reread[0]);
    expect(screen.getByRole('navigation', { name: 'Lesson sections' })).toBeTruthy();
  });

  it('a check survives a reload: same question, score and attempt', () => {
    const first = renderModule();
    click('Start the check');
    answer('yes');
    click('Continue');
    answer('no'); // a first miss on question 2
    const order = useLearnSessionStore.getState().check!.run.order;
    first.unmount();
    // The page comes back: the module opens again and finds the saved run.
    renderModule();
    expect(screen.getByTestId('check-position').textContent).toBe('2 / 3');
    expect(screen.getByText('Not no — have another go.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'no (already tried)' })).toBeTruthy();
    expect(useLearnSessionStore.getState().check!.run.order).toEqual(order);
    expect(useLearnSessionStore.getState().check!.run.scores).toEqual([1]);
  });
});

describe('through LearnView', () => {
  it('completing the last lesson of a unit shows its milestone once (D-23)', async () => {
    const unit = L1_UNITS[0];
    const last = unit.modules[unit.modules.length - 1];
    useProgressStore.setState({
      progress: {
        ...getDefaultProgress(),
        completedModules: unit.modules.slice(0, -1).map((m) => m.id),
        moduleProgress: { [last.id]: last.tasks.map((t) => t.id) },
        exerciseResults: { [last.id]: { scores: {}, totalAttempts: 1, lastAttemptAt: Date.now(), passed: true } },
      },
    });
    useAppStore.setState({ pendingLearnTarget: { levelId: 'l1', unitId: unit.id, moduleId: last.id } });
    const first = render(<LearnView />);
    const complete = await screen.findByRole('button', { name: 'Complete the lesson' }, { timeout: 8000 });
    await act(async () => { fireEvent.click(complete); });
    const dialog = await screen.findByRole('dialog', { name: 'Unit complete' });
    for (const skill of unit.milestone!.skillsSummary) expect(within(dialog).getByText(skill)).toBeTruthy();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Continue' }));
    expect(screen.queryByRole('dialog', { name: 'Unit complete' })).toBeNull();
    expect(useProgressStore.getState().progress.completedModules).toContain(last.id);
    first.unmount();
    const progressRaw = localStorage.getItem('music-theory-progress')!;
    const sessionRaw = localStorage.getItem('fermata-learn-session-v1')!;
    useProgressStore.setState({ progress: getDefaultProgress() });
    useLearnSessionStore.setState({ screen: null, check: null });
    localStorage.setItem('music-theory-progress', progressRaw);
    localStorage.setItem('fermata-learn-session-v1', sessionRaw);
    await useProgressStore.persist.rehydrate();
    await useLearnSessionStore.persist.rehydrate();
    render(<LearnView />);
    await screen.findByRole('heading', { name: last.title, level: 1 });
    expect(screen.queryByRole('dialog', { name: 'Unit complete' })).toBeNull();
    // A finished lesson cannot be completed again to replay its milestone.
    expect(screen.queryByRole('button', { name: 'Complete the lesson' })).toBeNull();
    expect(useProgressStore.getState().progress.completedModules.filter((id) => id === last.id)).toHaveLength(1);

  }, 20_000);

  it('Unlock anyway: a locked level says what it skips, and the unlock is saved', () => {
    const level3 = { ...LEVEL_METADATA[2], units: L3_UNITS } as unknown as CurriculumLevel;
    render(<LevelDetail level={level3} progress={useProgressStore.getState().progress} isModuleCompleted={() => false} getUnitCompletedModuleCount={() => 0} onOpenUnit={() => {}} onOpenModule={() => {}} onBack={() => {}} />);
    expect(screen.getByText('This level follows Level 2.')).toBeTruthy();
    click('Unlock anyway');
    const dialog = screen.getByRole('dialog', { name: 'Unlock Level 3?' });
    expect(dialog.textContent).toContain('Level 3 builds on Level 2, Expanding Fundamentals');
    expect(dialog.textContent).toContain('Nothing you have done is lost');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Unlock Level 3' }));
    expect(useProgressStore.getState().progress.unlockedLevels).toEqual(['l3']);
  });

  it('Level 9 module rows carry "Pairs with Level n"', () => {
    const unit = L9_UNITS[1]; // scales and chords: modes pair with L7, seventh chords with L3
    const level9 = { ...LEVEL_METADATA[8], units: L9_UNITS } as unknown as CurriculumLevel;
    render(<UnitDetail unit={unit} unitIndex={1} level={level9} progress={getDefaultProgress()} isModuleCompleted={() => false} onOpenModule={() => {}} onBack={() => {}} onBackToLevels={() => {}} />);
    expect(screen.getAllByText('Pairs with Level 7').length).toBe(2);
    expect(screen.getByText('Pairs with Level 3')).toBeTruthy();
  });
});

it('a production v2 save survives a completed check through real persistence', async () => {
  const progress = {
    completedModules: ['l3u11m1'],
    moduleProgress: { l3u11m1: ['l3u11m1t1'], [MOD.id]: [MOD.tasks[0].id] },
    exemptedModules: ['l4u12m1'],
    unlockedLevels: ['l3'],
    exerciseResults: {
      l3u11m1: { scores: { l3u11m1e2: 0.5, l3u11m1e3: 1 }, totalAttempts: 7, lastAttemptAt: 1793000000000, passed: true },
      [MOD.id]: { scores: { l1u1m1g1: 0.5 }, totalAttempts: 4, lastAttemptAt: 1793000000000, passed: false },
    },
    reviewSchedules: { l3u11m1: { completedAt: 1793000000000, nextReviewAt: 1793086400000, intervalLevel: 2, reviewCount: 3, lastReviewedAt: 1793000000000 } },
  };
  localStorage.setItem('music-theory-progress', JSON.stringify({ state: { progress }, version: 2 }));
  await useProgressStore.persist.rehydrate();
  // Round 4 changes e2; the frozen unchanged e3 score must survive.
  const migrated = {
    ...progress,
    exerciseResults: {
      ...progress.exerciseResults,
      l3u11m1: { ...progress.exerciseResults.l3u11m1, scores: { l3u11m1e3: 1 } },
    },
  };
  expect(useProgressStore.getState().progress).toEqual(migrated);
  const first = renderModule({
    onRecordExerciseResult: (id, score) => useProgressStore.getState().recordExerciseResult(MOD.id, id, score),
    onExercisesComplete: (passed) => { if (passed) useProgressStore.getState().markExercisesPassed(MOD.id); },
  });
  click('Start the check');
  for (let i = 0; i < EXERCISES.length; i++) { answer('yes'); click('Continue'); }
  expect(screen.getByTestId('check-result')).toBeTruthy();
  first.unmount();
  // Clear memory, then hydrate the actual write from the completed flow.
  const raw = localStorage.getItem('music-theory-progress')!;
  useProgressStore.setState({ progress: getDefaultProgress() });
  localStorage.setItem('music-theory-progress', raw);
  await useProgressStore.persist.rehydrate();
  expect(JSON.parse(raw).version).toBe(4);
  const expected = {
    ...migrated,
    exerciseResults: {
      ...migrated.exerciseResults,
      [MOD.id]: {
        scores: { ...progress.exerciseResults[MOD.id].scores, ...Object.fromEntries(EXERCISES.map((ex) => [ex.id, 1])) },
        totalAttempts: 7, lastAttemptAt: expect.any(Number), passed: true,
      },
    },
  };
  expect(useProgressStore.getState().progress).toEqual(expected);
});
