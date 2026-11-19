/**
 * The fix pass after the independent review of b94d761 (stream B, search and
 * sharing). Items as the review numbered them:
 *  1  every accidental WORD, every syllable; every place a result's action is
 *     made, chosen from Learn and from Drill
 *  2  a bare lower-case word (sim, dom, lam…) never puts its solfège chord
 *     above what the list held before; ALL CAPS reads as capitalised
 *  3  ten rows at most
 *  4  the accidental word joined to the symbol, a sign set apart by a space
 *  5  (in QuickSearch: a mouse never scrolls the list)
 *  6  the rendered "Quick search" with the real translation
 *  7  a slash chord whose bass is a chord tone opens as that inversion
 *  8  the app's tools (tuner, metronome) as results, where the menu offers them
 *  9  "G chord", «acorde de Sol», PT / ES scale names with no root
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import i18n from '../../../i18n';
import { QuickSearch } from '../QuickSearch';
import { getResults, type SearchResult } from '../quickSearchResults';
import { useAppStore } from '../../../state/store';
import { noteToString, type ScaleType } from '../../../core/types/music';
import { showLessonQuery, returnLessonInstrument } from '../../../services/lessonInstrument';
import { executeTheoryQuery } from '../../../utils/queryExecutor';
import { resolveTheoryReadings } from '../../../utils/theoryQuery';
import { openShareLink, resetShareLinkOpen } from '../../../services/shareLinkOpen';
import { exploreLinkValues } from '../../../services/shareLinkMake';
import { useTunerRequest, closeTuner } from '../../tuner/tunerRequest';
import { requestDemo, clearDemoRequest } from '../../../state/demoRequest';
import { SEARCH_SAMPLE } from './searchSample';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
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
    view, lastView: view,
    selectedKey: { natural: key[0], accidental: key.slice(1) } as never,
    selectedScale: scale, selectedChord: null, chordInversion: 0, lessonLoan: null,
    quickSearchOpen: true, pendingLearnTarget: null, exploreDetail: 'full',
  });
}

const chordKey = () => {
  const s = useAppStore.getState();
  const c = s.selectedChord;
  return c ? `${noteToString(c.root)}${c.quality}${c.bassNote ? `/${noteToString(c.bassNote)}` : ''}${s.chordInversion ? ` inv${s.chordInversion}` : ''}` : 'none';
};

/** Every chord result of a query, as `Root+quality[/bass][ invN]`, in order (each chosen from Explore on C major). */
function chords(q: string): string[] {
  const out: string[] = [];
  for (const r of getResults(q).filter((x) => x.type === 'Chord')) {
    at('explore');
    r.action();
    out.push(chordKey());
  }
  return out;
}

beforeEach(async () => {
  at('explore');
  await speak('en');
  resetShareLinkOpen();
  closeTuner();
  clearDemoRequest();
});

afterEach(async () => {
  cleanup();
  returnLessonInstrument();
  clearDemoRequest();
  closeTuner();
  await speak('en');
});

