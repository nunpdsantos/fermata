import { Component, lazy, Suspense, type ReactNode } from 'react';
import i18next from 'i18next';
import { clearDemoRequest, noteDemoFailed, useDemoRequest } from '../../state/demoRequest.ts';
import { toast } from '../../state/toastStore.ts';

// The tour is its own chunk (precached): only a viewer who asks for it downloads it.
// React keeps a rejected lazy() for good, so after a failure the next request
// gets a fresh one and the download is really tried again.
const loadTourPlayer = () => lazy(() => import('./TourPlayer.tsx'));
let TourPlayer = loadTourPlayer();

/**
 * A tour that cannot load (offline before its chunk was cached) or throws
 * clears the request and says so — a toast in the app, a line on the start
 * screen (`useDemoFailed`; it has no toast region): the app (and the start
 * screen) carry on, and asking again tries again.
 */
class TourBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    TourPlayer = loadTourPlayer();
    toast(i18next.t('showMe.loadFailed'), 'info', 5000);
    clearDemoRequest();
    noteDemoFailed();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The ONE tour host (brief B), mounted by AppShell: watches
 * `useDemoRequest()` (state/demoRequest.ts), plays the requested tour and
 * calls `clearDemoRequest()` when it ends or is stopped. Whoever asks — the
 * start screen, the "⋯" menu — only calls `requestDemo()`.
 */
export function TourHost() {
  const tour = useDemoRequest();
  if (!tour) return null;
  return (
    <TourBoundary key={tour}>
      <Suspense fallback={null}>
        <TourPlayer tour={tour} onDone={clearDemoRequest} />
      </Suspense>
    </TourBoundary>
  );
}
