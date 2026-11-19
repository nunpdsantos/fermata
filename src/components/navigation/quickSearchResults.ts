// QuickSearch result builder — pure(ish) query → ranked results.
//
// Extracted from QuickSearch.tsx so the component file exports only the component
// (react-refresh/only-export-components) and so this ranking logic is directly
// unit-testable. Result `action`s close over the Zustand store getState() at call
// time, so they stay current.

import i18n from '../../i18n/index.ts';
import { useAppStore } from '../../state/store.ts';
import { noteToString, type Chord, type Note, type ScaleType, type ChordQuality } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { buildChord, CHORD_QUALITY_NAMES } from '../../core/constants/chords.ts';
import { SCALE_TYPE_NAMES } from '../../core/constants/scales.ts';
import {
  parseChordSymbol,
  chordFromParsed,
  type ParsedChord,
} from '../../core/utils/chordParser.ts';
import { getChordCompletions, parseVerbalChord } from '../../core/utils/chordHints.ts';
import { parseScaleSymbol } from '../../core/utils/scaleParser.ts';
import { findModulesByQuery, MODULE_INDEX, type ModuleIndexEntry } from '../../data/moduleIndex.ts';
import type { LocalizedModuleIndex } from '../../data/moduleIndexI18n.ts';
import { trackForProfile, trackOfModule } from '../../data/tracks.ts';
import { getLearnerProfile, type LearnerProfile } from '../../state/learnerProfile.ts';
import { resolveTheoryReadings, isBareSolfege } from '../../utils/theoryQuery.ts';
import { applyResolvedTheoryQuery } from '../../utils/queryExecutor.ts';
import { qualityName } from '../../utils/qualityName.ts';
import { solfegeLanguage, solfegeName, withSolfege } from '../../i18n/solfege.ts';
import { keyName } from '../explore/focusReadout.ts';
import type { ContentLanguage } from '../../i18n/content/types.ts';
import { selectChordAsWritten } from '../../utils/chordSelection.ts';
import { openTuner } from '../tuner/tunerRequest.ts';
import { requestMetronome } from '../../state/metronomeRequest.ts';
import { getDemoRequest } from '../../state/demoRequest.ts';

export type SearchResultType = 'Scale' | 'Chord' | 'Key' | 'Lesson' | 'Tool';

/**
 * Where a result comes from — every place this file makes a result's action
 * names one (`source: '…'`), and a test chooses each kind from Learn and from
 * Drill (searchAudit2.test.tsx, review of b94d761 item 1): all but lessons
 * and tools must open Explore (`inExplore`).
 */
export type ResultSource =
  | 'reading-scale' | 'reading-rootless' | 'reading-key' | 'parsed-scale'
  | 'chord' | 'solfege-chord' | 'fuzzy-scale' | 'fuzzy-chord' | 'lesson' | 'tool';

export interface SearchResult {
  type: SearchResultType;
  label: string;
  action: () => void;
  source: ResultSource;
  /** A solfège chord ("Sol7", "Do7" as C7: A3), added to what search found before. */
  solfege?: true;
}

/**
 * The app's tools as results (review of b94d761, item 8): named by the "⋯"
 * menu's own labels, found by them and by their obvious words in the three
 * languages, opened exactly as the menu opens them, and offered only where the
 * menu offers them (layout/TopBar.tsx: the tuner everywhere but while the
 * tour plays; the metronome neither in Drill nor while the tour plays).
 */
const TOOLS: readonly { label: string; words: readonly string[]; offered: (view: string, tour: boolean) => boolean; open: () => void }[] = [
  { label: 'tunerEntry.menuItem', words: ['tuner', 'tune', 'tuning', 'afinador', 'afinar', 'afinacao', 'afinacion'], offered: (_view, tour) => !tour, open: openTuner },
  { label: 'metronomeToolEntry.menuItem', words: ['metronome', 'metronomo'], offered: (view, tour) => view !== 'drill' && !tour, open: requestMetronome },
];

const fold = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// Mode names that need mapping to ScaleType
const MODE_TO_SCALE: Record<string, ScaleType> = {
  ionian: 'major',
  aeolian: 'natural_minor',
};

const LESSON_HITS = 4;

/**
 * How results are named and ordered for the learner (audit A3 / A13,
 * 2026-11-18). Each result is named exactly as Explore's own heading names
 * what it opens, in the learner's language: a chord as the chord detail's
 * heading ("D Minor 7th", «D Menor com 7.ª» — letters, as chord names always
 * are, D-18), a scale or key as the key summary ("D Major", «D maior»,
 * «D (Ré) maior» with Dó-Ré-Mi on).
 */
