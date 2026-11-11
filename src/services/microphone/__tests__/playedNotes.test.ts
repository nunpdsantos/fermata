/**
 * Notes held on a real instrument become `emitExternalNote` calls (source
 * 'mic', never sounded by the app), on when held about a tenth of a second,
 * off when they end; a stray frame or a short blip is no note; what the app
 * plays itself (the on-screen instrument, a reference) is not reported.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { subscribeExternalNotes, type ExternalNote } from '../../externalNotes';
import { createNoteTracker, HOLD_MS, RELEASE_MS } from '../noteTracker';
import { reportPlayedNotes, APP_SOUND_MS } from '../playedNotes';
import { midiHz } from './fakeMic';

const sure = (midi: number, cents = 0) => ({ frequency: midiHz(midi, cents), clarity: 0.97 });

describe('createNoteTracker', () => {
  it('a note held 100 ms starts; when nothing is heard it ends', () => {
    const events: [number, boolean][] = [];
    const tr = createNoteTracker((m, on) => events.push([m, on]));
    for (let t = 0; t < HOLD_MS; t += 30) tr.push(sure(60), t);
    expect(events).toEqual([]);
    tr.push(sure(60, -30), HOLD_MS + 5);
    expect(events).toEqual([[60, true]]);
    for (let t = 135; t < 400; t += 30) tr.push(sure(60, 10), t);
    expect(events).toEqual([[60, true]]);
    tr.push(null, 420);
    tr.push(null, 400 + RELEASE_MS + 30);
    expect(events).toEqual([[60, true], [60, false]]);
  });

  it('a blip shorter than 100 ms is no note; unsure frames are not notes', () => {
    const events: [number, boolean][] = [];
    const tr = createNoteTracker((m, on) => events.push([m, on]));
    tr.push(sure(64), 0);
    tr.push(sure(64), 30);
    tr.push(null, 60);
    for (let t = 90; t < 600; t += 30) tr.push({ frequency: midiHz(67), clarity: 0.7 }, t);
    expect(events).toEqual([]);
  });

  it('one stray frame inside a held note changes nothing', () => {
    const events: [number, boolean][] = [];
    const tr = createNoteTracker((m, on) => events.push([m, on]));
    for (let t = 0; t <= 300; t += 30) tr.push(t === 180 ? sure(72) : t === 210 ? null : sure(60), t);
    expect(events).toEqual([[60, true]]);
  });

  it('C then E then G, one at a time: three notes, each ended before the next starts', () => {
    const events: [number, boolean][] = [];
    const tr = createNoteTracker((m, on) => events.push([m, on]));
    let t = 0;
    for (const midi of [60, 64, 67]) {
      for (let i = 0; i < 10; i++, t += 30) tr.push(sure(midi), t);
    }
    tr.reset();
    expect(events).toEqual([[60, true], [60, false], [64, true], [64, false], [67, true], [67, false]]);
  });
});

describe('reportPlayedNotes', () => {
  let heard: ExternalNote[];
  let off: () => void;
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['performance', 'Date'] });
    heard = [];
    off = subscribeExternalNotes((n) => heard.push(n));
  });
  afterEach(() => {
    off();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  const play = (r: ReturnType<typeof reportPlayedNotes>, midi: number, ms = 300) => {
    const start = performance.now();
    for (let t = 0; t <= ms; t += 30) {
      vi.advanceTimersByTime(30);
      r.onFrame(sure(midi), start + t);
    }
  };

  it('emits the held notes with source "mic", on and off, and no velocity', () => {
    const r = reportPlayedNotes();
    play(r, 60);
    r.dispose();
    expect(heard).toEqual([{ midi: 60, on: true, source: 'mic' }, { midi: 60, on: false, source: 'mic' }]);
  });

  it('a tap on the on-screen instrument: its sound is not reported (and the held note ends)', () => {
    const region = document.createElement('div');
    region.id = 'instrument-region';
    const key = document.createElement('button');
    region.appendChild(key);
    document.body.appendChild(region);
    const r = reportPlayedNotes();
    play(r, 64);
    expect(heard.map((n) => [n.midi, n.on])).toEqual([[64, true]]);
    key.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(heard.map((n) => [n.midi, n.on])).toEqual([[64, true], [64, false]]);
    play(r, 67, 600);
    key.dispatchEvent(new Event('pointerup', { bubbles: true }));
    play(r, 67, APP_SOUND_MS - 100);
    expect(heard.length).toBe(2);
    play(r, 67, 400);
    expect(heard.map((n) => [n.midi, n.on])).toEqual([[64, true], [64, false], [67, true]]);
    r.dispose();
  });

  const instrumentKey = () => {
    const region = document.createElement('div');
    region.id = 'instrument-region';
    const key = document.createElement('button');
    region.appendChild(key);
    document.body.appendChild(region);
    return key;
  };
  const notes = () => heard.map((n) => [n.midi, n.on]);

  it('a quick tap: its sound is not reported for 1.5 s after the finger lifts', () => {
    const key = instrumentKey();
    const r = reportPlayedNotes();
    key.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    key.dispatchEvent(new Event('pointerup', { bubbles: true }));
    // Literal times: the promise is the app's sound tail (a sample rings ~1.5 s).
    play(r, 60, 1200);
    expect(heard).toEqual([]);
    play(r, 60, 600);
    expect(notes()).toEqual([[60, true]]);
    r.dispose();
  });

  it('a key held down longer than APP_SOUND_MS: nothing reported while it is held', () => {
    const key = instrumentKey();
    const r = reportPlayedNotes();
    key.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    play(r, 60, APP_SOUND_MS + 1000);
    expect(heard).toEqual([]);
    key.dispatchEvent(new Event('pointerup', { bubbles: true }));
    play(r, 60, APP_SOUND_MS + 400);
    expect(notes()).toEqual([[60, true]]);
    r.dispose();
  });

  it('a key press on the on-screen instrument (keyboard play): silenced for APP_SOUND_MS, then heard again', () => {
    const key = instrumentKey();
    const r = reportPlayedNotes();
    play(r, 64);
    key.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(notes()).toEqual([[64, true], [64, false]]);
    play(r, 67, 1200);
    expect(notes()).toEqual([[64, true], [64, false]]);
    // No pointer-up follows a key press: listening must come back by itself.
    play(r, 67, 700);
    expect(notes()).toEqual([[64, true], [64, false], [67, true]]);
    r.dispose();
  });

  it('dispose removes every document listener it added', () => {
    const added: unknown[][] = [];
    const removed: unknown[][] = [];
    const add = vi.spyOn(document, 'addEventListener').mockImplementation((...a: unknown[]) => void added.push(a));
    const remove = vi.spyOn(document, 'removeEventListener').mockImplementation((...a: unknown[]) => void removed.push(a));
    try {
      const r = reportPlayedNotes();
      expect(added.map((a) => a[0]).sort()).toEqual(['keydown', 'pointercancel', 'pointerdown', 'pointerup']);
      r.dispose();
      expect(removed).toEqual(added);
    } finally {
      add.mockRestore();
      remove.mockRestore();
    }
  });

  it('a tap elsewhere (the Check button) does not silence it', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    const r = reportPlayedNotes();
    button.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    play(r, 62);
    expect(heard[0]).toEqual({ midi: 62, on: true, source: 'mic' });
    r.dispose();
  });

  it('muteFor: a reference the app plays is not the learner\'s note', () => {
    const r = reportPlayedNotes();
    r.muteFor(1000);
    play(r, 40, 900);
    expect(heard).toEqual([]);
    play(r, 40, 400);
    expect(heard).toEqual([{ midi: 40, on: true, source: 'mic' }]);
    r.dispose();
  });
});
