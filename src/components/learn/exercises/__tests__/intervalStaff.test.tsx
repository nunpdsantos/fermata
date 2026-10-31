/**
 * Audit W1-01 — the interval exercise staff draws the interval the answer key
 * asks about. Pre-fix, 12 of the 43 interval exercises spelled the upper note
 * from a sharps-only table: "C up to Eb" was drawn C–D# (an augmented 2nd)
 * while only "Minor 3rd" was accepted.
 *
 * Every authored + generated (EN) interval_id exercise is rendered through the
 * real ExercisePrompt; the staff component is stubbed to capture its notes.
 * The drawn interval is named by an independent letter/semitone count.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import type { PitchedNote } from '../../../../core/types/music';
import { generateAllForLevel, mergeExerciseMaps } from '../../../../data/exercises/exerciseGenerator';

vi.mock('../../../notation/StaffNotation', () => ({
  StaffNotation: ({ notes }: { notes: PitchedNote[] }) => <div data-testid="staff" data-notes={JSON.stringify(notes)} />,
}));

import { ExercisePrompt } from '../ExercisePrompt';

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const ORD = ['Unison', '2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];
/** What the answer key (INTERVAL_LABELS) calls each semitone count. */
const KEY_NAME: Record<number, string[]> = {
  1: ['Minor 2nd'], 2: ['Major 2nd'], 3: ['Minor 3rd'], 4: ['Major 3rd'], 5: ['Perfect 4th'],
  6: ['Augmented 4th', 'Diminished 5th'], 7: ['Perfect 5th'], 8: ['Minor 6th'], 9: ['Major 6th'],
  10: ['Minor 7th'], 11: ['Major 7th'], 12: ['Octave'],
};

/** Name the interval between two pitched notes (app octave = octave of the sounding pitch class). */
function nameDrawn(a: PitchedNote, b: PitchedNote): { name: string; semitones: number } {
  const midi = (n: PitchedNote) => 12 + 12 * n.octave + ((LETTER_PC[n.natural] + ACC[n.accidental] + 12) % 12);
  const [lo, hi] = midi(a) <= midi(b) ? [a, b] : [b, a];
  const semitones = midi(hi) - midi(lo);
  let steps = (LETTERS.indexOf(hi.natural) - LETTERS.indexOf(lo.natural) + 7) % 7;
  if (semitones >= 12 && steps === 0) steps = 7;
  const ref = steps === 7 ? 12 : MAJOR[steps];
  const d = semitones - ref;
  const perfect = [0, 3, 4, 7].includes(steps);
  const q = perfect
    ? ({ 0: 'Perfect', 1: 'Augmented', [-1]: 'Diminished' } as Record<number, string>)[d]
    : ({ 0: 'Major', [-1]: 'Minor', 1: 'Augmented', [-2]: 'Diminished' } as Record<number, string>)[d];
  return { name: steps === 7 && d === 0 ? 'Octave' : `${q ?? '?'} ${ORD[steps]}`, semitones };
}

async function allIntervalExercises(): Promise<ExerciseDefinition[]> {
  const out: ExerciseDefinition[] = [];
  for (let l = 1; l <= 9; l++) {
    const authored = (await import(`../../../../data/exercises/exercisesL${l}.ts`)).default as Record<string, ExerciseDefinition[]>;
    const templates = (await import(`../../../../data/exercises/templatesL${l}.ts`)).default;
    const merged = mergeExerciseMaps(authored, generateAllForLevel(templates));
    for (const list of Object.values(merged)) for (const e of list) if (e.config.type === 'interval_id') out.push(e);
  }
  return out;
}

afterEach(() => cleanup());

describe('W1-01 — interval staff spelling', () => {
  it('draws the interval the answer key names, for every interval exercise', async () => {
    const exercises = await allIntervalExercises();
    expect(exercises.length).toBeGreaterThanOrEqual(43);
    const wrong: string[] = [];
    for (const ex of exercises) {
      if (ex.config.type !== 'interval_id') continue;
      render(<ExercisePrompt exercise={ex} />);
      const staff = await screen.findByTestId('staff');
      const notes = JSON.parse(staff.getAttribute('data-notes')!) as PitchedNote[];
      const { name, semitones } = nameDrawn(notes[0], notes[1]);
      const want = KEY_NAME[ex.config.targetSemitones];
      if (semitones !== ex.config.targetSemitones || !want.includes(name)) {
        wrong.push(`${ex.id}: ${ex.config.direction} ${ex.config.targetSemitones} -> drawn ${notes.map((n) => n.natural + n.accidental + n.octave).join('–')} = ${name}`);
      }
      cleanup();
    }
    expect(wrong).toEqual([]);
  }, 60_000);

  it('C up a minor 3rd is C–Eb; F down a minor 3rd is F–D', async () => {
    const make = (root: string, semis: number, direction: 'ascending' | 'descending'): ExerciseDefinition => ({
      id: 't', type: 'interval_id', prompt: '', points: 1,
      config: { type: 'interval_id', root, rootAccidental: '', rootOctave: 4, targetSemitones: semis, direction },
    } as ExerciseDefinition);
    render(<ExercisePrompt exercise={make('C', 3, 'ascending')} />);
    let notes = JSON.parse((await screen.findByTestId('staff')).getAttribute('data-notes')!) as PitchedNote[];
    expect(notes.map((n) => `${n.natural}${n.accidental}${n.octave}`)).toEqual(['C4', 'Eb4']);
    cleanup();
    render(<ExercisePrompt exercise={make('F', 3, 'descending')} />);
    notes = JSON.parse((await screen.findByTestId('staff')).getAttribute('data-notes')!) as PitchedNote[];
    expect(notes.map((n) => `${n.natural}${n.accidental}${n.octave}`)).toEqual(['F4', 'D4']);
  });
});
