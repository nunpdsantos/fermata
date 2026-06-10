/**
 * Zustand store for drill mode — persisted SRS state, active session, settings, and
 * lifetime stats. Mirrors progressStore.ts (WS6 pattern): create + persist, version,
 * migrate + merge with shape validation. All randomness is injected (no Math.random /
 * Date.now inside the store).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DRILL_FAMILIES } from '../core/types/drill';
import type { DrillFamily, DrillItem, ItemSrsState } from '../core/types/drill';
import { applyAnswer } from '../services/drillScheduler';
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
}

// ─── Shape Guards ──────────────────────────────────────────────────────────────

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isValidItemSrsState(v: unknown): v is ItemSrsState {
  if (!isPlainObject(v)) return false;
  if (!isPlainObject(v.card)) return false;
  if (!Array.isArray(v.history)) return false;
  if (typeof v.tier !== 'string') return false;
  return true;
}

function isValidItemsRecord(v: unknown): v is Record<string, ItemSrsState> {
  if (!isPlainObject(v)) return false;
  return Object.values(v).every(isValidItemSrsState);
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
  if (!Array.isArray(v.queue)) return false;
  if (typeof v.index !== 'number') return false;
  if (typeof v.asked !== 'number') return false;
  if (typeof v.correct !== 'number') return false;
  if (typeof v.startedAt !== 'number') return false;
  if (typeof v.seed !== 'number') return false;
  if (!isPlainObject(v.missRequeues)) return false;
  return true;
}

/** Full persisted shape guard — returns null on any mismatch (caller falls back). */
function validatePersistedShape(value: unknown): {
  items: Record<string, ItemSrsState>;
  settings: DrillSettings;
  sprintBests: Record<string, number>;
  lifetime: { answered: number; correct: number };
  activeSession: ActiveSession | null;
} | null {
  if (!isPlainObject(value)) return null;

  // items
  const items = isValidItemsRecord(value.items) ? value.items : null;
  if (items === null) return null;

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

  // sprintBests
  const sprintBests = isPlainObject(value.sprintBests)
    ? (value.sprintBests as Record<string, number>)
    : {};

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

          // Deterministic rand for requeue positions — uses seed + asked (answers so far)
          const rand = mulberry32(s.seed + s.asked);

          // (b) Requeue logic
          let newQueue = s.queue;
          const newMissRequeues = { ...s.missRequeues };

          if (!correct) {
            // Miss: requeue up to 2 times per item per session
            const requeues = s.missRequeues[item.id] ?? 0;
            if (requeues < 2) {
              newQueue = requeueAfterMiss(s.queue, s.index, item.id, rand);
              newMissRequeues[item.id] = requeues + 1;
            }
          } else if (prevItemState === undefined) {
            // First correct on a brand-new (tier 'new') item → second exposure
            newQueue = requeueSecondExposure(s.queue, s.index, item.id, rand);
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
              index: s.index + 1,
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
    }),
    {
      name: DRILL_STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Persist everything — mid-session app kill must resume losslessly
      partialize: (state) => ({
        items: state.items,
        settings: state.settings,
        sprintBests: state.sprintBests,
        lifetime: state.lifetime,
        activeSession: state.activeSession,
      }),
      migrate: (persisted: unknown, _version: number) => {
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
