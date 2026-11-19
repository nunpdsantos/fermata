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
import { pitchedNoteToVexKey, keySignatureAlterations } from '../../../utils/notationHelpers';
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
}

export interface PlannedVoice {
  staff: DemoClef;
  notes: PlannedNote[];
  /** A bar line comes after the note at each of these indices. */
  barsAfter: number[];
}

export interface DemoStaffPlan {
  staves: DemoClef[];
  key?: string;
  time?: string;
  voices: PlannedVoice[];
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
      };
      at += beats;
      if (Number.isFinite(bar) && i < voice.events.length - 1 && Math.abs(at / bar - Math.round(at / bar)) < 1e-9) barsAfter.push(i);
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
      const thisBar = Number.isFinite(bar) ? Math.floor(h.n.at / bar + 1e-9) : 0;
      if (thisBar !== barIndex) {
        memory = new Map();
        barIndex = thisBar;
      }
      const step = staffStep(h.p);
      const inForce = memory.get(step) ?? signature[h.p.natural] ?? '';
      const tiedInto = h.i > 0 && h.voice.notes[h.i - 1].tieToNext;
      if (!tiedInto && h.p.accidental !== inForce) h.n.accidentals[h.k] = h.p.accidental === '' ? 'n' : h.p.accidental;
      memory.set(step, h.p.accidental);
    }
  }
  return { staves, ...(demo.key ? { key: demo.key } : {}), ...(demo.time ? { time: demo.time } : {}), voices };
}
