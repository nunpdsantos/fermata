import { useMemo } from 'react';
import { useAppStore } from '../state/store.ts';
import { buildScale } from '../core/constants/scales.ts';
import { getDiatonicChordsForScale } from '../core/constants/chords.ts';
import { getScaleNotesWithOctaves, chordVoicingPitches, getMidiNumber } from '../core/utils/pianoLayout.ts';
import { getPitchClass } from '../core/constants/notes.ts';
import { buildSpellingMap, spellFromMap, spellSharpDefault } from '../core/utils/spelling.ts';
import { degreeOf, degreeColorSlot } from '../core/utils/degreeSpelling.ts';
import type { Note, Scale, Chord, PitchedNote } from '../core/types/music.ts';
import { DEGREE_COLORS } from '../design/tokens/colors.ts';
import { useDegreeColorsEnabled } from './useDegreeColors.ts';

export interface DiatonicChord {
  chord: Chord;
  numeral: string;
  degree: number; // 1-7
}

export interface KeyContextValue {
  scale: Scale;
  scaleNotesWithOctaves: PitchedNote[];
  diatonicChords: DiatonicChord[];
  getNoteColor: (note: Note) => string | undefined;
  getNoteDegree: (note: Note) => number | undefined; // 1-7 or undefined
  /**
   * Context-aware enharmonic spelling for a pitch class (0–11). Used by the
   * piano/fretboard for DISPLAY LABELS ONLY — never for position/colour/pitch.
   * Honours selected chord → scale → key-signature bias → sharp default.
   */
  spellPitchClass: (pc: number) => Note;
  scalePitchClasses: Set<number>; // for guitar/circle of fifths (all octaves)
  scaleMidiNumbers: Set<number>; // for piano (limited octave range)
  chordPitchClasses: Set<number>; // pitch classes of selected chord (empty if none)
  chordVoicingMidi: Set<number>; // exact MIDI numbers for the current inversion voicing
  hasSelectedChord: boolean;
  invertedNotes: Note[]; // chord notes in current inversion order
}

/** Rotate array by n positions */
function rotateNotes(notes: Note[], inversion: number): Note[] {
  if (notes.length === 0 || inversion === 0) return notes;
  const n = inversion % notes.length;
  return [...notes.slice(n), ...notes.slice(0, n)];
}

const EMPTY_SET: Set<number> = new Set();
const MIDI_RANGE_START = 21; // A0
const MIDI_RANGE_END = 108; // C8

