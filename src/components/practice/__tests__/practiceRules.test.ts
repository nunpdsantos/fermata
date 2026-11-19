/**
 * Music audit 2 (M37, M38, M40, M41): the practice model's rules, each pinned by a FAST test. The corpus sweep
 * (practiceAudit2.corpus.test.ts) walks the whole matrix; the review of 19 November 2026 found faults it alone
 * would catch (a barré over a HIGHER string counted as blocking, the right-hand marks gone, the index roll gone,
 * the last bar's window an event short): each is named here, case by case.
 */
import { describe, expect, it } from 'vitest';
import { TUNING_STANDARD } from '../../../core/constants/guitarTunings';
import type { Note } from '../../../core/types/music';
import {
  allowedFingers, barreCues, fingerClashes, heldWith, positionWalkPractice, practiceSchedule, rightHandPractice,
  routeFingerKey, scalePractice, technicalSet, type PracticeRoute,
} from '../practiceModel';

const C: Note = { natural: 'C', accidental: '' };
const B: Note = { natural: 'B', accidental: '' };
type Fingered = PracticeRoute['events'][number]['notes'][number];

/** A note at a place (pitches are placeholders: only the places and fingers matter to these rules). */
const note = (stringIndex: number, fret: number, finger: number): Fingered => ({
  midi: [40, 45, 50, 55, 59, 64][stringIndex] + fret, note: { natural: 'C', accidental: '' }, pitched: { natural: 'C', accidental: '', octave: 3 },
  stringIndex, fret, finger: finger as Fingered['finger'], position: null, frame: null, segment: 0, shift: null, reach: null, barre: false,
});
/** One note per step, rung together as a broken chord's group of three. */
const group = (...notes: Fingered[]): PracticeRoute => ({
  id: 'brokenChord', octaves: 1, overRinging: true, events: notes.map((n) => ({ notes: [n], degrees: [1], rh: ['p'] })),
});
const strings = (c: ReturnType<typeof fingerClashes>[number]) => [c.finger, 6 - c.a.note.stringIndex, 6 - c.b.note.stringIndex, c.between && 6 - c.between.stringIndex];

describe('one finger, one fret at a time (M37)', () => {
  it('a finger laid across a string that sounds open or lower is a clash, with that string named', () => {
    expect(fingerClashes(heldWith(group(note(2, 2, 1), note(3, 0, 0), note(4, 2, 1)), 0)).map(strings)).toEqual([[1, 4, 2, 3]]);
    expect(fingerClashes(heldWith(group(note(2, 3, 2), note(3, 2, 1), note(4, 3, 2)), 0)).map(strings)).toEqual([[2, 4, 2, 3]]);
  });

  it('a string between at a HIGHER fret, under another finger, is a barré: allowed (review mutant 37-4)', () => {
    const r = group(note(2, 2, 1), note(3, 4, 3), note(4, 2, 1));
    expect(fingerClashes(heldWith(r, 0))).toEqual([]);
    expect(allowedFingers(r, 2, r.events[2].notes[0])).toEqual([1, 2, 4]);
    expect(barreCues(r, 0)).toEqual([{ finger: 1, fret: 2, from: 2, to: 4 }]);
  });

  it('a string between at the barré\'s OWN fret, under another finger, sounds that fret: allowed (review mutant 37-2)', () => {
    // As the rule stands (no sound changes); for the teacher: a second finger there is redundant.
    const r = group(note(2, 2, 1), note(3, 2, 2), note(4, 2, 1));
    expect(fingerClashes(heldWith(r, 0))).toEqual([]);
    // Every finger stays offered to the 2nd string: 1 (the barré), 2 (across 3-2 at fret 2, nothing between), 3, 4.
    expect(allowedFingers(r, 2, r.events[2].notes[0])).toEqual([1, 2, 3, 4]);
  });

  it('one string used twice is no clash: the finger moves along it, or plucks it again (review mutant 37-6)', () => {
    // A finger sliding up one string between two of its notes, held in one window.
    const slide = group(note(3, 2, 1), note(4, 0, 0), note(3, 4, 1));
    expect(fingerClashes(heldWith(slide, 0))).toEqual([]);
    expect(allowedFingers(slide, 2, slide.events[2].notes[0])).toEqual([1, 2, 3, 4]);
    // The same string plucked again at its fret (p i m i's i): the finger stays.
    const again = group(note(3, 2, 2), note(4, 1, 1), note(3, 2, 2));
    expect(fingerClashes(heldWith(again, 0))).toEqual([]);
    expect(allowedFingers(again, 2, again.events[2].notes[0])).toContain(2);
  });

  it('allowedFingers: the group\'s own fingers at other frets are not offered; at one fret only when nothing lower lies between', () => {
    const r = group(note(2, 2, 1), note(3, 0, 0), note(4, 3, 3));
    expect(allowedFingers(r, 2, r.events[2].notes[0])).toEqual([2, 3, 4]); // 1 holds fret 2
    const same = group(note(2, 3, 2), note(3, 0, 0), note(4, 3, 4));
    expect(allowedFingers(same, 2, same.events[2].notes[0])).toEqual([1, 3, 4]); // 2 at fret 3 would lie over the open 3rd string
    const adjacent = group(note(2, 2, 1), note(3, 2, 2), note(4, 4, 4));
    expect(allowedFingers(adjacent, 1, adjacent.events[1].notes[0])).toEqual([1, 2, 3]); // 1 across strings 4-3 at fret 2: a barré
    // Outside a ringing window nothing else is held: a scale's next note may take any finger.
    const line: PracticeRoute = { ...r, overRinging: false };
    expect(allowedFingers(line, 2, line.events[2].notes[0])).toEqual([1, 2, 3, 4]);
  });
});

