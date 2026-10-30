/**
 * Portuguese and Spanish module titles for Cmd+K lesson search and the
 * review queue (W6-09, W6-17).
 *
 * Titles/subtitles live in generated files (moduleTitles.{pt,es}.ts, ~15 KB
 * each) that are loaded lazily the first time a language needs them, so the
 * entry chunk only carries the hand-written concept keywords below.
 */
import type { ContentLanguage } from '../i18n/content/types';
import { MODULE_INDEX } from './moduleIndex';

export type ModuleTitleMap = Record<string, readonly [title: string, subtitle: string]>;

export interface LocalizedModuleIndex {
  lang: Exclude<ContentLanguage, 'en'>;
  titles: ModuleTitleMap;
  /** Extra search words not present in the localized title/subtitle. Lowercase. */
  keywords: Record<string, readonly string[]>;
}

const MODES_PT = ['dórico', 'frígio', 'lídio', 'mixolídio', 'eólio', 'lócrio', 'jónico', 'modal', 'modos'];
const MODES_ES = ['dórico', 'frigio', 'lidio', 'mixolidio', 'eólico', 'locrio', 'jónico', 'modal', 'modos'];

/** Concept keywords per module, mirroring moduleIndex.ts EXTRA_KEYWORDS. */
export const LOCALIZED_KEYWORDS: Record<'pt' | 'es', Record<string, readonly string[]>> = {
  pt: {
    l7u22m4: MODES_PT,
    l7u23m3: ['dórico b2', 'lídio aumentado', 'lídio dominante', 'mixolídio b6', 'alterada', 'superlócrio'],
    l7u23m4: ['frígio dominante', 'húngara', 'dupla harmónica', 'tons inteiros', 'diminuta', 'octatónica'],
    l9u31m2: [...MODES_PT, 'modos gregos'],
    l2u7m3: ['tríade', 'tríades', 'tríade maior', 'tríade menor', 'tríade diminuta', 'tríade aumentada'],
    l3u9m1: ['maj7', 'm7', 'acorde de sétima', 'sétima da dominante', 'meio-diminuto', 'sétima diminuta'],
    l3u11m1: ['cadência perfeita', 'cadência imperfeita', 'cadência plagal', 'cadência interrompida', 'cadência suspensiva'],
    l4u12m4: ['trítono', 'sétima da dominante', 'resolução do v7'],
    l7u21m1: ['maj9', 'add9', 'm11', 'alt', 'sus2', 'sus4', 'extensões'],
    l7u21m3: ['ii-v-i', '2-5-1', 'standard de jazz', 'turnaround'],
    l7u21m5: ['12 compassos', 'blues', 'shuffle'],
    l7u23m1: ['progressão pop', '1-5-6-4', 'quatro acordes'],
    l9u30m3: ['intervalo', 'quinta perfeita', 'quarta perfeita', 'terça maior', 'terça menor', 'segunda', 'uníssono'],
    l9u30m4: ['sexta menor', 'sexta maior', 'sétima menor', 'sétima maior', 'oitava', 'intervalo'],
    l9u31m4: ['qualidade da tríade', 'maior', 'menor', 'diminuta', 'aumentada', 'ouvido'],
    l5u17m2: ['sonata', 'rondó', 'aaba', 'verso e refrão', 'tema e variações', 'forma canção'],
    l8u26m1: ['sonata', 'exposição', 'reexposição', 'desenvolvimento'],
    l8u25m1: ['fuga', 'sujeito', 'resposta', 'contrassujeito'],
    l4u14m1: ['contraponto', 'espécies', 'primeira espécie', 'segunda espécie'],
    l6u20m1: ['contraponto', 'cantus firmus', 'espécies'],
    l6u20m2: ['quarta espécie', 'quinta espécie', 'florido', 'suspensão'],
    l8u27m1: ['teoria dos conjuntos', 'classe de alturas', 'forte'],
    l8u27m2: ['dodecafonismo', 'serialismo', 'série', 'schoenberg'],
  },
  es: {
    l7u22m4: MODES_ES,
    l7u23m3: ['dórico b2', 'lidio aumentado', 'lidio dominante', 'mixolidio b6', 'alterada', 'superlocria'],
    l7u23m4: ['frigio dominante', 'húngara', 'doble armónica', 'tonos enteros', 'disminuida', 'octatónica'],
    l9u31m2: [...MODES_ES, 'modos griegos'],
    l2u7m3: ['tríada', 'tríadas', 'tríada mayor', 'tríada menor', 'tríada disminuida', 'tríada aumentada'],
    l3u9m1: ['maj7', 'm7', 'acorde de séptima', 'séptima de dominante', 'semidisminuido', 'séptima disminuida'],
    // "Cadencia rota" is the usual Spanish name a learner may type; the
    // lessons say "interrumpida" (D-19), so it is a search word only.
    l3u11m1: ['cadencia auténtica', 'cadencia plagal', 'cadencia interrumpida', 'cadencia rota', 'semicadencia'],
    l4u12m1: ['suspensión'],
    l4u12m4: ['tritono', 'séptima de dominante', 'resolución del v7'],
    l7u21m1: ['maj9', 'add9', 'm11', 'alt', 'sus2', 'sus4', 'extensiones'],
    l7u21m3: ['ii-v-i', '2-5-1', 'estándar de jazz', 'turnaround'],
    l7u21m5: ['12 compases', 'blues', 'shuffle'],
    l7u23m1: ['progresión pop', '1-5-6-4', 'cuatro acordes'],
    l9u30m3: ['intervalo', 'quinta justa', 'cuarta justa', 'tercera mayor', 'tercera menor', 'segunda', 'unísono'],
    l9u30m4: ['sexta menor', 'sexta mayor', 'séptima menor', 'séptima mayor', 'octava', 'intervalo'],
    l9u31m4: ['calidad de la tríada', 'mayor', 'menor', 'disminuida', 'aumentada', 'oído'],
    l5u17m2: ['sonata', 'rondó', 'aaba', 'estrofa y estribillo', 'tema con variaciones', 'forma canción'],
    l8u26m1: ['sonata', 'exposición', 'reexposición', 'desarrollo'],
    l8u25m1: ['fuga', 'sujeto', 'respuesta', 'contrasujeto'],
    l4u14m1: ['contrapunto', 'especies', 'primera especie', 'segunda especie'],
    l6u20m1: ['contrapunto', 'cantus firmus', 'especies'],
    l6u20m2: ['cuarta especie', 'quinta especie', 'florido', 'retardo'],
    l8u27m1: ['teoría de conjuntos', 'clase de alturas', 'forte'],
    l8u27m2: ['dodecafonismo', 'serialismo', 'serie', 'schoenberg'],
  },
};

