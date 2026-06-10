import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { DrillSettings } from '../DrillSettings';
import { DEFAULT_SETTINGS, type DrillSettings as DrillSettingsState } from '../../../state/drillStore';

afterEach(cleanup);

function settings(over: Partial<DrillSettingsState> = {}): DrillSettingsState {
  return { ...DEFAULT_SETTINGS, ...over };
}

describe('DrillSettings', () => {
  it('marks the active session length and switches on tap', () => {
    const onUpdate = vi.fn();
    render(
      <DrillSettings settings={settings({ length: 24 })} onUpdate={onUpdate} onBack={() => {}} onMasteryMap={() => {}} />,
    );
    expect(screen.getByRole('button', { name: '24' }).getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: '40' }));
    expect(onUpdate).toHaveBeenCalledWith({ length: 40 });
  });

  it('steps new-per-session within 0..8 bounds', () => {
    const onUpdate = vi.fn();
    const { rerender } = render(
      <DrillSettings settings={settings({ newPerSession: 0 })} onUpdate={onUpdate} onBack={() => {}} onMasteryMap={() => {}} />,
    );
    // At 0, decrement is disabled; increment works.
    expect(screen.getByRole('button', { name: 'decrement' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'increment' }));
    expect(onUpdate).toHaveBeenCalledWith({ newPerSession: 1 });

    // At 8, increment is disabled.
    rerender(
      <DrillSettings settings={settings({ newPerSession: 8 })} onUpdate={onUpdate} onBack={() => {}} onMasteryMap={() => {}} />,
    );
    expect(screen.getByRole('button', { name: 'increment' }).hasAttribute('disabled')).toBe(true);
  });

  it('toggles a family in settings.families', () => {
    const onUpdate = vi.fn();
    render(
      <DrillSettings settings={settings()} onUpdate={onUpdate} onBack={() => {}} onMasteryMap={() => {}} />,
    );
    fireEvent.click(screen.getByRole('switch', { name: 'Triads' }));
    expect(onUpdate).toHaveBeenCalledWith({
      families: expect.objectContaining({ triad: false }),
    });
  });

  it('toggles the sound and show-timer switches', () => {
    const onUpdate = vi.fn();
    render(
      <DrillSettings settings={settings({ sound: true, showTimer: false })} onUpdate={onUpdate} onBack={() => {}} onMasteryMap={() => {}} />,
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
      <DrillSettings settings={settings()} onUpdate={() => {}} onBack={onBack} onMasteryMap={onMasteryMap} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole('button', { name: /Mastery map/ }));
    expect(onMasteryMap).toHaveBeenCalledTimes(1);
  });
});
