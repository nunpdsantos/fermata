/**
 * Ear-training intervals sound exactly their size (W4-18 follow-up).
 *
 * The runner computed the target octave by adding at most one octave, so an
 * interval reaching two octaves above the root's C (a compound 11th from G,
 * say) sounded an octave low, and C♭/B♯ roots were read a semitone off. The
 * pitches now come from MIDI arithmetic. Oracle: MIDI = 12 + 12·octave + pc
 * (the app's octave convention), pc from letter + accidental; the played
 * distance must equal the config's size in its direction — for every ear
 * interval the templates can generate (every root × interval × direction ×
 * octave) and every authored one.
 */
import { describe, it, expect } from 'vitest';
import type { EarTrainingConfig } from '../../../../core/types/exercise';
import type { PitchedNote } from '../../../../core/types/music';
import { earIntervalPitches } from '../exerciseHelpers';
import { LEVELS, levelCorpus, templatesFor } from '../../../../data/exercises/__tests__/learnCorpus';

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, b: -1, '##': 2, bb: -2 };
const midi = (p: PitchedNote) => 12 + 12 * p.octave + ((((LETTER_PC[p.natural] + ACC[p.accidental]) % 12) + 12) % 12);

function space(): { id: string; cfg: EarTrainingConfig }[] {
  const out: { id: string; cfg: EarTrainingConfig }[] = [];
  for (const n of LEVELS) {
    for (const item of levelCorpus(n, 'en')) {
      const c = item.exercise.config;
      if (c.type === 'ear_training' && c.mode === 'interval' && item.source === 'authored') out.push({ id: item.exercise.id, cfg: c });
    }
    for (const mc of templatesFor(n, 'en')) {
      for (const t of mc.templates) {
        const p = t.params;
        if (t.type !== 'ear_training' || p.earMode !== 'interval') continue;
        (p.roots ?? []).forEach((r, ri) => {
          for (const s of p.intervals ?? [3, 4, 5, 7]) for (const direction of p.directions ?? ['ascending']) for (const octave of p.octaves ?? [4]) {
            out.push({ id: `${mc.moduleId} ${r}${p.accidentals?.[ri] ?? ''}${octave} ${direction} ${s}`, cfg: { type: 'ear_training', mode: 'interval', root: r, rootAccidental: p.accidentals?.[ri] ?? '', rootOctave: octave, targetSemitones: s, direction } });
          }
        });
      }
    }
  }
  return out;
}

describe('ear intervals sound their exact size', () => {
  const all = space();

  it('covers the template space, compound intervals included', () => {
    expect(all.length).toBeGreaterThan(300);
    expect(all.some(({ cfg }) => (cfg.targetSemitones ?? 0) > 12)).toBe(true);
  });

  it('every interval: played distance = size in its direction, root as written', () => {
    const bad: string[] = [];
    for (const { id, cfg } of all) {
      const [root, target] = earIntervalPitches(cfg)!;
      const want = cfg.direction === 'descending' ? -cfg.targetSemitones! : cfg.targetSemitones!;
      if (midi(target) - midi(root) !== want) bad.push(`${id}: played ${midi(target) - midi(root)}`);
      if (`${root.natural}${root.accidental}` !== `${cfg.root}${cfg.rootAccidental}`) bad.push(`${id}: root ${root.natural}${root.accidental}`);
    }
    expect(bad).toEqual([]);
  });

  it('two octaves and odd spellings: G4 up a perfect 11th is C6; C♭4 up a minor 2nd is C5', () => {
    const [, t1] = earIntervalPitches({ type: 'ear_training', mode: 'interval', root: 'G', rootAccidental: '', rootOctave: 4, targetSemitones: 17, direction: 'ascending' })!;
    expect(midi(t1)).toBe(12 + 12 * 6 + 0);
    const [r2, t2] = earIntervalPitches({ type: 'ear_training', mode: 'interval', root: 'C', rootAccidental: 'b', rootOctave: 4, targetSemitones: 1, direction: 'ascending' })!;
    expect(midi(t2) - midi(r2)).toBe(1);
  });
});
