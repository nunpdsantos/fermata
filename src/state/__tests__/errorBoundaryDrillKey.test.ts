import { describe, it, expect } from 'vitest';
import { DRILL_STORE_KEY } from '../drillStore';
// Vite raw import (typed via vite/client) — loads the component's SOURCE as a
// string without importing the module, so this test never pulls ErrorBoundary
// (or its dynamic drillStore dependency) into its own module graph.
import errorBoundarySource from '../../components/ErrorBoundary.tsx?raw';

/**
 * Guards the inlined drill-store key in ErrorBoundary.tsx.
 *
 * ErrorBoundary deliberately does NOT statically import drillStore (that would
 * pull ts-fsrs into the entry chunk), so it carries the storage key as a string
 * literal. This test imports the real DRILL_STORE_KEY and asserts:
 *   1. the literal value the test/ErrorBoundary uses equals the constant, and
 *   2. that exact literal string actually appears in ErrorBoundary's source,
 * so the two can never silently drift apart.
 */
const INLINED_LITERAL = 'fermata-drill-v1';

describe('ErrorBoundary inlined drill key', () => {
  it('matches the canonical DRILL_STORE_KEY constant', () => {
    expect(INLINED_LITERAL).toBe(DRILL_STORE_KEY);
  });

  it('still appears verbatim in ErrorBoundary source (catches a drifted edit)', () => {
    expect(errorBoundarySource).toContain(`'${DRILL_STORE_KEY}'`);
  });

  it('does NOT statically import drillStore (keeps ts-fsrs out of the entry chunk)', () => {
    // A static `import ... from '../state/drillStore'` would defeat the split;
    // only a dynamic import('...') is allowed.
    expect(errorBoundarySource).not.toMatch(/import\s+[^;]*from\s+['"][^'"]*drillStore['"]/);
    // The lazy reset path must be present.
    expect(errorBoundarySource).toContain("import('../state/drillStore')");
  });
});
