/**
 * True when `error` is a failed download of a code-split file. Messages:
 * Chromium "Failed to fetch dynamically imported module", Firefox "error
 * loading dynamically imported module", WebKit "Importing a module script
 * failed", Vite's preload helper "Unable to preload CSS for …". (Only the
 * Vite string is checked against source; the browser strings are the
 * documented/observed wording, not re-verified per engine.)
 */
export function isChunkLoadError(error: unknown): boolean {
  const text = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|Unable to preload CSS/i.test(
    text,
  );
}
