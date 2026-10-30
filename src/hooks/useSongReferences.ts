import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../state/store.ts';
import { getSongReferences, type SongReference } from '../data/songReferences.ts';
import { loadSongOverlay } from '../i18n/content/overlayLoader.ts';
import { applySongOverlay } from '../i18n/content/contentResolver.ts';
import type { ContentLanguage, SongOverlay } from '../i18n/content/types.ts';

/**
 * "Songs That Use This" for a module, with the context sentence in the app
 * language (W6-03). The song overlay is a lazy chunk per language; until it
 * arrives (or if it fails to load) the English context is shown.
 */
export function useSongReferences(moduleId: string): SongReference[] {
  const language = useAppStore((s) => s.language) as ContentLanguage;
  const [loaded, setLoaded] = useState<{ lang: ContentLanguage; overlay: SongOverlay | null } | null>(null);

  useEffect(() => {
    if (language === 'en') return;
    let alive = true;
    loadSongOverlay(language).then((overlay) => {
      if (alive) setLoaded({ lang: language, overlay });
    });
    return () => {
      alive = false;
    };
  }, [language]);

  return useMemo(() => {
    const refs = getSongReferences(moduleId);
    if (language === 'en' || loaded?.lang !== language || !loaded.overlay) return refs;
    return applySongOverlay({ [moduleId]: refs }, loaded.overlay)[moduleId];
  }, [moduleId, language, loaded]);
}
