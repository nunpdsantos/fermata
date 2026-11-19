/**
 * Audit fixes, 18 November 2026 (stream E): the start gate and the boot
 * address.
 *
 * A19 — a door chosen on a public page (`?start=<door>`): on a visit that
 * owes the start screen, `applyStartLinkRule` takes it through the one door
 * function, so everything a tap saves is saved; sanitised as a shared link's
 * values are; a bad value leaves the start screen to ask; saved data is never
 * re-profiled; a shared link in the same address wins.
 *
 * Q13 — a `?view=` asked for while the start screen is owed is carried
 * through it: the door the visitor chooses opens that view.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAppStore } from '../store';
import { WELCOME_KEY, bootWelcome, useWelcomeStore } from '../welcomeGate';
import { chooseStartDoor } from '../startDoors';
import { START_DOORS, carryViewRequest, takeViewRequest } from '../startDoors';
import { START_PARAM, applyShareLinkRule, startLinkPending } from '../startGate';
import { applyStartLink, readStartDoor } from '../startLink';
import { noteBootAddress, cleanedAddress, MAX_SHARE_SEARCH_LENGTH, MAX_SHARE_VALUE_LENGTH } from '../shareParams';
import { useStartHintStore } from '../startHint';
import i18n from '../../i18n';

const SOUND_LESSON_1 = { levelId: 'l1', unitId: 'u34', moduleId: 'l1u34m1' };

beforeEach(async () => {
  localStorage.clear();
  takeViewRequest();
  useAppStore.setState({
    view: 'explore', lastView: 'explore', instrument: 'piano', learnerProfile: null, startHint: null,
    showSolfege: false, language: 'en', selectedChord: null, pendingLearnTarget: null,
  });
  await i18n.changeLanguage('en');
  useStartHintStore.setState({ shown: null });
  useWelcomeStore.setState({ open: false, shownThisPage: false });
  // Setting the store's state writes the settings save: a first visit starts from nothing.
  localStorage.clear();
});

/**
 * Boot as main.tsx does, at this address: the gate, the shared-link rule,
 * then — only when `startLinkPending` says so — the lazy start-link module
 * (fetched as main.tsx fetches it) before the first render.
 */
async function bootAt(search: string, pathname = '/', hash = '') {
  noteBootAddress(search, hash);
  bootWelcome(localStorage);
  applyShareLinkRule();
  const replaceState = vi.fn();
  const pending = startLinkPending(search);
  const door = pending ? (await import('../startLink')).applyStartLink({ pathname, search, hash }, { replaceState, state: null }) : null;
  return { door, pending, address: replaceState.mock.calls.at(-1)?.[2] as string | undefined, cleaned: replaceState.mock.calls.length };
}

/** The settings save as the persisted store writes it, timestamps out. */
const saved = () => {
  const state = JSON.parse(localStorage.getItem('music-theory-app') ?? '{}').state ?? {};
  delete state.preferencesUpdatedAt;
  return state;
};

describe('readStartDoor (sanitised as a shared link\'s values)', () => {
  it.each([
    ['?start=new', 'new'], ['?start=player', 'player'], ['?start=theory', 'theory'],
    ['?lang=pt&start=theory', 'theory'], ['?start=%20Theory%20', 'theory'], ['?start=PLAYER', 'player'],
    ['?start=theory&start=new', 'theory'], // only the first value counts
    ['?start=', null], ['?start=expert', null], ['?start=newbie', null], ['?start=new%20door', null],
    ['?lang=en', null], ['', null], ['?start', null],
    [`?start=${'n'.repeat(MAX_SHARE_VALUE_LENGTH + 1)}`, null],
    // A door padded past the length a value may have is no value of ours (trimmed, it would read as one).
    [`?start=${'%20'.repeat(MAX_SHARE_VALUE_LENGTH)}new`, null],
    [`?start=${'%20'.repeat(MAX_SHARE_VALUE_LENGTH - 3)}new`, 'new'],
    [`?start=new&x=${'a'.repeat(MAX_SHARE_SEARCH_LENGTH)}`, null], // a query this long is no link of ours
  ])('%s → %s', (search, door) => {
    expect(readStartDoor(search)).toBe(door);
  });

  it('the parameter is `start`; the doors are the start screen\'s three', async () => {
    expect(START_PARAM).toBe('start');
    expect([...START_DOORS]).toEqual(['new', 'player', 'theory']);
  });
});

