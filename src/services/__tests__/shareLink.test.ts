import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import i18n from '../../i18n/index';
import { useAppStore } from '../../state/store';
import { useToastStore } from '../../state/toastStore';
import { registerWorkInProgress } from '../workInProgress';
import { readShareParams, buildShareUrl, MAX_SHARE_VALUE_LENGTH, type RawShareParams } from '../../state/shareParams';
import { parseShareLink, parseShareKey, isEmptyTarget } from '../shareLinkParse';
import {
  openShareLink,
  applyShareTarget,
  describeShareTarget,
  heldShareTarget,
  resetShareLinkOpen,
  HELD_LINK_POLL_MS,
} from '../shareLinkOpen';
import { chordLinkSymbol, exploreLinkValues, exploreLinkUrl, lessonLinkUrl } from '../shareLinkMake';
import { CHORD_SYMBOLS, buildChord } from '../../core/constants/chords';
import { parseChordSymbol, chordFromParsed } from '../../core/utils/chordParser';
import { SCALE_GROUPS } from '../../components/navigation/keyChoice';
import { MODULE_INDEX } from '../../data/moduleIndex';
import { noteToString, type ChordQuality, type Note, type NaturalNote } from '../../core/types/music';

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
/** Every root spelling the key picker / circle / store can hold. */
const ROOTS: Note[] = LETTERS.flatMap((natural) => (['', '#', 'b'] as const).map((accidental) => ({ natural, accidental })));
const SCALES = SCALE_GROUPS.flatMap((g) => g.options);
const SAMPLE_SCALES = ['major', 'natural_minor', 'harmonic_minor', 'dorian', 'pentatonic_minor', 'blues', 'whole_tone', 'altered', 'hirajoshi'] as const;
const SAMPLE_CHORDS = ['', 'm', '7', 'maj7', 'm7b5', 'dim7', 'sus4', 'add9', '7#9', '13b9'];

const snapshot = () => {
  const s = useAppStore.getState();
  return JSON.stringify({
    key: s.selectedKey, scale: s.selectedScale, chord: s.selectedChord, inst: s.instrument,
    view: s.view, lastView: s.lastView, pending: s.pendingLearnTarget, deg: s.selectedDegree,
  });
};

const searchOf = (url: string) => new URL(url).search;

beforeEach(() => {
  useAppStore.setState({
    selectedKey: { natural: 'C', accidental: '' },
    selectedScale: 'major',
    selectedChord: null,
    instrument: 'piano',
    view: 'explore',
    lastView: 'explore',
    pendingLearnTarget: null,
    lessonLoan: null,
  });
  useToastStore.setState({ toasts: [] });
  resetShareLinkOpen();
});

afterEach(() => {
  resetShareLinkOpen();
  vi.useRealTimers();
});

