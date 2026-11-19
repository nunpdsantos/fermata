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
import { render, cleanup, fireEvent, screen, act } from '@testing-library/react';
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

// Fix pass (independent review, item 7): the sweep above read the destination
// from the wedge's own data-key, the same source as its name. Here the name is
// read as a learner hears it ("… — select F minor"), the wedge is ACTIVATED —
// clicked, and with Enter from the keyboard — and the store must then hold
// exactly that key; focused in PT and ES, the caption says where it leads.
describe('A8: a wedge selects exactly the key its name says (click and keyboard)', () => {
  const ACTION = { en: { select: 'select', major: 'major', minor: 'minor', opens: 'Opens' }, pt: { select: 'escolher', major: 'maior', minor: 'menor', opens: 'Abre' }, es: { select: 'elegir', major: 'mayor', minor: 'menor', opens: 'Abre' } } as const;
  const ASCII: Record<string, string> = { '♯': '#', '♭': 'b', '𝄪': '##', '𝄫': 'bb' };
  /** The key a name says the wedge selects: "… — select F♯ minor" → F#, natural_minor. */
  function said(label: string, lang: keyof typeof ACTION) {
    const a = ACTION[lang];
    const m = label.match(new RegExp(`— ${a.select} ([A-G])([♯♭𝄪𝄫]?) (${a.major}|${a.minor})$`));
    if (!m) return null;
    return { note: `${m[1]}${ASCII[m[2]] ?? ''}`, scale: m[3] === a.major ? 'major' : 'natural_minor' };
  }
  const state = () => { const s = useAppStore.getState(); return { note: `${s.selectedKey.natural}${s.selectedKey.accidental}`, scale: s.selectedScale }; };

  async function sweep(lang: keyof typeof ACTION, types: string[], how: 'click' | 'enter') {
    await i18n.changeLanguage(lang);
    const bad: string[] = [];
    let activations = 0;
    for (const type of types) {
      for (let pc = 0; pc < 12; pc++) {
        const root = preferredRootSpelling(pc, type as ScaleType);
        act(() => select(root, type as ScaleType));
        const { container } = render(<CircleOfFifths />);
        for (let i = 0; i < 24; i++) {
          act(() => select(root, type as ScaleType));
          const g = container.querySelectorAll('g[role="button"]')[i];
          const label = g.getAttribute('aria-label')!;
          const want = said(label, lang);
          if (!want) { bad.push(`${root.natural}${root.accidental} ${type}: "${label}" names no key`); continue; }
          if (how === 'click') fireEvent.click(g);
          else { fireEvent.focus(g); fireEvent.keyDown(g, { key: 'Enter' }); }
          activations++;
          const got = state();
          if (got.note !== want.note || got.scale !== want.scale) bad.push(`${root.natural}${root.accidental} ${type}: "${label}" selected ${got.note} ${got.scale}`);
        }
        cleanup();
      }
    }
    return { bad, activations };
  }

  it('EN, click: every wedge of every key of every picker scale', async () => {
    const types = SCALE_GROUPS.flatMap((g) => g.options);
    const { bad, activations } = await sweep('en', types, 'click');
    expect(activations).toBe(37 * 12 * 24);
    expect(bad.slice(0, 10), `${bad.length} wedges`).toEqual([]);
  }, 300_000);

  it('EN, Enter from the keyboard: every wedge of every major and minor key, and of the modes', async () => {
    const { bad, activations } = await sweep('en', ['major', 'natural_minor', 'dorian', 'lydian', 'harmonic_minor'], 'enter');
    expect(activations).toBe(5 * 12 * 24);
    expect(bad.slice(0, 10), `${bad.length} wedges`).toEqual([]);
  }, 300_000);

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}, click and focus: every wedge of every major and minor key; focused, a chord wedge says where it leads`, async () => {
      const { bad, activations } = await sweep(lang, ['major', 'natural_minor'], 'click');
      expect(activations).toBe(2 * 12 * 24);
      expect(bad.slice(0, 10), `${bad.length} wedges`).toEqual([]);
      // F♯ major's E♯° (vii°): focused, "Abre F menor".
      select({ natural: 'F', accidental: '#' }, 'major');
      const { container } = render(<CircleOfFifths />);
      const g = [...container.querySelectorAll('g[role="button"]')].find((x) => x.querySelector('[data-name]')!.textContent === 'E♯°')!;
      fireEvent.focus(g);
      expect(container.querySelector('.cof-caption')!.textContent).toContain(`${ACTION[lang].opens} F ${ACTION[lang].minor}`);
      fireEvent.keyDown(g, { key: 'Enter' });
      expect(state()).toEqual({ note: 'F', scale: 'natural_minor' });
    }, 300_000);
  }
});

