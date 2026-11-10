/**
 * Which explanation is open (wave 1, brief C). Session-only, never saved.
 *
 * `term`: one word, opened from where it appears (the anchor is the tapped
 * word: a laptop's popover stands beside it, focus goes back to it).
 * `words`: "Words on this screen", the list of every marked word visible
 * now; `ids` is that list, read from `scope` (the page, or the modal sheet
 * the list was opened from) — and read again when the page changes under
 * it (the list's own Simple / Full switch).
 */
import { create } from 'zustand';
import type { TermId } from './termIds.ts';

export type GlossaryRequest =
  | { kind: 'term'; id: TermId; also: TermId[]; anchor: HTMLElement | null }
  | { kind: 'words'; ids: TermId[]; anchor: HTMLElement | null; scope: ParentNode };

interface GlossaryUiState {
  request: GlossaryRequest | null;
  /** True once anything asked for the glossary: the lazy host stays mounted. */
  wanted: boolean;
  /** `also`: further words in the same label ("V · dominant" = the numeral and the degree name). */
  openTerm: (id: TermId, anchor: HTMLElement | null, also?: TermId[]) => void;
  openWords: (ids: TermId[], anchor: HTMLElement | null, scope?: ParentNode) => void;
  /** The page changed under an open word list: its words, read again. */
  refreshWords: (ids: TermId[]) => void;
  close: () => void;
}

export const useGlossaryUi = create<GlossaryUiState>((set) => ({
  request: null,
  wanted: false,
  openTerm: (id, anchor, also = []) => set({ request: { kind: 'term', id, also, anchor }, wanted: true }),
  openWords: (ids, anchor, scope = document) => set({ request: { kind: 'words', ids, anchor, scope }, wanted: true }),
  refreshWords: (ids) => set((s) => (s.request?.kind === 'words' ? { request: { ...s.request, ids } } : {})),
  close: () => set({ request: null }),
}));
