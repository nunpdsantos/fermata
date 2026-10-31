/**
 * The Grade-5 technical set (audit W10-03): interval scales (3rds, 6ths,
 * octaves, 10ths), the chromatic scale, broken chords, tonic arpeggios, the
 * dominant 7th resolving on the tonic, the diminished 7th.
 *
 * Independent oracle: pitches and letter names from theoryOracle.ts (step
 * patterns, one letter per degree) and textbook chord formulas written here;
 * the patterns are the ABRSM guitar syllabus's own examples (pp. 10, 14–15),
 * re-encoded here from the score, not from the engine; playability from
 * fingeringOracle.ts. Exhaustive over 12 roots and both open-string styles.
 */
import { describe, it, expect } from 'vitest';
import {
  intervalScale,
  tonicArpeggio,
  dominantSeventhArpeggio,
  diminishedSeventhArpeggio,
  brokenChord,
  brokenChordAvailability,
  chromaticScale,
  techniqueNotes,
  scaleRightHand,
} from '../guitarTechnique';
import type { IntervalKind, TechniqueExercise } from '../guitarTechnique';
import { preferredRootSpelling } from '../degreeSpelling';
import type { Note, ScaleType } from '../../types/music';
import { ORACLE_SCALES, spellDegree, pcOf, letterDegree } from './theoryOracle';
import { checkPlayableLine, checkDoubleStops, lineViolations, nameOf, OPEN, MAX_FRET } from './fingeringOracle';
import type { OracleNote } from './fingeringOracle';

const mod12 = (n: number) => ((n % 12) + 12) % 12;
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const semisOf = (d: string) => {
  const m = /^(bb|b|##|#)?(\d+)$/.exec(d)!;
  const acc = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 }[m[1] ?? ''] as number;
  return MAJOR[(Number(m[2]) - 1) % 7] + acc;
};
const lowest = (root: string) => {
  for (let m = 40; m < 52; m++) if (mod12(m) === pcOf(root)) return m;
  throw new Error('unreachable');
};
const ROOTS = (type: ScaleType) => Array.from({ length: 12 }, (_, pc) => preferredRootSpelling(pc, type));
const SCALES: ScaleType[] = ['major', 'natural_minor', 'harmonic_minor', 'melodic_minor'];
const STYLES = ['low-positions', 'avoid'] as const;
const ARPEGGIO_RULES = { maxStringStep: 1, allowFingerChange: true, allowSharedFrets: true };
const place = (n: { stringIndex: number; fret: number; finger: number }) => [n.stringIndex, n.fret, n.finger];

// ─── Interval scales ────────────────────────────────────────────────────────

/** Oracle scale tone at step j (negative = below the tonic) from tonic MIDI t. */
function tone(root: string, type: ScaleType, t: number, j: number) {
  const ds = ORACLE_SCALES[type].degrees;
  const d = ((j % 7) + 7) % 7;
  return { name: spellDegree(root, ds[d]), midi: t + 12 * Math.floor(j / 7) + semisOf(ds[d]) };
}

/** ABRSM p. 10: 3rds and 10ths (and octaves) start with the tonic below, 6ths with the tonic above. */
const KINDS: { kind: IntervalKind; steps: number; gaps: number[]; letters: number; sizes: number[]; tonicLower: boolean }[] = [
  { kind: 'thirds', steps: 2, gaps: [1], letters: 3, sizes: [3, 4], tonicLower: true },
  { kind: 'sixths', steps: 5, gaps: [2], letters: 6, sizes: [8, 9], tonicLower: false },
  { kind: 'octaves', steps: 7, gaps: [2], letters: 1, sizes: [12], tonicLower: true },
  { kind: 'tenths', steps: 9, gaps: [3], letters: 3, sizes: [15, 16], tonicLower: true },
];

/**
 * Can a pair be stopped at all? Two strings `gap` apart whose open pitches are
 * at or below the notes — in the closed style, an open string only for a
 * pitch nothing can fret (E2).
 */
const frettable = (m: number) => OPEN.some((o) => m - o >= 1 && m - o <= MAX_FRET);
const onString = (m: number, s: number, avoid: boolean) => m - OPEN[s] >= 0 && m - OPEN[s] <= MAX_FRET && !(avoid && m === OPEN[s] && frettable(m));
const pairPlayable = (lo: number, hi: number, gaps: readonly number[], avoid: boolean) =>
  gaps.some((g) => OPEN.some((_, s) => s + g < OPEN.length && onString(lo, s, avoid) && onString(hi, s + g, avoid)));

