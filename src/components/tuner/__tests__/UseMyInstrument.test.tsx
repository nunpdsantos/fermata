/**
 * "Use my instrument" in a check answered on the instrument (brief T), with
 * a fake microphone: offered only where a microphone can work, off by
 * default, one sentence before the browser is asked, the notes held on the
 * real instrument EMITTED through the contract (the listener that adds them
 * to the answer is stream K's), the on-screen instrument and Check still
 * working, and no track left running when the question is final, when the
 * control goes, when the page is hidden, or when the microphone is refused.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { installFakeMic, midiHz, tone, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { subscribeExternalNotes, type ExternalNote } from '../../../services/externalNotes';
import { stopListening } from '../../../services/microphone/microphone';
// Loaded up front, as the control loads them on first use.
import '../../../services/microphone/playedNotes';
import { InstrumentInput } from '../../learn/exercises/inputs/InstrumentInput';
import { setAnswerWanted } from '../answerSession';
import { useAppStore } from '../../../state/store';
import type { Note } from '../../../core/types/music';

let mic: FakeMic;
let heard: ExternalNote[];
let off: () => void;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  setAnswerWanted(false);
  heard = [];
  off = subscribeExternalNotes((n) => heard.push(n));
  useAppStore.setState({ view: 'learn', language: 'en', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false });
});
afterEach(() => {
  off();
  cleanup();
  stopListening();
  mic.restore();
  vi.useRealTimers();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});

const C_MAJOR: Note[] = [{ natural: 'C', accidental: '' }, { natural: 'E', accidental: '' }, { natural: 'G', accidental: '' }];
const live = () => mic.tracks.filter((t) => t.readyState === 'live').length;
const ui = (submitted = false, onSubmit = vi.fn()) => (
  <InstrumentInput expectedCount={3} submitted={submitted} onSubmit={onSubmit} accentColor="#888888" spellingContext={C_MAJOR} />
);
async function wait(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}
async function turnOn() {
  fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
  fireEvent.click(screen.getByRole('button', { name: 'Allow the microphone' }));
  await settle();
}
/** Until the browser has answered (the control is on, or says why not). */
async function settle() {
  await vi.waitFor(() => expect(screen.getByTestId('use-my-instrument').getAttribute('data-state')).toMatch(/^(on|problem)$/));
  await wait(0);
}
async function play(midi: number, ms = 300, gap = 200) {
  mic.setSound(tone(midiHz(midi)));
  await wait(ms);
  mic.setSound(null);
  await wait(gap);
}

