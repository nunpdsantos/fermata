// Classical guitar positions, generated from the scale engine (audit W3-01,
// decision D-02). Replaces the hand-typed CAGED/3NPS library, which had wrong
// notes and labels in 74 of its 85 boxes.
//
// A position is named after the fret under the index finger (Roman numerals:
// "V position" = index at fret 5). The hand covers a 4-fret window, one
// finger per fret:
//
//   • Position N (1–12): frets N…N+3, finger = fret − N + 1.
//   • Open position (0): open strings (finger 0) plus frets 1–4 (fingers 1–4)
//     — the "first position with open strings" beginner programmes start in.
//
// Every scale tone inside the window is played, on every string. Where two
// strings could play the same pitch inside the window (e.g. the open B and the
// G string's 4th fret), only one is kept — the one on the higher string, which
// is the lower fret (and the open string in Open position).
//
// Strings tuned a 4th apart leave a one-semitone hole between the top of one
// string's window and the bottom of the next (string s fret N+4 = string s+1
// fret N−1). When that pitch belongs to the scale, the scale would skip it, so
// the hand stretches: the 4th finger reaches up to N+4 or the 1st finger back
// to N−1. Only one side is used per position, so the hand never spans more
// than 5 frets. The upward stretch is the default (it keeps the index finger
// on the fret that names the position); the downward one is used when it
// fills more holes, and always at XII (N+4 would be past the 15th fret).
// Strings a 5th apart (Drop D, DADGAD, open tunings) leave a 3-semitone hole
// whose middle note is out of reach; such notes are reported, never faked.
//
// Pure and framework-agnostic: notes, spelling and degree labels come from
// buildScale(); pitches from the tuning. Nothing here is hand-authored.

import type { Note, ScaleType } from '../types/music';
import { buildScale } from '../constants/scales';
import { getPitchClass } from '../constants/notes';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import type { GuitarTuning } from '../constants/guitarTunings';

/** Highest fret drawn on the app's fretboard. */
export const GUITAR_MAX_FRET = 15;
/** Position 0 is the Open position; 1–12 are I–XII. */
export const OPEN_POSITION = 0;
export const MAX_POSITION = 12;
export const POSITION_NUMBERS: readonly number[] = Array.from({ length: MAX_POSITION + 1 }, (_, i) => i);

/** Left-hand finger: 0 = open string, 1 = index … 4 = little finger. */
export type LeftHandFinger = 0 | 1 | 2 | 3 | 4;

export interface PositionNote {
  /** 0 = 6th string (lowest) … 5 = 1st string (highest). */
  stringIndex: number;
  fret: number;
  midi: number;
  pitchClass: number;
  /** 0-based index into buildScale(root, type).notes. */
  degreeIndex: number;
  /** Scale-degree label in ♭3 style ASCII: '1', 'b3', '#4', 'bb7'. */
  degreeLabel: string;
  /** The engine's spelling of this scale tone. */
  note: Note;
  /** Suggested left-hand finger. */
  finger: LeftHandFinger;
  /** Outside the 4-fret window (index back to N−1 or little finger up to N+4). */
  isStretch: boolean;
  isRoot: boolean;
}

export interface GuitarPosition {
  position: number;
  /** Fretted window (Open: 1–4; position N: N…N+3). */
  windowStart: number;
  windowEnd: number;
  stretch: 'none' | 'up' | 'down';
  /** Sorted low → high by pitch. */
  notes: PositionNote[];
  /** Scale pitch classes that no note in this position plays (documented exceptions). */
  missingPitchClasses: number[];
  /**
   * Scale pitches inside the position's range that the hand cannot reach
   * (MIDI, ascending): the middle of the gap between strings a 5th apart in
   * Drop D / DADGAD / open tunings. Always empty in standard tuning.
   */
  skippedMidi: number[];
}

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const MAJOR_SEMIS = [0, 2, 4, 5, 7, 9, 11];
// Fallback when a spelling is beyond double accidentals (engine respelled it).
const SEMITONE_LABELS = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

/**
 * Scale-degree label of `note` above `root`, from the engine's spelling: the
 * letter distance gives the degree number, the semitone distance the
 * accidental ('b3', '#4'). Always consistent with the sounding pitch.
 */
