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
import { fingeringKey, OPEN_POSITION } from '../../../core/utils/guitarPositions';
import type { Note } from '../../../core/types/music';
import { Fretboard } from '../Fretboard';
import { NeckView } from '../NeckView';
import i18n from '../../../i18n';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';

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
/** The arrow that moves away from the nut on the owner's board (nut right). */
const nutAway = () => 'ArrowLeft';
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
    // The badge sits over the capo's own column: the same place in the
    // markers row as fret 3 in the numbers row under the board.
    const badgeCell = screen.getByTestId('position-badge').parentElement!;
    const markIdx = [...badgeCell.parentElement!.children].indexOf(badgeCell);
    const numberCells = [...grid().querySelector('[data-dock-row="frets"]')!.querySelectorAll(':scope > div.flex-1 > div')];
    expect(numberCells[markIdx].textContent).toBe('3');
    // Its frets are the capo and the five above it (the stretch fret too).
    expect([...new Set([...rowOf(0)].map((c) => Number(c.getAttribute('data-fret'))))].sort((a, b) => a - b)).toEqual([3, 4, 5, 6, 7, 8]);
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

describe('fingering in the Open position at a capo', () => {
  // B♭ major, capo 3, Open = the G major open position, three frets up: the
  // same hand, so the same saved fingering (key G, pitch class 7), never D♭'s.
  const gKey = (string: number, fret: number) => fingeringKey('major', 'standard', OPEN_POSITION, 7, string, fret);
  const dot = (string: number, fret: number) => grid().querySelector<HTMLElement>(`[data-dot][data-dot-string="${string}"][data-dot-fret="${fret}"]`)!;

  it('a finger saved for G\'s open position shows on B♭ with a capo on 3', () => {
    // G major on string 6: F♯ at fret 2 (finger 2 by default), here fret 5.
    useFingeringStore.setState({ overrides: { [gKey(0, 2)]: 4 } });
    render(<Fretboard />);
    expect(dot(0, 5).textContent).toBe('4');
  });

  it('an edit is filed under G\'s open position; the capo fret itself takes no finger', () => {
    render(<Fretboard />);
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    const cell = (string: number, fret: number) => [...rowOf(string)].find((c) => c.getAttribute('data-fret') === String(fret))!;
    // At the capo: the string's "open" note — no finger to change.
    fireEvent.click(cell(0, 3));
    expect(useFingeringStore.getState().overrides).toEqual({});
    // G (fret 6 here, fret 3 in G's open position): its finger moves on one.
    const before = Number(dot(0, 6).textContent);
    fireEvent.click(cell(0, 6));
    expect(useFingeringStore.getState().overrides).toEqual({ [gKey(0, 3)]: (before % 4) + 1 });
  });
});

