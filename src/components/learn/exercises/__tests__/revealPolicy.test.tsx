/**
 * Audit W4-04 / decision D-09 / review B1 — a first wrong try shows "Not X —
 * have another go." and a NUDGE (the item's own, its type's method, or a
 * pointer back to the lesson section with Re-read), never the answer and
 * never the item's explanation (its `hint`); the tried option is struck
 * through and cannot be picked again; the answer — and the explanation — are
 * shown only when the item is final.
 * Plus: a two-option item gets one try (its second could not be wrong), a
 * practice round records nothing, a build question keeps the learner's picks
 * for the second try and opens / folds the dock (D-20), and a run resumes
 * exactly where it was (order, scores, attempt, hint state).
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { ExerciseRunner } from '../ExerciseRunner';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import type { RunSnapshot } from '../../../../state/learnSessionStore';
import { useAppStore } from '../../../../state/store';

vi.mock('../../../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../../core/services/audio')>();
  return { ...original, resumeAudio: vi.fn().mockResolvedValue(undefined), playNote: vi.fn(), playPitchedNotes: vi.fn(), playScale: vi.fn(), playTimedNotes: vi.fn(), stopPlayback: vi.fn() };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mc = (id: string, labels = ['Right answer', 'Wrong answer A', 'Wrong answer B', 'Wrong answer C']): ExerciseDefinition => ({
  id,
  type: 'multiple_choice',
  prompt: `Question ${id}?`,
  config: { type: 'multiple_choice', choices: labels.map((label, i) => ({ label, correct: i === 0 })) },
  hint: 'Think about the lesson.',
  nudge: 'Where does the clef curl?',
});
/** A multiple-choice item with no nudge: the check points back to the lesson. */
const bare = (id: string, labels: string[]): ExerciseDefinition => ({ ...mc(id, labels), nudge: undefined, hint: 'The treble clef curls around G.' });
const CONCEPTS = [
  { title: 'The staff', explanation: 'Five lines and four spaces.' },
  { title: 'The treble clef', explanation: 'The treble clef curls around the second line, so that line is G.' },
];

const option = (label: string) => screen.getByRole('button', { name: new RegExp(`^${label}`) });
const answerMarked = () => document.querySelectorAll('[data-state="answer"]').length;

function run(exercises: ExerciseDefinition[], extra: Partial<Parameters<typeof ExerciseRunner>[0]> = {}) {
  const onRecordResult = vi.fn();
  const onComplete = vi.fn();
  const onSnapshot = vi.fn();
  render(<ExerciseRunner exercises={exercises} accentColor="#8b5cf6" title="The Staff and Clefs" onRecordResult={onRecordResult} onComplete={onComplete} onSnapshot={onSnapshot} onExit={() => {}} {...extra} />);
  return { onRecordResult, onComplete, onSnapshot };
}

