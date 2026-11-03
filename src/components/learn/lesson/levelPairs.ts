/**
 * "Pairs with Level n" (decision D-10, audit W4-17): Level 9, the ear-training
 * track, is open from the start, but several of its modules drill material the
 * theory levels teach later (modes and pentatonic / blues / symmetric scales in
 * L7, secondary dominants in L5). A soft badge says which theory level each L9
 * module goes with — nothing is locked.
 *
 * The level is where the curriculum first TEACHES the module's theory (found by
 * reading the lesson texts; levelPairs.test pins the evidence for each).
 */
import { LEVEL_METADATA } from '../../../data/levelMetadata';
import { translateLevelMetadata } from '../../../i18n/content/levelMetaResolver';
import type { ContentLanguage } from '../../../i18n/content/types';

export const L9_PAIRS: Readonly<Record<string, number>> = {
  l9u30m1: 1, // pitch, register, direction — L1 staff and pitch
  l9u30m2: 2, // major vs minor — L2 natural minor, the four triad types
  l9u30m3: 2, // intervals P1–P5 by quality — L2 interval quality
  l9u30m4: 2, // m6–P8 — L2 interval quality
  l9u30m5: 2, // harmonic and compound intervals — L2 compound intervals
  l9u31m1: 2, // major and minor scale forms — L2 harmonic and melodic minor
  l9u31m2: 7, // the church modes — L7 modal harmony (first taught there)
  l9u31m3: 7, // pentatonic, blues, whole-tone, diminished — L7 scales (blues, pentatonic first there)
  l9u31m4: 2, // triad qualities — L2 the four triad types
  l9u31m5: 3, // seventh-chord qualities — L3 seventh chords
  l9u32m1: 2, // diatonic dictation by scale degree — L2 scale degrees
  l9u32m2: 5, // chromatic dictation, secondary leading tones (V/V) — L5 secondary dominants
  l9u32m3: 3, // cadences and progressions — L3 cadences
  l9u32m4: 2, // movable-do in major and minor — L2 minor scales and scale degrees
  l9u32m5: 5, // texture and form by ear — L5 texture, binary / ternary forms
};

export function pairsWithLevel(moduleId: string, lang?: ContentLanguage): { level: number; title?: string } | null {
  const level = L9_PAIRS[moduleId];
  if (!level) return null;
  const meta = LEVEL_METADATA.find((m) => m.number === level);
  const title = meta ? translateLevelMetadata([meta], lang ?? 'en')[0].title : undefined;
  return { level, title };
}
