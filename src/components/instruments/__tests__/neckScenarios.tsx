/* eslint-disable react-refresh/only-export-components -- a test helper (scenarios + serialiser), never hot-reloaded. */
/**
 * Fixed guitar-neck scenarios shared by the legacy-view freeze
 * (legacyNeck.test.tsx) and the orientation tests (neckOrientation.test.tsx).
 * Each scenario sets the stores, renders one guitar surface and resolves with
 * its container once the surface is on screen.
 */
import { act, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { useAppStore } from '../../../state/store';
import { useFingeringStore } from '../../../state/fingeringStore';
import { useGuitarShapeStore } from '../../../state/guitarShapeStore';
import { useFocusNoteStore } from '../../../state/focusNoteStore';
import { useScaleDirectionStore } from '../../../state/scaleDirectionStore';
import { buildChord } from '../../../core/constants/chords';
import { GUITAR_TUNINGS } from '../../../core/constants/guitarTunings';
import { genRead } from '../../../core/utils/drillBank/genRead';
import type { Note } from '../../../core/types/music';
import type { FretPlace, ReadDrillItem } from '../../../core/types/drill';
import { PracticeNeck } from '../../practice/PracticeNeck';
import { positionWalkPractice, rightHandPractice, scalePractice, technicalSet, type PracticeRoute } from '../../practice/practiceModel';
import { FretboardExercise } from '../FretboardExercise';
import { NeckView } from '../NeckView';
import { Fretboard } from '../Fretboard';

/** The phone flag the mocked useMediaQuery reads (set per scenario). */
export const media = { mobile: false };

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({ natural, accidental });
const READ = genRead();
const readItem = (id: string): ReadDrillItem => READ.find((i) => i.id === id)!;
const C = N('C');
const standard = GUITAR_TUNINGS[0];

function resetStores(orientation: Record<string, string>) {
  localStorage.clear();
  useScaleDirectionStore.setState({ direction: 'ascending' });
  useGuitarShapeStore.setState({ shapeChoice: { key: '', idx: 0 } });
  useFocusNoteStore.setState({ hover: null, keyboard: null, pinned: null, locations: null });
  useAppStore.setState({
    selectedKey: C,
    selectedScale: 'major',
    selectedChord: null,
    chordInversion: 0,
    instrument: 'guitar',
    activeNotes: new Set<number>(),
    highlightedNotes: [],
    exerciseInputActive: false,
    guitarScalePosition: null,
    guitarTuningId: 'standard',
    quickSearchOpen: false,
    themeMode: 'fermata',
    view: 'explore',
    ...orientation,
  } as never);
  useFingeringStore.setState({ overrides: {}, labelMode: 'finger' });
}

const practiceRoute = (kind: 'scale' | 'walk' | 'rightHand' | 'technical'): PracticeRoute => {
  if (kind === 'scale') return scalePractice(C, 'major', standard, 2, 'im')!;
  if (kind === 'walk') return positionWalkPractice(C, 'major', standard)!;
  if (kind === 'rightHand') return rightHandPractice(C, 'major', standard, 'p-i-m-a')!;
  return technicalSet(C, 'major', standard).find((i) => i.route)!.route!;
};

function renderPractice(kind: 'scale' | 'walk' | 'rightHand' | 'technical', at: (r: PracticeRoute) => number) {
  const route = practiceRoute(kind);
  const index = Math.max(0, at(route));
  return render(<PracticeNeck route={route} index={index} tuning={standard} fingerFor={(_, n) => n.finger}
    edited={() => false} onNote={() => {}} />).container;
}

function renderReading(id: string, answered?: { picked: FretPlace }) {
  const q = readItem(id);
  return render(<FretboardExercise spec={q.input} disabled={!!answered}
    accepted={answered ? q.answer.accepted : undefined} picked={answered?.picked ?? null} onAnswer={() => {}} />).container;
}

export interface Scenario {
  name: string;
  run: () => Promise<HTMLElement>;
}

const dock = (mobile: boolean, state: Record<string, unknown>, labelMode: 'finger' | 'degree' | 'note' = 'finger') => async () => {
  media.mobile = mobile;
  act(() => {
    useAppStore.setState(state as never);
    useFingeringStore.setState({ labelMode });
  });
  return render(<Fretboard />).container;
};

const neck = (state: Record<string, unknown>) => async () => {
  media.mobile = false;
  act(() => { useAppStore.setState(state as never); });
  render(<Suspense fallback={null}><NeckView onClose={() => {}} /></Suspense>);
  await screen.findByRole('grid');
  return screen.getByTestId('neck-view');
};

export const SCENARIOS: Scenario[] = [
  { name: 'dock-laptop-position-V', run: dock(false, { guitarScalePosition: 5 }) },
  { name: 'dock-laptop-whole-neck', run: dock(false, { guitarScalePosition: 'all' }, 'note') },
  { name: 'dock-laptop-chord-F-barre', run: dock(false, { selectedChord: buildChord(N('F'), 'major') }) },
  { name: 'dock-laptop-chord-G-open', run: dock(false, { selectedChord: buildChord(N('G'), 'major') }) },
  { name: 'dock-laptop-dropD-chord-highlight', run: dock(false, { guitarTuningId: 'drop-d', selectedChord: buildChord(N('C'), 'major') }) },
  { name: 'dock-phone-open-position', run: dock(true, { guitarScalePosition: 0 }, 'degree') },
  { name: 'dock-phone-chord-Bm-barre', run: dock(true, { selectedChord: buildChord(N('B'), 'minor') }) },
  { name: 'dock-phone-whole-neck', run: dock(true, { guitarScalePosition: 'all' }, 'degree') },
  { name: 'neck-position-VII', run: neck({ guitarScalePosition: 7 }) },
  { name: 'neck-chord-Bm-barre', run: neck({ selectedChord: buildChord(N('B'), 'minor') }) },
  { name: 'practice-scale', run: async () => renderPractice('scale', () => 6) },
  { name: 'practice-position-walk', run: async () => renderPractice('walk', (r) => r.events.findIndex((e) => e.notes.some((n) => n.shift?.kind === 'guide'))) },
  { name: 'practice-right-hand', run: async () => renderPractice('rightHand', () => 3) },
  { name: 'practice-technical-set', run: async () => renderPractice('technical', () => 2) },
  { name: 'reading-position-V', run: async () => renderReading('read:staff-to-fret:V:E4') },
  { name: 'reading-open', run: async () => renderReading('read:staff-to-fret:open:C5') },
  { name: 'reading-feedback-wrong', run: async () => renderReading('read:staff-to-fret:any:C5', { picked: { stringIndex: 0, fret: 1 } }) },
];

export { resetStores };

/**
 * The drawing as text: every element with its tag, every attribute (sorted)
 * and every inline style declaration (sorted), and every text node, in DOM
 * order. Two renders that serialise the same carry the same cells in the
 * same order, the same data attributes, labels, classes and inline layout.
 */
export function serialise(root: Element): string {
  const lines: string[] = [];
  const walk = (node: Node, depth: number) => {
    const pad = '  '.repeat(depth);
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (text.trim()) lines.push(`${pad}"${text}"`);
      return;
    }
    if (!(node instanceof Element)) return;
    const attrs = [...node.attributes]
      .filter((a) => a.name !== 'style')
      .map((a) => `${a.name}=${JSON.stringify(a.value)}`)
      .sort();
    const style = node instanceof HTMLElement || node instanceof SVGElement
      ? [...Array(node.style.length).keys()].map((i) => {
        const prop = node.style.item(i);
        return `${prop}:${node.style.getPropertyValue(prop)}`;
      }).sort()
      : [];
    lines.push(`${pad}<${node.tagName.toLowerCase()}${attrs.length ? ' ' + attrs.join(' ') : ''}${style.length ? ` style{${style.join(';')}}` : ''}>`);
    for (const child of node.childNodes) walk(child, depth + 1);
  };
  walk(root, 0);
  return lines.join('\n');
}
