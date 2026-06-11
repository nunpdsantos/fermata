import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, within } from '@testing-library/react';
import { useAppStore } from '../../../state/store';

// ---------------------------------------------------------------------------
// jsdom stubs
// ---------------------------------------------------------------------------
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
  HTMLDivElement.prototype.scrollTo = vi.fn() as typeof HTMLDivElement.prototype.scrollTo;
});

// ---------------------------------------------------------------------------
// Mocks — mobile, no real audio, deterministic i18n
// ---------------------------------------------------------------------------
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));

vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => true,
  useIsCompact: () => true,
  useIsTablet: () => true,
}));

function pointer(type: string, clientX: number, pointerId = 1): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    pointerType: 'touch',
    button: 0,
    clientX,
  });
}

function resetStore() {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    selectedDegree: null,
    chordInversion: 0,
    instrument: 'piano',
    activeNotes: new Set<number>(),
    highlightedNotes: [],
    guitarScalePosition: null,
    guitarTuningId: 'standard',
    baseOctave: 4,
    scaleOctaves: 1 as 1 | 2,
    volume: 0.7,
    view: 'explore' as const,
    quickSearchOpen: false,
    themeMode: 'fermata',
  });
}

beforeEach(resetStore);
afterEach(cleanup);

describe('Piano scroll strip (mobile)', () => {
  async function renderPiano() {
    const { Piano } = await import('../Piano');
    return render(<Piano />);
  }

  it('renders a decorative scroll strip', async () => {
    await renderPiano();
    const strip = screen.getByTestId('scroll-strip');
    expect(strip).toBeDefined();
    expect(strip.getAttribute('aria-hidden')).toBe('true');
    // MUST be 'none': pan-x lets iOS claim the gesture natively → pointercancel
    // → manual scroll starves (WS12 hotfix; synthetic tests can't catch it).
    expect(strip.style.touchAction).toBe('none');
  });

  it('dragging the strip changes container.scrollLeft', async () => {
    const { container } = await renderPiano();
    const scroller = container.querySelector('.piano-scroll') as HTMLElement;
    expect(scroller).not.toBeNull();
    scroller.scrollLeft = 200;

    const strip = screen.getByTestId('scroll-strip');
    fireEvent(strip, pointer('pointerdown', 300));
    fireEvent(document, pointer('pointermove', 220)); // dx = -80 -> scrollLeft = 280
    expect(scroller.scrollLeft).toBe(280);
    fireEvent(document, pointer('pointerup', 220));
  });

  it('the keys container carries touch-action:none (a finger on a key never scrolls)', async () => {
    const { container } = await renderPiano();
    const scroller = container.querySelector('.piano-scroll') as HTMLElement;
    expect(scroller.style.touchAction).toBe('none');

    // And the keys themselves carry the Tailwind touch-none class.
    const aKey = within(container)
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label') === 'C4');
    expect(aKey).toBeDefined();
    expect(aKey!.className).toContain('touch-none');
  });

  it('a pointerdown on a KEY does not scroll the container', async () => {
    const { container } = await renderPiano();
    const scroller = container.querySelector('.piano-scroll') as HTMLElement;
    scroller.scrollLeft = 100;

    const aKey = within(container)
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label') === 'C4')!;
    // Pressing and "dragging" across a key (which has touch-action:none and no
    // scroll handler) must not move the scroller — only the strip scrolls.
    fireEvent(aKey, pointer('pointerdown', 300));
    fireEvent(document, pointer('pointermove', 100));
    expect(scroller.scrollLeft).toBe(100);
  });
});

describe('Fretboard scroll strip (mobile)', () => {
  async function renderFretboard() {
    const { Fretboard } = await import('../Fretboard');
    return render(<Fretboard />);
  }

  it('renders a decorative scroll strip below the grid', async () => {
    await renderFretboard();
    const strip = screen.getByTestId('scroll-strip');
    expect(strip.getAttribute('aria-hidden')).toBe('true');
    // MUST be 'none': pan-x lets iOS claim the gesture natively → pointercancel
    // → manual scroll starves (WS12 hotfix; synthetic tests can't catch it).
    expect(strip.style.touchAction).toBe('none');
  });

  it('the scroll container has touch-action:none on mobile', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' });
    expect(grid.style.touchAction).toBe('none');
  });

  it('dragging the strip changes the grid scrollLeft', async () => {
    await renderFretboard();
    const grid = screen.getByRole('grid', { name: 'fretboard.label' }) as HTMLElement;
    grid.scrollLeft = 150;

    const strip = screen.getByTestId('scroll-strip');
    fireEvent(strip, pointer('pointerdown', 300));
    fireEvent(document, pointer('pointermove', 250)); // dx -50 -> 200
    expect(grid.scrollLeft).toBe(200);
    fireEvent(document, pointer('pointerup', 250));
  });

  it('fret cells carry touch-action:none', async () => {
    const { container } = await renderFretboard();
    const fretCell = within(container)
      .getAllByRole('button')
      .find((b) => /fret \d+, string/.test(b.getAttribute('aria-label') ?? ''))!;
    expect(fretCell.style.touchAction).toBe('none');
  });
});
