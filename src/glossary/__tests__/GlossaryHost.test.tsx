/**
 * Plain words in Explore (wave 1, brief C), in jsdom: tap a word → its
 * explanation (a dialog named by the word, the plain text as its
 * description, the engine's example), ▶ Hear it plays the demonstration,
 * Learn more opens the lesson, Escape closes and focus returns to the word;
 * "Words on this screen" lists the marked words shown; and Simple view's
 * contents (short scale list, plain summary, numbers on the strip, the In
 * key row only, a trimmed chord detail with its way back to Full).
 */
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within, act } from '@testing-library/react';
import { useAppStore } from '../../state/store';
import { setLearnerProfile } from '../../state/learnerProfile';
import { useGlossaryUi } from '../glossaryUi';
import { visibleTermIds } from '../visibleTerms';
import GlossaryHost from '../GlossaryHost';
import { ExploreHeader } from '../../components/explore/ExploreHeader';
import { ScaleStrip } from '../../components/explore/ScaleStrip';
import { ChordsCard } from '../../components/explore/ChordsCard';
import { CircleNavigator } from '../../components/explore/CircleNavigator';
import { buildChord } from '../../core/constants/chords';
import { playTimedNotes } from '../../core/services/audio';
import { readoutParts } from '../../components/explore/focusReadout';
import { buildScale } from '../../core/constants/scales';
import i18n from '../../i18n';

vi.mock('../../hooks/useAudio', () => ({ useAudio: () => ({ noteOn: vi.fn().mockResolvedValue(60), noteOff: vi.fn() }) }));
vi.mock('../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playScale: vi.fn(),
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
vi.mock('../../components/notation/StaffNotation.tsx', async () => {
  const React = await import('react');
  return { StaffNotation: () => React.createElement('div', { 'data-testid': 'staff' }) };
});

const rects = Element.prototype.getClientRects;
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
  // jsdom lays nothing out: treat every element as shown, except a folded or hidden one.
  Element.prototype.getClientRects = function (this: Element) {
    return (this.closest('[hidden]') ? [] : [{ width: 10, height: 10 }]) as unknown as DOMRectList;
  };
});
afterAll(() => { Element.prototype.getClientRects = rects; });
beforeEach(() => {
  vi.mocked(playTimedNotes).mockClear();
  useGlossaryUi.setState({ request: null, wanted: false });
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0,
    instrument: 'piano', baseOctave: 4, view: 'explore', language: 'en', exploreDetail: undefined, pendingLearnTarget: null,
  });
});
afterEach(() => {
  cleanup();
  setLearnerProfile(null);
});

