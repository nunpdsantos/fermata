/**
 * What a demonstration's staff draws (second audit, M50–M56), worked out
 * before VexFlow is loaded: which staves, and for each voice its notes as
 * VexFlow keys and durations, the accidental each head needs, its ties, its
 * stem direction and where the bar lines fall. Pure, so the drawing
 * (`DemoStaff`) and its tests read the same plan.
 *
 *  - Staves: one, in the clef its voices use; treble above bass when a voice
 *    is on each (joined by a brace, as a grand staff).
 *  - Accidentals as a correct bar writes them: none where the key signature,
 *    or a note earlier in the same bar on the same line or space (in any
 *    voice of that staff), already supplies it; a natural where it would
 *    otherwise alter the note; a tied note never repeats its sign. The
 *    memory clears at each bar line.
 *  - Two voices on one staff: the upper with stems up, the lower down. One
 *    voice on a staff: VexFlow's own stem rule.
 */
import type { PitchedNote } from '../../../core/types/music';
import type { Demonstration, DemoValue } from '../../../core/types/demonstration';
import { demoBeats, demoNote } from '../../../core/utils/demonstration';
import { pitchedNoteToVexKey, keySignatureAlterations, staffLine, staffInkBounds } from '../../../utils/notationHelpers';
import { writtenOctave } from '../../../core/utils/degreeSpelling';

export type DemoClef = 'treble' | 'bass';

export interface PlannedNote {
  /** VexFlow keys, low to high ('f#/5'); a rest's key only places it. */
  keys: string[];
  pitches: PitchedNote[];
  /** VexFlow duration: 'w', 'h', 'q', '8', with 'r' for a rest. */
  duration: string;
  dots: number;
  rest: boolean;
  /** The sign drawn beside each head ('#', 'b', 'n', '##', 'bb'), or null. */
  accidentals: (string | null)[];
  tieToNext: boolean;
  /** 1 = up, -1 = down; undefined = VexFlow's own rule. */
  stem?: 1 | -1;
  /** Onset and length in quarter-note beats. */
  at: number;
  beats: number;
  /** The line of the drawing it stands on (0 = the first; lines break where the author marks them). */
  row: number;
}

export interface PlannedVoice {
  staff: DemoClef;
  notes: PlannedNote[];
  /** A bar line comes after the note at each of these indices (not where a line ends: the line's end is its bar line). */
  barsAfter: number[];
}

export interface DemoStaffPlan {
  staves: DemoClef[];
  key?: string;
  time?: string;
  voices: PlannedVoice[];
  /** How many lines the drawing has, and the beat each starts on. */
  rows: number;
  rowStarts: number[];
}

const BASE: Record<DemoValue, { duration: string; dots: number }> = {
  w: { duration: 'w', dots: 0 },
  'h.': { duration: 'h', dots: 1 },
  h: { duration: 'h', dots: 0 },
  'q.': { duration: 'q', dots: 1 },
  q: { duration: 'q', dots: 0 },
  '8': { duration: '8', dots: 0 },
};
const REST_KEY: Record<DemoClef, string> = { treble: 'b/4', bass: 'd/3' };
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** A head's line or space: its letter and WRITTEN octave (C♭4 sits where C4 does). */
const staffStep = (p: PitchedNote) => LETTERS.indexOf(p.natural) + 7 * writtenOctave(p, p.octave);

