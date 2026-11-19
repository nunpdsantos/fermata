/**
 * QA audit Q1 (2026-11-18), the chips' half: the position chips showed the
 * library's internal names ("AMaj13 barre", "EMaj13 barre" where every other
 * chord reads "A barre" / "E barre"), and with no capo every chip printed its
 * English library or generator name ("E barre", "Pos 5") in Portuguese and
 * Spanish too. A chip now carries the learner's name in the learner's
 * language: the grip's CAGED shape, or for a generated voicing where it sits.
 *
 * (a) Every grip the board can offer (every quality x 12 roots x every
 *     inversion, no capo and a capo on 3) is named in one of the learner's
 *     forms in EN, PT and ES, and nothing else;
 * (b) the board itself shows those names (Cmaj13 in three languages).
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import i18n from '../../../i18n';
import { buildChord, CHORD_FORMULAS } from '../../../core/constants/chords';
import { CHORD_SHAPE_LIBRARY, chordShapesForCapo } from '../../../core/constants/guitarChordShapes';
import type { ChordQuality, Note } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';
import { chordChipLabel } from '../chordChipLabel';

vi.mock('../../../hooks/useAudio', () => ({
  useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }),
}));
vi.mock('../../../hooks/useMediaQuery', async (orig) => ({
  ...(await orig<typeof import('../../../hooks/useMediaQuery')>()),
  useIsMobile: () => false,
  useIsCompact: () => false,
}));

const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const toNote = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
const BASS = String.raw`(?:/[A-G](?:##|bb|#|b)?)?`;
const LEARNER: Record<string, RegExp> = {
  en: new RegExp(String.raw`^(?:[CAGED] (?:shape|barre)|Open|Fret \d{1,2})${BASS}$`),
  pt: new RegExp(String.raw`^(?:(?:forma|pestana) de [CAGED]|Aberto|Traste \d{1,2})${BASS}$`),
  es: new RegExp(String.raw`^(?:(?:forma|cejilla) de [CAGED]|Abierto|Traste \d{1,2})${BASS}$`),
};

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scrollTo = vi.fn() as typeof Element.prototype.scrollTo;
});
afterEach(cleanup);
afterAll(() => i18n.changeLanguage('en'));

describe('the library names every hand-made grip by its CAGED shape', () => {
  it('every shortName is "<CAGED letter> shape|barre", the letter its own cagedShape', () => {
    const odd: string[] = [];
    for (const [key, shapes] of Object.entries(CHORD_SHAPE_LIBRARY)) {
      for (const s of shapes) if (s.shortName !== `${s.cagedShape} shape` && s.shortName !== `${s.cagedShape} barre`) odd.push(`${key}: ${s.name} = "${s.shortName}"`);
    }
    expect(odd).toEqual([]);
  });
});

describe('every chip the board can offer carries a learner\'s name (Q1)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(`${lang}: every quality x 12 roots x every inversion, no capo and capo 3`, async () => {
      await i18n.changeLanguage(lang);
      const t = i18n.getFixedT(lang);
      const bad = new Set<string>();
      let named = 0;
      for (const quality of Object.keys(CHORD_FORMULAS)) {
        for (const root of ROOTS) {
          const chord = buildChord(toNote(root), quality as ChordQuality);
          for (let inversion = 0; inversion < chord.notes.length; inversion++) {
            for (const capo of [0, 3]) {
              for (const entry of chordShapesForCapo(chord, inversion, capo).shapes) {
                named++;
                const label = chordChipLabel(entry, capo, t);
                if (!LEARNER[lang].test(label)) bad.add(`${label}  (${root} ${quality}, "${entry.shape.shortName}")`);
              }
            }
          }
        }
      }
      expect([...bad]).toEqual([]);
      // 27,905 after the review of builder K (every way of giving the asked
      // bass, the neck searched, eight grips at most); 11,017 at its head,
      // 23,699 at 153caab.
      expect(named).toBeGreaterThan(27_500);
    }, 120_000);
  }

  it('the audit\'s own case and a generated grip, word for word', () => {
    const chips = (root: string, quality: ChordQuality, lang: string) =>
      chordShapesForCapo(buildChord(toNote(root), quality), 0, 0).shapes.map((e) => chordChipLabel(e, 0, i18n.getFixedT(lang)));
    expect(chips('C', 'major13', 'en')).toEqual(['A barre', 'E barre']);
    expect(chips('C', 'major13', 'pt')).toEqual(['pestana de A', 'pestana de E']);
    expect(chips('C', 'major13', 'es')).toEqual(['cejilla de A', 'cejilla de E']);
    // A quality with no hand-made grip: the generator's voicings, by fret.
    const generated = chips('C', 'dominant7flat9', 'en');
    expect(generated.length).toBeGreaterThan(0);
    expect(generated.every((l) => /^(Open|Fret \d+)$/.test(l))).toBe(true);
    expect(chips('C', 'dominant7flat9', 'pt').every((l) => /^(Aberto|Traste \d+)$/.test(l))).toBe(true);
  });
});

describe('a generated grip is named where it is drawn (review of a611beb)', () => {
  it('a bass added at fret 9 to a voicing built at fret 2 reads "Fret 9/C♯", the anchor badge\'s fret; open is "Open"; a capo counts', () => {
    const t = i18n.getFixedT('en');
    const shape = (strings: (number | null)[], shortName: string) => ({
      name: shortName, shortName, type: 'barre' as const, cagedShape: 'E' as const, rootString: 6 as const, rootFretOffset: 0,
      strings: strings.map((fret) => ({ fret, finger: fret === null ? 0 : 1 })) as never,
    });
    // A add11 / C♯ as a611beb drew it: 9 0 0 x x 0, built at fret 2.
    expect(chordChipLabel({ shape: shape([7, -2, -2, null, null, -2], 'Pos 2/C#'), baseFret: 2 }, 0, t)).toBe('Fret 9/C#');
    expect(chordChipLabel({ shape: shape([0, 2, 2, 1, 0, 0], 'Open'), baseFret: 0 }, 0, t)).toBe('Open');
    // Capo 3: the lowest fret above it.
    expect(chordChipLabel({ shape: shape([0, 2, 2, 1, 0, 0], 'Pos 3'), baseFret: 3 }, 3, t)).toBe('Open');
    expect(chordChipLabel({ shape: shape([2, 0, 0, 1, null, null], 'Pos 4'), baseFret: 4 }, 3, t)).toBe('Fret 4');
  });
});

describe('the board shows the learner\'s names (Q1)', () => {
  for (const [lang, expected] of [['en', ['A barre', 'E barre']], ['pt', ['pestana de A', 'pestana de E']], ['es', ['cejilla de A', 'cejilla de E']]] as const) {
    it(`${lang}: Cmaj13's chips`, async () => {
      await i18n.changeLanguage(lang);
      useAppStore.setState({
        selectedKey: toNote('C'), selectedScale: 'major', selectedChord: buildChord(toNote('C'), 'major13'), chordInversion: 0,
        instrument: 'guitar', exerciseInputActive: false, guitarTuningId: 'standard', view: 'explore',
      });
      const { Fretboard } = await import('../Fretboard');
      render(<Fretboard />);
      const group = screen.getByRole('radiogroup', { name: i18n.t('fretboard.chordPosition') });
      expect(within(group).getAllByRole('radio').map((r) => r.textContent)).toEqual([...expected]);
    });
  }
});