describe('a door link on a first visit (A19)', () => {
  for (const door of ['new', 'player', 'theory'] as const) {
    for (const lang of ['en', 'pt', 'es'] as const) {
      it(`${door} in ${lang}: taken at boot, exactly what a tap on that door saves; the start screen is not owed`, async () => {
        // The tap, for comparison (setting the store writes the settings save: cleared after).
        useAppStore.setState({ language: lang });
        localStorage.clear();
        bootWelcome(localStorage);
        chooseStartDoor(door, 'piano');
        const tapped = { saved: saved(), view: useAppStore.getState().view, target: useAppStore.getState().pendingLearnTarget, hint: useAppStore.getState().startHint, flag: localStorage.getItem(WELCOME_KEY) };

        // The link, from an empty browser again.
        useAppStore.setState({ view: 'explore', lastView: 'explore', learnerProfile: null, startHint: null, showSolfege: false, pendingLearnTarget: null, language: lang });
        useStartHintStore.setState({ shown: null });
        localStorage.clear();
        const { door: taken, address } = await bootAt(`?start=${door}&lang=${lang}`);
        expect(taken).toBe(door);
        expect(useWelcomeStore.getState().open).toBe(false);
        expect({ saved: saved(), view: useAppStore.getState().view, target: useAppStore.getState().pendingLearnTarget, hint: useAppStore.getState().startHint, flag: localStorage.getItem(WELCOME_KEY) }).toEqual(tapped);
        expect(tapped.flag).toBe('seen');
        expect(tapped.view).toBe(door === 'new' ? 'learn' : 'explore');
        expect(tapped.target).toEqual(door === 'new' ? SOUND_LESSON_1 : null);
        expect(tapped.saved.showSolfege ?? false).toBe(lang !== 'en');
        // The address loses `start`, keeps the rest (App then cleans `lang` as before).
        expect(address).toBe(`/?lang=${lang}`);
      });
    }
  }

  it.each(['?start=expert', '?start=', `?start=${'x'.repeat(80)}`])('a bad value (%s): nothing taken, the start screen owed as on a plain visit; the address cleaned', async (search) => {
    const { door, address } = await bootAt(search);
    expect(door).toBeNull();
    expect(useWelcomeStore.getState().open).toBe(true);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    expect(useAppStore.getState().learnerProfile).toBeNull();
    expect(address).toBe('/');
  });

  it('saved data (the owner\'s kind of save, no profile): never re-profiled; his save untouched; the address cleaned', async () => {
    const settings = JSON.stringify({ state: { language: 'pt', lastView: 'learn', instrument: 'guitar' }, version: 6 });
    localStorage.setItem('music-theory-app', settings);
    for (const door of START_DOORS) {
      const { door: taken, address } = await bootAt(`?start=${door}&view=drill`);
      expect(taken).toBeNull();
      expect(useAppStore.getState().learnerProfile).toBeNull();
      expect(localStorage.getItem('music-theory-app')).toBe(settings);
      expect(localStorage.getItem(WELCOME_KEY)).toBeNull();
      expect(address).toBe('/?view=drill');
      // Nothing carried for a door: no start screen will ask.
      expect(takeViewRequest()).toBeNull();
    }
  });

  it('a flag already `seen` (a door chosen before): the link changes nothing', async () => {
    localStorage.setItem(WELCOME_KEY, 'seen');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { learnerProfile: 'new', lastView: 'learn' }, version: 6 }));
    useAppStore.setState({ learnerProfile: 'new' });
    expect((await bootAt('?start=theory')).door).toBeNull();
    expect(useAppStore.getState().learnerProfile).toBe('new');
  });

  it('`pending` with learning data since (a returning learner): not profiled', async () => {
    localStorage.setItem(WELCOME_KEY, 'pending');
    localStorage.setItem('music-theory-progress', JSON.stringify({ state: {}, version: 4 }));
    expect((await bootAt('?start=player')).door).toBeNull();
    expect(useAppStore.getState().learnerProfile).toBeNull();
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
  });

  it('`pending` with only settings (shown before, no door yet): the door is taken — the first time this visitor is profiled', async () => {
    localStorage.setItem(WELCOME_KEY, 'pending');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'en', lastView: 'explore' }, version: 6 }));
    expect((await bootAt('?start=player')).door).toBe('player');
    expect(useAppStore.getState().learnerProfile).toBe('player');
  });

  it('a shared link with a bare # and a door after it (`?chord=F#m7&start=new`): the link wins, and the address App leaves holds no `start` — a reload takes no door (review of e92e44e)', async () => {
    const { door } = await bootAt('?chord=F', '/', '#m7&start=new');
    expect(door).toBeNull();
    expect(useAppStore.getState().learnerProfile).toBeNull();
    // What App writes into the address bar (state/shareParams.ts), then the reload from it.
    const left = cleanedAddress('/', '?chord=F', '#m7&start=new');
    expect(left).toBe('/');
    expect(cleanedAddress('/', '?chord=F%23m7&start=new&lang=pt&view=drill&foo=1')).toBe('/?foo=1');
    const reload = await bootAt(new URL(left, 'https://x').search);
    expect(reload.door).toBeNull();
    expect(useAppStore.getState().learnerProfile).toBeNull();
    expect(useWelcomeStore.getState().open).toBe(true); // the plain visit after a link: the start screen asks
  });

  it('a shared link in the same address wins: nothing taken, the flag stays pending', async () => {
    const { door } = await bootAt('?lesson=l1u3m1&start=theory');
    expect(door).toBeNull();
    expect(useWelcomeStore.getState().open).toBe(false);
    expect(localStorage.getItem(WELCOME_KEY)).toBe('pending');
    expect(useAppStore.getState().learnerProfile).toBeNull();
  });

  it('an address without `start` is left alone (App cleans `view`, `lang` and a link itself)', async () => {
    expect((await bootAt('?view=drill&lang=pt', '/', '#x')).cleaned).toBe(0);
    expect(applyStartLink({ pathname: '/', search: '?lang=pt', hash: '' }, { replaceState: vi.fn(), state: null })).toBeNull();
  });

  it('the lazy module is fetched only when the address needs it: a door, or a view while the start screen is owed', async () => {
    expect((await bootAt('?start=theory')).pending).toBe(true);
    localStorage.clear();
    expect((await bootAt('?view=drill')).pending).toBe(true); // owed: a first visit
    localStorage.setItem(WELCOME_KEY, 'seen');
    expect((await bootAt('?view=drill')).pending).toBe(false); // the installed app's shortcut, for a returning learner: nothing to wait for
    expect((await bootAt('?lang=pt')).pending).toBe(false);
    expect((await bootAt('')).pending).toBe(false);
    expect((await bootAt('?start=new')).pending).toBe(true); // saved data: still fetched, so `start` leaves the address bar
  });

  it('the rest of the address survives the cleaning: other parameters, the path, the fragment', async () => {
    expect((await bootAt('?foo=1&start=theory&view=drill', '/app/', '#k')).address).toBe('/app/?foo=1&view=drill#k');
  });
});

