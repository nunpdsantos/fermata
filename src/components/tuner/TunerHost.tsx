import { Suspense, lazy, useEffect, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from '../../state/toastStore.ts';
import { closeTuner, useTunerRequest } from './tunerRequest.ts';

/**
 * Where the tuner lives (wave 3, brief T): mounted by the top bar, it
 * fetches the tuner's chunk the first time the tuner is asked for and keeps
 * it mounted after (the sheet returns focus when it closes). A failed
 * download says so once and closes; the next open downloads again under a
 * fresh lazy() and key (the Settings pattern, TopBar.tsx).
 */
type TunerProps = { open: boolean; onClose: () => void };
const loadTuner = () => lazy<ComponentType<TunerProps>>(() =>
  import('./TunerSheet.tsx').then((m) => ({ default: m.TunerSheet })).catch(() => ({ default: TunerUnavailable })));
let TunerSheet = loadTuner();
// A new attempt gets a fresh lazy(): React keeps a rejected one for good.
useTunerRequest.subscribe((s, prev) => {
  if (s.attempt > prev.attempt && prev.attempt >= 0) TunerSheet = loadTuner();
});

function TunerUnavailable() {
  const { t } = useTranslation();
  useEffect(() => {
    useTunerRequest.setState({ open: false, failed: true });
    toast(t('tunerEntry.loadError'), 'error');
  }, [t]);
  return null;
}

export function TunerHost() {
  const { open, attempt } = useTunerRequest();
  if (attempt < 0) return null;
  return (
    <Suspense fallback={null}>
      <TunerSheet key={attempt} open={open} onClose={closeTuner} />
    </Suspense>
  );
}
