/**
 * The microphone switch in a check answered on the instrument (brief U; it
 * replaced wave 3's "Use my instrument", whose promises it keeps), with a
 * fake microphone: offered only where a microphone can work, off by default,
 * nothing asked of the browser until the tap, one sentence before the
 * browser is asked, one line saying what it does here; the notes held on the
 * real instrument EMITTED through the contract (the listener that adds them
 * to the answer is stream K's), the on-screen instrument and Check still
 * working; ONE microphone session for the whole check (never reopened
 * outside a tap); and no track left running when it is turned off, when the
 * check ends, when the page is hidden, or when the microphone is refused.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { installFakeMic, midiHz, tone, watchPrivacy, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { subscribeExternalNotes, type ExternalNote } from '../../../services/externalNotes';
import { stopListening } from '../../../services/microphone/microphone';
// Loaded up front, as the switch loads it in the tap.
import '../../../services/microphone/micSession';
import { InstrumentInput } from '../../learn/exercises/inputs/InstrumentInput';
import { micOff, useMic } from '../../../services/microphone/micSwitch';
import { useAppStore } from '../../../state/store';
import type { Note } from '../../../core/types/music';

let mic: FakeMic;
let heard: ExternalNote[];
let off: () => void;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  micOff();
  heard = [];
  off = subscribeExternalNotes((n) => heard.push(n));
  useAppStore.setState({ view: 'learn', language: 'en', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false });
});
afterEach(() => {
  off();
  cleanup();
  micOff();
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
const toggle = () => screen.getByRole('button', { name: 'Microphone' });
const pressed = () => toggle().getAttribute('aria-pressed');
async function wait(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}
/** The tap, the sentence, "Turn on the microphone"; until the browser has answered. */
async function turnOn() {
  fireEvent.click(toggle());
  await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
  fireEvent.click(screen.getByRole('button', { name: 'Turn on the microphone' }));
  await settle();
}
/** Until the browser has answered (the switch is on, or says why not). */
async function settle() {
  await vi.waitFor(() => expect(toggle().getAttribute('data-state')).toMatch(/^(on|problem)$/));
  await wait(0);
}
async function play(midi: number, ms = 300, gap = 200) {
  mic.setSound(tone(midiHz(midi)));
  await wait(ms);
  mic.setSound(null);
  await wait(gap);
}

