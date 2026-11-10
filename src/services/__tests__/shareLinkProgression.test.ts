/**
 * Share links, wave 2 (stream S): `prog` (chord symbols, commas, at most 16,
 * its own length limit), `bpm` (50–200, only beside prog) and `capo` (0–9).
 * Every value through the app's own parsers; anything invalid ignored;
 * hostile input never breaks the app. "Copy link" with the panel open
 * carries the progression; a link with `prog` opens Explore with the panel
 * open and never replaces a saved progression silently.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAppStore } from '../../state/store';
import { buildShareSearch, cleanedAddress, readShareParams, MAX_PROG_LENGTH, MAX_SHARE_VALUE_LENGTH } from '../../state/shareParams';
import { parseShareLink, parseShareProgression, parseShareBpm, parseShareCapo, isEmptyTarget } from '../shareLinkParse';
import { applyShareTarget, describeShareTarget, resetShareLinkOpen } from '../shareLinkOpen';
import { exploreLinkValues, exploreLinkUrl } from '../shareLinkMake';
import { getProgressionRequest, clearProgressionRequest } from '../../state/progressionRequest';
import { getCapoFret, setCapoFret } from '../../state/capo';
import { openProgressionPanel, resetProgressionPanel, getProgressionOffer, isProgressionPanelOpen } from '../../state/progressionPanel';
import { applyProgressionRequest } from '../../components/explore/progressionRequestApply';

const link = (search: string, hash = '') => parseShareLink(readShareParams(search, hash), readShareParams(search));

beforeEach(() => {
  resetShareLinkOpen();
  resetProgressionPanel();
  clearProgressionRequest();
  setCapoFret(0);
  useAppStore.setState({ view: 'explore', progression: undefined, selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, instrument: 'guitar' });
});
afterEach(() => {
  setCapoFret(0);
  useAppStore.setState({ progression: undefined });
});

describe('reading prog, bpm, capo', () => {
  it('G,D,Em,C with a tempo and a capo', () => {
    expect(link('?key=G&scale=major&prog=G,D,Em,C&bpm=96&capo=3')).toMatchObject({ prog: ['G', 'D', 'Em', 'C'], bpm: 96, capo: 3 });
    expect(link('?prog=G%2CD%2CEm')).toMatchObject({ prog: ['G', 'D', 'Em'] });
  });
  it('a # in a hand-typed prog (F#m) is recovered from the fragment', () => {
    expect(link('?prog=D,F', '#m,G&bpm=80')).toMatchObject({ prog: ['D', 'F#m', 'G'], bpm: 80 });
    expect(cleanedAddress('/', '?prog=D,F', '#m,G&bpm=80')).toBe('/');
  });
  it('invalid symbols are left out, the valid ones kept; nothing valid → no prog', () => {
    expect(parseShareProgression('G,banana,,D, Em ,H7')).toEqual(['G', 'D', 'Em']);
    expect(parseShareProgression(',,,')).toBeNull();
    expect(parseShareProgression('<script>alert(1)</script>')).toBeNull();
    // A comma inside parentheses is not a separator (the parser does not read this chord: only F is kept).
    expect(parseShareProgression('C7(b9,#11),F')).toEqual(['F']);
    expect(parseShareProgression('C7(b9,G),F')).toEqual(['F']);
  });
  it('at most 16 chords; a value over its own limit is not read; the shared limit would have cut a real one', () => {
    const twenty = Array(20).fill('Am7').join(',');
    expect(twenty.length).toBeGreaterThan(MAX_SHARE_VALUE_LENGTH);
    expect(link(`?prog=${twenty}`).prog).toHaveLength(16);
    expect(readShareParams(`?prog=${'C,'.repeat(MAX_PROG_LENGTH)}`)).toEqual({});
    expect(link(`?prog=${','.repeat(5000)}G`)).toEqual({});
  });
  it('bpm: whole numbers 50–200, only with prog; capo: 0–9', () => {
    for (const bad of ['49', '201', '90.5', '1e2', ' ', '-90', '0x5A', '９０']) expect(parseShareBpm(bad), bad).toBeNull();
    expect(parseShareBpm('50')).toBe(50);
    expect(parseShareBpm('200')).toBe(200);
    expect(link('?bpm=100')).toEqual({});
    expect(link('?key=G&bpm=100')).toEqual({ key: { natural: 'G', accidental: '' } });
    for (const bad of ['10', '-1', '3.5', 'three', '']) expect(parseShareCapo(bad), bad).toBeNull();
    expect(parseShareCapo('0')).toBe(0);
    expect(link('?capo=9')).toEqual({ capo: 9 });
    expect(isEmptyTarget(link('?capo=0'))).toBe(false);
  });
  it('hostile input never throws', () => {
    const nasty = ['?prog=' + encodeURIComponent('"><img src=x onerror=alert(1)>'), '?prog=' + '('.repeat(300), '?prog=%E0%A4%A', '?prog=' + 'G'.repeat(399), '?capo=' + '9'.repeat(60), '?bpm=' + '1'.repeat(60) + '&prog=C'];
    for (const n of nasty) expect(() => link(n), n).not.toThrow();
    expect(link(nasty[0])).toEqual({});
  });
});

describe('making the link', () => {
  const state = () => useAppStore.getState();
  it('with the panel closed nothing changes (key, scale, chord, instrument)', () => {
    expect(buildShareSearch(exploreLinkValues(state()))).toBe('?key=C&scale=major&inst=guitar');
  });
  it('with the panel open: prog with readable commas, bpm, and the capo when one is on (no chord)', () => {
    const progression = { chords: ['G', 'D', 'Em', 'F#m7'], bpm: 96, beats: 4 as const };
    expect(buildShareSearch(exploreLinkValues(state(), { progression, capo: 3 }))).toBe('?key=C&scale=major&inst=guitar&prog=G,D,Em,F%23m7&bpm=96&capo=3');
    expect(buildShareSearch(exploreLinkValues(state(), { progression, capo: 0 }))).toBe('?key=C&scale=major&inst=guitar&prog=G,D,Em,F%23m7&bpm=96');
  });
  it('exploreLinkUrl reads the open panel, the saved progression and the capo', () => {
    useAppStore.getState().setProgression({ chords: ['A', 'E'], bpm: 70, beats: 2 });
    setCapoFret(2);
    expect(exploreLinkUrl('https://x.test')).toBe('https://x.test/?key=C&scale=major&inst=guitar');
    openProgressionPanel();
    expect(exploreLinkUrl('https://x.test')).toBe('https://x.test/?key=C&scale=major&inst=guitar&prog=A,E&bpm=70&capo=2');
  });
  it('the link it makes reads back as the same progression', () => {
    const progression = { chords: ['Bb', 'F/A', 'Gm7', 'Eb', 'C7(#5)'], bpm: 132, beats: 2 as const };
    const url = new URL(`https://x.test/${buildShareSearch(exploreLinkValues(state(), { progression, capo: 1 }))}`);
    expect(link(url.search)).toMatchObject({ prog: progression.chords, bpm: 132, capo: 1 });
  });
});

describe('opening the link', () => {
  it('capo is applied with setCapoFret; prog asks Explore for the panel with the chords and tempo', () => {
    useAppStore.setState({ view: 'learn' });
    applyShareTarget(link('?key=G&scale=major&prog=G,D,Em,C&bpm=96&capo=3'));
    expect(getCapoFret()).toBe(3);
    expect(useAppStore.getState().view).toBe('explore');
    expect(useAppStore.getState().selectedKey).toEqual({ natural: 'G', accidental: '' });
    expect(getProgressionRequest()).toEqual({ chords: ['G', 'D', 'Em', 'C'], bpm: 96 });
  });
  it('the toast while work is in progress names the progression and the capo', () => {
    expect(describeShareTarget(link('?prog=G,F%23m&capo=2'))).toBe('the progression G F♯m, a capo on fret 2');
  });
  it('no saved progression: the request loads the chords (through the parser) and opens the panel', async () => {
    await applyProgressionRequest({ chords: ['G', 'nonsense', 'D'], bpm: 96 });
    expect(isProgressionPanelOpen()).toBe(true);
    expect(useAppStore.getState().progression).toEqual({ chords: ['G', 'D'], bpm: 96, beats: 4 });
    expect(getProgressionOffer()).toBeNull();
  });
  it('a saved progression of the learner\'s own is never replaced silently: the chords are offered', async () => {
    useAppStore.getState().setProgression({ chords: ['A', 'E'], bpm: 70, beats: 2 });
    await applyProgressionRequest({ chords: ['G', 'D'], bpm: 96 });
    expect(useAppStore.getState().progression).toEqual({ chords: ['A', 'E'], bpm: 70, beats: 2 });
    expect(getProgressionOffer()).toEqual({ chords: ['G', 'D'], bpm: 96 });
    expect(isProgressionPanelOpen()).toBe(true);
  });
  it('the same chords again: nothing to ask; a bad tempo is ignored; no chords just opens the panel', async () => {
    useAppStore.getState().setProgression({ chords: ['G', 'D'], bpm: 70, beats: 2 });
    await applyProgressionRequest({ chords: ['G', 'D'], bpm: 999 });
    expect(getProgressionOffer()).toBeNull();
    expect(useAppStore.getState().progression).toEqual({ chords: ['G', 'D'], bpm: 70, beats: 2 });
    resetProgressionPanel();
    await applyProgressionRequest({});
    expect(isProgressionPanelOpen()).toBe(true);
    await applyProgressionRequest({ chords: Array(30).fill('C') });
    expect(useAppStore.getState().progression!.chords).toEqual(['G', 'D']);
  });
});