// ─── 1a ──────────────────────────────────────────────────────────────────────
describe('1a — every accidental word, on every syllable, sharp and flat', () => {
  const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const SYLLABLES: Record<'pt' | 'es', string[]> = {
    pt: ['Dó', 'Ré', 'Mi', 'Fá', 'Sol', 'Lá', 'Si'],
    es: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'],
  };
  const WORDS: Record<'pt' | 'es', { sharp: string; flat: string }> = {
    pt: { sharp: 'sustenido', flat: 'bemol' },
    es: { sharp: 'sostenido', flat: 'bemol' },
  };
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: "<syllable> <word>", "<syllable> <word> 7", "<syllable> <word>7", "<syllable> <word> m7", any case, no accents`, async () => {
      await speak(lang);
      const wrong: string[] = [];
      SYLLABLES[lang].forEach((syl, i) => {
        for (const [kind, word] of Object.entries(WORDS[lang])) {
          const acc = kind === 'sharp' ? '#' : 'b';
          const root = `${LETTERS[i]}${acc}`;
          const plain = syl.normalize('NFD').replace(/[̀-ͯ]/g, '');
          for (const s of [syl, plain, syl.toLowerCase(), syl.toUpperCase()]) {
            for (const [q, expected] of [
              [`${s} ${word}`, `${root}major`],
              [`${s} ${word} 7`, `${root}dominant7`],
              [`${s} ${word}7`, `${root}dominant7`],
              [`${s} ${word} m7`, `${root}minor7`],
            ] as const) {
              const got = chords(q)[0];
              if (got !== expected) wrong.push(`${q} → ${got} (expected ${expected})`);
            }
          }
        }
      });
      expect(wrong).toEqual([]);
    });
  }
});

// ─── 1b ──────────────────────────────────────────────────────────────────────
describe('1b — every kind of result opens Explore from Learn and from Drill (or its own place)', () => {
  const SOURCE = readFileSync(resolve(process.cwd(), 'src/components/navigation/quickSearchResults.ts'), 'utf8');
  /**
   * Every kind of result the builder can make: the `ResultSource` union, which
   * every result must name (`source` is required), so a new kind added later
   * must be declared there — and this test then makes it reachable and checks
   * where choosing it lands.
   */
  const KINDS = [...(/export type ResultSource =([^;]+);/.exec(SOURCE)?.[1] ?? '').matchAll(/'([a-z-]+)'/g)].map((m) => m[1]).sort();
  const QUERIES = ['key of G', 'D dorian', 'dorian', 'blues scale', 'Dm7', 'Cmaj', 'c sharp minor', 'Do7', 'Sol7', 'Half-Diminished', 'Dominant 7th', 'major', 'tuner', 'metronome', 'tritone', 'C/E'];

  it('the builder declares its kinds (the test is not vacuous)', () => {
    expect(KINDS.length).toBeGreaterThanOrEqual(8);
    expect(KINDS).toContain('solfege-chord');
  });

  for (const from of ['learn', 'drill'] as const) {
    it(`from ${from}: each kind is reached by the queries, and choosing it opens where it belongs`, async () => {
      await speak('es');
      const seen = new Set<string>();
      const wrong: string[] = [];
      for (const q of QUERIES) {
        // Explore's own key E (a lesson borrows the instrument in Learn), so
        // a scale found on C by the parser is a row of its own.
        at(from, 'E');
        if (from === 'learn') showLessonQuery('A natural minor scale');
        const results = getResults(q);
        for (let i = 0; i < results.length; i++) {
          at(from, 'E');
          if (from === 'learn') showLessonQuery('A natural minor scale');
          const r = getResults(q)[i];
          const kind = (r as SearchResult & { source?: string }).source ?? 'undeclared';
          seen.add(kind);
          r.action();
          await act(async () => { await new Promise((ok) => setTimeout(ok, 0)); });
          const s = useAppStore.getState();
          const want = kind === 'lesson' ? 'learn' : kind === 'tool' ? from : 'explore';
          if (s.view !== want) wrong.push(`${q} #${i} (${kind}): view ${s.view}, expected ${want}`);
          if (kind === 'tool') closeTuner();
          returnLessonInstrument();
        }
      }
      expect(wrong).toEqual([]);
      expect([...seen].filter((k) => k !== 'undeclared').sort()).toEqual(KINDS);
      expect(seen.has('undeclared')).toBe(false);
    });
  }
});

