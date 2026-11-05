import { describe, it, expect } from 'vitest';
import { translateLevelMetadata } from '../levelMetaResolver';
import type { LevelMeta } from '../../../data/curriculumLoader';

const SAMPLE_META: LevelMeta[] = [
  {
    id: 'l1',
    number: 1,
    title: 'Foundations',
    description: 'Staff and pitch',
    difficulty: 'beginner',
    difficultyLabel: 'Absolute Beginner',
    accentColor: '#60A5FA',
    prerequisites: [],
    unitCount: 3,
    moduleCount: 10,
  },
  {
    id: 'l2',
    number: 2,
    title: 'Expanding',
    description: 'Keys and minor',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    accentColor: '#38BDF8',
    prerequisites: ['l1'],
    unitCount: 4,
    moduleCount: 12,
  },
];

describe('translateLevelMetadata', () => {
  it('returns original array for English', () => {
    const result = translateLevelMetadata(SAMPLE_META, 'en');
    expect(result).toBe(SAMPLE_META);
  });

  it('translates to Portuguese', () => {
    const result = translateLevelMetadata(SAMPLE_META, 'pt');
    expect(result[0].title).toBe('Fundamentos da literacia musical');
    expect(result[1].title).toBe('Expansão dos fundamentos');
  });

  it('translates to Spanish', () => {
    const result = translateLevelMetadata(SAMPLE_META, 'es');
    expect(result[0].title).toBe('Fundamentos de lectura musical');
    expect(result[1].title).toBe('Expansión de los fundamentos');
  });

  it('preserves non-translated fields', () => {
    const result = translateLevelMetadata(SAMPLE_META, 'pt');
    expect(result[0].id).toBe('l1');
    expect(result[0].accentColor).toBe('#60A5FA');
    expect(result[0].moduleCount).toBe(10);
    expect(result[1].prerequisites).toEqual(['l1']);
  });

  it('does not mutate original', () => {
    translateLevelMetadata(SAMPLE_META, 'pt');
    expect(SAMPLE_META[0].title).toBe('Foundations');
  });
});
