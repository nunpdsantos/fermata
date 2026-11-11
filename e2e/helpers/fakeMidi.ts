import type { BrowserContext, Page } from '@playwright/test';

/**
 * A fake Web MIDI system injected BEFORE the app loads (wave 3, stream K):
 * `navigator.requestMIDIAccess` resolves to a MIDIAccess whose inputs deliver
 * real byte messages (Uint8Array) to what the app set as `onmidimessage`,
 * and devices can be plugged in and pulled out (a `statechange`). Headless
 * Chromium has no MIDI devices; no real keyboard is ever involved.
 *
 * `window.__midi` (in the page): `calls` (the options of every request),
 * `plug(id, name)`, `unplug(id)`, `send(id, bytes)` (stamps
 * `window.__midiSentAt` = performance.now() just before delivering).
 */
export async function installFakeMidi(context: BrowserContext, devices: [string, string][] = [['kbd', 'Test Piano']]): Promise<void> {
  await context.addInitScript((initial) => {
    type Port = {
      id: string; name: string; manufacturer: string; type: 'input'; state: string; connection: string;
      onmidimessage: ((e: { data: Uint8Array }) => void) | null; open: () => Promise<Port>; close: () => Promise<Port>;
    };
    const inputs = new Map<string, Port>();
    const access = { inputs, outputs: new Map(), sysexEnabled: false, onstatechange: null as null | ((e: { port: Port }) => void) };
    const makePort = (id: string, name: string): Port => {
      const port: Port = {
        id, name, manufacturer: 'Test', type: 'input', state: 'connected', connection: 'closed', onmidimessage: null,
        open: async () => port,
        close: async () => port,
      };
      return port;
    };
    for (const [id, name] of initial) inputs.set(id, makePort(id, name));
    const calls: unknown[] = [];
    Object.defineProperty(navigator, 'requestMIDIAccess', {
      configurable: true,
      value: (options: unknown) => {
        calls.push(options ?? null);
        return Promise.resolve(access);
      },
    });
    (window as unknown as { __midi: unknown }).__midi = {
      calls,
      plug(id: string, name: string) {
        const port = makePort(id, name);
        inputs.set(id, port);
        access.onstatechange?.({ port });
      },
      unplug(id: string) {
        const port = inputs.get(id);
        if (!port) return;
        port.state = 'disconnected';
        inputs.delete(id);
        access.onstatechange?.({ port });
      },
      send(id: string, bytes: number[]) {
        const port = inputs.get(id);
        (window as unknown as { __midiSentAt: number }).__midiSentAt = performance.now();
        port?.onmidimessage?.({ data: new Uint8Array(bytes) });
      },
    };
  }, devices);
}

export const noteOn = (note: number, velocity = 96) => [0x90, note, velocity];
export const noteOff = (note: number) => [0x80, note, 0];

export async function sendMidi(page: Page, bytes: number[], id = 'kbd'): Promise<void> {
  await page.evaluate(([i, b]) => (window as unknown as { __midi: { send: (i: string, b: number[]) => void } }).__midi.send(i as string, b as number[]), [id, bytes] as const);
}

export async function midiCalls(page: Page): Promise<unknown[]> {
  return page.evaluate(() => (window as unknown as { __midi: { calls: unknown[] } }).__midi.calls);
}

/**
 * Dev server only: replace the instrument voice in the app's OWN core audio
 * module with one that records every start / stop (and when it was asked,
 * relative to the last MIDI message sent). Returns false on a build, which
 * serves no /src modules.
 */
export async function recordVoice(page: Page): Promise<boolean> {
  const res = await page.request.get('/src/core/services/audio.ts');
  if (!res.ok() || !(res.headers()['content-type'] ?? '').includes('javascript')) return false;
  await page.evaluate(async () => {
    const audio = await import(/* @vite-ignore */ '/src/core/services/audio.ts');
    const w = window as unknown as { __voice: { op: string; midi: number; delayMs: number }[]; __midiSentAt?: number };
    w.__voice = [];
    const rec = (op: string, midi: number) => w.__voice.push({ op, midi, delayMs: performance.now() - (w.__midiSentAt ?? performance.now()) });
    audio.setInstrumentVoice({
      playNote: (midi: number) => { rec('play', midi); return true; },
      startNote: (midi: number) => { rec('start', midi); return true; },
      stopNote: (midi: number) => { rec('stop', midi); },
      setVolume: () => {},
      resume: () => Promise.resolve(),
      cancelScheduled: () => {},
    });
  });
  return true;
}

export async function voiceLog(page: Page): Promise<{ op: string; midi: number; delayMs: number }[]> {
  return page.evaluate(() => (window as unknown as { __voice: { op: string; midi: number; delayMs: number }[] }).__voice);
}

/** Pitches sounding now on the recorded voice. */
export async function soundingNow(page: Page): Promise<number[]> {
  const log = await voiceLog(page);
  const s = new Set<number>();
  for (const c of log) {
    if (c.op === 'start') s.add(c.midi);
    else if (c.op === 'stop') s.delete(c.midi);
  }
  return [...s].sort((a, b) => a - b);
}
