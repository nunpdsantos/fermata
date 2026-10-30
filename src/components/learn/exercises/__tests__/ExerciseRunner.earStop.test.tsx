/**
 * Audit W0-04 review B1: the runner's exercise-change cleanup called core
 * stopPlayback(), but the sibling suite mocks stopPlayback, so it could not
 * see that in production nothing stopped — the sampled voice owns the notes,
 * scheduled up front, and had no cancel. Here core audio is REAL (only Web
 * Audio is mocked) and a fake instrument voice records what is scheduled on
 * it and whether it is told to cancel.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { ExerciseRunner } from '../ExerciseRunner';
import { setInstrumentVoice } from '../../../../core/services/audio';
import { installMockAudioContext } from '../../../../test/mockAudioContext';
import type { ExerciseDefinition } from '../../../../core/types/exercise';

const scaleEx = (id: string, root: 'C' | 'D'): ExerciseDefinition => ({
  id,
  type: 'ear_training',
  prompt: 'Listen to this scale and identify its type.',
  config: {
    type: 'ear_training',
    mode: 'scale',
    root,
    rootAccidental: '',
    rootOctave: 4,
    scaleType: 'major',
    choices: [
      { label: 'Major', correct: true },
      { label: 'Natural minor', correct: false },
    ],
  },
  points: 1,
});

const voice = {
  playNote: vi.fn((_midi: number, _when: number, _duration: number, _velocity: number) => true),
  startNote: vi.fn((_midi: number, _velocity: number) => true),
  stopNote: vi.fn((_midi: number) => {}),
  setVolume: vi.fn((_volume: number) => {}),
  resume: vi.fn(() => Promise.resolve()),
  cancelScheduled: vi.fn(() => {}),
};

const tick = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

function answerAndContinue() {
  fireEvent.click(screen.getByText('Major'));
  fireEvent.click(screen.getByText('Submit'));
  fireEvent.click(screen.getByText('Continue'));
}

beforeEach(() => {
  vi.useFakeTimers();
  installMockAudioContext(1);
  vi.clearAllMocks();
  setInstrumentVoice(voice);
});

afterEach(() => {
  cleanup();
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function renderRunner() {
  render(
    <ExerciseRunner
      exercises={[scaleEx('s1', 'C'), scaleEx('s2', 'D')]}
      accentColor="#8b5cf6"
      onRecordResult={vi.fn()}
      onComplete={vi.fn()}
    />,
  );
}

describe('ExerciseRunner + real core audio: an abandoned stimulus is cancelled on the voice', () => {
  it('continuing 0.5 s into a scale cancels its scheduled notes, then the next scale plays', async () => {
    renderRunner();
    await tick(300);
    // The whole scale is handed to the voice up front (last note ~2.8 s out).
    expect(voice.playNote).toHaveBeenCalledTimes(8);
    expect(voice.playNote.mock.calls[7][1]).toBeGreaterThan(2.5);

    await tick(500);
    answerAndContinue();
    expect(voice.cancelScheduled).toHaveBeenCalledTimes(1);

    await tick(400);
    expect(voice.playNote).toHaveBeenCalledTimes(16); // the next item autoplayed
  });

  it('control: continuing after the scale has finished cancels nothing', async () => {
    renderRunner();
    await tick(300 + 5000);
    answerAndContinue();
    expect(voice.cancelScheduled).not.toHaveBeenCalled();
    await tick(400);
    expect(voice.playNote).toHaveBeenCalledTimes(16);
  });
});
