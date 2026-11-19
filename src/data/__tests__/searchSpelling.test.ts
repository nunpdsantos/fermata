/**
 * Lesson search after the British spelling pass (19 November 2026).
 *
 * The lesson titles and subtitles are British now ("Compound Metre",
 * "neighbour tones", "Tonicisation"). A learner who types the American
 * spelling must get exactly what they got before: for every title or
 * subtitle word the pass changed, the American query returns the lessons it
 * returned on the base (77e0404, recorded there, in the same order), and the
 * British query returns the same lessons.
 */
import { describe, expect, it } from 'vitest';
import { findModulesByQuery, MODULE_INDEX, TITLE_AMERICAN, americanTitle } from '../moduleIndex';
import { SPELLINGS } from '../exercises/__tests__/respelling';
import { getResults, searchNames } from '../../components/navigation/quickSearchResults';

const find = (q: string) => findModulesByQuery(q, MODULE_INDEX.length).map((m) => m.id);

/** American query → British query → the ids the American query found on the base, in order. */
const PAIRS: readonly (readonly [string, string, readonly string[]])[] = [
  ['meter', 'metre', ['l1u2m2', 'l2u6m1', 'l4u14m2']],
  ['meters', 'metres', ['l4u14m2']],
  ['compound meter', 'compound metre', ['l2u6m1']],
  ['mixed meters', 'mixed metres', ['l4u14m2']],
  ['neighbor', 'neighbour', ['l3u11m4', 'l4u12m3', 'l9u32m2']],
  ['neighbor tone', 'neighbour tone', ['l3u11m4', 'l9u32m2']],
  ['neighbor tones', 'neighbour tones', ['l3u11m4', 'l9u32m2']],
  ['double-neighbor', 'double-neighbour', ['l4u12m3']],
  ['upward', 'upwards', ['l4u12m2']],
  ['resolved upward', 'resolved upwards', ['l4u12m2']],
  ['color', 'colour', ['l4u14m3', 'l5u16m4', 'l9u30m2']],
  ['chromatic color', 'chromatic colour', ['l4u14m3']],
  ['expressive color', 'expressive colour', ['l5u16m4']],
  ['overall color', 'overall colour', ['l9u30m2']],
  ['analyzing', 'analysing', ['l4u14m4']],
  ['tonicization', 'tonicisation', ['l5u15m4', 'l5u15m5']],
  ['sequential tonicization', 'sequential tonicisation', ['l5u15m5']],
  ['harmonization', 'harmonisation', ['l7u22m2', 'l6u20m4']],
  ['satb harmonization', 'satb harmonisation', ['l6u20m4']],
  ['realization', 'realisation', ['l6u20m4']],
  ['figured bass realization', 'figured bass realisation', ['l6u20m4']],
  ['reharmonization', 'reharmonisation', ['l7u22m2']],
  ['center', 'centre', ['l7u22m3']],
  ['three-key-center', 'three-key-centre', ['l7u22m3']],
  ['recognizing', 'recognising', ['l9u31m3']],
  ['recognizing special scales', 'recognising special scales', ['l9u31m3']],
  // found nothing before, finds nothing now: no lesson title says it
  ['harmonize', 'harmonise', []],
  ['key center', 'key centre', []],
];

describe('lesson search finds both spellings (British pass, 19 November 2026)', () => {
  it.each(PAIRS)('"%s" finds what it found before, and "%s" finds the same', (us, gb, before) => {
    expect(find(us)).toEqual(before);
    expect(find(gb)).toEqual(before);
  });

  const TITLES = MODULE_INDEX.flatMap((m) => [m.title, m.subtitle]);
  const fold = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const titleWords = new Set(TITLES.flatMap((t) => fold(t).match(/[a-z]+/g) ?? []));

  it('every British word of the word table in a title or subtitle is on the search list, with its American form (derived, not hand-listed)', () => {
    const british = new Map(SPELLINGS.map(([us, gb]) => [gb, us]));
    const missing = [...titleWords].filter((w) => british.has(w) && TITLE_AMERICAN[w] !== british.get(w));
    expect(missing).toEqual([]);
    // and the list holds nothing that is not in a title (it does not rot)
    expect(Object.keys(TITLE_AMERICAN).filter((w) => !titleWords.has(w))).toEqual([]);
    expect(TITLES.length).toBe(272);
  });

  it('the search list re-spells exactly its words and leaves every other word of the 272 titles and subtitles alone', () => {
    for (const t of TITLES) {
      const before = fold(t).match(/[a-z]+/g) ?? [];
      const after = americanTitle(t).match(/[a-z]+/g) ?? [];
      expect(after.length, t).toBe(before.length);
      before.forEach((w, i) => expect(after[i], `${w} in "${t}"`).toBe(TITLE_AMERICAN[w] ?? w));
    }
    const negatives = 'improvisation stepwise exercise otherwise raised precise noise rise wise surprise promise';
    expect(negatives.split(' ').filter((w) => titleWords.has(w)).length).toBeGreaterThan(1);
    expect(americanTitle(negatives)).toBe(negatives);
    expect(find('improvization')).toEqual([]);
    expect(find('stepwize')).toEqual([]);
  });

  it('a British learner who types the verb finds what the noun finds (the titles keep the noun "Practice")', () => {
    const noun = find('practice');
    expect(noun).toEqual(['l3u10m2', 'l4u14m4']);
    for (const verb of ['practise', 'practising', 'practised', 'Practise', 'practicing']) expect(find(verb), verb).toEqual(noun);
  });

  it('Quick Search (Cmd+K) lists the same lessons for both spellings, under their British titles', () => {
    const lessons = (q: string) => getResults(q, null, null, searchNames('en', false)).filter((r) => r.type === 'Lesson').map((r) => r.label);
    expect(lessons('compound meter')).toEqual(['Compound Metre: 6/8, 9/8, 12/8']);
    expect(lessons('neighbor tone')).toEqual(['Non-Chord Tones (Part 1)', 'Melodic Dictation: Chromatic']);
    expect(lessons('tonicization')).toEqual(['Tonicisation vs. Modulation', 'Dominant Chains and Sequential Tonicisation']);
    for (const [us, gb] of PAIRS) expect(lessons(us), us).toEqual(lessons(gb));
  });

  it('a British title is still found first by its own words', () => {
    expect(find('compound metre: 6/8')[0]).toBe('l2u6m1');
    expect(find('tonicisation vs. modulation')[0]).toBe('l5u15m4');
  });
});
