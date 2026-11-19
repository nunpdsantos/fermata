/**
 * Fix pass (independent review of the 2026-11-18 audit fixes, item 6): Build's
 * "Other interpretations" listed the main chord again ("C Diminished 7th —
 * Perfect match" twice, "C Augmented" twice), missed the equally exact
 * readings on the other notes of a symmetrical chord (C E♭ G♭ B𝄫 is also the
 * diminished 7th on E♭, G♭ and A; C E G♯ the augmented triad on E and G♯), and
 * described matches in English in PT and ES.
 *
 * The oracle for "equally exact" is arithmetic: a reading is exact when the
 * pitch classes built are exactly the quality's formula on that root.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import i18n from '../../../i18n';
import { otherReadings, matchText } from '../builderRole';
import { ChordBuilderPanel } from '../ChordBuilderPanel';
import { identifyChordFromNotes } from '../../../core/utils/reverseChordParser';
import { CHORD_FORMULAS } from '../../../core/constants/chords';
import { getPitchClass } from '../../../core/constants/notes';
import { canonicalIntervalNumber, spellIntervalAbove } from '../../../core/utils/degreeSpelling';
import type { ChordIdentification, ChordQuality, Note } from '../../../core/types/music';
import { useAppStore } from '../../../state/store';

vi.mock('../../../core/services/audio.ts', () => ({
  resumeAudio: vi.fn(() => Promise.resolve()), playChordVoiced: vi.fn(), playPitchedNotes: vi.fn(), cancelScheduledAudio: vi.fn(),
}));
vi.mock('../../../services/synthConfig.ts', () => ({ getSynthConfig: vi.fn(() => ({})) }));

afterEach(async () => {
  cleanup();
  await i18n.changeLanguage('en');
});

const n = (s: string): Note => ({ natural: s[0], accidental: s.slice(1) }) as Note;
const name = (x: Note) => `${x.natural}${x.accidental}`;
const QUALITIES = Object.keys(CHORD_FORMULAS) as ChordQuality[];

/** As the builder does: blocks spelled by their interval from the root; the main reading prefers the root block. */
function readingsFor(root: Note, steps: number[]) {
  const notes = steps.map((s) => spellIntervalAbove(root, canonicalIntervalNumber(s), s));
  const results = identifyChordFromNotes(notes).results;
  const best = results[0];
  const main = best && steps.includes(0)
    ? results.find((r) => r.score === best.score && r.confidence === best.confidence && getPitchClass(r.chord.root) === getPitchClass(root)) ?? best
    : best;
  return { notes, results, main, others: otherReadings(main, results) };
}

/** Every exact reading, by arithmetic: the pitch set is a formula on one of its own notes. */
function exactOracle(pcs: Set<number>): string[] {
  const out: string[] = [];
  for (const rootPc of pcs) {
    for (const q of QUALITIES) {
      if (q === 'power' && pcs.size > 2) continue;
      const f = new Set(CHORD_FORMULAS[q].map((s) => (rootPc + s) % 12));
      if (f.size === pcs.size && [...f].every((p) => pcs.has(p))) out.push(`${rootPc}:${q}`);
    }
  }
  return out;
}

describe('the readings the review named', () => {
  it('C E♭ G♭ B𝄫 (the strip spells F♯ A): the diminished 7ths on E♭, G♭ and A, and never C again', () => {
    const { main, others } = readingsFor(n('C'), [0, 3, 6, 9]);
    expect(name(main!.chord.root)).toBe('C');
    expect(main!.chord.quality).toBe('diminished7');
    expect(others.slice(0, 3).map((r) => `${name(r.chord.root)} ${r.chord.quality}`)).toEqual(['Eb diminished7', 'Gb diminished7', 'A diminished7']);
    expect(others.some((r) => getPitchClass(r.chord.root) === 0 && r.chord.quality === 'diminished7')).toBe(false);
  });
  it('C E G♯: the augmented triads on E and G♯, and never C again', () => {
    const { main, others } = readingsFor(n('C'), [0, 4, 8]);
    expect(`${name(main!.chord.root)} ${main!.chord.quality}`).toBe('C augmented');
    expect(others.slice(0, 2).map((r) => `${name(r.chord.root)} ${r.chord.quality}`)).toEqual(['E augmented', 'G# augmented']);
    expect(others.filter((r) => r.chord.quality === 'augmented' && getPitchClass(r.chord.root) === 0)).toEqual([]);
  });
  it('C E G A: the A minor 7th, as exact as C6', () => {
    const { main, others } = readingsFor(n('C'), [0, 4, 7, 9]);
    expect(main!.chord.quality).toBe('major6');
    expect(`${name(others[0].chord.root)} ${others[0].chord.quality}`).toBe('A minor7');
  });
});

