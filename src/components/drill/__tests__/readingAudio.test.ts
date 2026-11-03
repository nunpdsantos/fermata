import { expect, it, vi } from 'vitest';
import { genRead } from '../../../core/utils/drillBank/genRead';
import { playAnswerAudio } from '../answerAudio';
import { cancelScheduledAudio, playNote } from '../../../core/services/audio';

vi.mock('../../../core/services/audio', () => ({
  playNote: vi.fn(), playArpeggioAscending: vi.fn(), cancelScheduledAudio: vi.fn(), resumeAudio: vi.fn(() => Promise.resolve()),
}));

it('reveals the exact sounding pitch, one octave below the written note', () => {
  const item = genRead().find((i) => i.id === 'read:staff-to-fret:V:C5')!;
  playAnswerAudio(item);
  expect(cancelScheduledAudio).toHaveBeenCalledOnce();
  expect(playNote).toHaveBeenCalledWith({ natural: 'C', accidental: '', octave: 4 }, 4, 0.32);
});
