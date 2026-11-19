/**
 * Music audit 2 (18 November 2026), the guitar practice sheet, swept over the audit's own matrix: the 17 root
 * spellings (each natural, and the five sharps and five flats), the 37 scale types and the seven tunings.
 *
 *  - M40, a string sounds one note: in every right-hand study, no note on a string is still scheduled to sound
 *    when that string is plucked again. At 153caab (release 16), 340 of the 680 right-hand configurations did,
 *    1,878 times in all (the audit's 340 of 680 and its 1,878 "soundOverlapsSameString", reproduced here).
 *  - M41, the barré cue: wherever a bar gives one left-hand finger to two or more strings at one fret, every one
 *    of those notes is marked. At 153caab, 171 configurations had an unmarked one inside a single stroke (the
 *    audit's 171), and 568 had one across the bar's held grip. No barré lies across a string the bar plays lower.
 *  - M38, the class of it: every fretted note of every route the editor offers (Scales at every range, Position
 *    walk, each technical exercise) has a key the fingering store accepts. At 153caab, 157,988 walk notes did not.
 *  - M37, the suggestions themselves: no suggested step gives one finger to two frets held at once; and the barré
 *    cue the sheet computes from the fingers shown is exactly the engine's own barré mark wherever it marks one.
 *  - The review of 19 November 2026: a barré held through a bar (or a broken chord's ringing group) is named on
 *    every step of it. The bars and groups here come from the pattern and the engine, never from the app's own
 *    window, so a wrong window fails instead of agreeing with itself. The rules case by case, and every finding's
 *    fast pins, are in practiceRules.test.ts.
 */
import { describe, expect, it } from 'vitest';
import { GUITAR_TUNINGS } from '../../../core/constants/guitarTunings';
import { SCALE_FORMULAS } from '../../../core/constants/scales';
import type { Note, ScaleType } from '../../../core/types/music';
import { RIGHT_HAND_PATTERNS } from '../../../core/utils/rightHandPatterns';
import { maxScaleOctaves } from '../../../core/utils/scaleRoutes';
import { isValidFingeringKey } from '../../../state/fingeringStore';
import {
  barreCues, fingerClashes, heldWith, positionWalkPractice, practiceSchedule, rightHandPractice,
  routeFingerKey, scalePractice, technicalSet, type PracticeRoute,
} from '../practiceModel';

const ROOTS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B']
  .map((s) => ({ natural: s[0], accidental: s.slice(1) }) as Note);
const TYPES = Object.keys(SCALE_FORMULAS) as ScaleType[];
const name = (root: Note, type: ScaleType, tuning: string, id: string) => `${root.natural}${root.accidental} ${type} ${tuning} ${id}`;

/** Each scheduled note with its string. */
function strung(route: PracticeRoute, bpm: number) {
  const s = practiceSchedule(route, bpm);
  const seen = new Map<number, number>();
  return s.notes.map((n, k) => {
    const event = s.eventIndices[k];
    const j = seen.get(event) ?? 0;
    seen.set(event, j + 1);
    return { ...n, event, stringIndex: route.events[event].notes[j].stringIndex };
  });
}

/**
 * A study's bars, from the pattern itself (its strokes per bar), never from the app's own window: a wrong
 * window must fail here, not pass by agreeing with itself (the review of 19 November 2026).
 */
const barsOf = (route: PracticeRoute, strokes: number): [number, number][] =>
  Array.from({ length: Math.ceil(route.events.length / strokes) }, (_, b) => [b * strokes, Math.min(route.events.length, (b + 1) * strokes)]);

/** The barrés among fretted notes, worked out here: one finger on two or more strings at one fret. */
function oracleBarres(notes: readonly { stringIndex: number; fret: number; finger: number }[]) {
  const by = new Map<string, number[]>();
  for (const n of notes) if (n.fret > 0 && n.finger > 0) by.set(`${n.finger}:${n.fret}`, [...new Set([...(by.get(`${n.finger}:${n.fret}`) ?? []), n.stringIndex])]);
  return [...by].filter(([, s]) => s.length > 1).map(([k, s]) => {
    const [finger, fret] = k.split(':').map(Number);
    return { finger, fret, from: 6 - Math.max(...s), to: 6 - Math.min(...s) };
  }).sort((a, b) => a.fret - b.fret || a.from - b.from);
}