describe('the schedule (M40), worked out from the route\'s bars, not from the app\'s window', () => {
  /** End of each scheduled note, against 0.1 beat before min(its bar's end, its string's next pluck). */
  const check = (route: PracticeRoute, bpm: number, barOf: (i: number) => [number, number]) => {
    const beat = 60 / bpm;
    const s = practiceSchedule(route, bpm);
    const placed = route.events.flatMap((e, i) => e.notes.map((n) => ({ i, s: n.stringIndex })));
    return s.notes.map((n, k) => {
      const { i, s: str } = placed[k];
      const next = placed.find((p, j) => j > k && p.s === str && p.i > i);
      const end = Math.min(barOf(i)[1], next?.i ?? Infinity);
      return [Number(n.at.toFixed(6)), Number((n.at + n.duration).toFixed(6)), Number(((end - 0.1) * beat).toFixed(6))];
    });
  };

  it('C major p i m i at 60 BPM, all three bars to the last note: each note ends 0.1 beat before its bar ends or its string sounds again (review mutant 40-5)', () => {
    const route = rightHandPractice(C, 'major', TUNING_STANDARD, 'p-i-m-i')!;
    expect(route.events).toHaveLength(12);
    const rows = check(route, 60, (i) => [Math.floor(i / 4) * 4, Math.floor(i / 4) * 4 + 4]);
    expect(rows).toHaveLength(12);
    for (const [, end, want] of rows) expect(end).toBe(want);
    // The last bar by name: its bass rings to 11.9 s, the repeated i is cut at 10.9 s.
    expect(rows.slice(8).map(([at, end]) => [at, end])).toEqual([[8, 11.9], [9, 10.9], [10, 11.9], [11, 11.9]]);
  });

  it('a broken chord rings in its groups of three; a scale releases each note before the next', () => {
    const broken = technicalSet(C, 'major', TUNING_STANDARD).find((x) => x.id === 'brokenChord' && x.route)?.route
      ?? technicalSet({ natural: 'G', accidental: '' }, 'major', TUNING_STANDARD).find((x) => x.id === 'brokenChord')!.route!;
    for (const [, end, want] of check(broken, 80, (i) => [Math.floor(i / 3) * 3, Math.min(broken.events.length, Math.floor(i / 3) * 3 + 3)])) expect(end).toBe(want);
    const scale = scalePractice(C, 'major', TUNING_STANDARD, 2, 'im')!;
    for (const [at, end] of check(scale, 120, (i) => [i, i + 1])) expect(Number((end - at).toFixed(6))).toBe(0.45);
  });
});

