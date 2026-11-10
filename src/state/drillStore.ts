/**
 * Zustand store for drill mode — persisted SRS state, active session, settings, and
 * lifetime stats. Mirrors progressStore.ts (WS6 pattern): create + persist, version,
 * migrate + merge with shape validation. All randomness is injected (no Math.random /
 * Date.now inside the store).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DRILL_FAMILIES } from '../core/types/drill';
import type {
  AnswerRecord,
  DrillFamily,
  DrillItem,
  ItemSrsState,
  MasteryTier,
  SerializedCard,
} from '../core/types/drill';
import { applyAnswer, migrateTierV1 } from '../services/drillScheduler';
import {
  composeSession,
  requeueAfterMiss,
  requeueSecondExposure,
  type SessionConfig,
} from '../services/drillSession';
import { setDrillWorkStateReader } from './drillWork';
import { mulberry32 } from '../core/utils/prng';

// ─── Public Types ──────────────────────────────────────────────────────────────

export interface ActiveSession {
  id: string;         // `s${startedAt}`
  queue: string[];
  index: number;      // pointer to current question position in queue
  asked: number;      // questions asked so far (counts requeued repeats)
  correct: number;
  startedAt: number;
  seed: number;
  missRequeues: Record<string, number>; // per-item miss-requeue count for this session
  /**
   * v3 (W9b): the answered question whose verdict is on screen, until
   * Continue / the auto-advance — so a reload resumes ON it, not past it.
   * Absent / null = answering the question at `index`.
   */
  feedback?: SessionFeedback | null;
  /** v3 (W9b): this session's tally for the summary (absent = nothing yet). */
  log?: SessionLog;
}

/** The verdict on screen for an answered question (W9b). */
export interface SessionFeedback {
  itemId: string;
  correct: boolean;
  nearMiss: boolean;
}

/** Per-family answered tally for one session. */
export interface FamilySessionTally {
  asked: number;
  correct: number;
}

/**
 * A session's summary data: per-family breakdown and tier-up crossings. Was
 * kept in memory by the runner (a reload lost it); persisted since v3.
 */
export interface SessionLog {
  correct: number;
  asked: number;
  /** Only families that were actually answered this session appear here. */
  byFamily: Partial<Record<DrillFamily, FamilySessionTally>>;
  /** Count of answered items whose tier crossed UP into 'byHeart' this session. */
  newlyByHeart: number;
  /** Count of answered items whose tier crossed UP into 'review' this session. */
  newlyReview: number;
}

export function emptySessionLog(): SessionLog {
  return { correct: 0, asked: 0, byFamily: {}, newlyByHeart: 0, newlyReview: 0 };
}

/** Sprint length in seconds (the 60s timed mode). */
export const SPRINT_SECONDS = 60;

/**
 * A Sprint under way (v3, W9b) — written by SprintRunner as it runs, so a
 * reload resumes the same run: same questions in the same order, same score,
 * same time left. Leaving the app also saves; a crash while visible resumes
 * from the last save, up to 5 s earlier. null = no Sprint open.
 */
export interface SprintRun {
  /** Mount seed: lap re-shuffles derive from it. */
  seed: number;
  /** The shuffled pool, as item ids. */
  pool: string[];
  /** Questions answered so far (drives the pool index). */
  step: number;
  correct: number;
  /** 0 = finished (the score screen). */
  secondsLeft: number;
  familiesKey: string;
  /** The best for this topic mix BEFORE the run (for "New best!"). */
  priorBest: number;
  /** The final score was recorded (never record twice after a reload). */
  recorded: boolean;
}

export interface DrillSettings extends SessionConfig {
  sound: boolean;      // default true
  showTimer: boolean;  // default false
  /**
   * "Follow my lessons" (wave 2): Drill asks only about what the completed
   * lessons open. OPTIONAL, saved only once it says something: absent = never
   * set, and the value in force is derived (services/drillFollow.ts
   * `followInForce`: on for a 'new' / 'player' learner with no Drill history,
   * off for everyone else). Written when the learner touches the switch, or by
   * their first session. Persist stays v3 (as `introDone`, no version bump);
   * a save without it is written back without it.
   */
  followLessons?: boolean;
}