export interface SearchNames {
  lang: ContentLanguage;
  t: (key: string) => string;
  /** A root as Explore's key summary names it ("D", or "D (Ré)" with Dó-Ré-Mi on). */
  note: (n: Note) => string;
  /** The solfège reading of an ambiguous query ("Do7": C7 or D°7) comes first. */
  solfegeFirst: boolean;
}

/** The names a language and the Dó-Ré-Mi setting call for. */
export function searchNames(language: string, showSolfege: boolean | undefined): SearchNames {
  const sol = showSolfege && solfegeLanguage(language) ? language : null;
  return {
    lang: solfegeLanguage(language) ?? 'en',
    t: (key) => i18n.t(key) as string,
    note: (n) => withSolfege(n, sol ? solfegeName(n, sol) : null),
    // PT and ES read "Do" as C; so does anyone who asked for Dó-Ré-Mi.
    solfegeFirst: solfegeLanguage(language) !== null || showSolfege === true,
  };
}

/** The names the store's language and Dó-Ré-Mi setting call for. */
export function searchNamesFromStore(): SearchNames {
  const { language, showSolfege } = useAppStore.getState();
  return searchNames(language, showSolfege);
}

/** A chord's name as Explore's chord heading writes it: root, quality, /bass. */
export function chordResultName(chord: Chord, lang: ContentLanguage): string {
  // A chord the parser built ("Am(add9)", "Cmaj7#9") carries its whole name.
  if (chord.algorithmicDisplayName) return withGlyphs(chord.algorithmicDisplayName);
  const name = `${withGlyphs(chord.root)} ${qualityName(chord.quality, lang)}`;
  return chord.bassNote ? `${name}/${withGlyphs(chord.bassNote)}` : name;
}

/** A scale on a root as Explore's key summary writes it ("D Dorian", «D (Ré) maior»). */
export function scaleResultName(root: Note, type: ScaleType, names: SearchNames): string {
  return keyName({ root, type, notes: [] }, names.t, names.note);
}

/**
 * The key Explore has of its own: a lesson that borrowed the instrument holds
 * Explore's key and scale on loan, and gives them back when Learn is left.
 */
function exploreSelection(): { key: Note; scale: ScaleType } {
  const s = useAppStore.getState();
  return s.view === 'learn' && s.lessonLoan ? { key: s.lessonLoan.key, scale: s.lessonLoan.scale } : { key: s.selectedKey, scale: s.selectedScale };
}

/**
 * Choosing a chord, scale or key shows it in Explore (audit A4, 2026-11-18):
 * from Learn or Drill the view switches exactly as the Explore tab switches it
 * (`setView`, which keeps an unfinished Drill session or check where it was
 * and gives a lesson's borrowed selection back), THEN the choice is applied —
 * setView clears the chord. In Explore nothing is switched: the choice lands
 * in place.
 */
function inExplore(apply: () => void): () => void {
  return () => {
    const s = useAppStore.getState();
    if (s.view !== 'explore') s.setView('explore');
    apply();
  };
}

/**
 * The lesson hits for a learner (the seat's decision S-4, wave 2): the
 * lessons that are not track lessons — plus, for a 'new' / 'player' learner,
 * their own track's — ranked as `findModulesByQuery` ranks them, up to four;
 * any other track lesson only in a slot they leave empty, after them. For no
 * profile or 'theory' that is exactly main's result, from before the track
 * lessons joined the index. `ranked` is every match, best first (filtering a
 * stably sorted list keeps the order a filtered index would give).
 */
function lessonHitsFor(ranked: readonly ModuleIndexEntry[], profile: LearnerProfile | null): ModuleIndexEntry[] {
  const own = trackForProfile(profile)?.id ?? null;
  const first: ModuleIndexEntry[] = [];
  const after: ModuleIndexEntry[] = [];
  for (const entry of ranked) {
    const track = trackOfModule(entry.id)?.id ?? null;
    (track === null || track === own ? first : after).push(entry);
  }
  return [...first, ...after].slice(0, LESSON_HITS);
}


/**
 * Ranked Cmd+K results. `localized` is the Portuguese/Spanish module index
 * (when loaded) so lesson hits match and display in the app language;
 * `profile` (default: the store's) decides where track lessons rank;
 * `names` (default: the store's language and Dó-Ré-Mi) names and orders them.
 */
