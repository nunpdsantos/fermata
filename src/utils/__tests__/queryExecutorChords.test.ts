/**
 * Wave 2: the chord-list form of a Try This query, `chords: G C D Em`.
 * Parsed by the app's own chord parser (every symbol whole, at least two);
 * executing it asks Explore for its Progression panel with exactly those
 * chords, in order (`requestProgression`, the progression branch's contract)
 * and shows Explore. Search and the lesson instrument are unchanged: the
 * one-object resolver does not read it.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { parseChordListQuery, lessonInstrumentQuery, chordListSounds, CHORD_LIST_STEP_S } from '../queryExecutorChords';
import { executeTheoryQuery } from '../queryExecutor';
import { resolveTheoryQuery } from '../theoryQuery';
import { clearProgressionRequest, getProgressionRequest } from '../../state/progressionRequest';
import { useAppStore } from '../../state/store';
import { getPitchClass } from '../../core/constants/notes';
import { looksLikeChordSymbol } from '../../core/utils/chordParser';

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
  // be ONE plain ASCII symbol (slash chords, lower case, Unicode accidentals,
  // + / - / ° shorthands are not authored list forms).
  it.each(['G/B', 'g', 'em', 'G♯', 'G+', 'G-', 'C°'])('refuses the symbol %s, which the chord parser alone would accept', (symbol) => {
    expect(looksLikeChordSymbol(symbol)).toBe(true);
    expect(parseChordListQuery(`chords: ${symbol} C`)).toBeNull();
    expect(parseChordListQuery(`chords: C ${symbol}`)).toBeNull();
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
