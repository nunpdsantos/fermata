/**
 * What "Hear it" plays for a scale or a single chord in the two starting
 * tracks (final review of wave 2: playing the scale up AND down, or a chord
 * without one of its notes, passed every test that touches the panel). Every
 * track concept whose Try This is a scale or a chord: the scale plays its
 * notes once, upwards only, from the octave its picture starts on; the chord
 * plays exactly its notes (and its bass, if any).
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

const audio = vi.hoisted(() => ({ scale: [] as unknown[][], chord: [] as unknown[][] }));
vi.mock('../../../../core/services/audio', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  resumeAudio: async () => {},
  cancelScheduledAudio: () => {},
  playTimedNotes: () => {},
  playScale: (...args: unknown[]) => { audio.scale.push(args); },
  playChordVoiced: (...args: unknown[]) => { audio.chord.push(args); },
}));
vi.mock('../../../notation/StaffNotation', () => ({ StaffNotation: () => <div data-testid="staff" /> }));

import { InlineTryThis } from '../InlineTryThis';
import { tryThisPicture } from '../tryThisPicture';
import { useAppStore } from '../../../../state/store';
import { L1_UNITS } from '../../../../core/constants/curriculumL1';
import type { Note } from '../../../../core/types/music';

const C: Note = { natural: 'C', accidental: '' };
const text = (ns: readonly Note[]) => ns.map((n) => `${n.natural}${n.accidental}`).join(' ');

beforeEach(() => {
  audio.scale = [];
  audio.chord = [];
  useAppStore.setState({ language: 'en', instrument: 'piano', selectedKey: C });
});
afterEach(cleanup);

const cases = L1_UNITS.filter((u) => u.track).flatMap((u) => u.modules.flatMap((m) => m.concepts.map((c, i) => [`${m.id} c${i}: ${c.tryThisQuery}`, c.tryThisQuery] as const)))
  .filter(([, q]) => ['scale', 'chord'].includes(tryThisPicture(q, C).kind));

describe('"Hear it" plays what the picture shows', () => {
  it('the cases cover both kinds', () => {
    expect(cases.filter(([, q]) => tryThisPicture(q, C).kind === 'scale').length).toBeGreaterThanOrEqual(10);
    expect(cases.filter(([, q]) => tryThisPicture(q, C).kind === 'chord').length).toBeGreaterThanOrEqual(4);
  });

  it.each(cases)('%s', async (_name, query) => {
    const picture = tryThisPicture(query, C);
    render(<InlineTryThis query={query} label="Hear it" accent="#3b82f6" names />);
    fireEvent.click(screen.getByRole('button', { name: 'Hear it' }));
    if (picture.kind === 'scale') {
      await waitFor(() => expect(audio.scale).toHaveLength(1));
      const [notes, octave, up, down] = audio.scale[0] as [Note[], number, boolean, boolean];
      expect({ notes: text(notes), octave, up, down }).toEqual({ notes: text(picture.notes), octave: picture.pitches[0].octave, up: true, down: false });
      expect(audio.chord).toHaveLength(0);
    } else if (picture.kind === 'chord') {
      await waitFor(() => expect(audio.chord).toHaveLength(1));
      const [notes, , , , bass] = audio.chord[0] as [Note[], number, number, unknown, Note | undefined];
      expect(text(notes)).toBe(text(picture.notes));
      expect(bass).toEqual(picture.bass);
      expect(audio.scale).toHaveLength(0);
    }
  });
});
