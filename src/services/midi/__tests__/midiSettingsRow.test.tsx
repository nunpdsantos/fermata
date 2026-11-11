/**
 * Settings → "MIDI keyboard" (brief K): off by default; turning it on asks
 * the browser (the least access); the row then names the keyboards heard or
 * says none is connected; a refusal says so; a browser without Web MIDI gets
 * one sentence and nothing to press. EN / PT / ES.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, act, screen, within, fireEvent } from '@testing-library/react';
import i18n from '../../../i18n/index';
import { SettingsSheet } from '../../../components/layout/SettingsSheet';
import { useAppStore } from '../../../state/store';
import { useMidiStatus, turnMidiKeyboard } from '../midiStatus';
import { stopMidi } from '../midiInput';
import { MIDI_INPUT_TEXT } from '../../../i18n/midiInput';
import { fakeAccess } from './fakeMidi';

function installMidi(request: (o: MIDIOptions) => Promise<unknown>) {
  const requestMIDIAccess = vi.fn(request);
  Object.defineProperty(navigator, 'requestMIDIAccess', { configurable: true, value: requestMIDIAccess });
  return requestMIDIAccess;
}

beforeEach(() => {
  useAppStore.setState({ midiKeyboard: undefined });
});
afterEach(async () => {
  stopMidi();
  cleanup();
  delete (navigator as unknown as Record<string, unknown>).requestMIDIAccess;
  useAppStore.setState({ midiKeyboard: undefined });
  useMidiStatus.setState({ state: 'off', devices: [] });
  await act(() => i18n.changeLanguage('en'));
});

const row = () => screen.getByTestId('midi-setting');

describe('Settings → MIDI keyboard', () => {
  it('a browser without Web MIDI: one sentence, nothing to press', () => {
    render(<SettingsSheet open onClose={() => {}} />);
    expect(within(row()).getByText('MIDI keyboard')).toBeTruthy();
    expect(within(row()).getByText(MIDI_INPUT_TEXT.en.unsupported)).toBeTruthy();
    expect(within(row()).queryByRole('button')).toBeNull();
  });

  it('off by default, the sentence says what the permission is for and that nothing leaves the device', () => {
    installMidi(async () => fakeAccess());
    render(<SettingsSheet open onClose={() => {}} />);
    const chip = within(row()).getByRole('button', { name: 'Use a MIDI keyboard' });
    expect(chip.getAttribute('aria-pressed')).toBe('false');
    expect(within(row()).getByText(MIDI_INPUT_TEXT.en.ask)).toBeTruthy();
    expect(MIDI_INPUT_TEXT.en.ask).toMatch(/hear the keys you play.*never leaves this device/);
  });

  it('turning it on asks the browser once, for no sysex and no software synths, then names the keyboard', async () => {
    const request = installMidi(async () => fakeAccess([['a', 'Stage Piano'], ['b', 'Pads']]));
    render(<SettingsSheet open onClose={() => {}} />);
    await act(async () => {
      fireEvent.click(within(row()).getByRole('button', { name: 'Use a MIDI keyboard' }));
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenCalledWith({ sysex: false, software: false });
    expect(within(row()).getByText('Connected: Stage Piano, Pads')).toBeTruthy();
    expect(within(row()).getByRole('button', { name: 'Use a MIDI keyboard' }).getAttribute('aria-pressed')).toBe('true');
    expect(useAppStore.getState().midiKeyboard).toBe(true);
    // Off again: the field leaves the save.
    await act(async () => {
      fireEvent.click(within(row()).getByRole('button', { name: 'Use a MIDI keyboard' }));
      await new Promise((r) => setTimeout(r, 0));
    });
    expect(useAppStore.getState().midiKeyboard).toBeUndefined();
    expect(useMidiStatus.getState().state).toBe('off');
  });

  it('on with no keyboard connected says so', async () => {
    installMidi(async () => fakeAccess());
    render(<SettingsSheet open onClose={() => {}} />);
    await act(() => turnMidiKeyboard(true));
    expect(within(row()).getByText(MIDI_INPUT_TEXT.en.none)).toBeTruthy();
  });

  it('refused: says so, stays off', async () => {
    installMidi(() => Promise.reject(Object.assign(new Error('no'), { name: 'NotAllowedError' })));
    render(<SettingsSheet open onClose={() => {}} />);
    await act(() => turnMidiKeyboard(true));
    expect(within(row()).getByText(MIDI_INPUT_TEXT.en.denied)).toBeTruthy();
    expect(within(row()).getByRole('button', { name: 'Use a MIDI keyboard' }).getAttribute('aria-pressed')).toBe('false');
  });

  it.each(['pt', 'es'] as const)('%s: the row in its language', async (lang) => {
    await act(() => i18n.changeLanguage(lang));
    installMidi(async () => fakeAccess([['a', 'Stage Piano']]));
    render(<SettingsSheet open onClose={() => {}} />);
    const text = MIDI_INPUT_TEXT[lang];
    expect(within(row()).getByText(text.title)).toBeTruthy();
    expect(within(row()).getByText(text.ask)).toBeTruthy();
    // The same promise as the English: what it is for, and that nothing leaves the device.
    expect(text.ask).toMatch(lang === 'pt' ? /ouvir as teclas que tocas.*nunca sai deste dispositivo/ : /oír las teclas que tocas.*nunca sale de este dispositivo/);
    await act(() => turnMidiKeyboard(true));
    expect(within(row()).getByText(text.connected.replace('{{names}}', 'Stage Piano'))).toBeTruthy();
  });
});

describe('the midiInput namespace', () => {
  it('has the same keys and placeholders in EN, PT and ES', () => {
    const keys = Object.keys(MIDI_INPUT_TEXT.en).sort();
    for (const lang of ['pt', 'es'] as const) {
      expect(Object.keys(MIDI_INPUT_TEXT[lang]).sort()).toEqual(keys);
      for (const k of keys) {
        const ph = (s: string) => (s.match(/\{\{\w+\}\}/g) ?? []).sort();
        expect(ph(MIDI_INPUT_TEXT[lang][k as keyof typeof MIDI_INPUT_TEXT.en]), `${lang}.${k}`).toEqual(ph(MIDI_INPUT_TEXT.en[k as keyof typeof MIDI_INPUT_TEXT.en]));
      }
    }
  });
});