function oraclePairs(root: string, type: ScaleType, k: (typeof KINDS)[number], octaves: number, avoid: boolean) {
  const n = 7 * octaves + 1;
  const off = k.tonicLower ? 0 : -k.steps;
  const downType: ScaleType = type === 'melodic_minor' ? 'natural_minor' : type;
  const build = (t: number) => [
    ...Array.from({ length: n }, (_, i) => [tone(root, type, t, off + i), tone(root, type, t, off + i + k.steps)]),
    ...Array.from({ length: n - 1 }, (_, q) => [tone(root, downType, t, off + n - 2 - q), tone(root, downType, t, off + n - 2 - q + k.steps)]),
  ];
  // The lowest tonic whose every pair lies on the neck and can be stopped.
  for (let t = lowest(root); ; t += 12) {
    const pairs = build(t);
    if (pairs.some(([lo]) => lo.midi < OPEN[0])) continue;
    if (pairs.every(([lo, hi]) => pairPlayable(lo.midi, hi.midi, k.gaps, avoid))) return pairs;
  }
}

function checkInterval(ex: TechniqueExercise, root: Note, type: ScaleType, k: (typeof KINDS)[number], label: string, avoid = false) {
  const expected = oraclePairs(nameOf(root), type, k, ex.octaves, avoid);
  const pairs = ex.style === 'together' ? ex.events.map((e) => e.notes) : expected.map((_, i) => [ex.events[2 * i].notes[0], ex.events[2 * i + 1].notes[0]]);
  expect(pairs.length, label).toBe(expected.length);
  pairs.forEach(([lo, hi], i) => {
    const [eLo, eHi] = expected[i];
    const where = `${label} pair #${i}`;
    expect([lo.midi, hi.midi], where).toEqual([eLo.midi, eHi.midi]); // broken: low first, both ways
    if (eLo.name) expect(nameOf(lo.note), where).toBe(eLo.name);
    if (eHi.name) expect(nameOf(hi.note), where).toBe(eHi.name);
    expect(letterDegree(nameOf(lo.note), nameOf(hi.note)), where).toBe(k.letters);
    expect(k.sizes, where).toContain(hi.midi - lo.midi);
  });
  // The tonic sits where ABRSM puts it in the first pair.
  const [first] = pairs;
  expect(nameOf((k.tonicLower ? first[0] : first[1]).note), `${label}: tonic voice`).toBe(nameOf(root));
  expect(ex.startMidi, label).toBe(expected[0][0].midi);
  checkDoubleStops(pairs, label, k.gaps);
  // Right hand: ip/mp together, i m broken; tirando.
  expect(ex.rightHand.strokes).toEqual(['tirando']);
  if (ex.style === 'together') ex.events.forEach((e, i) => expect(e.rh, label).toEqual(['p', i % 2 === 0 ? 'i' : 'm']));
  else ex.events.forEach((e, i) => expect(e.rh, label).toEqual([i % 2 === 0 ? 'i' : 'm']));
}