describe('parse ⇄ build round trip', () => {
  it('every root spelling × a sample of scales × a sample of chords × both instruments', () => {
    let n = 0;
    for (const root of ROOTS) {
      for (const scale of SAMPLE_SCALES) {
        for (const suffix of SAMPLE_CHORDS) {
          for (const instrument of ['piano', 'guitar'] as const) {
            const chord = chordFromParsed(parseChordSymbol(`${noteToString(root)}${suffix}`)!);
            const url = buildShareUrl('https://fermata.test', exploreLinkValues({ selectedKey: root, selectedScale: scale, selectedChord: chord, instrument }));
            const back = parseShareLink(readShareParams(searchOf(url)));
            expect(back.key).toEqual(root);
            expect(back.scale).toBe(scale);
            expect(back.inst).toBe(instrument);
            expect(back.chord && noteToString(back.chord.root)).toBe(noteToString(chord.root));
            expect(back.chord?.quality).toBe(chord.quality);
            expect(back.chord?.notes.map(noteToString)).toEqual(chord.notes.map(noteToString));
            n++;
          }
        }
      }
    }
    expect(n).toBe(21 * SAMPLE_SCALES.length * SAMPLE_CHORDS.length * 2);
  });

  it('every scale of the Scale picker reads back', () => {
    for (const scale of SCALES) {
      const url = buildShareUrl('https://fermata.test', { key: 'D', scale });
      expect(parseShareLink(readShareParams(searchOf(url))).scale).toBe(scale);
    }
    expect(SCALES).toHaveLength(37);
  });

  it('every chord quality on every root gets a symbol that reads back as exactly that chord', () => {
    for (const quality of Object.keys(CHORD_SYMBOLS) as ChordQuality[]) {
      for (const root of ROOTS) {
        const chord = buildChord(root, quality);
        const symbol = chordLinkSymbol(chord);
        expect(symbol, `${noteToString(root)} ${quality}`).not.toBeNull();
        const back = chordFromParsed(parseChordSymbol(symbol!)!);
        expect(back.quality, symbol!).toBe(quality);
        expect(back.notes.map(noteToString), symbol!).toEqual(chord.notes.map(noteToString));
      }
    }
    // 7#5 reads as aug7 (same notes, other name): the link writes 7(#5).
    expect(chordLinkSymbol(buildChord({ natural: 'G', accidental: '' }, 'dominant7sharp5'))).toBe('G7(#5)');
  });

  it('slash chords and the algorithmic chords the search box makes', () => {
    for (const sym of ['G/B', 'Am7/G', 'D/F#', 'Cmaj7/E', 'C7b9#11', 'Dm9b5', 'F#m7b5']) {
      const chord = chordFromParsed(parseChordSymbol(sym)!);
      const link = chordLinkSymbol(chord);
      expect(link, sym).not.toBeNull();
      const back = parseShareLink({ chord: link! }).chord!;
      expect(back.notes.map(noteToString), sym).toEqual(chord.notes.map(noteToString));
      expect(back.bassNote && noteToString(back.bassNote)).toBe(chord.bassNote && noteToString(chord.bassNote));
    }
  });

  it('a lesson link names every lesson of the index', () => {
    for (const m of MODULE_INDEX) {
      const t = parseShareLink(readShareParams(searchOf(lessonLinkUrl(m.id, 'https://fermata.test'))));
      expect(t.lesson).toEqual({ levelId: m.level, unitId: m.unitId, moduleId: m.id });
    }
  });

  it('the Explore link uses the page’s own origin and what is on screen', () => {
    useAppStore.setState({ selectedKey: { natural: 'D', accidental: '' }, selectedScale: 'major', instrument: 'guitar', selectedChord: buildChord({ natural: 'A', accidental: '' }, 'major') });
    expect(exploreLinkUrl('https://fermata.test')).toBe('https://fermata.test/?key=D&scale=major&chord=A&inst=guitar');
    useAppStore.setState({ selectedChord: null });
    expect(exploreLinkUrl()).toBe(`${window.location.origin}/?key=D&scale=major&inst=guitar`);
  });

  it('the key reads leniently (lower case, ♯ ♭) but nothing outside the store’s spellings', () => {
    expect(parseShareKey('f♯')).toEqual({ natural: 'F', accidental: '#' });
    expect(parseShareKey('B♭')).toEqual({ natural: 'B', accidental: 'b' });
    expect(parseShareKey('e')).toEqual({ natural: 'E', accidental: '' });
    for (const bad of ['C##', 'Cbb', 'H', 'Do', 'C#m', 'C b', '']) expect(parseShareKey(bad), bad).toBeNull();
  });

  // Final review (2026-11-10): the parsers cap each value themselves, not only
  // readShareParams (a value padded to a valid key once trimmed).
  it('a value over the length cap is refused by the parser itself', () => {
    const padded = (n: number, v: string) => `${' '.repeat(n - v.length)}${v}`;
    expect(parseShareKey(padded(MAX_SHARE_VALUE_LENGTH, 'D'))).toEqual({ natural: 'D', accidental: '' });
    expect(parseShareKey(padded(MAX_SHARE_VALUE_LENGTH + 1, 'D'))).toBeNull();
  });
});

