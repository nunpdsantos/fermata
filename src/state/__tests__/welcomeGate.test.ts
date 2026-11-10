/**
 * The first-visit gate (state/welcomeGate.ts) — since wave 1 it opens the
 * start screen instead of the welcome sheet; the flag and its three states
 * are unchanged: shown only to a browser with nothing saved, until it is
 * acted on; never again.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  WELCOME_KEY, APP_KEY_PREFIXES, hasSavedAppData, hasLearningData, shouldShowWelcome, bootWelcome, closeWelcome, useWelcomeStore,
} from '../welcomeGate';
import { DRILL_STORE_KEY } from '../drillStore';
import { FINGERING_STORE_KEY } from '../fingeringStore';
import { LEARN_SESSION_KEY } from '../learnSessionPersistence';
import { BACKUP_KEYS } from '../../utils/backupHelpers';

beforeEach(() => {
  localStorage.clear();
  useWelcomeStore.setState({ open: false, shownThisPage: false });
});

/** Every persisted store, by the key it writes. */
const STORE_KEYS = ['music-theory-app', 'music-theory-progress', DRILL_STORE_KEY, FINGERING_STORE_KEY, LEARN_SESSION_KEY,
  'music-theory-gamification', 'music-theory-concept-tracking'];

describe('who sees the welcome', () => {
  it('an empty browser does', () => {
    expect(shouldShowWelcome(localStorage)).toBe(true);
  });

  it.each(STORE_KEYS)('anyone with %s saved never does', (key) => {
    localStorage.setItem(key, '{}');
    expect(hasSavedAppData(localStorage)).toBe(true);
    expect(shouldShowWelcome(localStorage)).toBe(false);
  });

  it('unrelated keys (another app on the origin) do not count as saved data', () => {
    localStorage.setItem('i18nextLng', 'en');
    localStorage.setItem('something-else', '1');
    expect(shouldShowWelcome(localStorage)).toBe(true);
  });

  it('"seen" never shows; "pending" (shown, not yet acted on) shows again even after boot saved settings', () => {
    localStorage.setItem(WELCOME_KEY, 'seen');
    expect(shouldShowWelcome(localStorage)).toBe(false);
    localStorage.setItem(WELCOME_KEY, 'pending');
    localStorage.setItem('music-theory-app', '{"state":{"lastView":"explore"},"version":6}');
    expect(shouldShowWelcome(localStorage)).toBe(true);
  });

  it.each(STORE_KEYS.filter((k) => k !== 'music-theory-app'))(
    '"pending" but %s saved since (learning data: the visitor has been using the app): never again, settled "seen"',
    (key) => {
      localStorage.setItem(WELCOME_KEY, 'pending');
      localStorage.setItem('music-theory-app', '{"state":{"lastView":"explore"},"version":6}');
      localStorage.setItem(key, '{}');
      expect(hasLearningData(localStorage)).toBe(true);
      expect(shouldShowWelcome(localStorage)).toBe(false);
      expect(bootWelcome(localStorage)).toBe(false);
      expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
    },
  );

  it('settings alone are not learning data (boot writes them on every first load)', () => {
    localStorage.setItem('music-theory-app', '{}');
    localStorage.setItem(WELCOME_KEY, 'pending');
    expect(hasLearningData(localStorage)).toBe(false);
  });

  it('the welcome flag alone is not "saved data"', () => {
    localStorage.setItem(WELCOME_KEY, 'something-unknown');
    expect(hasSavedAppData(localStorage)).toBe(false);
  });
});

describe('boot and close', () => {
  it('boot on an empty browser opens it and marks it pending; closing marks it seen for good', () => {
    expect(bootWelcome(localStorage)).toBe(true);
    expect(useWelcomeStore.getState()).toMatchObject({ open: true, shownThisPage: true });
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');

    closeWelcome(localStorage);
    expect(useWelcomeStore.getState()).toMatchObject({ open: false, shownThisPage: true });
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');

    // The next load (boot has saved settings by now): nothing.
    localStorage.setItem('music-theory-app', '{}');
    useWelcomeStore.setState({ open: false, shownThisPage: false });
    expect(bootWelcome(localStorage)).toBe(false);
    expect(useWelcomeStore.getState()).toMatchObject({ open: false, shownThisPage: false });
  });

  it('boot with saved data writes nothing', () => {
    localStorage.setItem('fermata-drill-v1', '{}');
    expect(bootWelcome(localStorage)).toBe(false);
    expect(localStorage.getItem(WELCOME_KEY)).toBeNull();
  });

  it('a shared link in the address is not the gate\'s to judge: it decides from storage alone (the link rule reads openedFromShareLink, state/startGate.ts)', () => {
    window.history.replaceState(null, '', '/?key=G&scale=major');
    expect(bootWelcome(localStorage)).toBe(true);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    expect(useWelcomeStore.getState()).toEqual({ open: true, shownThisPage: true });
    window.history.replaceState(null, '', '/');
  });

  it('storage that throws: no welcome (it could never remember being closed)', () => {
    const broken = {
      get length() { throw new Error('denied'); },
      key: () => { throw new Error('denied'); },
      getItem: () => { throw new Error('denied'); },
      setItem: () => { throw new Error('denied'); },
    } as unknown as Storage;
    expect(bootWelcome(broken)).toBe(false);
    expect(() => closeWelcome(broken)).not.toThrow();
  });
});

describe('the prefixes cover every persisted store', () => {
  it('every zustand persist name and every backup key in src/ starts with an app prefix', () => {
    const src = join(__dirname, '..', '..');
    const names: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) {
          if (entry !== '__tests__' && entry !== 'node_modules') walk(path);
        } else if (/\.tsx?$/.test(entry)) {
          const text = readFileSync(path, 'utf8');
          if (!text.includes('persist(')) continue;
          for (const m of text.matchAll(/\bname:\s*([A-Z_]+|'[^']+')/g)) names.push(m[1]);
        }
      }
    };
    walk(src);
    const constants: Record<string, string> = { DRILL_STORE_KEY, FINGERING_STORE_KEY, LEARN_SESSION_KEY };
    const resolved = names.map((n) => (n.startsWith("'") ? n.slice(1, -1) : constants[n] ?? `unresolved ${n}`));
    // A known positive: the scan really finds the five stores.
    expect(new Set(resolved)).toEqual(new Set(['music-theory-app', 'music-theory-progress', DRILL_STORE_KEY, FINGERING_STORE_KEY, LEARN_SESSION_KEY]));
    for (const key of [...resolved, ...BACKUP_KEYS]) {
      expect(APP_KEY_PREFIXES.some((p) => key.startsWith(p)), key).toBe(true);
    }
  });
});

describe('boot order', () => {
  it('the gate imports nothing but zustand (no store can load before the check)', () => {
    const gate = readFileSync(join(__dirname, '..', 'welcomeGate.ts'), 'utf8');
    const imports = gate.split('\n').filter((l) => /^import\s/.test(l));
    expect(imports).toEqual(["import { create } from 'zustand';"]);
  });

  it('state/welcomeBoot.ts is the FIRST import of main.tsx (before any store can write)', () => {
    const main = readFileSync(join(__dirname, '..', '..', 'main.tsx'), 'utf8');
    const imports = main.split('\n').filter((l) => /^import\s/.test(l));
    expect(imports[0]).toBe("import './state/welcomeBoot.ts'");
    expect(imports.length).toBeGreaterThan(3); // a known positive: the scan sees the other imports
  });
});