describe('interval scales — 12 roots × 4 scale forms × 3rds/6ths/octaves/10ths × broken/together × both styles, 1 octave', () => {
  for (const k of KINDS) {
    for (const style of ['broken', 'together'] as const) {
      it(`${k.kind} ${style}`, () => {
        for (const os of STYLES) {
          for (const type of SCALES) {
            for (const root of ROOTS(type)) {
              const label = `${nameOf(root)} ${type} ${k.kind} ${style} ${os}`;
              const ex = intervalScale(root, type, k.kind, style, { openStrings: os });
              expect(ex, label).not.toBeNull();
              checkInterval(ex!, root, type, k, label, os === 'avoid');
            }
          }
        }
      });
    }
  }
  it('2 octaves where the neck holds them: same rules', () => {
    let built = 0;
    for (const k of KINDS) {
      for (const root of ROOTS('major')) {
        const ex = intervalScale(root, 'major', k.kind, 'together', { octaves: 2 });
        if (ex === null) continue;
        built++;
        checkInterval(ex, root, 'major', k, `${nameOf(root)} major ${k.kind} 2 oct`);
      }
    }
    expect(built).toBeGreaterThan(0);
  });
  it('tonicVoice overrides the convention (6ths with the tonic below)', () => {
    const C: Note = { natural: 'C', accidental: '' };
    const ex = intervalScale(C, 'major', 'sixths', 'together', { tonicVoice: 'lower' })!;
    expect(nameOf(ex.events[0].notes[0].note)).toBe('C');
    expect(nameOf(ex.events[0].notes[1].note)).toBe('A');
  });
  it('the syllabus items exist: A major 6ths, F major octaves, A melodic minor 10ths (ABRSM), G major 3rds, C major 6ths (Trinity, LCM)', () => {
    const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
    for (const [r, t, k] of [['A', 'major', 'sixths'], ['F', 'major', 'octaves'], ['A', 'melodic_minor', 'tenths'], ['G', 'major', 'thirds'], ['C', 'major', 'sixths']] as const) {
      for (const style of ['together', 'broken'] as const) expect(intervalScale(N(r), t, k, style), `${r} ${t} ${k} ${style}`).not.toBeNull();
    }
    // F major octaves on strings 6–4 / 5–3 with fingers 1–3, the classical shape.
    const f = intervalScale(N('F'), 'major', 'octaves', 'together')!;
    expect(place(f.events[0].notes[0])).toEqual([0, 1, 1]);
    expect(place(f.events[0].notes[1])).toEqual([2, 3, 3]);
  });
  it('octave scales stay at or below the 12th fret (they cross string pairs instead of climbing one)', () => {
    for (const type of SCALES) {
      for (const root of ROOTS(type)) {
        const ex = intervalScale(root, type, 'octaves', 'together')!;
        expect(Math.max(...techniqueNotes(ex).map((n) => n.fret)), `${nameOf(root)} ${type}`).toBeLessThanOrEqual(12);
      }
    }
    // D major used to climb strings 4–2 to the 15th fret.
    expect(Math.max(...techniqueNotes(intervalScale({ natural: 'D', accidental: '' }, 'major', 'octaves', 'together')!).map((n) => n.fret))).toBe(10);
  });
  it('is deterministic and rejects non-heptatonic scales', () => {
    const C: Note = { natural: 'C', accidental: '' };
    expect(intervalScale(C, 'major', 'tenths', 'together')).toEqual(intervalScale(C, 'major', 'tenths', 'together'));
    expect(intervalScale(C, 'pentatonic_major', 'thirds', 'broken')).toBeNull();
  });
});

// ─── Arpeggios ──────────────────────────────────────────────────────────────

const CHORD_DEGREES: Record<string, string[]> = {
  major: ['1', '3', '5'],
  minor: ['1', 'b3', '5'],
  dominant7: ['1', '3', '5', 'b7'],
  diminished7: ['1', 'b3', 'b5', 'bb7'],
};

function oracleUp(root: string, quality: string, octaves: number, start = lowest(root)) {
  const ds = CHORD_DEGREES[quality];
  const up: { name: string | null; midi: number; deg: string }[] = [];
  for (let o = 0; o < octaves; o++) for (const d of ds) up.push({ name: spellDegree(root, d), midi: start + 12 * o + semisOf(d), deg: d });
  up.push({ name: root, midi: start + 12 * octaves, deg: '1' });
  return up;
}

type ArpType = { label: string; make: (r: Note, o: object) => TechniqueExercise | null; spell: ScaleType; chordRoot: (k: string) => string; quality: string };
const ARP_TYPES: ArpType[] = [
  { label: 'tonic major', make: (r, o) => tonicArpeggio(r, 'major', o), spell: 'major', chordRoot: (k) => k, quality: 'major' },
  { label: 'tonic minor', make: (r, o) => tonicArpeggio(r, 'minor', o), spell: 'natural_minor', chordRoot: (k) => k, quality: 'minor' },
  { label: 'V7 major key', make: (r, o) => dominantSeventhArpeggio(r, 'major', o), spell: 'major', chordRoot: (k) => spellDegree(k, '5')!, quality: 'dominant7' },
  { label: 'V7 minor key', make: (r, o) => dominantSeventhArpeggio(r, 'minor', o), spell: 'harmonic_minor', chordRoot: (k) => spellDegree(k, '5')!, quality: 'dominant7' },
  { label: 'dim7', make: (r, o) => diminishedSeventhArpeggio(r, o), spell: 'harmonic_minor', chordRoot: (k) => k, quality: 'diminished7' },
];

