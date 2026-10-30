/**
 * Left-hand fingering overrides for the guitar positions (audit W10-05,
 * decision D-03), plus the fretboard dot-label preference.
 *
 * The generated fingering (one finger per fret, src/core/utils/guitarPositions)
 * is the default; any finger the learner sets here — typically the teacher's —
 * replaces it and becomes what the fretboard shows. Only differences from the
 * suggestion are stored. Keys come from `fingeringKey()` (scale type, tuning,
 * position relative to the root, string, fret relative to the position).
 *
 * Persisted separately from the main store (like drillStore / progressStore),
 * with a per-entry shape guard on both the migrate and merge paths, and
 * included in the backup file (utils/backupHelpers.ts).
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SCALE_FORMULAS } from '../core/constants/scales.ts';

export const FINGERING_STORE_KEY = 'fermata-fingering-v1';

export type OverrideFinger = 1 | 2 | 3 | 4;
/** What the fretboard dots show: left-hand finger, scale degree, or note name. */
export type FretboardLabelMode = 'finger' | 'degree' | 'note';

const LABEL_MODES: readonly FretboardLabelMode[] = ['finger', 'degree', 'note'];
const DEFAULT_LABEL_MODE: FretboardLabelMode = 'finger';

interface FingeringPersisted {
  overrides: Record<string, OverrideFinger>;
  labelMode: FretboardLabelMode;
}

export interface FingeringStoreState extends FingeringPersisted {
  /** Set an override, or clear it with null. */
  setOverride: (key: string, finger: OverrideFinger | null) => void;
  /** "Reset to suggested" for a set of keys (the position on screen). */
  clearOverrides: (keys: string[]) => void;
  setLabelMode: (mode: FretboardLabelMode) => void;
}

const POSITION_SEGMENT = /^(open|p)(\d|1[01])$/;

/** Structural check of a key made by fingeringKey(). */
export function isValidFingeringKey(key: unknown): key is string {
  if (typeof key !== 'string') return false;
  const parts = key.split('|');
  if (parts.length !== 5) return false;
  const [scaleType, tuningId, pos, stringIdx, fret] = parts;
  if (!Object.hasOwn(SCALE_FORMULAS, scaleType)) return false;
  if (!/^[a-z0-9-]{1,32}$/.test(tuningId)) return false;
  if (!POSITION_SEGMENT.test(pos)) return false;
  if (!/^[0-5]$/.test(stringIdx)) return false;
  if (!/^-?\d{1,2}$/.test(fret)) return false;
  const f = Number(fret);
  return f >= -1 && f <= 15;
}

function isOverrideFinger(v: unknown): v is OverrideFinger {
  return v === 1 || v === 2 || v === 3 || v === 4;
}

/** Per-entry guard: bad entries are dropped, good ones kept. Never throws. */
function sanitize(persisted: unknown): FingeringPersisted {
  const out: FingeringPersisted = { overrides: {}, labelMode: DEFAULT_LABEL_MODE };
  if (typeof persisted !== 'object' || persisted === null || Array.isArray(persisted)) return out;
  const p = persisted as Record<string, unknown>;
  const raw = p.overrides;
  if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (isValidFingeringKey(k) && isOverrideFinger(v)) out.overrides[k] = v;
    }
  }
  if (typeof p.labelMode === 'string' && (LABEL_MODES as readonly string[]).includes(p.labelMode)) {
    out.labelMode = p.labelMode as FretboardLabelMode;
  }
  return out;
}

export const useFingeringStore = create<FingeringStoreState>()(
  persist(
    (set) => ({
      overrides: {},
      labelMode: DEFAULT_LABEL_MODE,
      setOverride: (key, finger) =>
        set((s) => {
          if (!isValidFingeringKey(key)) return s;
          if (finger === null) {
            if (!(key in s.overrides)) return s;
            const next = { ...s.overrides };
            delete next[key];
            return { overrides: next };
          }
          if (!isOverrideFinger(finger)) return s;
          return { overrides: { ...s.overrides, [key]: finger } };
        }),
      clearOverrides: (keys) =>
        set((s) => {
          const next = { ...s.overrides };
          for (const k of keys) delete next[k];
          return { overrides: next };
        }),
      setLabelMode: (mode) => set((s) => ((LABEL_MODES as readonly string[]).includes(mode) ? { labelMode: mode } : s)),
    }),
    {
      name: FINGERING_STORE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ overrides: s.overrides, labelMode: s.labelMode }),
      migrate: (persisted: unknown) => sanitize(persisted),
      // zustand skips migrate() when the version matches — corrupt
      // same-version data is caught here on the merge path.
      merge: (persisted, current) => ({ ...current, ...sanitize(persisted) }),
    },
  ),
);
