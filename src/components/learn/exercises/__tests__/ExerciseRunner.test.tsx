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
    stopPlayback: vi.fn(),
  };
});

import { playNote, playScale, playChord, stopPlayback } from '../../../../core/services/audio';

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

// ─── Audit W0-04 (F-01 / C-48) ────────────────────────────────────────────────
// One replay lock for the whole runner, held ~3.3 s (scale) / ~4.2 s
// (progression), outlived the exercise: answering + continuing while the
// stimulus still sounded made the NEXT ear item start silent (its autoplay
// returned early on the stale lock). The old progression's chord timeouts
// also kept firing over the new item.

const scaleEx = (id: string, root: 'C' | 'D'): ExerciseDefinition => ({
  ...earScaleExercise,
  id,
  config: { ...earScaleExercise.config, root } as ExerciseDefinition['config'],
});

const progEx = (id: string, root: 'C' | 'G'): ExerciseDefinition => ({
  id,
  type: 'ear_training',
  prompt: 'Identify the progression',
  points: 1,
  config: {
    type: 'ear_training',
    mode: 'progression',
    root,
    rootAccidental: '',
    progression: ['I', 'IV', 'V', 'I'],
    choices: [
      { label: 'I - IV - V - I', correct: true },
      { label: 'ii - V - I', correct: false },
    ],
  },
});

type NoteArg = { natural: string; accidental: string };
const firstNoteOf = (call: unknown[]) => (call[0] as NoteArg[])[0];

describe('ExerciseRunner ear-training: the next item always autoplays (W0-04)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  const tick = (ms: number) =>
    act(async () => {
      await vi.advanceTimersByTimeAsync(ms);
    });

  function answerAndContinue(label: string) {
    fireEvent.click(screen.getByText(label));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByText('Continue'));
  }

  for (const at of [500, 1500, 3000]) {
    it(`scale: continuing ${at} ms into the stimulus still autoplays the next scale`, async () => {
      renderRunner([scaleEx('s1', 'C'), scaleEx('s2', 'D')]);
      await tick(300); // first autoplay
      expect(playScale).toHaveBeenCalledTimes(1);
      const firstRoot = firstNoteOf(vi.mocked(playScale).mock.calls[0]);

      await tick(at);
      answerAndContinue('Major');
      await tick(400); // next item's autoplay fires 300 ms after it appears

      expect(playScale).toHaveBeenCalledTimes(2);
      expect(firstNoteOf(vi.mocked(playScale).mock.calls[1])).not.toEqual(firstRoot);
    });

    it(`progression: continuing ${at} ms in autoplays the next one and cancels the old chords`, async () => {
      renderRunner([progEx('p1', 'C'), progEx('p2', 'G')]);
      await tick(300 + at);
      const firstRoot = firstNoteOf(vi.mocked(playChord).mock.calls[0]);
      // Chords of p1 already sounded (all 4 by 3.3 s; its last one still rings
      // and the lock would hold to ~4.45 s).
      const before = vi.mocked(playChord).mock.calls.length;

      answerAndContinue('I - IV - V - I');
      await tick(6000);

      const after = vi.mocked(playChord).mock.calls.slice(before);
      // Exactly the next progression's four chords — none of the old ones.
      expect(after).toHaveLength(4);
      expect(firstNoteOf(after[0])).not.toEqual(firstRoot);
      // Scheduled playback of the abandoned stimulus is stopped.
      expect(stopPlayback).toHaveBeenCalled();
    });
  }

  it('control: continuing after the stimulus has finished autoplays as before', async () => {
    renderRunner([scaleEx('s1', 'C'), scaleEx('s2', 'D')]);
    await tick(300 + 5000);
    answerAndContinue('Major');
    await tick(400);
    expect(playScale).toHaveBeenCalledTimes(2);
    // Nothing was in flight, so nothing needed stopping.
    expect(stopPlayback).not.toHaveBeenCalled();
  });

  it('Replay during the NEW item\'s stimulus still cannot overlap it (R-01 intent kept)', async () => {
    renderRunner([scaleEx('s1', 'C'), scaleEx('s2', 'D')]);
    await tick(300 + 500);
    answerAndContinue('Major');
    await tick(400);
    expect(playScale).toHaveBeenCalledTimes(2);

    const replay = screen.getByRole('button', { name: 'Replay audio' });
    await tick(1000);
    await act(async () => {
      fireEvent.click(replay);
      await Promise.resolve();
    });
    expect(playScale).toHaveBeenCalledTimes(2); // still sounding → blocked

    await tick(3000); // the new scale's own window has ended
    await act(async () => {
      fireEvent.click(replay);
      await Promise.resolve();
    });
    expect(playScale).toHaveBeenCalledTimes(3);
  });
});
