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
import { demonstration, demonstrationProblems, demonstrationSchedule, run, note, chord, rest, lineBreak, DEMO_SOUNDING } from '../../core/utils/demonstration';
import { DemoStaff } from '../../components/learn/lesson/DemoStaff';
import { describeDemonstration, pitchName } from '../../components/learn/lesson/demoDescription';
import { demoStaffPlan, demoStaffLayout } from '../../components/learn/lesson/demoStaffPlan';
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

/**
 * The form's other features, which no lesson uses yet, so that the drawing
 * and the sound are proved to agree on them too: a tie across a bar line
 * (one sound), a tied chord, dotted values, an eighth, a rest, and a sign the
 * new bar must print again and a natural that cancels it.
 */
const FORM: [string, Demonstration][] = [
  ['form: a held bass tied across the bar line', demonstration('form tie', {
    tempo: 90, time: '4/4',
    voices: [
      { staff: 'treble', events: run('q', ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4']) },
      { staff: 'bass', events: [note('w', 'C3', { tie: true }), note('w', 'C3')] },
    ],
  })],
  ['form: dots, an eighth, a rest, a sign again and a natural', demonstration('form values', {
    tempo: 100, time: '3/4', key: 'C',
    voices: [{ staff: 'treble', events: [note('h.', 'F#4'), note('q.', 'F#4'), note('8', 'F4'), rest('q')] }],
  })],
  ['form: a tied chord, no metre', demonstration('form chord tie', {
    tempo: 120,
    voices: [{ staff: 'treble', events: [chord('h', ['C4', 'E4', 'G4'], { tie: true }), chord('h', ['C4', 'E4', 'G4']), chord('w', ['B3', 'D4', 'F4', 'G4'])] }],
  })],
  // A sign kept by a tie across the bar line (not printed again), and printed
  // again for the next F♯ of that bar: the tie is no sign for the bar.
  ['form: a sign held by a tie across the bar line, then printed again', demonstration('form tied sign', {
    tempo: 100, time: '4/4',
    voices: [{ staff: 'treble', events: [note('h', 'F#4'), note('h', 'F#4', { tie: true }), note('h', 'F#4'), note('h', 'F#4')] }],
  })],
  // Two voices on one staff: stems up for the upper even where the notes sit
  // high (VexFlow's own rule would point them down), down for the lower.
  ['form: two voices on one staff, stems apart', demonstration('form stems', {
    tempo: 100,
    voices: [
      { staff: 'treble', events: [note('h', 'C5'), note('h', 'D5')] },
      { staff: 'treble', events: [note('h', 'E4'), note('h', 'F4')] },
    ],
  })],
];

beforeAll(() => {
  (globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} };
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('every demonstration in the lessons', () => {
  it('there are the ones the second audit asked for, and those its fix pass added (the key signatures\' class, the suspensions, the drones, the large intervals, the chords of C)', () => {
    expect(DEMOS.map(([w]) => w)).toEqual([
      'l1u3m2 c0', 'l1u3m2 c1', 'l1u3m2 c2', 'l1u3m2t1 ‘key of G’', 'l1u3m2t2 ‘key of D’', 'l1u3m2t3 ‘key of F’',
      'l2u4m1 c0', 'l2u4m1 c1', 'l2u4m1 c2', 'l2u4m1t2 ‘Ab major scale’', 'l2u4m1t3 ‘E major scale’',
      'l3u11m5 c1',
      'l4u12m1 c1', 'l4u12m1 c2', 'l4u12m1t1 ‘C major chord’', 'l4u14m4 c0',
      'l7u21m2 c0', 'l7u22m5 c0', 'l7u22m5 c2', 'l7u22m5t1 ‘Dm11’', 'l7u22m5t3 ‘D dorian’', 'l7u22m5t3 ‘D natural minor scale’', 'l7u23m5 c0',
      'l9u30m3 c0', 'l9u30m4 c1', 'l9u32m4 c2',
    ]);
  });

  it.each(DEMOS)('%s passes the authoring check', (_w, demo) => {
    expect(demonstrationProblems(demo)).toEqual([]);
  });

  it.each([...DEMOS, ...FORM])('%s: its staff draws what it plays', async (_w, demo) => {
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
      // Its whole length, or a tenth less where its voice strikes the same pitch straight after.
      expect(played[i].duration).toBeCloseTo(w.beats * beat * (w.struckAgain ? DEMO_SOUNDING : 1), 6);
    });
    // The key signature it names, after the clef, on every staff.
    const alterations = keySignatureAlterations(demo.key);
    const plan = demoStaffPlan(demo);
    score.staves.forEach((staff, i) => {
      expect(staff.signature.map((s) => `${s.letter}${s.sign}`).sort()).toEqual(Object.entries(alterations).map(([l, a]) => `${l}${a}`).sort());
      // The time signature on the first line only.
      expect(staff.time).toBe(i < plan.staves.length ? demo.time : undefined);
    });
    // Its staves, line after line, as the author's line breaks ask.
    expect(score.systems).toBe(plan.rows);
    expect(score.staves.map((s) => s.clef)).toEqual(Array.from({ length: plan.rows }, () => plan.staves).flat());
    // Two voices on one staff: the upper's stems up, the lower's down (a whole note has none).
    demo.voices.forEach((voice, v) => {
      const shared = demo.voices.filter((x) => x.staff === voice.staff);
      if (shared.length < 2) return;
      const want = shared.indexOf(voice) === 0 ? 'up' : 'down';
      const stems = score.notes.filter((n) => n.voice === String(v) && !n.rest && n.value !== 'w').map((n) => n.stem);
      expect(stems.every((st) => st === want), `voice ${v + 1}: ${stems.join(' ')}`).toBe(true);
    });
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

describe('what a demonstration sounds', () => {
  const beatOf = (d: Demonstration) => 60 / d.tempo;
  it('a tie makes one sound of the notes it joins, held to its end; a rest is silence; a dot adds half', () => {
    const [tie, values] = [FORM[0][1], FORM[1][1]];
    const bass = demonstrationSchedule(tie).filter((s) => s.midi < 60);
    expect(bass.map((s) => [s.midi, s.at, s.duration])).toEqual([[48, 0, 8 * beatOf(tie)]]);
    const beat = beatOf(values);
    expect(demonstrationSchedule(values).map((s) => [s.midi, +s.at.toFixed(6), +s.duration.toFixed(6)])).toEqual([
      // F♯4 struck again straight after: a tenth shorter, so the repeat is heard.
      [66, 0, +(3 * beat * DEMO_SOUNDING).toFixed(6)],
      // F♯4 then F4, F4 then a rest: their whole length.
      [66, +(3 * beat).toFixed(6), +(1.5 * beat).toFixed(6)],
      [65, +(4.5 * beat).toFixed(6), +(0.5 * beat).toFixed(6)],
    ]);
  });
  it('repeated notes never touch; every other note sounds its whole length (legato), so a held pedal leaves nothing bare', () => {
    const shell = DEMOS.find(([w]) => w === 'l7u21m2 c0')![1];
    const beat = beatOf(shell);
    // D, F and C struck again by the full Dm7: shortened; the full Dm7, last: whole.
    expect(demonstrationSchedule(shell).map((s) => +(s.duration / beat).toFixed(6))).toEqual([3.6, 3.6, 3.6, 4, 4, 4, 4]);
    const scale = DEMOS.find(([w]) => w === 'l1u3m2 c0')![1];
    expect(demonstrationSchedule(scale).every((s) => Math.abs(s.duration - beatOf(scale)) < 1e-9)).toBe(true);
    // The pedal of l7u22m5: one D3, sounding from the first note of the scale to the end of the last.
    const pedal = demonstrationSchedule(DEMOS.find(([w]) => w === 'l7u22m5 c2')![1]);
    const d3 = pedal.filter((s) => s.midi === 50);
    const top = pedal.filter((s) => s.midi > 50);
    expect(d3).toHaveLength(1);
    expect(d3[0].at).toBe(0);
    expect(d3[0].at + d3[0].duration).toBeGreaterThanOrEqual(Math.max(...top.map((s) => s.at + s.duration)) - 1e-9);
  });
  it('notes that start together share the loudness: `together` counts them', () => {
    const quartal = DEMOS.find(([w]) => w === 'l7u22m5 c0')![1];
    expect(demonstrationSchedule(quartal).map((s) => s.together)).toEqual([1, 1, 1, 1, 4, 4, 4, 4]);
  });
  it('the drawing prints F♯ again in a new bar and a natural before the F that follows it', () => {
    const plan = demoStaffPlan(FORM[1][1]);
    expect(plan.voices[0].notes.map((n) => n.accidentals[0] ?? null)).toEqual(['#', '#', 'n', null]);
    expect(plan.voices[0].barsAfter).toEqual([0]);
  });
  it('a note tied across the bar line repeats no sign, and is no sign for the rest of that bar', () => {
    const plan = demoStaffPlan(FORM[3][1]);
    expect(plan.voices[0].notes.map((n) => n.accidentals[0] ?? null)).toEqual(['#', null, null, '#']);
  });
  it('lines break where the author marks them, and each line starts its signs afresh (a natural is not carried to the next line)', () => {
    const small = DEMOS.find(([w]) => w === 'l9u30m3 c0')![1];
    const plan = demoStaffPlan(small);
    expect(plan.rows).toBe(3);
    expect(plan.voices[0].notes.map((n) => n.row)).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]);
    // D♭ then D♮, E♭ then (a new line) E with no sign; G♭ then G♮ on the last line.
    expect(plan.voices[0].notes.filter((n) => !n.rest).map((n) => n.accidentals[0] ?? '')).toEqual(['', 'b', '', 'n', '', 'b', '', '', '', '', '', 'b', '', 'n']);
    const layout = demoStaffLayout(plan);
    expect(layout.rowTops).toHaveLength(3);
    expect(layout.height).toBe(layout.rowTops[2] + layout.rowHeight);
  });
  it('two voices on one staff are given stems apart: the upper up, the lower down', () => {
    const plan = demoStaffPlan(FORM[4][1]);
    expect(plan.voices.map((v) => v.notes.map((n) => n.stem))).toEqual([[1, 1], [-1, -1]]);
    // One voice on a staff: VexFlow's own rule.
    expect(demoStaffPlan(FORM[1][1]).voices[0].notes.every((n) => n.stem === undefined)).toBe(true);
  });
});

describe('the text alternative reads as the staff does', () => {
  const find = (w: string) => DEMOS.find(([x]) => x === w)![1];
  it('one staff with a key signature, in EN, PT and ES', () => {
    const g = find('l1u3m2 c0');
    expect(describeDemonstration(g, i18n.getFixedT('en'))).toBe('Treble staff, one sharp in the key signature: F♯. G4, A4, B4, C5, D5, E5, F♯5 and G5 (quarter notes).');
    expect(describeDemonstration(find('l1u3m2 c1'), i18n.getFixedT('pt'))).toBe('Pauta em clave de sol, 2 sustenidos na armação de clave: F♯ e C♯. D4, E4, F♯4, G4, A4, B4, C♯5 e D5 (semínimas).');
    expect(describeDemonstration(find('l2u4m1 c2'), i18n.getFixedT('es'))).toBe('Pentagrama en clave de sol, 5 bemoles en la armadura de clave: B♭, E♭, A♭, D♭ y G♭. D♭4, E♭4, F4, G♭4, A♭4, B♭4, C5 y D♭5 (negras).');
    const tied = demonstration('tie', { tempo: 60, time: '4/4', voices: [{ staff: 'bass', events: [note('w', 'D3', { tie: true }), note('w', 'D3')] }] });
    expect(describeDemonstration(tied, i18n.getFixedT('en'))).toBe('Bass staff, in 4/4. D3 (whole note tied to the next) | D3 (whole note).');
  });
  // Two voices: which is upper, which is lower, and on which staff — pinned word for word in the three languages.
  it.each<[string, string, string, string]>([
    ['l7u22m5 c2',
      'Grand staff, treble and bass, in 4/4. Upper voice on the treble staff: D4, E4, F4 and G4 (quarter notes) | A4, B♭4, C5 and D5 (quarter notes). Lower voice on the bass staff: D3 (whole note tied to the next) | D3 (whole note).',
      'Pauta dupla, claves de sol e de fá, em 4/4. Voz superior na pauta de clave de sol: D4, E4, F4 e G4 (semínimas) | A4, B♭4, C5 e D5 (semínimas). Voz inferior na pauta de clave de fá: D3 (semibreve ligada à seguinte) | D3 (semibreve).',
      'Sistema de pentagramas, claves de sol y de fa, en 4/4. Voz superior en el pentagrama de clave de sol: D4, E4, F4 y G4 (negras) | A4, B♭4, C5 y D5 (negras). Voz inferior en el pentagrama de clave de fa: D3 (redonda ligada a la siguiente) | D3 (redonda).'],
    ['l4u12m1 c1',
      'Grand staff, treble and bass, in 4/4. Upper voice on the treble staff: C5 (half note), then B4 (half note tied to the next) | B4 and A4 (half notes). Lower voice on the bass staff: G2 and D3 together (whole note) | C3 and E3 together (whole note).',
      'Pauta dupla, claves de sol e de fá, em 4/4. Voz superior na pauta de clave de sol: C5 (mínima), depois B4 (mínima ligada à seguinte) | B4 e A4 (mínimas). Voz inferior na pauta de clave de fá: G2 e D3 em simultâneo (semibreve) | C3 e E3 em simultâneo (semibreve).',
      'Sistema de pentagramas, claves de sol y de fa, en 4/4. Voz superior en el pentagrama de clave de sol: C5 (blanca), después B4 (blanca ligada a la siguiente) | B4 y A4 (blancas). Voz inferior en el pentagrama de clave de fa: G2 y D3 a la vez (redonda) | C3 y E3 a la vez (redonda).'],
    ['l4u12m1 c2',
      'Grand staff, treble and bass. Upper voice on the treble staff: E4 (whole note). Lower voice on the bass staff: D3 and C3 (half notes).',
      'Pauta dupla, claves de sol e de fá. Voz superior na pauta de clave de sol: E4 (semibreve). Voz inferior na pauta de clave de fá: D3 e C3 (mínimas).',
      'Sistema de pentagramas, claves de sol y de fa. Voz superior en el pentagrama de clave de sol: E4 (redonda). Voz inferior en el pentagrama de clave de fa: D3 y C3 (blancas).'],
  ])('%s, in EN, PT and ES', (w, en, pt, es) => {
    expect(describeDemonstration(find(w), i18n.getFixedT('en'))).toBe(en);
    expect(describeDemonstration(find(w), i18n.getFixedT('pt'))).toBe(pt);
    expect(describeDemonstration(find(w), i18n.getFixedT('es'))).toBe(es);
  });
});

describe('the leaves this stream changed: the same notes, numbers and intervals in PT and ES', () => {
  const overlaid = (units: CurriculumUnit[], ov: unknown) => applyCurriculumOverlay({ id: 'x', units } as unknown as CurriculumLevel, ov as never).units;
  const leaf = (units: CurriculumUnit[], id: string, c: number, field: 'tryThisLabel' | 'explanation') => units.flatMap((u) => u.modules).find((m) => m.id === id)!.concepts[c][field];
  // Note letters (with their signs), digits, and the C–D pairs, in order.
  const facts = (s: string) => (s.match(/\b[A-G](?:♯|♭|#|b)?(?:m7|maj13|m11)?\b|\d+/g) ?? []).join(' ');
  const cases: [CurriculumUnit[], [unknown, unknown], string, number, 'tryThisLabel' | 'explanation'][] = [
    [L4_UNITS, [ptL4, esL4], 'l4u12m1', 1, 'tryThisLabel'],
    [L4_UNITS, [ptL4, esL4], 'l4u12m1', 2, 'tryThisLabel'],
    [L7_UNITS, [ptL7, esL7], 'l7u21m2', 0, 'tryThisLabel'],
    [L7_UNITS, [ptL7, esL7], 'l7u22m5', 0, 'tryThisLabel'],
    [L7_UNITS, [ptL7, esL7], 'l7u22m5', 2, 'tryThisLabel'],
    [L7_UNITS, [ptL7, esL7], 'l7u23m5', 0, 'tryThisLabel'],
    [L9_UNITS, [ptL9, esL9], 'l9u30m3', 0, 'tryThisLabel'],
    [L9_UNITS, [ptL9, esL9], 'l9u30m4', 1, 'tryThisLabel'],
  ];
  it.each(cases.map((c) => [`${c[2]} c${c[3]} ${c[4]}`, ...c] as const))('%s', (_name, units, [pt, es], id, c, field) => {
    const en = facts(leaf(units, id, c, field));
    expect(en.length).toBeGreaterThan(0);
    expect(facts(leaf(overlaid(units, pt), id, c, field)), 'PT').toBe(en);
    expect(facts(leaf(overlaid(units, es), id, c, field)), 'ES').toBe(en);
  });
});

describe('the 11th of a major 13th chord: the lesson\'s sentence and the label agree, with the source', () => {
  // Wikipedia, "Thirteenth chord": "It is customary to omit the eleventh on
  // dominant or major thirteenth chords because the eleventh conflicts with the third".
  it.each<[string, unknown, string, string]>([
    ['en', null, 'in dominant and major 13th chords alike, because it clashes with the major 3rd', 'without the 11th (F), which clashes with the 3rd (E)'],
    ['pt', ptL7, 'tanto nos acordes dominantes como nos de 13.ª maior, porque choca com a terça maior', 'sem a 11.ª (F), que choca com a 3.ª (E)'],
    ['es', esL7, 'tanto en los acordes dominantes como en los de 13.ª mayor, porque choca con la tercera mayor', 'sin la 11.ª (F), que choca con la 3.ª (E)'],
  ])('%s', (_lang, ov, sentence, label) => {
    const units = ov ? applyCurriculumOverlay({ id: 'x', units: L7_UNITS } as unknown as CurriculumLevel, ov as never).units : L7_UNITS;
    const concept = units.flatMap((u) => u.modules).find((m) => m.id === 'l7u23m5')!.concepts[0];
    expect(concept.explanation).toContain(sentence);
    expect(concept.tryThisLabel).toContain(label);
  });
});

describe('the authoring check, each rule with a planted fault', () => {
  const ok: Demonstration = { tempo: 100, time: '4/4', voices: [{ staff: 'treble', events: run('q', ['C4', 'D4', 'E4', 'F4']) }] };
  it('a good one passes and is returned as it is', () => {
    expect(demonstration('ok', ok)).toBe(ok);
  });
  const one = (events: Demonstration['voices'][number]['events'], staff: 'treble' | 'bass' = 'treble', extra: Partial<Demonstration> = {}): Demonstration => ({ tempo: 100, voices: [{ staff, events }], ...extra });
  it.each<[string, Demonstration, RegExp]>([
    ['bars that do not add up', { ...ok, voices: [{ staff: 'treble', events: run('q', ['C4', 'D4', 'E4']) }] }, /whole number of 4\/4 bars/],
    ['a note across the bar line', { ...ok, voices: [{ staff: 'treble', events: [...run('q', ['C4', 'D4', 'E4']), note('h', 'F4'), note('h.', 'G4')] }] }, /crosses the bar line/],
    ['a pitch that is not spelled (outside the type)', one([{ notes: ['H4' as never], value: 'w' }]), /not a spelled pitch/],
    ['a value that is not a note value (outside the type)', one([{ notes: ['C4'], value: 'x' as never }]), /"x" is not a note value/],
    ['a tie to different notes', one([note('h', 'C4', { tie: true }), note('h', 'D4')]), /does not hold the same pitches/],
    ['a tied rest', one([{ notes: [], value: 'h', tie: true }, rest('h')]), /rest cannot be tied/],
    ['a voice with no events', { tempo: 100, voices: [{ staff: 'treble', events: [] }] }, /voice 1 has no events/],
    ['a voice of rests only', one([rest('w')]), /voice 1 is only rests/],
    ['voices of different lengths', { tempo: 100, voices: [{ staff: 'treble', events: [note('w', 'E4')] }, { staff: 'treble', events: [note('h', 'C4')] }] }, /end together/],
    ['the lower voice first', { tempo: 100, voices: [{ staff: 'treble', events: [note('w', 'C4')] }, { staff: 'treble', events: [note('w', 'E4')] }] }, /first voice must be the upper/],
    ['the bass staff\'s voice before the treble\'s', { tempo: 100, voices: [{ staff: 'bass', events: [note('w', 'C4')] }, { staff: 'treble', events: [note('w', 'A3')] }] }, /treble voice comes first/],
    ['three voices', { tempo: 100, voices: [{ staff: 'treble', events: [note('w', 'G4')] }, { staff: 'treble', events: [note('w', 'E4')] }, { staff: 'treble', events: [note('w', 'C4')] }] }, /one or two/],
    ['a chord written high to low', one([chord('w', ['G4', 'C4'])]), /low to high/],
    ['a pitch twice in one chord', one([chord('w', ['C4', 'C4'])]), /a pitch twice in one chord/],
    ['two notes of one chord on one line or space (C and C♯)', one([chord('w', ['C4', 'C#4'])]), /on one line or space/],
    ['a tempo out of range', { ...ok, tempo: 400 }, /tempo 400/],
    ['a key the staff cannot draw (outside the type)', { ...ok, key: 'H' as never }, /"H" is not a key signature/],
    ['a time signature not offered (outside the type)', { ...ok, time: '5/4' as never }, /"5\/4" is not a time signature/],
    ['a pitch above the piano: B𝄪7 sounds above C8', one([note('w', 'B##7')]), /not on the piano/],
    ['C7 on a treble staff (beyond two ledger lines: A3–C6)', one([note('w', 'C7')]), /beyond two ledger lines of the treble staff/],
    ['C1 on a treble staff', one([note('w', 'C1')]), /beyond two ledger lines of the treble staff/],
    ['G6 on a bass staff (C2–E4)', one([note('w', 'G6')], 'bass'), /beyond two ledger lines of the bass staff/],
    ['B1 on a bass staff', one([note('w', 'B1')], 'bass'), /beyond two ledger lines of the bass staff/],
    ['a line break marked by the second voice', { tempo: 100, voices: [{ staff: 'treble', events: [note('h', 'E4'), note('h', 'F4')] }, { staff: 'treble', events: [lineBreak(note('h', 'C4')), note('h', 'D4')] }] }, /only the first voice marks line breaks/],
    ['a line break after the last event', one([note('h', 'C4'), lineBreak(note('h', 'D4'))]), /line break after the last event/],
    ['a tie across a line break', one([lineBreak(note('h', 'C4', { tie: true })), note('h', 'C4')]), /tie cannot cross a line break/],
    ['a line break inside a bar', { ...ok, voices: [{ staff: 'treble', events: [lineBreak(note('q', 'C4')), ...run('q', ['D4', 'E4', 'F4'])] }] }, /line break inside a bar/],
    ['a line break while the other voice holds a note', { tempo: 100, voices: [{ staff: 'treble', events: [lineBreak(note('h', 'E4')), note('h', 'F4')] }, { staff: 'bass', events: [note('w', 'C3')] }] }, /another voice holds a note/],
    ['a line break across the other voice\'s tie', { tempo: 100, voices: [{ staff: 'treble', events: [lineBreak(note('h', 'E4')), note('h', 'F4')] }, { staff: 'bass', events: [note('h', 'C3', { tie: true }), note('h', 'C3')] }] }, /tie cannot cross a line break/],
  ])('%s', (_name, demo, problem) => {
    const problems = demonstrationProblems(demo);
    expect(problems.join('; ')).toMatch(problem);
    expect(() => demonstration('planted', demo)).toThrow(/Demonstration planted:/);
  });
  it('the edges of each staff\'s range pass: A3 and C6 on the treble staff, C2 and E4 on the bass staff', () => {
    expect(demonstrationProblems(one([note('h', 'A3'), note('h', 'C6')]))).toEqual([]);
    expect(demonstrationProblems(one([note('h', 'C2'), note('h', 'E4')], 'bass'))).toEqual([]);
    // Octave 8 and 0 are not spelled at all.
    for (const p of ['C8', 'C0']) expect(demonstrationProblems(one([{ notes: [p as never], value: 'w' }])).join()).toMatch(/not a spelled pitch/);
  });
});
