/**
 * The one listener for notes played on a real instrument (brief K, wave 3):
 * for each of the three places and both sources, exactly what SOUNDS (on the
 * audio seam: a fake instrument voice registered into real core audio — only
 * Web Audio itself is mocked), what LIGHTS (`activeNotes`, the linked focus
 * note) and what is ADDED to an answer; and that every stop path leaves no
 * note held, lit or sounding. Notes are emitted through the contract
 * (`emitExternalNote`), as the MIDI service and the microphone do.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, renderHook, cleanup, act, screen, fireEvent } from '@testing-library/react';
import { emitExternalNote, type ExternalNote } from '../externalNotes';
import { useExternalNotes, loadExternalNotesListener } from '../externalNotesHost';
import { heldExternalNotes, releaseAllExternalNotes, externalPlace, velocityGain } from '../externalNotesListener';
import { setInstrumentVoice } from '../../core/services/audio';
import { installMockAudioContext } from '../../test/mockAudioContext';
import { getSynthConfig } from '../synthConfig';
import { useAppStore } from '../../state/store';
import { useFocusNoteStore } from '../../state/focusNoteStore';
import { InstrumentInput } from '../../components/learn/exercises/inputs/InstrumentInput';
import { ExerciseRunner } from '../../components/learn/exercises/ExerciseRunner';
import type { ExerciseDefinition } from '../../core/types/exercise';

interface Call { op: 'start' | 'stop' | 'play'; midi: number; velocity?: number }
let calls: Call[] = [];
const voice = {
  playNote: (midi: number) => {
    calls.push({ op: 'play', midi });
    return true;
  },
  startNote: (midi: number, velocity: number) => {
    calls.push({ op: 'start', midi, velocity });
    return true;
  },
  stopNote: (midi: number) => {
    calls.push({ op: 'stop', midi });
  },
  setVolume: () => {},
  resume: () => Promise.resolve(),
  cancelScheduled: () => {},
};

const midi = (n: number, on: boolean, velocity = 0.8): ExternalNote => ({ midi: n, on, source: 'midi', ...(on ? { velocity } : {}) });
const mic = (n: number, on: boolean): ExternalNote => ({ midi: n, on, source: 'mic' });
const play = (...notes: ExternalNote[]) => act(() => { for (const n of notes) emitExternalNote(n); });
const started = () => calls.filter((c) => c.op === 'start').map((c) => c.midi);
const stopped = () => calls.filter((c) => c.op === 'stop').map((c) => c.midi);
/** Notes sounding now on the seam (started, not stopped since). */
function soundingNow(): number[] {
  const s = new Set<number>();
  for (const c of calls) {
    if (c.op === 'start') s.add(c.midi);
    else if (c.op === 'stop') s.delete(c.midi);
  }
  return [...s].sort((a, b) => a - b);
}
const lit = () => [...useAppStore.getState().activeNotes].sort((a, b) => a - b);
const pinned = () => useFocusNoteStore.getState().pinned;

let hostStartScreen = false;
function mountHost() {
  return renderHook(({ start }) => useExternalNotes(start), { initialProps: { start: hostStartScreen } });
}

beforeEach(async () => {
  installMockAudioContext(1);
  calls = [];
  setInstrumentVoice(voice);
  hostStartScreen = false;
  useAppStore.setState({ view: 'explore', exerciseInputActive: false, instrument: 'piano', activeNotes: new Set(), highlightedNotes: [] });
  useFocusNoteStore.getState().clearAll();
  await loadExternalNotesListener();
});
afterEach(() => {
  releaseAllExternalNotes();
  cleanup();
  document.querySelectorAll('[data-test-modal]').forEach((n) => n.remove());
  setInstrumentVoice(null);
  useAppStore.setState({ view: 'explore', exerciseInputActive: false, instrument: 'piano', activeNotes: new Set(), highlightedNotes: [] });
});

describe('the one subscriber', () => {
  it('nothing happens until the shell mounts it; then every note is heard once', () => {
    play(midi(60, true));
    expect(calls).toEqual([]);
    const host = mountHost();
    play(midi(60, false), midi(60, true));
    expect(started()).toEqual([60]);
    host.unmount();
    play(midi(60, false));
    expect(stopped()).toEqual([]);
  });
});

