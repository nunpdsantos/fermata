/**
 * Audit of 18 November 2026, findings A22, A27 and A29: what three lesson
 * demonstrations really PLAY. The lesson is rendered through ModuleView, as
 * the learner meets it, with real core audio; only Web Audio is mocked, and a
 * fake instrument voice records every MIDI note and when it starts (the
 * earReference method). Oracle pitches come from letters and octaves here,
 * never from the app.
 *
 *  - A22 (l9u30m4, "Descending Large Intervals"): the Try This promises C major
 *    descending, so it must start on the upper C and end on the lower C, and
 *    its staff must be written in the same order.
 *  - A27 (l4u12m5, "Third Inversion (V4/2)"): the bass must be heard falling
 *    from F to E, so G7/F must be followed by C/E, both chords shown.
 *  - A29 (l7u21m5): the task promises the bass F–F♯–G under F7 → F♯dim7 →
 *    C7; a plain C7 has C in the bass. The task now names C7/G; its three
 *    links, tapped one after another, are a look at each chord (F4, F♯4, G4
 *    since the second audit, QA P7: C7/G is drawn and played as C7's second
 *    inversion from G4, as the lesson's instrument shows it, where it was G3
 *    under a root-position C7 with G doubled), and it sends the learner to
 *    the jazz-blues Try This, which plays the three in a row over F3, F♯3, G3.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, act, within } from '@testing-library/react';
import type { PitchedNote } from '../../../core/types/music';

vi.mock('../../notation/StaffNotation', () => ({
  StaffNotation: ({ notes }: { notes: PitchedNote[] }) => (
    <div data-testid="staff" data-notes={notes.map((n) => `${n.natural}${n.accidental}${n.octave}`).join(' ')} />
  ),
}));

import { ModuleView } from '../ModuleView';
import { setInstrumentVoice } from '../../../core/services/audio';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import { useAppStore } from '../../../state/store';
import { L4_UNITS } from '../../../core/constants/curriculumL4';
import { L7_UNITS } from '../../../core/constants/curriculumL7';
import { L9_UNITS } from '../../../core/constants/curriculumL9';
import type { CurriculumLevel, CurriculumModule, CurriculumUnit } from '../../../core/types/curriculum';

const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** Written pitch → MIDI (C4 = 60), from the letter, accidental and octave. */
function midi(text: string): number {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(text)!;
  return 12 * (Number(m[3]) + 1) + LETTER_PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0);
}
const pcOf = (letter: string) => midi(`${letter}4`) % 12;

interface Heard { midi: number; at: number }
let heard: Heard[] = [];
const voice = {
  playNote: (m: number, when: number) => {
    heard.push({ midi: m, at: Math.round(when * 1000) });
    return true;
  },
  startNote: () => true,
  stopNote: () => {},
  setVolume: () => {},
  resume: () => Promise.resolve(),
  cancelScheduled: () => {},
};

(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };

beforeEach(() => {
  installMockAudioContext(1);
  heard = [];
  setInstrumentVoice(voice);
  useAppStore.setState({ language: 'en', instrument: 'piano', selectedKey: { natural: 'C', accidental: '' } });
});
afterEach(() => {
  cleanup();
  setInstrumentVoice(null);
  vi.unstubAllGlobals();
});

function find(units: CurriculumUnit[], id: string): { module: CurriculumModule; unit: CurriculumUnit } {
  for (const unit of units) {
    const module = unit.modules.find((m) => m.id === id);
    if (module) return { module, unit };
  }
  throw new Error(`no module ${id}`);
}

function renderLesson(units: CurriculumUnit[], id: string) {
  const { module, unit } = find(units, id);
  const level = { id: module.levelId, number: Number(module.levelId.slice(1)), title: 'L', description: '', accentColor: '#8b5cf6', units: [unit] } as unknown as CurriculumLevel;
  return render(
    <ModuleView
      module={module}
      unit={unit}
      level={level}
      unitIndex={0}
      moduleIndex={unit.modules.indexOf(module)}
      isModuleCompleted={false}
      isTaskCompleted={() => false}
      completedTaskCount={0}
      exercises={[]}
      exercisesState="ready"
      exercisesPassed={false}
      levelCompletedModuleCount={0}
      onToggleTask={() => {}}
      onCompleteModule={() => {}}
      onRecordExerciseResult={() => {}}
      onExercisesComplete={() => {}}
      onBack={() => {}}
      onBackToLevels={() => {}}
      onNavigateModule={() => {}}
    />,
  );
}

/** Press "Hear it" in one Try This panel and return what sounded, in order of onset (chords grouped). */
async function hear(panel: HTMLElement): Promise<number[][]> {
  heard = [];
  await act(async () => {
    fireEvent.click(within(panel).getByRole('button', { name: 'Hear it' }));
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
  });
  const sorted = [...heard].sort((a, b) => a.at - b.at || a.midi - b.midi);
  const out: { at: number; midis: number[] }[] = [];
  for (const n of sorted) {
    const last = out[out.length - 1];
    if (last && last.at === n.at) last.midis.push(n.midi);
    else out.push({ at: n.at, midis: [n.midi] });
  }
  return out.map((o) => o.midis);
}

