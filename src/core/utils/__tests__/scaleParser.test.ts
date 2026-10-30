import { describe, it, expect } from 'vitest';
import {
  parseScaleSymbol,
  looksLikeScaleSymbol,
  extractScaleFromQuery,
  formatParsedScaleName,
} from '../scaleParser';

describe('parseScaleSymbol', () => {
  // ─── Major / Minor ────────────────────────────────────
  describe('major and minor', () => {
    it('C major', () => {
      const r = parseScaleSymbol('C major');
      expect(r).not.toBeNull();
      expect(r!.root).toEqual({ natural: 'C', accidental: '' });
      expect(r!.scaleType).toBe('major');
      expect(r!.isMode).toBe(false);
    });

    it('A minor → natural_minor', () => {
      const r = parseScaleSymbol('A minor');
      expect(r!.scaleType).toBe('natural_minor');
      expect(r!.isMode).toBe(false);
    });

    it('F# major', () => {
      const r = parseScaleSymbol('F# major');
      expect(r!.root).toEqual({ natural: 'F', accidental: '#' });
      expect(r!.scaleType).toBe('major');
    });

    it('Bb minor', () => {
      const r = parseScaleSymbol('Bb minor');
      expect(r!.root).toEqual({ natural: 'B', accidental: 'b' });
      expect(r!.scaleType).toBe('natural_minor');
    });
  });

  // ─── Harmonic / Melodic Minor ─────────────────────────
  describe('harmonic and melodic minor', () => {
    it('C harmonic minor', () => {
      expect(parseScaleSymbol('C harmonic minor')!.scaleType).toBe('harmonic_minor');
    });

    it('D melodic minor', () => {
      expect(parseScaleSymbol('D melodic minor')!.scaleType).toBe('melodic_minor');
    });
  });

  // ─── Modes ────────────────────────────────────────────
  describe('modes', () => {
    it('D dorian → isMode: true', () => {
      const r = parseScaleSymbol('D dorian');
      expect(r!.scaleType).toBe('dorian');
      expect(r!.isMode).toBe(true);
    });

    it('E phrygian', () => {
      expect(parseScaleSymbol('E phrygian')!.scaleType).toBe('phrygian');
    });

    it('F lydian', () => {
      expect(parseScaleSymbol('F lydian')!.scaleType).toBe('lydian');
    });

    it('G mixolydian', () => {
      expect(parseScaleSymbol('G mixolydian')!.scaleType).toBe('mixolydian');
    });

    it('B locrian', () => {
      expect(parseScaleSymbol('B locrian')!.scaleType).toBe('locrian');
    });

    it('A aeolian', () => {
      expect(parseScaleSymbol('A aeolian')!.scaleType).toBe('aeolian');
    });

    it('C ionian', () => {
      expect(parseScaleSymbol('C ionian')!.scaleType).toBe('ionian');
    });
  });

  // ─── Pentatonic / Blues ───────────────────────────────
  describe('pentatonic and blues', () => {
    it('C major pentatonic', () => {
      expect(parseScaleSymbol('C major pentatonic')!.scaleType).toBe('pentatonic_major');
    });

    it('A minor pentatonic', () => {
      expect(parseScaleSymbol('A minor pentatonic')!.scaleType).toBe('pentatonic_minor');
    });

    it('E blues', () => {
      expect(parseScaleSymbol('E blues')!.scaleType).toBe('blues');
    });

    it('G major blues', () => {
      expect(parseScaleSymbol('G major blues')!.scaleType).toBe('major_blues');
    });
  });

  // ─── Advanced scales ──────────────────────────────────
  describe('advanced scales', () => {
    it('C altered', () => {
      expect(parseScaleSymbol('C altered')!.scaleType).toBe('altered');
    });

    it('G lydian dominant', () => {
      expect(parseScaleSymbol('G lydian dominant')!.scaleType).toBe('lydian_dominant');
    });

    it('E phrygian dominant', () => {
      expect(parseScaleSymbol('E phrygian dominant')!.scaleType).toBe('phrygian_dominant');
    });

    it('A bebop dominant', () => {
      expect(parseScaleSymbol('A bebop dominant')!.scaleType).toBe('bebop_dominant');
    });

    it('C whole tone', () => {
      expect(parseScaleSymbol('C whole tone')!.scaleType).toBe('whole_tone');
    });
  });

  // ─── World scales ─────────────────────────────────────
  describe('world scales', () => {
    it('D hungarian minor', () => {
      expect(parseScaleSymbol('D hungarian minor')!.scaleType).toBe('hungarian_minor');
    });

    it('C double harmonic major (the L7 lesson spelling) is the double harmonic', () => {
      expect(parseScaleSymbol('C double harmonic major')!.scaleType).toBe('double_harmonic');
      expect(parseScaleSymbol('double harmonic major')!.scaleType).toBe('double_harmonic');
      // The minor variant is a different scale (Hungarian minor), unchanged.
      expect(parseScaleSymbol('C double harmonic minor')!.scaleType).toBe('hungarian_minor');
    });

    it('E double harmonic', () => {
      expect(parseScaleSymbol('E double harmonic')!.scaleType).toBe('double_harmonic');
    });

    it('A hirajoshi', () => {
      expect(parseScaleSymbol('A hirajoshi')!.scaleType).toBe('hirajoshi');
    });
  });

  // ─── No root (defaults to C) ─────────────────────────
  describe('without root note', () => {
    it('"dorian" defaults to C', () => {
      const r = parseScaleSymbol('dorian');
      expect(r).not.toBeNull();
      expect(r!.root).toEqual({ natural: 'C', accidental: '' });
      expect(r!.scaleType).toBe('dorian');
    });

    it('"blues" defaults to C', () => {
      expect(parseScaleSymbol('blues')!.root.natural).toBe('C');
    });

    it('"chromatic" defaults to C', () => {
      expect(parseScaleSymbol('chromatic')!.scaleType).toBe('chromatic');
    });
  });

  // ─── Case insensitivity ───────────────────────────────
  describe('case insensitivity', () => {
    it('c MAJOR parses as C major', () => {
      const r = parseScaleSymbol('c MAJOR');
      expect(r).not.toBeNull();
      expect(r!.root.natural).toBe('C');
      expect(r!.scaleType).toBe('major');
    });

    it('D DORIAN', () => {
      expect(parseScaleSymbol('D DORIAN')!.scaleType).toBe('dorian');
    });
  });

  // ─── Spacing variants ─────────────────────────────────
  describe('spacing', () => {
    it('hyphenated: C-major', () => {
      // The regex uses [\s-]* between root and scale type
      const r = parseScaleSymbol('C-major');
      expect(r).not.toBeNull();
      expect(r!.scaleType).toBe('major');
    });
  });

  // ─── Invalid input ────────────────────────────────────
  describe('invalid input', () => {
    it('null returns null', () => {
      expect(parseScaleSymbol(null as unknown as string)).toBeNull();
    });

    it('empty string returns null', () => {
      expect(parseScaleSymbol('')).toBeNull();
    });

    it('random text returns null', () => {
      expect(parseScaleSymbol('hello world')).toBeNull();
    });

    it('too long returns null', () => {
      expect(parseScaleSymbol('C ' + 'major'.repeat(30))).toBeNull();
    });

    it('number returns null', () => {
      expect(parseScaleSymbol(42 as unknown as string)).toBeNull();
    });
  });
});

