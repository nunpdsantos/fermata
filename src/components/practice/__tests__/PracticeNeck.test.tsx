import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { PracticeNeck } from '../PracticeNeck';
import { rightHandPractice, scalePractice } from '../practiceModel';
import { GUITAR_TUNINGS } from '../../../core/constants/guitarTunings';

const root = { natural: 'C', accidental: '' } as const;
afterEach(cleanup);
describe('practice passage visibility', () => {
  it.each(['scales', 'right hand'])('%s shows upcoming fret 1 in the passage, with the nut beside fret 1', (tab) => {
    const tuning = GUITAR_TUNINGS[0];
    const route = tab === 'scales' ? scalePractice(root, 'major', tuning, 2, 'im')! : rightHandPractice(root, 'major', tuning, 'p-i-m-a')!;
    expect(route).not.toBeNull();
    const index = Math.max(0, route.events.findIndex((e) => e.notes.some((n) => n.fret === 1)) - 4);
    const { container } = render(<PracticeNeck route={route} index={index} tuning={tuning} fingerFor={(_, n) => n.finger}
      edited={() => false} onNote={() => {}} />);
    const passage = route.events.slice(Math.max(0, index - 3), index + 5).flatMap((e) => e.notes);
    expect(passage.some((n) => n.fret === 1)).toBe(true);
    for (const note of passage) {
      expect(container.querySelector(`[data-dot-string="${note.stringIndex}"][data-dot-fret="${note.fret}"]`), `string ${note.stringIndex}, fret ${note.fret}`).not.toBeNull();
    }
    const row = [...container.querySelectorAll('[data-string-row="0"]')];
    expect(row.at(-1)?.getAttribute('data-fret')).toBe('1');
  });
});
