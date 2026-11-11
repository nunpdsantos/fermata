/**
 * chordInKey over EVERY chord quality the app names (final review of wave 2:
 * the textbook tables in chordInKey.test.ts cover about 18 of the 50 rows of
 * QUALITY_NUMERAL; a minor sixth read as major, a minor 11th read as major or
 * a wrong sus2 suffix passed them all).
 *
 * Two independent checks:
 *  - the numeral's CASE is read from the chord's own notes (a minor third and
 *    no major third → lower case), never from the table under test;
 *  - every numeral is written out by hand, for the chord on D in C major (ii),
 *    and for the chord on A in G major (also ii) where the root is not the
 *    key's second letter by accident.
 */
import { describe, it, expect } from 'vitest';
import type { ChordQuality } from '../../../types/music';
import { CHORD_SYMBOLS, buildChord } from '../../../constants/chords';
import { getPitchClass } from '../../../constants/notes';
import { chordInKey } from '../chordInKey';
import { chord, key, note } from './fixtures';

// The chord on the 2nd degree, by quality: [symbol on D, numeral in C major].
// Lower case for a minor-third chord, ° / ø / + marks, then the chord's suffix.
const ON_TWO: Record<ChordQuality, string> = {
  major: 'II',
  minor: 'ii',
  diminished: 'ii°',
  augmented: 'II+',
  major6: 'II6',
  minor6: 'ii6',
  major7: 'IImaj7',
  minor7: 'ii7',
  dominant7: 'II7',
  diminished7: 'ii°7',
  half_diminished7: 'iiø7',
  augmented7: 'II+7',
  sus2: 'IIsus2',
  sus4: 'IIsus4',
  add9: 'IIadd9',
  minor_major7: 'iimaj7',
  power: 'II5',
  dominant7sus4: 'II7sus4',
  major9: 'IImaj9',
  minor9: 'ii9',
  dominant9: 'II9',
  dominant7flat9: 'II7♭9',
  dominant7sharp9: 'II7♯9',
  dominant7flat5: 'II7♭5',
  dominant7sharp5: 'II7♯5',
  dominant7alt: 'II7alt',
  dominant11: 'II11',
  major11: 'IImaj11',
  minor11: 'ii11',
  dominant9sharp11: 'II9♯11',
  dominant7sharp11: 'II7♯11',
  major9sharp11: 'IImaj9♯11',
  dominant13: 'II13',
  major13: 'IImaj13',
  minor13: 'ii13',
  dominant13flat9: 'II13♭9',
  dominant7flat13: 'II7♭13',
  add11: 'IIadd11',
  six_nine: 'II6/9',
  minor_six_nine: 'ii6/9',
  dominant9sus4: 'II9sus4',
  sus2sus4: 'IIsus2sus4',
  augmented_major7: 'II+maj7',
  major7flat5: 'IImaj7♭5',
  diminished_major7: 'ii°maj7',
  major7sharp11: 'IImaj7♯11',
  dominant7sharp5flat9: 'II7♯5♭9',
  dominant7flat5flat9: 'II7♭5♭9',
  dominant7sharp5sharp9: 'II7♯5♯9',
  dominant7flat5sharp9: 'II7♭5♯9',
};

const QUALITIES = Object.keys(CHORD_SYMBOLS) as ChordQuality[];

describe('every chord quality gets its numeral', () => {
  it('the table names every quality the app has', () => {
    expect(Object.keys(ON_TWO).sort()).toEqual([...QUALITIES].sort());
  });

  it.each(QUALITIES)('%s on 2 (D in C major, A in G major)', (quality) => {
    expect(chordInKey(buildChord(note('D'), quality), key('C', 'major')).numeral).toBe(ON_TWO[quality]);
    expect(chordInKey(buildChord(note('A'), quality), key('G', 'major')).numeral).toBe(ON_TWO[quality]);
  });

  it.each(QUALITIES)('%s: the case follows the chord\'s third (lower case = minor third, no major third)', (quality) => {
    const c = buildChord(note('E'), quality);
    const root = getPitchClass(c.root);
    const above = new Set(c.notes.map((n) => (getPitchClass(n) - root + 12) % 12));
    const minorThird = above.has(3) && !above.has(4);
    const numeral = chordInKey(c, key('C', 'major')).numeral;
    expect(numeral.startsWith('iii'), `${quality}: ${numeral}`).toBe(minorThird);
    expect(numeral.startsWith('III'), `${quality}: ${numeral}`).toBe(!minorThird);
  });

  it('typed symbols agree (Am6 in G major is ii6, Dm6 in C is ii6, Cm6 in A minor is iii6)', () => {
    expect(chordInKey(chord('Am6'), key('G', 'major')).numeral).toBe('ii6');
    expect(chordInKey(chord('Dm6'), key('C', 'major')).numeral).toBe('ii6');
    expect(chordInKey(chord('Am6'), key('C', 'major')).numeral).toBe('vi6');
    expect(chordInKey(chord('Cm6'), key('A', 'minor')).numeral).toBe('iii6');
  });
});
