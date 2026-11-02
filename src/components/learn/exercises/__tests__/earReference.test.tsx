/**
 * D-11 / W4-11 / W4-12 / W4-13 — what the ear items actually SOUND, recorded
 * from core audio into a fake instrument voice (the W4a reviewer's method:
 * real core audio, only Web Audio mocked; the voice records every MIDI note
 * and when it starts). Times are absolute on the fake clock: the moment the
 * runner handed the note over plus its scheduled offset.
 *
 *  - every single-note item (L1 + L9, authored and generated): middle C
 *    (MIDI 60) sounds FIRST and alone, then the item's note, later;
 *  - every progression / cadence item: the key's tonic triad (root in the
 *    bass) sounds first, then each chord of the progression;
 *  - every melody item: the tonic chord, then EXACTLY the notes of the option
 *    marked correct (the answer key), in order, one every 0.6 s.
 * Oracle pitches come from letters and accidentals here, not from the app.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act, screen } from '@testing-library/react';
import { ExerciseRunner } from '../ExerciseRunner';
import { setInstrumentVoice } from '../../../../core/services/audio';
import { installMockAudioContext } from '../../../../test/mockAudioContext';
import type { EarTrainingConfig, ExerciseDefinition } from '../../../../core/types/exercise';
import { levelCorpus } from '../../../../data/exercises/__tests__/learnCorpus';
import i18n from '../../../../i18n';

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
/** Written pitch → MIDI (C4 = 60), from the letter, accidental and octave. */
function midiOfWritten(text: string): number {
  const m = /^([A-G])(##|bb|#|b)?(-?\d)$/.exec(text)!;
  return 12 * (Number(m[3]) + 1) + LETTER_PC[m[1]] + ACC[m[2] ?? ''];
}
const MAJOR = [0, 2, 4, 5, 7, 9, 11];
const NUMERAL_DEGREE: Record<string, number> = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };

interface Heard { midi: number; at: number }
let heard: Heard[] = [];
const voice = {
  playNote: (midi: number, when: number) => {
    heard.push({ midi, at: Date.now() + Math.round(when * 1000) });
    return true;
  },
  startNote: () => true,
  stopNote: () => {},
  setVolume: () => {},
  resume: () => Promise.resolve(),
  cancelScheduled: () => {},
};

