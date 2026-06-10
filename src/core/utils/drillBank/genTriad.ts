/**
 * F6 — Triad drill items.
 *
 * Per root × quality:
 *   - triad:name-to-notes:<rootAscii>:<q>  (noteChips)
 *   - triad:notes-to-name:<rootAscii>:<q>  (rootQuality)
 *
 * Rank layout: FAMILY_BASE.triad = 1200, stride 10 per root, +0..+7 for 8 items per root.
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

const TRIAD_QUALITIES: readonly ChordQuality[] = ['major', 'minor', 'diminished', 'augmented'];

const STACK_LABEL: Record<string, string> = {
  major: 'M3 + m3',
  minor: 'm3 + M3',
  diminished: 'm3 + m3',
  augmented: 'M3 + M3',
};

/** Rank base for a root: follows KEY_PRIORITY order. Roots not in KEY_PRIORITY get a sequential fallback. */
function rootRankBase(root: Note): number {
  const ascii = noteToString(root);
  const idx = KEY_PRIORITY.indexOf(ascii);
  if (idx === -1) {
    // Fallback: place after the known keys
    return FAMILY_BASE.triad + KEY_PRIORITY.length * 10 + PRACTICAL_ROOTS.indexOf(root) * 10;
  }
  return FAMILY_BASE.triad + idx * 10;
}

export function genTriad(): DrillItem[] {
  const items: DrillItem[] = [];

  for (const root of PRACTICAL_ROOTS) {
    const rootAscii = noteToString(root);
    const baseRank = rootRankBase(root);
    let offset = 0;

    for (const quality of TRIAD_QUALITIES) {
      const chord = buildChord(root, quality);
      const chordNotes = chord.notes; // Note[]

      // Display names for the 3 correct notes
      const correctDisplays = chordNotes.map(displayNote);
      const correctAscii = chordNotes.map(noteToString);

      const qualityNameLower = CHORD_QUALITY_NAMES[quality].toLowerCase();
      const chordDisplay = `${displayNote(root)} ${qualityNameLower}`;

      // ---- name-to-notes (noteChips) ----
      {
        const chips = buildNoteChips(chordNotes, correctDisplays);
        const id = `triad:name-to-notes:${rootAscii}:${quality}`;
        items.push({
          id,
          family: 'triad',
          promptKey: 'drill.prompts.spellChord',
          promptParams: { chord: chordDisplay },
          input: {
            format: 'noteChips',
            chips: shuffleStable(chips, `${id}:chips`),
            expectedCount: 3,
          },
          answer: { kind: 'notes', notes: correctAscii },
          whyKey: 'drill.why.triadStack',
          whyParams: {
            chord: chordDisplay,
            stack: STACK_LABEL[quality] ?? '',
            notes: correctDisplays.join(' '),
          },
          rank: baseRank + offset,
        });
        offset++;
      }

      // ---- notes-to-name (rootQuality) ----
      {
        const notesDisplay = shuffleStable(correctDisplays, `triad:notes-to-name:${rootAscii}:${quality}:noteorder`).join(' – ');
        const id = `triad:notes-to-name:${rootAscii}:${quality}`;
        items.push({
          id,
          family: 'triad',
          promptKey: 'drill.prompts.nameChord',
          promptParams: { notes: notesDisplay },
          input: {
            format: 'rootQuality',
            roots: shuffleStable(correctDisplays, `${id}:roots`),
            qualities: [...TRIAD_QUALITIES],
          },
          answer: { kind: 'rootQuality', root: rootAscii, quality },
          whyKey: 'drill.why.triadStack',
          whyParams: {
            chord: chordDisplay,
            stack: STACK_LABEL[quality] ?? '',
            notes: correctDisplays.join(' '),
          },
          rank: baseRank + offset,
        });
        offset++;
      }
    }
  }

  return items;
}

// ---------------------------------------------------------------------------
// Chip builder
// ---------------------------------------------------------------------------

/**
 * Build chip list: the 3 correct displays + 9 distractors (same letter wrong accidental,
 * altered 5th alternates, enharmonic traps). All unique.
 */
function buildNoteChips(chordNotes: Note[], correctDisplays: string[]): string[] {
  const all: string[] = [...correctDisplays];

  for (const note of chordNotes) {
    const pc = getPitchClass(note);
    const correctDisplay = displayNote(note);

    // Same letter different accidental
    for (const acc of ['', '#', 'b', '##', 'bb'] as const) {
      if (acc === note.accidental) continue;
      const candidate = displayNote(N(note.natural, acc));
      if (!all.includes(candidate)) all.push(candidate);
    }

    // Enharmonic spellings
    for (const spelling of PITCH_CLASS_SPELLINGS[pc] ?? []) {
      const d = displayNote(spelling);
      if (d !== correctDisplay && !all.includes(d)) all.push(d);
    }

    // Perfect 5th / augmented 5th alternates
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

  // Remove duplicates and take correct + up to 9 distractors (total 12 chips)
  const unique = [...new Set(all)];
  const distractors = unique.filter((d) => !correctDisplays.includes(d)).slice(0, 9);
  return [...correctDisplays, ...distractors];
}
