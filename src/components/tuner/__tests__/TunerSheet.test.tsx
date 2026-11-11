/**
 * The tuner (brief T) with a fake microphone: it says why before the browser
 * is asked; it names the note and how far off it is, in words and cents;
 * the guitar's strings follow the current tuning, picked by themselves or
 * chosen; "Hear" plays a string with no microphone at all; and refused, no
 * microphone, no support, closed while listening and hidden while listening
 * each leave no track running and a true sentence on screen.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { installFakeMic, midiHz, tone, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { subscribeExternalNotes, type ExternalNote } from '../../../services/externalNotes';
import { stopListening } from '../../../services/microphone/microphone';
import { useAppStore } from '../../../state/store';

const { played, still } = vi.hoisted(() => ({ played: [] as number[], still: { value: false } }));
vi.mock('../hearString.ts', () => ({
  REFERENCE_SECONDS: 2.5,
  prepareGuitarStrings: () => undefined,
  playGuitarString: (midi: number) => played.push(midi),
}));
vi.mock('../../../hooks/useMediaQuery.ts', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  useMediaQuery: (q: string) => (q.includes('prefers-reduced-motion') ? still.value : false),
}));

import { TunerSheet } from '../TunerSheet';

let mic: FakeMic;
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'setTimeout', 'clearTimeout', 'performance'] });
  mic = installFakeMic();
  played.length = 0;
  still.value = false;
  useAppStore.setState({ view: 'explore', language: 'en', instrument: 'guitar', guitarTuningId: 'standard' });
});
afterEach(() => {
  cleanup();
  stopListening();
  mic.restore();
  vi.useRealTimers();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});

const live = () => mic.tracks.filter((t) => t.readyState === 'live').length;

async function listen(sound?: ReturnType<typeof tone>) {
  if (sound) mic.setSound(sound);
  fireEvent.click(screen.getByRole('button', { name: 'Start listening' }));
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}
async function wait(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe('TunerSheet: before and while listening', () => {
  it('says why, in one sentence with the privacy promise, before the browser is asked', () => {
    render(<TunerSheet open onClose={() => undefined} />);
    expect(screen.getByRole('dialog', { name: 'Tuner' })).toBeTruthy();
    expect(screen.getByText('To tell you which note you play and whether it is in tune, Fermata listens through the microphone; the sound never leaves this device.')).toBeTruthy();
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(screen.queryByTestId('listening-mark')).toBeNull();
  });

  it('the low E string a little flat: "flat", "tighten", string 6, and the listening mark', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40, -14)));
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('listening-mark').textContent).toBe('Listening');
    await wait(600);
    const reading = screen.getByTestId('tuner-reading');
    expect(reading.getAttribute('data-state')).toBe('flat');
    expect(Number(reading.getAttribute('data-cents'))).toBeGreaterThanOrEqual(-16);
    expect(Number(reading.getAttribute('data-cents'))).toBeLessThanOrEqual(-12);
    expect(screen.getByTestId('tuner-note').textContent).toBe('E');
    expect(screen.getByTestId('tuner-target').textContent).toBe('String 6 · E');
    expect(screen.getByTestId('tuner-words').textContent).toMatch(/^1[2-6] cents flat \(too low\)$/);
    expect(within(reading).getByText('Tighten the string a little.')).toBeTruthy();
    // The string heard is marked on the row (a dashed ring, not colour alone).
    expect(screen.getByRole('radio', { name: 'String 6, E' }).hasAttribute('data-near')).toBe(true);
  });

  it('tightened until in tune: "In tune ✓"; too high: "sharp", "loosen"', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40, -14)));
    await wait(600);
    mic.setSound(tone(midiHz(40, 2)));
    await wait(900);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('inTune');
    expect(screen.getByTestId('tuner-words').textContent).toBe('In tune ✓');
    expect(screen.getByText('Leave the string as it is.')).toBeTruthy();
    mic.setSound(tone(midiHz(45, 22)));
    await wait(900);
    expect(screen.getByTestId('tuner-target').textContent).toBe('String 5 · A');
    expect(screen.getByTestId('tuner-words').textContent).toMatch(/^2[0-4] cents sharp \(too high\)$/);
    expect(screen.getByText('Loosen the string a little.')).toBeTruthy();
  });

  it('the reading is steady: one stray frame does not move it', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    let n = 0;
    const good = tone(midiHz(50, -8));
    const stray = tone(midiHz(50, 40));
    await listen((f, r, t) => ((n++ % 7 === 3) ? stray : good)(f, r, t));
    const seen: number[] = [];
    for (let i = 0; i < 30; i++) {
      await wait(30);
      const c = screen.queryByTestId('tuner-reading')?.getAttribute('data-cents');
      if (c) seen.push(Number(c));
    }
    const settled = seen.slice(10);
    expect(Math.max(...settled) - Math.min(...settled)).toBeLessThanOrEqual(3);
  });

  it('a string chosen by the learner is the target, whatever is heard', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    fireEvent.click(screen.getByRole('radio', { name: 'String 6, E' }));
    await listen(tone(midiHz(45)));
    await wait(600);
    expect(screen.getByTestId('tuner-target').textContent).toBe('String 6 · E');
    expect(screen.getByTestId('tuner-words').textContent).toBe('Much too high');
    expect(screen.getByText('Loosen the string.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Find the string automatically' }));
    await wait(600);
    expect(screen.getByTestId('tuner-target').textContent).toBe('String 5 · A');
  });

  it('nothing heard: "Play one string and let it ring." and no needle', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen();
    await wait(300);
    expect(screen.getByTestId('tuner-words').textContent).toBe('Play one string and let it ring.');
    expect(document.querySelector('.tuner-meter-needle')).toBeNull();
  });

  it('under prefers-reduced-motion the needle does not animate and the reading changes at most every 300 ms', async () => {
    still.value = true;
    render(<TunerSheet open onClose={() => undefined} />);
    // A string being turned: the pitch glides up 40 cents a second, so the
    // reading would change on every frame if it were not held.
    const start = performance.now();
    await listen((f, r, t) => tone(midiHz(52, -30 + (40 * (t - start)) / 1000))(f, r, t));
    await wait(600);
    expect(document.querySelector('.tuner-meter')!.hasAttribute('data-still')).toBe(true);
    const changes: string[] = [];
    for (let i = 0; i < 20; i++) {
      await wait(30);
      changes.push(screen.getByTestId('tuner-reading').getAttribute('data-cents') ?? '');
    }
    // 600 ms of frames, at most one change every 300 ms (≤ 3 distinct runs).
    const runs = changes.filter((c, i) => i === 0 || c !== changes[i - 1]).length;
    expect(runs).toBeLessThanOrEqual(3);
  });
});

describe('TunerSheet: the strings', () => {
  it.each([
    ['standard', ['E', 'A', 'D', 'G', 'B', 'E']],
    ['drop-d', ['D', 'A', 'D', 'G', 'B', 'E']],
    ['half-step-down', ['E♭', 'A♭', 'D♭', 'G♭', 'B♭', 'E♭']],
    ['open-d', ['D', 'A', 'D', 'F♯', 'A', 'D']],
  ])('%s: the six strings of the CURRENT tuning, low to high, each with Hear', (id, notes) => {
    useAppStore.setState({ guitarTuningId: id });
    render(<TunerSheet open onClose={() => undefined} />);
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => r.getAttribute('aria-label'))).toEqual(notes.map((n, i) => `String ${6 - i}, ${n}`));
    expect(screen.getByTestId('tuner-strings').getAttribute('data-tuning')).toBe(id);
    expect(screen.getAllByRole('button', { name: /^Hear string / })).toHaveLength(6);
  });

  it('Hear plays the string with the guitar voice, with no microphone at all', () => {
    useAppStore.setState({ guitarTuningId: 'drop-d' });
    render(<TunerSheet open onClose={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 6, D' }));
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 1, E' }));
    expect(played).toEqual([38, 64]);
    expect(mic.getUserMedia).not.toHaveBeenCalled();
  });

  it('while a reference plays, the tuner does not read it as the learner\'s string', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    await wait(400);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('inTune');
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 6, E' }));
    await wait(1000);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('none');
    expect(screen.getByTestId('tuner-words').textContent).toMatch(/^Playing string 6 \(E\)/);
    await wait(2600);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('inTune');
  });

  it('the piano selected: a tuner for any note, no guitar strings', async () => {
    useAppStore.setState({ instrument: 'piano' });
    render(<TunerSheet open onClose={() => undefined} />);
    expect(screen.queryByTestId('tuner-strings')).toBeNull();
    await listen(tone(midiHz(69, 9)));
    await wait(600);
    expect(screen.getByTestId('tuner-note').textContent).toBe('A');
    expect(screen.queryByTestId('tuner-target')).toBeNull();
    expect(screen.getByTestId('tuner-words').textContent).toMatch(/cents sharp/);
    expect(screen.queryByText(/the string/)).toBeNull();
  });
});

describe('TunerSheet: when the microphone cannot be used, nothing is left running', () => {
  it('refused: says so, how to allow it, that Hear still works; no track', async () => {
    mic.failWith('NotAllowedError');
    render(<TunerSheet open onClose={() => undefined} />);
    await listen();
    const message = screen.getByTestId('tuner-message').textContent;
    expect(message).toContain("The microphone is blocked for Fermata, so the tuner can't hear you.");
    expect(message).toContain("To allow it, open this site's settings");
    expect(message).toContain('You can still tune by ear: “Hear” plays each string.');
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 5, A' }));
    expect(played).toEqual([45]);
  });

  it('no microphone: says so; no track', async () => {
    mic.failWith('NotFoundError');
    render(<TunerSheet open onClose={() => undefined} />);
    await listen();
    expect(screen.getByTestId('tuner-message').textContent).toContain('No microphone was found on this device');
    expect(live()).toBe(0);
  });

  it('no microphone support in the browser: says so, offers no Start, Hear still works', () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    render(<TunerSheet open onClose={() => undefined} />);
    expect(screen.getByTestId('tuner-message').textContent).toContain("This browser can't use a microphone here");
    expect(screen.queryByRole('button', { name: 'Start listening' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 4, D' }));
    expect(played).toEqual([50]);
  });

  it('the tuner closed while listening: every track stopped', async () => {
    const { rerender } = render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    expect(live()).toBe(1);
    rerender(<TunerSheet open={false} onClose={() => undefined} />);
    expect(live()).toBe(0);
    expect(mic.contexts[0].state).toBe('closed');
    rerender(<TunerSheet open onClose={() => undefined} />);
    expect(screen.getByRole('button', { name: 'Start listening' })).toBeTruthy();
  });

  it('the tuner unmounted while listening: every track stopped', async () => {
    const { unmount } = render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    unmount();
    expect(live()).toBe(0);
  });

  it('the page hidden while listening: every track stopped, and it says so', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' });
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(live()).toBe(0);
    expect(screen.getByTestId('tuner-message').textContent).toBe('Listening stopped when Fermata went to the background.');
    expect(screen.queryByTestId('listening-mark')).toBeNull();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('closed while the browser is still asking: the stream is stopped when it arrives', async () => {
    const gate = mic.hold();
    const { rerender } = render(<TunerSheet open onClose={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Start listening' }));
    expect(screen.getByText('Your browser is asking whether Fermata may use the microphone.')).toBeTruthy();
    rerender(<TunerSheet open={false} onClose={() => undefined} />);
    gate.release();
    await wait(0);
    expect(mic.tracks.length).toBe(1);
    expect(live()).toBe(0);
  });
});

describe('TunerSheet: Explore lights what is played', () => {
  it('"Show what I play on the instrument" reports each held note (source mic); off by default', async () => {
    const heard: ExternalNote[] = [];
    const off = subscribeExternalNotes((n) => heard.push(n));
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(55)));
    await wait(400);
    expect(heard).toEqual([]);
    const show = screen.getByRole('button', { name: 'Show what I play on the instrument' });
    expect(show.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(show);
    await wait(400);
    expect(heard).toEqual([{ midi: 55, on: true, source: 'mic' }]);
    fireEvent.click(show);
    expect(heard).toEqual([{ midi: 55, on: true, source: 'mic' }, { midi: 55, on: false, source: 'mic' }]);
    off();
  });

  it('not offered outside Explore', async () => {
    useAppStore.setState({ view: 'learn' });
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(55)));
    expect(screen.queryByRole('button', { name: 'Show what I play on the instrument' })).toBeNull();
  });
});
