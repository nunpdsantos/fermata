/**
 * Audit W4-16 — the modes are taught as a system before L7 relies on them.
 *
 * L7 used Dorian, Mixolydian, Locrian … from its chord-scale module on, but no
 * lesson said what a mode is. A concept must, at or before the first L7
 * lesson or exercise that names a church mode, teach: the seven modes as
 * rotations of one major scale (its "parent"), each mode's tonic in C major,
 * and each mode's characteristic note.
 *
 * Oracle, from first principles: mode k (Ionian = 1 … Locrian = 7) starts on
 * degree k of its parent major scale, so in C major the tonics are C D E F G
 * A B. A mode's characteristic note is where its interval pattern, read from
 * its own tonic, differs from the major scale (Lydian, Mixolydian) or the
 * natural minor (Dorian, Phrygian, Locrian): computed here by rotating the
 * major scale's step pattern W W H W W W H, not read from the app.
 */
import { describe, it, expect } from 'vitest';
import { modulesInOrder, levelCorpus } from './learnCorpus';
import { curriculumOverlay } from '../../../i18n/content/__tests__/overlayEntries';

const MODES = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'] as const;
const C_MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const STEPS = [2, 2, 1, 2, 2, 2, 1];
/** Semitones above the tonic of each degree of mode k (0-based rotation of the major pattern). */
const modeDegrees = (k: number) => {
  const out = [0];
  for (let i = 0; i < 6; i++) out.push(out[i] + STEPS[(k + i) % 7]);
  return out;
};
const MAJOR = modeDegrees(0);
const MINOR = modeDegrees(5);
/** "♭2", "♯4", "♮6"… where the mode differs from its reference scale. */
function characteristic(k: number): string[] {
  const ref = k === 3 || k === 4 ? MAJOR : MINOR;
  return modeDegrees(k).flatMap((s, i) => (s === ref[i] ? [] : [`${s < ref[i] ? '♭' : s > ref[i] && ref === MINOR && MAJOR[i] === s ? '♮' : '♯'}${i + 1}`]));
}

const MODE_NAME = /\b(dorian|phrygian|lydian|mixolydian|aeolian|locrian)\b(?! dominant)/i;
const order = modulesInOrder();

function lessonText(m: (typeof order)[number]['module']): string {
  return [m.title, m.subtitle, ...m.objectives, ...m.concepts.flatMap((c) => [c.title, c.explanation]), ...m.tasks.map((t) => t.instruction)].join(' \n ');
}

describe('the modes are taught before L7 relies on them (W4-16)', () => {
  it('the oracle: characteristic notes from rotating W W H W W W H', () => {
    expect(characteristic(1)).toEqual(['♮6']); // Dorian vs natural minor
    expect(characteristic(2)).toEqual(['♭2']); // Phrygian vs natural minor
    expect(characteristic(3)).toEqual(['♯4']); // Lydian vs major
    expect(characteristic(4)).toEqual(['♭7']); // Mixolydian vs major
    expect(characteristic(6)).toEqual(['♭2', '♭5']); // Locrian vs natural minor
  });

  const firstUse = order.findIndex(({ level, module }) => {
    if (level !== 7) return false;
    if (MODE_NAME.test(lessonText(module))) return true;
    return levelCorpus(7, 'en').some((i) => i.moduleId === module.id && MODE_NAME.test(`${i.exercise.prompt} ${JSON.stringify(i.exercise.config)}`));
  });
  const teaching = order.findIndex(({ module }) => module.concepts.some((c) => MODES.every((mode) => c.explanation.includes(mode))));

  it('a concept names all seven modes, at or before L7\'s first use of a mode', () => {
    expect(firstUse).toBeGreaterThan(-1);
    expect(teaching, 'no concept names all seven modes').toBeGreaterThan(-1);
    expect(teaching, `taught in ${order[teaching]?.module.id}, first used in ${order[firstUse]?.module.id}`).toBeLessThanOrEqual(firstUse);
  });

  it('it teaches them as rotations of one parent major scale, with the right tonics in C major', () => {
    const concept = order[teaching].module.concepts.find((c) => MODES.every((mode) => c.explanation.includes(mode)))!;
    expect(concept.explanation).toMatch(/parent/i);
    MODES.forEach((mode, k) => {
      expect(concept.explanation, `${mode} should start on ${C_MAJOR[k]} in C major`).toMatch(new RegExp(`\\b${C_MAJOR[k]} ${mode}\\b`));
    });
  });

  it('it names each mode\'s characteristic note, as the oracle derives it', () => {
    const concept = order[teaching].module.concepts.find((c) => MODES.every((mode) => c.explanation.includes(mode)))!;
    const norm = concept.explanation.replace(/\bb(?=\d)/g, '♭').replace(/#(?=\d)/g, '♯').replace(/natural (?=\d)/g, '♮');
    for (const k of [1, 2, 3, 4, 6]) {
      for (const note of characteristic(k)) {
        expect(norm, `${MODES[k]}: ${note}`).toMatch(new RegExp(`${MODES[k]}[^.;]*${note}|${note}[^.;]*${MODES[k]}`));
      }
    }
  });

  it('Portuguese and Spanish carry the same concept, with the same mode tonics', () => {
    const { module, level } = order[teaching];
    const idx = module.concepts.findIndex((c) => MODES.every((mode) => c.explanation.includes(mode)));
    for (const lang of ['pt', 'es'] as const) {
      const ov = curriculumOverlay(lang, level).modules[module.id]?.concepts[idx];
      expect(ov?.explanation, lang).toBeTruthy();
      MODES.forEach((mode, k) => {
        const local = { pt: ['Jónio', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Eólio', 'Lócrio'], es: ['Jónico', 'Dórico', 'Frigio', 'Lidio', 'Mixolidio', 'Eólico', 'Locrio'] }[lang][k];
        expect(ov!.explanation, `${lang} ${mode}`).toMatch(new RegExp(`\\b${C_MAJOR[k]} (${mode}|${local})`, 'i'));
      });
    }
  });
});
