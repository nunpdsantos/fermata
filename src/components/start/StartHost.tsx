import { lazy, Suspense, useEffect } from 'react';
import { startPwaRegistration } from '../../hooks/usePWA.ts';

// Its own chunk: only a first visit downloads it (and it is precached).
const StartScreen = lazy(() => import('./StartScreen.tsx'));

/**
 * The start screen's place (App renders it INSTEAD of the shell while the
 * first-visit gate is open and no tour is asked for — state/startGate.ts).
 * Until its chunk arrives the page is just the page colour: nothing of the
 * workbench ever shows first.
 *
 * The shell's PWAPrompts registers the service worker; the shell is not
 * mounted here, so this does it too (once per page either way), and a first
 * visit starts caching for offline use at once.
 */
export function StartHost() {
  useEffect(() => {
    startPwaRegistration();
  }, []);
  return (
    <Suspense fallback={<div className="start-page" data-testid="start-screen-loading" />}>
      <StartScreen />
    </Suspense>
  );
}
