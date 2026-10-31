/**
 * Audit W2-04 / W2-08 / W1-11 / W1-12 / W1-14 — diatonic harmony and chord
 * formula labels, checked exhaustively against the independent oracle.
 *
 * Decision for 8-note scales (documented in chords.ts): a bebop scale is its
 * parent mode plus one chromatic passing tone, so its "diatonic" chords are the
 * parent mode's stacked-thirds triads on the parent degrees (no chord on the
 * passing tone). The two diminished (octatonic) scales get none: every
 * alternate-note stack is the same diminished chord, so there is no tertian
 * set of seven degrees to number.
 */
import { describe, it, expect } from 'vitest';
import type { ChordQuality, Note, ScaleType } from '../../types/music';
import { buildScale, SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../scales';
import {
  getDiatonicChordsForScale,
  getChordShortIntervalLabels,
  getChordIntervalLabels,
  buildChord,
  CHORD_FORMULAS,
  INTERVAL_LABELS,
  INTERVAL_SHORT_LABELS,
} from '../chords';
import {
  ORACLE_SCALES,
  SELECTABLE_ROOTS,
  stackedTriads,
  oracleNumeral,
  spellDegree as oracleSpell,
  pcOf,
  letterDegree,
  mod12,
} from '../../utils/__tests__/theoryOracle';

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const str = (n: Note) => `${n.natural}${n.accidental}`;
const QUALITY_CODE: Record<string, string> = { major: 'M', minor: 'm', diminished: 'd', augmented: 'A' };
const CHURCH = new Set(['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian']);
const BEBOP_PARENT: Record<string, string> = { bebop_dominant: 'mixolydian', bebop_major: 'major', bebop_dorian: 'dorian' };

/** Oracle expectation: [root, quality code, numeral] for each chord shown. */
function expected(type: string, root: string): [string, string, string][] {
  const parentType = BEBOP_PARENT[type] ?? type;
  const or = ORACLE_SCALES[parentType];
  if (!or || or.semis.length !== 7) return [];
  const triads = stackedTriads(or.semis);
  const out: [string, string, string][] = [];
  triads.forEach((q, i) => {
    if (!q) return;
    const alt = /^(b|#)?/.exec(or.degrees[i])![1];
    const prefix = CHURCH.has(parentType) && alt ? (alt === 'b' ? '♭' : '♯') : '';
    out.push([oracleSpell(root, or.degrees[i])!, q, oracleNumeral(i, q, prefix)]);
  });
  return out;
}

describe('W2-04 — diatonic chords are stacked thirds within the scale', () => {
  const types = Object.keys(SCALE_FORMULAS) as ScaleType[];
  for (const type of types) {
    it(`${type} on every selectable root`, () => {
      for (const root of SELECTABLE_ROOTS) {
        const scale = buildScale(toNote(root), type);
        const got = getDiatonicChordsForScale(scale);
        const scalePcs = new Set(scale.notes.map((n) => pcOf(str(n))));
        // never a note outside the scale
        for (const dc of got) {
          for (const n of dc.chord.notes) expect(scalePcs.has(pcOf(str(n))), `${root} ${type}: ${str(n)} in ${dc.numeral}`).toBe(true);
        }
        const want = expected(type, root);
        expect(
          got.map((dc) => [str(dc.chord.root), QUALITY_CODE[dc.chord.quality] ?? dc.chord.quality, dc.numeral]),
          `${root} ${type}`,
        ).toEqual(want);
      }
    });
  }

  it('the degree field is the scale degree number of the chord root', () => {
    const c = (t: ScaleType) => getDiatonicChordsForScale(buildScale(toNote('C'), t)).map((d) => d.degree);
    expect(c('major')).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(c('bebop_dominant')).toEqual([1, 2, 3, 4, 5, 6, 7]);
    // Persian: only degrees whose letter-thirds make a triad
    expect(getDiatonicChordsForScale(buildScale(toNote('C'), 'persian')).every((d) => d.degree >= 1 && d.degree <= 7)).toBe(true);
  });

  it('non-heptatonic scales and the diminished scales have none', () => {
    for (const t of ['pentatonic_major', 'pentatonic_minor', 'blues', 'major_blues', 'whole_tone', 'chromatic', 'hirajoshi', 'in_sen', 'iwato', 'egyptian', 'diminished_whole_half', 'diminished_half_whole'] as ScaleType[]) {
      expect(getDiatonicChordsForScale(buildScale(toNote('C'), t)), t).toEqual([]);
    }
  });
});

describe('W2-08 — church-mode numerals are written against the parallel major', () => {
  it('C mixolydian has bVII, C phrygian bII, C lydian #iv°', () => {
    const n = (t: ScaleType) => getDiatonicChordsForScale(buildScale(toNote('C'), t)).map((d) => d.numeral);
    expect(n('mixolydian')).toEqual(['I', 'ii', 'iii°', 'IV', 'v', 'vi', '♭VII']);
    expect(n('phrygian')).toEqual(['i', '♭II', '♭III', 'iv', 'v°', '♭VI', '♭vii']);
    expect(n('lydian')).toEqual(['I', 'II', 'iii', '♯iv°', 'V', 'vi', 'vii']);
    expect(n('dorian')).toEqual(['i', 'ii', '♭III', 'IV', 'v', 'vi°', '♭VII']);
    expect(n('locrian')).toEqual(['i°', '♭II', '♭iii', 'iv', '♭V', '♭VI', '♭vii']);
    // classical minor keeps III, VI, VII (not a church mode)
    expect(n('natural_minor')).toEqual(['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII']);
    expect(n('major')).toEqual(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
  });
});

describe('W1-11 / W1-12 — chord formula labels are read from the spelled chord (b3 style)', () => {
  const qualities = Object.keys(CHORD_FORMULAS) as ChordQuality[];
  it('every label names the letter and pitch of its chord tone, for every quality and root', () => {
    const bad: string[] = [];
    for (const q of qualities) {
      const labels = getChordShortIntervalLabels(q);
      if (labels.some((l) => /^[mMPAd]/.test(l))) bad.push(`${q}: m3-style label in ${labels.join(' ')}`);
      for (const root of SELECTABLE_ROOTS) {
        const chord = buildChord(toNote(root), q);
        labels.forEach((label, i) => {
          const note = str(chord.notes[i]);
          const m = /^(bb|b|##|#)?(\d+|R)$/.exec(label);
          if (!m) { bad.push(`${q}: bad label ${label}`); return; }
          const num = m[2] === 'R' ? 1 : Number(m[2]);
          const simple = ((num - 1) % 7) + 1;
          // Skip the rare B#/Fb-rooted respelled tones (letter rule yields past 𝄪/𝄫).
          if (oracleSpell(root, `${m[1] ?? ''}${simple}`) === null) return;
          if (letterDegree(root, note) !== simple) bad.push(`${root}${q}: "${label}" over ${note}`);
          if (oracleSpell(root, `${m[1] ?? ''}${simple}`) !== note) bad.push(`${root}${q}: "${label}" is not ${note}`);
        });
      }
    }
    expect(bad).toEqual([]);
  });

  it('diminished 7th reads R b3 b5 bb7; minor reads R b3 5; augmented R 3 #5', () => {
    expect(getChordShortIntervalLabels('diminished7')).toEqual(['R', 'b3', 'b5', 'bb7']);
    expect(getChordIntervalLabels('diminished7')[3]).toBe('Diminished 7th');
    expect(getChordShortIntervalLabels('minor')).toEqual(['R', 'b3', '5']);
    expect(getChordShortIntervalLabels('augmented')).toEqual(['R', '3', '#5']);
    expect(getChordShortIntervalLabels('dominant7alt')).toEqual(['R', '3', 'b7', 'b9', '#9', '#11', 'b13']);
  });

  it('long labels agree with the short ones (Minor 3rd, Augmented 11th, Major 13th)', () => {
    expect(getChordIntervalLabels('minor9')).toEqual(['Root', 'Minor 3rd', 'Perfect 5th', 'Minor 7th', 'Major 9th']);
    expect(getChordIntervalLabels('dominant9sharp11')[5]).toBe('Augmented 11th');
    expect(getChordIntervalLabels('major13')[5]).toBe('Major 13th');
  });
});

describe('W1-13 — Lydian augmented raised 5th is named, not called Dominant', () => {
  it('index 4 at 8 semitones is the augmented fifth; 7 dominant; 6 tritone', () => {
    expect(getScaleDegreeFunctionKey(4, 8)).toBe('degreeShort.augFifth');
    expect(getScaleDegreeFunctionKey(4, 7)).toBe('degreeShort.dominant');
    expect(getScaleDegreeFunctionKey(4, 6)).toBe('degreeShort.tritone');
  });
});

describe('W1-14 — 16 semitones is a major 10th', () => {
  it('names it Major 10th / 10', () => {
    expect(INTERVAL_LABELS[16]).toBe('Major 10th');
    expect(INTERVAL_SHORT_LABELS[16]).toBe('10');
    expect(mod12(16)).toBe(4);
  });
});
