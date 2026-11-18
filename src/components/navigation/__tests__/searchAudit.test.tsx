/**
 * The audit of 18 November 2026, stream B (search and sharing): what a
 * learner meets in Quick Search.
 *
 *  A2  an explicit key search applies its root AND its scale together, from
 *      minor, major and other modes; "key of G" with no quality is G major
 *      (as the lessons use it).
 *  A3  a solfège syllable is read whole before the chord symbol: Do7 / C7,
 *      Sol7 / G7, Ré7 / D7 are the same chord in every language. "Do7" is also
 *      D°7 in letters: both are offered, the solfège reading first in PT and
 *      ES (and with Dó-Ré-Mi on), the letter reading first otherwise.
 *  A4  choosing a chord (or a scale, a key) from anywhere opens Explore with
 *      it, the way the Explore tab leaves Learn or Drill.
 *  A13 each result is named as Explore names it, in the learner's language.
 *  A14 the list is a combobox / listbox: the selected result is the input's
 *      aria-activedescendant.
 *  Q14 the dialog shows the app's own magnifier, not an emoji.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import i18n from '../../../i18n';
import { QuickSearch } from '../QuickSearch';
import { getResults, type SearchResult } from '../quickSearchResults';
import { useAppStore } from '../../../state/store';
import { noteToString, type ScaleType } from '../../../core/types/music';
import { showLessonQuery, returnLessonInstrument } from '../../../services/lessonInstrument';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  // One component per tag: a new one per read would remount the dialog on every render.
  const cache = new Map<string, ReturnType<typeof make>>();
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => cache.get(prop) ?? cache.set(prop, make(prop)).get(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});

type Lang = 'en' | 'pt' | 'es';

async function speak(lang: Lang, showSolfege = false) {
  useAppStore.setState({ language: lang, showSolfege });
  await act(async () => { await i18n.changeLanguage(lang); });
}

function at(view: 'explore' | 'learn' | 'drill', key = 'C', scale: ScaleType = 'major') {
  useAppStore.setState({
    view,
    lastView: view,
    selectedKey: { natural: key[0], accidental: key.slice(1) } as never,
    selectedScale: scale,
    selectedChord: null,
    chordInversion: 0,
    lessonLoan: null,
    quickSearchOpen: true,
  });
}

/** What choosing a result does: the view, and the chord or the key + scale it leaves. */
function choose(r: SearchResult | undefined): string {
  if (!r) return 'no result';
  r.action();
  const s = useAppStore.getState();
  const chord = s.selectedChord;
  return chord
    ? `${s.view} ${noteToString(chord.root)}${chord.quality}${chord.bassNote ? `/${noteToString(chord.bassNote)}` : ''}`
    : `${s.view} ${noteToString(s.selectedKey)} ${s.selectedScale}`;
}

/** Every chord result of a query, as `Root+quality[/bass]`, in order (each chosen from Explore on C major). */
function chords(q: string): string[] {
  const out: string[] = [];
  for (const r of getResults(q).filter((x) => x.type === 'Chord')) {
    at('explore');
    out.push(choose(r).replace(/^explore /, ''));
  }
  return out;
}

const firstOf = (q: string, type: SearchResult['type']) => getResults(q).find((r) => r.type === type);

beforeEach(async () => {
  at('explore');
  await speak('en');
});

afterEach(async () => {
  cleanup();
  returnLessonInstrument();
  await speak('en');
});

// ─── A2 ──────────────────────────────────────────────────────────────────────
describe('A2 — a key search applies its root and its scale together', () => {
  const STARTS: ScaleType[] = ['natural_minor', 'major', 'dorian', 'harmonic_minor', 'lydian', 'mixolydian'];

  it.each(STARTS)('from %s: "key of G major" opens G major, "key of A minor" A natural minor, "key of G" G major', (start) => {
    at('explore', 'A', start);
    expect(choose(firstOf('key of G major', 'Key'))).toBe('explore G major');
    at('explore', 'C', start);
    expect(choose(firstOf('key of A minor', 'Key'))).toBe('explore A natural_minor');
    at('explore', 'A', start);
    expect(choose(firstOf('key of G', 'Key'))).toBe('explore G major');
    at('explore', 'C', start);
    expect(choose(firstOf('key of Eb', 'Key'))).toBe('explore Eb major');
  });

  it('the audit\'s path: A minor chosen, then "key of G major" — G major, not G natural minor', () => {
    at('explore', 'C', 'major');
    expect(choose(firstOf('key of A minor', 'Key'))).toBe('explore A natural_minor');
    expect(choose(firstOf('key of G major', 'Key'))).toBe('explore G major');
  });

  it.each([
    ['pt', 'tonalidade de Sol maior', 'G major'],
    ['pt', 'tom de Sol', 'G major'],
    ['pt', 'tonalidade de Ré menor', 'D natural_minor'],
    ['es', 'tonalidad de Sol mayor', 'G major'],
    ['es', 'tonalidad de La menor', 'A natural_minor'],
  ] as const)('%s "%s" → %s, from D dorian', async (lang, q, expected) => {
    await speak(lang);
    at('explore', 'D', 'dorian');
    expect(choose(firstOf(q, 'Key'))).toBe(`explore ${expected}`);
  });
});

