import { create } from 'zustand';
import { useAppStore } from '../../state/store.ts';

/**
 * What the MIDI keyboard part is doing now (wave 3, stream K) — display state,
 * never saved. Small and eager: the Settings row and the dock bar's mark read
 * it without loading the MIDI code (`services/midi/midiInput.ts`, a lazy
 * chunk that writes it).
 *
 *   off          not on (nothing asked of the browser)
 *   asking       waiting for the browser's answer
 *   on           listening; `devices` = the names of the keyboards connected
 *   denied       the browser (or the learner) said no
 *   unsupported  this browser has no Web MIDI
 *   error        the browser could not reach the MIDI system
 */
export type MidiState = 'off' | 'asking' | 'on' | 'denied' | 'unsupported' | 'error';

export const useMidiStatus = create<{ state: MidiState; devices: string[] }>(() => ({ state: 'off', devices: [] }));

/** Web MIDI is there to ask for (Chrome, Edge, Opera, Firefox with its add-on). */
export function midiSupported(): boolean {
  return typeof navigator !== 'undefined' && typeof (navigator as Navigator & { requestMIDIAccess?: unknown }).requestMIDIAccess === 'function';
}

/** The saved "on" (the optional `midiKeyboard` field of the main store). */
export function setMidiKeyboard(on: boolean): void {
  if ((useAppStore.getState().midiKeyboard === true) === on) return;
  useAppStore.setState({ midiKeyboard: on ? true : undefined, preferencesUpdatedAt: Date.now() });
}

let loaded: Promise<typeof import('./midiInput.ts')> | null = null;
const load = () =>
  (loaded ??= import('./midiInput.ts').catch((e: unknown) => {
    loaded = null; // a failed download: the next try downloads again
    throw e;
  }));

/** Settings: the learner turns the MIDI keyboard on (the browser may ask) or off. */
export function turnMidiKeyboard(on: boolean): Promise<void> {
  if (!on) {
    const was = useMidiStatus.getState().state;
    setMidiKeyboard(false);
    useMidiStatus.setState({ state: 'off', devices: [] });
    // Listening or asking means the MIDI code is loaded: stop it (every note ends).
    return was === 'on' || was === 'asking' || loaded ? load().then((m) => m.stopMidi()) : Promise.resolve();
  }
  if (!midiSupported()) {
    useMidiStatus.setState({ state: 'unsupported', devices: [] });
    return Promise.resolve();
  }
  useMidiStatus.setState({ state: 'asking', devices: [] });
  return load().then(
    (m) => m.startMidi('ask').then(() => {}),
    () => useMidiStatus.setState({ state: 'error', devices: [] }),
  );
}

let restored = false;
/**
 * App, once at boot: left on at the last visit → turned on again only if
 * this browser has Web MIDI (otherwise nothing is loaded or asked). The MIDI
 * code then checks that the browser still allows it without asking.
 */
export function restoreMidiKeyboard(): void {
  if (restored) return;
  restored = true;
  if (useAppStore.getState().midiKeyboard !== true || !midiSupported()) return;
  void load().then((m) => m.startMidi('restore'), () => {});
}
