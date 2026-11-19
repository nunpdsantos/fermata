/**
 * How far each recorded guitar sample is from its note (audit M60, 19
 * November 2026): cents from equal temperament at A4 = 440 Hz, + = sharp.
 * `guitarSampler.resolveSample` plays each sample that much lower (or
 * higher), so every note of the guitar voice — the tuner's "Hear", Explore,
 * Learn, Drill — sounds at its pitch. Until then the voice played the files
 * as recorded: the tuner read its own B3 10.6 cents sharp (the audit: +11),
 * and C♯4 sounded 16.6 cents sharp.
 *
 * The files (public/samples/guitar/, FreePats "Spanish Classical Guitar",
 * resampled to 44.1 kHz and faded, no pitch processing — LICENSE.txt there)
 * are a real nylon-string guitar's notes as played: most fretted notes are a
 * few cents sharp, as fretted strings are, and several carry a sympathetic
 * string in tune beside the note (A3's fundamental reads −0.3 cents while its
 * 2nd to 4th harmonics agree on +10.5): so the figure is the note's
 * PERIODICITY, what a tuner and the ear lock on to, not the fundamental's
 * spectral peak.
 *
 * Measured by `e2e/tuner-reference.spec.ts` ("every recorded sample"), which
 * fails if a file and its figure part by more than 0.5 cent: Chromium's
 * decode of each file at 44.1 kHz, `src/test/independentPitch.ts` (0.5 s
 * autocorrelation windows every 0.25 s from 0.1 s to 2.5 s or the file's
 * end; the median of the windows within 20 dB of the loudest — the part of
 * the note a learner hears and tunes to, not the decayed tail, which read B4
 * 11.9 when the whole 2.5 s counted), sharing no code with the app's
 * detector. Cross-checked by the builder with an ffmpeg decode and a separate
 * numpy implementation of the same gated estimate: within 0.27 cent on 38
 * files, and B5 (0.98 s long, two windows) 0.86 cent apart. A plucked string
 * glides, sharper while it is loud (B3 from +14.8 at the attack to +10.2 at
 * −15 dB), so after the correction a note's first moments can still be a few
 * cents sharp and its quiet end a few flat.
 */
import type { LadderFile } from './guitarSampler.ts';

export const GUITAR_SAMPLE_CENTS: Readonly<Record<LadderFile, number>> = {
  E2: 0.4,
  F2: 8.4,
  G2: 8.8,
  A2: 0.2,
  B2: 8.0,
  C3: -0.5,
  D3: 3.4,
  E3: 3.2,
  F3: 3.1,
  Fs3: 2.8,
  G3: 2.3,
  Gs3: 8.6,
  A3: 9.2,
  As3: 11.5,
  B3: 11.7,
  C4: 8.5,
  Cs4: 16.6,
  D4: 7.4,
  Ds4: 8.3,
  E4: -0.8,
  F4: 2.3,
  Fs4: 2.7,
  G4: 2.8,
  A4: 3.0,
  As4: -0.6,
  B4: 13.5,
  C5: 9.6,
  Cs5: 8.9,
  D5: 10.4,
  Ds5: 3.7,
  E5: 4.8,
  F5: -1.9,
  Fs5: 0.4,
  G5: -1.9,
  Gs5: -2.5,
  A5: 8.3,
  As5: 4.2,
  B5: 2.7,
  C6: 5.0,
};