describe('barré marks and cues (M41)', () => {
  it('B major (p+a) i m i: the model marks both notes the index holds at fret 2, and no other (review mutant 41-4)', () => {
    const pinch = rightHandPractice(B, 'major', TUNING_STANDARD, 'p+a-i-m-i')!;
    expect(pinch.events[0].notes.map((n) => [6 - n.stringIndex, n.fret, n.finger, n.barre])).toEqual([[5, 2, 1, true], [1, 2, 1, true]]);
    expect(pinch.events.slice(1, 4).flatMap((e) => e.notes).map((n) => [6 - n.stringIndex, n.fret, n.barre])).toEqual([[3, 4, false], [2, 4, false], [3, 4, false]]);
    const single = rightHandPractice(B, 'major', TUNING_STANDARD, 'p-i-m')!;
    expect(single.events.slice(0, 3).flatMap((e) => e.notes).every((n) => !n.barre)).toBe(true);
  });

  it('the cue stands on every stroke of a bar that holds the barré, and on none of a bar without (the review\'s first point)', () => {
    // C natural minor p i m a, bar 1 (i: the C minor barré at fret 3): stroke 2 plucks no string under it, and still names it.
    const minor = rightHandPractice(C, 'natural_minor', TUNING_STANDARD, 'p-i-m-a')!;
    const bar1 = minor.events.slice(0, 4).flatMap((e) => e.notes).filter((n) => n.barre);
    expect(bar1.map((n) => [6 - n.stringIndex, n.fret, n.finger])).toEqual([[5, 3, 1], [1, 3, 1]]);
    expect([0, 1, 2, 3].map((i) => barreCues(minor, i))).toEqual(Array(4).fill([{ finger: 1, fret: 3, from: 1, to: 5 }]));
    // B major (p+a) i m i: the I bar holds its barré on all four strokes.
    const pinch = rightHandPractice(B, 'major', TUNING_STANDARD, 'p+a-i-m-i')!;
    expect([0, 1, 2, 3].map((i) => barreCues(pinch, i))).toEqual(Array(4).fill([{ finger: 1, fret: 2, from: 1, to: 5 }]));
    // B major p i m: one string under the index, no barré in the bar, no cue on any stroke.
    const single = rightHandPractice(B, 'major', TUNING_STANDARD, 'p-i-m')!;
    expect([0, 1, 2].map((i) => barreCues(single, i))).toEqual([[], [], []]);
  });

  it('an index rolled to the next string at one fret, between two single notes, is cued on the step it rolls to (review mutant 41-9)', () => {
    // A major tonic arpeggio: steps 4 and 5 roll the index from string 4 to 3, then 3 to 2, at fret 2.
    const arp = technicalSet({ natural: 'A', accidental: '' }, 'major', TUNING_STANDARD).find((x) => x.id === 'tonicArpeggio')!.route!;
    expect([2, 3, 4].map((i) => arp.events[i].notes.map((n) => [6 - n.stringIndex, n.fret, n.finger, n.barre])[0])).toEqual([[4, 2, 1, false], [3, 2, 1, true], [2, 2, 1, true]]);
    expect([3, 4].map((i) => barreCues(arp, i))).toEqual([[{ finger: 1, fret: 2, from: 3, to: 4 }], [{ finger: 1, fret: 2, from: 2, to: 3 }]]);
    // The step it rolls from has none of its own; another finger moved at one fret is a hop, not a barré.
    expect(barreCues(arp, 2)).toEqual([]);
    expect(barreCues(arp, 3, (e, n) => (e === 2 ? 2 : n.finger))).toEqual([]);
  });
});

describe('the key (M38)', () => {
  it('carries the route\'s range: 1, 2 and 3 octaves of E major are three keys; C major\'s walk is 2 (review mutant 38-7)', () => {
    const E: Note = { natural: 'E', accidental: '' };
    const keys = [1, 2, 3].map((o) => {
      const r = scalePractice(E, 'major', TUNING_STANDARD, o, 'im')!;
      return routeFingerKey(E, 'major', TUNING_STANDARD, r, 0, r.events[0].notes[0]);
    });
    expect(keys.map((k) => k.split('|')[5])).toEqual(['1', '2', '3']);
    expect(new Set(keys).size).toBe(3);
    const walk = positionWalkPractice(C, 'major', TUNING_STANDARD)!;
    expect(routeFingerKey(C, 'major', TUNING_STANDARD, walk, 0, walk.events[0].notes[0])).toBe('route:1|standard|C|major|position-walk|2|0|1|3');
  });
});
