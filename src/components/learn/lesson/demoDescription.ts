/**
 * A demonstration's staff in words, for a screen reader (second audit,
 * M50–M56): the staff (or the joined treble and bass staves), the key
 * signature's sharps or flats by name, the time signature, then each voice's
 * notes in order — every note by its letter, sign and octave ("F♯5"), its
 * value, the notes sounding together, rests and ties, bars apart with "|".
 * Read from the same plan the drawing draws (`demoStaffPlan`), so it says what
 * the staff shows. In a demonstration the notes are what is taught: naming
 * them is the point (a check's staff, which may hold the answer, is described
 * without letters: `notation/staffDescription.ts`).
 *
 * Words: the `lessonDemo` namespace (lazy, `i18n/lessonDemo/`) and the rhythm
 * staff's value names (`lesson.rhythm_*`).
 */
import type { TFunction } from 'i18next';
import type { NaturalNote, PitchedNote } from '../../../core/types/music';
import type { Demonstration } from '../../../core/types/demonstration';
import { writtenOctave } from '../../../core/utils/degreeSpelling';
import { keySignatureAlterations } from '../../../utils/notationHelpers';
import { demoStaffPlan, type PlannedNote } from './demoStaffPlan';
import '../../../i18n/lessonDemo/index.ts';

const GLYPH: Record<string, string> = { '': '', '#': '♯', b: '♭', '##': '𝄪', bb: '𝄫' };
/** VexFlow's order of the signs in a key signature. */
const SHARP_ORDER: NaturalNote[] = ['F', 'C', 'G', 'D', 'A', 'E', 'B'];
const FLAT_ORDER: NaturalNote[] = [...SHARP_ORDER].reverse();

/** A written pitch by name: letter, sign, written octave ("F♯5", "B♭4"). */
export function pitchName(p: PitchedNote): string {
  return `${p.natural}${GLYPH[p.accidental] ?? ''}${writtenOctave(p, p.octave)}`;
}

function list(items: string[], t: TFunction): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')}${t('lessonDemo.and')}${items[items.length - 1]}`;
}

function valueWord(n: PlannedNote, t: TFunction, plural = false): string {
  const base = n.duration.replace('r', '') as 'w' | 'h' | 'q' | '8';
  let w = plural ? t(`lessonDemo.values.${base}`) : t(`lesson.rhythm_${base}`);
  if (n.dots) w = t('lesson.rhythmDotted', { value: w });
  if (n.rest) w = t('lesson.rhythmRest', { value: w });
  if (n.tieToNext) w = t('lesson.rhythmTied', { value: w });
  return w;
}

/** One bar (or the whole run, without a metre) of one voice, in words. */
function describeNotes(notes: PlannedNote[], t: TFunction): string {
  const phrases: string[] = [];
  let i = 0;
  while (i < notes.length) {
    const n = notes[i];
    if (n.rest) {
      phrases.push(valueWord(n, t));
      i++;
      continue;
    }
    if (n.pitches.length > 1) {
      phrases.push(`${t('lessonDemo.together', { notes: list(n.pitches.map(pitchName), t) })} (${valueWord(n, t)})`);
      i++;
      continue;
    }
    // A run of single notes of one value, untied: named together.
    let j = i;
    while (j + 1 < notes.length && !notes[j].tieToNext && !notes[j + 1].tieToNext && !notes[j + 1].rest
      && notes[j + 1].pitches.length === 1 && notes[j + 1].duration === n.duration && notes[j + 1].dots === n.dots) j++;
    const run = notes.slice(i, j + 1);
    phrases.push(`${list(run.map((x) => pitchName(x.pitches[0])), t)} (${valueWord(n, t, run.length > 1)})`);
    i = j + 1;
  }
  return phrases.join(t('lessonDemo.then'));
}

export function describeDemonstration(demo: Demonstration, t: TFunction): string {
  const plan = demoStaffPlan(demo);
  const grand = plan.staves.length > 1;
  const head: string[] = [t(`lessonDemo.staff.${grand ? 'grand' : plan.staves[0]}`)];
  if (plan.key) {
    const alterations = keySignatureAlterations(plan.key);
    const sharps = SHARP_ORDER.filter((l) => alterations[l] === '#');
    const flats = FLAT_ORDER.filter((l) => alterations[l] === 'b');
    if (sharps.length) head.push(t('lessonDemo.sharps', { count: sharps.length, notes: list(sharps.map((l) => `${l}♯`), t) }));
    else if (flats.length) head.push(t('lessonDemo.flats', { count: flats.length, notes: list(flats.map((l) => `${l}♭`), t) }));
    else head.push(t('lessonDemo.noSigns'));
  }
  if (plan.time) head.push(t('lessonDemo.time', { time: plan.time }));
  const voices = plan.voices.map((voice, v) => {
    const bars: PlannedNote[][] = [[]];
    voice.notes.forEach((n, i) => {
      bars[bars.length - 1].push(n);
      if (voice.barsAfter.includes(i)) bars.push([]);
    });
    const text = bars.map((bar) => describeNotes(bar, t)).join(' | ');
    if (plan.voices.length === 1) return `${text}.`;
    const who = t(v === 0 ? 'lessonDemo.upper' : 'lessonDemo.lower');
    const where = grand ? ` ${t(voice.staff === 'treble' ? 'lessonDemo.onTreble' : 'lessonDemo.onBass')}` : '';
    return `${who}${where}: ${text}.`;
  });
  return `${head.join(', ')}. ${voices.join(' ')}`;
}
