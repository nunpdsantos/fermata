/**
 * W4b review B1 (decision D-09, audit W4-04): what a learner sees after a
 * FIRST wrong try must not give the answer away — the ½-point second try
 * would be free otherwise. That is the nudge (`nudge.ts`: the item's own, or
 * its type's method) or, when there is none, the pointer back to the lesson
 * section. The item's `hint` is now its explanation, shown only once the
 * item is final, so it may name the answer.
 *
 * Every served item, authored and generated, in English, Portuguese and
 * Spanish, with its options exactly as the check shows them
 * (choicesForExercise):
 *  - choice items: the nudge — or the section title the pointer shows —
 *    neither holds the keyed answer (exact / other spellings), nor all of its
 *    distinctive words (near), nor echoes it (the review's definition:
 *    ≥ 70 % of its content words, more than any other option's);
 *  - note ID (staff or ear): the nudge names no note on the answer's letter;
 *  - builds: the nudge does not list the target notes (the review's
 *    definition: every pitch class named; stricter here: two or more besides
 *    the root);
 *  - melody items: the nudge is the shared listening method, never a
 *    description of one option.
 *
 * Neither a hint nor a nudge is part of an exercise's identity (W4a: multiple
 * choice = prompt + keyed answer, everything else = the config), so this
 * retires no saved score.
 */
import { describe, it, expect } from 'vitest';
import { LEVELS, CONTENT_LANGS, levelCorpus } from './learnCorpus';
import { EN_UNITS, curriculumOverlay } from '../../../i18n/content/__tests__/overlayEntries';
import { fingerprint } from './exerciseFingerprints';
import { choicesForExercise, optionText } from '../../../components/learn/exercises/exerciseHelpers';
import { answerLeak, exactLeak, nearLeak, echoLeak, distinctiveWords } from '../../../components/learn/exercises/answerLeak';
import { nudgeFor, sectionPointer, noteReference, chordRecipe, scaleSteps } from '../../../components/learn/exercises/nudge';
import { buildChord } from '../../../core/constants/chords';
import { buildScale } from '../../../core/constants/scales';
import type { Accidental, ChordQuality, NaturalNote, ScaleType } from '../../../core/types/music';
import type { ContentLanguage } from '../../../i18n/content/types';
import i18n from '../../../i18n';

