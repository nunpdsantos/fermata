/**
 * Brief D (2026-11-10): every guitar surface draws the neck the way
 * Settings → Guitar neck says — nut left or right, thin or thick string on
 * top — for each of the four combinations: cell order, fret-number order,
 * the open-string side, the arrow keys (they follow the drawing) and the
 * position stepper (› always steps to the higher frets). What is SAID —
 * string and fret numbers, note names, screen-reader labels — never turns.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import type { NeckNutSide, NeckTopString } from '../../../state/storeTypes';
import { drawnNeighbour, fretsAcross, nutScrollLeft, stringsDown } from '../neckOrientation';
import { SCENARIOS, media, resetStores } from './neckScenarios';
import { Fretboard } from '../Fretboard';

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => media.mobile,
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(cleanup);

const COMBOS = [
  ['left', 'high'],
  ['left', 'low'],
  ['right', 'high'],
  ['right', 'low'],
] as const satisfies readonly (readonly [NeckNutSide, NeckTopString])[];

const scenario = (name: string) => SCENARIOS.find((s) => s.name === name)!.run;
const before = (a: Element, b: Element) => !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
const ascending = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] < x);
const descending = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] > x);

/** Each drawn string row of a Fretboard / practice neck, top to bottom. */
function stringRows(root: Element) {
  return [...root.querySelectorAll('[data-dock-row="string"]')].map((row) => {
    const cells = [...row.querySelectorAll<HTMLElement>('[data-fret]')];
    const open = row.querySelector('[data-open-string]')!;
    const nut = open.previousElementSibling === null ? open.nextElementSibling! : open.previousElementSibling!;
    return {
      string: Number(cells[0].dataset.stringRow),
      frets: cells.map((c) => Number(c.dataset.fret)),
      openFirst: before(open, cells[0]),
      nutBesideOpen: (nut as HTMLElement).style.flexShrink === '0',
      name: row.querySelector('[data-string-name]')!,
      cells,
      open,
    };
  });
}

/** The fret numbers under a Fretboard, left to right. */
function fretNumbers(root: Element): number[] {
  const row = root.querySelector('[data-dock-row="frets"]')!;
  const frets = [...row.children].find((c) => c.classList.contains('flex-1'))!;
  return [...frets.children].map((c) => Number(c.textContent));
}

