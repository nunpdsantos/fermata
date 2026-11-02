// Reading the staff on the guitar (audit W10-02, decisions D-05, D-06).
//
// The guitar is written an octave above where it sounds (treble clef with the
// small 8 below, D-05; audit Track G R29/R30), so written C5 is played as the
// C4 on the 2nd string, 1st fret. A reading answer is a PLACE on the neck
// (string + fret); it is right when it sounds that EXACT pitch — the right
// letter an octave off is a near miss, not a pass.
//
// Positions follow guitarPositions.ts: the Open position is the open strings
// plus frets 1–4 (the first position beginner reading uses); position N
// (II–XII) is frets N…N+3 with the index over fret N, no open strings, and
// the one-fret stretches (N−1 by the index, N+4 by the little finger) only
// for a pitch that falls in the gap between two strings a 4th apart — the
// same rule the position engine uses. Exam boards stage sight-reading by
// position (ABRSM: Grade 1 "1st position", Grade 3 "2nd position", Grade 5 "up
// to 5th position", Grade 6 "above 5th position"; Track G R4), which is the
// ladder the drill climbs.
//
// Pure and framework-agnostic.

import type { GuitarTuning } from '../constants/guitarTunings';
import { TUNING_STANDARD, getTuningById } from '../constants/guitarTunings';
import { GUITAR_MAX_FRET, OPEN_POSITION, tuningOpenMidi } from './guitarPositions';
import type { FretPlace, ReadDrillItem } from '../types/drill';

/** Every place on the neck that sounds exactly `midi`, low string first. */
export function placesForPitch(
  midi: number,
  tuning: GuitarTuning = TUNING_STANDARD,
  maxFret: number = GUITAR_MAX_FRET,
): FretPlace[] {
  const out: FretPlace[] = [];
  tuningOpenMidi(tuning).forEach((open, stringIndex) => {
    const fret = midi - open;
    if (fret >= 0 && fret <= maxFret) out.push({ stringIndex, fret });
  });
  return out;
}

/** The frets a position covers: Open = open strings + 1–4; N = N…N+3. */
export function positionWindow(position: number, maxFret: number = GUITAR_MAX_FRET): { fromFret: number; toFret: number; openStrings: boolean } {
  if (position === OPEN_POSITION) return { fromFret: 1, toFret: 4, openStrings: true };
  return { fromFret: position, toFret: Math.min(maxFret, position + 3), openStrings: false };
}

export interface PositionPlaces {
  places: FretPlace[];
  /** True when the pitch is only reachable by a one-fret stretch (N−1 or N+4). */
  stretch: boolean;
}

/**
 * Where `midi` is played in `position` (0 = Open, 2–12 = II–XII): the places
 * inside the window; failing that, the stretch places — but only for a pitch
 * between the window's lowest and highest note (a gap between strings), never
 * past either end. Empty when the position does not hold the pitch.
 */
export function placesInPosition(
  midi: number,
  position: number,
  tuning: GuitarTuning = TUNING_STANDARD,
  maxFret: number = GUITAR_MAX_FRET,
): PositionPlaces {
  const win = positionWindow(position, maxFret);
  const all = placesForPitch(midi, tuning, maxFret);
  const inside = all.filter((p) => (p.fret === 0 ? win.openStrings : p.fret >= win.fromFret && p.fret <= win.toFret));
  if (inside.length > 0) return { places: inside, stretch: false };
  if (position === OPEN_POSITION) return { places: [], stretch: false };
  const open = tuningOpenMidi(tuning);
  const lowest = Math.min(...open) + win.fromFret;
  const highest = Math.max(...open) + win.toFret;
  if (midi < lowest || midi > highest) return { places: [], stretch: false };
  const reach = all.filter((p) => (p.fret === win.fromFret - 1 && p.fret >= 1) || p.fret === win.toFret + 1);
  return { places: reach, stretch: reach.length > 0 };
}

/** The sounding pitches a position holds (ascending), with or without stretches. */
export function pitchesInPosition(
  position: number,
  tuning: GuitarTuning = TUNING_STANDARD,
  maxFret: number = GUITAR_MAX_FRET,
): number[] {
  const open = tuningOpenMidi(tuning);
  const out: number[] = [];
  for (let m = Math.min(...open); m <= Math.max(...open) + maxFret; m++) {
    if (placesInPosition(m, position, tuning, maxFret).places.length > 0) out.push(m);
  }
  return out;
}

// ─── Grading ────────────────────────────────────────────────────────────────

/** What the fretboard input reports: the place the learner tapped. */
export interface FretTap {
  stringIndex: number;
  fret: number;
}

export interface FretGrade {
  correct: boolean;
  /** Wrong, but close: the exact pitch outside the asked position, or the right note in the wrong octave. */
  nearMiss: boolean;
  reason: 'correct' | 'outsidePosition' | 'octave' | 'wrong';
  /** The pitch the tapped place sounds (in the item's tuning). */
  tappedMidi: number;
}

/**
 * Grade a tapped place against a reading item, by EXACT sounding pitch in the
 * item's own tuning (the bank is written for standard tuning; the board the
 * learner taps must be standard-tuned too).
 */
export function gradeFretAnswer(item: ReadDrillItem, tap: FretTap): FretGrade {
  const tuning = getTuningById(item.input.tuningId);
  const open = tuningOpenMidi(tuning);
  const valid =
    Number.isInteger(tap.stringIndex) && tap.stringIndex >= 0 && tap.stringIndex < open.length &&
    Number.isInteger(tap.fret) && tap.fret >= 0 && tap.fret <= item.input.maxFret;
  if (!valid) return { correct: false, nearMiss: false, reason: 'wrong', tappedMidi: Number.NaN };
  const tappedMidi = open[tap.stringIndex] + tap.fret;
  const accepted = item.answer.accepted.some((p) => p.stringIndex === tap.stringIndex && p.fret === tap.fret);
  if (accepted) return { correct: true, nearMiss: false, reason: 'correct', tappedMidi };
  if (tappedMidi === item.answer.midi) return { correct: false, nearMiss: true, reason: 'outsidePosition', tappedMidi };
  if ((tappedMidi - item.answer.midi) % 12 === 0) return { correct: false, nearMiss: true, reason: 'octave', tappedMidi };
  return { correct: false, nearMiss: false, reason: 'wrong', tappedMidi };
}
