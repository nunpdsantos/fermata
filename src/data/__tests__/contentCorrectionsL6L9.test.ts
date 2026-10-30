import { describe, it, expect } from 'vitest';
import type { CurriculumModule, CurriculumUnit } from '../../core/types/curriculum';
import type { ExerciseDefinition } from '../../core/types/exercise';
import type { ChordQuality } from '../../core/types/music';
import { L6_UNITS } from '../../core/constants/curriculumL6';
import { L7_UNITS } from '../../core/constants/curriculumL7';
import { L8_UNITS } from '../../core/constants/curriculumL8';
import { L9_UNITS } from '../../core/constants/curriculumL9';
import { CHORD_FORMULAS } from '../../core/constants/chords';
import { SCALE_FORMULAS } from '../../core/constants/scales';
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
import ptTplL6 from '../../i18n/content/pt/templatesL6';
import esTplL6 from '../../i18n/content/es/templatesL6';
import ptTplL7 from '../../i18n/content/pt/templatesL7';
import esTplL7 from '../../i18n/content/es/templatesL7';

// ---------------------------------------------------------------------------
// Regression tests for the 2026-10-30 audit, batch W5b (Learn L6–L9 + Explore).
// Each block pins one corrected claim. Where the claim is mechanical, the test
// re-derives the music from the engine's own formulas rather than trusting text.
// ---------------------------------------------------------------------------

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
const pcs = (semis: number[], root = 0) => new Set(semis.map((s) => (((s + root) % 12) + 12) % 12));

describe('L6 — chromatic harmony', () => {
  it('Gr+6: the lower three notes Ab-C-Eb form a MAJOR triad (W5-10)', () => {
    // Ab=8, C=0, Eb=3 → intervals above Ab: 4 (M3) and 7 (P5) = major triad.
    expect([(0 - 8 + 12) % 12, (3 - 8 + 12) % 12]).toEqual([4, 7]);
    const en = mod(L6_UNITS, 'l6u18m3').concepts[0].explanation;
    expect(en).toMatch(/form a major triad/);
    expect(en).not.toMatch(/minor quality/);
    expect(ovText(ptL6 as Ov, 'l6u18m3')).toMatch(/formam uma tríade maior/);
    expect(ovText(esL6 as Ov, 'l6u18m3')).toMatch(/forman una tríada mayor/);
  });

  it('Gr+6 pivot reaches keys a half step from the TONIC, five fifths away (W5-01, W5-02, W6-02)', () => {
    // Gr+6 of key K = dominant 7th on b6 (K+8); as V7 it resolves a P4 up: K+8+5 = K+1.
    for (let k = 0; k < 12; k++) expect((k + 8 + 5) % 12).toBe((k + 1) % 12);
    // C→Db counter-clockwise on the circle: C F Bb Eb Ab Db = 5 steps.
    let steps = 0;
    for (let pc = 0; pc !== 1; pc = (pc + 5) % 12) steps++;
    expect(steps).toBe(5);

    const tpl = templatesL6.find((t) => t.moduleId === 'l6u18m4')!;
    const keyed = (tpl.templates[0].params.choiceSets ?? []).flat().filter((c) => c.correct).map((c) => c.label).join('\n');
    expect(keyed).toMatch(/half step above or below the tonic/);
    expect(keyed).not.toMatch(/from the dominant/);

    const e2 = exercise(exercisesL6, 'l6u18m4e2');
    expect(correctLabel(e2)).not.toMatch(/tritone or more/);
    expect(e2.hint).not.toMatch(/tritone or more/);
    expect(JSON.stringify(ptExL6.l6u18m4e2)).not.toMatch(/trítono ou mais/);
    expect(JSON.stringify(esExL6.l6u18m4e2)).not.toMatch(/tritono o más/);

    expect(mod(L6_UNITS, 'l6u18m4').tasks[2].instruction).toMatch(/five positions/);
    expect(ovText(ptL6 as Ov, 'l6u18m4')).toMatch(/cinco posições/);
    expect(ovText(esL6 as Ov, 'l6u18m4')).toMatch(/cinco posiciones/);
    expect(ovText(ptL6 as Ov, 'l6u18m4')).not.toMatch(/seis posições/);
  });

  it('doubly chromatic mediant example (C major → Ab minor) shares no tones and is a third away (W5-11)', () => {
    const cMajor = pcs(CHORD_FORMULAS.major, 0);
    const abMinor = pcs(CHORD_FORMULAS.minor, 8);
    expect([...cMajor].filter((pc) => abMinor.has(pc))).toEqual([]);
    expect([3, 4, 8, 9]).toContain(8); // root interval C→Ab = 8 (a third below)
    const hint = exercise(exercisesL6, 'l6u19m3e3').hint ?? '';
    expect(hint).toMatch(/C major to Ab minor/);
    expect(hint).not.toMatch(/Db minor/);
  });

  it('CTo7 voices move two by half step and one by whole step, in all three languages (W6-02)', () => {
    // C-D#-F#-A → C-E-G: D#→E +1, F#→G +1, A→G −2.
    expect([4 - 3, 7 - 6, 7 - 9]).toEqual([1, 1, -2]);
    expect(ovText(ptL6 as Ov, 'l6u19m2')).not.toMatch(/cada uma por meio-tom para as restantes/);
    expect(ovText(ptL6 as Ov, 'l6u19m2')).toMatch(/A desce um tom para G/);
    expect(ovText(esL6 as Ov, 'l6u19m2')).toMatch(/A baja un tono a G/);
    expect(ovText(ptL6 as Ov, 'l6u19m2')).not.toMatch(/Mi mantém-se/);
  });

  it('equal division counts parts, not step size (W5-16)', () => {
    // parts = 12 / step: whole tone 12/2 = 6, dim7 12/3 = 4, augmented 12/4 = 3.
    expect([12 / 2, 12 / 3, 12 / 4]).toEqual([6, 4, 3]);
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
    const ic = (n: number) => {
      let count = 0;
      for (let i = 0; i < set.length; i++)
        for (let j = i + 1; j < set.length; j++) {
          const d = Math.abs(set[i] - set[j]);
          if (Math.min(d, 12 - d) === n) count++;
        }
      return count;
    };
    expect(ic(3)).toBe(8);
    expect(ic(6)).toBe(4);
    const t = mod(L6_UNITS, 'l6u19m4').tasks[1].instruction;
    expect(t).toMatch(/eight minor thirds and four tritones/);
  });

  it('second species follows Fux: weak-beat dissonance only as passing tones (W5-39, D-14)', () => {
    const c = mod(L6_UNITS, 'l6u20m1').concepts[1].explanation;
    expect(c).toMatch(/only as passing tones/);
    expect(c).not.toMatch(/step away and return \(neighbor tone\)/);
    expect(correctLabel(exercise(exercisesL6, 'l6u20m1e2'))).toMatch(/passing tones/);
  });

  it('voice pairs grow 1, 3, 6 — quadratically, not exponentially (W5-47)', () => {
    const pairs = (n: number) => (n * (n - 1)) / 2;
    expect([pairs(2), pairs(3), pairs(4)]).toEqual([1, 3, 6]);
    const c = mod(L6_UNITS, 'l6u20m3').concepts[0].explanation;
    expect(c).not.toMatch(/exponentially/);
    expect(c).toMatch(/2 voices make 1 pair, 3 voices make 3, and 4 voices make 6/);
  });

  it('a Bb clarinet reads C to sound Bb (W5-18)', () => {
    expect(mod(L6_UNITS, 'l6u20m4').concepts[2].tryThisLabel).toMatch(/sounds when it reads C major/);
  });
});

