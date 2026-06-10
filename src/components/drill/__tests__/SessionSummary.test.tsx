import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SessionSummary } from '../SessionSummary';
import type { SessionSummaryData } from '../useDrillRunner';

afterEach(cleanup);

function summary(over: Partial<SessionSummaryData> = {}): SessionSummaryData {
  return {
    correct: 8,
    asked: 10,
    byFamily: {},
    newlyByHeart: 0,
    newlyReview: 0,
    ...over,
  };
}

describe('SessionSummary', () => {
  it('shows the headline score', () => {
    render(
      <SessionSummary summary={summary()} onNewSession={() => {}} onMasteryMap={() => {}} onSprint={() => {}} />,
    );
    expect(screen.getByText('8 of 10 correct')).toBeDefined();
  });

  it('renders the by-heart callout only when facts crossed up (pluralized)', () => {
    const { rerender } = render(
      <SessionSummary summary={summary({ newlyByHeart: 0 })} onNewSession={() => {}} onMasteryMap={() => {}} onSprint={() => {}} />,
    );
    expect(screen.queryByText(/by heart/)).toBeNull();

    rerender(
      <SessionSummary summary={summary({ newlyByHeart: 2 })} onNewSession={() => {}} onMasteryMap={() => {}} onSprint={() => {}} />,
    );
    expect(screen.getByText('2 facts now by heart')).toBeDefined();
  });

  it('lists a per-family breakdown for answered families only', () => {
    render(
      <SessionSummary
        summary={summary({ byFamily: { triad: { asked: 4, correct: 3 }, interval: { asked: 2, correct: 2 } } })}
        onNewSession={() => {}}
        onMasteryMap={() => {}}
        onSprint={() => {}}
      />,
    );
    expect(screen.getByText('Triads')).toBeDefined();
    expect(screen.getByText('3/4')).toBeDefined();
    expect(screen.getByText('Intervals')).toBeDefined();
    expect(screen.getByText('2/2')).toBeDefined();
    // A family that wasn't answered is absent.
    expect(screen.queryByText('Scales')).toBeNull();
  });

  it('wires the three navigation buttons', () => {
    const onNewSession = vi.fn();
    const onMasteryMap = vi.fn();
    const onSprint = vi.fn();
    render(
      <SessionSummary summary={summary()} onNewSession={onNewSession} onMasteryMap={onMasteryMap} onSprint={onSprint} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'New session' }));
    fireEvent.click(screen.getByRole('button', { name: 'Mastery map' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sprint' }));
    expect(onNewSession).toHaveBeenCalledTimes(1);
    expect(onMasteryMap).toHaveBeenCalledTimes(1);
    expect(onSprint).toHaveBeenCalledTimes(1);
  });
});
