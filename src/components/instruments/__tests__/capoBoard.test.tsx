/**
 * The capo on Explore's guitar (wave 2, stream C): the board draws the capo
 * across all six strings at its fret; everything behind it is out of play
 * (no dots, not tappable, skipped by the arrow keys, hidden from screen
 * readers); a tap sounds the fret's REAL pitch; the chord's grips are the
 * lower chord's shapes at the capo, named in one line; the scale positions
 * start at the capo; the board's own control changes or removes it. Learn and
 * exercise input draw the neck without it. Every orientation.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Suspense } from 'react';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';
import { useGuitarShapeStore } from '../../../state/guitarShapeStore';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { setCapoFret, getCapoFret } from '../../../state/capo';
import { buildChord } from '../../../core/constants/chords';
import type { Note } from '../../../core/types/music';
import { Fretboard } from '../Fretboard';
import { NeckView } from '../NeckView';

const noteOn = vi.fn().mockResolvedValue(60);
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn, noteOff: vi.fn() }),
}));
const media = { mobile: false };
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => media.mobile,
}));

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });
const BB = N('B', 'b');

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

function reset(extra: Record<string, unknown> = {}) {
  localStorage.clear();
  noteOn.mockClear();
  media.mobile = false;
  useGuitarShapeStore.setState({ shapeChoice: { key: '', idx: 0 } });
  useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
  useAppStore.setState({
    selectedKey: BB, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'guitar', activeNotes: new Set<number>(), highlightedNotes: [], exerciseInputActive: false,
    guitarScalePosition: null, guitarTuningId: 'standard', quickSearchOpen: false, view: 'explore',
    neckNutSide: 'right', neckTopString: 'low', capoFret: 3, ...extra,
  } as never);
}
beforeEach(() => reset());
afterEach(() => {
  cleanup();
  useAppStore.setState({ capoFret: 0 });
});

const grid = () => screen.getByRole('grid');
const rowOf = (stringIdx: number) => grid().querySelectorAll(`[data-string-row="${stringIdx}"]`);
const dotsAt = (pred: (fret: number) => boolean) =>
  [...grid().querySelectorAll<HTMLElement>('[data-dot]')].filter((d) => pred(Number(d.dataset.dotFret)));
/** The drawn grip: string index → absolute fret of its voicing dot. */
const voicing = () => Object.fromEntries([...grid().querySelectorAll<HTMLElement>('[data-dot="voicing"]')].map((d) => [Number(d.dataset.dotString), Number(d.dataset.dotFret)]));

