/**
 * Audit W1-09 (+ W2-06's key-picker part, review items 3/4/5) — the key picker
 * offers each black key under the name with the smaller key signature for the
 * selected scale (D♭ major, C♯ minor, G♯ minor/melodic minor; for scales with
 * no standard signature, the smaller MAJOR signature: E♭ blues-less scales,
 * A♭ bebop…), always highlights the selected root whatever its spelling, lets
 * the learner switch to the other name, and never respells on re-click.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { KeySelector } from '../KeySelector';
import { useAppStore } from '../../../state/store';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
import { spellDegree, pcOf, majorKeySignature, PARENT_RULE, ORACLE_SCALES, accMarks } from '../../../core/utils/__tests__/theoryOracle';
import { buildScale } from '../../../core/constants/scales';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const proxy = new Proxy({}, { get: (_t: unknown, tag: string) => (p: Record<string, unknown>) => React.createElement(tag, p) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

afterEach(cleanup);

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const str = (n: Note) => `${n.natural}${n.accidental}`;
const select = (root: string, type: ScaleType) =>
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, selectedDegree: null });
const rootButtons = (c: HTMLElement) => [...c.querySelectorAll('[data-root]')] as HTMLElement[];

/**
 * Oracle cost of a root spelling (review rule, 2026-10-30), compared element
 * by element: scales with a standard signature → that signature's size;
 * scales without one → [double accidentals in the spelled scale, the root's
 * major-signature size, accidental marks]. Scales are spelled by the oracle's
 * own formulas; the symmetric ones are left to the doubles budget below.
 */
function cost(root: string, type: ScaleType): number[] | null {
  const rule = PARENT_RULE[type];
  if (rule) return [majorKeySignature(spellDegree(root, rule)!).count];
  const or = ORACLE_SCALES[type];
  if (!or) return null;
  const notes = or.degrees.map((d) => spellDegree(root, d) ?? 'X###');
  const doubles = notes.filter((n) => n.length >= 3).length;
  return [doubles, majorKeySignature(root).count, notes.reduce((sum, n) => sum + accMarks(n), 0)];
}
const costlier = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i];
  return false;
};

