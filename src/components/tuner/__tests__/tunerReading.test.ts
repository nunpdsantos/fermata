/** What the tuner says (brief T): the thresholds, the string it picks, the smoothing. */
import { describe, expect, it } from 'vitest';
import { createSmoother, heardName, pickString, stringMidi, targetFor, tuneState } from '../tunerReading';
import { GUITAR_TUNINGS, TUNING_STANDARD } from '../../../core/constants/guitarTunings';
import { getGuitarPosition, tuningOpenMidi } from '../../../core/utils/guitarPositions';
import { centsFrom, midiToFrequency, nearestNote } from '../../../services/microphone/pitch';
import en from '../../../i18n/tuner/en.json';
import pt from '../../../i18n/tuner/pt.json';
import es from '../../../i18n/tuner/es.json';

const hz = (midi: number, cents = 0) => 440 * Math.pow(2, (midi - 69 + cents / 100) / 12);
const STANDARD = TUNING_STANDARD.strings.map(stringMidi);

describe('tunerReading', () => {
  it('open strings: standard is E2 A2 D3 G3 B3 E4 (MIDI 40 45 50 55 59 64); every tuning gives six notes in rising order', () => {
    expect(STANDARD).toEqual([40, 45, 50, 55, 59, 64]);
    for (const t of GUITAR_TUNINGS) {
      const m = t.strings.map(stringMidi);
      expect(m).toHaveLength(6);
      expect([...m].sort((a, b) => a - b)).toEqual(m);
    }
  });

  it('"100 cents make one half step (on the guitar, one fret)": true on the engine\'s neck in every tuning', () => {
    // The tuner's cents line, checked against the app's own guitar engine
    // (guitarPositions: open-string MIDI + fret) and the detector's cents.
    expect(en.cents).toBe('100 cents make one <term>half step</term> (on the guitar, one fret).');
    expect(pt.cents).toContain('(na guitarra, um traste)');
    expect(es.cents).toContain('(en la guitarra, un traste)');
    for (const t of GUITAR_TUNINGS) {
      expect(tuningOpenMidi(t)).toEqual(t.strings.map(stringMidi));
      const position = getGuitarPosition({ natural: 'C', accidental: '' }, 'chromatic', 5, t);
      expect(position.notes.length).toBeGreaterThan(0);
      for (const n of position.notes) {
        expect(n.midi).toBe(tuningOpenMidi(t)[n.stringIndex] + n.fret);
        // One fret up on the same string: one MIDI step, which is 100 cents.
        expect(centsFrom(midiToFrequency(n.midi + 1), n.midi)).toBeCloseTo(100, 9);
        expect(nearestNote(midiToFrequency(n.midi + 1)).midi - nearestNote(midiToFrequency(n.midi)).midi).toBe(1);
      }
    }
  });

  it('in tune within ±5 cents; flat / sharp to ±50; "much" beyond', () => {
    expect([-5, 0, 5].map(tuneState)).toEqual(['inTune', 'inTune', 'inTune']);
    expect([-5.1, -50, 5.1, 50].map(tuneState)).toEqual(['flat', 'flat', 'sharp', 'sharp']);
    expect([-50.1, -300, 50.1, 300].map(tuneState)).toEqual(['farFlat', 'farFlat', 'farSharp', 'farSharp']);
  });

  it('the nearest string, kept near a midpoint (no flicker)', () => {
    expect(pickString(hz(40, -30), STANDARD, null)).toBe(0);
    expect(pickString(hz(45, 10), STANDARD, null)).toBe(1);
    // Halfway between E2 and A2 (250 cents above E2): stays where it was.
    expect(pickString(hz(42, 60), STANDARD, 0)).toBe(0);
    expect(pickString(hz(42, 60), STANDARD, 1)).toBe(1);
    // Clearly nearer another string: it moves.
    expect(pickString(hz(44), STANDARD, 0)).toBe(1);
    // A string tuned a whole step low still reads as that string (very flat).
    expect(pickString(hz(38), STANDARD, null)).toBe(0);
  });

  it('target: a chosen string, the nearest string, or (no strings) the nearest note', () => {
    expect(targetFor(hz(45), STANDARD, 0, null)).toEqual({ midi: 40, string: 0 });
    expect(targetFor(hz(45), STANDARD, null, null)).toEqual({ midi: 45, string: 1 });
    expect(targetFor(hz(70, 30), null, null, null)).toEqual({ midi: 70, string: null });
  });

  it('smoothing: one stray value is dropped by the median, then it eases', () => {
    const s = createSmoother();
    for (let i = 0; i < 6; i++) s.push(-10);
    expect(s.push(40)).toBeCloseTo(-10, 5);
    s.reset();
    expect(s.value).toBeNull();
  });

  it('a heard note is named with sharps, unless it is the target string, named as the tuning spells it', () => {
    expect(heardName(61, null, null)).toBe('C♯');
    expect(heardName(51, 51, 'E♭')).toBe('E♭');
    expect(heardName(52, 51, 'E♭')).toBe('E');
  });
});
