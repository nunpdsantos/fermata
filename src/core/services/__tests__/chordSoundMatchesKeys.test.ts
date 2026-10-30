/**
 * Audit W2-07 review B1 — what you hear is what lights up.
 *
 * Pre-fix the audio ran its own open-voicing rules: F major at octave 1
 * SOUNDED C1 F1 A2 while F1 C2 A2 lit up; over chord x root x octave 0–3 the
 * heard bass was not the root in 1,112 cases and heard != lit in 2,128.
 * Here the real playChordVoiced plays into a capturing voice and is compared
 * with the lit voicing, for every quality x 12 roots x octaves 0–4 x every
 * inversion, plus slash basses.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type * as AudioModule from '../audio';
import type { ChordQuality, Note } from '../../types/music';
import { buildChord, CHORD_FORMULAS } from '../../constants/chords';
import { getVoicedChordNotes, getMidiNumber } from '../../utils/pianoLayout';

function stubAudioContext() {
  const param = () => ({ value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), cancelScheduledValues: vi.fn() });
  const ctx = {
    sampleRate: 44100, state: 'running', currentTime: 0, destination: {},
    resume: vi.fn().mockResolvedValue(undefined), close: vi.fn(),
    createGain: vi.fn(() => ({ gain: param(), connect: vi.fn(), disconnect: vi.fn() })),
    createOscillator: vi.fn(() => ({ type: 'sine', frequency: { value: 0 }, detune: { value: 0 }, connect: vi.fn(), start: vi.fn(), stop: vi.fn(), disconnect: vi.fn(), onended: null })),
    createDynamicsCompressor: vi.fn(() => ({ threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 }, attack: { value: 0 }, release: { value: 0 }, connect: vi.fn() })),
    createConvolver: vi.fn(() => ({ buffer: null, connect: vi.fn() })),
    createBiquadFilter: vi.fn(() => ({ type: 'lowpass', frequency: { value: 0 }, Q: { value: 1 }, connect: vi.fn(), disconnect: vi.fn() })),
    createBuffer: vi.fn((channels: number, length: number, sampleRate: number) => ({ numberOfChannels: channels, length, sampleRate, getChannelData: vi.fn(() => new Float32Array(length)) })),
  };
  vi.stubGlobal('AudioContext', function MockAudioContext() { return ctx; } as unknown as typeof AudioContext);
}

async function audioWithEar(): Promise<{ audio: typeof AudioModule; heard: number[] }> {
  stubAudioContext();
  const audio = (await import('../audio.ts')) as typeof AudioModule;
  const heard: number[] = [];
  audio.setInstrumentVoice({
    playNote: (midi: number) => { heard.push(midi); return true; },
    startNote: () => true, stopNote: () => {}, setVolume: () => {}, resume: () => Promise.resolve(), cancelScheduled: () => {},
  });
  return { audio, heard };
}

beforeEach(() => {
  vi.resetModules();
});

const toNote = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const pcOf = (n: Note) => getMidiNumber(n, 0) % 12;

describe('W2-07 B1 — playChordVoiced sounds exactly the lit voicing', () => {
  it('every quality x root x octave 0–4 x inversion: heard == lit, bass lowest', async () => {
    const { audio, heard } = await audioWithEar();
    const bad: string[] = [];
    let cases = 0;
    for (const q of Object.keys(CHORD_FORMULAS) as ChordQuality[]) {
      for (const r of ROOTS) {
        const notes = buildChord(toNote(r), q).notes;
        for (let inv = 0; inv < notes.length; inv++) {
          const ordered = [...notes.slice(inv), ...notes.slice(0, inv)];
          for (let oct = 0; oct <= 4; oct++) {
            cases++;
            heard.length = 0;
            audio.playChordVoiced(ordered, oct, 1);
            const lit = getVoicedChordNotes(ordered, oct).map((p) => getMidiNumber(p, p.octave));
            const h = [...heard].sort((a, b) => a - b);
            const tag = `${r}${q} inv${inv} @${oct}`;
            if (h.join() !== [...lit].sort((a, b) => a - b).join()) bad.push(`${tag}: heard ${h.join(',')} lit ${lit.join(',')}`);
            if (h[0] % 12 !== pcOf(ordered[0])) bad.push(`${tag}: lowest heard is not the bass`);
          }
        }
      }
    }
    expect(cases).toBeGreaterThan(10_000);
    expect(bad.slice(0, 20)).toEqual([]);
  }, 60_000);

  it('F major at octave 1 sounds F1 C2 A2 (MIDI 29 36 45)', async () => {
    const { audio, heard } = await audioWithEar();
    audio.playChordVoiced(buildChord(toNote('F'), 'major').notes, 1, 1);
    expect([...heard].sort((a, b) => a - b)).toEqual([29, 36, 45]);
  });

  it('a slash bass sounds lowest, an octave under the voicing', async () => {
    const { audio, heard } = await audioWithEar();
    for (const [r, q, bass] of [['D', 'minor7', 'G'], ['C', 'major', 'E'], ['F', 'major', 'C'], ['A', 'minor', 'G']] as const) {
      for (let oct = 1; oct <= 4; oct++) {
        heard.length = 0;
        audio.playChordVoiced(buildChord(toNote(r), q).notes, oct, 1, {}, toNote(bass));
        const h = [...heard].sort((a, b) => a - b);
        expect(h[0] % 12, `${r}${q}/${bass} @${oct}`).toBe(pcOf(toNote(bass)));
        expect(h[0], `${r}${q}/${bass} @${oct}`).toBe(getMidiNumber(toNote(bass), oct - 1));
      }
    }
  });
});
