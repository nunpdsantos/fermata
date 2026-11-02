// Fingered 2- and 3-octave scale routes for the classical guitar (audit
// W10-03, W10-09; decision D-04).
//
// Exam scales are played from memory, from the LOWEST POSSIBLE TONIC on the
// instrument, over two or three octaves, up and down (ABRSM guitar syllabus,
// audit Track G R3/R7; LCM R12; Trinity R9). Any left-hand fingering is
// allowed (ABRSM R2); the classical tradition fixes one route per key that
// climbs the neck with a few guided shifts (Segovia's scales, R21 — his exact
// fingerings were not seen by the research and are NOT reproduced here). This
// module generates such a route: a SUGGESTED fingering, computed — never
// copied from a book — by the shortest-path search in guitarFingering.ts.
//
//   • Notes and spelling come from the one spelling engine (buildScale); each
//     note's degree label is read back from its spelling.
//   • The ascent starts on the lowest tonic the tuning reaches and climbs the
//     requested number of octaves; a request the neck cannot hold (3 octaves
//     from A: A2–A5 would need fret 17) returns null.
//   • The descent is the ascent reversed, except melodic minor, which comes
//     down as the natural minor (raised 6th and 7th going up, lowered coming
//     down — audit W10-09). That descent is searched on its own, pinned to the
//     ascent's top and bottom notes and nudged onto the ascent's strings where
//     the two share a pitch.
//
// Pure and framework-agnostic.

import type { Note, ScaleType } from '../types/music';
import type { GuitarTuning } from '../constants/guitarTunings';
import { TUNING_STANDARD } from '../constants/guitarTunings';
import { getPitchClass } from '../constants/notes';
import { buildScale, SCALE_FORMULAS } from '../constants/scales';
import { SCALE_DEGREE_FORMULAS } from './degreeSpelling';
import { GUITAR_MAX_FRET, scaleDegreeLabel, tuningOpenMidi } from './guitarPositions';
import { fingerLine, fingerLineScored, reverseFingering } from './guitarFingering';
import type { FingeredNote, LinePitch, NotePin } from './guitarFingering';

/** Heptatonic scale types with one letter per degree — the ones a route can be spelled for. */
export const ROUTE_SCALE_TYPES: readonly ScaleType[] = (Object.keys(SCALE_DEGREE_FORMULAS) as ScaleType[]).filter(
  (t) => SCALE_DEGREE_FORMULAS[t].length === 7 && new Set(SCALE_DEGREE_FORMULAS[t].map((d) => d.replace(/\D/g, ''))).size === 7,
);

/** The four scale forms of the exam syllabuses. */
export const EXAM_SCALE_TYPES: readonly ScaleType[] = ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor'];

export interface ScaleRouteNote extends FingeredNote {
  /** Scale degree 1–7. */
  degree: number;
  /** '1', 'b3', '#4', … read from the spelling. */
  degreeLabel: string;
  isTonic: boolean;
}

export interface ScaleRoute {
  root: Note;
  scaleType: ScaleType;
  /** natural_minor for melodic minor; the scale itself otherwise. */
  descendingScaleType: ScaleType;
  tuningId: string;
  octaves: number;
  /** Bottom tonic → top tonic (7·octaves + 1 notes). */
  ascending: ScaleRouteNote[];
  /** Top tonic → bottom tonic; its first note is the ascent's last (played once). */
  descending: ScaleRouteNote[];
  shiftCount: { ascending: number; descending: number };
}

export interface ScaleRouteOptions {
  /** 2 (default) or 3. */
  octaves?: number;
  tuning?: GuitarTuning;
  maxFret?: number;
  /** See FingeringOptions.openStrings: 'low-positions' (default) or 'avoid' (closed positions). */
  openStrings?: 'low-positions' | 'avoid';
}

/** MIDI of the lowest tonic of `root` the tuning can play. */
export function lowestTonicMidi(root: Note, tuning: GuitarTuning = TUNING_STANDARD): number {
  const low = Math.min(...tuningOpenMidi(tuning));
  const pc = getPitchClass(root);
  return low + ((pc - (low % 12) + 12) % 12);
}

/** Highest MIDI the neck reaches (top string at `maxFret`). */
export function highestMidi(tuning: GuitarTuning = TUNING_STANDARD, maxFret: number = GUITAR_MAX_FRET): number {
  return Math.max(...tuningOpenMidi(tuning)) + maxFret;
}

/** How many whole octaves a scale on `root` can climb from its lowest tonic. */
export function maxScaleOctaves(
  root: Note,
  tuning: GuitarTuning = TUNING_STANDARD,
  maxFret: number = GUITAR_MAX_FRET,
): number {
  return Math.floor((highestMidi(tuning, maxFret) - lowestTonicMidi(root, tuning)) / 12);
}

