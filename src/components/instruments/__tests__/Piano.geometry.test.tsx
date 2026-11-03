import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { Piano } from '../Piano';

vi.mock('../../../hooks/useAudio.ts', () => ({ useAudio: () => ({ noteOn: vi.fn(), noteOff: vi.fn() }) }));
let viewportWidth = 1440;
vi.mock('../../../hooks/useMediaQuery.ts', () => ({
  useIsMobile: () => viewportWidth < 640,
  useIsCompact: () => viewportWidth < 1024,
  useMediaQuery: () => false,
}));

const scrollTo = vi.fn();
let resized: () => void;
beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback: () => void) { resized = callback; }
    observe() {} disconnect() {}
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get: () => viewportWidth });
  HTMLElement.prototype.scrollTo = scrollTo;
  scrollTo.mockClear();
  useAppStore.setState({ view: 'explore', exerciseInputActive: false, baseOctave: 4, selectedChord: null,
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', scaleOctaves: 1, highlightedNotes: [] });
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('piano geometry from rendered key dimensions', () => {
  it.each([360, 390, 639, 640, 768, 1023, 1024, 1280, 1366, 1440, 1536, 1920])('centres all black keys on white boundaries at %i px', (width) => {
    viewportWidth = width;
    const { container } = render(<Piano />);
    let boundary = 0;
    const boundaries = new Map<number, number>();
    for (const key of container.querySelectorAll<HTMLElement>('[data-piano-key]')) {
      if (key.style.position === 'absolute' || key.classList.contains('absolute')) continue;
      boundary += parseFloat(key.style.width);
      boundaries.set(Number(key.dataset.midi), boundary);
    }
    expect(boundaries.size).toBe(52);
    const blacks = [...container.querySelectorAll<HTMLElement>('[data-piano-key]')].filter((key) => !boundaries.has(Number(key.dataset.midi)));
    expect(blacks).toHaveLength(36);
    for (const black of blacks) {
      const centre = parseFloat(black.parentElement!.style.left) + parseFloat(black.style.left) + parseFloat(black.style.width) / 2;
      expect(Math.abs(centre - boundaries.get(Number(black.dataset.midi) - 1)!), `MIDI ${black.dataset.midi}`).toBeLessThanOrEqual(2);
    }
  });

  it('centres the selected octave with no highlights, on entry, chip changes and container resize', () => {
    viewportWidth = 768;
    useAppStore.setState({ view: 'learn', exerciseInputActive: true });
    const { container } = render(<Piano />);
    const expectedLeft = (octave: number) => {
      const whites = [...container.querySelectorAll<HTMLElement>('[data-piano-key]')].filter((k) => !k.classList.contains('absolute'));
      const start = whites.findIndex((k) => Number(k.dataset.midi) === 12 + octave * 12);
      const width = parseFloat(whites[0].style.width);
      return Math.max(0, (start + 3.5) * width - viewportWidth / 2);
    };
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: expectedLeft(4) }));
    act(() => useAppStore.setState({ baseOctave: 5 }));
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: expectedLeft(5) }));
    scrollTo.mockClear();
    act(() => useAppStore.setState({ highlightedNotes: [{ natural: 'C', accidental: '', octave: 4 }] }));
    expect(scrollTo).not.toHaveBeenCalled(); // picks across octaves must not pull the view away
    viewportWidth = 900;
    act(() => resized());
    expect(scrollTo).toHaveBeenLastCalledWith(expect.objectContaining({ left: expectedLeft(5) }));
  });
});
