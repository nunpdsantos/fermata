/**
 * MIDI keyboards in (wave 3, stream K) — a lazy chunk, loaded only when the
 * learner turns the MIDI keyboard on in Settings, or on a later visit when it
 * was left on AND the browser still allows it without asking.
 *
 * Web MIDI input from every connected device: note on / note off (a note on
 * with velocity 0 is a note off), velocity to loudness, the sustain pedal
 * holding notes, devices plugged in and pulled out while the app is open.
 * Every note is reported through `emitExternalNote` (services/externalNotes.ts)
 * once per pitch: two keyboards holding the same pitch make one note, which
 * ends when the last of them lets go. All notes end when a device disappears,
 * the page is hidden or MIDI is turned off — no note may hang.
 *
 * Least access: `requestMIDIAccess({ sysex: false, software: false })` — no
 * system exclusive, no software synthesizers, and no output is ever opened.
 * Nothing played is recorded, stored or sent.
 *
 * The browser is reached only through `MidiSeam` (tests drive the service
 * with a fake MIDIAccess that delivers real byte messages).
 */
import { emitExternalNote, type ExternalNote } from '../externalNotes.ts';
import { loadExternalNotesListener } from '../externalNotesHost.ts';
import { createMidiParser, type MidiEvent } from './parse.ts';
import { useMidiStatus, setMidiKeyboard, type MidiState } from './midiStatus.ts';

export interface MidiSeam {
  requestAccess: (options: MIDIOptions) => Promise<MIDIAccess>;
  /** The browser's standing answer for `midi`, or null when it cannot say. */
  permission: () => Promise<PermissionState | null>;
  emit: (note: ExternalNote) => void;
}

const browserSeam: MidiSeam = {
  requestAccess: (options) => navigator.requestMIDIAccess(options),
  permission: async () => {
    try {
      const status = await navigator.permissions.query({ name: 'midi' as PermissionName });
      return status.state;
    } catch {
      return null;
    }
  },
  emit: emitExternalNote,
};

interface ChannelState {
  held: Set<number>;
  sustained: Set<number>;
  pedal: boolean;
}

interface InputState {
  port: MIDIInput;
  parser: ReturnType<typeof createMidiParser>;
  channels: Map<number, ChannelState>;
}

let seam: MidiSeam = browserSeam;
let access: MIDIAccess | null = null;
let generation = 0;
const inputs = new Map<string, InputState>();
/** Pitches reported "on" and not yet "off". */
const sounding = new Set<number>();
let docListening = false;

function setStatus(state: MidiState, devices: string[] = []): void {
  useMidiStatus.setState({ state, devices });
}

function channelOf(input: InputState, channel: number): ChannelState {
  let c = input.channels.get(channel);
  if (!c) {
    c = { held: new Set(), sustained: new Set(), pedal: false };
    input.channels.set(channel, c);
  }
  return c;
}

function stillOn(pitch: number): boolean {
  for (const input of inputs.values()) {
    for (const c of input.channels.values()) if (c.held.has(pitch) || c.sustained.has(pitch)) return true;
  }
  return false;
}

/** A pitch may have ended: report it once nothing holds it. */
function settle(pitch: number): void {
  if (!sounding.has(pitch) || stillOn(pitch)) return;
  sounding.delete(pitch);
  seam.emit({ midi: pitch, on: false, source: 'midi' });
}

function handle(input: InputState, ev: MidiEvent): void {
  const c = channelOf(input, ev.channel);
  if (ev.type === 'noteOn') {
    // Nothing starts in a page that is not on screen.
    if (document.visibilityState === 'hidden') return;
    c.held.add(ev.note);
    c.sustained.delete(ev.note);
    // Struck again while still sounding (another key, or the pedal): it ends, then starts again.
    if (sounding.has(ev.note)) seam.emit({ midi: ev.note, on: false, source: 'midi' });
    sounding.add(ev.note);
    seam.emit({ midi: ev.note, on: true, source: 'midi', velocity: ev.velocity / 127 });
  } else if (ev.type === 'noteOff') {
    if (!c.held.delete(ev.note)) return;
    if (c.pedal) c.sustained.add(ev.note);
    else settle(ev.note);
  } else if (ev.type === 'sustain') {
    c.pedal = ev.down;
    if (!ev.down) {
      const kept = [...c.sustained];
      c.sustained.clear();
      for (const p of kept) settle(p);
    }
  } else {
    const all = [...c.held, ...c.sustained];
    c.held.clear();
    c.sustained.clear();
    for (const p of all) settle(p);
  }
}