describe('the capo is drawn, and nothing behind it plays', () => {
  it('whole neck, capo 3: a bar on fret 3 across all six strings; frets 1–2 and the open strings out of play', () => {
    reset({ guitarScalePosition: 'all' });
    render(<Fretboard />);
    expect(grid().querySelectorAll('[data-capo-bar]')).toHaveLength(6);
    for (const bar of grid().querySelectorAll('[data-capo-bar]')) expect(bar.closest('[data-fret]')!.getAttribute('data-fret')).toBe('3');
    // Ends rounded on the strings drawn at the top and the bottom.
    expect(grid().querySelectorAll('[data-capo-bar="top"]')).toHaveLength(1);
    expect(grid().querySelectorAll('[data-capo-bar="bottom"]')).toHaveLength(1);
    const behind = grid().querySelectorAll<HTMLElement>('[data-out-of-play]');
    expect(behind).toHaveLength(6 * 3); // frets 1, 2 and the open string, six strings
    for (const cell of behind) {
      expect(cell.getAttribute('aria-hidden')).toBe('true');
      expect(cell.getAttribute('role')).toBeNull();
      expect(cell.querySelector('[data-dot]')).toBeNull();
    }
    expect(dotsAt((f) => f < 3)).toHaveLength(0);
    expect(dotsAt((f) => f === 3).length).toBeGreaterThan(0);
    // Every button on the board is at or above the capo.
    for (const b of within(grid()).getAllByRole('button')) {
      const f = b.getAttribute('data-fret');
      if (f !== null) expect(Number(f)).toBeGreaterThanOrEqual(3);
    }
  });

  it('a tap behind the capo sounds nothing; at the capo and above, the fret\'s REAL pitch', () => {
    reset({ guitarScalePosition: 'all' });
    render(<Fretboard />);
    fireEvent.click(rowOf(1)[[...rowOf(1)].findIndex((c) => c.getAttribute('data-fret') === '2')]);
    fireEvent.click(grid().querySelectorAll('[data-open-string]')[0]);
    expect(noteOn).not.toHaveBeenCalled();
    // String 5 (A2 = MIDI 45): at the capo, fret 3 = C3; fret 7 = E3.
    const cell = (fret: number) => [...rowOf(1)].find((c) => c.getAttribute('data-fret') === String(fret))!;
    fireEvent.click(cell(3));
    expect(noteOn).toHaveBeenLastCalledWith(expect.objectContaining({ natural: 'C', accidental: '', octave: 3 }), 3);
    fireEvent.click(cell(7));
    expect(noteOn).toHaveBeenLastCalledWith(expect.objectContaining({ natural: 'E', accidental: '', octave: 3 }), 3);
    expect(cell(3).getAttribute('aria-label')).toBe('C, fret 3, string 5, at the capo');
    expect(cell(7).getAttribute('aria-label')).toBe('E, fret 7, string 5, 4 frets above the capo');
  });

  it('the read-out names a fret at the capo, never an open string', () => {
    reset({ guitarScalePosition: 'all' });
    render(<Fretboard />);
    const cell = [...rowOf(1)].find((c) => c.getAttribute('data-fret') === '3')!;
    fireEvent.click(cell);
    const items = useFocusNoteStore.getState().locations!.items;
    expect(items[0]).toBe('string 5 fret 3 (capo)');
    expect(items.join(' ')).not.toMatch(/open/);
  });
});

describe('chords follow the capo', () => {
  it('B♭ with a capo on 3: the open G shape at the capo, its line, its chips', () => {
    reset({ selectedChord: buildChord(BB, 'major') });
    render(<Fretboard />);
    // G open (3 2 0 0 0 3) drawn three frets up: 6 5 3 3 3 6.
    expect(voicing()).toEqual({ 0: 6, 1: 5, 2: 3, 3: 3, 4: 3, 5: 6 });
    expect(screen.getByTestId('capo-line').textContent).toBe('B♭: the G shape, capo on fret 3');
    const chips = screen.getByRole('radiogroup', { name: 'Chord position' });
    expect(within(chips).getAllByRole('radio')[0].textContent).toBe('G shape');
    expect(within(chips).getAllByRole('radio')[0].getAttribute('aria-checked')).toBe('true');
    // An open grip at the capo: no anchor badge (the capo is its nut).
    expect(grid().textContent).not.toMatch(/\dfr/);
    // The zoomed window starts AT the capo.
    const frets = [...rowOf(0)].map((c) => Number(c.getAttribute('data-fret')));
    expect(Math.min(...frets)).toBe(3);
    expect(grid().querySelectorAll('[data-out-of-play]').length).toBe(6); // the open strings only
  });

  it('every chord in B♭ major gets a grip, at or above the capo', () => {
    for (const q of [['B', 'b', 'major'], ['C', '', 'minor'], ['D', '', 'minor'], ['E', 'b', 'major'], ['F', '', 'major'], ['G', '', 'minor'], ['A', '', 'diminished']] as const) {
      reset({ selectedChord: buildChord(N(q[0], q[1]), q[2]) });
      const { unmount } = render(<Fretboard />);
      const v = voicing();
      expect(Object.keys(v).length, q.join('')).toBeGreaterThan(0);
      for (const f of Object.values(v)) expect(f, q.join('')).toBeGreaterThanOrEqual(3);
      unmount();
    }
  });

  it('a moved grip names its real fret: the anchor badge and the chip', () => {
    reset({ selectedChord: buildChord(BB, 'major') });
    render(<Fretboard />);
    const chips = screen.getByRole('radiogroup', { name: 'Chord position' });
    fireEvent.click(within(chips).getByRole('radio', { name: 'E barre' }));
    // The E-shape barre of G at fret 3, drawn up 3: the barre on fret 6.
    expect(voicing()[0]).toBe(6);
    expect(screen.getByText('6fr')).toBeTruthy();
  });

  it('a different capo starts again at the default grip', () => {
    reset({ selectedChord: buildChord(BB, 'major') });
    render(<Fretboard />);
    fireEvent.click(within(screen.getByRole('radiogroup', { name: 'Chord position' })).getByRole('radio', { name: 'E barre' }));
    act(() => setCapoFret(1));
    // B♭ with a capo on 1: the A shape (x 0 2 2 2 0) one fret up.
    expect(voicing()).toEqual({ 1: 1, 2: 3, 3: 3, 4: 3, 5: 1 });
    expect(screen.getByTestId('capo-line').textContent).toBe('B♭: the A shape, capo on fret 1');
  });
});

