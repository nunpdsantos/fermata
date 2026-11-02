/**
 * Rhythm patterns (audit W5-64): parse the compact text form used by the
 * rhythm lessons and questions, check that every bar adds up to its time
 * signature, and compute the PLAYBACK SCHEDULE — a one-bar count-in, then one
 * click per sounded note, each lasting exactly its written value at the
 * pattern's tempo. Pure and framework-agnostic: the staff drawing
 * (RhythmStaff) and the audio (rhythmPlayback) both read this, and the tests
 * check the schedule against the written durations.
 *
 * Text form (see RhythmPattern): 'q q h | h. qr | t8 t8 t8 q h~ | q'.
 */
import type { RhythmPattern } from '../types/exercise';

export type RhythmBase = 'w' | 'h' | 'q' | '8' | '16';

export interface RhythmToken {
  base: RhythmBase;
  dotted: boolean;
  rest: boolean;
  /** Tied to the next token (which then sounds no new onset). */
  tie: boolean;
  /** One note of an eighth-note triplet (three make one quarter). */
  triplet: boolean;
  accent: boolean;
  /** Length in quarter notes (dots and triplets applied). */
  quarters: number;
}

export interface ParsedRhythm {
  /** [beats per bar, beat unit] e.g. [6, 8]. */
  time: [number, number];
  bars: RhythmToken[][];
}

const BASE_QUARTERS: Record<RhythmBase, number> = { w: 4, h: 2, q: 1, '8': 0.5, '16': 0.25 };
const TOKEN = /^(>)?(t)?(w|h|q|16|8)(\.)?(r)?(~)?$/;

export function parseTimeSignature(time: string): [number, number] {
  const m = /^(\d+)\/(\d+)$/.exec(time.trim());
  if (!m) throw new Error(`Not a time signature: "${time}"`);
  return [parseInt(m[1], 10), parseInt(m[2], 10)];
}

export function parseRhythmToken(text: string): RhythmToken {
  const m = TOKEN.exec(text);
  if (!m) throw new Error(`Not a rhythm value: "${text}"`);
  const base = m[3] as RhythmBase;
  const triplet = !!m[2];
  if (triplet && base !== '8') throw new Error(`Only eighth-note triplets are supported: "${text}"`);
  const dotted = !!m[4];
  let quarters = BASE_QUARTERS[base];
  if (dotted) quarters *= 1.5;
  if (triplet) quarters *= 2 / 3;
  return { base, dotted, rest: !!m[5], tie: !!m[6], triplet, accent: !!m[1], quarters };
}

export function parseRhythm(pattern: RhythmPattern): ParsedRhythm {
  const time = parseTimeSignature(pattern.time);
  const bars = pattern.notes
    .split('|')
    .map((bar) => bar.trim())
    .filter((bar) => bar.length > 0)
    .map((bar) => bar.split(/\s+/).map(parseRhythmToken));
  return { time, bars };
}

/** Quarter notes in one bar of a time signature (6/8 → 3, 5/4 → 5). */
export function barQuarters([beats, unit]: [number, number]): number {
  return (beats * 4) / unit;
}

/**
 * Problems with a pattern (empty when it is well formed): every bar must add
 * up exactly to the time signature, triplets come in threes, a tie joins two
 * sounded notes, and the pattern does not end on a tie.
 */
export function rhythmProblems(pattern: RhythmPattern): string[] {
  const problems: string[] = [];
  let parsed: ParsedRhythm;
  try {
    parsed = parseRhythm(pattern);
  } catch (e) {
    return [(e as Error).message];
  }
  const want = barQuarters(parsed.time);
  const flat = parsed.bars.flat();
  parsed.bars.forEach((bar, i) => {
    const sum = bar.reduce((n, t) => n + t.quarters, 0);
    if (Math.abs(sum - want) > 1e-9) problems.push(`bar ${i + 1}: ${round(sum)} quarters, the time signature wants ${round(want)}`);
    // Each unbroken run of triplet eighths is a whole number of triplets.
    const runs: number[] = [];
    let run = 0;
    for (const t of [...bar, null]) {
      if (t?.triplet) run++;
      else {
        if (run > 0) runs.push(run);
        run = 0;
      }
    }
    if (runs.some((r) => r % 3 !== 0)) problems.push(`bar ${i + 1}: triplet eighths must come in groups of three`);
  });
  flat.forEach((t, i) => {
    if (!t.tie) return;
    const next = flat[i + 1];
    if (t.rest) problems.push(`token ${i + 1}: a rest cannot be tied`);
    else if (!next) problems.push('the last note cannot be tied');
    else if (next.rest) problems.push(`token ${i + 1}: tied into a rest`);
  });
  if (parsed.bars.length === 0) problems.push('no bars');
  return problems;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

export interface RhythmEvent {
  /** Seconds from the start of playback. */
  at: number;
  /** Seconds the click / note lasts (its written value, ties included). */
  duration: number;
  kind: 'count' | 'note';
  accent: boolean;
  /** For a note: the index of its token in the flattened pattern. */
  token?: number;
}

export interface RhythmSchedule {
  /** Seconds per quarter note. */
  secondsPerQuarter: number;
  /** When the pattern's first bar starts (after the count-in). */
  start: number;
  events: RhythmEvent[];
  /** Seconds until the pattern's last value has ended. */
  total: number;
}

/**
 * The count-in beats of one bar: the felt beat — dotted quarters in compound
 * time (6/8, 9/8, 12/8), otherwise one click per beat unit (3/4 → three
 * quarters, 7/8 → seven eighths).
 */
export function countInBeats([beats, unit]: [number, number]): { count: number; quarters: number } {
  if (unit === 8 && beats % 3 === 0 && beats > 3) return { count: beats / 3, quarters: 1.5 };
  return { count: beats, quarters: 4 / unit };
}

export const DEFAULT_RHYTHM_BPM = 80;

/**
 * When everything sounds. A note's onset is the sum of the written values
 * before it; its length is its value plus any values tied to it; rests sound
 * nothing but take their time.
 */
export function rhythmSchedule(pattern: RhythmPattern, bpm = pattern.bpm ?? DEFAULT_RHYTHM_BPM): RhythmSchedule {
  const parsed = parseRhythm(pattern);
  const spq = 60 / bpm;
  const events: RhythmEvent[] = [];
  const beat = countInBeats(parsed.time);
  for (let i = 0; i < beat.count; i++) {
    events.push({ at: i * beat.quarters * spq, duration: Math.min(0.12, beat.quarters * spq * 0.5), kind: 'count', accent: i === 0 });
  }
  const start = beat.count * beat.quarters * spq;
  const flat = parsed.bars.flat();
  let t = start;
  let tiedInto = false;
  flat.forEach((token, i) => {
    const length = token.quarters * spq;
    if (!token.rest && !tiedInto) {
      // The note lasts through every value tied after it.
      let quarters = token.quarters;
      for (let j = i; flat[j]?.tie && flat[j + 1]; j++) quarters += flat[j + 1].quarters;
      events.push({ at: t, duration: quarters * spq, kind: 'note', accent: token.accent, token: i });
    }
    tiedInto = token.tie && !token.rest;
    t += length;
  });
  return { secondsPerQuarter: spq, start, events, total: t };
}
