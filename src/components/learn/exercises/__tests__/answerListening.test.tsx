/**
 * Wave 3 integration, seam 3: "Use my instrument" keeps ONE microphone
 * session for the whole check. It is opened by the learner's tap and never
 * reopened from an effect (a browser that starts audio only inside a tap,
 * iOS Safari, would leave a reopened one silent): the next questions, a
 * question answered on the screen between them included, use the same
 * stream and the same audio context. The listening mark stays on screen the
 * whole time. Every way the check ends leaves no track running.
 *
 * A real check (ExerciseRunner + InstrumentInput + the one external-notes
 * listener), with a fake microphone: only getUserMedia and Web Audio are fake.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { installFakeMic, midiHz, tone, type FakeMic } from '../../../../services/microphone/__tests__/fakeMic';
import { stopListening } from '../../../../services/microphone/microphone';
import '../../../../services/microphone/playedNotes';
import { useExternalNotes, loadExternalNotesListener } from '../../../../services/externalNotesHost';
import { releaseAllExternalNotes } from '../../../../services/externalNotesListener';
import { _resetAppSoundForTesting } from '../../../../core/services/audio';
import { stopAnswerListening, useAnswerListening } from '../../../tuner/answerSession';
import { ExerciseRunner } from '../ExerciseRunner';
import { useAppStore } from '../../../../state/store';
import type { ExerciseDefinition } from '../../../../core/types/exercise';

const build = (id: string): ExerciseDefinition => ({
  id,
  type: 'chord_build',
  prompt: 'Build a C major triad.',
  config: { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major', noteCount: 3 },
});
const choice: ExerciseDefinition = {
  id: 'mc',
  type: 'multiple_choice',
  prompt: 'Which statement is true?',
  config: { type: 'multiple_choice', choices: [{ label: 'Right answer', correct: true }, { label: 'Wrong answer', correct: false }, { label: 'Another wrong one', correct: false }] },
};
const EXERCISES = [build('b1'), choice, build('b2')];
/** A fixed order (the saved-run shape a reload resumes): build, choice, build. */
const RESUME = { order: ['b1', 'mc', 'b2'], index: 0, scores: [], items: [], attempt: 1, selectedNotes: [], tried: [], missed: null, final: null };

let mic: FakeMic;
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  _resetAppSoundForTesting();
  stopAnswerListening();
  useAppStore.setState({ view: 'learn', language: 'en', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false });
  await loadExternalNotesListener();
});
afterEach(() => {
  cleanup();
  stopAnswerListening();
  stopListening();
  releaseAllExternalNotes();
  mic.restore();
  vi.useRealTimers();
});

const live = () => mic.tracks.filter((t) => t.readyState === 'live').length;
async function wait(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}
async function playCEG() {
  for (const m of [60, 64, 67]) {
    mic.setSound(tone(midiHz(m)));
    await wait(300);
    mic.setSound(null);
    await wait(250);
  }
}
const chips = () => [...screen.getByTestId('check-answer-zone').querySelectorAll('span.rounded-md')].map((s) => s.textContent);

function mount() {
  renderHook(() => useExternalNotes(false));
  const onComplete = vi.fn();
  const onExit = vi.fn();
  const view = render(
    <ExerciseRunner exercises={EXERCISES} accentColor="#8b5cf6" onRecordResult={vi.fn()} onComplete={onComplete} onExit={onExit} resume={RESUME} />,
  );
  return { ...view, onComplete, onExit };
}

describe('one microphone session for the whole check', () => {
  it('turned on in question 1: question 2 (on the screen) shows it listening, question 3 uses the same stream; nothing reopened', async () => {
    const { unmount } = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow the microphone' }));
    await vi.waitFor(() => expect(useAnswerListening.getState().state.kind).toBe('on'));
    await wait(0);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    await playCEG();
    expect(chips()).toEqual(['C', 'E', 'G']);
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    expect(screen.getByTestId('check-pips').querySelector('i:nth-child(1)')?.getAttribute('data-score')).toBe('1');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Question 2, answered on the screen: still listening, and it says so.
    expect(screen.getByText('Which statement is true?')).toBeTruthy();
    expect(screen.getByTestId('listening-mark').textContent).toBe('Listening');
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('true');
    expect(live()).toBe(1);
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Question 3: on at once, through the session opened in question 1.
    await wait(0);
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('true');
    expect(chips()).toEqual([]);
    await playCEG();
    expect(chips()).toEqual(['C', 'E', 'G']);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(mic.contexts).toHaveLength(1);
    expect(live()).toBe(1);

    // The check over (the result screen replaces the runner): no track.
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    unmount();
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    expect(useAnswerListening.getState().state).toEqual({ kind: 'off' });
  });

  it('turned off on the screen-answered question: no track, and question 3 does not listen', async () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow the microphone' }));
    await vi.waitFor(() => expect(useAnswerListening.getState().state.kind).toBe('on'));
    await playCEG();
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    expect(live()).toBe(0);
    expect(screen.queryByTestId('listening-mark')).toBeNull();
    // Off, a screen-answered question is exactly as before: no control at all.
    expect(screen.queryByRole('button', { name: 'Use my instrument' })).toBeNull();
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await wait(100);
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('false');
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
  });

  it('✕ Exit while listening: no track', async () => {
    const { onExit, unmount } = mount();
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow the microphone' }));
    await vi.waitFor(() => expect(useAnswerListening.getState().state.kind).toBe('on'));
    fireEvent.click(screen.getByRole('button', { name: 'Exit the check' }));
    expect(onExit).toHaveBeenCalled();
    unmount(); // ModuleView goes back to the lesson
    expect(live()).toBe(0);
  });

  it('the page hidden between questions: no track, a true sentence on the next instrument question', async () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow the microphone' }));
    await vi.waitFor(() => expect(useAnswerListening.getState().state.kind).toBe('on'));
    await playCEG();
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
    expect(live()).toBe(0);
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByTestId('use-my-instrument-problem').textContent).toMatch(/^Listening stopped because Fermata was no longer on screen/);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
  });
});
