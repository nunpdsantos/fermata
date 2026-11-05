import { genRead } from '../../../core/utils/drillBank/genRead';
import { describe, expect, it } from 'vitest';
import { scaleStripTrim, staffTrim } from '../staffTrim';
import { exploreRegister } from '../exploreRegister';
import { staffLayout, staffPlan, staffLine, vexAccidentals, getKeySignatureForScale } from '../../../utils/notationHelpers';
import { buildScale, SCALE_FORMULAS } from '../../../core/constants/scales';
import { buildChord, CHORD_FORMULAS } from '../../../core/constants/chords';
import { getScaleNotesWithOctaves } from '../../../core/utils/pianoLayout';
import { SELECTABLE_ROOTS } from '../../../core/utils/__tests__/theoryOracle';
import type { ChordQuality, Note, PitchedNote, ScaleType } from '../../../core/types/music';

const note = (s: string) => ({ natural: s[0], accidental: s.slice(1) }) as Note;

it('every guitar scale strip shares piano flow for the same written notes, including both melodic directions', () => {
  for (const root of [...SELECTABLE_ROOTS, 'Cb', 'B#']) {
    for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
      const scale = buildScale(note(root), type);
      const sig = getKeySignatureForScale(scale.root, type) ?? undefined;
      const directions = [getScaleNotesWithOctaves(scale.notes, exploreRegister('guitar').octave)];
      if (type === 'melodic_minor') {
        directions.push(getScaleNotesWithOctaves(buildScale(note(root), 'natural_minor').notes, exploreRegister('guitar').octave).reverse());
      }
      for (const sounding of directions) {
        const plan = staffPlan(sounding, undefined, 'guitar', true);
        const guitar = scaleStripTrim(sounding, 'guitar', 80, sig);
        const piano = scaleStripTrim(plan.written, 'piano', 80, sig);
        expect(guitar.height - guitar.top - guitar.bottom).toBe(piano.height - piano.top - piano.bottom);
        // All ink remains in the original SVG, with the 8 inside the extra
        // 40px label band. Notes and accidentals still have full flow space.
        const layout = staffLayout(plan.written, plan.clef, 80, { annotation: '8vb', duration: 'w', keySignature: sig });
        expect(layout.staveY + 105.12).toBeLessThanOrEqual(guitar.height);
        expect(layout.staveY + 105.12).toBeLessThanOrEqual(guitar.height - guitar.bottom + 40);
        const accs = vexAccidentals(plan.written, sig);
        plan.written.forEach((n, i) => {
          const below = ['#', 'n'].includes(accs[i] ?? '') ? 14 : 8;
          expect(layout.staveY + 90 - 10 * staffLine(n, plan.clef) + below).toBeLessThanOrEqual(guitar.height - guitar.bottom);
        });
      }
    }
  }
});

function check(notes: PitchedNote[], instrument: string, keySignature?: string, height = 80) {
  const plan = staffPlan(notes, undefined, instrument, true);
  const layout = staffLayout(plan.written, plan.clef, height, { annotation: plan.annotation, duration: 'w', keySignature });
  const trim = staffTrim(notes, instrument, height, keySignature);
  const top = trim.top - layout.staveY;
  const bottom = trim.height - trim.bottom - layout.staveY;
  // Independent glyph outline + stroke bounds, not the production bounds helper.
  expect(top).toBeLessThanOrEqual(26.08);
  expect(bottom).toBeGreaterThanOrEqual(instrument === 'guitar' ? 105.12 : 96.329);
  expect(top).toBeLessThanOrEqual(40);
  expect(bottom).toBeGreaterThanOrEqual(81);
  const accs = vexAccidentals(plan.written, keySignature);
  plan.written.forEach((n, i) => {
    const y = 90 - 10 * staffLine(n, plan.clef);
    const above = ['b', 'bb'].includes(accs[i] ?? '') ? 17.56 : ['#', 'n'].includes(accs[i] ?? '') ? 14 : 8;
    const below = ['#', 'n'].includes(accs[i] ?? '') ? 14 : 8;
    expect(y - above).toBeGreaterThanOrEqual(top);
    expect(y + below).toBeLessThanOrEqual(bottom);
  });
  expect(trim.height).toBe(layout.height);
}

describe('Explore visible ink across the complete root / scale / chord selections', () => {
  for (const instrument of ['piano', 'guitar'] as const) {
    it(`${instrument}: every scale, including both classical melodic minor directions`, () => {
      for (const root of [...SELECTABLE_ROOTS, 'Cb', 'B#']) {
        for (const type of Object.keys(SCALE_FORMULAS) as ScaleType[]) {
          const scale = buildScale(note(root), type);
          const sig = getKeySignatureForScale(scale.root, type) ?? undefined;
          check(getScaleNotesWithOctaves(scale.notes, exploreRegister(instrument).octave), instrument, sig);
          if (type === 'melodic_minor') {
            const down = buildScale(note(root), 'natural_minor');
            check(getScaleNotesWithOctaves(down.notes, exploreRegister(instrument).octave).reverse(), instrument, sig);
          }
        }
      }
    });
    it(`${instrument}: every chord quality and inversion, including guitar slash bass`, () => {
      for (const root of SELECTABLE_ROOTS) {
        for (const quality of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
          const chord = buildChord(note(root), quality);
          for (let inversion = 0; inversion < chord.notes.length; inversion++) {
            const voiced = [...chord.notes.slice(inversion), ...chord.notes.slice(0, inversion)];
            check(exploreRegister(instrument).chordPitches(voiced), instrument);
            if (instrument === 'guitar') check(exploreRegister(instrument).chordPitches(voiced, note('G')), instrument);
          }
        }
      }
    });
  }
});

it('every Drill reading prompt fits after trimming, including high/low accidentals', () => {
  const prompts = genRead();
  expect(prompts.length).toBeGreaterThan(200);
  for (const { staff } of prompts) check([staff.sounding], 'guitar', undefined, 150);
});

it('quarter-note chord trim preserves a down stem below the bottom staff line', () => {
  // G5 is further above the middle line than E4 is below it: stem DOWN,
  // extending from the lowest head at y=80 to y=115, plus stroke clearance.
  const notes: PitchedNote[] = [
    { natural: 'E', accidental: '', octave: 4 },
    { natural: 'G', accidental: '', octave: 5 },
  ];
  const trim = staffTrim(notes, 'piano', 80, undefined, { duration: 'q', chord: true });
  expect(trim.height - trim.bottom).toBeGreaterThanOrEqual(116);
  expect(trim.top).toBeLessThanOrEqual(26);
});
