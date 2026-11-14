import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation, AnimatePresence, m } from 'framer-motion';
import { AppShell } from './components/layout/AppShell.tsx';
import { ViewSlot, type ViewLoader } from './components/ViewSlot.tsx';
import { QuickSearchHost } from './components/navigation/QuickSearchHost.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { useLanguage } from './hooks/useLanguage.ts';
import { useStopPlaybackOnViewChange } from './hooks/useStopPlaybackOnViewChange.ts';
import { useAppStore } from './state/store.ts';
import { pickBootView } from './state/bootView.ts';
import { readShareParams, cleanedAddress, markOpenedFromShareLink } from './state/shareParams.ts';
import { LANG_PARAM } from './i18n/language.ts';
import { ShareLinkHost } from './components/share/ShareLinkHost.tsx';
import type { ViewMode } from './state/storeTypes.ts';
import { StartHost } from './components/start/StartHost.tsx';
import { useStartScreenOwed, useStartScreenShown } from './state/startGate.ts';
import { useExternalNotes } from './services/externalNotesHost.ts';
import { restoreMidiKeyboard } from './services/midi/midiStatus.ts';

// Code-split views. ViewSlot owns the lazy() wrappers so a failed download
// can be retried (audit W9-03); this table must stay a stable module constant.
const VIEW_LOADERS: Record<ViewMode, ViewLoader> = {
  explore: () => import('./views/ExploreView.tsx').then((m) => ({ default: m.ExploreView })),
  learn: () => import('./views/LearnView.tsx').then((m) => ({ default: m.LearnView })),
  drill: () => import('./views/DrillView.tsx').then((m) => ({ default: m.DrillView })),
};

function App() {
  const view = useAppStore((s) => s.view);
  // First visit (wave 1): the start screen is the page, in place of the
  // shell — the workbench never shows first. Hidden while a tour is asked
  // for (the app shows behind the tour), back when it ends without a door.
  const startOwed = useStartScreenOwed();
  const startShown = useStartScreenShown();
  const startWasOwed = useRef(startOwed);
  // A door was chosen: focus goes to the tab of the view now shown.
  useEffect(() => {
    if (startWasOwed.current && !startOwed) {
      document.getElementById(`tab-${useAppStore.getState().view}`)?.focus();
    }
    startWasOwed.current = startOwed;
  }, [startOwed]);

  // Sync theme preference to <html> class
  useTheme();
  // Sync language preference to i18next
  useLanguage();
  // Leaving a view stops its playback (W8-01)
  useStopPlaybackOnViewChange();
  // Notes played on a real instrument (wave 3): the one listener, above the
  // start screen and the shell; a MIDI keyboard left on comes back if allowed.
  useExternalNotes(startShown);
  useEffect(() => restoreMidiKeyboard(), []);

  // Boot view resolution (runs ONCE, before first paint of the view):
  //  - a valid ?view= param wins (PWA shortcut / deep link), else restore
  //    the persisted lastView. The param is then stripped from the URL so a
  //    plain refresh doesn't re-force it. `view` itself isn't persisted, so on
  //    a fresh boot it is the slice default 'explore' until this resolves it.
  //  - a shared link (?key= &scale= &chord= &inst= &lesson=, state/shareParams.ts)
  //    is opened by its own lazy chunk (it needs the chord parser); the view
  //    waits for it, so the learner never sees the old key flash first. Its
  //    parameters leave the address bar at once, like ?view=.
  const [linkOpening, setLinkOpening] = useState(
    () => readShareParams(window.location.search, window.location.hash) !== null,
  );
  const bootResolved = useRef(false);
  useLayoutEffect(() => {
    if (bootResolved.current) return; // guard StrictMode's double-invoke
    bootResolved.current = true;

    const { search, hash, pathname } = window.location;
    const params = new URLSearchParams(search);
    const paramView = params.get('view');
    const link = readShareParams(search, hash);
    const { setView, lastView } = useAppStore.getState();
    setView(pickBootView(search, lastView));

    // Strip ?view=, ?lang= (i18n/language.ts: it has chosen the language of a
    // first visit by now, or was ignored) and the link's parameters (keep
    // other params) without a navigation.
    if (paramView !== null || link !== null || params.has(LANG_PARAM)) {
      window.history.replaceState(window.history.state, '', cleanedAddress(pathname, search, hash));
    }

    if (link !== null) {
      markOpenedFromShareLink();
      import('./services/shareLinkOpen.ts')
        .then((m) => m.openShareLink(link, readShareParams(search)))
        .catch((e) => console.warn('[share link] could not open', e))
        .finally(() => setLinkOpening(false));
    }
  }, []); // run-once on mount

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
      {startShown ? <StartHost /> : (
      <AppShell>
        <AnimatePresence mode="wait">
          <m.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full flex flex-col min-h-0"
            id={`${view}-panel`}
            role="tabpanel"
            aria-labelledby={`tab-${view}`}
          >
            {!linkOpening && <ViewSlot viewKey={view} loaders={VIEW_LOADERS} />}
          </m.div>
        </AnimatePresence>
      </AppShell>
      )}
      {!startShown && <QuickSearchHost />}
      {!startShown && <ShareLinkHost />}
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