function checkArpeggio(ex: TechniqueExercise, key: string, t: ArpType, label: string) {
  const root = t.chordRoot(key);
  const up = oracleUp(root, t.quality, ex.octaves);
  const dominant = t.quality === 'dominant7';
  // ABRSM p. 14: the dominant 7th comes down only to its 3rd, then resolves up a semitone on the tonic.
  const down = [...up].reverse().slice(1, dominant ? -1 : undefined);
  const all = [...up, ...down];
  const notes = techniqueNotes(ex);
  expect(notes.length, label).toBe(all.length + (dominant ? 1 : 0));
  expect(ex.ascendingCount, label).toBe(up.length);
  all.forEach((e, i) => {
    expect(notes[i].midi, `${label} #${i}`).toBe(e.midi);
    if (e.name) expect(nameOf(notes[i].note), `${label} #${i}`).toBe(e.name);
    expect(letterDegree(root, nameOf(notes[i].note)), `${label} #${i}`).toBe(Number(e.deg.replace(/\D/g, '')));
  });
  if (dominant) {
    const last = notes[notes.length - 1];
    expect(nameOf(last.note), `${label}: resolves on the tonic`).toBe(key);
    expect(last.midi - notes[notes.length - 2].midi, `${label}: leading note up a semitone`).toBe(1);
    expect(nameOf(notes[notes.length - 2].note)).toBe(spellDegree(root, '3'));
    expect(ex.events[ex.events.length - 1].degrees).toEqual([0]);
  }
  // Playable, without rolled fingers; barrés flagged.
  checkPlayableLine(notes, label, ARPEGGIO_RULES);
  // Down the same way it went up.
  expect(notes.slice(up.length - 1, all.length).map(place), `${label}: descent reverses the ascent`).toEqual(
    notes.slice(0, up.length).reverse().slice(0, all.length - up.length + 1).map(place),
  );
  // No little finger on the bass.
  expect(notes[0].finger, `${label}: little finger on the bass`).not.toBe(4);
  // Right hand: tirando, without over-ringing.
  expect(ex.rightHand.strokes).toEqual(['tirando']);
  expect(ex.rightHand.overRinging).toBe(false);
  expect(ex.events.every((e) => e.rh.length === 1)).toBe(true);
}

