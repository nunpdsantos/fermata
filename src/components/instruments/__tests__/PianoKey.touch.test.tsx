import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, within } from '@testing-library/react';
import { PianoKeyComponent } from '../PianoKey';
import type { PianoKey as PianoKeyData } from '../../../core/utils/pianoLayout';
import { useAppStore } from '../../../state/store';

// react-i18next not needed by PianoKey, but keep store theme deterministic.
beforeEach(() => {
  useAppStore.setState({ themeMode: 'fermata' });
});
afterEach(cleanup);

function makeKey(midi: number, natural: string, octave: number, isBlack: boolean): PianoKeyData {
  return {
    midiNumber: midi,
    note: { natural, accidental: isBlack ? '#' : '' } as PianoKeyData['note'],
    octave,
    isBlack,
  } as PianoKeyData;
}

function pointer(type: string, pointerId: number): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId,
    pointerType: 'touch',
    button: 0,
  });
}

interface RenderOpts {
  keyData: PianoKeyData;
  onNoteOn: (k: PianoKeyData) => void;
  onNoteOff: (k: PianoKeyData) => void;
}

function renderKey({ keyData, onNoteOn, onNoteOff }: RenderOpts) {
  return render(
    <PianoKeyComponent
      keyData={keyData}
      isHighlighted={false}
      isActive={false}
      isChordTone={false}
      isVoicingNote={false}
      isDimmed={false}
      onNoteOn={onNoteOn}
      onNoteOff={onNoteOff}
      showLabel
      sizeMode="mobile"
    />,
  );
}

describe('PianoKey touch (mobile)', () => {
  it('pointerdown plays immediately, exactly once (no double-fire), pointerup releases', () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const keyData = makeKey(60, 'C', 4, false);
    const { getByRole } = renderKey({ keyData, onNoteOn, onNoteOff });
    const key = getByRole('button');

    fireEvent(key, pointer('pointerdown', 1));
    expect(onNoteOn).toHaveBeenCalledTimes(1);
    expect(onNoteOn).toHaveBeenCalledWith(keyData);
    expect(onNoteOff).not.toHaveBeenCalled();

    // A compatibility click after pointerdown must NOT trigger another noteOn.
    fireEvent.click(key);
    expect(onNoteOn).toHaveBeenCalledTimes(1);

    fireEvent(key, pointer('pointerup', 1));
    expect(onNoteOff).toHaveBeenCalledTimes(1);
    expect(onNoteOff).toHaveBeenCalledWith(keyData);
  });

  it('two fingers on the SAME key hold the note until the LAST finger lifts', () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const keyData = makeKey(62, 'D', 4, false);
    const { getByRole } = renderKey({ keyData, onNoteOn, onNoteOff });
    const key = getByRole('button');

    fireEvent(key, pointer('pointerdown', 1));
    fireEvent(key, pointer('pointerdown', 2));
    // Still only one noteOn — the key is already sounding.
    expect(onNoteOn).toHaveBeenCalledTimes(1);

    fireEvent(key, pointer('pointerup', 1));
    // One finger still down — no release yet.
    expect(onNoteOff).not.toHaveBeenCalled();

    fireEvent(key, pointer('pointerup', 2));
    expect(onNoteOff).toHaveBeenCalledTimes(1);
  });

  it('pointercancel releases the note (lost pointer)', () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const keyData = makeKey(64, 'E', 4, false);
    const { getByRole } = renderKey({ keyData, onNoteOn, onNoteOff });
    const key = getByRole('button');

    fireEvent(key, pointer('pointerdown', 5));
    fireEvent(key, pointer('pointercancel', 5));
    expect(onNoteOff).toHaveBeenCalledTimes(1);
  });

  it('the key element carries touch-action:none (it owns its touch, never scrolls)', () => {
    const keyData = makeKey(60, 'C', 4, false);
    const { getByRole } = renderKey({ keyData, onNoteOn: vi.fn(), onNoteOff: vi.fn() });
    const key = getByRole('button');
    // Tailwind touch-none → touch-action: none. Assert the class is present
    // (jsdom doesn't resolve Tailwind to computed style).
    expect(key.className).toContain('touch-none');
  });
});

