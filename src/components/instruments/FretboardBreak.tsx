/** Conventional neck discontinuity: lower frets are omitted, not renumbered.
 * Kept outside the playable cells so keyboard navigation skips the marker. */
export function FretboardBreak() {
  return <span data-fret-break aria-hidden="true" className="flex items-center justify-center self-stretch"
    style={{ width: 24, flexShrink: 0, fontSize: 18, fontWeight: 700, color: 'var(--text-muted)', backgroundColor: 'var(--bg)' }}>//</span>;
}
