import { describe, it, expect } from 'vitest';
import registry from '../../../scripts/pages/slugs.json';
import { MODULE_INDEX } from '../../data/moduleIndex';
import { siteLessons } from '../content';
import { addMissingSlugs, MAX_SLUG_LENGTH, registryProblems, slugify, SLUG_FORM, type SlugRegistry } from '../slugs';
import { buildSite, sitePath } from '../render';

/**
 * The slug registry (scripts/pages/slugs.json): every lesson, unique per
 * language, in the frozen form; the build reads it and never the title, so a
 * changed title never moves a page; a lesson missing from it fails the build.
 */
const REGISTRY = registry as SlugRegistry;
const ids = siteLessons('en').map((l) => l.module.id);

describe('the slug registry', () => {
  it('has every lesson (the 136 of the module index) and nothing else, unique per language, in the frozen form', () => {
    expect(ids).toHaveLength(136);
    expect([...ids].sort()).toEqual(MODULE_INDEX.map((m) => m.id).sort());
    expect(Object.keys(REGISTRY).sort()).toEqual([...ids].sort());
    expect(registryProblems(REGISTRY, ids)).toEqual([]);
    for (const entry of Object.values(REGISTRY)) {
      for (const slug of Object.values(entry)) {
        expect(slug).toMatch(SLUG_FORM);
        expect(slug.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH);
      }
    }
  });

  it('a lesson missing from it fails the build, naming the lesson and the command that adds it', () => {
    const { l2u5m1: _gone, ...rest } = REGISTRY;
    expect(registryProblems(rest, ids)).toEqual([expect.stringContaining('lesson l2u5m1 has no address')]);
    expect(() => buildSite(rest)).toThrow(/l2u5m1 has no address[\s\S]*npm run pages:slugs/);
  });

  it('finds a slug used twice, a malformed slug and an entry for no lesson', () => {
    const twice = { ...REGISTRY, l1u1m2: { ...REGISTRY.l1u1m2, pt: REGISTRY.l1u1m1.pt } };
    expect(registryProblems(twice, ids)).toEqual([expect.stringContaining('share the pt address')]);
    const malformed = { ...REGISTRY, l1u1m2: { ...REGISTRY.l1u1m2, es: 'Líneas adicionales' } };
    expect(registryProblems(malformed, ids)).toEqual([expect.stringContaining('is not a slug')]);
    const stray = { ...REGISTRY, l9u99m1: { en: 'a', pt: 'b', es: 'c' } };
    expect(registryProblems(stray, ids)).toEqual([expect.stringContaining('l9u99m1, which is no lesson')]);
  });

  it('is frozen: the page lives where the registry says, whatever the title', () => {
    const moved = { ...REGISTRY, l1u3m1: { ...REGISTRY.l1u3m1, en: 'a-frozen-address' } };
    const paths = buildSite(moved).pages.map((p) => p.path);
    expect(paths).toContain('/en/lessons/a-frozen-address/');
    expect(paths).not.toContain(sitePath.lesson('en', slugify('The Major Scale')));
  });

  it('adding never changes an entry that is there, and gives a new lesson a free slug', () => {
    const titles = { en: 'The Major Scale', pt: 'A escala maior', es: 'La escala mayor' };
    const { registry: next, added } = addMissingSlugs(REGISTRY, [
      { id: 'l1u3m1', level: 1, titles: { en: 'A New Title', pt: 'Um título novo', es: 'Un título nuevo' } },
      { id: 'l1u3m9', level: 1, titles },
    ]);
    expect(next.l1u3m1).toEqual(REGISTRY.l1u3m1);
    expect(added).toEqual(['l1u3m9']);
    // The new lesson's title is taken in every language: its level makes it unique.
    expect(next.l1u3m9).toEqual({ en: 'the-major-scale-level-1', pt: 'a-escala-maior-level-1', es: 'la-escala-mayor-level-1' });
    expect(registryProblems(next, [...ids, 'l1u3m9'])).toEqual([]);
  });
});

describe('slugify', () => {
  it.each([
    ['The Major Scale', 'the-major-scale'],
    ['Função harmónica: T → PD → D → T', 'funcao-harmonica-t-pd-d-t'],
    ['Modulación enarmónica: Gr+6 <-> V7', 'modulacion-enarmonica-gr-6-v7'],
    ['Sétimas da sensível: viiø7 e vii°7', 'setimas-da-sensivel-vii-7-e-vii-7'],
    ['Compound Meter (6/8, 9/8, 12/8)', 'compound-meter-6-8-9-8-12-8'],
    ['  — Äpfel & Œuvre —  ', 'apfel-oeuvre'],
  ])('%s → %s', (title, slug) => {
    expect(slugify(title)).toBe(slug);
  });

  it('cuts a long title at a word, within the limit', () => {
    const slug = slugify('Forbidden Parallels and Voice Motion in Common Practice Harmony Writing');
    expect(slug.length).toBeLessThanOrEqual(MAX_SLUG_LENGTH);
    expect(slug).toBe('forbidden-parallels-and-voice-motion-in-common-practice');
  });
});