/** Invalid, oversized and hostile values: each ignored, the store untouched. */
const FUZZ: { name: string; raw: Record<string, unknown> }[] = [
  { name: 'script tags', raw: { key: '<script>alert(1)</script>', scale: '<img src=x onerror=alert(1)>', chord: '<script>', inst: '<b>', lesson: '"><svg onload=alert(1)>' } },
  { name: 'very long strings', raw: { key: 'C'.repeat(10_000), scale: 'major'.repeat(500), chord: `C${'7'.repeat(5_000)}`, lesson: `l1u1m1${'0'.repeat(999)}` } },
  { name: 'unknown ids', raw: { scale: 'superlocrian', inst: 'banjo', lesson: 'l99u1m1', chord: 'Cblah', key: 'H' } },
  { name: 'prototype names', raw: { key: '__proto__', scale: 'constructor', chord: 'toString', inst: 'hasOwnProperty', lesson: '__proto__' } },
  { name: 'wrong types', raw: { key: 7, scale: ['major'], chord: { root: 'C' }, inst: true, lesson: null } },
  { name: 'empty and blank', raw: { key: '', scale: ' ', chord: '   ', inst: '', lesson: '' } },
  { name: 'near misses', raw: { key: 'C##', scale: 'Major', chord: 'C/', inst: 'Piano', lesson: 'L2U7M5' } },
  { name: 'scales outside the picker', raw: { scale: 'dominant7sharp5flat9' } },
  { name: 'control characters and URLs', raw: { key: 'C\u0000', chord: 'javascript:alert(1)', lesson: 'https://evil.test/l2u7m5', scale: 'major\n' + 'x' } },
];

describe('hostile and broken links', () => {
  for (const { name, raw } of FUZZ) {
    it(`${name}: nothing valid, nothing applied, one “could not be read” line`, async () => {
      const target = parseShareLink(raw as RawShareParams);
      expect(isEmptyTarget(target)).toBe(true);
      const before = snapshot();
      await expect(openShareLink(raw as RawShareParams)).resolves.toBe('unreadable');
      expect(snapshot()).toBe(before);
      expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([i18n.t('share.unreadable')]);
    });
  }

  it('a raw query of hostile values reads, parses and applies nothing', async () => {
    const before = snapshot();
    const raw = readShareParams(`?key=%3Cscript%3E&scale=${encodeURIComponent('<img onerror=x>')}&chord=${'C7'.repeat(40)}&lesson=..%2F..%2Fetc`);
    await openShareLink(raw);
    expect(snapshot()).toBe(before);
  });

  it('valid parts apply, invalid ones are ignored', async () => {
    await openShareLink({ key: 'D', scale: 'nonsense', chord: 'A', inst: 'banjo' });
    const s = useAppStore.getState();
    expect(s.selectedKey).toEqual({ natural: 'D', accidental: '' });
    expect(s.selectedScale).toBe('major'); // kept
    expect(s.selectedChord?.root).toEqual({ natural: 'A', accidental: '' });
    expect(s.instrument).toBe('piano'); // kept
  });

  it('openShareLink(null) never throws', async () => {
    await expect(openShareLink(null)).resolves.toBe('unreadable');
  });
});