// ─── A3 ──────────────────────────────────────────────────────────────────────
describe('A3 — the whole solfège syllable is read before the chord symbol', () => {
  const PAIRS = [
    ['Do7', 'C7', 'Cdominant7'],
    ['Sol7', 'G7', 'Gdominant7'],
    ['Ré7', 'D7', 'Ddominant7'],
  ] as const;

  for (const lang of ['en', 'pt', 'es'] as const) {
    it.each(PAIRS)(`${lang}: %s and %s name the same chord`, async (solfege, letters, chord) => {
      await speak(lang);
      expect(chords(letters)[0]).toBe(chord);
      expect(chords(solfege)).toContain(chord);
    });
  }

  it.each(['pt', 'es'] as const)('%s: "Do7" offers C7 first, then D°7 (the letter reading is not lost)', async (lang) => {
    await speak(lang);
    const found = chords('Do7');
    expect(found.slice(0, 2)).toEqual(['Cdominant7', 'Ddiminished7']);
  });

  it('en: "Do7" offers D°7 first (as before), then C7', async () => {
    const found = chords('Do7');
    expect(found[0]).toBe('Ddiminished7');
    expect(found[1]).toBe('Cdominant7');
  });

  it('en with Dó-Ré-Mi switched on: the solfège reading comes first', async () => {
    await speak('en', true);
    expect(chords('Do7').slice(0, 2)).toEqual(['Cdominant7', 'Ddiminished7']);
  });

  it('Sol7, Ré7 have no letter reading: their only chord is G7, D7 — the first result in every language', async () => {
    for (const lang of ['en', 'pt', 'es'] as const) {
      await speak(lang);
      expect(chords('Sol7')[0], lang).toBe('Gdominant7');
      expect(chords('Ré7')[0], lang).toBe('Ddominant7');
    }
  });

  it.each([
    ['dó7', 'Cdominant7'], ['DO7', 'Cdominant7'], ['Dó7', 'Cdominant7'], ['do7', 'Cdominant7'],
    ['re7', 'Ddominant7'], ['RÉ7', 'Ddominant7'], ['Re7', 'Ddominant7'],
    ['mi7', 'Edominant7'], ['Mi7', 'Edominant7'],
    ['Fa7', 'Fdominant7'], ['Fá7', 'Fdominant7'],
    ['sol7', 'Gdominant7'], ['SOL7', 'Gdominant7'],
    ['La7', 'Adominant7'], ['Lá7', 'Adominant7'],
    ['Si7', 'Bdominant7'],
    ['Fá#m7', 'F#minor7'], ['Fa#m7', 'F#minor7'], ['Fá♯m7', 'F#minor7'],
    ['Sib7', 'Bbdominant7'], ['Si♭7', 'Bbdominant7'], ['Mibmaj7', 'Ebmajor7'], ['Mi♭maj7', 'Ebmajor7'],
    ['Lam', 'Aminor'], ['Lám7', 'Aminor7'], ['Solmaj7', 'Gmajor7'], ['Dom', 'Cminor'], ['Dosus4', 'Csus4'],
    ['Do/Mi', 'Cmajor/E'], ['Sol7/Si', 'Gdominant7/B'], ['Ré/Fá#', 'Dmajor/F#'],
    ['Sol°', 'Gdiminished'], ['Si°7', 'Bdiminished7'],
  ])('ES: "%s" → %s first', async (q, expected) => {
    await speak('es');
    expect(chords(q)[0]).toBe(expected);
  });

  it('never loses a query that works today (letters, bare syllables, words)', async () => {
    for (const lang of ['en', 'pt', 'es'] as const) {
      await speak(lang);
      expect(chords('C7')[0], lang).toBe('Cdominant7');
      expect(chords('Dm7')[0], lang).toBe('Dminor7');
      expect(chords('Faug')[0], lang).toBe('Faugmented');
      expect(chords('Fadd9')[0], lang).toBe('Fadd9');
      expect(chords('Sol')[0], lang).toBe('Gmajor');
      expect(chords('Sib')[0], lang).toBe('Bbmajor');
      expect(chords('Do7'), lang).toContain('Ddiminished7');
      expect(chords('Dom7'), lang).toContain('Cminor7');
    }
  });

  // Words that begin like a syllable keep exactly the chord results they had
  // at 6de6c0e (none of these gains a solfège chord: "Solo" is not G°).
  it.each([
    'Solo', 'Lamb', 'Mix', 'Fade', 'Rest', 'Simple', 'Solid', 'Domain', 'Minor', 'Sixth', 'Repeat', 'Lament', 'Dorian',
  ])('prose "%s" is not read as a solfège chord', (q) => {
    expect(chords(q)).toEqual(PROSE_AT_BASE[q]);
  });
});

