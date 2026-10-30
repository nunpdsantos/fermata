/**
 * The fretboard's classical position view (decision D-02): rendered dots match
 * the generated position, the chosen position survives key changes, positions
 * can be walked with buttons and keys, labels toggle between finger / degree /
 * note, fingering can be overridden, the string-name column always shows the
 * tuning, and open strings appear only where the position uses them.
 *
 * Rows: W3-01 (UI), W3-06, W3-08, W1-16, W10-04, W10-05, W10-07, W10-11.
 */
import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, screen, act, within } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';
import { getGuitarPosition, fingeringKey } from '../../../core/utils/guitarPositions';
import { getTuningById } from '../../../core/constants/guitarTunings';
import type { Note } from '../../../core/types/music';

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) => (opts && 'numeral' in opts ? `${key}:${String(opts.numeral)}` : key),
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}));

const noteOn = vi.fn().mockResolvedValue(60);
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn, noteOff: vi.fn() }),
}));

vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => false,
  useIsCompact: () => false,
  useIsTablet: () => false,
}));

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });

beforeEach(() => {
  localStorage.clear();
  noteOn.mockClear();
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

interface Dot { kind: string; string: number; fret: number; label: string }
function dots(container: HTMLElement, kind?: string): Dot[] {
  return [...container.querySelectorAll<HTMLElement>('[data-dot]')]
    .map((el) => ({
      kind: el.dataset.dot!,
      string: Number(el.dataset.dotString),
      fret: Number(el.dataset.dotFret),
      label: el.textContent ?? '',
    }))
    .filter((d) => !kind || d.kind === kind)
    .sort((a, b) => a.string - b.string || a.fret - b.fret);
}

function expectedDots(root: Note, scale: Parameters<typeof getGuitarPosition>[1], n: number, label: 'finger' | 'degree' = 'finger', tuningId = 'standard') {
  return getGuitarPosition(root, scale, n, getTuningById(tuningId))
    .notes.map((x) => ({ kind: 'position', string: x.stringIndex, fret: x.fret, label: label === 'finger' ? String(x.finger) : x.degreeLabel }))
    .sort((a, b) => a.string - b.string || a.fret - b.fret);
}

function chip(name: string) {
  return within(screen.getByRole('tablist', { name: 'fretboard.scalePosition' })).getByRole('tab', { name: new RegExp(`^${name}$`) });
}

describe('default view is a classical position, not the whole neck (D-02)', () => {
  it('C major opens in the Open position with open strings as labelled dots (W3-06)', async () => {
    const { container } = await renderFretboard();
    expect(dots(container)).toEqual(expectedDots(N('C'), 'major', 0));
    // Open strings are drawn as proper dots labelled 0 (the open-string finger).
    const open = dots(container).filter((d) => d.fret === 0);
    expect(open).toHaveLength(6);
    expect(open.every((d) => d.label === '0')).toBe(true);
    expect(chip('fretboard.open').getAttribute('aria-selected')).toBe('true');
  });

  it('D major opens in II position (lowest with the root on string 5 or 6)', async () => {
    useAppStore.setState({ selectedKey: N('D') });
    const { container } = await renderFretboard();
    expect(dots(container)).toEqual(expectedDots(N('D'), 'major', 2));
    expect(chip('II').getAttribute('aria-selected')).toBe('true');
  });
});

describe('position chips, Roman badge, open strings (W3-01, W3-06)', () => {
  it('choosing V draws exactly the generated V position, with a "V" badge and no "fr" badge', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('V'));
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    expect(dots(container)).toEqual(expectedDots(N('C'), 'major', 5));
    expect(screen.getByTestId('position-badge').textContent).toBe('V');
    expect(container.textContent).not.toMatch(/\dfr/);
    // Open strings are not part of V position: no open-string dots (W3-06).
    expect(dots(container).some((d) => d.fret === 0)).toBe(false);
  });

  it('"All" shows the whole neck with every in-scale cell', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('fretboard.all'));
    expect(useAppStore.getState().guitarScalePosition).toBe('all');
    const scaleDots = dots(container, 'scale');
    // C major: 7 of 12 pitch classes, 6 strings x 16 cells (0-15) => count exactly.
    const open = [40, 45, 50, 55, 59, 64];
    const inC = new Set([0, 2, 4, 5, 7, 9, 11]);
    let expected = 0;
    for (const o of open) for (let f = 0; f <= 15; f++) if (inC.has((o + f) % 12)) expected++;
    expect(scaleDots).toHaveLength(expected);
  });
});

