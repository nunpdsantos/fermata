/**
 * The Progression panel in the chords card (wave 2, stream S), in jsdom: the
 * button opens it in place of the tabs and back; adding the key's chords
 * numbers them; the key line; the chip menu; moving by half steps; the capo
 * lines on the guitar; the offer when a request brings other chords; Clear;
 * the empty state; and with the panel closed the card is as before.
 */
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within, waitFor } from '@testing-library/react';
import { useAppStore } from '../../../../state/store';
import { ChordsCard } from '../../ChordsCard';
import { ProgressionHost } from '../../ProgressionHost';
import { closeProgressionPanel, isProgressionPanelOpen, resetProgressionPanel } from '../../../../state/progressionPanel';
import { requestProgression } from '../../../../state/progressionRequest';
import { setCapoFret, getCapoFret } from '../../../../state/capo';
import { setLoopClock, stopLoop } from '../loopController';
import { playTimedNotes } from '../../../../core/services/audio';

vi.mock('../../../../core/services/audio', async (orig) => ({
  ...(await orig<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playTimedNotes: vi.fn(),
  cancelScheduledAudio: vi.fn(),
}));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});
vi.mock('../../../notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff' }) };
});

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});
beforeEach(() => {
  resetProgressionPanel();
  setCapoFret(0);
  useAppStore.setState({
    selectedKey: { natural: 'G', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', view: 'explore', language: 'en', progression: undefined, exploreDetail: 'full',
  });
});
afterEach(() => {
  stopLoop('user');
  cleanup();
  resetProgressionPanel();
  useAppStore.setState({ progression: undefined });
});

async function openPanel() {
  render(<><ChordsCard /><ProgressionHost /></>);
  fireEvent.click(screen.getByTestId('progression-toggle'));
  return screen.findByTestId('progression-panel');
}
const add = (name: string) => fireEvent.click(screen.getByRole('button', { name: `Add ${name}`, exact: true } as never));
const chips = () => within(screen.getByTestId('progression-chips')).getAllByRole('button').map((b) => b.textContent);

describe('opening and closing', () => {
  it('closed: the card is as before (title, the three tabs, the chords in key), plus the one button', () => {
    render(<ChordsCard />);
    expect(screen.getByRole('heading', { name: 'Chords in G Major' })).toBeTruthy();
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['In key', 'All Chords', 'Build']);
    expect(screen.getByTestId('progression-toggle').textContent).toBe('Progression');
    expect(screen.queryByTestId('progression-panel')).toBeNull();
  });
  it('the button swaps the body (tabs included) for the panel and back, focus staying on it', async () => {
    await openPanel();
    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.getByRole('heading', { name: 'Progression' })).toBeTruthy();
    const back = screen.getByTestId('progression-toggle');
    expect(back.getAttribute('aria-label')).toBe('Back to the chords');
    expect(back.textContent).toBe('‹ Chords');
    back.focus();
    fireEvent.click(back);
    expect(isProgressionPanelOpen()).toBe(false);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(document.activeElement).toBe(screen.getByTestId('progression-toggle'));
  });
  it('the tab the learner had comes back after the panel', async () => {
    render(<ChordsCard />);
    fireEvent.click(screen.getByRole('tab', { name: 'Build' }));
    fireEvent.click(screen.getByTestId('progression-toggle'));
    await screen.findByTestId('progression-panel');
    expect(screen.getByTestId('chords-card').getAttribute('data-chords-tab')).toBe('build');
    act(() => closeProgressionPanel());
    expect(screen.getByRole('tab', { name: 'Build' }).getAttribute('aria-selected')).toBe('true');
  });
  it('Simple view has the button too', async () => {
    useAppStore.setState({ exploreDetail: 'simple' });
    await openPanel();
    expect(screen.getByTestId('progression-panel')).toBeTruthy();
  });
});