export function useKeyContext(): KeyContextValue {
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const selectedChord = useAppStore((s) => s.selectedChord);
  const chordInversion = useAppStore((s) => s.chordInversion);
  const scaleOctaves = useAppStore((s) => s.scaleOctaves);
  const baseOctave = useAppStore((s) => s.baseOctave);
  const degreeColorsOn = useDegreeColorsEnabled();
  const exerciseInputActive = useAppStore((s) => s.exerciseInputActive);
  const highlightedNotes = useAppStore((s) => s.highlightedNotes);

  const scale = useMemo(
    () => buildScale(selectedKey, selectedScale),
    [selectedKey, selectedScale]
  );

  const scaleNotesWithOctaves = useMemo(
    () => getScaleNotesWithOctaves(scale.notes, 3),
    [scale]
  );

  const diatonicChords = useMemo(() => {
    // Stacked-thirds triads; `degree` is the chord root's scale degree (a scale
    // can skip degrees whose thirds don't stack, so never the list index).
    return getDiatonicChordsForScale(scale).map((dc) => ({
      chord: dc.chord,
      numeral: dc.numeral,
      degree: dc.degree,
    }));
  }, [scale]);

  // Map pitch class → degree function (1–7), for EVERY scale note. The degree
  // is read from the note's spelled letter, not its position in the list:
  // C major pentatonic's G is degree 5 (dominant), not "note 4" (audit
  // W1-06). Every note of 8- and 12-note scales is present too — the fretboard
  // treats "no colour" as "not in the scale", so a missing entry used to hide
  // chromatic and bebop notes (audit W3-03).
  const pitchClassToDegree = useMemo(() => {
    const m = new Map<number, number>();
    for (const note of scale.notes) {
      const pc = getPitchClass(note);
      if (!m.has(pc)) m.set(pc, degreeColorSlot(degreeOf(scale.root, note)));
    }
    return m;
  }, [scale]);

  // Fermata-coherent fallback when functional degree colours are disabled.
  // Single hue, two saturations: tonic strong walnut, other scale notes a
  // lighter walnut. Keeps the editorial feel while leaving the instruments
  // visually functional (without this, fretboard scale dots disappear and
  // piano scale keys lose any signal).
  const getNoteColor = useMemo(() => {
    return (note: Note): string | undefined => {
      const degree = pitchClassToDegree.get(getPitchClass(note));
      if (degree === undefined) return undefined;
      if (!degreeColorsOn) {
        // Hex literals here mirror the .fermata CSS palette (`--accent` and a
        // lighter walnut). Returning hex (not `var(--accent)`) is deliberate:
        // FretCell/PianoKey templates this colour into hex-alpha strings like
        // `${color}30` to dim it, which CSS variables don't support.
        // eslint-disable-next-line no-restricted-syntax
        return degree === 1 ? '#a65a2a' : '#c9a574';
      }
      return DEGREE_COLORS[degree as keyof typeof DEGREE_COLORS];
    };
  }, [pitchClassToDegree, degreeColorsOn]);

  const getNoteDegree = useMemo(() => {
    return (note: Note): number | undefined => {
      return pitchClassToDegree.get(getPitchClass(note));
    };
  }, [pitchClassToDegree]);

  // Context spelling map: pitch class → engine-correct Note, prioritised
  // chord > scale > key-signature bias > sharp default. Rebuilt only when the
  // chord or scale changes. Display labels only — positions/colours/pitch are
  // unaffected (those still key off the physical MIDI/note).
  const spellPitchClass = useMemo(() => {
    const m = buildSpellingMap(selectedChord, scale);
    return (pc: number): Note => spellFromMap(m, pc);
  }, [selectedChord, scale]);

  // Pitch class set — used by guitar and circle of fifths (highlights all octaves)
  const scalePitchClasses = useMemo(() => {
    const s = new Set<number>();
    for (const n of scale.notes) s.add(getPitchClass(n));
    return s;
  }, [scale]);

  // MIDI-based scale notes for piano — limited to requested octave range
  const scaleMidiNumbers = useMemo(() => {
    const s = new Set<number>();
    for (let oct = 0; oct < scaleOctaves; oct++) {
      const pitched = getScaleNotesWithOctaves(scale.notes, baseOctave + oct);
      for (const p of pitched) {
        s.add(getMidiNumber(p, p.octave));
      }
    }
    return s;
  }, [scale, scaleOctaves, baseOctave]);

  const chordPitchClasses = useMemo(() => {
    const s = new Set<number>();
    if (selectedChord) {
      for (const n of selectedChord.notes) s.add(getPitchClass(n));
      if (selectedChord.bassNote) s.add(getPitchClass(selectedChord.bassNote));
    }
    return s;
  }, [selectedChord]);

  // Compute inverted chord notes
  const invertedNotes = useMemo(() => {
    if (!selectedChord) return [];
    return rotateNotes(selectedChord.notes, chordInversion);
  }, [selectedChord, chordInversion]);

  // Compute exact MIDI numbers for a single voicing at the base octave
  const chordVoicingMidi = useMemo(() => {
    const s = new Set<number>();
    if (!selectedChord || invertedNotes.length === 0) return s;

    // The same pitches the chord plays (slash bass an octave below) — one
    // voicing function for keys and sound (audit W2-07 review).
    for (const p of chordVoicingPitches(invertedNotes, baseOctave, selectedChord.bassNote)) {
      s.add(getMidiNumber(p, p.octave));
    }
    return s;
  }, [selectedChord, invertedNotes, baseOctave]);

  // Exercise instrument-input mode: the learner is answering on the
  // instrument, so Explore's key/chord visuals would be misleading hints (or
  // noise from an unrelated key). Suppress them and surface the learner's
  // toggled notes through the chord-highlight channel, on every octave —
  // grading is pitch-class based, so every octave of a toggled note is "lit".
  const exerciseHighlight = useMemo(() => {
    const pcs = new Set<number>();
    const midi = new Set<number>();
    if (exerciseInputActive) {
      for (const n of highlightedNotes) pcs.add(getPitchClass(n));
      if (pcs.size > 0) {
        for (let m = MIDI_RANGE_START; m <= MIDI_RANGE_END; m++) {
          if (pcs.has(m % 12)) midi.add(m);
        }
      }
    }
    return { pcs, midi };
  }, [exerciseInputActive, highlightedNotes]);

  // Exercise mode: a lit key is named as its chip is (the input spells picks
  // by the target's sharp/flat direction — audit W1-08); every other key keeps
  // the neutral sharp default, so labels never leak the target key.
  const exerciseSpell = useMemo(() => {
    const byPc = new Map<number, Note>();
    for (const n of highlightedNotes) byPc.set(getPitchClass(n), { natural: n.natural, accidental: n.accidental });
    return (pc: number): Note => byPc.get(((pc % 12) + 12) % 12) ?? spellSharpDefault(pc);
  }, [highlightedNotes]);

  if (exerciseInputActive) {
    return {
      scale,
      scaleNotesWithOctaves,
      diatonicChords,
      getNoteColor: () => undefined,
      getNoteDegree: () => undefined,
      // Exercise input is pitch-class graded with no canonical spelling, and
      // Explore's key context is intentionally suppressed here — labels fall
      // back to the sharp default rather than leaking the active key's spelling;
      // the learner's own picks wear their chip names (exerciseSpell).
      spellPitchClass: exerciseSpell,
      scalePitchClasses: EMPTY_SET,
      scaleMidiNumbers: EMPTY_SET,
      chordPitchClasses: exerciseHighlight.pcs,
      chordVoicingMidi: exerciseHighlight.midi,
      hasSelectedChord: exerciseHighlight.pcs.size > 0,
      invertedNotes: [],
    };
  }

  return {
    scale,
    scaleNotesWithOctaves,
    diatonicChords,
    getNoteColor,
    getNoteDegree,
    spellPitchClass,
    scalePitchClasses,
    scaleMidiNumbers,
    chordPitchClasses,
    chordVoicingMidi,
    hasSelectedChord: selectedChord !== null,
    invertedNotes,
  };
}
