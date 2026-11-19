/**
 * A layer that covers the whole app, the metronome's bar with it: the
 * landscape full-neck view (`components/instruments/NeckView.tsx`: fixed,
 * inset 0, z 70, opaque, portalled onto <body>; no top bar, no "⋯"). While it
 * is open nothing on screen can stop a running metronome, so it stops when
 * the view opens and its bar stays hidden until the view closes (audit
 * 2026-11-18, Q9: "a metronome that is sounding always has a visible way to
 * stop it, and one that is hidden is not sounding" — as going into Drill
 * stops it). Sheets are not handled here, and the bar does NOT stay usable
 * under them: the guitar practice sheet takes the bar inside it (`Sheet
 * companions`, MetronomeHost); every other sheet (Settings, a phone's key
 * sheet, a lesson's section sheet, the tuner, a glossary word …) stands above
 * the bar (z 70 over 59) while it goes on sounding — on a phone the sheet's
 * panel can cover it completely, and behind the scrim it cannot be tapped —
 * until the sheet is closed (Escape, ✕ or the scrim). That is how the app
 * was before this file; whether it changes is the owner's decision.
 */
const COVER = '[data-testid="neck-view"]';

export function fullScreenCoverOpen(): boolean {
  return typeof document !== 'undefined' && !!document.querySelector(COVER);
}

/** Calls `onChange` with the new state each time a cover opens or closes (the view is a direct child of <body>). */
export function watchFullScreenCover(onChange: (open: boolean) => void): () => void {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return () => {};
  let open = fullScreenCoverOpen();
  const observer = new MutationObserver(() => {
    const now = fullScreenCoverOpen();
    if (now !== open) {
      open = now;
      onChange(now);
    }
  });
  observer.observe(document.body, { childList: true });
  return () => observer.disconnect();
}
