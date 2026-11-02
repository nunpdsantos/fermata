import { useMemo } from 'react';
import { useAppStore } from '../../state/store.ts';
import type { Note, ScaleType } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import {
  preferredRootSpelling,
  enharmonicRootAlternative,
  rootSpellingCost,
  cheaperSpelling,
} from '../../core/utils/degreeSpelling.ts';

/**
 * Key and scale choice, shared by the Explore pickers (KeySelector.tsx):
 * the twelve roots as offered for the selected scale (audit W1-09), the
 * respell choice, and choosing a scale with the root respelled only when
 * that is strictly simpler.
 */
const PITCH_CLASSES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

const sameNote = (a: Note, b: Note) => a.natural === b.natural && a.accidental === b.accidental;

// Grouped, in the order the scale chips used to show them (the Scale
// select's optgroups). Labels are translated (`scaleChip.<type>`, D-17).
export const SCALE_GROUPS: { id: string; options: ScaleType[] }[] = [
  { id: 'core', options: ['major', 'natural_minor'] },
  { id: 'minorVariants', options: ['harmonic_minor', 'melodic_minor'] },
  { id: 'modes', options: ['dorian', 'phrygian', 'lydian', 'mixolydian', 'locrian'] },
  { id: 'pentatonicBlues', options: ['pentatonic_major', 'pentatonic_minor', 'blues', 'major_blues'] },
  { id: 'symmetric', options: ['whole_tone', 'diminished_whole_half', 'diminished_half_whole', 'chromatic'] },
  { id: 'melMinorModes', options: ['altered', 'lydian_dominant', 'locrian_natural2', 'dorian_b2', 'lydian_augmented', 'mixolydian_b6'] },
  // Phrygian dominant is mode 5 of HARMONIC minor (audit W5-45), so it gets
  // its own group rather than sitting among the melodic-minor modes.
  { id: 'harmMinorModes', options: ['phrygian_dominant'] },
  { id: 'bebop', options: ['bebop_dominant', 'bebop_major', 'bebop_dorian'] },
  {
    id: 'world',
    options: ['hungarian_minor', 'hungarian_major', 'double_harmonic', 'persian', 'neapolitan_minor', 'neapolitan_major', 'hirajoshi', 'in_sen', 'iwato', 'egyptian'],
  },
];

/** The twelve roots as offered for the selected scale, and the respell choice. */
export function useRootChoices() {
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const setKey = useAppStore((s) => s.setKey);
  const selectedPc = getPitchClass(selectedKey);
  const roots = useMemo(
    () => PITCH_CLASSES.map((pc) => (pc === selectedPc ? selectedKey : preferredRootSpelling(pc, selectedScale))),
    [selectedPc, selectedKey, selectedScale],
  );
  const alternative = enharmonicRootAlternative(selectedKey);
  return {
    roots,
    selectedPc,
    alternative,
    chooseRoot: (pc: number) => setKey(roots[pc]),
    respell: () => alternative && setKey(alternative),
  };
}

/**
 * Choosing a scale keeps the root's pitch, but takes its other name when that
 * spells the new scale with strictly fewer accidentals (D♭ major → Minor
 * gives C♯ minor, not D♭ minor with F♭ and B𝄫). Re-choosing the active scale
 * never touches the root.
 */
export function useChooseScale() {
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const setKey = useAppStore((s) => s.setKey);
  const setScale = useAppStore((s) => s.setScale);
  return (type: ScaleType) => {
    if (type === selectedScale) return;
    setScale(type);
    const preferred = preferredRootSpelling(getPitchClass(selectedKey), type);
    if (!sameNote(preferred, selectedKey) && cheaperSpelling(rootSpellingCost(preferred, type), rootSpellingCost(selectedKey, type))) {
      setKey(preferred);
    }
  };
}

