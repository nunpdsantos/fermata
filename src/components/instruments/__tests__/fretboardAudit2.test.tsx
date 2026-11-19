/**
 * Music audit 2 (18 November 2026, release 15), the Explore fretboard as a
 * learner meets it: findings M43, M44, M46, M47, M48 and M49 on the rendered
 * board, in English, Portuguese and Spanish (the real i18n, the lazy
 * `fretboardWords` namespace included).
 *
 * The grip on the board is read from its dots ([data-dot="voicing"], string
 * and fret), and its pitches worked out here from standard tuning.
 */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import i18n from '../../../i18n';
import { buildChord } from '../../../core/constants/chords';
import { getGuitarPosition, GUITAR_MAX_FRET } from '../../../core/utils/guitarPositions';
import { getTuningById } from '../../../core/constants/guitarTunings';
import type { ChordQuality, Note } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';
import { useGuitarShapeStore } from '../../../state/guitarShapeStore';

const noteOn = vi.fn().mockResolvedValue(60);
vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn, noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => false,
  useIsCompact: () => false,
}));

const OPEN = [40, 45, 50, 55, 59, 64];
const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
beforeEach(async () => {
  await i18n.changeLanguage('en');
  noteOn.mockClear();
  useGuitarShapeStore.setState({ shapeChoice: { key: '', idx: 0 } });
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
  useAppStore.setState({
    view: 'explore', instrument: 'guitar', selectedKey: N('C'), selectedScale: 'major', selectedChord: null, chordInversion: 0,
    guitarScalePosition: null, guitarTuningId: 'standard', capoFret: 0, exerciseInputActive: false, quickSearchOpen: false,
    neckNutSide: 'right', neckTopString: 'low', activeNotes: new Set<number>(),
  });
});
afterEach(cleanup);
afterAll(() => i18n.changeLanguage('en'));

async function board(state: Partial<ReturnType<typeof useAppStore.getState>>) {
  act(() => useAppStore.setState(state));
  const { Fretboard } = await import('../Fretboard');
  return render(<Fretboard />);
}
const chord = (root: string, quality: string, bass?: string) => {
  const c = buildChord(N(root), quality as ChordQuality);
  return bass ? { ...c, bassNote: N(bass) } : c;
};
/** The grip on the board: each sounding string's MIDI pitch. */
function gripMidis(root: HTMLElement): number[] {
  return [...root.querySelectorAll<HTMLElement>('[data-dot="voicing"]')].map((el) => OPEN[Number(el.dataset.dotString)] + Number(el.dataset.dotFret));
}
const chips = () => within(screen.getByRole('radiogroup', { name: /chord position|posição do acorde|posición del acorde/i })).getAllByRole('radio');
const notice = () => screen.queryAllByRole('status').map((n) => n.textContent ?? '').join(' ');

describe('M43: every grip offered for an asked bass has that bass lowest', () => {
  it('C major, first inversion (C/E): each chip draws E lowest; none draws the C shape x 3 2 0 1 0', async () => {
    const { container } = await board({ selectedChord: chord('C', 'major'), chordInversion: 1 });
    const n = chips().length;
    expect(n).toBeGreaterThan(1);
    for (let i = 0; i < n; i++) {
      fireEvent.click(chips()[i]);
      const low = Math.min(...gripMidis(container));
      expect(low % 12, `chip ${i + 1} (${chips()[i].textContent})`).toBe(4);
    }
    expect(notice()).not.toMatch(/in the bass/);
  });

  it('root position asks for the root: C augmented seventh draws C lowest on every chip', async () => {
    const { container } = await board({ selectedChord: chord('C', 'augmented7'), chordInversion: 0 });
    for (let i = 0; i < chips().length; i++) {
      fireEvent.click(chips()[i]);
      expect(Math.min(...gripMidis(container)) % 12, chips()[i].textContent!).toBe(0);
    }
  });

  it('where no grip has the asked bass, the board says so, and offers every grip of the chord (C7♯5♭9 over B)', async () => {
    const { chordShapesForCapo, getChordShapesWithFallback } = await import('../../../core/constants/guitarChordShapes');
    const asked = chord('C', 'dominant7sharp5flat9', 'B');
    await board({ selectedChord: asked, chordInversion: 0 });
    expect(notice()).toContain('No shape here has B in the bass, so the shapes are shown as they are.');
    // Every grip: the chord's own, one chip each, none left out for want of the bass.
    const frets = (e: { shape: { strings: { fret: number | null }[] }; baseFret: number }) => e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-');
    const offered = chordShapesForCapo(asked, 0, 0);
    expect(offered.bassMatched).toBe(false);
    expect(new Set(offered.shapes.map(frets))).toEqual(new Set(getChordShapesWithFallback(chord('C', 'dominant7sharp5flat9')).map(frets)));
    expect(chips()).toHaveLength(offered.shapes.length);
  });
});

