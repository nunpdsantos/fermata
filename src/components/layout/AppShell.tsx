import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from './TopBar.tsx';
import { InstrumentDock } from './InstrumentDock.tsx';
import { ToastRegion } from './ToastRegion.tsx';
import { useAppStore } from '../../state/store.ts';
import { useMediaQuery, SHEET_QUERY } from '../../hooks/useMediaQuery.ts';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Top bar, the view, and the instrument dock (hidden in Drill, which owns its
 * full vertical space). The dock's height is published as `--dock-h` on
 * <html> so the toast stack can sit above it (W9-22: toasts never cover the
 * instrument). `html[data-toast]` picks the toast layout (index.css): "band"
 * — in the flow under the top bar — on phones / short screens (the sheet) and
 * wherever there is no dock (Drill: a fixed stack there reached the answers on
 * a tablet); "stack" — fixed above the docked panel — otherwise.
 */
export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const view = useAppStore((s) => s.view);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);

  // Room under the top bar: the phone sheet's Full detent.
  useLayoutEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const measure = () => setAvailable(body.clientHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    return () => ro.disconnect();
  }, []);

  // --dock-h follows the dock (0 in Drill).
  const hasDock = view !== 'drill';
  // The sheet at Full covers the whole view: the view is then inert, so Tab
  // never lands on a control hidden under the sheet (WCAG 2.4.11; the W11-A
  // focus walk found the root / scale chips there).
  const isSheet = useMediaQuery(SHEET_QUERY);
  const sheetCoversView = useAppStore((s) => hasDock && isSheet && s.dockDetents[view as 'explore' | 'learn'] === 'full');
  useLayoutEffect(() => {
    const root = document.documentElement;
    const dock = dockRef.current;
    root.dataset.toast = !hasDock || !dock || isSheet ? 'band' : 'stack';
    if (!hasDock || !dock) {
      root.style.setProperty('--dock-h', '0px');
      return;
    }
    const publish = () => root.style.setProperty('--dock-h', `${Math.round(dock.getBoundingClientRect().height)}px`);
    publish();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(publish);
    ro.observe(dock);
    return () => ro.disconnect();
  }, [hasDock, isSheet]);

  return (
    <div className="h-screen supports-[height:100dvh]:h-dvh flex flex-col" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[90] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:rounded-lg focus:outline-none focus:ring-2"
        style={{ ['--tw-ring-color' as string]: 'var(--focus-ring)', backgroundColor: 'var(--card-hover)', color: 'var(--text)' }}
      >
        {t('nav.skipToContent')}
      </a>
      <TopBar />
      {/* Toasts: on phones and short screens a band in the flow right here,
          under the top bar (it pushes the view and the dock down, so it never
          covers either); on wider, taller screens a fixed stack above the dock. */}
      <ToastRegion />
      <div ref={bodyRef} className="flex-1 min-h-0 flex flex-col">
        <main id="main-content" className="flex-1 overflow-hidden flex flex-col min-h-0" inert={sheetCoversView || undefined}>
          {children}
        </main>
        {hasDock && (
          <div ref={dockRef} className="shrink-0 min-h-0 flex flex-col">
            <InstrumentDock view={view} available={available} />
          </div>
        )}
      </div>
    </div>
  );
}
