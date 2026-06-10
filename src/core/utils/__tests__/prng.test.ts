import { describe, expect, it } from 'vitest';
import { mulberry32, seededShuffle } from '../prng';

describe('mulberry32', () => {
  it('is deterministic per seed', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it('yields values in [0,1)', () => {
    const r = mulberry32(7);
    for (let i = 0; i < 1000; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('seededShuffle', () => {
  it('is a permutation and deterministic per seed', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const s1 = seededShuffle(arr, mulberry32(1));
    const s2 = seededShuffle(arr, mulberry32(1));
    expect(s1).toEqual(s2);
    expect([...s1].sort((x, y) => x - y)).toEqual(arr);
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
  it('empty array returns []', () => {
    const empty: number[] = [];
    const result = seededShuffle(empty, mulberry32(42));
    expect(result).toEqual([]);
  });
  it('single element returns same', () => {
    const single = [1];
    const result = seededShuffle(single, mulberry32(42));
    expect(result).toEqual([1]);
  });
  it('two-element with seed 7 produces a swap', () => {
    const pair = [1, 2];
    const result = seededShuffle(pair, mulberry32(7));
    expect(result).toEqual([2, 1]);
    expect([...result].sort((x, y) => x - y)).toEqual([1, 2]);
  });
  it('different seeds produce (usually) different order for an 8-element array', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8];
    const s1 = seededShuffle(arr, mulberry32(1));
    const s3 = seededShuffle(arr, mulberry32(99));
    expect(s1).not.toEqual(s3);
  });
});
