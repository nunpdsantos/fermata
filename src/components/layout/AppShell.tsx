import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TopBar } from './TopBar.tsx';
import { InstrumentDock } from './InstrumentDock.tsx';
import { ToastRegion } from './ToastRegion.tsx';
import { WelcomeHost } from './WelcomeHost.tsx';
import { TourHost } from '../tour/TourHost.tsx';
import { useToastAvoid } from './toastLayout.ts';
import { useAppStore } from '../../state/store.ts';
import type { Detent } from '../../state/dock.ts';
import { useMediaQuery, SHEET_QUERY } from '../../hooks/useMediaQuery.ts';

const estimateAvailable = () => {
  if (typeof window === 'undefined') return 0;
  const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
  return Math.max(0, window.innerHeight - ((coarse ? 44 : 36) + 16));
};

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * Top bar, the view, and the instrument dock (hidden in Drill, which owns its
 * full vertical space). Toasts are an overlay under the top bar that never
 * reaches the dock (it registers with `useToastAvoid`) — nothing in the page
 * moves when one appears or leaves (W11-A review round 4).
 */
export function AppShell({ children }: AppShellProps) {
  const { t } = useTranslation();
  const view = useAppStore((s) => s.view);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  // First render: the window less an estimated top bar (tap + 16 px), so the
  // sheet is drawn at its real size from the first frame (it started at 0 and
  // grew — a load-time layout shift); measured right after.
  const [available, setAvailable] = useState(estimateAvailable);

  // Room under the top bar: the phone sheet's detents are sized from it. It
  // only changes with the window (toasts never take room from it).
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

  const hasDock = view !== 'drill';
  useToastAvoid(dockRef, hasDock);
  // The sheet at Full covers the view: the view is then inert, so Tab never
  // lands on a control hidden under the sheet (WCAG 2.4.11; the W11-A focus
  // walk found the root / scale chips there). What the sheet SHOWS decides:
  // a Full chosen for the guitar is Half under the phone keyboard, which
  // fits at Half, and the view above it stays live.
  const isSheet = useMediaQuery(SHEET_QUERY);
  const [sheetShown, setSheetShown] = useState<Detent | null>(null);
  const sheetCoversView = hasDock && isSheet && sheetShown === 'full';

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
      {/* Toasts: a fixed overlay under the top bar (see toastLayout.ts). */}
      <ToastRegion />
      <div ref={bodyRef} className="flex-1 min-h-0 flex flex-col">
        <main id="main-content" className="flex-1 overflow-hidden flex flex-col min-h-0" inert={sheetCoversView || undefined}>
          {children}
        </main>
        {hasDock && (
          <div ref={dockRef} className="shrink-0 min-h-0 flex flex-col">
            <InstrumentDock view={view} available={available} onSheetShown={setSheetShown} />
          </div>
        )}
      </div>
      {/* First visit only (state/welcomeGate.ts): a lazy sheet. */}
      <WelcomeHost />
      {/* The self-playing tour, when asked for (state/demoRequest.ts): a lazy overlay. */}
      <TourHost />
    </div>
  );
}
