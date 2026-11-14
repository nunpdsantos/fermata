/**
 * Which address the app is on (2026-11-14): the old address, exactly, and
 * nothing else — not the new one, not www, not a preview, not localhost.
 */
import { describe, expect, it } from 'vitest';
import { NEW_HOST_LABEL, NEW_ORIGIN, OLD_HOST, currentHostname, onOldAddress } from '../appAddress';

describe('onOldAddress', () => {
  it.each([
    ['fermata-music.vercel.app', true],
    ['fermatina.com', false],
    ['www.fermatina.com', false],
    ['fermata-music-git-feat-fermatina-nunos-projects.vercel.app', false],
    ['fermata-music-abc123.vercel.app', false],
    ['localhost', false],
    ['127.0.0.1', false],
    ['music.vercel.app', false],
    ['fermata-music.vercel.app.example.com', false],
    ['', false],
  ])('%s → %s', (host, old) => {
    expect(onOldAddress(host)).toBe(old);
  });

  it('reads the page\'s own host by default (the test page is localhost: not the old address)', () => {
    expect(currentHostname()).toBe('localhost');
    expect(onOldAddress()).toBe(false);
  });

  it('the old host and the new address, as written', () => {
    expect(OLD_HOST).toBe('fermata-music.vercel.app');
    expect(NEW_ORIGIN).toBe('https://fermatina.com');
    expect(new URL(NEW_ORIGIN).host).toBe(NEW_HOST_LABEL);
  });
});