describe('in Explore', () => {
  beforeEach(() => {
    mountHost();
  });

  it('a midi note sounds in the instrument voice, lights the key and is the focus note, while held', () => {
    play(midi(60, true), midi(64, true), midi(67, true));
    expect(started()).toEqual([60, 64, 67]);
    expect(lit()).toEqual([60, 64, 67]);
    expect(pinned()).toEqual({ pc: 7, midi: 67, source: 'piano' });
    play(midi(64, false));
    expect(soundingNow()).toEqual([60, 67]);
    expect(lit()).toEqual([60, 67]);
    play(midi(60, false), midi(67, false));
    expect(soundingNow()).toEqual([]);
    expect(lit()).toEqual([]);
    // The focus note stays the last note played, as a tap's does.
    expect(pinned()).toEqual({ pc: 7, midi: 67, source: 'piano' });
    expect(heldExternalNotes()).toEqual([]);
  });

  it('a mic note lights and focuses, and never reaches the audio engine', () => {
    play(mic(69, true));
    expect(lit()).toEqual([69]);
    expect(pinned()).toEqual({ pc: 9, midi: 69, source: 'piano' });
    play(mic(69, false));
    expect(lit()).toEqual([]);
    expect(calls).toEqual([]);
  });

  it('the guitar selected: the fretboard lights that pitch (activeNotes) and the focus is a fret note', () => {
    useAppStore.setState({ instrument: 'guitar' });
    play(midi(52, true));
    expect(lit()).toEqual([52]);
    expect(pinned()).toEqual({ pc: 4, midi: 52, source: 'fret' });
    expect(started()).toEqual([52]);
  });

  it('a pitch held by the keyboard AND the microphone stays lit until both let go', () => {
    play(midi(60, true), mic(60, true), midi(60, false));
    expect(lit()).toEqual([60]);
    play(mic(60, false));
    expect(lit()).toEqual([]);
  });

  it('velocity sets the loudness: harder is louder, a note without one sounds as a tap', () => {
    play(midi(60, true, 0.1), midi(62, true, 0.5), midi(64, true, 1));
    const v = calls.filter((c) => c.op === 'start').map((c) => c.velocity!);
    expect(v[0]).toBeLessThan(v[1]);
    expect(v[1]).toBeLessThan(v[2]);
    expect(velocityGain(undefined)).toBe(1);
    expect(velocityGain(100 / 127)).toBeCloseTo(1, 1);
  });

  it('the loudness is the preset\'s note volume × the velocity gain, and the learner\'s Volume applies', () => {
    const volumes: number[] = [];
    setInstrumentVoice({ ...voice, setVolume: (v: number) => { volumes.push(v); } });
    useAppStore.setState({ volume: 0.3 });
    const base = getSynthConfig(useAppStore.getState().synthPreset).volume as number;
    play(midi(60, true, 0.2), midi(64, true, 1));
    const v = calls.filter((c) => c.op === 'start').map((c) => c.velocity!);
    expect(v[0]).toBeCloseTo(Math.min(1, base * velocityGain(0.2)), 10);
    expect(v[1]).toBeCloseTo(Math.min(1, base * velocityGain(1)), 10);
    expect(volumes).toContain(0.3);
  });

  it('every MIDI note sounds at its own pitch, the lowest octave (0–11) included', () => {
    for (const n of [0, 5, 11, 12, 21, 108, 127]) {
      calls = [];
      play(midi(n, true));
      expect(started(), `note ${n}`).toEqual([n]);
      play(midi(n, false));
      expect(stopped(), `note ${n}`).toEqual([n]);
    }
  });

  it('the same note again while held starts again (struck again under the pedal)', () => {
    play(midi(60, true), midi(60, true));
    expect(calls.map((c) => c.op)).toEqual(['start', 'stop', 'start']);
    expect(lit()).toEqual([60]);
  });

  it('an off for a note that is not held does nothing; out-of-range notes are ignored', () => {
    play(midi(61, false), midi(200, true), midi(-1, true));
    expect(calls).toEqual([]);
    expect(lit()).toEqual([]);
  });
});