/** chords(q) for these words at 6de6c0e (recorded once by running this file at the base commit). */
const PROSE_AT_BASE: Record<string, string[]> = Object.fromEntries(
  ['Solo', 'Lamb', 'Mix', 'Fade', 'Rest', 'Simple', 'Solid', 'Domain', 'Minor', 'Sixth', 'Repeat', 'Lament', 'Dorian'].map((q) => [q, []]),
);

// ─── A4 ──────────────────────────────────────────────────────────────────────
describe('A4 — choosing a chord, scale or key from search opens Explore with it', () => {
  it.each(['drill', 'learn'] as const)('from %s: "Dm7" → Explore with D minor 7 selected', (view) => {
    at(view);
    expect(choose(firstOf('Dm7', 'Chord'))).toBe('explore Dminor7');
  });

  it.each(['drill', 'learn'] as const)('from %s: a scale and a key open Explore on them', (view) => {
    at(view);
    expect(choose(firstOf('D dorian', 'Scale'))).toBe('explore D dorian');
    at(view);
    expect(choose(firstOf('key of F', 'Key'))).toBe('explore F major');
  });

  it('from a lesson that borrowed the instrument: Explore gets its own key back, then the chord', () => {
    at('explore', 'E', 'natural_minor');
    useAppStore.getState().setView('learn');
    expect(showLessonQuery('C major scale')).toBe(true);
    expect(noteToString(useAppStore.getState().selectedKey)).toBe('C');
    expect(choose(firstOf('Dm7', 'Chord'))).toBe('explore Dminor7');
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'E', accidental: '' });
    expect(useAppStore.getState().selectedScale).toBe('natural_minor');
  });

  it('a scale with no root ("blues scale") lands on Explore\'s own key, not the lesson\'s', () => {
    at('explore', 'E', 'major');
    useAppStore.getState().setView('learn');
    showLessonQuery('C major scale');
    expect(choose(firstOf('blues scale', 'Scale'))).toBe('explore E blues');
  });

  it('in Explore it selects the chord in place (the view is not reset)', () => {
    at('explore');
    useAppStore.setState({ detailPanelOpen: true });
    expect(choose(firstOf('Dm7', 'Chord'))).toBe('explore Dminor7');
    expect(useAppStore.getState().detailPanelOpen).toBe(true);
  });
});

// ─── A13 ─────────────────────────────────────────────────────────────────────
describe('A13 — results are named in the learner\'s language, as Explore names them', () => {
  const labelOf = (q: string, type: SearchResult['type']) => firstOf(q, type)?.label;

  it('English: the chord as Explore\'s chord heading names it ("D Minor 7th")', () => {
    expect(labelOf('Dm7', 'Chord')).toBe('D Minor 7th');
    expect(labelOf('Cmaj7/G', 'Chord')).toBe('C Major 7th/G');
    expect(labelOf('D dorian', 'Scale')).toBe('D Dorian');
    expect(labelOf('key of A minor', 'Key')).toBe('A Natural Minor');
  });

  it('Portuguese: «escala de Ré maior» is "D maior"; with Dó-Ré-Mi on, "D (Ré) maior"', async () => {
    await speak('pt');
    expect(labelOf('escala de Ré maior', 'Scale')).toBe('D maior');
    expect(labelOf('Dm7', 'Chord')).toBe('D Menor com 7.ª');
    expect(labelOf('tonalidade de Sol', 'Key')).toBe('G maior');
    await speak('pt', true);
    expect(labelOf('escala de Ré maior', 'Scale')).toBe('D (Ré) maior');
    expect(labelOf('tonalidade de Sol', 'Key')).toBe('G (Sol) maior');
    // Chord names stay letters with Dó-Ré-Mi on, as Explore's chord heading does.
    expect(labelOf('Dm7', 'Chord')).toBe('D Menor com 7.ª');
  });

  it('Spanish: "Do7" → "C Séptima de dominante", then "D Séptima disminuida"', async () => {
    await speak('es');
    const labels = getResults('Do7').filter((r) => r.type === 'Chord').map((r) => r.label);
    expect(labels.slice(0, 2)).toEqual(['C Séptima de dominante', 'D Séptima disminuida']);
  });

  it('a scale or chord quality found by its English name is shown in the learner\'s language', async () => {
    await speak('pt');
    at('explore', 'C', 'major');
    expect(labelOf('blues scale', 'Scale')).toBe('C blues');
    expect(getResults('Half-Diminished').filter((r) => r.type === 'Chord').map((r) => r.label)).toContain('C Meio-diminuto');
  });

  it.each(['pt', 'es'] as const)('%s: no result of a sample of queries carries an English music word', async (lang) => {
    await speak(lang);
    const english = /\b(Major|Minor|Diminished|Augmented|Dominant|Natural|Harmonic|Melodic|Dorian|Lydian|Altered|Suspended|Whole Tone|Half)\b/;
    for (const q of ['Dm7', 'Cmaj7', 'Bbm7b5', 'F#dim7', 'C7alt', 'Csus4', 'D dorian', 'G harmonic minor', 'key of E minor', 'C whole tone scale', 'blues scale', 'Do7', 'Sol7', 'escala de Ré maior', 'Half-Diminished', 'Dominant 7th']) {
      for (const r of getResults(q).filter((x) => x.type !== 'Lesson')) {
        expect(r.label, `${lang} "${q}"`).not.toMatch(english);
      }
    }
  });
});

