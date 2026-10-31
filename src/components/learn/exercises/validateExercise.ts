/**
 * Pure validation functions for curriculum exercises.
 * Converts serializable config to core types at validation time.
 * Accepts an optional translation function `t` (from i18next) for localized feedback.
 * When `t` is omitted (e.g., in tests), English fallback strings are used.
 */
import type {
  ExerciseConfig,
  NoteIdConfig,
  IntervalIdConfig,
  ScaleBuildConfig,
  ChordBuildConfig,
  MultipleChoiceConfig,
  EarTrainingConfig,
  ScaleDegreeIdConfig,
  ValidationResult,
} from '../../../core/types/exercise';
import type { Note, NaturalNote, Accidental, ScaleType, ChordQuality } from '../../../core/types/music';
import { noteToString } from '../../../core/types/music';
import { getPitchClass, areEnharmonic } from '../../../core/constants/notes';
import { buildScale, SCALE_TYPE_NAMES } from '../../../core/constants/scales';
import { buildChord, INTERVAL_LABELS, CHORD_QUALITY_NAMES } from '../../../core/constants/chords';
import { translateScaleType, translateChordQuality } from '../../../i18n/content/musicTerms';
import type { ContentLanguage } from '../../../i18n/content/types';

/** Minimal translation function signature compatible with i18next's TFunction */
type TranslateFn = (key: string, options?: Record<string, unknown>) => string;

/**
 * Fallback that reproduces the original English strings when no i18n `t` is available.
 * Uses the same interpolation syntax ({{var}}) that i18next uses.
 */
function fallbackT(key: string, options?: Record<string, unknown>): string {
  const STRINGS: Record<string, string> = {
    'exerciseFeedback.noteCorrectExact': 'Correct! {{note}} is the right note.',
    'exerciseFeedback.noteCorrectAnswer': 'Correct! {{note}} is the right answer.',
    'exerciseFeedback.noteIncorrect': 'The correct note is {{note}}.',
    'exerciseFeedback.intervalCorrect': "Correct! That's a {{interval}}.",
    'exerciseFeedback.intervalIncorrect': 'That was a {{correctInterval}}, not a {{userInterval}}.',
    'exerciseFeedback.scaleCorrect': 'Correct! You built the {{scale}} scale.',
    'exerciseFeedback.scaleIncorrect': 'Not quite — {{details}}. The {{scale}} scale has {{count}} notes.',
    'exerciseFeedback.chordCorrect': 'Correct! You built the {{chord}} chord.',
    'exerciseFeedback.chordIncorrect': 'Not quite — {{details}}. The {{chord}} chord has {{count}} notes.',
    'exerciseFeedback.earTrainingInvalid': 'Invalid ear training configuration.',
    'exerciseFeedback.degreeCorrect': 'Correct! That note is the {{degree}} of the scale.',
    'exerciseFeedback.degreeIncorrect': 'That note is the {{correctDegree}}, not the {{userDegree}}.',
    'exerciseFeedback.degreeNameFallback': 'Degree {{n}}',
    'exerciseFeedback.choiceCorrect': 'Correct! "{{label}}" is right.',
    'exerciseFeedback.choiceIncorrect': 'The correct answer is "{{label}}".',
    'exerciseFeedback.choiceNoAnswer': 'No correct answer defined.',
    'exerciseFeedback.degreeName1': 'Tonic (1st)',
    'exerciseFeedback.degreeName2': 'Supertonic (2nd)',
    'exerciseFeedback.degreeName3': 'Mediant (3rd)',
    'exerciseFeedback.degreeName4': 'Subdominant (4th)',
    'exerciseFeedback.degreeName5': 'Dominant (5th)',
    'exerciseFeedback.degreeName6': 'Submediant (6th)',
    'exerciseFeedback.degreeName7': 'Leading tone (7th)',
  };

  // Plural keys use i18next's JSON v4 suffixes (`_one` / `_other`), exactly
  // as the locale files do: the real `t` picks the suffix by Intl.PluralRules,
  // this English fallback by count === 1.
  const PLURAL_STRINGS: Record<string, string> = {
    'exerciseFeedback.scaleMissing_one': 'missing {{count}} note',
    'exerciseFeedback.scaleMissing_other': 'missing {{count}} notes',
    'exerciseFeedback.scaleExtra_one': '{{count}} extra note',
    'exerciseFeedback.scaleExtra_other': '{{count}} extra notes',
    'exerciseFeedback.chordMissing_one': 'missing {{count}} note',
    'exerciseFeedback.chordMissing_other': 'missing {{count}} notes',
    'exerciseFeedback.chordExtra_one': '{{count}} extra note',
    'exerciseFeedback.chordExtra_other': '{{count}} extra notes',
    'exerciseFeedback.semitones_one': '{{count}} semitone',
    'exerciseFeedback.semitones_other': '{{count}} semitones',
  };

  let template = STRINGS[key] ?? key;
  if (options && typeof options.count === 'number') {
    const suffixed = PLURAL_STRINGS[`${key}_${options.count === 1 ? 'one' : 'other'}`];
    if (suffixed) template = suffixed;
  }

  if (options) {
    for (const [k, v] of Object.entries(options)) {
      template = template.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
    }
  }

  return template;
}

