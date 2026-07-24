/**
 * R-01 guard: the ear-training replay lock must cover the FULL scheduled
 * playback of every mode, so a rapid Replay can never overlap the stimulus.
 * (The old fixed 800 ms release let a second scale/progression start while
 * the first was still sounding.)
 */
import { describe, it, expect } from 'vitest';
import { earPlaybackLockMs } from '../exerciseHelpers';
import type { EarTrainingConfig } from '../../../../core/types/exercise';

const base = { type: 'ear_training' } as const;

describe('earPlaybackLockMs', () => {
  it('covers a single note (1.0 s)', () => {
    const cfg: EarTrainingConfig = { ...base, mode: 'note', note: 'C', accidental: '', octave: 4 };
    expect(earPlaybackLockMs(cfg)).toBeGreaterThanOrEqual(1100);
  });

  it('covers a melodic interval (0.7 s delay + 0.6 s second note)', () => {
    const cfg: EarTrainingConfig = {
      ...base, mode: 'interval', root: 'C', rootAccidental: '', rootOctave: 4,
      targetSemitones: 7, direction: 'ascending',
    };
    expect(earPlaybackLockMs(cfg)).toBeGreaterThanOrEqual(1400);
  });

  it('covers a harmonic interval (1.2 s simultaneous)', () => {
    const cfg: EarTrainingConfig = {
      ...base, mode: 'interval', harmonic: true, root: 'C', rootAccidental: '', rootOctave: 4,
      targetSemitones: 7, direction: 'ascending',
    };
    expect(earPlaybackLockMs(cfg)).toBeGreaterThanOrEqual(1300);
  });

  it('covers a chord (1.2 s)', () => {
    const cfg: EarTrainingConfig = {
      ...base, mode: 'chord', chordRoot: 'C', chordRootAccidental: '', quality: 'major',
      choices: [{ label: 'Major', correct: true }, { label: 'Minor', correct: false }],
    };
    expect(earPlaybackLockMs(cfg)).toBeGreaterThanOrEqual(1300);
  });

  it('covers a full ascending 7-note scale plus octave (~3.2 s)', () => {
    const cfg: EarTrainingConfig = {
      ...base, mode: 'scale', root: 'C', rootAccidental: '', rootOctave: 4, scaleType: 'major',
      choices: [{ label: 'Major', correct: true }, { label: 'Natural minor', correct: false }],
    };
    // 8 notes × 0.4025 s = 3.22 s
    expect(earPlaybackLockMs(cfg)).toBeGreaterThanOrEqual(3220);
  });

  it('scales with note count: pentatonic locks shorter than heptatonic', () => {
    const penta: EarTrainingConfig = {
      ...base, mode: 'scale', root: 'C', rootAccidental: '', rootOctave: 4, scaleType: 'pentatonic_major',
      choices: [{ label: 'Pentatonic major', correct: true }, { label: 'Blues', correct: false }],
    };
    const major: EarTrainingConfig = { ...penta, scaleType: 'major' };
    expect(earPlaybackLockMs(penta)).toBeLessThan(earPlaybackLockMs(major));
    // 6 notes × 0.4025 s = 2.415 s
    expect(earPlaybackLockMs(penta)).toBeGreaterThanOrEqual(2415);
  });

  it('covers a four-chord progression (3 × 0.95 s spacing + final chord)', () => {
    const cfg: EarTrainingConfig = {
      ...base, mode: 'progression', root: 'C', rootAccidental: '',
      progression: ['I', 'IV', 'V', 'I'],
      choices: [{ label: 'I - IV - V - I', correct: true }, { label: 'ii - V - I', correct: false }],
    };
    // 3 × 950 ms + 1200 ms chord tail = 4050 ms
    expect(earPlaybackLockMs(cfg)).toBeGreaterThanOrEqual(4050);
  });

  it('covers a two-chord cadence with less lock than four chords', () => {
    const two: EarTrainingConfig = {
      ...base, mode: 'progression', root: 'C', rootAccidental: '',
      progression: ['V', 'I'],
      choices: [{ label: 'V - I', correct: true }, { label: 'IV - I', correct: false }],
    };
    expect(earPlaybackLockMs(two)).toBeGreaterThanOrEqual(2150);
    expect(earPlaybackLockMs(two)).toBeLessThan(4050);
  });
});
