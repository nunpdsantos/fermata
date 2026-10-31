/**
 * Independent playability oracle for fingered guitar passages (audit W10-03).
 *
 * Imports NOTHING from the engine except types. Every rule is re-derived from
 * the list of notes the engine returns: the place sounds the pitch (hard-coded
 * standard-tuning MIDI numbers), fingers 1–4 with 0 exactly on open strings,
 * one finger per fret and one fret per finger while the hand stays put, at
 * most five frets from lowest to highest finger, fingers rising with the
 * fret, a reported shift whenever the position changes, and every shift
 * guided (same finger on the same string, the index taking over on the same
 * string, or the hand moving while an open string sounds).
 */
import { expect } from 'vitest';
import type { Note } from '../../types/music';

/** Standard tuning, 6th → 1st string (E2 A2 D3 G3 B3 E4). */
export const OPEN = [40, 45, 50, 55, 59, 64];
export const MAX_FRET = 15;
export const nameOf = (n: Note) => `${n.natural}${n.accidental}`;

/** The fields of a fingered note this oracle reads. */
export interface OracleNote {
  midi: number;
  note: Note;
  stringIndex: number;
  fret: number;
  finger: number;
  position: number | null;
  shift: { kind: string; finger: number } | null;
  reach?: { anchorFinger: number; anchorFret: number; stringIndex: number; position: number } | null;
}

/** A single melodic line (scale, arpeggio, broken intervals). */
export function checkPlayableLine(
  notes: readonly OracleNote[],
  label: string,
  opts: { maxStringStep?: number; maxFret?: number } = {},
): void {
  const maxStep = opts.maxStringStep ?? 1;
  const maxFret = opts.maxFret ?? MAX_FRET;
  let fingerToFret = new Map<number, number>();
  let fretToFinger = new Map<number, number>();
  let segFrets: number[] = [];
  notes.forEach((n, i) => {
    const where = `${label} #${i} ${nameOf(n.note)}`;
    expect(OPEN[n.stringIndex] + n.fret, where).toBe(n.midi);
    expect(n.fret >= 0 && n.fret <= maxFret, `${where}: fret ${n.fret}`).toBe(true);
    expect(n.fret === 0 ? n.finger === 0 : n.finger >= 1 && n.finger <= 4, `${where}: finger ${n.finger}`).toBe(true);

    const prev = i > 0 ? notes[i - 1] : null;
    if (n.shift) {
      expect(prev, `${where}: a shift needs a previous note`).not.toBeNull();
      const p = prev!;
      const up = n.midi > p.midi;
      const openShift = p.fret === 0 || n.fret === 0;
      const guide = p.stringIndex === n.stringIndex && p.finger === n.finger && n.finger > 0;
      const index =
        p.stringIndex === n.stringIndex &&
        ((up && n.finger === 1 && p.finger >= 2) || (!up && p.finger === 1 && n.finger >= 2));
      expect(
        openShift || guide || index,
        `${where}: shift without a guide (${p.stringIndex}/${p.fret}/${p.finger} → ${n.stringIndex}/${n.fret}/${n.finger})`,
      ).toBe(true);
      fingerToFret = new Map();
      fretToFinger = new Map();
      segFrets = [];
    } else if (n.reach) {
      // A re-spread around the held previous note, in the same position.
      const p = prev!;
      expect(p.fret, `${where}: reach needs a fretted anchor`).toBeGreaterThan(0);
      expect([n.reach.anchorFinger, n.reach.anchorFret, n.reach.stringIndex], where).toEqual([p.finger, p.fret, p.stringIndex]);
      expect(n.position, `${where}: a reach keeps the position`).toBe(p.position);
      fingerToFret = new Map([[p.finger, p.fret]]);
      fretToFinger = new Map([[p.fret, p.finger]]);
      segFrets = [p.fret];
    } else if (prev && prev.position !== null && n.position !== null) {
      expect(n.position, `${where}: position changed without a shift`).toBe(prev.position);
    }
    if (n.fret > 0) {
      const f = fingerToFret.get(n.finger);
      expect(f === undefined || f === n.fret, `${where}: finger ${n.finger} on frets ${f} and ${n.fret}`).toBe(true);
      const k = fretToFinger.get(n.fret);
      expect(k === undefined || k === n.finger, `${where}: fret ${n.fret} under fingers ${k} and ${n.finger}`).toBe(true);
      fingerToFret.set(n.finger, n.fret);
      fretToFinger.set(n.fret, n.finger);
      segFrets.push(n.fret);
      expect(Math.max(...segFrets) - Math.min(...segFrets), `${where}: span`).toBeLessThanOrEqual(4);
      for (const [finger, fret] of fingerToFret) {
        expect(Math.sign(fret - n.fret), `${where}: finger order`).toBe(Math.sign(finger - n.finger));
      }
      expect(n.position, where).not.toBeNull();
      expect(Math.abs(n.fret - n.finger + 1 - n.position!), `${where}: position ${n.position}`).toBeLessThanOrEqual(1);
    }
    if (prev) {
      const ds = n.stringIndex - prev.stringIndex;
      expect(Math.abs(ds), `${where}: string step`).toBeLessThanOrEqual(maxStep);
      if (n.midi > prev.midi) expect(ds, `${where}: higher pitch on a lower string`).toBeGreaterThanOrEqual(0);
      if (n.midi < prev.midi) expect(ds, `${where}: lower pitch on a higher string`).toBeLessThanOrEqual(0);
    }
  });
}