/**
 * Display names for feedback (audit W1-10): the PT/ES music-term dictionary
 * where it has the term, otherwise the English display name — never the
 * internal id ("major9", "natural_minor").
 */
function scaleDisplayName(type: string, lang: ContentLanguage): string {
  const english = SCALE_TYPE_NAMES[type as ScaleType] ?? type.replace(/_/g, ' ');
  if (lang === 'en') return english;
  const translated = translateScaleType(type, lang);
  return translated === type.replace(/_/g, ' ') ? english : translated;
}

function chordDisplayName(quality: string, lang: ContentLanguage): string {
  const english = CHORD_QUALITY_NAMES[quality as ChordQuality] ?? quality.replace(/_/g, ' ');
  if (lang === 'en') return english;
  const translated = translateChordQuality(quality, lang);
  return translated === quality.replace(/_/g, ' ') ? english : translated;
}

function toNote(natural: string, accidental: string): Note {
  return { natural: natural as NaturalNote, accidental: accidental as Accidental };
}

function getDegreeName(degree: number, t: TranslateFn): string {
  if (degree >= 1 && degree <= 7) {
    return t(`exerciseFeedback.degreeName${degree}`);
  }
  return t('exerciseFeedback.degreeNameFallback', { n: degree });
}

function getIntervalLabel(semitones: number, t: TranslateFn): string {
  return (
    INTERVAL_LABELS[semitones] ||
    t('exerciseFeedback.semitones', { count: semitones })
  );
}

function buildMissingExtraParts(
  missing: number[],
  extra: number[],
  prefix: 'scale' | 'chord',
  t: TranslateFn,
): string {
  const parts: string[] = [];
  if (missing.length > 0) {
    parts.push(t(`exerciseFeedback.${prefix}Missing`, { count: missing.length }));
  }
  if (extra.length > 0) {
    parts.push(t(`exerciseFeedback.${prefix}Extra`, { count: extra.length }));
  }
  return parts.join(', ');
}

function validateNoteId(config: NoteIdConfig, answer: string, t: TranslateFn): ValidationResult {
  const correctNote = toNote(config.note, config.accidental);
  const correctStr = noteToString(correctNote);

  // Parse user answer as note string (e.g. "C#", "Db")
  const userNatural = answer[0]?.toUpperCase() ?? '';
  const userAcc = answer.slice(1);
  const userNote: Note = { natural: userNatural as NaturalNote, accidental: (userAcc || '') as Accidental };

  const acceptEnharmonic = config.acceptEnharmonic !== false;

  if (acceptEnharmonic) {
    if (areEnharmonic(correctNote, userNote)) {
      return { correct: true, explanation: t('exerciseFeedback.noteCorrectExact', { note: noteToString(userNote) }), expected: correctStr };
    }
  } else {
    if (userNote.natural === correctNote.natural && userNote.accidental === correctNote.accidental) {
      return { correct: true, explanation: t('exerciseFeedback.noteCorrectAnswer', { note: correctStr }), expected: correctStr };
    }
  }

  return {
    correct: false,
    explanation: t('exerciseFeedback.noteIncorrect', { note: correctStr }),
    expected: correctStr,
  };
}

function validateIntervalId(config: IntervalIdConfig, answer: string, t: TranslateFn): ValidationResult {
  const correctSemitones = config.targetSemitones;
  const userSemitones = parseInt(answer, 10);
  const correctLabel = getIntervalLabel(correctSemitones, t);

  if (userSemitones === correctSemitones) {
    return { correct: true, explanation: t('exerciseFeedback.intervalCorrect', { interval: correctLabel }), expected: correctLabel };
  }

  const userLabel = getIntervalLabel(userSemitones, t);
  return {
    correct: false,
    explanation: t('exerciseFeedback.intervalIncorrect', { correctInterval: correctLabel, userInterval: userLabel }),
    expected: correctLabel,
  };
}

function validateScaleBuild(config: ScaleBuildConfig, answer: Set<number>, t: TranslateFn, lang: ContentLanguage): ValidationResult {
  const root = toNote(config.root, config.rootAccidental);
  const scale = buildScale(root, config.scaleType as ScaleType);
  const expectedPCs: Set<number> = new Set(scale.notes.map((n) => getPitchClass(n) as number));
  const scaleName = `${noteToString(root)} ${scaleDisplayName(config.scaleType, lang)}`;

  if (setsEqual(expectedPCs, answer)) {
    return { correct: true, explanation: t('exerciseFeedback.scaleCorrect', { scale: scaleName }), expected: scaleName };
  }

  const missing = [...expectedPCs].filter((pc) => !answer.has(pc));
  const extra = [...answer].filter((pc) => !expectedPCs.has(pc));
  const details = buildMissingExtraParts(missing, extra, 'scale', t);

  return {
    correct: false,
    explanation: t('exerciseFeedback.scaleIncorrect', { details, scale: scaleName, count: expectedPCs.size }),
    expected: scaleName,
  };
}

