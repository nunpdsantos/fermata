/**
 * Audit 2026-11-18, Q2: Build called in-key chords "non-diatonic". In C major
 * G7 read "G Dominant 7th (non-diatonic (root is the V of C Major))", and
 * Cmaj7, C6, Csus2, Csus4, Cadd9, C5 "(non-diatonic (root is the I of C
 * Major))"; Cm(add9) was not named at all ("C Minor (Match with 1 added note)").
 *
 * The oracle is built from the scale's OWN notes, never from the app's chord
 * tables: a chord is in the key exactly when every one of its tones is one of
 * the scale's pitch classes. Its numeral's Roman number is the letter distance
 * from the tonic to the scale's note on the chord's root (+ 1), upper case for
 * a chord with a major 3rd and no minor 3rd, lower case for one with a minor
 * 3rd and no major 3rd. Every scale the picker offers, every root the picker
 * offers for it, a chord of every quality on every chromatic root, in EN / PT / ES.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import i18n from '../../../i18n';
import { builderRole } from '../builderRole';
import { ChordBuilderPanel } from '../ChordBuilderPanel';
import { SCALE_GROUPS } from '../../navigation/keyChoice';
import { buildScale } from '../../../core/constants/scales';
import { buildChord, CHORD_FORMULAS, getDiatonicChordsForScale } from '../../../core/constants/chords';
import { letterDistance, preferredRootSpelling } from '../../../core/utils/degreeSpelling';
import { identifyChordFromNotes } from '../../../core/utils/reverseChordParser';
import type { ChordQuality, Note, ScaleType } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import enLocale from '../../../i18n/locales/en.json';
import ptLocale from '../../../i18n/locales/pt.json';
import esLocale from '../../../i18n/locales/es.json';

vi.mock('../../../core/services/audio.ts', () => ({
  resumeAudio: vi.fn(() => Promise.resolve()),
  playChordVoiced: vi.fn(),
  playPitchedNotes: vi.fn(),
  cancelScheduledAudio: vi.fn(),
}));
vi.mock('../../../services/synthConfig.ts', () => ({ getSynthConfig: vi.fn(() => ({})) }));

afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('en');
});

const PICKER_SCALES = SCALE_GROUPS.flatMap((g) => g.options);
const QUALITIES = Object.keys(CHORD_FORMULAS) as ChordQuality[];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const NON_DIATONIC = /non-diatonic|não diatónico|no diatónico/;
const NESTED = /\([^)]*\(/;

/** The Roman part of a numeral (its ♭ / ♯ prefix and its suffix taken off). */
function romanOf(numeral: string): string {
  return numeral.replace(/^[♭♯]+/, '').match(/^(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)/)?.[0] ?? '';
}

// Every sentence Build says, written out here word for word (fix pass, item 1:
// a Portuguese sentence saying a note was INSIDE the key passed every test).
const SAYS = {
  en: {
    inKey: (numeral: string, key: string) => `${numeral} of ${key}`,
    rootIn: (degree: string, key: string, notes: string) => `the root is degree ${degree} of ${key}; ${notes} outside the key`,
    rootOut: (degree: string, key: string, notes: string) => `the root is degree ${degree}, not in ${key}; ${notes} outside the key`,
  },
  pt: {
    inKey: (numeral: string, key: string) => `${numeral} de ${key}`,
    rootIn: (degree: string, key: string, notes: string) => `a fundamental é o grau ${degree} de ${key}; ${notes} fora da tonalidade`,
    rootOut: (degree: string, key: string, notes: string) => `a fundamental é o grau ${degree}, que não está em ${key}; ${notes} fora da tonalidade`,
  },
  es: {
    inKey: (numeral: string, key: string) => `${numeral} de ${key}`,
    rootIn: (degree: string, key: string, notes: string) => `la fundamental es el grado ${degree} de ${key}; ${notes} fuera de la tonalidad`,
    rootOut: (degree: string, key: string, notes: string) => `la fundamental es el grado ${degree}, que no está en ${key}; ${notes} fuera de la tonalidad`,
  },
} as const;
const SCALE_NAMES = { en: enLocale.scaleName, pt: ptLocale.scaleName, es: esLocale.scaleName } as Record<string, Record<string, string>>;