describe('arpeggios — 5 types × 12 roots (oracle)', () => {
  for (const t of ARP_TYPES) {
    it(t.label, () => {
      for (const r of ROOTS(t.spell)) {
        const ex = t.make(r, {});
        expect(ex, `${nameOf(r)} ${t.label}`).not.toBeNull();
        checkArpeggio(ex!, nameOf(r), t, `${nameOf(r)} ${t.label}`);
      }
    });
  }

  it('every arpeggio is clean: 0 rolled fingers, 0 unflagged barrés (60 exercises)', () => {
    const report: Record<string, { exercises: number; clean: number }> = {};
    for (const t of ARP_TYPES) {
      report[t.label] = { exercises: 0, clean: 0 };
      for (const r of ROOTS(t.spell)) {
        const v = lineViolations(techniqueNotes(t.make(r, {})!));
        report[t.label].exercises++;
        if (v.rolls + v.unflaggedBarres + v.wrongFlags === 0) report[t.label].clean++;
      }
    }
    for (const t of ARP_TYPES) expect(report[t.label], t.label).toEqual({ exercises: 12, clean: 12 });
  });

  it('closed style is not offered for arpeggios or broken chords (null, like the chromatic scale)', () => {
    for (const t of ARP_TYPES) for (const r of ROOTS(t.spell)) expect(t.make(r, { openStrings: 'avoid' }), `${nameOf(r)} ${t.label}`).toBeNull();
    for (const mode of ['major', 'minor'] as const) {
      for (const r of ROOTS(mode === 'major' ? 'major' : 'natural_minor')) {
        for (const startOctave of [0, 1]) expect(brokenChord(r, mode, { startOctave, openStrings: 'avoid' })).toBeNull();
      }
    }
  });

  it('right hand: ppppima for 2-octave tonic arpeggios (Trinity G5), ppimim… for the 7ths', () => {
    const C: Note = { natural: 'C', accidental: '' };
    const t = tonicArpeggio(C, 'major')!;
    expect(t.rightHand.pattern).toBe('ppppima');
    expect(t.events.map((e) => e.rh[0]).join('')).toBe('ppppima' + 'mipppp');
    expect(t.rightHand.basis).toBe('syllabus');
    const d = dominantSeventhArpeggio(C, 'major')!;
    expect(d.rightHand.pattern).toBe('ppimim…');
    // The continuation past "ppimim" is our reading of the syllabus's ellipsis.
    expect(d.rightHand.basis).toBe('inferred');
    expect(diminishedSeventhArpeggio(C)!.rightHand.basis).toBe('inferred');
    expect(d.events).toHaveLength(17);
    expect(d.events.map((e) => e.rh[0]).join('')).toBe('pp' + 'im'.repeat(7) + 'i');
    expect(diminishedSeventhArpeggio(C)!.events.slice(0, 6).map((e) => e.rh[0]).join('')).toBe('ppimim');
  });

  it('hand-checked: open-position C, G, D, E majors and A minor on their chord grips', () => {
    const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
    const up = (ex: TechniqueExercise) => techniqueNotes(ex).slice(0, ex.ascendingCount).map((n) => `${6 - n.stringIndex}:${n.fret}/${n.finger}`).join(' ');
    expect(up(tonicArpeggio(N('C'), 'major')!)).toBe('5:3/3 4:2/2 3:0/0 2:1/1 1:0/0 1:3/3 1:8/4');
    expect(up(tonicArpeggio(N('G'), 'major')!)).toBe('6:3/3 5:2/2 4:0/0 3:0/0 2:0/0 2:3/3 1:3/4');
    expect(up(tonicArpeggio(N('A'), 'minor')!)).toBe('5:0/0 5:3/4 4:2/2 3:2/3 2:1/1 1:0/0 1:5/4');
    expect(up(tonicArpeggio(N('D'), 'major')!)).toBe('4:0/0 4:4/3 3:2/1 2:3/2 1:2/1 1:5/4 1:10/4');
    // ABRSM Grade 5 E major: first position on the E grip (1 on fret 1, 2 and 3 on fret 2, 4 on fret 4).
    expect(up(tonicArpeggio(N('E'), 'major')!)).toBe('6:0/0 6:4/4 5:2/2 4:2/3 3:1/1 2:0/0 1:0/0');
  });
});

// ─── Broken chords ──────────────────────────────────────────────────────────

/** ABRSM p. 14: groups of three chord tones rising from 1, 3, 5, the top 1; falling from 5, 3; then 1. */
function oracleBrokenChord(root: string, quality: 'major' | 'minor', octaves: number, start: number) {
  const ds = CHORD_DEGREES[quality];
  const t = (k: number) => ({ name: spellDegree(root, ds[k % 3]), midi: start + 12 * Math.floor(k / 3) + semisOf(ds[k % 3]) });
  const top = 3 * octaves;
  const starts = [...Array.from({ length: top + 1 }, (_, k) => k), ...Array.from({ length: top - 1 }, (_, k) => top - 1 - k)];
  return [...starts.flatMap((k) => [t(k), t(k + 1), t(k + 2)]), t(0)];
}

/**
 * Can three ascending notes ring on three different strings, climbing at most
 * two strings at a time, inside the 15-fret neck? (Independent of the engine.)
 */
function groupStoppable(a: number, b: number, c: number): boolean {
  const on = (m: number, s: number) => m - OPEN[s] >= 0 && m - OPEN[s] <= MAX_FRET;
  for (let s1 = 0; s1 < 6; s1++) for (let s2 = s1 + 1; s2 <= Math.min(5, s1 + 2); s2++) for (let s3 = s2 + 1; s3 <= Math.min(5, s2 + 2); s3++) {
    if (on(a, s1) && on(b, s2) && on(c, s3)) return true;
  }
  return false;
}

