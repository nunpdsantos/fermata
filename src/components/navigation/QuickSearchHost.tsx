import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { useAppStore } from '../../state/store.ts';

// Quick Search (with the search index and both parsers) is its own chunk,
// fetched the first time search opens — audit W9-11: it sat in the entry
// file every visit paid for. It is precached, so it opens offline too.
const QuickSearch = lazy(() => import('./QuickSearch.tsx').then((m) => ({ default: m.QuickSearch })));

/** A failed search download must not take the whole app down: close search. */
class SearchBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn('[QuickSearch] could not load', error);
    useAppStore.getState().setQuickSearchOpen(false);
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
 */
export function QuickSearchHost() {
  const open = useAppStore((s) => s.quickSearchOpen);
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true); // derive-during-render: mount on first open

  useEffect(() => {
    if (mounted) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useAppStore.getState().setQuickSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted]);

  if (!mounted) return null;
  return (
    <SearchBoundary>
      <Suspense fallback={null}>
        <QuickSearch />
      </Suspense>
    </SearchBoundary>
  );
}
