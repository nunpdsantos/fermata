/**
 * WS6 — "Learn about this" must deep-link to the module that TEACHES the
 * selected chord quality (the fuzzy title search used to send major triads to
 * L9 ear training).
 */
import { describe, it, expect } from 'vitest';
import { QUALITY_TO_MODULE } from '../qualityToModule';
import { MODULE_INDEX } from '../moduleIndex';
import { CHORD_FORMULAS } from '../../core/constants/chords';
import type { ChordQuality } from '../../core/types/music';

describe('QUALITY_TO_MODULE', () => {
  it('covers every chord quality the engine knows', () => {
    for (const quality of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
      expect(QUALITY_TO_MODULE[quality], `missing mapping for ${quality}`).toBeTruthy();
    }
  });

  it('points every mapping at a real module', () => {
    const ids = new Set(MODULE_INDEX.map((m) => m.id));
    for (const [quality, moduleId] of Object.entries(QUALITY_TO_MODULE)) {
      expect(ids.has(moduleId), `${quality} → ${moduleId} does not exist`).toBe(true);
    }
  });

  it('sends the basic qualities to their teaching modules, not ear training', () => {
    expect(QUALITY_TO_MODULE.major).toBe('l1u3m4'); // Your First Chords — Major Triads
    expect(QUALITY_TO_MODULE.minor).toBe('l2u7m3'); // The Four Triad Types
    expect(QUALITY_TO_MODULE.diminished).toBe('l2u7m3');
    expect(QUALITY_TO_MODULE.augmented).toBe('l2u7m3');
    expect(QUALITY_TO_MODULE.major7).toBe('l3u9m1'); // Seventh Chords: The Five Qualities
    expect(QUALITY_TO_MODULE.dominant7).toBe('l4u12m4'); // The Dominant Seventh — Resolution Rules
    expect(QUALITY_TO_MODULE.dominant7alt).toBe('l7u21m2'); // Shell Voicings and Altered Chords
    // No mapping may land in L9 (the ear-training track)
    for (const [quality, moduleId] of Object.entries(QUALITY_TO_MODULE)) {
      expect(moduleId.startsWith('l9'), `${quality} routed to ear training`).toBe(false);
    }
  });
});
