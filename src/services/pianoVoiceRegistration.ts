/**
 * Registers the sampled Salamander piano as core audio's piano voice and
 * kicks off sample loading off the critical path. Until samples decode (or
 * if they never do — first visit offline), core falls back to the FM synth,
 * so the keyboard always sounds.
 */
import { setPianoVoice } from '../core/services/audio.ts';
import * as sampler from './pianoSampler.ts';

export function registerSampledPiano(): void {
  setPianoVoice({
    playNote: (midi, when, duration, velocity) => sampler.playNote(midi, when, duration, velocity),
    startNote: (midi, velocity) => sampler.startNote(midi, velocity),
    stopNote: (midi) => sampler.stopNote(midi),
    setVolume: (volume) => sampler.setVolume(volume),
    resume: () => sampler.resumeContext(),
  });

  const kick = () => {
    void sampler.preload();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(kick, { timeout: 3000 });
  } else {
    setTimeout(kick, 1000);
  }
}
