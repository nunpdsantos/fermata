import { useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../../state/store.ts';
import { useDemoRequest } from '../../state/demoRequest.ts';
import { stopMetronome } from '../../services/metronome/metronome.ts';
import { prepareClicks } from '../../services/metronome/clickVoice.ts';
import { MetronomeBar } from './MetronomeBar.tsx';
import '../../i18n/metronomeTool/index.ts';
import './metronome.css';

export interface MetronomeHostProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The metronome's lazy chunk (wave 3, stream M), mounted by the top bar the
 * first time "⋯" → "Metronome" is chosen and kept mounted after. It shows
 * the bar while it is open in Explore and Learn — not in Drill, and not
 * while the tour plays (the start screen has no top bar, so no metronome).
 * Asking for the tour stops it here (synchronously, before the tour asks
 * whether work is in progress). Going into Drill is stopped by the service
 * (`metronome.ts`, a store subscription) and ✕ by the bar's close(): one
 * place each, so a test fails if one of them goes.
 */
export default function MetronomeHost({ open, onClose }: MetronomeHostProps) {
  const view = useAppStore((s) => s.view);
  const tour = useDemoRequest();
  const shown = open && view !== 'drill' && tour === null;

  useLayoutEffect(() => {
    if (tour !== null) stopMetronome('tour');
  }, [tour]);
  // The two samples download when the bar first opens, not before ▶.
  useLayoutEffect(() => {
    if (open) void prepareClicks();
  }, [open]);

  if (!shown || typeof document === 'undefined') return null;
  return createPortal(<MetronomeBar onClose={onClose} />, document.body);
}