function onMessage(id: string, data: Uint8Array | null): void {
  const input = inputs.get(id);
  if (!input || !data) return;
  for (const ev of input.parser.push(data)) handle(input, ev);
}

/** Every note of every device ends now. */
export function releaseAllMidiNotes(): void {
  for (const input of inputs.values()) {
    input.channels.clear();
    input.parser.reset();
  }
  for (const pitch of [...sounding]) {
    sounding.delete(pitch);
    seam.emit({ midi: pitch, on: false, source: 'midi' });
  }
}

function detach(id: string): void {
  const input = inputs.get(id);
  if (!input) return;
  input.port.onmidimessage = null;
  inputs.delete(id);
  // Its notes end (those another device still holds go on).
  const pitches = new Set<number>();
  for (const c of input.channels.values()) for (const p of [...c.held, ...c.sustained]) pitches.add(p);
  for (const p of pitches) settle(p);
}

function deviceName(port: MIDIInput): string {
  return (port.name || port.manufacturer || 'MIDI').trim();
}

/** Attach to every connected input, let go of the others, and say who is there. */
function sync(): void {
  if (!access) return;
  const connected = new Map<string, MIDIInput>();
  access.inputs.forEach((port) => {
    if (port.state === 'connected') connected.set(port.id, port);
  });
  for (const id of [...inputs.keys()]) if (!connected.has(id)) detach(id);
  for (const [id, port] of connected) {
    if (inputs.has(id)) continue;
    inputs.set(id, { port, parser: createMidiParser(), channels: new Map() });
    // Setting the handler opens the port (Web MIDI: implicit open).
    port.onmidimessage = (e: MIDIMessageEvent) => onMessage(id, e.data);
  }
  const names = [...new Set([...inputs.values()].map((i) => deviceName(i.port)))];
  setStatus('on', names);
}

function onVisibility(): void {
  if (document.visibilityState === 'hidden') releaseAllMidiNotes();
}

function listenToPage(on: boolean): void {
  if (on === docListening || typeof document === 'undefined') return;
  docListening = on;
  if (on) {
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', releaseAllMidiNotes);
  } else {
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('pagehide', releaseAllMidiNotes);
  }
}

/**
 * Turn MIDI in on. `ask`: the learner turned it on (the browser may ask
 * them). `restore`: a later visit — only if the browser already allows it,
 * so nothing is ever asked without the learner's tap; otherwise it stays off.
 */
export async function startMidi(mode: 'ask' | 'restore', with_: MidiSeam = browserSeam): Promise<MidiState> {
  stopMidi();
  seam = with_;
  const mine = ++generation;
  setStatus('asking');
  if (mode === 'restore' && (await seam.permission()) !== 'granted') {
    if (mine !== generation) return useMidiStatus.getState().state;
    setMidiKeyboard(false);
    setStatus('off');
    return 'off';
  }
  // The listener's code comes now, so the first key sounds without waiting for it.
  void loadExternalNotesListener();
  let got: MIDIAccess;
  try {
    got = await seam.requestAccess({ sysex: false, software: false });
  } catch (e) {
    if (mine !== generation) return useMidiStatus.getState().state;
    const name = (e as { name?: string } | null)?.name;
    const state: MidiState = name === 'NotAllowedError' || name === 'SecurityError' ? 'denied' : 'error';
    setMidiKeyboard(false);
    setStatus(state);
    return state;
  }
  if (mine !== generation) return useMidiStatus.getState().state; // turned off while the browser asked
  access = got;
  access.onstatechange = () => sync();
  listenToPage(true);
  setMidiKeyboard(true);
  sync();
  return 'on';
}

/** Turn MIDI in off: every note ends, every port is let go. */
export function stopMidi(): void {
  generation++;
  releaseAllMidiNotes();
  for (const input of inputs.values()) {
    input.port.onmidimessage = null;
    try {
      void input.port.close?.();
    } catch {
      // a port that will not close is let go all the same
    }
  }
  inputs.clear();
  if (access) access.onstatechange = null;
  access = null;
  listenToPage(false);
  const { state } = useMidiStatus.getState();
  if (state === 'on' || state === 'asking') setStatus('off');
}
