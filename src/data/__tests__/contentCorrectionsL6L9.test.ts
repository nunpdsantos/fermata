import { describe, it, expect } from 'vitest';
import type { CurriculumModule, CurriculumUnit } from '../../core/types/curriculum';
import type { ExerciseDefinition } from '../../core/types/exercise';
import type { ChordQuality } from '../../core/types/music';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';
import { CHORD_FORMULAS, buildChord } from '../../core/constants/chords';
import { SCALE_FORMULAS } from '../../core/constants/scales';
import { getPitchClass } from '../../core/constants/notes';
import { parseChordSymbol } from '../../core/utils/chordParser';
import { validateAnswer } from '../../components/learn/exercises/validateExercise';
import { applyExerciseOverlay } from '../../i18n/content/contentResolver';
import { MODULE_INDEX } from '../moduleIndex';
import exercisesL6 from '../exercises/exercisesL6';
import exercisesL8 from '../exercises/exercisesL8';
import exercisesL9 from '../exercises/exercisesL9';
import templatesL6 from '../exercises/templatesL6';
import templatesL7 from '../exercises/templatesL7';
import templatesL8 from '../exercises/templatesL8';
import templatesL9 from '../exercises/templatesL9';
import templatesL1 from '../exercises/templatesL1';
import templatesL2 from '../exercises/templatesL2';
import templatesL3 from '../exercises/templatesL3';
import templatesL4 from '../exercises/templatesL4';
import templatesL5 from '../exercises/templatesL5';
import { generateAllForLevel } from '../exercises/exerciseGenerator';
import ptL6 from '../../i18n/content/pt/curriculumL6';
import esL6 from '../../i18n/content/es/curriculumL6';
import ptL7 from '../../i18n/content/pt/curriculumL7';
import esL7 from '../../i18n/content/es/curriculumL7';
import ptL8 from '../../i18n/content/pt/curriculumL8';
import esL8 from '../../i18n/content/es/curriculumL8';
import ptL9 from '../../i18n/content/pt/curriculumL9';
import esL9 from '../../i18n/content/es/curriculumL9';
import ptExL6 from '../../i18n/content/pt/exercisesL6';
import esExL6 from '../../i18n/content/es/exercisesL6';
import ptExL9 from '../../i18n/content/pt/exercisesL9';
import esExL9 from '../../i18n/content/es/exercisesL9';
import ptTplL6 from '../../i18n/content/pt/templatesL6';
import esTplL6 from '../../i18n/content/es/templatesL6';
import ptTplL7 from '../../i18n/content/pt/templatesL7';
import esTplL7 from '../../i18n/content/es/templatesL7';

// ---------------------------------------------------------------------------
// Regression tests for the 2026-10-30 audit, batch W5b (Learn L6–L9 + Explore).
// Each block pins one corrected claim. Where the claim is mechanical, the test
// re-derives the music from the engine itself (chord parser + chord/scale
// formulas) and then checks the wording; where it is a sourced fact or a
// convention decision, the comment names the source or decision.
// ---------------------------------------------------------------------------

// ── Content helpers ───────────────────────────────────────────────────────
const mod = (units: CurriculumUnit[], id: string): CurriculumModule => {
  const m = units.flatMap((u) => u.modules).find((x) => x.id === id);
  if (!m) throw new Error(`module ${id} not found`);
  return m;
};
const allText = (m: CurriculumModule) =>
  [m.title, m.subtitle, ...m.objectives, ...m.concepts.flatMap((c) => [c.explanation, c.tryThisLabel]), ...m.tasks.map((t) => t.instruction)].join('\n');
type Ov = { modules: Record<string, { subtitle: string; objectives: string[]; concepts: { explanation: string; tryThisLabel: string }[]; tasks: { instruction: string }[] }> };
const ovText = (ov: Ov, id: string) => {
  const m = ov.modules[id];
  return [m.subtitle, ...m.objectives, ...m.concepts.flatMap((c) => [c.explanation, c.tryThisLabel]), ...m.tasks.map((t) => t.instruction)].join('\n');
};
const exercise = (map: Record<string, ExerciseDefinition[]>, id: string): ExerciseDefinition => {
  const e = Object.values(map).flat().find((x) => x.id === id);
  if (!e) throw new Error(`exercise ${id} not found`);
  return e;
};
const correctLabel = (e: ExerciseDefinition) => {
  const c = e.config as { choices?: { label: string; correct: boolean }[] };
  return c.choices?.find((x) => x.correct)?.label ?? '';
};