const LOADERS: Record<'pt' | 'es', () => Promise<{ default: ModuleTitleMap }>> = {
  pt: () => import('./moduleTitles.pt'),
  es: () => import('./moduleTitles.es'),
};

const cache = new Map<'pt' | 'es', LocalizedModuleIndex>();
const pending = new Map<'pt' | 'es', Promise<LocalizedModuleIndex | null>>();

/** The localized index if it has already loaded (synchronous), else null. */
export function getLoadedModuleIndex(lang: string): LocalizedModuleIndex | null {
  return lang === 'pt' || lang === 'es' ? (cache.get(lang) ?? null) : null;
}

/** Load (once) the localized index for a language. English → null. */
export function loadModuleIndex(lang: string): Promise<LocalizedModuleIndex | null> {
  if (lang !== 'pt' && lang !== 'es') return Promise.resolve(null);
  const hit = cache.get(lang);
  if (hit) return Promise.resolve(hit);
  let p = pending.get(lang);
  if (!p) {
    p = LOADERS[lang]()
      .then((mod) => {
        const index: LocalizedModuleIndex = { lang, titles: mod.default, keywords: LOCALIZED_KEYWORDS[lang] };
        cache.set(lang, index);
        return index;
      })
      .catch(() => {
        pending.delete(lang); // allow a retry on the next call
        return null;
      });
    pending.set(lang, p);
  }
  return p;
}

/**
 * Display title of a module in a language: the localized title when that
 * index is loaded, else the English index title; null for an unknown id.
 */
export function getModuleTitle(moduleId: string, lang: string): string | null {
  const localized = getLoadedModuleIndex(lang)?.titles[moduleId]?.[0];
  if (localized) return localized;
  return MODULE_INDEX.find((m) => m.id === moduleId)?.title ?? null;
}
