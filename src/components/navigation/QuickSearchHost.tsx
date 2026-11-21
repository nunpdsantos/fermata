import { Component, lazy, Suspense, useEffect, useLayoutEffect, useState, type ComponentType, type ReactNode } from 'react';
import { useAppStore } from '../../state/store.ts';

type SearchLoader = () => Promise<{ default: ComponentType }>;

// Quick Search (with the search index and both parsers) is its own chunk,
// fetched the first time search opens — audit W9-11: it sat in the entry
// file every visit paid for. It is precached, so it opens offline too.
const loadQuickSearch: SearchLoader = () => import('./QuickSearch.tsx').then((m) => ({ default: m.QuickSearch }));

const closeSearch = () => useAppStore.getState().setQuickSearchOpen(false);

/** A failed search download must not take the whole app down: report it. */
class SearchBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('[QuickSearch] could not load', error);
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// The history model's hook for a layer (`useBackLayer`). The model is its own
// chunk, which App fetches once the first screen is up (importing it here would
// put it in the entry file and install it at once): fetched by the first search
// asked for, a promise later, and kept.
type BackLayerHook = (open: boolean, close: () => void) => void;
let backLayerHook: BackLayerHook | undefined;
const loadBackLayer = () => import('../../state/appHistory.ts').then((h) => (backLayerHook = h.useBackLayer));

function BackLayer({ hook }: { hook: BackLayerHook }) {
  hook(useAppStore((s) => s.quickSearchOpen), closeSearch);
  return null;
}

/**
 * Search asked for while the dialog's code is on its way is a layer of the
 * history model, as the drawn dialog is: Back cancels it, and the app stays on
 * its screen (until then Back went back a screen and the dialog then opened
 * over it). It is Suspense's fallback, so it goes in the step the code is
 * drawn, and its clean-up runs before the dialog opens its own layer (React
 * runs the clean-ups of a step's effects before its new ones): that layer
 * reuses the entry, one per open.
 */
function Asked() {
  const [hook, setHook] = useState(() => backLayerHook);
  useEffect(() => {
    if (!hook) loadBackLayer().then((h) => setHook(() => h), () => undefined);
  }, [hook]);
  return hook ? <BackLayer hook={hook} /> : null;
}

// The mounted host's listener, on (true) or off (false); none while no host
// is mounted (App mounts one).
let hostKeys: ((on: boolean) => void) | null = null;

/**
 * Drawn in the same step as the dialog's code, after it: the dialog has just
 * attached its own listener (its layout effect runs first), so the host lets
 * go here, and takes the keys back if that code goes (an error).
 */
function KeysTaken() {
  useLayoutEffect(() => {
    hostKeys?.(false);
    return () => hostKeys?.(true);
  }, []);
  return null;
}

/**
 * Always mounted (App). Until the dialog's code is drawn, this owns Quick
 * Search's keys: Cmd/Ctrl+K opens, and closes what it asked for (its default
 * always prevented, so the browser's own Ctrl+K never runs; a held key acts
 * once); Escape closes it; and while the code is on its way the browser's Back
 * cancels it (`Asked`). Between a first Cmd/Ctrl+K (or the search button) and
 * the code arriving, nothing else listened: an Escape or a second Cmd/Ctrl+K
 * there was lost and the dialog opened anyway (leftovers Q1). Then the loaded
 * QuickSearch owns all its keys and its layer, and stays mounted so its close
 * animation and focus restore keep working. One listener at every moment: two
 * that both toggle cancel out.
 *
 * If the download fails (offline before it was cached, a flaky connection),
 * search closes and the host takes the shortcut back; the NEXT open builds a
 * fresh lazy() and downloads again — React caches a rejected lazy() for good,
 * so without that only a page reload could ever open search again (review
 * item 4).
 */
export function QuickSearchHost({ load = loadQuickSearch }: { load?: SearchLoader }) {
  const open = useAppStore((s) => s.quickSearchOpen);
  const [mounted, setMounted] = useState(open);
  const [attempt, setAttempt] = useState(0);
  const [Search, setSearch] = useState(() => lazy(load));
  if (open && !mounted) setMounted(true); // derive-during-render: mount on first open

  useLayoutEffect(() => {
    let on = false;
    const onKeyDown = (e: KeyboardEvent) => {
      const { quickSearchOpen, setQuickSearchOpen } = useAppStore.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // A held key repeats: it acts once.
        if (!e.repeat) setQuickSearchOpen(!quickSearchOpen);
      } else if (e.key === 'Escape' && quickSearchOpen) setQuickSearchOpen(false);
    };
    const listen = (want: boolean) => {
      if (want === on) return;
      on = want;
      if (on) window.addEventListener('keydown', onKeyDown);
      else window.removeEventListener('keydown', onKeyDown);
    };
    hostKeys = listen;
    listen(true);
    return () => {
      hostKeys = null;
      listen(false);
    };
  }, []);

  const onFail = () => {
    closeSearch();
    setMounted(false);
    setSearch(() => lazy(load));
    setAttempt((n) => n + 1);
  };

  if (!mounted) return null;
  return (
    <SearchBoundary key={attempt} onFail={onFail}>
      <Suspense fallback={<Asked />}>
        <Search />
        <KeysTaken />
      </Suspense>
    </SearchBoundary>
  );
}