describe('M44: a shape that leaves out a tone the chord\'s name carries says which', () => {
  // (C9 first inversion did until the review of builder K: the neck is now
  // searched, and 0 1 0 0 1 0 sounds the 9 with E lowest. B♭m9 over B has no
  // grip a hand can play that sounds the 9 with B lowest: x 2 x 3 2 4.)
  const cases = [
    ['en', 'This shape leaves out C (9).'],
    ['pt', 'Esta forma deixa de fora C (9).'],
    ['es', 'Esta forma deja fuera C (9).'],
  ] as const;
  for (const [lang, line] of cases) {
    it(`${lang}: B♭m9 over B (B lowest, no C): "${line}"`, async () => {
      await i18n.changeLanguage(lang);
      const { container } = await board({ selectedChord: chord('Bb', 'minor9', 'B'), chordInversion: 0 });
      expect(Math.min(...gripMidis(container)) % 12).toBe(11);
      expect(gripMidis(container).some((m) => m % 12 === 0)).toBe(false);
      expect(notice()).toContain(line);
    });
  }

  it('Cmaj11 sounds its F on every chip, and says nothing is left out', async () => {
    const { container } = await board({ selectedChord: chord('C', 'major11'), chordInversion: 0 });
    for (let i = 0; i < chips().length; i++) {
      fireEvent.click(chips()[i]);
      expect(gripMidis(container).some((m) => m % 12 === 5), chips()[i].textContent!).toBe(true);
    }
    expect(notice()).not.toMatch(/leaves out/);
  });
});