/** The concept's own Try This panel (the n-th concept of the lesson). */
function conceptPanel(n: number): HTMLElement {
  const panels = screen.getAllByTestId('inline-try-this');
  return panels[n];
}

describe('A22 — "Descending Large Intervals": C major from the upper C down to the lower C', () => {
  it('plays C5 B4 A4 G4 F4 E4 D4 C4, one note at a time, and writes them in that order', async () => {
    renderLesson(L9_UNITS, 'l9u30m4');
    const panel = conceptPanel(1);
    expect(within(panel).getByText(/descending/i)).toBeTruthy();
    const played = await hear(panel);
    const down = ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'];
    expect(played).toEqual(down.map((p) => [midi(p)]));
    const staff = await within(panel).findByTestId('staff');
    expect(staff.getAttribute('data-notes')).toBe(down.join(' '));
  });

  it('the other concepts of the lesson are unchanged: Cmaj7 and Cm7 still sound as chords', async () => {
    renderLesson(L9_UNITS, 'l9u30m4');
    expect((await hear(conceptPanel(0))).length).toBe(1);
    expect((await hear(conceptPanel(2))).length).toBe(1);
  });
});

describe('A27 — V4/2: the bass falls from F to E, G7/F → C/E', () => {
  it('plays G7/F then C/E; each chord\'s lowest note is its bass, F then E a half step lower', async () => {
    renderLesson(L4_UNITS, 'l4u12m5');
    const panel = conceptPanel(2);
    const played = await hear(panel);
    expect(played).toHaveLength(2);
    const [first, second] = played;
    const lowest = (ms: number[]) => Math.min(...ms);
    expect(lowest(first) % 12).toBe(pcOf('F'));
    expect(lowest(second) % 12).toBe(pcOf('E'));
    expect(lowest(first) - lowest(second)).toBe(1);
    // G7/F sounds G, B, D, F; C/E sounds C, E, G.
    expect([...new Set(first.map((m) => m % 12))].sort((a, b) => a - b)).toEqual([2, 5, 7, 11]);
    expect([...new Set(second.map((m) => m % 12))].sort((a, b) => a - b)).toEqual([0, 4, 7]);
  });

  it('shows both chords, each one tappable on the instrument', () => {
    renderLesson(L4_UNITS, 'l4u12m5');
    const panel = conceptPanel(2);
    expect(within(panel).getByRole('button', { name: 'G7/F: hear it and show it on the piano' })).toBeTruthy();
    expect(within(panel).getByRole('button', { name: 'C/E: hear it and show it on the piano' })).toBeTruthy();
  });
});

describe('A29 — jazz blues: F7 → F♯dim7 → C7/G over the bass F–F♯–G', () => {
  // Real pitches, never pitch classes: an octave is what tells a climb from a fall.
  it('the task\'s three links are a look at each chord: tapped one after another their lowest notes are F4, F♯4, G4, each chord as the instrument shows it, and the task sends the learner to the Try This to hear the three in a row', async () => {
    renderLesson(L7_UNITS, 'l7u21m5');
    // The task's own row: its tick box is named by the instruction.
    const toggle = screen.getByRole('button', { name: /jazz blues passing chord/i });
    const task = toggle.parentElement!.parentElement!;
    const lowest: number[] = [];
    for (const chord of ['F7', 'F#dim7', 'C7/G']) {
      const button = within(task).getByRole('button', { name: `‘${chord}’` });
      await act(async () => { fireEvent.click(button); });
      const panel = within(task).getByTestId('inline-try-this');
      expect(within(panel).getByText(`‘${chord}’`), chord).toBeTruthy();
      const played = await hear(panel);
      expect(played, chord).toHaveLength(1);
      lowest.push(Math.min(...played[0]));
    }
    // Each chord in the app's own single-chord voicing; C7/G as its second inversion, from G4.
    expect(lowest).toEqual([midi('F4'), midi('F#4'), midi('G4')]);
    // So the task promises the ascent only where it is heard: under Jazz Blues, Hear it.
    expect(toggle.getAttribute('aria-label')).toMatch(/to see each chord, then, under Jazz Blues above, press Hear it to hear the three in a row/);
    expect(screen.getByRole('heading', { name: 'Jazz Blues' })).toBeTruthy();
  });

  it('the jazz-blues Try This the task points to plays the three in a row, the lowest notes rising F3, F♯3, G3', async () => {
    renderLesson(L7_UNITS, 'l7u21m5');
    const played = await hear(conceptPanel(1));
    expect(played.map((ms) => Math.min(...ms))).toEqual([midi('F3'), midi('F#3'), midi('G3')]);
  });
});