describe('reveal policy (D-09)', () => {
  it('first wrong try: "Not X — have another go", the nudge (not the explanation), X struck through — and nothing says which option is right', () => {
    const { onRecordResult } = run([mc('q1', ['G', 'B', 'C', 'D'])]);
    fireEvent.click(option('B'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Not B — have another go.')).toBeTruthy();
    expect(screen.getByText('Hint: Where does the clef curl?')).toBeTruthy();
    expect(screen.queryByText(/Think about the lesson/)).toBeNull();
    expect(answerMarked()).toBe(0);
    expect(document.body.textContent).not.toMatch(/it is G|answer is|Correct/);
    const tried = option('B');
    expect(tried.getAttribute('data-state')).toBe('tried');
    expect((tried as HTMLButtonElement).disabled).toBe(true);
    expect(tried.getAttribute('aria-label')).toBe('B (already tried)');
    expect(onRecordResult).not.toHaveBeenCalled();
  });

  it('once final (two misses), the answer is marked and named', () => {
    const { onRecordResult } = run([mc('q1', ['G', 'B', 'C', 'D'])]);
    fireEvent.click(option('B'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    fireEvent.click(option('D'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onRecordResult).toHaveBeenCalledWith('q1', 0);
    expect(answerMarked()).toBe(1);
    expect(option('G').getAttribute('aria-label')).toBe('G (the answer)');
    expect(screen.getByText('Not quite — it is G.')).toBeTruthy();
    // …and now the explanation, next to the answer (not labelled a hint).
    expect(screen.getByText('Think about the lesson.')).toBeTruthy();
    expect(screen.queryByText(/Where does the clef curl/)).toBeNull();
  });

  it('no nudge: "Look again at: n · section" with Re-read available only once final', () => {
    run([bare('q3', ['G', 'B', 'C', 'D'])], { concepts: CONCEPTS });
    fireEvent.click(option('B'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Look again at: 2 · The treble clef')).toBeTruthy();
    expect(screen.queryByText(/curls around/)).toBeNull();
    expect(screen.queryByTestId('check-reread-toggle')).toBeNull();
    expect(answerMarked()).toBe(0);
    fireEvent.click(option('G'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    const toggle = screen.getByTestId('check-reread-toggle');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByTestId('check-reread').textContent).toContain('so that line is G');
    expect(answerMarked()).toBe(1);
  });

  it('no nudge, and the section title would name the answer: the pointer gives the section number only', () => {
    run([bare('q4', ['Treble clef', 'Bass clef', 'Alto clef', 'Tenor clef'])], { concepts: CONCEPTS });
    fireEvent.click(option('Bass clef'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Look again at section 2 of the lesson.')).toBeTruthy();
    expect(screen.queryByText(/The treble clef/)).toBeNull();
  });

  it('a long statement answer is not quoted in the verdict title', () => {
    const long = ['The treble clef is also known as the G clef', 'The treble clef is also known as the F clef', 'The treble clef is also known as the C clef'];
    run([mc('q1', long)]);
    fireEvent.click(option(long[1]));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('Not quite — have another go.')).toBeTruthy();
  });

  it('a two-option item gets one try: a miss is final at once (0)', () => {
    const { onRecordResult } = run([mc('q2', ['Half step', 'Whole step'])]);
    fireEvent.click(option('Whole step'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onRecordResult).toHaveBeenCalledWith('q2', 0);
    expect(answerMarked()).toBe(1);
  });

  it('a practice round records nothing', () => {
    const { onRecordResult, onComplete } = run([mc('q1')], { practice: true });
    fireEvent.click(option('Right answer'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onRecordResult).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/· check/)).toBeNull();
  });

  it('the header: ✕ Exit, "n / N", the lesson as context', () => {
    run([mc('a'), mc('b'), mc('c')]);
    expect(screen.getByRole('button', { name: 'Exit the check' })).toBeTruthy();
    expect(screen.getByTestId('check-position').textContent).toBe('1 / 3');
    expect(screen.getByText('The Staff and Clefs · check')).toBeTruthy();
  });
});

describe('a build question (instrument input)', () => {
  beforeEach(() => {
    useAppStore.setState({ view: 'learn', dockDetents: { explore: 'half', learn: 'peek' }, activeNotes: new Set(), exerciseInputActive: false });
  });

  const build: ExerciseDefinition = {
    id: 'b1', type: 'chord_build', prompt: 'Build a C major triad.',
    config: { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major', noteCount: 3 },
    hint: 'C major = C, E, G.',
  };
  // A key down and up, as two renders (the input toggles on each note-on).
  const press = (midi: number) => {
    act(() => useAppStore.setState({ activeNotes: new Set([midi]) }));
    act(() => useAppStore.setState({ activeNotes: new Set() }));
  };

  it('opens the dock while it is asked, keeps the picks after a miss, and folds the dock back after', () => {
    const { onRecordResult } = run([build]);
    expect(useAppStore.getState().dockDetents.learn).toBe('half');
    press(60); press(64); press(66); // C E F# — wrong
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    expect(screen.getByText('Not quite — have another go.')).toBeTruthy();
    // The nudge is the chord's interval recipe — never its notes (review B1).
    expect(screen.getByText('Hint: Count up from the root: the other notes lie a major 3rd and a perfect 5th above it.')).toBeTruthy();
    expect(screen.queryByText(/C, E, G/)).toBeNull();
    expect(onRecordResult).not.toHaveBeenCalled();
    press(66); press(67); // un-toggle F#, add G — the picks C E are still there
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    expect(onRecordResult).toHaveBeenCalledWith('b1', 0.5);
    cleanup();
    expect(useAppStore.getState().dockDetents.learn).toBe('peek');
  });
});

describe('resuming a saved run (reload loses nothing)', () => {
  const list = [mc('a'), mc('b'), mc('c'), mc('d')];
  it('continues at the saved question with its scores, attempt, struck option and hint', () => {
    const resume: RunSnapshot = {
      order: ['c', 'a', 'd', 'b'],
      index: 2,
      scores: [1, 0.5],
      items: [{ id: 'c', answers: ['Right answer'], score: 1, answer: 'Right answer' }, { id: 'a', answers: ['Wrong answer A', 'Right answer'], score: 0.5, answer: 'Right answer' }],
      attempt: 2,
      selectedNotes: [],
      tried: [{ value: 'Wrong answer B', words: 'Wrong answer B' }],
      missed: 'Wrong answer B',
      final: null,
    };
    const { onComplete, onRecordResult } = run(list, { resume });
    expect(screen.getByTestId('check-position').textContent).toBe('3 / 4');
    expect(screen.getByText('Question d?')).toBeTruthy();
    expect(screen.getByText('Not Wrong answer B — have another go.')).toBeTruthy();
    expect(option('Wrong answer B').getAttribute('data-state')).toBe('tried');
    // Second try right → 0.5; then the last one right → 1.
    fireEvent.click(option('Right answer'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onRecordResult).toHaveBeenLastCalledWith('d', 0.5);
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Question b?')).toBeTruthy();
    fireEvent.click(option('Right answer'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    const [passed, outcomes] = onComplete.mock.calls[0];
    expect(outcomes.map((o: { exercise: ExerciseDefinition; score: number }) => [o.exercise.id, o.score])).toEqual([['c', 1], ['a', 0.5], ['d', 0.5], ['b', 1]]);
    expect(passed).toBe(false); // 1 + 0.5 + 0.5 + 1 = 3 of 4 = 75 % < 80 %
  });

  it('every change of the run is reported for saving', () => {
    const { onSnapshot } = run([mc('a')]);
    const first = onSnapshot.mock.calls[0][0] as RunSnapshot;
    expect(first).toMatchObject({ order: ['a'], index: 0, scores: [], attempt: 1, final: null });
    fireEvent.click(option('Wrong answer A'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    const last = onSnapshot.mock.calls.at(-1)![0] as RunSnapshot;
    expect(last).toMatchObject({ attempt: 2, missed: 'Wrong answer A', tried: [{ value: 'Wrong answer A', words: 'Wrong answer A' }] });
  });
});
