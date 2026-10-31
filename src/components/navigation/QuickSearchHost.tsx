import { Component, lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from 'react';
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
 * Always mounted (App). Until search has been opened once, this owns the
 * Cmd/Ctrl+K shortcut; after that the loaded QuickSearch owns all its keys
 * (toggle, Escape) exactly as before, and stays mounted so its close
 * animation and focus restore keep working.
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

  useEffect(() => {
    if (mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useAppStore.getState().setQuickSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted]);

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
      </Suspense>
    </SearchBoundary>
  );
}