/** A note as the screen writes it: the letter, then ♯ ♭ 𝄪 𝄫. */
const GLYPH: Record<string, string> = { '': '', '#': '♯', b: '♭', '##': '𝄪', bb: '𝄫' };
const glyph = (n: Note) => `${n.natural}${GLYPH[n.accidental]}`;
const NATURAL_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
const pcOf = (n: Note) => (NATURAL_PC[n.natural] + ACC[n.accidental] + 12) % 12;
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
/**
 * A note's degree from the tonic, read off its LETTER against the major scale
 * on the tonic, written as the staff strip writes it: 1, ♭3, ♯4, 7.
 */
function degreeOracle(tonic: Note, note: Note): string {
  const n = (letterDistance(tonic.natural, note.natural) + 7) % 7;
  let alt = (pcOf(note) - pcOf(tonic) - MAJOR[n] + 24) % 12;
  if (alt > 6) alt -= 12;
  if (n === 0 && alt === 0) return '1';
  // A double accidental is one glyph, as the strip writes it (𝄫7, 𝄪4).
  const mark = alt === -2 ? '𝄫' : alt === 2 ? '𝄪' : alt < 0 ? '♭'.repeat(-alt) : '♯'.repeat(alt);
  return `${mark}${n + 1}`;
}
/** Both everyday names of a pitch that is not one of the scale's notes. */
const NAMES: Record<number, string[]> = {
  0: ['C'], 1: ['C#', 'Db'], 2: ['D'], 3: ['D#', 'Eb'], 4: ['E'], 5: ['F'], 6: ['F#', 'Gb'], 7: ['G'], 8: ['G#', 'Ab'], 9: ['A'], 10: ['A#', 'Bb'], 11: ['B'],
};
const noteOf = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;