describe('PianoKey desktop (mouse) — behaviour unchanged from pre-WS12', () => {
  function renderDesktopKey(
    onNoteOn: (k: PianoKeyData) => void,
    onNoteOff: (k: PianoKeyData) => void,
  ) {
    const keyData = makeKey(60, 'C', 4, false);
    return render(
      <PianoKeyComponent
        keyData={keyData}
        isHighlighted={false}
        isActive={false}
        isChordTone={false}
        isVoicingNote={false}
        isDimmed={false}
        onNoteOn={onNoteOn}
        onNoteOff={onNoteOff}
        showLabel
        sizeMode="desktop"
      />,
    );
  }

  function mouse(type: string): PointerEvent {
    return new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 1, pointerType: 'mouse', button: 0 });
  }

  it('fires noteOn on EVERY pointerdown (no gating) so repeat presses are never silent', () => {
    // Desktop note-OFF is owned by the Piano container (pointer capture), so the
    // key must not gate note-on behind a long-lived "is on" flag — that desyncs
    // and silences the second press. This pins that regression.
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const { getByRole } = renderDesktopKey(onNoteOn, onNoteOff);
    const key = getByRole('button');

    fireEvent(key, mouse('pointerdown'));
    fireEvent(key, mouse('pointerup'));
    fireEvent(key, mouse('pointerdown')); // second press — must fire again
    expect(onNoteOn).toHaveBeenCalledTimes(2);
  });

  it('pointerleave releases a pressed key (desktop mouse-out)', () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const { getByRole } = renderDesktopKey(onNoteOn, onNoteOff);
    const key = getByRole('button');

    fireEvent(key, mouse('pointerdown'));
    // RTL's helper maps to React's onPointerLeave (driven by pointerout in DOM).
    fireEvent.pointerLeave(key);
    expect(onNoteOff).toHaveBeenCalledTimes(1);
  });

  it('does NOT carry touch-action via pan-x (keys are always touch-none)', () => {
    const { getByRole } = renderDesktopKey(vi.fn(), vi.fn());
    expect(getByRole('button').className).toContain('touch-none');
  });
});

describe('PianoKey multi-touch chord (two keys)', () => {
  it('two simultaneous pointerIds on two keys → both noteOn; releasing one keeps the other', () => {
    const onNoteOn = vi.fn();
    const onNoteOff = vi.fn();
    const cKey = makeKey(60, 'C', 4, false);
    const eKey = makeKey(64, 'E', 4, false);

    const first = renderKey({ keyData: cKey, onNoteOn, onNoteOff });
    const cEl = within(first.container).getByRole('button');
    // Second render in a separate container (scope queries to each container so
    // the two buttons don't collide in the shared document body).
    const second = render(
      <PianoKeyComponent
        keyData={eKey}
        isHighlighted={false}
        isActive={false}
        isChordTone={false}
        isVoicingNote={false}
        isDimmed={false}
        onNoteOn={onNoteOn}
        onNoteOff={onNoteOff}
        showLabel
        sizeMode="mobile"
      />,
    );
    const eEl = within(second.container).getByRole('button');

    // Finger 1 on C, finger 2 on E — a two-note chord.
    fireEvent(cEl, pointer('pointerdown', 1));
    fireEvent(eEl, pointer('pointerdown', 2));
    expect(onNoteOn).toHaveBeenCalledTimes(2);
    expect(onNoteOn).toHaveBeenCalledWith(cKey);
    expect(onNoteOn).toHaveBeenCalledWith(eKey);

    // Lift finger 1 (C) — only C releases; E keeps sounding.
    fireEvent(cEl, pointer('pointerup', 1));
    expect(onNoteOff).toHaveBeenCalledTimes(1);
    expect(onNoteOff).toHaveBeenCalledWith(cKey);
    expect(onNoteOff).not.toHaveBeenCalledWith(eKey);

    // Lift finger 2 (E) — now E releases.
    fireEvent(eEl, pointer('pointerup', 2));
    expect(onNoteOff).toHaveBeenCalledTimes(2);
    expect(onNoteOff).toHaveBeenCalledWith(eKey);
  });
});
