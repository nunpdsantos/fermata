import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

/**
 * A tiny server in front of `vite preview` that plays a deploy (the approach
 * of e2e/pwa.spec.ts, W9). Before `deploy()` it relays everything untouched.
 * After it:
 *  - /sw.js gets one extra comment per deploy, so the browser sees NEW worker
 *    bytes and installs a new version (it waits — prompt mode);
 *  - /version.json can be replaced (What's new, the critical switch);
 *  - with `dropOldAssets`, every /assets/* request answers 404 — the old
 *    build's files are gone from the server, as after a real deploy — and is
 *    recorded, so a test can prove the page never needed the network for them;
 *  - with `lateSkipWaitingMs`, the new worker obeys SKIP_WAITING only that
 *    long after it is asked: a takeover that comes late.
 * (Playwright routes do not see the browser's own sw.js update fetch, and
 * dist/ must stay untouched, hence a proxy.) Each proxy is its own origin:
 * a fresh service worker and fresh storage per test.
 */
export interface DeployProxy {
  origin: string;
  deploy(options?: { versionJson?: unknown; dropOldAssets?: boolean; lateSkipWaitingMs?: number }): void;
  /** /assets/* requests that reached the server after a deploy with dropOldAssets. */
  blockedAssetRequests: string[];
  close(): Promise<void>;
}

export async function startDeployProxy(upstreamBase: string): Promise<DeployProxy> {
  let deploys = 0;
  let versionJson: unknown;
  let dropOldAssets = false;
  let lateSkipWaitingMs = 0;
  const blockedAssetRequests: string[] = [];

  const server = createServer((req, res) => {
    void (async () => {
      const path = new URL(req.url ?? '/', 'http://x').pathname;
      if (deploys > 0 && dropOldAssets && path.startsWith('/assets/')) {
        blockedAssetRequests.push(path);
        res.statusCode = 404;
        res.end();
        return;
      }
      const upstream = await fetch(new URL(req.url ?? '/', upstreamBase), { method: req.method, redirect: 'manual' });
      let body = Buffer.from(await upstream.arrayBuffer());
      if (deploys > 0 && path === '/sw.js') {
        let text = body.toString('utf8');
        if (lateSkipWaitingMs > 0) {
          if (!text.includes('self.skipWaiting()')) throw new Error('deployProxy: no self.skipWaiting() in sw.js to delay');
          text = text.replace('self.skipWaiting()', `setTimeout(()=>self.skipWaiting(),${lateSkipWaitingMs})`);
        }
        body = Buffer.from(`${text}\n// e2e: deploy ${deploys}\n`);
      }
      if (deploys > 0 && path === '/version.json' && versionJson !== undefined) {
        body = Buffer.from(JSON.stringify(versionJson));
      }
      res.statusCode = upstream.status;
      upstream.headers.forEach((value, name) => {
        if (!['content-encoding', 'content-length', 'transfer-encoding', 'connection'].includes(name)) res.setHeader(name, value);
      });
      res.setHeader('content-length', body.length);
      res.end(body);
    })().catch(() => {
      res.statusCode = 502;
      res.end();
    });
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

  return {
    origin: `http://localhost:${(server.address() as AddressInfo).port}`,
    deploy(options = {}) {
      deploys++;
      if (options.versionJson !== undefined) versionJson = options.versionJson;
      if (options.dropOldAssets) dropOldAssets = true;
      if (options.lateSkipWaitingMs) lateSkipWaitingMs = options.lateSkipWaitingMs;
    },
    blockedAssetRequests,
    close: () => new Promise<void>((resolve) => server.close(() => resolve())),
  };
}