describe('the journey: G D Em C', () => {
  it('empty: what it is for, the common progressions, the adding row', async () => {
    const panel = await openPanel();
    expect(panel.getAttribute('data-state')).toBe('empty');
    expect(panel.textContent).toContain('Put chords in the order you play them');
    expect(within(screen.getByTestId('progression-preset-list')).getAllByRole('button')).toHaveLength(8);
    expect(screen.getByRole('button', { name: 'I–V–vi–IV: G D Em C' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'i–VII–VI–VII: Em D C D · in E minor' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'Add a chord of G major' })).toBeTruthy();
  });
  it('adding the key\'s chords: chips with I V vi IV, "All four chords fit G major", saved', async () => {
    await openPanel();
    for (const c of ['G', 'D', 'Em', 'C']) add(c);
    expect(chips()).toEqual(['GI', 'DV', 'Emvi', 'CIV']);
    expect(screen.getByTestId('progression-fit').textContent).toBe('All four chords fit G major.');
    expect(screen.queryByTestId('progression-better')).toBeNull();
    expect(useAppStore.getState().progression).toEqual({ chords: ['G', 'D', 'Em', 'C'], bpm: 90, beats: 4 });
    expect(screen.getByRole('button', { name: 'G, I, chord 1 of 4' })).toBeTruthy();
  });
  it('a common progression fills it in one tap', async () => {
    await openPanel();
    fireEvent.click(screen.getByRole('button', { name: 'I–V–vi–IV: G D Em C' }));
    expect(chips()).toEqual(['GI', 'DV', 'Emvi', 'CIV']);
  });
  it('a chord from outside the key is marked and still numbered; a better key is offered and switches Explore', async () => {
    useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' } });
    await openPanel();
    for (const c of ['C', 'F']) add(c);
    fireEvent.click(screen.getByTestId('progression-another'));
    const sheet = await screen.findByTestId('progression-another-sheet');
    fireEvent.click(within(sheet).getByRole('radio', { name: 'B♭' }));
    fireEvent.click(within(sheet).getByTestId('progression-another-add'));
    expect(chips()).toEqual(['CI', 'FIV', 'B♭♭VII']);
    const bb = screen.getByRole('button', { name: 'B♭, ♭VII, from outside C major, chord 3 of 3' });
    expect(bb.getAttribute('data-outside')).toBe('true');
    expect(screen.getByTestId('progression-fit').textContent).toBe('Two of three fit C major; B♭ does not.');
    expect(screen.getByTestId('progression-better').textContent).toContain('All three chords fit F major.');
    fireEvent.click(screen.getByRole('button', { name: 'Switch to F major' }));
    expect(useAppStore.getState()).toMatchObject({ selectedKey: { natural: 'F', accidental: '' }, selectedScale: 'major' });
    expect(chips()).toEqual(['CV', 'FI', 'B♭IV']);
  });
  it('the chip menu: move left, move right, remove (focus follows)', async () => {
    await openPanel();
    for (const c of ['G', 'D', 'Em']) add(c);
    fireEvent.click(screen.getByRole('button', { name: 'D, V, chord 2 of 3' }));
    const menu = screen.getByRole('menu', { name: 'D: move or remove' });
    fireEvent.click(within(menu).getByRole('menuitem', { name: 'Move left' }));
    expect(chips()).toEqual(['DV', 'GI', 'Emvi']);
    expect(document.activeElement?.textContent).toBe('DV');
    fireEvent.click(screen.getByRole('button', { name: 'D, V, chord 1 of 3' }));
    expect(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Move left' }).getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Remove' }));
    expect(chips()).toEqual(['GI', 'Emvi']);
  });
  it('16 chords at most', async () => {
    await openPanel();
    for (let i = 0; i < 18; i++) add('G');
    expect(chips()).toHaveLength(16);
    expect(screen.getByRole('button', { name: 'Add G', exact: true } as never).hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('16 chords is the most.')).toBeTruthy();
  });
  it('tempo − / +, 50–200; beats 4 or 2', async () => {
    await openPanel();
    add('G');
    fireEvent.click(screen.getByRole('button', { name: 'Faster' }));
    expect(useAppStore.getState().progression!.bpm).toBe(95);
    useAppStore.getState().setProgression({ ...useAppStore.getState().progression!, bpm: 200 });
    await waitFor(() => expect(screen.getByRole('button', { name: 'Faster' }).hasAttribute('disabled')).toBe(true));
    fireEvent.click(screen.getByRole('radio', { name: '2' }));
    expect(useAppStore.getState().progression!.beats).toBe(2);
    expect(screen.getByTestId('progression-bpm').getAttribute('aria-label')).toBe('200 beats a minute');
  });
  it('move: − / + shift the key and every chord by a half step, with true names', async () => {
    await openPanel();
    for (const c of ['G', 'D', 'Em', 'C']) add(c);
    fireEvent.click(screen.getByTestId('progression-up'));
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'A', accidental: 'b' });
    expect(chips()).toEqual(['A♭I', 'E♭V', 'Fmvi', 'D♭IV']);
    expect(screen.getByTestId('progression-key').textContent).toBe('A♭ major');
    fireEvent.click(screen.getByTestId('progression-down'));
    fireEvent.click(screen.getByTestId('progression-down'));
    expect(chips()).toEqual(['F♯I', 'C♯V', 'D♯mvi', 'BIV']);
    expect(screen.getByTestId('progression-fit').textContent).toBe('All four chords fit F♯ major.');
  });
  it('▶ Loop / ■ Stop', async () => {
    await openPanel();
    add('G');
    fireEvent.click(screen.getByTestId('progression-play'));
    await waitFor(() => expect(screen.getByTestId('progression-play').textContent).toContain('Stop'));
    fireEvent.click(screen.getByTestId('progression-play'));
    expect(screen.getByTestId('progression-play').textContent).toContain('Loop');
  });
  it('the loop plays at the chosen tempo and beats, and a change while it plays reaches the next time round (final review of wave 2)', async () => {
    const timers: (() => void)[] = [];
    let now = 0;
    setLoopClock({ now: () => now, setTimeout: (fn) => { timers.push(fn); return 0 as never; }, clearTimeout: () => {} });
    try {
      useAppStore.setState({ progression: { chords: ['G', 'C'], bpm: 120, beats: 2 } });
      await openPanel();
      const calls = vi.mocked(playTimedNotes).mock.calls;
      const first = calls.length;
      fireEvent.click(screen.getByTestId('progression-play'));
      await waitFor(() => expect(calls.length).toBe(first + 1));
      const onsets = (i: number) => [...new Set((calls[i][0] as { at: number }[]).map((n) => Math.round((n.at - (calls[i][0] as { at: number }[])[0].at) * 1000)))];
      // Count-in of four at 0.5 s (120 a minute), then two beats each of G and C.
      expect(onsets(first)).toEqual([0, 500, 1000, 1500, 2000, 2500, 3000, 3500]);
      // The tempo alone: the next time round is at 115 a minute, still two beats a chord.
      fireEvent.click(screen.getByRole('button', { name: 'Slower' }));
      expect(useAppStore.getState().progression).toMatchObject({ bpm: 115, beats: 2 });
      now = 5;
      timers.shift()!();
      expect(calls.length).toBe(first + 2);
      expect(onsets(first + 1)).toEqual(Array.from({ length: 4 }, (_, i) => Math.round(i * 60000 / 115)));
      // Then the beats alone: four of each chord.
      fireEvent.click(screen.getByRole('radio', { name: '4' }));
      now = 10;
      timers.shift()!();
      expect(calls.length).toBe(first + 3);
      expect(onsets(first + 2)).toEqual(Array.from({ length: 8 }, (_, i) => Math.round(i * 60000 / 115)));
    } finally {
      setLoopClock();
    }
  });
  it('Clear empties it (and the save loses the field)', async () => {
    await openPanel();
    add('G');
    fireEvent.click(screen.getByTestId('progression-clear'));
    expect(screen.getByTestId('progression-panel').getAttribute('data-state')).toBe('empty');
    expect(useAppStore.getState().progression!.chords).toEqual([]);
  });
  it('a scale other than major / natural minor: the panel says which key it counts in', async () => {
    useAppStore.setState({ selectedKey: { natural: 'D', accidental: '' }, selectedScale: 'dorian' });
    await openPanel();
    expect(screen.getByTestId('progression-key-note').textContent).toBe('D Dorian: the numbers are counted in C major.');
  });
});

