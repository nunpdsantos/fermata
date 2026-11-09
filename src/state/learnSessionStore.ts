/**
 * Where the learner is in Learn, kept across reloads (W4b, owner's
 * update-robustness decision): reloading — the PWA "Reload" for a new
 * version included — must lose nothing. Two things are saved:
 *
 *  - the open lesson (or review) and the section being read;
 *  - an in-progress check: the question order, the answers given, the
 *    attempt and hint state of the current question, the scores so far
 *    (and, once finished, its result screen).
 *
 * Its own persisted store (`fermata-learn-session-v1`, versioned like the
 * others), NOT the progress store: completions, unlocks, schedules and W4a's
 * retirement are never touched by it. It is transient — not in backups — and
 * expires sensibly: after 24 hours, or when the content under the saved ids
 * changed (W4a's exercise identity, taken from the ENGLISH item, so a PT/ES
 * wording fix keeps the run), or in another content language (the saved
 * answers are in the old one's words); an expired or malformed save is
 * simply dropped. Scores themselves are recorded in the progress store as each
 * question is answered — this only lets the run itself continue.
 *
 * On lazy load it replaces learnWork's persisted 'learn' check with live state:
 * an unfinished, fresh check (including its first question) is busy. The
 * overview and reading a
 * lesson or review are idle; their saved position survives a reload.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ExerciseDefinition } from '../core/types/exercise';
import { exerciseFingerprint } from '../data/exercises/exerciseFingerprint';
import { registerWorkInProgress } from '../services/workInProgress';
import { MODULE_INDEX } from '../data/moduleIndex';
import { isFresh, LEARN_SESSION_KEY, LEARN_SESSION_VERSION } from './learnSessionPersistence';

export { isFresh, LEARN_SESSION_KEY, LEARN_SESSION_VERSION, LEARN_SESSION_TTL_MS } from './learnSessionPersistence';

export type Score = 0 | 0.5 | 1;

export interface SavedScreen {
  type: 'module' | 'review';
  levelId: string;
  unitId: string;
  moduleId: string;
  /** The lesson section being read (rail id), when known. */
  section: string | null;
  at: number;
}

/** One finished question of a run (the result screen's material). */
export interface RunItem {
  id: string;
  answers: string[];
  score: Score;
  answer: string;
}

/** Everything the focused check needs to continue exactly where it was. */
export interface RunSnapshot {
  /** Exercise ids in the order they are asked. */
  order: string[];
  index: number;
  scores: Score[];
  items: RunItem[];
  attempt: 1 | 2;
  /** Pitch classes currently selected on a build question. */
  selectedNotes: number[];
  /** Wrong first tries of the current question (struck through). */
  tried: { value: string; words: string }[];
  /** The current question's first miss, in words ('' for a build answer), or null. */
  missed: string | null;
  /** The current question is over (its verdict is showing). */
  final: { score: Score; correct: boolean; explanation: string; expected: string } | null;
}

export interface SavedCheck {
  moduleId: string;
  kind: 'check' | 'review' | 'practice';
  /** The content language the run was answered in. */
  lang: string;
  /**
   * Exercise id → `exerciseFingerprint` of the item AS SERVED in `lang` when
   * the run started (the only key until 2026-11-09; still written, so a tab
   * on the previous version reads a new save as before).
   */
  fingerprints: Record<string, string>;
  /**
   * Exercise id → the ENGLISH item's fingerprint (`sourceFingerprint`), the
   * same in every language. Absent from saves written before 2026-11-09:
   * those are judged by `fingerprints`, as they always were.
   */
  identities?: Record<string, string>;
  run: RunSnapshot;
  /** The run ended (its result screen is showing). */
  finished: boolean;
  at: number;
}

interface LearnSessionState {
  screen: SavedScreen | null;
  check: SavedCheck | null;
  setScreen: (screen: SavedScreen | null) => void;
  setSection: (section: string) => void;
  setCheck: (check: SavedCheck | null) => void;
}

// ─── Shape guard (localStorage is user-editable; never blind-cast it) ───────

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isStr = (v: unknown): v is string => typeof v === 'string';
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const isScore = (v: unknown): v is Score => v === 0 || v === 0.5 || v === 1;
const isStrArr = (v: unknown): v is string[] => Array.isArray(v) && v.every(isStr);

function isScreen(v: unknown): v is SavedScreen {
  return isObj(v) && (v.type === 'module' || v.type === 'review') && isStr(v.levelId) && isStr(v.unitId) && isStr(v.moduleId)
    && (v.section === null || isStr(v.section)) && isNum(v.at)
    && MODULE_INDEX.some((m) => m.id === v.moduleId && m.level === v.levelId && m.unitId === v.unitId);
}

