/**
 * Which explanation is open (wave 1, brief C). Session-only, never saved.
 *
 * `term`: one word, opened from where it appears (the anchor is the tapped
 * word: a laptop's popover stands beside it, focus goes back to it).
 * `words`: "Words on this screen", the list of every marked word visible
 * now; `ids` is that list, read from the page when it was opened.
 */
import { create } from 'zustand';
import type { TermId } from './termIds.ts';

export type GlossaryRequest =
  | { kind: 'term'; id: TermId; also: TermId[]; anchor: HTMLElement | null }
  | { kind: 'words'; ids: TermId[]; anchor: HTMLElement | null };

interface GlossaryUiState {
  request: GlossaryRequest | null;
  /** True once anything asked for the glossary: the lazy host stays mounted. */
  wanted: boolean;
  /** `also`: further words in the same label ("V · dominant" = the numeral and the degree name). */
  openTerm: (id: TermId, anchor: HTMLElement | null, also?: TermId[]) => void;
  openWords: (ids: TermId[], anchor: HTMLElement | null) => void;
  close: () => void;
}

export const useGlossaryUi = create<GlossaryUiState>((set) => ({
  request: null,
  wanted: false,
  openTerm: (id, anchor, also = []) => set({ request: { kind: 'term', id, also, anchor }, wanted: true }),
  openWords: (ids, anchor) => set({ request: { kind: 'words', ids, anchor }, wanted: true }),
  close: () => set({ request: null }),
}));