describe('applying a link', () => {
  it('“D major, the A chord, on guitar” opens exactly that in Explore', async () => {
    useAppStore.setState({ view: 'learn', lastView: 'learn' });
    await expect(openShareLink({ key: 'D', scale: 'major', chord: 'A', inst: 'guitar' })).resolves.toBe('applied');
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedKey).toEqual({ natural: 'D', accidental: '' });
    expect(s.selectedScale).toBe('major');
    expect(s.selectedChord && noteToString(s.selectedChord.root) + s.selectedChord.quality).toBe('Amajor');
    expect(s.instrument).toBe('guitar');
  });

  it('keeps the link’s spelling (scale set before key: no respelling)', async () => {
    await openShareLink({ key: 'Db', scale: 'natural_minor' });
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'D', accidental: 'b' });
    expect(useAppStore.getState().selectedScale).toBe('natural_minor');
  });

  it('a lesson link opens that lesson (openLearnTarget) and sets only the instrument beside it', async () => {
    const before = useAppStore.getState().selectedKey;
    await openShareLink({ lesson: 'l2u7m5', key: 'F#', inst: 'guitar' });
    const s = useAppStore.getState();
    expect(s.view).toBe('learn');
    expect(s.lastView).toBe('learn');
    expect(s.pendingLearnTarget).toEqual({ levelId: 'l2', unitId: 'u7', moduleId: 'l2u7m5' });
    expect(s.instrument).toBe('guitar');
    expect(s.selectedKey).toEqual(before);
  });

  it('an instrument alone changes only the instrument (the boot view stays)', () => {
    useAppStore.setState({ view: 'drill' });
    applyShareTarget({ inst: 'guitar' });
    expect(useAppStore.getState().view).toBe('drill');
    expect(useAppStore.getState().instrument).toBe('guitar');
  });

  it('leaving a lesson first: its borrowed selection does not land on top of the link’s', () => {
    // A lesson has borrowed the instrument (lessonInstrument.ts): the screen shows
    // the lesson's selection, Explore's own is on loan.
    useAppStore.setState({ view: 'learn', lessonLoan: { key: { natural: 'G', accidental: '' }, scale: 'major' }, selectedKey: { natural: 'E', accidental: '' } });
    applyShareTarget(parseShareLink({ key: 'Bb', scale: 'dorian' }));
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedKey).toEqual({ natural: 'B', accidental: 'b' });
    expect(s.selectedScale).toBe('dorian');
  });

  it('describes the target in the learner’s language', async () => {
    const t = parseShareLink({ key: 'D', scale: 'major', chord: 'A', inst: 'guitar' });
    expect(describeShareTarget(t)).toBe('D Major, the A chord, on the guitar');
    await i18n.changeLanguage('pt');
    try {
      expect(describeShareTarget(t)).toBe('D maior, o acorde A, na guitarra');
      expect(describeShareTarget(parseShareLink({ inst: 'piano' }))).toBe('o piano');
    } finally {
      await i18n.changeLanguage('en');
    }
    expect(describeShareTarget(parseShareLink({ lesson: 'l1u3m1' }))).toBe('the lesson “The Major Scale”');
    expect(describeShareTarget(parseShareLink({ key: 'F#', chord: 'C#m7' }))).toBe('F♯ Major, the C♯m7 chord');
  });
});

describe('work in progress: a link never discards it', () => {
  let busy = true;
  let unregister: () => void = () => {};
  beforeEach(() => {
    vi.useFakeTimers();
    busy = true;
    unregister = registerWorkInProgress('test-check', () => busy);
  });
  afterEach(() => unregister());

  it('applies nothing while busy, says it will wait, then offers “Open” once free', async () => {
    useAppStore.setState({ view: 'learn', lastView: 'learn' });
    const before = snapshot();
    await expect(openShareLink({ key: 'D', scale: 'major', chord: 'A', inst: 'guitar' })).resolves.toBe('held');
    expect(snapshot()).toBe(before);
    expect(heldShareTarget()?.key).toEqual({ natural: 'D', accidental: '' });
    const toasts = () => useToastStore.getState().toasts;
    expect(toasts()).toHaveLength(1);
    expect(toasts()[0].message).toBe('This link opens D Major, the A chord, on the guitar. Fermatina will offer to open it when you have finished what you are doing.');
    expect(toasts()[0].action).toBeUndefined();

    // Still busy: nothing changes, however long.
    vi.advanceTimersByTime(HELD_LINK_POLL_MS * 4);
    expect(snapshot()).toBe(before);
    expect(toasts().some((t) => t.action)).toBe(false);

    // The check ends: the offer appears, and stays until chosen.
    busy = false;
    vi.advanceTimersByTime(HELD_LINK_POLL_MS);
    const offer = toasts().find((t) => t.action);
    expect(offer?.message).toBe('Ready to open the link: D Major, the A chord, on the guitar');
    expect(offer?.duration).toBe(0);
    expect(offer?.action?.label).toBe('Open');
    // The "will offer" line has gone: the offer replaces it (final review).
    expect(toasts().map((t) => t.message)).toEqual(['Ready to open the link: D Major, the A chord, on the guitar']);
    expect(snapshot()).toBe(before);

    offer!.action!.onSelect();
    const s = useAppStore.getState();
    expect(s.view).toBe('explore');
    expect(s.selectedKey).toEqual({ natural: 'D', accidental: '' });
    expect(s.instrument).toBe('guitar');
    expect(heldShareTarget()).toBeNull();
  });

  // After review (2026-11-10): the held-link toasts in PT and ES say what
  // happens — the link waits, then an "Abrir" button is offered; nothing opens by itself.
  it.each([
    ['pt', 'Esta ligação abre D maior, o acorde A, na guitarra. Quando terminares o que estás a fazer, a Fermatina propõe-te abri-la.', 'Já podes abrir a ligação: D maior, o acorde A, na guitarra'],
    ['es', 'Este enlace abre D mayor, el acorde A, en la guitarra. Cuando termines lo que estás haciendo, Fermatina te propondrá abrirlo.', 'Ya puedes abrir el enlace: D mayor, el acorde A, en la guitarra'],
  ])('in %s, the waiting and the offer say what happens', async (lang, waiting, ready) => {
    await i18n.changeLanguage(lang);
    try {
      await openShareLink({ key: 'D', scale: 'major', chord: 'A', inst: 'guitar' });
      expect(useToastStore.getState().toasts.map((t) => t.message)).toEqual([waiting]);
      busy = false;
      vi.advanceTimersByTime(HELD_LINK_POLL_MS);
      const offer = useToastStore.getState().toasts.find((t) => t.action);
      expect(offer?.message).toBe(ready);
      expect(offer?.action?.label).toBe('Abrir');
    } finally {
      await i18n.changeLanguage('en');
    }
  });

  it('“Open” while work has started again waits again', async () => {
    await openShareLink({ lesson: 'l2u7m5' });
    busy = false;
    vi.advanceTimersByTime(HELD_LINK_POLL_MS);
    const offer = useToastStore.getState().toasts.find((t) => t.action)!;
    busy = true;
    const before = snapshot();
    offer.action!.onSelect();
    expect(snapshot()).toBe(before);
    expect(heldShareTarget()?.lesson?.moduleId).toBe('l2u7m5');
  });

  it('a lesson link during a check does not open the lesson (which would drop the check)', async () => {
    useAppStore.setState({ view: 'learn', lastView: 'learn' });
    await openShareLink({ lesson: 'l3u9m1' });
    expect(useAppStore.getState().pendingLearnTarget).toBeNull();
  });

  it('a source whose check throws counts as busy (the safe side)', async () => {
    unregister();
    unregister = registerWorkInProgress('test-throw', () => { throw new Error('corrupt'); });
    await expect(openShareLink({ key: 'D' })).resolves.toBe('held');
  });
});

