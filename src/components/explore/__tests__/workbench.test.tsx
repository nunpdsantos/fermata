/**
 * W11-B — the Explore workbench's parts in jsdom:
 *  - the staff strip: one column per note (octave tonic included), tap to
 *    hear and pin it, hover / keyboard make it the focus note, arrows move,
 *    a selected chord fades the other notes, a focus note from the
 *    instrument lights its column;
 *  - chords: In key / All / Build; the detail opens IN PLACE under the row
 *    that was tapped;
 *  - the header: pickers, summary, Play, and Copy / Print / Compare in "⋯";
 *  - the dock read-out: context by default, the focus note in Explore, never
 *    in an exercise, announced once it settles.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { buildChord } from '../../../core/constants/chords';
import { ScaleStrip } from '../ScaleStrip';
import { ChordsCard } from '../ChordsCard';
import { ExploreHeader } from '../ExploreHeader';
import { DockReadout } from '../../layout/DockReadout';
import { CircleNavigator } from '../CircleNavigator';
import { sanitizePersistedAppState } from '../../../state/store';

const noteOn = vi.fn().mockResolvedValue(71);
const noteOff = vi.fn();
vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn, noteOff }) }));
vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playScale: vi.fn(),
  playChordVoiced: vi.fn(),
  playArpeggioAscending: vi.fn(),
}));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: (p: { noteDim?: Record<number, boolean> }) => React.createElement('div', { 'data-testid': 'staff', 'data-dim': JSON.stringify(p.noteDim ?? null) }) };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  noteOn.mockClear();
  useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, view: 'explore', exerciseInputActive: false, comparisonScale: null, language: 'en',
  });
});
afterEach(cleanup);

const column = (name: string) => document.querySelector(`.strip-col[data-note="${name}"]`) as HTMLElement;
const focus = () => {
  const s = useFocusNoteStore.getState();
  return s.hover ?? s.keyboard ?? s.pinned;
};

describe('staff strip', () => {
  it('one column per scale note plus the octave tonic, one Tab stop', async () => {
    render(<ScaleStrip />);
    await screen.findByTestId('staff');
    const cols = [...document.querySelectorAll('.strip-col')];
    expect(cols.map((c) => c.getAttribute('data-note'))).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C']);
    expect(cols.filter((c) => c.getAttribute('tabindex') === '0')).toHaveLength(1);
  });

  it('a tap plays the note and pins it as the focus note (exact pitch)', async () => {
    render(<ScaleStrip />);
    await screen.findByTestId('staff');
    fireEvent.click(column('B'));
    expect(noteOn).toHaveBeenCalledWith(expect.objectContaining({ natural: 'B', octave: 4 }), 4);
    expect(focus()).toEqual({ pc: 11, midi: 71, source: 'staff' });
  });

  it('a mouse hover sets it; leaving clears it (a touch "hover" does nothing)', async () => {
    render(<ScaleStrip />);
    await screen.findByTestId('staff');
    fireEvent.pointerEnter(column('G'), { pointerType: 'mouse' });
    expect(focus()?.pc).toBe(7);
    fireEvent.pointerLeave(column('G'), { pointerType: 'mouse' });
    expect(focus()).toBeNull();
    fireEvent.pointerEnter(column('G'), { pointerType: 'touch' });
    expect(focus()).toBeNull();
  });

  it('arrows move along the strip (one Tab stop follows)', async () => {
    render(<ScaleStrip />);
    await screen.findByTestId('staff');
    const first = document.querySelectorAll<HTMLElement>('.strip-col')[0];
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(column('D'));
    fireEvent.keyDown(column('D'), { key: 'End' });
    expect(document.activeElement?.getAttribute('data-note')).toBe('C');
    expect(document.activeElement?.getAttribute('data-midi')).toBe('72');
  });

  it('a selected chord fades the notes outside it (noteheads and labels)', async () => {
    useAppStore.setState({ selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') });
    render(<ScaleStrip />);
    const staff = await screen.findByTestId('staff');
    const dim = [...document.querySelectorAll('.strip-col')].map((c) => c.hasAttribute('data-dim'));
    expect(dim).toEqual([true, false, true, true, false, true, false, true]); // G B D stay
    expect(JSON.parse(staff.getAttribute('data-dim')!)).toMatchObject({ 0: true, 4: false, 6: false });
  });

  it('a focus note from the instrument lights its column (pitch class when the exact pitch is not drawn)', async () => {
    render(<ScaleStrip />);
    await screen.findByTestId('staff');
    act(() => useFocusNoteStore.getState().set('hover', { pc: 11, midi: 47, source: 'fret' }));
    expect(column('B').hasAttribute('data-on')).toBe(true);
    act(() => useFocusNoteStore.getState().set('hover', { pc: 0, midi: 72, source: 'piano' }));
    const cs = [...document.querySelectorAll('.strip-col[data-note="C"]')];
    expect(cs.map((c) => c.hasAttribute('data-on'))).toEqual([false, true]); // C5 only, not C4
  });

  it('says what the guitar staff is: written an octave above sounding (D-05)', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    render(<ScaleStrip />);
    expect(screen.getByText(/written an octave above sounding/)).toBeTruthy();
  });
});

describe('chords: In key / All / Build, the detail in place', () => {
  it('In key: the detail opens under the one chord row', async () => {
    render(<ChordsCard />);
    expect(screen.getByRole('tab', { name: 'In key' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByTestId('chord-detail')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'G Major chord, degree 5' }));
    const detail = await screen.findByTestId('chord-detail');
    const row = document.querySelector('.chord-row')!;
    expect(row.compareDocumentPosition(detail) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(detail).getByText('V · dominant')).toBeTruthy();
    expect(within(detail).getByRole('button', { name: 'Chord' })).toBeTruthy();
    expect(within(detail).getByRole('button', { name: 'Arpeggio' })).toBeTruthy();
    expect(within(detail).getByRole('radiogroup', { name: 'Chord inversion' })).toBeTruthy();
    expect(screen.getByTestId('chord-staff')).toBeTruthy();
  });

  it('All: the detail opens under the ROW of the chord tapped, not at the end', async () => {
    render(<ChordsCard />);
    fireEvent.click(screen.getByRole('tab', { name: 'All Chords' }));
    // Triads: C, Cm, Cdim, Caug — 3 columns in jsdom → rows [C Cm Cdim] [Caug].
    fireEvent.click(document.querySelector('[data-quality="minor"]')!);
    const detail = await screen.findByTestId('chord-detail');
    const aug = document.querySelector('[data-quality="augmented"]')!;
    expect(detail.compareDocumentPosition(aug) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(document.querySelector('[data-quality="minor"]')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('a chord tone is a focus note too (hover) and plays on a tap', async () => {
    useAppStore.setState({ selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') });
    render(<ChordsCard />);
    const detail = await screen.findByTestId('chord-detail');
    const b = within(detail).getByRole('button', { name: 'B' });
    fireEvent.pointerEnter(b, { pointerType: 'mouse' });
    expect(focus()).toMatchObject({ pc: 11, source: 'chord' });
    // (The framer-motion stand-in remounts the detail on each render: query again.)
    fireEvent.click(within(screen.getByTestId('chord-detail')).getByRole('button', { name: 'B' }));
    expect(noteOn).toHaveBeenCalledWith(expect.objectContaining({ octave: 4 }), 4);
    expect(focus()).toMatchObject({ pc: 11, midi: 71, source: 'chord' });
  });
});

describe('header: pickers, summary, Play, "⋯"', () => {
  it('the summary names key, signature and relative; Copy / Print / Compare sit in "⋯"', async () => {
    render(<ExploreHeader />);
    expect(screen.getByTestId('key-summary').textContent).toBe('C Major · no ♯/♭ · relative A minor');
    expect(screen.getByRole('combobox', { name: 'Root' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Scale' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Play scale ascending' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Copy scale summary/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
    expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual([
      'Copy scale summary to clipboard', 'Print scale diagram', 'Compare Scales',
    ]);
    fireEvent.click(screen.getByRole('menuitem', { name: 'Compare Scales' }));
    expect(screen.getByRole('dialog', { name: 'Compare Scales' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Select scale to compare' })).toBeTruthy();
  });
});

describe('dock read-out', () => {
  it('the context line by default; the focus note in Explore; never during an exercise or in Learn', () => {
    render(<DockReadout context="C4 · 1 octave" />);
    const text = () => document.querySelector('.dock-context-text')!.textContent;
    expect(text()).toBe('C4 · 1 octave');
    act(() => {
      useFocusNoteStore.getState().setLocations({ instrument: 'piano', items: ['B4'] });
      useFocusNoteStore.getState().set('pinned', { pc: 11, midi: 71, source: 'staff' });
    });
    expect(text()).toBe('B — leading note of C Major · B4');
    act(() => useAppStore.setState({ exerciseInputActive: true }));
    expect(text()).toBe('C4 · 1 octave');
    act(() => useAppStore.setState({ exerciseInputActive: false, view: 'learn' }));
    expect(text()).toBe('C4 · 1 octave');
  });

  it('screen readers hear a burst of notes once, when it settles', () => {
    vi.useFakeTimers();
    try {
      render(<DockReadout context="C4 · 1 octave" />);
      const live = screen.getByTestId('dock-announce');
      expect(live.getAttribute('aria-live')).toBe('polite');
      for (const pc of [0, 2, 4, 5, 7]) {
        act(() => useFocusNoteStore.getState().set('hover', { pc, source: 'staff' }));
        act(() => vi.advanceTimersByTime(100));
        expect(live.textContent).toBe('');
      }
      act(() => vi.advanceTimersByTime(600));
      expect(live.textContent).toBe('G — dominant of C Major');
      // The note leaving focus does not re-announce the context.
      act(() => useFocusNoteStore.getState().clear('hover'));
      act(() => vi.advanceTimersByTime(1000));
      expect(live.textContent).toBe('G — dominant of C Major');
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('tablet: the circle below the work folds (remembered)', () => {
  it('folded by default; the heading button unfolds it and the choice lands in the persisted preferences', () => {
    useAppStore.setState({ exploreCircleOpen: false });
    render(<CircleNavigator collapsible />);
    const toggle = screen.getByRole('button', { name: 'Circle of Fifths' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(screen.getByTestId('circle-card').querySelector('.circle-body')!.hasAttribute('data-folded')).toBe(true);
    fireEvent.click(toggle);
    expect(useAppStore.getState().exploreCircleOpen).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(useAppStore.persist.getOptions().partialize!(useAppStore.getState())).toMatchObject({ exploreCircleOpen: true });
  });

  it('beside the work (laptop) it never folds', () => {
    useAppStore.setState({ exploreCircleOpen: false });
    render(<CircleNavigator />);
    expect(screen.queryByRole('button', { name: 'Circle of Fifths' })).toBeNull();
    expect(screen.getByTestId('circle-card').querySelector('.circle-body')!.hasAttribute('data-folded')).toBe(false);
  });

  it('a corrupt saved value falls back to the default', () => {
    expect(sanitizePersistedAppState({ exploreCircleOpen: 'yes' })).not.toHaveProperty('exploreCircleOpen');
    expect(sanitizePersistedAppState({ exploreCircleOpen: true })).toMatchObject({ exploreCircleOpen: true });
  });
});
