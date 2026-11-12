/**
 * The header the microphone depends on (brief T). The page itself may use
 * the microphone (`microphone=(self)`); camera and location stay forbidden;
 * nothing else in the header changes. A header-only deploy never reaches an
 * installed app (CLAUDE.md, Gotchas), so the build comment atop index.html
 * changes with it. The detector is this origin's own script (script-src
 * 'self'), so the CSP needs nothing new.
 */
import { describe, expect, it } from 'vitest';
import indexHtml from '../../../../index.html?raw';
import vercelJson from '../../../../vercel.json?raw';

interface HeaderRule { source: string; headers: Array<{ key: string; value: string }> }
const vercel = JSON.parse(vercelJson) as { headers: HeaderRule[] };
const header = (key: string) => vercel.headers.find((r) => r.source === '/(.*)')?.headers.find((h) => h.key === key)?.value;

describe('Permissions-Policy (wave 3)', () => {
  it('is exactly camera=(), microphone=(self), geolocation=()', () => {
    expect(header('Permissions-Policy')).toBe('camera=(), microphone=(self), geolocation=()');
  });

  it('the build comment atop index.html names the change (installed apps refetch the page)', () => {
    expect(indexHtml.startsWith('<!doctype html>\n<!-- build 2026-11-11 (wave 3, the microphone):')).toBe(true);
    expect(indexHtml).toMatch(/Permissions-Policy microphone=\(self\)\)/);
  });

  it('the CSP already lets this origin run its own code (no new source for the detector)', () => {
    const csp = header('Content-Security-Policy') ?? '';
    expect(csp).toMatch(/(^|; )script-src 'self'( |;)/);
    expect(csp).toMatch(/(^|; )worker-src 'self'(;|$)/);
    expect(csp).toMatch(/(^|; )connect-src 'self'(;|$)/);
  });
});
