/**
 * The microphone switch in the top bar (brief U): in Explore (right side,
 * before search) and while a check answered on the instrument is open;
 * nowhere else — not in Learn's reading pages, not in Drill, not while the
 * tour plays, not where no microphone can work. What it has to say shows in
 * a note under the bar, which the next tap anywhere (or Escape) closes.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { installFakeMic, type FakeMic } from '../../../services/microphone/__tests__/fakeMic';
import { stopListening } from '../../../services/microphone/microphone';
import '../../../services/microphone/micSession';
import '../MicBarNote';
import { micOff, setMic, useMic } from '../../../services/microphone/micSwitch';
import { useAppStore } from '../../../state/store';
import { clearDemoRequest, requestDemo } from '../../../state/demoRequest';
import { TopBar } from '../../layout/TopBar';

vi.mock('../hearString.ts', () => ({ REFERENCE_SECONDS: 2.5, prepareGuitarStrings: () => undefined, playGuitarString: () => undefined }));

let mic: FakeMic;
beforeEach(() => {
  mic = installFakeMic();
  micOff();
  useMic.setState({ check: false });
  clearDemoRequest();
  useAppStore.setState({ view: 'explore', language: 'en' });
});
afterEach(() => {
  cleanup();
  micOff();
  stopListening();
  clearDemoRequest();
  mic.restore();
});

const bar = () => screen.queryByRole('button', { name: 'Microphone' });

describe('where the top bar offers the switch', () => {
  it('Explore: the switch, off, right side, before search and "⋯"; reads "Microphone Off"', () => {
    render(<TopBar />);
    const sw = bar()!;
    expect(sw.getAttribute('data-place')).toBe('bar');
    expect(sw.getAttribute('aria-pressed')).toBe('false');
    expect(sw.textContent).toBe('Microphone Off');
    const order = [...screen.getByTestId('app-topbar').querySelectorAll('button')].map((b) => b.getAttribute('aria-label') ?? b.textContent);
    expect(order.slice(-3)).toEqual(['Microphone', 'Quick search, Command+K', 'More']);
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(navigator.permissions.query).not.toHaveBeenCalled();
  });

  it.each(['learn', 'drill'] as const)('%s (no check open): no switch', (view) => {
    useAppStore.setState({ view });
    render(<TopBar />);
    expect(bar()).toBeNull();
  });

  it('Learn with a check answered on the instrument open: the switch is there too (its sentences are the check\'s, inline)', () => {
    useAppStore.setState({ view: 'learn' });
    useMic.setState({ check: true });
    render(<TopBar />);
    expect(bar()).toBeTruthy();
    act(() => setMic({ kind: 'problem', problem: 'missing' }));
    expect(screen.queryByTestId('mic-bar-note')).toBeNull();
  });

  it('Explore with the tuner open: the switch stays in the bar, but its sentences are the tuner\'s (no note under the bar)', async () => {
    const { openTuner, closeTuner } = await import('../tunerRequest');
    const inBar = () => screen.getByTestId('app-topbar').querySelector('[data-testid="mic-switch"][data-place="bar"]');
    render(<TopBar />);
    try {
      act(() => openTuner());
      act(() => setMic({ kind: 'problem', problem: 'missing' }));
      // Long enough for the note's lazy chunk to have resolved, were it asked for.
      await act(() => new Promise((resolve) => setTimeout(resolve, 100)));
      expect(inBar()).toBeTruthy();
      expect(screen.queryByTestId('mic-bar-note')).toBeNull();
      // Known positive: the tuner closed, the same kind of state shows its note under the bar.
      act(() => closeTuner());
      act(() => setMic({ kind: 'problem', problem: 'busy' }));
      expect(await screen.findByTestId('mic-bar-note')).toBeTruthy();
    } finally {
      act(() => closeTuner());
    }
  });

  it('while the tour plays: no switch; "Show me around" turns the microphone off', () => {
    render(<TopBar />);
    act(() => setMic({ kind: 'on', heard: null }));
    fireEvent.click(screen.getByRole('button', { name: 'More' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Show me around' }));
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    expect(bar()).toBeNull();
    act(() => clearDemoRequest());
    expect(bar()).toBeTruthy();
    act(() => requestDemo('intro', 'start'));
    expect(bar()).toBeNull();
  });

  it('where no microphone can work: no switch', () => {
    Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: undefined });
    render(<TopBar />);
    expect(bar()).toBeNull();
  });
});

describe('the note under the bar', () => {
  it('the tap: why, in one sentence, with "Turn on the microphone" / "Not now"; a tap anywhere else is "Not now"', async () => {
    render(<TopBar />);
    fireEvent.click(bar()!);
    const note = await screen.findByTestId('mic-bar-note');
    expect(note.textContent).toBe('To hear the notes you play, Fermata listens through the microphone; the sound never leaves this device.Turn on the microphoneNot now');
    expect(mic.getUserMedia).not.toHaveBeenCalled();
    expect(bar()!.getAttribute('aria-pressed')).toBe('false');
    fireEvent.pointerDown(document.body);
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    expect(screen.queryByTestId('mic-bar-note')).toBeNull();
    expect(mic.contexts.every((c) => c.state === 'closed')).toBe(true);
  });

  it('Escape closes it and gives focus back to the switch', async () => {
    render(<TopBar />);
    fireEvent.click(bar()!);
    await screen.findByTestId('mic-bar-note');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    expect(document.activeElement).toBe(bar());
  });

  it('keyboard: "Not now" and "Turn on the microphone" each give focus back to the switch (never to the page body); the note is an alert (inserted with its sentence)', async () => {
    render(<TopBar />);
    fireEvent.click(bar()!);
    await screen.findByTestId('mic-bar-note');
    expect(screen.getByTestId('mic-lines').getAttribute('role')).toBe('alert');
    const notNow = screen.getByRole('button', { name: 'Not now' });
    notNow.focus();
    fireEvent.click(notNow);
    expect(useMic.getState().state).toEqual({ kind: 'off' });
    expect(document.activeElement).toBe(bar());
    fireEvent.click(bar()!);
    const allow = await screen.findByRole('button', { name: 'Turn on the microphone' });
    allow.focus();
    fireEvent.click(allow);
    expect(document.activeElement).toBe(bar());
    await vi.waitFor(() => expect(useMic.getState().state.kind).toBe('on'));
    expect(document.activeElement).toBe(bar());
  });

  it('Escape meant for an open dialog (Quick Search) leaves the note and the focus alone', async () => {
    render(<TopBar />);
    fireEvent.click(bar()!);
    await screen.findByTestId('mic-bar-note');
    const dialog = document.createElement('div');
    dialog.setAttribute('aria-modal', 'true');
    document.body.append(dialog);
    try {
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(useMic.getState().state).toEqual({ kind: 'asking', step: 'explain' });
    } finally {
      dialog.remove();
    }
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(useMic.getState().state).toEqual({ kind: 'off' });
  });

  it('a tap inside the note does not close it; "Turn on the microphone" turns it on and the note goes', async () => {
    render(<TopBar />);
    fireEvent.click(bar()!);
    const allow = await screen.findByRole('button', { name: 'Turn on the microphone' });
    fireEvent.pointerDown(allow);
    fireEvent.click(allow);
    await vi.waitFor(() => expect(useMic.getState().state.kind).toBe('on'));
    expect(bar()!.getAttribute('aria-pressed')).toBe('true');
    expect(bar()!.textContent).toBe('Microphone On');
    expect(screen.queryByTestId('mic-bar-note')).toBeNull();
  });

  it.each([
    ['idle', 'The microphone turned itself off after three minutes without recognising a note.'],
    ['refused', "The microphone is blocked for Fermata. To allow it, open this site's settings (beside the address, or your phone's settings for this browser)."],
    ['hidden', 'The microphone turned off because Fermata was no longer on screen (for example, you switched to another app or tab).'],
    ['ended', 'The microphone was unplugged or disconnected, so it turned off.'],
  ] as const)('off with a sentence (%s): said in Explore\'s own words, until the next tap', async (problem, sentence) => {
    render(<TopBar />);
    act(() => setMic({ kind: 'problem', problem }));
    expect((await screen.findByTestId('mic-problem')).textContent).toBe(sentence);
    expect(bar()!.getAttribute('aria-pressed')).toBe('false');
    fireEvent.pointerDown(document.body);
    expect(screen.queryByTestId('mic-bar-note')).toBeNull();
    expect(useMic.getState().state).toEqual({ kind: 'off' });
  });
});
