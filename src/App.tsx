import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation, m } from 'framer-motion';
import { AppShell } from './components/layout/AppShell.tsx';
import { ViewSlot, ViewLoadingFallback, type ViewLoader } from './components/ViewSlot.tsx';
import { QuickSearchHost } from './components/navigation/QuickSearchHost.tsx';
import { useTheme } from './hooks/useTheme.ts';
import { useLanguage } from './hooks/useLanguage.ts';
import { useStopPlaybackOnViewChange } from './hooks/useStopPlaybackOnViewChange.ts';
import { useAppStore } from './state/store.ts';
import { pickBootView } from './state/bootView.ts';
import { readShareParams, cleanedAddress, markOpenedFromShareLink } from './state/shareParams.ts';
import { LANG_PARAM } from './i18n/language.ts';
import { ShareLinkHost } from './components/share/ShareLinkHost.tsx';
import { openLinkCode } from './services/shareLinkBoot.ts';
import type { ViewMode } from './state/storeTypes.ts';
import { StartHost } from './components/start/StartHost.tsx';
import { useStartScreenOwed, useStartScreenShown } from './state/startGate.ts';
import { useDemoRequest } from './state/demoRequest.ts';
import { useExternalNotes } from './services/externalNotesHost.ts';
import { restoreMidiKeyboard } from './services/midi/midiStatus.ts';

// Code-split views. ViewSlot owns the lazy() wrappers so a failed download
// can be retried (audit W9-03); this table must stay a stable module constant.
const VIEW_LOADERS: Record<ViewMode, ViewLoader> = {
  explore: () => import('./views/ExploreView.tsx').then((m) => ({ default: m.ExploreView })),
  learn: () => import('./views/LearnView.tsx').then((m) => ({ default: m.LearnView })),
  drill: () => import('./views/DrillView.tsx').then((m) => ({ default: m.DrillView })),
};

/** What a shared link may set (services/shareLinkOpen.ts applyShareTarget). */
const LINK_SETS = ['view', 'selectedKey', 'selectedScale', 'selectedChord', 'chordInversion', 'instrument', 'pendingLearnTarget', 'capoFret'] as const;

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
  //    waits for it, so the learner never sees the old key flash first and no
  //    view mounts (writing its state or history) before the link applies;
  //    meanwhile the work area shows a view's loading sign. Going elsewhere or
  //    choosing anything the link would set meanwhile ends the wait: that is
  //    drawn and the link is offered ("Open"), never applied over it. A failed
  //    download says so, with "Try Again" (services/shareLinkBoot.ts). Its
  //    parameters leave the address bar at once, like ?view=.
  const [linkOpening, setLinkOpening] = useState(
    () => readShareParams(window.location.search, window.location.hash) !== null,
  );
  const bootResolved = useRef(false);
  // The learner has gone elsewhere since a shared link began to open (below).
  const moved = useRef(false);
  // The tour asked for while the link waits: it needs the view drawn, and its
  // end puts back what it found, so the link is offered, never applied under it.
  const tour = useDemoRequest();
  useEffect(() => {
    if (tour) {
      moved.current = true;
      setLinkOpening(false);
    }
  }, [tour]);
  useLayoutEffect(() => {
    if (bootResolved.current) return; // guard StrictMode's double-invoke
    bootResolved.current = true;

    const { search, hash, pathname } = window.location;
    const params = new URLSearchParams(search);
    const paramView = params.get('view');
    const link = readShareParams(search, hash);
    const { setView, lastView } = useAppStore.getState();
    setView(pickBootView(search, lastView, window.history.state));

    // Strip ?view=, ?lang= (i18n/language.ts: it has chosen the language of a
    // first visit by now, or was ignored) and the link's parameters (keep
    // other params) without a navigation.
    if (paramView !== null || link !== null || params.has(LANG_PARAM)) {
      window.history.replaceState(window.history.state, '', cleanedAddress(pathname, search, hash));
    }

    // Back and Forward inside the app (P3): its own chunk, once the boot view is set.
    import('./state/appHistory.ts').catch(() => undefined);

    if (link !== null) {
      markOpenedFromShareLink();
      // Until the link is applied, offered, held or has failed: the learner
      // going elsewhere or choosing anything the link would set (by a tab,
      // Back, Quick Search, the instrument switch, Settings' capo), or asking
      // for the tour (below), ends the wait, and the link is then offered,
      // never applied over it. Only this tab's own acts can change these: the
      // settings store does not follow other tabs (state/tabSafe.ts).
      const stop = useAppStore.subscribe((s, p) => {
        if (LINK_SETS.some((k) => s[k] !== p[k])) {
          moved.current = true;
          setLinkOpening(false);
        }
      });
      const asked = () => {
        stop();
        return moved.current;
      };
      void openLinkCode(link, readShareParams(search), asked, pathname + search + hash)
        .finally(() => {
          stop();
          setLinkOpening(false);
        });
    }
  }, []); // run-once on mount

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
      {startShown ? <StartHost /> : (
      <AppShell>
        {/* A view fades in and does NOT fade out (20 November 2026): the one
            it replaces is unmounted at once. Until then the view on its way
            out stayed mounted for a 150 ms exit and the next one waited for
            it (AnimatePresence, mode "wait"). With Back (or a tab) pressed
            just as a lesson was arriving, the lesson mounted inside the Learn
            view that was already leaving: it wrote its screen and drove the
            instrument (now also refused where they are written: appHistory
            `shown`, lessonInstrument), and its exit never ended, so Explore
            never mounted: the tab said Explore and the screen stayed the
            lesson until a tab was tapped (GitHub's back-button A6, twice on a
            first attempt; here 8 of 60 with the CPU slowed, with and without
            reduced motion). With no view on its way out there is nothing to
            arrive in. The guards are still needed: a lesson drawn just before
            the view is left runs its first effects before the next view is
            drawn, with the store already on that view. */}
        <m.div
          key={view}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="h-full flex flex-col min-h-0"
          id={`${view}-panel`}
          role="tabpanel"
          aria-labelledby={`tab-${view}`}
        >
          {linkOpening ? <ViewLoadingFallback /> : <ViewSlot viewKey={view} loaders={VIEW_LOADERS} />}
        </m.div>
      </AppShell>
      )}
      {!startShown && <QuickSearchHost />}
      {!startShown && <ShareLinkHost />}
      </MotionConfig>
    </LazyMotion>
  );
}

export default App;
