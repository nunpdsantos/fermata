/**
 * Music audit 2 (18 November 2026), findings M37–M41, as a learner meets them on the guitar practice sheet.
 * Each `describe` reproduced its finding at 153caab (release 16) by failing; see the corpus sweep beside it
 * (practiceAudit2.corpus.test.ts) for the whole matrix.
 */
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../i18n';
import GuitarPractice from '../GuitarPractice';
import { useAppStore } from '../../../state/store';
import { useFingeringStore, FINGERING_STORE_KEY } from '../../../state/fingeringStore';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { cancelScheduledAudio, playTimedNotes, resumeAudio, type TimedNote } from '../../../core/services/audio';
import { TUNING_STANDARD } from '../../../core/constants/guitarTunings';
import type { Note } from '../../../core/types/music';
import { positionWalkPractice, rightHandPractice, routeFingerKey, technicalSet } from '../practiceModel';

vi.mock('../../../core/services/audio', () => ({
  SYNTH_PRESETS: {}, resumeAudio: vi.fn().mockResolvedValue(undefined), cancelScheduledAudio: vi.fn(), playTimedNotes: vi.fn(),
}));
vi.mock('../../notation/StaffNotation', () => ({ StaffNotation: () => <div data-testid="staff-notes" /> }));

const C = { natural: 'C', accidental: '' } as const;
const B = { natural: 'B', accidental: '' } as const;

beforeEach(async () => {
  vi.clearAllMocks();
  vi.mocked(resumeAudio).mockResolvedValue(undefined);
  localStorage.clear();
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
  useFocusNoteStore.getState().clearAll();
  useAppStore.setState({ selectedKey: C, selectedScale: 'major', guitarTuningId: 'standard', instrument: 'guitar', view: 'explore' });
  await i18n.changeLanguage('en');
});
afterEach(cleanup);

const current = () => screen.getByTestId('practice-current').textContent!;
const step = () => current().match(/^(\d+) of (\d+)/)!.slice(1).map(Number);
const tempo = () => (screen.getByRole('combobox', { name: 'Tempo' }) as HTMLSelectElement).value;
const fingerSelect = (note: RegExp) => screen.getByRole('combobox', { name: note }) as HTMLSelectElement;
const optionDisabled = (select: HTMLSelectElement, value: string) => (within(select).getByRole('option', { name: value }) as HTMLOptionElement).disabled;
const openTechnical = (id: string) => {
  fireEvent.click(screen.getByRole('tab', { name: 'Technical set' }));
  fireEvent.change(screen.getByTestId('practice-exercise'), { target: { value: id } });
};
const goTo = (n: number) => { for (let i = 1; i < n; i++) fireEvent.click(screen.getByRole('button', { name: 'Next note or chord' })); };

