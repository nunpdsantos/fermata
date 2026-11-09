import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExploreHeader } from '../components/explore/ExploreHeader.tsx';
import { ScaleStrip } from '../components/explore/ScaleStrip.tsx';
import { ChordsCard } from '../components/explore/ChordsCard.tsx';
import { CircleNavigator } from '../components/explore/CircleNavigator.tsx';
import { useMediaQuery, PHONE_QUERY } from '../hooks/useMediaQuery.ts';
import { useAppStore } from '../state/store.ts';
import { useFocusNoteStore } from '../state/focusNoteStore.ts';
import { Button } from '../components/ui/Button.tsx';
import { Sheet } from '../components/ui/Sheet.tsx';

const GuitarPractice = lazy(() => import('../components/practice/GuitarPractice.tsx'));

/** Laptop widths: the circle of fifths stands beside the work (D-30). */
export const WORKBENCH_QUERY = '(min-width: 1200px)';

/**
 * EXPLORE — the workbench (W11-B, decisions D-25 / D-29 / D-30).
 *
 *   key ▾  scale ▾   summary              ▶ Play scale  ⋯ (Copy · Print · Compare)
 *   ┌ notes of the scale: staff + degrees ┐ ┌ circle of fifths ┐
 *   └ chords in key: In key / All / Build ┘ └ signature, keys  ┘
 *   [ instrument dock ]
 *
 * What scrolls: the page never does. At laptop widths (≥ 1200 px) the main
 * column (staff strip + chords) and the circle column each scroll on their
 * own when the window is too short — at 1440×900 neither needs to. Below
 * that the work area scrolls as one column (the circle under the chords on
 * a tablet; on a phone the circle is the key picker). The header and the
 * instrument dock never scroll away.
 *
 * Hovering, focusing or tapping a note anywhere makes it the linked focus
 * note (state/focusNoteStore.ts); changing the key or scale clears it.
 */
export function ExploreView() {
  const { t } = useTranslation();
  const wide = useMediaQuery(WORKBENCH_QUERY);
  const phone = useMediaQuery(PHONE_QUERY);
  const selectedKey = useAppStore((s) => s.selectedKey);
  const selectedScale = useAppStore((s) => s.selectedScale);
  const guitar = useAppStore((s) => s.instrument === 'guitar');
  const [practice, setPractice] = useState(false);
  // From the "⋯" menu: the practice tools are the guitar's, so switch to it first.
  const openPractice = () => {
    const app = useAppStore.getState();
    if (app.instrument !== 'guitar') app.setInstrument('guitar');
    setPractice(true);
  };
  const practiceAction = guitar ? <Button data-testid="practice-open" aria-haspopup="dialog" onClick={() => setPractice(true)}>{t('practice.title')}</Button> : null;

  // A new key or scale starts with nothing in focus; so does leaving Explore.
  useEffect(() => {
    useFocusNoteStore.getState().clearAll();
  }, [selectedKey, selectedScale]);
  useEffect(() => () => useFocusNoteStore.getState().clearAll(), []);

  return (
    <div className="explore-root">
      <ExploreHeader practiceAction={wide ? practiceAction : undefined} onPractise={openPractice} />
      <div className="explore-work" data-testid="explore-work" data-layout={wide ? 'workbench' : phone ? 'phone' : 'column'}>
        <div className="explore-main">
          <ScaleStrip key={`${selectedKey.natural}${selectedKey.accidental}:${selectedScale}`} />
          <ChordsCard />
          {guitar && !wide && <section className="explore-card no-print" data-testid="practice-card">{practiceAction}</section>}
          {!wide && !phone && <CircleNavigator collapsible />}
        </div>
        {wide && (
          <aside className="explore-aside">
            <CircleNavigator />
          </aside>
        )}
      </div>
      <Sheet open={practice && guitar} onClose={() => setPractice(false)} title={t('practice.title')}
        closeLabel={t('common.close')} testId="practice-sheet">
        <Suspense fallback={<p role="status">{t('common.loading')}</p>}>
          {practice && guitar && <GuitarPractice />}
        </Suspense>
      </Sheet>
    </div>
  );
}
