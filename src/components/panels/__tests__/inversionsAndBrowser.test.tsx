/**
 * Audit W2-09 (C-59) — every inversion button of a 5+ note chord has its own
 * label (Root, 1st Inv, 2nd Inv, 3rd Inv, Inv 4, …), never a second "Root".
 * Audit W2-10 (C-89) — the chord browser offers every chord quality, and marks
 * qualities that are the same notes under another name.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen, fireEvent, within } from '@testing-library/react';
import type { ChordQuality } from '../../../core/types/music';
import { CurrentChordPanel } from '../CurrentChordPanel';
import { ChordBrowser } from '../../theory/ChordBrowser';
import { buildChord, CHORD_FORMULAS, CHORD_SYMBOLS } from '../../../core/constants/chords';
import { useAppStore } from '../../../state/store';
import i18n from '../../../i18n';

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const make = (tag: string) => (props: Record<string, unknown>) => {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
    return React.createElement(tag, clean);
  };
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => make(prop) });
  return { motion: proxy, m: proxy, AnimatePresence: (p: { children: React.ReactNode }) => p.children, LazyMotion: (p: { children: React.ReactNode }) => p.children, domAnimation: {} };
});
vi.mock('../../../core/services/audio.ts', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  resumeAudio: vi.fn(async () => {}),
  playChordVoiced: vi.fn(),
  playArpeggioAscending: vi.fn(),
}));

afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('en');
});

const C = { natural: 'C', accidental: '' } as const;
const QUALITIES = Object.keys(CHORD_FORMULAS) as ChordQuality[];

describe('W2-09 — inversion buttons', () => {
  it('every quality: one distinct label per inversion, "Root" only for the first', () => {
    const bad: string[] = [];
    for (const q of QUALITIES) {
      const chord = buildChord(C, q);
      useAppStore.setState({ selectedKey: C, selectedScale: 'major', selectedChord: chord, chordInversion: 0 });
      render(<CurrentChordPanel chord={chord} />);
      const labels = within(screen.getByRole('radiogroup')).getAllByRole('radio').map((r) => r.textContent ?? '');
      if (labels.length !== chord.notes.length) bad.push(`${q}: ${labels.length} buttons`);
      if (new Set(labels).size !== labels.length) bad.push(`${q}: repeated labels ${labels.join(' | ')}`);
      if (labels.slice(1).includes('Root')) bad.push(`${q}: a later inversion is labelled Root`);
      cleanup();
    }
    expect(bad).toEqual([]);
  });

  it('C major 9th reads Root | 1st Inv | 2nd Inv | 3rd Inv | Inv 4 (and PT/ES too)', async () => {
    const chord = buildChord(C, 'major9');
    useAppStore.setState({ selectedChord: chord, chordInversion: 0 });
    for (const [lang, last] of [['en', 'Inv 4'], ['pt', '4ª Inv'], ['es', '4ª Inv']] as const) {
      await i18n.changeLanguage(lang);
      render(<CurrentChordPanel chord={chord} />);
      const labels = within(screen.getByRole('radiogroup')).getAllByRole('radio').map((r) => r.textContent);
      expect(labels[4], lang).toBe(last);
      cleanup();
    }
  });
});

describe('W2-10 — chord browser', () => {
  function browsable(): { quality: string; text: string }[] {
    useAppStore.setState({ selectedKey: C, selectedChord: null });
    render(<ChordBrowser />);
    const tabs = screen.getAllByRole('button').filter((b) => b.closest('.flex-wrap'));
    const out: { quality: string; text: string }[] = [];
    for (const tab of tabs) {
      fireEvent.click(tab);
      for (const b of document.querySelectorAll('[data-quality]')) out.push({ quality: b.getAttribute('data-quality')!, text: b.textContent ?? '' });
    }
    return out;
  }

  it('offers every chord quality exactly once', () => {
    const qs = browsable().map((x) => x.quality).sort();
    expect(qs).toEqual([...QUALITIES].sort());
  });

  it('marks qualities that are the same notes under another name', () => {
    const pcs = (q: ChordQuality) => [...new Set(CHORD_FORMULAS[q].map((s) => s % 12))].sort((a, b) => a - b).join();
    const items = browsable();
    for (const { quality, text } of items) {
      const twins = QUALITIES.filter((o) => o !== quality && pcs(o) === pcs(quality as ChordQuality));
      for (const t of twins) expect(text, quality).toContain(`= C${CHORD_SYMBOLS[t]}`);
      if (twins.length === 0) expect(text, quality).not.toContain('=');
    }
    expect(items.find((i) => i.quality === 'augmented7')!.text).toContain('= C7#5');
    expect(items.find((i) => i.quality === 'dominant9sus4')!.text).toContain('= C11');
  });
});