describe('looksLikeScaleSymbol', () => {
  it('"C major" looks like scale', () => {
    expect(looksLikeScaleSymbol('C major')).toBe(true);
  });

  it('"D dorian" looks like scale', () => {
    expect(looksLikeScaleSymbol('D dorian')).toBe(true);
  });

  it('"what is C major" is a question, not a scale', () => {
    expect(looksLikeScaleSymbol('what is C major')).toBe(false);
  });

  it('empty returns false', () => {
    expect(looksLikeScaleSymbol('')).toBe(false);
  });

  it('null returns false', () => {
    expect(looksLikeScaleSymbol(null as unknown as string)).toBe(false);
  });
});

describe('extractScaleFromQuery', () => {
  it('direct: "C major"', () => {
    const r = extractScaleFromQuery('C major');
    expect(r).not.toBeNull();
    expect(r!.scaleType).toBe('major');
  });

  it('"what is D dorian" extracts D dorian', () => {
    const r = extractScaleFromQuery('what is D dorian');
    expect(r).not.toBeNull();
    expect(r!.scaleType).toBe('dorian');
  });

  it('"show me A minor pentatonic scale" extracts correctly', () => {
    const r = extractScaleFromQuery('show me A minor pentatonic scale');
    expect(r).not.toBeNull();
    expect(r!.scaleType).toBe('pentatonic_minor');
  });

  it('returns null for unrelated text', () => {
    expect(extractScaleFromQuery('hello world')).toBeNull();
  });
});

describe('formatParsedScaleName', () => {
  it('C major formats correctly', () => {
    const r = parseScaleSymbol('C major')!;
    expect(formatParsedScaleName(r)).toContain('C');
    expect(formatParsedScaleName(r)).toContain('Major');
  });

  it('D dorian formats as "D Dorian"', () => {
    const r = parseScaleSymbol('D dorian')!;
    expect(formatParsedScaleName(r)).toBe('D Dorian');
  });

  it('Bb minor formats with accidental', () => {
    const r = parseScaleSymbol('Bb minor')!;
    expect(formatParsedScaleName(r)).toContain('Bb');
  });
});