/** A phone (no room for the Simple / Full switch) or not: only the phone query matches. */
function phoneMedia(phone: boolean) {
  return ((query: string) => ({
    matches: phone && query.includes('max-width: 639px'), media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

function Explore() {
  return (
    <>
      <ExploreHeader />
      <ScaleStrip />
      <ChordsCard />
      <CircleNavigator />
      <GlossaryHost />
    </>
  );
}

describe('tap a word', () => {
  it('the summary words are buttons that open their explanation; Escape closes it and focus returns', () => {
    render(<Explore />);
    const summary = screen.getByTestId('key-summary');
    const word = within(summary).getByRole('button', { name: 'relative A minor' });
    expect(word.getAttribute('aria-haspopup')).toBe('dialog');
    word.focus();
    fireEvent.click(word);
    const dialog = screen.getByRole('dialog', { name: 'Relative key' });
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)?.textContent).toMatch(/same notes, from a different home note/);
    expect(within(dialog).getByTestId('glossary-example').textContent).toContain('C Major and A minor share every note.');
    expect(document.activeElement).toBe(dialog);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(word);
  });

  it('▶ Hear it plays the demonstration through the app\'s own player', async () => {
    render(<Explore />);
    fireEvent.click(within(screen.getByTestId('key-summary')).getByRole('button', { name: 'relative A minor' }));
    await act(async () => { fireEvent.click(screen.getByTestId('glossary-hear')); });
    expect(playTimedNotes).toHaveBeenCalledTimes(1);
    const notes = vi.mocked(playTimedNotes).mock.calls[0][0];
    expect(notes.length).toBe(16); // C major up (8), then A minor up (8)
  });

  // Final review (2026-11-10): every key fact opens ITS word (the tests only
  // tapped "Dominant key"), for a major key and for a mode's parent key.
  it.each([
    ['major', [['Signature', 'Key signature'], ['Relative', 'Relative key'], ['Dominant key', 'Dominant key'], ['Subdominant key', 'Subdominant key']]],
    ['dorian', [['Signature', 'Key signature'], ['Parent key', 'Parent key']]],
  ] as const)('in C %s, each key fact opens its own explanation', (scale, pairs) => {
    useAppStore.setState({ selectedScale: scale });
    render(<Explore />);
    const facts = screen.getByTestId('key-facts');
    expect(within(facts).getAllByRole('button').map((b) => b.textContent)).toEqual(pairs.map(([label]) => label));
    for (const [label, title] of pairs) {
      fireEvent.click(within(facts).getByRole('button', { name: label }));
      expect(screen.getByRole('dialog', { name: title })).toBeTruthy();
      act(() => useGlossaryUi.getState().close());
    }
  });

  // Final review (2026-11-10): a tap on a word opens its explanation and
  // changes nothing else (the e2e compared four layout boxes only).
  it('tapping each word, open and closed again, changes no selection or setting', () => {
    useAppStore.setState({ exploreDetail: 'full', selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major'), chordInversion: 1, scaleOctaves: 1 });
    render(<Explore />);
    const snapshot = () => JSON.stringify(useAppStore.getState(), (_k, v) => (v instanceof Set ? [...v] : v));
    const before = snapshot();
    const words = [...document.querySelectorAll<HTMLButtonElement>('button.term')];
    expect(words.length).toBeGreaterThan(8); // a known positive: summary, facts, strip, chord detail
    for (const word of words) {
      fireEvent.click(word);
      expect(useGlossaryUi.getState().request?.kind).toBe('term');
      act(() => useGlossaryUi.getState().close());
    }
    expect(snapshot()).toBe(before);
  });

  it('Learn more opens the lesson that teaches it', () => {
    render(<Explore />);
    fireEvent.click(within(screen.getByTestId('key-facts')).getByRole('button', { name: 'Dominant key' }));
    expect(screen.getByRole('dialog', { name: 'Dominant key' })).toBeTruthy();
    fireEvent.click(screen.getByTestId('glossary-learn'));
    expect(useAppStore.getState().view).toBe('learn');
    expect(useAppStore.getState().pendingLearnTarget?.moduleId).toBe('l2u4m1');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('the chord detail: "V · dominant" is two words to tap; where a name does not apply, the panel says so', () => {
    useAppStore.setState({ selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') });
    render(<Explore />);
    const role = screen.getByTestId('chord-role');
    // One button (its text stays one run): the degree name, then the numerals.
    fireEvent.click(within(role).getByRole('button', { name: 'V · dominant' }));
    const dialog = screen.getByRole('dialog', { name: 'Dominant' });
    expect(within(dialog).getByRole('heading', { name: 'Roman numerals (I, ii, V…)' })).toBeTruthy();
    expect(within(dialog).getAllByTestId('glossary-example')[1].textContent).toBe('In C Major: I = C · IV = F · V = G.');
    expect(screen.getAllByTestId('glossary-example')[0].textContent).toContain('In C Major: G.');
    act(() => useAppStore.setState({ selectedScale: 'whole_tone', selectedChord: null }));
    expect(screen.getAllByTestId('glossary-example')[0].textContent).toContain('These names belong to seven-note scales; C Whole Tone has 6 notes.');
  });
});

describe('Words on this screen', () => {
  it('lists every marked word shown, in reading order, each once; a row opens its explanation', () => {
    useAppStore.setState({ selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') });
    render(<Explore />);
    const ids = visibleTermIds();
    expect(ids.slice(0, 4)).toEqual(['scale_major', 'keySignature', 'sharpFlat', 'relativeKey']);
    expect(ids).toEqual(expect.arrayContaining(['degree', 'staff', 'chordsInKey', 'dominant', 'romanNumeral', 'majorChord', 'minorChord', 'diminishedChord', 'inversion', 'formula', 'compatibleScales', 'scale_mixolydian', 'circleOfFifths', 'dominantKey']));
    expect(new Set(ids).size).toBe(ids.length);
    fireEvent.click(screen.getAllByTestId('words-open')[0]);
    const sheet = screen.getByRole('dialog', { name: 'Words on this screen' });
    const rows = within(sheet).getAllByRole('button', { expanded: false });
    expect(rows.length).toBe(ids.length);
    fireEvent.click(within(sheet).getByRole('button', { name: 'Dominant' }));
    expect(within(sheet).getByText(/like a question that the home chord answers/)).toBeTruthy();
    expect(within(sheet).getByRole('button', { name: 'Dominant' }).getAttribute('aria-expanded')).toBe('true');
  });
});

describe('after review', () => {
  it('"Words on this screen" follows the Simple / Full switch inside it', () => {
    useAppStore.setState({ selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major') });
    render(<Explore />);
    fireEvent.click(screen.getAllByTestId('words-open')[0]);
    const sheet = screen.getByRole('dialog', { name: 'Words on this screen' });
    const words = () => [...sheet.querySelectorAll('[data-word]')].map((li) => li.getAttribute('data-word'));
    expect(words()).toEqual(expect.arrayContaining(['formula', 'inversion', 'compatibleScales']));
    fireEvent.click(within(sheet).getByRole('radio', { name: 'Simple' }));
    expect(useAppStore.getState().exploreDetail).toBe('simple');
    // (The circle's facts stay here: this harness renders CircleNavigator itself; ExploreView leaves it out of Simple.)
    for (const gone of ['formula', 'inversion', 'compatibleScales']) expect(words()).not.toContain(gone);
    expect(words()).toEqual(expect.arrayContaining(['keySignature', 'degree', 'chordsInKey']));
    fireEvent.click(within(sheet).getByRole('radio', { name: 'Full' }));
    expect(words()).toEqual(expect.arrayContaining(['formula', 'inversion', 'compatibleScales']));
  });

  it('Simple numbers a five- or six-note scale by its degrees, as Full and the colours do', () => {
    useAppStore.setState({ exploreDetail: 'simple', selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'pentatonic_minor' });
    render(<Explore />);
    expect([...document.querySelectorAll('.strip-degree')].map((d) => d.textContent)).toEqual(['1', '♭3', '4', '5', '♭7', '1']);
    cleanup();
    useAppStore.setState({ selectedScale: 'blues' });
    render(<Explore />);
    expect([...document.querySelectorAll('.strip-degree')].map((d) => d.textContent)).toEqual(['1', '♭3', '4', '♭5', '5', '♭7', '1']);
  });

  it('Simple\'s dock read-out names a minor key\'s 3rd as ♭3, as the strip does', () => {
    const t = i18n.t.bind(i18n) as (k: string, o?: Record<string, unknown>) => string;
    const scale = buildScale({ natural: 'C', accidental: '' }, 'natural_minor');
    const input = { focus: { pc: 3, midi: 63, source: 'staff' as const }, scale, chord: null, spellPitchClass: () => ({ natural: 'E' as const, accidental: 'b' as const }), t, simple: true };
    expect(readoutParts(input).keyRole).toBe('note ♭3 of C Natural Minor');
  });

  it('switching to Simple plays the chord in root position (Simple has no voicing control)', () => {
    useAppStore.setState({ exploreDetail: 'full', selectedChord: buildChord({ natural: 'G', accidental: '' }, 'major'), chordInversion: 1 });
    render(<Explore />);
    fireEvent.click(within(screen.getByRole('radiogroup', { name: 'How much to show' })).getByRole('radio', { name: 'Simple' }));
    expect(useAppStore.getState().chordInversion).toBe(0);
    expect(useAppStore.getState().selectedChord?.root.natural).toBe('G');
  });

  it('the signature in the summary also explains what a sharp and a flat are', () => {
    useAppStore.setState({ exploreDetail: 'simple', selectedKey: { natural: 'G', accidental: '' } });
    render(<Explore />);
    expect(visibleTermIds()).toContain('sharpFlat');
    fireEvent.click(within(screen.getByTestId('key-summary')).getByRole('button', { name: 'one sharp' }));
    const dialog = screen.getByRole('dialog', { name: 'Key signature' });
    expect(within(dialog).getByRole('heading', { name: 'Sharp ♯ and flat ♭' })).toBeTruthy();
  });

  it('a laptop\'s explanation follows its word when the column scrolls, and tapping the word again closes it', () => {
    render(<Explore />);
    const word = within(screen.getByTestId('key-summary')).getByRole('button', { name: 'relative A minor' });
    let top = 100;
    word.getBoundingClientRect = () => new DOMRect(40, top, 120, 20);
    fireEvent.pointerDown(word);
    fireEvent.click(word);
    const pop = screen.getByTestId('glossary-popover');
    expect(pop.style.top).toBe('128px');
    top = 60;
    act(() => { document.querySelector('[data-testid="key-summary"]')!.dispatchEvent(new Event('scroll', { bubbles: false })); });
    expect(pop.style.top).toBe('88px');
    fireEvent.pointerDown(word);
    fireEvent.click(word);
    expect(screen.queryByTestId('glossary-popover')).toBeNull();
  });
});

describe('Simple view', () => {
  it('a guided profile starts in Simple; the short scale list ends with "All scales…", which switches to Full', () => {
    setLearnerProfile('new');
    render(<Explore />);
    const picker = screen.getByTestId('scale-picker') as HTMLSelectElement;
    expect([...picker.options].map((o) => o.text)).toEqual(['Major', 'Minor', 'Major Pentatonic', 'Minor Pentatonic', 'Blues', 'All scales…']);
    expect(screen.getByTestId('key-summary').textContent).toContain('C Major · no sharps or flats');
    expect(screen.queryByTestId('circle-card')).not.toBeNull(); // (CircleNavigator rendered directly here; ExploreView leaves it out)
    fireEvent.change(picker, { target: { value: 'all-scales' } });
    expect(useAppStore.getState().exploreDetail).toBe('full');
    expect(useAppStore.getState().selectedScale).toBe('major');
  });

  it('a scale chosen elsewhere still shows as selected; one sharp is said in words', () => {
    useAppStore.setState({ exploreDetail: 'simple', selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'dorian' });
    render(<Explore />);
    const picker = screen.getByTestId('scale-picker') as HTMLSelectElement;
    expect(picker.value).toBe('dorian');
    expect(picker.options[0].text).toBe('Dorian');
    expect(screen.getByTestId('key-summary').textContent).toContain('A Dorian · one sharp');
  });

  it('the strip numbers the notes 1–7, the chords are the In key row only, the detail is trimmed with a way back', () => {
    useAppStore.setState({ exploreDetail: 'simple', selectedKey: { natural: 'A', accidental: '' }, selectedScale: 'natural_minor' });
    render(<Explore />);
    const degrees = [...document.querySelectorAll('.strip-degree')].map((d) => d.textContent);
    // The degrees as Full writes them (no degree names): A minor's 3rd, 6th and 7th are ♭.
    expect(degrees).toEqual(['1', '2', '♭3', '4', '5', '♭6', '♭7', '1']);
    expect(document.querySelector('.strip-fn')).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
    fireEvent.click(screen.getAllByRole('button', { name: /E minor chord|E Minor chord/i })[0]);
    const detail = screen.getByTestId('chord-detail');
    expect(within(detail).getByRole('button', { name: /Chord/ })).toBeTruthy();
    expect(within(detail).getByRole('button', { name: /Arpeggio/ })).toBeTruthy();
    expect(within(detail).queryByText('Formula')).toBeNull();
    expect(within(detail).queryByRole('radiogroup')).toBeNull();
    expect(screen.queryByTestId('chord-role')).toBeNull();
    expect(within(detail).getByText('Learn about this')).toBeTruthy();
    fireEvent.click(within(detail).getByTestId('see-everything'));
    expect(useAppStore.getState().exploreDetail).toBe('full');
    expect(useAppStore.getState().selectedChord?.root.natural).toBe('E');
    expect(screen.getByRole('tablist')).toBeTruthy();
  });

  it('the Simple / Full Segment in the header switches the view; Compare is left out of Simple', () => {
    useAppStore.setState({ exploreDetail: 'simple' });
    render(<Explore />);
    const seg = screen.getByRole('radiogroup', { name: 'How much to show' });
    expect(within(seg).getByRole('radio', { name: 'Simple' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
    expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram']);
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    fireEvent.click(within(seg).getByRole('radio', { name: 'Full' }));
    expect(useAppStore.getState().exploreDetail).toBe('full');
  });

  // The seat's decision 2 (2026-11-10): Full on a phone has a visible way
  // back too — "Simple view" in the "⋯", in the slot Simple's "Full view" has.
  it('a phone: Full\'s "⋯" offers Simple view, Simple\'s offers Full view; the word list switches too', () => {
    const original = window.matchMedia;
    window.matchMedia = phoneMedia(true);
    try {
      useAppStore.setState({ exploreDetail: undefined });
      render(<Explore />);
      expect(screen.queryByRole('radiogroup', { name: 'How much to show' })).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
      expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram', 'Compare scales', 'Simple view']);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Simple view' }));
      expect(useAppStore.getState().exploreDetail).toBe('simple');
      fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
      expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual(['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram', 'Full view']);
      fireEvent.click(screen.getByRole('menuitem', { name: 'Full view' }));
      expect(useAppStore.getState().exploreDetail).toBe('full');
      // The word list's own switch still works both ways.
      fireEvent.click(screen.getByTestId('words-open'));
      const sheet = screen.getByRole('dialog', { name: 'Words on this screen' });
      fireEvent.click(within(sheet).getByRole('radio', { name: 'Simple' }));
      expect(useAppStore.getState().exploreDetail).toBe('simple');
      fireEvent.click(within(sheet).getByRole('radio', { name: 'Full' }));
      expect(useAppStore.getState().exploreDetail).toBe('full');
    } finally {
      window.matchMedia = original;
    }
  });

  it.each([
    // [room for the Simple / Full switch, view, the "⋯" exactly]
    [true, 'simple', ['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram', 'Practise on the guitar']],
    [true, 'full', ['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram', 'Compare scales', 'Practise on the guitar']],
    [false, 'simple', ['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram', 'Practise on the guitar', 'Full view']],
    [false, 'full', ['Copy scale summary to clipboard', 'Copy link', 'Print scale diagram', 'Compare scales', 'Practise on the guitar', 'Simple view']],
  ] as const)('the "⋯" with room for the switch: %s, in %s view', (room, detail, items) => {
    const original = window.matchMedia;
    window.matchMedia = phoneMedia(!room);
    try {
      useAppStore.setState({ exploreDetail: detail });
      render(<ExploreHeader onPractise={() => {}} />);
      expect(screen.queryAllByRole('radiogroup', { name: 'How much to show' })).toHaveLength(room ? 1 : 0);
      fireEvent.click(screen.getByRole('button', { name: 'Scale actions' }));
      expect(screen.getAllByRole('menuitem').map((m) => m.textContent)).toEqual([...items]);
      const other = detail === 'simple' ? 'full' : 'simple';
      if (!room) {
        fireEvent.click(screen.getByRole('menuitem', { name: other === 'full' ? 'Full view' : 'Simple view' }));
        expect(useAppStore.getState().exploreDetail).toBe(other);
      }
    } finally {
      window.matchMedia = original;
    }
  });

  it('"Simple view" in PT and ES', async () => {
    expect(i18n.t('simpleView.menuSimple', { lng: 'en' })).toBe('Simple view');
    expect(i18n.t('simpleView.menuSimple', { lng: 'pt' })).toBe('Vista simples');
    expect(i18n.t('simpleView.menuSimple', { lng: 'es' })).toBe('Vista sencilla');
  });

  it('the dock read-out names a note by its number, not its degree name', () => {
    const t = i18n.t.bind(i18n) as (k: string, o?: Record<string, unknown>) => string;
    const input = { focus: { pc: 11, midi: 71, source: 'staff' as const }, scale: buildScale({ natural: 'C', accidental: '' }, 'major'), chord: null, spellPitchClass: () => ({ natural: 'B' as const, accidental: '' as const }), t };
    expect(readoutParts(input).keyRole).toBe('leading note of C Major');
    expect(readoutParts({ ...input, simple: true }).keyRole).toBe('note 7 of C Major');
  });
});

// Final review (2026-11-10): "Words on this screen" lists only what is shown;
// a hidden, folded or inert copy, and the glossary's own panel, never count
// (mutations of each survived the suite).
describe('the words on this screen', () => {
  it('skip hidden, folded and inert words and the glossary panel; each word once, in reading order', () => {
    document.body.innerHTML = `
      <span data-term="keySignature"></span>
      <div hidden><span data-term="tonic"></span></div>
      <div data-folded><span data-term="dominant"></span></div>
      <div inert><span data-term="mediant"></span></div>
      <div data-glossary><span data-term="triad"></span></div>
      <span data-term="relativeKey keySignature"></span>
      <span data-term="notAWord"></span>`;
    try {
      expect(visibleTermIds()).toEqual(['keySignature', 'relativeKey']);
    } finally {
      document.body.innerHTML = '';
    }
  });
});