describe('broken chords (ABRSM pattern, with over-ringing)', () => {
  it('every key, from the lowest tonic and an octave above: one string per note in every group, or null where the guitar cannot', () => {
    let built = 0;
    let groups = 0;
    const impossible: string[] = [];
    for (const mode of ['major', 'minor'] as const) {
      for (const r of ROOTS(mode === 'major' ? 'major' : 'natural_minor')) {
        for (const startOctave of [0, 1]) {
          const label = `${nameOf(r)} ${mode} +${startOctave}`;
          const ex = brokenChord(r, mode, { startOctave });
          const expected = oracleBrokenChord(nameOf(r), mode, 1, lowest(nameOf(r)) + 12 * startOctave);
          const groupsOk = Array.from({ length: (expected.length - 1) / 3 }, (_, g) => expected.slice(3 * g, 3 * g + 3)).every(([a, b, c]) =>
            groupStoppable(a.midi, b.midi, c.midi),
          );
          if (!groupsOk || Math.max(...expected.map((e) => e.midi)) > OPEN[5] + MAX_FRET) {
            impossible.push(label);
            expect(ex, `${label}: cannot ring on three strings, yet fingered`).toBeNull();
            continue;
          }
          expect(ex, label).not.toBeNull();
          built++;
          const notes = techniqueNotes(ex!);
          expect(notes.map((n) => n.midi), label).toEqual(expected.map((e) => e.midi));
          notes.forEach((n, i) => {
            if (expected[i].name) expect(nameOf(n.note), `${label} #${i}`).toBe(expected[i].name);
          });
          const groupOf = notes.map((_, i) => (i < notes.length - 1 ? Math.floor(i / 3) : undefined));
          const groupStart = notes.map((_, i) => i === notes.length - 1 || i % 3 === 0);
          checkPlayableLine(notes, label, {
            ...ARPEGGIO_RULES,
            maxStringStep: 2,
            groups: groupOf,
            leaps: groupStart.map((st) => (st ? 3 : undefined)),
            jumpOk: groupStart,
          });
          groups += (notes.length - 1) / 3;
          expect(ex!.rightHand).toMatchObject({ strokes: ['tirando'], overRinging: true });
        }
      }
    }
    expect(built).toBe(32);
    expect(groups).toBe(32 * 6);
    // Impossible on a 15-fret guitar: from the lowest E, F, F♯ the chord's 3rd
    // (or 5th) lies below the open A / D string, so the first group cannot
    // take three strings; an octave up, C, C♯/D♭, D, E♭ and B run their top
    // group past the 15th fret or onto the 1st string alone.
    expect(impossible.sort()).toEqual(
      ['E', 'F', 'F#'].flatMap((k) => [`${k} major +0`, `${k} minor +0`])
        .concat(['C', 'D', 'Eb', 'B'].flatMap((k) => [`${k} major +1`, `${k} minor +1`]), ['Db major +1', 'C# minor +1'])
        .sort(),
    );
  });
  it('every group is a grip a hand can hold — all spellings × major/minor × 1–2 octaves × both starts', () => {
    const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
    let fingered = 0;
    let groupsChecked = 0;
    for (const l of LETTERS) {
      for (const a of ['', 'b', '#'] as const) {
        const r: Note = { natural: l, accidental: a };
        for (const mode of ['major', 'minor'] as const) {
          for (const octaves of [1, 2]) {
            for (const startOctave of [0, 1]) {
              const label = `${nameOf(r)} ${mode} ${octaves}oct +${startOctave}`;
              const ex = brokenChord(r, mode, { octaves, startOctave });
              const av = brokenChordAvailability(r, mode, { octaves, startOctave });
              expect(av.available, `${label}: availability agrees with brokenChord`).toBe(ex !== null);
              if (ex === null) {
                expect(av.available ? null : av.reason, label).toMatch(/^(bass-notes-on-one-string|beyond-neck|no-holdable-grip)$/);
                continue;
              }
              fingered++;
              const notes = techniqueNotes(ex);
              const groupOf = notes.map((_, i) => (i < notes.length - 1 ? Math.floor(i / 3) : undefined));
              const groupStart = notes.map((_, i) => i === notes.length - 1 || i % 3 === 0);
              checkPlayableLine(notes, label, { ...ARPEGGIO_RULES, maxStringStep: 2, groups: groupOf, leaps: groupStart.map((st) => (st ? 3 : undefined)), jumpOk: groupStart });
              groupsChecked += (notes.length - 1) / 3;
            }
          }
        }
      }
    }
    expect(fingered).toBe(66);
    expect(groupsChecked).toBe(468);
  });

  it('the oracle rejects grips no hand can hold (mutation check on the grips the review found)', () => {
    const mk = (name: string, midi: number, stringIndex: number, fret: number, finger: number, barre = false, position = 2): OracleNote => ({
      midi,
      note: { natural: name[0] as Note['natural'], accidental: name.slice(1) as Note['accidental'] },
      stringIndex,
      fret,
      finger,
      position,
      shift: null,
      barre,
    });
    const rules = { ...ARPEGGIO_RULES, maxStringStep: 2, groups: [0, 0, 0] };
    // D minor: the 2nd finger flat across fret 3 of the 4th and 2nd strings would stop the 3rd string's A as B♭.
    expect(() => checkPlayableLine([mk('F', 53, 2, 3, 2), mk('A', 57, 3, 2, 1), mk('D', 62, 4, 3, 2)], 'D minor (old)', rules)).toThrow();
    // C minor: an index barré on fret 1 across the open G string.
    expect(() => checkPlayableLine([mk('Eb', 51, 2, 1, 1, true), mk('G', 55, 3, 0, 0), mk('C', 60, 4, 1, 1, true)], 'C minor (old)', rules)).toThrow();
    // An index barré inside a group flagged on one note only.
    expect(() => checkPlayableLine([mk('F', 53, 2, 3, 1, true), mk('A#', 58, 3, 3, 1, true), mk('D', 62, 4, 3, 1, false)], 'unflagged', rules)).toThrow();
    // Two fingers on one fret with the higher finger on the lower string.
    expect(() => checkPlayableLine([mk('F', 53, 2, 3, 3), mk('A', 57, 3, 2, 1), mk('D', 62, 4, 3, 2)], 'crossed', rules)).toThrow();
    // Positive control: the D minor grip the engine now uses (ring + little on fret 3, middle on fret 2).
    expect(() =>
      checkPlayableLine([mk('F', 53, 2, 3, 3, false, 1), mk('A', 57, 3, 2, 2, false, 1), mk('D', 62, 4, 3, 4, false, 1)], 'D minor (new)', { ...rules, allowSharedFrets: true }),
    ).not.toThrow();
  });

  it('every unavailable broken chord says why, and suggests the other start when it works', () => {
    const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
    // ABRSM Grade 5 asks for E minor "starting an octave above lowest tonic": from the lowest E it cannot ring.
    expect(brokenChordAvailability(N('E'), 'minor')).toEqual({ available: false, reason: 'bass-notes-on-one-string', suggestStartOctave: 1 });
    expect(brokenChordAvailability(N('E'), 'minor', { startOctave: 1 })).toEqual({ available: true });
    expect(brokenChordAvailability(N('C'), 'major', { startOctave: 1 })).toEqual({ available: false, reason: 'beyond-neck', suggestStartOctave: 0 });
    expect(brokenChordAvailability(N('C'), 'major', { openStrings: 'avoid' })).toEqual({ available: false, reason: 'closed-style' });
    const reasons: Record<string, string[]> = {};
    for (const mode of ['major', 'minor'] as const) {
      for (const r of ROOTS(mode === 'major' ? 'major' : 'natural_minor')) {
        for (const startOctave of [0, 1]) {
          const av = brokenChordAvailability(r, mode, { startOctave });
          if (av.available) continue;
          // Every one of these keys works from the other start.
          expect(av.suggestStartOctave, `${nameOf(r)} ${mode} +${startOctave}`).toBe(1 - startOctave);
          (reasons[av.reason] ??= []).push(`${nameOf(r)} ${mode} +${startOctave}`);
        }
      }
    }
    expect(Object.keys(reasons).sort()).toEqual(['bass-notes-on-one-string', 'beyond-neck']);
    expect(reasons['bass-notes-on-one-string'].sort()).toEqual(['E major +0', 'E minor +0', 'F major +0', 'F minor +0', 'F# major +0', 'F# minor +0']);
    expect(reasons['beyond-neck']).toHaveLength(10);
  });

  it('the open-position keys ring on three strings in every group: G and C major, A minor; E minor from an octave up (ABRSM Grade 5)', () => {
    const N = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });
    for (const [k, mode, so] of [['G', 'major', 0], ['C', 'major', 0], ['A', 'minor', 0], ['E', 'minor', 1]] as const) {
      const notes = techniqueNotes(brokenChord(N(k), mode, { startOctave: so })!);
      for (let g = 0; g < 6; g++) {
        expect(new Set(notes.slice(3 * g, 3 * g + 3).map((n) => n.stringIndex)).size, `${k} ${mode} group ${g}`).toBe(3);
      }
    }
    // E minor from the lowest tonic is impossible: G2 is only on the 6th string, with E2.
    expect(brokenChord(N('E'), 'minor')).toBeNull();
    // G major: the open D, G and B strings carry the middle groups.
    const g = techniqueNotes(brokenChord(N('G'), 'major')!).map((n) => `${6 - n.stringIndex}:${n.fret}`);
    expect(g.slice(0, 9).join(' ')).toBe('6:3 5:2 4:0 5:2 4:0 3:0 4:0 3:0 2:0');
  });
  it('ABRSM Grade 5: E minor starting an octave above the lowest tonic — E3 G3 B3 · G3 B3 E4 · …', () => {
    const ex = brokenChord({ natural: 'E', accidental: '' }, 'minor', { startOctave: 1 })!;
    expect(techniqueNotes(ex).map((n) => `${nameOf(n.note)}`).join(' ')).toBe('E G B G B E B E G E G B B E G G B E E');
    expect(ex.startMidi).toBe(52);
  });
});