describe('Q2 oracle: Build names a chord in the key exactly when all its tones are the scale\'s, and says the rest word for word', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: every picker scale × every picker root × every quality on every root (both names of a root outside)`, async () => {
      await i18n.changeLanguage(lang);
      const t = i18n.t.bind(i18n);
      expect(PICKER_SCALES).toHaveLength(37);
      const wrong: string[] = [];
      let inKeyCount = 0;
      let rootInCount = 0;
      let rootOutCount = 0;
      for (const type of PICKER_SCALES) {
        for (let pc = 0; pc < 12; pc++) {
          const scale = buildScale(preferredRootSpelling(pc, type), type);
          const diatonic = getDiatonicChordsForScale(scale);
          const pcs = new Set(scale.notes.map(pcOf));
          const key = `${glyph(scale.root)} ${SCALE_NAMES[lang][type]}`;
          for (let rootPc = 0; rootPc < 12; rootPc++) {
            const scaleNote = scale.notes.find((n) => pcOf(n) === rootPc);
            const roots: Note[] = scaleNote ? [scaleNote] : NAMES[rootPc].map(noteOf);
            for (const root of roots) {
              for (const quality of QUALITIES) {
                const chord = buildChord(root, quality);
                const inScale = chord.notes.every((n) => pcs.has(pcOf(n)));
                const role = builderRole(chord, scale, diatonic, t)!;
                const where = `${scale.root.natural}${scale.root.accidental} ${type}: ${root.natural}${root.accidental} ${quality} → "${role.text}"`;
                if (role.inKey !== inScale) wrong.push(`${where} (inKey ${role.inKey}, oracle ${inScale})`);
                if (NESTED.test(role.text)) wrong.push(`${where} (nested brackets)`);
                if (!inScale) {
                  const outside = chord.notes.filter((n, i) => !pcs.has(pcOf(n)) && chord.notes.findIndex((m) => pcOf(m) === pcOf(n)) === i).map(glyph).join(', ');
                  const want = scaleNote
                    ? SAYS[lang].rootIn(degreeOracle(scale.root, scaleNote), key, outside)
                    : SAYS[lang].rootOut(degreeOracle(scale.root, root), key, outside);
                  if (scaleNote) rootInCount++; else rootOutCount++;
                  if (role.text !== want) wrong.push(`${where} (want "${want}")`);
                  continue;
                }
                inKeyCount++;
                if (NON_DIATONIC.test(role.text)) wrong.push(`${where} (called non-diatonic)`);
                const numeral = role.text.split(' ')[0];
                if (role.text !== SAYS[lang].inKey(numeral, key)) wrong.push(`${where} (want "${SAYS[lang].inKey(numeral, key)}")`);
                // The numeral's number: the scale's note on that root, counted from the tonic.
                const n = letterDistance(scale.root.natural, scaleNote!.natural);
                const has = new Set(CHORD_FORMULAS[quality].map((s) => s % 12));
                const minor = has.has(3) && !has.has(4);
                const major = has.has(4) && !has.has(3);
                const roman = romanOf(numeral);
                const wantRoman = ROMAN[n];
                if (roman.toUpperCase() !== wantRoman) wrong.push(`${where} (number ${roman}, oracle ${wantRoman})`);
                if (minor && roman !== wantRoman.toLowerCase()) wrong.push(`${where} (case: a minor-3rd chord is lower case)`);
                if (major && roman !== wantRoman) wrong.push(`${where} (case: a major-3rd chord is upper case)`);
              }
            }
          }
        }
      }
      expect(inKeyCount).toBeGreaterThan(10_000);
      expect(rootInCount).toBeGreaterThan(50_000);
      expect(rootOutCount).toBeGreaterThan(50_000);
      expect(wrong.slice(0, 20), `${wrong.length} wrong`).toEqual([]);
    }, 180_000);
  }
});

describe('Q2: the audit\'s own chords, read off the textbook (C major / A minor)', () => {
  // Roman numerals of the diatonic seventh chords and the added-tone chords, as
  // Open Music Theory writes them (V7, viiø7 …), in the app's suffix style
  // (maj7, as chordInKey writes them; the brief: "V7, Imaj7 …").
  const C = { natural: 'C', accidental: '' } as Note;
  const n = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
  const cases: [string, string, ChordQuality, string][] = [
    ['C major', 'G', 'dominant7', 'V7'],
    ['C major', 'C', 'major7', 'Imaj7'],
    ['C major', 'C', 'major6', 'I6'],
    ['C major', 'C', 'sus2', 'Isus2'],
    ['C major', 'C', 'sus4', 'Isus4'],
    ['C major', 'C', 'add9', 'Iadd9'],
    ['C major', 'C', 'power', 'I5'],
    ['C major', 'D', 'minor7', 'ii7'],
    ['C major', 'E', 'minor7', 'iii7'],
    ['C major', 'F', 'major7', 'IVmaj7'],
    ['C major', 'A', 'minor7', 'vi7'],
    ['C major', 'B', 'half_diminished7', 'viiø7'],
    ['A minor', 'A', 'minor7', 'i7'],
    ['A minor', 'B', 'half_diminished7', 'iiø7'],
    ['A minor', 'C', 'major7', 'IIImaj7'],
    ['A minor', 'D', 'minor7', 'iv7'],
    ['A minor', 'G', 'dominant7', 'VII7'],
  ];
  for (const [key, root, quality, numeral] of cases) {
    it(`${key}: ${root} ${quality} is ${numeral}, in the key`, () => {
      const scale = key === 'C major' ? buildScale(C, 'major') : buildScale(n('A'), 'natural_minor');
      const role = builderRole(buildChord(n(root), quality), scale, getDiatonicChordsForScale(scale), i18n.t.bind(i18n))!;
      expect(role.inKey).toBe(true);
      expect(role.text).toBe(`${numeral} of ${key === 'C major' ? 'C Major' : 'A Natural Minor'}`);
    });
  }

  // Fix pass, item 2: a chord with a note outside names its root's DEGREE (as
  // the strip writes degrees), never a triad's numeral ("the vii°" for a B
  // MAJOR chord, "the v" for E7 in A minor) nor a bare number ("the 3").
  const outside: [string, string, string, ChordQuality, Record<'en' | 'pt' | 'es', string>][] = [
    ['C', 'major', 'C', 'dominant7', {
      en: 'the root is degree 1 of C Major; B♭ outside the key',
      pt: 'a fundamental é o grau 1 de C maior; B♭ fora da tonalidade',
      es: 'la fundamental es el grado 1 de C mayor; B♭ fuera de la tonalidad' }],
    ['C', 'major', 'B', 'major', {
      en: 'the root is degree 7 of C Major; D♯, F♯ outside the key',
      pt: 'a fundamental é o grau 7 de C maior; D♯, F♯ fora da tonalidade',
      es: 'la fundamental es el grado 7 de C mayor; D♯, F♯ fuera de la tonalidad' }],
    ['A', 'natural_minor', 'E', 'dominant7', {
      en: 'the root is degree 5 of A Natural Minor; G♯ outside the key',
      pt: 'a fundamental é o grau 5 de A menor natural; G♯ fora da tonalidade',
      es: 'la fundamental es el grado 5 de A menor natural; G♯ fuera de la tonalidad' }],
    ['C', 'blues', 'Eb', 'major7', {
      en: 'the root is degree ♭3 of C Blues; D outside the key',
      pt: 'a fundamental é o grau ♭3 de C blues; D fora da tonalidade',
      es: 'la fundamental es el grado ♭3 de C blues; D fuera de la tonalidad' }],
    ['C', 'major', 'Db', 'major', {
      en: 'the root is degree ♭2, not in C Major; D♭, A♭ outside the key',
      pt: 'a fundamental é o grau ♭2, que não está em C maior; D♭, A♭ fora da tonalidade',
      es: 'la fundamental es el grado ♭2, que no está en C mayor; D♭, A♭ fuera de la tonalidad' }],
    ['C', 'lydian', 'F', 'major', {
      en: 'the root is degree 4, not in C Lydian; F outside the key',
      pt: 'a fundamental é o grau 4, que não está em C lídio; F fora da tonalidade',
      es: 'la fundamental es el grado 4, que no está en C lidio; F fuera de la tonalidad' }],
  ];
  for (const [tonic, type, root, quality, says] of outside) {
    for (const lang of ['en', 'pt', 'es'] as const) {
      it(`${lang}: ${root} ${quality} in ${tonic} ${type}: "${says[lang]}"`, async () => {
        await i18n.changeLanguage(lang);
        const scale = buildScale(n(tonic), type as ScaleType);
        const role = builderRole(buildChord(n(root), quality), scale, getDiatonicChordsForScale(scale), i18n.t.bind(i18n))!;
        expect(role.inKey).toBe(false);
        expect(role.text).toBe(says[lang]);
      });
    }
  }

  it('Cm(add9) is named, as Cadd9 is (an exact match, not "Match with 1 added note")', () => {
    for (const [notes, quality] of [[['C', 'D', 'Eb', 'G'], 'minor_add9'], [['C', 'D', 'E', 'G'], 'add9']] as const) {
      const top = identifyChordFromNotes(notes.map(n)).results[0];
      expect(top.confidence).toBe('exact');
      expect(top.chord.root).toEqual(C);
      expect(top.chord.quality).toBe(quality);
    }
  });
});

// ─── The readout as the learner sees it ────────────────────────────────────

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    chordInversion: 0,
    synthPreset: 'piano',
    baseOctave: 4,
    instrument: 'piano',
  });
});

/** Set the builder's root, then switch on the given half steps above it. */
function build(root: string, steps: number[]) {
  const select = screen.getAllByRole('combobox')[0] as HTMLSelectElement;
  fireEvent.change(select, { target: { value: root } });
  const strip = screen.getByRole('group');
  const buttons = strip.querySelectorAll('button');
  for (const s of steps) fireEvent.click(buttons[s]);
}

const readout = () => screen.getByText(/^(Detected|Detetado|Detectado)$/i).parentElement!.textContent ?? '';

describe('Q2 in the panel: what Build shows, EN / PT / ES', () => {
  const words = {
    en: { g7: 'V7 of C Major', cmaj7: 'Imaj7 of C Major', cm9: 'Minor Add 9' },
    pt: { g7: 'V7 de C maior', cmaj7: 'Imaj7 de C maior', cm9: 'Menor com 9.ª adicionada' },
    es: { g7: 'V7 de C mayor', cmaj7: 'Imaj7 de C mayor', cm9: 'Menor con 9.ª añadida' },
  };
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: G7 and Cmaj7 are named by their place in C major; Cm(add9) by its name; nothing nested`, async () => {
      await i18n.changeLanguage(lang);
      render(<ChordBuilderPanel />);
      build('G', [4, 7, 10]);
      expect(readout()).toContain(words[lang].g7);
      expect(readout()).not.toMatch(NON_DIATONIC);
      expect(readout()).not.toMatch(NESTED);
      cleanup();
      render(<ChordBuilderPanel />);
      build('C', [4, 7, 11]);
      expect(readout()).toContain(words[lang].cmaj7);
      expect(readout()).not.toMatch(NON_DIATONIC);
      cleanup();
      render(<ChordBuilderPanel />);
      build('C', [2, 3, 7]);
      expect(readout()).toContain(words[lang].cm9);
      expect(readout()).not.toMatch(/Match with/);
    });
  }
});
