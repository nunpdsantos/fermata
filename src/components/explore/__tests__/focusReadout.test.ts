/**
 * W11-B — the linked focus note: the store's slots, which pitches it lights
 * (exact pitch where the surface shows it, else the pitch class), and the
 * read-out's wording in EN / PT / ES ("B — 3rd of G · leading note of
 * C Major · string 5 fret 2, string 2 open").
 */
import { describe, it, expect, beforeEach } from 'vitest';
import i18next from 'i18next';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import { useFocusNoteStore, selectFocusNote, focusMatches, type FocusNote } from '../../../state/focusNoteStore';
import { readoutParts, readoutVariants, chordSymbol } from '../focusReadout';
import { buildScale } from '../../../core/constants/scales';
import { buildChord } from '../../../core/constants/chords';
import { spellSharpDefault } from '../../../core/utils/spelling';
import type { Note } from '../../../core/types/music';

const N = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
async function makeT(lng: 'en' | 'pt' | 'es') {
  const inst = i18next.createInstance();
  await inst.init({ resources: { en: { translation: en }, pt: { translation: pt }, es: { translation: es } }, lng, fallbackLng: 'en', interpolation: { escapeValue: false } });
  return inst.t.bind(inst) as (key: string, opts?: Record<string, unknown>) => string;
}
const B4: FocusNote = { pc: 11, midi: 71, source: 'staff' };

describe('focus note store', () => {
  beforeEach(() => useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null }));

  it('hover wins over keyboard, keyboard over pinned; leaving restores the next', () => {
    const s = useFocusNoteStore.getState();
    s.set('pinned', { pc: 0, source: 'piano' });
    s.set('keyboard', { pc: 2, source: 'staff' });
    s.set('hover', { pc: 4, source: 'fret' });
    expect(selectFocusNote(useFocusNoteStore.getState())?.pc).toBe(4);
    s.clear('hover', 'fret');
    expect(selectFocusNote(useFocusNoteStore.getState())?.pc).toBe(2);
    s.clear('keyboard', 'staff');
    expect(selectFocusNote(useFocusNoteStore.getState())?.pc).toBe(0);
  });

  it('a surface clears only its own note (a fret leaving does not clear the strip\'s)', () => {
    const s = useFocusNoteStore.getState();
    s.set('hover', { pc: 11, source: 'staff' });
    s.clear('hover', 'fret');
    expect(useFocusNoteStore.getState().hover?.source).toBe('staff');
  });

  it('lights the exact pitch when the surface shows it, else every one of its pitch class', () => {
    expect([...focusMatches(B4, [60, 62, 71, 72])]).toEqual([71]);
    // The guitar in open position draws B2 (47) and B3 (59), not B4.
    expect([...focusMatches(B4, [40, 47, 52, 59, 64])].sort()).toEqual([47, 59]);
    expect([...focusMatches({ pc: 11, source: 'chord' }, [47, 59, 71])].sort()).toEqual([47, 59, 71]);
    expect(focusMatches(null, [60]).size).toBe(0);
  });
});

describe('read-out wording', () => {
  const cMajor = buildScale(N('C'), 'major');

  it('EN: note — chord role · key role · where (the workbench mockup\'s line)', async () => {
    const t = await makeT('en');
    const p = readoutParts({
      focus: B4, scale: cMajor, chord: buildChord(N('G'), 'major'), spellPitchClass: spellSharpDefault,
      locations: ['string 5 fret 2', 'string 2 open'], t,
    });
    expect(readoutVariants(p)[0]).toBe('B — 3rd of G · leading note of C Major · string 5 fret 2, string 2 open');
    // Shorter wordings for a narrow bar, longest first.
    expect(readoutVariants(p)).toEqual([
      'B — 3rd of G · leading note of C Major · string 5 fret 2, string 2 open',
      'B — 3rd of G · leading note of C Major',
      'B — 3rd of G',
      'B',
    ]);
  });

  it('EN: roots, altered tones, notes outside the key, other scales', async () => {
    const t = await makeT('en');
    const g7 = buildChord(N('G'), 'dominant7');
    const one = (focus: FocusNote, scale = cMajor, chord: ReturnType<typeof buildChord> | null = null) =>
      readoutVariants(readoutParts({ focus, scale, chord, spellPitchClass: spellSharpDefault, t }))[0];
    expect(one({ pc: 7, source: 'chord' }, cMajor, g7)).toBe('G — root of G7 · dominant of C Major');
    expect(one({ pc: 5, source: 'chord' }, cMajor, g7)).toBe('F — b7 of G7 · subdominant of C Major');
    expect(one({ pc: 1, source: 'piano' })).toBe('C# — not in C Major');
    // Blues: degrees, not function names; spelled from the scale (Eb, not D#).
    expect(one({ pc: 3, source: 'staff' }, buildScale(N('A'), 'blues'))).toBe('Eb — b5 of A Blues');
    expect(one({ pc: 9, source: 'staff' }, buildScale(N('A'), 'blues'))).toBe('A — tonic of A Blues');
    // A chord's own spelling wins (C# major's vii° is B#°: B#, not C).
    const cs = buildScale(N('C#'), 'major');
    expect(one({ pc: 0, source: 'chord' }, cs, buildChord(N('B#'), 'diminished'))).toBe('B# — root of B#dim · leading note of C# Major');
  });

  it('PT and ES name it in their own words', async () => {
    const chord = buildChord(N('G'), 'major');
    for (const [lang, want] of [
      ['pt', 'B — 3.ª de G · sensível de C maior · corda 5 traste 2, corda 2 solta'],
      ['es', 'B — 3.ª de G · sensible de C mayor · cuerda 5 traste 2, cuerda 2 al aire'],
    ] as const) {
      const t = await makeT(lang);
      const loc = [t('explore.readout.stringFret', { string: 5, fret: 2 }), t('explore.readout.stringOpen', { string: 2 })];
      const text = readoutVariants(readoutParts({ focus: B4, scale: cMajor, chord, spellPitchClass: spellSharpDefault, locations: loc, t }))[0];
      expect(text.toLowerCase()).toBe(want.toLowerCase());
    }
  });

  it('chord symbols as the cards print them', () => {
    expect(chordSymbol(buildChord(N('D'), 'minor'))).toBe('Dm');
    expect(chordSymbol(buildChord(N('B'), 'diminished'))).toBe('Bdim');
  });
});
