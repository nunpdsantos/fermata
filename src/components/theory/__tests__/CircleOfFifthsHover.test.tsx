/**
 * Circle of fifths, review round 2:
 *  - B2 (W2-01 residue): the hover/focus panel and the outer signature labels
 *    are spelled from the segment as DISPLAYED (the selected segment wears the
 *    selected spelling). C♯ major hovering C♯ said "5♭ · rel: B♭m" (7♯, A♯m).
 *  - item 3: scales with no standard key signature get a neutral circle (no
 *    accent fill, no halo) and say "No standard key signature".
 *  - item 7: a mode's parent key is called "Parent key", in EN/PT/ES.
 *  - item 2 (structure): numerals are drawn at ≥ 8 units and stacked under the
 *    key name so they cannot collide (rendered size is checked in a browser).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import i18n from '../../../i18n';
import { spellDegree, majorKeySignature, pcOf } from '../../../core/utils/__tests__/theoryOracle';

vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playChordVoiced: vi.fn(),
}));

import { CircleOfFifths } from '../CircleOfFifths';

afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('en');
});

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const select = (root: string, type: ScaleType) =>
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, selectedDegree: null, exerciseInputActive: false });
const sigText = (count: number, type: string) => (count === 0 ? 'no ♯/♭' : `${count}${type === '#' ? '♯' : '♭'}`);
const text = (c: HTMLElement, id: string) => c.querySelector(`[data-testid="${id}"]`)?.textContent ?? null;

function hover(c: HTMLElement, label: string) {
  const seg = c.querySelector(`g[aria-label="${label}"]`)!;
  fireEvent.mouseEnter(seg);
  return { name: text(c, 'cof-hover-name'), sig: text(c, 'cof-hover-sig'), dist: text(c, 'cof-hover-dist') };
}

describe('B2 — hover panel spelled from the displayed segment', () => {
  it('C# major hovering C# reads 7♯ · rel: A#m (not 5♭ · B♭m)', () => {
    select('C#', 'major');
    const { container } = render(<CircleOfFifths />);
    expect(hover(container, 'C# major')).toMatchObject({ name: 'C#', sig: '7♯ · rel: A#m' });
    expect(text(container, 'cof-sig-7')).toBe('7♯');
  });

  it('Eb phrygian hovering Cb reads 7♭ · rel: Abm (not 5♯ · G♯m)', () => {
    select('Eb', 'phrygian');
    const { container } = render(<CircleOfFifths />);
    expect(hover(container, 'Cb major')).toMatchObject({ name: 'Cb', sig: '7♭ · rel: Abm' });
    expect(text(container, 'cof-sig-5')).toBe('7♭');
  });

  it('Ab minor hovering Abm reads 7♭ · rel: Cb', () => {
    select('Ab', 'natural_minor');
    const { container } = render(<CircleOfFifths />);
    expect(hover(container, 'Ab minor')).toMatchObject({ name: 'Abm', sig: '7♭ · rel: Cb' });
  });

  it('every segment, for a spread of selections, matches the oracle (hover and outer labels)', () => {
    const bad: string[] = [];
    for (const [root, type] of [['C#', 'major'], ['Gb', 'major'], ['Eb', 'phrygian'], ['G#', 'natural_minor'], ['A', 'dorian'], ['F', 'lydian'], ['Db', 'mixolydian'], ['B', 'locrian']] as [string, ScaleType][]) {
      select(root, type);
      const { container } = render(<CircleOfFifths />);
      for (const g of [...container.querySelectorAll('g[role="button"]')]) {
        const [name, ring] = g.getAttribute('aria-label')!.split(' ');
        const major = ring === 'major' ? name : spellDegree(name, 'b3')!;
        const ks = majorKeySignature(major);
        const rel = ring === 'major' ? `${spellDegree(name, '6')}m` : major;
        const h = hover(container, g.getAttribute('aria-label')!);
        const want = `${sigText(ks.count, ks.type)} · rel: ${rel}`;
        if (h.sig !== want) bad.push(`${root} ${type}: hover ${name} ${ring} "${h.sig}" want "${want}"`);
        fireEvent.mouseLeave(g);
        if (ring === 'major') {
          const idx = [...container.querySelectorAll('g[aria-label$=" major"]')].indexOf(g);
          // C's position keeps no outer label (as before): no accidentals.
          const wantOuter = ks.count === 0 ? null : sigText(ks.count, ks.type);
          if (text(container, `cof-sig-${idx}`) !== wantOuter) bad.push(`${root} ${type}: outer label ${idx} "${text(container, `cof-sig-${idx}`)}" for ${name}`);
        }
        expect(pcOf(major)).toBeGreaterThanOrEqual(0);
      }
      cleanup();
    }
    expect(bad).toEqual([]);
  });
});

describe('item 3 — no standard signature: neutral circle and an explicit note', () => {
  it('C Hungarian minor fills no segment with the accent and says so', () => {
    select('C', 'hungarian_minor');
    const { container } = render(<CircleOfFifths />);
    const fills = [...container.querySelectorAll('g[role="button"] path')].map((p) => p.getAttribute('fill') ?? '');
    expect(fills.filter((f) => f.includes('--accent'))).toEqual([]);
    const glows = [...container.querySelectorAll('g[role="button"]')].filter((g) => (g as SVGGElement).style.filter.includes('glow'));
    expect(glows).toHaveLength(0);
    expect(text(container, 'cof-centre-nosig')).toBe('No standard key signature');
  });

  it('a major key still gets its accent and halo', () => {
    select('C', 'major');
    const { container } = render(<CircleOfFifths />);
    const fills = [...container.querySelectorAll('g[role="button"] path')].map((p) => p.getAttribute('fill') ?? '');
    expect(fills.some((f) => f.includes('--accent'))).toBe(true);
    expect(text(container, 'cof-centre-nosig')).toBeNull();
  });
});

describe('item 7 — a mode\'s parent key is called "Parent key"', () => {
  it('A dorian hovering G major; A minor hovering A minor is the current key', () => {
    select('A', 'dorian');
    let r = render(<CircleOfFifths />);
    expect(hover(r.container, 'G major').dist).toBe('Parent key');
    cleanup();
    select('A', 'natural_minor');
    r = render(<CircleOfFifths />);
    expect(hover(r.container, 'A minor').dist).toBe('Current key');
  });

  it('in PT and ES too', async () => {
    select('A', 'dorian');
    for (const [lang, want] of [['pt', 'Tonalidade-mãe'], ['es', 'Tonalidad madre']] as const) {
      await i18n.changeLanguage(lang);
      const { container } = render(<CircleOfFifths />);
      expect(hover(container, 'G major').dist, lang).toBe(want);
      cleanup();
    }
  });
});

describe('item 2 — numerals are large enough and stacked under the name', () => {
  it('every numeral is drawn at ≥ 8 units, at the same x as its key name, below it', () => {
    select('C', 'major');
    const { container } = render(<CircleOfFifths />);
    const numerals = [...container.querySelectorAll('[data-numeral]')];
    expect(numerals).toHaveLength(7);
    for (const n of numerals) {
      expect(Number(n.getAttribute('font-size'))).toBeGreaterThanOrEqual(8);
      const name = n.parentElement!.querySelector('[data-name]')!;
      expect(Number(n.getAttribute('x'))).toBeCloseTo(Number(name.getAttribute('x')), 5);
      expect(Number(n.getAttribute('y'))).toBeGreaterThan(Number(name.getAttribute('y')));
    }
  });
});
