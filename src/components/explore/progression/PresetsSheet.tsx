import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Chord } from '../../../core/types/music';
import type { MusicKey } from '../../../core/utils/progression';
import { Sheet } from '../../ui/Sheet';
import { presetViews, type PresetView } from './progressionModel';
import { chordName, keyLabel } from './progressionText';

const distinct = <T,>(xs: readonly T[], id: (x: T) => string) => xs.filter((x, i) => xs.findIndex((y) => id(y) === id(x)) === i);

/** One preset as a button: its numerals over its chords in the key ("I–V–vi–IV" / "G D Em C"). */
function PresetButton({ view, onPick }: { view: PresetView; onPick: (chords: readonly Chord[]) => void }) {
  const { t } = useTranslation();
  const blues = view.preset.id === 'twelve-bar-blues';
  // The blues is twelve bars long: its name, and each of its numbers and chords once.
  const numerals = blues ? distinct(view.preset.numerals, (n) => n).join(' ') : view.preset.numerals.join('–');
  const chords = (blues ? distinct(view.chords, chordName) : view.chords).map(chordName).join(' ');
  const where = view.relative ? ` · ${t('progression.presetIn', { key: keyLabel(view.key, t) })}` : '';
  const title = blues ? `${t('progression.blues')} · ${numerals}` : numerals;
  return (
    <button type="button" className="prog-preset" onClick={() => onPick(view.chords)} data-preset={view.preset.id}
      aria-label={`${title}: ${chords}${where}`}>
      <span className="prog-preset-numerals" data-term="romanNumeral">{title}</span>
      <span className="prog-preset-chords">{chords}{where}</span>
    </button>
  );
}

/** The engine's common progressions in the panel's key (presets of the other mode on its relative key). */
export function PresetList({ keyForPresets, onPick }: { keyForPresets: MusicKey; onPick: (chords: readonly Chord[]) => void }) {
  const views = useMemo(() => presetViews(keyForPresets), [keyForPresets]);
  return (
    <div className="prog-presets" data-testid="progression-preset-list">
      {views.map((v) => <PresetButton key={v.preset.id} view={v} onPick={onPick} />)}
    </div>
  );
}

export function PresetsSheet({ open, onClose, keyForPresets, onPick }: {
  open: boolean;
  onClose: () => void;
  keyForPresets: MusicKey;
  onPick: (chords: readonly Chord[]) => void;
}) {
  const { t } = useTranslation();
  return (
    <Sheet open={open} onClose={onClose} title={t('progression.common')} closeLabel={t('common.close')} testId="progression-presets-sheet">
      <p className="text-caption prog-dim">{t('progression.presetReplaces')}</p>
      <PresetList keyForPresets={keyForPresets} onPick={onPick} />
    </Sheet>
  );
}
