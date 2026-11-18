/**
 * Audit 2026-11-18, A8: in F♯ major the inner wedge labelled "E♯° (vii°)"
 * selects F natural minor: the label names a chord's function, the tap
 * chooses a key. Both are said, separately, and the destination is clear
 * BEFORE the tap: in the wedge's accessible name (the chord, its numeral in
 * the current key, then the key it selects, spelled with ♯ / ♭), and visibly
 * — while the wedge is hovered, focused or pressed, the caption under the
 * circle says "Opens F minor". For every wedge whose label and destination
 * differ, in every key of every scale the picker offers, EN / PT / ES. The
 * circle's recorded rules (horizontal labels, the 36 px targets) are untouched.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent, screen } from '@testing-library/react';
import type { Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import i18n from '../../../i18n';
import { SCALE_GROUPS } from '../../navigation/keyChoice';
import { preferredRootSpelling } from '../../../core/utils/degreeSpelling';
import { withGlyphs } from '../../../core/utils/accidentalGlyphs';

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

const select = (root: Note, type: ScaleType) =>
  useAppStore.setState({ selectedKey: root, selectedScale: type, selectedChord: null, selectedDegree: null, exerciseInputActive: false });

const WORDS = {
  en: { major: 'major', minor: 'minor', in: ' in ', select: 'select', opens: 'Opens' },
  pt: { major: 'maior', minor: 'menor', in: ' em ', select: 'escolher', opens: 'Abre' },
  es: { major: 'mayor', minor: 'menor', in: ' en ', select: 'elegir', opens: 'Abre' },
} as const;

/** The key a wedge selects, as its own data says ("F minor"), in the learner's words. */
function destination(g: Element, lang: keyof typeof WORDS): string {
  const [note, ring] = g.getAttribute('data-key')!.split(' ');
  return `${withGlyphs(note)} ${WORDS[lang][ring as 'major' | 'minor']}`;
}
/** The key's own short name ("Fm", "D♭"), to tell whether the wedge's label is that key. */
function shortName(g: Element): string {
  const [note, ring] = g.getAttribute('data-key')!.split(' ');
  return `${withGlyphs(note)}${ring === 'minor' ? 'm' : ''}`;
}
const caption = (c: HTMLElement) => c.querySelector('.cof-caption')!.textContent ?? '';

describe('A8: the audit\'s wedge, F♯ major', () => {
  it('"E♯° (vii°)": the chord in F♯ major, then the key it selects; hovered, focused or pressed, the caption says so', () => {
    select({ natural: 'F', accidental: '#' }, 'major');
    const { container } = render(<CircleOfFifths />);
    const g = [...container.querySelectorAll('g[role="button"]')].find((x) => x.querySelector('[data-name]')!.textContent === 'E♯°')!;
    expect(g.getAttribute('aria-label')).toBe('E♯° (vii°) in F♯ Major — select F minor');
    expect(caption(container)).not.toContain('Opens');
    fireEvent.mouseEnter(g);
    expect(caption(container)).toContain('Opens F minor');
    fireEvent.mouseLeave(g);
    expect(caption(container)).not.toContain('Opens');
    fireEvent.focus(g);
    expect(caption(container)).toContain('Opens F minor');
    fireEvent.blur(g);
    // A finger on the wedge, before it lifts: the destination shows while it is pressed.
    fireEvent.pointerDown(g, { pointerType: 'touch' });
    expect(caption(container)).toContain('Opens F minor');
    expect(screen.getByTestId('cof-hover-name').textContent).toBe('Fm');
    // The same wedge, its own key: no "Opens" line where the label is the key.
    const am = [...container.querySelectorAll('g[role="button"]')].find((x) => x.querySelector('[data-name]')!.textContent === 'D♯m')!;
    fireEvent.pointerCancel(g);
    fireEvent.mouseEnter(am);
    expect(caption(container)).not.toContain('Opens');
  });
});

describe('A8: every wedge whose label and destination differ, every key of every picker scale', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(lang, async () => {
      await i18n.changeLanguage(lang);
      const w = WORDS[lang];
      const types = SCALE_GROUPS.flatMap((g) => g.options);
      expect(types).toHaveLength(37);
      const bad: string[] = [];
      let differing = 0;
      for (const type of types) {
        for (let pc = 0; pc < 12; pc++) {
          const root = preferredRootSpelling(pc, type);
          select(root, type);
          const { container } = render(<CircleOfFifths />);
          for (const g of [...container.querySelectorAll('g[role="button"]')]) {
            const label = g.getAttribute('aria-label')!;
            const visible = g.querySelector('[data-name]')!.textContent!;
            const numeral = g.querySelector('[data-numeral]')?.textContent;
            const dest = destination(g, lang);
            const where = `${root.natural}${root.accidental} ${type} "${visible}"`;
            // Always: the visible text and the action, the key spelled with ♯ / ♭.
            if (!label.includes(visible)) bad.push(`${where}: "${label}" lacks its visible name`);
            if (!label.endsWith(`${w.select} ${dest}`)) bad.push(`${where}: "${label}" does not end "${w.select} ${dest}"`);
            if (numeral && !(label.includes(`(${numeral})${w.in}`))) bad.push(`${where}: "${label}" does not name its numeral's key`);
            if (visible === shortName(g)) continue;
            differing++;
            fireEvent.mouseEnter(g);
            if (!caption(container).includes(`${w.opens} ${dest}`)) bad.push(`${where}: hovered, the caption reads "${caption(container)}"`);
            fireEvent.mouseLeave(g);
          }
          cleanup();
        }
      }
      expect(differing).toBeGreaterThan(100);
      expect(bad.slice(0, 12), `${bad.length} wedges`).toEqual([]);
    }, 120_000);
  }
});
