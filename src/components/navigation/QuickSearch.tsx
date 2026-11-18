import { useState, useEffect, useCallback, useRef, useMemo, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, m } from 'framer-motion';
import { useAppStore } from '../../state/store.ts';
import { getResults, searchNames, type SearchResultType } from './quickSearchResults.ts';
import { searchBadgeColors } from './searchBadge.ts';
import { useDegreeColorsEnabled } from '../../hooks/useDegreeColors.ts';
import { useLocalizedModuleIndex } from '../../hooks/useLocalizedModuleIndex.ts';
import { useLearnerProfile } from '../../state/learnerProfile.ts';

const TYPE_KEYS: Record<SearchResultType, string> = {
  Scale: 'search.typeScale',
  Chord: 'search.typeChord',
  Key: 'search.typeKey',
  Lesson: 'search.typeLesson',
};

// The app's own magnifier — the same drawing as the top bar's search button
// (layout/TopBar.tsx SEARCH_ICON; audit Q14: the dialog showed the 🔎 emoji).
const SEARCH_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16" y2="16" />
  </svg>
);

/**
 * Quick Search: an editable combobox whose popup is a listbox (WAI-ARIA
 * Authoring Practices, "Combobox Pattern",
 * https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ — audit A14). Focus stays
 * in the input; the arrows move the selected result, which is the input's
 * `aria-activedescendant` (so a screen reader names it) and is kept in view by
 * scrolling the list only.
 */
export function QuickSearch() {
  const { t } = useTranslation();
  const quickSearchOpen = useAppStore((s) => s.quickSearchOpen);
  const setQuickSearchOpen = useAppStore((s) => s.setQuickSearchOpen);
  const degreeColorsOn = useDegreeColorsEnabled();
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // Set by the arrow keys: the next selection change scrolls it into view (a
  // mouse pointing at a row never scrolls the list under it).
  const revealRef = useRef(false);
  const listId = useId();
  const optionId = (i: number) => `${listId}-option-${i}`;

  // Portuguese/Spanish lesson titles and keywords (lazy; English until loaded).
  const language = useAppStore((s) => s.language);
  const showSolfege = useAppStore((s) => s.showSolfege);
  const localizedIndex = useLocalizedModuleIndex(language);
  // Where track lessons rank among the lesson hits (level lessons first
  // without a track).
  const learnerProfile = useLearnerProfile();

  // Named in the learner's language, as Explore names them (A13); "Do7" read
  // as C7 first in PT / ES or with Dó-Ré-Mi on (A3).
  const names = useMemo(() => searchNames(language, showSolfege), [language, showSolfege]);
  const results = useMemo(
    () => getResults(query, localizedIndex, learnerProfile, names),
    [query, localizedIndex, learnerProfile, names],
  );

  // Reset selection when results change
  useEffect(() => {
    queueMicrotask(() => setSelectedIdx(0));
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [results.length, query]);

  // Keep the selected result in view — the list scrolls, nothing else does.
  useEffect(() => {
    if (!revealRef.current) return;
    revealRef.current = false;
    const list = listRef.current;
    const option = list?.querySelector<HTMLElement>(`[data-index="${selectedIdx}"]`);
    if (!list || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight;
  }, [selectedIdx]);

  const restoreFocus = useCallback(() => {
    requestAnimationFrame(() => {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    });
  }, []);

  const closeDialog = useCallback(() => {
    setQuickSearchOpen(false);
    setQuery('');
    restoreFocus();
  }, [setQuickSearchOpen, restoreFocus]);

  // Cmd+K to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen(!quickSearchOpen);
        setQuery('');
      }
      if (e.key === 'Escape' && quickSearchOpen) {
        closeDialog();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickSearchOpen, setQuickSearchOpen, closeDialog]);

  // Capture previous focus and auto-focus input when opened
  useEffect(() => {
    if (quickSearchOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [quickSearchOpen]);

  const executeResult = useCallback(
    (idx: number) => {
      const r = results[idx];
      if (r) {
        r.action();
        setQuickSearchOpen(false);
        setQuery('');
        restoreFocus();
      }
    },
    [results, setQuickSearchOpen, restoreFocus],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        revealRef.current = true;
        setSelectedIdx((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        revealRef.current = true;
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeResult(selectedIdx);
      }
    },
    [results.length, selectedIdx, executeResult],
  );

  const label = t('search.dialogLabel');
  const expanded = results.length > 0;
  const active = expanded ? Math.min(selectedIdx, results.length - 1) : -1;

  return (
    <AnimatePresence>
      {quickSearchOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeDialog}
          />
          {/* Search dialog */}
          <m.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4"
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              onKeyDown={(e) => {
                if (e.key !== 'Tab') return;
                const container = dialogRef.current;
                if (!container) return;
                const focusable = container.querySelectorAll<HTMLElement>(
                  'input, button, [tabindex]:not([tabindex="-1"])'
                );
                if (focusable.length === 0) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                  if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                  }
                } else {
                  if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                  }
                }
              }}
              className="quick-search-panel rounded-xl overflow-hidden"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
            >
              {/* The input is a full --tap target (the design system's rule); with a
                  mouse the row keeps its 44 px (4 + 36 + 4). */}
              <div className="flex items-center px-4 py-1" style={{ borderBottom: '1px solid var(--card)' }}>
                <span className="mr-2 inline-flex" style={{ color: 'var(--text-dim)' }}>{SEARCH_ICON}</span>
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-label={label}
                  aria-autocomplete="list"
                  aria-expanded={expanded}
                  aria-controls={expanded ? listId : undefined}
                  aria-activedescendant={active >= 0 ? optionId(active) : undefined}
                  autoComplete="off"
                  spellCheck={false}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('search.placeholder')}
                  className="flex-1 min-h-(--tap) bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text)' }}
                />
                <kbd className="text-caption px-1.5 py-0.5 rounded" style={{ color: 'var(--text-dim)', backgroundColor: 'var(--card)' }}>
                  ESC
                </kbd>
              </div>
              {expanded && (
                <div ref={listRef} id={listId} role="listbox" aria-label={label} className="relative max-h-64 overflow-y-auto">
                  {results.map((r, i) => (
                    <div
                      key={`${r.type}-${r.label}-${i}`}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onClick={() => executeResult(i)}
                      // Keep focus (and the caret) in the input.
                      onMouseDown={(e) => e.preventDefault()}
                      className="w-full text-left px-4 py-2.5 min-h-(--tap) transition-colors flex items-center justify-between cursor-pointer"
                      style={{
                        backgroundColor: i === active ? 'var(--card-hover)' : 'transparent',
                      }}
                      onMouseEnter={() => setSelectedIdx(i)}
                    >
                      <span className="text-sm" style={{ color: 'var(--text)' }}>{r.label}</span>
                      <span
                        className="text-caption px-1.5 py-0.5 rounded font-medium"
                        data-search-type={r.type}
                        style={searchBadgeColors(r.type, degreeColorsOn)}
                      >
                        {t(TYPE_KEYS[r.type])}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {query && results.length === 0 && (
                <div className="px-4 py-3 text-sm" style={{ color: 'var(--text-dim)' }}>
                  {t('search.noMatch')}
                </div>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}
