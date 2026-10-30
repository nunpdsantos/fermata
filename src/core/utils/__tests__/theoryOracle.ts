/**
 * Independent music-theory oracle for the spelling tests (audit W1/W2).
 *
 * Imports NOTHING from the app. Scales come from step patterns and rotations
 * (major / melodic minor / harmonic minor modes) or from explicit textbook
 * degree formulas; notes are spelled one letter per degree; key signatures are
 * counted from the spelled major scale; triads are stacked from the scale.
 * Ported from the 2026-10-30 audit's Track A oracle (A-instruments/oracle.ts).
 */

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
export const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export const ACC_OFFSET: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
export const mod12 = (n: number) => ((n % 12) + 12) % 12;

export function pcOf(name: string): number {
  const m = /^([A-G])(##|#|bb|b)?$/.exec(name);
  if (!m) throw new Error('bad note ' + name);
  return mod12(LETTER_PC[m[1]] + ACC_OFFSET[m[2] ?? '']);
}

export function accMarks(name: string): number {
  return Math.abs(ACC_OFFSET[name.slice(1)] ?? 0);
}

function stepsToSemis(steps: number[]): number[] {
  const out = [0];
  for (let i = 0; i < steps.length - 1; i++) out.push(out[i] + steps[i]);
  return out;
}
const rotate = (s: number[], k: number) => [...s.slice(k), ...s.slice(0, k)];
const MAJOR_STEPS = [2, 2, 1, 2, 2, 2, 1];
const MEL_STEPS = [2, 1, 2, 2, 2, 2, 1];
const HARM_STEPS = [2, 1, 2, 2, 1, 3, 1];
const MAJ = stepsToSemis(MAJOR_STEPS);
const mode = (steps: number[], k: number) => stepsToSemis(rotate(steps, k));

export interface OracleScale { semis: number[]; degrees: string[] }

function fromSemis7(semis: number[]): OracleScale {
  const degrees = semis.map((s, i) => {
    const d = s - MAJ[i];
    const acc = d === 0 ? '' : d === -1 ? 'b' : d === -2 ? 'bb' : d === 1 ? '#' : d === 2 ? '##' : '?';
    return acc + String(i + 1);
  });
  return { semis, degrees };
}
function fromDegrees(degrees: string[]): OracleScale {
  const semis = degrees.map((d) => {
    const m = /^(bb|b|##|#)?(\d+)$/.exec(d)!;
    return MAJ[Number(m[2]) - 1] + ACC_OFFSET[m[1] ?? ''];
  });
  return { semis, degrees };
}

/** Heptatonic and fixed-convention scales: exact expected degree formulas. */
export const ORACLE_SCALES: Record<string, OracleScale> = {
  major: fromSemis7(mode(MAJOR_STEPS, 0)),
  dorian: fromSemis7(mode(MAJOR_STEPS, 1)),
  phrygian: fromSemis7(mode(MAJOR_STEPS, 2)),
  lydian: fromSemis7(mode(MAJOR_STEPS, 3)),
  mixolydian: fromSemis7(mode(MAJOR_STEPS, 4)),
  natural_minor: fromSemis7(mode(MAJOR_STEPS, 5)),
  locrian: fromSemis7(mode(MAJOR_STEPS, 6)),
  melodic_minor: fromSemis7(mode(MEL_STEPS, 0)),
  dorian_b2: fromSemis7(mode(MEL_STEPS, 1)),
  lydian_augmented: fromSemis7(mode(MEL_STEPS, 2)),
  lydian_dominant: fromSemis7(mode(MEL_STEPS, 3)),
  mixolydian_b6: fromSemis7(mode(MEL_STEPS, 4)),
  locrian_natural2: fromSemis7(mode(MEL_STEPS, 5)),
  altered: fromSemis7(mode(MEL_STEPS, 6)),
  harmonic_minor: fromSemis7(mode(HARM_STEPS, 0)),
  phrygian_dominant: fromSemis7(mode(HARM_STEPS, 4)),
  hungarian_minor: fromDegrees(['1', '2', 'b3', '#4', '5', 'b6', '7']),
  hungarian_major: fromDegrees(['1', '#2', '3', '#4', '5', '6', 'b7']),
  double_harmonic: fromDegrees(['1', 'b2', '3', '4', '5', 'b6', '7']),
  persian: fromDegrees(['1', 'b2', '3', '4', 'b5', 'b6', '7']),
  neapolitan_minor: fromDegrees(['1', 'b2', 'b3', '4', '5', 'b6', '7']),
  neapolitan_major: fromDegrees(['1', 'b2', 'b3', '4', '5', '6', '7']),
  pentatonic_major: fromDegrees(['1', '2', '3', '5', '6']),
  pentatonic_minor: fromDegrees(['1', 'b3', '4', '5', 'b7']),
  blues: fromDegrees(['1', 'b3', '4', 'b5', '5', 'b7']), // D-13: blue note = flat five
  major_blues: fromDegrees(['1', '2', 'b3', '3', '5', '6']),
  hirajoshi: fromDegrees(['1', '2', 'b3', '5', 'b6']),
  in_sen: fromDegrees(['1', 'b2', '4', '5', 'b7']),
  iwato: fromDegrees(['1', 'b2', '4', 'b5', 'b7']),
  egyptian: fromDegrees(['1', '2', '4', '5', 'b7']),
  // Bebop (parent mode + one chromatic passing tone; bebop major's is #5 —
  // Wikipedia "Bebop scale", accessed 2026-10-30).
  bebop_dominant: fromDegrees(['1', '2', '3', '4', '5', '6', 'b7', '7']),
  bebop_major: fromDegrees(['1', '2', '3', '4', '5', '#5', '6', '7']),
  bebop_dorian: fromDegrees(['1', '2', 'b3', '3', '4', '5', '6', 'b7']),
};

/**
 * Symmetric scales: their spelling is a convention, so the oracle lists, per
 * position, every conventional degree name; the app must pick one of them.
 */
export const ORACLE_SYMMETRIC: Record<string, { semis: number[]; options: string[][] }> = {
  whole_tone: { semis: [0, 2, 4, 6, 8, 10], options: [['1'], ['2'], ['3'], ['#4', 'b5'], ['#5', 'b6'], ['b7', '#6']] },
  diminished_whole_half: { semis: [0, 2, 3, 5, 6, 8, 9, 11], options: [['1'], ['2'], ['b3'], ['4'], ['b5', '#4'], ['b6', '#5'], ['6'], ['7']] },
  diminished_half_whole: { semis: [0, 1, 3, 4, 6, 7, 9, 10], options: [['1'], ['b2'], ['#2', 'b3'], ['3'], ['#4', 'b5'], ['5'], ['6'], ['b7']] },
  chromatic: {
    semis: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    options: [['1'], ['#1', 'b2'], ['2'], ['#2', 'b3'], ['3'], ['4'], ['#4', 'b5'], ['5'], ['#5', 'b6'], ['6'], ['#6', 'b7'], ['7']],
  },
};

/** Spell a degree on a root: letter = root letter + (number − 1); null beyond a double accidental. */
export function spellDegree(root: string, degree: string): string | null {
  const m = /^(bb|b|##|#)?(\d+)$/.exec(degree)!;
  const num = Number(m[2]);
  const semis = MAJ[(num - 1) % 7] + ACC_OFFSET[m[1] ?? ''];
  const letter = LETTERS[(LETTERS.indexOf(root[0] as (typeof LETTERS)[number]) + num - 1) % 7];
  const diff = mod12(pcOf(root) + semis - LETTER_PC[letter]);
  const acc = diff === 0 ? '' : diff === 1 ? '#' : diff === 2 ? '##' : diff === 11 ? 'b' : diff === 10 ? 'bb' : null;
  return acc === null ? null : letter + acc;
}

/** Degree number implied by the letter distance from root to note (1–7). */
export function letterDegree(root: string, note: string): number {
  return ((LETTERS.indexOf(note[0] as (typeof LETTERS)[number]) - LETTERS.indexOf(root[0] as (typeof LETTERS)[number]) + 7) % 7) + 1;
}

/** MIDI with the octave belonging to the LETTER (scientific pitch: B♯3 = C4, C♭4 = B3). */
export function midiOf(name: string, octave: number): number {
  const m = /^([A-G])(##|#|bb|b)?$/.exec(name)!;
  return 12 * (octave + 1) + LETTER_PC[m[1]] + ACC_OFFSET[m[2] ?? ''];
}

/** Major key signature counted from the spelled major scale (a double flat counts 2). */
export function majorKeySignature(tonic: string): { count: number; type: '#' | 'b' | ''; accs: Record<string, string> } {
  const notes = ORACLE_SCALES.major.degrees.map((d) => spellDegree(tonic, d)!);
  const accs: Record<string, string> = {};
  let count = 0;
  let type: '#' | 'b' | '' = '';
  for (const n of notes) {
    if (n.length === 1) continue;
    accs[n[0]] = n.slice(1);
    count += n.length - 1;
    type = n.includes('#') ? '#' : 'b';
  }
  return { count, type, accs };
}

/** Parent-major rule per scale type (conventional signature); absent = no standard signature. */
export const PARENT_RULE: Record<string, string | undefined> = {
  major: '1', pentatonic_major: '1', major_blues: '1',
  natural_minor: 'b3', harmonic_minor: 'b3', melodic_minor: 'b3', pentatonic_minor: 'b3', blues: 'b3',
  dorian: 'b7', phrygian: 'b6', lydian: '5', mixolydian: '4', locrian: 'b2',
};

/** Stacked-thirds triad quality on each degree of a heptatonic scale ('M','m','d','A', or null). */
export function stackedTriads(semis: number[]): (string | null)[] {
  return semis.map((s, i) => {
    const t = mod12(semis[(i + 2) % 7] - s);
    const f = mod12(semis[(i + 4) % 7] - s);
    if (t === 4 && f === 7) return 'M';
    if (t === 3 && f === 7) return 'm';
    if (t === 3 && f === 6) return 'd';
    if (t === 4 && f === 8) return 'A';
    return null;
  });
}

/** Roman numeral for a stacked triad on degree i (0-based), optionally prefixed by its alteration. */
export function oracleNumeral(i: number, quality: string, prefix = ''): string {
  const R = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][i];
  if (quality === 'M') return prefix + R;
  if (quality === 'm') return prefix + R.toLowerCase();
  if (quality === 'd') return prefix + R.toLowerCase() + '°';
  return prefix + R + '+';
}

/** Every root the key picker can select (12 historical labels + the respelled alternatives). */
export const SELECTABLE_ROOTS = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'];