describe('the capo (guitar only)', () => {
  it('ideas from the engine, each sets the capo; the line says which shapes to play; No capo', async () => {
    useAppStore.setState({ instrument: 'guitar', selectedKey: { natural: 'E', accidental: 'b' } });
    await openPanel();
    for (const c of ['E♭', 'A♭', 'B♭']) add(c);
    const ideas = screen.getByRole('radiogroup', { name: 'Capo ideas, for shapes with open strings' });
    expect(within(ideas).getAllByRole('radio').map((r) => r.textContent)).toEqual(['No capo', 'Fret 1: D, G, A', 'Fret 6: A, D, E', 'Fret 3: C, F, G']);
    fireEvent.click(within(ideas).getByRole('radio', { name: 'Fret 3: C, F, G' }));
    expect(getCapoFret()).toBe(3);
    expect(screen.getByTestId('progression-capo-now').textContent).toBe('Capo on fret 3: play C, F, G.');
    fireEvent.click(within(ideas).getByRole('radio', { name: 'No capo' }));
    expect(getCapoFret()).toBe(0);
    expect(screen.queryByTestId('progression-capo-now')).toBeNull();
  });
  it('a capo set elsewhere is described and offered; G D Em C already has open shapes', async () => {
    useAppStore.setState({ instrument: 'guitar' });
    setCapoFret(2);
    await openPanel();
    for (const c of ['G', 'D', 'Em', 'C']) add(c);
    expect(screen.getByTestId('progression-capo-now').textContent).toBe('Capo on fret 2: play F, C, Dm, B♭.');
    act(() => setCapoFret(0));
    expect(screen.getByTestId('progression-capo-none').textContent).toBe('Without a capo, each of these chords already has a shape with open strings.');
  });
  it('another tuning: no capo ideas and no shapes to play (the shapes are for standard tuning only); No capo takes one off', async () => {
    useAppStore.setState({ instrument: 'guitar', selectedKey: { natural: 'E', accidental: 'b' }, guitarTuningId: 'half-step-down' });
    try {
      await openPanel();
      for (const c of ['E♭', 'A♭', 'B♭']) add(c);
      expect(screen.queryByRole('radiogroup', { name: 'Capo ideas, for shapes with open strings' })).toBeNull();
      expect(screen.queryByTestId('progression-capo-none')).toBeNull();
      expect(screen.getByTestId('progression-capo-standard').textContent).toBe("Capo ideas need standard tuning: Fermata's chord shapes are for standard tuning only.");
      expect(screen.queryByRole('button', { name: 'No capo' })).toBeNull();
      act(() => setCapoFret(1));
      expect(screen.queryByTestId('progression-capo-now')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'No capo' }));
      expect(getCapoFret()).toBe(0);
    } finally {
      useAppStore.setState({ guitarTuningId: 'standard' });
    }
  });
  it('the piano shows no capo', async () => {
    await openPanel();
    add('G');
    expect(screen.queryByTestId('progression-capo')).toBeNull();
  });
});