// ─── A14 + Q14 (rendered) ────────────────────────────────────────────────────
describe('A14 — the results are a listbox the input points into', () => {
  it('combobox → listbox, the selected option is aria-activedescendant and moves with the arrows', () => {
    render(<QuickSearch />);
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.change(input, { target: { value: 'Cm' } });
    const list = screen.getByRole('listbox');
    expect(input.getAttribute('aria-controls')).toBe(list.id);
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(3);
    expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id);
    expect(options[0].getAttribute('aria-selected')).toBe('true');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')).toBe(options[2].id);
    expect(options[2].getAttribute('aria-selected')).toBe('true');
    expect(options[0].getAttribute('aria-selected')).toBe('false');
    // Focus never leaves the input.
    expect(document.activeElement).toBe(input);
  });

  it('no results: collapsed, no active descendant', () => {
    render(<QuickSearch />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'zzzzqq' } });
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
  });

  it('the dialog and the input are named in the learner\'s language', async () => {
    await speak('pt');
    render(<QuickSearch />);
    expect(screen.getByRole('dialog').getAttribute('aria-label')).toBe('Pesquisa rápida');
    expect(screen.getByRole('combobox').getAttribute('aria-label')).toBe('Pesquisa rápida');
  });
});

describe('Q14 — the dialog\'s magnifier is the app\'s own icon', () => {
  it('no emoji; the same SVG as the top bar\'s search button', () => {
    render(<QuickSearch />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).not.toMatch(/\u{1F50E}|\u{1F50D}/u);
    const svg = dialog.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
    expect(svg!.querySelector('circle')?.getAttribute('r')).toBe('7');
    expect(svg!.getAttribute('stroke')).toBe('currentColor');
  });
});

// ─── A13, the same class: the dialog's own suggestions ───────────────────────
describe('A13 — the search box suggests queries in the learner\'s language, and each one works', () => {
  const quoted = (s: string) => [...s.matchAll(/"([^"]+)"/g)].map((m) => m[1]);
  const bracketed = (s: string) => [...s.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]);

  it.each(['en', 'pt', 'es'] as const)('%s: every example in the placeholder and the no-match line finds a result', async (lang) => {
    await speak(lang);
    const examples = [...quoted(i18n.t('search.placeholder')), ...bracketed(i18n.t('search.noMatch'))];
    expect(examples.length).toBe(6);
    for (const q of examples) expect(getResults(q).filter((r) => r.type !== 'Lesson').length, `${lang} "${q}"`).toBeGreaterThan(0);
  });

  it.each(['pt', 'es'] as const)('%s: no English music word in them; the scale names are the app\'s own', async (lang) => {
    await speak(lang);
    for (const s of [i18n.t('search.placeholder'), i18n.t('search.noMatch')]) {
      expect(s).not.toMatch(/\b(harmonic|minor|lydian|dominant)\b/i);
      expect(s).toContain(i18n.t('scaleName.harmonic_minor'));
    }
    expect(i18n.t('search.placeholder')).toContain(i18n.t('scaleName.lydian_dominant'));
  });
});
