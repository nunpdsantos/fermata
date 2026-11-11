/**
 * Reading MIDI bytes (wave 3, stream K) — the channel messages of the MIDI 1.0
 * specification's message table, and only what Fermata needs from them.
 *
 *   status    message                   data bytes   what Fermata does
 *   8n        note off                  2            the key ends
 *   9n        note on                   2            the key starts (velocity 0 = note off)
 *   An        polyphonic key pressure   2            ignored
 *   Bn        control change            2            64 = sustain pedal (≥ 64 down);
 *                                                    120 all sound off, 123 all notes off
 *                                                    end every key of that channel; others ignored
 *   Cn        program change            1            ignored
 *   Dn        channel pressure          1            ignored
 *   En        pitch bend                2            ignored
 *   F0 … F7   system exclusive          to F7        ignored (never asked for: no sysex access)
 *   F1 / F3   time code / song select   1            ignored
 *   F2        song position             2            ignored
 *   F4 F5 F6  undefined / tune request  0            ignored
 *   F8 … FF   real time                 0            ignored, anywhere, and they keep running status
 *
 * n = the channel (0–15). A data byte has its top bit clear (0–127).
 * RUNNING STATUS: after a channel message, data bytes without a new status
 * byte repeat the last status. The Web MIDI spec gives each event one complete
 * message, but nothing forbids a browser or a driver from passing running
 * status through, so the parser keeps it per input. A system common message
 * (F0–F7) cancels it; a real-time byte does not.
 */
export type MidiEvent =
  | { type: 'noteOn'; channel: number; note: number; velocity: number }
  | { type: 'noteOff'; channel: number; note: number }
  | { type: 'sustain'; channel: number; down: boolean }
  | { type: 'allNotesOff'; channel: number };

/** Data bytes each channel-message kind takes (by its high nibble). */
const CHANNEL_DATA: Record<number, number> = { 0x8: 2, 0x9: 2, 0xa: 2, 0xb: 2, 0xc: 1, 0xd: 1, 0xe: 2 };
/** Data bytes of the system common messages (F0 is handled apart). */
const SYSTEM_DATA: Record<number, number> = { 0xf1: 1, 0xf2: 2, 0xf3: 1, 0xf4: 0, 0xf5: 0, 0xf6: 0, 0xf7: 0 };

export const SUSTAIN_CC = 64;
const ALL_SOUND_OFF_CC = 120;
const ALL_NOTES_OFF_CC = 123;

function channelEvent(status: number, d1: number, d2: number): MidiEvent | null {
  const kind = status >> 4;
  const channel = status & 0x0f;
  if (kind === 0x9) {
    return d2 === 0
      ? { type: 'noteOff', channel, note: d1 }
      : { type: 'noteOn', channel, note: d1, velocity: d2 };
  }
  if (kind === 0x8) return { type: 'noteOff', channel, note: d1 };
  if (kind === 0xb) {
    if (d1 === SUSTAIN_CC) return { type: 'sustain', channel, down: d2 >= 64 };
    if (d1 === ALL_NOTES_OFF_CC || d1 === ALL_SOUND_OFF_CC) return { type: 'allNotesOff', channel };
  }
  return null;
}

/**
 * A parser for ONE input's byte stream. `push` takes the bytes of one event
 * (a whole message, several, or a part) and returns what they mean.
 */
export function createMidiParser(): { push: (bytes: ArrayLike<number>) => MidiEvent[]; reset: () => void } {
  let running = 0; // the running channel status, 0 = none
  let need = 0; // data bytes still to read for `running` (or for a system message)
  let system = 0; // a system common message being read (its data are skipped)
  let inSysex = false;
  const data: number[] = [];

  const reset = () => {
    running = 0;
    need = 0;
    system = 0;
    inSysex = false;
    data.length = 0;
  };

  const push = (bytes: ArrayLike<number>): MidiEvent[] => {
    const out: MidiEvent[] = [];
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i] & 0xff;
      if (b >= 0xf8) continue; // real time: may come anywhere, changes nothing
      if (b >= 0x80) {
        data.length = 0;
        if (b === 0xf0) {
          inSysex = true;
          running = 0;
          system = 0;
          need = 0;
        } else if (b >= 0xf0) {
          // F1–F7 (F7 also ends a system exclusive): cancels running status.
          inSysex = false;
          running = 0;
          system = b;
          need = SYSTEM_DATA[b] ?? 0;
          if (need === 0) system = 0;
        } else {
          inSysex = false;
          system = 0;
          running = b;
          need = CHANNEL_DATA[b >> 4];
        }
        continue;
      }
      // A data byte.
      if (inSysex) continue;
      if (system) {
        if (--need === 0) system = 0;
        continue;
      }
      if (!running) continue; // a stray data byte with no status: ignored
      data.push(b);
      if (data.length < need) continue;
      const ev = channelEvent(running, data[0], data[1] ?? 0);
      if (ev) out.push(ev);
      data.length = 0; // running status: the next data bytes reuse `running`
    }
    return out;
  };

  return { push, reset };
}
