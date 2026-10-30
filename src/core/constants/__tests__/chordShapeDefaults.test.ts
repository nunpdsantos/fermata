/**
 * Review #1 (W3): restoring the C-shape and G-shape major barres must not
 * change the DEFAULT grip of a common chord. The defaults below are main's
 * (origin/main 65c1c6d, nut-closest sort of getChordShapesWithFallback),
 * recorded for all 12 major and 12 minor triads. Before the fix, Db and Ab
 * major defaulted to the new C-shape (x 4 3 1 2 1) and G-shape (4 3 1 1 1 4)
 * barres instead of main's A-shape and E-shape barres.
 */
import { describe, it, expect } from 'vitest';
import { buildChord } from '../chords';
import { getChordShapesWithFallback, sortShapesForDefault } from '../guitarChordShapes';
import type { Note } from '../../types/music';

const toNote = (s: string): Note => ({ natural: s[0] as Note['natural'], accidental: s.slice(1) as Note['accidental'] });

const MAIN_DEFAULTS: Record<string, string> = {
  'C major': 'x 3 2 0 1 0', 'Db major': 'x 4 6 6 6 4', 'D major': 'x x 0 2 3 2', 'Eb major': 'x x 1 3 4 3',
  'E major': '0 2 2 1 0 0', 'F major': '1 3 3 2 1 1', 'F# major': '2 4 4 3 2 2', 'G major': '3 2 0 0 0 3',
  'Ab major': '4 6 6 5 4 4', 'A major': 'x 0 2 2 2 0', 'Bb major': 'x 1 3 3 3 1', 'B major': 'x 2 4 4 4 2',
  'C minor': 'x 3 5 5 4 3', 'Db minor': 'x 4 6 6 5 4', 'D minor': 'x x 0 2 3 1', 'Eb minor': 'x x 1 3 4 2',
  'E minor': '0 2 2 0 0 0', 'F minor': '1 3 3 1 1 1', 'F# minor': '2 4 4 2 2 2', 'G minor': '3 5 5 3 3 3',
  'Ab minor': '4 6 6 4 4 4', 'A minor': 'x 0 2 2 1 0', 'Bb minor': 'x 1 3 3 2 1', 'B minor': 'x 2 4 4 3 2',
};

describe('default chord grip (review #1)', () => {
  it('all 12 major and 12 minor triads default to main\'s grip', () => {
    const got: Record<string, string> = {};
    for (const name of Object.keys(MAIN_DEFAULTS)) {
      const [root, quality] = name.split(' ');
      const first = sortShapesForDefault(getChordShapesWithFallback(buildChord(toNote(root), quality as 'major' | 'minor')))[0];
      got[name] = first.shape.strings.map((p) => (p.fret === null ? 'x' : String(first.baseFret + p.fret))).join(' ');
    }
    expect(got).toEqual(MAIN_DEFAULTS);
  });

  it('the C-shape and G-shape barres are still offered, after the others', () => {
    const list = sortShapesForDefault(getChordShapesWithFallback(buildChord(toNote('Ab'), 'major')));
    const names = list.map((e) => e.shape.name);
    expect(names).toContain('C-shape Barre');
    expect(names).toContain('G-shape Barre');
    const firstDemoted = names.findIndex((n) => n === 'C-shape Barre' || n === 'G-shape Barre');
    expect(names.slice(firstDemoted).every((n) => n === 'C-shape Barre' || n === 'G-shape Barre')).toBe(true);
  });
});
