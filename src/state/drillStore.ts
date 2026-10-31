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
}

export interface DrillSettings extends SessionConfig {
  sound: boolean;      // default true
  showTimer: boolean;  // default false
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

  startSession: (bank: DrillItem[], now: number) => void;
  recordAnswer: (item: DrillItem, correct: boolean, ms: number, now: number) => void;
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

/** Full persisted shape guard — returns null on any mismatch (caller falls back). */
export function validatePersistedShape(value: unknown): {
  items: Record<string, ItemSrsState>;
  settings: DrillSettings;
  sprintBests: Record<string, number>;
  lifetime: { answered: number; correct: number };
  activeSession: ActiveSession | null;
} | null {
  if (!isPlainObject(value)) return null;

  // items — per-entry: a broken item is dropped, never the whole record
  const items = sanitizeItems(value.items);

  // settings — fill missing fields with defaults rather than rejecting
  let settings: DrillSettings;
  if (isValidSettings(value.settings)) {
    settings = value.settings as DrillSettings;
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

  // activeSession — null it if malformed
  const activeSession =
    value.activeSession === null || value.activeSession === undefined
      ? null
      : isValidActiveSession(value.activeSession)
        ? value.activeSession
        : null;

  return { items, settings, sprintBests, lifetime, activeSession };
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

      startSession: (bank, now) => {
        const { settings, items } = get();
        const seed = now % 0x80000000; // now % 2^31 — deterministic
        const id = `s${now}`;
        const queue = composeSession(bank, items, settings, now, seed);
        set({
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
        });
      },

      recordAnswer: (item, correct, ms, now) => {
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
            },
          };
        });
      },

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
        }),

      resetDrillProgress: () =>
        set((prev) => ({
          items: {},
          sprintBests: {},
          lifetime: INITIAL_LIFETIME,
          activeSession: null,
          // Preserve the user's settings intact.
          settings: prev.settings,
        })),
    }),
    {
      name: DRILL_STORE_KEY,
      // v2 (W7): first-answer "by heart" rule — v1 tiers are re-judged in migrate.
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Persist everything — mid-session app kill must resume losslessly
      partialize: (state) => ({
        items: state.items,
        settings: state.settings,
        sprintBests: state.sprintBests,
        lifetime: state.lifetime,
        activeSession: state.activeSession,
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
          };
        }
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
          };
        }
        return { ...current, ...validated };
      },
    },
  ),
);
