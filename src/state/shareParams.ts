/**
 * The address-bar parameters of a shared link — the wave-1 contract (2026-11-10).
 *
 * OWNER: the share-links branch (stream E) in wave 1; the progression branch
 * (stream S) in wave 2, which added `prog`, `bpm` and `capo`. It may extend
 * this file (parsing, building links); every other branch may only IMPORT
 * the names exported here, and must not change this file.
 *
 * `view` is NOT a share parameter on its own: `?view=drill` is the installed
 * app's shortcut (state/bootView.ts) and must keep behaving as it does.
 *
 * THE GRAMMAR (stable: links are printed and pasted for years, so a name or a
 * spelling here never changes meaning; every parameter is optional and
 * language-independent):
 *
 *   key    a root in any of the 21 spellings: a letter A–G, then nothing,
 *          `#` or `b` (`C`, `Eb`, `F#`; also `E#`, `B#`, `Fb` and `Cb`, which
 *          the key picker never offers). The link writes `#` as `%23`
 *          (a bare `#` starts the URL's fragment). Read leniently: a lower-case
 *          letter and the glyphs ♯ / ♭ are accepted too.
 *   scale  a scale id of the Scale picker (`major`, `natural_minor`, `dorian`,
 *          `pentatonic_minor` …; `SCALE_GROUPS` in navigation/keyChoice.ts).
 *   chord  a chord symbol the core parser reads (`A`, `Am7`, `G/B`, `F%23m7b5`,
 *          `C7(%235)`) — parseChordSymbol.
 *   inst   `piano` | `guitar`.
 *   lesson a lesson's module id (`l2u7m5`; data/moduleIndex.ts).
 *   prog   (wave 2) the Progression panel's chords: symbols the chord parser
 *          reads, separated by commas, in playing order (`G,D,Em,C`,
 *          `F%23m7,B7`), at most 16 (more are ignored). Its own length limit
 *          (`MAX_PROG_LENGTH`): the shared one would cut a real progression.
 *          A link with `prog` opens Explore with the panel open.
 *   bpm    (wave 2) the panel's tempo, a whole number 50–200; read only
 *          beside `prog`.
 *   capo   (wave 2) the guitar capo, a whole number 0–9 (setCapoFret).
 *
 * NOT share parameters either: `view` (above) and `lang` (2026-11-14, the
 * search pages' links: i18n/language.ts `LANG_PARAM`), which chooses the
 * language of a first visit only. Both leave the address bar with the rest
 * (`cleanedAddress`).
 *
 * Validation lives in services/shareLinkParse.ts (lazy: it needs the chord
 * parser); this file only reads the raw strings, so it stays in the entry
 * chunk at almost no cost.
 */
import { LANG_PARAM } from '../i18n/language.ts';

export const SHARE_PARAM_KEYS = ['key', 'scale', 'chord', 'inst', 'lesson', 'prog', 'bpm', 'capo'] as const;

export type ShareParamKey = (typeof SHARE_PARAM_KEYS)[number];

/** Does this query string (`window.location.search`) carry a shared link? */
export function hasShareParams(search: string): boolean {
  const params = new URLSearchParams(search);
  return SHARE_PARAM_KEYS.some((k) => params.has(k));
}

/** The raw values a link carries (not yet validated). */
export type RawShareParams = Partial<Record<ShareParamKey, string>>;

/** Longer than this, a value cannot be one of ours (the chord parser itself stops at 50). */
export const MAX_SHARE_VALUE_LENGTH = 64;
/** A query string longer than this is not a Fermata link: nothing in it is read. */
export const MAX_SHARE_SEARCH_LENGTH = 2048;
/** `prog` carries up to 16 symbols and their commas: longer than this, it is not one of ours. */
export const MAX_PROG_LENGTH = 400;

const maxLength = (k: ShareParamKey) => (k === 'prog' ? MAX_PROG_LENGTH : MAX_SHARE_VALUE_LENGTH);

/**
 * A hand-typed `?key=F#&inst=guitar` puts everything from the `#` into the
 * URL's fragment (search `?key=F`, hash `#&inst=guitar`). When the search ends
 * on a `key`, `chord` or `prog` value and the fragment carries on from there, read
 * them as one query with the `#` restored. The app uses no fragment of its own.
 */
