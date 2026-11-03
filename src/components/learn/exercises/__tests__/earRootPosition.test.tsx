/**
 * Audit W4-10 — ear-training chords and progressions sound in root position.
 *
 * The runner used to play every chord tone in octave 4 (`playChord(notes, 4)`),
 * so any chord whose root lies above C wrapped under it: A minor 7 sounded
 * C4 E4 G4 A4 — exactly a root-position C6 — and in a progression V was a 6/4
 * and vi a 6/3, so the lesson's "follow the bass note" gave wrong numerals.
 *
 * Oracle (independent of the app's chord tables): a root's pitch class is its
 * letter's natural pitch class plus its accidental; a major-key numeral's root
 * is the key's pitch class plus the major-scale step of the numeral's degree
 * (I 0, ii 2, iii 4, IV 5, V 7, vi 9, vii 11). The heard bass is the LOWEST
 * MIDI pitch sounded; it must be the root. Checked for every chord and
 * progression the ear templates can generate (every root × quality, every
 * progression set × root) plus every authored ear chord / progression item.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import type { EarTrainingConfig, ExerciseDefinition } from '../../../../core/types/exercise';
import type { PitchedNote } from '../../../../core/types/music';
import { earChordPitches, earProgressionPitches } from '../exerciseHelpers';
import { LEVELS, levelCorpus, templatesFor } from '../../../../data/exercises/__tests__/learnCorpus';

vi.mock('../../../../core/services/audio', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../../core/services/audio')>();
  return {
    ...original,
    resumeAudio: vi.fn().mockResolvedValue(undefined),
    playNote: vi.fn(),
    playChord: vi.fn(),
    playPitchedNotes: vi.fn(),
    playScale: vi.fn(),
    stopPlayback: vi.fn(),
  };
});

import { playChord, playPitchedNotes } from '../../../../core/services/audio';
import { ExerciseRunner } from '../ExerciseRunner';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
const pcOf = (letter: string, acc = '') => (((LETTER_PC[letter] + ACC[acc]) % 12) + 12) % 12;
// The app's PitchedNote octave is the octave of the SOUNDING pitch class
// (MIDI = 12 + 12·octave + pc, pc in 0–11): C♭ in octave 4 sounds B4.
const midiOf = (p: PitchedNote) => 12 + 12 * p.octave + pcOf(p.natural, p.accidental);
const NUMERAL_STEP: Record<string, number> = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11 };
const numeralRootPc = (keyPc: number, numeral: string) =>
  (keyPc + NUMERAL_STEP[numeral.replace(/[°ø+\d]/g, '').toUpperCase()]) % 12;

/** Interval content above the root, independent of the app's chord formulas. */
const QUALITY_PCS: Record<string, number[]> = {
  major: [0, 4, 7], minor: [0, 3, 7], diminished: [0, 3, 6], augmented: [0, 4, 8],
  major7: [0, 4, 7, 11], minor7: [0, 3, 7, 10], dominant7: [0, 4, 7, 10],
  half_diminished7: [0, 3, 6, 10], diminished7: [0, 3, 6, 9], minor_major7: [0, 3, 7, 11],
  augmented_major7: [0, 4, 8, 11], sus2: [0, 2, 7], sus4: [0, 5, 7],
};

const bass = (pitches: PitchedNote[]) => Math.min(...pitches.map(midiOf));
const pcSet = (pitches: PitchedNote[]) => [...new Set(pitches.map((p) => midiOf(p) % 12))].sort((a, b) => a - b);

/** Every ear chord / progression config the templates can produce, plus authored ones. */
function earConfigs(mode: 'chord' | 'progression'): { id: string; cfg: EarTrainingConfig }[] {
  const out: { id: string; cfg: EarTrainingConfig }[] = [];
  for (const n of LEVELS) {
    for (const item of levelCorpus(n, 'en')) {
      const c = item.exercise.config;
      if (c.type === 'ear_training' && c.mode === mode && item.source === 'authored') out.push({ id: item.exercise.id, cfg: c });
    }
    for (const mc of templatesFor(n, 'en')) {
      mc.templates.forEach((t, ti) => {
        if (t.type !== 'ear_training' || t.params.earMode !== mode) return;
        const roots = t.params.roots ?? ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const accs = t.params.accidentals ?? roots.map(() => '');
        roots.forEach((r, ri) => {
          if (mode === 'chord') {
            for (const quality of t.params.chordQualities ?? []) {
              out.push({ id: `${mc.moduleId}[${ti}] ${r}${accs[ri]} ${quality}`, cfg: { type: 'ear_training', mode, chordRoot: r, chordRootAccidental: accs[ri], quality } });
            }
          } else {
            for (const progression of t.params.progressionSets ?? []) {
              out.push({ id: `${mc.moduleId}[${ti}] ${r}${accs[ri]} ${progression.join('-')}`, cfg: { type: 'ear_training', mode, root: r, rootAccidental: accs[ri], progression } });
            }
          }
        });
      });
    }
  }
  return out;
}