describe('M37: one finger cannot stop two frets at the same instant', () => {
  const thirds = technicalSet(C, 'major', TUNING_STANDARD).find((i) => i.id === 'thirds-together')!.route!;
  const [lowC, highE] = thirds.events[0].notes;
  const key = (n: typeof lowC) => routeFingerKey(C, 'major', TUNING_STANDARD, thirds, 0, n);

  it('the audit\'s pair: C on string 5 fret 3 with finger 3, E on string 4 fret 2 with finger 2', () => {
    expect([lowC, highE].map((n) => [n.note.natural, 6 - n.stringIndex, n.fret, n.finger])).toEqual([['C', 5, 3, 3], ['E', 4, 2, 2]]);
  });

  it('finger 3 is not offered for E while C holds it, is refused if sent anyway, and the editor says where it is', () => {
    render(<GuitarPractice />);
    openTechnical('thirds-together');
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    const e = fingerSelect(/Finger for E, string 4/);
    const c = fingerSelect(/Finger for C, string 5/);
    expect(['1', '2', '3', '4'].map((v) => optionDisabled(e, v))).toEqual([false, false, true, false]);
    expect(['1', '2', '3', '4'].map((v) => optionDisabled(c, v))).toEqual([false, true, false, false]);
    fireEvent.change(e, { target: { value: '3' } });
    expect(e.value).toBe('2');
    expect(useFingeringStore.getState().overrides).toEqual({});
    expect(screen.queryAllByTestId('practice-clash')).toHaveLength(0);
    expect(screen.getAllByTestId('practice-finger-busy').map((p) => p.textContent)).toEqual([
      'Finger 2 is not offered for C on string 5: at the same time it already holds E on string 4, fret 2, and one finger cannot hold two frets.',
      'Finger 3 is not offered for E on string 4: at the same time it already holds C on string 5, fret 3, and one finger cannot hold two frets.',
    ]);
    // Either finger can still change: C to 1 frees 3 for E.
    fireEvent.change(c, { target: { value: '1' } });
    expect(optionDisabled(e, '3')).toBe(false);
    fireEvent.change(e, { target: { value: '3' } });
    expect(useFingeringStore.getState().overrides).toEqual({ [key(lowC)]: 1, [key(highE)]: 3 });
  });

  it('a tap on the neck steps past the finger it cannot take (E: 2 → 4, not 3)', () => {
    render(<GuitarPractice />);
    openTechnical('thirds-together');
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    const cell = screen.getByTestId('practice-neck').querySelector<HTMLElement>(`[data-string-row="${highE.stringIndex}"][data-fret="2"]`)!;
    fireEvent.click(cell);
    expect(useFingeringStore.getState().overrides).toEqual({ [key(highE)]: 4 });
    fireEvent.click(cell);
    expect(useFingeringStore.getState().overrides).toEqual({ [key(highE)]: 1 });
    fireEvent.click(cell); // 1 → 2, the suggestion: the override goes
    expect(useFingeringStore.getState().overrides).toEqual({});
  });

  it('a barré across one fret stays offered, and its cue shows', () => {
    // The first "together" step that holds two strings at ONE fret, in any key on standard tuning.
    let found: { root: Note; id: string; index: number } | null = null;
    for (const root of ['C', 'G', 'D', 'A', 'E', 'F'].map((natural) => ({ natural, accidental: '' }) as Note)) {
      for (const item of technicalSet(root, 'major', TUNING_STANDARD)) {
        if (!item.id.endsWith('-together') || !item.route) continue;
        const index = item.route.events.findIndex((ev) => ev.notes.length === 2 && ev.notes.every((n) => n.fret > 0) && ev.notes[0].fret === ev.notes[1].fret
          && ev.notes[0].finger !== ev.notes[1].finger && Math.abs(ev.notes[0].stringIndex - ev.notes[1].stringIndex) === 1);
        if (index >= 0) { found = { root, id: item.id, index }; break; }
      }
      if (found) break;
    }
    expect(found).not.toBeNull();
    useAppStore.setState({ selectedKey: found!.root });
    render(<GuitarPractice />);
    openTechnical(found!.id);
    goTo(found!.index + 1);
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    const route = technicalSet(found!.root, 'major', TUNING_STANDARD).find((i) => i.id === found!.id)!.route!;
    const [lo, hi] = route.events[found!.index].notes;
    const hiSelect = screen.getAllByRole('combobox', { name: /Finger for/ })[1] as HTMLSelectElement;
    expect(optionDisabled(hiSelect, String(lo.finger))).toBe(false);
    fireEvent.change(hiSelect, { target: { value: String(lo.finger) } });
    expect(hiSelect.value).toBe(String(lo.finger));
    expect(screen.getByTestId('practice-barre').textContent).toBe(`Barré: finger ${lo.finger} across strings ${6 - hi.stringIndex} to ${6 - lo.stringIndex}, fret ${lo.fret}`);
  });

  it('successive notes may reuse a finger: a scale step offers all four', () => {
    render(<GuitarPractice />);
    goTo(3);
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    const select = screen.getByRole('combobox', { name: /Finger for/ }) as HTMLSelectElement;
    expect(['1', '2', '3', '4'].map((v) => optionDisabled(select, v))).toEqual([false, false, false, false]);
    expect(screen.queryAllByTestId('practice-finger-busy')).toHaveLength(0);
  });

  it('a clash saved by release 16 is kept, named with both places, and mended by changing either finger', async () => {
    localStorage.setItem(FINGERING_STORE_KEY, JSON.stringify({ state: { overrides: { [key(highE)]: 3 }, labelMode: 'finger' }, version: 1 }));
    await useFingeringStore.persist.rehydrate();
    render(<GuitarPractice />);
    openTechnical('thirds-together');
    expect(screen.getByTestId('practice-clash').textContent).toBe(
      'Finger 3 is on C on string 5, fret 3, and on E on string 4, fret 2, at the same time: one finger cannot hold two frets. Change one of them.');
    expect(useFingeringStore.getState().overrides).toEqual({ [key(highE)]: 3 });
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    // Both show 3; 3 is not offered to either, so the teacher picks another for one of them.
    expect(fingerSelect(/Finger for E/).value).toBe('3');
    fireEvent.change(fingerSelect(/Finger for C/), { target: { value: '2' } });
    expect(screen.queryAllByTestId('practice-clash')).toHaveLength(0);
    expect(useFingeringStore.getState().overrides).toEqual({ [key(highE)]: 3, [key(lowC)]: 2 });
  });
});