// ─── 2 ───────────────────────────────────────────────────────────────────────
describe('2 — a bare lower-case word never puts its solfège chord above what the list held; ALL CAPS reads capitalised', () => {
  const BASE = JSON.parse(readFileSync(resolve(process.cwd(), 'src/components/navigation/__tests__/fixtures/searchResults.6de6c0e.json'), 'utf8')) as Record<string, string[]>;
  for (const lang of ['pt', 'es', 'en'] as const) {
    it.each(['sim', 'mim', 'dom', 'rem', 'lam', 'fam'])(`${lang}: "%s" — every row it had before stays above its solfège chord`, async (q) => {
      await speak(lang);
      const rows = getResults(q);
      const at0 = rows.findIndex((r) => (r as SearchResult & { solfege?: true }).solfege);
      const before = BASE[`${lang} ${q}`]?.length ?? rows.filter((r) => !(r as SearchResult & { solfege?: true }).solfege).length;
      if (at0 >= 0) expect(at0, `${lang} "${q}": the solfège row comes after the ${before} rows the list held`).toBeGreaterThanOrEqual(Math.min(before, 10));
    });
  }

  it('PT "sim" (yes) no longer opens on "B Menor": its lessons come first, as at 6de6c0e', async () => {
    await speak('pt');
    const rows = getResults('sim');
    expect(rows[0].type).toBe('Lesson');
    expect(rows.map((r) => r.label)).toContain('B Menor');
  });

  it.each([['Sim', 'Bminor'], ['Lam7', 'Aminor7'], ['Dom7', 'Cminor7'], ['Rem', 'Dminor']])('ES: the chord symbol "%s" (capitalised) still comes first: %s', async (q, chord) => {
    await speak('es');
    expect(chords(q)[0]).toBe(chord);
  });

  it.each([
    ['SIM', 'Bminor'], ['DOM7', 'Cminor7'], ['LAM', 'Aminor'], ['FA#M7', 'F#minor7'], ['SOLMAJ7', 'Gmajor7'], ['DO7', 'Cdominant7'],
    ['SiM', 'Bmajor'], ['DoM7', 'Cmajor7'],
  ])('ES: "%s" → %s (all caps read as capitalised; M is major only in mixed case)', async (q, chord) => {
    await speak('es');
    expect(chords(q)[0]).toBe(chord);
  });
});

// ─── 3 ───────────────────────────────────────────────────────────────────────
describe('3 — ten rows at most, the solfège reading kept where it ranks first', () => {
  it.each(['en', 'pt', 'es'] as const)('%s: every sample query lists at most 10 rows', async (lang) => {
    await speak(lang);
    const over = SEARCH_SAMPLE.filter((q) => getResults(q).length > 10);
    expect(over).toEqual([]);
  });

  it('ES "Dom7" (a full list) keeps C minor 7 first, in ten rows', async () => {
    await speak('es');
    const rows = getResults('Dom7');
    expect(rows.length).toBeLessThanOrEqual(10);
    expect(chords('Dom7')[0]).toBe('Cminor7');
  });
});

// ─── 4 ───────────────────────────────────────────────────────────────────────
describe('4 — the accidental word joined to the symbol; a sign set apart by a space', () => {
  it.each([
    ['Fa sostenido7', 'F#dominant7'], ['Sol bemol7', 'Gbdominant7'], ['Fá sustenido7', 'F#dominant7'], ['Si bemolmaj7', 'Bbmajor7'],
    ['Do # 7', 'C#dominant7'], ['Si b 7', 'Bbdominant7'], ['Mi b', 'Ebmajor'], ['Fá # m7', 'F#minor7'], ['Sol # m', 'G#minor'],
  ])('ES/PT "%s" → %s', async (q, chord) => {
    await speak('es');
    expect(chords(q)[0]).toBe(chord);
  });

  // Ordinary words that begin with a syllable, a space and a b (or a sign):
  // none gains a solfège chord.
  it('no ordinary phrase is read as one', () => {
    const PHRASES = [
      'La bamba', 'Do bem', 'Mi bebé', 'Si bien', 'La boca', 'Sol bonito', 'Fa bula', 'Re bote', 'Mi bolso', 'Do brasil',
      'Si baixo', 'La bem', 'Sol brilha', 'Fa bens', 'Mi barco', 'Re banda', 'Do bolo', 'La bebida', 'Si bebes', 'Sol bajo',
      'Mi bemolito', 'Fa bemoles', 'Do sostenidos', 'Re sustenidos', 'Do # amigo', 'Si b a', 'La # e',
    ];
    const read = PHRASES.filter((p) => resolveTheoryReadings(p).some((r) => r.via === 'solfege'));
    expect(read).toEqual([]);
  });
});