function joinFragment(search: string, hash: string): { query: string; recovered: boolean } {
  if (!hash || !hash.startsWith('#') || !search) return { query: search, recovered: false };
  const last = search.slice(search.lastIndexOf('&') + 1).replace(/^\?/, '');
  if (!/^(key|chord|prog)=[^=]*$/.test(last)) return { query: search, recovered: false };
  const rest = hash.slice(1);
  // The fragment continues the value (`m7`, `5`) or starts the next parameter (`&inst=…`).
  if (rest !== '' && !/^[^&=]*(&|$)/.test(rest)) return { query: search, recovered: false };
  return { query: `${search}%23${rest}`, recovered: true };
}

/**
 * The share parameters of the address (`location.search`, `location.hash`),
 * raw, or null when it carries none. Only the first value of each name counts;
 * an over-long value is dropped here, an over-long query string altogether.
 */
export function readShareParams(search: string, hash = ''): RawShareParams | null {
  const { query } = joinFragment(search, hash);
  if (!hasShareParams(query)) return null;
  if (query.length > MAX_SHARE_SEARCH_LENGTH) return {};
  const params = new URLSearchParams(query);
  const out: RawShareParams = {};
  for (const k of SHARE_PARAM_KEYS) {
    const v = params.get(k);
    if (v !== null && v.length <= maxLength(k)) out[k] = v;
  }
  return out;
}

/**
 * The address with the link's parameters (and `view` and `lang`) taken out —
 * what the address bar shows once a link has been opened, so a refresh does
 * not open it again. Other parameters stay; a fragment that held part of a
 * link goes.
 */
export function cleanedAddress(pathname: string, search: string, hash = ''): string {
  const { query, recovered } = joinFragment(search, hash);
  const params = new URLSearchParams(recovered ? query : search);
  for (const k of [...SHARE_PARAM_KEYS, 'view', LANG_PARAM]) params.delete(k);
  const qs = params.toString();
  return pathname + (qs ? `?${qs}` : '') + (recovered ? '' : hash);
}

/** The values a link is built from, already in the grammar's spelling. */
export interface ShareLinkValues {
  key?: string;
  scale?: string;
  chord?: string;
  inst?: 'piano' | 'guitar';
  lesson?: string;
  /** Symbols already joined with commas (`G,D,Em,C`). */
  prog?: string;
  bpm?: string;
  capo?: string;
}

/** `?key=D&scale=major&chord=A&inst=guitar` — in the grammar's order, `#` as `%23`. */
export function buildShareSearch(values: ShareLinkValues): string {
  const params = new URLSearchParams();
  for (const k of SHARE_PARAM_KEYS) {
    const v = values[k];
    if (v) params.set(k, v);
  }
  // The commas between a progression's chords stay readable (`prog=G,D,Em,C`):
  // a comma is allowed in a query and reads back as the same comma.
  const qs = params.toString().replace(/%2C/gi, ',');
  return qs ? `?${qs}` : '';
}

/** The full link: the page's own origin (nothing is sent anywhere), the app's root, the parameters. */
export function buildShareUrl(origin: string, values: ShareLinkValues): string {
  return `${origin}/${buildShareSearch(values)}`;
}

let openedFromLink = false;

/** App.tsx calls this at boot when the address carried share parameters (before cleaning it). */
export function markOpenedFromShareLink(): void {
  openedFromLink = true;
}

/**
 * Boot, once, before the first render (main.tsx): was this page opened from a
 * shared link? Read off the address as it arrived (`location.search` and
 * `location.hash`, so `?chord=F#m7` counts like `?chord=F%23m7`) with the same
 * reader that opens the link. This is the ONE answer the start screen steps
 * aside on (state/startGate.ts); App.tsx marks it again when it opens the link.
 */
export function noteBootAddress(search: string, hash = ''): boolean {
  openedFromLink = readShareParams(search, hash) !== null;
  return openedFromLink;
}

/**
 * Was this page opened from a shared link? Answers for the whole page life,
 * also after the address bar has been cleaned — for a screen that should step
 * aside when a link is opened (the start screen).
 */
export function openedFromShareLink(): boolean {
  return openedFromLink;
}
