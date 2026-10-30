import { useLayoutEffect, useRef } from 'react';
import { LazyMotion, MotionConfig, domAnimation, AnimatePresence, m } from 'framer-motion';
import { AppShell } from './components/layout/AppShell.tsx';
import { ViewSlot, type ViewLoader } from './components/ViewSlot.tsx';
import { QuickSearch } from './components/navigation/QuickSearch.tsx';
import { PWAPrompts } from './components/layout/PWAPrompts.tsx';
import { ToastContainer } from './components/layout/Toast.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { useLanguage } from './hooks/useLanguage.ts';
import { useAppStore } from './state/store.ts';
import { pickBootView } from './state/bootView.ts';
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

  // Boot view resolution (runs ONCE, before first paint of the view):
  //  - a valid ?view= param wins (PWA shortcut / deep link), else restore
  //    the persisted lastView. The param is then stripped from the URL so a
  //    plain refresh doesn't re-force it. `view` itself isn't persisted, so on
  //    a fresh boot it is the slice default 'explore' until this resolves it.
  const bootResolved = useRef(false);
  useLayoutEffect(() => {
    if (bootResolved.current) return; // guard StrictMode's double-invoke
    bootResolved.current = true;

    const params = new URLSearchParams(window.location.search);
    const paramView = params.get('view');
    const { setView, lastView } = useAppStore.getState();
    setView(pickBootView(window.location.search, lastView));

    // Strip ?view= from the URL (keep other params) without a navigation.
    if (paramView !== null) {
      params.delete('view');
      const qs = params.toString();
      const url = window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
      window.history.replaceState(window.history.state, '', url);
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
            aria-label={`${view} view`}
          >
            <ViewSlot viewKey={view} loaders={VIEW_LOADERS} />
          </m.div>
        </AnimatePresence>
      </AppShell>
      <QuickSearch />
      <PWAPrompts />
      <ToastContainer />
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
