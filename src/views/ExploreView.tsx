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
import { useExploreSimple } from '../state/exploreDetail.ts';
import { useGlossaryUi } from '../glossary/glossaryUi.ts';
import { toast } from '../state/toastStore.ts';
import { ProgressionHost } from '../components/explore/ProgressionHost.tsx';

const GuitarPractice = lazy(() => import('../components/practice/GuitarPractice.tsx'));
// The explanations (text in three languages, examples, sounds): fetched the
// first time a word is tapped, never with the page. A failed download says
// so and is retried on the next tap (a fresh lazy()).
const loadGlossary = () => lazy(() => import('../glossary/GlossaryHost.tsx').catch(() => ({ default: GlossaryUnavailable })));
let GlossaryHost = loadGlossary();
function GlossaryUnavailable() {
  const { t } = useTranslation();
  useEffect(() => {
    useGlossaryUi.setState({ request: null, wanted: false });
    GlossaryHost = loadGlossary();
    toast(t('glossary.ui.loadError'), 'error');
  }, [t]);
  return null;
}

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
  // Simple view (wave 1): the key, its notes, its chords and the instrument.
  const simple = useExploreSimple();
  const glossaryWanted = useGlossaryUi((s) => s.wanted);
  // An explanation still open when Explore goes away (a search result opening
  // a lesson, a tour step) is closed: it would come back on the next visit,
  // detached from its word and taking focus.
  useEffect(() => () => useGlossaryUi.getState().close(), []);
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
    <div className="explore-root" data-detail={simple ? 'simple' : 'full'} data-testid="explore-root">
      <ExploreHeader practiceAction={wide ? practiceAction : undefined} onPractise={openPractice} />
      <div className="explore-work" data-testid="explore-work" data-layout={wide ? 'workbench' : phone ? 'phone' : 'column'}>
        <div className="explore-main">
          <ScaleStrip key={`${selectedKey.natural}${selectedKey.accidental}:${selectedScale}`} />
          <ChordsCard />
          {guitar && !wide && <section className="explore-card no-print" data-testid="practice-card">{practiceAction}</section>}
          {!wide && !phone && !simple && <CircleNavigator collapsible />}
        </div>
        {wide && !simple && (
          <aside className="explore-aside">
            <CircleNavigator />
          </aside>
        )}
      </div>
      <Sheet open={practice && guitar} onClose={() => setPractice(false)} title={t('practice.title')}
        closeLabel={t('common.close')} testId="practice-sheet" companions>
        <Suspense fallback={<p role="status">{t('common.loading')}</p>}>
          {practice && guitar && <GuitarPractice />}
        </Suspense>
      </Sheet>
      {/* A lesson or a link asking for the Progression panel (wave 2). */}
      <ProgressionHost />
      {glossaryWanted && (
        <Suspense fallback={null}>
          <GlossaryHost />
        </Suspense>
      )}
    </div>
  );
}