export function demoStaffPlan(demo: Demonstration): DemoStaffPlan {
  const staves = (['treble', 'bass'] as const).filter((clef) => demo.voices.some((v) => v.staff === clef));
  const bar = demo.time ? (() => { const [n, d] = demo.time.split('/').map(Number); return (n * 4) / d; })() : Infinity;
  // Where the lines start: after each event of the first voice marked lineBreak.
  const rowStarts = [0];
  demo.voices[0]?.events.reduce((t, e) => {
    const end = t + demoBeats(e.value);
    if (e.lineBreak) rowStarts.push(end);
    return end;
  }, 0);
  const rowOf = (at: number) => rowStarts.filter((r) => r <= at + 1e-9).length - 1;
  const voices: PlannedVoice[] = demo.voices.map((voice) => {
    const shared = demo.voices.filter((v) => v.staff === voice.staff);
    const stem = shared.length > 1 ? (shared.indexOf(voice) === 0 ? 1 : -1) : undefined;
    let at = 0;
    const barsAfter: number[] = [];
    const notes = voice.events.map((event, i): PlannedNote => {
      const beats = demoBeats(event.value);
      const pitches = event.notes.map(demoNote);
      const rest = pitches.length === 0;
      const planned: PlannedNote = {
        keys: rest ? [REST_KEY[voice.staff]] : pitches.map(pitchedNoteToVexKey),
        pitches,
        duration: BASE[event.value].duration + (rest ? 'r' : ''),
        dots: BASE[event.value].dots,
        rest,
        accidentals: pitches.map(() => null),
        tieToNext: !!event.tie,
        ...(stem ? { stem } : {}),
        at,
        beats,
        row: rowOf(at),
      };
      at += beats;
      const lineEnds = rowStarts.some((r) => Math.abs(r - at) < 1e-9);
      if (Number.isFinite(bar) && i < voice.events.length - 1 && !lineEnds && Math.abs(at / bar - Math.round(at / bar)) < 1e-9) barsAfter.push(i);
      return planned;
    });
    return { staff: voice.staff, notes, barsAfter };
  });

  // Accidentals, staff by staff, in time order across that staff's voices.
  const signature = keySignatureAlterations(demo.key);
  for (const clef of staves) {
    const heads = voices
      .filter((v) => v.staff === clef)
      .flatMap((v) => v.notes.flatMap((n, i) => n.pitches.map((p, k) => ({ voice: v, n, i, k, p }))))
      .sort((a, b) => a.n.at - b.n.at);
    let barIndex = -1;
    let memory = new Map<number, string>();
    for (const h of heads) {
      // A new bar, or a new line (each line is a measure of its own), starts the signs afresh.
      const thisBar = (Number.isFinite(bar) ? Math.floor(h.n.at / bar + 1e-9) : 0) * 1000 + h.n.row;
      if (thisBar !== barIndex) {
        memory = new Map();
        barIndex = thisBar;
      }
      const step = staffStep(h.p);
      const inForce = memory.get(step) ?? signature[h.p.natural] ?? '';
      // A note tied into is the note before it, held: it prints no sign, and
      // it is no sign for the rest of the bar (a later note there needs its own).
      const tiedInto = h.i > 0 && h.voice.notes[h.i - 1].tieToNext;
      if (tiedInto) continue;
      if (h.p.accidental !== inForce) h.n.accidentals[h.k] = h.p.accidental === '' ? 'n' : h.p.accidental;
      memory.set(step, h.p.accidental);
    }
  }
  return { staves, ...(demo.key ? { key: demo.key } : {}), ...(demo.time ? { time: demo.time } : {}), voices, rows: rowStarts.length, rowStarts };
}

const STEM = 36;
const STAFF_GAP = 84;

/** Ink above and below a staff's top line origin (VexFlow's staveY), for the notes it holds. */
function staffInk(plan: DemoStaffPlan, clef: DemoClef): { top: number; bottom: number } {
  const base = staffInkBounds([], clef, { keySignature: plan.key });
  let { top, bottom } = base;
  if (Object.keys(keySignatureAlterations(plan.key)).length === 0) top = Math.min(top, 40);
  for (const voice of plan.voices.filter((v) => v.staff === clef)) {
    for (const n of voice.notes) {
      if (n.rest) continue;
      const ys = n.pitches.map((p) => 90 - 10 * staffLine(p, clef));
      const hi = Math.min(...ys);
      const lo = Math.max(...ys);
      const accidental = n.accidentals.some(Boolean) ? 18 : 8;
      top = Math.min(top, hi - accidental);
      bottom = Math.max(bottom, lo + accidental);
      if (n.duration.startsWith('w')) continue;
      // The stem: forced (two voices) or VexFlow's rule, by the farther head from the middle line.
      const up = n.stem ? n.stem === 1 : (60 - hi) <= (lo - 60);
      if (up) top = Math.min(top, hi - STEM);
      else bottom = Math.max(bottom, lo + STEM);
    }
  }
  return { top, bottom };
}

