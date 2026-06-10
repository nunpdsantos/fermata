/**
 * Builds the two instrument voices — sampled Salamander piano and sampled
 * classical guitar — registers the one matching the store's selected instrument
 * into core audio, and keeps the registration in sync when the instrument
 * changes. With the guitar voice active, every one-shot path (Explore play
 * buttons, Circle of Fifths, ear training, celebration, drill answer audio)
 * sounds the sampled guitar instead of the piano.
 *
 * Both voices are sampler-first with a synthesis fallback. The piano falls back
 * to the FM synth (core audio) while its samples decode; the guitar falls back
 * to the Karplus-Strong engine. Crucially, the guitar voice ALWAYS returns true
 * (sampler hit OR KS fallback fired), so core's FM synth never leaks into guitar
 * mode — exactly as before WS10, only now a real guitar sample plays once
 * decoded. Both sample sets warm on the same first-gesture preload, so flipping
 * instruments never starts a download at flip time, and a first visit offline
 * still sounds (FM synth / KS pluck respectively).
 */
import { setInstrumentVoice, type InstrumentVoice } from '../core/services/audio.ts';
import * as pianoSampler from './pianoSampler.ts';
import * as guitarSampler from './guitarSampler.ts';
import * as ks from './karplusStrong.ts';
import { useAppStore, type InstrumentType } from '../state/store.ts';

const pianoVoice: InstrumentVoice = {
  playNote: (midi, when, duration, velocity) =>
    pianoSampler.playNote(midi, when, duration, velocity),
  startNote: (midi, velocity) => pianoSampler.startNote(midi, velocity),
  stopNote: (midi) => pianoSampler.stopNote(midi),
  setVolume: (volume) => pianoSampler.setVolume(volume),
  resume: () => pianoSampler.resumeContext(),
};

// Sampler-first guitar with a Karplus-Strong fallback. The sampler returns
// false until a note's sample is decoded (or permanently when offline-uncached),
// in which case KS plucks it. Either way the voice reports handled=true so the
// FM synth stays silent. stopNote/setVolume/resume fan out to both engines: a
// sustained note may live in either, and a no-op stop on the engine that does
// not own it is harmless.
const guitarVoice: InstrumentVoice = {
  playNote: (midi, when, duration, velocity) => {
    if (guitarSampler.playNote(midi, when, duration, velocity)) return true;
    ks.playNote(midi, when, duration, velocity);
    return true;
  },
  startNote: (midi, velocity) => {
    if (guitarSampler.startNote(midi, velocity)) return true;
    ks.startNote(midi);
    return true;
  },
  stopNote: (midi) => {
    guitarSampler.stopNote(midi);
    ks.stopNote(midi);
  },
  setVolume: (volume) => {
    guitarSampler.setVolume(volume);
    ks.setVolume(volume);
  },
  resume: async () => {
    await Promise.all([guitarSampler.resumeContext(), ks.resumeContext()]);
  },
};

function voiceFor(instrument: InstrumentType): InstrumentVoice {
  return instrument === 'guitar' ? guitarVoice : pianoVoice;
}

/** Returns the store unsubscribe (ignored in prod, used by tests). */
export function registerInstrumentVoices(): () => void {
  let current = useAppStore.getState().instrument;
  setInstrumentVoice(voiceFor(current));

  const unsubscribe = useAppStore.subscribe((state) => {
    if (state.instrument === current) return;
    current = state.instrument;
    const voice = voiceFor(current);
    setInstrumentVoice(voice);
    // The swapped-in voice picks up the session volume; boot-time volume
    // arrives via useAudio's mount sync instead (pushing here at boot would
    // create the sampler's AudioContext during initial script eval).
    voice.setVolume(state.volume);
  });

  // Warm BOTH sample sets on the first idle slot regardless of the boot
  // instrument, so flipping piano↔guitar later never starts a download at flip
  // time. ~3.7 MB combined; each preload is independently offline-safe.
  const kick = () => {
    void pianoSampler.preload();
    void guitarSampler.preload();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(kick, { timeout: 3000 });
  } else {
    setTimeout(kick, 1000);
  }

  return unsubscribe;
}