describe('the chosen position persists across key and scale changes (W3-08)', () => {
  it('V stays V when the key and the scale change', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('V'));
    act(() => useAppStore.getState().setKey(N('G')));
    expect(chip('V').getAttribute('aria-selected')).toBe('true');
    expect(dots(container)).toEqual(expectedDots(N('G'), 'major', 5));
    act(() => useAppStore.getState().setScale('dorian'));
    expect(dots(container)).toEqual(expectedDots(N('G'), 'dorian', 5));
  });
});

describe('walking through positions (W10-07)', () => {
  it('previous / next buttons step one position', async () => {
    await renderFretboard();
    fireEvent.click(chip('V'));
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.nextPosition' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(6);
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.prevPosition' }));
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.prevPosition' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(4);
  });

  it('[ and ] keys step positions; ends are clamped', async () => {
    await renderFretboard();
    fireEvent.click(chip('XI'));
    fireEvent.keyDown(window, { key: ']' });
    expect(useAppStore.getState().guitarScalePosition).toBe(12);
    fireEvent.keyDown(window, { key: ']' });
    expect(useAppStore.getState().guitarScalePosition).toBe(12);
    expect((screen.getByRole('button', { name: 'fretboard.nextPosition' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(chip('fretboard.open'));
    fireEvent.keyDown(window, { key: '[' });
    expect(useAppStore.getState().guitarScalePosition).toBe(0);
    fireEvent.keyDown(window, { key: ']' });
    expect(useAppStore.getState().guitarScalePosition).toBe(1);
  });

  it('works on PT/ES keyboards: the physical bracket keys (event.code) and [ ] typed with Option/AltGr (review #2)', async () => {
    await renderFretboard();
    fireEvent.click(chip('V'));
    // PT-PT layout: the keys right of P print "+" and "´" but are BracketLeft/Right.
    fireEvent.keyDown(window, { key: '´', code: 'BracketRight' });
    expect(useAppStore.getState().guitarScalePosition).toBe(6);
    fireEvent.keyDown(window, { key: '+', code: 'BracketLeft' });
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    // macOS PT: Option+8 / Option+9 type [ and ].
    fireEvent.keyDown(window, { key: ']', code: 'Digit9', altKey: true });
    expect(useAppStore.getState().guitarScalePosition).toBe(6);
    // Windows ES/PT: AltGr reports Ctrl+Alt.
    fireEvent.keyDown(window, { key: '[', code: 'Quote', altKey: true, ctrlKey: true });
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    // Cmd+[ is the browser's Back on macOS — never hijacked.
    fireEvent.keyDown(window, { key: '[', code: 'BracketLeft', metaKey: true });
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    // A bracket-position key with Ctrl alone is not ours either.
    fireEvent.keyDown(window, { key: '+', code: 'BracketLeft', ctrlKey: true });
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
  });

  it('keys are ignored while typing in a field or with a modifier', async () => {
    await renderFretboard();
    fireEvent.click(chip('V'));
    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: ']' });
    fireEvent.keyDown(window, { key: ']', metaKey: true });
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    input.remove();
  });
});

describe('string-name column always shows the tuning (W1-16)', () => {
  it('G-flat major still reads E A D G B E, not Fb/Cb', async () => {
    useAppStore.setState({ selectedKey: N('G', 'b') });
    const { container } = await renderFretboard();
    const names = [...container.querySelectorAll('[data-string-name]')].map((el) => el.textContent);
    expect(names).toEqual(['E', 'A', 'D', 'G', 'B', 'E']);
  });

  it('half-step-down tuning reads its own names', async () => {
    useAppStore.setState({ guitarTuningId: 'half-step-down', selectedKey: N('C', '#') });
    const { container } = await renderFretboard();
    const names = [...container.querySelectorAll('[data-string-name]')].map((el) => el.textContent);
    expect(names).toEqual(['Eb', 'Ab', 'Db', 'Gb', 'Bb', 'Eb']);
  });
});

describe('positions in every tuning (W10-11)', () => {
  it('Drop D shows the generated Drop D position and keeps the chosen one across tuning changes', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('III'));
    act(() => useAppStore.getState().setGuitarTuningId('drop-d'));
    expect(dots(container)).toEqual(expectedDots(N('C'), 'major', 3, 'finger', 'drop-d'));
  });
});

