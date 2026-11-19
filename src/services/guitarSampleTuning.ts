/**
 * How far each recorded guitar sample is from its note (audit M60, 19
 * November 2026): cents from equal temperament at A4 = 440 Hz, + = sharp.
 * `guitarSampler.resolveSample` plays each sample that much lower (or
 * higher), so every note of the guitar voice — the tuner's "Hear", Explore,
 * Learn, Drill — sounds at its pitch. Until then the voice played the files
 * as recorded: the tuner read its own B3 10.6 cents sharp (the audit: +11),
 * and C♯4 sounded 16 cents sharp.
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
 * autocorrelation windows every 0.25 s, from 0.1 s to 2.5 s or the file's
 * end, the median of the windows), shares no code with the app's detector;
 * cross-checked by the builder with an ffmpeg decode and a separate numpy
 * autocorrelation (within 0.3 cent). A plucked string glides: sharper while
 * it is loud (B3 from +14.8 at the attack to +8.9), so after the correction
 * a note's first moments can still be a few cents sharp and its tail a few
 * flat; the median through the 2.5 s reference is what is corrected.
 */
export const GUITAR_SAMPLE_CENTS: Readonly<Record<string, number>> = {
  E2: 0.4,
  F2: 8.4,
  G2: 8.8,
  A2: 0.2,
  B2: 8.0,
  C3: -0.5,
  D3: 3.3,
  E3: 3.2,
  F3: 3.2,
  Fs3: 2.8,
  G3: 2.3,
  Gs3: 8.5,
  A3: 9.6,
  As3: 10.2,
  B3: 10.2,
  C4: 8.0,
  Cs4: 16.3,
  D4: 7.1,
  Ds4: 8.1,
  E4: -0.8,
  F4: 2.3,
  Fs4: 2.6,
  G4: 2.7,
  A4: 2.1,
  As4: -0.9,
  B4: 11.9,
  C5: 9.6,
  Cs5: 8.9,
  D5: 10.3,
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