// ── Music helpers (all answers come from the engine) ──────────────────────
const mod12 = (n: number) => ((n % 12) + 12) % 12;
const pcs = (semis: number[], root = 0) => new Set(semis.map((s) => mod12(s + root)));
const parse = (symbol: string) => {
  const p = parseChordSymbol(symbol);
  if (!p) throw new Error(`engine cannot parse ${symbol}`);
  return p;
};
/** Pitch classes of a chord symbol, built by the engine. */
const chordOf = (symbol: string) => {
  const p = parse(symbol);
  return new Set(buildChord(p.root, p.quality).notes.map(getPitchClass) as number[]);
};
const rootOf = (symbol: string) => getPitchClass(parse(symbol).root) as number;
/** Ascending semitones from a to b (0–11). */
const up = (a: number, b: number) => mod12(b - a);
/** Interval class (0–6). */
const ic = (a: number, b: number) => Math.min(up(a, b), up(b, a));
const sorted = (s: Set<number>) => [...s].sort((a, b) => a - b);
/** Smallest possible largest move when every voice of `from` goes to a distinct tone of `to`. */
const bestMaxMove = (from: number[], to: number[]): number => {
  const perms = (a: number[]): number[][] =>
    a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
  return Math.min(...perms(to).map((p) => Math.max(...p.map((t, i) => ic(from[i], t)))));
};

