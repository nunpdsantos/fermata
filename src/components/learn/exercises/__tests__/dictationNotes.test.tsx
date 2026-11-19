/**
 * Second audit, finding M57 (Level 9, "Melodic Dictation: Diatonic"): four
 * generated questions said "Listen to this pitch from a stepwise melody" and
 * played middle C, then one isolated note (G5, B4, F4, B5) — no melody to
 * hear the note in. What sounds is kept (the same items, the same scores);
 * the words now say what is heard: one note, after the reference, in English,
 * Portuguese and Spanish — the module's own authored note items' wording.
 *
 * Recorded as earReference.test.tsx records ear items: the real runner and
 * core audio into a fake voice.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import { ExerciseRunner } from '../ExerciseRunner';
import { setInstrumentVoice } from '../../../../core/services/audio';
import { installMockAudioContext } from '../../../../test/mockAudioContext';
import type { EarTrainingConfig, ExerciseDefinition } from '../../../../core/types/exercise';
import { levelCorpus } from '../../../../data/exercises/__tests__/learnCorpus';

const IDS = ['l9u32m1g1', 'l9u32m1g2', 'l9u32m1g3', 'l9u32m1g4'];
const TARGETS = ['G5', 'B4', 'F4', 'B5'];
const MELODY = { en: /melod|stepwise/i, pt: /melodia|graus/i, es: /melod[ií]a|grados/i } as const;

interface Heard { midi: number; at: number }
let heard: Heard[] = [];
const voice = {
  playNote: (midi: number, when: number) => { heard.push({ midi, at: Date.now() + Math.round(when * 1000) }); return true; },
  startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
};
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

const items = (lang: 'en' | 'pt' | 'es') => new Map(levelCorpus(9, lang).map((i) => [i.exercise.id, i.exercise] as const));

describe('M57 — the four dictation notes say what is heard', () => {
  it('each plays middle C, then one note: G5, B4, F4, B5 — and nothing else', async () => {
    const en = items('en');
    const played: string[][] = [];
    for (const id of IDS) {
      const ex = en.get(id)!;
      expect((ex.config as EarTrainingConfig).mode, id).toBe('note');
      heard = [];
      render(<ExerciseRunner exercises={[ex as ExerciseDefinition]} accentColor="#8b5cf6" onRecordResult={() => {}} onComplete={() => {}} />);
      await act(async () => { await vi.advanceTimersByTimeAsync(3000); });
      cleanup();
      played.push(heard.sort((a, b) => a.at - b.at).map((h) => String(h.midi)));
    }
    const midi = (p: string) => 12 * (Number(p[1]) + 1) + { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[p[0] as 'C'];
    expect(played).toEqual(TARGETS.map((t) => ['60', String(midi(t))]));
  });

  it.each(['en', 'pt', 'es'] as const)('%s: the prompt asks for one note, as the module\'s own note items do, and promises no melody', (lang) => {
    const all = items(lang);
    const own = all.get('l9u32m1e1')!.prompt;
    for (const id of IDS) {
      const ex = all.get(id)!;
      expect(ex.prompt, id).toBe(own);
      expect(ex.prompt, id).not.toMatch(MELODY[lang]);
      expect(ex.hint ?? '', id).not.toMatch(/melod/i);
    }
  });
});