describe('in a check answered on the instrument', () => {
  beforeEach(() => {
    mountHost();
  });
  function chips(c: HTMLElement): string[] {
    return [...c.querySelectorAll('span.rounded-md')].map((s) => s.textContent ?? '');
  }

  it('a note that starts ADDS its note; played again it is not removed; midi sounds, mic does not; nothing lights as held', () => {
    const { container } = render(<InstrumentInput expectedCount={3} submitted={false} onSubmit={() => {}} accentColor="#888888" />);
    expect(externalPlace()).toBe('answer');
    play(midi(60, true), midi(60, false), midi(72, true), midi(72, false));
    expect(chips(container)).toEqual(['C']);
    play(mic(64, true), mic(64, false));
    expect(chips(container)).toEqual(['C', 'E']);
    expect(started()).toEqual([60, 72]);
    expect(lit()).toEqual([]);
    expect(soundingNow()).toEqual([]);
  });

  it('a submitted (final) item takes no more notes; they only sound', () => {
    const { container } = render(<InstrumentInput expectedCount={3} submitted onSubmit={() => {}} accentColor="#888888" />);
    expect(externalPlace()).toBe('elsewhere');
    play(midi(60, true), mic(62, true));
    expect(chips(container)).toEqual([]);
    expect(started()).toEqual([60]);
  });

  const buildC: ExerciseDefinition = {
    id: 'cb1',
    type: 'chord_build',
    prompt: 'Build a C major chord.',
    config: { type: 'chord_build', root: 'C', rootAccidental: '', quality: 'major', noteCount: 3 },
  };

  for (const source of ['midi', 'mic'] as const) {
    it(`"build C major" answered entirely from ${source} notes is graded right; submitting stays the learner's`, () => {
      const onRecordResult = (id: string, score: number) => results.push([id, score]);
      const results: [string, number][] = [];
      render(<ExerciseRunner exercises={[buildC]} accentColor="#8b5cf6" onRecordResult={onRecordResult} onComplete={() => {}} />);
      const n = (m: number, on: boolean) => (source === 'midi' ? midi(m, on) : mic(m, on));
      // C–E–G, held as a chord, then released.
      play(n(48, true), n(52, true), n(55, true), n(48, false), n(52, false), n(55, false));
      expect(results).toEqual([]);
      fireEvent.click(screen.getByRole('button', { name: 'Check Answer' }));
      expect(results).toEqual([['cb1', 1]]);
      expect(started()).toEqual(source === 'midi' ? [48, 52, 55] : []);
    });
  }
});

describe('everywhere else: midi sounds, nothing else; mic does nothing', () => {
  const cases: [string, () => void][] = [
    ['Drill', () => useAppStore.setState({ view: 'drill' })],
    ['Learn, not answering on the instrument (a multiple-choice check, a lesson)', () => useAppStore.setState({ view: 'learn' })],
    ['a sheet open over Explore', () => {
      const d = document.createElement('div');
      d.setAttribute('aria-modal', 'true');
      d.setAttribute('data-test-modal', '');
      document.body.appendChild(d);
    }],
    ['the start screen', () => { hostStartScreen = true; }],
  ];
  for (const [name, arrange] of cases) {
    it(name, () => {
      arrange();
      mountHost();
      expect(externalPlace()).toBe('elsewhere');
      play(midi(60, true), mic(64, true));
      expect(started()).toEqual([60]);
      expect(lit()).toEqual([]);
      expect(pinned()).toBeNull();
      play(midi(60, false), mic(64, false));
      expect(soundingNow()).toEqual([]);
    });
  }

  it('the landscape full-neck dialog is Explore\'s instrument, not a sheet over it', () => {
    const d = document.createElement('div');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('data-testid', 'neck-view');
    d.setAttribute('data-test-modal', '');
    document.body.appendChild(d);
    mountHost();
    expect(externalPlace()).toBe('explore');
  });
});

