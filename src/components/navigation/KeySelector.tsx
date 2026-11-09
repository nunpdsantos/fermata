import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store.ts';
import { noteToString, type ScaleType } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { getPitchClass } from '../../core/constants/notes.ts';
import { SCALE_GROUPS, useRootChoices, useChooseScale } from './keyChoice.ts';
import { ChipGroup } from '../ui/ChoiceChip.tsx';
import { Button } from '../ui/Button.tsx';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';

/**
 * The key and scale pickers (Explore workbench, D-25 / W11-B). The root is
 * chosen from twelve pitch classes; each black key is offered under the name
 * that spells the selected scale with fewer accidentals (D♭ major, C♯ minor,
 * G♯ minor — audit W1-09), the selected root always shows its own spelling,
 * and "⇄ D♭" switches to the other name. Choosing a scale keeps the root's
 * pitch but takes its other name when that is strictly simpler.
 *
 *  - KeyPicker / ScalePicker: the two SelectTriggers at the top of Explore.
 *  - RootChips: the same twelve roots as choice chips — the phone's key
 *    picker sheet, beside the circle of fifths.
 */
/** "⇄ D♭": switch the selected black-key root to its other name. */
export function RespellButton({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { alternative, respell } = useRootChoices();
  if (!alternative) return null;
  const label = t('keySelector.respellAs', { note: noteToString(alternative) });
  return (
    <Button variant="quiet" className={className} onClick={respell} aria-label={label} title={label}>
      <span aria-hidden="true">⇄ </span>{withGlyphs(alternative)}
    </Button>
  );
}

/** The root as a SelectTrigger (laptop / tablet). */
export function KeyPicker() {
  const { t } = useTranslation();
  const { roots, selectedPc, chooseRoot } = useRootChoices();
  return (
    <SelectTrigger
      aria-label={t('keySelector.root')}
      data-testid="key-picker"
      value={selectedPc}
      onChange={(e) => chooseRoot(Number(e.target.value))}
    >
      {roots.map((root, pc) => (
        <option key={pc} value={pc} data-root={noteToString(root)}>
          {withGlyphs(root)}
        </option>
      ))}
    </SelectTrigger>
  );
}

/** The scale as a SelectTrigger: every scale, grouped (the old "More scales" included). */
export function ScalePicker({ className }: { className?: string }) {
  const { t } = useTranslation();
  const selectedScale = useAppStore((s) => s.selectedScale);
  const chooseScale = useChooseScale();
  return (
    <SelectTrigger
      aria-label={t('keySelector.scale')}
      data-testid="scale-picker"
      wrapperClassName={className}
      value={selectedScale}
      onChange={(e) => chooseScale(e.target.value as ScaleType)}
    >
      {SCALE_GROUPS.map((g) => (
        <optgroup key={g.id} label={t(`scaleGroup.${g.id}`)}>
          {g.options.map((type) => (
            <option key={type} value={type} data-scale={type}>
              {t(`scaleChip.${type}`)}
            </option>
          ))}
        </optgroup>
      ))}
    </SelectTrigger>
  );
}

/**
 * The twelve roots as choice chips (a radiogroup: one Tab stop, arrows move
 * and select). The respell button sits in a fixed-height row above, so its
 * coming and going never moves the chips.
 */
export function RootChips() {
  const { t } = useTranslation();
  const { roots, selectedPc, chooseRoot } = useRootChoices();
  return (
    <div role="group" aria-label={t('keySelector.label')} data-tour="key-scale">
      <div className="flex items-center gap-2 mb-1.5 h-(--tap)" data-testid="root-label-row">
        <span className="type-section block">{t('keySelector.root')}</span>
        <RespellButton />
      </div>
      <ChipGroup
        label={t('keySelector.root')}
        value={selectedPc}
        onChange={chooseRoot}
        options={roots.map((root) => {
          const label = noteToString(root);
          return { value: getPitchClass(root), label: withGlyphs(root), data: { 'data-root': label } };
        })}
      />
    </div>
  );
}
