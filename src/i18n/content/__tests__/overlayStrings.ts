/**
 * Test helper: every translated string of the PT/ES content overlays and
 * locale files, with a readable path ("pt/curriculumL3 modules.l3u11m1.
 * concepts[0].explanation"). Used by the note-name, orthography and parity
 * tests.
 */
import ptLocale from '../../locales/pt.json';
import esLocale from '../../locales/es.json';

type Overlay = { default: unknown };

// Vite/Vitest resolve these eagerly at import time.
const ptFiles = import.meta.glob<Overlay>('../pt/*.ts', { eager: true });
const esFiles = import.meta.glob<Overlay>('../es/*.ts', { eager: true });

export interface OverlayString {
  lang: 'pt' | 'es';
  /** "pt/curriculumL3" or "pt.json" */
  file: string;
  /** dotted path inside the file */
  path: string;
  text: string;
}

function walk(value: unknown, path: string, out: Array<[string, string]>) {
  if (typeof value === 'string') out.push([path, value]);
  else if (Array.isArray(value)) value.forEach((v, i) => walk(v, `${path}[${i}]`, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k, out);
  }
}

function collect(lang: 'pt' | 'es', files: Record<string, Overlay>, locale: unknown, includeLocale: boolean): OverlayString[] {
  const out: OverlayString[] = [];
  for (const [p, mod] of Object.entries(files)) {
    const file = `${lang}/${p.split('/').pop()!.replace(/\.ts$/, '')}`;
    const pairs: Array<[string, string]> = [];
    walk(mod.default, '', pairs);
    for (const [path, text] of pairs) out.push({ lang, file, path, text });
  }
  if (includeLocale) {
    const pairs: Array<[string, string]> = [];
    walk(locale, '', pairs);
    for (const [path, text] of pairs) out.push({ lang, file: `${lang}.json`, path, text });
  }
  return out;
}

/** All PT/ES overlay strings; `includeLocale` adds pt.json / es.json values. */
export function overlayStrings(opts: { includeLocale?: boolean } = {}): OverlayString[] {
  const includeLocale = opts.includeLocale ?? true;
  return [
    ...collect('pt', ptFiles, ptLocale, includeLocale),
    ...collect('es', esFiles, esLocale, includeLocale),
  ];
}
