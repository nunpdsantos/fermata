import { isTermId, type TermId } from './termIds.ts';

/** Marks a word shown inside another control, for "Words on this screen". */
export function termAttr(...ids: (TermId | null | undefined)[]): { 'data-term'?: string } {
  const list = ids.filter((id): id is TermId => !!id);
  return list.length ? { 'data-term': list.join(' ') } : {};
}

/** Not part of the list: the glossary's own panels, inert or hidden copies. */
function counts(el: Element): boolean {
  if (el.closest('[data-glossary], [inert], [data-folded]')) return false;
  return el.getClientRects().length > 0;
}

/**
 * The words marked on the page right now, in reading order, each once — what
 * "Words on this screen" lists. Read from the page itself, so it lists
 * exactly what is shown (Simple or Full, the tab open, the dock's controls).
 */
export function visibleTermIds(root: ParentNode = document): TermId[] {
  const seen = new Set<TermId>();
  for (const el of Array.from(root.querySelectorAll('[data-term]'))) {
    if (!counts(el)) continue;
    for (const id of (el.getAttribute('data-term') ?? '').split(/\s+/)) {
      if (isTermId(id)) seen.add(id);
    }
  }
  return [...seen];
}
