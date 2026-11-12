/**
 * The owner (brief K): with the saved field absent, nothing is requested from
 * the browser and nothing is added to any screen but the Settings row; a
 * frozen, production-shaped v6 save is written back byte for byte. The one
 * new saved field, `midiKeyboard`, is optional, written only while on, and
 * guarded like every other.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, cleanup, act } from '@testing-library/react';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../../../state/store';
import { buildBackup, validateBackup } from '../../../utils/backupHelpers';
import { restoreMidiKeyboard, useMidiStatus, setMidiKeyboard } from '../midiStatus';
import { MidiMark } from '../../../components/layout/MidiMark';

const FROZEN = readFileSync(join(__dirname, '../../../state/__tests__/fixtures/settings-v6-before-start.json'), 'utf8');
const frozen = () => JSON.parse(FROZEN) as { state: Record<string, unknown>; version: number };
const saved = () => localStorage.getItem('music-theory-app')!;
const touch = () => useAppStore.setState({ volume: useAppStore.getState().volume });

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  localStorage.clear();
  useAppStore.setState({ midiKeyboard: undefined });
  useMidiStatus.setState({ state: 'off', devices: [] });
});

describe('the saved field', () => {
  it('a frozen v6 save from before wave 3 loads unchanged and is written back byte for byte', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
    touch();
    expect(saved()).toBe(JSON.stringify(frozen()));
    expect(saved()).not.toContain('midi');
  });

  it('on is saved as `midiKeyboard: true`, round-trips, and off leaves the old save', async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    setMidiKeyboard(true);
    const on = JSON.parse(saved()) as { state: Record<string, unknown> };
    expect(on.state.midiKeyboard).toBe(true);
    localStorage.setItem('music-theory-app', saved());
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().midiKeyboard).toBe(true);
    setMidiKeyboard(false);
    const off = JSON.parse(saved()) as { state: Record<string, unknown> };
    expect('midiKeyboard' in off.state).toBe(false);
    const { preferencesUpdatedAt: _a, ...rest } = off.state;
    const { preferencesUpdatedAt: _b, ...was } = frozen().state;
    expect(rest).toEqual(was);
  });

  it('a bad value is dropped (falls back to off) and named by the backup check; a good one passes', async () => {
    for (const bad of [false, 'true', 1, null, {}]) {
      const blob = { ...frozen().state, midiKeyboard: bad };
      expect(invalidAppStateFields(blob)).toEqual(['midiKeyboard']);
      expect(sanitizePersistedAppState(blob)).toEqual(frozen().state);
    }
    expect(invalidAppStateFields({ ...frozen().state, midiKeyboard: true })).toEqual([]);
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { ...frozen().state, midiKeyboard: true }, version: 6 }));
    const backup = buildBackup(localStorage);
    const vetted = await validateBackup(JSON.parse(JSON.stringify(backup)));
    expect(vetted.ok).toBe(true);
  });
});

describe('with the field absent nothing is asked of the browser', () => {
  it('boot: no MIDI request, no permission query', async () => {
    const requestMIDIAccess = vi.fn();
    const query = vi.fn();
    vi.stubGlobal('navigator', { ...navigator, requestMIDIAccess, permissions: { query } });
    restoreMidiKeyboard();
    await new Promise((r) => setTimeout(r, 20));
    expect(requestMIDIAccess).not.toHaveBeenCalled();
    expect(query).not.toHaveBeenCalled();
    expect(useMidiStatus.getState().state).toBe('off');
  });
});

describe('a save with MIDI on, opened in a browser without Web MIDI', () => {
  it('loads no MIDI code, asks nothing and keeps the saved "on"', async () => {
    vi.resetModules();
    const startMidi = vi.fn(async () => 'on');
    vi.doMock('../midiInput', () => ({ startMidi, stopMidi: vi.fn() }));
    try {
      const { useAppStore: store } = await import('../../../state/store');
      const { restoreMidiKeyboard: restore } = await import('../midiStatus');
      store.setState({ midiKeyboard: true });
      expect('requestMIDIAccess' in navigator).toBe(false);
      restore();
      await new Promise((r) => setTimeout(r, 20));
      expect(startMidi).not.toHaveBeenCalled();
      expect(store.getState().midiKeyboard).toBe(true);
      // The same save in a browser with Web MIDI restores (the guard is the browser, not the save).
      vi.resetModules();
      const again = await import('../midiStatus');
      const { useAppStore: store2 } = await import('../../../state/store');
      store2.setState({ midiKeyboard: true });
      Object.defineProperty(navigator, 'requestMIDIAccess', { configurable: true, value: vi.fn() });
      again.restoreMidiKeyboard();
      await vi.waitFor(() => expect(startMidi).toHaveBeenCalledWith('restore'));
    } finally {
      delete (navigator as unknown as Record<string, unknown>).requestMIDIAccess;
      vi.doUnmock('../midiInput');
      vi.resetModules();
    }
  });
});

describe('the dock bar mark', () => {
  it('renders nothing while MIDI is off, asking, refused, or on with no device; a mark while one is connected', () => {
    const { container, rerender } = render(<MidiMark />);
    for (const state of ['off', 'asking', 'denied', 'unsupported', 'error'] as const) {
      act(() => useMidiStatus.setState({ state, devices: [] }));
      rerender(<MidiMark />);
      expect(container.innerHTML).toBe('');
    }
    act(() => useMidiStatus.setState({ state: 'on', devices: [] }));
    expect(container.innerHTML).toBe('');
    act(() => useMidiStatus.setState({ state: 'on', devices: ['Stage Piano'] }));
    const mark = container.querySelector('[data-testid="midi-mark"]')!;
    expect(mark.getAttribute('role')).toBe('img');
    expect(mark.getAttribute('aria-label')).toBe('MIDI keyboard connected');
  });
});
