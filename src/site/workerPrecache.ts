/**
 * The installed app's worker answers a precached file at its own address
 * only (2026-11-19, review of audit A21). Workbox's precache also tries
 * `<address>.html` for an address it does not hold ("clean URLs", on by
 * default: https://developer.chrome.com/docs/workbox/modules/workbox-precaching
 * "Clean URLs", read 2026-11-19; workbox-precaching 7.4.1
 * `generateURLVariations`), after dropping utm_ / fbclid parameters, so an
 * installed app answered /index with the app while the server answers 404.
 * Workbox's generateSW, which vite-plugin-pwa runs, offers no option for it
 * (https://developer.chrome.com/docs/workbox/reference/workbox-build, read
 * 2026-11-19; its template passes the call only `directoryIndex` and
 * `ignoreURLParametersMatching`, neither set here, so it writes `{}`).
 *
 * This rewrites the generated worker's one `precacheAndRoute([…],{})` to
 * `precacheAndRoute([…],{cleanURLs:!1})` and leaves every other byte as it
 * was; any other shape stops the build, naming what it found. A "]" inside
 * an entry's URL stops it too: this reads the entry list as ending at its
 * first "]". Pure: vite.config.ts `workerExactPrecache` reads and writes
 * dist/sw.js around it; `npm run check:sw` checks the built result.
 */
const CALL = /\bprecacheAndRoute\(\[[^\]]*\],\{\}\)/;
const NAMED = /\bprecacheAndRoute\(/g;

export function exactPrecache(sw: string): string {
  const named = [...sw.matchAll(NAMED)];
  const calls = sw.match(new RegExp(CALL.source, 'g')) ?? [];
  if (named.length !== 1 || calls.length !== 1) {
    let found = 'found no precacheAndRoute( at all';
    if (named.length > 0) {
      const close = sw.indexOf(']', named[0].index ?? 0);
      const end = close < 0 ? 'with no "]" after it' : `"${sw.slice(close, close + 40)}"`;
      found = named.length === 1 ? `found 1 precacheAndRoute( call, which ends ${end}` : `found ${named.length} precacheAndRoute( calls, the first of which ends ${end}`;
    }
    throw new Error(`exactPrecache: expected exactly one precacheAndRoute([…],{}) in sw.js (the shape workbox-build 7.4.1's generateSW writes); ${found}`);
  }
  // A function replacer: "$&", "$'" or "$`" in the generated call are copied, never read as patterns.
  return sw.replace(CALL, (call) => `${call.slice(0, -'{})'.length)}{cleanURLs:!1})`);
}
