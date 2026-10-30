/**
 * Review (W3-12 follow-up) — Learn exercise staves are AUTHORED notation:
 * their configs and prompts describe written positions ("sits on the first
 * line of the treble staff", "second ledger line below"). They must draw
 * exactly the authored notes in the authored clef on every instrument; the
 * guitar's treble-8vb treatment belongs only to staves that show what the
 * instrument plays (Explore).
 *
 * Every note_id and interval_id exercise (authored + generated, all levels)
 * is rendered through the real ExercisePrompt with the guitar and with the
 * piano; the staff props it passes, and the VexFlow keys and clef those props
 * produce (staffPlan, the hook's own planner), must be identical.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import type { PitchedNote } from '../../../../core/types/music';
import { generateAllForLevel, mergeExerciseMaps } from '../../../../data/exercises/exerciseGenerator';
import { useAppStore } from '../../../../state/store';
import { staffPlan } from '../../../../utils/notationHelpers';

vi.mock('../../../notation/StaffNotation', () => ({
  StaffNotation: (p: { notes: PitchedNote[]; clef?: 'treble' | 'bass'; followInstrument?: boolean }) => (
    <div data-testid="staff" data-props={JSON.stringify({ notes: p.notes, clef: p.clef ?? null, followInstrument: p.followInstrument ?? false })} />
  ),
}));

import { ExercisePrompt } from '../ExercisePrompt';

afterEach(() => {
  cleanup();
  useAppStore.setState({ instrument: 'piano' });
});

async function staffExercises(): Promise<ExerciseDefinition[]> {
  const out: ExerciseDefinition[] = [];
  for (let l = 1; l <= 9; l++) {
    const authored = (await import(`../../../../data/exercises/exercisesL${l}.ts`)).default as Record<string, ExerciseDefinition[]>;
    const templates = (await import(`../../../../data/exercises/templatesL${l}.ts`)).default;
    const merged = mergeExerciseMaps(authored, generateAllForLevel(templates));
    for (const list of Object.values(merged)) {
      for (const e of list) if (e.config.type === 'note_id' || e.config.type === 'interval_id') out.push(e);
    }
  }
  return out;
}

async function propsFor(ex: ExerciseDefinition, instrument: 'piano' | 'guitar') {
  useAppStore.setState({ instrument });
  render(<ExercisePrompt exercise={ex} />);
  const props = JSON.parse((await screen.findByTestId('staff')).getAttribute('data-props')!) as {
    notes: PitchedNote[]; clef: 'treble' | 'bass' | null; followInstrument: boolean;
  };
  cleanup();
  return props;
}

describe('Learn staves never follow the instrument', () => {
  it('every note_id / interval_id exercise draws the same keys and clef on piano and guitar', async () => {
    const exercises = await staffExercises();
    expect(exercises.length).toBeGreaterThan(60);
    const ledger = exercises.filter((e) => e.config.type === 'note_id' && (e.config.octave <= 3 || e.config.octave >= 6));
    expect(ledger.length, 'ledger-line exercises are included').toBeGreaterThan(0);
    const bad: string[] = [];
    for (const ex of exercises) {
      const piano = await propsFor(ex, 'piano');
      const guitar = await propsFor(ex, 'guitar');
      if (JSON.stringify(piano) !== JSON.stringify(guitar)) bad.push(`${ex.id}: props differ`);
      if (guitar.followInstrument) bad.push(`${ex.id}: follows the instrument`);
      const p = staffPlan(piano.notes, piano.clef ?? undefined, 'piano', piano.followInstrument);
      const g = staffPlan(guitar.notes, guitar.clef ?? undefined, 'guitar', guitar.followInstrument);
      if (p.keys.join() !== g.keys.join() || p.clef !== g.clef || p.annotation !== g.annotation) {
        bad.push(`${ex.id}: piano ${p.clef} [${p.keys.join(' ')}] vs guitar ${g.clef}${g.annotation ? '-' + g.annotation : ''} [${g.keys.join(' ')}]`);
      }
    }
    expect(bad).toEqual([]);
  }, 120_000);

  it('the first-line E4 is e/4 in the treble clef on both instruments', () => {
    const e4: PitchedNote = { natural: 'E', accidental: '', octave: 4 };
    expect(staffPlan([e4], 'treble', 'guitar')).toMatchObject({ clef: 'treble', annotation: undefined, keys: ['e/4'] });
    expect(staffPlan([e4], 'treble', 'piano')).toMatchObject({ clef: 'treble', annotation: undefined, keys: ['e/4'] });
  });

  it('a staff that follows the instrument (Explore) still writes the guitar an octave up', () => {
    const c4: PitchedNote = { natural: 'C', accidental: '', octave: 4 };
    expect(staffPlan([c4], 'treble', 'guitar', true)).toMatchObject({ clef: 'treble', annotation: '8vb', keys: ['c/5'] });
    expect(staffPlan([c4], 'treble', 'piano', true)).toMatchObject({ clef: 'treble', keys: ['c/4'] });
  });
});
