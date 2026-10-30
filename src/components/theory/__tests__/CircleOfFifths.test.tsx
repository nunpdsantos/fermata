/**
 * Audit W2-01 / W2-02 / W2-03 / W2-06 (+ design-review: no focus/scroll on
 * mount) — the circle of fifths, rendered for every scale type x selectable
 * root and checked against the independent oracle.
 *
 *  - W2-01: the centre shows the key signature of the scale's SPELLED parent
 *    key (A dorian 1♯, C♯ major 7♯, A♭ minor 7♭) and none where no standard
 *    signature applies; the highlighted segment is that key.
 *  - W2-02: numerals are the scale's real stacked-thirds triads, each on the
 *    ring that matches its quality (major/augmented outer, minor/diminished
 *    inner), church modes flat-prefixed (D-13); none for other scales.
 *  - W2-03: mounting moves no focus (Explore used to open scrolled down).
 *  - W2-06: clicks go through the store actions (stale chips are reset).
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
import {
  ORACLE_SCALES,
  SELECTABLE_ROOTS,
  PARENT_RULE,
  spellDegree,
  majorKeySignature,
  stackedTriads,
  oracleNumeral,
  pcOf,
  mod12,
} from '../../../core/utils/__tests__/theoryOracle';

vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playChordVoiced: vi.fn(),
}));

import { CircleOfFifths } from '../CircleOfFifths';

afterEach(cleanup);

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const TYPES = Object.keys(SCALE_FORMULAS) as ScaleType[];
const MINOR_FAMILY = new Set(['natural_minor', 'harmonic_minor', 'melodic_minor', 'pentatonic_minor', 'blues']);
const CHURCH = new Set(['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian']);
const BEBOP_PARENT: Record<string, string> = { bebop_dominant: 'mixolydian', bebop_major: 'major', bebop_dorian: 'dorian' };

const select = (root: string, type: ScaleType, extra: Record<string, unknown> = {}) =>
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, selectedDegree: null, exerciseInputActive: false, ...extra });

const sigText = (count: number, type: string) => (count === 0 ? 'no ♯/♭' : `${count}${type === '#' ? '♯' : '♭'}`);

function readCircle(c: HTMLElement) {
  const text = (id: string) => c.querySelector(`[data-testid="${id}"]`)?.textContent ?? null;
  const segs = [...c.querySelectorAll('g[role="button"]')].map((g) => {
    const label = g.getAttribute('aria-label')!;
    const [name, ring] = label.split(' ');
    return { pc: pcOf(name), ring, pressed: g.getAttribute('aria-pressed') === 'true', numeral: g.querySelector('[data-numeral]')?.textContent ?? null };
  });
  return { key: text('cof-centre-key'), sig: text('cof-centre-sig'), segs };
}

describe('W2-01 — key signature from the spelled parent key', () => {
  it('every scale type x selectable root', () => {
    const bad: string[] = [];
    for (const type of TYPES) {
      for (const root of SELECTABLE_ROOTS) {
        select(root, type);
        const { container } = render(<CircleOfFifths />);
        const r = readCircle(container);
        const rule = PARENT_RULE[type];
        const pressed = r.segs.filter((s) => s.pressed);
        if (rule) {
          const parent = spellDegree(root, rule)!;
          const ks = majorKeySignature(parent);
          if (r.sig !== sigText(ks.count, ks.type)) bad.push(`${root} ${type}: sig "${r.sig}" want ${sigText(ks.count, ks.type)} (${parent} major)`);
          const want = MINOR_FAMILY.has(type) ? { ring: 'minor', pc: pcOf(root) } : { ring: 'major', pc: pcOf(parent) };
          if (pressed.length !== 1 || pressed[0].ring !== want.ring || pressed[0].pc !== want.pc) bad.push(`${root} ${type}: highlighted ${JSON.stringify(pressed)} want ${JSON.stringify(want)}`);
        } else {
          if (r.sig !== null) bad.push(`${root} ${type}: shows "${r.sig}" though no standard signature applies`);
          if (pressed.length !== 0) bad.push(`${root} ${type}: highlights a key`);
        }
        // the centre names the selected root as spelled
        if (!r.key?.startsWith(root)) bad.push(`${root} ${type}: centre "${r.key}"`);
        cleanup();
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);

  it('spot checks from the audit', () => {
    const sigOf = (root: string, type: ScaleType) => {
      select(root, type);
      const { container } = render(<CircleOfFifths />);
      const s = readCircle(container).sig;
      cleanup();
      return s;
    };
    expect(sigOf('A', 'dorian')).toBe('1♯');
    expect(sigOf('C#', 'major')).toBe('7♯');
    expect(sigOf('Ab', 'natural_minor')).toBe('7♭');
    expect(sigOf('A', 'pentatonic_minor')).toBe('no ♯/♭');
    expect(sigOf('C', 'hungarian_minor')).toBeNull();
  });
});

describe('W2-02 — numerals from the actual diatonic chords, on the matching ring', () => {
  it('every scale type x selectable root', () => {
    const bad: string[] = [];
    for (const type of TYPES) {
      const parentType = BEBOP_PARENT[type] ?? type;
      const or = ORACLE_SCALES[parentType];
      for (const root of SELECTABLE_ROOTS) {
        select(root, type);
        const { container } = render(<CircleOfFifths />);
        const shown = readCircle(container).segs.filter((s) => s.numeral !== null).map((s) => `${s.ring}:${s.pc}:${s.numeral}`).sort();
        const want: string[] = [];
        if (or && or.semis.length === 7 && !type.startsWith('diminished')) {
          stackedTriads(or.semis).forEach((q, i) => {
            if (!q) return;
            const alt = /^(b|#)?/.exec(or.degrees[i])![1];
            const prefix = CHURCH.has(parentType) && alt ? (alt === 'b' ? '♭' : '♯') : '';
            const ring = q === 'M' || q === 'A' ? 'major' : 'minor';
            want.push(`${ring}:${mod12(pcOf(root) + or.semis[i])}:${oracleNumeral(i, q, prefix)}`);
          });
        }
        want.sort();
        if (shown.join() !== want.join()) bad.push(`${root} ${type}: shows [${shown.join(' ')}] want [${want.join(' ')}]`);
        cleanup();
      }
    }
    expect(bad).toEqual([]);
  }, 60_000);

  it('A dorian: i ii ♭III IV v vi° ♭VII', () => {
    select('A', 'dorian');
    const { container } = render(<CircleOfFifths />);
    const n = readCircle(container).segs.filter((s) => s.numeral).map((s) => s.numeral).sort();
    expect(n).toEqual(['IV', 'i', 'ii', 'v', 'vi°', '♭III', '♭VII'].sort());
  });
});

describe('W2-03 — no focus steal on mount; keyboard navigation still works', () => {
  beforeEach(() => select('A', 'natural_minor'));

  it('mounting does not move focus', () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus').mockImplementation(() => {});
    const svgFocus = vi.spyOn(SVGElement.prototype, 'focus').mockImplementation(() => {});
    render(<CircleOfFifths />);
    expect(document.activeElement).toBe(document.body);
    expect(focusSpy).not.toHaveBeenCalled();
    expect(svgFocus).not.toHaveBeenCalled();
    focusSpy.mockRestore();
    svgFocus.mockRestore();
  });

  it('the tab stop is the selected key, and arrow keys move focus once the user is in the circle', () => {
    const { container } = render(<CircleOfFifths />);
    const tabStop = container.querySelector('g[tabindex="0"]')!;
    expect(tabStop.getAttribute('aria-label')).toBe('A minor');
    act(() => (tabStop as SVGGElement).focus());
    fireEvent.keyDown(tabStop, { key: 'ArrowRight' });
    expect(document.activeElement?.getAttribute('aria-label')).toBe('E minor');
  });
});

describe('W2-06 — circle clicks go through the store actions', () => {
  it('choosing a key applies exactly what setKey + setScale do', () => {
    // The store's own rules apply (since W3/D-02 the guitar position persists
    // across key changes; the comparison scale and chord are cleared). The
    // circle used to write state directly and skip them.
    const before = { comparisonScale: 'dorian' as const, guitarScalePosition: 3 as const, selectedChord: null };
    select('C', 'lydian', before);
    useAppStore.getState().setKey(toNote('Db'));
    useAppStore.getState().setScale('major');
    const viaActions = useAppStore.getState();
    select('C', 'lydian', before);
    const { container } = render(<CircleOfFifths />);
    fireEvent.click(container.querySelector('g[aria-label="Db major"]')!);
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual(toNote('Db'));
    expect(s.selectedScale).toBe('major');
    expect(s.guitarScalePosition).toEqual(viaActions.guitarScalePosition);
    expect(s.comparisonScale).toBeNull();
    expect(s.selectedChord).toBeNull();
  });

  it('a minor variant button resets the comparison too', () => {
    select('A', 'natural_minor', { comparisonScale: 'dorian' });
    const { getByText } = render(<CircleOfFifths />);
    fireEvent.click(getByText('Harmonic'));
    expect(useAppStore.getState().selectedScale).toBe('harmonic_minor');
    expect(useAppStore.getState().comparisonScale).toBeNull();
  });
});
