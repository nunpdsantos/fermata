/**
 * A fret tapped on the board sounds for 0.8 s and is then let go (`noteOff`).
 * A board that goes away inside those 0.8 s (an instrument switch, the full
 * neck opening, a view change) must still let the note go: until wave 3's
 * final review the release timer was only cleared, so the note stayed held
 * (lit, and — core audio's "the app is sounding" signal — reported as
 * sounding for ever, which left the microphone deaf until a reload).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { Fretboard } from '../Fretboard';

const audio = vi.hoisted(() => ({ next: 0, on: [] as number[], off: [] as number[] }));
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({
    noteOn: () => {
      const midi = 40 + audio.next++;
      audio.on.push(midi);
      return Promise.resolve(midi);
    },
    noteOff: (midi: number) => audio.off.push(midi),
  }),
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  audio.next = 0;
  audio.on.length = 0;
  audio.off.length = 0;
  useAppStore.setState({ instrument: 'guitar', view: 'explore', selectedChord: null, exerciseInputActive: false, activeNotes: new Set<number>(), capoFret: 0 } as never);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const anyCell = () => screen.getByRole('grid').querySelector<HTMLElement>('[data-string-row="1"][data-fret="2"]')!;

describe('a tapped fret is always let go', () => {
  it('after 0.8 s, as before', async () => {
    render(<Fretboard />);
    fireEvent.click(anyCell());
    await act(async () => {
      await Promise.resolve();
    });
    expect(audio.on).toHaveLength(1);
    expect(audio.off).toEqual([]);
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(audio.off).toEqual(audio.on);
  });

  it('the board unmounted inside the 0.8 s: let go at once, and only once', async () => {
    const { unmount } = render(<Fretboard />);
    fireEvent.click(anyCell());
    await act(async () => {
      await Promise.resolve();
    });
    expect(audio.on).toHaveLength(1);
    unmount();
    expect(audio.off).toEqual(audio.on);
    vi.advanceTimersByTime(2000);
    expect(audio.off).toEqual(audio.on);
  });
});
