/**
 * MIDI in (brief K, wave 3): the service driven by a fake MIDIAccess that
 * delivers real byte messages (no real keyboard). What it reports through
 * the seam's `emit` is exactly what the app hears (services/externalNotes.ts).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { startMidi, stopMidi, releaseAllMidiNotes, type MidiSeam } from '../midiInput';
import { useMidiStatus } from '../midiStatus';
import { useAppStore } from '../../../state/store';
import type { ExternalNote } from '../../externalNotes';
import { fakeAccess, NOTE_ON, NOTE_OFF, PEDAL, type FakeAccess } from './fakeMidi';

let heard: ExternalNote[];
let access: FakeAccess;
let options: MIDIOptions[];

function seam(over: Partial<MidiSeam> = {}): MidiSeam {
  return {
    requestAccess: async (o) => {
      options.push(o);
      return access as unknown as MIDIAccess;
    },
    permission: async () => 'granted',
    emit: (n) => heard.push(n),
    ...over,
  };
}

const ons = () => heard.filter((n) => n.on).map((n) => n.midi);
const offs = () => heard.filter((n) => !n.on).map((n) => n.midi);
/** Pitches reported on and not yet off. */
function sounding(): number[] {
  const s = new Set<number>();
  for (const n of heard) {
    if (n.on) s.add(n.midi);
    else s.delete(n.midi);
  }
  return [...s].sort((a, b) => a - b);
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (hidden ? 'hidden' : 'visible') });
  document.dispatchEvent(new Event('visibilitychange'));
}

beforeEach(() => {
  heard = [];
  options = [];
  access = fakeAccess([['in-1', 'Digital Piano']]);
  useAppStore.setState({ midiKeyboard: undefined });
});
afterEach(() => {
  stopMidi();
  setHidden(false);
  useMidiStatus.setState({ state: 'off', devices: [] });
  useAppStore.setState({ midiKeyboard: undefined });
});

describe('asking the browser', () => {
  it('asks for the least: no sysex, no software synths; never opens an output', async () => {
    access.outputs.set('out-1', { id: 'out-1' });
    expect(await startMidi('ask', seam())).toBe('on');
    expect(options).toEqual([{ sysex: false, software: false }]);
    expect(useMidiStatus.getState()).toEqual({ state: 'on', devices: ['Digital Piano'] });
    expect(useAppStore.getState().midiKeyboard).toBe(true);
  });

  it('a refusal leaves it off, says so, and saves nothing', async () => {
    const refuse = Object.assign(new Error('no'), { name: 'NotAllowedError' });
    expect(await startMidi('ask', seam({ requestAccess: () => Promise.reject(refuse) }))).toBe('denied');
    expect(useMidiStatus.getState().state).toBe('denied');
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
  });

  it('another failure is an error, also off', async () => {
    const broken = Object.assign(new Error('x'), { name: 'InvalidStateError' });
    expect(await startMidi('ask', seam({ requestAccess: () => Promise.reject(broken) }))).toBe('error');
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
  });

  it('a later visit turns it on again only if the browser still allows it without asking', async () => {
    useAppStore.setState({ midiKeyboard: true });
    const request = vi.fn(async () => access as unknown as MIDIAccess);
    for (const answer of ['prompt', 'denied', null] as const) {
      useAppStore.setState({ midiKeyboard: true });
      expect(await startMidi('restore', seam({ permission: async () => answer, requestAccess: request }))).toBe('off');
      expect(useAppStore.getState().midiKeyboard).toBeUndefined();
    }
    expect(request).not.toHaveBeenCalled();
    useAppStore.setState({ midiKeyboard: true });
    expect(await startMidi('restore', seam({ requestAccess: request }))).toBe('on');
    expect(request).toHaveBeenCalledTimes(1);
  });

  it('turned off while the browser is asking: the late answer is not used', async () => {
    let grant!: (a: MIDIAccess) => void;
    const pending = startMidi('ask', seam({ requestAccess: () => new Promise((r) => { grant = r; }) }));
    await Promise.resolve();
    stopMidi();
    grant(access as unknown as MIDIAccess);
    await pending;
    expect(useMidiStatus.getState().state).toBe('off');
    expect(access.inputs.get('in-1')!.onmidimessage).toBeNull();
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
  });
});