// ─── 5 ───────────────────────────────────────────────────────────────────────
describe('5 — a mouse never scrolls the list', () => {
  const ROW = 40;
  const VISIBLE = 100; // two whole rows and half of the third
  const descriptors: [object, string, PropertyDescriptor | undefined][] = [];
  const stub = (proto: object, prop: string, get: (this: HTMLElement) => number) => {
    descriptors.push([proto, prop, Object.getOwnPropertyDescriptor(proto, prop)]);
    Object.defineProperty(proto, prop, { configurable: true, get });
  };
  beforeEach(() => {
    stub(HTMLElement.prototype, 'offsetTop', function () { return Number(this.dataset.index ?? 0) * ROW; });
    stub(HTMLElement.prototype, 'offsetHeight', function () { return this.dataset.index !== undefined ? ROW : 0; });
    stub(Element.prototype, 'clientHeight', function () { return this.getAttribute('role') === 'listbox' ? VISIBLE : 0; });
  });
  afterEach(() => {
    for (const [proto, prop, d] of descriptors.splice(0)) {
      if (d) Object.defineProperty(proto, prop, d);
      else delete (proto as Record<string, unknown>)[prop];
    }
  });

  it('after the arrows pressed past the last row, pointing at a half-hidden row leaves the list where it is', async () => {
    render(<QuickSearch />);
    const input = screen.getByRole('combobox');
    input.focus();
    fireEvent.change(input, { target: { value: 'C' } });
    await act(async () => { await Promise.resolve(); });
    const count = screen.getAllByRole('option').length;
    expect(count).toBeGreaterThanOrEqual(5);
    for (let i = 0; i < count + 2; i++) fireEvent.keyDown(input, { key: 'ArrowDown' });
    const list = screen.getByRole('listbox');
    // The arrows kept the last row in view.
    expect(list.scrollTop).toBe(count * ROW - VISIBLE);
    // The learner scrolls back up with the wheel, then points at the half-hidden third row.
    list.scrollTop = 0;
    fireEvent.mouseEnter(screen.getAllByRole('option')[2]);
    expect(screen.getAllByRole('option')[2].getAttribute('aria-selected')).toBe('true');
    expect(list.scrollTop).toBe(0);
  });

  it('the arrows still reveal: from the top, down to a hidden row scrolls just enough', async () => {
    render(<QuickSearch />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'C' } });
    await act(async () => { await Promise.resolve(); });
    const list = screen.getByRole('listbox');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(list.scrollTop).toBe(3 * ROW - VISIBLE);
  });
});