// ─── Chromatic scale ────────────────────────────────────────────────────────

describe('chromatic scale (ABRSM)', () => {
  it('2 octaves from every note: sharps up, flats down, the same places both ways', () => {
    const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    for (let pc = 0; pc < 12; pc++) {
      const start = preferredRootSpelling(pc, 'major');
      const ex = chromaticScale(start)!;
      expect(ex, nameOf(start)).not.toBeNull();
      const notes = techniqueNotes(ex);
      const first = lowest(nameOf(start));
      expect(notes.map((n) => n.midi)).toEqual([...Array.from({ length: 25 }, (_, k) => first + k), ...Array.from({ length: 24 }, (_, k) => first + 23 - k)]);
      notes.forEach((n, i) => {
        const tonic = mod12(n.midi - first) === 0;
        const want = tonic ? nameOf(start) : (i < 25 ? SHARPS : FLATS)[mod12(n.midi)];
        expect(nameOf(n.note), `${nameOf(start)} #${i}`).toBe(want);
      });
      checkPlayableLine(notes, `chromatic ${nameOf(start)}`);
      expect(notes.slice(24).map(place)).toEqual(notes.slice(0, 25).reverse().map(place));
      // Thumb for the lower octave, fingers (i m) for the upper.
      ex.events.forEach((e) => expect(e.rh[0] === 'p', `${nameOf(start)} rh`).toBe(e.notes[0].midi < first + 12));
      expect(ex.rightHand).toMatchObject({ strokes: ['tirando'], pattern: 'p + im', basis: 'syllabus' });
    }
  });
  it('closed-position style is not offered (it would need unguided cross-string shifts)', () => {
    expect(chromaticScale({ natural: 'B', accidental: '' }, { openStrings: 'avoid' })).toBeNull();
  });
});

// ─── Right hand for scales ──────────────────────────────────────────────────

describe('scale right hand', () => {
  it('fingers only alternate (im / ma), tirando or apoyando; thumb and fingers: p below the octave, i m above, tirando', () => {
    const midis = [40, 42, 44, 45, 47, 49, 51, 52, 54, 56];
    expect(scaleRightHand(midis, 'im')).toEqual({ fingers: ['i', 'm', 'i', 'm', 'i', 'm', 'i', 'm', 'i', 'm'], strokes: ['tirando', 'apoyando'] });
    expect(scaleRightHand(midis, 'ma').fingers.slice(0, 3)).toEqual(['m', 'a', 'm']);
    expect(scaleRightHand(midis, 'thumbAndFingers')).toEqual({
      fingers: ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'i', 'm', 'i'],
      strokes: ['tirando'],
    });
  });
});
