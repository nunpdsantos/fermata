/**
 * Making a shared link (wave 1, stream E): "Copy link" in Explore's "⋯" (the
 * key, scale, chord if one is open, and instrument on screen) and on a lesson
 * page (that lesson). The link is the page's own origin + the parameters of
 * state/shareParams.ts — nothing is sent anywhere.
 *
 * Delivery: the device's share sheet where it offers one AND the pointer is
 * coarse (a phone or tablet — on a laptop "Copy link" should copy, not open a
 * sheet), else the clipboard with a "Link copied" toast; when the share sheet
 * fails (other than the learner cancelling it) the clipboard is tried, and
 * when the clipboard is refused too, a sheet shows the link in a selectable
 * field (components/share/ShareLinkHost.tsx).
 */
import i18n from '../i18n/index.ts';
import { noteToString, type Chord, type Note, type ScaleType } from '../core/types/music.ts';
import { CHORD_SYMBOLS } from '../core/constants/chords.ts';
import { getPitchClass } from '../core/constants/notes.ts';
import { parseChordSymbol, chordFromParsed } from '../core/utils/chordParser.ts';
import { useAppStore } from '../state/store.ts';
import { toast } from '../state/toastStore.ts';
import { buildShareUrl, type ShareLinkValues } from '../state/shareParams.ts';
import { copyToClipboard } from '../utils/exportHelpers.ts';
import { showShareFallback } from '../state/shareFallbackStore.ts';
import type { InstrumentType } from '../state/storeTypes.ts';

/**
 * Symbols the parser reads as another quality with the same notes: the link
 * writes the one that reads back exactly (`7#5` reads as aug7; `7(#5)` does not).
 */
const LINK_SYMBOL_OVERRIDES: Partial<Record<Chord['quality'], string>> = {
  dominant7sharp5: '7(#5)',
};

const pcs = (notes: readonly Note[]) => notes.map((n) => noteToString(n)).join(',');

/** Does `symbol` read back as exactly this chord (root, quality, spelled notes, bass)? */
function readsBackAs(symbol: string, chord: Chord): boolean {
  const parsed = parseChordSymbol(symbol);
  if (!parsed) return false;
  const back = chordFromParsed(parsed);
  const bass = (c: Chord) => (c.bassNote ? noteToString(c.bassNote) : '');
  return (
    noteToString(back.root) === noteToString(chord.root) &&
    back.quality === chord.quality &&
    pcs(back.notes) === pcs(chord.notes) &&
    bass(back) === bass(chord)
  );
}

/**
 * The chord symbol a link carries for this chord (ASCII: `F#m7`, `G/B`), or
 * null when no symbol reads back as exactly this chord — the link then leaves
 * the chord out rather than open a different one.
 */
export function chordLinkSymbol(chord: Chord): string | null {
  const root = noteToString(chord.root);
  const bass = chord.bassNote && getPitchClass(chord.bassNote) !== getPitchClass(chord.root) ? `/${noteToString(chord.bassNote)}` : '';
  const candidates: string[] = [];
  if (chord.algorithmicDisplayName) {
    const name = chord.algorithmicDisplayName;
    candidates.push(name.startsWith(root) ? name : `${root}${name}`);
  }
  const override = LINK_SYMBOL_OVERRIDES[chord.quality];
  if (override) candidates.push(`${root}${override}${bass}`);
  candidates.push(`${root}${CHORD_SYMBOLS[chord.quality] ?? ''}${bass}`);
  return candidates.find((c) => readsBackAs(c, chord)) ?? null;
}

/** The parameters for what Explore shows. */
export function exploreLinkValues(state: {
  selectedKey: Note;
  selectedScale: ScaleType;
  selectedChord: Chord | null;
  instrument: InstrumentType;
}): ShareLinkValues {
  const values: ShareLinkValues = {
    key: noteToString(state.selectedKey),
    scale: state.selectedScale,
    inst: state.instrument,
  };
  const chord = state.selectedChord ? chordLinkSymbol(state.selectedChord) : null;
  if (chord) values.chord = chord;
  return values;
}

/** The link for what Explore shows now (key, scale, chord if one is open, instrument). */
export function exploreLinkUrl(origin = window.location.origin): string {
  return buildShareUrl(origin, exploreLinkValues(useAppStore.getState()));
}

/** The link to a lesson. */
export function lessonLinkUrl(moduleId: string, origin = window.location.origin): string {
  return buildShareUrl(origin, { lesson: moduleId });
}

/** Phones and tablets: where "Share link" opens the device's share sheet. */
export const COARSE_POINTER_QUERY = '(pointer: coarse)';

/** Where the device offers a share sheet that "Share link" should use (phones and tablets). */
export function prefersShareSheet(): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') return false;
  try {
    return window.matchMedia(COARSE_POINTER_QUERY).matches;
  } catch {
    return false;
  }
}

export type DeliverResult = 'shared' | 'cancelled' | 'copied' | 'fallback';

/** Share sheet, else clipboard + toast, else the selectable field. */
export async function deliverLink(url: string, title?: string): Promise<DeliverResult> {
  const t = (key: string) => i18n.t(key) as string;
  if (prefersShareSheet()) {
    try {
      await navigator.share(title ? { url, title } : { url });
      return 'shared';
    } catch (e) {
      // The learner closed the sheet: nothing more to do.
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
    }
  }
  if (await copyToClipboard(url)) {
    toast(t('share.copied'), 'success');
    return 'copied';
  }
  showShareFallback(url);
  return 'fallback';
}

export function shareExploreLink(): Promise<DeliverResult> {
  return deliverLink(exploreLinkUrl());
}

export function shareLessonLink(moduleId: string, title?: string): Promise<DeliverResult> {
  return deliverLink(lessonLinkUrl(moduleId), title);
}

/** The menu item's words: "Share link" where the share sheet opens, else "Copy link". */
export function shareLinkLabel(): string {
  return i18n.t(prefersShareSheet() ? 'share.shareLink' : 'share.copyLink') as string;
}
