/**
 * Audit W8-02 (F-03): a piano key released BEFORE the audio system has woken
 * up (resumeAudio still pending — the first tap, or after the browser
 * suspended audio) used to leave its note sounding and the key shown as
 * pressed: the note-on was only recorded after resumeAudio resolved, so the
 * release found nothing to stop. The keyboard, mouse and touch paths share
 * these handlers; the computer-keyboard path drives them here.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

let releaseResume: () => void = () => {};
vi.mock('../../../core/services/audio.ts', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>();
  return {
    ...original,
    resumeAudio: vi.fn(() => new Promise<void>((resolve) => { releaseResume = resolve; })),
    startSustainedNote: vi.fn(),
    stopSustainedNote: vi.fn(),
    setMasterVolume: vi.fn(),
  };
});

import { Piano } from '../Piano';
import { startSustainedNote, stopSustainedNote, resumeAudio } from '../../../core/services/audio.ts';
import { useAppStore } from '../../../state/store';

(Element.prototype as unknown as { scrollTo: () => void }).scrollTo = () => {};
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (q: string) => ({
    matches: false, media: q, onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return false; },
  }),
});

const key = (type: 'keydown' | 'keyup', k: string) =>
  document.dispatchEvent(new KeyboardEvent(type, { key: k, bubbles: true }));

async function wakeAudio() {
  await act(async () => {
    releaseResume();
    for (let i = 0; i < 5; i++) await Promise.resolve();
  });
}

beforeEach(() => {
  useAppStore.setState({ activeNotes: new Set<number>(), baseOctave: 4, instrument: 'piano' });
});
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('Piano: quick tap while the audio system wakes up (W8-02)', () => {
  it('a key released before audio resumes still stops its note and un-presses the key', async () => {
    render(<Piano />);
    key('keydown', 'a');
    key('keyup', 'a');
    expect(resumeAudio).toHaveBeenCalledTimes(1); // known positive: the note-on is pending
    await wakeAudio();

    expect(startSustainedNote).toHaveBeenCalledTimes(1); // the tap still sounds…
    expect(stopSustainedNote).toHaveBeenCalledTimes(1); // …and is released
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
  });

  it('control: a key still held when audio resumes keeps sounding until released', async () => {
    render(<Piano />);
    key('keydown', 'a');
    await wakeAudio();
    expect(startSustainedNote).toHaveBeenCalledTimes(1);
    expect(stopSustainedNote).not.toHaveBeenCalled();
    expect(useAppStore.getState().activeNotes.size).toBe(1);

    key('keyup', 'a');
    expect(stopSustainedNote).toHaveBeenCalledTimes(1);
    expect([...useAppStore.getState().activeNotes]).toEqual([]);
  });
});
