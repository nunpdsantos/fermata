import { describe, it, expect } from 'vitest';
import { exactPrecache } from '../workerPrecache';

/**
 * The build step that turns Workbox's "clean URLs" off in the generated
 * worker (2026-11-19; vite.config.ts `workerExactPrecache` only calls it):
 * one `precacheAndRoute([…],{})`, as workbox-build 7.4.1's generateSW writes
 * it minified, becomes `precacheAndRoute([…],{cleanURLs:!1})`; anything else
 * stops the build, naming what it found.
 */
const ENTRIES = '[{url:"assets/index-DzWCZ1TE.js",revision:null},{url:"index.html",revision:"b257bf94d86c"}]';
const worker = (call: string) => `define(["./workbox-dcde9eb3"],(function(e){"use strict";importScripts("sw-window-count.js"),self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.clientsClaim(),${call},e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{allowlist:[/^\\/(?:index\\.html)?(?:\\?|$)/]}))}));\n`;

describe('exactPrecache (the worker answers a precached file at its own address only)', () => {
  it('rewrites the one call in the expected shape to {cleanURLs:!1}, and nothing else', () => {
    const before = worker(`e.precacheAndRoute(${ENTRIES},{})`);
    const after = exactPrecache(before);
    expect(after).toBe(worker(`e.precacheAndRoute(${ENTRIES},{cleanURLs:!1})`));
    expect(after.length - before.length).toBe('cleanURLs:!1'.length);
  });

  it('a "$&" or "$\'" inside the generated call is copied as written, never read as a replacement pattern', () => {
    const odd = '[{url:"assets/a$&b-$\'-$`-$1.js",revision:null}]';
    expect(exactPrecache(worker(`e.precacheAndRoute(${odd},{})`))).toBe(worker(`e.precacheAndRoute(${odd},{cleanURLs:!1})`));
  });

  const stops: [string, string, RegExp][] = [
    ['no precacheAndRoute at all', worker('e.cleanupOutdatedCaches()'), /found no precacheAndRoute\( at all/],
    ['two calls', worker(`e.precacheAndRoute(${ENTRIES},{}),e.precacheAndRoute(${ENTRIES},{})`), /found 2 precacheAndRoute\( calls/],
    ['options already in the call', worker(`e.precacheAndRoute(${ENTRIES},{ignoreURLParametersMatching:[/^utm_/]})`), /ends "\],\{ignoreURLParametersMatching:\[\/\^utm_/],
    ['", {}" with a space', worker(`e.precacheAndRoute(${ENTRIES}, {})`), /ends "\], \{\}\)/],
    ['the call renamed', worker(`e.precacheAndRouteV2(${ENTRIES},{})`), /found no precacheAndRoute\( at all/],
    ['no options argument', worker(`e.precacheAndRoute(${ENTRIES})`), /ends "\]\)/],
    ['",void 0)" for the options', worker(`e.precacheAndRoute(${ENTRIES},void 0)`), /ends "\],void 0\)/],
  ];
  it.each(stops)('stops the build, naming what it found: %s', (_name, sw, names) => {
    expect(() => exactPrecache(sw)).toThrow(/^exactPrecache: expected exactly one precacheAndRoute\(\[…\],\{\}\) in sw\.js/);
    expect(() => exactPrecache(sw)).toThrow(names);
  });

  it('stops the build on a "]" inside an entry\'s URL — right: the shape it reads ends the list at the first "]", so it cannot know where the list ends', () => {
    const sw = worker('e.precacheAndRoute([{url:"assets/odd]name.js",revision:null},{url:"index.html",revision:"1"}],{})');
    expect(() => exactPrecache(sw)).toThrow(/ends "\]name\.js"/);
  });
});
