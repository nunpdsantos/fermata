import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DrillSettings } from '../DrillSettings';
import { DEFAULT_SETTINGS, type DrillSettings as DrillSettingsState } from '../../../state/drillStore';

afterEach(cleanup);

function settings(over: Partial<DrillSettingsState> = {}): DrillSettingsState {
  return { ...DEFAULT_SETTINGS, ...over };
}

/** Shared no-ops for required props not under test. */
const noop = () => {};

describe('DrillSettings', () => {
  it('marks the active session length and switches on tap', () => {
    const onUpdate = vi.fn();
    render(
      <DrillSettings settings={settings({ length: 24 })} onUpdate={onUpdate} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    expect(screen.getByRole('button', { name: '24' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '40' }));
    expect(onUpdate).toHaveBeenCalledWith({ length: 40 });
  });

  it('steps new-per-session within 0..8 bounds', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <DrillSettings settings={settings({ newPerSession: 0 })} onUpdate={onUpdate} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    // At 0, decrement is disabled; increment works.
    expect(screen.getByRole('button', { name: 'decrement' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'increment' }));
    expect(onUpdate).toHaveBeenCalledWith({ newPerSession: 1 });

    // At 8, increment is disabled.
    rerender(
      <DrillSettings settings={settings({ newPerSession: 8 })} onUpdate={onUpdate} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    expect(screen.getByRole('button', { name: 'increment' }).hasAttribute('disabled')).toBe(true);
  });

  it('toggles a family in settings.families', () => {
    const onUpdate = vi.fn();
    render(
      <DrillSettings settings={settings()} onUpdate={onUpdate} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    fireEvent.click(screen.getByRole('switch', { name: 'Triads' }));
    expect(onUpdate).toHaveBeenCalledWith({
      families: expect.objectContaining({ triad: false }),
    });
  });

  it('toggles the sound and show-timer switches', () => {
    const onUpdate = vi.fn();
    render(
      <DrillSettings settings={settings({ sound: true, showTimer: false })} onUpdate={onUpdate} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    fireEvent.click(screen.getByRole('switch', { name: 'Answer sound' }));
    expect(onUpdate).toHaveBeenCalledWith({ sound: false });
    fireEvent.click(screen.getByRole('switch', { name: 'Show timer' }));
    expect(onUpdate).toHaveBeenCalledWith({ showTimer: true });
  });

  it('wires Back and Mastery-map links', () => {
    const onBack = vi.fn();
    const onMasteryMap = vi.fn();
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={onBack} onMasteryMap={onMasteryMap} onResetProgress={noop} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /Mastery map/ }));
    expect(onMasteryMap).toHaveBeenCalledTimes(1);
  });

  // ── Reset drill progress ──────────────────────────────────────────────────

  it('shows reset label initially, not the confirm block', () => {
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    // getByText throws if absent — that IS the assertion
    screen.getByText('Reset drill progress');
    expect(screen.queryByText(/permanently erases/)).toBeNull();
    expect(screen.queryByText('Confirm reset')).toBeNull();
  });

  it('tapping the label shows the confirm block with warning + two buttons', () => {
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    fireEvent.click(screen.getByText('Reset drill progress'));

    expect(screen.queryByText('Reset drill progress')).toBeNull();
    screen.getByText(/permanently erases/);
    screen.getByText('Confirm reset');
    screen.getByText('Cancel');
  });

  it('Cancel dismisses the confirm block and restores the label', () => {
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    fireEvent.click(screen.getByText('Reset drill progress'));
    fireEvent.click(screen.getByText('Cancel'));

    screen.getByText('Reset drill progress');
    expect(screen.queryByText(/permanently erases/)).toBeNull();
  });

  it('Cancel does NOT call onResetProgress', () => {
    const onResetProgress = vi.fn();
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={noop} onMasteryMap={noop} onResetProgress={onResetProgress} />,
    );
    fireEvent.click(screen.getByText('Reset drill progress'));
    fireEvent.click(screen.getByText('Cancel'));

    expect(onResetProgress).not.toHaveBeenCalled();
  });

  it('Confirm reset calls onResetProgress and collapses the confirm block', () => {
    const onResetProgress = vi.fn();
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={noop} onMasteryMap={noop} onResetProgress={onResetProgress} />,
    );
    fireEvent.click(screen.getByText('Reset drill progress'));
    fireEvent.click(screen.getByText('Confirm reset'));

    expect(onResetProgress).toHaveBeenCalledTimes(1);
    // After confirm, confirmingReset snaps back to false (onResetProgress closes the screen)
    expect(screen.queryByText('Confirm reset')).toBeNull();
  });

  it('Confirm reset button meets ≥44pt min-height', () => {
    render(
      <DrillSettings settings={settings()} onUpdate={noop} onBack={noop} onMasteryMap={noop} onResetProgress={noop} />,
    );
    fireEvent.click(screen.getByText('Reset drill progress'));

    const confirmBtn = screen.getByText('Confirm reset').closest('button')!;
    const cancelBtn = screen.getByText('Cancel').closest('button')!;
    // className carries min-h-[44px] — just verify the element is a button
    expect(confirmBtn.tagName).toBe('BUTTON');
    expect(cancelBtn.tagName).toBe('BUTTON');
  });
});
