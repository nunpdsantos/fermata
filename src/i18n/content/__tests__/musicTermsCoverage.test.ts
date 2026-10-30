/**
 * W6-13 — music-terms dictionary gaps.
 *
 * Every chord quality, scale type and direction a template can put into a
 * prompt or an answer label has a real PT and ES name (no raw-key fallback),
 * and ear-training answer buttons read as labels ("Sétima da dominante"),
 * never with the leading preposition the in-sentence form needs
 * ("De sétima da dominante").
 */
import { describe, it, expect } from 'vitest';
import {
  translateChordQuality,
  translateScaleType,
  translateDirection,
  chordQualityLabel,
} from '../musicTerms';
import { generateAllForLevel } from '../../../data/exercises/exerciseGenerator';
import type { ModuleTemplateConfig } from '../../../data/exercises/exerciseTemplates';
import t1 from '../../../data/exercises/templatesL1';
import t2 from '../../../data/exercises/templatesL2';
import t3 from '../../../data/exercises/templatesL3';
import t4 from '../../../data/exercises/templatesL4';
import t5 from '../../../data/exercises/templatesL5';
import t6 from '../../../data/exercises/templatesL6';
import t7 from '../../../data/exercises/templatesL7';
import t8 from '../../../data/exercises/templatesL8';
import t9 from '../../../data/exercises/templatesL9';

const LEVELS: ModuleTemplateConfig[][] = [t1, t2, t3, t4, t5, t6, t7, t8, t9];
const TEMPLATES = LEVELS.flat().flatMap((c) => c.templates);
const used = (pick: (p: (typeof TEMPLATES)[number]['params']) => string[] | undefined) =>
  [...new Set(TEMPLATES.flatMap((t) => pick(t.params) ?? []))].sort();

const raw = (key: string) => key.replace(/_/g, ' ');

describe('every term a template uses has a PT and ES name', () => {
  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: chord qualities`, () => {
      const missing = used((p) => p.chordQualities).filter((q) => translateChordQuality(q, lang) === raw(q));
      expect(missing).toEqual([]);
    });
    it(`${lang}: scale types`, () => {
      const missing = used((p) => p.scaleTypes).filter((s) => s !== 'blues' && translateScaleType(s, lang) === raw(s));
      expect(missing).toEqual([]);
    });
    it(`${lang}: directions`, () => {
      const missing = used((p) => p.directions).filter((d) => translateDirection(d, lang) === raw(d));
      expect(missing).toEqual([]);
    });
  }

  it('the harmonic-minor sevenths have names in all three languages', () => {
    expect(translateChordQuality('minor_major7', 'pt')).toBe('menor com 7.ª M');
    expect(translateChordQuality('augmented_major7', 'es')).toBe('aumentado con 7.ª M');
    expect(translateChordQuality('minor_major7', 'en')).toBe('minor-major 7th');
  });
});

describe('chord-quality answer labels', () => {
  it.each([
    ['dominant7', 'pt', 'Sétima da dominante'],
    ['diminished7', 'pt', 'Sétima diminuta'],
    ['dominant9', 'pt', 'Nona da dominante'],
    ['dominant7', 'es', 'Séptima de dominante'],
    ['half_diminished7', 'es', 'Semidisminuido'],
    ['dominant7', 'en', 'Dominant 7th'],
    ['major7', 'en', 'Major 7th'],
  ] as const)('%s (%s) → "%s"', (key, lang, label) => {
    expect(chordQualityLabel(key, lang)).toBe(label);
  });

  for (const lang of ['pt', 'es'] as const) {
    it(`${lang}: no generated ear-training choice starts with a preposition`, () => {
      const bad: string[] = [];
      for (const configs of LEVELS) {
        for (const exercises of Object.values(generateAllForLevel(configs, lang))) {
          for (const ex of exercises) {
            if (ex.config.type !== 'ear_training' || !ex.config.choices) continue;
            for (const c of ex.config.choices) if (/^de\s/i.test(c.label)) bad.push(`${ex.id}: ${c.label}`);
          }
        }
      }
      expect(bad).toEqual([]);
    });
  }
});
