import { DockToolsContext } from '../../layout/dockTools';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { useAppStore } from '../../../state/store';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';
import { Piano } from '../Piano';

vi.mock('../../../hooks/useAudio.ts', () => ({ useAudio: () => ({ noteOn: vi.fn(), noteOff: vi.fn() }) }));
vi.mock('../../../hooks/useMediaQuery.ts', () => ({ useIsMobile: () => true, useIsCompact: () => true, useMediaQuery: () => false }));
afterEach(cleanup);

describe('phone lit-key labels', () => {
  it.each(['G', 'B'] as const)('labels every voiced %s major key beyond the C scale octave', (natural) => {
    useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: chordFromParsed(parseChordSymbol(natural)!), baseOctave: 4, scaleOctaves: 1, exerciseInputActive: false, activeNotes: new Set() });
    Element.prototype.scrollTo ??= () => {};
    const { container } = render(<Piano />);
    const key = container.querySelector(`[aria-label="${natural === 'G' ? 'D5' : 'F#5'}"]`);
    expect(key).not.toBeNull();
    expect(key!.textContent).toMatch(natural === 'G' ? /D/ : /F/);
  });
});

it('keeps the same octave chooser available in the supplied dock bar', () => {
  const slot = document.createElement('div');
  document.body.appendChild(slot);
  const { container } = render(<DockToolsContext.Provider value={slot}><Piano /></DockToolsContext.Provider>);
  expect(slot.querySelectorAll('[role="radio"]').length).toBeGreaterThan(0);
  expect(container.querySelector('.piano-octave-row')).toBeNull();
  slot.remove();
});
