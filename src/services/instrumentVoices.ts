/**
 * Builds the two instrument voices — sampled Salamander piano and
 * Karplus-Strong guitar — registers the one matching the store's selected
 * instrument into core audio, and keeps the registration in sync when the
 * instrument changes. With the guitar voice active, every one-shot path
 * (Explore play buttons, Circle of Fifths, ear training, celebration) plucks
 * instead of sounding the piano.
 *
 * Piano sample loading still kicks off on idle regardless of the boot
 * instrument, so flipping to piano later never starts a 2 MB download at
 * flip time. Until samples decode (or first visit offline), core falls back
 * to the FM synth, so piano always sounds. The guitar voice generates
 * synchronously and never declines, so the synth cannot leak into guitar
 * mode.
 */
import { setInstrumentVoice, type InstrumentVoice } from '../core/services/audio.ts';
import * as sampler from './pianoSampler.ts';
import * as ks from './karplusStrong.ts';
import { useAppStore, type InstrumentType } from '../state/store.ts';

const pianoVoice: InstrumentVoice = {
  playNote: (midi, when, duration, velocity) => sampler.playNote(midi, when, duration, velocity),
  startNote: (midi, velocity) => sampler.startNote(midi, velocity),
  stopNote: (midi) => sampler.stopNote(midi),
  setVolume: (volume) => sampler.setVolume(volume),
  resume: () => sampler.resumeContext(),
};

const guitarVoice: InstrumentVoice = {
  playNote: (midi, when, duration, velocity) => {
    ks.playNote(midi, when, duration, velocity);
    return true;
  },
  startNote: (midi) => {
    ks.startNote(midi);
    return true;
  },
  stopNote: (midi) => ks.stopNote(midi),
  setVolume: (volume) => ks.setVolume(volume),
  resume: () => ks.resumeContext(),
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

  const kick = () => {
    void sampler.preload();
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(kick, { timeout: 3000 });
  } else {
    setTimeout(kick, 1000);
  }

  return unsubscribe;
}
