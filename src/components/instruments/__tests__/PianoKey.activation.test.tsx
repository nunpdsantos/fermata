/**
 * QA audit A10 (2026-11-18): a plain click did not play a piano key. The keys
 * answered pointer and keyboard events but had no click handler, so a tool
 * that sends a bare click (assistive technology, element.click()) got no
 * note-on and no note-off, white and black keys alike.
 *
 * Each way of playing a key gives exactly ONE note-on and ONE note-off: a
 * mouse press (with the click that follows it, wherever the browser sends
 * it), a touch (with its click), Enter, Space, and a bare click. A press and
 * its click are paired by the event sequence, never by a clock (review of
 * a611beb): a real press then a bare click 100 ms later is two notes, and a
 * press leaves no listener behind. The browser's own event order is checked
 * in e2e/instruments-audit.spec.ts.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { PianoKeyComponent } from '../PianoKey';
import type { PianoKey as PianoKeyData } from '../../../core/utils/pianoLayout';
import { useAppStore } from '../../../state/store';

beforeEach(() => {
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

    it('a mouse press plays once, its click reaching the key', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'mouse')); });
      // The desktop piano lets the note go on the container's pointerup.
      act(() => { window.dispatchEvent(pointer('pointerup', 'mouse')); onNoteOff(keyData); });
      fireEvent.click(key, { detail: 1 });
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
    });

    it('a mouse press plays once, its click going to the container that captured the pointer; a bare click 100 ms later plays again', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'mouse')); });
      act(() => { window.dispatchEvent(pointer('pointerup', 'mouse')); onNoteOff(keyData); });
      fireEvent.click(document.body, { detail: 1 });
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
      act(() => { vi.advanceTimersByTime(100); });
      key.click();
      expect(heard(onNoteOn, onNoteOff)).toEqual([2, 2]);
    });

    it('a touch plays once, its click included; a bare click 100 ms later plays again', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'mobile');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'touch')); });
      act(() => { key.dispatchEvent(pointer('pointerup', 'touch')); });
      fireEvent.click(key, { detail: 1 });
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
      act(() => { vi.advanceTimersByTime(100); });
      key.click();
      expect(heard(onNoteOn, onNoteOff)).toEqual([2, 2]);
    });

    it('a touch whose click comes with detail 0 (as Chromium sends it) is still one note', () => {
      const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'mobile');
      act(() => { key.dispatchEvent(pointer('pointerdown', 'touch')); });
      act(() => { key.dispatchEvent(pointer('pointerup', 'touch')); });
      fireEvent.click(key, { detail: 0 });
      expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
    });

    for (const k of ['Enter', ' ']) {
      it(`${k === ' ' ? 'Space' : k} plays once; a click while it is down is its own, one after it is a new note`, () => {
        const { key, onNoteOn, onNoteOff } = renderKey(keyData, 'desktop');
        fireEvent.keyDown(key, { key: k });
        fireEvent.click(key, { detail: 0 });
        fireEvent.keyUp(key, { key: k });
        expect(heard(onNoteOn, onNoteOff)).toEqual([1, 1]);
        key.click();
        expect(heard(onNoteOn, onNoteOff)).toEqual([2, 2]);
      });
    }

    it('thirty presses leave no listener on the window (each press removes all three it adds)', () => {
      const count = new Map<string, number>();
      const add = window.addEventListener.bind(window);
      const remove = window.removeEventListener.bind(window);
      const spyAdd = vi.spyOn(window, 'addEventListener').mockImplementation((type, fn, opts) => { count.set(type, (count.get(type) ?? 0) + 1); add(type, fn, opts); });
      const spyRemove = vi.spyOn(window, 'removeEventListener').mockImplementation((type, fn, opts) => { count.set(type, (count.get(type) ?? 0) - 1); remove(type, fn, opts); });
      try {
        const { key } = renderKey(keyData, 'mobile');
        for (let i = 0; i < 30; i++) {
          act(() => { key.dispatchEvent(pointer('pointerdown', 'touch')); });
          act(() => { key.dispatchEvent(pointer('pointerup', 'touch')); });
          // Half of them get their click, half a cancelled pointer instead.
          if (i % 2) fireEvent.click(key, { detail: 1 });
          else act(() => { window.dispatchEvent(pointer('pointercancel', 'touch')); });
        }
        for (const type of ['click', 'pointercancel', 'pointerdown', 'pointerup']) expect(count.get(type) ?? 0, type).toBe(0);
      } finally {
        spyAdd.mockRestore();
        spyRemove.mockRestore();
      }
    });

    it('a touch that sent no click (it moved away) stops waiting at the next press or click anywhere; then a bare click plays', () => {
      for (const next of ['pointerdown', 'click'] as const) {
        const { key, onNoteOn, onNoteOff, unmount } = { ...renderKey(keyData, 'mobile'), unmount: cleanup };
        act(() => { key.dispatchEvent(pointer('pointerdown', 'touch')); });
        act(() => { key.dispatchEvent(pointer('pointerup', 'touch')); });
        if (next === 'pointerdown') act(() => { document.body.dispatchEvent(pointer('pointerdown', 'touch')); });
        else fireEvent.click(document.body, { detail: 1 });
        key.click();
        expect(heard(onNoteOn, onNoteOff), next).toEqual([2, 2]);
        unmount();
      }
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
