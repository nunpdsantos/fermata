import { useEffect, useState } from 'react';
import {
  getLoadedModuleIndex,
  loadModuleIndex,
  type LocalizedModuleIndex,
} from '../data/moduleIndexI18n.ts';

/**
 * The Portuguese/Spanish module index for `lang` (null for English, or until
 * the lazy chunk arrives). Components re-render once it has loaded.
 */
export function useLocalizedModuleIndex(lang: string): LocalizedModuleIndex | null {
  const [loaded, setLoaded] = useState<LocalizedModuleIndex | null>(() => getLoadedModuleIndex(lang));

  useEffect(() => {
    if (lang !== 'pt' && lang !== 'es') return;
    if (getLoadedModuleIndex(lang)) return;
    let alive = true;
    loadModuleIndex(lang).then((index) => {
      if (alive) setLoaded(index);
    });
    return () => {
      alive = false;
    };
  }, [lang]);

  // A previously loaded index for another language must never leak through.
  const current = getLoadedModuleIndex(lang);
  if (current) return current;
  return loaded?.lang === lang ? loaded : null;
}
