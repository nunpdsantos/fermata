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
import { spellDegree, majorKeySignature, pcOf, ORACLE_SCALES } from '../../../core/utils/__tests__/theoryOracle';

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

describe('re-review nit — diatonic chord segments wear the selected key\'s spelling', () => {
  const names = (c: HTMLElement) => new Map(
    [...c.querySelectorAll('g[role="button"]')].map((g) => [
      g.querySelector('[data-name]')!.textContent!,
      g.querySelector('[data-numeral]')?.textContent ?? null,
    ]),
  );

  it('C# major: F# IV, G# V, D#m ii, E#m iii, A#m vi, B#° vii°', () => {
    select('C#', 'major');
    const { container } = render(<CircleOfFifths />);
    const n = names(container);
    expect(Object.fromEntries(['C#', 'F#', 'G#', 'D#m', 'E#m', 'A#m', 'B#°'].map((k) => [k, n.get(k)]))).toEqual({
      'C#': 'I', 'F#': 'IV', 'G#': 'V', 'D#m': 'ii', 'E#m': 'iii', 'A#m': 'vi', 'B#°': 'vii°',
    });
    for (const flat of ['Gb', 'Ab', 'Ebm', 'Fm', 'Bbm', 'Cm']) expect(n.has(flat), flat).toBe(false);
  });

  it('Db major keeps its flats: Gb IV, Ab V, Ebm ii, Fm iii, Bbm vi, C° vii°', () => {
    select('Db', 'major');
    const { container } = render(<CircleOfFifths />);
    const n = names(container);
    expect(Object.fromEntries(['Db', 'Gb', 'Ab', 'Ebm', 'Fm', 'Bbm', 'C°'].map((k) => [k, n.get(k)]))).toEqual({
      Db: 'I', Gb: 'IV', Ab: 'V', Ebm: 'ii', Fm: 'iii', Bbm: 'vi', 'C°': 'vii°',
    });
  });

  it('every diatonic chord of every heptatonic scale on 17 roots is named as spelled', () => {
    const bad: string[] = [];
    for (const type of ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'] as ScaleType[]) {
      for (const root of ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']) {
        select(root, type);
        const { container } = render(<CircleOfFifths />);
        const shown = [...container.querySelectorAll('[data-numeral]')].map((x) => x.parentElement!.querySelector('[data-name]')!.textContent!.replace(/[m°+]$/, ''));
        // oracle: the scale degrees spelled from the root
        const or = ORACLE_SCALES[type];
        const want = or.degrees.map((d) => spellDegree(root, d)!);
        for (const name of shown) if (!want.includes(name)) bad.push(`${root} ${type}: chord segment "${name}" is not a scale degree as spelled (${want.join(' ')})`);
        cleanup();
      }
    }
    expect(bad).toEqual([]);
  });
});
