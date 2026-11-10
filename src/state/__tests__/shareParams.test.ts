import { describe, it, expect } from 'vitest';
import {
  SHARE_PARAM_KEYS,
  hasShareParams,
  readShareParams,
  cleanedAddress,
  buildShareSearch,
  buildShareUrl,
  MAX_SHARE_VALUE_LENGTH,
  MAX_SHARE_SEARCH_LENGTH,
  noteBootAddress,
  openedFromShareLink,
} from '../shareParams';

describe('shareParams — the contract other branches import', () => {
  it('keeps its exported names and meaning', () => {
    expect(SHARE_PARAM_KEYS).toEqual(['key', 'scale', 'chord', 'inst', 'lesson']);
    expect(hasShareParams('?key=D')).toBe(true);
    expect(hasShareParams('?lesson=l2u7m5')).toBe(true);
    // `view` alone is the Drill shortcut, not a shared link.
    expect(hasShareParams('?view=drill')).toBe(false);
    expect(hasShareParams('')).toBe(false);
    expect(hasShareParams('?debug=1')).toBe(false);
  });
});

describe('readShareParams', () => {
  it('reads the raw values, first of each name only', () => {
    expect(readShareParams('?key=Eb&scale=major&chord=Am7&inst=guitar&lesson=l2u7m5')).toEqual({
      key: 'Eb', scale: 'major', chord: 'Am7', inst: 'guitar', lesson: 'l2u7m5',
    });
    expect(readShareParams('?key=D&key=E')).toEqual({ key: 'D' });
    expect(readShareParams('?key=F%23&chord=G%2FB')).toEqual({ key: 'F#', chord: 'G/B' });
  });

  it('returns null without share parameters (the Drill shortcut keeps working as before)', () => {
    expect(readShareParams('')).toBeNull();
    expect(readShareParams('?view=drill')).toBeNull();
    expect(readShareParams('?view=drill&debug=1')).toBeNull();
  });

  it('drops an over-long value, and everything in an over-long query', () => {
    const long = 'x'.repeat(MAX_SHARE_VALUE_LENGTH + 1);
    expect(readShareParams(`?key=D&chord=${long}`)).toEqual({ key: 'D' });
    expect(readShareParams(`?key=D&pad=${'y'.repeat(MAX_SHARE_SEARCH_LENGTH)}`)).toEqual({});
  });

  it('recovers a hand-typed # that the browser took for the fragment', () => {
    // fermata/?key=F#&inst=guitar → search "?key=F", hash "#&inst=guitar"
    expect(readShareParams('?key=F', '#&inst=guitar')).toEqual({ key: 'F#', inst: 'guitar' });
    expect(readShareParams('?key=F', '#')).toEqual({ key: 'F#' });
    expect(readShareParams('?key=D&chord=C', '#m7')).toEqual({ key: 'D', chord: 'C#m7' });
    expect(readShareParams('?chord=C', '#m7&inst=piano')).toEqual({ chord: 'C#m7', inst: 'piano' });
    // Not after a key / chord value: the fragment is left alone.
    expect(readShareParams('?inst=guitar', '#&key=D')).toEqual({ inst: 'guitar' });
  });
});

describe('cleanedAddress', () => {
  it('takes out the link and view, keeps the rest', () => {
    expect(cleanedAddress('/', '?key=D&scale=major&inst=guitar')).toBe('/');
    expect(cleanedAddress('/', '?view=drill&debug=1')).toBe('/?debug=1');
    expect(cleanedAddress('/', '?debug=1&lesson=l2u7m5&view=learn', '#x')).toBe('/?debug=1#x');
  });

  it('drops a fragment that held part of the link', () => {
    expect(cleanedAddress('/', '?key=F', '#&inst=guitar')).toBe('/');
    expect(cleanedAddress('/', '?debug=1&chord=C', '#m7')).toBe('/?debug=1');
  });
});

describe('buildShareSearch / buildShareUrl', () => {
  it('writes the grammar’s order, # as %23, / as %2F, nothing empty', () => {
    expect(buildShareSearch({ inst: 'guitar', chord: 'A', scale: 'major', key: 'D' })).toBe('?key=D&scale=major&chord=A&inst=guitar');
    expect(buildShareSearch({ key: 'F#', chord: 'G/B' })).toBe('?key=F%23&chord=G%2FB');
    expect(buildShareSearch({})).toBe('');
    expect(buildShareUrl('https://example.test', { lesson: 'l2u7m5' })).toBe('https://example.test/?lesson=l2u7m5');
  });

  it('reads back what it writes', () => {
    const values = { key: 'Bb', scale: 'dorian', chord: 'F#m7b5/C', inst: 'piano' as const, lesson: 'l1u3m1' };
    expect(readShareParams(buildShareSearch(values))).toEqual(values);
  });
});

describe('noteBootAddress: the one answer the start screen steps aside on (integration)', () => {
  it.each([
    ['?key=D&scale=major&chord=A&inst=guitar', '', true],
    ['?chord=F', '#m7', true], // a hand-typed ?chord=F#m7
    ['?lesson=l2u5m3', '', true],
    ['', '', false],
    ['?view=drill', '', false], // the installed app's shortcut is not a link
    ['?foo=1', '#bar', false],
  ])('%s%s → %s, and openedFromShareLink() says the same', (search, hash, expected) => {
    expect(noteBootAddress(search, hash)).toBe(expected);
    expect(openedFromShareLink()).toBe(expected);
  });
});
