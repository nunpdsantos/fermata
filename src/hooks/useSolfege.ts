import { useCallback } from 'react';
import type { Note } from '../core/types/music.ts';
import { useAppStore } from '../state/store.ts';
import { solfegeName, solfegeLanguage, withSolfege } from '../i18n/solfege.ts';

/**
 * The fixed-do name to show beside a note's letter, or null: null unless the
 * learner turned "Also show Dó, Ré, Mi" on AND the language is PT or ES.
 */
export function useSolfege(): (note: Note) => string | null {
  const on = useAppStore((s) => s.showSolfege);
  const language = useAppStore((s) => s.language);
  return useCallback((note: Note) => (on && solfegeLanguage(language) ? solfegeName(note, language) : null), [on, language]);
}

/** A note's name for a label: "D (Ré)" with the setting on (PT / ES), else "D" — the same as withGlyphs. */
export function useNoteLabel(): (note: Note) => string {
  const solfege = useSolfege();
  return useCallback((note: Note) => withSolfege(note, solfege(note)), [solfege]);
}