export function isValidRun(v: unknown, finished = false): v is RunSnapshot {
  if (!isObj(v)) return false;
  if (!isStrArr(v.order) || !isNum(v.index) || !Number.isInteger(v.index) || v.index < 0 || v.index >= v.order.length || new Set(v.order).size !== v.order.length) return false;
  if (!Array.isArray(v.scores) || !v.scores.every(isScore) || v.scores.length > v.order.length) return false;
  if (!Array.isArray(v.items) || !v.items.every((i) => isObj(i) && isStr(i.id) && isStrArr(i.answers) && isScore(i.score) && isStr(i.answer))) return false;
  if (v.attempt !== 1 && v.attempt !== 2) return false;
  if (!Array.isArray(v.tried) || !v.tried.every((x) => isObj(x) && isStr(x.value) && isStr(x.words))) return false;
  if (!(v.missed === null || isStr(v.missed))) return false;
  const f = v.final;
  if (!(f === null || (isObj(f) && isScore(f.score) && typeof f.correct === 'boolean' && isStr(f.explanation) && isStr(f.expected)))) return false;
  // v1 has never shipped: extend it in place, with no legacy migration.
  if (!Array.isArray(v.selectedNotes) || !v.selectedNotes.every((n) => Number.isInteger(n) && n >= 0 && n < 12)
    || new Set(v.selectedNotes).size !== v.selectedNotes.length) return false;
  if (v.tried.length !== v.attempt - 1 || (v.attempt === 1 ? v.missed !== null : v.missed === null)) return false;
  const settled = v.index + (f === null ? 0 : 1);
  if (v.scores.length !== settled || v.items.length !== settled) return false;
  for (let i = 0; i < settled; i++) {
    const item = v.items[i];
    if (item.id !== v.order[i] || item.score !== v.scores[i] || item.answers.length < 1 || item.answers.length > 2) return false;
    if (item.score === 1 && item.answers.length !== 1 || item.score === 0.5 && item.answers.length !== 2) return false;
  }
  if (f !== null) {
    const item = v.items[v.index];
    if (f.score !== item.score || f.correct !== (f.score !== 0) || item.answers.length !== v.attempt
      || f.score !== (f.correct ? (v.attempt === 1 ? 1 : 0.5) : 0)
      || !v.tried.every((x, i) => x.words === item.answers[i])) return false;
  }
  return !finished || (v.index === v.order.length - 1 && f !== null);
}

const isKeyMap = (m: unknown, order: string[]): boolean => isObj(m) && Object.values(m).every(isStr) && order.every((id) => isStr(m[id]));

function isCheck(v: unknown): v is SavedCheck {
  return isObj(v) && isStr(v.moduleId) && (v.kind === 'check' || v.kind === 'review' || v.kind === 'practice') && isStr(v.lang)
    && MODULE_INDEX.some((m) => m.id === v.moduleId) && ['en', 'pt', 'es'].includes(v.lang) && typeof v.finished === 'boolean'
    && isValidRun(v.run, v.finished) && isKeyMap(v.fingerprints, v.run.order)
    && (v.identities === undefined || isKeyMap(v.identities, v.run.order)) && isNum(v.at);
}

export function isValidLearnSession(v: unknown): v is { screen: SavedScreen | null; check: SavedCheck | null } {
  return isObj(v) && (v.screen === null || v.screen === undefined || isScreen(v.screen)) && (v.check === null || v.check === undefined || isCheck(v.check));
}

const EMPTY = { screen: null, check: null };

export const useLearnSessionStore = create<LearnSessionState>()(
  persist(
    (set) => ({
      ...EMPTY,
      setScreen: (screen) => set({ screen }),
      setSection: (section) => set((s) => (s.screen && s.screen.section !== section ? { screen: { ...s.screen, section, at: Date.now() } } : s)),
      setCheck: (check) => set({ check }),
    }),
    {
      name: LEARN_SESSION_KEY,
      version: LEARN_SESSION_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ screen: s.screen, check: s.check }),
      // No older format exists; anything from another version starts empty.
      migrate: (persisted, version) => (version === LEARN_SESSION_VERSION && isValidLearnSession(persisted) ? persisted : EMPTY) as LearnSessionState,
      merge: (persisted, current) => {
        if (!isValidLearnSession(persisted)) return { ...current, ...EMPTY };
        return { ...current, screen: persisted.screen ?? null, check: persisted.check ?? null };
      },
    },
  ),
);

// ─── Freshness ──────────────────────────────────────────────────────────────

/** The saved screen, if it is still worth restoring. */
export function restorableScreen(now = Date.now()): SavedScreen | null {
  const s = useLearnSessionStore.getState().screen;
  return s && isScreen(s) && isFresh(s.at, now) ? s : null;
}