// The melody options draw staves (VexFlow measures its box).
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(0);
  installMockAudioContext(1);
  heard = [];
  setInstrumentVoice(voice);
});
afterEach(() => {
  cleanup();
  setInstrumentVoice(null);
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

async function sounds(ex: ExerciseDefinition, ms = 8000): Promise<Heard[]> {
  heard = [];
  render(<ExerciseRunner exercises={[ex]} accentColor="#8b5cf6" onRecordResult={() => {}} onComplete={() => {}} />);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
  cleanup();
  return [...heard].sort((a, b) => a.at - b.at || a.midi - b.midi);
}

/** Group notes that start together. */
function onsets(h: Heard[]): { at: number; midis: number[] }[] {
  const out: { at: number; midis: number[] }[] = [];
  for (const n of h) {
    const last = out[out.length - 1];
    if (last && last.at === n.at) last.midis.push(n.midi);
    else out.push({ at: n.at, midis: [n.midi] });
  }
  return out;
}

const earItems = (levels: number[], mode: EarTrainingConfig['mode']) =>
  levels.flatMap((n) => levelCorpus(n, 'en'))
    .map((i) => i.exercise)
    .filter((ex) => ex.config.type === 'ear_training' && ex.config.mode === mode);

describe('a single note is heard against middle C (W4-12)', () => {
  const items = earItems([1, 9], 'note');
  it('covers L1 and L9, authored and generated', () => {
    expect(items.length).toBeGreaterThanOrEqual(15);
    expect(items.some((ex) => ex.id.startsWith('l1u1m2'))).toBe(true);
  });
  it('every item: middle C first, alone (the G above it when the note is a C — never the answer itself); then the item\'s note, 1.3 s later', async () => {
    const bad: string[] = [];
    let cTargets = 0;
    for (const ex of items) {
      const cfg = ex.config as EarTrainingConfig;
      const target = midiOfWritten(`${cfg.note}${cfg.accidental ?? ''}${cfg.octave ?? 4}`);
      const reference = target % 12 === 0 ? 67 : 60;
      if (target % 12 === 0) cTargets++;
      const o = onsets(await sounds(ex, 3000));
      const ok = o.length === 2 && o[0].midis.join() === String(reference) && o[0].midis[0] % 12 !== target % 12 && o[1].midis.join() === String(target) && o[1].at - o[0].at === 1300;
      if (!ok) bad.push(`${ex.id}: ${JSON.stringify(o)}`);
    }
    expect(bad).toEqual([]);
    expect(cTargets).toBeGreaterThanOrEqual(2); // l1u1m2e_ear1, l9u30m1e1 (review)
  });
  it('the line under the prompt says which reference is played (EN, PT, ES)', async () => {
    const said: Record<string, string> = {
      en: 'First you hear the G above middle C (the reference), then the note.',
      pt: 'Primeiro ouves o G acima do C central (a referência) e depois a nota.',
      es: 'Primero oyes el G por encima del C central (la referencia) y después la nota.',
    };
    for (const lang of ['en', 'pt', 'es'] as const) {
      await i18n.changeLanguage(lang);
      for (const id of ['l1u1m2e_ear1', 'l9u30m1e1']) {
        const level = id.startsWith('l1') ? 1 : 9;
        const ex = levelCorpus(level, lang).find((i) => i.exercise.id === id)!.exercise;
        render(<ExerciseRunner exercises={[ex]} accentColor="#8b5cf6" onRecordResult={() => {}} onComplete={() => {}} />);
        expect(screen.getByTestId('ear-reference').textContent).toBe(said[lang]);
        cleanup();
      }
    }
    await i18n.changeLanguage('en');
  });
});

describe('a cadence or progression is heard in its key (W4-11)', () => {
  const items = earItems([9], 'progression');
  it('includes the cadence items of l9u32m3', () => {
    expect(items.filter((ex) => ex.id.startsWith('l9u32m3')).length).toBeGreaterThanOrEqual(3);
  });
  it('every item: the tonic triad first (root in the bass), then each chord with its numeral\'s root in the bass', async () => {
    const bad: string[] = [];
    for (const ex of items) {
      const cfg = ex.config as EarTrainingConfig;
      const keyPc = (LETTER_PC[cfg.root ?? 'C'] + ACC[cfg.rootAccidental ?? '']) % 12;
      const o = onsets(await sounds(ex));
      const tonic = o[0];
      const triad = [...new Set(tonic.midis.map((m) => m % 12))].sort((a, b) => a - b);
      const expectTriad = [keyPc, (keyPc + 4) % 12, (keyPc + 7) % 12].sort((a, b) => a - b);
      const bassOf = (midis: number[]) => Math.min(...midis) % 12;
      const progressionBasses = o.slice(1).map((c) => bassOf(c.midis));
      const expectBasses = cfg.progression!.map((num) => (keyPc + MAJOR[NUMERAL_DEGREE[num.replace(/[°ø+\d]/g, '').toUpperCase()]]) % 12);
      if (JSON.stringify(triad) !== JSON.stringify(expectTriad) || bassOf(tonic.midis) !== keyPc) bad.push(`${ex.id}: reference ${JSON.stringify(tonic)}`);
      if (JSON.stringify(progressionBasses) !== JSON.stringify(expectBasses)) bad.push(`${ex.id}: chords ${progressionBasses} vs ${expectBasses}`);
      if (o[1] && o[1].at - tonic.at !== 1700) bad.push(`${ex.id}: the cadence starts ${o[1].at - tonic.at} ms after the key chord`);
    }
    expect(bad).toEqual([]);
  });
});

describe('melodic dictation plays a melody — the answer key (W4-13)', () => {
  const items = earItems([9], 'melody');
  it('both dictation modules have melody items', () => {
    expect(items.filter((ex) => ex.id.startsWith('l9u32m1')).length).toBeGreaterThanOrEqual(4);
    expect(items.filter((ex) => ex.id.startsWith('l9u32m2')).length).toBeGreaterThanOrEqual(4);
  });
  it('every item: the tonic chord, then exactly the correct option\'s notes, in order, every 0.6 s', async () => {
    const bad: string[] = [];
    for (const ex of items) {
      const cfg = ex.config as EarTrainingConfig;
      const keyPc = (LETTER_PC[cfg.root ?? 'C'] + ACC[cfg.rootAccidental ?? '']) % 12;
      const answer = cfg.melodyChoices!.filter((c) => c.correct);
      if (answer.length !== 1) { bad.push(`${ex.id}: ${answer.length} correct options`); continue; }
      const o = onsets(await sounds(ex));
      const chord = o[0];
      if (Math.min(...chord.midis) % 12 !== keyPc || chord.midis.length !== 3) bad.push(`${ex.id}: reference ${JSON.stringify(chord)}`);
      const melody = o.slice(1);
      const played = melody.map((x) => x.midis.join('+'));
      const expected = answer[0].notes.map((n) => String(midiOfWritten(n)));
      if (played.join(' ') !== expected.join(' ')) bad.push(`${ex.id}: played ${played} ≠ key ${expected}`);
      const gaps = melody.slice(1).map((x, i) => x.at - melody[i].at);
      if (gaps.some((g) => g !== 600) || melody[0]?.at - chord.at !== 1700) bad.push(`${ex.id}: timing ${melody[0]?.at - chord.at} / ${gaps}`);
    }
    expect(bad).toEqual([]);
  });

  it('the options are distinct melodies, one played, drawn as staves with letters (EN and PT)', async () => {
    for (const lang of ['en', 'pt'] as const) {
      await i18n.changeLanguage(lang);
      const ex = levelCorpus(9, lang).find((i) => i.exercise.id === 'l9u32m1e5')!.exercise;
      render(<ExerciseRunner exercises={[ex]} accentColor="#8b5cf6" onRecordResult={() => {}} onComplete={() => {}} />);
      const options = screen.getByTestId('check-answers').querySelectorAll('button');
      expect(options).toHaveLength(3);
      expect([...options].map((b) => b.getAttribute('data-answer'))).toEqual(['A', 'B', 'C']);
      expect(options[0].getAttribute('aria-label')).toMatch(lang === 'en' ? /^Melody A: / : /^Melodia A: /);
      expect(screen.getByTestId('ear-reference').textContent).toBe(
        lang === 'en' ? 'First you hear the key chord (C major), then the melody.' : 'Primeiro ouves o acorde de tónica (C maior) e depois a melodia.',
      );
      cleanup();
    }
    await i18n.changeLanguage('en');
  });
});

describe('the chromatic dictation melodies do what the lesson teaches', () => {
  it('l9u32m1 melodies stay in their major key; every l9u32m2 melody has a note outside the key that moves by half step', () => {
    const bad: string[] = [];
    for (const ex of earItems([9], 'melody')) {
      const cfg = ex.config as EarTrainingConfig;
      const keyPc = (LETTER_PC[cfg.root ?? 'C'] + ACC[cfg.rootAccidental ?? '']) % 12;
      const inKey = (midi: number) => MAJOR.includes((((midi - keyPc) % 12) + 12) % 12);
      for (const opt of cfg.melodyChoices!) {
        const midis = opt.notes.map(midiOfWritten);
        if (ex.id.startsWith('l9u32m1') && !midis.every(inKey)) bad.push(`${ex.id} ${opt.notes.join(' ')}: leaves the key`);
      }
      if (ex.id.startsWith('l9u32m2')) {
        const played = cfg.melodyChoices!.find((c) => c.correct)!.notes.map(midiOfWritten);
        const outside = played.map((m, i) => ({ m, i })).filter(({ m }) => !inKey(m));
        if (outside.length === 0) bad.push(`${ex.id}: no chromatic note`);
        for (const { m, i } of outside) {
          const next = played[i + 1];
          if (next === undefined || Math.abs(next - m) !== 1) bad.push(`${ex.id}: the chromatic note does not resolve by half step`);
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