describe('stepping and the bass with a capo', () => {
  it('› from a saved II (behind the capo, shown as Open) goes to IV', () => {
    reset({ guitarScalePosition: 2 });
    render(<Fretboard />);
    fireEvent.click(screen.getByRole('button', { name: 'Next position' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(4);
  });

  it('a requested bass no grip above the capo can put lowest: the board says so', () => {
    // E°7 over D♭ (third inversion), capo 2: the one bass grip would need fret 16.
    reset({ selectedChord: buildChord(N('E'), 'diminished7'), chordInversion: 3, capoFret: 2 });
    render(<Fretboard />);
    expect(screen.getByText(/in the bass, so the shapes are shown as they are/)).toBeTruthy();
    expect(voicing()).toEqual({ 2: 14, 3: 15, 4: 14, 5: 15 });
  });

  it('a grip with its bass on the capo names its anchor fret above the capo', () => {
    // F♯m/A, capo 5: C♯m's Am-shape barre (fret 4) with the open E bass, moved
    // up: the bass rings at the capo (fret 5), the barre is on fret 9.
    reset({ selectedChord: buildChord(N('F', '#'), 'minor'), chordInversion: 1, capoFret: 5 });
    render(<Fretboard />);
    expect(voicing()[0]).toBe(5);
    // (The zoomed window's own "5fr" in the open column is not the anchor.)
    expect(grid().querySelector('[data-term="anchorFret"]')!.textContent).toBe('9fr');
  });
});

describe('the linked focus note with a capo', () => {
  it('nothing behind the capo is lit or named, from another surface either', () => {
    reset({ guitarScalePosition: 'all' });
    render(<Fretboard />);
    // F from the staff: F is on fret 1 of both E strings, behind the capo.
    act(() => useFocusNoteStore.setState({ pinned: { pc: 5, source: 'staff' } }));
    const items = useFocusNoteStore.getState().locations!.items;
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item).not.toMatch(/open/);
      const fret = /fret (\d+)/.exec(item);
      if (fret) expect(Number(fret[1]), item).toBeGreaterThanOrEqual(3);
    }
  });
});

describe('keyboard movement around the capo', () => {
  it('a cell left on a fret the capo then covers moves to the capo: said and sounded there', () => {
    reset({ guitarScalePosition: 'all', capoFret: 0 });
    render(<Fretboard />);
    const g = grid();
    fireEvent.keyDown(g, { key: 'ArrowDown' });
    const said = () => g.querySelector('[aria-live]')!.textContent!;
    expect(said()).toMatch(/^String 6, fret 1, /);
    act(() => setCapoFret(3));
    expect(said()).toBe('String 6, fret 3, at the capo, G');
    fireEvent.keyDown(g, { key: 'Enter' });
    // String 6 at fret 3: G2, never the F2 behind the capo.
    expect(noteOn).toHaveBeenLastCalledWith(expect.objectContaining({ natural: 'G', accidental: '', octave: 2 }), expect.anything());
    fireEvent.keyDown(g, { key: nutAway() });
    expect(said()).toMatch(/^String 6, fret 4, 1 fret above the capo/);
  });

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

describe('the capo\'s chips and line in the learner\'s language (the seat\'s decision S-3)', () => {
  const ENGLISH = /\b(shape|barre|Pos|Open|Fret|the|capo on fret)\b/;
  const chipTexts = () => within(screen.getByRole('radiogroup', { name: i18n.t('fretboard.chordPosition') })).getAllByRole('radio').map((r) => r.textContent ?? '');
  afterEach(async () => {
    await act(async () => { await i18n.changeLanguage('en'); });
  });
  const cases: [string, string[], string][] = [
    ['pt', ['forma de G', 'pestana de E', 'pestana de D', 'pestana de A', 'pestana de C'], 'B♭: a forma de G, capo no traste 3'],
    ['es', ['forma de G', 'cejilla de E', 'cejilla de D', 'cejilla de A', 'cejilla de C'], 'B♭: la forma de G, capo en el traste 3'],
  ];
  it.each(cases)('%s: B♭ at capo 3', async (lang, chips, line) => {
    await act(async () => { await i18n.changeLanguage(lang); });
    reset({ language: lang, selectedChord: buildChord(BB, 'major') });
    render(<Fretboard />);
    expect(chipTexts()).toEqual(chips);
    expect(screen.getByTestId('capo-line').textContent).toBe(line);
  });
  it.each(['pt', 'es'])('%s: no English word on any chip or line, for every chord of B♭ major and a few more', async (lang) => {
    await act(async () => { await i18n.changeLanguage(lang); });
    for (const sym of ['Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm', 'Adim', 'Bbm7', 'F/A', 'Am(add9)', 'Bbmaj7', 'Bbsus4', 'Bb7b9']) {
      reset({ language: lang, selectedChord: chordFromParsed(parseChordSymbol(sym)!) });
      const { unmount } = render(<Fretboard />);
      for (const text of [...chipTexts(), screen.queryByTestId('capo-line')?.textContent ?? '']) expect(text, `${lang} ${sym}`).not.toMatch(ENGLISH);
      unmount();
    }
  });
  it('a grip the generator built is named by the fret it is drawn at (Am(add9), capo 3), as its anchor badge says', () => {
    reset({ selectedChord: chordFromParsed(parseChordSymbol('Am(add9)')!) });
    render(<Fretboard />);
    const chips = chipTexts();
    expect(chips.every((c) => /^(Open|Fret \d+)( #\d+)?$/.test(c)), chips.join(' | ')).toBe(true);
    // The selected grip's chip names the fret its badge shows.
    const badge = /(\d+)fr/.exec(grid().textContent ?? '');
    if (badge) expect(chips[0]).toMatch(new RegExp(`^Fret ${badge[1]}\\b`));
  });
  it('without a capo the chips are as before (the library\'s own names)', async () => {
    await act(async () => { await i18n.changeLanguage('pt'); });
    reset({ language: 'pt', capoFret: 0, selectedChord: buildChord(N('G'), 'major') });
    render(<Fretboard />);
    expect(chipTexts()).toContain('E barre');
  });
});

describe('another tuning with a capo (final review of wave 2)', () => {
  it('the notice says the notes show from the capo up, not on the whole neck; without a capo, as before', () => {
    reset({ guitarTuningId: 'drop-d', selectedChord: buildChord(BB, 'major') });
    const first = render(<Fretboard />);
    expect(screen.getByRole('status').textContent).toContain("Chord shapes are for standard tuning only. Showing the chord's notes from the capo up.");
    expect(grid().querySelectorAll('[data-out-of-play] [data-dot]')).toHaveLength(0);
    first.unmount();
    reset({ guitarTuningId: 'drop-d', selectedChord: buildChord(BB, 'major'), capoFret: 0 });
    render(<Fretboard />);
    expect(screen.getByRole('status').textContent).toContain("Chord shapes are for standard tuning only. Showing the chord's notes on the whole neck.");
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
  it('the Open position at a high capo: every note the dock shows is on the full neck too (capo 9, E major) — final review of wave 2', async () => {
    const dots = () => [...grid().querySelectorAll<HTMLElement>('[data-dot]')].map((d) => `${d.dataset.dotString}:${d.dataset.dotFret}`).sort();
    reset({ selectedKey: N('E'), capoFret: 9, guitarScalePosition: OPEN_POSITION });
    const dock = render(<Fretboard />);
    const inDock = dots();
    expect(inDock.length).toBeGreaterThan(12);
    expect(inDock.some((d) => Number(d.split(':')[1]) > 12)).toBe(true);
    dock.unmount();
    render(<Suspense fallback={null}><NeckView onClose={() => {}} /></Suspense>);
    await screen.findByRole('grid');
    expect(dots()).toEqual(inDock);
  });
});