describe('notes', () => {
  beforeEach(async () => {
    await startMidi('ask', seam());
  });
  const key = (bytes: number[], id = 'in-1') => access.inputs.get(id)!.send(bytes);

  it('note on / note off, velocity scaled to 0–1, on any channel', () => {
    key(NOTE_ON(60, 127));
    key(NOTE_ON(64, 64, 9));
    key(NOTE_OFF(60));
    key(NOTE_OFF(64, 9));
    expect(heard).toEqual([
      { midi: 60, on: true, source: 'midi', velocity: 1 },
      { midi: 64, on: true, source: 'midi', velocity: 64 / 127 },
      { midi: 60, on: false, source: 'midi' },
      { midi: 64, on: false, source: 'midi' },
    ]);
  });

  it('a note on with velocity 0 is a note off', () => {
    key(NOTE_ON(62, 90));
    key([0x90, 62, 0]);
    expect(heard.map((n) => n.on)).toEqual([true, false]);
  });

  it('a note off for a key never pressed reports nothing; unknown messages are ignored', () => {
    key(NOTE_OFF(70));
    key([0xe0, 0, 64]);
    key([0xc0, 3]);
    key([0xb0, 1, 90]);
    key([0xf8]);
    expect(heard).toEqual([]);
  });

  it('the sustain pedal holds released notes until it is lifted', () => {
    key(PEDAL(true));
    key(NOTE_ON(60, 80));
    key(NOTE_OFF(60));
    expect(sounding()).toEqual([60]);
    key(NOTE_ON(64, 80));
    key(PEDAL(false));
    // 64 is still held by the finger; 60 ends with the pedal.
    expect(sounding()).toEqual([64]);
    key(NOTE_OFF(64));
    expect(sounding()).toEqual([]);
  });

  it('a key struck again while the pedal holds it starts again', () => {
    key(PEDAL(true));
    key(NOTE_ON(60, 50));
    key(NOTE_OFF(60));
    key(NOTE_ON(60, 100));
    expect(heard).toEqual([
      { midi: 60, on: true, source: 'midi', velocity: 50 / 127 },
      { midi: 60, on: false, source: 'midi' },
      { midi: 60, on: true, source: 'midi', velocity: 100 / 127 },
    ]);
  });

  it('All Notes Off (CC 123) and All Sound Off (CC 120) end that channel\'s notes', () => {
    key(NOTE_ON(60, 80));
    key(NOTE_ON(62, 80, 2));
    key([0xb0, 123, 0]);
    expect(sounding()).toEqual([62]);
    key([0xb2, 120, 0]);
    expect(sounding()).toEqual([]);
  });

  it('two keyboards holding one pitch make one note, which ends when the last lets go', () => {
    const second = access.plug('in-2', 'Pad');
    expect(useMidiStatus.getState().devices).toEqual(['Digital Piano', 'Pad']);
    key(NOTE_ON(60, 80));
    second.send(NOTE_ON(60, 90));
    key(NOTE_OFF(60));
    expect(sounding()).toEqual([60]);
    second.send(NOTE_OFF(60));
    expect(sounding()).toEqual([]);
  });

  it('a device plugged in while the app is open is heard', () => {
    const late = access.plug('in-9', 'Late Keys');
    late.send(NOTE_ON(72, 100));
    expect(ons()).toEqual([72]);
  });

  it('a device pulled out mid-chord releases every note it held (kept in the map as disconnected, or dropped)', () => {
    for (const keep of [true, false]) {
      heard = [];
      const id = keep ? 'kept' : 'dropped';
      const port = access.plug(id, id);
      port.send(NOTE_ON(60, 80));
      port.send(NOTE_ON(64, 80));
      port.send(PEDAL(true));
      port.send(NOTE_ON(67, 80));
      port.send(NOTE_OFF(67));
      expect(sounding()).toEqual([60, 64, 67]);
      access.unplug(id, keep);
      expect(sounding()).toEqual([]);
      expect(port.onmidimessage).toBeNull();
      expect(useMidiStatus.getState().devices).not.toContain(id);
    }
  });

  it('the last device gone: still on, none connected', () => {
    access.unplug('in-1');
    expect(useMidiStatus.getState()).toEqual({ state: 'on', devices: [] });
  });

  it('the page hidden releases everything, and nothing starts while it is hidden', () => {
    key(NOTE_ON(60, 80));
    key(PEDAL(true));
    key(NOTE_ON(64, 80));
    key(NOTE_OFF(64));
    setHidden(true);
    expect(sounding()).toEqual([]);
    key(NOTE_ON(67, 80));
    expect(ons()).toEqual([60, 64]);
    // The finger still on 60 lets go later: nothing more is reported.
    key(NOTE_OFF(60));
    setHidden(false);
    expect(heard.length).toBe(4);
  });

  it('pagehide releases everything', () => {
    key(NOTE_ON(60, 80));
    window.dispatchEvent(new Event('pagehide'));
    expect(sounding()).toEqual([]);
  });

  it('turning MIDI off releases everything and lets every port go', () => {
    key(NOTE_ON(60, 80));
    key(NOTE_ON(64, 80));
    const port = access.inputs.get('in-1')!;
    stopMidi();
    expect(sounding()).toEqual([]);
    expect(offs()).toEqual([60, 64]);
    expect(port.onmidimessage).toBeNull();
    expect(port.closed).toBe(1);
    expect(access.onstatechange).toBeNull();
    expect(useMidiStatus.getState().state).toBe('off');
  });

  it('releaseAllMidiNotes with nothing held reports nothing', () => {
    releaseAllMidiNotes();
    expect(heard).toEqual([]);
  });
});
