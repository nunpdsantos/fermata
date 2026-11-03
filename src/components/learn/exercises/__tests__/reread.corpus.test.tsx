import { it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { ExerciseRunner } from '../ExerciseRunner';
import { LEVELS, CONTENT_LANGS, levelCorpus } from '../../../../data/exercises/__tests__/learnCorpus';
import { EN_UNITS, curriculumOverlay } from '../../../../i18n/content/__tests__/overlayEntries';
import { useAppStore } from '../../../../state/store';
import { useLearnSessionStore, fingerprintsOf, restorableCheck, LEARN_SESSION_KEY } from '../../../../state/learnSessionStore';
import type { RunSnapshot } from '../../../../state/learnSessionStore';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import i18n from '../../../../i18n';

vi.mock('../../../notation/StaffNotation', () => ({ StaffNotation: () => null }));
vi.mock('../../../../core/services/audio', async (original) => ({
  ...await original<typeof import('../../../../core/services/audio')>(),
  resumeAudio: vi.fn().mockResolvedValue(undefined), stopPlayback: vi.fn(),
}));
afterEach(async () => { cleanup(); await i18n.changeLanguage('en'); });

for (const lang of CONTENT_LANGS) {
  it(`${lang}: every item withholds the lesson body and its ARIA until final`, async () => {
    await i18n.changeLanguage(lang);
    const reachable: string[] = [];
    let count = 0;
    for (const level of LEVELS) {
      for (const { exercise, moduleId } of levelCorpus(level, lang)) {
        const mod = EN_UNITS[level].flatMap((u) => u.modules).find((m) => m.id === moduleId)!;
        const overlay = lang === 'en' ? null : curriculumOverlay(lang, level).modules[moduleId];
        const concepts = mod.concepts.map((c, i) => ({ title: overlay?.concepts[i]?.title ?? c.title, explanation: overlay?.concepts[i]?.explanation ?? c.explanation }));
        const run: RunSnapshot = { order: [exercise.id], index: 0, scores: [], items: [], attempt: 2, selectedNotes: [], tried: [{ value: 'miss', words: 'miss' }], missed: 'miss', final: null };
        render(<ExerciseRunner exercises={[exercise]} resume={run} concepts={concepts} accentColor="#123456" onExit={() => {}} onRecordResult={() => {}} onComplete={() => {}} />);
        // Visit every available in-check expansion. The lesson body can name
        // the answer in text OR ARIA; neither may be reachable on a retry.
        const toggle = screen.queryByTestId('check-reread-toggle');
        if (toggle) fireEvent.click(toggle);
        if (screen.queryByTestId('check-reread') || toggle) reachable.push(exercise.id);
        count++;
        cleanup();
      }
    }
    expect(count).toBeGreaterThan(900);
    expect(reachable).toEqual([]);
  }, 60_000);
}

it('after final, Re-read expands in place and keeps the run', () => {
  const exercise = levelCorpus(2, 'en').find((x) => x.exercise.id === 'l2u5m1e3')!.exercise;
  const concepts = EN_UNITS[2].flatMap((u) => u.modules).find((m) => m.id === 'l2u5m1')!.concepts;
  const record = vi.fn();
  render(<ExerciseRunner exercises={[exercise]} concepts={concepts} accentColor="#123456" onExit={() => {}} onRecordResult={record} onComplete={() => {}} />);
  const answer = exercise.config.type === 'multiple_choice' ? exercise.config.choices.find((c) => c.correct)!.label : '';
  fireEvent.click(screen.getByRole('button', { name: answer }));
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  fireEvent.click(screen.getByTestId('check-reread-toggle'));
  expect(screen.getByTestId('check-reread').textContent).toContain(answer);
  expect(screen.getByTestId('check-position').textContent).toBe('1 / 1');
  expect(record).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Continue' })).toBeTruthy();
});

it('a build restores selected notes from real persistence on its second attempt', async () => {
  useAppStore.setState({ activeNotes: new Set() });
  const exercise: ExerciseDefinition = { id: 'l1u3m4e1', type: 'chord_build', prompt: 'Build C major', config: { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major', noteCount: 3 } };
  const props = { exercises: [exercise], accentColor: '#123456', onExit: () => {}, onRecordResult: vi.fn(), onComplete: vi.fn() };
  const first = render(<ExerciseRunner {...props} onSnapshot={(run) => useLearnSessionStore.getState().setCheck({ moduleId: 'l1u3m4', kind: 'check', lang: 'en', fingerprints: fingerprintsOf([exercise]), run, finished: false, at: Date.now() })} />);
  for (const midi of [60, 64, 66]) {
    act(() => useAppStore.setState({ activeNotes: new Set([midi]) }));
    act(() => useAppStore.setState({ activeNotes: new Set() }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
  expect(screen.getByText('Selected 3 of 3 notes')).toBeTruthy();
  const raw = localStorage.getItem(LEARN_SESSION_KEY)!;
  first.unmount();
  useLearnSessionStore.setState({ screen: null, check: null });
  localStorage.setItem(LEARN_SESSION_KEY, raw);
  await useLearnSessionStore.persist.rehydrate();
  const restored = restorableCheck('l1u3m4', [exercise], 'en')!;
  expect(restored.check.run.attempt).toBe(2);
  render(<ExerciseRunner {...props} resume={restored.check.run} />);
  expect(screen.getByText('Selected 3 of 3 notes')).toBeTruthy();
  expect(useAppStore.getState().highlightedNotes.map((n) => `${n.natural}${n.accidental}`)).toEqual(['C', 'E', 'F#']);
  fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
  expect(props.onRecordResult).toHaveBeenCalledWith(exercise.id, 0);
});

it('even an empty runner has an Exit', () => {
  const exit = vi.fn();
  render(<ExerciseRunner exercises={[]} accentColor="#123456" onExit={exit} onRecordResult={() => {}} onComplete={() => {}} />);
  fireEvent.click(screen.getByRole('button', { name: 'Exit the check' }));
  expect(exit).toHaveBeenCalledOnce();
});