describe('scale positions follow the capo', () => {
  it('the first position starts at the capo; positions behind it are not offered', () => {
    render(<Fretboard />);
    expect(screen.getByTestId('position-badge').textContent).toBe('Open');
    expect(screen.getByTestId('position-badge').closest('div')!.parentElement).toBeTruthy();
    expect(dotsAt((f) => f < 3)).toHaveLength(0);
    expect(dotsAt((f) => f === 3)).toHaveLength(6);
    const chips = screen.getByRole('radiogroup', { name: 'Scale position' });
    expect(within(chips).getAllByRole('radio').map((r) => r.textContent)).toEqual(['Open', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'All']);
  });

  it('› from Open goes to IV, ‹ comes back; a saved II shows Open and returns when the capo comes off', () => {
    render(<Fretboard />);
    fireEvent.click(screen.getByRole('button', { name: 'Next position' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(4);
    fireEvent.click(screen.getByRole('button', { name: 'Previous position' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(0);
    act(() => useAppStore.setState({ guitarScalePosition: 2 }));
    expect(within(screen.getByRole('radiogroup', { name: 'Scale position' })).getByRole('radio', { name: 'Open' }).getAttribute('aria-checked')).toBe('true');
    act(() => setCapoFret(0));
    expect(within(screen.getByRole('radiogroup', { name: 'Scale position' })).getByRole('radio', { name: 'II' }).getAttribute('aria-checked')).toBe('true');
  });
});

describe('keyboard movement around the capo', () => {
  for (const [nut, top] of [['right', 'low'], ['right', 'high'], ['left', 'low'], ['left', 'high']] as const) {
    it(`nut ${nut}, ${top} string on top: the arrows never land behind the capo`, () => {
      reset({ guitarScalePosition: 'all', neckNutSide: nut, neckTopString: top });
      render(<Fretboard />);
      const g = grid();
      g.focus();
      fireEvent.keyDown(g, { key: 'ArrowDown' }); // starts on the top string at the capo
      const said = () => g.querySelector('[aria-live]')!.textContent!;
      expect(said()).toMatch(/fret 3, at the capo/);
      // Toward the nut: stays at the capo.
      const towardNut = nut === 'left' ? 'ArrowLeft' : 'ArrowRight';
      const away = nut === 'left' ? 'ArrowRight' : 'ArrowLeft';
      for (let i = 0; i < 4; i++) fireEvent.keyDown(g, { key: towardNut });
      expect(said()).toMatch(/fret 3, at the capo/);
      fireEvent.keyDown(g, { key: away });
      fireEvent.keyDown(g, { key: away });
      expect(said()).toMatch(/fret 5, 2 frets above the capo/);
      for (let i = 0; i < 6; i++) fireEvent.keyDown(g, { key: towardNut });
      expect(said()).toMatch(/fret 3, at the capo/);
    });
  }

  it('without a capo the same keys reach fret 1 (as before)', () => {
    reset({ guitarScalePosition: 'all', capoFret: 0 });
    render(<Fretboard />);
    const g = grid();
    fireEvent.keyDown(g, { key: 'ArrowDown' });
    expect(g.querySelector('[aria-live]')!.textContent).toMatch(/^String \d, fret 1, /);
  });
});

describe('every orientation draws the out-of-play frets on the nut side of the capo', () => {
  for (const [nut, top] of [['right', 'low'], ['right', 'high'], ['left', 'low'], ['left', 'high']] as const) {
    it(`nut ${nut}, ${top} on top`, () => {
      reset({ guitarScalePosition: 'all', neckNutSide: nut, neckTopString: top });
      render(<Fretboard />);
      for (const row of grid().querySelectorAll('[data-dock-row="string"]')) {
        const cells = [...row.querySelectorAll<HTMLElement>('[data-fret], [data-open-string]')];
        const order = cells.map((c) => (c.hasAttribute('data-open-string') ? 0 : Number(c.dataset.fret)));
        const capoAt = order.indexOf(3);
        const behind = order.map((f, i) => (f < 3 ? i : -1)).filter((i) => i >= 0);
        if (nut === 'left') expect(Math.max(...behind)).toBeLessThan(capoAt);
        else expect(Math.min(...behind)).toBeGreaterThan(capoAt);
        expect(row.querySelector('[data-fret="3"] [data-capo-bar]')).not.toBeNull();
      }
      // Fret numbers stay the real ones.
      const numbers = [...grid().querySelectorAll('[data-dock-row="frets"] div')].map((d) => d.textContent).filter((x) => /^\d+$/.test(x ?? ''));
      expect(numbers).toContain('3');
      expect(numbers).toContain('12');
    });
  }
});

describe('the board\'s capo control', () => {
  it('reads "Capo 3", changes the capo, and takes it off (focus goes to the board)', () => {
    render(<Fretboard />);
    const control = screen.getByTestId('capo-control') as HTMLSelectElement;
    expect(control.selectedOptions[0].textContent).toBe('Capo 3');
    fireEvent.change(control, { target: { value: '5' } });
    expect(getCapoFret()).toBe(5);
    fireEvent.change(screen.getByTestId('capo-control'), { target: { value: '0' } });
    expect(getCapoFret()).toBe(0);
    expect(screen.queryByTestId('capo-control')).toBeNull();
    expect(document.activeElement).toBe(grid());
  });

  it('no capo: no control, no bar, nothing out of play', () => {
    reset({ capoFret: 0, guitarScalePosition: 'all' });
    render(<Fretboard />);
    expect(screen.queryByTestId('capo-control')).toBeNull();
    expect(document.querySelector('[data-capo-bar], [data-out-of-play], [data-testid="capo-line"]')).toBeNull();
  });
});

describe('where the capo does not apply', () => {
  it('Learn and exercise input draw the neck without it', () => {
    for (const extra of [{ view: 'learn' }, { exerciseInputActive: true }]) {
      reset({ guitarScalePosition: 'all', ...extra });
      const { unmount } = render(<Fretboard />);
      expect(document.querySelector('[data-capo-bar], [data-out-of-play], [data-testid="capo-control"]'), JSON.stringify(extra)).toBeNull();
      unmount();
    }
    expect(getCapoFret()).toBe(3);
  });
});

describe('the landscape full neck', () => {
  it('draws the capo, the control in its header and the line over the board', async () => {
    reset({ selectedChord: buildChord(BB, 'major') });
    render(<Suspense fallback={null}><NeckView onClose={() => {}} /></Suspense>);
    await screen.findByRole('grid');
    const view = screen.getByTestId('neck-view');
    expect(view.querySelectorAll('[data-capo-bar]')).toHaveLength(6);
    expect(within(view).getByTestId('capo-control')).toBeTruthy();
    expect(within(view).getByTestId('capo-line').textContent).toBe('B♭: the G shape, capo on fret 3');
    expect(voicing()).toEqual({ 0: 6, 1: 5, 2: 3, 3: 3, 4: 3, 5: 6 });
    // Frets 1–12, the two behind the capo out of play.
    expect(view.querySelectorAll('[data-dock-row="string"]')[0].querySelectorAll('[data-out-of-play]')).toHaveLength(3);
  });
});
