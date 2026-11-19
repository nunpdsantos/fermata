/**
 * Every lesson demonstration (second audit, M50–M56; `CurriculumConcept.demo`,
 * `CurriculumTask.demos`), wherever an author puts one:
 *  - it passes the authoring check (`demonstrationProblems`: spelled
 *    pitches, bars that add up, voices that end together, upper voice first);
 *  - its staff, drawn by the real `DemoStaff` with VexFlow and read back from
 *    the glyphs (`src/test/staffReader.ts`), says what "Hear it" plays: the
 *    same pitches at the same onsets and lengths, the key signature it names;
 *  - its text alternative names every note it draws, in order, in EN, PT, ES;
 *  - the labels this stream changed name the same notes, numbers and
 *    intervals in PT and ES as in English.
 * And the check itself, with a planted fault for each rule.
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { render, cleanup, waitFor } from '@testing-library/react';
import { L1_UNITS } from '../../core/constants/curriculumL1';
import { L2_UNITS } from '../../core/constants/curriculumL2';
import { L3_UNITS } from '../../core/constants/curriculumL3';
import { L4_UNITS } from '../../core/constants/curriculumL4';
import { L5_UNITS } from '../../core/constants/curriculumL5';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';
import type { Demonstration } from '../../core/types/demonstration';
import { demonstration, demonstrationProblems, demonstrationSchedule, run, note, chord, rest, DEMO_SOUNDING } from '../../core/utils/demonstration';
import { DemoStaff } from '../../components/learn/lesson/DemoStaff';
import { describeDemonstration, pitchName } from '../../components/learn/lesson/demoDescription';
import { demoStaffPlan } from '../../components/learn/lesson/demoStaffPlan';
import { readStaffSvg, drawnSounds, midiOf } from '../../test/staffReader';
import { keySignatureAlterations } from '../../utils/notationHelpers';
import i18n from '../../i18n';
import { applyCurriculumOverlay } from '../../i18n/content/contentResolver';
import ptL4 from '../../i18n/content/pt/curriculumL4';
import esL4 from '../../i18n/content/es/curriculumL4';
import ptL7 from '../../i18n/content/pt/curriculumL7';
import esL7 from '../../i18n/content/es/curriculumL7';
import ptL9 from '../../i18n/content/pt/curriculumL9';
import esL9 from '../../i18n/content/es/curriculumL9';
import type { CurriculumLevel, CurriculumUnit } from '../../core/types/curriculum';

const LEVELS = [L1_UNITS, L2_UNITS, L3_UNITS, L4_UNITS, L5_UNITS, L6_UNITS, L7_UNITS, L8_UNITS, L9_UNITS];
const DEMOS: [string, Demonstration][] = LEVELS.flat().flatMap((u) => u.modules).flatMap((m) => [
  ...m.concepts.flatMap((c, i) => (c.demo ? [[`${m.id} c${i}`, c.demo] as [string, Demonstration]] : [])),
  ...m.tasks.flatMap((t) => Object.entries(t.demos ?? {}).map(([q, d]) => [`${t.id} ‘${q}’`, d] as [string, Demonstration])),
]);

beforeAll(() => {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('every demonstration in the lessons', () => {
  it('there are the ones the second audit asked for: nine concepts and three tasks', () => {
    expect(DEMOS.map(([w]) => w)).toEqual([
      'l1u3m2 c0', 'l1u3m2 c1', 'l1u3m2 c2', 'l1u3m2t1 ‘key of G’', 'l1u3m2t2 ‘key of D’', 'l1u3m2t3 ‘key of F’',
      'l4u12m1 c2', 'l7u21m2 c0', 'l7u22m5 c0', 'l7u22m5 c2', 'l7u23m5 c0', 'l9u30m3 c0',
    ]);
  });

  it.each(DEMOS)('%s passes the authoring check', (_w, demo) => {
    expect(demonstrationProblems(demo)).toEqual([]);
  });

  it.each(DEMOS)('%s: its staff draws what it plays', async (_w, demo) => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ width: 360, height: 100, top: 0, left: 0, right: 360, bottom: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect);
    const { container } = render(<DemoStaff demo={demo} description="x" />);
    const svg = await waitFor(() => {
      const s = container.querySelector('g.vf-stavenote')?.closest('svg');
      if (!s) throw new Error('not drawn');
      return s;
    });
    const score = readStaffSvg(svg);
    const played = demonstrationSchedule(demo);
    const written = drawnSounds(score);
    expect(written.map((w) => midiOf(w.pitch))).toEqual(played.map((p) => p.midi));
    const beat = 60 / demo.tempo;
    written.forEach((w, i) => {
      expect(played[i].at).toBeCloseTo(w.at * beat, 6);
      expect(played[i].duration).toBeCloseTo(w.beats * beat * DEMO_SOUNDING, 6);
    });
    // The key signature it names, after the clef, on every staff.
    const alterations = keySignatureAlterations(demo.key);
    for (const staff of score.staves) {
      expect(staff.signature.map((s) => `${s.letter}${s.sign}`).sort()).toEqual(Object.entries(alterations).map(([l, a]) => `${l}${a}`).sort());
      expect(staff.time).toBe(demo.time);
    }
    expect(score.staves.map((s) => s.clef)).toEqual(demoStaffPlan(demo).staves);
    // A screen reader is given one image with the description, not the drawing.
    expect(container.querySelector('[role="img"]')!.getAttribute('aria-label')).toBe('x');
    expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it.each(DEMOS)('%s: its text alternative names every note it draws, in order, in EN, PT and ES', async (_w, demo) => {
    const plan = demoStaffPlan(demo);
    for (const lang of ['en', 'pt', 'es'] as const) {
      const t = i18n.getFixedT(lang);
      const text = describeDemonstration(demo, t);
      let from = 0;
      for (const voice of plan.voices) {
        for (const n of voice.notes) {
          for (const p of n.pitches) {
            const at = text.indexOf(pitchName(p), from);
            expect(at, `${lang}: ${pitchName(p)} after position ${from} in “${text}”`).toBeGreaterThanOrEqual(0);
            from = at;
          }
        }
      }
      expect(text).not.toMatch(/lessonDemo\.|lesson\.rhythm/);
    }
  });
});

describe('the text alternative reads as the staff does', () => {
  it('a key signature, a grand staff and two voices, in English', () => {
    const t = i18n.getFixedT('en');
    const pedal = DEMOS.find(([w]) => w === 'l7u22m5 c2')![1];
    expect(describeDemonstration(pedal, t)).toBe(
      'Grand staff, treble and bass, in 4/4. Upper voice on the treble staff: D4, E4, F4 and G4 (quarter notes) | A4, B♭4, C5 and D5 (quarter notes). Lower voice on the bass staff: D3 (whole note) | D3 (whole note).',
    );
    const g = DEMOS.find(([w]) => w === 'l1u3m2 c0')![1];
    expect(describeDemonstration(g, t)).toBe('Treble staff, one sharp in the key signature: F♯. G4, A4, B4, C5, D5, E5, F♯5 and G5 (quarter notes).');
    const d = DEMOS.find(([w]) => w === 'l1u3m2 c1')![1];
    expect(describeDemonstration(d, i18n.getFixedT('pt'))).toBe('Pauta em clave de sol, 2 sustenidos na armação de clave: F♯ e C♯. D4, E4, F♯4, G4, A4, B4, C♯5 e D5 (semínimas).');
    const sus = DEMOS.find(([w]) => w === 'l4u12m1 c2')![1];
    expect(describeDemonstration(sus, i18n.getFixedT('es'))).toBe('Pentagrama en clave de sol. Voz superior: E4 (redonda). Voz inferior: D4 y C4 (blancas).');
    const tied = demonstration('tie', { tempo: 60, time: '4/4', voices: [{ staff: 'bass', events: [note('w', 'D3', { tie: true }), note('w', 'D3')] }] });
    expect(describeDemonstration(tied, t)).toBe('Bass staff, in 4/4. D3 (whole note tied to the next) | D3 (whole note).');
  });
});

describe('the labels this stream changed: the same notes, numbers and intervals in PT and ES', () => {
  const overlaid = (units: CurriculumUnit[], ov: unknown) => applyCurriculumOverlay({ id: 'x', units } as unknown as CurriculumLevel, ov as never).units;
  const label = (units: CurriculumUnit[], id: string, c: number) => units.flatMap((u) => u.modules).find((m) => m.id === id)!.concepts[c].tryThisLabel;
  // Note letters (with their signs), digits, and the C–D pairs, in order.
  const facts = (s: string) => (s.match(/\b[A-G](?:♯|♭|#|b)?(?:m7|maj13|m11)?\b|\d+/g) ?? []).join(' ');
  const cases: [CurriculumUnit[], [unknown, unknown], string, number][] = [
    [L4_UNITS, [ptL4, esL4], 'l4u12m1', 2],
    [L7_UNITS, [ptL7, esL7], 'l7u21m2', 0],
    [L7_UNITS, [ptL7, esL7], 'l7u22m5', 0],
    [L7_UNITS, [ptL7, esL7], 'l7u22m5', 2],
    [L7_UNITS, [ptL7, esL7], 'l7u23m5', 0],
    [L9_UNITS, [ptL9, esL9], 'l9u30m3', 0],
  ];
  it.each(cases)('%#: %s c%s', (units, [pt, es], id, c) => {
    const en = facts(label(units, id, c));
    expect(en.length).toBeGreaterThan(0);
    expect(facts(label(overlaid(units, pt), id, c)), 'PT').toBe(en);
    expect(facts(label(overlaid(units, es), id, c)), 'ES').toBe(en);
  });
});

describe('the authoring check, each rule with a planted fault', () => {
  const ok: Demonstration = { tempo: 100, time: '4/4', voices: [{ staff: 'treble', events: run('q', ['C4', 'D4', 'E4', 'F4']) }] };
  it('a good one passes and is returned as it is', () => {
    expect(demonstration('ok', ok)).toBe(ok);
  });
  it.each<[string, Demonstration, RegExp]>([
    ['bars that do not add up', { ...ok, voices: [{ staff: 'treble', events: run('q', ['C4', 'D4', 'E4']) }] }, /whole number of 4\/4 bars/],
    ['a note across the bar line', { ...ok, voices: [{ staff: 'treble', events: [...run('q', ['C4', 'D4', 'E4']), note('h', 'F4'), note('h.', 'G4')] }] }, /crosses the bar line/],
    ['a pitch that is not spelled (outside the type)', { ...ok, voices: [{ staff: 'treble', events: [{ notes: ['H4' as never], value: 'w' }] }] }, /not a spelled pitch/],
    ['a tie to different notes', { tempo: 100, voices: [{ staff: 'treble', events: [note('h', 'C4', { tie: true }), note('h', 'D4')] }] }, /does not hold the same pitches/],
    ['a tied rest', { tempo: 100, voices: [{ staff: 'treble', events: [{ notes: [], value: 'h', tie: true }, rest('h')] }] }, /rest cannot be tied/],
    ['voices of different lengths', { tempo: 100, voices: [{ staff: 'treble', events: [note('w', 'E4')] }, { staff: 'treble', events: [note('h', 'C4')] }] }, /end together/],
    ['the lower voice first', { tempo: 100, voices: [{ staff: 'treble', events: [note('w', 'C4')] }, { staff: 'treble', events: [note('w', 'E4')] }] }, /first voice must be the upper/],
    ['three voices', { tempo: 100, voices: [{ staff: 'treble', events: [note('w', 'G4')] }, { staff: 'treble', events: [note('w', 'E4')] }, { staff: 'treble', events: [note('w', 'C4')] }] }, /one or two/],
    ['a chord written high to low', { tempo: 100, voices: [{ staff: 'treble', events: [chord('w', ['G4', 'C4'])] }] }, /low to high/],
    ['a tempo out of range', { ...ok, tempo: 400 }, /tempo 400/],
  ])('%s', (_name, demo, problem) => {
    const problems = demonstrationProblems(demo);
    expect(problems.join('; ')).toMatch(problem);
    expect(() => demonstration('planted', demo)).toThrow(/Demonstration planted:/);
  });
  it('octaves 1 to 7, all on the piano: C1 passes, C8 and C0 are refused', () => {
    expect(demonstrationProblems({ tempo: 100, voices: [{ staff: 'bass', events: [note('w', 'C1')] }] })).toEqual([]);
    for (const p of ['C8', 'C0']) {
      expect(demonstrationProblems({ tempo: 100, voices: [{ staff: 'treble', events: [{ notes: [p as never], value: 'w' }] }] }).join()).toMatch(/not a spelled pitch/);
    }
  });
});
