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
 * changed (W4a's exercise identity), or in another content language (the
 * saved answers are in the old one's words); an expired or malformed save is
 * simply dropped. Scores themselves are recorded in the progress store as each
 * question is answered — this only lets the run itself continue.
 *
 * It registers 'learn' with workInProgress: a lesson (or review) open in
 * Learn — reading a section counts, a silent reload would move the learner —
 * or a check under way and not finished is work an update should not reload
 * under. The Learn overview and level lists are not.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ExerciseDefinition } from '../core/types/exercise';
import { exerciseFingerprint } from '../data/exercises/exerciseFingerprint';
import { registerWorkInProgress } from '../services/workInProgress';
import { useAppStore } from './store';

export const LEARN_SESSION_KEY = 'fermata-learn-session-v1';
export const LEARN_SESSION_VERSION = 1;
/** A saved lesson position or check older than this is not restored. */
export const LEARN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

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
  /** Exercise id → identity when the run started. */
  fingerprints: Record<string, string>;
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
    && (v.section === null || isStr(v.section)) && isNum(v.at);
}

function isRun(v: unknown): v is RunSnapshot {
  if (!isObj(v)) return false;
  if (!isStrArr(v.order) || !isNum(v.index) || v.index < 0 || v.index > v.order.length) return false;
  if (!Array.isArray(v.scores) || !v.scores.every(isScore) || v.scores.length > v.order.length) return false;
  if (!Array.isArray(v.items) || !v.items.every((i) => isObj(i) && isStr(i.id) && isStrArr(i.answers) && isScore(i.score) && isStr(i.answer))) return false;
  if (v.attempt !== 1 && v.attempt !== 2) return false;
  if (!Array.isArray(v.tried) || !v.tried.every((x) => isObj(x) && isStr(x.value) && isStr(x.words))) return false;
  if (!(v.missed === null || isStr(v.missed))) return false;
  const f = v.final;
  if (!(f === null || (isObj(f) && isScore(f.score) && typeof f.correct === 'boolean' && isStr(f.explanation) && isStr(f.expected)))) return false;
  return true;
}

function isCheck(v: unknown): v is SavedCheck {
  return isObj(v) && isStr(v.moduleId) && (v.kind === 'check' || v.kind === 'review' || v.kind === 'practice') && isStr(v.lang)
    && isObj(v.fingerprints) && Object.values(v.fingerprints).every(isStr) && isRun(v.run) && typeof v.finished === 'boolean' && isNum(v.at);
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

export const isFresh = (at: number, now = Date.now()) => now - at >= 0 && now - at < LEARN_SESSION_TTL_MS;

/** The saved screen, if it is still worth restoring. */
export function restorableScreen(now = Date.now()): SavedScreen | null {
  const s = useLearnSessionStore.getState().screen;
  return s && isFresh(s.at, now) ? s : null;
}

/** Fingerprints of a run's exercises (saved when it starts). */
export function fingerprintsOf(exercises: readonly ExerciseDefinition[]): Record<string, string> {
  return Object.fromEntries(exercises.map((ex) => [ex.id, exerciseFingerprint(ex)]));
}

/**
 * The saved check for this module, if it can continue: fresh, same language,
 * and every saved id still names the same exercise (W4a identity). Returns the
 * run's exercises in their saved order. Anything else drops the save.
 */
export function restorableCheck(moduleId: string, exercises: readonly ExerciseDefinition[], lang: string, now = Date.now()): { check: SavedCheck; ordered: ExerciseDefinition[] } | null {
  const check = useLearnSessionStore.getState().check;
  if (!check || check.moduleId !== moduleId) return null;
  const byId = new Map(exercises.map((ex) => [ex.id, ex]));
  const ordered = check.run.order.map((id) => byId.get(id));
  const unchanged = ordered.every((ex) => ex && check.fingerprints[ex.id] === exerciseFingerprint(ex));
  if (!isFresh(check.at, now) || check.lang !== lang || !unchanged || ordered.length === 0) {
    useLearnSessionStore.getState().setCheck(null);
    return null;
  }
  return { check, ordered: ordered as ExerciseDefinition[] };
}

/** True while a check is under way and not finished (W9b asks before a silent update). */
export function learnCheckInProgress(now = Date.now()): boolean {
  const c = useLearnSessionStore.getState().check;
  return !!c && !c.finished && isFresh(c.at, now);
}

/**
 * True while the learner is in a lesson or review in Learn (the app on Learn
 * and a lesson screen saved and fresh), or a check is under way — what a
 * silent update must not reload under (W9b).
 */
export function learnInProgress(now = Date.now()): boolean {
  if (learnCheckInProgress(now)) return true;
  return useAppStore.getState().view === 'learn' && restorableScreen(now) !== null;
}

registerWorkInProgress('learn', () => learnInProgress());