describe('ear-training chords sound in root position (W4-10)', () => {
  const chords = earConfigs('chord');

  it('covers the template space and the authored items', () => {
    expect(chords.length).toBeGreaterThan(80);
    expect(chords.some((c) => !c.id.includes('['))).toBe(true);
  });

  it('every chord: the heard bass is the root, and the notes are the chord', () => {
    const bad: string[] = [];
    for (const { id, cfg } of chords) {
      const pitches = earChordPitches(cfg);
      const rootPc = pcOf(cfg.chordRoot!, cfg.chordRootAccidental ?? '');
      const expected = QUALITY_PCS[cfg.quality!].map((i) => (rootPc + i) % 12).sort((a, b) => a - b);
      if (bass(pitches) % 12 !== rootPc) bad.push(`${id}: bass ${bass(pitches) % 12} ≠ root ${rootPc}`);
      if (JSON.stringify(pcSet(pitches)) !== JSON.stringify(expected)) bad.push(`${id}: notes ${pcSet(pitches)} ≠ ${expected}`);
    }
    expect(bad).toEqual([]);
  });
});

describe('ear-training progressions have the root as a clear bass (W4-10)', () => {
  const progressions = earConfigs('progression');

  it('covers the template space', () => {
    expect(progressions.length).toBeGreaterThanOrEqual(8);
  });

  it('every chord of every progression: the heard bass is the numeral\'s root', () => {
    const bad: string[] = [];
    for (const { id, cfg } of progressions) {
      const keyPc = pcOf(cfg.root ?? 'C', cfg.rootAccidental ?? '');
      const voiced = earProgressionPitches(cfg);
      cfg.progression!.forEach((numeral, i) => {
        const heard = voiced[i];
        if (!heard?.length) { bad.push(`${id}: ${numeral} not played`); return; }
        const want = numeralRootPc(keyPc, numeral);
        if (bass(heard) % 12 !== want) bad.push(`${id}: ${numeral} bass ${bass(heard) % 12} ≠ root ${want}`);
        // The bass is alone at the bottom: nothing else within a 3rd of it.
        const rest = heard.map(midiOf).filter((m) => m !== bass(heard));
        if (rest.some((m) => m - bass(heard) < 5)) bad.push(`${id}: ${numeral} bass not clear`);
      });
    }
    expect(bad).toEqual([]);
  });
});

describe('the runner plays exactly those pitches (W4-10)', () => {
  const tick = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });
  const run = (exercise: ExerciseDefinition) =>
    render(<ExerciseRunner exercises={[exercise]} accentColor="#8b5cf6" onRecordResult={vi.fn()} onComplete={vi.fn()} />);

  it('a chord item (A minor 7) sounds A C E G with A in the bass', async () => {
    vi.useFakeTimers();
    try {
      const cfg: EarTrainingConfig = { type: 'ear_training', mode: 'chord', chordRoot: 'A', chordRootAccidental: '', quality: 'minor7', choices: [{ label: 'Minor 7', correct: true }, { label: 'Major 6', correct: false }] };
      run({ id: 'w410c', type: 'ear_training', prompt: 'Listen.', config: cfg });
      await tick(400);
      expect(playChord).not.toHaveBeenCalled();
      expect(playPitchedNotes).toHaveBeenCalledTimes(1);
      const heard = vi.mocked(playPitchedNotes).mock.calls[0][0];
      expect(bass(heard) % 12).toBe(9);
      expect(pcSet(heard)).toEqual([0, 4, 7, 9]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('a progression item (I-V-vi-IV in C) has the bass line C G A F', async () => {
    vi.useFakeTimers();
    try {
      const cfg: EarTrainingConfig = { type: 'ear_training', mode: 'progression', root: 'C', rootAccidental: '', progression: ['I', 'V', 'vi', 'IV'], choices: [{ label: 'I - V - vi - IV', correct: true }, { label: 'I - IV - V - I', correct: false }] };
      run({ id: 'w410p', type: 'ear_training', prompt: 'Listen.', config: cfg });
      await tick(300 + 1700 + 4 * 950);
      expect(playChord).not.toHaveBeenCalled();
      const basses = vi.mocked(playPitchedNotes).mock.calls.map((c) => bass(c[0]) % 12);
      // The key chord first (D-11, its bass the tonic), then the progression.
      expect(basses).toEqual([0, 0, 7, 9, 5]);
    } finally {
      vi.useRealTimers();
    }
  });
});