describe('every chord shape the builder can make (2 to 5 blocks, the root block on), from C, F♯ and B♭', () => {
  it('no duplicate of the main reading, every equally exact reading listed, no double-accidental root', () => {
    const wrong: string[] = [];
    let sets = 0;
    let symmetrical = 0;
    for (const root of [n('C'), n('F#'), n('Bb')]) {
      const rest = Array.from({ length: 12 }, (_, i) => i + 1);
      const subsets: number[][] = [[]];
      for (const s of rest) for (const sub of [...subsets]) if (sub.length < 4) subsets.push([...sub, s]);
      for (const sub of subsets) {
        if (sub.length === 0) continue;
        const steps = [0, ...sub];
        sets++;
        const { main, others, notes } = readingsFor(root, steps);
        if (!main) continue;
        const where = `${name(root)} + [${sub.join(',')}] (${notes.map(name).join(' ')})`;
        const key = (r: ChordIdentification) => `${getPitchClass(r.chord.root)}:${r.chord.quality}`;
        const listed = others.map(key);
        if (listed.includes(key(main))) wrong.push(`${where}: the main reading listed again`);
        if (new Set(listed).size !== listed.length) wrong.push(`${where}: a reading listed twice`);
        for (const r of others) if (r.chord.root.accidental.length > 1) wrong.push(`${where}: root ${name(r.chord.root)}`);
        if (main.confidence === 'exact') {
          const exact = exactOracle(new Set(notes.map(getPitchClass))).filter((k) => k !== key(main));
          if (exact.length > 0) symmetrical++;
          for (const k of exact) if (!listed.includes(k)) wrong.push(`${where}: misses the exact reading ${k}`);
        }
      }
    }
    expect(sets).toBe(3 * 793);
    expect(symmetrical).toBeGreaterThan(20);
    expect(wrong.slice(0, 15), `${wrong.length} wrong`).toEqual([]);
  });
});

describe('the match descriptions, EN / PT / ES', () => {
  const words = {
    en: { perfect: 'Perfect match', added: 'Match with 1 added note', added2: 'Match with 2 added notes', missing: 'Missing 1 note', missing2: 'Missing 2 notes', both: '1 missing, 2 added' },
    pt: { perfect: 'Correspondência perfeita', added: 'Correspondência com 1 nota a mais', added2: 'Correspondência com 2 notas a mais', missing: 'Falta 1 nota', missing2: 'Faltam 2 notas', both: '1 em falta, 2 a mais' },
    es: { perfect: 'Coincidencia perfecta', added: 'Coincidencia con 1 nota añadida', added2: 'Coincidencia con 2 notas añadidas', missing: 'Falta 1 nota', missing2: 'Faltan 2 notas', both: '1 de menos, 2 de más' },
  } as const;
  const reading = (score: number, missing: number, extra: number) => ({
    score, confidence: 'likely', interpretation: '', chord: { root: n('C'), quality: 'major', notes: [] },
    missingNotes: missing ? Array.from({ length: missing }, () => n('C')) : undefined,
    extraNotes: extra ? Array.from({ length: extra }, () => n('C')) : undefined,
  }) as unknown as ChordIdentification;
  for (const lang of ['en', 'pt', 'es'] as const) {
    it(lang, async () => {
      await i18n.changeLanguage(lang);
      const t = i18n.t.bind(i18n);
      const w = words[lang];
      expect(matchText(reading(100, 0, 0), t)).toBe(w.perfect);
      expect(matchText(reading(90, 0, 1), t)).toBe(w.added);
      expect(matchText(reading(80, 0, 2), t)).toBe(w.added2);
      expect(matchText(reading(60, 1, 0), t)).toBe(w.missing);
      expect(matchText(reading(40, 2, 0), t)).toBe(w.missing2);
      expect(matchText(reading(50, 1, 2), t)).toBe(w.both);
    });
  }

  it('in the panel, PT and ES: no English in "Other interpretations"', async () => {
    useAppStore.setState({ selectedKey: { natural: 'C', accidental: '' }, selectedScale: 'major', selectedChord: null, chordInversion: 0, instrument: 'piano', baseOctave: 4 });
    for (const lang of ['pt', 'es'] as const) {
      await i18n.changeLanguage(lang);
      render(<ChordBuilderPanel />);
      const buttons = screen.getByRole('group').querySelectorAll('button');
      for (const s of [3, 6, 9]) fireEvent.click(buttons[s]);
      const list = within(screen.getByTestId('builder-others')).getAllByRole('listitem').map((li) => li.textContent ?? '');
      expect(list.length).toBeGreaterThanOrEqual(3);
      expect(list.join(' | ')).not.toMatch(/Perfect|Match|Missing|extra/);
      expect(list.filter((l) => /^C /.test(l) && /7/.test(l)).length, `${lang}: C dim7 not listed again`).toBeLessThanOrEqual(0);
      cleanup();
    }
  });
});