describe('every stop path leaves no note held, lit or sounding', () => {
  beforeEach(() => {
    mountHost();
  });
  function holdChord() {
    play(midi(60, true), midi(64, true), mic(67, true));
    expect(soundingNow()).toEqual([60, 64]);
    expect(lit()).toEqual([60, 64, 67]);
  }
  function expectSilent() {
    expect(soundingNow()).toEqual([]);
    expect(lit()).toEqual([]);
    expect(heldExternalNotes()).toEqual([]);
  }

  it('a view change', () => {
    holdChord();
    act(() => useAppStore.getState().setView('learn'));
    expectSilent();
    // The keys let go later: nothing more happens.
    const before = calls.length;
    play(midi(60, false), midi(64, false), mic(67, false));
    expect(calls.length).toBe(before);
  });

  it('a view change between two views where a note only sounds (Learn to Drill)', () => {
    act(() => useAppStore.getState().setView('learn'));
    play(midi(60, true), midi(64, true));
    expect(soundingNow()).toEqual([60, 64]);
    act(() => useAppStore.getState().setView('drill'));
    expect(soundingNow()).toEqual([]);
    expect(heldExternalNotes()).toEqual([]);
  });

  it('the page hidden (and pagehide)', () => {
    holdChord();
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    act(() => { document.dispatchEvent(new Event('visibilitychange')); });
    expectSilent();
    // Nothing starts in a hidden page.
    play(midi(62, true));
    expect(soundingNow()).toEqual([]);
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    holdChord();
    act(() => { window.dispatchEvent(new Event('pagehide')); });
    expectSilent();
  });

  it('a sheet opened', async () => {
    holdChord();
    const d = document.createElement('div');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('data-test-modal', '');
    await act(async () => {
      document.body.appendChild(d);
      await Promise.resolve();
    });
    expectSilent();
  });

  it('the instrument changed (the old voice stops its notes)', () => {
    holdChord();
    act(() => useAppStore.setState({ instrument: 'guitar' }));
    expectSilent();
  });

  it('a check taking the instrument (and leaving it)', () => {
    holdChord();
    const { unmount } = render(<InstrumentInput expectedCount={3} submitted={false} onSubmit={() => {}} accentColor="#888888" />);
    expectSilent();
    play(midi(62, true));
    expect(soundingNow()).toEqual([62]);
    unmount();
    expect(soundingNow()).toEqual([]);
  });

  it('the question submitted (its answer no longer takes notes): a key held for it is let go', () => {
    const ui = (submitted: boolean) => <InstrumentInput expectedCount={3} submitted={submitted} onSubmit={() => {}} accentColor="#888888" />;
    const { rerender } = render(ui(false));
    expect(externalPlace()).toBe('answer');
    play(midi(62, true));
    expect(soundingNow()).toEqual([62]);
    rerender(ui(true));
    expect(externalPlace()).toBe('elsewhere');
    expect(soundingNow()).toEqual([]);
    expect(heldExternalNotes()).toEqual([]);
  });

  it('the place moved without notice (a dialog opened deeper than <body>): the next note releases the old ones first', async () => {
    play(midi(60, true));
    const wrap = document.createElement('div');
    wrap.setAttribute('data-test-modal', '');
    await act(async () => {
      document.body.appendChild(wrap);
      await Promise.resolve();
    });
    // Something added to <body> that is not a dialog changes nothing.
    expect(soundingNow()).toEqual([60]);
    const d = document.createElement('div');
    d.setAttribute('aria-modal', 'true');
    wrap.appendChild(d);
    play(midi(62, true));
    expect(soundingNow()).toEqual([62]);
    expect(lit()).toEqual([]);
  });
});

describe('the start screen coming or going (App tells the one subscriber)', () => {
  it('a note held in Explore is let go when the start screen shows, and one held on the start screen when it goes', () => {
    const host = renderHook(({ start }) => useExternalNotes(start), { initialProps: { start: false } });
    play(midi(60, true), mic(67, true));
    expect(soundingNow()).toEqual([60]);
    expect(lit()).toEqual([60, 67]);
    host.rerender({ start: true });
    expect(soundingNow()).toEqual([]);
    expect(lit()).toEqual([]);
    expect(heldExternalNotes()).toEqual([]);
    expect(externalPlace()).toBe('elsewhere');
    play(midi(64, true));
    expect(soundingNow()).toEqual([64]);
    host.rerender({ start: false });
    expect(soundingNow()).toEqual([]);
    expect(heldExternalNotes()).toEqual([]);
    host.unmount();
  });
});
