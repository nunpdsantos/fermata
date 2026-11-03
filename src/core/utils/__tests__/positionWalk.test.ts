import { describe, expect, it } from 'vitest';
import { getPositionWalk } from '../positionWalk';
import { fingerLine, makeFrame } from '../guitarFingering';
import { scaleLine } from '../scaleRoutes';
import { GUITAR_TUNINGS, TUNING_STANDARD } from '../../constants/guitarTunings';
import { buildScale } from '../../constants/scales';
import { getPitchClass } from '../../constants/notes';
import { tuningOpenMidi } from '../guitarPositions';
import type { Note, ScaleType } from '../../types/music';

const C: Note = { natural: 'C', accidental: '' };
const roots: Note[] = [C, { natural: 'D', accidental: '' }, { natural: 'F', accidental: '#' }, { natural: 'B', accidental: 'b' }];

describe('generated position walks', () => {
  it('chooses successive classical positions, full scales and real guide-finger joins', () => {
    const walk = getPositionWalk(C, 'major')!;
    expect(walk.stops.map((s) => s.position)).toEqual([2, 4, 6, 8]);
    expect(walk.stops.map((s) => s.octaves)).toEqual([1, 1, 1, 2]);
    expect(walk.notes.filter((n) => n.shift)).toHaveLength(3);
    expect(getPositionWalk(C, 'major')).toEqual(walk);
  });
  for (const tuning of GUITAR_TUNINGS) {
    it(`${tuning.id}: complete scales stay in key, within one hand frame, and playable at every join`, () => {
      const open = tuningOpenMidi(tuning);
      for (const root of roots) for (const type of ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor'] as ScaleType[]) {
        const walk = getPositionWalk(root, type, { tuning });
        if (tuning.id === 'd-g' && type === 'natural_minor') { expect(walk).toBeNull(); continue; }
        expect(walk, `${root.natural}${root.accidental} ${type}`).not.toBeNull();
        const { notes, stops } = walk!;
        expect(stops.length).toBeGreaterThanOrEqual(2);
        const pcs = buildScale(root, type).notes.map(getPitchClass);
        for (const [i, n] of notes.entries()) {
          expect(pcs).toContain(n.midi % 12);
          expect(open[n.stringIndex] + n.fret).toBe(n.midi);
          expect(n.fret).toBeGreaterThan(0);
          expect(n.fret).toBeLessThanOrEqual(15);
          expect(n.frame!.frets[n.finger - 1]).toBe(n.fret);
          expect(new Set(n.frame!.frets).size).toBe(4);
          if (n.shift) {
            const previous = notes[i - 1];
            expect(n.shift.kind).toBe('guide');
            expect(n.shift.finger).toBe(n.finger);
            expect(previous.finger).toBe(n.finger);
            expect(previous.stringIndex).toBe(n.stringIndex);
            expect(n.fret).toBeGreaterThan(previous.fret);
            expect(n.shift.fromPosition).toBe(previous.position);
            expect(n.shift.toPosition).toBe(n.position);
          }
        }
        expect(notes.filter((n) => n.shift)).toHaveLength(stops.length - 1);
        for (const [i, stop] of stops.entries()) {
          if (i) expect(stop.position).toBeGreaterThan(stops[i - 1].position);
          const passage = notes.slice(stop.start, stop.end + 1);
          expect(passage.map((n) => n.midi)).toEqual(scaleLine(root, type, passage[0].midi, stop.octaves).map((n) => n.midi));
          expect(passage[0].midi % 12).toBe(getPitchClass(root));
          expect(passage.every((n) => n.position === stop.position)).toBe(true);
          expect(new Set(passage.map((n) => JSON.stringify(n.frame))).size).toBe(1);
        }
        // A separate full-line engine pass rejects broken joins or finger rolls.
        expect(fingerLine(notes, { tuning, pins: new Map(notes.map((n, i) => [i, n])) })).not.toBeNull();
      }
    });
  }
  it('supports a pentatonic formula without inventing seven degrees', () => {
    const walk = getPositionWalk(C, 'pentatonic_major')!;
    expect(walk).not.toBeNull();
    expect(walk.stops[0].end - walk.stops[0].start).toBe(walk.stops[0].octaves * 5);
  });
  it('returns an honest unavailable result on a neck too short for two positions', () => {
    expect(getPositionWalk(C, 'major', { maxFret: 4 })).toBeNull();
  });
  it('known-bad control: fixed frames reject off-frame pitches and a corrupted guide finger', () => {
    const frame = makeFrame('compact', 1);
    expect(fingerLine([{ midi: 80, note: C }], { tuning: TUNING_STANDARD, fixedFrame: frame })).toBeNull();
    const notes = getPositionWalk(C, 'major')!.notes;
    const i = notes.findIndex((n) => n.shift);
    const bad = new Map(notes.map((n, j) => [j, { ...n }]));
    bad.set(i, { ...notes[i], finger: notes[i].finger === 1 ? 2 : 1 });
    expect(fingerLine(notes, { pins: bad })).toBeNull();
  });
});
