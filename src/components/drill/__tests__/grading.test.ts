import { describe, it, expect } from 'vitest';
import { gradeAnswer, type AnswerPayload } from '../grading';
import type { DrillItem } from '../../../core/types/drill';

function choiceItem(correct: string): DrillItem {
  return {
    id: 'test:choice',
    family: 'degree',
    promptKey: 'drill.prompts.numToName',
    promptParams: { num: 1 },
    input: { format: 'choice', choices: [correct, 'lure'] },
    answer: { kind: 'choice', correct },
    whyKey: 'drill.why.degreeName',
    whyParams: { num: 1, name: correct },
    rank: 0,
  };
}

describe('gradeAnswer — choice', () => {
  it('marks an exact match correct (nearMiss false)', () => {
    const item = choiceItem('Tonic');
    expect(gradeAnswer(item, { format: 'choice', choice: 'Tonic' })).toEqual({
      correct: true,
      nearMiss: false,
    });
  });

  it('marks a mismatch incorrect (nearMiss false)', () => {
    const item = choiceItem('Tonic');
    expect(gradeAnswer(item, { format: 'choice', choice: 'Dominant' })).toEqual({
      correct: false,
      nearMiss: false,
    });
  });
});

describe('gradeAnswer — unimplemented formats throw (Task 9)', () => {
  const item = choiceItem('Tonic');

  it('throws for noteChips', () => {
    const payload: AnswerPayload = { format: 'noteChips', notes: ['C', 'E', 'G'] };
    expect(() => gradeAnswer(item, payload)).toThrow(/not implemented: noteChips/);
  });

  it('throws for accidentalSlots', () => {
    const payload: AnswerPayload = { format: 'accidentalSlots', spelled: ['C#'] };
    expect(() => gradeAnswer(item, payload)).toThrow(/not implemented: accidentalSlots/);
  });

  it('throws for rootQuality', () => {
    const payload: AnswerPayload = { format: 'rootQuality', root: 'C', quality: 'major' };
    expect(() => gradeAnswer(item, payload)).toThrow(/not implemented: rootQuality/);
  });
});
