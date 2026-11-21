import { Component, lazy, Suspense, useCallback, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { useAppStore } from '../../state/store.ts';

type SearchLoader = () => Promise<{ default: ComponentType }>;

// Quick Search (with the search index and both parsers) is its own chunk,
// fetched the first time search opens — audit W9-11: it sat in the entry
// file every visit paid for. It is precached, so it opens offline too.
const loadQuickSearch: SearchLoader = () => import('./QuickSearch.tsx').then((m) => ({ default: m.QuickSearch }));

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

/**
 * Drawn in the same step as the dialog's code, after it: the dialog has just
 * attached its own listener (its layout effect runs first), so the host lets
 * go here, and takes the keys back if that code goes (an error).
 */
function KeysTaken({ host }: { host: (on: boolean) => void }) {
  useLayoutEffect(() => {
    host(false);
    return () => host(true);
  }, [host]);
  return null;
}

/**
 * Always mounted (App). Until the dialog's code is drawn, this owns Quick
 * Search's keys: Cmd/Ctrl+K opens, and closes what it asked for; Escape
 * closes it. Between a first Cmd/Ctrl+K (or the search button) and the code
 * arriving, nothing else listens: an Escape or a second Cmd/Ctrl+K there was
 * lost and the dialog opened anyway (leftovers Q1). Then the loaded
 * QuickSearch owns all its keys, and stays mounted so its close animation and
 * focus restore keep working. One listener at every moment: two that both
 * toggle cancel out.
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
  // The host's listener on (true) or off (false); nothing once the host is gone.
  const keys = useRef<(on: boolean) => void>(null);
  const host = useCallback((on: boolean) => keys.current?.(on), []);
  if (open && !mounted) setMounted(true); // derive-during-render: mount on first open

  useLayoutEffect(() => {
    let on = false;
    const onKeyDown = (e: KeyboardEvent) => {
      const { quickSearchOpen, setQuickSearchOpen } = useAppStore.getState();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickSearchOpen(!quickSearchOpen);
      } else if (e.key === 'Escape' && quickSearchOpen) setQuickSearchOpen(false);
    };
    const listen = (want: boolean) => {
      if (want === on) return;
      on = want;
      if (on) window.addEventListener('keydown', onKeyDown);
      else window.removeEventListener('keydown', onKeyDown);
    };
    keys.current = listen;
    listen(true);
    return () => {
      keys.current = null;
      listen(false);
    };
  }, []);

  const onFail = () => {
    useAppStore.getState().setQuickSearchOpen(false);
    setMounted(false);
    setSearch(() => lazy(load));
    setAttempt((n) => n + 1);
  };

  if (!mounted) return null;
  return (
    <SearchBoundary key={attempt} onFail={onFail}>
      <Suspense fallback={null}>
        <Search />
        <KeysTaken host={host} />
      </Suspense>
    </SearchBoundary>
  );
}
