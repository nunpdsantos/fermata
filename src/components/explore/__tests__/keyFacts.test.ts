/**
 * W11-B (D-30) — the circle of fifths' key facts and the summary line:
 * signature, relative, dominant and subdominant keys, all SPELLED from the
 * selected root.
 */
import { describe, it, expect } from 'vitest';
import i18next from 'i18next';
import en from '../../../i18n/locales/en.json';
import { keyFacts } from '../keyFacts';
import type { Note, ScaleType } from '../../../core/types/music';

const N = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const inst = i18next.createInstance();
await inst.init({ resources: { en: { translation: en } }, lng: 'en', interpolation: { escapeValue: false } });
const t = inst.t.bind(inst) as (key: string, opts?: Record<string, unknown>) => string;
const facts = (root: string, type: ScaleType) =>
  Object.fromEntries(keyFacts(N(root), type, t).facts.map((f) => [f.id, f.value]));

describe('key facts', () => {
  it('C major: no ♯/♭, relative A minor, dominant G major, subdominant F major', () => {
    expect(facts('C', 'major')).toEqual({ signature: 'no ♯/♭', relative: 'A minor', dominant: 'G major', subdominant: 'F major' });
    expect(keyFacts(N('C'), 'major', t).relative).toBe('A minor');
  });

  it('minor keys: relative major, MINOR dominant and subdominant keys', () => {
    expect(facts('A', 'natural_minor')).toEqual({ signature: 'no ♯/♭', relative: 'C major', dominant: 'E minor', subdominant: 'D minor' });
    expect(facts('A', 'harmonic_minor').relative).toBe('C major');
  });

  it('spelled from the root: F♯ major → C♯ / B; A♯ minor → C♯ major, E♯ minor', () => {
    expect(facts('F#', 'major')).toEqual({ signature: '6♯', relative: 'D♯ minor', dominant: 'C♯ major', subdominant: 'B major' });
    expect(facts('A#', 'natural_minor')).toMatchObject({ signature: '7♯', relative: 'C♯ major', dominant: 'E♯ minor', subdominant: 'D♯ minor' });
    expect(facts('Eb', 'major')).toMatchObject({ signature: '3♭', relative: 'C minor', dominant: 'B♭ major', subdominant: 'A♭ major' });
  });

  it('modes name their parent key; scales without a signature say so', () => {
    expect(facts('A', 'dorian')).toEqual({ signature: '1♯', parent: 'G major' });
    expect(facts('C', 'whole_tone')).toEqual({ signature: 'No standard key signature' });
    expect(keyFacts(N('C'), 'whole_tone', t).relative).toBeNull();
  });
});