export function getResults(
  query: string,
  localized?: LocalizedModuleIndex | null,
  profile: LearnerProfile | null = getLearnerProfile(),
  names: SearchNames = searchNamesFromStore(),
): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];
  const seen = new Set<string>();
  const explore = exploreSelection();

  const pushScale = (root: Note, scaleType: ScaleType, source: ResultSource, apply: () => void) => {
    const key = `scale:${noteToString(root)}:${scaleType}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push({ type: 'Scale', label: scaleResultName(root, scaleType, names), action: inExplore(apply), source });
  };

  // ── Chords ────────────────────────────────────────────────────────────────
  // Ranking: the resolver's readings first, then the exact parse, then verbal
  // resolution, then partial-symbol completions (common extensions of the
  // typed stem). Capped at 8 chord results.
  const CHORD_CAP = 8;
  let chordCount = 0;
  const pushChord = (parsed: ParsedChord): boolean => {
    if (chordCount >= CHORD_CAP) return false;
    const key = `chord:${noteToString(parsed.root)}:${parsed.quality}:${
      parsed.bassNote ? noteToString(parsed.bassNote) : ''
    }`;
    if (seen.has(key)) return false;
    seen.add(key);
    const chord = chordFromParsed(parsed);
    results.push({
      type: 'Chord',
      label: chordResultName(chord, names.lang),
      action: inExplore(() => selectChordAsWritten(chord)),
      source: 'chord',
    });
    chordCount++;
    return true;
  };

  // 0. The shared Try-This resolver (W9-01): the exact forms lessons tell the
  //    learner to type — "C major scale", "C major chord", "C whole tone
  //    scale", "key of G", "D natural minor scale" — their Portuguese and
  //    Spanish phrasings ("escala de C maior", "acorde de Ré menor"). Chord
  //    readings are pushed with the other chords below (scales and keys
  //    first). The solfège chord symbols ("Sol7"; "Do7" as C7 — A3) are added
  //    at the end, to the list built exactly as before.
  const all = resolveTheoryReadings(q);
  const readings = all.filter((r) => r.via !== 'solfege');
  for (const { resolved } of readings) {
    if (resolved.kind === 'scale') {
      pushScale(resolved.root, resolved.scaleType, 'reading-scale', () => { applyResolvedTheoryQuery(resolved); });
    } else if (resolved.kind === 'rootlessScale') {
      seen.add(`scale:fuzzy:${resolved.scaleType}`);
      pushScale(explore.key, resolved.scaleType, 'reading-rootless', () => { applyResolvedTheoryQuery(resolved); });
    } else if (resolved.kind === 'key') {
      results.push({
        type: 'Key',
        label: scaleResultName(resolved.root, resolved.minor ? 'natural_minor' : 'major', names),
        action: inExplore(() => { applyResolvedTheoryQuery(resolved); }),
        source: 'reading-key',
      });
    }
  }

  // Try scale parser first (handles all 46 types + modes + aliases)
  const parsedScale = parseScaleSymbol(q);
  if (parsedScale) {
    // Map mode names to ScaleType
    const scaleType = (MODE_TO_SCALE[parsedScale.scaleType] ?? parsedScale.scaleType) as ScaleType;
    pushScale(parsedScale.root, scaleType, 'parsed-scale', () => {
      useAppStore.getState().setKey(parsedScale.root);
      useAppStore.getState().setScale(scaleType);
    });
  }

  // 0'. Chords read by the resolver ("C major chord", "acorde de Ré menor",
  //     "Do7" as D°7).
  for (const { resolved } of readings) if (resolved.kind === 'chord') pushChord(resolved.parsed);

  // A bare solfège syllable ("do", "sol") is a note name: the resolver above
  // already read it (do = C). The raw symbol parsers below would read "do"
  // as D diminished, so they are skipped.
  const bareSolfege = isBareSolfege(q);

  // 1. Exact symbol parse (all 47 qualities + slash chords + algorithmic).
  const parsedChord = bareSolfege ? null : parseChordSymbol(q);
  if (parsedChord) pushChord(parsedChord);

  // 2. Verbal resolution ("c sharp minor seven", "g dominant", "f sharp
  //    diminished seventh") — catches spelled-out numbers / multi-word qualities
  //    the symbol parser deliberately leaves alone.
  const verbalChord = bareSolfege ? null : parseVerbalChord(q);
  if (verbalChord) pushChord(verbalChord);

  // 3. Partial-symbol completions ("Cmaj" → Cmaj7/9/11/13; "C7#" → C7#9/#11/#5;
  //    "Cm" → Cm/Cm7/Cm9/…). Deterministic, commonality-ordered, deduped against
  //    the exact/verbal results above.
  for (const completion of bareSolfege ? [] : getChordCompletions(q, CHORD_CAP)) {
    if (chordCount >= CHORD_CAP) break;
    pushChord(completion.parsed);
  }

  // Fuzzy fallback: substring match on scale type names (on Explore's own key)
  if (results.length < 4) {
    const lower = q.toLowerCase();
    for (const [scaleType, name] of Object.entries(SCALE_TYPE_NAMES)) {
      if (results.length >= 8) break;
      const key = `scale:fuzzy:${scaleType}`;
      // Named with Explore's root now (A13): the same scale on that root, found
      // by the parser, is the same row.
      const onRoot = `scale:${noteToString(explore.key)}:${scaleType}`;
      if (seen.has(key) || seen.has(onRoot)) continue;
      if (name.toLowerCase().includes(lower)) {
        seen.add(key);
        seen.add(onRoot);
        results.push({
          type: 'Scale',
          label: scaleResultName(explore.key, scaleType as ScaleType, names),
          action: inExplore(() => {
            useAppStore.getState().setScale(scaleType as ScaleType);
          }),
          source: 'fuzzy-scale',
        });
      }
    }
  }

  // Fuzzy fallback: substring match on chord quality names — this is how a full
  // quality NAME ("Dominant 7th", "Half-Diminished") resolves to a chord, on
  // Explore's own key.
  if (results.length < 4) {
    const lower = q.toLowerCase();
    for (const [quality, name] of Object.entries(CHORD_QUALITY_NAMES)) {
      if (results.length >= 8) break;
      const key = `chord:fuzzy:${quality}`;
      const onRoot = `chord:${noteToString(explore.key)}:${quality}:`;
      if (seen.has(key) || seen.has(onRoot)) continue;
      if (name.toLowerCase().includes(lower)) {
        seen.add(key);
        seen.add(onRoot);
        results.push({
          type: 'Chord',
          label: chordResultName(buildChord(explore.key, quality as ChordQuality), names.lang),
          action: inExplore(() => {
            const root = useAppStore.getState().selectedKey;
            useAppStore.getState().setSelectedChord(buildChord(root, quality as ChordQuality));
          }),
          source: 'fuzzy-chord',
        });
      }
    }
  }

  // Learn module lookup — independent of scale/chord parsing so users can
  // search for concepts like "dorian", "tritone", "suspension", "fugue".
  // Level lessons first for a learner without a track (lessonHitsFor).
  const moduleHits = lessonHitsFor(findModulesByQuery(q, MODULE_INDEX.length, localized), profile);
  for (const mod of moduleHits) {
    if (results.length >= 10) break;
    const key = `lesson:${mod.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({
      type: 'Lesson',
      label: mod.title,
      action: () => {
        useAppStore.getState().openLearnTarget({ levelId: mod.level, unitId: mod.unitId, moduleId: mod.id });
      },
      source: 'lesson',
    });
  }

  // A3: a solfège syllable glued to a chord symbol ("Sol7", "Ré7", "Do7" as
  // C7). Added to the list as it was built before, so it never costs a result
  // the place that decides what else is found (a solfège "Dom" = C minor took
  // one of the four slots below which "dom" finds "Dominant 7th"). First in
  // PT / ES and with Dó-Ré-Mi on; otherwise — and always for one bare
  // lower-case word with no digit and no sharp or flat ("sim", "dom", "lam",
  // also ordinary words: review of b94d761, item 2) — after everything the
  // list held. Ten rows at most (item 3): a solfège reading that ranks first
  // is kept, one that comes after may not fit.
  const listed = results.slice(0, 10);
  const solfegeFirst: SearchResult[] = [];
  const solfegeAfter: SearchResult[] = [];
  for (const { resolved, via, plainWord } of all) {
    if (via !== 'solfege' || resolved.kind !== 'chord') continue;
    const parsed = resolved.parsed;
    const key = `chord:${noteToString(parsed.root)}:${parsed.quality}:${parsed.bassNote ? noteToString(parsed.bassNote) : ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const chord = chordFromParsed(parsed);
    const row: SearchResult = {
      type: 'Chord',
      label: chordResultName(chord, names.lang),
      action: inExplore(() => selectChordAsWritten(chord)),
      source: 'solfege-chord',
      solfege: true,
    };
    (names.solfegeFirst && !plainWord ? solfegeFirst : solfegeAfter).push(row);
  }
  listed.unshift(...solfegeFirst);
  listed.push(...solfegeAfter);

  // The app's tools (item 8), before the lessons, where the menu offers them.
  const word = fold(q);
  if (word.length >= 3) {
    const { view } = useAppStore.getState();
    const tour = getDemoRequest() !== null;
    const tools: SearchResult[] = TOOLS
      .filter((tool) => tool.offered(view, tour) && tool.words.some((w) => w.startsWith(word) || word === fold(names.t(tool.label))))
      .map((tool) => ({ type: 'Tool' as const, label: names.t(tool.label), action: tool.open, source: 'tool' as const }));
    const lessonAt = listed.findIndex((r) => r.type === 'Lesson');
    listed.splice(lessonAt < 0 ? listed.length : lessonAt, 0, ...tools);
  }

  // Names on display with real ♭ / ♯ (the query and every lookup stay ASCII);
  // lesson titles are prose and stay as written.
  return listed.slice(0, 10).map((r) => (r.type === 'Lesson' || r.type === 'Tool' ? r : { ...r, label: withGlyphs(r.label) }));
}
