import { describe, it, expect } from 'vitest';
import { generateIntervalChoices } from '../exerciseHelpers';

describe('generateIntervalChoices', () => {
  it('returns 4 options with exactly one correct, keyed by semitone value', () => {
    const choices = generateIntervalChoices(7);
    expect(choices).toHaveLength(4);
    expect(choices.filter((c) => c.correct)).toHaveLength(1);
    const correct = choices.find((c) => c.correct)!;
    expect(correct.label).toBe('Perfect 5th');
    expect(correct.value).toBe('7');
  });

  // WS5 mitigation (REMEDIATION B1): core INTERVAL_LABELS[8]='Augmented 5th' is wrong
  // for interval-ID; the correct generic name is 'Minor 6th' (per SEMITONES_TO_INTERVAL[8]).
  it('labels the correct 8-semitone choice as "Minor 6th"', () => {
    const choices = generateIntervalChoices(8);
    const correct = choices.find((c) => c.correct)!;
    expect(correct.label).toBe('Minor 6th');
    expect(correct.value).toBe('8');
  });

  it('never offers "Augmented 5th" as a choice, even as a distractor for 8 semitones', () => {
    // Run repeatedly: distractors are shuffled (offsets ±3 of 8 include 8 itself only as correct,
    // but the override must also win if 8 ever surfaces in the distractor pool).
    for (let i = 0; i < 50; i++) {
      const choices = generateIntervalChoices(8);
      expect(choices.map((c) => c.label)).not.toContain('Augmented 5th');
    }
  });

  it('any choice whose value is 8 is labelled "Minor 6th" across the full range', () => {
    // For each possible correct interval, a distractor of 8 may appear; assert the override
    // applies wherever semitone 8 shows up as an option label.
    for (let s = 5; s <= 11; s++) {
      for (let i = 0; i < 20; i++) {
        const choices = generateIntervalChoices(s);
        for (const c of choices) {
          if (c.value === '8') expect(c.label).toBe('Minor 6th');
        }
      }
    }
  });
});
