import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import { useAppStore } from '../../../state/store';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));

// DESKTOP: useIsMobile false
vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsCompact: () => false,
  useIsTablet: () => false,
}));

function pointer(type: string, clientX: number, pointerType = 'mouse'): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType,
    button: 0,
    clientX,
  });
}

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    instrument: 'guitar',
    activeNotes: new Set<number>(),
    guitarScalePosition: null,
    guitarTuningId: 'standard',
    quickSearchOpen: false,
    themeMode: 'fermata',
  });
});
afterEach(cleanup);

describe('Fretboard desktop drag-to-scroll (useDragScroll)', () => {
  async function renderFretboard() {
    const { Fretboard } = await import('../Fretboard');
    return render(<Fretboard />);
  }

  it('dragging the grid past threshold scrolls it (mouse)', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' }) as HTMLElement;
    grid.scrollLeft = 100;

    // Press on the grid background (not a button) and drag left 60px.
    fireEvent(grid, pointer('pointerdown', 400));
    fireEvent(document, pointer('pointermove', 340)); // dx -60 -> 160
    expect(grid.scrollLeft).toBe(160);
    fireEvent(document, pointer('pointerup', 340));

    // After release, further moves do nothing.
    fireEvent(document, pointer('pointermove', 0));
    expect(grid.scrollLeft).toBe(160);
  });

  it('does NOT render the mobile scroll strip on desktop', async () => {
    await renderFretboard();
    expect(screen.queryByTestId('scroll-strip')).toBeNull();
  });

  it('the grid has no touch-action:none on desktop (native behavior preserved)', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });
    expect(grid.style.touchAction).toBeFalsy();
  });
});

// ─── Initial scroll position (nut end) ─────────────────────────────────────
import { Fretboard as FretboardForNut } from '../Fretboard';

describe('Fretboard — opens at the nut end', () => {
  let swSpy: PropertyDescriptor | undefined;
  let cwSpy: PropertyDescriptor | undefined;

  beforeEach(() => {
    swSpy = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth');
    cwSpy = Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth');
    Object.defineProperty(Element.prototype, 'scrollWidth', { configurable: true, get: () => 660 });
    Object.defineProperty(Element.prototype, 'clientWidth', { configurable: true, get: () => 300 });
  });

  afterEach(() => {
    // jsdom defines both on Element.prototype, so the captured descriptors
    // always exist — restore them unconditionally.
    if (swSpy) Object.defineProperty(Element.prototype, 'scrollWidth', swSpy);
    if (cwSpy) Object.defineProperty(Element.prototype, 'clientWidth', cwSpy);
    cleanup();
  });

  it('scrolls to the far right (nut-RIGHT layout) on mount when nothing is selected', () => {
    useAppStore.setState({ selectedChord: null });
    const { container } = render(<FretboardForNut />);
    const scrollers = [...container.querySelectorAll('div')].filter(
      (d) => getComputedStyle(d).overflowX === 'auto' || d.className.includes('overflow-x-auto'),
    );
    // The board's horizontal scroller should start at the nut end: scrollWidth - clientWidth.
    expect(scrollers.some((d) => d.scrollLeft === 360)).toBe(true);
  });
});