describe('the right-hand studies (M40, M41)', () => {
  const studies: { label: string; route: PracticeRoute; strokes: number }[] = [];
  let asks = 0;
  for (const root of ROOTS) for (const type of TYPES) for (const tuning of GUITAR_TUNINGS) for (const p of RIGHT_HAND_PATTERNS) {
    asks++;
    const route = rightHandPractice(root, type, tuning, p.id);
    if (route) studies.push({ label: name(root, type, tuning.id, p.id), route, strokes: p.strokes.length });
  }

  it('the matrix is the audit\'s: 44,030 asked, 680 available, three bars each', () => {
    expect(asks).toBe(44030);
    expect(studies).toHaveLength(680);
    for (const { route, strokes } of studies) expect(route.events).toHaveLength(3 * strokes);
  });

  it('M40: no string is plucked again while the schedule still sounds it (two-sided: it rings until 0.1 beat before)', () => {
    const overlaps: string[] = [];
    const cutWrong: string[] = [];
    for (const { label, route, strokes } of studies) for (const bpm of [40, 60, 200]) {
      const beat = 60 / bpm;
      const notes = strung(route, bpm);
      for (const [k, n] of notes.entries()) {
        const next = notes.find((m, j) => j > k && m.stringIndex === n.stringIndex && m.at > n.at);
        if (next && n.at + n.duration > next.at + 1e-9) overlaps.push(`${label} ${bpm} BPM: string ${6 - n.stringIndex} at ${n.at.toFixed(2)} s rings to ${(n.at + n.duration).toFixed(2)} s, plucked again at ${next.at.toFixed(2)} s`);
        // Each note rings as long as it may: to 0.1 beat before its bar ends or its string is plucked again, whichever is first.
        const barEnd = (Math.floor(n.event / strokes) + 1) * strokes;
        const until = Math.min(barEnd * beat, next?.at ?? Infinity);
        if (Math.abs(n.at + n.duration - (until - 0.1 * beat)) > 1e-9) cutWrong.push(`${label} ${bpm} BPM: event ${n.event} string ${6 - n.stringIndex} ends at ${(n.at + n.duration).toFixed(3)}, not ${(until - 0.1 * beat).toFixed(3)}`);
      }
    }
    expect(overlaps.length, overlaps.slice(0, 5).join('\n')).toBe(0);
    expect(cutWrong.length, cutWrong.slice(0, 5).join('\n')).toBe(0);
  });

  it('M41: every note under a barré is marked, in a stroke and across the held bar, and no barré lies over a lower string', () => {
    const inStroke: string[] = [];
    const inBar: string[] = [];
    const obstructed: string[] = [];
    for (const { label, route, strokes } of studies) {
      route.events.forEach((e, i) => {
        const f = e.notes.filter((n) => n.fret > 0);
        if (f.some((n) => f.some((m) => m !== n && m.finger === n.finger && m.fret === n.fret && !(n.barre && m.barre)))) inStroke.push(`${label} step ${i + 1}`);
      });
      for (const [b, [start, end]] of barsOf(route, strokes).entries()) {
        const bar = route.events.slice(start, end).flatMap((e) => e.notes);
        for (const n of bar) for (const m of bar) {
          if (n.fret === 0 || m === n || m.finger !== n.finger || m.fret !== n.fret || m.stringIndex === n.stringIndex) continue;
          if (!(n.barre && m.barre)) inBar.push(`${label} bar ${b + 1}: string ${6 - n.stringIndex} and ${6 - m.stringIndex}, fret ${n.fret}`);
          const lo = Math.min(n.stringIndex, m.stringIndex);
          const hi = Math.max(n.stringIndex, m.stringIndex);
          if (bar.some((x) => x.stringIndex > lo && x.stringIndex < hi && x.fret < n.fret)) obstructed.push(`${label} bar ${b + 1}`);
        }
        // A note marked as under a barré really is (no cue for a finger alone on its fret).
        for (const n of bar) if (n.barre && !bar.some((m) => m !== n && m.fret === n.fret && m.finger === n.finger && m.stringIndex !== n.stringIndex)) inBar.push(`${label}: string ${6 - n.stringIndex} marked alone`);
      }
    }
    expect(inStroke.length, inStroke.slice(0, 5).join('\n')).toBe(0);
    expect(inBar.length, inBar.slice(0, 5).join('\n')).toBe(0);
    expect(obstructed.length, obstructed.slice(0, 5).join('\n')).toBe(0);
  });

  it('M41, the cue through the bar: every stroke of a bar that holds a barré names exactly its barrés, no stroke of a bar without one names any', () => {
    const wrong: string[] = [];
    let held = 0;
    let bare = 0;
    for (const { label, route, strokes } of studies) for (const [b, [start, end]] of barsOf(route, strokes).entries()) {
      const want = oracleBarres(route.events.slice(start, end).flatMap((e) => e.notes));
      if (want.length) held++; else bare++;
      for (let i = start; i < end; i++) {
        const got = barreCues(route, i);
        if (JSON.stringify(got) !== JSON.stringify(want)) wrong.push(`${label} bar ${b + 1} stroke ${i - start + 1}: ${JSON.stringify(got)}, not ${JSON.stringify(want)}`);
      }
    }
    // The review's count of bars holding a barré, and the strokes in them (4,406), all named now (1,232 were not).
    expect([held, held + bare]).toEqual([1136, 2040]);
    expect(wrong.length, wrong.slice(0, 5).join('\n')).toBe(0);
  });
});

