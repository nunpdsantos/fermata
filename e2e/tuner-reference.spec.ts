import { test, expect, type Browser, type Page } from '@playwright/test';
import { GUITAR_TUNINGS } from '../src/core/constants/guitarTunings';
import { GUITAR_SAMPLE_CENTS } from '../src/services/guitarSampleTuning';
import { LADDER } from '../src/services/guitarSampler';
import { analysisFrameSize, centsFrom, detectPitch, SURE_CLARITY } from '../src/services/microphone/pitch';
import { createSmoother, stringMidi, tuneState } from '../src/components/tuner/tunerReading';
import { independentPitch } from '../src/test/independentPitch';

/**
 * Audit M60 (19 November 2026): the tuner's "Hear" plays each reference
 * string in tune — and the guitar voice that plays it, the same in Explore,
 * is in tune too.
 *
 * What is measured is what Chromium renders: the app is driven as a learner
 * drives it (a tuning saved, the tuner opened, each "Hear" pressed; Explore's
 * ▶ Play scale), every AudioBufferSourceNode it starts is captured with the
 * playback rate the app set, and that very buffer is rendered again at that
 * rate in an OfflineAudioContext at 44.1 and at 48 kHz (Chromium's own MP3
 * decoding and resampling). The rendered sound is then measured in Node by
 * an estimate that shares no code with the app's detector
 * (`src/test/independentPitch.ts`: a 0.5 s autocorrelation every 0.25 s from
 * 0.1 s to the end of the 2.5 s reference, the median of the windows within
 * 20 dB of the loudest — the part of the note a learner hears, not its decayed
 * tail) — within ±2 cents of equal temperament, A4 = 440 Hz — and by the
 * app's own detector and smoothing (`services/microphone/pitch.ts`,
 * `components/tuner/tunerReading.ts`, the same code the tuner runs), framed as
 * the microphone frames it: in tune (±5). Every row is logged ("[M60] …") for
 * the report's table. The same on the dev server and on the build: nothing
 * here reads the app's /src in the page.
 *
 * Not measured here: a real guitar, a room, a microphone, a speaker. Only the
 * owner, with a guitar, can say whether it sounds right.
 */

const RATES = [44100, 48000];
const REFERENCE_S = 2.5;
const et = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

/** Every buffer source started, with its rate, and whether its buffer came from a decoded file. */
function captureVoices() {
  const w = window as unknown as { __decoded: WeakSet<AudioBuffer>; __voices: { buffer: AudioBuffer | null; rate: number; decoded: boolean }[] };
  w.__decoded = new WeakSet();
  w.__voices = [];
  const decode = BaseAudioContext.prototype.decodeAudioData;
  BaseAudioContext.prototype.decodeAudioData = function (this: BaseAudioContext, ...args: Parameters<typeof decode>) {
    return decode.apply(this, args).then((b: AudioBuffer) => {
      w.__decoded.add(b);
      return b;
    });
  } as typeof decode;
  const start = AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start = function (this: AudioBufferSourceNode, ...args: Parameters<typeof start>) {
    w.__voices.push({ buffer: this.buffer, rate: this.playbackRate.value, decoded: !!this.buffer && w.__decoded.has(this.buffer) });
    return start.apply(this, args);
  } as typeof start;
}