// ─── 6 ───────────────────────────────────────────────────────────────────────
describe('6 — the rendered name in English, with the real translation loaded', () => {
  it('the dialog and its input are "Quick search"', () => {
    render(<QuickSearch />);
    expect(screen.getByRole('dialog', { name: 'Quick search' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Quick search' })).toBeTruthy();
  });
});

// ─── 7 ───────────────────────────────────────────────────────────────────────
describe('7 — a slash chord whose bass is a chord tone opens as that inversion', () => {
  it.each([
    ['C/E', 'Cmajor inv1'], ['C/G', 'Cmajor inv2'], ['G7/F', 'Gdominant7 inv3'], ['Am/C', 'Aminor inv1'], ['Cmaj7/B', 'Cmajor7 inv3'],
    ['C/C', 'Cmajor'], ['Dm7/G', 'Dminor7/G'], ['C/D', 'Cmajor/D'],
  ])('search "%s" → %s', (q, expected) => {
    expect(chords(q)[0]).toBe(expected);
  });

  it('from a lesson: its Try This, and its instrument, the same', () => {
    at('learn');
    executeTheoryQuery('C/E');
    expect(chordKey()).toBe('Cmajor inv1');
    at('learn');
    showLessonQuery('G7/F');
    expect(chordKey()).toBe('Gdominant7 inv3');
  });

  it('from a share link (and its Copy link reads back the same)', async () => {
    await openShareLink({ key: 'C', scale: 'major', chord: 'C/G' });
    expect(chordKey()).toBe('Cmajor inv2');
    const s = useAppStore.getState();
    const values = exploreLinkValues(s);
    expect([values.chord, values.inv]).toEqual(['C', '2']);
  });

  it('in Simple view (no inversions) the slash chord stays as written', () => {
    useAppStore.setState({ exploreDetail: 'simple' });
    const r = getResults('C/E').find((x) => x.type === 'Chord')!;
    r.action();
    expect(chordKey()).toBe('Cmajor/E');
  });
});

// ─── 8 ───────────────────────────────────────────────────────────────────────
describe('8 — the tuner and the metronome are results, where the menu offers them', () => {
  const tools = (q: string) => getResults(q).filter((r) => r.type === ('Tool' as SearchResult['type'])).map((r) => r.label);

  it.each([
    ['en', 'tuner', ['Tuner']], ['en', 'tune', ['Tuner']], ['en', 'metronome', ['Metronome']], ['en', 'metro', ['Metronome']],
    ['pt', 'afinador', ['Afinador']], ['pt', 'metrónomo', ['Metrónomo']], ['pt', 'metronomo', ['Metrónomo']], ['pt', 'tuner', ['Afinador']],
    ['es', 'afinador', ['Afinador']], ['es', 'metrónomo', ['Metrónomo']], ['es', 'afinar', ['Afinador']],
  ] as const)('%s "%s" → %s', async (lang, q, expected) => {
    await speak(lang);
    expect(tools(q)).toEqual(expected);
  });

  it('in Drill: the tuner, not the metronome (as the menu)', () => {
    at('drill');
    expect(tools('tuner')).toEqual(['Tuner']);
    expect(tools('metronome')).toEqual([]);
  });

  it('while the tour plays: neither (as the menu)', () => {
    requestDemo('intro', 'menu');
    expect(tools('tuner')).toEqual([]);
    expect(tools('metronome')).toEqual([]);
  });

  it('choosing the tuner opens it as the menu does (openTuner)', () => {
    const r = getResults('tuner').find((x) => x.label === 'Tuner')!;
    r.action();
    expect(useTunerRequest.getState().open).toBe(true);
  });
});

// ─── 9 ───────────────────────────────────────────────────────────────────────
describe('9 — a root with the word for chord; PT / ES scale names with no root', () => {
  it.each([
    ['en', 'G chord', 'Gmajor'], ['en', 'Bb chord', 'Bbmajor'], ['pt', 'acorde de Sol', 'Gmajor'], ['es', 'acorde de La', 'Amajor'], ['pt', 'acorde de Fá sustenido', 'F#major'],
  ] as const)('%s "%s" → %s', async (lang, q, chord) => {
    await speak(lang);
    expect(chords(q)[0]).toBe(chord);
  });

  const scaleOf = (q: string) => {
    const r = getResults(q).find((x) => x.type === 'Scale');
    if (!r) return 'none';
    at('explore', 'E', 'major');
    r.action();
    const s = useAppStore.getState();
    return `${noteToString(s.selectedKey)} ${s.selectedScale}`;
  };

  it.each([
    ['en', 'dorian'], ['pt', 'dórico'], ['pt', 'dorico'], ['es', 'dórico'], ['pt', 'escala dórica'],
  ] as const)('%s "%s" resolves as English "dorian" does', async (lang, q) => {
    await speak('en');
    const english = scaleOf('dorian');
    await speak(lang);
    expect(scaleOf(q)).toBe(english);
    expect(english).not.toBe('none');
  });

  it.each([
    ['pt', 'menor harmónica', 'E harmonic_minor'], ['es', 'menor armónica', 'E harmonic_minor'], ['pt', 'pentatónica menor', 'E pentatonic_minor'], ['es', 'tonos enteros', 'E whole_tone'],
  ] as const)('%s "%s" → %s (on Explore\'s key, as "harmonic minor" does)', async (lang, q, expected) => {
    await speak(lang);
    expect(scaleOf(q)).toBe(expected);
  });
});
