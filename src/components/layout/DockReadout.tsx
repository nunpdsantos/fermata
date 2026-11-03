import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../state/store.ts';
import { useFocusNote, useFocusNoteStore } from '../../state/focusNoteStore.ts';
import { useKeyContext } from '../../hooks/useKeyContext.ts';
import { readoutParts, readoutVariants } from '../explore/focusReadout.ts';

/** Two lines of the bar's context text: never more, so the bar never grows. */
const MAX_LINES = 2;
const ANNOUNCE_MS = 600;

/**
 * The dock bar's middle: what the instrument shows ("Position II",
 * "C4 · 1 octave") — or, in Explore, the READ-OUT of the linked focus note:
 * "B — 3rd of G · leading note of C Major · string 5 fret 2, string 2 open"
 * (W11-B, D-25). The longest wording that fits in two lines is shown (the
 * full one is its tooltip), so the bar — and the phone sheet's height —
 * never changes when a note comes into focus. Screen readers hear it once
 * the focus settles (600 ms), politely: hovering along a scale is not read
 * note by note.
 */
export function DockReadout({ context }: { context: string }) {
  const { t } = useTranslation();
  const view = useAppStore((s) => s.view);
  const exercise = useAppStore((s) => s.exerciseInputActive);
  const chord = useAppStore((s) => s.selectedChord);
  const { displayScale: scale, spellPitchClass } = useKeyContext();
  const focus = useFocusNote();
  const locations = useFocusNoteStore((s) => s.locations);
  const active = view === 'explore' && !exercise && focus !== null;

  const variants = useMemo(
    () =>
      active && focus
        ? readoutVariants(readoutParts({ focus, scale, chord, spellPitchClass, locations: locations?.items, t }))
        : [context],
    [active, focus, scale, chord, spellPitchClass, locations, t, context],
  );

  // The longest variant that fits in MAX_LINES at the bar's current width.
  const shownRef = useRef<HTMLSpanElement>(null);
  const probeRef = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState(0);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const el = shownRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    const probe = probeRef.current;
    if (!probe) return;
    const lh = parseFloat(getComputedStyle(probe).lineHeight) || 17.5;
    let pick = variants.length - 1;
    for (let i = 0; i < variants.length; i++) {
      probe.textContent = variants[i];
      if (probe.scrollHeight <= lh * MAX_LINES + 1) {
        pick = i;
        break;
      }
    }
    probe.textContent = '';
    // A DOM measurement: it can only run after layout, so the choice is set
    // from this layout effect (before paint).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFit(pick);
  }, [variants, width]);

  // Polite, settled announcements: a focus note once it has stayed 600 ms,
  // and a change of what the instrument shows ("Position II") as before —
  // not the context again each time a note leaves focus.
  const full = variants[0];
  const [announced, setAnnounced] = useState('');
  const lastContext = useRef(context);
  useEffect(() => {
    const contextChanged = context !== lastContext.current;
    lastContext.current = context;
    const text = active ? full : contextChanged ? context : null;
    if (!text) return;
    const id = window.setTimeout(() => setAnnounced(text), ANNOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [active, full, context]);

  const shown = variants[Math.min(fit, variants.length - 1)];
  return (
    <span className="dock-context text-ui" data-testid="dock-readout" data-focus={active || undefined}>
      <span ref={shownRef} className="dock-context-text" title={active && shown !== full ? full : undefined}>
        {shown}
      </span>
      <span ref={probeRef} className="dock-context-probe" aria-hidden="true" />
      <span className="sr-only" aria-live="polite" data-testid="dock-announce">{announced}</span>
    </span>
  );
}
