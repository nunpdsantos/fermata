import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store.ts';
import { noteToString, type Note, type ScaleType } from '../../core/types/music.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import {
  preferredRootSpelling,
  enharmonicRootAlternative,
  rootSpellingCost,
  cheaperSpelling,
} from '../../core/utils/degreeSpelling.ts';
import { ChipGroup } from '../ui/ChoiceChip.tsx';
import { Button } from '../ui/Button.tsx';

// One button per pitch class. Each black key is offered under the name that
// spells the selected scale with fewer accidentals (D♭ major, C♯ minor, G♯
// minor); the selected root always shows its own spelling (audit W1-09).
const PITCH_CLASSES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const;

const sameNote = (a: Note, b: Note) => a.natural === b.natural && a.accidental === b.accidental;

// Chip labels are translated (`scaleChip.<type>` — audit W6-05 / D-17:
// "Harm. Minor" read in English in PT/ES); the groups only order and divide.
const SCALE_GROUPS: { id: string; options: ScaleType[] }[] = [
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

const ALWAYS_VISIBLE_COUNT = 4; // first 4 groups always shown

/**
 * Root + scale pickers (Explore). Both are ChipGroups (D-28 "choice chip":
 * one of many, a radiogroup — Tab reaches the selected chip, arrows move and
 * select). The Explore workbench (D-25) will replace this layout later.
 */
export function KeySelector() {
  const { t } = useTranslation();
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const setKey = useAppStore((s) => s.setKey);
  const setScale = useAppStore((s) => s.setScale);
  const [expanded, setExpanded] = useState(false);

  // Auto-expand if selected scale is in a hidden group
  const isSelectedInHiddenGroup = useMemo(() => {
    const hiddenGroups = SCALE_GROUPS.slice(ALWAYS_VISIBLE_COUNT);
    return hiddenGroups.some((g) => g.options.includes(selectedScale));
  }, [selectedScale]);

  const showAll = expanded || isSelectedInHiddenGroup;

  const selectedPc = getPitchClass(selectedKey);
  const roots = useMemo(
    () => PITCH_CLASSES.map((pc) => (pc === selectedPc ? selectedKey : preferredRootSpelling(pc, selectedScale))),
    [selectedPc, selectedKey, selectedScale],
  );
  const alternative = enharmonicRootAlternative(selectedKey);

  // Choosing a scale keeps the root's pitch, but takes its other name when that
  // spells the new scale with strictly fewer accidentals (D♭ major → Minor
  // gives C♯ minor, not D♭ minor with F♭ and B𝄫).
  const chooseScale = (type: ScaleType) => {
    // Re-clicking the active scale never touches the root.
    if (type === selectedScale) return;
    setScale(type);
    // Respell only when the other name is strictly cheaper for the new scale
    // (smaller signature; or, without one, fewer double accidentals first):
    // D♭ major → Minor gives C♯ minor; G♯ minor → Melodic stays G♯.
    const preferred = preferredRootSpelling(selectedPc, type);
    if (!sameNote(preferred, selectedKey) && cheaperSpelling(rootSpellingCost(preferred, type), rootSpellingCost(selectedKey, type))) {
      setKey(preferred);
    }
  };
  const visibleGroups = showAll ? SCALE_GROUPS : SCALE_GROUPS.slice(0, ALWAYS_VISIBLE_COUNT);

  return (
    <div className="space-y-4" role="group" aria-label={t('keySelector.label')} data-tour="key-scale">
      {/* ─── Root ──────────────────────────────────────────── */}
      <div>
        {/* Fixed-height row: the respell button appearing or disappearing
            never moves the strip below it. */}
        <div className="flex items-center gap-2 mb-1.5 h-(--tap)" data-testid="root-label-row">
          <span id="root-label" className="type-section block">
            {t('keySelector.root')}
          </span>
          {alternative && (
            <Button
              variant="quiet"
              onClick={() => setKey(alternative)}
              aria-label={t('keySelector.respellAs', { note: noteToString(alternative) })}
              title={t('keySelector.respellAs', { note: noteToString(alternative) })}
            >
              <span aria-hidden="true">⇄ </span>{noteToString(alternative)}
            </Button>
          )}
        </div>
        <ChipGroup
          label={t('keySelector.root')}
          className="chip-row-phone"
          value={selectedPc}
          onChange={(pc) => setKey(roots[pc])}
          options={roots.map((root, pc) => {
            const label = noteToString(root);
            return { value: pc, label, data: { 'data-root': label } };
          })}
        />
      </div>

      {/* ─── Scale ─────────────────────────────────────────── */}
      <div>
        <span className="type-section block mb-1.5">
          {t('keySelector.scale')}
        </span>
        <ChipGroup
          label={t('keySelector.scale')}
          value={selectedScale}
          onChange={chooseScale}
          options={visibleGroups.flatMap((g) =>
            g.options.map((type) => ({ value: type, label: t(`scaleChip.${type}`), group: g.id, data: { 'data-scale': type } })),
          )}
        />
        {/* Outside the radiogroup: it is not one of the choices. */}
        {!isSelectedInHiddenGroup && (
          <Button variant="quiet" className="mt-1.5 -ml-3" onClick={() => setExpanded(!expanded)} aria-expanded={showAll}>
            {showAll ? t('keySelector.less') : t('keySelector.moreScales')}
          </Button>
        )}
      </div>
    </div>
  );
}
