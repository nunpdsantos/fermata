import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import i18n from '../index';
import { solfegeName, solfegeLanguage, withSolfege } from '../solfege';
import { useAppStore, sanitizePersistedAppState, invalidAppStateFields } from '../../state/store';
import { SettingsSheet } from '../../components/layout/SettingsSheet';
import type { Accidental, NaturalNote, Note } from '../../core/types/music';

const LETTERS: NaturalNote[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const ACCIDENTALS: Accidental[] = ['', '#', 'b', '##', 'bb'];
const GLYPH: Record<Accidental, string> = { '': '', '#': '♯', b: '♭', '##': '𝄪', bb: '𝄫' };
// Independent tables (not the module's): the syllables as the brief and the
// glossary give them.
const PT: Record<NaturalNote, string> = { C: 'Dó', D: 'Ré', E: 'Mi', F: 'Fá', G: 'Sol', A: 'Lá', B: 'Si' };
const ES: Record<NaturalNote, string> = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };

describe('solfegeName — the fixed-do name of a SPELLED note', () => {
  for (const [lang, table] of [['pt', PT], ['es', ES]] as const) {
    it(`${lang}: all 7 letters × natural, ♯, ♭, 𝄪, 𝄫`, () => {
      let n = 0;
      for (const natural of LETTERS) {
        for (const accidental of ACCIDENTALS) {
          expect(solfegeName({ natural, accidental }, lang), `${natural}${accidental}`).toBe(`${table[natural]}${GLYPH[accidental]}`);
          n++;
        }
      }
      expect(n).toBe(35);
    });
  }

  it('spelling, not pitch: E♭ is Mi♭ and D♯ is Ré♯; B♯ is Si♯, not Dó', () => {
    expect(solfegeName({ natural: 'E', accidental: 'b' }, 'pt')).toBe('Mi♭');
    expect(solfegeName({ natural: 'D', accidental: '#' }, 'pt')).toBe('Ré♯');
    expect(solfegeName({ natural: 'B', accidental: '#' }, 'pt')).toBe('Si♯');
    expect(solfegeName({ natural: 'F', accidental: 'b' }, 'es')).toBe('Fa♭');
  });

  it('none in English (or anything else); regional codes count as their language', () => {
    expect(solfegeName({ natural: 'D', accidental: '' }, 'en')).toBeNull();
    expect(solfegeName({ natural: 'D', accidental: '' }, undefined)).toBeNull();
    expect(solfegeName({ natural: 'X' as NaturalNote, accidental: '' }, 'pt')).toBeNull();
    expect(solfegeLanguage('pt-PT')).toBe('pt');
    expect(solfegeLanguage('es-ES')).toBe('es');
    expect(solfegeLanguage('en-GB')).toBeNull();
  });

  it('letter first, the fixed-do name beside it', () => {
    const d: Note = { natural: 'F', accidental: '#' };
    expect(withSolfege(d, solfegeName(d, 'pt'))).toBe('F♯ (Fá♯)');
    expect(withSolfege(d, null)).toBe('F♯');
  });
});

describe('the saved setting (music-theory-app, persist v6)', () => {
  afterEach(() => {
    localStorage.clear();
    useAppStore.setState({ showSolfege: false });
  });

  it('is off by default', () => {
    expect(useAppStore.getInitialState().showSolfege).toBe(false);
  });

  it('a frozen, production-shaped v6 save rehydrates with every field unchanged, the setting off, and is written back exactly as it was', async () => {
    const raw = readFileSync('src/state/__tests__/fixtures/app-v6-before-solfege.json', 'utf8');
    const saved = JSON.parse(raw) as { state: Record<string, unknown>; version: number };
    expect(saved.version).toBe(6);
    expect(Object.keys(saved.state)).toHaveLength(16);
    localStorage.setItem('music-theory-app', raw);
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState()).toMatchObject(saved.state);
    expect(useAppStore.getState().showSolfege).toBe(false);
    expect(sanitizePersistedAppState(saved.state)).toEqual(saved.state);
    expect(invalidAppStateFields(saved.state)).toEqual([]);
    // Force the real persist serializer without changing anything.
    useAppStore.setState({ volume: saved.state.volume as number });
    expect(JSON.parse(localStorage.getItem('music-theory-app')!)).toEqual(saved);
  });

  it('on: saved, and restored by a reload', async () => {
    useAppStore.getState().setShowSolfege(true);
    const written = JSON.parse(localStorage.getItem('music-theory-app')!);
    expect(written.version).toBe(6);
    expect(written.state.showSolfege).toBe(true);
    useAppStore.setState({ showSolfege: false });
    localStorage.setItem('music-theory-app', JSON.stringify(written));
    await useAppStore.persist.rehydrate();
    expect(useAppStore.getState().showSolfege).toBe(true);
  });

  it('a hand-edited value is not trusted', () => {
    for (const bad of ['yes', 1, null, {}, 'true']) {
      expect(sanitizePersistedAppState({ showSolfege: bad })).not.toHaveProperty('showSolfege');
      expect(invalidAppStateFields({ showSolfege: bad })).toEqual(['showSolfege']);
    }
    expect(sanitizePersistedAppState({ showSolfege: true })).toEqual({ showSolfege: true });
  });
});

describe('Settings → Language: offered in Portuguese and Spanish only', () => {
  beforeEach(() => useAppStore.setState({ showSolfege: false }));
  afterEach(async () => {
    cleanup();
    useAppStore.setState({ language: 'en', showSolfege: false });
    await act(async () => { await i18n.changeLanguage('en'); });
  });

  it('not offered in English', () => {
    useAppStore.setState({ language: 'en' });
    render(<SettingsSheet open onClose={() => {}} />);
    expect(screen.queryByTestId('solfege-setting')).toBeNull();
    expect(screen.queryByText(/Do, Re, Mi/)).toBeNull();
  });

  for (const [lang, label, hint] of [
    ['pt', 'Mostrar também Dó, Ré, Mi', 'Junta Dó, Ré, Mi ao lado das letras. Os nomes dos acordes e as lições continuam com as letras (C = Dó).'],
    ['es', 'Mostrar también Do, Re, Mi', 'Añade Do, Re, Mi junto a las letras. Los nombres de los acordes y las lecciones siguen con las letras (C = Do).'],
  ] as const) {
    it(`${lang}: a toggle chip under Language, with the line about the letters`, async () => {
      useAppStore.setState({ language: lang });
      await act(async () => { await i18n.changeLanguage(lang); });
      render(<SettingsSheet open onClose={() => {}} />);
      const chip = screen.getByRole('button', { name: label });
      expect(chip.getAttribute('aria-pressed')).toBe('false');
      expect(screen.getByText(hint)).toBeTruthy();
      fireEvent.click(chip);
      expect(useAppStore.getState().showSolfege).toBe(true);
      expect(chip.getAttribute('aria-pressed')).toBe('true');
      fireEvent.click(chip);
      expect(useAppStore.getState().showSolfege).toBe(false);
    });
  }
});