export function scaleDegreeLabel(root: Note, note: Note): string {
  const steps = (LETTERS.indexOf(note.natural) - LETTERS.indexOf(root.natural) + 7) % 7;
  const semis = (getPitchClass(note) - getPitchClass(root) + 12) % 12;
  let diff = semis - MAJOR_SEMIS[steps];
  if (diff > 6) diff -= 12;
  if (diff < -6) diff += 12;
  if (Math.abs(diff) > 2) return SEMITONE_LABELS[semis];
  return (diff < 0 ? 'b'.repeat(-diff) : '#'.repeat(diff)) + String(steps + 1);
}

/** Pitch class → { degree index, spelled note, label } for a scale. */
export function scaleDegreeMap(root: Note, scaleType: ScaleType): Map<number, { degreeIndex: number; note: Note; label: string }> {
  const scale = buildScale(root, scaleType);
  const map = new Map<number, { degreeIndex: number; note: Note; label: string }>();
  scale.notes.forEach((n, i) => {
    const pc = getPitchClass(n);
    if (!map.has(pc)) map.set(pc, { degreeIndex: i, note: n, label: scaleDegreeLabel(root, n) });
  });
  return map;
}

/** MIDI number of each open string, 6th → 1st. */
export function tuningOpenMidi(tuning: GuitarTuning): number[] {
  return tuning.strings.map((s) => 12 * (s.octave + 1) + getPitchClass(s));
}

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** 1–12 → 'I'…'XII'. Position 0 (Open) has no numeral — the UI names it. */
export function toRomanNumeral(n: number): string {
  return ROMAN[n] ?? String(n);
}

function clampPosition(position: number): number {
  if (!Number.isFinite(position)) return OPEN_POSITION;
  return Math.min(MAX_POSITION, Math.max(OPEN_POSITION, Math.round(position)));
}

interface Candidate { stringIndex: number; fret: number; isStretch: boolean }

/**
 * The notes of `scaleType` on `root` in classical position `position`
 * (0 = Open, 1–12 = I–XII) under `tuning`.
 */
