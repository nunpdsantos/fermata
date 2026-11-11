/**
 * A fake Web MIDI system for tests: a MIDIAccess whose inputs deliver REAL
 * byte messages (Uint8Array) to whatever the app set as `onmidimessage`, and
 * that can plug devices in and pull them out (a `statechange` event, as the
 * browser sends). No real keyboard is involved.
 */
export interface FakeInput {
  id: string;
  name: string;
  manufacturer: string;
  type: 'input';
  state: 'connected' | 'disconnected';
  connection: 'open' | 'closed' | 'pending';
  onmidimessage: ((e: { data: Uint8Array }) => void) | null;
  close: () => Promise<FakeInput>;
  closed: number;
  send: (bytes: number[]) => void;
}

export interface FakeAccess {
  inputs: Map<string, FakeInput>;
  outputs: Map<string, unknown>;
  sysexEnabled: boolean;
  onstatechange: ((e: { port: FakeInput }) => void) | null;
  plug: (id: string, name: string) => FakeInput;
  unplug: (id: string, keepInMap?: boolean) => void;
}

export function fakeInput(id: string, name: string): FakeInput {
  const port: FakeInput = {
    id,
    name,
    manufacturer: '',
    type: 'input',
    state: 'connected',
    connection: 'closed',
    onmidimessage: null,
    closed: 0,
    close: async () => {
      port.closed++;
      port.connection = 'closed';
      return port;
    },
    send: (bytes) => port.onmidimessage?.({ data: new Uint8Array(bytes) }),
  };
  return port;
}

export function fakeAccess(devices: [id: string, name: string][] = []): FakeAccess {
  const access: FakeAccess = {
    inputs: new Map(devices.map(([id, name]) => [id, fakeInput(id, name)])),
    outputs: new Map(),
    sysexEnabled: false,
    onstatechange: null,
    plug: (id, name) => {
      const port = fakeInput(id, name);
      access.inputs.set(id, port);
      access.onstatechange?.({ port });
      return port;
    },
    // A browser may keep a disconnected port in the map (state 'disconnected') or drop it.
    unplug: (id, keepInMap = false) => {
      const port = access.inputs.get(id);
      if (!port) return;
      port.state = 'disconnected';
      if (!keepInMap) access.inputs.delete(id);
      access.onstatechange?.({ port });
    },
  };
  return access;
}

export const NOTE_ON = (note: number, velocity: number, channel = 0) => [0x90 | channel, note, velocity];
export const NOTE_OFF = (note: number, channel = 0) => [0x80 | channel, note, 64];
export const PEDAL = (down: boolean, channel = 0) => [0xb0 | channel, 64, down ? 127 : 0];