describe('L6 — chromatic harmony', () => {
  it('Gr+6: the lower three notes Ab-C-Eb form a MAJOR triad (W5-10)', () => {
    // The engine's Ab major triad is exactly {Ab, C, Eb}; the Gr+6 in C is that triad plus F#.
    expect(sorted(chordOf('Ab'))).toEqual(sorted(new Set([8, 0, 3])));
    expect(parse('Ab').quality).toBe('major');
    const en = mod(L6_UNITS, 'l6u18m3').concepts[0].explanation;
    expect(en).toMatch(/form a major triad/);
    expect(en).not.toMatch(/minor quality/);
    expect(ovText(ptL6 as Ov, 'l6u18m3')).toMatch(/formam uma tríade maior/);
    expect(ovText(esL6 as Ov, 'l6u18m3')).toMatch(/forman una tríada mayor/);
  });

  it('Gr+6 pivot reaches keys a half step from the TONIC, five fifths away (W5-01, W5-02, W6-02)', () => {
    // Gr+6 in C = Ab-C-Eb-F# = the engine's Ab7 (F# = Gb). As V7 it resolves a P4 up, to Db.
    const grSixInC = new Set([8, 0, 3, 6]);
    expect(sorted(chordOf('Ab7'))).toEqual(sorted(grSixInC));
    const target = mod12(rootOf('Ab7') + 5);
    expect(up(0, target)).toBe(1); // a half step above the tonic C …
    expect(ic(7, target)).toBe(6); // … and a tritone from the dominant G
    // C→Db around the circle (down a fifth each step): C F Bb Eb Ab Db = 5 steps.
    let steps = 0;
    for (let pc = 0; pc !== target; pc = mod12(pc + 5)) steps++;
    expect(steps).toBe(5);

    const tpl = templatesL6.find((t) => t.moduleId === 'l6u18m4')!;
    const keyed = (tpl.templates[0].params.choiceSets ?? []).flat().filter((c) => c.correct).map((c) => c.label).join('\n');
    expect(keyed).toMatch(/half step above or below the tonic/);
    expect(keyed).not.toMatch(/from the dominant/);

    const e2 = exercise(exercisesL6, 'l6u18m4e2');
    expect(correctLabel(e2)).not.toMatch(/tritone or more/);
    expect(correctLabel(e2)).toMatch(/five steps around the circle of fifths/);
    expect(e2.hint).not.toMatch(/tritone or more/);
    expect(JSON.stringify(ptExL6.l6u18m4e2)).not.toMatch(/trítono ou mais/);
    expect(JSON.stringify(esExL6.l6u18m4e2)).not.toMatch(/tritono o más/);

    expect(mod(L6_UNITS, 'l6u18m4').tasks[2].instruction).toMatch(/five positions/);
    expect(ovText(ptL6 as Ov, 'l6u18m4')).toMatch(/cinco posições/);
    expect(ovText(esL6 as Ov, 'l6u18m4')).toMatch(/cinco posiciones/);
    expect(ovText(ptL6 as Ov, 'l6u18m4')).not.toMatch(/seis posições/);
  });

  it('doubly chromatic mediant example (C major → Ab minor) shares no tones and is a third away (W5-11)', () => {
    const hint = exercise(exercisesL6, 'l6u19m3e3').hint ?? '';
    const m = hint.match(/like ([A-G][b#]?) major to ([A-G][b#]?) minor/);
    expect(m, 'hint names a major → minor example').not.toBeNull();
    const [from, to] = [m![1], `${m![2]}m`];
    expect([...chordOf(from)].filter((pc) => chordOf(to).has(pc))).toEqual([]); // zero common tones
    expect([3, 4]).toContain(ic(rootOf(from), rootOf(to))); // roots a third apart
    // and every voice moves by a half step (the hint says so): each tone has a partner 1 semitone away
    for (const pc of chordOf(from)) expect([...chordOf(to)].some((q) => ic(pc, q) === 1)).toBe(true);
    expect(hint).not.toMatch(/Db minor/);
  });

  it('CTo7 voices move two by half step and one by whole step, in all three languages (W6-02)', () => {
    // CTo7 of C = C + D#dim7 = {C, D#, F#, A}; target C major {C, E, G}.
    const cto7 = chordOf('D#dim7');
    expect(cto7.has(0)).toBe(true); // contains the common tone C
    const target = chordOf('C');
    const moves = [...cto7].filter((pc) => !target.has(pc)).map((pc) => Math.min(...[...target].map((t) => ic(pc, t)))).sort();
    expect(moves).toEqual([1, 1, 2]);
    expect(ovText(ptL6 as Ov, 'l6u19m2')).not.toMatch(/cada uma por meio-tom para as restantes/);
    expect(ovText(ptL6 as Ov, 'l6u19m2')).toMatch(/A desce um tom para G/);
    expect(ovText(esL6 as Ov, 'l6u19m2')).toMatch(/A baja un tono a G/);
    expect(ovText(ptL6 as Ov, 'l6u19m2')).not.toMatch(/Mi mantém-se/);
  });

  it('equal division counts parts, not step size (W5-16)', () => {
    // Parts = number of notes; step = constant gap. Read both from the engine.
    const evenSteps = (f: number[]) => new Set(f.map((x, i) => mod12((f[i + 1] ?? f[0] + 12) - x))).size === 1;
    const wt = SCALE_FORMULAS.whole_tone;
    const dim7 = CHORD_FORMULAS.diminished7;
    const aug = CHORD_FORMULAS.augmented;
    for (const f of [wt, dim7, aug]) expect(evenSteps(f)).toBe(true);
    expect([wt.length, dim7.length, aug.length]).toEqual([6, 4, 3]);
    expect([wt[1], dim7[1], aug[1]]).toEqual([2, 3, 4]);
    const en = mod(L6_UNITS, 'l6u19m4').concepts[0].explanation;
    expect(en).toMatch(/6 equal parts: the whole-tone scale/);
    expect(en).toMatch(/3 equal parts: the augmented triad/);
    const hint = templatesL6.find((t) => t.moduleId === 'l6u20m2')!.templates[1].hintTemplate;
    expect(hint).toMatch(/augmented triad \(3 equal parts/);
    expect(hint).not.toMatch(/div by/);
    for (const ov of [ptTplL6, esTplL6]) expect(JSON.stringify(ov.l6u20m2)).not.toMatch(/div\.? por/);
  });

  it('the octatonic scale holds 8 minor thirds and 4 tritones (W5-17)', () => {
    const set = [...pcs(SCALE_FORMULAS.diminished_whole_half)];
    const count = (n: number) => {
      let c = 0;
      for (let i = 0; i < set.length; i++) for (let j = i + 1; j < set.length; j++) if (ic(set[i], set[j]) === n) c++;
      return c;
    };
    expect(count(3)).toBe(8);
    expect(count(6)).toBe(4);
    // and it is exactly two diminished-seventh chords
    expect(sorted(pcs(SCALE_FORMULAS.diminished_whole_half))).toEqual(sorted(new Set([...chordOf('Cdim7'), ...chordOf('Ddim7')])));
    expect(mod(L6_UNITS, 'l6u19m4').tasks[1].instruction).toMatch(/eight minor thirds and four tritones/);
  });

  it('second species follows Fux: weak-beat dissonance only as passing tones (W5-39; convention D-14)', () => {
    const c = mod(L6_UNITS, 'l6u20m1').concepts[1].explanation;
    expect(c).toMatch(/only as passing tones/);
    expect(c).not.toMatch(/step away and return \(neighbor tone\)/);
    // the lesson and the exercise key now agree
    expect(correctLabel(exercise(exercisesL6, 'l6u20m1e2'))).toMatch(/passing tones/);
  });

  it('voice pairs grow 1, 3, 6 — quadratically, not exponentially (W5-47)', () => {
    const pairs = (n: number) => (n * (n - 1)) / 2;
    expect([pairs(2), pairs(3), pairs(4)]).toEqual([1, 3, 6]);
    expect(pairs(4) / pairs(3)).not.toBe(pairs(3) / pairs(2)); // no constant ratio, so not exponential
    const c = mod(L6_UNITS, 'l6u20m3').concepts[0].explanation;
    expect(c).not.toMatch(/exponentially/);
    expect(c).toMatch(/2 voices make 1 pair, 3 voices make 3, and 4 voices make 6/);
  });

  it('a Bb clarinet reads C to sound Bb (W5-18)', () => {
    // A Bb instrument sounds a major 2nd below written: written = concert + 2.
    const concertBb = rootOf('Bb7');
    expect(mod12(concertBb + 2)).toBe(rootOf('C'));
    expect(mod(L6_UNITS, 'l6u20m4').concepts[2].tryThisLabel).toMatch(/sounds when it reads C major/);
  });
});

describe('L7 — jazz harmony', () => {
  it('Abm7-Db7-Cmaj7 bass is not chromatic; Dm7-Db7-Cmaj7 is (W5-13)', () => {
    const bass = (syms: string[]) => syms.slice(1).map((s, i) => ic(rootOf(syms[i]), rootOf(s)));
    expect(bass(['Abm7', 'Db7', 'Cmaj7'])).toEqual([5, 1]); // a 4th/5th, then a half step
    expect(bass(['Dm7', 'Db7', 'Cmaj7'])).toEqual([1, 1]); // fully chromatic
    const text = allText(mod(L7_UNITS, 'l7u21m4'));
    expect(text).not.toMatch(/entirely chromatic/);
    expect(text).not.toMatch(/pure chromatic motion/);
    expect(text).toMatch(/Dm7-Db7-Cmaj7 \(bass: D-Db-C\)/);
  });

  it('upper structures over C7 produce exactly the tensions the lesson names (W5-14)', () => {
    const c7 = chordOf('C7');
    const NAMES: Record<number, string> = { 0: 'R', 1: 'b9', 2: '9', 3: '#9', 4: '3', 5: '11', 6: '#11', 7: '5', 8: 'b13', 9: '13', 10: 'b7', 11: '7' };
    const over = (triad: string) => sorted(chordOf(triad)).map((pc) => NAMES[up(0, pc)]).sort().join(',');
    expect(over('D')).toBe(['13', '#11', '9'].sort().join(',')); // C13#11
    expect(over('Eb')).toBe(['#9', '5', 'b7'].sort().join(',')); // C7(#9)
    expect(over('Ab')).toBe(['b13', 'R', '#9'].sort().join(',')); // C7(#9,b13)
    expect(over('Gb')).toBe(['#11', 'b7', 'b9'].sort().join(',')); // C7(b9,#11)
    expect(over('Db')).toContain('11'); // natural 11 …
    expect(over('Db').split(',')).not.toContain('#11'); // … so Db/C7 is NOT the #11 sound
    expect(rootOf('Gb')).toBe(mod12(rootOf('C7') + 6)); // Gb7 is C7's tritone sub
    expect(c7.has(10)).toBe(true);
    const c = mod(L7_UNITS, 'l7u22m2').concepts[0];
    expect(c.explanation).toMatch(/Gb \(F#\) major triad over C7 produces C7\(b9,#11\)/);
    expect(c.explanation).not.toMatch(/Db major triad over C7 produces/);
    expect(c.explanation).toMatch(/The Jazz Piano Book/); // source: Levine (1989) ch. 14, via Wikipedia "Upper structure"
    expect(c.tryThisQuery).toBe('C13#11');
    expect(ovText(ptL7 as Ov, 'l7u22m2')).not.toMatch(/C7#9b13|C7b9b13/);
    expect(ovText(esL7 as Ov, 'l7u22m2')).not.toMatch(/C7#9b13|C7b9b13/);
    expect(ovText(ptL7 as Ov, 'l7u22m2')).toMatch(/escreve "C13#11"/);
  });

  it('shell voicings: Cm7 and Cm7b5 share root, 3rd and 7th, so the b5 must stay (W5-15)', () => {
    const shell = (q: ChordQuality) => [CHORD_FORMULAS[q][0], CHORD_FORMULAS[q][1], CHORD_FORMULAS[q][3]];
    expect(shell('minor7')).toEqual(shell('half_diminished7'));
    expect(CHORD_FORMULAS.half_diminished7[2]).toBe(6); // its 5th is diminished
    const text = allText(mod(L7_UNITS, 'l7u21m2'));
    expect(text).not.toMatch(/perfect in all standard chord types/);
    expect(text).not.toMatch(/that is what makes each quality distinct/);
  });

  it('9sus: G9sus4 = Dm7 over G — the chord sits a 4th above the ii root (W5-20)', () => {
    expect(sorted(chordOf('G9sus4'))).toEqual(sorted(new Set([...chordOf('Dm7'), rootOf('G7')])));
    expect(up(rootOf('Dm7'), rootOf('G9sus4'))).toBe(5); // a perfect 4th above D
    const dm11 = pcs(CHORD_FORMULAS.minor11, rootOf('Dm7'));
    expect([...dm11].some((pc) => !chordOf('G9sus4').has(pc))).toBe(true); // Dm11/G adds a note (E)
    const c = mod(L7_UNITS, 'l7u21m2').concepts[2].explanation;
    expect(c).toMatch(/perfect 4th above/);
    expect(c).not.toMatch(/Dm11\/G/);
  });

  it('IV-I-V-vi is the rotation of I-V-vi-IV that starts on IV (W5-23)', () => {
    const loop = ['I', 'V', 'vi', 'IV'];
    const rotations = loop.map((_, i) => [...loop.slice(i), ...loop.slice(0, i)].join('-'));
    expect(rotations).toContain('IV-I-V-vi');
    expect(rotations).not.toContain('IV-V-vi-IV');
    const c = mod(L7_UNITS, 'l7u23m1').concepts[2].explanation;
    expect(c).toMatch(/IV-I-V-vi \(starting on IV\)/);
    expect(c).not.toMatch(/IV-V-vi-IV/);
  });

  it('C#dim7 → Dm7 needs at least one whole-step move; Cmaj7 → C#dim7 does not (W5-43)', () => {
    expect(bestMaxMove([...chordOf('Cmaj7')], [...chordOf('C#dim7')])).toBe(1);
    expect(bestMaxMove([...chordOf('C#dim7')], [...chordOf('Dm7')])).toBe(2);
    expect(mod(L7_UNITS, 'l7u22m2').tasks[2].instruction).toMatch(/rise a whole step/);
  });

  it('l7u21m1 build items really are extended chords (a tone beyond the 7th) (W5-25)', () => {
    const tpl = templatesL7.find((t) => t.moduleId === 'l7u21m1')!.templates[0];
    for (const q of tpl.params.chordQualities ?? []) {
      expect(Math.max(...CHORD_FORMULAS[q as ChordQuality]), q).toBeGreaterThan(11);
      expect(tpl.params.noteCounts).toContain(pcs(CHORD_FORMULAS[q as ChordQuality]).size);
    }
  });

  it('guide tones: the 3rd of ii is held as the 7th of V; the 7th of ii FALLS a half step to the 3rd of V (W5-42)', () => {
    const ii = CHORD_FORMULAS.minor7.map((s) => mod12(s + rootOf('Dm7')));
    const V = CHORD_FORMULAS.dominant7.map((s) => mod12(s + rootOf('G7')));
    expect(ii[1]).toBe(V[3]); // F held
    expect(mod12(V[1] - ii[3])).toBe(11); // C → B, down a half step
    const tpl = templatesL7.find((t) => t.moduleId === 'l7u21m2')!.templates[1];
    const keyed = (tpl.params.choiceSets ?? []).flat().filter((c) => c.correct).map((c) => c.label).join('\n');
    expect(keyed).toMatch(/falls a half step to the 3rd of V/);
    expect(JSON.stringify(ptTplL7.l7u21m2)).toMatch(/desce meio-tom/);
    expect(JSON.stringify(esTplL7.l7u21m2)).toMatch(/baja un semitono/);
  });

  it('harmonic-minor objective names only the modes the app can play (W5-22, D-12)', () => {
    // Rotate harmonic minor and look each mode up among the engine's scale formulas.
    const hm = SCALE_FORMULAS.harmonic_minor;
    const known = Object.entries(SCALE_FORMULAS).map(([k, f]) => [k, f.join(',')] as const);
    const inEngine = hm.map((_, i) => {
      const mode = hm.map((x) => mod12(x - hm[i])).sort((a, b) => a - b).join(',');
      return known.find(([, f]) => f === mode)?.[0] ?? null;
    });
    expect(inEngine.filter(Boolean)).toEqual(['harmonic_minor', 'phrygian_dominant']);
    const obj = mod(L7_UNITS, 'l7u23m4').objectives[0];
    expect(obj).not.toMatch(/Navigate all seven modes/);
    expect(obj).toMatch(/harmonic minor and Phrygian dominant/);
  });

  it('no lesson or search entry states the stale engine counts (W5-56)', () => {
    // The old numbers were wrong: the engine's own counts differ from 46 and 42.
    expect(Object.keys(SCALE_FORMULAS).length).not.toBe(46);
    expect(Object.keys(CHORD_FORMULAS).length).not.toBe(42);
    const texts = [
      ...L7_UNITS.flatMap((u) => [u.description, ...u.modules.map(allText)]),
      ...[ptL7, esL7].flatMap((ov) => Object.keys((ov as Ov).modules).map((id) => ovText(ov as Ov, id))),
      ...MODULE_INDEX.map((m) => JSON.stringify(m)),
    ].join('\n');
    expect(texts).not.toMatch(/\b46 (scales|escalas)\b/);
    expect(texts).not.toMatch(/\b42 (chord types|tipos de acordes)\b/);
  });

  it('of the four characteristic modal tones only Phrygian b2 is an avoid note (W5-21)', () => {
    // The app's own definition (templatesL7 l7u23m4): a scale note a half step above a chord tone.
    const isAvoid = (pc: number, chord: number[]) => !chord.includes(pc) && chord.includes(mod12(pc - 1));
    expect(isAvoid(9, CHORD_FORMULAS.minor7)).toBe(false); // Dorian natural 6 over m7
    expect(isAvoid(1, CHORD_FORMULAS.minor7)).toBe(true); // Phrygian b2 over m7
    expect(isAvoid(6, CHORD_FORMULAS.major7)).toBe(false); // Lydian #4 over maj7
    expect(CHORD_FORMULAS.dominant7).toContain(10); // Mixolydian b7 is a chord tone of 7
    expect(mod(L7_UNITS, 'l7u22m4').concepts[1].explanation).not.toMatch(/avoid notes/i);
  });
});

describe('L8 — analysis and post-tonal', () => {
  it('3-against-2 uses a 2-beat pulse, and the hands meet only on beat 1 (W5-12)', () => {
    // 3 claps at k/3 of the span, 2 beats at j/2: they coincide when 2k = 3j.
    const meets: [number, number][] = [];
    for (let k = 0; k < 3; k++) for (let j = 0; j < 2; j++) if (2 * k === 3 * j) meets.push([k, j]);
    expect(meets).toEqual([[0, 0]]);
    expect(mod(L8_UNITS, 'l8u27m5').tasks[0].instruction).toMatch(/steady pulse of 2 beats/);
    expect(ovText(ptL8 as Ov, 'l8u27m5')).toMatch(/pulsação constante de 2 tempos/);
    expect(ovText(esL8 as Ov, 'l8u27m5')).toMatch(/pulso constante de 2 tiempos/);
  });

  it('C Lydian + C Mixolydian = 9 pitch classes (W6-02)', () => {
    const union = new Set([...pcs(SCALE_FORMULAS.lydian), ...pcs(SCALE_FORMULAS.mixolydian)]);
    expect(union.size).toBe(9);
    expect(ovText(ptL8 as Ov, 'l8u27m3')).toMatch(/nove classes de altura/);
    expect(ovText(esL8 as Ov, 'l8u27m3')).toMatch(/nueve clases de altura/);
  });

  it('the C whole-tone and octatonic scales lack the dominant G; the octatonic does contain B (W5-51)', () => {
    expect(pcs(SCALE_FORMULAS.whole_tone).has(7)).toBe(false);
    expect(pcs(SCALE_FORMULAS.diminished_whole_half).has(7)).toBe(false);
    expect(pcs(SCALE_FORMULAS.diminished_whole_half).has(11)).toBe(true);
    expect(mod(L8_UNITS, 'l8u27m3').tasks[1].instruction).not.toMatch(/dominant or leading tone/);
  });

  it('orchestration no longer promises instrument ranges anywhere (W5-54)', () => {
    const l8 = L8_UNITS.flatMap((u) => [u.description, JSON.stringify(u.milestone ?? {}), ...u.modules.map(allText)]).join('\n');
    expect(l8).not.toMatch(/instrument ranges/i);
    expect(allText(mod(L8_UNITS, 'l8u26m3'))).not.toMatch(/\branges\b/);
  });

  it('La Monte Young is not called pulse-based; Sprechstimme not credited as Schoenberg\'s invention (W5-19, W5-50)', () => {
    // Sourced facts (not derivable): Wikipedia "La Monte Young", "In C", "Sprechgesang".
    const text = allText(mod(L8_UNITS, 'l8u27m4'));
    expect(text).not.toMatch(/Pulse-based minimalism \(La Monte Young/);
    expect(text).toMatch(/Drone minimalism \(La Monte Young\)/);
    expect(text).not.toMatch(/developed by Schoenberg/);
    expect(text).toMatch(/Humperdinck in 1897/);
  });

  it('tonal answer protects the tonic; sonata hint uses the module\'s labels (W5-40, W5-53)', () => {
    // Subject opening C→G (1→5). Real answer = +7: G→D, which leaves C. Tonal answer G→C keeps the tonic.
    const real = [0, 7].map((pc) => mod12(pc + 7));
    expect(real).toEqual([7, 2]);
    expect(real).not.toContain(0);
    expect(correctLabel(exercise(exercisesL8, 'l8u25m1e2'))).not.toMatch(/stay in the dominant key/);
    expect(correctLabel(exercise(exercisesL8, 'l8u25m1e2'))).toMatch(/undermine the tonic key/);
    const hint = templatesL8.find((t) => t.moduleId === 'l8u26m1')!.templates[0].hintTemplate;
    expect(hint).toMatch(/FTG-TR-STG-CT/);
    expect(hint).not.toMatch(/P-T-S-C/);
  });
});

describe('L9 — ear training', () => {
  it('C minor pentatonic + Gb = C blues; the task opens C minor pentatonic (W5-26)', () => {
    const blues = pcs(SCALE_FORMULAS.blues);
    const minPentPlusB5 = new Set([...pcs(SCALE_FORMULAS.pentatonic_minor), 6]);
    expect(sorted(blues)).toEqual(sorted(minPentPlusB5));
    const majPent = pcs(SCALE_FORMULAS.pentatonic_major);
    expect([...blues].filter((pc) => majPent.has(pc)).sort((a, b) => a - b)).toEqual([0, 7]); // only C and G shared
    const t = mod(L9_UNITS, 'l9u31m3').tasks;
    expect(t[0].query).toBe('C minor pentatonic');
    expect(t[1].query).toBe('C whole tone scale');
  });

  it('the tritone is not called "the most dissonant interval" anywhere in L9 (W5-58)', () => {
    // Sourced: Wikipedia "Consonance and dissonance" groups m2, tritone and M7 as strongly discordant.
    expect(6 * 2).toBe(12); // the tritone halves the octave (the hint's other claim)
    const texts = [
      ...L9_UNITS.flatMap((u) => u.modules.map(allText)),
      ...[ptL9, esL9].flatMap((ov) => Object.keys((ov as Ov).modules).map((id) => ovText(ov as Ov, id))),
      ...Object.values(exercisesL9).flat().map((e) => e.hint ?? ''),
    ].join('\n');
    expect(texts).not.toMatch(/most dissonant interval|intervalo mais dissonante|intervalo más disonante/);
  });

  it('minor-6th cue: The Entertainer\'s E→C leap is ascending m6; Love Story descending (W5-59)', () => {
    // E4 → C5 = 12 + C − E semitones.
    expect(12 + rootOf('C') - rootOf('E')).toBe(8); // minor 6th
    const c = mod(L9_UNITS, 'l9u30m4').concepts[0].explanation;
    expect(c).toMatch(/Minor 6th = The Entertainer \(ascending: the upward leap from E to C/);
    expect(c).toMatch(/Love Story is the classic descending example/); // source: Wikipedia "Interval recognition"
  });

  it('descending-5th cue names both sourced songs in EN/PT/ES (W6-02)', () => {
    expect(mod(L9_UNITS, 'l9u30m4').concepts[1].explanation).toMatch(/"Feelings" \(Feel-ings\) or of the Flintstones theme/);
    expect(ovText(ptL9 as Ov, 'l9u30m4')).toMatch(/Feelings.*Flintstones/);
    expect(ovText(esL9 as Ov, 'l9u30m4')).toMatch(/Feelings.*Picapiedra/);
  });

  it('a 9th is an octave plus a major 2nd above the root (W5-60)', () => {
    const ninth = CHORD_FORMULAS.major9[4];
    expect(ninth).toBe(12 + 2);
    expect(mod12(rootOf('Cmaj9') + ninth)).toBe(rootOf('D'));
    expect(mod(L9_UNITS, 'l9u30m5').concepts[1].explanation).toMatch(/octave plus a major 2nd above the root/);
  });

  it('the "chromatic" dictation interval prompt no longer calls diatonic intervals chromatic (W5-44)', () => {
    const tpl = templatesL9.find((t) => t.moduleId === 'l9u32m2')!.templates[1];
    expect(tpl.promptTemplate).not.toMatch(/chromatic interval/);
    expect(tpl.hintTemplate).not.toMatch(/augmented and diminished/);
    // Above a major-key tonic, the non-scale notes are exactly 1, 3, 6, 8, 10 semitones (the hint's claim).
    const major = pcs(SCALE_FORMULAS.major);
    expect([...Array(12).keys()].filter((pc) => !major.has(pc))).toEqual([1, 3, 6, 8, 10]);
    // E→F crosses two letter names: a diatonic half step that lies inside C major.
    expect(up(rootOf('E'), rootOf('F'))).toBe(1);
    expect(major.has(rootOf('E')) && major.has(rootOf('F'))).toBe(true);
    expect(exercise(exercisesL9, 'l9u32m2e1').hint).toMatch(/diatonic half step/);
  });

  it('authored seventh-chord ear items use readable labels and still grade correctly in EN/PT/ES', () => {
    const ids = ['l9u31m5e1', 'l9u31m5e2'];
    for (const [lang, ov] of [['en', null], ['pt', ptExL9], ['es', esExL9]] as const) {
      const map = applyExerciseOverlay(exercisesL9, ov);
      for (const id of ids) {
        const e = exercise(map, id);
        const label = correctLabel(e);
        expect(validateAnswer(e.config, label).correct, `${lang} ${id}`).toBe(true);
        const wrong = (e.config as { choices: { label: string; correct: boolean }[] }).choices.find((c) => !c.correct)!.label;
        expect(validateAnswer(e.config, wrong).correct, `${lang} ${id} wrong`).toBe(false);
      }
    }
    const en = (exercise(exercisesL9, 'l9u31m5e1').config as { choices: { label: string }[] }).choices.map((c) => c.label);
    expect(en).toEqual(['Major 7th', 'Minor 7th', 'Dominant 7th', 'Half-diminished 7th']);
  });
});

describe('Generated prompts (W5-37)', () => {
  const RAW_QUALITY = /\b(major7|minor7|dominant7|half[ _]diminished7|diminished7|major9|minor9|dominant9)\b/;

  it('no generated English prompt shows a raw chord-quality identifier (all levels: {quality} rendering)', () => {
    const all = [templatesL1, templatesL2, templatesL3, templatesL4, templatesL5, templatesL6, templatesL7, templatesL8, templatesL9]
      .flatMap((cfg) => Object.values(generateAllForLevel(cfg, 'en')).flat());
    expect(all.length).toBeGreaterThan(400);
    const offenders = all.filter((e) => RAW_QUALITY.test(e.prompt)).map((e) => `${e.id}: ${e.prompt}`);
    expect(offenders).toEqual([]);
  });

  it('no generated L6–L9 English hint shows a raw chord-quality identifier', () => {
    const all = [templatesL6, templatesL7, templatesL8, templatesL9].flatMap((cfg) => Object.values(generateAllForLevel(cfg, 'en')).flat());
    const offenders = all.filter((e) => RAW_QUALITY.test(e.hint ?? '')).map((e) => `${e.id}: ${e.hint}`);
    expect(offenders).toEqual([]);
  });

  it('L6–L9 generated English prompts never put "a" before a vowel-sound note letter', () => {
    const all = [templatesL6, templatesL7, templatesL8, templatesL9].flatMap((cfg) => Object.values(generateAllForLevel(cfg, 'en')).flat());
    const offenders = all.filter((e) => /\ba [AEF](?:b|#)?\b/.test(e.prompt)).map((e) => `${e.id}: ${e.prompt}`);
    expect(offenders).toEqual([]);
  });
});
