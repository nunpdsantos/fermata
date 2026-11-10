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
    expect(within(row).getByText('Left with the thin string on top is how tab and chord charts are drawn.')).toBeTruthy();
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
    ['pt', 'Braço da guitarra', 'Cordas soltas à esquerda', 'Corda fina em cima'],
    ['es', 'Mástil de la guitarra', 'Cuerdas al aire a la izquierda', 'Cuerda fina arriba'],
  ] as const)('%s', async (lang, heading, left, thin) => {
    await act(() => i18n.changeLanguage(lang));
    render(<SettingsSheet open onClose={() => {}} />);
    const row = screen.getByTestId('neck-settings');
    expect(within(row).getByText(heading)).toBeTruthy();
    expect(within(row).getByRole('radio', { name: left })).toBeTruthy();
    expect(within(row).getByRole('radio', { name: thin })).toBeTruthy();
  });

  it('EN, PT and ES carry the same neckView keys, all non-empty', () => {
    const keys = Object.keys(en.neckView).sort();
    expect(Object.keys(pt.neckView).sort()).toEqual(keys);
    expect(Object.keys(es.neckView).sort()).toEqual(keys);
    for (const loc of [en, pt, es]) for (const v of Object.values(loc.neckView)) expect(v.trim()).not.toBe('');
  });
});