/** What the view hands startSession (wave 2): the follow switch in force and its pool. */
export interface StartSessionOptions {
  /** The switch's value in force; saved by the FIRST session when the learner never set it. */
  followLessons?: boolean;
  /**
   * While following: what the completed lessons open (data/drillUnlocks.ts
   * `isItemUnlocked`); facts already scheduled stay in as well. null/absent =
   * the topic choices, as before.
   */
  unlocked?: ((item: DrillItem) => boolean) | null;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FAMILIES: Record<DrillFamily, boolean> = Object.fromEntries(
  DRILL_FAMILIES.map((f) => [f, true]),
) as Record<DrillFamily, boolean>;

export const DEFAULT_SETTINGS: DrillSettings = {
  length: 24,
  newPerSession: 4,
  families: DEFAULT_FAMILIES,
  sound: true,
  showTimer: false,
};

const INITIAL_LIFETIME = { answered: 0, correct: 0 };

// ─── Store Interface ───────────────────────────────────────────────────────────

interface DrillStoreState {
  items: Record<string, ItemSrsState>;
  settings: DrillSettings;
  sprintBests: Record<string, number>;
  lifetime: { answered: number; correct: number };
  activeSession: ActiveSession | null;
  sprint: SprintRun | null;
  /**
   * The first-visit intro has been passed (brief 2026-11-09): set when any
   * session starts, so it is never shown again. Added to the v3 save without a
   * version bump — a save without it derives it from its history.
   */
  introDone: boolean;

