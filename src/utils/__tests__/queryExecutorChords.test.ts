/**
 * Wave 2: the chord-list form of a Try This query, `chords: G C D Em`.
 * Parsed by the app's own chord parser (every symbol whole, at least two);
 * executing it asks Explore for its Progression panel with exactly those
 * chords, in order (`requestProgression`, the progression branch's contract)
 * and shows Explore. Search and the lesson instrument are unchanged: the
 * one-object resolver does not read it.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { parseChordListQuery, lessonInstrumentQuery, chordListSounds, slashChordInversion, CHORD_LIST_STEP_S } from '../queryExecutorChords';
import { executeTheoryQuery } from '../queryExecutor';
import { resolveTheoryQuery } from '../theoryQuery';
import { clearProgressionRequest, getProgressionRequest } from '../../state/progressionRequest';
import { useAppStore } from '../../state/store';
import { getPitchClass } from '../../core/constants/notes';
import { looksLikeChordSymbol } from '../../core/utils/chordParser';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import { L2_UNITS } from '../../core/constants/curriculumL2';
import { L3_UNITS } from '../../core/constants/curriculumL3';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L5_UNITS } from '../../core/constants/curriculumL5';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';

beforeEach(() => {
  clearProgressionRequest();
  useAppStore.getState().setView('learn');
});

describe('parseChordListQuery', () => {
  it('reads chord symbols in order, with their qualities', () => {
    const list = parseChordListQuery('chords: G C D Em')!;
    expect(list.map((e) => e.symbol)).toEqual(['G', 'C', 'D', 'Em']);
    expect(list.map((e) => e.chord.quality)).toEqual(['major', 'major', 'major', 'minor']);
    const more = parseChordListQuery('  Chords:  A E F#m D7  F#dim Bb ')!;
    expect(more.map((e) => `${e.chord.root.natural}${e.chord.root.accidental} ${e.chord.quality}`)).toEqual(['A major', 'E major', 'F# minor', 'D dominant7', 'F# diminished', 'Bb major']);
  });

  it.each([
    'G C D Em', 'chords:', 'chords: G', 'chords: G Hm', 'chords: G Gx', 'chords: G, C', 'progression: G C', 'key of G', 'C major chord',
  ])('is not a chord list: %s', (q) => {
    expect(parseChordListQuery(q)).toBeNull();
  });

  // Symbols the lenient parser accepts but a chord list must refuse: each must
  // be ONE plain ASCII symbol (lower case, Unicode accidentals, + / - / °
  // shorthands are not authored list forms). Slash chords were refused here
  // too until the audit fixes of 18 November 2026 (A27, A29), which need a
  // bass line: they are read now, below, and only in their plain form.
  it.each(['g', 'em', 'G♯', 'G+', 'G-', 'C°', 'G/b', 'G/f', 'G/B♭', 'G/Bm', 'G/B7'])('refuses the symbol %s', (symbol) => {
    expect(parseChordListQuery(`chords: ${symbol} C`)).toBeNull();
    expect(parseChordListQuery(`chords: C ${symbol}`)).toBeNull();
  });
  it.each(['g', 'em', 'G♯', 'G+', 'G-', 'C°'])('%s is a symbol the chord parser alone would accept', (symbol) => {
    expect(looksLikeChordSymbol(symbol)).toBe(true);
  });

  it('reads a slash chord with its bass: G7/F → C/E, F7 → F#dim7 → C7/G', () => {
    const name = (n?: { natural: string; accidental: string }) => (n ? `${n.natural}${n.accidental}` : '');
    const v42 = parseChordListQuery('chords: G7/F C/E')!;
    expect(v42.map((e) => e.symbol)).toEqual(['G7/F', 'C/E']);
    expect(v42.map((e) => `${name(e.chord.root)} ${e.chord.quality} /${name(e.chord.bassNote)}`)).toEqual(['G dominant7 /F', 'C major /E']);
    const blues = parseChordListQuery('chords: F7 F#dim7 C7/G')!;
    expect(blues.map((e) => `${name(e.chord.root)} ${e.chord.quality} /${name(e.chord.bassNote)}`)).toEqual(['F dominant7 /', 'F# diminished7 /', 'C dominant7 /G']);
    expect(parseChordListQuery('chords: C G/B Am')!.map((e) => name(e.chord.bassNote))).toEqual(['', 'B', '']);
    expect(parseChordListQuery('chords: C Bb/Ab')!.map((e) => name(e.chord.bassNote))).toEqual(['', 'Ab']);
  });

  it('every chord of a list stands on a bass in octave 3: its root, or the note after the slash, lowest', () => {
    const lowest = (q: string) => chordListSounds(parseChordListQuery(q)!).map((s) => {
      const low = [...s.pitches].sort((a, b) => 12 * a.octave + getPitchClass(a) - (12 * b.octave + getPitchClass(b)))[0];
      return `${low.natural}${low.accidental}${low.octave}`;
    });
    expect(lowest('chords: F7 F#dim7 C7/G')).toEqual(['F3', 'F#3', 'G3']);
    expect(lowest('chords: G7/F C/E')).toEqual(['F3', 'E3']);
    // A bass that moves by step across B and C is heard as that step (second
    // audit, round one's known limit closed): B3 → C4, a half step up, where
    // octave 3 alone gave C3, a major 7th down; and down again, C3 → B2.
    expect(lowest('chords: G7/B C')).toEqual(['B3', 'C4']);
    expect(lowest('chords: C G/B')).toEqual(['C3', 'B2']);
    // A leap goes back to octave 3; a step after a step keeps climbing.
    expect(lowest('chords: G Am Bm C D Em')).toEqual(['G3', 'A3', 'B3', 'C4', 'D4', 'E4']);
    expect(lowest('chords: Bm C F')).toEqual(['B3', 'C4', 'F3']);
    // A step is a step down as well as up: up, then back the same way (fix
    // pass, item 2: after a climb a step down fell an octave, D4 → C3).
    expect(lowest('chords: Bm C D C Bm')).toEqual(['B3', 'C4', 'D4', 'C4', 'B3']);
    expect(lowest('chords: C G/B Am G F Em Dm C')).toEqual(['C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2']);
    // The register is bounded: a line may follow its steps from C2 to B4; a
    // step past B4 (or below C2) and every leap come back to octave 3.
    expect(lowest('chords: C Dm Em F G Am Bm C Dm Em F G Am Bm C Dm')).toEqual(
      ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C3', 'D3']);
    expect(lowest('chords: C Bdim Am G F Em Dm C Bdim')).toEqual(['C3', 'B2', 'A2', 'G2', 'F2', 'E2', 'D2', 'C2', 'B3']);
    expect(lowest('chords: C F G C')).toEqual(['C3', 'F3', 'G3', 'C3']);
    // Every chord list the lessons ship: a bass that moves by a half or whole
    // step (pitch classes 1 or 2 apart) is heard as that step — l1u35m3, the
    // track's chords of G in scale order, crossed B–C until the second audit;
    // none may now.
    const midiOf = (p: { octave: number }, pc: number) => 12 * (p.octave + 1) + pc;
    const lists = [L1_UNITS, L2_UNITS, L3_UNITS, L4_UNITS, L5_UNITS, L6_UNITS, L7_UNITS, L8_UNITS, L9_UNITS]
      .flat().flatMap((u) => u.modules).flatMap((m) => m.concepts.map((c) => [m.id, c.tryThisQuery] as const))
      .filter(([, q]) => parseChordListQuery(q) !== null);
    expect(lists.length).toBeGreaterThanOrEqual(24);
    const broken: string[] = [];
    for (const [id, q] of lists) {
      const basses = chordListSounds(parseChordListQuery(q)!).map((s) => Math.min(...s.pitches.map((p) => midiOf(p, getPitchClass(p)))));
      for (let i = 1; i < basses.length; i++) {
        const up = (((basses[i] - basses[i - 1]) % 12) + 12) % 12;
        const step = up <= 2 ? up : up >= 10 ? up - 12 : null;
        if (step !== null && step !== 0 && basses[i] - basses[i - 1] !== step) broken.push(`${id} ${q}: ${basses[i - 1]} → ${basses[i]}`);
      }
    }
    expect(broken).toEqual([]);
    // Root position, as before: open voicing from the root in octave 3.
    expect(chordListSounds(parseChordListQuery('chords: G C')!).map((s) => s.pitches.map((p) => `${p.natural}${p.octave}`).join(' '))).toEqual(['G3 D4 B4', 'C3 G3 E4']);
  });

  it('a slash chord whose bass is one of its tones sounds as that inversion, nothing doubled (second audit, QA P7)', () => {
    const voicing = (q: string) => chordListSounds(parseChordListQuery(q)!).map((s) => s.pitches.map((p) => `${p.natural}${p.accidental}${p.octave}`).join(' '));
    // V4/2 → I6: the 7th F only in the bass, the 3rd E only in the bass (was F3 G4 B4 D5 F5 and E3 C4 E4 G4).
    expect(voicing('chords: G7/F C/E')).toEqual(['F3 G3 B3 D4', 'E3 G3 C4']);
    // F7 → F♯dim7 → C7/G: root position as before, C7/G in second inversion (was G3 C4 E4 G4 B♭4).
    expect(voicing('chords: F7 F#dim7 C7/G')[2]).toBe('G3 Bb3 C4 E4');
    // A bass that is not a chord tone still stands under the whole chord, as before.
    expect(voicing('chords: C C/D')[1]).toBe('D3 D4 C5 E5 G5');
    expect(slashChordInversion(parseChordListQuery('chords: C C/E')![1].chord)).toBe(1);
    expect(slashChordInversion(parseChordListQuery('chords: C C/D')![1].chord)).toBeNull();
    expect(slashChordInversion(parseChordListQuery('chords: C G')![1].chord)).toBeNull();
  });

  it('the one-object resolver (Cmd+K, the lesson instrument) does not read it', () => {
    expect(resolveTheoryQuery('chords: G C D Em')).toBeNull();
    expect(lessonInstrumentQuery('chords: Em C D Em')).toBe('Em');
    expect(lessonInstrumentQuery('G major scale')).toBe('G major scale');
  });

  it('is heard one chord per step, each over its root, in order', () => {
    const sounds = chordListSounds(parseChordListQuery('chords: G7 C')!);
    expect(sounds.map((s) => s.at)).toEqual([0, CHORD_LIST_STEP_S]);
    expect(sounds[0].pitches.map((p) => `${p.natural}${p.accidental}`).sort()).toEqual(['B', 'D', 'F', 'G']);
    expect(getPitchClass(sounds[1].pitches[0])).toBe(0);
  });
});

describe('executeTheoryQuery with a chord list', () => {
  it('asks for the Progression panel with exactly those chords and shows Explore', () => {
    expect(executeTheoryQuery('chords: G D Em C')).toBe('progression');
    expect(getProgressionRequest()).toEqual({ chords: ['G', 'D', 'Em', 'C'] });
    expect(useAppStore.getState().view).toBe('explore');
  });

  it('a one-object query asks for nothing (as before)', () => {
    expect(executeTheoryQuery('G7')).toBe('chord');
    expect(getProgressionRequest()).toBeNull();
  });
});
