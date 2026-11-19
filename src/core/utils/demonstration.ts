/**
 * Lesson demonstrations (second audit, M50–M56; the type and its rules are in
 * `core/types/demonstration.ts`): the check an author's demonstration must
 * pass, what it sounds (one schedule, on the audio clock) and the shorthand
 * for writing one. Pure and framework-agnostic: the staff drawing
 * (`components/learn/lesson/DemoStaff`) and "Hear it" (`InlineTryThis`) both
 * read it, and the tests compare both with the lesson's sentence.
 *
 * Checked when authored: a lesson writes `demo: demonstration('l7u22m5 c2',
 * {...})`, which throws on any problem `demonstrationProblems` finds. The
 * curriculum modules are evaluated by `npm run build` (the search pages read
 * every lesson: `src/site/content.ts`), so a demonstration whose bars do not
 * add up fails the build, and the type checker before it refuses a pitch that
 * is not spelled as a letter, an accidental and an octave.
 */
import type { NaturalNote, PitchedNote, Accidental } from '../types/music';
import type { DemoEvent, DemoPitch, DemoValue, Demonstration } from '../types/demonstration';

const VALUE_BEATS: Record<DemoValue, number> = { w: 4, 'h.': 3, h: 2, 'q.': 1.5, q: 1, '8': 0.5 };
const LETTER_PC: Record<NaturalNote, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const ACC_SEMITONES: Record<string, number> = { '': 0, '#': 1, '##': 2, b: -1, bb: -2 };
/** Octaves 1 to 7: every such pitch is on the piano (A0–C8). */
const PITCH = /^([A-G])(##|bb|#|b)?([1-7])$/;
/** Each note sounds for this share of its written length: repeated notes stay two notes. */
export const DEMO_SOUNDING = 0.9;

/** Quarter-note beats of a value. */
export function demoBeats(value: DemoValue): number {
  return VALUE_BEATS[value];
}

/** MIDI number of a written pitch (C4 = 60), or null when it is not one. */
export function demoMidi(pitch: string): number | null {
  const m = PITCH.exec(pitch);
  if (!m) return null;
  return 12 * (Number(m[3]) + 1) + LETTER_PC[m[1] as NaturalNote] + ACC_SEMITONES[m[2] ?? ''];
}

/**
 * The app's pitched note for a written pitch. The app's octave is the octave
 * of the SOUNDING pitch (B♯3 sounds C4: octave 4), which `pitchedNoteToVexKey`
 * writes back as B♯3 and `playNote` sounds as MIDI 60.
 */
export function demoNote(pitch: DemoPitch): PitchedNote {
  const m = PITCH.exec(pitch)!;
  const midi = demoMidi(pitch)!;
  const pc = ((midi % 12) + 12) % 12;
  return { natural: m[1] as NaturalNote, accidental: (m[2] ?? '') as Accidental, octave: (midi - pc) / 12 - 1 };
}

/** Beats in one bar of a time signature ('3/4' → 3, '6/8' would be 3). */
function barBeats(time: string): number {
  const [n, d] = time.split('/').map(Number);
  return (n * 4) / d;
}

/** Everything wrong with a demonstration, in words (empty = it may be used). */
export function demonstrationProblems(demo: Demonstration): string[] {
  const problems: string[] = [];
  if (!(demo.tempo >= 40 && demo.tempo <= 240)) problems.push(`tempo ${demo.tempo} is outside 40–240 quarter notes a minute`);
  if (demo.voices.length < 1 || demo.voices.length > 2) problems.push(`${demo.voices.length} voices: a demonstration has one or two`);
  const lengths: number[] = [];
  demo.voices.forEach((voice, v) => {
    if (!voice.events.length) problems.push(`voice ${v + 1} has no events`);
    let at = 0;
    voice.events.forEach((event, i) => {
      const where = `voice ${v + 1}, event ${i + 1}`;
      if (VALUE_BEATS[event.value] === undefined) problems.push(`${where}: "${event.value}" is not a note value`);
      const midis = event.notes.map((p) => demoMidi(p));
      event.notes.forEach((p, k) => {
        const midi = midis[k];
        if (midi === null) problems.push(`${where}: "${p}" is not a spelled pitch (letter, accidental, octave 1–7)`);
      });
      if (new Set(midis).size !== midis.length) problems.push(`${where}: a pitch twice in one chord`);
      if (midis.some((x, k) => k > 0 && x !== null && midis[k - 1] !== null && x < midis[k - 1]!)) problems.push(`${where}: notes not written low to high`);
      if (event.tie) {
        const next = voice.events[i + 1];
        if (!event.notes.length) problems.push(`${where}: a rest cannot be tied`);
        else if (!next || next.notes.join(' ') !== event.notes.join(' ')) problems.push(`${where}: tied to an event that does not hold the same pitches`);
      }
      const beats = VALUE_BEATS[event.value] ?? 0;
      if (demo.time) {
        const bar = barBeats(demo.time);
        const start = at % bar;
        if (start + beats > bar + 1e-9) problems.push(`${where}: a ${event.value} crosses the bar line (split it and tie it)`);
      }
      at += beats;
    });
    lengths.push(at);
    if (demo.time && Math.abs(at / barBeats(demo.time) - Math.round(at / barBeats(demo.time))) > 1e-9) {
      problems.push(`voice ${v + 1}: ${at} beats is not a whole number of ${demo.time} bars`);
    }
  });
  if (lengths.some((l) => Math.abs(l - lengths[0]) > 1e-9)) problems.push(`the voices last ${lengths.join(' and ')} beats: they must end together`);
  // The upper voice first: the text alternative calls them upper and lower.
  if (demo.voices.length === 2) {
    const mean = (v: number) => {
      const ms = demo.voices[v].events.flatMap((e) => e.notes.map((p) => demoMidi(p) ?? 0));
      return ms.reduce((a, b) => a + b, 0) / Math.max(1, ms.length);
    };
    if (mean(0) <= mean(1)) problems.push('the first voice must be the upper one');
    if (demo.voices[0].staff === 'bass' && demo.voices[1].staff === 'treble') problems.push('the treble voice comes first');
  }
  return problems;
}

/** A demonstration as a lesson writes it, checked now: a problem throws, naming the lesson. */
export function demonstration(where: string, demo: Demonstration): Demonstration {
  const problems = demonstrationProblems(demo);
  if (problems.length) throw new Error(`Demonstration ${where}: ${problems.join('; ')}`);
  return demo;
}

/** One sounding note of a demonstration: seconds from "Hear it", for how long, and how many start with it. */
export interface DemoSound {
  note: PitchedNote;
  midi: number;
  at: number;
  duration: number;
  /** Notes starting at this same moment (a chord, or two voices together), for the loudness. */
  together: number;
}

/**
 * What a demonstration sounds: every note at its written onset, for
 * `DEMO_SOUNDING` of its written length (a tie makes one long note of the
 * events it joins; a rest is silence), at the demonstration's tempo.
 */
export function demonstrationSchedule(demo: Demonstration): DemoSound[] {
  const beat = 60 / demo.tempo;
  const out: DemoSound[] = [];
  for (const voice of demo.voices) {
    let at = 0;
    // Notes still held by a tie from the previous event: pitch → its sound and its beats so far.
    let held = new Map<string, { sound: DemoSound; beats: number }>();
    for (const event of voice.events) {
      const beats = VALUE_BEATS[event.value];
      const next = new Map<string, { sound: DemoSound; beats: number }>();
      for (const pitch of event.notes) {
        const carried = held.get(pitch);
        const entry = carried ?? { sound: { note: demoNote(pitch), midi: demoMidi(pitch)!, at: at * beat, duration: 0, together: 1 }, beats: 0 };
        entry.beats += beats;
        entry.sound.duration = entry.beats * beat * DEMO_SOUNDING;
        if (!carried) out.push(entry.sound);
        if (event.tie) next.set(pitch, entry);
      }
      held = next;
      at += beats;
    }
  }
  out.sort((a, b) => a.at - b.at || a.midi - b.midi);
  for (const s of out) s.together = out.filter((o) => Math.abs(o.at - s.at) < 1e-9).length;
  return out;
}

/** Every pitch class a demonstration sounds (0–11). */
export function demonstrationPitchClasses(demo: Demonstration): Set<number> {
  return new Set(demonstrationSchedule(demo).map((s) => ((s.midi % 12) + 12) % 12));
}

// ── Shorthand for authors ───────────────────────────────────────────────────

/** Notes one after another, each of the same value: `run('q', ['D4', 'E4', 'F4'])`. */
export function run(value: DemoValue, pitches: readonly DemoPitch[]): DemoEvent[] {
  return pitches.map((p) => ({ notes: [p], value }));
}

/** Notes sounding together: `chord('w', ['D4', 'G4', 'C5', 'F5'])`; `{ tie: true }` holds it into the next event. */
export function chord(value: DemoValue, pitches: readonly DemoPitch[], options: { tie?: true } = {}): DemoEvent {
  return { notes: pitches, value, ...(options.tie ? { tie: true as const } : {}) };
}

/** One note: `note('w', 'E4')`. */
export function note(value: DemoValue, pitch: DemoPitch, options: { tie?: true } = {}): DemoEvent {
  return chord(value, [pitch], options);
}

/** A silence of a value. */
export function rest(value: DemoValue): DemoEvent {
  return { notes: [], value };
}
