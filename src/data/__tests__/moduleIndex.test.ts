import { describe, it, expect } from 'vitest';
import { MODULE_INDEX, findModulesByQuery } from '../moduleIndex';

describe('moduleIndex', () => {
  it('contains 118 required and three optional curriculum modules', () => {
    expect(MODULE_INDEX).toHaveLength(121);
  });

  it('has no duplicate ids', () => {
    const ids = MODULE_INDEX.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('derives level, unitId, and 1-indexed moduleIndex correctly', () => {
    const m = MODULE_INDEX.find((e) => e.id === 'l1u3m4');
    expect(m).toBeDefined();
    expect(m!.level).toBe('l1');
    expect(m!.unitId).toBe('u3');
    expect(m!.moduleIndex).toBe(4);
  });
});

describe('findModulesByQuery', () => {
  it('returns nothing for queries shorter than 2 chars', () => {
    expect(findModulesByQuery('')).toEqual([]);
    expect(findModulesByQuery('a')).toEqual([]);
  });

  it('matches on title substring (Neapolitan → Neapolitan Chord module)', () => {
    const hits = findModulesByQuery('neapolitan');
    expect(hits.map((h) => h.id)).toContain('l6u18m1');
  });

  it('matches on keywords so concept searches hit bundled modules (dorian)', () => {
    // "Dorian" isn't in any module title, but it's a keyword on the modal
    // harmony and modal scale-recognition modules.
    const hits = findModulesByQuery('dorian');
    const ids = hits.map((h) => h.id);
    expect(ids).toContain('l7u22m4'); // Modal Harmony Fundamentals
    expect(ids).toContain('l9u31m2'); // Scale Recognition: Modes
  });

  it('matches ii-V-I by keyword', () => {
    const hits = findModulesByQuery('ii-v-i');
    expect(hits.map((h) => h.id)).toContain('l7u21m3');
  });

  it('matches fugue by title', () => {
    const hits = findModulesByQuery('fugue');
    expect(hits.map((h) => h.id)).toContain('l8u25m1');
  });

  it('ranks exact title matches above substring matches', () => {
    const hits = findModulesByQuery('transposition');
    expect(hits[0].id).toBe('l3u11m5'); // title is exactly "Transposition"
  });

  it('is case-insensitive', () => {
    const upper = findModulesByQuery('FUGUE');
    const lower = findModulesByQuery('fugue');
    expect(upper.map((h) => h.id)).toEqual(lower.map((h) => h.id));
  });

  it('respects the limit', () => {
    const hits = findModulesByQuery('chord', 3);
    expect(hits.length).toBeLessThanOrEqual(3);
  });
});
