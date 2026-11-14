/**
 * /test/sheet.js's entry (scripts/pages/build.ts bundles from here, on its
 * own, never into the app). Loaded with `defer`, so the page is parsed.
 */
import { mountSheet } from './client';

mountSheet(document, window);
