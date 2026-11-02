/**
 * GUARD — the built service worker is prompt-mode only (audit W9-06 / D-21).
 *
 * A new worker must WAIT; only the learner's tap on the "new version — reload"
 * toast activates it (the SKIP_WAITING message handler, usePWA.ts). The
 * one-off transition `skipWaiting` (review B2) that let installed autoUpdate
 * clients update themselves was removed on 2026-11-14 — it must not come back:
 * a worker that skips waiting on install swaps itself in under a running page
 * (files the old build loaded can vanish, an exercise in progress is cut off).
 *
 * This reads the vite.config.ts SOURCE (comments stripped, so prose that says
 * "skipWaiting: true" cannot trip it). The built artefact is proven by
 * e2e/pwa.spec.ts against `vite preview` (exactly one `skipWaiting`, inside
 * the SKIP_WAITING handler) and by the grep of dist/sw.js in the release gates.
 */
import { describe, it, expect } from 'vitest';
import viteConfig from '../../vite.config.ts?raw';

/** Source with block and line comments removed (strings here never hold `//`). */
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

/** What is wrong with the worker configuration in `source` (empty = fine). */
function workerProblems(source: string): string[] {
  const code = stripComments(source);
  const problems: string[] = [];
  if (!/registerType:\s*'prompt'/.test(code)) problems.push("registerType is not 'prompt'");
  if (!/\bskipWaiting:\s*false\b/.test(code)) problems.push('workbox.skipWaiting is not spelled out as false');
  // `\S` after the lookahead: without it `\s*` backtracks to zero and "skipWaiting: false" matches.
  if (/\bskipWaiting:\s*(?!false\b)\S/.test(code)) problems.push('workbox.skipWaiting is set to something other than false');
  if (/ONE_OFF_SKIP_WAITING|ONE-OFF-SKIPWAITING/.test(source)) problems.push('the one-off transition switch or its policy marker is back');
  if (!/\bclientsClaim:\s*true\b/.test(code)) problems.push('clientsClaim is no longer on (first install must control the open page)');
  return problems;
}

describe('built service worker is prompt-mode only (no skipWaiting on install)', () => {
  it('vite.config.ts: registerType prompt, workbox.skipWaiting false, no one-off switch, clientsClaim on', () => {
    expect(workerProblems(viteConfig)).toEqual([]);
  });

  it('known positives: each way the transition skipWaiting could come back is caught; comments are ignored', () => {
    const good = viteConfig;
    // The switch comes back, wired through a constant (the old shape)…
    expect(workerProblems(good.replace('skipWaiting: false', 'skipWaiting: ONE_OFF_SKIP_WAITING'))).toEqual(
      expect.arrayContaining([
        'workbox.skipWaiting is not spelled out as false',
        'workbox.skipWaiting is set to something other than false',
        'the one-off transition switch or its policy marker is back',
      ]),
    );
    // …or as a literal true…
    expect(workerProblems(good.replace('skipWaiting: false', 'skipWaiting: true'))).toEqual(
      expect.arrayContaining(['workbox.skipWaiting is not spelled out as false', 'workbox.skipWaiting is set to something other than false']),
    );
    // …or the line is simply deleted (autoUpdate-style defaults could then apply)…
    expect(workerProblems(good.replace('skipWaiting: false,', ''))).toContain('workbox.skipWaiting is not spelled out as false');
    // …or the plugin goes back to autoUpdate, which skips waiting on its own.
    expect(workerProblems(good.replace("registerType: 'prompt'", "registerType: 'autoUpdate'"))).toContain("registerType is not 'prompt'");
    // The policy marker alone (a pasted-back block, even in a comment) is caught…
    expect(workerProblems(`${good}\n// ONE-OFF-SKIPWAITING:BEGIN`)).toContain('the one-off transition switch or its policy marker is back');
    // …but prose in comments elsewhere is not a false alarm.
    expect(workerProblems(`${good}\n// skipWaiting: true was removed on 2026-11-14\n/* skipWaiting: true */`)).toEqual([]);
    // The first install must keep controlling the open page.
    expect(workerProblems(good.replace('clientsClaim: true', 'clientsClaim: false'))).toContain(
      'clientsClaim is no longer on (first install must control the open page)',
    );
  });
});
