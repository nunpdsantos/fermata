import { describe, it, expect } from 'vitest';
import { gradeAnswer, normalizeDisplay } from '../grading';
import type { DrillItem } from '../../../core/types/drill';
import type { ChordQuality } from '../../../core/types/music';

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

/** A noteChips item whose canonical answer is the given ASCII spellings. */
function notesItem(notes: string[]): DrillItem {
  return {
    id: 'test:notes',
    family: 'triad',
    promptKey: 'drill.prompts.spellChord',
    promptParams: { chord: 'test' },
    input: { format: 'noteChips', chips: [], expectedCount: notes.length },
    answer: { kind: 'notes', notes },
    whyKey: 'drill.why.triadStack',
    whyParams: {},
    rank: 0,
  };
}

/** An accidentalSlots item whose canonical answer is the given ASCII spellings (in order). */
function slotsItem(spelled: string[]): DrillItem {
  return {
    id: 'test:slots',
    family: 'scale',
    promptKey: 'drill.prompts.spellScale',
    promptParams: { scale: 'test' },
    input: { format: 'accidentalSlots', letters: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
    answer: { kind: 'accidentals', spelled },
    whyKey: 'drill.why.scaleKeySig',
    whyParams: {},
    rank: 0,
  };
}

/** A rootQuality item. */
function rootQualityItem(root: string, quality: ChordQuality): DrillItem {
  return {
    id: 'test:rq',
    family: 'triad',
    promptKey: 'drill.prompts.nameChord',
    promptParams: { notes: 'test' },
    input: { format: 'rootQuality', roots: [], qualities: [quality] },
    answer: { kind: 'rootQuality', root, quality },
    whyKey: 'drill.why.triadStack',
    whyParams: {},
    rank: 0,
  };
}

describe('normalizeDisplay', () => {
  it('maps unicode accidentals back to ASCII', () => {
    expect(normalizeDisplay('F♯')).toBe('F#');
    expect(normalizeDisplay('E♭')).toBe('Eb');
    expect(normalizeDisplay('C𝄪')).toBe('C##');
    expect(normalizeDisplay('B𝄫')).toBe('Bbb');
  });
  it('leaves plain ASCII untouched', () => {
    expect(normalizeDisplay('G#')).toBe('G#');
    expect(normalizeDisplay('A')).toBe('A');
    expect(normalizeDisplay('Bb')).toBe('Bb');
  });
});

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

describe('gradeAnswer — noteChips (F♯ minor = A C♯ F♯)', () => {
  const item = notesItem(['F#', 'A', 'C#']);

  it('accepts the exact spelling in ANY order', () => {
    expect(gradeAnswer(item, { format: 'noteChips', notes: ['A', 'C♯', 'F♯'] })).toEqual({
      correct: true,
      nearMiss: false,
    });
    expect(gradeAnswer(item, { format: 'noteChips', notes: ['F♯', 'A', 'C♯'] })).toEqual({
      correct: true,
      nearMiss: false,
    });
  });

  it('flags an enharmonic spelling (A D♭ G♭) as a near-miss', () => {
    expect(gradeAnswer(item, { format: 'noteChips', notes: ['A', 'D♭', 'G♭'] })).toEqual({
      correct: false,
      nearMiss: true,
    });
  });

  it('marks a genuinely wrong note set (A C F♯) as wrong, not near-miss', () => {
    expect(gradeAnswer(item, { format: 'noteChips', notes: ['A', 'C', 'F♯'] })).toEqual({
      correct: false,
      nearMiss: false,
    });
  });

  it('treats note count mismatch as wrong (not near-miss)', () => {
    expect(gradeAnswer(item, { format: 'noteChips', notes: ['A', 'C♯'] })).toEqual({
      correct: false,
      nearMiss: false,
    });
  });

  it('normalizes a double-flat chip (B𝄫 → pitch-class 9 = A) for near-miss math', () => {
    // C diminished 7 contains B𝄫 (pitch class 9). A chord answering with A
    // instead of B𝄫 is the same sound, wrong spelling → near-miss.
    const dim7 = notesItem(['C', 'Eb', 'Gb', 'Bbb']);
    expect(gradeAnswer(dim7, { format: 'noteChips', notes: ['C', 'E♭', 'G♭', 'A'] })).toEqual({
      correct: false,
      nearMiss: true,
    });
    // And the exact spelling with the unicode double-flat is correct.
    expect(gradeAnswer(dim7, { format: 'noteChips', notes: ['C', 'E♭', 'G♭', 'B𝄫'] })).toEqual({
      correct: true,
      nearMiss: false,
    });
  });
});

describe('gradeAnswer — accidentalSlots (order-sensitive, per-position near-miss)', () => {
  it('accepts A major spelled with G♯ at the leading-tone slot', () => {
    const item = slotsItem(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
    expect(
      gradeAnswer(item, {
        format: 'accidentalSlots',
        spelled: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'G♯'],
      }),
    ).toEqual({ correct: true, nearMiss: false });
  });

  it('rejects A major spelled with A♮ at the leading-tone slot (pitch class differs) as wrong', () => {
    // Slot 7 should be G# (pc 8); answering A♮ (pc 9) is a different pitch
    // class → genuinely wrong, not a near-miss. (A♭ would be enharmonic with
    // G# and therefore a near-miss — a different case, covered below.)
    const item = slotsItem(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
    expect(
      gradeAnswer(item, {
        format: 'accidentalSlots',
        spelled: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'A'],
      }),
    ).toEqual({ correct: false, nearMiss: false });
  });

  it('flags A♭ at the leading-tone slot of A major as a near-miss (enharmonic with G♯)', () => {
    const item = slotsItem(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
    expect(
      gradeAnswer(item, {
        format: 'accidentalSlots',
        spelled: ['A', 'B', 'C♯', 'D', 'E', 'F♯', 'A♭'],
      }),
    ).toEqual({ correct: false, nearMiss: true });
  });

  it('marks E major spelled with F♮ instead of F♯ as wrong (pitch class differs)', () => {
    const item = slotsItem(['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']);
    expect(
      gradeAnswer(item, {
        format: 'accidentalSlots',
        spelled: ['E', 'F', 'G♯', 'A', 'B', 'C♯', 'D♯'],
      }),
    ).toEqual({ correct: false, nearMiss: false });
  });

  it('flags an enharmonic respelling at one position as a near-miss', () => {
    // If position 3 expects C# but the learner writes Db (same pc, different
    // letter), every position is pc-equal but a spelling differs → near-miss.
    const item = slotsItem(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
    expect(
      gradeAnswer(item, {
        format: 'accidentalSlots',
        spelled: ['A', 'B', 'D♭', 'D', 'E', 'F♯', 'G♯'],
      }),
    ).toEqual({ correct: false, nearMiss: true });
  });

  it('treats a length mismatch as wrong', () => {
    const item = slotsItem(['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']);
    expect(
      gradeAnswer(item, { format: 'accidentalSlots', spelled: ['A', 'B', 'C♯'] }),
    ).toEqual({ correct: false, nearMiss: false });
  });
});

describe('gradeAnswer — rootQuality', () => {
  it('accepts an exact root + quality match', () => {
    const item = rootQualityItem('D', 'minor');
    expect(
      gradeAnswer(item, { format: 'rootQuality', root: 'D', quality: 'minor' }),
    ).toEqual({ correct: true, nearMiss: false });
  });

  it('flags an enharmonic root with the right quality as a near-miss (C♯ vs D♭)', () => {
    const item = rootQualityItem('Db', 'major');
    expect(
      gradeAnswer(item, { format: 'rootQuality', root: 'C♯', quality: 'major' }),
    ).toEqual({ correct: false, nearMiss: true });
  });

  it('marks a wrong quality (same root) as wrong, not near-miss', () => {
    const item = rootQualityItem('D', 'minor');
    expect(
      gradeAnswer(item, { format: 'rootQuality', root: 'D', quality: 'major' }),
    ).toEqual({ correct: false, nearMiss: false });
  });

  it('marks a wrong root pitch class as wrong', () => {
    const item = rootQualityItem('D', 'minor');
    expect(
      gradeAnswer(item, { format: 'rootQuality', root: 'E', quality: 'minor' }),
    ).toEqual({ correct: false, nearMiss: false });
  });

  it('normalizes a unicode root before comparing (exact, not near-miss)', () => {
    const item = rootQualityItem('F#', 'minor');
    expect(
      gradeAnswer(item, { format: 'rootQuality', root: 'F♯', quality: 'minor' }),
    ).toEqual({ correct: true, nearMiss: false });
  });
});
