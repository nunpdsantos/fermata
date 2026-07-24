/**
 * Corpus-level invariant: no note-identification prompt may contain its own
 * answer. Guards against the F-02 audit finding (26/39 note_id prompts
 * literally named the target, e.g. "Identify this chromatic note: G#.").
 *
 * English corpus only: note names are untranslated by convention, and the
 * PT/ES template overlays are token-parity-checked against these templates.
 */
import { describe, it, expect } from 'vitest';
import { generateAllForLevel, mergeExerciseMaps } from '../exerciseGenerator';
import { noteToString } from '../../../core/types/music';
import type { NaturalNote, Accidental } from '../../../core/types/music';
import type { ExerciseDefinition } from '../../../core/types/exercise';

import exercisesL1 from '../exercisesL1';
import exercisesL2 from '../exercisesL2';
import exercisesL3 from '../exercisesL3';
import exercisesL4 from '../exercisesL4';
import exercisesL5 from '../exercisesL5';
import exercisesL6 from '../exercisesL6';
import exercisesL7 from '../exercisesL7';
import exercisesL8 from '../exercisesL8';
import exercisesL9 from '../exercisesL9';
import templatesL1 from '../templatesL1';
import templatesL2 from '../templatesL2';
import templatesL3 from '../templatesL3';
import templatesL4 from '../templatesL4';
import templatesL5 from '../templatesL5';
import templatesL6 from '../templatesL6';
import templatesL7 from '../templatesL7';
import templatesL8 from '../templatesL8';
import templatesL9 from '../templatesL9';

const AUTHORED = [exercisesL1, exercisesL2, exercisesL3, exercisesL4, exercisesL5, exercisesL6, exercisesL7, exercisesL8, exercisesL9];
const TEMPLATES = [templatesL1, templatesL2, templatesL3, templatesL4, templatesL5, templatesL6, templatesL7, templatesL8, templatesL9];

function resolvedNoteIdExercises(): ExerciseDefinition[] {
  const all: ExerciseDefinition[] = [];
  for (let i = 0; i < 9; i++) {
    const merged = mergeExerciseMaps(AUTHORED[i], generateAllForLevel(TEMPLATES[i], 'en'));
    for (const list of Object.values(merged)) {
      for (const ex of list) {
        if (ex.config.type === 'note_id') all.push(ex);
      }
    }
  }
  return all;
}

const escapeNote = (label: string) => label.replace('#', '\\#');

/**
 * True when `text` names the answer. Single-letter note names are matched
 * only as standalone tokens, and key contexts ("C major") are excluded so a
 * prompt may reference a key without being flagged.
 */
function namesAnswer(text: string, label: string, octave: number | undefined): boolean {
  const esc = escapeNote(label);
  if (octave !== undefined) {
    const withOctave = new RegExp(`(?<![A-Za-z#])${esc}${octave}(?![0-9A-Za-z])`);
    if (withOctave.test(text)) return true;
    const inOctave = new RegExp(`(?<![A-Za-z#])${esc}(?= in octave ${octave})`);
    if (inOctave.test(text)) return true;
  }
  const bare = new RegExp(
    `(?<![A-Za-z#])${esc}(?![0-9A-Za-z#b])(?!\\s+(?:major|minor)\\b)`,
  );
  return bare.test(text);
}

describe('note_id prompt leakage (corpus)', () => {
  const corpus = resolvedNoteIdExercises();

  it('covers the full resolved note_id corpus', () => {
    expect(corpus.length).toBeGreaterThan(30);
  });

  it('no prompt names its own answer', () => {
    const leaks: string[] = [];
    for (const ex of corpus) {
      if (ex.config.type !== 'note_id') continue;
      const label = noteToString({
        natural: ex.config.note as NaturalNote,
        accidental: (ex.config.accidental ?? '') as Accidental,
      });
      if (namesAnswer(ex.prompt, label, ex.config.octave)) {
        leaks.push(`${ex.id} [${label}${ex.config.octave ?? ''}]: ${ex.prompt}`);
      }
    }
    expect(leaks, `prompts naming their answer:\n${leaks.join('\n')}`).toEqual([]);
  });

  // Hints are shown only after a failed attempt; naming the answer there is
  // deliberate scaffolding (bounded to the 0.5-point retry), so hints are
  // intentionally not covered by this invariant.
});
