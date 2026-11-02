import { useMemo, useCallback, useState, useEffect, useRef, useLayoutEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getTuningById, getTuningPitchClasses, getTuningStringLabels, GUITAR_TUNINGS } from '../../core/constants/guitarTunings.ts';
import type { GuitarTuning } from '../../core/constants/guitarTunings.ts';
import { midiToNote } from '../../core/utils/pianoLayout.ts';
import { getChordShapesWithFallback, arrangeShapesForBass, sortShapesForDefault } from '../../core/constants/guitarChordShapes.ts';
import type { FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import {
  getGuitarPosition,
  suggestGuitarPosition,
  scaleDegreeMap,
  fingeringKey,
  toRomanNumeral,
  MAX_POSITION,
  OPEN_POSITION,
} from '../../core/utils/guitarPositions.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { noteToString } from '../../core/types/music.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAudio } from '../../hooks/useAudio.ts';
import { useAppStore } from '../../state/store.ts';
import { useFingeringStore } from '../../state/fingeringStore.ts';
import { useDockContextStore } from '../../state/dockContextStore.ts';
import type { OverrideFinger } from '../../state/fingeringStore.ts';
import { useIsMobile } from '../../hooks/useMediaQuery.ts';
import { useDragScroll } from '../../hooks/useDragScroll.ts';
import { ScrollStrip } from './ScrollStrip.tsx';
import { FULL_FRETS, CHORD_FRET_WINDOW, FRET_MARKERS, DOUBLE_MARKERS, ACCENT_FILL, ON_ACCENT_FILL } from './fretboardConstants.ts';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';
import type { FretNote, PositionDot } from './fretboardConstants.ts';
import { ChordShapeSelector, ScalePositionSelector, LabelToolbar, PositionLegend } from './FretboardPositionSelector.tsx';
import { FretboardString } from './FretboardString.tsx';
import { DockToolsContext } from '../layout/dockTools.ts';
import { useFocusNote, useFocusNoteStore, type FocusNote } from '../../state/focusNoteStore.ts';
import type { FretboardMode } from './FretboardString.tsx';

const EMPTY_POSITION_DOTS = new Map<number, Map<number, PositionDot>>();
const NO_FRETS: ReadonlySet<number> = new Set();
/** Frets the full-neck view draws: 12, or 15 when the position reaches past 12. */
const NECK_FRETS = 12;

export interface FretboardProps {
  /**
   * 'dock' (default): the instrument dock's fretboard. 'neck': the landscape
   * full-neck view (W11-B, D-26 extra) — every fret 1–12 (or 1–15) fits the
   * screen and the rows fill the height; its stepper and label toggle go to
   * the view's header (DockToolsContext).
   */
  variant?: 'dock' | 'neck';
}

