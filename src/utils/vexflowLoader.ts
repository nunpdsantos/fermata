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

type VexFlowModule = typeof import('vexflow/bravura');

/**
 * One shared download per page — but a FAILED download (offline before
 * VexFlow was cached) must not stick: it is forgotten so the next staff tries
 * again (review item 6). Exported for vexflowLoader.test.
 */
export function createVexFlowLoader(importer: () => Promise<VexFlowModule>): () => Promise<VexFlowModule> {
  let pending: Promise<VexFlowModule> | null = null;
  return () => {
    if (!pending) {
      pending = importer().catch((err) => {
        pending = null;
        throw err;
      });
    }
    return pending;
  };
}

export const loadVexFlow = createVexFlowLoader(() => import('vexflow/bravura'));