  startSession: (bank: DrillItem[], now: number, options?: StartSessionOptions) => void;
  /**
   * Record an answer: SRS update, requeue, counters, the session log, and the
   * verdict now on screen (`feedback`, cleared by clearFeedback()).
   */
  recordAnswer: (item: DrillItem, correct: boolean, ms: number, now: number, nearMiss?: boolean) => void;
  /** The verdict leaves the screen (Continue / auto-advance). */
  clearFeedback: () => void;
  /** Save (or, with null, close) the Sprint under way. */
  saveSprint: (run: SprintRun | null) => void;
  endSession: () => void;
  updateSettings: (patch: Partial<DrillSettings>) => void;
  recordSprint: (familiesKey: string, score: number) => void;
  resetDrillData: () => void;
  /** Clears progress (items, sprintBests, lifetime, activeSession) but keeps settings. */
  resetDrillProgress: () => void;
}

// ─── Shape Guards ──────────────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

const TIERS: readonly MasteryTier[] = ['new', 'learning', 'review', 'byHeart'];

/** Ordinal rank of a tier, for detecting an upward crossing. */
const TIER_RANK: Record<MasteryTier, number> = { new: 0, learning: 1, review: 2, byHeart: 3 };

function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

/**
 * A stored FSRS card, or null when it cannot be scheduled. The fields FSRS
 * reasons with (due, stability, difficulty, reps, lapses, state) are required;
 * the bookkeeping counters default to 0 rather than costing the item.
 */
function sanitizeCard(v: unknown): SerializedCard | null {
  if (!isPlainObject(v)) return null;
  const required = ['due', 'stability', 'difficulty', 'reps', 'lapses', 'state'] as const;
  if (!required.every((k) => isFiniteNumber(v[k]))) return null;
  const n = (k: string) => (isFiniteNumber(v[k]) ? v[k] : 0);
  return {
    due: v.due as number,
    stability: v.stability as number,
    difficulty: v.difficulty as number,
    elapsed_days: n('elapsed_days'),
    scheduled_days: n('scheduled_days'),
    reps: v.reps as number,
    lapses: v.lapses as number,
    state: v.state as number,
    learning_steps: n('learning_steps'),
    ...(isFiniteNumber(v.last_review) ? { last_review: v.last_review } : {}),
  };
}

function isValidAnswerRecord(v: unknown): v is AnswerRecord {
  return (
    isPlainObject(v) &&
    isFiniteNumber(v.ts) &&
    typeof v.correct === 'boolean' &&
    isFiniteNumber(v.ms) &&
    typeof v.sessionId === 'string'
  );
}

/**
 * One stored item, cleaned, or null when it is unusable (no schedulable card,
 * no history array, unknown tier). Malformed history records are dropped one
 * by one; the item survives with the rest (audit W7-10).
 */
function sanitizeItemSrsState(v: unknown): ItemSrsState | null {
  if (!isPlainObject(v)) return null;
  const card = sanitizeCard(v.card);
  if (card === null) return null;
  if (!Array.isArray(v.history)) return null;
  if (!(TIERS as readonly unknown[]).includes(v.tier)) return null;
  return {
    card,
    history: v.history.filter(isValidAnswerRecord),
    tier: v.tier as MasteryTier,
    ...(typeof v.introSessionId === 'string' ? { introSessionId: v.introSessionId } : {}),
    introCorrectCount: isFiniteNumber(v.introCorrectCount) ? v.introCorrectCount : 0,
  };
}

/**
 * Keep every valid item; drop only the broken ones (audit W7-10 — one bad
 * record used to discard ALL Drill progress). A non-object `items` → {}.
 */
function sanitizeItems(v: unknown): Record<string, ItemSrsState> {
  if (!isPlainObject(v)) return {};
  const out: Record<string, ItemSrsState> = {};
  for (const [id, raw] of Object.entries(v)) {
    const item = sanitizeItemSrsState(raw);
    if (item !== null) out[id] = item;
  }
  return out;
}

function isValidSettings(v: unknown): v is DrillSettings {
  if (!isPlainObject(v)) return false;
  if (!([12, 24, 40] as unknown[]).includes(v.length)) return false;
  if (typeof v.newPerSession !== 'number') return false;
  if (!isPlainObject(v.families)) return false;
  if (typeof v.sound !== 'boolean') return false;
  if (typeof v.showTimer !== 'boolean') return false;
  // Optional (wave 2); a malformed one sends the settings down the partial path, which drops it.
  if (v.followLessons !== undefined && typeof v.followLessons !== 'boolean') return false;
  return true;
}

function isValidActiveSession(v: unknown): v is ActiveSession {
  if (!isPlainObject(v)) return false;
  if (typeof v.id !== 'string') return false;
  if (!Array.isArray(v.queue) || !v.queue.every((x) => typeof x === 'string')) return false;
  if (typeof v.index !== 'number') return false;
  if (typeof v.asked !== 'number') return false;
  if (typeof v.correct !== 'number') return false;
  if (typeof v.startedAt !== 'number') return false;
  if (typeof v.seed !== 'number') return false;
  if (!isPlainObject(v.missRequeues)) return false;
  return true;
}

function sanitizeFeedback(v: unknown): SessionFeedback | null {
  if (!isPlainObject(v)) return null;
  if (typeof v.itemId !== 'string' || typeof v.correct !== 'boolean' || typeof v.nearMiss !== 'boolean') return null;
  return { itemId: v.itemId, correct: v.correct, nearMiss: v.nearMiss };
}

function isCount(v: unknown): v is number {
  return isFiniteNumber(v) && v >= 0;
}

function sanitizeLog(v: unknown): SessionLog | undefined {
  if (!isPlainObject(v) || !isPlainObject(v.byFamily)) return undefined;
  if (![v.correct, v.asked, v.newlyByHeart, v.newlyReview].every(isCount)) return undefined;
  const byFamily: Partial<Record<DrillFamily, FamilySessionTally>> = {};
  for (const [family, tally] of Object.entries(v.byFamily)) {
    if (!(DRILL_FAMILIES as readonly string[]).includes(family)) continue;
    if (isPlainObject(tally) && isCount(tally.asked) && isCount(tally.correct)) {
      byFamily[family as DrillFamily] = { asked: tally.asked, correct: tally.correct };
    }
  }
  return {
    correct: v.correct as number,
    asked: v.asked as number,
    byFamily,
    newlyByHeart: v.newlyByHeart as number,
    newlyReview: v.newlyReview as number,
  };
}

/**
 * A stored session, cleaned, or null when its core fields are unusable. A
 * malformed v3 `feedback` / `log` is dropped on its own — never the session.
 */
function sanitizeActiveSession(v: unknown): ActiveSession | null {
  if (!isValidActiveSession(v)) return null;
  const { id, queue, index, asked, correct, startedAt, seed, missRequeues } = v;
  const feedback = sanitizeFeedback(v.feedback);
  const log = sanitizeLog(v.log);
  return {
    id, queue, index, asked, correct, startedAt, seed, missRequeues,
    ...(feedback ? { feedback } : {}),
    ...(log ? { log } : {}),
  };
}

/** A stored Sprint, or null when it cannot be resumed as it was. */
export function sanitizeSprint(v: unknown): SprintRun | null {
  if (!isPlainObject(v)) return null;
  if (!Array.isArray(v.pool) || v.pool.length === 0 || !v.pool.every((x) => typeof x === 'string')) return null;
  if (![v.seed, v.step, v.correct, v.priorBest].every(isCount)) return null;
  if (!isCount(v.secondsLeft) || (v.secondsLeft as number) > SPRINT_SECONDS) return null;
  if (typeof v.familiesKey !== 'string' || typeof v.recorded !== 'boolean') return null;
  return {
    seed: v.seed as number,
    pool: v.pool as string[],
    step: v.step as number,
    correct: v.correct as number,
    secondsLeft: v.secondsLeft as number,
    familiesKey: v.familiesKey,
    priorBest: v.priorBest as number,
    recorded: v.recorded,
  };
}

/** Full persisted shape guard — returns null on any mismatch (caller falls back). */
export function validatePersistedShape(value: unknown): {
  items: Record<string, ItemSrsState>;
  settings: DrillSettings;
  sprintBests: Record<string, number>;
  lifetime: { answered: number; correct: number };
  activeSession: ActiveSession | null;
  sprint: SprintRun | null;
  introDone: boolean;
} | null {
  if (!isPlainObject(value)) return null;

  // items — per-entry: a broken item is dropped, never the whole record
  const items = sanitizeItems(value.items);

  // settings — fill missing fields with defaults rather than rejecting
  let settings: DrillSettings;
  if (isValidSettings(value.settings)) {
    settings = { ...value.settings, families: { ...DEFAULT_FAMILIES, ...value.settings.families } };
  } else if (isPlainObject(value.settings)) {
    // Partial settings: fill missing primitives from defaults
    const s = value.settings;
    settings = {
      length: ([12, 24, 40] as unknown[]).includes(s.length)
        ? (s.length as 12 | 24 | 40)
        : DEFAULT_SETTINGS.length,
      newPerSession: typeof s.newPerSession === 'number'
        ? s.newPerSession
        : DEFAULT_SETTINGS.newPerSession,
      families: isPlainObject(s.families)
        ? { ...DEFAULT_FAMILIES, ...(s.families as Record<DrillFamily, boolean>) }
        : DEFAULT_FAMILIES,
      sound: typeof s.sound === 'boolean' ? s.sound : DEFAULT_SETTINGS.sound,
      showTimer: typeof s.showTimer === 'boolean' ? s.showTimer : DEFAULT_SETTINGS.showTimer,
      // Kept only when it says something; absent stays absent (never `undefined`).
      ...(typeof s.followLessons === 'boolean' ? { followLessons: s.followLessons } : {}),
    };
  } else {
    settings = DEFAULT_SETTINGS;
  }

  // sprintBests — keep the numeric entries
  const sprintBests: Record<string, number> = {};
  if (isPlainObject(value.sprintBests)) {
    for (const [k, best] of Object.entries(value.sprintBests)) {
      if (isFiniteNumber(best)) sprintBests[k] = best;
    }
  }

  // lifetime
  const lt = value.lifetime;
  const lifetime =
    isPlainObject(lt) &&
    typeof lt.answered === 'number' &&
    typeof lt.correct === 'number'
      ? { answered: lt.answered, correct: lt.correct }
      : INITIAL_LIFETIME;

  // activeSession — null it if malformed (its v3 extras: dropped one by one)
  const activeSession = sanitizeActiveSession(value.activeSession);

  // sprint (v3) — absent in older saves; a malformed one is closed
  const sprint = sanitizeSprint(value.sprint);

  // introDone — absent in saves made before the intro: any drill history
  // (an answer, a session, a Sprint) means the learner already knows Drill.
  const introDone = typeof value.introDone === 'boolean'
    ? value.introDone
    : Object.keys(items).length > 0 || lifetime.answered > 0 || activeSession !== null
      || sprint !== null || Object.keys(sprintBests).length > 0;

  return { items, settings, sprintBests, lifetime, activeSession, sprint, introDone };
}

/**
 * Persist v1 → v2 (decision D-15, audit W7-01/W7-05): "by heart" now counts
 * only the FIRST answer of each session and needs ≥ 2 calendar days. Stored
 * v1 tiers are re-judged from each item's own history (never promoted; see
 * migrateTierV1). Cards, histories, settings and counters are kept as they are.
 */
function migrateItemsFromV1(items: Record<string, ItemSrsState>): Record<string, ItemSrsState> {
  const out: Record<string, ItemSrsState> = {};
  for (const [id, state] of Object.entries(items)) {
    out[id] = { ...state, tier: migrateTierV1(state) };
  }
  return out;
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/**
 * A session is complete when the question target is reached or the queue is
 * exhausted. The store never auto-ends — the UI checks this and shows the
 * summary, then calls endSession() once the user moves on.
 */
export function isSessionComplete(session: ActiveSession, settings: DrillSettings): boolean {
  return session.asked >= settings.length || session.index >= session.queue.length;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const DRILL_STORE_KEY = 'fermata-drill-v1';

export const useDrillStore = create<DrillStoreState>()(
  persist(
    (set, get) => ({
      items: {},
      settings: DEFAULT_SETTINGS,
      sprintBests: {},
      lifetime: INITIAL_LIFETIME,
      activeSession: null,
      sprint: null,
      introDone: false,

      startSession: (bank, now, options) => {
        const { settings, items, introDone } = get();
        const seed = now % 0x80000000; // now % 2^31 — deterministic
        const id = `s${now}`;
        const queue = composeSession(bank, items, settings, now, seed, undefined, options?.unlocked ?? null);
        // The first session saves the follow switch's value in force (it is
        // derived from "no Drill history", which this session ends). Later
        // sessions, and a learner who set it, write nothing new.
        const saveFollow = !introDone && settings.followLessons === undefined && options?.followLessons !== undefined;
        set({
          ...(saveFollow ? { settings: { ...settings, followLessons: options.followLessons } } : {}),
          activeSession: {
            id,
            queue,
            index: 0,
            asked: 0,
            correct: 0,
            startedAt: now,
            seed,
            missRequeues: {},
          },
          introDone: true,
        });
      },

      recordAnswer: (item, correct, ms, now, nearMiss = false) => {
        const state = get();
        const session = state.activeSession;

        if (!session) {
          console.warn('[drillStore] recordAnswer called with no active session — no-op');
          return;
        }

        set((prev) => {
          const s = prev.activeSession!;

          // (a) Update item SRS state
          const prevItemState = prev.items[item.id];
          const newItemState = applyAnswer(prevItemState, correct, ms, now, s.id);

          // Where the answered item really sits. Normally the pointer; after an
          // app update the persisted queue can hold ids the bank no longer has,
          // and the runner then shows the first KNOWN id after the pointer —
          // advancing from the stale head would show that item again (W7-09).
          const found = s.queue.indexOf(item.id, s.index);
          const at = found === -1 ? s.index : found;

          // Deterministic rand for requeue positions — uses seed + asked (answers so far)
          const rand = mulberry32(s.seed + s.asked);

          // (b) Requeue logic
          let newQueue = s.queue;
          const newMissRequeues = { ...s.missRequeues };

          if (!correct) {
            // Miss: requeue up to 2 times per item per session
            const requeues = s.missRequeues[item.id] ?? 0;
            if (requeues < 2) {
              newQueue = requeueAfterMiss(s.queue, at, item.id, rand);
              // Count only a real requeue: with no non-adjacent slot left the
              // queue comes back unchanged (never re-asked twice in a row).
              if (newQueue.length > s.queue.length) newMissRequeues[item.id] = requeues + 1;
            }
          } else if (prevItemState === undefined) {
            // First correct on a brand-new (tier 'new') item → second exposure
            newQueue = requeueSecondExposure(s.queue, at, item.id, rand);
          }

          // (c) Advance counters + lifetime
          const newAsked = s.asked + 1;
          const newCorrect = s.correct + (correct ? 1 : 0);

          // (d) The session log (summary breakdown + tier-up crossings).
          const log = s.log ?? emptySessionLog();
          const family = log.byFamily[item.family] ?? { asked: 0, correct: 0 };
          const tierBefore = prevItemState?.tier ?? 'new';
          const tierAfter = newItemState.tier;
          const tierUp = TIER_RANK[tierAfter] > TIER_RANK[tierBefore];
          const newLog: SessionLog = {
            asked: log.asked + 1,
            correct: log.correct + (correct ? 1 : 0),
            byFamily: {
              ...log.byFamily,
              [item.family]: { asked: family.asked + 1, correct: family.correct + (correct ? 1 : 0) },
            },
            newlyByHeart: log.newlyByHeart + (tierUp && tierAfter === 'byHeart' ? 1 : 0),
            newlyReview: log.newlyReview + (tierUp && tierAfter === 'review' ? 1 : 0),
          };

          return {
            items: { ...prev.items, [item.id]: newItemState },
            lifetime: {
              answered: prev.lifetime.answered + 1,
              correct: prev.lifetime.correct + (correct ? 1 : 0),
            },
            activeSession: {
              ...s,
              queue: newQueue,
              index: at + 1,
              asked: newAsked,
              correct: newCorrect,
              missRequeues: newMissRequeues,
              feedback: { itemId: item.id, correct, nearMiss },
              log: newLog,
            },
          };
        });
      },

      clearFeedback: () =>
        set((prev) =>
          prev.activeSession?.feedback ? { activeSession: { ...prev.activeSession, feedback: null } } : prev,
        ),

      saveSprint: (run) => set({ sprint: run }),

      endSession: () => set({ activeSession: null }),

      updateSettings: (patch) =>
        set((prev) => ({
          settings: { ...prev.settings, ...patch },
        })),

      recordSprint: (familiesKey, score) =>
        set((prev) => ({
          sprintBests: {
            ...prev.sprintBests,
            [familiesKey]: Math.max(prev.sprintBests[familiesKey] ?? 0, score),
          },
        })),

      resetDrillData: () =>
        set({
          items: {},
          settings: DEFAULT_SETTINGS,
          sprintBests: {},
          lifetime: INITIAL_LIFETIME,
          activeSession: null,
          sprint: null,
          introDone: false,
        }),

      resetDrillProgress: () =>
        set((prev) => ({
          items: {},
          sprintBests: {},
          lifetime: INITIAL_LIFETIME,
          activeSession: null,
          sprint: null,
          // Preserve the user's settings intact.
          settings: prev.settings,
        })),
    }),
    {
      name: DRILL_STORE_KEY,
      // v2 (W7): first-answer "by heart" rule — v1 tiers are re-judged in migrate.
      // v3 (W9b): a reload resumes exactly — the session keeps the verdict on
      // screen (`feedback`) and its summary tally (`log`), and a Sprint under
      // way is saved (`sprint`). Older saves load as they are: no verdict
      // showing, an empty tally, no Sprint open.
      version: 3,
      storage: createJSONStorage(() => localStorage),
      // Persist every store change. SprintRunner also saves on pagehide /
      // hidden; a visible crash resumes its last save (up to 5 s earlier).
      partialize: (state) => ({
        items: state.items,
        settings: state.settings,
        sprintBests: state.sprintBests,
        lifetime: state.lifetime,
        activeSession: state.activeSession,
        sprint: state.sprint,
        introDone: state.introDone,
      }),
      migrate: (persisted: unknown, version: number) => {
        // Any version mismatch or corrupt data → attempt shape rescue or fall back
        const validated = validatePersistedShape(persisted);
        if (!validated) {
          return {
            items: {},
            settings: DEFAULT_SETTINGS,
            sprintBests: {},
            lifetime: INITIAL_LIFETIME,
            activeSession: null,
            sprint: null,
            introDone: false,
          };
        }
        // v2 → v3 needs nothing beyond the shape rescue: the new fields are
        // optional (feedback, log) or default to closed (sprint).
        if (version < 2) return { ...validated, items: migrateItemsFromV1(validated.items) };
        return validated;
      },
      // zustand skips migrate() when the stored version matches — corrupt same-version
      // data must be caught here on the merge path.
      merge: (persisted, current) => {
        const validated = validatePersistedShape(persisted);
        if (!validated) {
          return {
            ...current,
            items: {},
            settings: DEFAULT_SETTINGS,
            sprintBests: {},
            lifetime: INITIAL_LIFETIME,
            activeSession: null,
            sprint: null,
            introDone: false,
          };
        }
        return { ...current, ...validated };
      },
    },
  ),
);

// Once loaded, this tab's session wins over another tab's localStorage writes.
setDrillWorkStateReader(useDrillStore.getState);