describe('a saved symbol the parser does not read', () => {
  it('is left out of the chips, and the chip actions act on the chip the learner chose', async () => {
    useAppStore.getState().setProgression({ chords: ['Axyz', 'G', 'D', 'Em'], bpm: 90, beats: 4 });
    await openPanel();
    expect(chips()).toEqual(['GI', 'DV', 'Emvi']);
    fireEvent.click(screen.getByRole('button', { name: 'G, I, chord 1 of 3' }));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Remove' }));
    expect(chips()).toEqual(['DV', 'Emvi']);
    expect(useAppStore.getState().progression!.chords).toEqual(['D', 'Em']);
    fireEvent.click(screen.getByRole('button', { name: 'Em, vi, chord 2 of 2' }));
    fireEvent.click(within(screen.getByRole('menu')).getByRole('menuitem', { name: 'Move left' }));
    expect(chips()).toEqual(['Emvi', 'DV']);
  });
  it('none of them reads: the empty panel, and the first chord added replaces them', async () => {
    useAppStore.getState().setProgression({ chords: ['Axyz', 'Bqq'], bpm: 90, beats: 4 });
    const panel = await openPanel();
    expect(panel.getAttribute('data-state')).toBe('empty');
    add('G');
    expect(useAppStore.getState().progression!.chords).toEqual(['G']);
  });
});