describe('Use my instrument', () => {
  it('not offered where the microphone cannot work (no support: the check as before)', () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    render(ui());
    expect(screen.queryByRole('button', { name: 'Use my instrument' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Check Answer' })).toBeTruthy();
  });

  it('off by default; the first tap says why (and that the sound stays here) before the browser is asked', () => {
    render(ui());
    const toggle = screen.getByRole('button', { name: 'Use my instrument' });
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(toggle);
    expect(screen.getByText('To hear the notes you play, Fermata listens through the microphone; the sound never leaves this device.')).toBeTruthy();
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(screen.getByTestId('use-my-instrument').getAttribute('data-state')).toBe('off');
  });

  it('C, E and G played one at a time are emitted, each on then off, source mic', async () => {
    render(ui());
    await turnOn();
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('listening-mark').textContent).toBe('Listening');
    expect(screen.getByTestId('use-my-instrument-heard').textContent).toBe('Play the notes one at a time and let each one ring.');
    await play(48);
    await play(52);
    await play(55);
    expect(heard).toEqual([
      { midi: 48, on: true, source: 'mic' }, { midi: 48, on: false, source: 'mic' },
      { midi: 52, on: true, source: 'mic' }, { midi: 52, on: false, source: 'mic' },
      { midi: 55, on: true, source: 'mic' }, { midi: 55, on: false, source: 'mic' },
    ]);
    expect(screen.getByTestId('use-my-instrument-heard').textContent).toBe('Heard: G');
  });

  it('the on-screen instrument and Check still work while it listens; the check never waits for it', async () => {
    const onSubmit = vi.fn();
    render(ui(false, onSubmit));
    await turnOn();
    act(() => useAppStore.setState({ activeNotes: new Set([60]) }));
    act(() => useAppStore.setState({ activeNotes: new Set<number>() }));
    fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
    expect(onSubmit).toHaveBeenCalledWith(new Set([0]));
  });

  it('the question final: the microphone stops (no track); the next question listens again by itself', async () => {
    const { rerender, unmount } = render(ui());
    await turnOn();
    expect(live()).toBe(1);
    rerender(ui(true));
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    unmount();
    render(ui());
    await settle();
    expect(mic.getUserMedia).toHaveBeenCalledTimes(2);
    expect(live()).toBe(1);
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('turned off: no track, and the next question does not listen', async () => {
    const { unmount } = render(ui());
    await turnOn();
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    expect(live()).toBe(0);
    unmount();
    render(ui());
    await wait(0);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
  });

  it('the control gone (the check closed) while listening: no track', async () => {
    const { unmount } = render(ui());
    await turnOn();
    unmount();
    expect(live()).toBe(0);
  });

  it('refused: off, a true sentence, the screen still answers; no track', async () => {
    mic.failWith('NotAllowedError');
    render(ui());
    await turnOn();
    expect(screen.getByTestId('use-my-instrument-problem').textContent).toBe(
      "The microphone is blocked for Fermata. To allow it, open this site's settings (beside the address, or your phone's settings for this browser). You can still answer on the screen.",
    );
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('false');
    expect(live()).toBe(0);
    expect(screen.getByRole('button', { name: 'Check Answer' })).toBeTruthy();
  });

  it('no microphone: a true sentence; no track', async () => {
    mic.failWith('NotFoundError');
    render(ui());
    await turnOn();
    expect(screen.getByTestId('use-my-instrument-problem').textContent).toBe('No microphone was found on this device. You can still answer on the screen.');
    expect(live()).toBe(0);
  });

  it('the page hidden while listening: no track, and it says so', async () => {
    render(ui());
    await turnOn();
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(live()).toBe(0);
    expect(screen.getByTestId('use-my-instrument-problem').textContent).toBe(
      'Listening stopped because Fermata was no longer on screen (for example, you switched to another app or tab). Turn on “Use my instrument” again to go on.',
    );
  });

  it('a view change while listening: no track, off, and no untrue "off screen" sentence', async () => {
    render(ui());
    await turnOn();
    expect(live()).toBe(1);
    act(() => {
      useAppStore.setState({ view: 'explore' });
    });
    expect(live()).toBe(0);
    expect(screen.getByTestId('use-my-instrument').getAttribute('data-state')).toBe('off');
    expect(screen.queryByTestId('use-my-instrument-problem')).toBeNull();
    expect(screen.getByRole('button', { name: 'Use my instrument' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('turned off while the browser is still asking: the stream that arrives is stopped', async () => {
    const gate = mic.hold();
    render(ui());
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    fireEvent.click(screen.getByRole('button', { name: 'Allow the microphone' }));
    await wait(0);
    expect(screen.getByText('Your browser is asking whether Fermata may use the microphone.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    gate.release();
    await wait(0);
    await wait(0);
    expect(mic.tracks.length).toBe(1);
    expect(live()).toBe(0);
  });

  it('already allowed for this site: the first tap listens at once', async () => {
    (navigator.permissions.query as ReturnType<typeof vi.fn>).mockResolvedValue({ state: 'granted' });
    render(ui());
    await wait(0);
    fireEvent.click(screen.getByRole('button', { name: 'Use my instrument' }));
    await settle();
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/^To hear the notes you play/)).toBeNull();
  });
});
