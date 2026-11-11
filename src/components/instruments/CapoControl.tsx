import { useTranslation } from 'react-i18next';
import { MAX_CAPO_FRET, setCapoFret } from '../../state/capo.ts';
import { SelectTrigger } from '../ui/SelectTrigger.tsx';
import { CAPO_TERM } from './capoView.ts';

/** "No capo", "Capo 1" … "Capo 9": the choices, in Settings and on the board. */
export function CapoOptions() {
  const { t } = useTranslation();
  return (
    <>
      <option value={0}>{t('capo.none')}</option>
      {Array.from({ length: MAX_CAPO_FRET }, (_, i) => i + 1).map((f) => (
        <option key={f} value={f}>{t('capo.onFret', { fret: f })}</option>
      ))}
    </>
  );
}

/**
 * The board's own capo control (wave 2): shown only while a capo is on — it
 * reads "Capo 3" and changes it or takes it off without opening Settings.
 * With no capo it is not drawn at all (the legacy neck is frozen DOM).
 * `onRemoved` gets focus somewhere sensible once the control leaves.
 */
export function CapoControl({ fret, onRemoved }: { fret: number; onRemoved?: () => void }) {
  const { t } = useTranslation();
  return (
    <SelectTrigger
      data-testid="capo-control"
      data-term={CAPO_TERM}
      aria-label={t('capo.controlLabel')}
      value={fret}
      onChange={(e) => {
        const next = Number(e.target.value);
        setCapoFret(next);
        if (next === 0) onRemoved?.();
      }}
    >
      <CapoOptions />
    </SelectTrigger>
  );
}
