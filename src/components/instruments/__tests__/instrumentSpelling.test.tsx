import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, within } from '@testing-library/react';
import { FretCell } from '../FretCell';
import { PianoKeyComponent } from '../PianoKey';
import type { PianoKey as PianoKeyData } from '../../../core/utils/pianoLayout';
import type { Note } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';

beforeEach(() => {
  useAppStore.setState({ themeMode: 'fermata' });
});
afterEach(cleanup);

const N = (natural: Note['natural'], accidental: Note['accidental'] = ''): Note => ({
  natural,
  accidental,
});

// ---------------------------------------------------------------------------
// FretCell — note name comes from `displayNote` (the context spelling), not the
// physical pitch. The fret position/string row are independent of the label.
// ---------------------------------------------------------------------------

function renderFretCell(displayNote: Note, extra?: Partial<React.ComponentProps<typeof FretCell>>) {
  return render(
    <FretCell
      fret={3}
      stringIdx={0}
      displayNote={displayNote}
      color={undefined}
      dotColor="#fff"
      isActive={false}
      isRoot={false}
      isMuted={false}
      fretMinWidth={40}
      isChordView={false}
      mobile={false}
      showVoicing={false}
      finger={undefined}
      showScalePos={false}
      scalePosIsRoot={undefined}
      scalePosDegree={undefined}
      showScaleDot
      isFocused={false}
      onClick={vi.fn()}
      {...extra}
    />,
  );
}

describe('FretCell context spelling', () => {
  it('labels the cell (and aria) from displayNote — B𝄫 for a Cdim7 A-fret', () => {
    // The physical fret is pitch class 9 (an A), but in a Cdim7 the context
    // spells it B𝄫. The cell must print "Bbb".
    const { container } = renderFretCell(N('B', 'bb'), { color: '#abc' });
    const cell = within(container).getByRole('button');
    expect(cell.getAttribute('aria-label')).toBe('Bbb, fret 3, string 6');
    expect(within(container).getByText('Bbb')).toBeTruthy();
  });

  it('labels the cell C♭ (not B) for a C♭-chord context', () => {
    const { container } = renderFretCell(N('C', 'b'), { color: '#abc' });
    expect(within(container).getByText('Cb')).toBeTruthy();
  });

  it('regression: a plain sharp-default note still reads its sharp name', () => {
    const { container } = renderFretCell(N('F', '#'), { color: '#abc' });
    const cell = within(container).getByRole('button');
    expect(cell.getAttribute('aria-label')).toBe('F#, fret 3, string 6');
    expect(within(container).getByText('F#')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// PianoKey — label follows `displayNote`; identity (black/white), position and
// octave anchor stay on the PHYSICAL keyData.note.
// ---------------------------------------------------------------------------

function makeKey(midi: number, natural: Note['natural'], octave: number, isBlack: boolean): PianoKeyData {
  return {
    midiNumber: midi,
    note: { natural, accidental: isBlack ? '#' : '' } as PianoKeyData['note'],
    octave,
    isBlack,
  } as PianoKeyData;
}

function renderPianoKey(
  keyData: PianoKeyData,
  displayNote: Note | undefined,
  extra?: Partial<React.ComponentProps<typeof PianoKeyComponent>>,
) {
  return render(
    <PianoKeyComponent
      keyData={keyData}
      displayNote={displayNote}
      isHighlighted
      isActive={false}
      isChordTone={false}
      isVoicingNote={false}
      isDimmed={false}
      onNoteOn={vi.fn()}
      onNoteOff={vi.fn()}
      showLabel
      sizeMode="desktop"
      {...extra}
    />,
  );
}

describe('PianoKey context spelling', () => {
  it('a highlighted black key shows the context spelling (D♭ not C♯)', () => {
    // Physical pc-1 black key (stored as C#). In a flat context it reads D♭.
    const keyData = makeKey(61, 'C', 4, true);
    const { container } = renderPianoKey(keyData, N('D', 'b'));
    const key = within(container).getByRole('button');
    expect(key.getAttribute('aria-label')).toBe('Db4'); // octave stays physical (4)
    expect(within(container).getByText('Db')).toBeTruthy();
  });

  it('the physical B key (pc 11) reads C♭ when the context spells it so — still WHITE, still B-positioned', () => {
    const keyData = makeKey(71, 'B', 4, false); // physical B4 (white)
    const { container } = renderPianoKey(keyData, N('C', 'b'));
    const key = within(container).getByRole('button');
    // Label is C♭ but identity is unchanged: white key, octave 4 (physical).
    expect(within(container).getByText('Cb')).toBeTruthy();
    expect(key.getAttribute('aria-label')).toBe('Cb4');
    // White-key marker: it is NOT the absolutely-positioned z-10 black element.
    expect(key.className).not.toContain('z-10');
  });

  it('the physical C key reads B♯ in a C♯-major context — and does NOT print the C-octave anchor', () => {
    // pc 0 spelled B♯ (C♯ major leading tone). The "C{octave}" anchor must NOT
    // fire (the key is displayed as B♯, not C), but the octave number stays
    // physical when it does apply elsewhere.
    const keyData = makeKey(60, 'C', 4, false); // physical C4
    const { container } = renderPianoKey(keyData, N('B', '#'));
    expect(within(container).getByText('B#')).toBeTruthy();
    expect(within(container).queryByText('C4')).toBeNull();
  });

  it('regression: a physical C key with C-natural spelling still shows the always-on "C4" anchor', () => {
    const keyData = makeKey(60, 'C', 4, false);
    // displayNote omitted → falls back to physical note (C). Not highlighted,
    // not a chord tone: the C anchor must still render.
    const { container } = renderPianoKey(keyData, undefined, { isHighlighted: false });
    expect(within(container).getByText('C4')).toBeTruthy();
  });

  it('regression: a black key with no displayNote falls back to its physical sharp name', () => {
    const keyData = makeKey(66, 'F', 4, true); // physical F#4
    const { container } = renderPianoKey(keyData, undefined);
    expect(within(container).getByText('F#')).toBeTruthy();
    expect(within(container).getByRole('button').getAttribute('aria-label')).toBe('F#4');
  });

  it('regression: physical black/white classification is independent of the relabel', () => {
    // Even relabeled across the B/C boundary, isBlack drives the element shape.
    const whiteB = makeKey(71, 'B', 4, false);
    const blackCsharp = makeKey(61, 'C', 4, true);

    const w = renderPianoKey(whiteB, N('C', 'b'));
    const wKey = within(w.container).getByRole('button');
    expect(wKey.className).toContain('relative'); // white-key wrapper
    expect(wKey.className).not.toContain('z-10');
    cleanup();

    const b = renderPianoKey(blackCsharp, N('D', 'b'));
    const bKey = within(b.container).getByRole('button');
    expect(bKey.className).toContain('z-10'); // black-key absolute wrapper
  });
});