describe('M46: the scale-position notice names every pitch it cannot reach, and where to find them', () => {
  const dropD = getTuningById('drop-d');
  const skipped = (position: number) => getGuitarPosition(N('D'), 'major', position, dropD, GUITAR_MAX_FRET, 0).skippedMidi;
  const plays = (position: number, midis: number[]) => {
    const notes = new Set(getGuitarPosition(N('D'), 'major', position, dropD, GUITAR_MAX_FRET, 0).notes.map((x) => x.midi));
    return midis.every((m) => notes.has(m));
  };
  const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };

  it('D major, Drop D, position XII: F♯3 and G3 (MIDI 54, 55), and a position that plays both', async () => {
    expect(skipped(12)).toEqual([54, 55]);
    await board({ selectedKey: N('D'), guitarTuningId: 'drop-d', guitarScalePosition: 12 });
    const text = notice();
    expect(text).toMatch(/^In this tuning two strings are a 5th apart, so F♯3 and G3, between them, are out of the hand's reach in this position\. You will find them in position ([IVX]+)\.$/);
    const where = ROMAN[/in position ([IVX]+)\.$/.exec(text)![1]];
    expect(plays(where, [54, 55])).toBe(true);
  });

  it('in the same tuning: no notice with nothing missing, one note named alone', async () => {
    const none = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find((p) => skipped(p).length === 0)!;
    const one = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find((p) => skipped(p).length === 1)!;
    expect(none).toBeDefined();
    expect(one).toBeDefined();
    const { unmount } = await board({ selectedKey: N('D'), guitarTuningId: 'drop-d', guitarScalePosition: none });
    expect(notice()).not.toMatch(/out of the hand's reach/);
    unmount();
    await board({ selectedKey: N('D'), guitarTuningId: 'drop-d', guitarScalePosition: one });
    const text = notice();
    expect(text).toMatch(/so [A-G][♯♭]?\d, between them, is out of the hand's reach in this position\. You will find it in (position [IVX]+|the Open position)\.$/);
    const m = skipped(one)[0];
    const named = /You will find it in (?:position ([IVX]+)|the Open position)/.exec(text)!;
    expect(plays(named[1] ? ROMAN[named[1]] : 0, [m])).toBe(true);
  });

  it('where no one position plays them all, each pitch says where (C Locrian, Drop D, capo 9, position X)', async () => {
    const reach = (await import('../../../core/utils/guitarPositionReach')).skippedReach(N('C'), 'locrian', 10, dropD, 9);
    expect(reach.playedIn).toBeNull();
    expect(reach.notes.map((x) => x.midi)).toEqual([53, 54]);
    const at = reach.notes.map((x) => x.playedIn!);
    // Each named position really plays its pitch, worked out on its own.
    for (const [i, m] of [53, 54].entries()) {
      expect(new Set(getGuitarPosition(N('C'), 'locrian', at[i], dropD, GUITAR_MAX_FRET, 9).notes.map((x) => x.midi)).has(m)).toBe(true);
    }
    const name = (p: number) => (p === 0 ? 'the Open position' : `position ${Object.keys(ROMAN).find((k) => ROMAN[k] === p)}`);
    await board({ selectedKey: N('C'), selectedScale: 'locrian', guitarTuningId: 'drop-d', guitarScalePosition: 10, capoFret: 9 });
    expect(notice()).toBe(`In this tuning two strings are a 5th apart, so F3 and G♭3, between them, are out of the hand's reach in this position. You will find F3 in ${name(at[0])} and G♭3 in ${name(at[1])}.`);
  });

  it('a tie goes to the lower position: C major, Drop D, position VII skips A2; VI and VIII both play it, VI is named', async () => {
    const at = (p: number) => getGuitarPosition(N('C'), 'major', p, dropD, GUITAR_MAX_FRET, 0);
    const missing = at(7).skippedMidi;
    expect(missing).toHaveLength(1);
    const playsIt = (p: number) => at(p).notes.some((x) => x.midi === missing[0]);
    // Worked out here: the two nearest positions both play it.
    expect([playsIt(6), playsIt(8)]).toEqual([true, true]);
    await board({ selectedKey: N('C'), guitarTuningId: 'drop-d', guitarScalePosition: 7 });
    expect(notice()).toMatch(/You will find it in position VI\.$/);
  });

  it('the Open position in PT and ES: C major, Drop D, position I skips A2, which the Open position plays', async () => {
    expect(getGuitarPosition(N('C'), 'major', 0, dropD, GUITAR_MAX_FRET, 0).notes.some((x) => x.midi === 45)).toBe(true);
    for (const [lang, end] of [['en', 'You will find it in the Open position.'], ['pt', 'Encontra-la na posição aberta.'], ['es', 'La encuentras en la posición abierta.']] as const) {
      await i18n.changeLanguage(lang);
      const { unmount } = await board({ selectedKey: N('C'), guitarTuningId: 'drop-d', guitarScalePosition: 1 });
      expect(notice(), lang).toMatch(/ A2[, ]/);
      expect(notice().endsWith(` ${end}`), `${lang}: ${notice()}`).toBe(true);
      unmount();
    }
  });

  it('each pitch where it is, in PT and ES (E Lydian, Open G, capo 9, position X: A♯3 in XI, B3 in the Open position)', async () => {
    const openG = getTuningById('open-g');
    const reach = (await import('../../../core/utils/guitarPositionReach')).skippedReach(N('E'), 'lydian', 10, openG, 9);
    expect(reach.playedIn).toBeNull();
    expect(reach.notes.map((x) => [x.midi, x.playedIn])).toEqual([[58, 11], [59, 0]]);
    for (const [lang, end] of [
      ['en', 'You will find A♯3 in position XI and B3 in the Open position.'],
      ['pt', 'Encontras A♯3 na posição XI e B3 na posição aberta.'],
      ['es', 'Encuentras A♯3 en la posición XI y B3 en la posición abierta.'],
    ] as const) {
      await i18n.changeLanguage(lang);
      const { unmount } = await board({ selectedKey: N('E'), selectedScale: 'lydian', guitarTuningId: 'open-g', guitarScalePosition: 10, capoFret: 9 });
      expect(notice().endsWith(` ${end}`), `${lang}: ${notice()}`).toBe(true);
      unmount();
    }
  });

  it('PT and ES name the same two pitches', async () => {
    await i18n.changeLanguage('pt');
    const { unmount } = await board({ selectedKey: N('D'), guitarTuningId: 'drop-d', guitarScalePosition: 12 });
    expect(notice()).toMatch(/^Nesta afinação há duas cordas a uma quinta de distância, por isso F♯3 e G3, entre elas, ficam fora do alcance da mão nesta posição\. Encontra-las na posição [IVX]+\.$/);
    unmount();
    await i18n.changeLanguage('es');
    await board({ selectedKey: N('D'), guitarTuningId: 'drop-d', guitarScalePosition: 12 });
    expect(notice()).toMatch(/^En esta afinación dos cuerdas están a una quinta, así que F♯3 y G3, entre ellas, quedan fuera del alcance de la mano en esta posición\. Las encuentras en la posición [IVX]+\.$/);
  });
});

describe('M47: the arrow keys reach the open strings', () => {
  const ORIENTATIONS = [['right', 'low'], ['right', 'high'], ['left', 'low'], ['left', 'high']] as const;
  for (const [nut, top] of ORIENTATIONS) {
    it(`nut ${nut}, ${top} string on top: from fret 1 toward the nut is the open string, on all six strings, and back`, async () => {
      const { container } = await board({ guitarScalePosition: 'all', neckNutSide: nut, neckTopString: top });
      const grid = screen.getByRole('grid');
      const live = () => grid.querySelector('[aria-live]')!.textContent;
      const toNut = nut === 'right' ? 'ArrowRight' : 'ArrowLeft';
      const away = nut === 'right' ? 'ArrowLeft' : 'ArrowRight';
      const down = 'ArrowDown';
      fireEvent.keyDown(grid, { key: down }); // lands on the top string drawn, fret 1
      const first = top === 'low' ? 6 : 1;
      expect(live()).toMatch(new RegExp(`^String ${first}, fret 1,`));
      fireEvent.keyDown(grid, { key: toNut });
      const order = top === 'low' ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
      const names = { 6: 'E', 5: 'A', 4: 'D', 3: 'G', 2: 'B', 1: 'E' } as Record<number, string>;
      for (const [i, s] of order.entries()) {
        if (i > 0) fireEvent.keyDown(grid, { key: down });
        expect(live()).toBe(`String ${s}, open, ${names[s]}`);
        const ringed = container.querySelector('[data-open-string][data-keyboard-cell]');
        expect(ringed, `string ${s}: the open cell shows the keyboard's ring`).not.toBeNull();
      }
      fireEvent.keyDown(grid, { key: toNut }); // nothing past the open string
      expect(live()).toBe(`String ${order[5]}, open, ${names[order[5]]}`);
      fireEvent.keyDown(grid, { key: 'Enter' });
      expect(noteOn).toHaveBeenCalledTimes(1);
      expect(noteOn.mock.calls[0][0]).toMatchObject({ natural: 'E', octave: order[5] === 1 ? 4 : 2 });
      fireEvent.keyDown(grid, { key: away });
      expect(live()).toMatch(new RegExp(`^String ${order[5]}, fret 1,`));
    });
  }

  for (const [nut, top, toNut, down] of [['right', 'low', 'ArrowRight', 'ArrowDown'], ['left', 'high', 'ArrowLeft', 'ArrowUp']] as const) {
    it(`a chord, nut ${nut}: the open column of the grip window; a muted string says so, and neither Enter nor Space plays it`, async () => {
      await board({ selectedChord: chord('C', 'major'), neckNutSide: nut, neckTopString: top });
      const grid = screen.getByRole('grid');
      const live = () => grid.querySelector('[aria-live]')!.textContent;
      fireEvent.keyDown(grid, { key: 'ArrowDown' }); // the top string drawn, nut-end fret of the window
      // Walk to string 6 (drawn on top in the owner's view, at the bottom in the tab view).
      if (top === 'high') for (let i = 0; i < 5; i++) fireEvent.keyDown(grid, { key: 'ArrowDown' });
      fireEvent.keyDown(grid, { key: toNut });
      expect(live()).toBe('String 6 muted');
      fireEvent.keyDown(grid, { key: 'Enter' });
      fireEvent.keyDown(grid, { key: ' ' });
      expect(noteOn).not.toHaveBeenCalled();
      // String 5's open column (A, not in this grip) does play: the guard is the mute, not the column.
      fireEvent.keyDown(grid, { key: down === 'ArrowDown' ? 'ArrowDown' : 'ArrowUp' });
      expect(live()).toBe('String 5, open, A');
      fireEvent.keyDown(grid, { key: ' ' });
      expect(noteOn).toHaveBeenCalledTimes(1);
      fireEvent.keyDown(grid, { key: down === 'ArrowDown' ? 'ArrowDown' : 'ArrowUp' });
      fireEvent.keyDown(grid, { key: down === 'ArrowDown' ? 'ArrowDown' : 'ArrowUp' });
      expect(live()).toBe('String 3, open, G, in the chord');
    });
  }

  it('with a capo the frets behind it stay out of play: toward the nut stops at the capo', async () => {
    await board({ guitarScalePosition: 'all', capoFret: 2 });
    const grid = screen.getByRole('grid');
    const live = () => grid.querySelector('[aria-live]')!.textContent;
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    for (let i = 0; i < 4; i++) fireEvent.keyDown(grid, { key: 'ArrowRight' });
    expect(live()).toMatch(/^String 6, fret 2, at the capo,/);
  });
});

describe('M48: a cell of the grip says it is the chord\'s, and the finger its dot shows', () => {
  it('C major: fretted, open, muted and unselected cells, and the keyboard\'s announcement', async () => {
    const { container } = await board({ selectedChord: chord('C', 'major') });
    expect(container.querySelector('[data-string-row="1"][data-fret="3"]')!.getAttribute('aria-label')).toBe('C, fret 3, string 5, in the chord, finger 3');
    expect(container.querySelector('[data-string-row="2"][data-fret="2"]')!.getAttribute('aria-label')).toBe('E, fret 2, string 4, in the chord, finger 2');
    const open = [...container.querySelectorAll('[data-open-string]')].map((c) => c.getAttribute('aria-label'));
    expect(open).toEqual(['String 6 muted', 'A open string', 'D open string', 'G open string, in the chord', 'B open string', 'E open string, in the chord']);
    // Not in the grip: as before.
    expect(container.querySelector('[data-string-row="2"][data-fret="3"]')!.getAttribute('aria-label')).toBe('F, fret 3, string 4');
    // The keyboard hears the same: string 5 (the second drawn), fret 1 → 3 (← is toward fret 15 on the owner's board).
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowLeft' });
    fireEvent.keyDown(grid, { key: 'ArrowLeft' });
    expect(grid.querySelector('[aria-live]')!.textContent).toBe('String 5, fret 3, C, in the chord, finger 3');
  });

  it('a barre says so (F major, E-shape barre: string 6 fret 1, finger 1, barre)', async () => {
    const { container } = await board({ selectedChord: chord('F', 'major') });
    expect(container.querySelector('[data-string-row="0"][data-fret="1"]')!.getAttribute('aria-label')).toBe('F, fret 1, string 6, in the chord, finger 1, barre');
  });

  it('with a capo: the grip\'s cells add the same words after "frets above the capo"', async () => {
    const { container } = await board({ selectedChord: chord('D', 'major'), capoFret: 2 });
    // D with capo 2 is the C shape at the capo: string 5 fret 5, finger 3.
    expect(container.querySelector('[data-string-row="1"][data-fret="5"]')!.getAttribute('aria-label')).toBe('D, fret 5, string 5, 3 frets above the capo, in the chord, finger 3');
    expect(container.querySelector('[data-string-row="3"][data-fret="2"]')!.getAttribute('aria-label')).toBe('A, fret 2, string 3, at the capo, in the chord');
  });

  it('a scale position\'s dot says its finger (position V, C major)', async () => {
    const { container } = await board({ guitarScalePosition: 5 });
    const cell = container.querySelector('[data-string-row="0"][data-fret="5"]')!;
    expect(cell.getAttribute('aria-label')).toBe('A, fret 5, string 6, finger 1');
  });

  const openCells = (container: HTMLElement) => [...container.querySelectorAll('[data-open-string]')].map((c) => c.getAttribute('aria-label'));
  it('PT: the grip, the barre, the open string in the chord, and the keyboard\'s open string', async () => {
    await i18n.changeLanguage('pt');
    const { container, unmount } = await board({ selectedChord: chord('C', 'major') });
    expect(container.querySelector('[data-string-row="1"][data-fret="3"]')!.getAttribute('aria-label')).toBe('C, traste 3, corda 5, no acorde, dedo 3');
    expect(openCells(container)[3]).toBe('G, corda solta, no acorde');
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    expect(grid.querySelector('[aria-live]')!.textContent).toBe('Corda 5, solta, A');
    unmount();
    const f = await board({ selectedChord: chord('F', 'major') });
    expect(f.container.querySelector('[data-string-row="0"][data-fret="1"]')!.getAttribute('aria-label')).toBe('F, traste 1, corda 6, no acorde, dedo 1, pestana');
  });

  it('ES: the grip, the barre, the open string in the chord, and the keyboard\'s open string', async () => {
    await i18n.changeLanguage('es');
    const { container, unmount } = await board({ selectedChord: chord('F', 'major') });
    expect(container.querySelector('[data-string-row="0"][data-fret="1"]')!.getAttribute('aria-label')).toBe('F, traste 1, cuerda 6, en el acorde, dedo 1, cejilla');
    unmount();
    const c = await board({ selectedChord: chord('C', 'major') });
    expect(openCells(c.container)[3]).toBe('G, cuerda al aire, en el acorde');
    const grid = screen.getByRole('grid');
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    expect(grid.querySelector('[aria-live]')!.textContent).toBe('Cuerda 5, al aire, A');
  });

  it('a position dot with the learner\'s own finger says so, in EN, PT and ES', async () => {
    const { fingeringKey } = await import('../../../core/utils/guitarPositions');
    // Position V of C major: string 6 fret 5 (A) is the index's; the learner gave it finger 2.
    useFingeringStore.setState({ overrides: { [fingeringKey('major', 'standard', 5, 0, 0, 5)]: 2 }, labelMode: 'finger' });
    for (const [lang, name] of [['en', 'A, fret 5, string 6, finger 2, your fingering'], ['pt', 'A, traste 5, corda 6, dedo 2, a tua dedilhação'], ['es', 'A, traste 5, cuerda 6, dedo 2, tu digitación']] as const) {
      await i18n.changeLanguage(lang);
      const { container, unmount } = await board({ guitarScalePosition: 5 });
      expect(container.querySelector('[data-string-row="0"][data-fret="5"]')!.getAttribute('aria-label')).toBe(name);
      unmount();
    }
  });
});

describe('M49: Spanish chips read the same with or without a capo (cured in release 16)', () => {
  const chipTexts = async (state: Partial<ReturnType<typeof useAppStore.getState>>) => {
    const { unmount } = await board(state);
    const texts = chips().map((c) => c.textContent);
    unmount();
    return texts;
  };
  it('C major at capo 0 and D♭ major at capo 1; E minor at capo 0 and F minor at capo 1, ordinals included', async () => {
    await i18n.changeLanguage('es');
    const c0 = await chipTexts({ selectedChord: chord('C', 'major'), capoFret: 0 });
    expect(c0).toContain('forma de C');
    expect(c0).toContain('cejilla de A');
    // The same shapes, one fret up: the same names (the C-shape barre, at fret
    // 12 for C, would need fret 16 at capo 1, so that list ends one sooner).
    const c1 = await chipTexts({ selectedChord: chord('Db', 'major'), capoFret: 1 });
    expect(c1).toEqual(c0.slice(0, 5));
    // Two grips of one shape carry an ordinal, in both paths: E minor (two E
    // shapes, the higher at fret 14) and F minor at capo 1.
    const e0 = await chipTexts({ selectedChord: chord('E', 'minor'), capoFret: 0 });
    expect(e0).toEqual(['forma de E #1', 'forma de D', 'forma de A', 'forma de E #2']);
    expect(await chipTexts({ selectedChord: chord('F', 'minor'), capoFret: 1 })).toEqual(e0);
  });
});