// After review (2026-11-10): a hand-typed `#` is read as part of a key or
// chord only when that makes a valid one; a real fragment after a valid value
// (`?chord=A#intro`) no longer wipes the value out.
describe('a fragment after a key or chord', () => {
  const read = (search: string, hash: string) => [readShareParams(search, hash), readShareParams(search)] as const;

  it('a fragment that is not part of the chord leaves the chord as typed', () => {
    const [raw, plain] = read('?key=D&chord=A', '#intro');
    expect(raw?.chord).toBe('A#intro');
    const t = parseShareLink(raw, plain);
    expect(t.key).toEqual({ natural: 'D', accidental: '' });
    expect(t.chord?.root).toEqual({ natural: 'A', accidental: '' });
    expect(t.chordSymbol).toBe('A');
  });

  it('the same for a key', () => {
    const [raw, plain] = read('?key=D', '#section');
    expect(parseShareLink(raw, plain).key).toEqual({ natural: 'D', accidental: '' });
  });

  it('a # that does make the chord or key still counts', () => {
    expect(parseShareLink(...read('?chord=C', '#m7')).chordSymbol).toBe('C#m7');
    expect(parseShareLink(...read('?key=F', '#&inst=guitar'))).toMatchObject({ key: { natural: 'F', accidental: '#' }, inst: 'guitar' });
  });

  it('an invalid value with no fragment is still ignored (no fallback invents one)', () => {
    expect(parseShareLink({ chord: 'F#xyz' }, { chord: 'F#xyz' }).chord).toBeUndefined();
    expect(parseShareLink({ chord: 'F#xyz' }).chord).toBeUndefined();
  });

  it('openShareLink applies the chord as typed', async () => {
    const [raw, plain] = read('?chord=A', '#section');
    await expect(openShareLink(raw, plain)).resolves.toBe('applied');
    expect(useAppStore.getState().selectedChord?.root).toEqual({ natural: 'A', accidental: '' });
  });
});
