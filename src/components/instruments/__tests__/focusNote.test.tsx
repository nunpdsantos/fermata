/**
 * W11-B — the instruments answer the linked focus note: the piano and the
 * fretboard light the focus note (the exact pitch where they show it, else
 * its pitch class among the notes they show), publish WHERE for the dock
 * read-out, and set it themselves (a key / fret under the mouse, a tap).
 * Also: the circle of fifths marks the selected chord's root, and the
 * landscape full-neck view draws the whole neck and closes on Escape.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { useGuitarShapeStore } from '../../../state/guitarShapeStore';
import { useFingeringStore } from '../../../state/fingeringStore';
import { buildChord } from '../../../core/constants/chords';
import { Piano } from '../Piano';
import { Fretboard } from '../Fretboard';
import { NeckView } from '../NeckView';
import { InstrumentDock } from '../../layout/InstrumentDock';
import { DockReadout } from '../../layout/DockReadout';
import { CircleOfFifths } from '../../theory/CircleOfFifths';

const { noteOn } = vi.hoisted(() => ({ noteOn: vi.fn().mockResolvedValue(60) }));
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn, noteOff: vi.fn() }),
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
beforeEach(() => {
  noteOn.mockClear();
  useGuitarShapeStore.setState({ shapeChoice: { key: '', idx: 0 } });
  useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, scaleOctaves: 1, view: 'explore', exerciseInputActive: false,
    guitarScalePosition: 0, guitarTuningId: 'standard', activeNotes: new Set<number>(), highlightedNotes: [],
    quickSearchOpen: false, themeMode: 'fermata', language: 'en',
  });
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const litKeys = () => [...document.querySelectorAll('[data-piano-key][data-focus-note]')].map((k) => k.getAttribute('aria-label'));
const litCells = () =>
  [...document.querySelectorAll('[role="grid"] [data-focus-note]')].map((c) =>
    c.hasAttribute('data-open-string') ? 'open' : `${c.getAttribute('data-string-row')}:${c.getAttribute('data-fret')}`,
  );

describe('piano', () => {
  it.each(['hover', 'press', 'Enter'] as const)('C3 outside the scale octave stays lit and named on %s', (input) => {
    render(<><Piano /><DockReadout context="C4 · 1 octave" /></>);
    const c3 = screen.getByRole('button', { name: 'C3' });
    if (input === 'hover') fireEvent.pointerEnter(c3, { pointerType: 'mouse' });
    else if (input === 'press') fireEvent.pointerDown(c3, { pointerType: 'mouse', button: 0 });
    else fireEvent.keyDown(c3, { key: 'Enter' });
    expect(useFocusNoteStore.getState()[input === 'hover' ? 'hover' : 'pinned']).toEqual({ pc: 0, midi: 48, source: 'piano' });
    if (input !== 'hover') expect(noteOn).toHaveBeenCalledWith(expect.objectContaining({ natural: 'C' }), 3);
    expect(litKeys()).toEqual(['C3']);
    expect(useFocusNoteStore.getState().locations?.items).toEqual(['C3']);
    expect(screen.getByTestId('dock-readout').textContent).toContain('C3');
    expect(screen.getByTestId('dock-readout').textContent).not.toMatch(/C4|C5/);
  });

  it('the focus-ring detector rejects a known-bad missing ring', () => {
    render(<Piano />);
    const c4 = screen.getByRole('button', { name: 'C4' });
    fireEvent.pointerEnter(c4, { pointerType: 'mouse' });
    const check = () => expect(litKeys()).toEqual(['C4']);
    check();
    c4.removeAttribute('data-focus-note');
    expect(check).toThrow();
    c4.setAttribute('data-focus-note', 'true');
    check();
  });

  it('lights the exact key when it is one it shows (B4), else the pitch class in the octave shown', () => {
    render(<Piano />);
    act(() => useFocusNoteStore.getState().set('hover', { pc: 11, midi: 71, source: 'staff' }));
    expect(litKeys()).toEqual(['B4']);
    expect(useFocusNoteStore.getState().locations).toEqual({ instrument: 'piano', items: ['B4'] });
    // B2 from a fret: not among the lit scale keys → its pitch class there.
    act(() => useFocusNoteStore.getState().set('hover', { pc: 11, midi: 47, source: 'fret' }));
    expect(litKeys()).toEqual(['B4']);
    // Not in the scale, no exact pitch: the octave shown.
    act(() => useFocusNoteStore.getState().set('hover', { pc: 1, source: 'chord' }));
    expect(litKeys()).toEqual(['C#4']); // spelled in context (C major: sharp default)
  });

  it('a key under the mouse, or played, becomes the focus note; nothing lights outside Explore', () => {
    const { container } = render(<Piano />);
    const b4 = container.querySelector('[aria-label="B4"]')!;
    fireEvent.pointerEnter(b4, { pointerType: 'mouse' });
    expect(useFocusNoteStore.getState().hover).toEqual({ pc: 11, midi: 71, source: 'piano' });
    fireEvent.pointerLeave(b4, { pointerType: 'mouse' });
    expect(useFocusNoteStore.getState().hover).toBeNull();
    fireEvent.pointerDown(b4, { pointerType: 'mouse', button: 0 });
    expect(useFocusNoteStore.getState().pinned).toEqual({ pc: 11, midi: 71, source: 'piano' });
    act(() => useAppStore.setState({ view: 'learn' }));
    expect(litKeys()).toEqual([]);
  });
});

describe('fretboard', () => {
  it.each(['hover', 'tap'] as const)('string 6 fret 5 is lit and named first on %s, ahead of the open A string', async (input) => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<><Fretboard variant={input === 'tap' ? 'neck' : 'dock'} /><DockReadout context="Open position" /></>);
    await screen.findAllByRole('grid');
    const cell = document.querySelector('[data-string-row="0"][data-fret="5"]')!;
    if (input === 'hover') fireEvent.pointerEnter(cell, { pointerType: 'mouse' });
    else fireEvent.pointerDown(cell, { pointerType: 'touch', pointerId: 1 });
    expect(useFocusNoteStore.getState()[input === 'hover' ? 'hover' : 'pinned']).toMatchObject({ pc: 9, midi: 45, source: 'fret' });
    if (input === 'tap') expect(noteOn).toHaveBeenCalledWith(expect.objectContaining({ natural: 'A' }), 2);
    expect(cell.hasAttribute('data-focus-note')).toBe(true);
    expect(useFocusNoteStore.getState().locations?.items[0]).toBe('string 6 fret 5');
    expect(screen.getByTestId('dock-readout').textContent).toContain('string 6 fret 5');
  });

  it('moving between two cells of the same pitch updates the first location', async () => {
    useAppStore.setState({ instrument: 'guitar', guitarScalePosition: 'all' });
    render(<Fretboard />);
    await screen.findAllByRole('grid');
    const cell = (row: number, fret: number) => document.querySelector(`[data-string-row="${row}"][data-fret="${fret}"]`)!;
    // Both are B3; neither transition changes MIDI, pitch class or source.
    for (const [row, fret, location] of [[3, 4, 'string 3 fret 4'], [2, 9, 'string 4 fret 9'], [3, 4, 'string 3 fret 4']] as const) {
      fireEvent.click(cell(row, fret));
      expect(cell(row, fret).hasAttribute('data-focus-note')).toBe(true);
      expect(useFocusNoteStore.getState().locations?.items[0]).toBe(location);
    }
  });

  it('open position: B lights string 5 fret 2 and the open B string, and says so', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<Fretboard />);
    await screen.findAllByRole('grid');
    act(() => useFocusNoteStore.getState().set('hover', { pc: 11, midi: 71, source: 'staff' }));
    expect(litCells().sort()).toEqual(['1:2', 'open']);
    expect(useFocusNoteStore.getState().locations?.items).toEqual(['string 5 fret 2', 'string 2 open']);
  });

  it('the exact pitch when the board shows it (B3 = the open B string only)', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<Fretboard />);
    await screen.findAllByRole('grid');
    act(() => useFocusNoteStore.getState().set('hover', { pc: 11, midi: 59, source: 'piano' }));
    expect(litCells()).toEqual(['open']);
  });

  it('a fret under the mouse, or tapped, becomes the focus note', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<Fretboard />);
    await screen.findAllByRole('grid');
    const cell = document.querySelector('[data-string-row="1"][data-fret="2"]')!;
    fireEvent.pointerEnter(cell, { pointerType: 'mouse' });
    expect(useFocusNoteStore.getState().hover).toEqual({ pc: 11, midi: 47, source: 'fret', cell: { stringIndex: 1, fret: 2 } });
    fireEvent.click(cell);
    expect(useFocusNoteStore.getState().pinned).toEqual({ pc: 11, midi: 47, source: 'fret', cell: { stringIndex: 1, fret: 2 } });
  });
});

describe('circle of fifths', () => {
  it('marks the selected chord\'s root: G major on the outer ring, D minor on the inner', () => {
    useAppStore.setState({ selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') });
    const { unmount } = render(<CircleOfFifths />);
    const mark = screen.getByTestId('cof-chord-mark');
    expect(mark.closest('g[role="button"]')!.getAttribute('data-key')).toBe('G major');
    expect(mark.closest('g[role="button"]')!.getAttribute('aria-label')).toMatch(/root of the selected chord$/);
    unmount();
    useAppStore.setState({ selectedChord: buildChord({ natural: 'D', accidental: '' }, 'minor') });
    render(<CircleOfFifths />);
    expect(screen.getByTestId('cof-chord-mark').closest('g[role="button"]')!.getAttribute('data-key')).toBe('D minor');
  });

  it('marks nothing without a chord', () => {
    render(<CircleOfFifths />);
    expect(screen.queryByTestId('cof-chord-mark')).toBeNull();
  });
});

describe('landscape full-neck view', () => {
  function landscapeDock(chord = true) {
    vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
      matches: query.includes('max-height: 500px'), media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })));
    useAppStore.setState({
      instrument: 'guitar', selectedChord: chord ? buildChord({ natural: 'C', accidental: '' }, 'major') : null,
      dockDetents: { explore: 'half', learn: 'peek' }, dockChosen: { explore: true, learn: false },
    });
    return render(<InstrumentDock view="explore" available={320} />);
  }

  it('preserves the chosen chord grip from dock to full neck and back, including a change in the neck', async () => {
    landscapeDock();
    const group = () => screen.findByRole('radiogroup', { name: 'Chord position' });
    const choose = async (name: string) => fireEvent.click(within(await group()).getByRole('radio', { name }));
    const selected = async (name: string) => expect(within(await group()).getByRole('radio', { name }).getAttribute('aria-checked')).toBe('true');
    await choose('A barre');
    fireEvent.click(screen.getByTestId('neck-open'));
    await screen.findByTestId('neck-view');
    await selected('A barre');
    expect(document.querySelector('#instrument-region [role="grid"]')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Close full neck' }));
    await selected('A barre');
    fireEvent.click(screen.getByTestId('neck-open'));
    await screen.findByTestId('neck-view');
    await choose('E barre');
    fireEvent.click(screen.getByRole('button', { name: 'Close full neck' }));
    await selected('E barre');
    fireEvent.click(screen.getByTestId('neck-open'));
    await screen.findByTestId('neck-view');
    await selected('E barre');
    act(() => useAppStore.setState({ selectedChord: buildChord({ natural: 'D', accidental: '' }, 'major') }));
    expect((await group()).querySelector('[role="radio"]')!.getAttribute('aria-checked')).toBe('true');
  });

  it('steps once per bracket key before, during and after full neck', async () => {
    landscapeDock(false);
    await screen.findAllByRole('grid');
    fireEvent.keyDown(window, { key: ']', code: 'BracketRight' });
    expect(useAppStore.getState().guitarScalePosition).toBe(1);
    fireEvent.click(screen.getByTestId('neck-open'));
    await screen.findByTestId('neck-view');
    await screen.findAllByRole('grid');
    fireEvent.keyDown(window, { key: ']', code: 'BracketRight' });
    expect(useAppStore.getState().guitarScalePosition).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: 'Close full neck' }));
    await screen.findAllByRole('grid');
    fireEvent.keyDown(window, { key: ']', code: 'BracketRight' });
    expect(useAppStore.getState().guitarScalePosition).toBe(3);
  });

  it('a modal dialog with the whole neck (frets 1–12 and the open strings), the stepper and the label toggle; Escape closes', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    const onClose = vi.fn();
    render(<NeckView onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: 'C Major' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    await screen.findAllByRole('grid');
    const frets = [...document.querySelectorAll('[data-string-row="0"]')].map((c) => Number(c.getAttribute('data-fret')));
    expect(Math.min(...frets)).toBe(1);
    expect(Math.max(...frets)).toBe(12);
    expect(document.querySelectorAll('[data-open-string]')).toHaveLength(6);
    expect(screen.getByRole('button', { name: 'Next position' })).toBeTruthy();
    expect(screen.getByRole('radiogroup', { name: 'Dot labels' })).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close full neck' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('reaches fret 15 when the position does (XII)', async () => {
    useAppStore.setState({ instrument: 'guitar', guitarScalePosition: 12 });
    render(<NeckView onClose={() => {}} />);
    await screen.findAllByRole('grid');
    const frets = [...document.querySelectorAll('[data-string-row="0"]')].map((c) => Number(c.getAttribute('data-fret')));
    expect(Math.max(...frets)).toBe(15);
  });
});
