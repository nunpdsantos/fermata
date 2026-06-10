import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { LazyMotion, MotionConfig, domAnimation, AnimatePresence, m } from 'framer-motion';
import { AppShell } from './components/layout/AppShell.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { QuickSearch } from './components/navigation/QuickSearch.tsx';
import { PWAPrompts } from './components/layout/PWAPrompts.tsx';
import { ToastContainer } from './components/layout/Toast.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { useLanguage } from './hooks/useLanguage.ts';
import { useAppStore } from './state/store.ts';

function ViewLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--text-muted)' }} />
    </div>
  );
}

function ViewErrorFallback(_error: Error, reset: () => void) {
  // Called as a render function, not a component — use i18n instance directly
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-zinc-400 text-sm mb-4"><ViewErrorText /></p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          <TryAgainText />
        </button>
      </div>
    </div>
  );
}

function ViewErrorText() {
  const { t } = useTranslation();
  return <>{t('error.viewError')}</>;
}

function TryAgainText() {
  const { t } = useTranslation();
  return <>{t('common.tryAgain')}</>;
}

const ExploreView = lazy(() => import('./views/ExploreView.tsx').then((m) => ({ default: m.ExploreView })));
const LearnView = lazy(() => import('./views/LearnView.tsx').then((m) => ({ default: m.LearnView })));
const DrillView = lazy(() => import('./views/DrillView.tsx').then((m) => ({ default: m.DrillView })));

const VIEW_COMPONENTS = {
  explore: ExploreView,
  learn: LearnView,
  drill: DrillView,
} as const;

function App() {
  const view = useAppStore((s) => s.view);
  const ViewComponent = VIEW_COMPONENTS[view];

  // Sync theme preference to <html> class
  useTheme();
  // Sync language preference to i18next
  useLanguage();

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
            <ErrorBoundary resetKey={view} fallback={ViewErrorFallback}>
              <Suspense fallback={<ViewLoadingFallback />}>
                <ViewComponent />
              </Suspense>
            </ErrorBoundary>
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