/** Fingerprints of a run's exercises as served (saved when it starts). */
export function fingerprintsOf(exercises: readonly ExerciseDefinition[]): Record<string, string> {
  return Object.fromEntries(exercises.map((ex) => [ex.id, exerciseFingerprint(ex)]));
}

/**
 * An exercise's language-independent identity: its English item's
 * fingerprint, which the loader puts on every served item. An item built
 * without the loader falls back to its own fingerprint — the same thing in
 * English; in PT/ES it never matches a saved English one, so the check is
 * dropped (the safe side).
 */
export const identityOf = (ex: ExerciseDefinition): string => ex.sourceFingerprint ?? exerciseFingerprint(ex);

/** Identities of a run's exercises (saved when it starts). */
export function identitiesOf(exercises: readonly ExerciseDefinition[]): Record<string, string> {
  return Object.fromEntries(exercises.map((ex) => [ex.id, identityOf(ex)]));
}

/** The labels a question's options carry as their values (multiple choice; ear chord / scale / progression). */
function labelledChoices(ex: ExerciseDefinition): { label: string; correct: boolean }[] | null {
  const c = ex.config;
  if (c.type === 'multiple_choice') return c.choices;
  if (c.type === 'ear_training' && c.mode !== 'melody' && c.choices) return c.choices;
  return null;
}

/**
 * The current question's tried options are saved by VALUE, and on these
 * questions an option's value is its label in the run's language: a wording
 * fix can leave a saved value naming no option, or another one. So a tried
 * value counts only while it is, word for word, an option that is still
 * wrong. Otherwise that question cannot be paired with certainty:
 *  - its verdict showing: the verdict stays (the score is recorded and the
 *    exercise is the same), the unpaired option is simply not struck through;
 *  - mid-retry: the question starts again from its first try — no score was
 *    recorded for it yet, and dropping the whole check (as before) would have
 *    restarted it too. Answered questions and their scores are kept.
 * Other questions' values (notes, numbers, pitches) never depend on wording.
 */
export function pairTriedOptions(run: RunSnapshot, current: ExerciseDefinition): RunSnapshot {
  const choices = labelledChoices(current);
  if (!choices || run.tried.length === 0) return run;
  const wrong = new Set(choices.filter((c) => !c.correct).map((c) => c.label));
  if (run.tried.every((x) => wrong.has(x.value))) return run;
  if (run.final) return { ...run, tried: run.tried.map((x) => (wrong.has(x.value) ? x : { ...x, value: '' })) };
  return { ...run, attempt: 1, tried: [], missed: null, selectedNotes: [] };
}

/**
 * The saved check for this module, if it can continue: fresh, same language,
 * and every saved id still names the same exercise (W4a identity of the
 * English item — a PT/ES wording fix keeps it; a save from before the
 * identities were written is judged as it was then, by the served
 * fingerprints). Returns the run's exercises in their saved order, and the
 * check with the current question's tries paired (`pairTriedOptions`).
 * Anything else drops the save.
 */
export function restorableCheck(moduleId: string, exercises: readonly ExerciseDefinition[], lang: string, now = Date.now()): { check: SavedCheck; ordered: ExerciseDefinition[] } | null {
  const store = useLearnSessionStore.getState();
  const check = store.check;
  if (!check || check.moduleId !== moduleId) return null;
  if (!isCheck(check)) {
    store.setCheck(null);
    return null;
  }
  const byId = new Map(exercises.map((ex) => [ex.id, ex]));
  const ordered = check.run.order.map((id) => byId.get(id));
  const unchanged = ordered.every((ex) => ex && (check.identities
    ? check.identities[ex.id] === identityOf(ex)
    : check.fingerprints[ex.id] === exerciseFingerprint(ex)));
  const cfg = ordered[check.run.index]?.config;
  const validSelection = cfg && (cfg.type === 'chord_build' || cfg.type === 'scale_build' || check.run.selectedNotes.length === 0);
  if (!validSelection || !isFresh(check.at, now) || check.lang !== lang || !unchanged || ordered.length === 0) {
    store.setCheck(null);
    return null;
  }
  const list = ordered as ExerciseDefinition[];
  const restored: SavedCheck = {
    ...check,
    fingerprints: fingerprintsOf(list),
    identities: identitiesOf(list),
    run: pairTriedOptions(check.run, list[check.run.index]),
  };
  store.setCheck(restored);
  return { check: restored, ordered: list };
}

/** True while a check is under way and not finished (W9b asks before a silent update). */
export function learnCheckInProgress(now = Date.now()): boolean {
  const c = useLearnSessionStore.getState().check;
  return !!c && !c.finished && isFresh(c.at, now);
}

// Replace the startup persisted reader: another tab's save must not mask work here.
registerWorkInProgress('learn', () => learnCheckInProgress());
