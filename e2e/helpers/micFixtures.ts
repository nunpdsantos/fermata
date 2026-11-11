/**
 * Small WAV files of known notes for Chromium's fake microphone (brief T):
 * `--use-fake-device-for-media-stream --use-file-for-fake-audio-capture=<wav>`
 * plays the file, looping, as the microphone (Chromium,
 * media/base/media_switches.cc: "Play a .wav file as the microphone … most
 * sane .wav files should work … <path> to play the file looping"). They are
 * written when a spec loads (16-bit PCM, mono, 48 kHz), into the OS temp
 * folder, so nothing binary is kept in the repository.
 *
 * Each note is a plucked-string-like tone (harmonics 1–8, a weaker
 * fundamental, a slow decay), A4 = 440 Hz.
 */
import { chromium, type Browser, type BrowserContext, type BrowserContextOptions } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { welcomeSeenState } from './welcome';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const RATE = 48000;
const PLUCK = [0.35, 1, 0.7, 0.5, 0.4, 0.3, 0.2, 0.15];

export const hz = (midi: number, cents = 0) => 440 * Math.pow(2, (midi - 69 + cents / 100) / 12);

/** A part of a fixture: a note (MIDI number, cents off) for `seconds`, or silence. */
export type Part = { midi: number; cents?: number; seconds: number } | { silence: number };

function render(parts: Part[]): Int16Array {
  const total = parts.reduce((n, p) => n + Math.round(RATE * ('silence' in p ? p.silence : p.seconds)), 0);
  const out = new Int16Array(total);
  let at = 0;
  for (const part of parts) {
    const length = Math.round(RATE * ('silence' in part ? part.silence : part.seconds));
    if (!('silence' in part)) {
      const f = hz(part.midi, part.cents ?? 0);
      for (let i = 0; i < length; i++) {
        const t = i / RATE;
        let v = 0;
        PLUCK.forEach((a, k) => {
          if (f * (k + 1) < RATE / 2) v += a * Math.exp(-t * (0.6 + k * 0.4)) * Math.sin(2 * Math.PI * f * (k + 1) * t + k);
        });
        // A 5 ms attack and release, so the loop never clicks.
        const edge = Math.min(1, i / (0.005 * RATE), (length - i) / (0.005 * RATE));
        out[at + i] = Math.round(Math.max(-1, Math.min(1, 0.25 * v * edge)) * 32767);
      }
    }
    at += length;
  }
  return out;
}

function wav(samples: Int16Array): Buffer {
  const data = Buffer.from(samples.buffer, samples.byteOffset, samples.byteLength);
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

/** Write a fixture and return its path. */
export function micFixture(name: string, parts: Part[]): string {
  const dir = join(tmpdir(), 'fermata-mic-fixtures');
  mkdirSync(dir, { recursive: true });
  const path = join(dir, `${name}.wav`);
  writeFileSync(path, wav(render(parts)));
  return path;
}

/**
 * Chromium's flags for a fake microphone that plays `wav`. `answer`: 'allow'
 * grants it without a prompt (`--use-fake-ui-for-media-stream`); 'deny'
 * refuses it as a learner's "Block" would (`=deny`: getUserMedia rejects
 * with NotAllowedError, "Permission denied" — measured here; without the
 * fake UI, headless Chromium has no prompt and answers NotSupportedError).
 */
export function fakeMicArgs(wavPath: string, answer: 'allow' | 'deny' = 'allow'): string[] {
  return [answer === 'allow' ? '--use-fake-ui-for-media-stream' : '--use-fake-ui-for-media-stream=deny', '--use-fake-device-for-media-stream', `--use-file-for-fake-audio-capture=${wavPath}`];
}

/**
 * A Chromium of its own whose microphone plays `wav` (launch flags apply to
 * a whole browser, and a spec cannot set them per group: Playwright forbids
 * `test.use({ launchOptions })` inside a describe).
 */
export function launchWithFakeMic(wavPath: string, answer: 'allow' | 'deny' = 'allow'): Promise<Browser> {
  return chromium.launch({ args: fakeMicArgs(wavPath, answer) });
}

/** A context on that browser with what the config's `use` gives the others: the base URL and the welcome seen. */
export function micContext(browser: Browser, baseURL: string, options: BrowserContextOptions = {}): Promise<BrowserContext> {
  return browser.newContext({ baseURL, storageState: welcomeSeenState(baseURL), ...options });
}

/**
 * Keeps every stream the page gets from getUserMedia on `window.__micStreams`,
 * so a spec can assert the tracks' state ('live' / 'ended').
 */
export const RECORD_STREAMS = () => {
  const media = navigator.mediaDevices;
  if (!media?.getUserMedia) return;
  const original = media.getUserMedia.bind(media);
  const streams: MediaStream[] = [];
  (window as unknown as { __micStreams: MediaStream[] }).__micStreams = streams;
  media.getUserMedia = async (constraints?: MediaStreamConstraints) => {
    const stream = await original(constraints);
    streams.push(stream);
    return stream;
  };
};
