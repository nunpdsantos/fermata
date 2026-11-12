/**
 * Wave 3 integration, seam 3 (since brief U through the one microphone
 * switch): ONE microphone session for the whole check. It is opened by the
 * learner's tap and never reopened from an effect (a browser that starts
 * audio only inside a tap, iOS Safari, would leave a reopened one silent):
 * the next questions, a question answered on the screen between them
 * included, use the same stream and the same audio context. The switch,
 * pressed, stays on screen the whole time. A check with a question answered
 * on the instrument offers the switch while it is open; every way the check
 * ends — finished, left, unmounted — turns the microphone off and leaves no
 * track running.
 *
 * A real check (ExerciseRunner + InstrumentInput + the one external-notes
 * listener), with a fake microphone: only getUserMedia and Web Audio are fake.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { installFakeMic, midiHz, tone, type FakeMic } from '../../../../services/microphone/__tests__/fakeMic';
import { stopListening } from '../../../../services/microphone/microphone';
import '../../../../services/microphone/micSession';
import { useExternalNotes, loadExternalNotesListener } from '../../../../services/externalNotesHost';
import { releaseAllExternalNotes } from '../../../../services/externalNotesListener';
import { _resetAppSoundForTesting } from '../../../../core/services/audio';
import { micOff, useMic } from '../../../../services/microphone/micSwitch';
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
const RESUME = { order: ['b1', 'mc', 'b2'], index: 0, scores: [], items: [], attempt: 1 as const, selectedNotes: [], tried: [], missed: null, final: null };

let mic: FakeMic;
beforeEach(async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  _resetAppSoundForTesting();
  micOff();
  useAppStore.setState({ view: 'learn', language: 'en', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false });
  await loadExternalNotesListener();
});
afterEach(() => {
  cleanup();
  micOff();
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
const toggle = () => screen.getByRole('button', { name: 'Microphone' });
async function turnOn() {
  fireEvent.click(toggle());
  await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
  fireEvent.click(screen.getByRole('button', { name: 'Turn on the microphone' }));
  await vi.waitFor(() => expect(useMic.getState().state.kind).toBe('on'));
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
    await turnOn();
    await wait(0);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    await playCEG();
    expect(chips()).toEqual(['C', 'E', 'G']);
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    expect(screen.getByTestId('check-pips').querySelector('i:nth-child(1)')?.getAttribute('data-score')).toBe('1');
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Question 2, answered on the screen: still listening, and it says so.
    expect(screen.getByText('Which statement is true?')).toBeTruthy();
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    expect(toggle().textContent).toBe('Microphone On');
    expect(live()).toBe(1);
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Question 3: on at once, through the session opened in question 1.
    await wait(0);
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    expect(chips()).toEqual([]);
    await playCEG();
    expect(chips()).toEqual(['C', 'E', 'G']);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    // Two taps made two contexts (the first closed when the sentence showed); one is open, the one the session uses.
    expect(mic.contexts).toHaveLength(2);
    expect(mic.contexts.filter((c) => c.state !== 'closed')).toHaveLength(1);
    expect(live()).toBe(1);

    // The check over: off the moment it finishes (before the result screen replaces the runner), no track.
    expect(useMic.getState().check).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    unmount();
    expect(useMic.getState().check).toBe(false);
    expect(live()).toBe(0);
  });

  it('turned off on the screen-answered question: no track, and question 3 does not listen', async () => {
    mount();
    await turnOn();
    await playCEG();
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(toggle());
    expect(live()).toBe(0);
    // Off, a screen-answered question is exactly as before: no control at all.
    expect(screen.queryByRole('button', { name: 'Microphone' })).toBeNull();
    fireEvent.click(screen.getByText('Right answer'));
    fireEvent.click(screen.getByText('Submit'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    await wait(100);
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
  });

  it('✕ Exit while listening: no track', async () => {
    const { onExit, unmount } = mount();
    await turnOn();
    fireEvent.click(screen.getByRole('button', { name: 'Exit the check' }));
    expect(onExit).toHaveBeenCalled();
    unmount(); // ModuleView goes back to the lesson
    expect(live()).toBe(0);
    expect(useMic.getState()).toEqual({ state: { kind: 'off' }, check: false });
  });

  it('the page hidden between questions: no track, a true sentence on the next instrument question', async () => {
    mount();
    await turnOn();
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
    expect(screen.getByTestId('mic-problem').textContent).toMatch(/^Listening stopped because Fermata was no longer on screen/);
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
  });
});
