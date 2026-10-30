/**
 * Choice items: the wrong chip you tapped is marked (audit W7-07, D-12), and a
 * note-valued choice that is the right SOUND but the wrong SPELLING gets the
 * "same sound, wrong spelling" near-miss feedback (audit W7-08, D-16).
 *
 * Ported from the auditors' grading-probe (section 5: 96 note-above items
 * have enharmonic distractors, all graded plain wrong) and rtl-tests (no red
 * class on the tapped chip).
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { useState } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { DrillInput } from '../DrillInput';
import { gradeAnswer, normalizeDisplay, pcOf, type AnswerPayload } from '../grading';
import { generateDrillBank } from '../../../core/utils/drillBank';
import type { DrillItem } from '../../../core/types/drill';

afterEach(cleanup);

vi.mock('framer-motion', async () => {
  const React = await import('react');
  const MOTION_RE = /^(while|initial|animate|exit|transition|layout|variants|drag|onDrag)/;
  const cache = new Map<string, React.FC<Record<string, unknown>>>();
  function makeMotion(tag: string) {
    const hit = cache.get(tag);
    if (hit) return hit;
    const Comp = function MotionProxy(props: Record<string, unknown>) {
      const clean: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(props)) {
        if (k === 'children' || !MOTION_RE.test(k)) clean[k] = v;
      }
      return React.createElement(tag, clean);
    };
    cache.set(tag, Comp);
    return Comp;
  }
  const proxy = new Proxy({}, { get: (_t: unknown, prop: string) => makeMotion(prop) });
  return {
    motion: proxy,
    m: proxy,
    useReducedMotion: () => false,
    AnimatePresence: (p: { children: React.ReactNode }) => p.children,
    LazyMotion: (p: { children: React.ReactNode }) => p.children,
    domAnimation: {},
  };
});

const BANK = generateDrillBank();
const BY_ID = new Map(BANK.map((i) => [i.id, i]));
const NOTE_RE = /^[A-G](?:𝄪|𝄫|♯|♭)?$/u;
const isNote = (s: string) => NOTE_RE.test(s);

/** Minimal parent: answering flips the input into feedback, like DrillView. */
function Harness({ item }: { item: DrillItem }) {
  const [phase, setPhase] = useState<'answering' | 'feedback'>('answering');
  return <DrillInput item={item} phase={phase} onAnswer={(_p: AnswerPayload) => setPhase('feedback')} />;
}

describe('choice items: the tapped wrong chip is marked (W7-07)', () => {
  it('a wrong tap turns that chip red and the right one green', () => {
    const item = BY_ID.get('degree:num-to-name:1')!;
    const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
    const wrong = item.input.format === 'choice' ? item.input.choices.find((c) => c !== correct)! : '';
    render(<Harness item={item} />);
    fireEvent.click(screen.getByRole('button', { name: wrong }));
    expect(screen.getByRole('button', { name: wrong }).className).toContain('text-danger');
    expect(screen.getByRole('button', { name: correct }).className).toContain('text-success');
    // Untouched lures stay neutral.
    const others = item.input.format === 'choice' ? item.input.choices.filter((c) => c !== wrong && c !== correct) : [];
    for (const o of others) {
      expect(screen.getByRole('button', { name: o }).className).not.toMatch(/text-(danger|success|warning)/);
    }
  });

  it('a right tap marks only the right chip', () => {
    const item = BY_ID.get('degree:num-to-name:1')!;
    const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
    render(<Harness item={item} />);
    fireEvent.click(screen.getByRole('button', { name: correct }));
    expect(screen.getByRole('button', { name: correct }).className).toContain('text-success');
    expect(document.querySelectorAll('.text-danger, .text-warning')).toHaveLength(0);
  });

  it('an enharmonic pick on a note choice is marked amber, not red', () => {
    const item = BY_ID.get('interval:note-above:D:M3')!; // F♯; G♭ is offered
    render(<Harness item={item} />);
    fireEvent.click(screen.getByRole('button', { name: 'G♭' }));
    expect(screen.getByRole('button', { name: 'G♭' }).className).toContain('text-warning');
    expect(screen.getByRole('button', { name: 'F♯' }).className).toContain('text-success');
  });
});

describe('choice items: near-miss for note-valued answers (W7-08)', () => {
  it('audit probe: D up a major 3rd — G♭ for F♯ is "same sound, wrong spelling"', () => {
    const item = BY_ID.get('interval:note-above:D:M3')!;
    expect(gradeAnswer(item, { format: 'choice', choice: 'G♭' })).toEqual({ correct: false, nearMiss: true });
    expect(gradeAnswer(item, { format: 'choice', choice: 'F♯' })).toEqual({ correct: true, nearMiss: false });
    expect(gradeAnswer(item, { format: 'choice', choice: 'G' })).toEqual({ correct: false, nearMiss: false });
  });

  it('across the bank: every enharmonic distractor of a note answer is a near miss, every other wrong pick is not', () => {
    let enharmonicPicks = 0;
    for (const item of BANK) {
      if (item.input.format !== 'choice' || item.answer.kind !== 'choice') continue;
      const correct = item.answer.correct;
      for (const choice of item.input.choices) {
        if (choice === correct) continue;
        const r = gradeAnswer(item, { format: 'choice', choice });
        expect(r.correct, `${item.id} ${choice}`).toBe(false);
        const sameSound =
          isNote(correct) && isNote(choice) && pcOf(normalizeDisplay(choice)) === pcOf(normalizeDisplay(correct));
        if (sameSound) enharmonicPicks++;
        expect(r.nearMiss, `${item.id}: ${choice} for ${correct}`).toBe(sameSound);
      }
    }
    // The audit counted 96 note-above items carrying an enharmonic lure.
    expect(enharmonicPicks).toBeGreaterThanOrEqual(96);
  });

  it('non-note answers never near-miss (names, keys, Yes/No)', () => {
    for (const id of ['degree:num-to-name:1', 'keysig:sig-to-key:6#:major', 'roman:is-diatonic:C:2:yes']) {
      const item = BY_ID.get(id)!;
      const correct = item.answer.kind === 'choice' ? item.answer.correct : '';
      for (const c of item.input.format === 'choice' ? item.input.choices : []) {
        if (c === correct) continue;
        expect(gradeAnswer(item, { format: 'choice', choice: c }).nearMiss, `${id} ${c}`).toBe(false);
      }
    }
  });
});
