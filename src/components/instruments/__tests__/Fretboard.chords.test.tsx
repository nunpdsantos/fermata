/**
 * Fretboard chord / highlight paths:
 *   W3-04 — notes tapped during a Learn exercise light up on the fretboard.
 *   W3-05 — under an alternate tuning a selected chord shows its notes and a
 *           notice, not silently the scale.
 *   W3-15 — the chord-shape index resets in the same render as the chord.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, act, within } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';
import { buildChord } from '../../../core/constants/chords';
import type { Note, PitchedNote } from '../../../core/types/music';

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

vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsCompact: () => false,
  useIsTablet: () => false,
}));

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });
const P = (natural: Note['natural'], octave: number): PitchedNote => ({ natural, accidental: '', octave });

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({
    selectedKey: N('C'),
    selectedScale: 'major',
    selectedChord: null,
    chordInversion: 0,
    instrument: 'guitar',
    activeNotes: new Set<number>(),
    highlightedNotes: [],
    exerciseInputActive: false,
    guitarScalePosition: null,
    guitarTuningId: 'standard',
    quickSearchOpen: false,
    themeMode: 'fermata',
  });
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
});
afterEach(cleanup);

async function renderFretboard() {
  const { Fretboard } = await import('../Fretboard');
  return render(<Fretboard />);
}

const dotsOf = (container: HTMLElement, kind: string) =>
  [...container.querySelectorAll<HTMLElement>(`[data-dot="${kind}"]`)].map((el) => ({
    string: Number(el.dataset.dotString),
    fret: Number(el.dataset.dotFret),
    label: el.textContent,
  }));

function cellsWithPcs(openMidi: number[], pcs: Set<number>) {
  let n = 0;
  for (const o of openMidi) for (let f = 0; f <= 15; f++) if (pcs.has((o + f) % 12)) n++;
  return n;
}

const STANDARD = [40, 45, 50, 55, 59, 64];
const DROP_D = [38, 45, 50, 55, 59, 64];

describe('exercise taps light the fretboard (W3-04)', () => {
  it('every C, E and G on the neck lights after tapping C, E, G', async () => {
    useAppStore.setState({ exerciseInputActive: true, highlightedNotes: [P('C', 4), P('E', 4), P('G', 4)] });
    const { container } = await renderFretboard();
    const lit = dotsOf(container, 'highlight');
    expect(lit).toHaveLength(cellsWithPcs(STANDARD, new Set([0, 4, 7])));
    // No scale/position hints during an exercise.
    expect(dotsOf(container, 'position')).toHaveLength(0);
    expect(dotsOf(container, 'scale')).toHaveLength(0);
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('nothing is lit before the first tap, and a tap lights immediately', async () => {
    useAppStore.setState({ exerciseInputActive: true });
    const { container } = await renderFretboard();
    expect(dotsOf(container, 'highlight')).toHaveLength(0);
    act(() => useAppStore.getState().setHighlightedNotes([P('A', 3)]));
    expect(dotsOf(container, 'highlight')).toHaveLength(cellsWithPcs(STANDARD, new Set([9])));
  });
});

describe('alternate tunings with a chord selected (W3-05, W10-11)', () => {
  it('Drop D + C major chord: a notice, and the chord tones (not the D major scale) on the neck', async () => {
    useAppStore.setState({
      guitarTuningId: 'drop-d',
      selectedKey: N('D'),
      selectedChord: buildChord(N('C'), 'major'),
    });
    const { container } = await renderFretboard();
    expect(screen.getByRole('status').textContent).toContain('fretboard.chordShapesStandardOnly');
    expect(dotsOf(container, 'highlight')).toHaveLength(cellsWithPcs(DROP_D, new Set([0, 4, 7])));
    expect(dotsOf(container, 'scale')).toHaveLength(0);
    expect(dotsOf(container, 'position')).toHaveLength(0);
  });
});

describe('inversions and slash chords set the bass (W3-11)', () => {
  const lowestVoicedPc = (container: HTMLElement) => {
    const voiced = dotsOf(container, 'voicing').sort((a, b) => a.string - b.string);
    expect(voiced.length).toBeGreaterThan(0);
    return (STANDARD[voiced[0].string] + voiced[0].fret) % 12;
  };

  it('C major, 1st inversion: the default shape has E as its lowest note', async () => {
    useAppStore.setState({ selectedChord: buildChord(N('C'), 'major'), chordInversion: 1 });
    const { container } = await renderFretboard();
    expect(lowestVoicedPc(container)).toBe(4);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('Dm7/G: G is the lowest note', async () => {
    useAppStore.setState({ selectedChord: { ...buildChord(N('D'), 'minor7'), bassNote: N('G') } });
    const { container } = await renderFretboard();
    expect(lowestVoicedPc(container)).toBe(7);
  });

  it('when no shape can carry the bass, the board says so instead of ignoring it', async () => {
    useAppStore.setState({ selectedChord: buildChord(N('C'), 'minor7'), chordInversion: 1 });
    await renderFretboard();
    expect(screen.getByRole('status').textContent).toContain('fretboard.bassNotice');
  });
});

describe('chord-shape index follows the chord in the same render (W3-15)', () => {
  it('switching chords selects the new chord\'s first shape immediately', async () => {
    useAppStore.setState({ selectedChord: buildChord(N('C'), 'major') });
    await renderFretboard();
    const tabs = () => within(screen.getByRole('tablist', { name: 'fretboard.chordPosition' })).getAllByRole('tab');
    expect(tabs().length).toBeGreaterThan(3);
    fireEvent.click(tabs()[3]);
    expect(tabs()[3].getAttribute('aria-selected')).toBe('true');
    act(() => useAppStore.getState().setSelectedChord(buildChord(N('D'), 'major')));
    // Synchronously after the change — no microtask has run yet.
    expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
  });
});
