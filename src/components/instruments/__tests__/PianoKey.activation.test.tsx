/**
 * QA audit A10 (2026-11-18): a plain click did not play a piano key. The keys
 * answered pointer and keyboard events but had no click handler, so a tool
 * that sends a bare click (assistive technology, element.click()) got no
 * note-on and no note-off, white and black keys alike.
 *
 * Each way of playing a key gives exactly ONE note-on and ONE note-off: a
 * mouse press (with the click that follows it, wherever the browser sends
 * it), a touch (with its click), Enter, Space, and a bare click. The browser's
 * own event order is checked in e2e/instruments-audit.spec.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { PianoKeyComponent } from '../PianoKey';
import type { PianoKey as PianoKeyData } from '../../../core/utils/pianoLayout';
import { useAppStore } from '../../../state/store';

beforeEach(() => {
  // performance.now() too: a click belongs to a press by how soon it follows it.
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date', 'performance'] });
  useAppStore.setState({ themeMode: 'fermata' });
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const KEYS: PianoKeyData[] = [
  { midiNumber: 60, note: { natural: 'C', accidental: '' }, octave: 4, isBlack: false } as PianoKeyData,
  { midiNumber: 61, note: { natural: 'C', accidental: '#' }, octave: 4, isBlack: true } as PianoKeyData,
];

function renderKey(keyData: PianoKeyData, sizeMode: 'desktop' | 'mobile') {
  const onNoteOn = vi.fn();
  const onNoteOff = vi.fn();
  const { getByRole } = render(
    <PianoKeyComponent keyData={keyData} isHighlighted={false} isActive={false} isChordTone={false} isVoicingNote={false}
      isDimmed={false} onNoteOn={onNoteOn} onNoteOff={onNoteOff} showLabel sizeMode={sizeMode} isFocused />,
  );
  return { key: getByRole('button'), onNoteOn, onNoteOff };
}

const pointer = (type: string, pointerType: string) =>
  new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType, button: 0 });

/** Let any held note go, then count. */
function heard(on: ReturnType<typeof vi.fn>, off: ReturnType<typeof vi.fn>) {
  act(() => { vi.advanceTimersByTime(2000); });
  return [on.mock.calls.length, off.mock.calls.length];
}

for (const keyData of KEYS) {
  const which = keyData.isBlack ? 'black' : 'white';
  describe(`a ${which} key`, () => {
    it('a bare click plays it once: one note-on, one note-off (the audit\'s case)', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
      key.click();
      expect(onNoteOn).toHaveBeenCalledTimes(1);
      expect(onNoteOn).toHaveBeenCalledWith(keyData);
      expect(onNoteOff).not.toHaveBeenCalled(); // it sounds for a moment…
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]); // …then lets go
    });

    it('a bare click on a phone\'s key plays it once too', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'mobile');
      key.click();
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
    });

    it('a mouse press plays once, even when its click reaches the key', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'mouse')); });
      // The desktop piano lets the note go on the container's pointerup.
      act(() => { window.dispatchEvent(pointer('pointerup', 'mouse')); });
      fireEvent.pointerLeave(key, { pointerType: 'mouse' });
      fireEvent.click(key, { detail: 1 });
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
    });

    it('a touch plays once, its click included', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'mobile');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'touch')); });
      act(() => { key.dispatchEvent(pointer('pointerup', 'touch')); });
      fireEvent.click(key, { detail: 1 });
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
    });

    for (const k of ['Enter', ' ']) {
      it(`${k === ' ' ? 'Space' : k} plays once, and a click right after it is the same press`, () => {
        const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
        fireEvent.keyDown(key, { key: k });
        fireEvent.keyUp(key, { key: k });
        fireEvent.click(key, { detail: 0 });
        expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
      });
    }

    it('a bare click well after a press plays again (the press does not swallow it)', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'mobile');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'touch')); });
      act(() => { key.dispatchEvent(pointer('pointerup', 'touch')); });
      act(() => { vi.advanceTimersByTime(1000); });
      key.click();
      expect(heard(onNoteOn, onNoteOff)).toEqual([2, 2]);
    });

    it('a key taken away while its click note sounds still lets the note go', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
      key.click();
      cleanup();
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
    });

    it('a key that loses focus while Enter is down does not swallow a later bare click', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
      fireEvent.keyDown(key, { key: 'Enter' });
      fireEvent.blur(key);
      act(() => { vi.advanceTimersByTime(1000); });
      key.click();
      expect(heard(onNoteOn, onNoteOff)).toEqual([2, 2]);
    });
  });
}