describe('the microphone switch in a check answered on the instrument', () => {
  it('not offered where the microphone cannot work (no support: the check as before)', () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    render(ui());
    expect(screen.queryByRole('button', { name: 'Microphone' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Check Answer' })).toBeTruthy();
  });

  it('off, "Microphone Off", and one line saying what it does here; opening the question asks the browser NOTHING', async () => {
    render(ui());
    await wait(50);
    expect(pressed()).toBe('false');
    expect(toggle().textContent).toBe('Microphone Off');
    expect(screen.getByText('With the microphone on, the notes you play are added to your answer.')).toBeTruthy();
    expect(navigator.permissions.query).not.toHaveBeenCalled();
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(mic.contexts).toHaveLength(0);
  });

  it('the answer submitted (locked): the "notes are added to your answer" line goes, since none would be; the switch stays, in a polite region that was there before', async () => {
    const { rerender } = render(ui());
    expect(screen.getByTestId('mic-lines').getAttribute('aria-live')).toBe('polite');
    expect(screen.getByText('With the microphone on, the notes you play are added to your answer.')).toBeTruthy();
    rerender(ui(true));
    expect(screen.queryByText('With the microphone on, the notes you play are added to your answer.')).toBeNull();
    expect(toggle().getAttribute('data-place')).toBe('check');
  });

  it('keyboard: "Turn on the microphone" gives focus back to the check\'s switch, not the page body', async () => {
    render(ui());
    fireEvent.click(toggle());
    await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
    const allow = screen.getByRole('button', { name: 'Turn on the microphone' });
    allow.focus();
    fireEvent.click(allow);
    expect(document.activeElement).toBe(toggle());
    await settle();
  });

  it('the first tap says why (and that the sound stays here) before the browser is asked; "Not now": off', async () => {
    render(ui());
    fireEvent.click(toggle());
    await vi.waitFor(() => expect(screen.getByText('To hear the notes you play, Fermatina listens through the microphone; the sound never leaves this device.')).toBeTruthy());
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(pressed()).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(toggle().getAttribute('data-state')).toBe('off');
  });

  it('C, E and G played one at a time are emitted, each on then off, source mic; on reads "Microphone On" with the dot', async () => {
    render(ui());
    await turnOn();
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(pressed()).toBe('true');
    expect(toggle().textContent).toBe('Microphone On');
    expect(toggle().querySelector('.mic-switch-dot')).toBeTruthy();
    expect(screen.getByTestId('mic-heard').textContent).toBe('Play the notes one at a time and let each one ring.');
    await play(48);
    await play(52);
    await play(55);
    expect(heard).toEqual([
      { midi: 48, on: true, source: 'mic' }, { midi: 48, on: false, source: 'mic' },
      { midi: 52, on: true, source: 'mic' }, { midi: 52, on: false, source: 'mic' },
      { midi: 55, on: true, source: 'mic' }, { midi: 55, on: false, source: 'mic' },
    ]);
    expect(screen.getByTestId('mic-heard').textContent).toBe('Heard: G');
  });

  it('nothing heard is stored, logged, recorded, sent or played back (a whole session: on, three notes, off)', async () => {
    // The question on screen first (it opens the dock to Half, which is saved, as before wave 3): then the session.
    render(ui());
    await wait(0);
    const watch = watchPrivacy();
    try {
      await turnOn();
      await play(48);
      await play(52);
      await play(55);
      fireEvent.click(toggle());
      await wait(0);
      expect(heard.filter((n) => n.on).map((n) => n.midi)).toEqual([48, 52, 55]);
      expect(watch.findings()).toEqual([]);
    } finally {
      watch.stop();
    }
  });

  it('the audio context is made inside each tap (iOS Safari starts audio only there), before anything is awaited', async () => {
    render(ui());
    fireEvent.click(toggle());
    // Synchronously, in the same turn as the tap: the context exists; nothing has been asked or loaded yet.
    expect(mic.contexts).toHaveLength(1);
    expect(navigator.permissions.query).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Turn on the microphone' }));
    expect(mic.contexts).toHaveLength(2);
    expect(mic.getUserMedia).not.toHaveBeenCalled();
  });

  it('turned off while a note is held: that note is reported ended (nothing stays held), and nothing more is heard', async () => {
    render(ui());
    await turnOn();
    mic.setSound(tone(midiHz(57)));
    await wait(300);
    expect(heard).toEqual([{ midi: 57, on: true, source: 'mic' }]);
    act(() => micOff());
    expect(heard).toEqual([{ midi: 57, on: true, source: 'mic' }, { midi: 57, on: false, source: 'mic' }]);
    await wait(500);
    expect(heard).toHaveLength(2);
    mic.setSound(null);
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

  it('the question final, then the next question: the SAME microphone session goes on (nothing reopened outside a tap)', async () => {
    const { rerender, unmount } = render(ui());
    await turnOn();
    expect(live()).toBe(1);
    rerender(ui(true));
    // Final: still on for the check, and says nothing about playing.
    expect(live()).toBe(1);
    expect(mic.contexts.filter((c) => c.state !== 'closed')).toHaveLength(1);
    expect(pressed()).toBe('true');
    expect(screen.queryByTestId('mic-heard')).toBeNull();
    unmount();
    // The next question: on at once, from the same stream, the same context.
    render(ui());
    await wait(0);
    expect(pressed()).toBe('true');
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(mic.contexts.filter((c) => c.state !== 'closed')).toHaveLength(1);
    expect(live()).toBe(1);
    await play(52);
    expect(heard.filter((n) => n.on)).toEqual([{ midi: 52, on: true, source: 'mic' }]);
  });

  it('turned off: no track, and the next question does not listen', async () => {
    const { unmount } = render(ui());
    await turnOn();
    fireEvent.click(toggle());
    expect(live()).toBe(0);
    unmount();
    render(ui());
    await wait(0);
    expect(pressed()).toBe('false');
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
  });

  it('the input gone (a question not answered on the instrument) keeps it; the check over (micOff, as ExerciseRunner does) leaves no track', async () => {
    const { unmount } = render(ui());
    await turnOn();
    unmount();
    expect(live()).toBe(1);
    expect(useMic.getState().state.kind).toBe('on');
    act(() => micOff());
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    expect(useMic.getState().state.kind).toBe('off');
  });

  it('refused: off, a true sentence, the screen still answers; no track', async () => {
    mic.failWith('NotAllowedError');
    render(ui());
    await turnOn();
    expect(screen.getByTestId('mic-problem').textContent).toBe(
      "The microphone is blocked for Fermatina. To allow it, open this site's settings (beside the address, or your phone's settings for this browser). You can still answer on the screen.",
    );
    expect(pressed()).toBe('false');
    expect(toggle().textContent).toBe('Microphone Off');
    expect(live()).toBe(0);
    expect(screen.getByRole('button', { name: 'Check Answer' })).toBeTruthy();
  });

  it('no microphone: a true sentence; no track', async () => {
    mic.failWith('NotFoundError');
    render(ui());
    await turnOn();
    expect(screen.getByTestId('mic-problem').textContent).toBe('No microphone was found on this device. You can still answer on the screen.');
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
    expect(screen.getByTestId('mic-problem').textContent).toBe(
      'The microphone turned off because Fermatina was no longer on screen (for example, you switched to another app or tab). You can still answer on the screen.',
    );
    expect(pressed()).toBe('false');
  });

  it('a view change while listening: no track, off, and no untrue "off screen" sentence', async () => {
    render(ui());
    await turnOn();
    expect(live()).toBe(1);
    act(() => {
      useAppStore.setState({ view: 'explore' });
    });
    expect(live()).toBe(0);
    expect(toggle().getAttribute('data-state')).toBe('off');
    expect(screen.queryByTestId('mic-problem')).toBeNull();
    expect(pressed()).toBe('false');
  });

  it('turned off while the browser is still asking: the stream that arrives is stopped', async () => {
    const gate = mic.hold();
    render(ui());
    fireEvent.click(toggle());
    await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Turn on the microphone' }));
    await vi.waitFor(() => expect(screen.getByText('Your browser is asking whether Fermatina may use the microphone.')).toBeTruthy());
    await vi.waitFor(() => expect(mic.getUserMedia).toHaveBeenCalledTimes(1));
    fireEvent.click(toggle());
    gate.release();
    await wait(0);
    await wait(0);
    expect(mic.tracks.length).toBe(1);
    expect(live()).toBe(0);
  });

  it('already allowed for this site: the first tap listens at once (asked only in that tap)', async () => {
    (navigator.permissions.query as ReturnType<typeof vi.fn>).mockResolvedValue({ state: 'granted' });
    render(ui());
    await wait(0);
    expect(navigator.permissions.query).not.toHaveBeenCalled();
    fireEvent.click(toggle());
    await settle();
    expect(navigator.permissions.query).toHaveBeenCalledTimes(1);
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/^To hear the notes you play/)).toBeNull();
  });
});
