/**
 * Audit W9-24 (C-86): "Learn about this" must open a lesson that actually
 * TEACHES the chord. Twelve qualities used to land on lessons that never name
 * them (sus / 6 / 6-9 / add chords on l7u21m1, augmented-seventh types on the
 * five-qualities lesson l3u9m1).
 *
 * Each quality carries a pattern its target lesson's text must contain. A
 * quality mapped to null (no lesson teaches it) must have NO lesson in L1–L8
 * matching its pattern — if one is written later, this test says to map it.
 * L9 (ear training) is excluded on purpose: it practises, it does not teach.
 */
import { describe, it, expect } from 'vitest';
import { QUALITY_TO_MODULE } from '../qualityToModule';
import { CHORD_FORMULAS } from '../../core/constants/chords';
import type { ChordQuality } from '../../core/types/music';
import type { CurriculumModule, CurriculumUnit } from '../../core/types/curriculum';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import { L2_UNITS } from '../../core/constants/curriculumL2';
import { L3_UNITS } from '../../core/constants/curriculumL3';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L5_UNITS } from '../../core/constants/curriculumL5';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';

const TEACHING_UNITS: CurriculumUnit[] = [
  ...L1_UNITS, ...L2_UNITS, ...L3_UNITS, ...L4_UNITS,
  ...L5_UNITS, ...L6_UNITS, ...L7_UNITS, ...L8_UNITS,
];
const MODULES = new Map<string, CurriculumModule>(
  TEACHING_UNITS.flatMap((u) => u.modules).map((m) => [m.id, m]),
);
const textOf = (m: CurriculumModule) => JSON.stringify(m);

// What the target lesson must say for the link to be honest.
const TEACHES: Record<ChordQuality, RegExp> = {
  major: /major triad/i,
  minor: /Minor = minor 3rd/,
  diminished: /Diminished = minor 3rd/,
  augmented: /Augmented = major 3rd/,
  major6: /added-tone/i,
  minor6: /added-tone/i,
  six_nine: /6\/9/,
  minor_six_nine: /6\/9/,
  add9: /add9/,
  add11: /added-tone/i,
  major7: /maj7/,
  minor7: /m7/,
  diminished7: /fully diminished|dim7/i,
  half_diminished7: /half-diminished/i,
  minor_major7: /minor-major/i,
  augmented7: /7#5/,
  augmented_major7: /\+maj7/,
  diminished_major7: /dim\(maj7\)|diminished[- ]major/i,
  major7flat5: /maj7b5|maj7\(b5\)|major seventh flat five/i,
  dominant7: /dominant seventh/i,
  sus2: /sus2/,
  sus4: /sus4/,
  sus2sus4: /sus2/,
  dominant7sus4: /7sus4/,
  dominant9sus4: /9sus4/,
  dominant7alt: /7alt/,
  dominant7flat9: /b9/,
  dominant7sharp9: /#9/,
  dominant7flat5: /b5/,
  dominant7sharp5: /#5/,
  dominant7sharp5flat9: /#5/,
  dominant7flat5flat9: /b5/,
  dominant7sharp5sharp9: /#5/,
  dominant7flat5sharp9: /b5/,
  major9: /maj9/,
  minor9: /m9|9th/,
  dominant9: /9th/,
  major11: /11th/,
  minor11: /m11/,
  dominant11: /11th/,
  dominant9sharp11: /#11/,
  dominant7sharp11: /#11/,
  major9sharp11: /#11/,
  major13: /13th/,
  minor13: /13th/,
  dominant13: /13th/,
  dominant13flat9: /b9/,
  dominant7flat13: /b13/,
  major7sharp11: /#11/,
  power: /power chord/i,
};

describe('W9-24 "Learn about this" lands on a lesson that teaches the chord', () => {
  it('every engine quality has a decision (lesson id or null)', () => {
    for (const q of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
      expect(q in QUALITY_TO_MODULE, `no decision for ${q}`).toBe(true);
    }
  });

  for (const quality of Object.keys(TEACHES) as ChordQuality[]) {
    const target = QUALITY_TO_MODULE[quality];
    if (target === null) {
      it(`${quality}: no lesson teaches it, so no link — and none in L1–L8 matches`, () => {
        const teachers = [...MODULES.values()].filter((m) => TEACHES[quality].test(textOf(m))).map((m) => m.id);
        expect(teachers, `${quality} is now taught in ${teachers.join(', ')} — map it`).toEqual([]);
      });
    } else {
      it(`${quality} → ${target} mentions it (${TEACHES[quality]})`, () => {
        const mod = MODULES.get(target);
        expect(mod, `${target} is not an L1–L8 lesson`).toBeDefined();
        expect(TEACHES[quality].test(textOf(mod!)), `${target} never names ${quality}`).toBe(true);
      });
    }
  }

  it('the twelve audited links point where C-86 says they are taught', () => {
    for (const q of ['major6', 'minor6', 'six_nine', 'minor_six_nine', 'add11', 'sus2', 'sus4', 'sus2sus4'] as const) {
      expect(QUALITY_TO_MODULE[q], q).toBe('l7u23m5'); // Suspended and Added-Tone Chords concept
    }
    expect(QUALITY_TO_MODULE.augmented7).toBe('l6u19m3'); // Chromatic Mediants and Altered Dominants (V7#5)
    expect(QUALITY_TO_MODULE.augmented_major7).toBe('l3u9m4'); // III+maj7 in harmonic minor
    expect(QUALITY_TO_MODULE.diminished_major7).toBeNull();
    expect(QUALITY_TO_MODULE.major7flat5).toBeNull();
  });
});
