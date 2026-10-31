// QuickSearch result builder — pure(ish) query → ranked results.
//
// Extracted from QuickSearch.tsx so the component file exports only the component
// (react-refresh/only-export-components) and so this ranking logic is directly
// unit-testable. Result `action`s close over the Zustand store getState() at call
// time, so they stay current.

import { useAppStore } from '../../state/store.ts';
import { noteToString, stringToNote, type ScaleType, type ChordQuality } from '../../core/types/music.ts';
import { buildChord, CHORD_QUALITY_NAMES, CHORD_SYMBOLS } from '../../core/constants/chords.ts';
import { SCALE_TYPE_NAMES } from '../../core/constants/scales.ts';
import {
  parseChordSymbol,
  formatParsedChordName,
  chordFromParsed,
  type ParsedChord,
} from '../../core/utils/chordParser.ts';
import { getChordCompletions, parseVerbalChord } from '../../core/utils/chordHints.ts';
import { parseScaleSymbol, formatParsedScaleName } from '../../core/utils/scaleParser.ts';
import { findModulesByQuery } from '../../data/moduleIndex.ts';
import type { LocalizedModuleIndex } from '../../data/moduleIndexI18n.ts';
import { resolveTheoryQuery, isBareSolfege } from '../../utils/theoryQuery.ts';
import { applyResolvedTheoryQuery } from '../../utils/queryExecutor.ts';

export type SearchResultType = 'Scale' | 'Chord' | 'Key' | 'Lesson';

export interface SearchResult {
  type: SearchResultType;
  label: string;
  action: () => void;
}

// Mode names that need mapping to ScaleType
const MODE_TO_SCALE: Record<string, ScaleType> = {
  ionian: 'major',
  aeolian: 'natural_minor',
};

/**
 * Ranked Cmd+K results. `localized` is the Portuguese/Spanish module index
 * (when loaded) so lesson hits match and display in the app language.
 */
