import { create } from 'zustand';

/**
 * The LINKED FOCUS NOTE (W11-B, decision D-25): the pitch under the learner's
 * pointer, keyboard focus or last tap — on the staff strip, a chord tone, a
 * piano key or a fret. Every surface that draws notes lights the same pitch
 * class (the exact pitch where it shows one), and the instrument read-out in
 * the dock bar names it.
 *
 * Three slots, so a mouse passing over a note never loses what was tapped:
 *   hover    — a real mouse over a note (cleared when it leaves)
 *   keyboard — the note that has keyboard focus (cleared on blur)
 *   pinned   — the last note tapped / clicked / played (kept until another
 *              note is pinned, the key or scale changes, or the view changes)
 * The note in effect is hover ?? keyboard ?? pinned.
 *
 * Instruments publish where the note lights on them (`locations`: "string 5
 * fret 2", "B4"), so the read-out can say it. Display state only: never
 * persisted, kept out of the main store like dockContextStore.
 */
export type FocusSource = 'staff' | 'chord' | 'piano' | 'fret' | 'practice';
export type FocusSlot = 'hover' | 'keyboard' | 'pinned';

export interface FocusNote {
  /** Pitch class 0–11. */
  pc: number;
  /** The exact pitch (MIDI) when the source has one (a staff note, a key, a fret). */
  midi?: number;
  source: FocusSource;
  /** The touched cell: several strings can play the same MIDI pitch. */
  cell?: { stringIndex: number; fret: number };
}

/** Where the focus note lights on the instrument, already worded. */
export interface FocusLocations {
  instrument: 'piano' | 'guitar';
  /** Display strings, e.g. "B4" or "string 5 fret 2". */
  items: string[];
}

interface FocusNoteState {
  hover: FocusNote | null;
  keyboard: FocusNote | null;
  pinned: FocusNote | null;
  locations: FocusLocations | null;
  set: (slot: FocusSlot, note: FocusNote) => void;
  /** Clear a slot — only when it still holds a note from `source` (if given). */
  clear: (slot: FocusSlot, source?: FocusSource) => void;
  clearAll: () => void;
  setLocations: (l: FocusLocations | null) => void;
}

const same = (a: FocusNote | null, b: FocusNote | null) =>
  a === b || (!!a && !!b && a.pc === b.pc && a.midi === b.midi && a.source === b.source &&
    a.cell?.stringIndex === b.cell?.stringIndex && a.cell?.fret === b.cell?.fret);

export const useFocusNoteStore = create<FocusNoteState>((set, get) => ({
  hover: null,
  keyboard: null,
  pinned: null,
  locations: null,
  set: (slot, note) => {
    if (same(get()[slot], note)) return;
    set({ [slot]: note } as Pick<FocusNoteState, FocusSlot>);
  },
  clear: (slot, source) => {
    const cur = get()[slot];
    if (!cur || (source && cur.source !== source)) return;
    set({ [slot]: null } as Pick<FocusNoteState, FocusSlot>);
  },
  clearAll: () => set({ hover: null, keyboard: null, pinned: null }),
  setLocations: (locations) => {
    const cur = get().locations;
    if (cur === locations) return;
    if (cur && locations && cur.instrument === locations.instrument && cur.items.join('|') === locations.items.join('|')) return;
    set({ locations });
  },
}));

/** The note in effect: hover ?? keyboard ?? pinned. */
export const selectFocusNote = (s: Pick<FocusNoteState, FocusSlot>): FocusNote | null =>
  s.hover ?? s.keyboard ?? s.pinned;

/** The focus note, from React. */
export function useFocusNote(): FocusNote | null {
  return useFocusNoteStore(selectFocusNote);
}

/**
 * Which of `candidates` (MIDI numbers an instrument or staff shows) the focus
 * note lights: the exact pitch when the focus has one and it is among them,
 * otherwise every candidate of the same pitch class ("exact pitch where
 * meaningful": the staff's B4 lights B4 on the piano, but on a guitar in open
 * position, where B4 is not drawn, it lights the B on string 5 and string 2).
 */
export function focusMatches(focus: FocusNote | null, candidates: Iterable<number>): Set<number> {
  const out = new Set<number>();
  if (!focus) return out;
  const all = [...candidates];
  if (focus.midi !== undefined && all.includes(focus.midi)) {
    out.add(focus.midi);
    return out;
  }
  for (const m of all) if (((m % 12) + 12) % 12 === focus.pc) out.add(m);
  return out;
}