async function openApp(browser: Browser, baseURL: string, state: Record<string, unknown>) {
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
  await context.addInitScript((blob) => {
    if (sessionStorage.getItem('m60-seeded')) return;
    localStorage.setItem('music-theory-app', blob);
    sessionStorage.setItem('m60-seeded', '1');
  }, JSON.stringify({ state: { instrument: 'guitar', lastView: 'explore', language: 'en', themeMode: 'fermata', selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', baseOctave: 4, scaleOctaves: 1, ...state }, version: 6 }));
  await context.addInitScript(captureVoices);
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('#root')).not.toBeEmpty();
  await expect(page.getByTestId('instrument-dock')).toBeVisible({ timeout: 15_000 });
  return { context, page };
}

const voiceCount = (page: Page) => page.evaluate(() => (window as unknown as { __voices: unknown[] }).__voices.length);

/** The voice at `index`, rendered at each rate for the reference's length: samples as base64, and where the sound ends. */
async function render(page: Page, index: number) {
  return page.evaluate(async ([i, rates, seconds]) => {
    const v = (window as unknown as { __voices: { buffer: AudioBuffer | null; rate: number; decoded: boolean }[] }).__voices[i];
    const out: { rate: number; b64: string; endS: number }[] = [];
    for (const rate of rates) {
      const ctx = new OfflineAudioContext(1, Math.ceil(seconds * rate), rate);
      const src = ctx.createBufferSource();
      src.buffer = v.buffer;
      src.playbackRate.value = v.rate;
      src.connect(ctx.destination);
      src.start(0);
      const data = (await ctx.startRendering()).getChannelData(0);
      const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
      let s = '';
      for (let k = 0; k < bytes.length; k += 0x8000) s += String.fromCharCode(...bytes.subarray(k, k + 0x8000));
      out.push({ rate, b64: btoa(s), endS: Math.min(seconds, v.buffer!.duration / v.rate) });
    }
    return { rate: v.rate, decoded: v.decoded, frames: v.buffer?.length ?? 0, renders: out };
  }, [index, RATES, REFERENCE_S] as const);
}

function samples(b64: string): Float32Array {
  const buf = Buffer.from(b64, 'base64');
  return new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
}

/** The app's detector over the sound, framed every 30 ms as the microphone frames it, smoothed as the tuner smooths. */
function appReading(x: Float32Array, rate: number, midi: number, endS: number) {
  const size = analysisFrameSize(rate);
  const hop = Math.round(0.03 * rate);
  const smoother = createSmoother();
  const raw: number[] = [];
  for (let end = Math.round(0.1 * rate) + size; end <= Math.round(endS * rate); end += hop) {
    const e = detectPitch(x.subarray(end - size, end), rate);
    if (!e || e.clarity < SURE_CLARITY) continue;
    const c = centsFrom(e.frequency, midi);
    raw.push(c);
    smoother.push(c);
  }
  const sorted = [...raw].sort((a, b) => a - b);
  return { frames: raw.length, median: sorted[sorted.length >> 1], shown: smoother.value };
}

interface Measured { independent: number; min: number; max: number; app: number; shown: number; frames: number }

function measure(x: Float32Array, rate: number, midi: number, endS: number): Measured {
  const ind = independentPitch(x, rate, et(midi), 0.1, endS);
  const app = appReading(x, rate, midi, endS);
  return { independent: ind.cents, min: ind.min, max: ind.max, app: app.median, shown: app.shown ?? NaN, frames: app.frames };
}

const f2 = (n: number) => (n >= 0 ? '+' : '') + n.toFixed(2);

test.describe('the tuner\'s reference strings (audit M60)', () => {
  test.describe.configure({ mode: 'parallel' });

  for (const tuning of GUITAR_TUNINGS) {
    test(`${tuning.name}: "Hear" plays each string within ±2 cents (independent estimate) at 44.1 and 48 kHz, and the tuner reads it in tune`, async ({ browser, baseURL }) => {
      test.setTimeout(120_000);
      const { context, page } = await openApp(browser, baseURL!, { guitarTuningId: tuning.id });
      await page.getByTestId('dock-tune').click();
      const sheet = page.getByRole('dialog', { name: /^Tuner/ });
      await expect(sheet).toBeVisible();
      // The samples download when the tuner opens; until one is decoded "Hear" plucks the Karplus-Strong voice
      // (measured in hearString.pitch.test.ts). Wait until "Hear" plays the decoded sample.
      await expect.poll(async () => {
        const before = await voiceCount(page);
        await sheet.getByTestId('tuner-hear-1').click();
        await expect.poll(() => voiceCount(page)).toBeGreaterThan(before);
        return page.evaluate(() => (window as unknown as { __voices: { decoded: boolean }[] }).__voices.at(-1)!.decoded);
      }, { timeout: 30_000, intervals: [500] }).toBe(true);

      const misses: string[] = [];
      for (let s = 0; s < 6; s++) {
        const midi = stringMidi(tuning.strings[s]);
        const before = await voiceCount(page);
        await sheet.getByTestId(`tuner-hear-${6 - s}`).click();
        await expect.poll(() => voiceCount(page)).toBe(before + 1);
        const v = await render(page, before);
        expect(v.decoded, `string ${6 - s}: the sampled guitar`).toBe(true);
        for (const r of v.renders) {
          const m = measure(samples(r.b64), r.rate, midi, r.endS);
          const row = `[M60] ${tuning.id} string ${6 - s} midi ${midi} @${r.rate}: rate ${v.rate.toFixed(6)} independent ${f2(m.independent)} (${f2(m.min)}..${f2(m.max)}) app median ${f2(m.app)} shown ${f2(m.shown)} (${m.frames} frames)`;
          console.log(row);
          if (!(Math.abs(m.independent) <= 2)) misses.push(`string ${6 - s} (${midi}) @${r.rate}: independent ${f2(m.independent)}`);
          if (m.frames < 10 || !(Math.abs(m.app) <= 5) || tuneState(m.shown) !== 'inTune') misses.push(`string ${6 - s} (${midi}) @${r.rate}: the tuner reads ${f2(m.app)}, shows ${f2(m.shown)}`);
        }
      }
      expect(misses).toEqual([]);
      await context.close();
    });
  }

  test('the same guitar voice in Explore: ▶ Play scale (C major, C3–C4) plays every note within ±2 cents', async ({ browser, baseURL }) => {
    test.setTimeout(120_000);
    const { context, page } = await openApp(browser, baseURL!, {});
    const play = page.getByRole('button', { name: 'Play scale ascending' });
    // C major ascending in the guitar's register: C3 D3 E3 F3 G3 A3 B3 C4, one voice each, in order, all
    // scheduled in the tap. The first tap warms the guitar's samples (its notes are the Karplus-Strong
    // pluck): play again until a whole scale is played from them.
    const SCALE = [48, 50, 52, 53, 55, 57, 59, 60];
    let before = 0;
    await expect.poll(async () => {
      before = await voiceCount(page);
      await play.click();
      await expect.poll(() => voiceCount(page)).toBe(before + SCALE.length);
      return page.evaluate((b) => (window as unknown as { __voices: { decoded: boolean }[] }).__voices.slice(b).every((x) => x.decoded), before);
    }, { timeout: 30_000, intervals: [1500] }).toBe(true);
    const misses: string[] = [];
    for (let i = 0; i < SCALE.length; i++) {
      const v = await render(page, before + i);
      expect(v.decoded).toBe(true);
      for (const r of v.renders) {
        const m = measure(samples(r.b64), r.rate, SCALE[i], r.endS);
        console.log(`[M60] explore C major note ${i + 1} midi ${SCALE[i]} @${r.rate}: rate ${v.rate.toFixed(6)} independent ${f2(m.independent)} (${f2(m.min)}..${f2(m.max)}) app median ${f2(m.app)} shown ${f2(m.shown)}`);
        if (!(Math.abs(m.independent) <= 2)) misses.push(`${SCALE[i]} @${r.rate}: independent ${f2(m.independent)}`);
        if (!(Math.abs(m.app) <= 5)) misses.push(`${SCALE[i]} @${r.rate}: the tuner reads ${f2(m.app)}`);
      }
    }
    expect(misses).toEqual([]);
    await context.close();
  });

  test('every recorded sample: its pitch where it sounds (windows within 20 dB of its loudest) is the one the voice corrects for, within 0.5 cent', async ({ browser, baseURL }) => {
    test.setTimeout(120_000);
    const { context, page } = await openApp(browser, baseURL!, {});
    // Every file of the voice's ladder; each file's name read independently as its note, which must be the ladder's.
    const files = LADDER.map((e) => e.file);
    expect(files).toHaveLength(39);
    const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    const midiOf = (file: string) => 12 * (Number(file.at(-1)) + 1) + LETTER[file[0]] + (file[1] === 's' ? 1 : 0);
    for (const e of LADDER) expect(midiOf(e.file), e.file).toBe(e.midi);
    const misses: string[] = [];
    const measured: string[] = [];
    for (const file of files) {
      const d = await page.evaluate(async ([f, seconds]) => {
        const data = await (await fetch(`/samples/guitar/${f}.mp3`)).arrayBuffer();
        const buffer = await new OfflineAudioContext(1, 1, 44100).decodeAudioData(data);
        const ch = buffer.getChannelData(0).slice(0, Math.ceil(seconds * 44100));
        const bytes = new Uint8Array(ch.buffer);
        let s = '';
        for (let k = 0; k < bytes.length; k += 0x8000) s += String.fromCharCode(...bytes.subarray(k, k + 0x8000));
        return { b64: btoa(s), endS: Math.min(seconds, buffer.duration) };
      }, [file, REFERENCE_S] as const);
      const ind = independentPitch(samples(d.b64), 44100, et(midiOf(file)), 0.1, d.endS);
      measured.push(`${file}: ${ind.cents.toFixed(2)}`);
      console.log(`[M60] sample ${file} (midi ${midiOf(file)}): ${f2(ind.cents)} cents (${f2(ind.min)}..${f2(ind.max)}, ${ind.kept} of ${ind.windows.length} windows); corrected for ${GUITAR_SAMPLE_CENTS[file]}`);
      if (!(Math.abs(ind.cents - (GUITAR_SAMPLE_CENTS[file] ?? NaN)) <= 0.5)) misses.push(`${file}: measured ${ind.cents.toFixed(2)}, the table says ${GUITAR_SAMPLE_CENTS[file]}`);
    }
    console.log(`[M60] measured: ${measured.join(', ')}`);
    expect(Object.keys(GUITAR_SAMPLE_CENTS).sort()).toEqual([...files].sort());
    expect(misses).toEqual([]);
    await context.close();
  });
});
