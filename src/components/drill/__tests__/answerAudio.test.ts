import { describe, it, expect, vi, beforeEach } from 'vitest';
import { planAnswerAudio, playAnswerAudio } from '../answerAudio';
import { generateDrillBank } from '../../../core/utils/drillBank';
import type { DrillItem } from '../../../core/types/drill';
import { noteToString } from '../../../core/types/music';

// Mock the core audio path so we can assert call behavior without a real
// AudioContext (and so the player's side effects are observable).
vi.mock('../../../core/services/audio', () => ({
  playArpeggioAscending: vi.fn(),
  resumeAudio: vi.fn(() => Promise.resolve()),
}));

import { playArpeggioAscending, resumeAudio } from '../../../core/services/audio';

const BANK: DrillItem[] = generateDrillBank();
const byId = new Map(BANK.map((i) => [i.id, i]));
function get(id: string): DrillItem {
  const item = byId.get(id);
  if (!item) throw new Error(`missing bank item: ${id}`);
  return item;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('planAnswerAudio', () => {
  it('returns the chord tones for a triad spelling item', () => {
    const item = get('triad:name-to-notes:C:major');
    const notes = planAnswerAudio(item);
    expect(notes?.map(noteToString)).toEqual(['C', 'E', 'G']);
  });

  it('rebuilds the chord for a seventh naming (rootQuality) item', () => {
    const item = get('seventh:notes-to-name:C:major7');
    const notes = planAnswerAudio(item);
    expect(notes?.map(noteToString)).toEqual(['C', 'E', 'G', 'B']);
  });

  it('returns root then note-above for an interval note-above item', () => {
    // C + minor 3rd above = Eb.
    const item = get('interval:note-above:C:m3');
    const notes = planAnswerAudio(item);
    expect(notes?.map(noteToString)).toEqual(['C', 'Eb']);
  });

  it('returns the first five notes for a scale spelling item', () => {
    const item = get('scale:spell:C:major');
    const notes = planAnswerAudio(item);
    expect(notes?.map(noteToString)).toEqual(['C', 'D', 'E', 'F', 'G']);
  });

  it('returns root then note-above for a non-natural sharp root (F♯ + P4 → B)', () => {
    // interval:note-above:F#:P4 — promptParams.root is the unicode "F♯"
    const item = get('interval:note-above:F#:P4');
    const notes = planAnswerAudio(item);
    expect(notes?.map(noteToString)).toEqual(['F#', 'B']);
  });

  it('returns root then note-above for a flat root (Eb + M3 → G)', () => {
    // interval:note-above:Eb:M3 — promptParams.root is the unicode "E♭"
    const item = get('interval:note-above:Eb:M3');
    const notes = planAnswerAudio(item);
    expect(notes?.map(noteToString)).toEqual(['Eb', 'G']);
  });

  it('returns null for an interval NAMING item (no single answer pitch)', () => {
    const naming = BANK.find((i) => i.id.startsWith('interval:pair-to-name:'));
    expect(naming).toBeDefined();
    expect(planAnswerAudio(naming!)).toBeNull();
  });

  it('returns null for concept families (keysig, circle, degree, roman, function)', () => {
    for (const prefix of ['keysig:', 'circle:', 'degree:', 'roman:', 'function:']) {
      const item = BANK.find((i) => i.id.startsWith(prefix));
      expect(item, `no item for ${prefix}`).toBeDefined();
      expect(planAnswerAudio(item!), `${item!.id} should be silent`).toBeNull();
    }
  });
});

describe('playAnswerAudio', () => {
  it('plays an arpeggio for a chord item (octave 4)', () => {
    playAnswerAudio(get('triad:name-to-notes:C:major'));
    expect(resumeAudio).toHaveBeenCalledTimes(1);
    expect(playArpeggioAscending).toHaveBeenCalledTimes(1);
    const [notes, octave] = (playArpeggioAscending as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(notes.map(noteToString)).toEqual(['C', 'E', 'G']);
    expect(octave).toBe(4);
  });

  it('plays nothing for a concept item', () => {
    const keysig = BANK.find((i) => i.family === 'keysig')!;
    playAnswerAudio(keysig);
    expect(playArpeggioAscending).not.toHaveBeenCalled();
    expect(resumeAudio).not.toHaveBeenCalled();
  });
});