describe('a view carried through the start screen (Q13)', () => {
  it.each([
    ['new', 'drill', 'drill', null],
    ['player', 'drill', 'drill', null],
    ['theory', 'drill', 'drill', null],
    ['new', 'learn', 'learn', SOUND_LESSON_1], // "new" keeps its lesson where the view asked for is Learn
    ['theory', 'learn', 'learn', null],
    ['new', 'explore', 'explore', null],
  ] as const)('%s with ?view=%s: opens %s', async (door, asked, view, target) => {
    const { door: taken } = await bootAt(`?view=${asked}`);
    expect(taken).toBeNull();
    expect(useWelcomeStore.getState().open).toBe(true); // the start screen still asks
    chooseStartDoor(door, 'piano');
    expect(useAppStore.getState()).toMatchObject({ view, lastView: view, learnerProfile: door, pendingLearnTarget: target });
    expect(localStorage.getItem(WELCOME_KEY)).toBe('seen');
  });

  it('taken once: a later door (none should come) goes to its own place', async () => {
    carryViewRequest('drill');
    expect(takeViewRequest()).toBe('drill');
    expect(takeViewRequest()).toBeNull();
  });

  it('an invalid ?view= carries nothing', async () => {
    await bootAt('?view=settings');
    chooseStartDoor('theory', 'piano');
    expect(useAppStore.getState().view).toBe('explore');
  });

  it('a door link with ?view=drill: the door, then Drill', async () => {
    expect((await bootAt('?start=player&view=drill')).door).toBe('player');
    expect(useAppStore.getState()).toMatchObject({ view: 'drill', learnerProfile: 'player', startHint: 'player' });
  });

  it('nothing is carried when the start screen is not owed (a returning learner)', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
    await bootAt('?view=drill');
    expect(takeViewRequest()).toBeNull();
  });
});
