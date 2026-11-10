/**
 * Settings → Guitar neck (brief D): two plain segments and a one-line hint,
 * wired to the saved settings, in EN / PT / ES.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import i18n from '../../../i18n/index';
import en from '../../../i18n/locales/en.json';
import pt from '../../../i18n/locales/pt.json';
import es from '../../../i18n/locales/es.json';
import { useAppStore } from '../../../state/store';
import { SettingsSheet } from '../SettingsSheet';

afterEach(async () => {
  cleanup();
  await act(() => i18n.changeLanguage('en'));
});

describe('Settings → Guitar neck', () => {
  it('shows the current view and switches each axis on its own', () => {
    useAppStore.setState({ neckNutSide: 'right', neckTopString: 'low' });
    render(<SettingsSheet open onClose={() => {}} />);
    const row = screen.getByTestId('neck-settings');
    expect(within(row).getByText('Guitar neck')).toBeTruthy();
    expect(within(row).getByText('The nut is where the open strings start. Guitar tab usually puts the thin string on top.')).toBeTruthy();
    const nut = within(row).getByRole('radiogroup', { name: 'Nut side' });
    const top = within(row).getByRole('radiogroup', { name: 'String on top' });
    expect(within(nut).getByRole('radio', { name: 'Nut on the right' }).getAttribute('aria-checked')).toBe('true');
    expect(within(top).getByRole('radio', { name: 'Thick string on top' }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(within(nut).getByRole('radio', { name: 'Nut on the left' }));
    expect(useAppStore.getState()).toMatchObject({ neckNutSide: 'left', neckTopString: 'low' });
    fireEvent.click(within(top).getByRole('radio', { name: 'Thin string on top' }));
    expect(useAppStore.getState()).toMatchObject({ neckNutSide: 'left', neckTopString: 'high' });
    // One Tab stop per segment; arrows move and select (roving).
    fireEvent.keyDown(within(top).getByRole('radio', { name: 'Thin string on top' }), { key: 'ArrowRight' });
    expect(useAppStore.getState().neckTopString).toBe('low');
  });

  it.each([
    ['pt', 'Braço da guitarra', 'As tablaturas costumam pôr a corda fina em cima.', 'Cordas soltas à esquerda', 'Cordas soltas à direita', 'Corda fina em cima', 'Corda grossa em cima'],
    ['es', 'Mástil de la guitarra', 'Las tablaturas suelen poner la cuerda fina arriba.', 'Cuerdas al aire a la izquierda', 'Cuerdas al aire a la derecha', 'Cuerda fina arriba', 'Cuerda gruesa arriba'],
  ] as const)('%s', async (lang, heading, hint, left, right, thin, thick) => {
    // The owner's view (nut right, thick string on top) is shown as such.
    useAppStore.setState({ neckNutSide: 'right', neckTopString: 'low' });
    await act(() => i18n.changeLanguage(lang));
    render(<SettingsSheet open onClose={() => {}} />);
    const row = screen.getByTestId('neck-settings');
    expect(within(row).getByText(heading)).toBeTruthy();
    // The hint names the THIN string on top, as the option it points to does.
    expect(within(row).getByText(hint)).toBeTruthy();
    // Final review (2026-11-10): each label sets what it says (a swapped
    // pair passed: only the names were checked).
    expect(within(row).getByRole('radio', { name: right }).getAttribute('aria-checked')).toBe('true');
    expect(within(row).getByRole('radio', { name: thick }).getAttribute('aria-checked')).toBe('true');
    fireEvent.click(within(row).getByRole('radio', { name: left }));
    expect(useAppStore.getState().neckNutSide).toBe('left');
    fireEvent.click(within(row).getByRole('radio', { name: right }));
    expect(useAppStore.getState().neckNutSide).toBe('right');
    fireEvent.click(within(row).getByRole('radio', { name: thin }));
    expect(useAppStore.getState().neckTopString).toBe('high');
    fireEvent.click(within(row).getByRole('radio', { name: thick }));
    expect(useAppStore.getState().neckTopString).toBe('low');
  });

  it('EN, PT and ES carry the same neckView keys, all non-empty', () => {
    const keys = Object.keys(en.neckView).sort();
    expect(Object.keys(pt.neckView).sort()).toEqual(keys);
    expect(Object.keys(es.neckView).sort()).toEqual(keys);
    for (const loc of [en, pt, es]) for (const v of Object.values(loc.neckView)) expect(v.trim()).not.toBe('');
  });
});