export function getResults(query: string, localized?: LocalizedModuleIndex | null): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  // 0. The shared Try-This resolver (W9-01): the exact forms lessons tell the
  //    learner to type — "C major scale", "C major chord", "C whole tone
  //    scale", "key of G", "D natural minor scale" — and their Portuguese and
  //    Spanish phrasings ("escala de C maior", "acorde de Ré menor").
  const resolved = resolveTheoryQuery(q);
  if (resolved?.kind === 'scale') {
    const label = formatParsedScaleName(resolved.parsed);
    const key = `scale:${noteToString(resolved.root)}:${resolved.scaleType}`;
    seen.add(key);
    results.push({ type: 'Scale', label, action: () => { applyResolvedTheoryQuery(resolved); } });
  } else if (resolved?.kind === 'rootlessScale') {
    const key = `scale:fuzzy:${resolved.scaleType}`;
    seen.add(key);
    results.push({
      type: 'Scale',
      label: SCALE_TYPE_NAMES[resolved.scaleType] ?? resolved.scaleType,
      action: () => { applyResolvedTheoryQuery(resolved); },
    });
  } else if (resolved?.kind === 'key') {
    results.push({
      type: 'Key',
      label: `${noteToString(resolved.root)}${resolved.minor ? ' minor' : ''}`,
      action: () => { applyResolvedTheoryQuery(resolved); },
    });
  }
  // (Resolved chords are pushed by the chord block below, so they share its
  //  dedupe and cap.)

  // Try scale parser first (handles all 46 types + modes + aliases)
  const parsedScale = parseScaleSymbol(q);
  if (parsedScale) {
    const label = formatParsedScaleName(parsedScale);
    // Map mode names to ScaleType
    const scaleType = (MODE_TO_SCALE[parsedScale.scaleType] ?? parsedScale.scaleType) as ScaleType;
    const key = `scale:${noteToString(parsedScale.root)}:${scaleType}`;
    if (!seen.has(key)) {
      seen.add(key);
      results.push({
        type: 'Scale',
        label,
        action: () => {
          useAppStore.getState().setKey(parsedScale.root);
          useAppStore.getState().setScale(scaleType);
        },
      });
    }
  }

  // ── Chords ────────────────────────────────────────────────────────────────
  // Ranking: exact parse first, then verbal resolution, then partial-symbol
  // completions (common extensions of the typed stem). Capped at 8 chord results.
  const CHORD_CAP = 8;
  let chordCount = 0;
  const pushChord = (parsed: ParsedChord): boolean => {
    if (chordCount >= CHORD_CAP) return false;
    // formatParsedChordName already includes the root ("C Major", "Cmaj7#9")
    const key = `chord:${noteToString(parsed.root)}:${parsed.quality}:${
      parsed.bassNote ? noteToString(parsed.bassNote) : ''
    }`;
    if (seen.has(key)) return false;
    seen.add(key);
    const chord = chordFromParsed(parsed);
    results.push({
      type: 'Chord',
      label: formatParsedChordName(parsed),
      action: () => {
        useAppStore.getState().setSelectedChord(chord);
      },
    });
    chordCount++;
    return true;
  };

  // 0'. Chord resolved by the shared resolver ("C major chord", "acorde de
  //     Ré menor", "C diminished 7th").
  if (resolved?.kind === 'chord') pushChord(resolved.parsed);

  // A bare solfège syllable ("do", "sol") is a note name: the resolver above
  // already read it (do = C). The raw symbol parsers below would read "do"
  // as D diminished, so they are skipped.
  const bareSolfege = isBareSolfege(q);

  // 1. Exact symbol parse (all 47 qualities + slash chords + algorithmic).
  const parsedChord = bareSolfege ? null : parseChordSymbol(q);
  if (parsedChord) pushChord(parsedChord);

  // 2. Verbal resolution ("c sharp minor seven", "g dominant", "f sharp
  //    diminished seventh") — catches spelled-out numbers / multi-word qualities
  //    the symbol parser deliberately leaves alone.
  const verbalChord = bareSolfege ? null : parseVerbalChord(q);
  if (verbalChord) pushChord(verbalChord);

  // 3. Partial-symbol completions ("Cmaj" → Cmaj7/9/11/13; "C7#" → C7#9/#11/#5;
  //    "Cm" → Cm/Cm7/Cm9/…). Deterministic, commonality-ordered, deduped against
  //    the exact/verbal results above.
  for (const completion of bareSolfege ? [] : getChordCompletions(q, CHORD_CAP)) {
    if (chordCount >= CHORD_CAP) break;
    pushChord(completion.parsed);
  }

  // Fuzzy fallback: substring match on scale type names
  if (results.length < 4) {
    const lower = q.toLowerCase();
    for (const [scaleType, name] of Object.entries(SCALE_TYPE_NAMES)) {
      if (results.length >= 8) break;
      const key = `scale:fuzzy:${scaleType}`;
      if (seen.has(key)) continue;
      if (name.toLowerCase().includes(lower)) {
        seen.add(key);
        results.push({
          type: 'Scale',
          label: name,
          action: () => {
            useAppStore.getState().setScale(scaleType as ScaleType);
          },
        });
      }
    }
  }

  // Fuzzy fallback: substring match on chord quality names — this is how a full
  // quality NAME ("Dominant 7th", "Half-Diminished") resolves to a chord.
  if (results.length < 4) {
    const lower = q.toLowerCase();
    for (const [quality, name] of Object.entries(CHORD_QUALITY_NAMES)) {
      if (results.length >= 8) break;
      const key = `chord:fuzzy:${quality}`;
      if (seen.has(key)) continue;
      if (name.toLowerCase().includes(lower)) {
        seen.add(key);
        const symbol = CHORD_SYMBOLS[quality as keyof typeof CHORD_SYMBOLS];
        results.push({
          type: 'Chord',
          label: `${name} (${symbol || quality})`,
          action: () => {
            const root = useAppStore.getState().selectedKey;
            const chord = buildChord(root, quality as ChordQuality);
            useAppStore.getState().setSelectedChord(chord);
          },
        });
      }
    }
  }

  // Try just a root note → set key
  if (results.length === 0) {
    const noteMatch = q.match(/^([A-Ga-g][#b♯♭]?)$/);
    if (noteMatch) {
      const root = stringToNote(noteMatch[1]);
      results.push({
        type: 'Key',
        label: noteToString(root),
        action: () => {
          useAppStore.getState().setKey(root);
        },
      });
    }
  }

  // Learn module lookup — independent of scale/chord parsing so users can
  // search for concepts like "dorian", "tritone", "suspension", "fugue".
  const moduleHits = findModulesByQuery(q, 4, localized);
  for (const mod of moduleHits) {
    if (results.length >= 10) break;
    const key = `lesson:${mod.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      type: 'Lesson',
      label: mod.title,
      action: () => {
        useAppStore.setState({
          view: 'learn',
          pendingLearnTarget: { levelId: mod.level, unitId: mod.unitId, moduleId: mod.id },
        });
      },
    });
  }

  return results.slice(0, 10);
}