export function Fretboard({ variant = 'dock' }: FretboardProps = {}) {
  const neck = variant === 'neck';
  const { t } = useTranslation();
  const { getNoteColor, spellPitchClass, chordPitchClasses } = useKeyContext();
  const { noteOn, noteOff } = useAudio();
  const activeNotes = useAppStore((s) => s.activeNotes);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const chordInversion = useAppStore((s) => s.chordInversion);
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const guitarScalePosition = useAppStore((s) => s.guitarScalePosition);
  const setGuitarScalePosition = useAppStore((s) => s.setGuitarScalePosition);
  const quickSearchOpen = useAppStore((s) => s.quickSearchOpen);
  const guitarTuningId = useAppStore((s) => s.guitarTuningId);
  const setGuitarTuningId = useAppStore((s) => s.setGuitarTuningId);
  const exerciseInputActive = useAppStore((s) => s.exerciseInputActive);
  const overrides = useFingeringStore((s) => s.overrides);
  const labelMode = useFingeringStore((s) => s.labelMode);
  const setLabelMode = useFingeringStore((s) => s.setLabelMode);
  const setOverride = useFingeringStore((s) => s.setOverride);
  const clearOverrides = useFingeringStore((s) => s.clearOverrides);
  const [editMode, setEditMode] = useState(false);
  const phoneWidth = useIsMobile();
  // The neck view is a phone held sideways: phone-sized dots and touch handling.
  const mobile = phoneWidth || neck;
  // Laptop dock: the position stepper and label toggle live in the dock bar.
  const toolsSlot = useContext(DockToolsContext);
  const focus = useFocusNote();
  const setFocus = useFocusNoteStore((s) => s.set);
  const clearFocus = useFocusNoteStore((s) => s.clear);
  const setLocations = useFocusNoteStore((s) => s.setLocations);
  // The linked focus note is Explore's (W11-B); Learn's instrument shows none.
  const exploring = useAppStore((s) => s.view === 'explore');

  const tuning: GuitarTuning = useMemo(() => getTuningById(guitarTuningId), [guitarTuningId]);
  const isStandardTuning = tuning.id === 'standard';
  const tuningPitchClasses = useMemo(() => getTuningPitchClasses(tuning), [tuning]);
  const stringNames = useMemo(() => getTuningStringLabels(tuning), [tuning]);

  // The bass the learner asked for: a slash-chord bass, else the chosen
  // inversion's lowest chord tone (audit W3-11). Root position asks nothing.
  const requestedBass = useMemo(() => {
    if (!selectedChord) return null;
    if (selectedChord.bassNote) return selectedChord.bassNote;
    if (chordInversion > 0 && selectedChord.notes.length > 0) {
      return selectedChord.notes[chordInversion % selectedChord.notes.length];
    }
    return null;
  }, [selectedChord, chordInversion]);

  // ─── Chord shapes (standard tuning only) ─────────────
  const { chordShapes, bassMatched } = useMemo(() => {
    if (exerciseInputActive || !selectedChord || !isStandardTuning) return { chordShapes: [], bassMatched: true };
    // Nut-closest first so the DEFAULT voicing is the familiar one (Cm → the
    // A-shape barre at fret 3), C-/G-shape barres offered after the rest.
    const sorted = sortShapesForDefault(getChordShapesWithFallback(selectedChord));
    // Put a shape with the requested bass first (or say it can't be done).
    const arranged = arrangeShapesForBass(
      sorted,
      selectedChord,
      requestedBass ? getPitchClass(requestedBass) : null,
      requestedBass ? noteToString(requestedBass) : '',
    );
    return { chordShapes: arranged.shapes, bassMatched: arranged.bassMatched };
  }, [selectedChord, isStandardTuning, exerciseInputActive, requestedBass]);

  // The selected shape index belongs to ONE chord. Deriving the reset from
  // the chord (instead of an effect + microtask) means the first render after
  // a chord change already uses shape 0 (audit W3-15).
  const chordKey = useMemo(
    () =>
      selectedChord
        ? JSON.stringify([selectedChord.root, selectedChord.quality, selectedChord.bassNote ?? null, selectedChord.algorithmicDisplayName ?? null, chordInversion])
        : '',
    [selectedChord, chordInversion],
  );
  const [shapeChoice, setShapeChoice] = useState<{ key: string; idx: number }>({ key: '', idx: 0 });
  const selectedShapeIdx = shapeChoice.key === chordKey ? shapeChoice.idx : 0;
  const setSelectedShapeIdx = useCallback((idx: number) => setShapeChoice({ key: chordKey, idx }), [chordKey]);

  const currentShape = chordShapes[selectedShapeIdx] ?? null;

  // ─── Scale positions (any tuning) ────────────────────
  const scaleView = !exerciseInputActive && selectedChord === null;
  const suggestedPosition = useMemo(
    () => suggestGuitarPosition(selectedKey, selectedScale, tuning),
    [selectedKey, selectedScale, tuning],
  );
  const positionChoice: number | 'all' = guitarScalePosition ?? suggestedPosition;
  const positionNumber = scaleView && positionChoice !== 'all' ? positionChoice : null;
  // Tell the dock bar which position is on the board ("Position II", W11-A).
  const publishPosition = useDockContextStore((s) => s.setGuitarPosition);
  useEffect(() => {
    publishPosition(scaleView ? positionChoice : null);
    return () => publishPosition(null);
  }, [scaleView, positionChoice, publishPosition]);
  const position = useMemo(
    () => (positionNumber === null ? null : getGuitarPosition(selectedKey, selectedScale, positionNumber, tuning)),
    [positionNumber, selectedKey, selectedScale, tuning],
  );

  // ─── What the board shows ─────────────────────────────
  let mode: FretboardMode;
  if (exerciseInputActive) mode = 'highlight';
  else if (selectedChord) mode = currentShape ? 'chord' : 'highlight';
  else mode = position ? 'position' : 'scale';
  // Exercise taps (W3-04) or the chord's notes when no shape exists (W3-05)
  // arrive through useKeyContext's chord-highlight channel.
  const highlightPcs = mode === 'highlight' ? chordPitchClasses : null;
  const editing = editMode && mode === 'position';

  // Root pitch class for highlighting root notes (none during an exercise:
  // the key context is suppressed there).
  const rootPitchClass = useMemo(() => {
    if (exerciseInputActive) return null;
    if (selectedChord) return getPitchClass(selectedChord.root);
    return getPitchClass(selectedKey);
  }, [exerciseInputActive, selectedChord, selectedKey]);

  // ─── Position dots (with the learner's fingering, W10-04/05) ─────────
  const keyRootPc = getPitchClass(selectedKey);
  const positionKeys = useMemo(() => {
    if (!position) return [] as string[];
    return position.notes
      .filter((n) => n.fret > 0)
      .map((n) => fingeringKey(selectedScale, tuning.id, position.position, keyRootPc, n.stringIndex, n.fret));
  }, [position, selectedScale, tuning.id, keyRootPc]);
  const hasOverrides = positionKeys.some((k) => k in overrides);

  const positionDots = useMemo(() => {
    if (!position) return EMPTY_POSITION_DOTS;
    const shown = editing ? 'finger' : labelMode;
    const byString = new Map<number, Map<number, PositionDot>>();
    for (const note of position.notes) {
      const key = fingeringKey(selectedScale, tuning.id, position.position, keyRootPc, note.stringIndex, note.fret);
      const override = note.fret > 0 ? overrides[key] : undefined;
      const finger = note.fret === 0 ? 0 : (override ?? note.finger);
      const noteName = noteToString(note.note);
      const label = shown === 'finger' ? String(finger) : shown === 'degree' ? note.degreeLabel : noteName;
      const description = [
        finger === 0 ? t('fretboard.openString') : t('fretboard.fingerN', { finger }),
        note.degreeLabel,
        noteName,
        note.isStretch ? t('fretboard.stretch') : '',
        override !== undefined ? t('fretboard.yourFingering') : '',
      ].filter(Boolean).join(' · ');
      const row = byString.get(note.stringIndex) ?? new Map<number, PositionDot>();
      row.set(note.fret, { label, isRoot: note.isRoot, isStretch: note.isStretch, isEdited: override !== undefined, description });
      byString.set(note.stringIndex, row);
    }
    return byString;
  }, [position, editing, labelMode, overrides, selectedScale, tuning.id, keyRootPc, t]);

  // Whole-neck labels: degree or note name.
  const degreeMap = useMemo(() => scaleDegreeMap(selectedKey, selectedScale), [selectedKey, selectedScale]);
  const scaleLabelFor = useCallback(
    (pc: number) =>
      labelMode === 'degree' ? (degreeMap.get(pc)?.label ?? noteToString(spellPitchClass(pc))) : noteToString(spellPitchClass(pc)),
    [labelMode, degreeMap, spellPitchClass],
  );

  // ─── Voicing lookup (chords) ──────────────────────────
  const voicingLookup = useMemo(() => {
    const map = new Map<number, { fret: number; finger: FingerNumber | undefined } | null>();
    if (!currentShape) return map;

    const { shape, baseFret } = currentShape;
    shape.strings.forEach((pos, stringIndex) => {
      if (pos.fret === null) {
        map.set(stringIndex, null);
      } else {
        const absoluteFret = baseFret + (pos.fret as number);
        map.set(stringIndex, { fret: absoluteFret, finger: pos.finger });
      }
    });
    return map;
  }, [currentShape]);

  // ─── Dynamic fret range ───────────────────────────────
  const { visibleFrets, isZoomed } = useMemo(() => {
    const range = (start: number, end: number) => {
      const frets: number[] = [];
      for (let f = end; f >= start; f--) frets.push(f);
      return frets;
    };
    if (neck) {
      // The whole neck at once: frets 1–12, or 1–15 when the position or
      // the chord shape reaches past the 12th fret.
      let reach = positionNumber !== null ? positionNumber + 4 : 0;
      if (mode === 'chord' && currentShape) {
        for (const pos of currentShape.shape.strings) {
          if (pos.fret !== null) reach = Math.max(reach, currentShape.baseFret + pos.fret);
        }
      }
      return { visibleFrets: range(1, reach > NECK_FRETS ? FULL_FRETS : NECK_FRETS), isZoomed: false };
    }
    if (mode === 'position' && positionNumber !== null) {
      // The 4-fret window plus the stretch fret on each side.
      if (positionNumber === OPEN_POSITION) return { visibleFrets: range(1, 5), isZoomed: true };
      return {
        visibleFrets: range(Math.max(1, positionNumber - 1), Math.min(FULL_FRETS, positionNumber + 4)),
        isZoomed: true,
      };
    }

    if (mode !== 'chord' || !currentShape) {
      return { visibleFrets: range(1, FULL_FRETS), isZoomed: false };
    }

    const { shape, baseFret } = currentShape;
    let minUsed = Infinity;
    let maxUsed = -Infinity;
    shape.strings.forEach((pos) => {
      if (pos.fret !== null) {
        const abs = baseFret + (pos.fret as number);
        if (abs > 0) {
          minUsed = Math.min(minUsed, abs);
          maxUsed = Math.max(maxUsed, abs);
        }
      }
    });

    if (minUsed === Infinity) {
      minUsed = 1;
      maxUsed = 3;
    }

    const start = Math.max(1, minUsed - 1);
    const end = Math.min(FULL_FRETS, Math.max(start + CHORD_FRET_WINDOW - 1, maxUsed + 1));
    return { visibleFrets: range(start, end), isZoomed: true };
  }, [mode, positionNumber, currentShape, neck]);

  // Generate all notes on the fretboard as a Map for O(1) lookup
  const fretNoteMap = useMemo(() => {
    const map = new Map<number, FretNote>();
    for (let s = 0; s < 6; s++) {
      const openPc = tuningPitchClasses[s];
      const openOctave = tuning.strings[s].octave;
      for (let f = 0; f <= FULL_FRETS; f++) {
        const pc = (openPc + f) % 12;
        const midi = 12 + openOctave * 12 + openPc + f;
        map.set(s * 100 + f, { stringIndex: s, fret: f, pitchClass: pc, midiNumber: midi });
      }
    }
    return map;
  }, [tuningPitchClasses, tuning]);

  const getFretNote = useCallback(
    (stringIndex: number, fret: number) => {
      return fretNoteMap.get(stringIndex * 100 + fret)!;
    },
    [fretNoteMap]
  );

  const activeTimeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timeouts = activeTimeouts.current;
    return () => { timeouts.forEach(clearTimeout); };
  }, []);

  const playFretNote = useCallback(
    (fn: FretNote) => {
      const pitched = midiToNote(fn.midiNumber);
      noteOn(pitched, pitched.octave).then(
        (midi) => {
          const t = setTimeout(() => {
            noteOff(midi);
            activeTimeouts.current.delete(t);
          }, 800);
          activeTimeouts.current.add(t);
        },
        (e) => { console.warn('[Fretboard] noteOn failed:', e); }
      );
    },
    [noteOn, noteOff]
  );

  // Tap / Enter on a cell. In fingering-edit mode a fretted position dot
  // cycles its finger 1→2→3→4→1 instead of sounding (W10-05); landing back on
  // the suggested finger removes the override.
  const fretFocus = useCallback((fn: FretNote): FocusNote => ({ pc: fn.pitchClass, midi: fn.midiNumber, source: 'fret' }), []);
  const handleCellActivate = useCallback(
    (fn: FretNote) => {
      setFocus('pinned', fretFocus(fn));
      if (editing && position && fn.fret > 0) {
        const note = position.notes.find((n) => n.stringIndex === fn.stringIndex && n.fret === fn.fret);
        if (note) {
          const key = fingeringKey(selectedScale, tuning.id, position.position, keyRootPc, note.stringIndex, note.fret);
          const current = overrides[key] ?? note.finger;
          const next = ((current % 4) + 1) as OverrideFinger;
          setOverride(key, next === note.finger ? null : next);
          return;
        }
      }
      playFretNote(fn);
    },
    [editing, position, selectedScale, tuning.id, keyRootPc, overrides, setOverride, playFretNote, setFocus, fretFocus],
  );
  // A real mouse over a cell makes it the focus note while it stays there.
  const handleCellHover = useCallback(
    (fn: FretNote | null) => {
      if (fn) setFocus('hover', fretFocus(fn));
      else clearFocus('hover', 'fret');
    },
    [setFocus, clearFocus, fretFocus],
  );

  // ─── Walking positions (W10-07) ───────────────────────
  const stepPosition = useCallback(
    (delta: 1 | -1) => {
      const current = useAppStore.getState().guitarScalePosition ?? suggestedPosition;
      if (current === 'all') {
        setGuitarScalePosition(suggestedPosition);
        return;
      }
      setGuitarScalePosition(Math.min(MAX_POSITION, Math.max(OPEN_POSITION, current + delta)));
    },
    [suggestedPosition, setGuitarScalePosition],
  );

  useEffect(() => {
    if (!scaleView) return;
    // Which way a key steps, or 0. Two routes so PT/ES keyboards work too
    // (review #2): the PHYSICAL keys right of P (event.code BracketLeft/Right,
    // printing "+" / "´" on a PT layout) with no modifier, or "[" / "]" however
    // they are typed — PT/ES need Option (macOS) or AltGr (= Ctrl+Alt on
    // Windows) for them. Cmd is never ours: Cmd+[ is the browser's Back.
    const direction = (e: KeyboardEvent): 1 | -1 | 0 => {
      if (e.metaKey) return 0;
      if (!e.ctrlKey && !e.altKey && (e.code === 'BracketLeft' || e.code === 'BracketRight')) {
        return e.code === 'BracketRight' ? 1 : -1;
      }
      const altGr = e.altKey; // Option alone, or Ctrl+Alt (AltGr)
      if ((e.key === '[' || e.key === ']') && (altGr || !e.ctrlKey)) return e.key === ']' ? 1 : -1;
      return 0;
    };
    const onKey = (e: KeyboardEvent) => {
      const dir = direction(e);
      if (dir === 0) return;
      if (useAppStore.getState().quickSearchOpen) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      e.preventDefault();
      stepPosition(dir);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [scaleView, stepPosition]);

  // Position labels for chord shapes
  const positionLabels = useMemo(() => {
    const baseLabels = chordShapes.map(({ shape, baseFret }) => {
      if (shape.shortName) return shape.shortName;
      return baseFret === 0 ? t('fretboard.chordOpen') : t('fretboard.chordFret', { fret: baseFret });
    });
    const counts = new Map<string, number>();
    for (const l of baseLabels) counts.set(l, (counts.get(l) ?? 0) + 1);
    const indexTracker = new Map<string, number>();
    return baseLabels.map((l) => {
      const total = counts.get(l) ?? 1;
      if (total === 1) return l;
      const idx = (indexTracker.get(l) ?? 0) + 1;
      indexTracker.set(l, idx);
      return `${l} #${idx}`;
    });
  }, [chordShapes, t]);

  // ─── Drag-to-scroll (desktop mouse) ───────────────────
  // Shared with the mobile scroll strip via useDragScroll. On desktop the
  // press starts on the scroll container itself, so the hook falls back to
  // document listeners (capturing the container would swallow per-fret pointer
  // events). The mobile strip below captures on its own handle instead.
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragScroll = useDragScroll(scrollContainerRef, { threshold: 5, button: 0 });

  const handleFretboardClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragScroll.consumeDragged()) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, [dragScroll]);

  // ─── Barre bar measurement ────────────────────────────
  const fretboardRef = useRef<HTMLDivElement>(null);
  const [barreStyle, setBarreStyle] = useState<React.CSSProperties | null>(null);

  useLayoutEffect(() => {
    if (!fretboardRef.current || mode !== 'chord' || !currentShape?.shape.barreInfo) {
      // DOM measurement has to run after layout; the result can't be derived
      // during render, so the state is set from this layout effect (before paint).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBarreStyle(null);
      return;
    }

    const { barreInfo } = currentShape.shape;
    const barreFret = currentShape.baseFret + barreInfo.fret;

    const fromRow = 6 - barreInfo.fromString;
    const toRow = 6 - barreInfo.toString;
    const topRow = Math.min(fromRow, toRow);
    const bottomRow = Math.max(fromRow, toRow);

    const container = fretboardRef.current;
    const containerRect = container.getBoundingClientRect();

    const topCell = container.querySelector(`[data-string-row="${topRow}"][data-fret="${barreFret}"]`);
    const bottomCell = container.querySelector(`[data-string-row="${bottomRow}"][data-fret="${barreFret}"]`);

    if (!topCell || !bottomCell) {
      setBarreStyle(null);
      return;
    }

    const topRect = topCell.getBoundingClientRect();
    const bottomRect = bottomCell.getBoundingClientRect();

    setBarreStyle({
      position: 'absolute',
      left: topRect.left - containerRect.left + topRect.width / 2 - 12,
      top: topRect.top - containerRect.top + topRect.height / 2 - 12,
      width: 24,
      height: bottomRect.top - topRect.top + 24,
      borderRadius: 12,
      // Theme tokens: translucent white vanished on the light theme's cream.
      backgroundColor: 'var(--accent-dim)',
      border: '3px solid var(--text-muted)',
      pointerEvents: 'none',
      zIndex: 5,
    });
  }, [mode, currentShape, visibleFrets]);

  // ─── Keyboard navigation (roving tabindex on 2D grid) ─
  const [focusedCell, setFocusedCell] = useState<{ stringIdx: number; fret: number } | null>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (quickSearchOpen) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const { key } = e;
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' ', 'Escape'].includes(key)) return;

      e.preventDefault();

      if (key === 'Escape') {
        setFocusedCell(null);
        scrollContainerRef.current?.focus();
        return;
      }

      setFocusedCell((prev) => {
        // Initialize focus at first visible cell if none selected
        if (!prev) {
          const initFret = visibleFrets[visibleFrets.length - 1] ?? 1;
          return { stringIdx: 0, fret: initFret };
        }

        if (key === 'Enter' || key === ' ') {
          const fn = getFretNote(prev.stringIdx, prev.fret);
          handleCellActivate(fn);
          return prev;
        }

        let { stringIdx, fret } = prev;
        const minFret = visibleFrets[visibleFrets.length - 1] ?? 0;
        const maxFret = visibleFrets[0] ?? FULL_FRETS;

        if (key === 'ArrowRight') fret = Math.min(fret + 1, maxFret);
        if (key === 'ArrowLeft') fret = Math.max(fret - 1, minFret);
        if (key === 'ArrowUp') stringIdx = Math.max(stringIdx - 1, 0);
        if (key === 'ArrowDown') stringIdx = Math.min(stringIdx + 1, 5);

        return { stringIdx, fret };
      });
    },
    [quickSearchOpen, visibleFrets, getFretNote, handleCellActivate]
  );

  // Announce the focused note for screen readers, with the context-aware
  // spelling that matches the visible cell label.
  const announcedNote = focusedCell
    ? t('fretboard.announce', {
        string: 6 - focusedCell.stringIdx,
        fret: focusedCell.fret,
        note: noteToString(spellPitchClass(getFretNote(focusedCell.stringIdx, focusedCell.fret).pitchClass)),
      })
    : '';

  // The keyboard's cell is the focus note while the board has focus.
  useEffect(() => {
    if (focusedCell) setFocus('keyboard', fretFocus(getFretNote(focusedCell.stringIdx, focusedCell.fret)));
    else clearFocus('keyboard', 'fret');
  }, [focusedCell, getFretNote, setFocus, clearFocus, fretFocus]);

  // ─── Linked focus note (W11-B, D-25) ─────────────────
  // Which cells light for the focus note: among the cells showing a dot, the
  // exact pitch if it is there, else its pitch class; only when no dot
  // matches, any visible cell (a note outside the scale / chord).
  const showsDot = useCallback(
    (fn: FretNote): boolean => {
      if (mode === 'chord') {
        const v = voicingLookup.get(fn.stringIndex);
        return !!v && v.fret === fn.fret;
      }
      if (mode === 'position') return positionDots.get(fn.stringIndex)?.has(fn.fret) ?? false;
      if (mode === 'scale') return getNoteColor(midiToNote(fn.midiNumber)) !== undefined;
      return highlightPcs?.has(fn.pitchClass) ?? false;
    },
    [mode, voicingLookup, positionDots, getNoteColor, highlightPcs],
  );
  const focusCells = useMemo(() => {
    const byString = new Map<number, Set<number>>();
    const list: FretNote[] = [];
    if (!focus || exerciseInputActive || !exploring) return { byString, list };
    const all: FretNote[] = [];
    for (let st = 0; st < 6; st++) for (const f of [0, ...visibleFrets]) all.push(getFretNote(st, f));
    const pick = (pool: FretNote[]) => {
      if (focus.midi !== undefined) {
        const exact = pool.filter((fn) => fn.midiNumber === focus.midi);
        if (exact.length) return exact;
      }
      return pool.filter((fn) => fn.pitchClass === focus.pc);
    };
    let lit = pick(all.filter(showsDot));
    if (lit.length === 0) lit = pick(all);
    for (const fn of lit) {
      const row = byString.get(fn.stringIndex) ?? new Set<number>();
      row.add(fn.fret);
      byString.set(fn.stringIndex, row);
      list.push(fn);
    }
    return { byString, list };
  }, [focus, exerciseInputActive, exploring, visibleFrets, getFretNote, showsDot]);

  // Tell the read-out where the note is: "string 5 fret 2, string 2 open".
  useEffect(() => {
    if (!focus || focusCells.list.length === 0) {
      setLocations(null);
      return;
    }
    const words = focusCells.list
      .slice(0, 4)
      .map((fn) => (fn.fret === 0
        ? t('explore.readout.stringOpen', { string: 6 - fn.stringIndex })
        : t('explore.readout.stringFret', { string: 6 - fn.stringIndex, fret: fn.fret })));
    if (focusCells.list.length > 4) words.push('…');
    setLocations({ instrument: 'guitar', items: words });
  }, [focus, focusCells, setLocations, t]);
  useEffect(() => () => setLocations(null), [setLocations]);

  // Auto-scroll the focused cell into view.
  useEffect(() => {
    if (!focusedCell) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const cell = container.querySelector<HTMLElement>(
      `[data-string-row="${focusedCell.stringIdx}"][data-fret="${focusedCell.fret}"]`
    );
    if (cell) {
      cell.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }
  }, [focusedCell]);

  // Open the board at the NUT end on first paint. The board renders nut-RIGHT
  // (settled orientation — Nuno's explicit call, 2026-06-09; do not flip), so
  // scrollLeft 0 shows the HIGH frets and the playing-start position (nut,
  // open strings, frets 0-5) sits at the far right. Without this, the
  // fretboard opens at the wrong end of the neck. Zoomed views (a chord shape
  // or a position) fit without scrolling, so this runs whenever the board
  // opens onto the whole neck — on mount, or on switching to "All".
  useLayoutEffect(() => {
    if (isZoomed) return;
    const el = scrollContainerRef.current;
    if (el) el.scrollLeft = el.scrollWidth - el.clientWidth;
  }, [isZoomed]);

  // ─── Full-neck view: rows fill the screen's height ───
  const [neckRow, setNeckRow] = useState(40);
  useLayoutEffect(() => {
    const el = scrollContainerRef.current;
    if (!neck || !el || typeof ResizeObserver === 'undefined') return;
    // Fret-marker row + fret-number row + padding ≈ 60 px; the rest is strings.
    const measure = () => setNeckRow(Math.max(30, Math.min(64, Math.floor((el.clientHeight - 60) / 6))));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [neck]);

  // ─── Display state ────────────────────────────────────
  const isOpenChordShape = mode === 'chord' && currentShape !== null && currentShape.baseFret === 0;
  const lowestVisibleFret = visibleFrets[visibleFrets.length - 1];
  const atNut = lowestVisibleFret === 1;

  // Chord view: the fret the hand anchors on — the lowest fretted note of the
  // shape (the barre fret for barre chords), shown as a "3fr" badge.
  // Position view: the position's Roman numeral over the index-finger fret.
  const chordAnchorFret = useMemo(() => {
    if (mode !== 'chord' || !currentShape || isOpenChordShape) return null;
    let min = Infinity;
    for (const pos of currentShape.shape.strings) {
      if (pos.fret !== null) {
        const abs = currentShape.baseFret + pos.fret;
        if (abs > 0) min = Math.min(min, abs);
      }
    }
    return min === Infinity ? null : min;
  }, [mode, currentShape, isOpenChordShape]);
  const positionAnchorFret = mode === 'position' && positionNumber !== null && positionNumber > 0 ? positionNumber : null;
  const anchorFret = chordAnchorFret ?? positionAnchorFret;

  const fretMinWidth = neck
    ? 0
    : isZoomed
      ? (mobile ? 40 : 56)
      : (mobile ? 36 : 44);

  const badgeStyle: React.CSSProperties = {
    fontSize: 12,
    color: ON_ACCENT_FILL,
    backgroundColor: ACCENT_FILL,
    lineHeight: '18px',
  };

  // Notice when a chord has no shape to draw (alternate tunings, W3-05), or
  // when no shape can put the requested bass lowest (W3-11).
  const chordNotice = mode === 'highlight' && selectedChord && !exerciseInputActive
    ? (isStandardTuning ? t('fretboard.noChordShape') : t('fretboard.chordShapesStandardOnly'))
    : mode === 'chord' && !bassMatched && requestedBass
      ? t('fretboard.bassNotice', { bass: noteToString(requestedBass) })
      : null;
  // Positions in tunings with strings a 5th apart skip the note the hand cannot reach.
  const tuningGapNotice = mode === 'position' && position !== null && position.skippedMidi.length > 0
    ? t('fretboard.tuningGapNotice')
    : null;

  // Laptop dock: the stepper and the label toggle go into the dock bar;
  // full-neck view: into its header (with the chord-shape chips).
  const barTools = !!toolsSlot && scaleView && !neck;
  const neckTools = !!toolsSlot && neck;
  const positionSelector = scaleView ? (
    <ScalePositionSelector
      position={positionChoice}
      onSelect={(p) => setGuitarScalePosition(p)}
      onStep={stepPosition}
      mobile={mobile || barTools}
      fullRow={!barTools && !neck}
    />
  ) : null;
  const labelToolbar = (part: 'all' | 'labels' | 'edit') => (
    <LabelToolbar
      part={part}
      labelMode={labelMode}
      onLabelMode={setLabelMode}
      positionView={mode === 'position'}
      editing={editing}
      onToggleEdit={() => setEditMode((v) => !v)}
      onResetFingering={() => clearOverrides(positionKeys)}
      hasOverrides={hasOverrides}
    />
  );

  return (
    <div
      className={neck ? 'w-full h-full flex flex-col' : 'w-full flex flex-col'}
      style={{ backgroundColor: 'var(--bg)', borderTop: neck ? undefined : '1px solid var(--border-subtle)' }}
    >
      {barTools && toolsSlot && createPortal(<>{positionSelector}{labelToolbar('labels')}</>, toolsSlot)}
      {neckTools && toolsSlot && createPortal(
        <>
          {mode === 'chord' && (
            <ChordShapeSelector
              shapeCount={chordShapes.length}
              labels={positionLabels}
              selectedIdx={selectedShapeIdx}
              onSelect={setSelectedShapeIdx}
            />
          )}
          {positionSelector}
          {scaleView && labelToolbar('labels')}
        </>,
        toolsSlot,
      )}
      {/* Controls — outside the scrolling board so they never scroll away.
          On a phone they come AFTER the board, so the strings are what the
          sheet shows first at Half (W11-A review). */}
      {!exerciseInputActive && !neck && (
        <div className="fretboard-controls px-4 max-sm:px-2 pt-2 max-sm:pb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 max-sm:order-last">
          {mode === 'chord' && (
            <ChordShapeSelector
              shapeCount={chordShapes.length}
              labels={positionLabels}
              selectedIdx={selectedShapeIdx}
              onSelect={setSelectedShapeIdx}
            />
          )}
          {!barTools && positionSelector}
          {scaleView && labelToolbar(barTools ? 'edit' : 'all')}

          {/* Tuning selector — a compact native <select> (one control, so the
              toolbar stays short; review B1). On phones it only appears once a
              non-standard tuning is in use, as before. */}
          {!(mobile && isStandardTuning) && (
            <label className="flex items-center gap-2">
              <span className="text-ui" style={{ color: 'var(--text-muted)' }}>{t('fretboard.tuning')}</span>
              <SelectTrigger
                value={guitarTuningId}
                onChange={(e) => setGuitarTuningId(e.target.value)}
                aria-label={t('fretboard.tuningLabel')}
              >
                {GUITAR_TUNINGS.map((tn) => (
                  <option key={tn.id} value={tn.id}>{tn.shortName}</option>
                ))}
              </SelectTrigger>
            </label>
          )}

          {scaleView && mode === 'position' && <PositionLegend />}

          {(chordNotice || tuningGapNotice) && (
            <p role="status" className="w-full text-ui" style={{ color: 'var(--text-muted)' }}>
              {chordNotice ?? tuningGapNotice}
            </p>
          )}
        </div>
      )}

    <div
      ref={scrollContainerRef}
      role="grid"
      aria-label={t('fretboard.label')}
      tabIndex={0}
      className={`w-full overflow-x-auto fretboard-scroll focus:outline-none${neck ? ' flex-1 min-h-0' : ''}`}
      style={{
        cursor: mobile ? undefined : 'grab',
        scrollbarWidth: 'none',
        userSelect: 'none',
        backgroundColor: 'var(--bg)',
        // Mobile: the container is still scrollable (strip / keyboard / scrollbar
        // drive it) but a finger landing on a fret must NOT scroll — the cells
        // carry touch-action:none so a tap fires instantly. pan-x here would let
        // the browser arbitrate fret taps as scrolls again (the WS12 bug).
        ...(mobile ? { touchAction: 'none', WebkitOverflowScrolling: 'touch' } : {}),
      }}
      onPointerDown={mobile ? undefined : dragScroll.onPointerDown}
      onClickCapture={mobile ? undefined : handleFretboardClickCapture}
      onKeyDown={handleKeyDown}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) clearFocus('keyboard', 'fret');
      }}
    >
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcedNote}
      </div>

      {/* A laptop's docked guitar loses 8 px of padding (the workbench fits 1440×900). */}
      <div className="px-4 max-sm:px-2 py-2 min-[1200px]:py-1" style={{ minWidth: isZoomed || neck ? 0 : (mobile ? 660 : 800) }}>
        {/* Fret markers row — carries the loud position badge in chord/position view */}
        <div className="flex mb-1 items-center">
          <div style={{ width: 32 }} />
          <div className="flex flex-1">
            {visibleFrets.map((f) => (
              <div
                key={f}
                className="flex-1 text-center"
                style={{ color: 'var(--text-dim)', minWidth: fretMinWidth, fontSize: 12 }}
              >
                {anchorFret === f ? (
                  chordAnchorFret !== null ? (
                    <span className="inline-block px-1.5 rounded font-bold font-mono" style={badgeStyle}>
                      {f}fr
                    </span>
                  ) : (
                    <span
                      data-testid="position-badge"
                      title={f === 1 ? t('fretboard.positionOneTitle') : t('fretboard.positionTitle', { numeral: toRomanNumeral(f), fret: f })}
                      className="inline-block px-1.5 rounded font-bold"
                      style={badgeStyle}
                    >
                      {toRomanNumeral(f)}
                    </span>
                  )
                ) : FRET_MARKERS.includes(f) ? (
                  <span>{DOUBLE_MARKERS.includes(f) ? '••' : '•'}</span>
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
          <div style={{ width: 6 }} />
          <div style={{ width: 40 }} className="flex items-center justify-center">
            {mode === 'position' && positionNumber === OPEN_POSITION && (
              <span
                data-testid="position-badge"
                title={t('fretboard.openPositionTitle')}
                className="inline-block px-1 rounded font-bold"
                style={badgeStyle}
              >
                {t('fretboard.open')}
              </span>
            )}
          </div>
        </div>

        {/* Fretboard grid with barre overlay */}
        <div ref={fretboardRef} className="relative">
          {/* Continuous fret lines overlay */}
          <div className="absolute inset-0 flex pointer-events-none" style={{ zIndex: 1, left: 32, right: 46 }}>
            {visibleFrets.map((f) => (
              <div
                key={f}
                className="flex-1"
                style={{ minWidth: fretMinWidth, borderRight: '1px solid var(--border)' }}
              />
            ))}
          </div>

          {/* Barre bar overlay */}
          {barreStyle && <div data-testid="barre-overlay" style={barreStyle} />}

          {/* Strings: 6th (low E) at top → 1st (high E) at bottom */}
          {[0, 1, 2, 3, 4, 5].map((stringIdx) => (
            <FretboardString
              key={stringIdx}
              stringIdx={stringIdx}
              visibleFrets={visibleFrets}
              fretMinWidth={fretMinWidth}
              mobile={mobile}
              isChordView={isZoomed}
              atNut={atNut}
              mode={mode}
              stringName={stringNames[stringIdx]}
              activeNotes={activeNotes}
              rootPitchClass={rootPitchClass}
              getNoteColor={getNoteColor}
              spellPitchClass={spellPitchClass}
              getFretNote={getFretNote}
              onCellActivate={handleCellActivate}
              currentShape={mode === 'chord' ? currentShape : null}
              voicingLookup={voicingLookup}
              positionDots={positionDots.get(stringIdx)}
              scaleLabelFor={scaleLabelFor}
              highlightPcs={highlightPcs}
              focusedFret={focusedCell?.stringIdx === stringIdx ? focusedCell.fret : null}
              focusFrets={focusCells.byString.get(stringIdx) ?? NO_FRETS}
              onCellHover={mobile ? undefined : handleCellHover}
              rowHeight={neck ? neckRow : undefined}
            />
          ))}
        </div>

        {/* Fret numbers row — larger when zoomed; the anchor fret is accented */}
        <div className="flex mt-1">
          <div style={{ width: 32 }} />
          <div className="flex flex-1">
            {visibleFrets.map((f) => (
              <div
                key={f}
                className="flex-1 text-center"
                style={{
                  color: anchorFret === f ? ACCENT_FILL : 'var(--text-dim)',
                  fontWeight: anchorFret === f ? 700 : 400,
                  minWidth: fretMinWidth,
                  fontSize: 12,
                }}
              >
                {f}
              </div>
            ))}
          </div>
          <div style={{ width: atNut ? 6 : 2 }} />
          <div style={{ width: 40 }} className="flex items-center justify-center">
            {mode === 'chord' && !isOpenChordShape ? (
              <span className="font-mono" style={{ color: 'var(--text-dim)', fontSize: 12 }}>{lowestVisibleFret}fr</span>
            ) : atNut ? (
              <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>0</span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    {/* Mobile: dedicated scroll handle. The fretboard surface owns its touches
        (taps fire notes), so reaching other positions happens here, via the
        position chips, or (desktop) wheel/drag. */}
    {mobile && !neck && <ScrollStrip containerRef={scrollContainerRef} label={t('fretboard.label')} />}
    </div>
  );
}
