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
import { getPitchClass, getSimplestSpelling } from '../../../core/constants/notes';
import { letterDistance, preferredRootSpelling } from '../../../core/utils/degreeSpelling';
import { identifyChordFromNotes } from '../../../core/utils/reverseChordParser';
import type { ChordQuality, Note } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';

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

describe('Q2 oracle: Build names a chord in the key exactly when all its tones are the scale\'s', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: every picker scale × every picker root × every quality on every root`, async () => {
      await i18n.changeLanguage(lang);
      const t = i18n.t.bind(i18n);
      expect(PICKER_SCALES).toHaveLength(37);
      const wrong: string[] = [];
      let inKeyCount = 0;
      for (const type of PICKER_SCALES) {
        for (let pc = 0; pc < 12; pc++) {
          const scale = buildScale(preferredRootSpelling(pc, type), type);
          const diatonic = getDiatonicChordsForScale(scale);
          const pcs = new Set(scale.notes.map(getPitchClass));
          for (let rootPc = 0; rootPc < 12; rootPc++) {
            const scaleNote = scale.notes.find((n) => getPitchClass(n) === rootPc);
            const root: Note = scaleNote ?? getSimplestSpelling(rootPc as Parameters<typeof getSimplestSpelling>[0]);
            for (const quality of QUALITIES) {
              const chord = buildChord(root, quality);
              const inScale = chord.notes.every((n) => pcs.has(getPitchClass(n)));
              const role = builderRole(chord, scale, diatonic, t)!;
              const where = `${scale.root.natural}${scale.root.accidental} ${type}: ${root.natural}${root.accidental} ${quality} → "${role.text}"`;
              if (role.inKey !== inScale) wrong.push(`${where} (inKey ${role.inKey}, oracle ${inScale})`);
              if (NESTED.test(role.text)) wrong.push(`${where} (nested brackets)`);
              if (!inScale) continue;
              inKeyCount++;
              if (NON_DIATONIC.test(role.text)) wrong.push(`${where} (called non-diatonic)`);
              // The numeral's number: the scale's note on that root, counted from the tonic.
              const n = letterDistance(scale.root.natural, scaleNote!.natural);
              const has = new Set(CHORD_FORMULAS[quality].map((s) => s % 12));
              const minor = has.has(3) && !has.has(4);
              const major = has.has(4) && !has.has(3);
              const roman = romanOf(role.text.split(' ')[0]);
              const want = ROMAN[n];
              if (roman.toUpperCase() !== want) wrong.push(`${where} (number ${roman}, oracle ${want})`);
              if (minor && roman !== want.toLowerCase()) wrong.push(`${where} (case: a minor-3rd chord is lower case)`);
              if (major && roman !== want) wrong.push(`${where} (case: a major-3rd chord is upper case)`);
            }
          }
        }
      }
      expect(inKeyCount).toBeGreaterThan(10_000);
      expect(wrong.slice(0, 20), `${wrong.length} wrong`).toEqual([]);
    }, 120_000);
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

  it('a chord with a note outside says which, in plain words, without nested brackets (C7 in C major)', () => {
    const scale = buildScale(C, 'major');
    const role = builderRole(buildChord(C, 'dominant7'), scale, getDiatonicChordsForScale(scale), i18n.t.bind(i18n))!;
    expect(role.inKey).toBe(false);
    expect(role.text).toBe('the root is the I of C Major; B♭ outside the key');
  });

  it('a chord whose root is outside the key (D♭ in C major): no nested brackets', () => {
    const scale = buildScale(C, 'major');
    const role = builderRole(buildChord(n('Db'), 'major'), scale, getDiatonicChordsForScale(scale), i18n.t.bind(i18n))!;
    expect(role.inKey).toBe(false);
    expect(role.text).toBe('out of key: C Major');
  });

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