describe('dot labels: finger / degree / note (W10-04)', () => {
  it('toggles what the dots show', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('V'));
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.labelDegree' }));
    expect(dots(container)).toEqual(expectedDots(N('C'), 'major', 5, 'degree'));
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.labelNote' }));
    expect(dots(container).map((d) => d.label).sort()).toEqual(
      getGuitarPosition(N('C'), 'major', 5).notes.map((x) => `${x.note.natural}${x.note.accidental}`).sort(),
    );
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.labelFinger' }));
    expect(dots(container)).toEqual(expectedDots(N('C'), 'major', 5, 'finger'));
    expect(useFingeringStore.getState().labelMode).toBe('finger');
  });
});

describe('legend (review #3)', () => {
  it('position view explains the dashed ring and the corner mark; the whole neck does not show it', async () => {
    await renderFretboard();
    fireEvent.click(chip('V'));
    const legend = screen.getByTestId('position-legend');
    expect(legend.textContent).toContain('fretboard.legendStretch');
    expect(legend.textContent).toContain('fretboard.legendEdited');
    // The swatches use the same marks as the dots.
    expect(legend.querySelector('[data-legend="stretch"]')).not.toBeNull();
    expect(legend.querySelector('[data-legend="edited"]')).not.toBeNull();
    fireEvent.click(chip('fretboard.all'));
    expect(screen.queryByTestId('position-legend')).toBeNull();
  });
});

describe('fingering override (W10-05)', () => {
  it('edit mode: tapping a dot cycles its finger, stores it, and Reset restores the suggestion', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('V'));
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.editFingering' }));
    // 4th string (index 2) fret 9 is the B, suggested finger 4 (a stretch).
    const target = () => container.querySelector<HTMLElement>('[data-dot][data-dot-string="2"][data-dot-fret="9"]')!;
    expect(target().textContent).toBe('4');
    fireEvent.click(target().closest('[role="button"]')!);
    expect(target().textContent).toBe('1');
    const key = fingeringKey('major', 'standard', 5, 0, 2, 9);
    expect(useFingeringStore.getState().overrides[key]).toBe(1);
    expect(noteOn).not.toHaveBeenCalled(); // editing does not play notes
    fireEvent.click(target().closest('[role="button"]')!); // 2
    fireEvent.click(target().closest('[role="button"]')!); // 3
    fireEvent.click(target().closest('[role="button"]')!); // 4 = suggestion → override removed
    expect(key in useFingeringStore.getState().overrides).toBe(false);
    fireEvent.click(target().closest('[role="button"]')!); // 1 again
    fireEvent.click(screen.getByRole('button', { name: 'fretboard.resetFingering' }));
    expect(useFingeringStore.getState().overrides).toEqual({});
    expect(target().textContent).toBe('4');
  });

  it('an override is the shown fingering, follows the same shape up the neck, and survives leaving edit mode', async () => {
    useFingeringStore.setState({ overrides: { [fingeringKey('major', 'standard', 5, 0, 2, 9)]: 3 } });
    const { container } = await renderFretboard();
    fireEvent.click(chip('V'));
    const at = (s: number, f: number) => container.querySelector<HTMLElement>(`[data-dot][data-dot-string="${s}"][data-dot-fret="${f}"]`)!;
    expect(at(2, 9).textContent).toBe('3');
    // D major in VII is the same shape two frets up.
    act(() => useAppStore.getState().setKey(N('D')));
    fireEvent.click(chip('VII'));
    expect(at(2, 11).textContent).toBe('3');
  });

  it('outside edit mode, tapping a dot plays it', async () => {
    const { container } = await renderFretboard();
    fireEvent.click(chip('V'));
    const dot = container.querySelector<HTMLElement>('[data-dot][data-dot-string="2"][data-dot-fret="9"]')!;
    fireEvent.click(dot.closest('[role="button"]')!);
    expect(noteOn).toHaveBeenCalledTimes(1);
  });
});
