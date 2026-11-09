import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import type { PitchedNote } from '../../../../core/types/music';
import { InlineTryThis } from '../InlineTryThis';
import { L1_UNITS } from '../../../../core/constants/curriculumL1';

// Record what each staff is asked to draw (the real one needs VexFlow / layout).
vi.mock('../../../notation/StaffNotation', () => ({
  StaffNotation: ({ notes, clef }: { notes: PitchedNote[]; clef?: string }) => (
    <div data-testid="staff" data-clef={clef ?? 'treble'}>
      {notes.map((n) => `${n.natural}${n.accidental ?? ''}${n.octave}`).join(' ')}
    </div>
  ),
}));

afterEach(cleanup);

describe('L1 "The Staff and Clefs": the clefs Try This (brief 2026-11-09)', () => {
  it('the two Try This boxes no longer show the same thing', () => {
    const module = L1_UNITS.flatMap((u) => u.modules).find((m) => m.id === 'l1u1m1')!;
    const [staff, clefs] = module.concepts;
    expect(staff.clefs).toBeUndefined();
    expect(clefs.clefs).toBe(true);
    expect(clefs.tryThisLabel).not.toBe(staff.tryThisLabel);
  });

  it('draws C to C on a treble staff and, an octave lower, on a bass staff — meeting at middle C', async () => {
    render(<InlineTryThis query="key of C" label="C to C in treble clef and in bass clef" accent="#3b82f6" clefs />);
    const staves = await screen.findAllByTestId('staff');
    expect(staves.map((s) => s.getAttribute('data-clef'))).toEqual(['treble', 'bass']);
    expect(staves[0].textContent).toBe('C4 D4 E4 F4 G4 A4 B4 C5');
    expect(staves[1].textContent).toBe('C3 D3 E3 F3 G3 A3 B3 C4');
    expect(screen.getByText('Treble clef')).toBeDefined();
    expect(screen.getByText('Bass clef')).toBeDefined();
  });

  it('without clefs, one treble staff as before', async () => {
    render(<InlineTryThis query="C major scale" label="See notes arranged by pitch" accent="#3b82f6" />);
    const staves = await screen.findAllByTestId('staff');
    expect(staves).toHaveLength(1);
    expect(screen.queryByText('Bass clef')).toBeNull();
  });
});