describe('M38: Position walk keeps a teacher\'s finger', () => {
  const walk = positionWalkPractice(C, 'major', TUNING_STANDARD)!;
  const first = walk.events[0].notes[0];
  const key = routeFingerKey(C, 'major', TUNING_STANDARD, walk, 0, first);

  it('step 1 of 63, C on string 5 fret 3, finger 2 → 3: shown, saved, kept on return and reload, then reset', async () => {
    expect([walk.events.length, first.note.natural, 6 - first.stringIndex, first.fret, first.finger]).toEqual([63, 'C', 5, 3, 2]);
    const view = render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: 'Position walk' }));
    expect(step()).toEqual([1, 63]);
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    expect(screen.getByRole('button', { name: 'Reset to suggested' })).toHaveProperty('disabled', true);
    fireEvent.change(fingerSelect(/Finger for C, string 5/), { target: { value: '3' } });
    expect(fingerSelect(/Finger for C, string 5/).value).toBe('3');
    expect(current()).toContain('Left hand 3');
    expect(screen.getByRole('button', { name: 'Reset to suggested' })).toHaveProperty('disabled', false);
    expect(JSON.parse(localStorage.getItem(FINGERING_STORE_KEY)!).state.overrides).toEqual({ [key]: 3 });
    // Leave the tab and come back.
    fireEvent.click(screen.getByRole('tab', { name: 'Scales' }));
    fireEvent.click(screen.getByRole('tab', { name: 'Position walk' }));
    expect(current()).toContain('Left hand 3');
    // Reload.
    view.unmount();
    await useFingeringStore.persist.rehydrate();
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: 'Position walk' }));
    expect(current()).toContain('Left hand 3');
    fireEvent.click(screen.getByRole('button', { name: 'Edit fingering' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset to suggested' }));
    expect(current()).toContain('Left hand 2');
    expect(JSON.parse(localStorage.getItem(FINGERING_STORE_KEY)!).state.overrides).toEqual({});
  });
});

describe('M39: the stroke keeps the step and the tempo', () => {
  it('C major two octaves, 60 BPM, step 7 of 29 (open B): tirando ↔ apoyando, paused', () => {
    render(<GuitarPractice />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Tempo' }), { target: { value: '60' } });
    goTo(7);
    expect(step()).toEqual([7, 29]);
    expect(current()).toMatch(/B · Left hand 0 · string 2 fret 0/);
    for (const stroke of ['apoyando', 'tirando', 'apoyando']) {
      fireEvent.click(screen.getByRole('radio', { name: stroke }));
      expect([step(), tempo()]).toEqual([[7, 29], '60']);
    }
    // The alternating fingers leave the left-hand route as it is too.
    fireEvent.click(screen.getByRole('radio', { name: 'm–a' }));
    expect([step(), tempo()]).toEqual([[7, 29], '60']);
    expect(screen.getAllByRole('button', { name: /^Step / })[6].firstElementChild!.textContent).toBe('m');
    fireEvent.click(screen.getByRole('radio', { name: 'i–m' }));
    expect([step(), tempo()]).toEqual([[7, 29], '60']);
  });

  it('while playing: the playback goes on, at its step and tempo, both ways', async () => {
    render(<GuitarPractice />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Tempo' }), { target: { value: '60' } });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '▶ Play' })));
    const [, , callbacks] = vi.mocked(playTimedNotes).mock.calls[0];
    act(() => callbacks!.onNotePlay(6));
    const cancels = vi.mocked(cancelScheduledAudio).mock.calls.length;
    for (const stroke of ['apoyando', 'tirando']) {
      fireEvent.click(screen.getByRole('radio', { name: stroke }));
      expect([step(), tempo()]).toEqual([[7, 29], '60']);
      expect(screen.getByRole('button', { name: '■ Stop' })).toBeDefined();
    }
    expect(vi.mocked(cancelScheduledAudio).mock.calls.length).toBe(cancels);
    expect(playTimedNotes).toHaveBeenCalledTimes(1);
    act(() => callbacks!.onNotePlay(7));
    expect(step()).toEqual([8, 29]);
  });

  it('another route still starts at step 1 (a different range)', () => {
    render(<GuitarPractice />);
    goTo(5);
    fireEvent.click(screen.getByRole('radio', { name: '1 octave' }));
    expect(step()[0]).toBe(1);
  });
});

describe('M40: one string, one note at a time, on the schedule the audio engine is given', () => {
  it('C major, p i m i at 60 BPM: the open G (string 3) played at 1.0 s ends at 2.9 s, before its next pluck at 3.0 s; other strings ring on', async () => {
    const route = rightHandPractice(C, 'major', TUNING_STANDARD, 'p-i-m-i')!;
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: 'Right hand' }));
    fireEvent.change(screen.getByTestId('practice-pattern'), { target: { value: 'p-i-m-i' } });
    fireEvent.change(screen.getByRole('combobox', { name: 'Tempo' }), { target: { value: '60' } });
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '▶ Play' })));
    const [notes] = vi.mocked(playTimedNotes).mock.calls[0] as [TimedNote[]];
    const strings = route.events.flatMap((e) => e.notes.map((n) => n.stringIndex));
    expect(notes).toHaveLength(strings.length);
    const g = notes.map((n, k) => ({ ...n, s: strings[k] })).filter((n) => n.s === 3);
    expect(g.slice(0, 2).map((n) => [n.at, Number((n.at + n.duration).toFixed(6))])).toEqual([[1, 2.9], [3, 3.9]]);
    // On every string: a note ends before that string sounds again.
    for (const [k, n] of notes.entries()) {
      const next = notes.findIndex((_, j) => j > k && strings[j] === strings[k]);
      if (next >= 0) expect(n.at + n.duration).toBeLessThanOrEqual(notes[next].at);
    }
    // The bass (string 5, C) and the 2nd string (m) still ring to the bar's end.
    expect(notes.filter((n, k) => strings[k] !== 3 && n.at < 4).map((n) => Number((n.at + n.duration).toFixed(6)))).toEqual([3.9, 3.9]);
  });
});