const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC: Record<string, number> = { '': 0, '#': 1, '♯': 1, b: -1, '♭': -1, '##': 2, bb: -2 };
const pitchClass = (name: string) => (PC[name[0]] + (ACC[name.slice(1)] ?? 0) + 12) % 12;
/** Note names written in a text ("F#", "Bb", "G4"), as pitch classes — the review's pattern. */
const namedPitchClasses = (text: string) =>
  new Set([...text.matchAll(/(?<![A-Za-z])([A-G](?:##|bb|#|b|♯|♭)?)(?![A-Za-z])/g)].map((m) => pitchClass(m[1])));
/** Does the text name a note on this letter (any accidental, any octave)? */
const namesLetter = (text: string, letter: string) =>
  [...text.matchAll(/(?<![\p{L}])([A-G])(?:##|bb|#|b|♯|♭)?\d?(?![\p{L}])/gu)].some((m) => m[1] === letter);

/** The build's target notes (the root first). */
function buildTargets(cfg: { type: string; root: string; rootAccidental: string; quality?: string; scaleType?: string }): string[] {
  const root = { natural: cfg.root as NaturalNote, accidental: (cfg.rootAccidental || '') as Accidental };
  const notes = cfg.type === 'chord_build' ? buildChord(root, cfg.quality as ChordQuality).notes : buildScale(root, cfg.scaleType as ScaleType).notes;
  return notes.map((n) => `${n.natural}${n.accidental}`);
}

/** A module's sections (its concepts), in the lesson's language. */
function conceptsOf(level: number, moduleId: string, lang: ContentLanguage) {
  const mod = EN_UNITS[level].flatMap((u) => u.modules).find((m) => m.id === moduleId);
  if (!mod) return [];
  if (lang === 'en') return mod.concepts;
  const ov = curriculumOverlay(lang, level).modules[moduleId];
  return mod.concepts.map((c, i) => ({ title: ov?.concepts[i]?.title ?? c.title, explanation: ov?.concepts[i]?.explanation ?? c.explanation }));
}

describe('the leak detector', () => {
  it('fires on an answer named in the text (case, punctuation and spacing ignored)', () => {
    expect(exactLeak('The treble clef is also called the G clef.', 'Treble clef')).toBe(true);
    expect(exactLeak('No sharps or flats = C major.', 'C major')).toBe(true);
    expect(exactLeak('Look at where the clef curls: that line is G.', 'Treble clef')).toBe(false);
    expect(exactLeak('The major 3rd gives major chords a bright character.', 'Major')).toBe(true);
  });

  it('short answers are whole tokens with their case (PT "e" / "do" are not the answers "E" / "Do")', () => {
    expect(exactLeak('In C major: C(Do), D(Re), E(Mi).', 'E')).toBe(true);
    expect(exactLeak('Canta a escala e conta os graus a partir do início.', 'E')).toBe(false);
    expect(exactLeak('Canta a partir do C central.', 'Do')).toBe(false);
    expect(exactLeak('C = 0, C#/Db = 1', '0')).toBe(true);
    expect(exactLeak('Counting from C as 10', '0')).toBe(false);
  });

  it('other spellings: a pitch for a note letter, interval abbreviations, PT/ES interval names, ordinals', () => {
    expect(exactLeak('G4 is a perfect 5th above middle C.', 'G')).toBe(true);
    expect(exactLeak('C6 sits on the second ledger line.', 'C')).toBe(true);
    expect(exactLeak('Count from E4 on the first line.', 'G')).toBe(false);
    expect(exactLeak('Sizes: m2=1 (tense), M2=2, m3=3.', 'Minor 3rd')).toBe(true);
    expect(exactLeak('Sizes: m2=1 (tense), M2=2.', 'Minor 3rd')).toBe(false);
    expect(exactLeak('Wide: P8=12.', 'Octave')).toBe(true);
    expect(exactLeak('É uma 3.ª menor — escura.', 'Minor 3rd', 'pt')).toBe(true);
    expect(exactLeak('Es una 5.ª justa.', 'Perfect 5th', 'es')).toBe(true);
    expect(exactLeak('As duas notas soam como uma só, a uma oitava.', 'Octave', 'pt')).toBe(true);
    expect(exactLeak('Conta as letras: dá uma 5.ª.', '5.ª', 'pt')).toBe(true);
    expect(exactLeak('Conta as letras das duas notas.', '5.ª', 'pt')).toBe(false);
    expect(exactLeak('2m=1 (tenso), 3m=3 (triste), 4P=5', 'Minor 3rd', 'pt')).toBe(true);
    expect(exactLeak('2m=1 (tenso), 4J=5 (abierto)', 'Perfect 4th', 'es')).toBe(true);
    expect(exactLeak('2m=1 (tenso), 4J=5 (abierto)', 'Minor 3rd', 'es')).toBe(false);
  });

  it('near: all of the answer\'s distinctive words, when it has two or more', () => {
    const item = {
      prompt: 'Which motion best preserves voice independence?',
      answer: 'Contrary motion -- voices move in opposite directions',
      others: ['Parallel motion -- voices move in the same direction', 'Oblique motion -- one voice holds', 'Similar motion -- same direction, different intervals'],
      hint: 'Contrary motion maximizes independence because the voices travel in opposite directions.',
    };
    expect(distinctiveWords(item).sort()).toEqual(['contrary', 'directions', 'opposite']);
    expect(nearLeak(item)).toBe(true);
    expect(nearLeak({ ...item, hint: 'Which way does each voice go? The most independent lines move apart.' })).toBe(false);
    expect(answerLeak({ ...item, hint: '' })).toBeNull();
  });

  it('echo (the review\'s definition): most of the answer\'s words, more than any other option\'s', () => {
    const item = {
      prompt: 'What does a cadence do?',
      answer: 'It closes a phrase with a harmonic arrival',
      others: ['It opens every phrase', 'It changes the key signature', 'It doubles the tempo'],
      hint: 'Think of a harmonic arrival that closes the phrase.',
    };
    expect(echoLeak(item)).toBe(true);
    expect(echoLeak({ ...item, hint: 'Where in a phrase does it happen, and what does the harmony do there?' })).toBe(false);
  });
});

describe('the method nudges never hold their answer', () => {
  it('note ID counts from a landmark whose letter is not the note\'s', () => {
    expect(noteReference('C', 4, 'treble')).not.toBe('nudgeRefTrebleC');
    expect(noteReference('G', 4, 'treble')).not.toBe('nudgeRefTrebleG');
    expect(noteReference('A', 3, 'treble')).toBe('nudgeRefTrebleC'); // two ledger lines down: from middle C
    expect(noteReference('F', 3, 'bass')).not.toBe('nudgeRefBassF');
    expect(noteReference('E', 4, 'bass')).toBe('nudgeRefBassC');
  });

  it('a chord build gets its interval recipe, a scale build its step pattern — no note names', () => {
    expect(chordRecipe('major', 'en')).toBe('a major 3rd and a perfect 5th');
    expect(chordRecipe('dominant7', 'pt')).toBe('uma 3.ª maior, uma 5.ª perfeita e uma 7.ª menor');
    expect(chordRecipe('augmented', 'es')).toBe('una 3.ª mayor y una 5.ª aumentada');
    expect(chordRecipe('dominant9', 'en')).toBe('a major 3rd, a perfect 5th, a minor 7th and a major 9th');
    expect(scaleSteps('major', 'en')).toEqual({ steps: 'W-W-H-W-W-W-H', wide: false });
    expect(scaleSteps('harmonic_minor', 'pt')).toEqual({ steps: 'T-mT-T-T-mT-T+mT-mT', wide: true });
    expect(scaleSteps('natural_minor', 'es')).toEqual({ steps: 'T-S-T-T-S-T-T', wide: false });
  });
});

describe('nothing shown after a first miss gives the answer away (EN, PT, ES — authored and generated)', () => {
  for (const lang of CONTENT_LANGS) {
    it(lang, () => {
      const t = i18n.getFixedT(lang);
      const leaks: string[] = [];
      const counts = { choice: 0, noteId: 0, build: 0, melody: 0, pointer: 0, pointerTitleless: 0 };
      for (const n of LEVELS) {
        for (const { exercise, moduleId } of levelCorpus(n, lang)) {
          const cfg = exercise.config;
          const nudge = nudgeFor(exercise, t, lang);
          const id = exercise.id;

          if (cfg.type === 'chord_build' || cfg.type === 'scale_build') {
            counts.build++;
            if (!nudge) { leaks.push(`${id}: a build without a nudge`); continue; }
            const targets = buildTargets(cfg);
            const have = new Set(targets.map(pitchClass));
            const named = namedPitchClasses(nudge);
            const nonRoot = targets.slice(1).map(pitchClass).filter((p) => named.has(p) && p !== pitchClass(targets[0]));
            if ([...have].every((p) => named.has(p))) leaks.push(`${id} (build, every note named): "${nudge}"`);
            else if (new Set(nonRoot).size >= 2) leaks.push(`${id} (build, ${new Set(nonRoot).size} target notes named): "${nudge}"`);
            continue;
          }
          if (cfg.type === 'ear_training' && cfg.mode === 'melody') {
            counts.melody++;
            if (nudge !== t('lesson.nudgeEarMelody')) leaks.push(`${id} (melody): not the shared method: "${nudge}"`);
            continue;
          }

          const choices = choicesForExercise(exercise, t);
          if (choices.length === 0) { leaks.push(`${id}: no options`); continue; }
          counts.choice++;
          const correct = choices.find((c) => c.correct)!;
          const answer = optionText(correct);
          const others = choices.filter((c) => !c.correct).map(optionText);
          // Note, interval and degree items draw their wrong options at random,
          // and near / echo depend on the other options: judge those against the
          // worst draw too — none of the answer's look-alikes on screen.
          const varies = cfg.type === 'note_id' || cfg.type === 'interval_id' || cfg.type === 'scale_degree_id' || (cfg.type === 'ear_training' && (cfg.mode === 'note' || cfg.mode === 'interval'));
          const draws = varies ? [others, []] : [others];

          const noteLetter = cfg.type === 'note_id' ? cfg.note : cfg.type === 'ear_training' && cfg.mode === 'note' ? (cfg.note ?? 'C') : null;
          let shown: string;
          if (nudge) {
            shown = nudge;
          } else {
            const pointer = sectionPointer(exercise, conceptsOf(n, moduleId, lang), answer, others, lang);
            if (!pointer) { leaks.push(`${id}: no nudge and no section to point to`); continue; }
            counts.pointer++;
            if (pointer.title === null) { counts.pointerTitleless++; continue; }
            shown = pointer.title;
          }
          if (noteLetter) {
            counts.noteId++;
            if (namesLetter(shown, noteLetter)) leaks.push(`${id} (note ${noteLetter} named): "${shown}"`);
          }
          for (const o of draws) {
            const leak = answerLeak({ id, lang, prompt: exercise.prompt, hint: shown, answer, others: o });
            if (leak) { leaks.push(`${id} (${leak}): "${answer}" in "${shown}" (other options: ${o.join(' / ') || 'none alike'})`); break; }
          }
        }
      }
      expect(counts.choice).toBeGreaterThan(700);
      expect(counts.build).toBeGreaterThan(150);
      expect(counts.noteId).toBeGreaterThan(30);
      expect(counts.melody).toBe(9);
      expect(leaks, leaks.join('\n')).toEqual([]);
    });
  }

  it('neither a hint nor a nudge is part of an exercise\'s identity (no score is retired)', () => {
    const ex = { type: 'multiple_choice' as const, prompt: 'Q?', config: { type: 'multiple_choice' as const, choices: [{ label: 'A', correct: true }, { label: 'B', correct: false }] } };
    expect(fingerprint({ ...ex, hint: 'one hint', nudge: 'a nudge' } as typeof ex)).toBe(fingerprint({ ...ex, hint: 'another' } as typeof ex));
    const ear = { type: 'ear_training' as const, prompt: 'Listen.', config: { type: 'ear_training' as const, mode: 'note' as const, note: 'C', accidental: '', octave: 4 } };
    expect(fingerprint({ ...ear, hint: 'x', nudge: 'n' } as typeof ear)).toBe(fingerprint({ ...ear, hint: 'y' } as typeof ear));
  });
});
