/**
 * F10 — reading the staff on the guitar (audit W10-02; decisions D-05, D-06).
 *
 * Prompt: one note on a treble-8vb staff (the guitar is written an octave
 * above where it sounds). Answer: tap any place on the neck that sounds that
 * EXACT pitch — anywhere, or inside a named position. The positions climb the
 * exam ladder (ABRSM sight-reading, audit Track G R4: Grade 1 "1st position",
 * Grade 3 "2nd position", Grade 5 "up to 5th position", Grade 6 "above 5th
 * position"):
 *
 *   stage 1  Open position (open strings + frets 1–4) — the beginner's 1st position
 *   stage 2  position II
 *   stage 3  position V
 *   stage 4  positions VII, IX and XII — above V, up to the app's 15th fret
 *   stage 5  anywhere on the neck
 *
 * Each rung asks every written note its position holds: naturals, plus each
 * black key spelled both ways (G♯ and A♭ sit on different staff lines). No
 * E♯/F♭/B♯/C♭ — they are not on the reading path to Grade 5.
 *
 * Ids are stable and structured: `read:staff-to-fret:<scope>:<written>`, with
 * scope 'open' | 'II' … 'XII' | 'any' and the written note in ASCII with its
 * scientific octave ('C#5', 'Bb3').
 */

import type { Note, NaturalNote, PitchedNote } from '../../types/music';
import type { ReadDrillItem } from '../../types/drill';
import { TUNING_STANDARD } from '../../constants/guitarTunings';
import { GUITAR_MAX_FRET, OPEN_POSITION, toRomanNumeral, tuningOpenMidi } from '../guitarPositions';
import { placesForPitch, placesInPosition, positionWindow } from '../fretboardReading';
import { displayNote } from './shared';

/** Rank base for the reading family (after every theory family's ranks). */
export const READ_RANK_BASE = 5000;

export interface ReadRung {
  /** 0 = Open, 2–12 = II–XII, null = anywhere. */
  position: number | null;
  stage: number;
}

/** The reading ladder, easiest first. */
export const READ_LADDER: readonly ReadRung[] = [
  { position: OPEN_POSITION, stage: 1 },
  { position: 2, stage: 2 },
  { position: 5, stage: 3 },
  { position: 7, stage: 4 },
  { position: 9, stage: 4 },
  { position: 12, stage: 4 },
  { position: null, stage: 5 },
];

export const READ_PROMPT_KEYS: readonly string[] = [
  'drill.prompts.readAnywhere',
  'drill.prompts.readOpenPosition',
  'drill.prompts.readInPosition',
];
export const READ_WHY_KEYS: readonly string[] = ['drill.why.readPlaces'];

const SHARP_OF: Record<number, NaturalNote> = { 1: 'C', 3: 'D', 6: 'F', 8: 'G', 10: 'A' };
const FLAT_OF: Record<number, NaturalNote> = { 1: 'D', 3: 'E', 6: 'G', 8: 'A', 10: 'B' };
const NATURAL_OF: Record<number, NaturalNote> = { 0: 'C', 2: 'D', 4: 'E', 5: 'F', 7: 'G', 9: 'A', 11: 'B' };

/** The everyday spellings of a pitch class: the natural, or the sharp and the flat. */
function spellings(pc: number): Note[] {
  const natural = NATURAL_OF[pc];
  if (natural) return [{ natural, accidental: '' }];
  return [
    { natural: SHARP_OF[pc], accidental: '#' },
    { natural: FLAT_OF[pc], accidental: 'b' },
  ];
}

/** App PitchedNote for a MIDI number (no B♯/C♭ here, so letter octave = pitch octave). */
function pitchedAt(note: Note, midi: number): PitchedNote {
  return { ...note, octave: Math.floor((midi - 12) / 12) };
}

const ascii = (n: PitchedNote) => `${n.natural}${n.accidental}${n.octave}`;
const display = (n: PitchedNote) => `${displayNote(n)}${n.octave}`;

const CIRCLED = ['①', '②', '③', '④', '⑤', '⑥'];

/** "②1 · ③5": circled string number (1st string = ①), then the fret. */
export function formatPlaces(places: readonly { stringIndex: number; fret: number }[], strings = 6): string {
  return places.map((p) => `${CIRCLED[strings - 1 - p.stringIndex]}${p.fret}`).join(' · ');
}

/** Scope label used in ids: 'open', 'II' … 'XII', 'any'. */
export function readScopeId(position: number | null): string {
  if (position === null) return 'any';
  return position === OPEN_POSITION ? 'open' : toRomanNumeral(position);
}

export function genRead(): ReadDrillItem[] {
  const tuning = TUNING_STANDARD;
  const maxFret = GUITAR_MAX_FRET;
  const open = tuningOpenMidi(tuning);
  const lowest = Math.min(...open);
  const highest = Math.max(...open) + maxFret;
  const items: ReadDrillItem[] = [];

  READ_LADDER.forEach((rung, rungIndex) => {
    const scope = readScopeId(rung.position);
    const rows: { midi: number; note: Note; places: { stringIndex: number; fret: number }[] }[] = [];
    for (let midi = lowest; midi <= highest; midi++) {
      const places = rung.position === null ? placesForPitch(midi, tuning, maxFret) : placesInPosition(midi, rung.position, tuning, maxFret).places;
      if (places.length === 0) continue;
      for (const note of spellings(midi % 12)) rows.push({ midi, note, places });
    }
    // Naturals first (most of early reading), then sharps, then flats; low to high.
    const order = (n: Note) => (n.accidental === '' ? 0 : n.accidental === '#' ? 1 : 2);
    rows.sort((a, b) => order(a.note) - order(b.note) || a.midi - b.midi);

    rows.forEach((row, i) => {
      const sounding = pitchedAt(row.note, row.midi);
      const written = pitchedAt(row.note, row.midi + 12);
      const promptKey =
        rung.position === null
          ? 'drill.prompts.readAnywhere'
          : rung.position === OPEN_POSITION
            ? 'drill.prompts.readOpenPosition'
            : 'drill.prompts.readInPosition';
      items.push({
        id: `read:staff-to-fret:${scope}:${ascii(written)}`,
        family: 'read',
        promptKey,
        promptParams: rung.position !== null && rung.position !== OPEN_POSITION ? { position: toRomanNumeral(rung.position) } : {},
        input: {
          format: 'fretboard',
          tuningId: tuning.id,
          position: rung.position,
          window: rung.position === null ? null : positionWindow(rung.position, maxFret),
          maxFret,
        },
        answer: { kind: 'fretPitch', midi: row.midi, accepted: row.places },
        staff: { clef: 'treble', annotation: '8vb', written, sounding },
        whyKey: 'drill.why.readPlaces',
        whyParams: { written: display(written), sounding: display(sounding), places: formatPlaces(row.places) },
        rank: READ_RANK_BASE + 100 * rungIndex + i,
        stage: rung.stage,
      });
    });
  });
  return items;
}
