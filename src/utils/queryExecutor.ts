/**
 * Executes curriculum "Try This" queries against the app store.
 *
 * Resolution is shared with Cmd+K QuickSearch (`resolveTheoryQuery`), so both
 * entry points accept the same language: all chord symbols (incl. alt, m7b5,
 * slash chords), word forms ("C major chord"), every scale type and mode the
 * parser knows (with or without a trailing "scale"), "key of X", "circle of
 * fifths", and the Portuguese/Spanish phrasings.
 *
 * Order matters: setView('explore') runs FIRST — it clears selectedChord and
 * selectedDegree — and the selection the query names is applied after it.
 *
 * Returns what was executed so callers and tests can detect dead queries.
 */
import { useAppStore } from '../state/store';
import { chordFromParsed } from '../core/utils/chordParser';
import { resolveTheoryQuery, type ResolvedTheoryQuery } from './theoryQuery';

export type TheoryQueryResult = 'chord' | 'scale' | 'key' | 'circle' | 'fallback';

/** Apply a resolved query to the store (no view switch). */
export function applyResolvedTheoryQuery(resolved: ResolvedTheoryQuery): Exclude<TheoryQueryResult, 'fallback'> {
  const store = useAppStore.getState();
  switch (resolved.kind) {
    case 'key':
      store.setKey(resolved.root);
      if (resolved.minor) store.setScale('natural_minor');
      return 'key';
    case 'circle':
      return 'circle'; // Explore renders it; nothing to select
    case 'rootlessScale':
      store.setScale(resolved.scaleType);
      return 'scale';
    case 'scale':
      store.setKey(resolved.root);
      store.setScale(resolved.scaleType);
      return 'scale';
    case 'chord':
      store.setSelectedChord(chordFromParsed(resolved.parsed));
      return 'chord';
  }
}

export function executeTheoryQuery(query: string): TheoryQueryResult {
  // Switch first: setView clears selectedChord/selectedDegree, so every
  // selection below must be applied after it.
  useAppStore.getState().setView('explore');
  const resolved = resolveTheoryQuery(query);
  return resolved ? applyResolvedTheoryQuery(resolved) : 'fallback';
}