describe('M41: the barré cue, printed and spoken', () => {
  it('B major (p+a) i m i, step 1: finger 1 across strings 1 to 5 at fret 2, on the notes, the step and the neck', () => {
    useAppStore.setState({ selectedKey: B });
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: 'Right hand' }));
    fireEvent.change(screen.getByTestId('practice-pattern'), { target: { value: 'p+a-i-m-i' } });
    expect(current()).toContain('p · B · Left hand 1 · string 5 fret 2 · Partial barré');
    expect(current()).toContain('a · F♯ · Left hand 1 · string 1 fret 2 · Partial barré');
    expect(screen.getByTestId('practice-barre').textContent).toBe('Barré: finger 1 across strings 1 to 5, fret 2');
    const steps = screen.getAllByRole('button', { name: /^Step / });
    expect(steps[0].getAttribute('aria-label')).toBe('Step 1: B + F#. Barré: finger 1 across strings 1 to 5, fret 2');
    expect(steps[1].getAttribute('aria-label')).toBe('Step 2: B');
    const neck = screen.getByTestId('practice-neck');
    // The dots' own description (their title) on the two strings under the index.
    const titles = [...neck.querySelectorAll('[data-dot="position"]')].map((d) => [d.closest('[data-string-row]')!.getAttribute('data-string-row'), d.getAttribute('title')]);
    expect(titles.filter(([, title]) => title?.includes('Partial barré'))).toEqual([['1', 'Left hand 1 · Partial barré'], ['5', 'Left hand 1 · Partial barré']]);
    fireEvent.click(screen.getByRole('button', { name: 'Next note or chord' }));
    expect(screen.queryAllByTestId('practice-barre')).toHaveLength(0);
  });

  it('a pattern that plucks one string under the index needs no cue (B major p i m)', () => {
    useAppStore.setState({ selectedKey: B });
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: 'Right hand' }));
    fireEvent.change(screen.getByTestId('practice-pattern'), { target: { value: 'p-i-m' } });
    expect(current()).not.toContain('barré');
    expect(screen.queryAllByTestId('practice-barre')).toHaveLength(0);
  });

  it.each([
    ['pt', 'Pestana: dedo 1 sobre as cordas 1 a 5, traste 2'],
    ['es', 'Cejilla: dedo 1 sobre las cuerdas 1 a 5, traste 2'],
  ])('%s says it too', async (lang, line) => {
    await i18n.changeLanguage(lang);
    useAppStore.setState({ selectedKey: B });
    render(<GuitarPractice />);
    fireEvent.click(screen.getByRole('tab', { name: i18n.t('practice.tabs.rightHand') }));
    fireEvent.change(screen.getByTestId('practice-pattern'), { target: { value: 'p+a-i-m-i' } });
    expect(screen.getByTestId('practice-barre').textContent).toBe(line);
  });
});
