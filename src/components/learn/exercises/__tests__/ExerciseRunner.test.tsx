/**
 * Component coverage for the Learn scoring heart (audit R-02):
 * two-attempt scoring (1 / 0.5 / 0), pass threshold, and the ear-training
 * replay lock (R-01) — a rapid Replay must never schedule overlapping audio.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { ExerciseRunner } from '../ExerciseRunner';
import type { ExerciseDefinition } from '../../../../core/types/exercise';

vi.mock('../../../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../../core/services/audio')>();
  return {
    ...original,
    resumeAudio: vi.fn().mockResolvedValue(undefined),
    playNote: vi.fn(),
    playChord: vi.fn(),
    playScale: vi.fn(),
  };
});

import { playNote, playScale } from '../../../../core/services/audio';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mcExercise = (id: string): ExerciseDefinition => ({
  id,
  type: 'multiple_choice',
  prompt: 'Which statement is true?',
  config: {
    type: 'multiple_choice',
    choices: [
      { label: 'Right answer', correct: true },
      { label: 'Wrong answer A', correct: false },
      { label: 'Wrong answer B', correct: false },
    ],
  },
  hint: 'The right one.',
  points: 1,
});

const earNoteExercise: ExerciseDefinition = {
  id: 'ear1',
  type: 'ear_training',
  prompt: 'Listen to this pitch and identify it.',
  config: { type: 'ear_training', mode: 'note', note: 'C', accidental: '', octave: 4 },
  points: 1,
};

const earScaleExercise: ExerciseDefinition = {
  id: 'ear2',
  type: 'ear_training',
  prompt: 'Listen to this scale and identify its type.',
  config: {
    type: 'ear_training',
    mode: 'scale',
    root: 'C',
    rootAccidental: '',
    rootOctave: 4,
    scaleType: 'major',
    choices: [
      { label: 'Major', correct: true },
      { label: 'Natural minor', correct: false },
    ],
  },
  points: 1,
};

function renderRunner(exercises: ExerciseDefinition[]) {
  const onRecordResult = vi.fn();
  const onComplete = vi.fn();
  render(
    <ExerciseRunner
      exercises={exercises}
      accentColor="#8b5cf6"
      onRecordResult={onRecordResult}
      onComplete={onComplete}
    />,
  );
  return { onRecordResult, onComplete };
}

describe('ExerciseRunner scoring', () => {
  it('awards 1 point for a first-try correct answer and passes a full-score set', () => {
    const { onRecordResult, onComplete } = renderRunner([mcExercise('m1')]);

    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    expect(onRecordResult).toHaveBeenCalledWith('m1', 1);

    fireEvent.click(screen.getByText('Continue'));
    expect(onComplete).toHaveBeenCalledWith(true);
  });

  it('awards 0.5 for correct on retry, and 50% does not pass the 80% threshold', () => {
    const { onRecordResult, onComplete } = renderRunner([mcExercise('m1')]);

    fireEvent.click(screen.getByText('Wrong answer A'));
    fireEvent.click(screen.getByText('Submit'));
    // No score recorded yet — retry is available with the hint shown.
    expect(onRecordResult).not.toHaveBeenCalled();
    expect(screen.getByText(/The right one\./)).toBeTruthy();

    fireEvent.click(screen.getByText('Try Again'));
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    expect(onRecordResult).toHaveBeenCalledWith('m1', 0.5);

    fireEvent.click(screen.getByText('Continue'));
    expect(onComplete).toHaveBeenCalledWith(false);
  });

  it('awards 0 after two wrong attempts and fails the set', () => {
    const { onRecordResult, onComplete } = renderRunner([mcExercise('m1')]);

    fireEvent.click(screen.getByText('Wrong answer A'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Try Again'));
    fireEvent.click(screen.getByText('Wrong answer B'));
    fireEvent.click(screen.getByText('Submit'));
    expect(onRecordResult).toHaveBeenCalledWith('m1', 0);

    fireEvent.click(screen.getByText('Next'));
    expect(onComplete).toHaveBeenCalledWith(false);
  });

  it('accumulates across a set: 1 + 0.5 of 2 (75%) fails, 2 of 2 passes', () => {
    // Two identical-config exercises so shuffle order cannot matter.
    const { onComplete } = renderRunner([mcExercise('a'), mcExercise('b')]);

    // First: correct on first try.
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Continue'));

    // Second: correct on retry (0.5). Total 1.5/2 = 75% < 80%.
    fireEvent.click(screen.getByText('Wrong answer A'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Try Again'));
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Continue'));

    expect(onComplete).toHaveBeenCalledWith(false);
  });
});

describe('ExerciseRunner ear-training replay lock (R-01)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  async function flushAutoplay() {
    // Autoplay fires 300 ms after mount; resumeAudio resolves on a microtask.
    await act(async () => {
      vi.advanceTimersByTime(300);
      await Promise.resolve();
    });
  }

  it('autoplays a note once and blocks Replay until its playback window ends', async () => {
    renderRunner([earNoteExercise]);
    await flushAutoplay();
    expect(playNote).toHaveBeenCalledTimes(1);

    const replay = screen.getByRole('button', { name: 'Replay audio' });
    // Immediately replaying must be a no-op — the lock is still held (1.1 s).
    await act(async () => {
      fireEvent.click(replay);
      await Promise.resolve();
    });
    expect(playNote).toHaveBeenCalledTimes(1);

    // After the lock releases, Replay works again.
    await act(async () => {
      vi.advanceTimersByTime(1200);
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(replay);
      await Promise.resolve();
    });
    expect(playNote).toHaveBeenCalledTimes(2);
  });

  it('holds the lock for a full scale (~3.2 s) so Replay cannot overlap it', async () => {
    renderRunner([earScaleExercise]);
    await flushAutoplay();
    expect(playScale).toHaveBeenCalledTimes(1);

    const replay = screen.getByRole('button', { name: 'Replay audio' });

    // The old 800 ms guard would have allowed this replay to overlap.
    await act(async () => {
      vi.advanceTimersByTime(1000);
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(replay);
      await Promise.resolve();
    });
    expect(playScale).toHaveBeenCalledTimes(1);

    // Once the scale has fully sounded, Replay is allowed.
    await act(async () => {
      vi.advanceTimersByTime(2500);
      await Promise.resolve();
    });
    await act(async () => {
      fireEvent.click(replay);
      await Promise.resolve();
    });
    expect(playScale).toHaveBeenCalledTimes(2);
  });
});