export function getGuitarPosition(
  root: Note,
  scaleType: ScaleType,
  position: number,
  tuning: GuitarTuning = TUNING_STANDARD,
  maxFret: number = GUITAR_MAX_FRET,
): GuitarPosition {
  const n = clampPosition(position);
  const degrees = scaleDegreeMap(root, scaleType);
  const rootPc = getPitchClass(root);
  const openMidi = tuningOpenMidi(tuning);

  const lo = n === OPEN_POSITION ? 0 : n;
  const hi = Math.min(maxFret, n === OPEN_POSITION ? 4 : n + 3);
  const upFret = n === OPEN_POSITION ? 5 : n + 4;
  const downFret = n >= 2 ? n - 1 : null; // N−1 = 0 would be an open string, not a stretch

  // 1. Scale tones inside the window; unisons keep the higher string.
  const byMidi = new Map<number, Candidate>();
  openMidi.forEach((open, s) => {
    for (let f = lo; f <= hi; f++) {
      const midi = open + f;
      if (!degrees.has(midi % 12)) continue;
      const existing = byMidi.get(midi);
      if (!existing || s > existing.stringIndex) byMidi.set(midi, { stringIndex: s, fret: f, isStretch: false });
    }
  });

  // 2. Holes: scale pitches between the window's lowest and highest pitch that
  //    no string reaches inside the window.
  const winLo = Math.min(...openMidi.map((o) => o + lo));
  const winHi = Math.max(...openMidi.map((o) => o + hi));
  const holes: number[] = [];
  for (let m = winLo; m <= winHi; m++) {
    if (degrees.has(m % 12) && !byMidi.has(m)) holes.push(m);
  }

  // 3. Fill holes with stretches on ONE side (hand span ≤ 5 frets).
  const fillsFor = (fret: number | null): Candidate[] => {
    if (fret === null || fret > maxFret || fret < 1) return [];
    const out: Candidate[] = [];
    for (const m of holes) {
      const s = openMidi.findIndex((o) => o + fret === m);
      if (s >= 0) out.push({ stringIndex: s, fret, isStretch: true });
    }
    return out;
  };
  const up = fillsFor(upFret);
  const down = fillsFor(downFret);
  // A stretch whose string already plays the neighbouring window fret makes
  // one finger play two frets on that string (4th finger at N+3 and N+4, or
  // 1st at N and N−1). Prefer the side with fewer of those.
  const conflicts = (fills: Candidate[], neighbourFret: number) =>
    fills.filter((c) => degrees.has((openMidi[c.stringIndex] + neighbourFret) % 12)).length;
  let stretch: GuitarPosition['stretch'] = 'none';
  let chosen: Candidate[] = [];
  if (up.length > 0 || down.length > 0) {
    const upScore = [up.length, -conflicts(up, upFret - 1)];
    const downScore = [down.length, -conflicts(down, (downFret ?? 0) + 1)];
    const upWins = upScore[0] !== downScore[0] ? upScore[0] > downScore[0] : upScore[1] >= downScore[1];
    if (upWins) { stretch = 'up'; chosen = up; }
    else { stretch = 'down'; chosen = down; }
  }
  for (const c of chosen) byMidi.set(openMidi[c.stringIndex] + c.fret, c);
  const skippedMidi = holes.filter((m) => !byMidi.has(m));

  // 4. Fingers, labels.
  const notes: PositionNote[] = [];
  for (const [midi, c] of byMidi) {
    const pc = midi % 12;
    const deg = degrees.get(pc)!;
    let finger: LeftHandFinger;
    if (c.fret === 0) finger = 0;
    else if (c.isStretch) finger = c.fret === downFret ? 1 : 4;
    else finger = (n === OPEN_POSITION ? c.fret : c.fret - n + 1) as LeftHandFinger;
    notes.push({
      stringIndex: c.stringIndex,
      fret: c.fret,
      midi,
      pitchClass: pc,
      degreeIndex: deg.degreeIndex,
      degreeLabel: deg.label,
      note: deg.note,
      finger,
      isStretch: c.isStretch,
      isRoot: pc === rootPc,
    });
  }
  notes.sort((a, b) => a.midi - b.midi);

  const present = new Set(notes.map((x) => x.pitchClass));
  const missingPitchClasses = [...degrees.keys()].filter((pc) => !present.has(pc)).sort((a, b) => a - b);

  return {
    position: n,
    windowStart: n === OPEN_POSITION ? 1 : n,
    windowEnd: hi,
    stretch,
    notes,
    missingPitchClasses,
    skippedMidi,
  };
}

/**
 * Sensible default position for a scale: the lowest one whose window holds
 * the root on the 6th or 5th string (not as a stretch) — where a classical
 * scale study would start.
 */
export function suggestGuitarPosition(
  root: Note,
  scaleType: ScaleType,
  tuning: GuitarTuning = TUNING_STANDARD,
): number {
  for (const n of POSITION_NUMBERS) {
    const pos = getGuitarPosition(root, scaleType, n, tuning);
    if (pos.notes.some((x) => x.stringIndex <= 1 && x.isRoot && !x.isStretch)) return n;
  }
  return OPEN_POSITION;
}

/**
 * Storage key for a fingering override (W10-05, decision D-03).
 *
 * Closed positions are movable: the same scale in the same position relative
 * to its root is the same shape anywhere on the neck (C major in V = D major
 * in VII), so the key uses the position relative to the root and the fret
 * relative to the position. That way a teacher's fingering, entered once,
 * follows the shape. The Open position is not movable (open strings), so it
 * is keyed by its root.
 */
export function fingeringKey(
  scaleType: ScaleType,
  tuningId: string,
  position: number,
  rootPc: number,
  stringIndex: number,
  fret: number,
): string {
  if (position === OPEN_POSITION) {
    return `${scaleType}|${tuningId}|open${rootPc}|${stringIndex}|${fret}`;
  }
  const rel = (((position - rootPc) % 12) + 12) % 12;
  return `${scaleType}|${tuningId}|p${rel}|${stringIndex}|${fret - position}`;
}
