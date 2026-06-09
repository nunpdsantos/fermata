/**
 * WS6 — the Try-This pipeline contract.
 *
 * Every tryThisQuery the curriculum ships must execute to a real action
 * (chord/scale/key/circle), never the silent fallback, and chord queries must
 * leave the chord SELECTED (the old executor set the chord and then setView
 * wiped it — the order bug that made ~50 Try-This buttons do nothing).
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { executeTheoryQuery } from '../queryExecutor';
import { useAppStore } from '../../state/store';
import type { CurriculumUnit } from '../../core/types/curriculum';

import { L1_UNITS } from '../../core/constants/curriculumL1';
import { L2_UNITS } from '../../core/constants/curriculumL2';
import { L3_UNITS } from '../../core/constants/curriculumL3';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L5_UNITS } from '../../core/constants/curriculumL5';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';

function allTryThisQueries(): string[] {
  const units: CurriculumUnit[] = [
    ...L1_UNITS, ...L2_UNITS, ...L3_UNITS, ...L4_UNITS, ...L5_UNITS,
    ...L6_UNITS, ...L7_UNITS, ...L8_UNITS, ...L9_UNITS,
  ];
  const queries = new Set<string>();
  for (const unit of units) {
    for (const mod of unit.modules) {
      for (const concept of mod.concepts) {
        if (concept.tryThisQuery) queries.add(concept.tryThisQuery);
      }
    }
  }
  return [...queries];
}

describe('executeTheoryQuery', () => {
  beforeEach(() => {
    const s = useAppStore.getState();
    s.setView('learn');
    useAppStore.setState({ selectedChord: null });
  });

  it('selects the chord for a plain chord symbol (order bug regression)', () => {
    const result = executeTheoryQuery('G7');
    expect(result).toBe('chord');
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedChord?.quality).toBe('dominant7');
    expect(s.selectedChord?.root.natural).toBe('G');
  });

  it('handles word-form chord queries', () => {
    expect(executeTheoryQuery('C major chord')).toBe('chord');
    expect(useAppStore.getState().selectedChord?.quality).toBe('major');
  });

  it('handles qualities the old regex missed (C7alt, m7b5, dim7, 13)', () => {
    expect(executeTheoryQuery('C7alt')).toBe('chord');
    expect(useAppStore.getState().selectedChord?.quality).toBe('dominant7alt');
    expect(executeTheoryQuery('Bm7b5')).toBe('chord');
    expect(executeTheoryQuery('C#dim7')).toBe('chord');
    expect(executeTheoryQuery('G13')).toBe('chord');
  });

  it('handles slash chords, keeping the bass note', () => {
    expect(executeTheoryQuery('C/E')).toBe('chord');
    const chord = useAppStore.getState().selectedChord;
    expect(chord?.bassNote?.natural).toBe('E');
  });

  it('handles scale queries including exotic ones', () => {
    expect(executeTheoryQuery('D dorian')).toBe('scale');
    expect(useAppStore.getState().selectedScale).toBe('dorian');
    expect(executeTheoryQuery('C lydian dominant')).toBe('scale');
    expect(useAppStore.getState().selectedScale).toBe('lydian_dominant');
    expect(executeTheoryQuery('C altered scale')).toBe('scale');
    expect(useAppStore.getState().selectedScale).toBe('altered');
  });

  it('handles rootless scale names by keeping the current key', () => {
    useAppStore.getState().setKey({ natural: 'D', accidental: '' });
    expect(executeTheoryQuery('blues scale')).toBe('scale');
    const s = useAppStore.getState();
    expect(s.selectedScale).toBe('blues');
    expect(s.selectedKey.natural).toBe('D');
  });

  it('handles "key of A minor"', () => {
    expect(executeTheoryQuery('key of A minor')).toBe('key');
    const s = useAppStore.getState();
    expect(s.selectedKey.natural).toBe('A');
    expect(s.selectedScale).toBe('natural_minor');
  });

  it('executes EVERY curriculum tryThisQuery without falling through', () => {
    const failures: string[] = [];
    for (const q of allTryThisQueries()) {
      const result = executeTheoryQuery(q);
      if (result === 'fallback') failures.push(q);
      if (result === 'chord' && !useAppStore.getState().selectedChord) {
        failures.push(`${q} (chord wiped)`);
      }
    }
    expect(failures, `unhandled tryThisQuery values:\n${failures.join('\n')}`).toEqual([]);
  });
});
