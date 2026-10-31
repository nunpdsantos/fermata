import { describe, it, expect } from 'vitest';
import { CHORD_QUALITY_NAMES } from '../../core/constants/chords';
import { CHORD_SCALE_MAP } from '../../core/constants/chordScaleRelationships';
import { CHORD_QUALITY_NAMES_ES, CHORD_QUALITY_NAMES_PT } from '../chordQualityNames';
import { chordQualityLabel, translateChordQuality } from '../content/musicTerms';
import { SCALE_CONTEXT_ES, SCALE_CONTEXT_PT, scaleContext } from '../scaleSuggestionContext';
import { qualityName } from '../../utils/qualityName';

const QUALITIES = Object.keys(CHORD_QUALITY_NAMES) as (keyof typeof CHORD_QUALITY_NAMES)[];
// Written the same in every language (the lessons use them as is).
const SAME_EVERYWHERE = new Set(['six_nine', 'sus2sus4']);

describe('chord-quality names in PT / ES (D-17, W11-A review)', () => {
  it.each(['pt', 'es'] as const)('%s: every quality has its own name — no English fallback', (lang) => {
    const table = lang === 'pt' ? CHORD_QUALITY_NAMES_PT : CHORD_QUALITY_NAMES_ES;
    expect(Object.keys(table).sort()).toEqual([...QUALITIES].sort());
    for (const q of QUALITIES) {
      const name = qualityName(q, lang);
      expect(name, q).toBe(table[q]);
      expect(name.trim(), q).not.toBe('');
      expect(name, `${q} leaks an id`).not.toMatch(/_|[a-z]\d+[a-z]/i);
      if (!SAME_EVERYWHERE.has(q)) expect(name, `${q} is still English`).not.toBe(CHORD_QUALITY_NAMES[q]);
    }
  });

  it.each(['pt', 'es'] as const)('%s: the same name the exercises use, where the exercise dictionary has one', (lang) => {
    for (const q of QUALITIES) {
      const known = translateChordQuality(q, lang) !== q.replace(/_/g, ' ');
      if (known) expect(qualityName(q, lang), q).toBe(chordQualityLabel(q, lang));
    }
  });

  it('English keeps the English names', () => {
    for (const q of QUALITIES) expect(qualityName(q, 'en')).toBe(CHORD_QUALITY_NAMES[q]);
    expect(qualityName('not_a_quality', 'pt')).toBe('not a quality');
  });
});

describe('scale-suggestion notes (chord panel tooltips) in PT / ES', () => {
  const contexts = new Set(
    Object.values(CHORD_SCALE_MAP).flatMap((list) => list.map((s) => s.context).filter((c): c is string => !!c)),
  );

  it('every note has a PT and an ES translation, and no translation is stale', () => {
    expect(contexts.size).toBeGreaterThan(50);
    for (const table of [SCALE_CONTEXT_PT, SCALE_CONTEXT_ES]) {
      expect(Object.keys(table).sort()).toEqual([...contexts].sort());
      for (const [en, tr] of Object.entries(table)) {
        expect(tr.trim(), en).not.toBe('');
        expect(tr, `${en} left in English`).not.toBe(en);
      }
    }
  });

  it('English passes through; PT/ES never fall back to English', () => {
    const one = [...contexts][0];
    expect(scaleContext(one, 'en')).toBe(one);
    expect(scaleContext(one, 'pt')).toBe(SCALE_CONTEXT_PT[one]);
    expect(scaleContext(one, 'es')).toBe(SCALE_CONTEXT_ES[one]);
    expect(scaleContext('An unknown English note', 'pt')).toBeUndefined();
    expect(scaleContext(undefined, 'es')).toBeUndefined();
  });
});
