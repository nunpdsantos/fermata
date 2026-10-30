/**
 * Classical guitar positions generated from the scale engine (audit W3-01,
 * W3-02, W3-07, W3-13, W10-11; decision D-02).
 *
 * Every assertion below is checked against an INDEPENDENT oracle written in
 * this file (ported from the auditors' Track A oracle and the verify-A1
 * check): scales are rebuilt from step patterns / degree formulas, string
 * pitches from hard-coded MIDI numbers, and degree labels are parsed back to
 * semitones. Nothing here asks the engine whether the engine is right.
 *
 * Scope: every ScaleType x 12 roots x 13 positions (Open, I-XII) x 6 tunings.
 */
import { describe, it, expect } from 'vitest';
import {
  getGuitarPosition,
  suggestGuitarPosition,
  scaleDegreeLabel,
  toRomanNumeral,
  fingeringKey,
  POSITION_NUMBERS,
  GUITAR_MAX_FRET,
} from '../guitarPositions';
import type { GuitarPosition } from '../guitarPositions';
import { GUITAR_TUNINGS, getTuningById } from '../../constants/guitarTunings';
import { SCALE_FORMULAS } from '../../constants/scales';
import type { Note, ScaleType } from '../../types/music';

// ─── Independent oracle (no engine imports) ─────────────────────────────────

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
const mod12 = (n: number) => ((n % 12) + 12) % 12;
const pcOfName = (name: string) => {
  const m = /^([A-G])(##|#|bb|b)?$/.exec(name);
  if (!m) throw new Error(`bad note ${name}`);
  return mod12(LETTER_PC[m[1]] + ACC[m[2] ?? '']);
};
const toNote = (name: string): Note => ({
  natural: name[0] as Note['natural'],
  accidental: name.slice(1) as Note['accidental'],
});

function stepsToSemis(steps: number[]): number[] {
  const out = [0];
  for (let i = 0; i < steps.length - 1; i++) out.push(out[i] + steps[i]);
  return out;
}
const rotate = (s: number[], k: number) => [...s.slice(k), ...s.slice(0, k)];
const MAJOR_STEPS = [2, 2, 1, 2, 2, 2, 1];
const MEL_STEPS = [2, 1, 2, 2, 2, 2, 1];
const HARM_STEPS = [2, 1, 2, 2, 1, 3, 1];
const mode = (steps: number[], k: number) => stepsToSemis(rotate(steps, k));
const MAJOR_SEMIS = stepsToSemis(MAJOR_STEPS); // 0 2 4 5 7 9 11
const fromDegrees = (ds: string[]) =>
  ds.map((d) => {
    const m = /^(bb|b|##|#)?(\d)$/.exec(d)!;
    return MAJOR_SEMIS[Number(m[2]) - 1] + ACC[m[1] ?? ''];
  });

/** Semitone sets from first principles (Track A oracle conventions). */
const ORACLE_SEMIS: Record<ScaleType, number[]> = {
  major: mode(MAJOR_STEPS, 0),
  dorian: mode(MAJOR_STEPS, 1),
  phrygian: mode(MAJOR_STEPS, 2),
  lydian: mode(MAJOR_STEPS, 3),
  mixolydian: mode(MAJOR_STEPS, 4),
  natural_minor: mode(MAJOR_STEPS, 5),
  locrian: mode(MAJOR_STEPS, 6),
  melodic_minor: mode(MEL_STEPS, 0),
  dorian_b2: mode(MEL_STEPS, 1),
  lydian_augmented: mode(MEL_STEPS, 2),
  lydian_dominant: mode(MEL_STEPS, 3),
  mixolydian_b6: mode(MEL_STEPS, 4),
  locrian_natural2: mode(MEL_STEPS, 5),
  altered: mode(MEL_STEPS, 6),
  harmonic_minor: mode(HARM_STEPS, 0),
  phrygian_dominant: mode(HARM_STEPS, 4),
  hungarian_minor: fromDegrees(['1', '2', 'b3', '#4', '5', 'b6', '7']),
  hungarian_major: fromDegrees(['1', '#2', '3', '#4', '5', '6', 'b7']),
  double_harmonic: fromDegrees(['1', 'b2', '3', '4', '5', 'b6', '7']),
  persian: fromDegrees(['1', 'b2', '3', '4', 'b5', 'b6', '7']),
  neapolitan_minor: fromDegrees(['1', 'b2', 'b3', '4', '5', 'b6', '7']),
  neapolitan_major: fromDegrees(['1', 'b2', 'b3', '4', '5', '6', '7']),
  pentatonic_major: fromDegrees(['1', '2', '3', '5', '6']),
  pentatonic_minor: fromDegrees(['1', 'b3', '4', '5', 'b7']),
  blues: fromDegrees(['1', 'b3', '4', 'b5', '5', 'b7']),
  major_blues: fromDegrees(['1', '2', 'b3', '3', '5', '6']),
  hirajoshi: fromDegrees(['1', '2', 'b3', '5', 'b6']),
  in_sen: fromDegrees(['1', 'b2', '4', '5', 'b7']),
  iwato: fromDegrees(['1', 'b2', '4', 'b5', 'b7']),
  egyptian: fromDegrees(['1', '2', '4', '5', 'b7']),
  whole_tone: fromDegrees(['1', '2', '3', '#4', '#5', 'b7']),
  diminished_whole_half: fromDegrees(['1', '2', 'b3', '4', 'b5', 'b6', '6', '7']),
  diminished_half_whole: fromDegrees(['1', 'b2', '#2', '3', '#4', '5', '6', 'b7']),
  bebop_dominant: fromDegrees(['1', '2', '3', '4', '5', '6', 'b7', '7']),
  bebop_major: fromDegrees(['1', '2', '3', '4', '5', '#5', '6', '7']),
  bebop_dorian: fromDegrees(['1', '2', 'b3', '3', '4', '5', '6', 'b7']),
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

/** Open-string MIDI numbers, low (6th) → high (1st), written out by hand. */
const ORACLE_TUNING_MIDI: Record<string, number[]> = {
  standard: [40, 45, 50, 55, 59, 64], // E2 A2 D3 G3 B3 E4
  'drop-d': [38, 45, 50, 55, 59, 64], // D2 A2 D3 G3 B3 E4
  'half-step-down': [39, 44, 49, 54, 58, 63], // Eb2 Ab2 Db3 Gb3 Bb3 Eb4
  'open-g': [38, 43, 50, 55, 59, 62], // D2 G2 D3 G3 B3 D4
  'open-d': [38, 45, 50, 54, 57, 62], // D2 A2 D3 F#3 A3 D4
  dadgad: [38, 45, 50, 55, 57, 62], // D2 A2 D3 G3 A3 D4
};

/** Degree label ('b3', '#4', '1', 'bb7') → semitones above the root, mod 12. */
function labelSemis(label: string): number {
  const m = /^(bb|b|##|#)?(\d+)$/.exec(label);
  if (!m) throw new Error(`unparseable degree label ${label}`);
  const num = Number(m[2]);
  return mod12(MAJOR_SEMIS[(num - 1) % 7] + ACC[m[1] ?? '']);
}

const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SCALE_TYPES = Object.keys(SCALE_FORMULAS) as ScaleType[];

// ─── Sweep (computed once, asserted per tuning below) ───────────────────────

interface Violation { where: string; what: string }

function windowOf(n: number) {
  return n === 0 ? { lo: 0, hi: 4, up: 5, down: null as number | null } : { lo: n, hi: n + 3, up: n + 4, down: n >= 2 ? n - 1 : null };
}

function checkPosition(
  pos: GuitarPosition,
  scaleType: ScaleType,
  rootName: string,
  tuningId: string,
  n: number,
  violations: Violation[],
  exceptions: { gaps: string[]; missing: string[] },
) {
  const where = `${tuningId} ${rootName} ${scaleType} pos ${n}`;
  const bad = (what: string) => violations.push({ where, what });
  const openMidi = ORACLE_TUNING_MIDI[tuningId];
  const rootPc = pcOfName(rootName);
  const scalePcs = new Set(ORACLE_SEMIS[scaleType].map((s) => mod12(rootPc + s)));
  const { lo, hi, up, down } = windowOf(n);

  expect(pos.position).toBe(n);
  const seenMidi = new Set<number>();
  const fretted: number[] = [];
  let stretchSide: 'up' | 'down' | null = null;

  for (const note of pos.notes) {
    const midi = openMidi[note.stringIndex] + note.fret;
    const pc = mod12(midi);
    if (note.midi !== midi) bad(`midi field ${note.midi} != oracle ${midi}`);
    if (note.pitchClass !== pc) bad(`pitchClass field ${note.pitchClass} != oracle ${pc}`);
    // 1. In the scale.
    if (!scalePcs.has(pc)) bad(`s${6 - note.stringIndex} fret ${note.fret} sounds pc ${pc}, not in scale`);
    // 2. Label matches the sounding pitch.
    if (labelSemis(note.degreeLabel) !== mod12(pc - rootPc)) {
      bad(`s${6 - note.stringIndex} fret ${note.fret} labelled ${note.degreeLabel} but sounds ${mod12(pc - rootPc)} semitones above root`);
    }
    if (note.isRoot !== (pc === rootPc)) bad(`isRoot wrong at s${6 - note.stringIndex} fret ${note.fret}`);
    // 3. No unison duplicates.
    if (seenMidi.has(midi)) bad(`duplicate unison midi ${midi}`);
    seenMidi.add(midi);
    // 4. On the board.
    if (note.fret < 0 || note.fret > GUITAR_MAX_FRET) bad(`fret ${note.fret} off the board`);
    // 5. Window / stretch / fingers.
    if (note.fret === 0) {
      if (n !== 0) bad(`open string in closed position`);
      if (note.finger !== 0) bad(`open string with finger ${note.finger}`);
      if (note.isStretch) bad('open string marked as stretch');
      continue;
    }
    fretted.push(note.fret);
    if (note.finger < 1 || note.finger > 4) bad(`finger ${note.finger} out of 1-4`);
    const inWindow = note.fret >= Math.max(lo, 1) && note.fret <= hi;
    if (inWindow) {
      const expected = n === 0 ? note.fret : note.fret - n + 1;
      if (note.finger !== expected) bad(`fret ${note.fret} finger ${note.finger}, expected ${expected}`);
      if (note.isStretch) bad(`in-window fret ${note.fret} marked as stretch`);
    } else if (note.fret === up) {
      if (!note.isStretch) bad(`fret ${note.fret} outside window not marked as stretch`);
      if (note.finger !== 4) bad(`upward stretch with finger ${note.finger}`);
      if (stretchSide === 'down') bad('stretches on both sides');
      stretchSide = 'up';
    } else if (down !== null && note.fret === down) {
      if (!note.isStretch) bad(`fret ${note.fret} outside window not marked as stretch`);
      if (note.finger !== 1) bad(`downward stretch with finger ${note.finger}`);
      if (stretchSide === 'up') bad('stretches on both sides');
      stretchSide = 'down';
    } else {
      bad(`fret ${note.fret} outside the window ${lo}-${hi} and not a legal stretch`);
    }
    // A stretch is only allowed when its pitch is NOT already playable inside the window.
    if (note.isStretch) {
      const inWindowElsewhere = openMidi.some((o, s) => s !== note.stringIndex && midi - o >= lo && midi - o <= hi);
      if (inWindowElsewhere) bad(`stretch at fret ${note.fret} duplicates a pitch available inside the window`);
    }
  }

  // 6. Hand span <= 5 frets including stretches.
  if (fretted.length > 0 && Math.max(...fretted) - Math.min(...fretted) > 4) {
    bad(`hand span ${Math.max(...fretted) - Math.min(...fretted) + 1} frets`);
  }

  // 7. Open position uses every open string that belongs to the scale.
  if (n === 0) {
    openMidi.forEach((o, s) => {
      if (scalePcs.has(mod12(o)) && !pos.notes.some((x) => x.stringIndex === s && x.fret === 0)) {
        bad(`open string ${6 - s} is in the scale but not used`);
      }
    });
  }

  // 8. Continuity: every scale pitch between the lowest and highest window
  //    pitch is present, unless it is physically unreachable in this
  //    position (not inside the window, not at the stretch fret on the side
  //    this position uses). Those are recorded as documented exceptions.
  const winLo = Math.min(...openMidi.map((o) => o + lo));
  const winHi = Math.max(...openMidi.map((o) => o + hi));
  const allowedFrets = new Set<number>();
  for (let f = lo; f <= hi; f++) allowedFrets.add(f);
  if (stretchSide === 'up' || stretchSide === null) { if (up <= GUITAR_MAX_FRET) allowedFrets.add(up); }
  if ((stretchSide === 'down' || stretchSide === null) && down !== null) allowedFrets.add(down);
  const oracleSkipped: number[] = [];
  for (let m = winLo; m <= winHi; m++) {
    if (!scalePcs.has(mod12(m)) || seenMidi.has(m)) continue;
    const reachable = openMidi.some((o) => allowedFrets.has(m - o));
    if (reachable) bad(`scale pitch midi ${m} reachable but missing`);
    else { exceptions.gaps.push(`${where}: midi ${m}`); oracleSkipped.push(m); }
  }
  // The engine reports the same skipped pitches (the UI's tuning notice uses it).
  if (JSON.stringify(pos.skippedMidi) !== JSON.stringify(oracleSkipped)) {
    bad(`skippedMidi ${JSON.stringify(pos.skippedMidi)} != oracle ${JSON.stringify(oracleSkipped)}`);
  }

  // 9. Every scale degree at least once where physically possible.
  const presentPcs = new Set(pos.notes.map((x) => x.pitchClass));
  for (const pc of scalePcs) {
    if (presentPcs.has(pc)) continue;
    const reachable = openMidi.some((o) => [...allowedFrets].some((f) => mod12(o + f) === pc));
    if (reachable) bad(`scale degree pc ${pc} reachable but absent`);
    else exceptions.missing.push(`${where}: pc ${pc}`);
  }
  expect([...pos.missingPitchClasses].sort()).toEqual(
    [...scalePcs].filter((pc) => !presentPcs.has(pc)).sort(),
  );
}

describe('oracle self-checks', () => {
  it('the oracle covers exactly the engine scale types and tunings', () => {
    expect(Object.keys(ORACLE_SEMIS).sort()).toEqual([...SCALE_TYPES].sort());
    expect(Object.keys(ORACLE_TUNING_MIDI).sort()).toEqual(GUITAR_TUNINGS.map((t) => t.id).sort());
  });
  it('oracle values are textbook: C major semis, A minor = A B C D E F G, label parser', () => {
    expect(ORACLE_SEMIS.major).toEqual([0, 2, 4, 5, 7, 9, 11]);
    expect(ORACLE_SEMIS.natural_minor).toEqual([0, 2, 3, 5, 7, 8, 10]);
    expect(labelSemis('b3')).toBe(3);
    expect(labelSemis('#4')).toBe(6);
    expect(labelSemis('bb7')).toBe(9);
    expect(labelSemis('1')).toBe(0);
  });
  it('the checker catches a planted wrong note (known-positive)', () => {
    const pos = getGuitarPosition(toNote('C'), 'major', 5, getTuningById('standard'));
    const tampered: GuitarPosition = {
      ...pos,
      notes: pos.notes.map((x, i) => (i === 0 ? { ...x, fret: x.fret + 1, finger: Math.min(4, x.finger + 1) as typeof x.finger } : x)),
    };
    const v: Violation[] = [];
    checkPosition(tampered, 'major', 'C', 'standard', 5, v, { gaps: [], missing: [] });
    expect(v.length).toBeGreaterThan(0);
  });
});

describe('generated positions: every scale x 12 roots x Open-XII x 6 tunings', () => {
  for (const tuning of GUITAR_TUNINGS) {
    it(`${tuning.id}: all invariants hold`, () => {
      const violations: Violation[] = [];
      const exceptions = { gaps: [] as string[], missing: [] as string[] };
      let positions = 0;
      let dots = 0;
      for (const scaleType of SCALE_TYPES) {
        for (const rootName of ROOTS) {
          for (const n of POSITION_NUMBERS) {
            const pos = getGuitarPosition(toNote(rootName), scaleType, n, tuning);
            checkPosition(pos, scaleType, rootName, tuning.id, n, violations, exceptions);
            positions++;
            dots += pos.notes.length;
          }
        }
      }
      expect(violations.slice(0, 20)).toEqual([]);
      expect(positions).toBe(SCALE_TYPES.length * 12 * 13);
      expect(dots).toBeGreaterThan(positions * 5);
      // Documented exceptions. Standard and half-step-down tunings (strings a
      // 4th / major 3rd apart) have no unreachable scale pitches at all. Each
      // other tuning has one string pair a 5th apart (Drop D and DADGAD 6-5,
      // Open G 5-4, Open D 6-5): between those strings there is a 3-semitone
      // hole and its middle note is out of reach of a 5-fret hand (and in
      // position I the open string that would fill it is not part of a
      // closed position). Measured 2026-10-30: 5,390 such skipped pitches in
      // each of those tunings across 5,772 positions.
      const expectedGaps = tuning.id === 'standard' || tuning.id === 'half-step-down' ? 0 : 5390;
      expect(exceptions.gaps.length).toBe(expectedGaps);
      // No position anywhere lacks a scale degree altogether.
      expect(exceptions.missing).toEqual([]);
    });
  }
});

describe('specific positions (hand-checked)', () => {
  const std = getTuningById('standard');
  const describeNotes = (pos: GuitarPosition) =>
    pos.notes.map((x) => `${6 - x.stringIndex}:${x.fret}:${x.finger}${x.isStretch ? 's' : ''}`);

  it('C major Open position = the first-position C major every method book prints', () => {
    const pos = getGuitarPosition(toNote('C'), 'major', 0, std);
    // 6th: E0 F1 G3 · 5th: A0 B2 C3 · 4th: D0 E2 F3 · 3rd: G0 A2 · 2nd: B0 C1 D3 · 1st: E0 F1 G3
    expect(describeNotes(pos)).toEqual([
      '6:0:0', '6:1:1', '6:3:3',
      '5:0:0', '5:2:2', '5:3:3',
      '4:0:0', '4:2:2', '4:3:3',
      '3:0:0', '3:2:2',
      '2:0:0', '2:1:1', '2:3:3',
      '1:0:0', '1:1:1', '1:3:3',
    ]);
    expect(pos.stretch).toBe('none');
  });

  it('G major in II position needs no stretch; C major in V needs exactly one (the B)', () => {
    expect(getGuitarPosition(toNote('G'), 'major', 2, std).stretch).toBe('none');
    const c5 = getGuitarPosition(toNote('C'), 'major', 5, std);
    const stretches = c5.notes.filter((x) => x.isStretch);
    expect(stretches).toHaveLength(1);
    expect(stretches[0]).toMatchObject({ stringIndex: 2, fret: 9, finger: 4, degreeLabel: '7' });
  });

  it('picks the stretch side that avoids using one finger twice on a string when both sides fill the hole', () => {
    // C major in V: the B can be the 4th finger at fret 9 (4th string) or the
    // 1st finger at fret 4 (3rd string). The 3rd string already has C at fret 5
    // under the 1st finger, so the downward stretch would put finger 1 on two
    // frets of one string. The upward one is clean.
    const c5 = getGuitarPosition(toNote('C'), 'major', 5, std);
    expect(c5.stretch).toBe('up');
    // Count same-finger-twice-on-a-string across all diatonic modes in
    // standard tuning. Diatonic scales never have two semitones in a row, so
    // wherever BOTH stretch sides exist a clean one is chosen. Documented
    // exception: positions I and XII have only one side (fret 0 is an open
    // string, fret 16 is off the board), e.g. D major in I needs C# and the
    // 4th finger at frets 4 and 5 of the 4th string.
    const conflictsAt = new Map<number, number>();
    for (const scaleType of ['major', 'natural_minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'] as ScaleType[]) {
      for (const r of ROOTS) {
        for (const n of POSITION_NUMBERS) {
          const pos = getGuitarPosition(toNote(r), scaleType, n, std);
          for (let s = 0; s < 6; s++) {
            const fingers = pos.notes.filter((x) => x.stringIndex === s && x.finger > 0).map((x) => x.finger);
            if (new Set(fingers).size !== fingers.length) conflictsAt.set(n, (conflictsAt.get(n) ?? 0) + 1);
          }
        }
      }
    }
    expect([...conflictsAt.keys()].sort((a, b) => a - b)).toEqual([1, 12]);
  });

  it('position XII cannot stretch past the 15th fret, so it stretches down', () => {
    for (const scaleType of SCALE_TYPES) {
      for (const r of ROOTS) {
        const pos = getGuitarPosition(toNote(r), scaleType, 12, std);
        expect(pos.notes.every((x) => x.fret <= 15 && x.fret >= 11)).toBe(true);
        expect(pos.stretch).not.toBe('up');
      }
    }
  });

  it('positions walk up the neck in order (W3-02)', () => {
    for (let n = 1; n <= 12; n++) {
      const pos = getGuitarPosition(toNote('A'), 'pentatonic_minor', n, std);
      const window = pos.notes.filter((x) => !x.isStretch).map((x) => x.fret);
      expect(Math.min(...window)).toBeGreaterThanOrEqual(n);
      expect(Math.max(...window)).toBeLessThanOrEqual(n + 3);
    }
  });

  it('double-accidental roots place positions by pitch, not as C (W3-07)', () => {
    const pairs: [string, string, ScaleType][] = [
      ['F##', 'G', 'locrian'], ['Bbb', 'A', 'major'], ['Ebb', 'D', 'dorian'],
      ['Abb', 'G', 'mixolydian'], ['Dbb', 'C', 'lydian'], ['G##', 'A', 'phrygian'],
      ['C##', 'D', 'natural_minor'], ['D##', 'E', 'harmonic_minor'],
    ];
    for (const [odd, plain, scaleType] of pairs) {
      for (const n of POSITION_NUMBERS) {
        const a = getGuitarPosition(toNote(odd), scaleType, n, std);
        const b = getGuitarPosition(toNote(plain), scaleType, n, std);
        expect(a.notes.map((x) => [x.stringIndex, x.fret, x.finger])).toEqual(b.notes.map((x) => [x.stringIndex, x.fret, x.finger]));
        for (const x of a.notes) expect(labelSemis(x.degreeLabel)).toBe(mod12(x.pitchClass - pcOfName(odd)));
      }
    }
  });

  it('works in every tuning (W10-11): Drop D Open position uses the low D string', () => {
    const pos = getGuitarPosition(toNote('D'), 'major', 0, getTuningById('drop-d'));
    expect(pos.notes.find((x) => x.stringIndex === 0 && x.fret === 0)?.degreeLabel).toBe('1');
  });

  it('degree labels follow the engine spelling (letter-aware) and the ♭3 style', () => {
    expect(scaleDegreeLabel(toNote('C'), toNote('Eb'))).toBe('b3');
    expect(scaleDegreeLabel(toNote('C'), toNote('F#'))).toBe('#4');
    expect(scaleDegreeLabel(toNote('C'), toNote('Gb'))).toBe('b5');
    expect(scaleDegreeLabel(toNote('A'), toNote('G#'))).toBe('7');
    expect(scaleDegreeLabel(toNote('C'), toNote('C'))).toBe('1');
  });
});

describe('default position', () => {
  const std = getTuningById('standard');
  it('is the lowest position holding the root, un-stretched, on the 6th or 5th string', () => {
    expect(suggestGuitarPosition(toNote('C'), 'major', std)).toBe(0); // 5th string fret 3
    expect(suggestGuitarPosition(toNote('G'), 'major', std)).toBe(0); // 6th string fret 3
    expect(suggestGuitarPosition(toNote('A'), 'natural_minor', std)).toBe(0); // open 5th string
    expect(suggestGuitarPosition(toNote('D'), 'major', std)).toBe(2); // 5th string fret 5
    expect(suggestGuitarPosition(toNote('Eb'), 'major', std)).toBe(3); // 5th string fret 6
  });
  it('the suggestion always contains the root on string 6 or 5, in every tuning', () => {
    for (const tuning of GUITAR_TUNINGS) {
      for (const scaleType of SCALE_TYPES) {
        for (const r of ROOTS) {
          const n = suggestGuitarPosition(toNote(r), scaleType, tuning);
          const pos = getGuitarPosition(toNote(r), scaleType, n, tuning);
          expect(pos.notes.some((x) => x.stringIndex <= 1 && x.isRoot && !x.isStretch)).toBe(true);
          for (let lower = 0; lower < n; lower++) {
            const p = getGuitarPosition(toNote(r), scaleType, lower, tuning);
            expect(p.notes.some((x) => x.stringIndex <= 1 && x.isRoot && !x.isStretch)).toBe(false);
          }
        }
      }
    }
  });
});

describe('labels and keys', () => {
  it('Roman numerals I-XII', () => {
    expect(POSITION_NUMBERS.slice(1).map(toRomanNumeral)).toEqual(
      ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'],
    );
  });
  it('fingering keys are shape-relative: the same shape moved up the neck shares a key; a different note does not', () => {
    // C major in V and D major in VII are the same shape two frets higher.
    const c = fingeringKey('major', 'standard', 5, 0, 2, 9);
    const d = fingeringKey('major', 'standard', 7, 2, 2, 11);
    expect(c).toBe(d);
    // Same position, different key: the 6th string fret 5 is a different note of a different shape.
    expect(fingeringKey('major', 'standard', 5, 0, 0, 5)).not.toBe(fingeringKey('major', 'standard', 5, 2, 0, 7));
    // Open position is not movable: keyed by root.
    expect(fingeringKey('major', 'standard', 0, 0, 1, 3)).not.toBe(fingeringKey('major', 'standard', 0, 2, 1, 5));
    // Tuning and scale type separate keys.
    expect(fingeringKey('major', 'drop-d', 5, 0, 2, 9)).not.toBe(c);
    expect(fingeringKey('dorian', 'standard', 5, 0, 2, 9)).not.toBe(c);
  });
});
