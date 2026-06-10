/**
 * F8 — Seventh-chord drill items.
 *
 * Per root × quality (14 roots × 5 qualities):
 *   - seventh:name-to-notes:<rootAscii>:<q>  (noteChips, expectedCount 4)
 *   - seventh:notes-to-name:<rootAscii>:<q>  (rootQuality)
 *
 * Rank layout: FAMILY_BASE.seventh = 2400, stride 10 per root, +0..+9 offsets.
 * Double-accidental chords (Cdim7 = C Eb Gb Bbb) are KEPT — real theory.
 */

import type { Note } from '../../types/music';
import { noteToString } from '../../types/music';
import type { DrillItem } from '../../types/drill';
import type { ChordQuality } from '../../types/music';
import {
  N,
  displayNote,
  shuffleStable,
  FAMILY_BASE,
  KEY_PRIORITY,
  PRACTICAL_ROOTS,
} from './shared';
import { buildChord, CHORD_QUALITY_NAMES } from '../../constants/chords';
import { getPitchClass, PITCH_CLASS_SPELLINGS } from '../../constants/notes';

const SEVENTH_QUALITIES: readonly ChordQuality[] = [
  'major7',
  'dominant7',
  'minor7',
  'half_diminished7',
  'diminished7',
];

/**
 * Step description used in the why explanation for each seventh quality.
 * Builds on the previous step to create a memorisation ladder.
 */
const STEP_LABEL: Record<string, string> = {
  major7: 'the reference stack (M3+m3+M3)',
  dominant7: 'maj7 with the 7th lowered a half step',
  minor7: 'dominant 7 with the 3rd also lowered',
  half_diminished7: 'm7 with the 5th also lowered',
  diminished7: 'ø7 with the 7th lowered again (double-flat 7)',
};

/** Rank base for a root: follows KEY_PRIORITY order, fallback after known keys. */
function rootRankBase(root: Note): number {
  const ascii = noteToString(root);
  const idx = KEY_PRIORITY.indexOf(ascii);
  if (idx === -1) {
    return FAMILY_BASE.seventh + KEY_PRIORITY.length * 10 + PRACTICAL_ROOTS.indexOf(root) * 10;
  }
  return FAMILY_BASE.seventh + idx * 10;
}

export function genSeventh(): DrillItem[] {
  const items: DrillItem[] = [];

  for (const root of PRACTICAL_ROOTS) {
    const rootAscii = noteToString(root);
    const baseRank = rootRankBase(root);
    let offset = 0;

    for (const quality of SEVENTH_QUALITIES) {
      const chord = buildChord(root, quality);
      const chordNotes = chord.notes; // Note[] — 4 notes

      const correctDisplays = chordNotes.map(displayNote);
      const correctAscii = chordNotes.map(noteToString);

      // qualityDisplay: e.g. "Major 7th", "Half-Diminished 7th"
      const qualityDisplay = CHORD_QUALITY_NAMES[quality];
      const chordDisplay = `${displayNote(root)} ${qualityDisplay}`;

      // ---- name-to-notes (noteChips) ----
      {
        const chips = buildNoteChips(chordNotes, correctDisplays);
        const id = `seventh:name-to-notes:${rootAscii}:${quality}`;
        items.push({
          id,
          family: 'seventh',
          promptKey: 'drill.prompts.spellChord',
          promptParams: { chord: chordDisplay },
          input: {
            format: 'noteChips',
            chips: shuffleStable(chips, `${id}:chips`),
            expectedCount: 4,
          },
          answer: { kind: 'notes', notes: correctAscii },
          whyKey: 'drill.why.seventhLadder',
          whyParams: { chord: chordDisplay, step: STEP_LABEL[quality] ?? '' },
          rank: baseRank + offset,
        });
        offset++;
      }

      // ---- notes-to-name (rootQuality) ----
      {
        const notesDisplay = shuffleStable(
          correctDisplays,
          `seventh:notes-to-name:${rootAscii}:${quality}:noteorder`,
        ).join(' – ');
        const id = `seventh:notes-to-name:${rootAscii}:${quality}`;
        items.push({
          id,
          family: 'seventh',
          promptKey: 'drill.prompts.nameChord',
          promptParams: { notes: notesDisplay },
          input: {
            format: 'rootQuality',
            roots: shuffleStable(correctDisplays, `${id}:roots`),
            qualities: [...SEVENTH_QUALITIES],
          },
          answer: { kind: 'rootQuality', root: rootAscii, quality },
          whyKey: 'drill.why.seventhLadder',
          whyParams: { chord: chordDisplay, step: STEP_LABEL[quality] ?? '' },
          rank: baseRank + offset,
        });
        offset++;
      }
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Chip builder — 4 correct + up to 8 distractors (12 total target)
// ---------------------------------------------------------------------------

/**
 * Build chip list: the 4 correct displays + up to 8 distractors.
 * Distractors: same-letter wrong-accidental siblings, natural-vs-altered 7th trap,
 * enharmonic traps, diminished-5th / augmented-5th alternates.
 */
function buildNoteChips(chordNotes: Note[], correctDisplays: string[]): string[] {
  const all: string[] = [...correctDisplays];

  for (const note of chordNotes) {
    const pc = getPitchClass(note);
    const correctDisplay = displayNote(note);

    // Same letter, different accidental
    for (const acc of ['', '#', 'b', '##', 'bb'] as const) {
      if (acc === note.accidental) continue;
      const candidate = displayNote(N(note.natural, acc));
      if (!all.includes(candidate)) all.push(candidate);
    }

    // Enharmonic spellings from PITCH_CLASS_SPELLINGS
    for (const spelling of PITCH_CLASS_SPELLINGS[pc] ?? []) {
      const d = displayNote(spelling);
      if (d !== correctDisplay && !all.includes(d)) all.push(d);
    }

    // Diminished 5th / augmented 5th spellings (real traps for 7th chord tones)
    const d5pc = (pc + 6) % 12;
    for (const spelling of PITCH_CLASS_SPELLINGS[d5pc] ?? []) {
      const d = displayNote(spelling);
      if (!all.includes(d)) all.push(d);
    }
    const p5pc = (pc + 7) % 12;
    for (const spelling of PITCH_CLASS_SPELLINGS[p5pc] ?? []) {
      const d = displayNote(spelling);
      if (!all.includes(d)) all.push(d);
    }
    const aug5pc = (pc + 8) % 12;
    for (const spelling of PITCH_CLASS_SPELLINGS[aug5pc] ?? []) {
      const d = displayNote(spelling);
      if (!all.includes(d)) all.push(d);
    }
  }

  const unique = [...new Set(all)];
  const distractors = unique.filter((d) => !correctDisplays.includes(d)).slice(0, 8);
  return [...correctDisplays, ...distractors];
}
