import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent, within } from '@testing-library/react';
import { FretCell } from '../FretCell';
import type { PitchedNote } from '../../../core/types/music';

afterEach(cleanup);

const pitched: PitchedNote = { natural: 'C', accidental: '', octave: 4 };

function pointer(type: string, pointerType = 'touch'): PointerEvent {
  return new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType,
    button: 0,
  });
}

function renderCell(opts: { mobile: boolean; onClick: () => void }) {
  return render(
    <FretCell
      fret={3}
      stringIdx={0}
      pitched={pitched}
      color={undefined}
      dotColor="#fff"
      isActive={false}
      isRoot={false}
      isMuted={false}
      fretMinWidth={40}
      isChordView={false}
      mobile={opts.mobile}
      showVoicing={false}
      finger={undefined}
      showScalePos={false}
      scalePosIsRoot={undefined}
      scalePosDegree={undefined}
      showScaleDot={false}
      isFocused={false}
      onClick={opts.onClick}
    />,
  );
}

describe('FretCell touch (mobile)', () => {
  it('pointerdown triggers exactly once and the compat click does NOT double-fire', () => {
    const onClick = vi.fn();
    const { container } = renderCell({ mobile: true, onClick });
    const cell = within(container).getByRole('button');

    fireEvent(cell, pointer('pointerdown'));
    expect(onClick).toHaveBeenCalledTimes(1);

    // Browser may emit a compatibility click after pointerdown — must be swallowed.
    fireEvent.click(cell);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('carries touch-action:none so a finger on the fret never scrolls', () => {
    const { container } = renderCell({ mobile: true, onClick: vi.fn() });
    const cell = within(container).getByRole('button');
    expect(cell.style.touchAction).toBe('none');
  });

  it('a second tap fires again (pointer guard resets after each click)', () => {
    const onClick = vi.fn();
    const { container } = renderCell({ mobile: true, onClick });
    const cell = within(container).getByRole('button');

    fireEvent(cell, pointer('pointerdown'));
    fireEvent.click(cell); // swallowed
    fireEvent(cell, pointer('pointerdown'));
    fireEvent.click(cell); // swallowed
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

describe('FretCell (desktop)', () => {
  it('fires on click (not pointerdown) so drag-to-scroll suppression still works', () => {
    const onClick = vi.fn();
    const { container } = renderCell({ mobile: false, onClick });
    const cell = within(container).getByRole('button');

    // pointerdown alone must NOT fire on desktop (the container handles drag).
    fireEvent(cell, pointer('pointerdown', 'mouse'));
    expect(onClick).not.toHaveBeenCalled();

    // click fires it (this is the path the container's onClickCapture can veto).
    fireEvent.click(cell);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not set touch-action on desktop', () => {
    const { container } = renderCell({ mobile: false, onClick: vi.fn() });
    const cell = within(container).getByRole('button');
    expect(cell.style.touchAction).toBeFalsy();
  });
});
