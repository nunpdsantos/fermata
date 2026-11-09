import { lazy, Suspense, useEffect, useRef } from 'react';
import { useWelcomeStore } from '../../state/welcomeGate.ts';
import { useAppStore } from '../../state/store.ts';

// Its own chunk: only a first visit downloads it (and it is precached).
const WelcomeSheet = lazy(() => import('./WelcomeSheet.tsx'));

/**
 * Mounts the first-visit welcome (state/welcomeGate.ts) while it is open.
 * When it closes, focus goes to the tab of the view the learner is now in
 * (the Sheet itself had nothing to return focus to: it opened at page load).
 */
export function WelcomeHost() {
  const open = useWelcomeStore((s) => s.open);
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) {
      const view = useAppStore.getState().view;
      document.getElementById(`tab-${view}`)?.focus();
    }
    wasOpen.current = open;
  }, [open]);
  if (!open) return null;
  return (
    <Suspense fallback={null}>
      <WelcomeSheet />
    </Suspense>
  );
}
