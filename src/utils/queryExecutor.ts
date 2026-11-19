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
 *
 * A chord list (`chords: G C D Em`, wave 2 — `queryExecutorChords.ts`) asks
 * Explore for its Progression panel with those chords (`requestProgression`,
 * the progression branch's contract) and shows Explore.
 */
import { useAppStore } from '../state/store';
import { chordFromParsed } from '../core/utils/chordParser';
import { resolveTheoryQuery, type ResolvedTheoryQuery } from './theoryQuery';
import { parseChordListQuery } from './queryExecutorChords';
import { selectChordAsWritten } from './chordSelection';
import { requestProgression } from '../state/progressionRequest';

export type TheoryQueryResult = 'chord' | 'scale' | 'key' | 'circle' | 'progression' | 'fallback';

/** Apply a resolved query to the store (no view switch). */
export function applyResolvedTheoryQuery(resolved: ResolvedTheoryQuery): Exclude<TheoryQueryResult, 'fallback' | 'progression'> {
  const store = useAppStore.getState();
  switch (resolved.kind) {
    case 'key':
      // The root AND the scale together (audit A2, 2026-11-18): "key of G
      // major" from A minor used to keep the minor scale. A key named with no
      // quality is major ("key of G" = G major, as the lessons use it), and a
      // minor key is the natural minor (the In key convention).
      store.setKey(resolved.root);
      store.setScale(resolved.minor ? 'natural_minor' : 'major');
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
      // C/E opens as C major, first inversion (utils/chordSelection.ts).
      selectChordAsWritten(chordFromParsed(resolved.parsed));
      return 'chord';
  }
}

export function executeTheoryQuery(query: string): TheoryQueryResult {
  const list = parseChordListQuery(query);
  if (list) {
    // The panel's host (in Explore) reads the request when Explore shows.
    requestProgression({ chords: list.map((e) => e.symbol) });
    useAppStore.getState().setView('explore');
    return 'progression';
  }
  // Switch first: setView clears selectedChord/selectedDegree, so every
  // selection below must be applied after it.
  useAppStore.getState().setView('explore');
  const resolved = resolveTheoryQuery(query);
  return resolved ? applyResolvedTheoryQuery(resolved) : 'fallback';
}
