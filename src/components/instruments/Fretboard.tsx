import { useMemo, useCallback, useState, useEffect, useRef, useLayoutEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { getTuningById, getTuningPitchClasses, getTuningStringLabels, GUITAR_TUNINGS, hasChordShapes } from '../../core/constants/guitarTunings.ts';
import type { GuitarTuning } from '../../core/constants/guitarTunings.ts';
import { midiToNote } from '../../core/utils/pianoLayout.ts';
import { chordShapesForCapo } from '../../core/constants/guitarChordShapes.ts';
import type { FingerNumber } from '../../core/constants/guitarChordShapes.ts';
import {
  getGuitarPosition,
  suggestGuitarPosition,
  scaleDegreeMap,
  fingeringKey,
  toRomanNumeral,
  OPEN_POSITION,
  GUITAR_MAX_FRET,
  capoPositions,
  positionForCapo,
} from '../../core/utils/guitarPositions.ts';
import type { PositionNote } from '../../core/utils/guitarPositions.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { noteToString } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAudio } from '../../hooks/useAudio.ts';
import { useAppStore } from '../../state/store.ts';
import { useFingeringStore } from '../../state/fingeringStore.ts';
import { useDockContextStore } from '../../state/dockContextStore.ts';
import { useGuitarShapeStore } from '../../state/guitarShapeStore.ts';
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
import { FretboardExercise, type FretboardExerciseProps } from './FretboardExercise.tsx';
import type { FretboardMode } from './FretboardString.tsx';
import { useNeckOrientation, fretsAcross, stringsDown, drawnNeighbour, nutScrollLeft } from './neckOrientation.ts';
import { useExploreCapo } from './capoView.ts';
import { CapoControl } from './CapoControl.tsx';
import { chordSymbol } from '../explore/focusReadout.ts';

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

export function Fretboard(props: FretboardProps | { exercise: FretboardExerciseProps } = {}) {
  if ('exercise' in props) return <FretboardExercise {...props.exercise} />;
  return <ExplorationFretboard {...props} />;
}

function ExplorationFretboard({ variant = 'dock' }: FretboardProps) {
  const neck = variant === 'neck';
  const { t } = useTranslation();
  const { displayScale, getNoteColor, spellPitchClass, chordPitchClasses } = useKeyContext();
  const { noteOn, noteOff } = useAudio();
  const activeNotes = useAppStore((s) => s.activeNotes);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const chordInversion = useAppStore((s) => s.chordInversion);
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = displayScale.type;
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
  // The capo (wave 2): Explore's guitar only — Learn and exercise input draw
  // the neck without it. 0 = no capo = the board exactly as before.
  const capo = useExploreCapo();
  // How the neck is drawn (Settings → Guitar neck); never what is on it.
  const orientation = useNeckOrientation();
  const nutLeft = orientation.nut === 'left';
  const rows = stringsDown(orientation.top);

  const tuning: GuitarTuning = useMemo(() => getTuningById(guitarTuningId), [guitarTuningId]);
  // The one rule the Progression panel's capo ideas use too (wave 2 integration).
  const isStandardTuning = hasChordShapes(tuning.id);
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
  const { chordShapes, bassMatched, shapeChord } = useMemo(() => {
    if (exerciseInputActive || !selectedChord || !isStandardTuning) return { chordShapes: [], bassMatched: true, shapeChord: null };
    // Nut-closest first so the DEFAULT voicing is the familiar one (Cm → the
    // A-shape barre at fret 3), C-/G-shape barres offered after the rest; a
    // shape with the requested bass first (or say it can't be done). With a
    // capo: the shapes of the chord that many half steps lower, moved up to
    // the capo (B♭, capo 3 → the open G shape at the capo).
    const found = chordShapesForCapo(selectedChord, chordInversion, capo);
    return { chordShapes: found.shapes, bassMatched: found.bassMatched, shapeChord: found.shapeChord };
  }, [selectedChord, chordInversion, isStandardTuning, exerciseInputActive, capo]);

  // The selected shape index belongs to ONE chord. Deriving the reset from
  // the chord (instead of an effect + microtask) means the first render after
  // a chord change already uses shape 0 (audit W3-15).
  const chordKey = useMemo(
    () =>
      selectedChord
        ? JSON.stringify([selectedChord.root, selectedChord.quality, selectedChord.bassNote ?? null, selectedChord.algorithmicDisplayName ?? null, chordInversion, ...(capo ? [capo] : [])])
        : '',
    [selectedChord, chordInversion, capo],
  );
  const shapeChoice = useGuitarShapeStore((s) => s.shapeChoice);
  const setShapeChoice = useGuitarShapeStore((s) => s.setShapeChoice);
  const selectedShapeIdx = shapeChoice.key === chordKey ? shapeChoice.idx : 0;
  const setSelectedShapeIdx = useCallback((idx: number) => setShapeChoice({ key: chordKey, idx }), [chordKey, setShapeChoice]);

  const currentShape = chordShapes[selectedShapeIdx] ?? null;

  // ─── Scale positions (any tuning) ────────────────────
  const scaleView = !exerciseInputActive && selectedChord === null;
  const suggestedPosition = useMemo(
    () => suggestGuitarPosition(selectedKey, selectedScale, tuning, capo),
    [selectedKey, selectedScale, tuning, capo],
  );
  // With a capo, the positions behind it are not offered: a saved one there
  // shows the Open position (at the capo), and comes back when the capo goes.
  const offeredPositions = useMemo(() => capoPositions(capo), [capo]);
  const savedChoice: number | 'all' = guitarScalePosition ?? suggestedPosition;
  const positionChoice: number | 'all' = savedChoice === 'all' ? 'all' : positionForCapo(savedChoice, capo);
  const positionNumber = scaleView && positionChoice !== 'all' ? positionChoice : null;
  // Tell the dock bar which position is on the board ("Position II", W11-A).
  const publishPosition = useDockContextStore((s) => s.setGuitarPosition);
  useEffect(() => {
    publishPosition(scaleView ? positionChoice : null);
    return () => publishPosition(null);
  }, [scaleView, positionChoice, publishPosition]);
  const position = useMemo(
    () => (positionNumber === null ? null : getGuitarPosition(selectedKey, selectedScale, positionNumber, tuning, GUITAR_MAX_FRET, capo)),
    [positionNumber, selectedKey, selectedScale, tuning, capo],
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
  // A fingering is stored per shape (fingeringKey). The Open position at a
  // capo is the open position of the key that many half steps lower, drawn
  // higher: the same hand, so the same key, at the frets above the capo.
  const keyFor = useCallback(
    (pos: number, note: Pick<PositionNote, 'stringIndex' | 'fret'>) =>
      capo > 0 && pos === OPEN_POSITION
        ? fingeringKey(selectedScale, tuning.id, pos, (keyRootPc - capo + 12) % 12, note.stringIndex, note.fret - capo)
        : fingeringKey(selectedScale, tuning.id, pos, keyRootPc, note.stringIndex, note.fret),
    [capo, selectedScale, tuning.id, keyRootPc],
  );
  const positionKeys = useMemo(() => {
    if (!position) return [] as string[];
    return position.notes
      .filter((n) => n.fret > capo)
      .map((n) => keyFor(position.position, n));
  }, [position, capo, keyFor]);
  const hasOverrides = positionKeys.some((k) => k in overrides);

  const positionDots = useMemo(() => {
    if (!position) return EMPTY_POSITION_DOTS;
    const shown = editing ? 'finger' : labelMode;
    const byString = new Map<number, Map<number, PositionDot>>();
    for (const note of position.notes) {
      const key = keyFor(position.position, note);
      const override = note.fret > capo ? overrides[key] : undefined;
      const finger = note.fret === capo ? 0 : (override ?? note.finger);
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
  }, [position, editing, labelMode, overrides, keyFor, capo, t]);

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
      // The Open position at a capo spans the capo and the five frets above
      // it, as the dock draws it (capo 9: frets 9–14 — final review of wave 2).
      let reach = positionNumber === null ? 0 : positionNumber === OPEN_POSITION && capo > 0 ? capo + 5 : positionNumber + 4;
      if (mode === 'chord' && currentShape) {
        for (const pos of currentShape.shape.strings) {
          if (pos.fret !== null) reach = Math.max(reach, currentShape.baseFret + pos.fret);
        }
      }
      return { visibleFrets: range(1, reach > NECK_FRETS ? FULL_FRETS : NECK_FRETS), isZoomed: false };
    }
    if (mode === 'position' && positionNumber !== null) {
      // The 4-fret window plus the stretch fret on each side.
      // The Open position: the open strings (or the capo) and frets above them.
      if (positionNumber === OPEN_POSITION) return { visibleFrets: capo > 0 ? range(capo, capo + 5) : range(1, 5), isZoomed: true };
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

    // Never a fret behind the capo in a zoomed view: it starts AT the capo.
    const start = Math.max(1, capo, minUsed - 1);
    const end = Math.min(FULL_FRETS, Math.max(start + CHORD_FRET_WINDOW - 1, maxUsed + 1));
    return { visibleFrets: range(start, end), isZoomed: true };
  }, [mode, positionNumber, currentShape, neck, capo]);
  // The same frets in the order they are drawn, left to right.
  const drawnFrets = useMemo(() => fretsAcross(visibleFrets, orientation.nut), [visibleFrets, orientation.nut]);
  // The frets a hand can play: with a capo, those behind it are drawn out of
  // play and the arrow keys skip them.
  const playableFrets = useMemo(() => (capo > 0 ? drawnFrets.filter((f) => f >= capo) : drawnFrets), [drawnFrets, capo]);

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

  // Each tapped fret's pending release: its timer and the note it lets go.
  const activeTimeouts = useRef<Map<ReturnType<typeof setTimeout>, number>>(new Map());
  const noteOffRef = useRef(noteOff);
  useEffect(() => {
    noteOffRef.current = noteOff;
  }, [noteOff]);

  useEffect(() => {
    const timeouts = activeTimeouts.current;
    // The board going away (an instrument switch, the full neck opening, a
    // view change) lets its tapped notes go now rather than never: a note
    // left held stays lit and keeps core audio's "the app is sounding"
    // signal on, which would leave the microphone deaf (wave 3 final review).
    return () => {
      for (const [t, midi] of timeouts) {
        clearTimeout(t);
        noteOffRef.current(midi);
      }
      timeouts.clear();
    };
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
          activeTimeouts.current.set(t, midi);
        },
        (e) => { console.warn('[Fretboard] noteOn failed:', e); }
      );
    },
    [noteOn, noteOff]
  );

  // Tap / Enter on a cell. In fingering-edit mode a fretted position dot
  // cycles its finger 1→2→3→4→1 instead of sounding (W10-05); landing back on
  // the suggested finger removes the override.
  const fretFocus = useCallback((fn: FretNote): FocusNote => ({
    pc: fn.pitchClass, midi: fn.midiNumber, source: 'fret', cell: { stringIndex: fn.stringIndex, fret: fn.fret },
  }), []);
  const handleCellActivate = useCallback(
    (fn: FretNote) => {
      setFocus('pinned', fretFocus(fn));
      if (editing && position && fn.fret > capo) {
        const note = position.notes.find((n) => n.stringIndex === fn.stringIndex && n.fret === fn.fret);
        if (note) {
          const key = keyFor(position.position, note);
          const current = overrides[key] ?? note.finger;
          const next = ((current % 4) + 1) as OverrideFinger;
          setOverride(key, next === note.finger ? null : next);
          return;
        }
      }
      playFretNote(fn);
    },
    [editing, position, capo, keyFor, overrides, setOverride, playFretNote, setFocus, fretFocus],
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
      const saved = useAppStore.getState().guitarScalePosition ?? suggestedPosition;
      if (saved === 'all') {
        setGuitarScalePosition(suggestedPosition);
        return;
      }
      // One place along the positions offered (with a capo: Open, then the
      // first position above it), clamped at the ends.
      const at = offeredPositions.indexOf(positionForCapo(saved, capo));
      setGuitarScalePosition(offeredPositions[Math.min(offeredPositions.length - 1, Math.max(0, at + delta))]);
    },
    [suggestedPosition, setGuitarScalePosition, offeredPositions, capo],
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
      if (capo > 0) {
        // With a capo (the seat's decision S-3, final review of wave 2): the
        // library's "G shape" / "E barre" in the learner's language, and a
        // grip the voicing generator named by ITS fret ("Pos 1", "Open": the
        // lower chord's) named by the fret it is drawn at.
        const named = /^(.+) (shape|barre)(\/.+)?$/.exec(shape.shortName ?? '');
        if (named) return t(named[2] === 'shape' ? 'capo.shapeChip' : 'capo.barreChip', { shape: named[1] }) + (named[3] ?? '');
        return baseFret === capo ? t('fretboard.chordOpen') : t('fretboard.chordFret', { fret: baseFret });
      }
      if (shape.shortName) return shape.shortName;
      return baseFret === capo ? t('fretboard.chordOpen') : t('fretboard.chordFret', { fret: baseFret });
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
  }, [chordShapes, capo, t]);

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
    const firstRow = Math.min(fromRow, toRow);
    const lastRow = Math.max(fromRow, toRow);

    const container = fretboardRef.current;
    const containerRect = container.getBoundingClientRect();

    const firstCell = container.querySelector(`[data-string-row="${firstRow}"][data-fret="${barreFret}"]`);
    const lastCell = container.querySelector(`[data-string-row="${lastRow}"][data-fret="${barreFret}"]`);

    if (!firstCell || !lastCell) {
      setBarreStyle(null);
      return;
    }

    // Whichever of the two strings is DRAWN higher (the thin string is on
    // top when the neck is turned, neckOrientation.ts).
    const [topRect, bottomRect] = [firstCell.getBoundingClientRect(), lastCell.getBoundingClientRect()]
      .sort((a, b) => a.top - b.top);

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
    // Either setting moves the barred cells (the nut side moves their column).
  }, [mode, currentShape, visibleFrets, orientation.top, orientation.nut]);

  // ─── Keyboard navigation (roving tabindex on 2D grid) ─
  const [keyboardCell, setFocusedCell] = useState<{ stringIdx: number; fret: number } | null>(null);
  // A capo put on (or moved up) after the keyboard reached a fret behind it:
  // the cell is taken to the capo, since nothing behind it plays. With no
  // capo this is the stored cell itself.
  const focusedCell = useMemo(
    () => (keyboardCell && keyboardCell.fret < capo ? { ...keyboardCell, fret: capo } : keyboardCell),
    [keyboardCell, capo],
  );

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

      setFocusedCell((stored) => {
        // Never a fret behind the capo (see focusedCell).
        const prev = stored && stored.fret < capo ? { ...stored, fret: capo } : stored;
        // Initialize focus at first visible cell if none selected
        if (!prev) {
          // The top string as drawn, at the fret nearest the nut (or the capo).
          const initFret = capo > 0 ? Math.max(capo, visibleFrets[visibleFrets.length - 1] ?? 1) : (visibleFrets[visibleFrets.length - 1] ?? 1);
          return { stringIdx: rows[0], fret: initFret };
        }

        if (key === 'Enter' || key === ' ') {
          const fn = getFretNote(prev.stringIdx, prev.fret);
          handleCellActivate(fn);
          return prev;
        }

        // The arrows follow the drawing: → is the cell drawn on the right,
        // ↑ the string drawn above (neckOrientation.ts).
        let { stringIdx, fret } = prev;
        if (key === 'ArrowRight') fret = drawnNeighbour(playableFrets, fret, 1);
        if (key === 'ArrowLeft') fret = drawnNeighbour(playableFrets, fret, -1);
        if (key === 'ArrowUp') stringIdx = drawnNeighbour(rows, stringIdx, -1);
        if (key === 'ArrowDown') stringIdx = drawnNeighbour(rows, stringIdx, 1);

        return { stringIdx, fret };
      });
    },
    [quickSearchOpen, visibleFrets, playableFrets, capo, rows, getFretNote, handleCellActivate]
  );

  // Announce the focused note for screen readers, with the context-aware
  // spelling that matches the visible cell label.
  // With a capo it also says where the fret is from the capo ("2 frets above the capo").
  const announcedNote = focusedCell
    ? t(capo > 0 ? (focusedCell.fret === capo ? 'capo.announceAt' : 'capo.announceAbove') : 'fretboard.announce', {
        string: 6 - focusedCell.stringIdx,
        fret: focusedCell.fret,
        note: noteToString(spellPitchClass(getFretNote(focusedCell.stringIdx, focusedCell.fret).pitchClass)),
        ...(capo > 0 ? { count: focusedCell.fret - capo } : {}),
      })
    : '';

  // The keyboard's cell is the focus note while the board has focus.
  useEffect(() => {
    if (focusedCell) setFocus('keyboard', fretFocus(getFretNote(focusedCell.stringIdx, focusedCell.fret)));
    else clearFocus('keyboard', 'fret');
  }, [focusedCell, getFretNote, setFocus, clearFocus, fretFocus]);

  // ─── Linked focus note (W11-B, D-25) ─────────────────
  // The touched cell comes first, even without a dot. Other surfaces use the
  // cells showing a dot: the exact pitch if it is there, else its pitch
  // class; only when no dot matches, any visible cell (a note outside the
  // scale / chord).
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
    // Nothing behind a capo can sound, so nothing there is lit.
    for (let st = 0; st < 6; st++) for (const f of [0, ...visibleFrets]) if (f >= capo) all.push(getFretNote(st, f));
    const pick = (pool: FretNote[]) => {
      if (focus.midi !== undefined) {
        const exact = pool.filter((fn) => fn.midiNumber === focus.midi);
        if (exact.length) return exact;
      }
      return pool.filter((fn) => fn.pitchClass === focus.pc);
    };
    let lit = pick(all.filter(showsDot));
    const cell = focus.source === 'fret' ? focus.cell : undefined;
    const touched = cell
      ? all.find((fn) => fn.stringIndex === cell.stringIndex && fn.fret === cell.fret && fn.midiNumber === focus.midi)
      : undefined;
    if (touched) lit = [touched, ...lit.filter((fn) => fn !== touched && fn.midiNumber === touched.midiNumber)];
    else if (lit.length === 0) lit = pick(all);
    for (const fn of lit) {
      const row = byString.get(fn.stringIndex) ?? new Set<number>();
      row.add(fn.fret);
      byString.set(fn.stringIndex, row);
      list.push(fn);
    }
    return { byString, list };
  }, [focus, exerciseInputActive, exploring, visibleFrets, capo, getFretNote, showsDot]);

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
        : capo > 0 && fn.fret === capo
          ? t('capo.readoutAt', { string: 6 - fn.stringIndex, fret: fn.fret })
          : t('explore.readout.stringFret', { string: 6 - fn.stringIndex, fret: fn.fret })));
    if (focusCells.list.length > 4) words.push('…');
    setLocations({ instrument: 'guitar', items: words });
  }, [focus, focusCells, capo, setLocations, t]);
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

  // Open the board at the NUT end on first paint. With the nut on the RIGHT
  // (the owner's view since 2026-06-09 — Nuno reads it natively) scrollLeft 0
  // would show the HIGH frets and the playing-start position (nut, open
  // strings, frets 0-5) sits at the far right; with the nut on the left
  // (neckOrientation.ts) it is scrollLeft 0. Zoomed views (a chord shape or a
  // position) fit without scrolling, so this runs whenever the board opens
  // onto the whole neck — on mount, on switching to "All", or on turning the
  // neck in Settings.
  useLayoutEffect(() => {
    if (isZoomed) return;
    const el = scrollContainerRef.current;
    if (el) el.scrollLeft = nutScrollLeft(el, orientation.nut);
  }, [isZoomed, orientation.nut]);

  // ─── Display state ────────────────────────────────────
  // An open grip — with a capo, the open grip AT the capo (the capo is its nut).
  const isOpenChordShape = mode === 'chord' && currentShape !== null && currentShape.baseFret === capo;
  // The translated open-position badge determines the shared column width.
  // Keep it centred over the open strings without crossing the nut or edge.
  const [openBadge, setOpenBadge] = useState<HTMLSpanElement | null>(null);
  const [openColumnWidth, setOpenColumnWidth] = useState(40);
  useLayoutEffect(() => {
    if (!openBadge) return;
    const measure = () => setOpenColumnWidth(Math.max(40, Math.ceil(openBadge.getBoundingClientRect().width)));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(openBadge);
    return () => ro.disconnect();
  }, [openBadge]);
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
        if (abs > capo) min = Math.min(min, abs);
      }
    }
    return min === Infinity ? null : min;
  }, [mode, currentShape, isOpenChordShape, capo]);
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
    ? (isStandardTuning
      ? t(capo > 0 ? 'capo.noShape' : 'fretboard.noChordShape')
      // With a capo the frets behind it are blank: not "the whole neck" (final review of wave 2).
      : t(capo > 0 ? 'capo.shapesStandardOnly' : 'fretboard.chordShapesStandardOnly'))
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
  // With a capo and a grip: the chord that sounds and the shape the hand
  // makes, in the app's own chord names ("B♭: the G shape, capo on fret 3").
  const capoLine = capo > 0 && mode === 'chord' && selectedChord && shapeChord
    ? t('capo.line', { chord: chordSymbol(selectedChord), shape: chordSymbol(shapeChord), fret: capo })
    : null;
  // The board's own capo control, only while a capo is on. Taking it off
  // hands focus to the board (the control is gone).
  const capoControl = capo > 0
    ? <CapoControl fret={capo} onRemoved={() => scrollContainerRef.current?.focus()} />
    : null;
  const positionSelector = scaleView ? (
    <ScalePositionSelector
      positions={offeredPositions}
      capo={capo}
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
      className={neck ? 'w-full flex-1 min-h-0 flex flex-col' : 'w-full flex flex-col'}
      style={{ backgroundColor: 'var(--bg)', borderTop: neck ? undefined : '1px solid var(--border-subtle)', '--fret-open-width': `${openBadge ? openColumnWidth : 40}px` } as React.CSSProperties}
    >
      {barTools && toolsSlot && createPortal(<>{positionSelector}{labelToolbar('labels')}</>, toolsSlot)}
      {neckTools && toolsSlot && createPortal(
        <>
          {capoControl}
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
      {/* The full neck has no controls row: the capo's line sits over the board. */}
      {neck && capoLine && (
        <p className="text-ui px-4 pt-1" style={{ color: 'var(--text-muted)' }} data-testid="capo-line">{capoLine}</p>
      )}
      {/* Controls — outside the scrolling board so they never scroll away.
          On a phone they come AFTER the board, so the strings are what the
          sheet shows first at Half (W11-A review). */}
      {!exerciseInputActive && !neck && (
        <div className="fretboard-controls px-4 max-sm:px-2 pt-2 max-sm:pb-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 max-sm:order-last">
          {capoControl}
          {mode === 'chord' && (
            <ChordShapeSelector
              shapeCount={chordShapes.length}
              labels={positionLabels}
              selectedIdx={selectedShapeIdx}
              onSelect={setSelectedShapeIdx}
            />
          )}
          {capoLine && <p className="text-ui" style={{ color: 'var(--text-muted)' }} data-testid="capo-line">{capoLine}</p>}
          {!barTools && positionSelector}
          {scaleView && labelToolbar(barTools ? 'edit' : 'all')}

          {/* Tuning selector — a compact native <select> (one control, so the
              toolbar stays short; review B1). Available in every tuning on phones too. */}
          <label className="flex items-center gap-2">
            <span className="text-ui" style={{ color: 'var(--text-muted)' }} data-term="tuning">{t('fretboard.tuning')}</span>
            <SelectTrigger
              value={guitarTuningId}
              onChange={(e) => setGuitarTuningId(e.target.value)}
              aria-label={t('fretboard.tuningLabel')}
            >
              {GUITAR_TUNINGS.map((tn) => (
                <option key={tn.id} value={tn.id}>{tn.id === 'standard' ? t('fretboard.standardTuning') : tn.id === 'drop-d' ? 'Drop D (6=D)' : withGlyphs(tn.shortName)}</option>
              ))}
            </SelectTrigger>
          </label>

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
      <div className={`px-4 max-sm:px-2 py-2 min-[1200px]:py-1 ${neck ? 'neck-board-content' : ''}`} style={{ minWidth: isZoomed || neck ? 0 : (mobile ? 660 : 800) }}>
        {/* Fret markers row — carries the loud position badge in chord/position view.
            Mirrored with the nut (neckOrientation.ts): open column · frets · far gutter. */}
        <div className="flex mb-1 items-center">
          {(() => {
            const gutter = <div key="gutter" style={{ width: 32 }} />;
            const fretMarks = (
              <div key="frets" className="flex flex-1">
                {drawnFrets.map((f) => (
                  <div
                    key={f}
                    className="flex-1 text-center"
                    style={{ color: 'var(--text-dim)', minWidth: fretMinWidth, fontSize: 12 }}
                  >
                    {capo > 0 && f === capo && mode === 'position' && positionNumber === OPEN_POSITION ? (
                      <span
                        data-testid="position-badge"
                        title={t('capo.openPositionTitle', { fret: capo, from: capo + 1, to: capo + 4 })}
                        className="inline-block px-1 rounded font-bold"
                        style={badgeStyle}
                      >
                        {t('fretboard.open')}
                      </span>
                    ) : anchorFret === f ? (
                      chordAnchorFret !== null ? (
                        <span className="inline-block px-1.5 rounded font-bold font-mono" style={badgeStyle} data-term="anchorFret">
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
            );
            const nutGap = <div key="nut" style={{ width: 6 }} />;
            const openMark = (
              <div key="open" style={{ width: 'var(--fret-open-width)', flexShrink: 0 }} className="flex items-center justify-center">
                {mode === 'position' && positionNumber === OPEN_POSITION && capo === 0 && (
                  <span
                    ref={setOpenBadge}
                    data-testid="position-badge"
                    title={t('fretboard.openPositionTitle')}
                    className="inline-block px-1 rounded font-bold fretboard-open-badge"
                    style={badgeStyle}
                  >
                    {t('fretboard.open')}
                  </span>
                )}
              </div>
            );
            return nutLeft ? [openMark, nutGap, fretMarks, gutter] : [gutter, fretMarks, nutGap, openMark];
          })()}
        </div>

        {/* Fretboard grid with barre overlay */}
        <div ref={fretboardRef} className={`relative${neck ? ' neck-strings' : ''}`}>
          {/* Continuous fret lines overlay */}
          {/* Each fret's wire on its nut side (mirrored with the nut). */}
          <div
            className="absolute inset-0 flex pointer-events-none"
            style={nutLeft
              ? { zIndex: 1, left: 'calc(var(--fret-open-width) + 6px)', right: 32 }
              : { zIndex: 1, left: 32, right: 'calc(var(--fret-open-width) + 6px)' }}
          >
            {drawnFrets.map((f) => (
              <div
                key={f}
                className="flex-1"
                style={nutLeft
                  ? { minWidth: fretMinWidth, borderLeft: '1px solid var(--border)' }
                  : { minWidth: fretMinWidth, borderRight: '1px solid var(--border)' }}
              />
            ))}
          </div>

          {/* Barre bar overlay */}
          {barreStyle && <div data-testid="barre-overlay" style={barreStyle} />}

          {/* Strings in drawn order: 6th (low E) at top → 1st (high e) at
              bottom, or the thin string on top (neckOrientation.ts). */}
          {rows.map((stringIdx) => (
            <FretboardString
              key={stringIdx}
              stringIdx={stringIdx}
              visibleFrets={drawnFrets}
              nutSide={orientation.nut}
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
              rowHeight={neck ? '100%' : undefined}
              scaleContext={!exerciseInputActive && selectedChord !== null && (mode === 'chord' || mode === 'highlight')}
              {...(capo > 0 ? { capo, capoEnd: stringIdx === rows[0] ? 'top' as const : stringIdx === rows[rows.length - 1] ? 'bottom' as const : undefined } : {})}
            />
          ))}
        </div>

        {/* Fret numbers row — larger when zoomed; the anchor fret is accented.
            Mirrored with the nut, like the markers row. */}
        <div data-dock-row="frets" className="flex mt-1">
          {(() => {
            const gutter = <div key="gutter" style={{ width: 32 }} />;
            const numbers = (
              <div key="frets" className="flex flex-1">
                {drawnFrets.map((f) => (
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
            );
            const nutGap = <div key="nut" style={{ width: atNut ? 6 : 2 }} />;
            const openNumber = (
              <div key="open" style={{ width: 'var(--fret-open-width)', flexShrink: 0 }} className="flex items-center justify-center">
                {mode === 'chord' && !isOpenChordShape ? (
                  <span className="font-mono" style={{ color: 'var(--text-dim)', fontSize: 12 }}>{lowestVisibleFret}fr</span>
                ) : atNut ? (
                  <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>0</span>
                ) : null}
              </div>
            );
            return nutLeft ? [openNumber, nutGap, numbers, gutter] : [gutter, numbers, nutGap, openNumber];
          })()}
        </div>
      </div>
    </div>
    {/* Mobile: dedicated scroll handle. The fretboard surface owns its touches
        (taps fire notes), so reaching other positions happens here, via the
        position chips, or (desktop) wheel/drag. */}
    {mobile && !neck && <ScrollStrip containerRef={scrollContainerRef} label={t('fretboard.label')} hint={t('instrument.scrollFrets')} />}
    </div>
  );
}
