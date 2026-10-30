/**
 * Audit W1-09 (+ W2-06's key-picker part) — the key picker offers each black
 * key under the name that spells the selected scale with fewer accidentals
 * (D♭ major, C♯ minor, G♯ minor), always highlights the selected root whatever
 * its spelling, and lets the learner switch to the other name.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { KeySelector } from '../KeySelector';
import { useAppStore } from '../../../state/store';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
import { SCALE_DEGREE_FORMULAS } from '../../../core/utils/degreeSpelling';
import { spellDegree, accMarks, pcOf, ORACLE_SYMMETRIC } from '../../../core/utils/__tests__/theoryOracle';
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
 * Oracle: accidental marks of a scale on a root — its degree formula, or for
 * the symmetric scales the cheapest combination of their conventional names.
 */
function marks(root: string, type: ScaleType): number {
  const mark = (d: string) => {
    const n = spellDegree(root, d);
    return n === null ? 3 : accMarks(n);
  };
  const sym = ORACLE_SYMMETRIC[type];
  if (sym) return sym.options.reduce((sum, names) => sum + Math.min(...names.map(mark)), 0);
  return SCALE_DEGREE_FORMULAS[type].reduce((sum, d) => sum + mark(d), 0);
}

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

  it('for every scale type, each offered black-key name needs no more accidentals than its twin', () => {
    const TWIN: Record<string, string> = { 'C#': 'Db', Db: 'C#', 'D#': 'Eb', Eb: 'D#', 'F#': 'Gb', Gb: 'F#', 'G#': 'Ab', Ab: 'G#', 'A#': 'Bb', Bb: 'A#' };
    const bad: string[] = [];
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      select('C', type);
      const { container } = render(<KeySelector />);
      for (const label of rootButtons(container).map((b) => b.textContent!)) {
        const twin = TWIN[label];
        if (twin && marks(label, type) > marks(twin, type)) bad.push(`${type}: offers ${label} (${marks(label, type)}) over ${twin} (${marks(twin, type)})`);
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

  it('the respell label exists in EN, PT and ES', () => {
    expect(en.keySelector.respellAs).toContain('{{note}}');
    expect(pt.keySelector.respellAs).toContain('{{note}}');
    expect(es.keySelector.respellAs).toContain('{{note}}');
  });
});
