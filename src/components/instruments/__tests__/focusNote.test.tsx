/**
 * W11-B — the instruments answer the linked focus note: the piano and the
 * fretboard light the focus note (the exact pitch where they show it, else
 * its pitch class among the notes they show), publish WHERE for the dock
 * read-out, and set it themselves (a key / fret under the mouse, a tap).
 * Also: the circle of fifths marks the selected chord's root, and the
 * landscape full-neck view draws the whole neck and closes on Escape.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { useFingeringStore } from '../../../state/fingeringStore';
import { buildChord } from '../../../core/constants/chords';
import { Piano } from '../Piano';
import { Fretboard } from '../Fretboard';
import { NeckView } from '../NeckView';
import { CircleOfFifths } from '../../theory/CircleOfFifths';

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
beforeEach(() => {
  useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, scaleOctaves: 1, view: 'explore', exerciseInputActive: false,
    guitarScalePosition: 0, guitarTuningId: 'standard', activeNotes: new Set<number>(), highlightedNotes: [],
    quickSearchOpen: false, themeMode: 'fermata', language: 'en',
  });
});
afterEach(cleanup);

const litKeys = () => [...document.querySelectorAll('[data-piano-key][data-focus-note]')].map((k) => k.getAttribute('aria-label'));
const litCells = () =>
  [...document.querySelectorAll('[role="grid"] [data-focus-note]')].map((c) =>
    c.hasAttribute('data-open-string') ? 'open' : `${c.getAttribute('data-string-row')}:${c.getAttribute('data-fret')}`,
  );

describe('piano', () => {
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
    expect(useFocusNoteStore.getState().hover).toEqual({ pc: 11, midi: 47, source: 'fret' });
    fireEvent.click(cell);
    expect(useFocusNoteStore.getState().pinned).toEqual({ pc: 11, midi: 47, source: 'fret' });
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
