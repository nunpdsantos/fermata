/**
 * Circle of fifths, final review follow-ups:
 *  1. A segment showing a chord name (B♯°, C+) is still a KEY button: its
 *     accessible name contains the visible text plus the action — "B♯° (vii°)
 *     — select C minor" (WCAG 2.5.3 label in name), in EN/PT/ES.
 *  2. Clicks never land on awkward spellings: every segment of every scale
 *     type on every selectable root selects a key with at most 7 accidentals
 *     (C♯ major's "G♯ V" selects A♭ major, its "B♯°" C minor).
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
import i18n from '../../../i18n';
import { SELECTABLE_ROOTS, spellDegree, majorKeySignature } from '../../../core/utils/__tests__/theoryOracle';

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
const str = (n: Note) => `${n.natural}${n.accidental}`;
const select = (root: string, type: ScaleType) =>
  useAppStore.setState({ selectedKey: toNote(root), selectedScale: type, selectedChord: null, selectedDegree: null, exerciseInputActive: false });

/** The segment whose visible name is `name`. */
const segmentShowing = (c: HTMLElement, name: string) =>
  [...c.querySelectorAll('g[role="button"]')].find((g) => g.querySelector('[data-name]')!.textContent === name) as SVGGElement;

describe('1 — accessible name = visible text + action', () => {
  it('every segment, for a spread of keys and modes', () => {
    const bad: string[] = [];
    for (const [root, type] of [['C#', 'major'], ['F#', 'major'], ['A', 'harmonic_minor'], ['Eb', 'phrygian'], ['C', 'hungarian_minor'], ['G#', 'melodic_minor']] as [string, ScaleType][]) {
      select(root, type);
      const { container } = render(<CircleOfFifths />);
      for (const g of [...container.querySelectorAll('g[role="button"]')]) {
        const label = g.getAttribute('aria-label')!;
        const visible = g.querySelector('[data-name]')!.textContent!;
        const numeral = g.querySelector('[data-numeral]')?.textContent;
        const [key, ring] = g.getAttribute('data-key')!.split(' ');
        if (!label.includes(visible)) bad.push(`${root} ${type}: "${label}" lacks "${visible}"`);
        if (numeral && !label.includes(numeral)) bad.push(`${root} ${type}: "${label}" lacks numeral ${numeral}`);
        if (!label.endsWith(`select ${key} ${ring}`)) bad.push(`${root} ${type}: "${label}" lacks the action for ${key} ${ring}`);
      }
      cleanup();
    }
    expect(bad).toEqual([]);
  });

  it('C# major: "B#° (vii°) — select C minor"; A harmonic minor: "C+ (III+) — select C major"', () => {
    select('C#', 'major');
    let r = render(<CircleOfFifths />);
    expect(segmentShowing(r.container, 'B#°').getAttribute('aria-label')).toBe('B#° (vii°) — select C minor');
    cleanup();
    select('A', 'harmonic_minor');
    r = render(<CircleOfFifths />);
    expect(segmentShowing(r.container, 'C+').getAttribute('aria-label')).toBe('C+ (III+) — select C major');
  });

  it('in PT and ES', async () => {
    select('A', 'harmonic_minor');
    for (const [lang, want] of [['pt', 'C+ (III+) — escolher C maior'], ['es', 'C+ (III+) — elegir C mayor']] as const) {
      await i18n.changeLanguage(lang);
      const { container } = render(<CircleOfFifths />);
      expect(segmentShowing(container, 'C+').getAttribute('aria-label'), lang).toBe(want);
      cleanup();
    }
  });
});

describe('2 — every click lands on a key with at most 7 accidentals', () => {
  it('all 37 scale types x 17 selectable roots x 24 segments', () => {
    const bad: string[] = [];
    let segments = 0;
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      for (const root of SELECTABLE_ROOTS) {
        select(root, type);
        const { container } = render(<CircleOfFifths />);
        for (const g of [...container.querySelectorAll('g[role="button"]')]) {
          segments++;
          const [key, ring] = g.getAttribute('data-key')!.split(' ');
          const major = ring === 'major' ? key : spellDegree(key, 'b3')!;
          const count = majorKeySignature(major).count;
          if (count > 7) bad.push(`${root} ${type}: segment "${g.querySelector('[data-name]')!.textContent}" selects ${key} ${ring} (${count} accidentals)`);
        }
        cleanup();
      }
    }
    expect(segments).toBe(37 * 17 * 24);
    expect(bad).toEqual([]);
  }, 120_000);

  it('the reviewer\'s cases select the plain key when clicked', () => {
    const CASES: [string, string, string, string][] = [
      ['F#', 'C#', 'Db', 'major'],
      ['F#', 'E#°', 'F', 'natural_minor'],
      ['C#', 'G#', 'Ab', 'major'],
      ['C#', 'B#°', 'C', 'natural_minor'],
    ];
    for (const [root, shown, key, scale] of CASES) {
      select(root, 'major');
      const { container } = render(<CircleOfFifths />);
      fireEvent.click(segmentShowing(container, shown));
      const s = useAppStore.getState();
      expect(`${str(s.selectedKey)} ${s.selectedScale}`, `${root} major: ${shown}`).toBe(`${key} ${scale}`);
      cleanup();
    }
  });

  it('the selected key itself keeps its spelling (C# major stays C#)', () => {
    select('C#', 'major');
    const { container } = render(<CircleOfFifths />);
    fireEvent.click(segmentShowing(container, 'C#'));
    expect(str(useAppStore.getState().selectedKey)).toBe('C#');
  });
});
