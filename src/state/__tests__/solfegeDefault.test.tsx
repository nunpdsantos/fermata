/**
 * Dó-Ré-Mi on by default for a NEW Portuguese or Spanish visitor (the owner's
 * decision, 2026-11-10; integration brief 8.1): a start-screen door chosen
 * while the language is pt or es turns `showSolfege` on and saves it. Nowhere
 * else; never for an existing save; turning it off sticks.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import i18n from '../../i18n';
import { useAppStore } from '../store';
import { bootWelcome, useWelcomeStore } from '../welcomeGate';
import { chooseStartDoor } from '../startDoors';
import { setLearnerProfile } from '../learnerProfile';
import { buildBackup, applyBackup } from '../../utils/backupHelpers';
import { openShareLink, resetShareLinkOpen } from '../../services/shareLinkOpen';
import { SettingsSheet } from '../../components/layout/SettingsSheet';

const FROZEN = readFileSync(join(__dirname, 'fixtures', 'settings-v6-before-start.json'), 'utf8');
const saved = () => JSON.parse(localStorage.getItem('music-theory-app') ?? '{"state":{}}').state as Record<string, unknown>;
const on = () => useAppStore.getState().showSolfege;

/** A first visit as boot sees it: empty storage, then the gate opens, in `lang`. */
function newVisitor(lang: string) {
  localStorage.clear();
  useWelcomeStore.setState({ open: false, shownThisPage: false });
  expect(bootWelcome(localStorage)).toBe(true);
  useAppStore.setState({ language: lang, showSolfege: false, learnerProfile: null, startHint: null, view: 'explore' });
}

beforeEach(() => {
  localStorage.clear();
  useAppStore.setState({ showSolfege: false, language: 'en', learnerProfile: null, startHint: null, view: 'explore', lastView: 'explore' });
});
afterEach(async () => {
  cleanup();
  resetShareLinkOpen();
  await i18n.changeLanguage('en');
});

describe('a door chosen on the start screen', () => {
  for (const door of ['new', 'player', 'theory'] as const) {
    it.each([['pt', true], ['es', true], ['en', false]] as const)(`"${door}" in %s: Dó-Ré-Mi %s`, (lang, expected) => {
      newVisitor(lang);
      chooseStartDoor(door, 'piano', localStorage);
      expect(on()).toBe(expected);
      if (expected) expect(saved().showSolfege).toBe(true);
      else expect(saved()).not.toHaveProperty('showSolfege');
    });
  }
});

describe('never anywhere else', () => {
  it('not on boot: a new visitor in PT before any door, and a PT save from before it', async () => {
    newVisitor('pt');
    useAppStore.setState({ instrument: 'guitar' }); // the start screen's own writes
    expect(on()).toBe(false);
    expect(saved()).not.toHaveProperty('showSolfege');
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'pt' }, version: 6 }));
    await useAppStore.persist.rehydrate();
    expect(on()).toBe(false);
  });

  it('not on a language change (to PT, to ES)', () => {
    useAppStore.getState().setLanguage('pt');
    expect(on()).toBe(false);
    useAppStore.getState().setLanguage('es');
    expect(on()).toBe(false);
    expect(saved()).not.toHaveProperty('showSolfege');
  });

  it('not when "How I use Fermata" is changed later in Settings (PT)', async () => {
    useAppStore.setState({ language: 'pt', learnerProfile: 'theory' });
    await act(async () => { await i18n.changeLanguage('pt'); });
    render(<SettingsSheet open onClose={() => {}} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Toco, sem teoria' }));
    expect(useAppStore.getState().learnerProfile).toBe('player');
    expect(on()).toBe(false);
    expect(saved()).not.toHaveProperty('showSolfege');
  });

  it('not on a share link opened in PT', async () => {
    useAppStore.setState({ language: 'pt' });
    await openShareLink({ key: 'D', scale: 'major', chord: 'A', inst: 'guitar' });
    expect(useAppStore.getState().instrument).toBe('guitar'); // the link did open
    expect(on()).toBe(false);
  });

  it('not on a backup import (a PT save without the field)', async () => {
    localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'pt', learnerProfile: 'new' }, version: 6 }));
    const backup = buildBackup(localStorage);
    localStorage.clear();
    applyBackup(backup, localStorage);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().language).toBe('pt');
    expect(on()).toBe(false);
  });

  it("the owner's frozen v6 save (PT): off, and the field is never written", async () => {
    localStorage.setItem('music-theory-app', FROZEN);
    await useAppStore.persist.rehydrate();
    useAppStore.getState().setLanguage('es');
    useAppStore.getState().setLanguage('pt');
    setLearnerProfile('player');
    expect(on()).toBe(false);
    expect(saved()).not.toHaveProperty('showSolfege');
  });
});

describe('turning it off sticks', () => {
  it('after a reload, a profile change in Settings and a language switch away and back', async () => {
    newVisitor('pt');
    chooseStartDoor('player', 'guitar', localStorage);
    expect(on()).toBe(true);
    useAppStore.getState().setShowSolfege(false);
    expect(saved()).not.toHaveProperty('showSolfege');
    const save = localStorage.getItem('music-theory-app')!;
    // A reload: a new page starts from the store's initial state, then reads the save.
    useAppStore.setState(useAppStore.getInitialState(), true);
    localStorage.setItem('music-theory-app', save);
    await useAppStore.persist.rehydrate();
    expect(on()).toBe(false);
    setLearnerProfile('new');
    expect(on()).toBe(false);
    useAppStore.getState().setLanguage('en');
    useAppStore.getState().setLanguage('pt');
    expect(on()).toBe(false);
    expect(saved()).not.toHaveProperty('showSolfege');
  });
});