describe('L7 — jazz harmony', () => {
  it('Abm7-Db7-Cmaj7 bass is not chromatic; Dm7-Db7-Cmaj7 is (W5-13)', () => {
    // Ab→Db = +5 (P4), Db→C = −1; D→Db = −1, Db→C = −1.
    expect([(1 - 8 + 12) % 12, 0 - 1]).toEqual([5, -1]);
    const text = allText(mod(L7_UNITS, 'l7u21m4'));
    expect(text).not.toMatch(/entirely chromatic/);
    expect(text).not.toMatch(/pure chromatic motion/);
    expect(text).toMatch(/Dm7-Db7-Cmaj7 \(bass: D-Db-C\)/);
  });

  it('upper structures: Gb triad over C7 = b9, #11 (with b7); Db triad gives a natural 11 (W5-14)', () => {
    const rel = (pcList: number[]) => pcList.map((p) => (p + 12) % 12);
    expect(rel([6, 10, 1])).toEqual([6, 10, 1]); // Gb=#11, Bb=b7, Db=b9 above C
    expect(rel([1, 5, 8])).toContain(5); // Db-F-Ab: F = natural 11
    const c = mod(L7_UNITS, 'l7u22m2').concepts[0];
    expect(c.explanation).toMatch(/Gb \(F#\) major triad over C7 produces C7\(b9,#11\)/);
    expect(c.explanation).not.toMatch(/Db major triad over C7 produces/);
    expect(c.explanation).toMatch(/The Jazz Piano Book/);
    expect(c.tryThisQuery).toBe('C13#11');
    expect(ovText(ptL7 as Ov, 'l7u22m2')).not.toMatch(/C7#9b13|C7b9b13/);
    expect(ovText(esL7 as Ov, 'l7u22m2')).not.toMatch(/C7#9b13|C7b9b13/);
    expect(ovText(ptL7 as Ov, 'l7u22m2')).toMatch(/escreve "C13#11"/);
  });

  it('shell voicings: Cm7 and Cm7b5 share root, 3rd and 7th, so the b5 must stay (W5-15)', () => {
    const shell = (q: ChordQuality) => [CHORD_FORMULAS[q][0], CHORD_FORMULAS[q][1], CHORD_FORMULAS[q][3]];
    expect(shell('minor7')).toEqual(shell('half_diminished7'));
    const text = allText(mod(L7_UNITS, 'l7u21m2'));
    expect(text).not.toMatch(/perfect in all standard chord types/);
    expect(text).not.toMatch(/that is what makes each quality distinct/);
  });

  it('9sus: G9sus4 = Dm7 over G — the chord sits a 4th above the ii root (W5-20)', () => {
    const g9sus = pcs(CHORD_FORMULAS.dominant9sus4, 7);
    const dm7overG = new Set([...pcs(CHORD_FORMULAS.minor7, 2), 7]);
    expect([...g9sus].sort()).toEqual([...dm7overG].sort());
    const c = mod(L7_UNITS, 'l7u21m2').concepts[2].explanation;
    expect(c).toMatch(/perfect 4th above/);
    expect(c).not.toMatch(/Dm11\/G/);
  });

  it('IV-I-V-vi is the rotation of I-V-vi-IV that starts on IV (W5-23)', () => {
    const loop = ['I', 'V', 'vi', 'IV'];
    const fromIV = [...loop.slice(3), ...loop.slice(0, 3)].join('-');
    expect(fromIV).toBe('IV-I-V-vi');
    const c = mod(L7_UNITS, 'l7u23m1').concepts[2].explanation;
    expect(c).toMatch(/IV-I-V-vi \(starting on IV\)/);
    expect(c).not.toMatch(/IV-V-vi-IV/);
  });

  it('C#dim7 → Dm7 needs at least one whole-step move (W5-43)', () => {
    const from = [1, 4, 7, 10]; // C# E G Bb
    const to = [2, 5, 9, 0]; // D F A C
    const perms = (a: number[]): number[][] => (a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p])));
    const best = Math.min(...perms(to).map((p) => Math.max(...p.map((t, i) => { const d = Math.abs(t - from[i]) % 12; return Math.min(d, 12 - d); }))));
    expect(best).toBe(2);
    expect(mod(L7_UNITS, 'l7u22m2').tasks[2].instruction).toMatch(/rise a whole step/);
  });

  it('l7u21m1 build items really are extended chords (a tone beyond the 7th) (W5-25)', () => {
    const tpl = templatesL7.find((t) => t.moduleId === 'l7u21m1')!.templates[0];
    for (const q of tpl.params.chordQualities ?? []) {
      expect(Math.max(...CHORD_FORMULAS[q as ChordQuality]), q).toBeGreaterThan(11);
      expect(tpl.params.noteCounts).toContain(new Set(CHORD_FORMULAS[q as ChordQuality].map((s) => s % 12)).size);
    }
  });

  it('guide tones: the 7th of ii FALLS a half step to the 3rd of V (W5-42)', () => {
    // Dm7 7th = C (0); G7 3rd = B (11): C→B = −1. Dm7 3rd = F = G7 7th (5).
    expect((11 - 0 + 12) % 12).toBe(11);
    const tpl = templatesL7.find((t) => t.moduleId === 'l7u21m2')!.templates[1];
    const keyed = (tpl.params.choiceSets ?? []).flat().filter((c) => c.correct).map((c) => c.label).join('\n');
    expect(keyed).toMatch(/falls a half step to the 3rd of V/);
    expect(JSON.stringify(ptTplL7.l7u21m2)).toMatch(/desce meio-tom/);
    expect(JSON.stringify(esTplL7.l7u21m2)).toMatch(/baja un semitono/);
  });

  it('harmonic-minor objective names only the modes the app can play (W5-22, D-12)', () => {
    const obj = mod(L7_UNITS, 'l7u23m4').objectives[0];
    expect(obj).not.toMatch(/Navigate all seven modes/);
    expect(obj).toMatch(/harmonic minor and Phrygian dominant/);
    expect(SCALE_FORMULAS.phrygian_dominant).toBeDefined();
  });

  it('no lesson or search entry states the stale engine counts (W5-56)', () => {
    const texts = [
      ...L7_UNITS.flatMap((u) => [u.description, ...u.modules.map(allText)]),
      ...[ptL7, esL7].flatMap((ov) => Object.keys((ov as Ov).modules).map((id) => ovText(ov as Ov, id))),
      ...MODULE_INDEX.map((m) => JSON.stringify(m)),
    ].join('\n');
    expect(texts).not.toMatch(/\b46 (scales|escalas)\b/);
    expect(texts).not.toMatch(/\b42 (chord types|tipos de acordes)\b/);
  });

  it('modal characteristic tones are not called avoid notes (W5-21)', () => {
    expect(mod(L7_UNITS, 'l7u22m4').concepts[1].explanation).not.toMatch(/avoid notes/i);
  });
});

describe('L8 — analysis and post-tonal', () => {
  it('3-against-2 uses a 2-beat pulse (W5-12)', () => {
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

  it('La Monte Young is not called pulse-based; Sprechstimme not credited as Schoenberg\'s invention (W5-19, W5-50)', () => {
    const text = allText(mod(L8_UNITS, 'l8u27m4'));
    expect(text).not.toMatch(/Pulse-based minimalism \(La Monte Young/);
    expect(text).toMatch(/Drone minimalism \(La Monte Young\)/);
    expect(text).not.toMatch(/developed by Schoenberg/);
  });

  it('tonal answer protects the tonic; sonata hint uses the module\'s labels (W5-40, W5-53)', () => {
    expect(correctLabel(exercise(exercisesL8, 'l8u25m1e2'))).not.toMatch(/stay in the dominant key/);
    const hint = templatesL8.find((t) => t.moduleId === 'l8u26m1')!.templates[0].hintTemplate;
    expect(hint).toMatch(/FTG-TR-STG-CT/);
    expect(hint).not.toMatch(/P-T-S-C/);
  });
});

describe('L9 — ear training', () => {
  it('C minor pentatonic + Gb = C blues; the task opens C minor pentatonic (W5-26)', () => {
    const blues = pcs(SCALE_FORMULAS.blues);
    const minPentPlusB5 = new Set([...pcs(SCALE_FORMULAS.pentatonic_minor), 6]);
    expect([...blues].sort()).toEqual([...minPentPlusB5].sort());
    const majPent = pcs(SCALE_FORMULAS.pentatonic_major);
    expect([...blues].filter((pc) => majPent.has(pc)).sort()).toEqual([0, 7]); // only C and G shared
    const t = mod(L9_UNITS, 'l9u31m3').tasks;
    expect(t[0].query).toBe('C minor pentatonic');
    expect(t[1].query).toBe('C whole tone scale');
  });

  it('the tritone is not called "the most dissonant interval" anywhere in L9 (W5-58)', () => {
    const texts = [
      ...L9_UNITS.flatMap((u) => u.modules.map(allText)),
      ...[ptL9, esL9].flatMap((ov) => Object.keys((ov as Ov).modules).map((id) => ovText(ov as Ov, id))),
      ...Object.values(exercisesL9).flat().map((e) => e.hint ?? ''),
    ].join('\n');
    expect(texts).not.toMatch(/most dissonant interval|intervalo mais dissonante|intervalo más disonante/);
  });

  it('minor-6th cue: The Entertainer ascending, Love Story descending (W5-59)', () => {
    const c = mod(L9_UNITS, 'l9u30m4').concepts[0].explanation;
    expect(c).toMatch(/Minor 6th = The Entertainer \(ascending/);
    expect(c).toMatch(/Love Story is the classic descending example/);
  });

  it('a 9th is an octave plus a 2nd above the root (W5-60)', () => {
    expect(CHORD_FORMULAS.major9).toContain(14); // 12 + 2
    expect(mod(L9_UNITS, 'l9u30m5').concepts[1].explanation).toMatch(/octave plus a major 2nd above the root/);
  });

  it('the "chromatic" dictation interval prompt no longer calls diatonic intervals chromatic (W5-44)', () => {
    const tpl = templatesL9.find((t) => t.moduleId === 'l9u32m2')!.templates[1];
    expect(tpl.promptTemplate).not.toMatch(/chromatic interval/);
    expect(tpl.hintTemplate).not.toMatch(/augmented and diminished/);
    // Above a major-key tonic, the non-scale notes are exactly 1, 3, 6, 8, 10 semitones.
    const major = pcs(SCALE_FORMULAS.major);
    expect([...Array(12).keys()].filter((pc) => !major.has(pc))).toEqual([1, 3, 6, 8, 10]);
    expect(exercise(exercisesL9, 'l9u32m2e1').hint).toMatch(/diatonic half step/);
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
