/**
 * The MIDI parser against the MIDI 1.0 specification's message table
 * (summary of MIDI messages: channel voice / mode, system common, system real
 * time). The table below is written from the specification, not from
 * parse.ts: for every status byte it gives the number of data bytes the
 * message carries, and what Fermata must make of it. Each row is run on all
 * 16 channels where it is a channel message.
 */
import { describe, it, expect } from 'vitest';
import { createMidiParser, type MidiEvent } from '../parse';

type Expect = (channel: number, d1: number, d2: number) => MidiEvent[];

interface Row {
  name: string;
  status: number; // high nibble for channel messages (0x80…0xE0), full byte for system
  data: number; // data bytes the specification gives the message
  channel: boolean;
  expect: Expect;
}

const none: Expect = () => [];

const SPEC: Row[] = [
  { name: 'note off', status: 0x80, data: 2, channel: true, expect: (channel, note) => [{ type: 'noteOff', channel, note }] },
  {
    name: 'note on', status: 0x90, data: 2, channel: true,
    expect: (channel, note, velocity) => [velocity === 0 ? { type: 'noteOff', channel, note } : { type: 'noteOn', channel, note, velocity }],
  },
  { name: 'polyphonic key pressure', status: 0xa0, data: 2, channel: true, expect: none },
  {
    name: 'control change', status: 0xb0, data: 2, channel: true,
    expect: (channel, cc, value) =>
      cc === 64 ? [{ type: 'sustain', channel, down: value >= 64 }]
        : cc === 120 || cc === 123 ? [{ type: 'allNotesOff', channel }]
          : [],
  },
  { name: 'program change', status: 0xc0, data: 1, channel: true, expect: none },
  { name: 'channel pressure', status: 0xd0, data: 1, channel: true, expect: none },
  { name: 'pitch bend', status: 0xe0, data: 2, channel: true, expect: none },
  { name: 'MTC quarter frame', status: 0xf1, data: 1, channel: false, expect: none },
  { name: 'song position pointer', status: 0xf2, data: 2, channel: false, expect: none },
  { name: 'song select', status: 0xf3, data: 1, channel: false, expect: none },
  { name: 'undefined F4', status: 0xf4, data: 0, channel: false, expect: none },
  { name: 'undefined F5', status: 0xf5, data: 0, channel: false, expect: none },
  { name: 'tune request', status: 0xf6, data: 0, channel: false, expect: none },
  { name: 'timing clock', status: 0xf8, data: 0, channel: false, expect: none },
  { name: 'undefined F9', status: 0xf9, data: 0, channel: false, expect: none },
  { name: 'start', status: 0xfa, data: 0, channel: false, expect: none },
  { name: 'continue', status: 0xfb, data: 0, channel: false, expect: none },
  { name: 'stop', status: 0xfc, data: 0, channel: false, expect: none },
  { name: 'undefined FD', status: 0xfd, data: 0, channel: false, expect: none },
  { name: 'active sensing', status: 0xfe, data: 0, channel: false, expect: none },
  { name: 'system reset', status: 0xff, data: 0, channel: false, expect: none },
];

const DATA_SAMPLES: [number, number][] = [[60, 100], [0, 0], [127, 127], [64, 63], [64, 64], [120, 0], [123, 0], [1, 1]];

describe('the MIDI message table, one message per event', () => {
  for (const row of SPEC) {
    const channels = row.channel ? [...Array(16).keys()] : [0];
    it(`${row.name} (${row.status.toString(16).toUpperCase()}${row.channel ? 'n' : ''}, ${row.data} data bytes)`, () => {
      for (const ch of channels) {
        for (const [d1, d2] of DATA_SAMPLES) {
          const p = createMidiParser();
          const bytes = [row.status | (row.channel ? ch : 0), d1, d2].slice(0, 1 + row.data);
          const expected = row.data === 2 ? row.expect(ch, d1, d2) : row.data === 1 ? row.expect(ch, d1, 0) : row.expect(ch, 0, 0);
          expect(p.push(bytes), `${bytes.map((b) => b.toString(16)).join(' ')}`).toEqual(expected);
        }
      }
    });
  }

  it('a message missing its last data byte yields nothing until the byte comes', () => {
    const p = createMidiParser();
    expect(p.push([0x93, 64])).toEqual([]);
    expect(p.push([90])).toEqual([{ type: 'noteOn', channel: 3, note: 64, velocity: 90 }]);
  });

  it('a stray data byte with no status before it is ignored', () => {
    expect(createMidiParser().push([60, 100])).toEqual([]);
  });
});

describe('running status', () => {
  it('data bytes after a channel message repeat its status (note on, then velocity-0 note offs)', () => {
    const p = createMidiParser();
    expect(p.push([0x90, 60, 80, 64, 81, 67, 82, 60, 0, 64, 0])).toEqual([
      { type: 'noteOn', channel: 0, note: 60, velocity: 80 },
      { type: 'noteOn', channel: 0, note: 64, velocity: 81 },
      { type: 'noteOn', channel: 0, note: 67, velocity: 82 },
      { type: 'noteOff', channel: 0, note: 60 },
      { type: 'noteOff', channel: 0, note: 64 },
    ]);
  });

  it('it carries across events of the same input', () => {
    const p = createMidiParser();
    p.push([0x95, 60, 70]);
    expect(p.push([62, 71])).toEqual([{ type: 'noteOn', channel: 5, note: 62, velocity: 71 }]);
  });

  it('a one-data-byte message keeps running status too (program change, then the note it does not affect)', () => {
    const p = createMidiParser();
    expect(p.push([0xc0, 5, 6, 0x90, 60, 1])).toEqual([{ type: 'noteOn', channel: 0, note: 60, velocity: 1 }]);
  });

  it('a real-time byte may come anywhere — even between data bytes — and keeps running status', () => {
    const p = createMidiParser();
    expect(p.push([0x90, 0xf8, 60, 0xfe, 100, 0xf8, 62, 101])).toEqual([
      { type: 'noteOn', channel: 0, note: 60, velocity: 100 },
      { type: 'noteOn', channel: 0, note: 62, velocity: 101 },
    ]);
  });

  it('a system common message cancels running status', () => {
    const p = createMidiParser();
    p.push([0x90, 60, 100]);
    expect(p.push([0xf6, 62, 100])).toEqual([]);
    expect(p.push([0xf3, 4, 62, 100])).toEqual([]);
  });

  it('system exclusive is skipped to its end (F7), and cancels running status', () => {
    const p = createMidiParser();
    p.push([0x90, 60, 100]);
    expect(p.push([0xf0, 0x7e, 0x7f, 0x09, 0x01, 0xf7, 62, 100])).toEqual([]);
    expect(p.push([0x80, 60, 0])).toEqual([{ type: 'noteOff', channel: 0, note: 60 }]);
  });

  it('a new status in the middle of a message abandons the unfinished one', () => {
    const p = createMidiParser();
    expect(p.push([0x90, 60, 0x81, 61, 0])).toEqual([{ type: 'noteOff', channel: 1, note: 61 }]);
  });

  it('reset forgets running status', () => {
    const p = createMidiParser();
    p.push([0x90, 60, 100]);
    p.reset();
    expect(p.push([62, 100])).toEqual([]);
  });
});
