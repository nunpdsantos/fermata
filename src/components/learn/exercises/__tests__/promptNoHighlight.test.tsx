/**
 * Audit W4-21 — the prompt never lights the answer on the instrument.
 *
 * ExercisePrompt used to push a note_id exercise's target note into the
 * instrument highlight channel. That channel only renders in build mode, so
 * the code was dead — but "fixing" it would show the answer on keys that are
 * labelled with note names. The highlight belongs to the build input alone.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import { useAppStore } from '../../../../state/store';

vi.mock('../../../notation/StaffNotation', () => ({
  StaffNotation: () => <div data-testid="staff" />,
}));

import { ExercisePrompt } from '../ExercisePrompt';

afterEach(() => {
  cleanup();
  useAppStore.setState({ highlightedNotes: [] });
});

const noteId: ExerciseDefinition = {
  id: 'w421',
  type: 'note_id',
  prompt: 'Name this note.',
  config: { type: 'note_id', note: 'F', accidental: '#', octave: 4 },
};

describe('ExercisePrompt and the instrument highlight (W4-21)', () => {
  it('a note-naming prompt leaves the instrument highlight empty', () => {
    render(<ExercisePrompt exercise={noteId} />);
    expect(useAppStore.getState().highlightedNotes).toEqual([]);
  });

  it('does not clear a highlight it does not own', () => {
    useAppStore.setState({ highlightedNotes: [{ natural: 'C', accidental: '', octave: 4 }] });
    const { unmount } = render(<ExercisePrompt exercise={noteId} />);
    unmount();
    expect(useAppStore.getState().highlightedNotes).toHaveLength(1);
  });
});
