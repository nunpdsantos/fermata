/**
 * Second audit of 18 November 2026, findings M50–M56 and QA P7, and the chord
 * list round one left crossing B–C: what each lesson demonstration PLAYS and
 * what its staff DRAWS, against the lesson's own sentence.
 *
 * The lesson is rendered through ModuleView as the learner meets it, with real
 * core audio (only Web Audio is mocked; a fake instrument voice records every
 * MIDI note, its start and its length — the method of round one's
 * auditDemonstrations.test.tsx) and the real VexFlow drawing in jsdom, read
 * back from its glyphs by `src/test/staffReader.ts` (staff lines, clef, key
 * signature, noteheads, accidentals, rests, ties): what a reader of the staff
 * would see, never the data the drawing was handed. Oracle pitches are
 * written here as letters and octaves.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, within, waitFor } from '@testing-library/react';
import { ModuleView } from '../ModuleView';
import { setInstrumentVoice } from '../../../core/services/audio';
import { installMockAudioContext } from '../../../test/mockAudioContext';
import { useAppStore } from '../../../state/store';
import { L1_UNITS } from '../../../core/constants/curriculumL1';
import { L2_UNITS } from '../../../core/constants/curriculumL2';
import { L3_UNITS } from '../../../core/constants/curriculumL3';
import { L4_UNITS } from '../../../core/constants/curriculumL4';
import { L7_UNITS } from '../../../core/constants/curriculumL7';
import { L9_UNITS } from '../../../core/constants/curriculumL9';
import type { CurriculumLevel, CurriculumModule, CurriculumUnit } from '../../../core/types/curriculum';
import { readStaffSvg, drawnSounds, midiOf, type DrawnScore } from '../../../test/staffReader';

const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const pc = (m: number) => ((m % 12) + 12) % 12;
const name = (m: number) => `${NAMES[pc(m)]}${Math.floor(m / 12) - 1}`;
const m = midiOf;

interface Heard { midi: number; at: number; dur: number }
let heard: Heard[] = [];
/** The loudness core audio hands the voice with each note, in the order handed. */
let velocities: number[] = [];
const voice = {
  playNote: (midi: number, when: number, duration: number, velocity?: number) => {
    heard.push({ midi, at: Math.round(when * 1000) / 1000, dur: Math.round(duration * 1000) / 1000 });
    velocities.push(velocity ?? NaN);
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
  // jsdom lays nothing out: give every box a phone-wide width so the staff draws.
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 360, height: 100, top: 0, left: 0, right: 360, bottom: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
});
afterEach(() => {
  cleanup();
  setInstrumentVoice(null);
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function find(units: CurriculumUnit[], id: string): { module: CurriculumModule; unit: CurriculumUnit } {
  for (const unit of units) {
    const module = unit.modules.find((x) => x.id === id);
    if (module) return { module, unit };
  }
  throw new Error(`no module ${id}`);
}

function renderLesson(units: CurriculumUnit[], id: string) {
  const { module, unit } = find(units, id);
  const level = { id: module.levelId, number: Number(module.levelId.slice(1)), title: 'L', description: '', accentColor: '#8b5cf6', units: [unit] } as unknown as CurriculumLevel;
  render(
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
  return module;
}

/** The concept's own Try This panel (the n-th concept of the lesson). */
const conceptPanel = (n: number) => screen.getAllByTestId('inline-try-this')[n];

/** Press "Hear it" in one panel: every note the voice was handed, by onset then pitch. */
async function hear(panel: HTMLElement): Promise<Heard[]> {
  heard = [];
  await act(async () => {
    fireEvent.click(within(panel).getByRole('button', { name: 'Hear it' }));
    await Promise.resolve();
    await new Promise((r) => setTimeout(r, 0));
  });
  return [...heard].sort((a, b) => a.at - b.at || a.midi - b.midi);
}

/** Notes grouped by onset: each group sounds together. */
function onsets(notes: Heard[]): Heard[][] {
  const out: Heard[][] = [];
  for (const n of notes) {
    const last = out[out.length - 1];
    if (last && Math.abs(last[0].at - n.at) < 0.002) last.push(n);
    else out.push([n]);
  }
  return out;
}
const names = (g: Heard[]) => g.map((n) => name(n.midi));

/** What the panel's staff draws, read from its glyphs. */
async function drawn(panel: HTMLElement): Promise<DrawnScore> {
  const svg = await waitFor(() => {
    // The staff's own drawing (the buttons carry small icons of their own).
    const s = panel.querySelector('g.vf-stavenote')?.closest('svg');
    if (!s) throw new Error('no staff drawn yet');
    return s;
  }, { timeout: 4000 });
  return readStaffSvg(svg);
}

/**
 * The drawing and the sound agree: the same pitches start at the same moments
 * (onsets in beats × one tempo), and each lasts as long as its written value
 * (sounded for 75–100 % of it, the gap that keeps repeated notes apart).
 */
function expectDrawnAsPlayed(score: DrawnScore, played: Heard[]) {
  const written = drawnSounds(score);
  expect(written.map((w) => m(w.pitch)), 'the same pitches, in the same order').toEqual(played.map((p) => p.midi));
  const k = written.reduce((acc, w, i) => (acc || w.at === 0 ? acc : played[i].at / w.at), 0);
  written.forEach((w, i) => {
    if (k) expect(played[i].at, `onset of ${w.pitch}`).toBeCloseTo(w.at * k, 2);
    if (k) {
      const ratio = played[i].dur / (w.beats * k);
      expect(ratio, `length of ${w.pitch}`).toBeGreaterThanOrEqual(0.75);
      expect(ratio, `length of ${w.pitch}`).toBeLessThanOrEqual(1.0001);
    }
  });
}

/** Is a note sounding at time t? */
const soundingAt = (n: Heard, t: number) => n.at <= t + 1e-6 && t < n.at + n.dur - 1e-6;

// ─────────────────────────────────────────────────────────────────────────────

describe('M50 — "What Is a Key Signature?": the signs after the clef, not beside the notes', () => {
  const cases = [
    { concept: 0, word: /one sharp/, signature: [{ sign: '#', letter: 'F' }], scale: ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5'] },
    { concept: 1, word: /two sharps/, signature: [{ sign: '#', letter: 'F' }, { sign: '#', letter: 'C' }], scale: ['D4', 'E4', 'F#4', 'G4', 'A4', 'B4', 'C#5', 'D5'] },
    { concept: 2, word: /one flat/, signature: [{ sign: 'b', letter: 'B' }], scale: ['F4', 'G4', 'A4', 'Bb4', 'C5', 'D5', 'E5', 'F5'] },
  ] as const;

  it.each(cases)('concept $concept: the key signature the label names stands after the clef, and the scale needs no sign of its own', async ({ concept, word, signature, scale }) => {
    renderLesson(L1_UNITS, 'l1u3m2');
    const panel = conceptPanel(concept);
    expect(within(panel).getByText(word)).toBeTruthy();
    const score = await drawn(panel);
    expect(score.staves.map((s) => s.signature)).toEqual([signature]);
    expect(score.notes.flatMap((n) => n.printed), 'no sharp or flat drawn beside a note').toEqual([]);
    expect(score.notes.map((n) => n.pitches[0])).toEqual(scale);
    const played = await hear(panel);
    expect(played.map((p) => name(p.midi))).toEqual(scale.map((s) => name(m(s))));
    expectDrawnAsPlayed(score, played);
  });

  it.each([
    ['l1u3m2t1', 'key of G', [{ sign: '#', letter: 'F' }]],
    ['l1u3m2t2', 'key of D', [{ sign: '#', letter: 'F' }, { sign: '#', letter: 'C' }]],
    ['l1u3m2t3', 'key of F', [{ sign: 'b', letter: 'B' }]],
  ] as const)('task %s asks what the key signature shows: its ‘%s’ draws it', async (_id, query, signature) => {
    renderLesson(L1_UNITS, 'l1u3m2');
    const before = screen.getAllByTestId('inline-try-this').length;
    const chip = screen.getAllByRole('button', { name: `‘${query}’` }).find((b) => !b.closest('[data-testid="inline-try-this"]'))!;
    await act(async () => { fireEvent.click(chip); });
    const panels = screen.getAllByTestId('inline-try-this');
    expect(panels.length).toBe(before + 1);
    const panel = panels.find((p) => within(p).queryByText(`‘${query}’`))!;
    const score = await drawn(panel);
    expect(score.staves.map((s) => s.signature)).toEqual([signature]);
    expect(score.notes.flatMap((n) => n.printed)).toEqual([]);
  });
});

describe('M51 — "Quartal Voicings": D–G–C–F, a perfect fourth (five half steps) between neighbours', () => {
  it('plays and draws D4 G4 C5 F5, one at a time and then together, never a stack of thirds', async () => {
    renderLesson(L7_UNITS, 'l7u22m5');
    const panel = conceptPanel(0);
    const played = await hear(panel);
    const groups = onsets(played);
    expect(groups.map(names)).toEqual([['D4'], ['G4'], ['C5'], ['F5'], ['D4', 'G4', 'C5', 'F5']]);
    const together = groups[groups.length - 1].map((n) => n.midi);
    expect(together.slice(1).map((x, i) => x - together[i])).toEqual([5, 5, 5]);
    expectDrawnAsPlayed(await drawn(panel), played);
    // The sentence names what is heard.
    expect(within(panel).getByText(/D–G–C–F/).textContent).toMatch(/fourths/);
  });
});

describe('M52 — "Pedal Points and Drones": D natural minor over a D that keeps sounding', () => {
  it('a low D sounds under every note of the scale, F and B♭ included', async () => {
    renderLesson(L7_UNITS, 'l7u22m5');
    const panel = conceptPanel(2);
    const played = await hear(panel);
    const pedal = played.filter((n) => n.midi < m('D4'));
    const scale = played.filter((n) => n.midi >= m('D4'));
    expect(scale.map((n) => name(n.midi))).toEqual(['D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5', 'D5']);
    expect(pedal.length).toBeGreaterThan(0);
    expect(pedal.every((n) => pc(n.midi) === pc(m('D3')))).toBe(true);
    for (const note of scale) {
      expect(pedal.some((d) => soundingAt(d, note.at)), `a D sounds as ${name(note.midi)} starts`).toBe(true);
    }
    const score = await drawn(panel);
    expect(score.staves.map((s) => s.clef)).toEqual(['treble', 'bass']);
    expectDrawnAsPlayed(score, played);
    expect(within(panel).getByText(/D pedal/)).toBeTruthy();
  });
});

describe('M53 — "Shell Voicings": D, F and C, without the 5th it tells the learner to leave out', () => {
  it('the shell sounds D, F and C only, then the full Dm7 adds A back, so the two can be compared', async () => {
    renderLesson(L7_UNITS, 'l7u21m2');
    const panel = conceptPanel(0);
    const played = await hear(panel);
    const groups = onsets(played);
    expect(groups.map((g) => [...new Set(g.map((n) => NAMES[pc(n.midi)]))].sort())).toEqual([['C', 'D', 'F'], ['A', 'C', 'D', 'F']]);
    expectDrawnAsPlayed(await drawn(panel), played);
    expect(within(panel).getByText(/D, F and C/)).toBeTruthy();
  });
});

describe('M54 — "The 2-3 Bass Suspension": E held while the bass falls from D to C', () => {
  it('two bass attacks on the bass staff, D3 then C3, under one E4 that sounds through both: a 9th then a 10th, called 2-3 (as Hutchinson §10.9 writes it)', async () => {
    renderLesson(L4_UNITS, 'l4u12m1');
    const panel = conceptPanel(2);
    const played = await hear(panel);
    const e = played.filter((n) => pc(n.midi) === pc(m('E4')));
    const bass = played.filter((n) => pc(n.midi) !== pc(m('E4')));
    expect(e).toHaveLength(1);
    expect(bass.map((n) => name(n.midi))).toEqual(['D3', 'C3']);
    expect(soundingAt(e[0], bass[0].at) && soundingAt(e[0], bass[1].at), 'E sounds over both bass notes').toBe(true);
    // A compound 2nd, then a compound 3rd: 9th and 10th.
    expect([e[0].midi - bass[0].midi, e[0].midi - bass[1].midi]).toEqual([14, 16]);
    const score = await drawn(panel);
    expect(score.staves.map((st) => st.clef)).toEqual(['treble', 'bass']);
    expectDrawnAsPlayed(score, played);
    expect(within(panel).getByText(/E held/).textContent).toMatch(/2nd to a 3rd \(here a 9th to a 10th: it is still called 2-3\)/);
  });
});

describe('M55 — "Extended Chords": the full stack of thirds, then Cmaj13 without the 11th it says it leaves out', () => {
  it('plays C E G B D F A one at a time, then the chord without F, and the label names F as the note left out', async () => {
    renderLesson(L7_UNITS, 'l7u23m5');
    const panel = conceptPanel(0);
    const played = await hear(panel);
    const groups = onsets(played);
    expect(groups.slice(0, -1).map(names)).toEqual([['C4'], ['E4'], ['G4'], ['B4'], ['D5'], ['F5'], ['A5']]);
    expect(names(groups[groups.length - 1])).toEqual(['C4', 'E4', 'G4', 'B4', 'D5', 'A5']);
    expectDrawnAsPlayed(await drawn(panel), played);
    expect(within(panel).getByText(/without the 11th \(F\)/)).toBeTruthy();
  });
});

describe('M56 — "Song Associations: Small Intervals": each interval heard from the root', () => {
  it('every interval the concept teaches, minor 2nd to perfect 5th, in its order, each pair from C with a silence between, as the label lists them', async () => {
    renderLesson(L9_UNITS, 'l9u30m3');
    const panel = conceptPanel(0);
    const played = await hear(panel);
    expect(played.map((n) => name(n.midi))).toEqual(['C4', 'C#4', 'C4', 'D4', 'C4', 'Eb4', 'C4', 'E4', 'C4', 'F4', 'C4', 'F#4', 'C4', 'G4']);
    // m2, M2, m3, M3, P4, tritone, P5: the order of the concept's song list.
    const sizes = played.reduce<number[]>((out, n, i) => (i % 2 ? [...out, n.midi - played[i - 1].midi] : out), []);
    expect(sizes).toEqual([1, 2, 3, 4, 5, 6, 7]);
    for (let i = 2; i < played.length; i += 2) {
      expect(played[i].at - (played[i - 1].at + played[i - 1].dur), 'a silence before the next pair').toBeGreaterThan(0.2);
    }
    expectDrawnAsPlayed(await drawn(panel), played);
    expect(within(panel).getByText(/minor 2nd to perfect 5th: C–Db, C–D, C–Eb, C–E, C–F, C–Gb and C–G/)).toBeTruthy();
  });
});

describe('QA P7 — "V7 Inversions": a slash chord drawn and played as its inversion, nothing doubled', () => {
  const inversion = async (panel: HTMLElement, bass: string) => {
    const played = await hear(panel);
    expect(onsets(played)).toHaveLength(1);
    const pcs = played.map((n) => pc(n.midi));
    expect(new Set(pcs).size, `no note of ${pcs.map((p) => NAMES[p])} doubled`).toBe(pcs.length);
    expect(name(Math.min(...played.map((n) => n.midi))).replace(/\d/, '')).toBe(bass);
    const score = await drawn(panel);
    const written = score.notes.flatMap((n) => n.pitches);
    expect(written.map((p) => m(p)).sort((a, b) => a - b)).toEqual(played.map((n) => n.midi));
    // Within two ledger lines of the treble staff (A3 … C6): not three below it.
    expect(written.every((p) => m(p) >= m('A3') && m(p) <= m('C6')), written.join(' ')).toBe(true);
  };

  it('task 2’s ‘G7/B’ (V6/5): B, D, F, G with the leading note B once, in the bass', async () => {
    renderLesson(L4_UNITS, 'l4u12m5');
    const chip = screen.getAllByRole('button', { name: '‘G7/B’' }).find((b) => !b.closest('[data-testid="inline-try-this"]'))!;
    await act(async () => { fireEvent.click(chip); });
    const panel = screen.getAllByTestId('inline-try-this').find((p) => within(p).queryByText('‘G7/B’'))!;
    await inversion(panel, 'B');
  });

  it('concept 2’s G7/D (V4/3): D in the bass, once', async () => {
    renderLesson(L4_UNITS, 'l4u12m5');
    await inversion(conceptPanel(1), 'D');
  });

  it('concept 3’s G7/F → C/E: the bass falls F → E and neither chord doubles its bass (the 7th F, the 3rd E)', async () => {
    renderLesson(L4_UNITS, 'l4u12m5');
    const groups = onsets(await hear(conceptPanel(2)));
    expect(groups).toHaveLength(2);
    for (const g of groups) {
      const pcs = g.map((n) => pc(n.midi));
      expect(new Set(pcs).size, names(g).join(' ')).toBe(pcs.length);
    }
    expect(groups.map((g) => name(Math.min(...g.map((n) => n.midi))))).toEqual(['F3', 'E3']);
  });
});

describe('Round one’s carried chord list — l1u35m3 "The Whole Family": the chords of G in order, the bass climbing by step', () => {
  it('G, Am, Bm, C, D, Em stand on G3 A3 B3 C4 D4 E4: Bm → C is a step up, not a 7th down', async () => {
    renderLesson(L1_UNITS, 'l1u35m3');
    const panel = conceptPanel(2);
    const groups = onsets(await hear(panel));
    expect(groups.map((g) => name(Math.min(...g.map((n) => n.midi))))).toEqual(['G3', 'A3', 'B3', 'C4', 'D4', 'E4']);
  });

  it('each chord button sounds the chord as the list does (C on C4 after Bm)', async () => {
    renderLesson(L1_UNITS, 'l1u35m3');
    const panel = conceptPanel(2);
    const list = onsets(await hear(panel));
    heard = [];
    await act(async () => {
      fireEvent.click(within(panel).getByRole('button', { name: 'C: hear it and show it on the piano' }));
      await new Promise((r) => setTimeout(r, 0));
    });
    expect([...heard].map((n) => n.midi).sort((a, b) => a - b)).toEqual(list[3].map((n) => n.midi));
  });
});

describe('"Show on the piano" and "Open in Explore" only where the query shows the notes the demonstration plays (fix pass, item 8)', () => {
  it.each([
    ['l1u3m2', 0, L1_UNITS, true, 'key of G: G major, the notes heard'],
    ['l2u4m1', 2, L2_UNITS, true, 'Db major scale: its own notes'],
    ['l4u14m4', 0, L4_UNITS, true, 'key of C: the seven chords use its seven notes'],
    ['l7u22m5', 2, L7_UNITS, true, 'D natural minor over D: the scale’s own notes'],
    ['l7u21m2', 0, L7_UNITS, true, 'the shell and the full Dm7: Dm7’s notes'],
    ['l7u22m5', 0, L7_UNITS, false, 'D–G–C–F: Explore and the instrument would give Dm11 stacked in thirds, the sound M51 was about'],
    ['l4u12m1', 1, L4_UNITS, false, 'two suspensions: a G major chord is not what is heard'],
    ['l4u12m1', 2, L4_UNITS, false, 'E over D → C: a C major chord is not what is heard'],
    ['l7u23m5', 0, L7_UNITS, false, 'the stack with F: Cmaj13 has no F'],
    ['l9u30m3', 0, L9_UNITS, false, 'C–Db … C–G: not the C major scale'],
    ['l9u30m4', 1, L9_UNITS, false, 'the falling large intervals: not the C major scale'],
  ] as const)('%s c%s → %s (%s)', (id, concept, units, shown, _why) => {
    renderLesson(units, id);
    const panel = conceptPanel(concept);
    expect(!!within(panel).queryByRole('button', { name: 'Show on the piano' }), 'Show on the piano').toBe(shown);
    expect(!!within(panel).queryByRole('button', { name: 'Open in Explore' }), 'Open in Explore').toBe(shown);
  });
  it('without a demonstration both stay, as before (l7u22m5 c1, D5)', () => {
    renderLesson(L7_UNITS, 'l7u22m5');
    const panel = conceptPanel(1);
    expect(within(panel).getByRole('button', { name: 'Show on the piano' })).toBeTruthy();
    expect(within(panel).getByRole('button', { name: 'Open in Explore' })).toBeTruthy();
  });
});

describe('notes that sound together share the loudness, as a chord list\'s do', () => {
  it('the quartal chord\'s four notes each sound at the voice\'s volume ÷ 1.6; the single notes before it at the full volume', async () => {
    renderLesson(L7_UNITS, 'l7u22m5');
    velocities = [];
    const played = await hear(conceptPanel(0));
    expect(played).toHaveLength(8);
    const base = velocities[0];
    expect(velocities.slice(0, 4).every((v) => Math.abs(v - base) < 1e-9)).toBe(true);
    expect(velocities.slice(4).every((v) => Math.abs(v - base / 1.6) < 1e-9)).toBe(true);
  });
});

describe('the fix pass: the key signatures\' class (item 6)', () => {
  it.each([
    ['l2u4m1', 0, L2_UNITS, ['F', 'C', 'G', 'D', 'A'], '#', /5 sharps/],
    ['l2u4m1', 1, L2_UNITS, ['F', 'C', 'G'], '#', /3 sharps/],
    ['l2u4m1', 2, L2_UNITS, ['B', 'E', 'A', 'D', 'G'], 'b', /5 flats/],
    ['l3u11m5', 1, L3_UNITS, ['B', 'E', 'A'], 'b', /Eb major/],
    ['l9u32m4', 2, L9_UNITS, ['F'], '#', /G major/],
  ] as const)('%s c%s: the key signature after the clef, in its order; no sign beside a note', async (id, concept, units, letters, sign, label) => {
    renderLesson(units, id);
    const panel = conceptPanel(concept);
    expect(within(panel).getByText(label)).toBeTruthy();
    const score = await drawn(panel);
    expect(score.staves[0].signature).toEqual(letters.map((letter) => ({ sign, letter })));
    expect(score.notes.flatMap((n) => n.printed)).toEqual([]);
    expectDrawnAsPlayed(score, await hear(panel));
  });
  it.each([
    ['l2u4m1t2', 'Ab major scale', ['B', 'E', 'A', 'D'], 'b'],
    ['l2u4m1t3', 'E major scale', ['F', 'C', 'G', 'D'], '#'],
  ] as const)('task %s asks about the signature\'s signs: its ‘%s’ draws them', async (_id, query, letters, sign) => {
    renderLesson(L2_UNITS, 'l2u4m1');
    const chip = screen.getAllByRole('button', { name: `‘${query}’` }).find((b) => !b.closest('[data-testid="inline-try-this"]'))!;
    await act(async () => { fireEvent.click(chip); });
    const panel = screen.getAllByTestId('inline-try-this').find((p) => within(p).queryByText(`‘${query}’`))!;
    const score = await drawn(panel);
    expect(score.staves[0].signature).toEqual(letters.map((letter) => ({ sign, letter })));
    expect(score.notes.flatMap((n) => n.printed)).toEqual([]);
  });
});

describe('the fix pass: what the lessons asked the learner to imagine, heard (item 7)', () => {
  it('l4u12m1 c1: C over G2–D3 falls to B (4-3); B, tied into the next bar over C3–E3, falls to A (7-6)', async () => {
    renderLesson(L4_UNITS, 'l4u12m1');
    const panel = conceptPanel(1);
    const played = await hear(panel);
    const upper = played.filter((n) => n.midi >= m('A4'));
    const bass = played.filter((n) => n.midi < m('A4'));
    expect(upper.map((n) => name(n.midi))).toEqual(['C5', 'B4', 'A4']);
    expect(onsets(bass).map(names)).toEqual([['G2', 'D3'], ['C3', 'E3']]);
    const [c5, b4, a4] = upper;
    const [gChord, cChord] = onsets(bass);
    // The 4-3: C a 4th (11th) above G while G sounds, then B, the 3rd (10th).
    expect(soundingAt(gChord[0], c5.at) && soundingAt(gChord[0], b4.at)).toBe(true);
    expect([(c5.midi - gChord[0].midi) % 12, (b4.midi - gChord[0].midi) % 12]).toEqual([5, 4]);
    // The 7-6: the same B, held (one attack), sounds over the new bass C as a 7th, then A, a 6th.
    expect(soundingAt(b4, cChord[0].at)).toBe(true);
    expect([(b4.midi - cChord[0].midi) % 12, (a4.midi - cChord[0].midi) % 12]).toEqual([11, 9]);
    const score = await drawn(panel);
    expect(score.ties).toBe(1);
    expectDrawnAsPlayed(score, played);
  });

  it('l4u12m1 t1: its ‘C major chord’ plays F over C3–G3 falling to E, as the task now says', async () => {
    renderLesson(L4_UNITS, 'l4u12m1');
    const chip = screen.getAllByRole('button', { name: '‘C major chord’' }).find((b) => !b.closest('[data-testid="inline-try-this"]'))!;
    await act(async () => { fireEvent.click(chip); });
    const panel = screen.getAllByTestId('inline-try-this').find((p) => within(p).queryByText('‘C major chord’'))!;
    const played = await hear(panel);
    expect(onsets(played).map(names)).toEqual([['C3', 'G3', 'F4'], ['E4']]);
    expect(played.filter((n) => n.midi < m('C4')).every((n) => soundingAt(n, played.find((x) => name(x.midi) === 'E4')!.at))).toBe(true);
    expectDrawnAsPlayed(await drawn(panel), played);
  });

  it('l4u14m4 c0: "all chords available for analysis in C" — the seven chords of C, I to vii°', async () => {
    renderLesson(L4_UNITS, 'l4u14m4');
    const panel = conceptPanel(0);
    const played = await hear(panel);
    expect(onsets(played).map((g) => g.map((n) => NAMES[pc(n.midi)]).join(''))).toEqual(['CEG', 'DFA', 'EGB', 'FAC', 'GBD', 'ACE', 'BDF']);
    expectDrawnAsPlayed(await drawn(panel), played);
  });

  it('l7u22m5 t1: its ‘Dm11’ plays Dm11 stacked in thirds, then the same chord\'s D–G–C–F voiced in fourths', async () => {
    renderLesson(L7_UNITS, 'l7u22m5');
    const chip = screen.getAllByRole('button', { name: '‘Dm11’' }).find((b) => !b.closest('[data-testid="inline-try-this"]'))!;
    await act(async () => { fireEvent.click(chip); });
    const panel = screen.getAllByTestId('inline-try-this').find((p) => within(p).queryByText('‘Dm11’'))!;
    const groups = onsets(await hear(panel));
    expect(groups.map(names)).toEqual([['D4', 'F4', 'A4', 'C5', 'E5', 'G5'], ['D4', 'G4', 'C5', 'F5']]);
    const fourths = groups[1].map((n) => n.midi);
    expect(fourths.slice(1).map((x, i) => x - fourths[i])).toEqual([5, 5, 5]);
  });

  it.each([
    ['D dorian', ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5']],
    ['D natural minor scale', ['D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5', 'D5']],
  ] as const)('l7u22m5 t3: its ‘%s’ plays over the D pedal the task names', async (query, scale) => {
    renderLesson(L7_UNITS, 'l7u22m5');
    const chip = screen.getAllByRole('button', { name: `‘${query}’` }).find((b) => !b.closest('[data-testid="inline-try-this"]'))!;
    await act(async () => { fireEvent.click(chip); });
    const panel = screen.getAllByTestId('inline-try-this').find((p) => within(p).queryByText(`‘${query}’`))!;
    const played = await hear(panel);
    const low = played.filter((n) => n.midi < m('D4'));
    const top = played.filter((n) => n.midi >= m('D4'));
    expect(top.map((n) => name(n.midi))).toEqual(scale.map((x) => name(m(x))));
    expect(low.map((n) => name(n.midi))).toEqual(['D3']);
    for (const n of top) expect(soundingAt(low[0], n.at) && low[0].at + low[0].dur >= n.at + n.dur - 1e-6, name(n.midi)).toBe(true);
  });

  it('l9u30m4 c1: the large intervals falling from C5 — m6, M6, m7, M7, octave — each pair from the upper C', async () => {
    renderLesson(L9_UNITS, 'l9u30m4');
    const panel = conceptPanel(1);
    const played = await hear(panel);
    expect(played.map((n) => name(n.midi))).toEqual(['C5', 'E4', 'C5', 'Eb4', 'C5', 'D4', 'C5', 'C#4', 'C5', 'C4']);
    const sizes = played.reduce<number[]>((out, n, i) => (i % 2 ? [...out, played[i - 1].midi - n.midi] : out), []);
    expect(sizes).toEqual([8, 9, 10, 11, 12]);
    expectDrawnAsPlayed(await drawn(panel), played);
    expect(within(panel).getByText(/falling from the upper C/)).toBeTruthy();
  });
});