/**
 * Double stops: two notes at once on two strings `gap` apart. Within a pair:
 * two different fingers, rising with the fret (on one fret, the lower string
 * takes the lower finger), at most four frets apart. Between pairs: while the
 * hand stays (no shift) no finger moves to another fret; a shift keeps one
 * finger on its string (it slides), or moves the same two-finger shape to the
 * next pair of strings by at most three frets ('shape'). The shift may be
 * reported on either note of the pair (broken intervals report it on the
 * note played first).
 */
export function checkDoubleStops(pairs: readonly (readonly OracleNote[])[], label: string, gaps: readonly number[]): void {
  pairs.forEach((pair, i) => {
    const where = `${label} pair #${i} ${pair.map((n) => nameOf(n.note)).join('+')}`;
    expect(pair.length, where).toBe(2);
    const [lo, hi] = pair;
    for (const n of pair) {
      expect(OPEN[n.stringIndex] + n.fret, where).toBe(n.midi);
      expect(n.fret >= 0 && n.fret <= MAX_FRET, where).toBe(true);
      expect(n.fret === 0 ? n.finger === 0 : n.finger >= 1 && n.finger <= 4, where).toBe(true);
    }
    expect(gaps, `${where}: string gap`).toContain(hi.stringIndex - lo.stringIndex);
    expect(hi.midi, where).toBeGreaterThan(lo.midi);
    if (lo.fret > 0 && hi.fret > 0) {
      expect(lo.finger, `${where}: one finger per note`).not.toBe(hi.finger);
      if (hi.fret === lo.fret) expect(hi.finger, `${where}: same fret`).toBe(lo.finger + 1);
      else expect(Math.sign(hi.finger - lo.finger), `${where}: finger order`).toBe(Math.sign(hi.fret - lo.fret));
      expect(Math.abs(hi.fret - lo.fret), `${where}: span`).toBeLessThanOrEqual(3);
    }
    if (i === 0) return;
    const prev = pairs[i - 1];
    const fingers = (p: readonly OracleNote[]) => p.filter((n) => n.fret > 0);
    if (lo.shift || hi.shift) {
      const guide = fingers(pair).some((n) => fingers(prev).some((m) => m.finger === n.finger && m.stringIndex === n.stringIndex));
      const [plo, phi] = prev;
      const shape =
        fingers(pair).length === 2 && fingers(prev).length === 2 &&
        lo.finger === plo.finger && hi.finger === phi.finger &&
        hi.fret - lo.fret === phi.fret - plo.fret &&
        Math.abs(lo.stringIndex - plo.stringIndex) === 1 &&
        Math.abs(lo.fret - plo.fret) <= 3;
      expect(guide || shape, `${where}: shift without a guide finger or a kept shape`).toBe(true);
    } else {
      for (const n of fingers(pair)) {
        for (const m of fingers(prev)) {
          if (m.finger === n.finger) expect(n.fret, `${where}: finger ${n.finger} moved without a shift`).toBe(m.fret);
        }
      }
    }
  });
}
