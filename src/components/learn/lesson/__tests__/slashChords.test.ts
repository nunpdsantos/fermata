/**
 * QA P7 as a class (second audit): every slash chord a lesson opens — a Try
 * This or a task's quoted query — whose bass is one of the chord's own tones
 * is that inversion, and is drawn and played as the lesson's instrument
 * lights it (round one's `selectChordAsWritten`: C/E opens as C major, first
 * inversion; `useKeyContext` lights `chordVoicingPitches` of the inverted
 * notes from the piano's octave, 4): its tones once each, the bass lowest,
 * within two ledger lines of the treble staff. Until then the picture was
 * the root-position chord over a second copy of the bass an octave down —
 * G7/B doubled its leading note, G7/F its 7th, and C/E, F/A, G7/F, Dm7/C
 * hung three ledger lines under the staff. (A bass outside the chord, C/D,
 * is a true slash chord and keeps its bass under the chord; no lesson opens
 * one today.)
 */
import { describe, it, expect } from 'vitest';
import { L1_UNITS } from '../../../../core/constants/curriculumL1';
import { L2_UNITS } from '../../../../core/constants/curriculumL2';
import { L3_UNITS } from '../../../../core/constants/curriculumL3';
import { L4_UNITS } from '../../../../core/constants/curriculumL4';
import { L5_UNITS } from '../../../../core/constants/curriculumL5';
import { L6_UNITS } from '../../../../core/constants/curriculumL6';
import { L7_UNITS } from '../../../../core/constants/curriculumL7';
import { L8_UNITS } from '../../../../core/constants/curriculumL8';
import { L9_UNITS } from '../../../../core/constants/curriculumL9';
import { getPitchClass } from '../../../../core/constants/notes';
import { chordFromParsed } from '../../../../core/utils/chordParser';
import { chordVoicingPitches, getMidiNumber } from '../../../../core/utils/pianoLayout';
import { resolveTheoryQuery, findQuotedQueries } from '../../../../utils/theoryQuery';
import { parseChordListQuery, chordListSounds, slashChordInversion } from '../../../../utils/queryExecutorChords';
import { inversionOfBass } from '../../../../utils/chordSelection';
import { tryThisPicture } from '../tryThisPicture';

const C = { natural: 'C', accidental: '' } as const;
const units = [L1_UNITS, L2_UNITS, L3_UNITS, L4_UNITS, L5_UNITS, L6_UNITS, L7_UNITS, L8_UNITS, L9_UNITS].flat();
const modules = units.flatMap((u) => u.modules);
/** Every place a lesson opens a query: a concept's Try This, a task's quoted query and its own `query`, a unit milestone. */
const places = [
  ...units.flatMap((u) => (u.milestone?.tryThisQuery ? [u.milestone.tryThisQuery] : [])),
  ...modules.flatMap((m) => [
    ...m.concepts.map((c) => c.tryThisQuery),
    ...m.tasks.flatMap((t) => [...findQuotedQueries(t.instruction).map((q) => q.query), ...(t.query ? [t.query] : [])]),
  ]),
];
const queries = [...new Set(places)];
const slash = queries.flatMap((q) => {
  const r = resolveTheoryQuery(q);
  if (r?.kind !== 'chord') return [];
  const chord = chordFromParsed(r.parsed);
  return chord.bassNote ? [[q, chord] as const] : [];
});
const midi = (p: { natural: string; accidental: string; octave: number }) => getMidiNumber(p as never, p.octave);

describe('every slash chord a lesson opens', () => {
  it('the lessons open exactly these fourteen slash chords, at 36 places in 10 lessons and one milestone, every one an inversion', () => {
    expect(slash.map(([q]) => q).sort()).toEqual(['Am/C', 'C/E', 'C/G', 'C7/G', 'Cmaj7/B', 'Cmaj7/E', 'Cmaj7/G', 'Db/F', 'Dm/F', 'Dm7/C', 'F/A', 'G7/B', 'G7/D', 'G7/F']);
    expect(places.filter((q) => slash.some(([s]) => s === q))).toHaveLength(36);
    expect(slash.every(([, c]) => slashChordInversion(c) !== null)).toBe(true);
  });

  it('a bass that is not a chord tone (C/D) stays under the whole chord in a Try This picture, as before', () => {
    const picture = tryThisPicture('C/D', C);
    expect(picture.kind).toBe('chord');
    if (picture.kind !== 'chord') return;
    expect(picture.pitches.map((p) => `${p.natural}${p.accidental}${p.octave}`).join(' ')).toBe('D3 D4 C5 E5 G5');
    expect(picture.bass).toEqual({ natural: 'D', accidental: '' });
  });

  it('a chord the parser built by its own name (Cm(add11)/G) is kept as written, though G is one of its tones — as the instrument keeps it', () => {
    const r = resolveTheoryQuery('Cm(add11)/G');
    expect(r?.kind).toBe('chord');
    if (r?.kind !== 'chord') return;
    const chord = chordFromParsed(r.parsed);
    expect(chord.algorithmicDisplayName).toBeTruthy();
    expect(chord.notes.map(getPitchClass)).toContain(getPitchClass(chord.bassNote!));
    expect(slashChordInversion(chord)).toBeNull();
    expect(inversionOfBass(chord)).toBeNull();
    const picture = tryThisPicture('Cm(add11)/G', C);
    if (picture.kind !== 'chord') throw new Error(picture.kind);
    expect(picture.bass).toEqual({ natural: 'G', accidental: '' });
    expect(getPitchClass(picture.pitches[0])).toBe(getPitchClass(chord.bassNote!));
  });

  it.each(slash.map(([q, c]) => [q, c] as const))('%s', (q, chord) => {
    const picture = tryThisPicture(q, C);
    expect(picture.kind).toBe('chord');
    if (picture.kind !== 'chord') return;
    const pcs = picture.pitches.map(getPitchClass);
    const lowest = picture.pitches.reduce((a, b) => (midi(b) < midi(a) ? b : a));
    // The bass the slash names is the lowest note, whatever the kind.
    expect(getPitchClass(lowest)).toBe(getPitchClass(chord.bassNote!));
    // The same rule as the lesson's instrument, by which it opens an inversion.
    expect(slashChordInversion(chord)).toBe(inversionOfBass(chord) === 0 ? null : inversionOfBass(chord));
    const inversion = slashChordInversion(chord);
    if (inversion === null) return;
    expect(new Set(pcs).size, picture.pitches.map((p) => `${p.natural}${p.accidental}${p.octave}`).join(' ')).toBe(chord.notes.length);
    const rotated = [...chord.notes.slice(inversion), ...chord.notes.slice(0, inversion)];
    expect(picture.pitches).toEqual(chordVoicingPitches(rotated, 4));
    expect(picture.pitches.every((p) => midi(p) >= 57 && midi(p) <= 84), 'within A3–C6').toBe(true);
  });

  it('a chord list sounds each inversion with its tones once, the bass lowest', () => {
    const lists = queries.map(parseChordListQuery).filter((l): l is NonNullable<typeof l> => l !== null);
    let inversions = 0;
    for (const list of lists) {
      chordListSounds(list).forEach((sound, i) => {
        const chord = list[i].chord;
        if (slashChordInversion(chord) === null) return;
        inversions++;
        const pcs = sound.pitches.map(getPitchClass);
        expect(new Set(pcs).size).toBe(chord.notes.length);
        expect(getPitchClass(sound.pitches.reduce((a, b) => (midi(b) < midi(a) ? b : a)))).toBe(getPitchClass(chord.bassNote!));
      });
    }
    expect(inversions).toBeGreaterThanOrEqual(3);
  });
});
