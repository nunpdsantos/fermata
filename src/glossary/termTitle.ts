import { scaleOfTerm, type T } from './entries.ts';
import type { TermId } from './termIds.ts';

const capitalise = (s: string) => (s ? s[0].toLocaleUpperCase() + s.slice(1) : s);

/** The title of an entry: its own, or (a scale) the scale's name as the pickers show it. */
export function termTitle(id: TermId, t: T): string {
  const scale = scaleOfTerm(id);
  return scale ? capitalise(t(`scaleName.${scale}`)) : t(`glossary.entries.${id}.title`);
}
