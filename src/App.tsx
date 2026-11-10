import { useLayoutEffect, useRef, useState } from 'react';
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
import { ShareLinkHost } from './components/share/ShareLinkHost.tsx';
import type { ViewMode } from './state/storeTypes.ts';

// Code-split views. ViewSlot owns the lazy() wrappers so a failed download
// can be retried (audit W9-03); this table must stay a stable module constant.
const VIEW_LOADERS: Record<ViewMode, ViewLoader> = {
  explore: () => import('./views/ExploreView.tsx').then((m) => ({ default: m.ExploreView })),
  learn: () => import('./views/LearnView.tsx').then((m) => ({ default: m.LearnView })),
  drill: () => import('./views/DrillView.tsx').then((m) => ({ default: m.DrillView })),
};

function App() {
  const view = useAppStore((s) => s.view);

  // Sync theme preference to <html> class
  useTheme();
  // Sync language preference to i18next
  useLanguage();
  // Leaving a view stops its playback (W8-01)
  useStopPlaybackOnViewChange();

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

    // Strip ?view= and the link's parameters (keep other params) without a navigation.
    if (paramView !== null || link !== null) {
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
      <QuickSearchHost />
      <ShareLinkHost />
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
