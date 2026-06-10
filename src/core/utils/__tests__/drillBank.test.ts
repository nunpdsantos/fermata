import { describe, expect, it } from 'vitest';
import { buildScale } from '../../constants/scales';
import { noteToString } from '../../types/music';
import { generateDrillBank, getItemsByFamily, displayNote, MAJOR_KEYS } from '../drillBank';

const bank = generateDrillBank();
const byId = new Map(bank.map((i) => [i.id, i]));

describe('drillBank invariants', () => {
  it('has unique stable ids', () => {
    expect(byId.size).toBe(bank.length);
  });
  it('is deterministic across calls', () => {
    expect(generateDrillBank()).toEqual(bank);
  });
  it('every choice answer is among its choices, choices unique', () => {
    for (const item of bank) {
      if (item.input.format === 'choice' && item.answer.kind === 'choice') {
        expect(item.input.choices).toContain(item.answer.correct);
        expect(new Set(item.input.choices).size).toBe(item.input.choices.length);
      }
    }
  });
  it('per-family counts are in expected ranges', () => {
    expect(getItemsByFamily(bank, 'keysig').length).toBeGreaterThanOrEqual(90);
    expect(getItemsByFamily(bank, 'circle').length).toBeGreaterThanOrEqual(20);
    expect(getItemsByFamily(bank, 'degree').length).toBe(14);
  });
  it('rank ordering respects family bases (degree < circle < keysig)', () => {
    const maxDegree = Math.max(...getItemsByFamily(bank, 'degree').map((i) => i.rank));
    const minCircle = Math.min(...getItemsByFamily(bank, 'circle').map((i) => i.rank));
    const maxCircle = Math.max(...getItemsByFamily(bank, 'circle').map((i) => i.rank));
    const minKeysig = Math.min(...getItemsByFamily(bank, 'keysig').map((i) => i.rank));
    expect(maxDegree).toBeLessThan(minCircle);
    expect(maxCircle).toBeLessThan(minKeysig);
  });
});

describe('F1 key signatures — goldens', () => {
  it('A major → 3 sharps F♯ C♯ G♯', () => {
    expect(byId.get('keysig:key-to-acc:A:major')?.answer).toEqual({ kind: 'choice', correct: 'F♯ C♯ G♯' });
    expect(byId.get('keysig:key-to-count:A:major')?.answer).toEqual({ kind: 'choice', correct: '3♯' });
  });
  it('Eb major → B♭ E♭ A♭', () => {
    expect(byId.get('keysig:key-to-acc:Eb:major')?.answer).toEqual({ kind: 'choice', correct: 'B♭ E♭ A♭' });
  });
  it('F# major → 6♯ and includes E♯', () => {
    expect(byId.get('keysig:key-to-count:F#:major')?.answer).toEqual({ kind: 'choice', correct: '6♯' });
    expect((byId.get('keysig:key-to-acc:F#:major')?.answer as { correct: string }).correct.split(' ')).toContain('E♯');
  });
  it('C major → 0 accidentals, count item only', () => {
    expect(byId.get('keysig:key-to-count:C:major')?.answer).toEqual({ kind: 'choice', correct: '0' });
    expect(byId.get('keysig:key-to-acc:C:major')).toBeUndefined();
  });
  it('relative pairs both directions', () => {
    expect(byId.get('keysig:rel-minor:Eb')?.answer).toEqual({ kind: 'choice', correct: 'C minor' });
    expect(byId.get('keysig:rel-major:c')?.answer).toEqual({ kind: 'choice', correct: 'E♭ major' });
  });
  it('signature → key asked for both modes', () => {
    expect(byId.get('keysig:sig-to-key:3#:major')?.answer).toEqual({ kind: 'choice', correct: 'A major' });
    expect(byId.get('keysig:sig-to-key:3#:minor')?.answer).toEqual({ kind: 'choice', correct: 'F♯ minor' });
  });
  it('engine roundtrip: every key-to-acc answer contains every altered note of the scale', () => {
    // Re-derive from buildScale — not trusting the generator itself
    for (const majorKey of MAJOR_KEYS) {
      const keyStr = noteToString(majorKey);
      const item = byId.get(`keysig:key-to-acc:${keyStr}:major`);
      if (!item) {
        // C major has no accidentals → no key-to-acc item is expected
        const scale = buildScale(majorKey, 'major');
        const alteredCount = scale.notes.filter((n) => n.accidental !== '').length;
        expect(alteredCount).toBe(0); // only C major should be missing this item
        continue;
      }
      // Derive the expected altered notes independently via buildScale
      const scale = buildScale(majorKey, 'major');
      const alteredNotes = scale.notes
        .filter((n) => n.accidental !== '')
        .map((n) => displayNote(n));

      // The answer tokens are the altered notes in SHARP_ORDER / FLAT_ORDER
      const correctAnswer = (item.answer as { kind: 'choice'; correct: string }).correct;
      const answerTokens = new Set(correctAnswer.split(' '));

      for (const expectedNote of alteredNotes) {
        expect(answerTokens).toContain(expectedNote);
      }
      expect(answerTokens.size).toBe(alteredNotes.length);
    }
  });
});

describe('F2 circle — goldens', () => {
  it('order of sharps chain', () => {
    expect(byId.get('circle:next-sharp:C#')?.answer).toEqual({ kind: 'choice', correct: 'G♯' });
  });
  it('fifth up from D is A; fifth down from F is B♭', () => {
    expect(byId.get('circle:fifth-up:D')?.answer).toEqual({ kind: 'choice', correct: 'A' });
    expect(byId.get('circle:fifth-down:F')?.answer).toEqual({ kind: 'choice', correct: 'B♭' });
  });
});

describe('F4 degree names — goldens', () => {
  it('5 ↔ Dominant both directions', () => {
    expect(byId.get('degree:num-to-name:5')?.answer).toEqual({ kind: 'choice', correct: 'Dominant' });
    expect(byId.get('degree:name-to-num:Dominant')?.answer).toEqual({ kind: 'choice', correct: '5' });
  });
});
