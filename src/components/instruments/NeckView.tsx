import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { IconButton } from '../ui/Button.tsx';
import { trapTab } from '../ui/focus.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { useAppStore } from '../../state/store.ts';
import { keyName, chordSymbol } from '../explore/focusReadout.ts';
import { DockToolsContext } from '../layout/dockTools.ts';

// The same chunk as the dock's fretboard (it is precached).
const Fretboard = lazy(() => import('./Fretboard.tsx').then((m) => ({ default: m.Fretboard })));

/**
 * The LANDSCAPE FULL-NECK VIEW (W11-B, decision D-26 extra): on a phone held
 * sideways with the guitar, the whole neck — all six strings, frets 0–12
 * (0–15 when the position reaches past the 12th) — fills the screen, with the
 * position stepper, the Notes / Degrees / Fingers toggle and a close ✕. A
 * modal dialog: focus moves in, Tab stays inside, Escape or ✕ closes it and
 * focus returns to the button that opened it. While it is open it owns the
 * one fretboard (the dock's is unmounted).
 */
export function NeckView({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { displayScale: scale } = useKeyContext();
  const chord = useAppStore((s) => s.selectedChord);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  // The header's tool slot: the fretboard puts its stepper and label toggle
  // there (the same channel the laptop dock bar uses).
  const [toolsSlot, setToolsSlot] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const returnTo = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current();
      } else if (rootRef.current) {
        trapTab(e, rootRef.current);
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (returnTo && returnTo.isConnected) returnTo.focus();
    };
  }, []);

  const title = chord ? `${chordSymbol(chord)} · ${keyName(scale, t)}` : keyName(scale, t);

  return createPortal(
    <div
      ref={rootRef}
      className="neck-view"
      role="dialog"
      aria-modal="true"
      aria-labelledby="neck-title"
      data-testid="neck-view"
    >
      <div className="neck-head">
        <IconButton
          ref={closeRef}
          aria-label={t('neck.close')}
          onClick={() => onCloseRef.current()}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          }
        />
        <h2 id="neck-title" className="neck-title">{title}</h2>
        <div ref={setToolsSlot} className="neck-tools" />
      </div>
      <DockToolsContext.Provider value={toolsSlot}>
        <Suspense fallback={null}>
          <Fretboard variant="neck" />
        </Suspense>
      </DockToolsContext.Provider>
    </div>,
    document.body,
  );
}
