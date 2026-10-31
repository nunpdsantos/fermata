/**
 * VexFlow lazy loader — singleton dynamic import with module-level cache.
 * Vite auto-splits this into a separate chunk.
 *
 * The Bravura-only entry (audit W9-10 / D-22): the full 'vexflow' entry
 * embeds five music fonts, but both entries select the same two
 * (setFonts('Bravura', 'Academico')) — the full one only also registers
 * Gonville / Petaluma / Petaluma Script, which nothing here uses. About 294
 * KiB gzipped less on the first notation render; vexflowBravuraParity.test
 * proves the SVG output is identical.
 */

let vexflowPromise: Promise<typeof import('vexflow/bravura')> | null = null;

export function loadVexFlow(): Promise<typeof import('vexflow/bravura')> {
  if (!vexflowPromise) {
    // A failed download (offline before VexFlow was cached) must not stick:
    // forget it so the next staff tries again.
    vexflowPromise = import('vexflow/bravura').catch((err) => {
      vexflowPromise = null;
      throw err;
    });
  }
  return vexflowPromise;
}
