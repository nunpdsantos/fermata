/**
 * The keyboard all the way to the app (brief K "Done means"): a fake
 * MIDIAccess delivering real bytes → the MIDI service → the contract
 * (`emitExternalNote`) → the one listener → core audio's voice seam and the
 * on-screen instrument. No real keyboard was connected.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, cleanup, act } from '@testing-library/react';
import { startMidi, stopMidi } from '../midiInput';
import { turnMidiKeyboard, useMidiStatus } from '../midiStatus';
import { emitExternalNote } from '../../externalNotes';
import { useExternalNotes, loadExternalNotesListener } from '../../externalNotesHost';
import { setInstrumentVoice } from '../../../core/services/audio';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import { useAppStore } from '../../../state/store';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { fakeAccess, NOTE_ON, NOTE_OFF, PEDAL, type FakeAccess } from './fakeMidi';

let calls: { op: string; midi: number }[] = [];
const voice = {
  playNote: () => true,
  startNote: (midi: number) => {
    calls.push({ op: 'start', midi });
    return true;
  },
  stopNote: (midi: number) => {
    calls.push({ op: 'stop', midi });
  },
  setVolume: () => {},
  resume: () => Promise.resolve(),
  cancelScheduled: () => {},
};
function soundingNow(): number[] {
  const s = new Set<number>();
  for (const c of calls) {
    if (c.op === 'start') s.add(c.midi);
    else s.delete(c.midi);
  }
  return [...s].sort((a, b) => a - b);
}
const lit = () => [...useAppStore.getState().activeNotes].sort((a, b) => a - b);

let access: FakeAccess;
const seam = () => ({
  requestAccess: async () => access as unknown as MIDIAccess,
  permission: async () => 'granted' as const,
  emit: emitExternalNote,
});

beforeEach(async () => {
  installMockAudioContext(1);
  calls = [];
  setInstrumentVoice(voice);
  useAppStore.setState({ view: 'explore', exerciseInputActive: false, instrument: 'piano', activeNotes: new Set() });
  useFocusNoteStore.getState().clearAll();
  access = fakeAccess([['usb-1', 'Stage Piano']]);
  await loadExternalNotesListener();
  renderHook(() => useExternalNotes(false));
  await startMidi('ask', seam());
});
afterEach(() => {
  stopMidi();
  cleanup();
  setInstrumentVoice(null);
  useAppStore.setState({ midiKeyboard: undefined, activeNotes: new Set() });
  useMidiStatus.setState({ state: 'off', devices: [] });
});

const key = (bytes: number[]) => act(() => access.inputs.get('usb-1')?.send(bytes));

describe('a MIDI keyboard in Explore', () => {
  it('C–E–G sounds and lights them, and the last is the focus note', () => {
    key(NOTE_ON(60, 90));
    key(NOTE_ON(64, 90));
    key(NOTE_ON(67, 90));
    expect(soundingNow()).toEqual([60, 64, 67]);
    expect(lit()).toEqual([60, 64, 67]);
    expect(useFocusNoteStore.getState().pinned).toMatchObject({ midi: 67, pc: 7 });
    key(NOTE_OFF(60));
    key(NOTE_OFF(64));
    key(NOTE_OFF(67));
    expect(soundingNow()).toEqual([]);
    expect(lit()).toEqual([]);
  });

  it('pulling the cable mid-chord releases everything (pedal-held notes too)', () => {
    key(NOTE_ON(60, 90));
    key(PEDAL(true));
    key(NOTE_ON(64, 90));
    key(NOTE_OFF(64));
    key(NOTE_ON(67, 90));
    act(() => access.unplug('usb-1'));
    expect(soundingNow()).toEqual([]);
    expect(lit()).toEqual([]);
    expect(useMidiStatus.getState().devices).toEqual([]);
  });

  it('turning MIDI off mid-chord releases everything', async () => {
    key(NOTE_ON(60, 90));
    key(NOTE_ON(64, 90));
    await act(() => turnMidiKeyboard(false));
    expect(soundingNow()).toEqual([]);
    expect(lit()).toEqual([]);
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
  });

  it('the start-to-sound path is synchronous: the voice is asked in the same turn as the MIDI message', () => {
    const t0 = performance.now();
    let at = -1;
    setInstrumentVoice({ ...voice, startNote: (m: number) => { at = performance.now(); return voice.startNote(m); } });
    access.inputs.get('usb-1')!.send(NOTE_ON(72, 90));
    // Not inside act, nothing awaited: already started.
    expect(at).toBeGreaterThanOrEqual(t0);
    expect(soundingNow()).toEqual([72]);
    vi.clearAllTimers();
  });
});