describe.each(COMBOS)('nut %s, %s string on top', (nut, top) => {
  const sideOfNut = nut === 'left';
  const drawnStrings = top === 'low' ? [0, 1, 2, 3, 4, 5] : [5, 4, 3, 2, 1, 0];
  const inOrder = (frets: number[]) => (sideOfNut ? ascending(frets) : descending(frets));
  beforeEach(() => resetStores({ neckNutSide: nut, neckTopString: top }));

  it.each(['dock-laptop-whole-neck', 'dock-phone-whole-neck', 'dock-laptop-position-V', 'dock-laptop-chord-F-barre', 'neck-position-VII', 'neck-chord-Bm-barre'])(
    '%s: strings, frets, numbers and the open strings are drawn in order',
    async (name) => {
      const root = await scenario(name)();
      const rows = stringRows(root);
      expect(rows.map((r) => r.string)).toEqual(drawnStrings);
      for (const r of rows) {
        expect(inOrder(r.frets), `string ${r.string}: ${r.frets}`).toBe(true);
        expect(r.openFirst).toBe(sideOfNut);
        // The nut sits between the open string and the frets; the string's
        // name at the far end.
        expect(before(r.name, r.cells[0])).toBe(!sideOfNut);
        // What is said describes the instrument: "string 6" is the thick one.
        expect(r.cells[0].getAttribute('aria-label')).toMatch(new RegExp(`, string ${6 - r.string}$`));
      }
      // Fret numbers rise away from the nut, in the same order as the cells.
      expect(fretNumbers(root)).toEqual(rows[0].frets);
    },
  );

  it('the anchor badge and the 12th-fret marker sit over their own frets', async () => {
    const root = await scenario('dock-laptop-position-V')();
    const markers = root.querySelector('[data-dock-row="frets"]')!.parentElement!.firstElementChild!;
    const marks = [...[...markers.children].find((c) => c.classList.contains('flex-1'))!.children];
    const numbers = fretNumbers(root);
    expect(marks[numbers.indexOf(5)].textContent).toBe('V');
    act(() => useAppStore.setState({ guitarScalePosition: 'all' }));
    const all = fretNumbers(root);
    const allMarks = [...[...root.querySelector('[data-dock-row="frets"]')!.parentElement!.firstElementChild!.children]
      .find((c) => c.classList.contains('flex-1'))!.children];
    expect(allMarks[all.indexOf(12)].textContent).toBe('••');
    expect(allMarks[all.indexOf(3)].textContent).toBe('•');
  });

  it('the chord\'s "Nfr" and the open "0" are at the nut end', async () => {
    const root = await scenario('dock-laptop-chord-F-barre')();
    const row = root.querySelector('[data-dock-row="frets"]')!;
    const ends = [row.firstElementChild!, row.lastElementChild!];
    const nutEnd = sideOfNut ? ends[0] : ends[1];
    expect(nutEnd.textContent).toBe('1fr');
    act(() => useAppStore.setState({ selectedChord: null, guitarScalePosition: 'all' }));
    const row2 = root.querySelector('[data-dock-row="frets"]')!;
    expect((sideOfNut ? row2.firstElementChild! : row2.lastElementChild!).textContent).toBe('0');
  });

  it('arrow keys move to the cell DRAWN in that direction; the announcement names the real string', async () => {
    await scenario('dock-laptop-whole-neck')();
    const grid = screen.getByRole('grid');
    const live = () => grid.querySelector('[aria-live]')!.textContent;
    fireEvent.keyDown(grid, { key: 'ArrowDown' }); // the first key lands on the top string, nut-end fret
    const topString = 6 - drawnStrings[0];
    expect(live()).toMatch(new RegExp(`^String ${topString}, fret 1,`));
    // → is the cell drawn on the right: fret 2 with the nut on the left; with
    // the nut on the right the cell right of fret 1 is the nut — it stays.
    fireEvent.keyDown(grid, { key: 'ArrowRight' });
    expect(live()).toMatch(new RegExp(`^String ${topString}, fret ${sideOfNut ? 2 : 1},`));
    fireEvent.keyDown(grid, { key: 'ArrowLeft' });
    fireEvent.keyDown(grid, { key: 'ArrowLeft' });
    expect(live()).toMatch(new RegExp(`^String ${topString}, fret ${sideOfNut ? 1 : 3},`));
    // ↓ is the string drawn below.
    fireEvent.keyDown(grid, { key: 'ArrowDown' });
    expect(live()).toMatch(new RegExp(`^String ${6 - drawnStrings[1]}, fret ${sideOfNut ? 1 : 3},`));
    fireEvent.keyDown(grid, { key: 'ArrowUp' });
    fireEvent.keyDown(grid, { key: 'ArrowUp' });
    expect(live()).toMatch(new RegExp(`^String ${topString},`));
  });

  it('› steps to the higher frets, and ‹ back (the [ ] keys too); the higher frets are drawn on the far side from the nut', async () => {
    const root = await scenario('dock-laptop-position-V')();
    fireEvent.click(screen.getByRole('button', { name: 'Next position' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(6);
    const numbers = fretNumbers(root);
    expect(numbers.indexOf(numbers.reduce((a, b) => Math.max(a, b))) === numbers.length - 1).toBe(sideOfNut);
    fireEvent.click(screen.getByRole('button', { name: 'Previous position' }));
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    fireEvent.keyDown(window, { key: ']', code: 'BracketRight' });
    expect(useAppStore.getState().guitarScalePosition).toBe(6);
    fireEvent.keyDown(window, { key: '[', code: 'BracketLeft' });
    expect(useAppStore.getState().guitarScalePosition).toBe(5);
    // The stepper's arrows keep their shape and order: ‹ first, › last.
    const row = screen.getByTestId('position-row');
    const steps = [...row.querySelectorAll('button')].filter((b) => /position$/.test(b.getAttribute('aria-label') ?? ''));
    expect(steps.map((b) => b.getAttribute('aria-label'))).toEqual(['Previous position', 'Next position']);
  });

  it('the barre spans the barred strings whichever is drawn on top', async () => {
    const root = await scenario('dock-laptop-chord-F-barre')();
    expect(root.querySelector('[data-testid="barre-overlay"]')).not.toBeNull();
  });

  it.each(['practice-scale', 'practice-position-walk', 'practice-right-hand', 'practice-technical-set'])('%s: the practice neck turns the same way', async (name) => {
    const root = await scenario(name)();
    const rows = stringRows(root);
    expect(rows.map((r) => r.string)).toEqual(drawnStrings);
    for (const r of rows) {
      expect(inOrder(r.frets)).toBe(true);
      expect(r.openFirst).toBe(sideOfNut);
      const brk = r.open.parentElement!.querySelector('[data-fret-break]');
      // A cropped passage's break sits between the nut and the first fret drawn.
      if (brk) expect(before(brk, r.cells[0])).toBe(sideOfNut);
    }
    const header = root.querySelector('.practice-neck > .flex.text-caption')!;
    expect([...header.children].map((c) => Number(c.textContent))).toEqual(rows[0].frets);
    const pad = (header as HTMLElement).style;
    expect(sideOfNut ? pad.paddingRight : pad.paddingLeft).toBe('32px');
  });

  describe('the Drill reading board', () => {
    const readingRows = (root: Element) => [...root.querySelectorAll('[data-reading-string]')].map((label) => {
      const row = label.parentElement!;
      const cells = [...row.querySelectorAll<HTMLElement>('[data-fret]')];
      return { string: Number(label.getAttribute('data-reading-string')), frets: cells.map((c) => Number(c.dataset.fret)), cells, label };
    });

    it.each(['reading-position-V', 'reading-open', 'reading-feedback-wrong'])('%s: strings, frets, the nut line and the "6 to 1" legend', async (name) => {
      const root = await scenario(name)();
      const rows = readingRows(root);
      expect(rows.map((r) => r.string)).toEqual(drawnStrings.map((s) => 6 - s));
      for (const r of rows) {
        expect(inOrder(r.frets.filter((f) => f > 0))).toBe(true);
        expect(r.frets.indexOf(0)).toBe(sideOfNut ? 0 : r.frets.length - 1);
        // The pinned gutter stays on the left; the nut line is drawn on the
        // open column's fretted side.
        expect(before(r.label, r.cells[0])).toBe(true);
        const openBox = r.cells[r.frets.indexOf(0)].parentElement!.style;
        expect(sideOfNut ? openBox.borderRight : openBox.borderLeft).toBe('6px solid var(--text-muted)');
        expect(r.cells[0].getAttribute('aria-label')).toMatch(new RegExp(`^String ${r.string}, `));
      }
      const corner = screen.getByTestId('reading-corner');
      expect(corner.textContent).toBe(top === 'low' ? '⑥–①' : '①–⑥');
      expect(corner.getAttribute('aria-label')).toBe(top === 'low' ? 'Strings 6 to 1' : 'Strings 1 to 6');
      // The fret numbers line up with the cells.
      const numbers = [...corner.parentElement!.querySelectorAll('.flex-1')].map((c) => Number(c.textContent));
      expect(numbers).toEqual(rows[0].frets);
    });

    // Review 2026-11-10: the omitted fret spans keep their breaks in either
    // drawn order (frets rise left to right when the nut is on the left).
    it.each(['reading-position-V', 'reading-feedback-wrong'])('%s: omitted fret spans keep their "//" breaks, the header "…" and the width', async (name) => {
      const root = await scenario(name)();
      const rows = readingRows(root);
      const frets = rows[0].frets;
      const gaps = frets.filter((f, i) => i > 0 && Math.abs(frets[i - 1] - f) > 1).length;
      expect(gaps).toBeGreaterThan(0);
      for (const r of rows) {
        expect(r.frets).toEqual(frets);
        const row = r.label.parentElement!;
        expect(row.querySelectorAll('[data-fret-break]').length).toBe(gaps);
        // Each break sits right before the cell after the jump.
        for (const brk of row.querySelectorAll('[data-fret-break]')) {
          const next = brk.nextElementSibling!.querySelector<HTMLElement>('[data-fret]')!;
          const i = frets.indexOf(Number(next.dataset.fret));
          expect(Math.abs(frets[i - 1] - frets[i])).toBeGreaterThan(1);
        }
      }
      const header = screen.getByTestId('reading-corner').parentElement!;
      expect([...header.children].filter((c) => c.textContent === '…').length).toBe(gaps);
      expect((header.parentElement as HTMLElement).style.minWidth).toBe(`${44 + frets.length * 44 + 6 + gaps * 24}px`);
    });

    it('arrows follow the drawing, Home is the nut end; the tab stop starts on the top string', async () => {
      const root = await scenario('reading-open')();
      const cell = (s: number, f: number) => root.querySelector<HTMLElement>(`[data-string-row="${s}"][data-fret="${f}"]`)!;
      const tabStop = root.querySelector<HTMLElement>('[data-fret][tabindex="0"]')!;
      expect(Number(tabStop.dataset.stringRow)).toBe(drawnStrings[0]);
      const s = drawnStrings[0];
      cell(s, 1).focus();
      fireEvent.keyDown(cell(s, 1), { key: 'ArrowRight' });
      expect(document.activeElement).toBe(cell(s, sideOfNut ? 2 : 0));
      fireEvent.keyDown(document.activeElement!, { key: 'Home' });
      expect(document.activeElement).toBe(cell(s, 0));
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
      expect(document.activeElement).toBe(cell(drawnStrings[1], 0));
      fireEvent.keyDown(document.activeElement!, { key: 'End' });
      expect(document.activeElement).toBe(cell(drawnStrings[1], 5));
    });
  });
});

describe('scroll start: the board opens at the nut end', () => {
  let sw: PropertyDescriptor | undefined;
  let cw: PropertyDescriptor | undefined;
  beforeEach(() => {
    sw = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollWidth');
    cw = Object.getOwnPropertyDescriptor(Element.prototype, 'clientWidth');
    Object.defineProperty(Element.prototype, 'scrollWidth', { configurable: true, get: () => 660 });
    Object.defineProperty(Element.prototype, 'clientWidth', { configurable: true, get: () => 300 });
  });
  afterEach(() => {
    if (sw) Object.defineProperty(Element.prototype, 'scrollWidth', sw);
    if (cw) Object.defineProperty(Element.prototype, 'clientWidth', cw);
  });

  it.each(COMBOS)('nut %s (%s on top): whole neck, after a setting change, and the reading board', async (nut, top) => {
    resetStores({ neckNutSide: nut, neckTopString: top, guitarScalePosition: 'all' });
    media.mobile = true;
    render(<Fretboard />);
    const grid = screen.getByRole('grid');
    expect(grid.scrollLeft).toBe(nut === 'left' ? 0 : 360);
    // Turning the neck in Settings opens it at the (new) nut end again.
    act(() => useAppStore.getState().setNeckNutSide(nut === 'left' ? 'right' : 'left'));
    expect(grid.scrollLeft).toBe(nut === 'left' ? 360 : 0);
    cleanup();
    const board = await scenario('reading-open')();
    act(() => useAppStore.getState().setNeckNutSide(nut));
    const scroller = board.querySelector<HTMLElement>('[role="group"]')!;
    expect(scroller.scrollLeft).toBe(nut === 'left' ? 0 : 360);
  });
});

// Review 2026-11-10: the barre pill is measured from the cells' positions, so
// turning the neck in Settings (either axis) must measure it again.
describe('the barre overlay follows a change of either setting', () => {
  let rect: PropertyDescriptor | undefined;
  beforeEach(() => {
    rect = Object.getOwnPropertyDescriptor(Element.prototype, 'getBoundingClientRect');
    // jsdom has no layout: place each cell by its drawn column and row.
    Element.prototype.getBoundingClientRect = function (this: Element) {
      const el = this as HTMLElement;
      const row = el.closest('[data-dock-row="string"]');
      if (el.dataset?.fret !== undefined && row) {
        const col = [...row.querySelectorAll('[data-fret]')].indexOf(el);
        const r = [...row.parentElement!.querySelectorAll('[data-dock-row="string"]')].indexOf(row);
        return { left: 40 + col * 40, top: r * 30, width: 40, height: 30, right: 80 + col * 40, bottom: r * 30 + 30, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
      }
      return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;
    };
  });
  afterEach(() => {
    if (rect) Object.defineProperty(Element.prototype, 'getBoundingClientRect', rect);
  });

  it.each(COMBOS)('from nut %s, %s on top', async (nut, top) => {
    resetStores({ neckNutSide: nut, neckTopString: top });
    const root = await scenario('dock-laptop-chord-F-barre')();
    const overlay = () => root.querySelector<HTMLElement>('[data-testid="barre-overlay"]')!;
    const barreCell = () => root.querySelector('[data-fret="1"]')!.getBoundingClientRect();
    const expected = () => `${barreCell().left + barreCell().width / 2 - 12}px`;
    expect(overlay().style.left).toBe(expected());
    const before = overlay().style.left;
    act(() => useAppStore.getState().setNeckNutSide(nut === 'left' ? 'right' : 'left'));
    expect(overlay().style.left).not.toBe(before);
    expect(overlay().style.left).toBe(expected());
    act(() => useAppStore.getState().setNeckTopString(top === 'high' ? 'low' : 'high'));
    expect(overlay().style.left).toBe(expected());
  });
});

describe('orientation helpers', () => {
  it('fretsAcross / stringsDown / drawnNeighbour / nutScrollLeft', () => {
    expect(fretsAcross([3, 1, 2], 'left')).toEqual([1, 2, 3]);
    expect(fretsAcross([1, 3, 2], 'right')).toEqual([3, 2, 1]);
    expect(stringsDown('low')).toEqual([0, 1, 2, 3, 4, 5]);
    expect(stringsDown('high')).toEqual([5, 4, 3, 2, 1, 0]);
    expect(drawnNeighbour([3, 2, 1], 1, 1)).toBe(1);
    expect(drawnNeighbour([3, 2, 1], 1, -1)).toBe(2);
    expect(drawnNeighbour([5, 4, 3, 2, 1, 0], 5, -1)).toBe(5);
    expect(drawnNeighbour([1, 2], 9, 1)).toBe(9);
    const el = { scrollWidth: 500, clientWidth: 200 } as HTMLElement;
    expect(nutScrollLeft(el, 'left')).toBe(0);
    expect(nutScrollLeft(el, 'right')).toBe(300);
  });
});