function validateChordBuild(config: ChordBuildConfig, answer: Set<number>, t: TranslateFn, lang: ContentLanguage): ValidationResult {
  const root = toNote(config.root, config.rootAccidental);
  const chord = buildChord(root, config.quality as ChordQuality);
  const expectedPCs: Set<number> = new Set(chord.notes.map((n) => getPitchClass(n) as number));
  const chordName = `${noteToString(root)} ${chordDisplayName(config.quality, lang)}`;

  if (setsEqual(expectedPCs, answer)) {
    return { correct: true, explanation: t('exerciseFeedback.chordCorrect', { chord: chordName }), expected: chordName };
  }

  const missing = [...expectedPCs].filter((pc) => !answer.has(pc));
  const extra = [...answer].filter((pc) => !expectedPCs.has(pc));
  const details = buildMissingExtraParts(missing, extra, 'chord', t);

  return {
    correct: false,
    explanation: t('exerciseFeedback.chordIncorrect', { details, chord: chordName, count: expectedPCs.size }),
    expected: chordName,
  };
}

function validateEarTraining(config: EarTrainingConfig, answer: string, t: TranslateFn): ValidationResult {
  if (config.mode === 'note' && config.note) {
    return validateNoteId(
      { type: 'note_id', note: config.note, accidental: config.accidental ?? '', octave: config.octave ?? 4, acceptEnharmonic: config.acceptEnharmonic },
      answer,
      t,
    );
  }
  if (config.mode === 'interval' && config.root && config.targetSemitones !== undefined) {
    return validateIntervalId(
      { type: 'interval_id', root: config.root, rootAccidental: config.rootAccidental ?? '', rootOctave: config.rootOctave ?? 4, targetSemitones: config.targetSemitones, direction: config.direction ?? 'ascending' },
      answer,
      t,
    );
  }
  if ((config.mode === 'chord' || config.mode === 'scale' || config.mode === 'progression') && config.choices) {
    return validateMultipleChoice(
      { type: 'multiple_choice', choices: config.choices },
      answer,
      t,
    );
  }
  return { correct: false, explanation: t('exerciseFeedback.earTrainingInvalid'), expected: '' };
}

function validateScaleDegreeId(config: ScaleDegreeIdConfig, answer: string, t: TranslateFn): ValidationResult {
  const userDegree = parseInt(answer, 10);
  const expected = config.correctDegree;
  const degreeName = getDegreeName(expected, t);

  if (userDegree === expected) {
    return { correct: true, explanation: t('exerciseFeedback.degreeCorrect', { degree: degreeName }), expected: degreeName };
  }

  const userDegreeName = getDegreeName(userDegree, t);
  return {
    correct: false,
    explanation: t('exerciseFeedback.degreeIncorrect', { correctDegree: degreeName, userDegree: userDegreeName }),
    expected: degreeName,
  };
}

function validateMultipleChoice(config: MultipleChoiceConfig, answer: string, t: TranslateFn): ValidationResult {
  const correctChoice = config.choices.find((c) => c.correct);
  if (!correctChoice) {
    return { correct: false, explanation: t('exerciseFeedback.choiceNoAnswer'), expected: '' };
  }

  if (answer === correctChoice.label) {
    return { correct: true, explanation: t('exerciseFeedback.choiceCorrect', { label: correctChoice.label }), expected: correctChoice.label };
  }

  return {
    correct: false,
    explanation: t('exerciseFeedback.choiceIncorrect', { label: correctChoice.label }),
    expected: correctChoice.label,
  };
}

/**
 * Main validation dispatcher.
 * @param config Exercise config (discriminated by `type`)
 * @param answer For choice-based: string value. For build exercises: Set<number> of pitch classes.
 * @param t Optional i18next translation function. When omitted, English fallback strings are used.
 * @param lang Content language for scale/chord names inside feedback (default English).
 */
export function validateAnswer(
  config: ExerciseConfig,
  answer: string | Set<number>,
  t?: TranslateFn,
  lang: ContentLanguage = 'en',
): ValidationResult {
  const translate = t ?? fallbackT;
  switch (config.type) {
    case 'note_id':
      return validateNoteId(config, answer as string, translate);
    case 'interval_id':
      return validateIntervalId(config, answer as string, translate);
    case 'scale_build':
      return validateScaleBuild(config, answer as Set<number>, translate, lang);
    case 'chord_build':
      return validateChordBuild(config, answer as Set<number>, translate, lang);
    case 'multiple_choice':
      return validateMultipleChoice(config, answer as string, translate);
    case 'ear_training':
      return validateEarTraining(config, answer as string, translate);
    case 'scale_degree_id':
      return validateScaleDegreeId(config, answer as string, translate);
  }
}

function setsEqual(a: Set<number>, b: Set<number>): boolean {
  if (a.size !== b.size) return false;
  for (const v of a) {
    if (!b.has(v)) return false;
  }
  return true;
}