describe('W1-09 — root spelling chosen by mode', () => {
  it('major offers Db, Eb, F#, Ab, Bb; natural minor offers C#, Eb, F#, G#, Bb', () => {
    select('C', 'major');
    const { container, unmount } = render(<KeySelector />);
    expect(rootButtons(container).map((b) => b.textContent)).toEqual(['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']);
    unmount();
    select('A', 'natural_minor');
    const r2 = render(<KeySelector />);
    expect(rootButtons(r2.container).map((b) => b.textContent)).toEqual(['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B']);
  });

  it('for every scale type, each offered black-key name is no costlier than its twin', () => {
    const TWIN: Record<string, string> = { 'C#': 'Db', Db: 'C#', 'D#': 'Eb', Eb: 'D#', 'F#': 'Gb', Gb: 'F#', 'G#': 'Ab', Ab: 'G#', 'A#': 'Bb', Bb: 'A#' };
    const bad: string[] = [];
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      select('C', type);
      const { container } = render(<KeySelector />);
      for (const label of rootButtons(container).map((b) => b.textContent!)) {
        const twin = TWIN[label];
        if (!twin) continue;
        const [a, b] = [cost(label, type), cost(twin, type)];
        if (a && b && costlier(a, b)) bad.push(`${type}: offers ${label} [${a}] over ${twin} [${b}]`);
      }
      cleanup();
    }
    expect(bad).toEqual([]);
  });

  it('clicking the black key in major selects D-flat major', () => {
    select('C', 'major');
    render(<KeySelector />);
    fireEvent.click(screen.getByText('Db'));
    expect(str(useAppStore.getState().selectedKey)).toBe('Db');
  });

  it('the selected root is highlighted under its own spelling (Gb, C#, D# from anywhere)', () => {
    for (const root of ['Gb', 'Db', 'C#', 'D#']) {
      select(root, 'major');
      const { container } = render(<KeySelector />);
      const pressed = rootButtons(container).filter((b) => b.getAttribute('aria-pressed') === 'true');
      expect(pressed.map((b) => b.textContent), root).toEqual([root]);
      expect(pcOf(pressed[0].getAttribute('data-root')!)).toBe(pcOf(root));
      cleanup();
    }
  });

  it('offers the other name of a black-key root, and switches to it', () => {
    select('C#', 'major');
    render(<KeySelector />);
    fireEvent.click(screen.getByRole('button', { name: 'Respell as Db' }));
    expect(str(useAppStore.getState().selectedKey)).toBe('Db');
    cleanup();
    select('G', 'major');
    render(<KeySelector />);
    expect(screen.queryByRole('button', { name: /Respell as/ })).toBeNull();
  });

  it('changing the scale respells the root only when the other name is simpler', () => {
    select('Db', 'major');
    render(<KeySelector />);
    fireEvent.click(screen.getByText('Minor'));
    expect(str(useAppStore.getState().selectedKey)).toBe('C#'); // Db minor would need Fb and Bbb
    fireEvent.click(screen.getByText('Dorian'));
    expect(str(useAppStore.getState().selectedKey)).toBe('C#'); // C# dorian (5) beats Db dorian (7)
  });

  it('G# minor switched to melodic minor stays G# (5♯ beats A♭ melodic minor 7♭)', () => {
    select('G#', 'natural_minor');
    render(<KeySelector />);
    fireEvent.click(screen.getByText('Mel. Minor'));
    expect(useAppStore.getState().selectedScale).toBe('melodic_minor');
    expect(str(useAppStore.getState().selectedKey)).toBe('G#');
  });

  it('scales without a signature take the smaller MAJOR signature (E♭ over D♯, A♭ over G♯)', () => {
    select('C', 'whole_tone');
    const { container } = render(<KeySelector />);
    expect(rootButtons(container).map((b) => b.textContent)).toEqual(['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']);
  });

  it('re-clicking the active scale never respells the root', () => {
    select('C#', 'major');
    render(<KeySelector />);
    fireEvent.click(screen.getByText('Major'));
    expect(str(useAppStore.getState().selectedKey)).toBe('C#');
  });

  it('the root label row has a fixed height whether or not the respell button shows', () => {
    for (const root of ['C', 'C#']) {
      select(root, 'major');
      const { getByTestId } = render(<KeySelector />);
      expect(getByTestId('root-label-row').className, root).toContain('h-[22px]');
      cleanup();
    }
  });

  it('double accidentals across every offered black-key root x all 37 scale types stay within budget (≤ 9)', () => {
    let doubles = 0;
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      select('C', type);
      const { container } = render(<KeySelector />);
      for (const label of rootButtons(container).map((b) => b.textContent!).filter((l) => l.length === 2)) {
        doubles += buildScale(toNote(label), type).notes.filter((n) => n.accidental.length === 2).length;
      }
      cleanup();
    }
    expect(doubles).toBeLessThanOrEqual(9);
  });

  it('C# altered is offered (not Db altered with four double flats)', () => {
    select('C', 'altered');
    const { container } = render(<KeySelector />);
    expect(rootButtons(container)[1].textContent).toBe('C#');
  });

  it('Eb blues is offered (not D#), spelled Eb Gb Ab A Bb Db with no double flat', () => {
    select('C', 'blues');
    const { container } = render(<KeySelector />);
    expect(rootButtons(container)[3].textContent).toBe('Eb');
    expect(buildScale(toNote('Eb'), 'blues').notes.map(str).join(' ')).toBe('Eb Gb Ab A Bb Db');
  });

  it('the respell label exists in EN, PT and ES', () => {
    expect(en.keySelector.respellAs).toContain('{{note}}');
    expect(pt.keySelector.respellAs).toContain('{{note}}');
    expect(es.keySelector.respellAs).toContain('{{note}}');
  });
});