describe('a request (a lesson, a link)', () => {
  it('with no progression: opens the panel and loads the chords', async () => {
    render(<><ChordsCard /><ProgressionHost /></>);
    act(() => requestProgression({ chords: ['A', 'E', 'F#m', 'D'] }));
    await screen.findByTestId('progression-chips');
    expect(chips()).toEqual(['AII', 'EVI', 'F♯mvii', 'DV']);
  });
  it('with chords of the learner\'s own: offers, "Use these" replaces, "Keep mine" keeps', async () => {
    useAppStore.getState().setProgression({ chords: ['G', 'C'], bpm: 90, beats: 4 });
    render(<><ChordsCard /><ProgressionHost /></>);
    act(() => requestProgression({ chords: ['Am', 'F'], bpm: 120 }));
    const offer = await screen.findByTestId('progression-offer');
    expect(offer.textContent).toContain('A lesson or shared link offers these chords at 120 beats a minute: Am, F.');
    expect(chips()).toEqual(['GI', 'CIV']);
    fireEvent.click(within(offer).getByRole('button', { name: 'Keep mine' }));
    expect(screen.queryByTestId('progression-offer')).toBeNull();
    expect(chips()).toEqual(['GI', 'CIV']);
    act(() => requestProgression({ chords: ['Am', 'F'], bpm: 120 }));
    fireEvent.click(within(await screen.findByTestId('progression-offer')).getByRole('button', { name: 'Use these' }));
    expect(chips()).toEqual(['Amii', 'F♭VII']);
    expect(useAppStore.getState().progression).toEqual({ chords: ['Am', 'F'], bpm: 120, beats: 4 });
  });
  it('the same chords at another tempo: the tempo is offered, not put in silently', async () => {
    useAppStore.getState().setProgression({ chords: ['G', 'C'], bpm: 70, beats: 4 });
    render(<><ChordsCard /><ProgressionHost /></>);
    act(() => requestProgression({ chords: ['G', 'C'], bpm: 96 }));
    const offer = await screen.findByTestId('progression-offer');
    expect(offer.textContent).toContain('A lesson or shared link offers these chords at 96 beats a minute: G, C.');
    expect(useAppStore.getState().progression!.bpm).toBe(70);
    fireEvent.click(within(offer).getByRole('button', { name: 'Use these' }));
    expect(useAppStore.getState().progression).toEqual({ chords: ['G', 'C'], bpm: 96, beats: 4 });
  });
  it('chords with no tempo: the offer names only the chords', async () => {
    useAppStore.getState().setProgression({ chords: ['G', 'C'], bpm: 70, beats: 4 });
    render(<><ChordsCard /><ProgressionHost /></>);
    act(() => requestProgression({ chords: ['Am', 'F'] }));
    expect((await screen.findByTestId('progression-offer')).textContent).toContain('A lesson or shared link offers these chords: Am, F.');
  });
});
