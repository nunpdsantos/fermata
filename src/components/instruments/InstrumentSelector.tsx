import { useTranslation } from 'react-i18next';
import { useAppStore, type InstrumentType } from '../../state/store.ts';
import { Segment } from '../ui/Segment.tsx';

const INSTRUMENTS: { id: InstrumentType; labelKey: string }[] = [
  { id: 'piano', labelKey: 'instrument.piano' },
  { id: 'guitar', labelKey: 'instrument.guitar' },
];

/** Piano / Guitar — a Segment (it switches the instrument VIEW, D-28). */
export function InstrumentSelector() {
  const { t } = useTranslation();
  const instrument = useAppStore((s) => s.instrument);
  const setInstrument = useAppStore((s) => s.setInstrument);

  return (
    <div data-tour="instrument" className="shrink-0">
      <Segment
        label={t('instrument.selectorLabel')}
        value={instrument}
        onChange={setInstrument}
        options={INSTRUMENTS.map((i) => ({ value: i.id, label: t(i.labelKey) }))}
      />
    </div>
  );
}
