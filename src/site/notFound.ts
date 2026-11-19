/**
 * The site's own not-found page (2026-11-18, audits A21 / Q12): the file and
 * the rule that decides when the host serves it.
 *
 * Vercel, for a deployment without a framework's 404 page: "add a file named
 * `404.html` to the root of your output directory. Vercel serves the file
 * with a `404` status code for every request that doesn't match another file
 * and doesn't start with `/api`" (vercel.com/docs/routing/custom-404-pages,
 * last updated 2026-11-17, read 2026-11-18). `scripts/pages/build.ts` writes
 * it (src/site/render.ts `notFoundPage`); `vite preview` answers the same way
 * (vite.config.ts `previewNotFound`, through `servedFile` below), so the
 * preview browser tests see the status production gives.
 *
 * Pure: no file system here (the caller says what a path is).
 */

/** The page, at the root of dist/. */
export const NOT_FOUND_FILE = '404.html';

/** What the host reads at a path of the build: a file, a folder, or nothing. */
export type PathKind = 'file' | 'dir' | null;

/**
 * The file of the build the host answers an address with, as a path relative
 * to dist/ ('index.html', 'en/lessons/the-staff-and-clefs/index.html',
 * 'robots.txt'), or null when it answers 404 with NOT_FOUND_FILE. Vercel's
 * static rules as this project uses them (vercel.json sets no cleanUrls, no
 * trailingSlash): a file at its own address; a folder's index.html at the
 * folder's address with and without the slash (inferred from the documented
 * trailingSlash default, as CLAUDE.md records it); nothing else. The query is
 * not part of the address. A folder without an index.html is not found here
 * (Vercel would show a Directory Listing instead if the project turned it on).
 */
export function servedFile(address: string, kindOf: (rel: string) => PathKind): string | null {
  let path: string;
  try {
    path = decodeURIComponent(new URL(address, 'http://host').pathname);
  } catch {
    return null;
  }
  const parts = path.split('/').slice(1);
  if (parts.some((p) => p === '..' || p === '.' || p.includes('\0') || p.includes('\\'))) return null;
  const rel = parts.join('/');
  if (rel === '' || rel.endsWith('/')) return kindOf(`${rel}index.html`) === 'file' ? `${rel}index.html` : null;
  const kind = kindOf(rel);
  if (kind === 'file') return rel;
  if (kind === 'dir' && kindOf(`${rel}/index.html`) === 'file') return `${rel}/index.html`;
  return null;
}
