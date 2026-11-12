/**
 * The tuner (brief T; its microphone since brief U is the app's one switch,
 * inline at its top) with a fake microphone: it says why before the browser
 * is asked; it names the note and how far off it is, in words and cents;
 * the guitar's strings follow the current tuning, picked by themselves or
 * chosen; "Hear" plays a string with no microphone at all; and refused, no
 * microphone, no support, closed while listening (over a view that cannot
 * use a played note) and hidden while listening each leave no track running
 * and a true sentence on screen. In Explore the notes played are reported
 * (the one listener lights them); closing the tuner there keeps it on.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import { installFakeMic, midiHz, tone, watchPrivacy, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { subscribeExternalNotes, type ExternalNote } from '../../../services/externalNotes';
import { stopListening } from '../../../services/microphone/microphone';
import { micOff, useMic } from '../../../services/microphone/micSwitch';
import '../../../services/microphone/micSession';
import { useExternalNotes, loadExternalNotesListener } from '../../../services/externalNotesHost';
import { releaseAllExternalNotes } from '../../../services/externalNotesListener';
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
  micOff();
  useAppStore.setState({ view: 'explore', language: 'en', instrument: 'guitar', guitarTuningId: 'standard', activeNotes: new Set<number>() });
});
afterEach(() => {
  cleanup();
  micOff();
  stopListening();
  releaseAllExternalNotes();
  mic.restore();
  vi.useRealTimers();
  Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' });
});

const live = () => mic.tracks.filter((t) => t.readyState === 'live').length;

const toggle = () => screen.getByRole('button', { name: 'Microphone' });
/** The switch at the tuner's top, the sentence's "Turn on the microphone"; until the browser has answered. */
async function listen(sound?: ReturnType<typeof tone>) {
  if (sound) mic.setSound(sound);
  fireEvent.click(toggle());
  await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
  fireEvent.click(screen.getByRole('button', { name: 'Turn on the microphone' }));
  await vi.waitFor(() => expect(useMic.getState().state.kind).toMatch(/^(on|problem)$/));
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
  it('says why, in one sentence with the privacy promise; the switch, off, at its top; opening it asks the browser nothing', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await wait(50);
    expect(screen.getByRole('dialog', { name: 'Tuner' })).toBeTruthy();
    expect(screen.getByText('To tell you which note you play and whether it is in tune, Fermata listens through the microphone; the sound never leaves this device.')).toBeTruthy();
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
    expect(toggle().getAttribute('data-place')).toBe('tuner');
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(navigator.permissions.query).not.toHaveBeenCalled();
    // The tap: the same sentence, now with the two buttons; still nothing opened.
    fireEvent.click(toggle());
    await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Not now' })).toBeTruthy());
    expect(screen.getByText('To tell you which note you play and whether it is in tune, Fermata listens through the microphone; the sound never leaves this device.')).toBeTruthy();
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    expect(toggle().getAttribute('data-state')).toBe('off');
    expect(screen.queryByRole('button', { name: 'Not now' })).toBeNull();
  });

  it('the low E string a little flat: "flat", "tighten", string 6, and the switch on', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40, -14)));
    expect(mic.getUserMedia).toHaveBeenCalledTimes(1);
    expect(toggle().getAttribute('aria-pressed')).toBe('true');
    expect(toggle().textContent).toBe('Microphone On');
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
    // A reading on (almost) every frame: an empty list would pass the spread check.
    expect(seen.length).toBeGreaterThanOrEqual(25);
    const settled = seen.slice(10);
    expect(Math.max(...settled) - Math.min(...settled)).toBeLessThanOrEqual(3);
  });

  it('the reading holds through a short gap (under 800 ms), then clears', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    await wait(400);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('inTune');
    mic.setSound(null);
    await wait(600);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('inTune');
    expect(screen.getByTestId('tuner-note').textContent).toBe('E');
    await wait(500);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('none');
    expect(screen.getByTestId('tuner-note').textContent).toBe('—');
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
    // A reading all along (no empty frames passing as "one run"), and it does move.
    expect(changes.every((c) => c !== '')).toBe(true);
    const runs = changes.filter((c, i) => i === 0 || c !== changes[i - 1]).length;
    expect(runs).toBeGreaterThanOrEqual(2);
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
    expect(screen.getByTestId('tuner-words').textContent).toMatch(/^Fermata is playing string 6 \(E\)/);
    await wait(2600);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('inTune');
  });

  it('Hear pressed before listening: the mute runs from the press, so a later Start reads at once', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 6, E' }));
    await wait(5000);
    await listen(tone(midiHz(40, -14)));
    await wait(600);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('flat');
  });

  it('Hear pressed just before listening: the reference still sounding is not read', async () => {
    render(<TunerSheet open onClose={() => undefined} />);
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 6, E' }));
    await wait(500);
    await listen(tone(midiHz(40)));
    await wait(1000);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).toBe('none');
    await wait(2000);
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
    // Off; the switch is how to try again.
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
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

  it('no microphone support in the browser: says so, offers no switch, Hear still works', () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    render(<TunerSheet open onClose={() => undefined} />);
    expect(screen.getByTestId('tuner-message').textContent).toContain("This browser can't use a microphone here");
    expect(screen.queryByRole('button', { name: 'Microphone' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Hear string 4, D' }));
    expect(played).toEqual([50]);
  });

  it.each(['learn', 'drill'] as const)('the tuner closed while listening in %s (nothing behind it can use a played note): off, every track stopped, every context closed', async (view) => {
    useAppStore.setState({ view });
    const { rerender } = render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    expect(live()).toBe(1);
    rerender(<TunerSheet open={false} onClose={() => undefined} />);
    expect(live()).toBe(0);
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    rerender(<TunerSheet open onClose={() => undefined} />);
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
  });

  it('the tuner closed while listening in Explore: it stays on (the top bar\'s switch says so; Explore lights what is played)', async () => {
    const { rerender } = render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(40)));
    rerender(<TunerSheet open={false} onClose={() => undefined} />);
    expect(live()).toBe(1);
    expect(useMic.getState().state.kind).toBe('on');
  });

  it('the tuner unmounted while listening in Learn: every track stopped', async () => {
    useAppStore.setState({ view: 'learn' });
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
    expect(screen.getByTestId('tuner-message').textContent).toBe('Listening stopped because Fermata was no longer on screen (for example, you switched to another app or tab).');
    expect(toggle().getAttribute('aria-pressed')).toBe('false');
  });

  it('closed (in Learn) while the browser is still asking: the stream is stopped when it arrives', async () => {
    useAppStore.setState({ view: 'learn' });
    const gate = mic.hold();
    const { rerender } = render(<TunerSheet open onClose={() => undefined} />);
    fireEvent.click(toggle());
    await vi.waitFor(() => expect(screen.getByRole('button', { name: 'Turn on the microphone' })).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Turn on the microphone' }));
    await vi.waitFor(() => expect(mic.getUserMedia).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Your browser is asking whether Fermata may use the microphone.')).toBeTruthy();
    rerender(<TunerSheet open={false} onClose={() => undefined} />);
    gate.release();
    await wait(0);
    expect(mic.tracks.length).toBe(1);
    expect(live()).toBe(0);
  });
});

describe('TunerSheet: nothing heard is kept', () => {
  it('a whole session (listen, strings heard, notes reported, closed in Learn): nothing stored, logged, recorded, sent or played back', async () => {
    useAppStore.setState({ view: 'learn' });
    const { rerender } = render(<TunerSheet open onClose={() => undefined} />);
    await wait(0);
    const watch = watchPrivacy();
    try {
      await listen(tone(midiHz(40, -14)));
      await wait(600);
      mic.setSound(tone(midiHz(45, 3)));
      await wait(900);
      expect(screen.getByTestId('tuner-target').textContent).toBe('String 5 · A');
      rerender(<TunerSheet open={false} onClose={() => undefined} />);
      await wait(0);
      expect(live()).toBe(0);
      expect(watch.findings()).toEqual([]);
    } finally {
      watch.stop();
      mic.setSound(null);
    }
  });
});

describe('TunerSheet: what is played, through the one listener', () => {
  beforeEach(async () => {
    await loadExternalNotesListener();
  });

  it('in Explore, with the microphone on, each note held is reported (source mic) and lights the instrument behind the tuner — no second control', async () => {
    renderHook(() => useExternalNotes(false));
    const heard: ExternalNote[] = [];
    const off = subscribeExternalNotes((n) => heard.push(n));
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(55)));
    await wait(400);
    expect(heard).toEqual([{ midi: 55, on: true, source: 'mic' }]);
    expect([...useAppStore.getState().activeNotes]).toEqual([55]);
    act(() => micOff());
    expect(heard).toEqual([{ midi: 55, on: true, source: 'mic' }, { midi: 55, on: false, source: 'mic' }]);
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
    off();
  });

  it('outside Explore (the tuner a sheet over Learn): the notes are reported, the one listener applies them nowhere', async () => {
    useAppStore.setState({ view: 'learn' });
    renderHook(() => useExternalNotes(false));
    const heard: ExternalNote[] = [];
    const off = subscribeExternalNotes((n) => heard.push(n));
    render(<TunerSheet open onClose={() => undefined} />);
    await listen(tone(midiHz(57)));
    await wait(600);
    expect(screen.getByTestId('tuner-reading').getAttribute('data-state')).not.toBe('none');
    expect(heard.filter((n) => n.on)).toEqual([{ midi: 57, on: true, source: 'mic' }]);
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
    expect(screen.queryByRole('button', { name: 'Show what I play on the instrument' })).toBeNull();
    off();
  });
});
