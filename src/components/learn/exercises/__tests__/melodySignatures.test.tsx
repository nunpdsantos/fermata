import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { levelCorpus } from '../../../../data/exercises/__tests__/learnCorpus';
import { choicesForExercise } from '../exerciseHelpers';
import { ChoiceInput } from '../inputs/ChoiceInput';
import { vexAccidentals } from '../../../../utils/notationHelpers';
import type { PitchedNote } from '../../../../core/types/music';
vi.mock('../../../notation/StaffNotation', () => ({ StaffNotation: (p: { keySignature?: string; notes: PitchedNote[] }) =>
  <span data-testid="melody-signature" data-signature={p.keySignature}>{JSON.stringify(vexAccidentals(p.notes, p.keySignature))}</span> }));
afterEach(cleanup);
const items = Array.from({ length: 9 }, (_, i) => levelCorpus(i + 1, 'en')).flat().map((x) => x.exercise)
  .filter((ex) => ex.config.type === 'ear_training' && ex.config.mode === 'melody');
it('covers the full melody corpus, including sharp and flat keys', () => {
  expect(items.length).toBeGreaterThan(0);
  const roots = items.map((ex) => ex.config.type === 'ear_training' ? ex.config.root : '');
  expect(roots).toContain('G');
  expect(roots).toContain('F');
});
for (const ex of items) {
  it(`${ex.id}: every option staff receives the configured key`, async () => {
    if (ex.config.type !== 'ear_training') throw new Error('ear item expected');
    const signature = `${ex.config.root ?? 'C'}${ex.config.rootAccidental ?? ''}`;
    const options = choicesForExercise(ex, (k) => k);
    render(<ChoiceInput options={options} selected={null} tried={[]} final={false} onSelect={() => {}} />);
    const staves = await screen.findAllByTestId('melody-signature');
    expect(staves).toHaveLength(options.length);
    staves.forEach((staff) => expect(staff.dataset.signature).toBe(signature));
  });
}
it('signature supplies F sharp / B flat and naturals cancel it only when needed', () => {
  expect(vexAccidentals([{ natural: 'F', accidental: '#', octave: 4 }, { natural: 'F', accidental: '', octave: 4 }], 'G')).toEqual([null, 'n']);
  expect(vexAccidentals([{ natural: 'B', accidental: 'b', octave: 4 }, { natural: 'B', accidental: '', octave: 4 }], 'F')).toEqual([null, 'n']);
});
