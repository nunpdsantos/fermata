/**
 * Design system v2 components (W11-A, D-28): the ONE keyboard pattern for
 * one-of-many groups (ChipGroup, Segment), the menu button, the modal sheet
 * (focus in / trapped / returned, Escape) and the detent sheet.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { useState } from 'react';
import { ChipGroup, ChoiceChip } from '../ChoiceChip';
import { Segment } from '../Segment';
import { Button, IconButton } from '../Button';
import { buttonClass } from '../buttonClass';
import { Menu } from '../Menu';
import { Sheet } from '../Sheet';
import { DetentSheet } from '../DetentSheet';
import { Feedback } from '../Feedback';
import { SelectTrigger } from '../SelectTrigger';
import { ListRow } from '../ListRow';
import { rovingTarget, tabStopIndex } from '../roving';
import type { Detent } from '../../../state/dock';

afterEach(cleanup);

describe('roving keyboard maths', () => {
  const all = [true, true, true, true];
  it('arrows step and wrap, skipping disabled items; Home/End jump', () => {
    expect(rovingTarget('ArrowRight', 0, all)).toBe(1);
    expect(rovingTarget('ArrowDown', 3, all)).toBe(0);
    expect(rovingTarget('ArrowLeft', 0, all)).toBe(3);
    expect(rovingTarget('ArrowUp', 2, all)).toBe(1);
    expect(rovingTarget('ArrowRight', 0, [true, false, true, true])).toBe(2);
    expect(rovingTarget('Home', 2, [false, true, true, true])).toBe(1);
    expect(rovingTarget('End', 0, [true, true, true, false])).toBe(2);
    expect(rovingTarget('a', 0, all)).toBeNull();
  });
  it('the tab stop is the selected item, else the first enabled one', () => {
    expect(tabStopIndex(2, all)).toBe(2);
    expect(tabStopIndex(-1, [false, true, true])).toBe(1);
    expect(tabStopIndex(0, [false, true, true])).toBe(1);
  });
});

function Chips({ onChange = () => {} }: { onChange?: (v: string) => void }) {
  const [value, setValue] = useState<string>('b');
  return (
    <ChipGroup
      label="Letters"
      value={value}
      onChange={(v) => {
        setValue(v);
        onChange(v);
      }}
      options={[
        { value: 'a', label: 'A', group: 'one' },
        { value: 'b', label: 'B', group: 'one' },
        { value: 'c', label: 'C', group: 'two', disabled: true },
        { value: 'd', label: 'D', group: 'two' },
      ]}
    />
  );
}

describe('ChipGroup — choice chips (one of many)', () => {
  it('is a radiogroup with ONE tab stop on the checked chip', () => {
    render(<Chips />);
    const group = screen.getByRole('radiogroup', { name: 'Letters' });
    const radios = screen.getAllByRole('radio');
    expect(group).toBeTruthy();
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false', 'false']);
    expect(radios.map((r) => r.tabIndex)).toEqual([-1, 0, -1, -1]);
    expect(radios.every((r) => r.classList.contains('chip'))).toBe(true);
  });

  it('arrow keys move focus AND select, skip disabled chips and wrap', () => {
    const onChange = vi.fn();
    render(<Chips onChange={onChange} />);
    const b = screen.getByRole('radio', { name: 'B' });
    b.focus();
    fireEvent.keyDown(b, { key: 'ArrowRight' });
    const d = screen.getByRole('radio', { name: 'D' });
    expect(onChange).toHaveBeenLastCalledWith('d');
    expect(document.activeElement).toBe(d);
    expect(d.getAttribute('aria-checked')).toBe('true');
    fireEvent.keyDown(d, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenLastCalledWith('a');
    fireEvent.keyDown(screen.getByRole('radio', { name: 'A' }), { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('d');
  });

  it('groups sit in their own wrapper; only radios live inside the radiogroup', () => {
    const { container } = render(<Chips />);
    expect(container.querySelectorAll('[data-group]')).toHaveLength(2);
    const group = screen.getByRole('radiogroup');
    expect([...group.querySelectorAll('button')].every((b) => b.getAttribute('role') === 'radio')).toBe(true);
  });

  it('a standalone ChoiceChip toggles with aria-pressed', () => {
    render(<ChoiceChip pressed>Edit</ChoiceChip>);
    const chip = screen.getByRole('button', { name: 'Edit' });
    expect(chip.getAttribute('aria-pressed')).toBe('true');
    expect(chip.className).toContain('chip');
  });
});

describe('Segment — view switches', () => {
  it('radio mode: a radiogroup of seg buttons, arrows select', () => {
    const onChange = vi.fn();
    render(<Segment label="Instrument" value="piano" onChange={onChange} options={[{ value: 'piano', label: 'Piano' }, { value: 'guitar', label: 'Guitar' }]} />);
    const piano = screen.getByRole('radio', { name: 'Piano' });
    expect(piano.getAttribute('aria-checked')).toBe('true');
    expect(piano.className).toContain('seg-btn');
    fireEvent.keyDown(piano, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('guitar');
  });

  it('tabs mode (switches panels): tablist / tab / aria-selected / aria-controls', () => {
    render(
      <Segment
        mode="tabs"
        label="Views"
        value="b"
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A', controls: 'pa', id: 'ta' },
          { value: 'b', label: 'B', controls: 'pb', id: 'tb' },
        ]}
      />,
    );
    expect(screen.getByRole('tablist', { name: 'Views' })).toBeTruthy();
    const b = screen.getByRole('tab', { name: 'B' });
    expect(b.getAttribute('aria-selected')).toBe('true');
    expect(b.getAttribute('aria-controls')).toBe('pb');
    expect(b.id).toBe('tb');
  });

  it('disabled: no tab stop, nothing selectable', () => {
    const onChange = vi.fn();
    render(<Segment label="L" value="x" disabled onChange={onChange} options={[{ value: 'x', label: 'X' }, { value: 'y', label: 'Y' }]} />);
    const radios = screen.getAllByRole('radio') as HTMLButtonElement[];
    expect(radios.every((r) => r.disabled && r.tabIndex === -1)).toBe(true);
  });
});

describe('Button / IconButton / SelectTrigger / ListRow / Feedback', () => {
  it('variant classes, v1 aliases, block + lg', () => {
    expect(buttonClass({ variant: 'primary' })).toBe('btn btn-primary');
    expect(buttonClass({ variant: 'accent' })).toBe('btn btn-primary');
    expect(buttonClass({ variant: 'ghost' })).toBe('btn btn-quiet');
    expect(buttonClass({ variant: 'link', size: 'lg', block: true })).toBe('btn btn-link btn-lg btn-block');
    render(<Button variant="secondary" loading>Save</Button>);
    const save = screen.getByRole('button', { name: 'Save' }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    expect(save.getAttribute('aria-busy')).toBe('true');
  });

  it('an icon button is named by its aria-label', () => {
    render(<IconButton aria-label="Close" icon={<svg />} />);
    expect(screen.getByRole('button', { name: 'Close' }).className).toContain('btn-icon');
  });

  it('SelectTrigger is a real select with a caret; ListRow is a button only when clickable', () => {
    render(
      <>
        <SelectTrigger aria-label="Tuning" defaultValue="b"><option value="a">A</option><option value="b">B</option></SelectTrigger>
        <ListRow title="Static" meta="meta" />
        <ListRow title="Clickable" onClick={() => {}} />
      </>,
    );
    expect((screen.getByRole('combobox', { name: 'Tuning' }) as HTMLSelectElement).value).toBe('b');
    expect(screen.queryByRole('button', { name: /Static/ })).toBeNull();
    expect(screen.getByRole('button', { name: /Clickable/ })).toBeTruthy();
  });

  it('Feedback: tone, title in the tone colour, hint and "Learn about this"', () => {
    const learn = vi.fn();
    const { container } = render(<Feedback tone="wrong" title="Not quite" hint="Count down from E." learnMore={{ label: 'Learn about this', onClick: learn }} />);
    expect(container.querySelector('[data-tone="wrong"]')).not.toBeNull();
    expect(screen.getByText('Not quite').className).toContain('text-danger');
    fireEvent.click(screen.getByRole('button', { name: /Learn about this/ }));
    expect(learn).toHaveBeenCalled();
  });
});

describe('Menu — the "⋯" button', () => {
  function setup() {
    const settings = vi.fn();
    const about = vi.fn();
    render(
      <div>
        <Menu label="More" items={[{ id: 's', label: 'Settings', onSelect: settings }, { id: 'a', label: 'About', onSelect: about }]} />
        <button type="button">Outside</button>
      </div>,
    );
    return { settings, about, button: screen.getByRole('button', { name: 'More' }) };
  }

  it('opens with focus on the first item; arrows move; Escape closes and returns focus', () => {
    const { button } = setup();
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    fireEvent.click(button);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    const [first, second] = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(first);
    fireEvent.keyDown(first, { key: 'End' });
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: 'Escape' });
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('ArrowUp on the button opens at the last item; choosing runs it after focus returns', () => {
    const { button, about } = setup();
    fireEvent.keyDown(button, { key: 'ArrowUp' });
    const items = screen.getAllByRole('menuitem');
    expect(document.activeElement).toBe(items[1]);
    fireEvent.click(items[1]);
    expect(about).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(button);
  });

  it('a pointer down outside closes it', () => {
    const { button } = setup();
    fireEvent.click(button);
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menu')).toBeNull();
  });
});

describe('Sheet — modal', () => {
  function Harness() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>Open</button>
        <Sheet open={open} onClose={() => setOpen(false)} title="Settings" closeLabel="Close">
          <button type="button">First</button>
          <button type="button">Last</button>
        </Sheet>
      </>
    );
  }

  it('moves focus in, traps Tab, closes on Escape / scrim and returns focus to the opener', () => {
    render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();
    fireEvent.click(opener);
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const close = screen.getByRole('button', { name: 'Close' });
    expect(document.activeElement).toBe(close); // first focusable
    // Shift+Tab from the first wraps to the last; Tab from the last to the first.
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Last' }));
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(opener);

    fireEvent.click(opener);
    fireEvent.click(document.querySelector('.sheet-scrim')!);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('dragging the grip down far enough dismisses it', () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const grab = document.querySelector('.sheet-grab')!;
    fireEvent.pointerDown(grab, { clientY: 100, pointerId: 1 });
    fireEvent.pointerMove(grab, { clientY: 150, pointerId: 1 });
    expect((screen.getByRole('dialog') as HTMLElement).style.transform).toBe('translateY(50px)');
    fireEvent.pointerUp(grab, { clientY: 260, pointerId: 1 });
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

describe('DetentSheet — Peek / Half / Full', () => {
  function Harness({ start = 'peek' as Detent, spy = vi.fn() }) {
    const [detent, setDetent] = useState<Detent>(start);
    return (
      <DetentSheet
        detent={detent}
        onDetent={(d) => {
          spy(d);
          setDetent(d);
        }}
        available={800}
        handleLabel="Instrument panel"
        detentLabels={{ peek: 'Peek', half: 'Half', full: 'Full' }}
        bar={<button type="button">Show</button>}
        testId="dock"
      >
        <button type="button">Key</button>
      </DetentSheet>
    );
  }

  it('is a window splitter: value + text, keyboard steps, Enter toggles Peek ⇄ Half', () => {
    const spy = vi.fn();
    render(<Harness spy={spy} />);
    const handle = screen.getByRole('separator', { name: 'Instrument panel' });
    expect(handle.getAttribute('aria-valuetext')).toBe('Peek');
    expect(handle.getAttribute('aria-valuenow')).toBe('0');
    fireEvent.keyDown(handle, { key: 'ArrowUp' });
    expect(spy).toHaveBeenLastCalledWith('half');
    fireEvent.keyDown(handle, { key: 'End' });
    expect(spy).toHaveBeenLastCalledWith('full');
    expect(handle.getAttribute('aria-valuetext')).toBe('Full');
    expect(screen.getByTestId('dock').style.height).toBe('800px');
    fireEvent.keyDown(handle, { key: 'ArrowDown' });
    expect(spy).toHaveBeenLastCalledWith('half');
    expect(screen.getByTestId('dock').style.height).toBe('400px');
    fireEvent.keyDown(handle, { key: 'Enter' });
    expect(spy).toHaveBeenLastCalledWith('peek');
    fireEvent.keyDown(handle, { key: 'Home' }); // already Peek: no call
    expect(spy).toHaveBeenCalledTimes(4);
  });

  it('at Peek the instrument stays mounted but inert; a tap on the handle steps up', () => {
    const spy = vi.fn();
    const { container } = render(<Harness spy={spy} />);
    const content = container.querySelector('.detent-content') as HTMLElement;
    expect(content.hasAttribute('inert')).toBe(true);
    expect(content.style.height).toBe('0px');
    expect(screen.getByRole('button', { name: 'Key', hidden: true })).toBeTruthy();
    const handle = screen.getByRole('separator');
    act(() => {
      fireEvent.pointerDown(handle, { clientY: 700, pointerId: 3, button: 0 });
      fireEvent.pointerUp(handle, { clientY: 701, pointerId: 3, button: 0 });
    });
    expect(spy).toHaveBeenLastCalledWith('half');
    expect(content.hasAttribute('inert')).toBe(false);
  });

  it('a drag snaps to the nearest detent', () => {
    const spy = vi.fn();
    render(<Harness spy={spy} start="half" />);
    const handle = screen.getByRole('separator');
    act(() => {
      fireEvent.pointerDown(handle, { clientY: 500, pointerId: 4, button: 0 });
      fireEvent.pointerMove(handle, { clientY: 200, pointerId: 4 });
    });
    expect(screen.getByTestId('dock').style.height).toBe('700px'); // live, 400 + 300
    act(() => {
      fireEvent.pointerUp(handle, { clientY: 200, pointerId: 4 });
    });
    expect(spy).toHaveBeenLastCalledWith('full');
  });
});

it('Sheet keeps its decision outside the scroll body and its close/header pinned', () => {
  const { getByRole } = render(<Sheet open onClose={() => {}} title="Decision" closeLabel="Close" actions={<button>Continue</button>}><p>Long body</p></Sheet>);
  const panel = getByRole('dialog');
  expect(getByRole('button', { name: 'Continue' }).closest('.sheet-actions')).not.toBeNull();
  expect(getByRole('button', { name: 'Close' }).closest('.sheet-body')).toBeNull();
  expect(panel.querySelector('.sheet-body')?.textContent).toBe('Long body');
});