/** Room each kind of mark needs across the staff, in VexFlow's units (px at scale 1). */
const ROOM = { start: 50, keySign: 10, time: 22, note: 28, rest: 22, sign: 10, dot: 6, bar: 12, end: 16, grand: 12 };
/** Space between two lines of the drawing. */
const ROW_GAP = 8;

/**
 * The width a line of the drawing needs so that no two notes crowd: the clef
 * and key signature (and, on the first line, the time signature), then each
 * moment of the music (the widest of the voices sounding at it: a note, its
 * signs and dot) and each bar line. The drawing is as wide as its widest
 * line; a narrower box draws it at this width and shows it scaled down
 * (`DemoStaff`).
 */
export function demoStaffWidth(plan: DemoStaffPlan): number {
  const signs = Object.keys(keySignatureAlterations(plan.key)).length;
  let widest = 0;
  for (let row = 0; row < plan.rows; row++) {
    const moments = new Map<number, number>();
    for (const voice of plan.voices) {
      for (const n of voice.notes.filter((x) => x.row === row)) {
        const need = (n.rest ? ROOM.rest : ROOM.note) + ROOM.sign * n.accidentals.filter(Boolean).length + (n.dots ? ROOM.dot : 0);
        const at = Math.round(n.at * 1000);
        moments.set(at, Math.max(moments.get(at) ?? 0, need));
      }
    }
    const bars = Math.max(0, ...plan.voices.map((v) => v.barsAfter.filter((i) => v.notes[i].row === row).length));
    const music = [...moments.values()].reduce((a, b) => a + b, 0);
    widest = Math.max(widest, ROOM.start + signs * ROOM.keySign + (plan.time && row === 0 ? ROOM.time : 0) + music + bars * ROOM.bar + ROOM.end + (plan.staves.length > 1 ? ROOM.grand : 0));
  }
  return Math.ceil(widest);
}

/**
 * Where everything stands: each staff's y within a line (`ys`), each line's
 * top (`rowTops`), how tall the drawing is, and the width it needs. Every
 * line is as tall as the tallest ink of the whole demonstration, so the
 * lines line up and the height is known from the data alone.
 */
export function demoStaffLayout(plan: DemoStaffPlan): { ys: number[]; rowTops: number[]; rowHeight: number; height: number; width: number } {
  const inks = plan.staves.map((clef) => staffInk(plan, clef));
  const ys: number[] = [];
  inks.forEach((ink, i) => {
    if (i === 0) ys.push(Math.max(0, 4 - ink.top));
    else ys.push(Math.max(ys[i - 1] + STAFF_GAP, ys[i - 1] + inks[i - 1].bottom + 8 - ink.top));
  });
  const last = inks.length - 1;
  const rowHeight = Math.ceil(Math.max(100, ys[last] + inks[last].bottom + 4));
  const rowTops = Array.from({ length: plan.rows }, (_, r) => r * (rowHeight + ROW_GAP));
  return { ys, rowTops, rowHeight, height: rowTops[rowTops.length - 1] + rowHeight, width: demoStaffWidth(plan) };
}

/**
 * The box a demonstration's staff stands in, the same before its code loads
 * and after it draws, so nothing below it moves when it arrives: the full
 * width of its column, as tall as the drawing (`height`), or proportionally
 * less when the column is narrower than the drawing needs (`width`), where
 * the drawing is shown scaled down to fit.
 */
export function demoBoxStyle(layout: { width: number; height: number }): { width: string; aspectRatio: string; maxHeight: number } {
  return { width: '100%', aspectRatio: `${layout.width} / ${layout.height}`, maxHeight: layout.height };
}