describe('every route the editor offers (M37, M38)', () => {
  it('has keys the store accepts, no suggested clash, and the barré cue the engine marks', { timeout: 600_000 }, () => {
    let routes = 0;
    let notes = 0;
    const refused = new Map<string, number>();
    const clashes: string[] = [];
    const cueDiff: string[] = [];
    const groupDiff: string[] = [];
    let groupSteps = 0;
    for (const root of ROOTS) for (const type of TYPES) for (const tuning of GUITAR_TUNINGS) {
      const list: PracticeRoute[] = [];
      for (let o = 1; o <= Math.min(3, maxScaleOctaves(root, tuning)); o++) {
        const r = scalePractice(root, type, tuning, o, 'im');
        if (r) list.push(r);
      }
      const walk = positionWalkPractice(root, type, tuning);
      if (walk) list.push(walk);
      for (const item of technicalSet(root, type, tuning)) if (item.route) list.push(item.route);
      for (const route of list) {
        routes++;
        route.events.forEach((e, i) => {
          for (const n of e.notes) {
            if (n.fret === 0) continue;
            notes++;
            if (!isValidFingeringKey(routeFingerKey(root, type, tuning, route, i, n))) refused.set(route.id, (refused.get(route.id) ?? 0) + 1);
          }
          const c = fingerClashes(heldWith(route, i)).filter((x) => x.a.event === i || x.b.event === i);
          if (c.length) clashes.push(`${name(root, type, tuning.id, route.id)} step ${i + 1}`);
          const cues = barreCues(route, i);
          for (const n of e.notes) {
            const cued = n.fret > 0 && cues.some((q) => q.finger === n.finger && q.fret === n.fret && 6 - n.stringIndex >= q.from && 6 - n.stringIndex <= q.to);
            if (cued !== n.barre) cueDiff.push(`${name(root, type, tuning.id, route.id)} step ${i + 1} string ${6 - n.stringIndex}: engine ${n.barre}, cue ${cued}`);
          }
          // A broken chord's group of three is one grip held at once (guitarTechnique's groups, in playing order):
          // its barrés stand on each of its steps; any other cue there is the step's own marked roll.
          if (route.overRinging) {
            const g = Math.floor(i / 3) * 3;
            const group = oracleBarres(route.events.slice(g, Math.min(route.events.length, g + 3)).flatMap((x) => x.notes));
            for (const b of group) if (!cues.some((q) => q.finger === b.finger && q.fret === b.fret && q.from <= b.from && q.to >= b.to)) groupDiff.push(`${name(root, type, tuning.id, route.id)} step ${i + 1}: ${JSON.stringify(b)} missing`);
            for (const q of cues) if (!group.some((b) => b.finger === q.finger && b.fret === q.fret) && !e.notes.some((n) => n.barre)) groupDiff.push(`${name(root, type, tuning.id, route.id)} step ${i + 1}: ${JSON.stringify(q)} extra`);
            groupSteps++;
          }
        });
      }
    }
    expect(routes).toBeGreaterThan(30_000);
    expect(notes).toBeGreaterThan(900_000);
    expect(Object.fromEntries(refused)).toEqual({});
    expect(clashes.length, clashes.slice(0, 5).join('\n')).toBe(0);
    expect(cueDiff.length, cueDiff.slice(0, 5).join('\n')).toBe(0);
    expect(groupSteps).toBeGreaterThan(1000);
    expect(groupDiff.length, groupDiff.slice(0, 5).join('\n')).toBe(0);
  });
});