/** The scale's spelled pitches from `startMidi`, `octaves` octaves up (or down: reverse the result). */
export function scaleLine(root: Note, scaleType: ScaleType, startMidi: number, octaves: number): (LinePitch & { degree: number })[] {
  const notes = buildScale(root, scaleType).notes;
  const semis = SCALE_FORMULAS[scaleType];
  const out: (LinePitch & { degree: number })[] = [];
  for (let o = 0; o < octaves; o++) {
    for (let d = 0; d < notes.length; d++) {
      out.push({ midi: startMidi + 12 * o + semis[d], note: notes[d], degree: d + 1, openFree: d === 0 });
    }
  }
  out.push({ midi: startMidi + 12 * octaves, note: notes[0], degree: 1, openFree: true });
  return out;
}

function decorate(root: Note, notes: FingeredNote[], degrees: number[]): ScaleRouteNote[] {
  return notes.map((n, i) => ({
    ...n,
    degree: degrees[i],
    degreeLabel: scaleDegreeLabel(root, n.note),
    isTonic: degrees[i] === 1,
  }));
}

const countShifts = (notes: readonly FingeredNote[]) => notes.filter((n) => n.shift !== null).length;

/** What a re-spread at the top of a melodic-minor scale costs, against keeping the hand's frame. */
const REACH_COST = 15;

/**
 * A suggested fingered route for `scaleType` on `root`, from the lowest tonic,
 * `octaves` octaves up and back down; null when the neck cannot hold it or the
 * scale is not heptatonic.
 */
export function getScaleRoute(root: Note, scaleType: ScaleType, options: ScaleRouteOptions = {}): ScaleRoute | null {
  const tuning = options.tuning ?? TUNING_STANDARD;
  const maxFret = options.maxFret ?? GUITAR_MAX_FRET;
  const octaves = options.octaves ?? 2;
  if (!ROUTE_SCALE_TYPES.includes(scaleType)) return null;
  if (!Number.isInteger(octaves) || octaves < 1) return null;
  if (octaves > maxScaleOctaves(root, tuning, maxFret)) return null;

  const start = lowestTonicMidi(root, tuning);
  const upLine = scaleLine(root, scaleType, start, octaves);
  const openStrings = options.openStrings ?? 'low-positions';
  const up = fingerLine(upLine, { tuning, maxFret, openStrings });
  if (up === null) return null;
  const ascending = decorate(root, up, upLine.map((p) => p.degree));

  const descendingScaleType: ScaleType = scaleType === 'melodic_minor' ? 'natural_minor' : scaleType;
  let descending: ScaleRouteNote[];
  if (descendingScaleType === scaleType) {
    descending = decorate(root, reverseFingering(up), [...upLine].reverse().map((p) => p.degree));
  } else {
    // Search the natural-minor line in ascending order (the costs are
    // symmetric under reversal), pinned to the ascent's two tonics. At the top
    // the hand either keeps the ascent's frame, or keeps the finger on the top
    // note and re-spreads around it in the same position — reported as a reach
    // on the first note down, and charged REACH_COST. The cheaper wins: a
    // re-spread that lets the index reach back beats sliding one finger down
    // the string twice (B melodic minor: 2-1 then an index shift, not 2-2-2).
    const downLine = scaleLine(root, descendingScaleType, start, octaves);
    const first = up[0];
    const top = up[up.length - 1];
    const reference = new Map(up.map((n) => [n.midi, { stringIndex: n.stringIndex, fret: n.fret }]));
    const search = (end: NotePin) =>
      fingerLineScored(downLine, {
        tuning,
        maxFret,
        openStrings,
        reference,
        start: { stringIndex: first.stringIndex, fret: first.fret },
        end,
      });
    const keep = search({ stringIndex: top.stringIndex, fret: top.fret, frame: top.frame });
    const respread = search({ stringIndex: top.stringIndex, fret: top.fret, finger: top.finger, position: top.position });
    const reachCost = (r: typeof respread) =>
      r === null ? Infinity : r.cost + (JSON.stringify(r.notes[r.notes.length - 1].frame) === JSON.stringify(top.frame) ? 0 : REACH_COST);
    const chosen = keep !== null && keep.cost <= reachCost(respread) ? keep : respread;
    if (chosen === null) return null;
    const down = chosen.notes;
    const reversed = reverseFingering(down);
    const turn = reversed[1];
    if (
      top.fret > 0 &&
      turn &&
      turn.shift === null &&
      top.position !== null &&
      JSON.stringify(reversed[0].frame) !== JSON.stringify(top.frame)
    ) {
      reversed[1] = {
        ...turn,
        reach: { position: top.position, anchorFinger: top.finger, anchorFret: top.fret, stringIndex: top.stringIndex },
      };
    }
    descending = decorate(root, reversed, [...downLine].reverse().map((p) => p.degree));
  }

  return {
    root,
    scaleType,
    descendingScaleType,
    tuningId: tuning.id,
    octaves,
    ascending,
    descending,
    shiftCount: { ascending: countShifts(ascending), descending: countShifts(descending) },
  };
}

/** Up and down in one list, the top tonic played once. */
export function fullRoute(route: ScaleRoute): ScaleRouteNote[] {
  return [...route.ascending, ...route.descending.slice(1)];
}
