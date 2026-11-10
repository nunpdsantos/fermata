import i18n from '../../../i18n';
/**
 * Simple view's summary says what the learner sees (the seat's decision 1,
 * 2026-11-10). "G Major Pentatonic · one sharp" over G A B D E, and "A Blues
 * · no sharps or flats" with E♭ on the strip, were untrue of the notes shown.
 * The words about sharps and flats are used only when the scale's notes ARE
 * the seven notes of that key signature; any other scale says how many notes
 * it has ("G Major Pentatonic · 5 notes").
 *
 * Checked against the strip itself, for every root spelling × Simple's five
 * scales + Dorian + harmonic minor: signature words only when no note on the
 * strip contradicts them (read independently here, from the letters and
 * accidentals the strip prints, against the order sharps and flats enter a
 * key signature), otherwise the count of the strip's distinct notes. The
 * glossary word on that part is `keySignature` only where the signature is
 * what is said; the count carries no word (no entry explains a count).
 */
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { ExploreHeader } from '../ExploreHeader';
import { ScaleStrip } from '../ScaleStrip';
import { DockReadout } from '../../layout/DockReadout';
import type { NaturalNote, Note, ScaleType } from '../../../core/types/music';

vi.mock('../../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playScale: vi.fn(),
}));
vi.mock('../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff' }) };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(async () => {
  cleanup();
  await act(async () => { await i18n.changeLanguage('en'); });
});

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** Every root spelling a key can have here: the key picker's, its ⇄ respelling, and a link's E♯ / B♯ / F♭ / C♭. */
const ROOTS: Note[] = LETTERS.flatMap((natural) => (['', '#', 'b'] as const).map((accidental) => ({ natural, accidental })));
/** Simple's five, plus Dorian (a link opens a mode) and harmonic minor (a link, or chosen in Full). */
const SCALES: ScaleType[] = ['major', 'natural_minor', 'pentatonic_major', 'pentatonic_minor', 'blues', 'dorian', 'harmonic_minor'];
/** What each says, whatever the root: its signature (the notes are exactly a key signature's seven) or its size. */
const EXPECTED: Record<string, 'signature' | number> = {
  major: 'signature', natural_minor: 'signature', dorian: 'signature',
  pentatonic_major: 5, pentatonic_minor: 5, blues: 6, harmonic_minor: 7,
};

const OFFSET: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
const SHARP_ORDER = 'FCGDAEB';
const FLAT_ORDER = 'BEADGCF';

/**
 * The key signature the strip's notes ARE, read from the notes alone, or
 * null when they are not one: seven different letters, every accidental the
 * same way, and exactly the letters a signature with that many marks alters
 * (sharps F C G D A E B, flats B E A D G C F; past seven, round again: F𝄪).
 */
function signatureOfStrip(names: string[]): { type: '#' | 'b' | ''; count: number } | null {
  const byLetter = new Map<string, number>();
  for (const n of names) {
    const off = OFFSET[n.slice(1)];
    if (off === undefined) throw new Error(`unread note ${n}`);
    if (byLetter.has(n[0]) && byLetter.get(n[0]) !== off) return null; // one letter, two spellings
    byLetter.set(n[0], off);
  }
  if (byLetter.size !== 7) return null;
  const offs = [...byLetter.values()];
  const sharps = offs.every((o) => o >= 0);
  const flats = offs.every((o) => o <= 0);
  if (!sharps && !flats) return null;
  const count = offs.reduce((a, o) => a + Math.abs(o), 0);
  const order = sharps ? SHARP_ORDER : FLAT_ORDER;
  for (const letter of LETTERS) {
    let expected = 0;
    for (let i = 0; i < count; i++) if (order[i % 7] === letter) expected += 1;
    if (Math.abs(byLetter.get(letter)!) !== expected) return null;
  }
  return { type: count === 0 ? '' : sharps ? '#' : 'b', count };
}

const signatureWords = (s: { type: string; count: number }) =>
  s.count === 0 ? 'no sharps or flats' : `${s.count === 1 ? 'one' : s.count} ${s.type === '#' ? 'sharp' : 'flat'}${s.count === 1 ? '' : 's'}`;

function Simple() {
  return (
    <>
      <ExploreHeader />
      <ScaleStrip />
    </>
  );
}

const set = (root: Note, scale: ScaleType, extra: Record<string, unknown> = {}) =>
  act(() => useAppStore.setState({ selectedKey: root, selectedScale: scale, selectedChord: null, ...extra }));

/** The strip's columns without the octave tonic: names as printed, pitch classes as played. */
function strip() {
  const cols = [...document.querySelectorAll<HTMLElement>('.strip-col')];
  const notes = cols.slice(0, -1);
  return {
    names: notes.map((c) => c.dataset.note!),
    pcs: new Set(notes.map((c) => Number(c.dataset.midi) % 12)),
  };
}

/** The summary's second part (after the key) and the glossary words on it. */
function secondPart() {
  const summary = screen.getByTestId('key-summary');
  const text = summary.textContent!;
  const key = summary.querySelector('.explore-summary-key')!.textContent!;
  expect(text.startsWith(`${key} · `), text).toBe(true);
  const part = text.slice(key.length + 3);
  const terms = [...summary.querySelectorAll<HTMLElement>('[data-term]')]
    .filter((el) => !el.querySelector('.explore-summary-key'))
    .map((el) => ({ ids: el.dataset.term!, text: el.textContent }));
  return { part, terms };
}

describe('Simple\'s summary says what the strip shows', () => {
  it(`every root spelling (${ROOTS.length}) × ${SCALES.length} scales: signature words only when the strip's notes are that signature, else the strip's number of notes`, () => {
    act(() => useAppStore.setState({ exploreDetail: 'simple', instrument: 'piano', baseOctave: 4, view: 'explore', showSolfege: false, language: 'en' }));
    render(<Simple />);
    let checked = 0;
    for (const root of ROOTS) {
      for (const scale of SCALES) {
        set(root, scale);
        const where = `${root.natural}${root.accidental} ${scale}`;
        const { names, pcs } = strip();
        const { part, terms } = secondPart();
        const sig = signatureOfStrip(names);
        if (EXPECTED[scale] === 'signature') {
          // Nothing on the strip contradicts the words, and they are the signature's.
          expect(sig, `${where}: the strip ${names.join(' ')} is one key signature`).not.toBeNull();
          expect(part, where).toBe(signatureWords(sig!));
          expect(terms, where).toEqual([{ ids: 'keySignature sharpFlat', text: part }]);
        } else {
          // The strip contradicts any signature words: the count instead.
          expect(sig, `${where}: ${names.join(' ')}`).toBeNull();
          expect(pcs.size, where).toBe(EXPECTED[scale]);
          expect(part, where).toBe(`${pcs.size} notes`);
          expect(terms, `${where}: no glossary word on the count`).toEqual([]);
        }
        checked++;
      }
    }
    expect(checked).toBe(21 * 7);
  });

  it('the brief\'s own examples; a scale without a key signature says its size too', () => {
    act(() => useAppStore.setState({ exploreDetail: 'simple', language: 'en', showSolfege: false }));
    render(<Simple />);
    const cases: [string, ScaleType, string][] = [
      ['G', 'pentatonic_major', 'G Major Pentatonic · 5 notes'],
      ['E', 'blues', 'E Blues · 6 notes'],
      ['A', 'harmonic_minor', 'A Harmonic Minor · 7 notes'],
      ['A', 'blues', 'A Blues · 6 notes'],
      ['C', 'whole_tone', 'C Whole Tone · 6 notes'],
      ['G', 'major', 'G Major · one sharp'],
      ['A', 'natural_minor', 'A Natural Minor · no sharps or flats'],
      ['D', 'dorian', 'D Dorian · no sharps or flats'],
    ];
    for (const [root, scale, text] of cases) {
      set({ natural: root[0] as NaturalNote, accidental: '' }, scale);
      expect(screen.getByTestId('key-summary').textContent, `${root} ${scale}`).toBe(text);
    }
  });

  it('PT and ES, with Dó-Ré-Mi on: the line still reads naturally', async () => {
    for (const [lang, text] of [['pt', 'G (Sol) pentatónica maior · 5 notas'], ['es', 'G (Sol) pentatónica mayor · 5 notas']] as const) {
      act(() => useAppStore.setState({ exploreDetail: 'simple', language: lang, showSolfege: true }));
      await act(async () => { await i18n.changeLanguage(lang); });
      render(<Simple />);
      set({ natural: 'G', accidental: '' }, 'pentatonic_major');
      expect(screen.getByTestId('key-summary').textContent, lang).toBe(text);
      set({ natural: 'E', accidental: '' }, 'blues');
      expect(screen.getByTestId('key-summary').textContent, lang).toBe('E (Mi) blues · 6 notas');
      cleanup();
    }
    expect(i18n.t('simpleView.notes', { count: 1, lng: 'en' })).toBe('1 note');
    expect(i18n.t('simpleView.notes', { count: 1, lng: 'pt' })).toBe('1 nota');
    expect(i18n.t('simpleView.notes', { count: 1, lng: 'es' })).toBe('1 nota');
  });

  it('Full view\'s summary is unchanged', () => {
    act(() => useAppStore.setState({ exploreDetail: 'full', language: 'en', showSolfege: false }));
    render(<Simple />);
    set({ natural: 'G', accidental: '' }, 'pentatonic_major');
    expect(screen.getByTestId('key-summary').textContent).toBe('G Major Pentatonic · 1♯ · relative E minor');
    set({ natural: 'A', accidental: '' }, 'blues');
    expect(screen.getByTestId('key-summary').textContent).toBe('A Blues · no ♯/♭ · relative C major');
  });

  // The dock read-out is the other place Simple names the key: it says the
  // note's number in the scale and the key's name, never the signature
  // (so the rule has nothing to change there; this keeps it so).
  it('the dock read-out in Simple names the note and the key, no sharps or flats', () => {
    act(() => useAppStore.setState({ exploreDetail: 'simple', language: 'en', showSolfege: false, exerciseInputActive: false }));
    set({ natural: 'G', accidental: '' }, 'pentatonic_major');
    useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
    render(<DockReadout context="C4 · 1 octave" />);
    act(() => useFocusNoteStore.getState().set('pinned', { pc: 11, midi: 71, source: 'staff' }));
    const text = screen.getByTestId('dock-readout').querySelector('.dock-context-text')!.textContent!;
    expect(text).toBe('B — note 3 of G Major Pentatonic');
    expect(text).not.toMatch(/sharp|flat/);
  });
});
