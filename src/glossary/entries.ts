/**
 * What each glossary entry can do beyond its words (wave 1, brief C):
 *
 *  - `example`: values for its worked example, computed by the THEORY ENGINE
 *    from the key on screen ("In G major: D"), never a written-in note — or
 *    null where it has nothing to show here;
 *  - `applies`: false where the term means nothing for the key on screen
 *    (degree names in a pentatonic, a relative key for a mode); the panel
 *    then says so instead of an example;
 *  - `hear`: a short sound demonstration (notes on the audio clock, played
 *    by the app's own `playTimedNotes`), in the register Explore plays;
 *  - `learn`: the lesson that teaches it (an id in data/moduleIndex.ts).
 *
 * The words themselves are in i18n/glossary/<lang>.json (`glossary.entries`).
 * Lazy: only the glossary panel imports this.
 */
import { noteToString, type Chord, type ChordQuality, type Note, type PitchedNote, type ScaleType } from '../core/types/music.ts';
import { withGlyphs } from '../core/utils/accidentalGlyphs.ts';
import { buildScale, SCALE_FORMULAS, getScaleDegreeFunctionKey } from '../core/constants/scales.ts';
import { buildChord, getDiatonicChordsForScale, getChordShortIntervalLabels } from '../core/constants/chords.ts';
import { getPitchClass } from '../core/constants/notes.ts';
import { getScaleNotesWithOctaves, getMidiNumber, midiToNote } from '../core/utils/pianoLayout.ts';
import { degreeOf, formatDegree, spellIntervalAbove, CHURCH_MODES } from '../core/utils/degreeSpelling.ts';
import type { TimedNote } from '../core/services/audio.ts';
import { exploreRegister } from '../components/explore/exploreRegister.ts';
import { keyFacts, MINOR_FAMILY } from '../components/explore/keyFacts.ts';
import { chordSymbol } from '../components/explore/focusReadout.ts';
import type { InstrumentType } from '../state/storeTypes.ts';
import { QUALITY_TERM, type TermId, SCALE_TERM_IDS } from './termIds.ts';

export type T = (key: string, opts?: Record<string, unknown>) => string;

/** What is on screen: the key, the chord open, the instrument and its octave. */
export interface GlossaryContext {
  root: Note;
  scaleType: ScaleType;
  chord: Chord | null;
  instrument: InstrumentType;
  baseOctave: number;
}

export interface Example {
  /** Which template of the entry: 'example' unless the entry has another. */
  template?: 'example' | 'exampleNone' | 'exampleWhole' | 'exampleTwo';
  vars: Record<string, string | number>;
}

/** Why an entry does not apply here: its own `only` text, or a shared line. */
export type NotHere = 'only' | 'notHere' | 'sevenOnly';

export interface EntrySpec {
  learn?: string;
  example?: (ctx: GlossaryContext, t: T) => Example | null;
  /** Null = applies; else what the panel says instead of the example. */
  notHere?: (ctx: GlossaryContext) => NotHere | null;
  hear?: (ctx: GlossaryContext) => TimedNote[] | null;
}

// ── Helpers: names, pitches, phrases ────────────────────────────────────────

const name = (n: Note) => withGlyphs(noteToString(n));
const list = (ns: readonly Note[]) => ns.map(name).join(' ');
const scaleOf = (ctx: GlossaryContext) => buildScale(ctx.root, ctx.scaleType);
const MAJOR_FAMILY = new Set<ScaleType>(['major', 'pentatonic_major', 'major_blues']);
const majorOrMinor = (type: ScaleType) => MAJOR_FAMILY.has(type) || MINOR_FAMILY.has(type);

/** The scale as Explore plays it: every note plus the octave home note. */
function scalePitches(ctx: GlossaryContext, type: ScaleType = ctx.scaleType, root: Note = ctx.root): PitchedNote[] {
  return getScaleNotesWithOctaves(buildScale(root, type).notes, exploreRegister(ctx.instrument, ctx.baseOctave).octave);
}

function chordPitches(ctx: GlossaryContext, notes: Note[], bass?: Note): PitchedNote[] {
  return exploreRegister(ctx.instrument, ctx.baseOctave).chordPitches(notes, bass);
}

/** A pitch a number of half steps above another. */
function above(p: PitchedNote, semitones: number): PitchedNote {
  return midiToNote(getMidiNumber(p, p.octave) + semitones);
}

const STEP = 0.42;
const NOTE_LEN = 0.6;
const CHORD_LEN = 1.1;

/** Build a phrase: single notes, chords (an array), and rests (a number of seconds). */
function phrase(...parts: (PitchedNote | PitchedNote[] | { rest: number })[]): TimedNote[] {
  const out: TimedNote[] = [];
  let at = 0;
  for (const part of parts) {
    if ('rest' in part) {
      at += part.rest;
    } else if (Array.isArray(part)) {
      for (const note of part) out.push({ note, at, duration: CHORD_LEN });
      at += CHORD_LEN + 0.15;
    } else {
      out.push({ note: part, at, duration: NOTE_LEN });
      at += STEP;
    }
  }
  return out;
}

/** The chord on a scale degree (1-based), when the key has one there. */
function diatonicOn(ctx: GlossaryContext, degree: number): Chord | null {
  return getDiatonicChordsForScale(scaleOf(ctx)).find((d) => d.degree === degree)?.chord ?? null;
}

/** The chord an entry about chords shows: the open chord if it is of that kind, else one built on the root. */
function chordFor(ctx: GlossaryContext, id: TermId, quality: ChordQuality): Chord {
  if (ctx.chord && (QUALITY_TERM[ctx.chord.quality] === id || id === 'chord' || id === 'triad' || id === 'arpeggio' || id === 'inversion' || id === 'formula')) {
    if (id !== 'triad' || ctx.chord.notes.length === 3) return ctx.chord;
  }
  const tonic = diatonicOn(ctx, 1);
  if ((id === 'chord' || id === 'triad' || id === 'arpeggio' || id === 'inversion' || id === 'formula') && tonic) return tonic;
  return buildChord(ctx.chord?.root ?? ctx.root, quality);
}

const chordExample = (id: TermId, quality: ChordQuality) => (ctx: GlossaryContext): Example => {
  const c = chordFor(ctx, id, quality);
  return { vars: { chord: chordSymbol(c), notes: list(c.notes) } };
};

const chordHear = (id: TermId, quality: ChordQuality, before?: ChordQuality) => (ctx: GlossaryContext): TimedNote[] => {
  const c = chordFor(ctx, id, quality);
  const parts: PitchedNote[][] = [];
  if (before) parts.push(chordPitches(ctx, buildChord(c.root, before).notes));
  parts.push(chordPitches(ctx, c.notes, c.bassNote));
  return phrase(...parts);
};

/** A degree name applies where Explore shows it: seven-note scales whose note at that place has that name. */
function functionAt(ctx: GlossaryContext, index: number): string | null {
  const formula = SCALE_FORMULAS[ctx.scaleType];
  if (formula.length !== 7) return null;
  return getScaleDegreeFunctionKey(index, formula[index] ?? 0);
}

const degreeEntry = (index: number, fnName: string, hear: (ctx: GlossaryContext, up: PitchedNote[]) => TimedNote[]): EntrySpec => ({
  learn: 'l2u4m2',
  notHere: (ctx) => (SCALE_FORMULAS[ctx.scaleType].length !== 7 ? 'sevenOnly' : functionAt(ctx, index) === `degreeShort.${fnName}` ? null : 'notHere'),
  example: (ctx) => (functionAt(ctx, index) === `degreeShort.${fnName}` ? { vars: { note: name(scaleOf(ctx).notes[index]) } } : null),
  hear: (ctx) => hear(ctx, scalePitches(ctx)),
});

const chordEntry = (id: TermId, quality: ChordQuality, learn: string | undefined, before?: ChordQuality): EntrySpec => ({
  learn,
  example: chordExample(id, quality),
  hear: chordHear(id, quality, before),
});

/**
 * The root a scale's entry is built on: the key's for the key's own scale;
 * with a chord open, any other scale is one of its "Compatible scales · D"
 * chips, which mean that scale on the CHORD's root (choosing one makes the
 * chord's root the key).
 */
const scaleRootFor = (ctx: GlossaryContext, type: ScaleType): Note =>
  ctx.chord && type !== ctx.scaleType ? ctx.chord.root : ctx.root;

const scaleEntry = (type: ScaleType, learn?: string): EntrySpec => ({
  learn,
  example: (ctx) => {
    const root = scaleRootFor(ctx, type);
    return { vars: { root: name(root), notes: list(buildScale(root, type).notes) } };
  },
  hear: (ctx) => phrase(...scalePitches(ctx, type, scaleRootFor(ctx, type))),
});

const SCALE_LEARN: Partial<Record<ScaleType, string>> = {
  major: 'l1u3m1',
  natural_minor: 'l2u5m1',
  harmonic_minor: 'l2u5m2',
  melodic_minor: 'l2u5m2',
  dorian: 'l7u22m4', phrygian: 'l7u22m4', lydian: 'l7u22m4', mixolydian: 'l7u22m4', locrian: 'l7u22m4',
  pentatonic_major: 'l9u31m3', pentatonic_minor: 'l9u31m3', blues: 'l9u31m3', major_blues: 'l9u31m3',
  whole_tone: 'l7u23m4', diminished_whole_half: 'l7u23m4', diminished_half_whole: 'l7u23m4',
  chromatic: 'l1u1m4',
  altered: 'l7u23m3', lydian_dominant: 'l7u23m3', locrian_natural2: 'l7u23m3', dorian_b2: 'l7u23m3',
  lydian_augmented: 'l7u23m3', mixolydian_b6: 'l7u23m3',
  phrygian_dominant: 'l7u23m4',
  hungarian_minor: 'l7u23m4', hungarian_major: 'l7u23m4', double_harmonic: 'l7u23m4', persian: 'l7u23m4',
  neapolitan_minor: 'l7u23m4', neapolitan_major: 'l7u23m4', hirajoshi: 'l7u23m4', in_sen: 'l7u23m4',
  iwato: 'l7u23m4', egyptian: 'l7u23m4',
};

// ── The entries ─────────────────────────────────────────────────────────────

const BASE: Record<string, EntrySpec> = {
  key: {
    learn: 'l1u3m2',
    example: (ctx) => ({ vars: { root: name(ctx.root) } }),
    hear: (ctx) => {
      const tonic = diatonicOn(ctx, 1);
      return phrase(...scalePitches(ctx), ...(tonic ? [chordPitches(ctx, tonic.notes)] : []));
    },
  },
  scale: {
    learn: 'l1u3m1',
    example: (ctx) => ({ vars: { notes: list(scaleOf(ctx).notes) } }),
    hear: (ctx) => phrase(...scalePitches(ctx)),
  },
  root: {
    learn: 'l1u3m4',
    example: (ctx) => ({ vars: { root: name(ctx.root) } }),
  },
  keySignature: {
    learn: 'l1u3m2',
    example: (ctx, t) => ({ vars: { signature: keyFacts(ctx.root, ctx.scaleType, t).signatureText } }),
  },
  sharpFlat: {
    learn: 'l1u1m3',
    example: (ctx): Example => {
      const altered = scaleOf(ctx).notes.filter((n) => n.accidental !== '');
      return altered.length ? { vars: { notes: list(altered) } } : { template: 'exampleNone', vars: {} };
    },
    hear: (ctx) => {
      const home = scalePitches(ctx)[0];
      return phrase(home, above(home, 1), { rest: 0.3 }, home, above(home, -1));
    },
  },
  halfStep: {
    learn: 'l1u1m3',
    example: (ctx) => {
      const notes = [...scaleOf(ctx).notes, ctx.root];
      for (const size of [1, 2]) {
        for (let i = 0; i + 1 < notes.length; i++) {
          if ((getPitchClass(notes[i + 1]) - getPitchClass(notes[i]) + 12) % 12 === size) {
            return { template: size === 1 ? 'example' : 'exampleWhole', vars: { a: name(notes[i]), b: name(notes[i + 1]) } };
          }
        }
      }
      return null;
    },
    hear: (ctx) => {
      const home = scalePitches(ctx)[0];
      return phrase(home, above(home, 1), { rest: 0.3 }, home, above(home, 2));
    },
  },
  octave: {
    learn: 'l1u3m3',
    example: (ctx) => ({ vars: { root: name(ctx.root) } }),
    hear: (ctx) => {
      const home = scalePitches(ctx)[0];
      return phrase(home, above(home, 12), [home, above(home, 12)]);
    },
  },
  staff: { learn: 'l1u1m1' },
  interval: {
    learn: 'l1u3m3',
    example: (ctx) => {
      const third = spellIntervalAbove(ctx.root, 3, 4);
      const letters = 'CDEFGAB';
      const i = letters.indexOf(ctx.root.natural);
      return { vars: { root: name(ctx.root), third: name(third), letters: [0, 1, 2].map((k) => letters[(i + k) % 7]).join(' ') } };
    },
    hear: (ctx) => {
      const home = scalePitches(ctx)[0];
      return phrase(home, above(home, 4), [home, above(home, 4)]);
    },
  },
  tritone: {
    learn: 'l2u7m2',
    // The scale's own note six half steps up when it has one (B Locrian's F,
    // the blues' ♭5: what the strip shows), else the augmented 4th.
    example: (ctx) => {
      const pc = (getPitchClass(ctx.root) + 6) % 12;
      const own = scaleOf(ctx).notes.find((n) => getPitchClass(n) === pc);
      return { vars: { root: name(ctx.root), other: name(own ?? spellIntervalAbove(ctx.root, 4, 6)) } };
    },
    hear: (ctx) => {
      const home = scalePitches(ctx)[0];
      return phrase(home, above(home, 6), [home, above(home, 6)]);
    },
  },
  relativeKey: {
    learn: 'l2u5m3',
    notHere: (ctx) => (majorOrMinor(ctx.scaleType) ? null : 'only'),
    // Outside plain major and natural minor (harmonic / melodic minor, the
    // pentatonics, the blues) the line names the KEY, not the scale: "A
    // Harmonic Minor and C major share every note" is untrue (G♯).
    example: (ctx, t): Example | null => {
      const rel = keyFacts(ctx.root, ctx.scaleType, t).relative;
      if (!rel) return null;
      if (ctx.scaleType === 'major' || ctx.scaleType === 'natural_minor') return { vars: { relative: rel } };
      const key = t(MAJOR_FAMILY.has(ctx.scaleType) ? 'circle.keyMajor' : 'circle.keyMinor', { note: name(ctx.root) });
      return { vars: { key, relative: rel } };
    },
    hear: (ctx) => {
      if (!majorOrMinor(ctx.scaleType)) return null;
      const major = MAJOR_FAMILY.has(ctx.scaleType);
      const relRoot = major ? spellIntervalAbove(ctx.root, 6, 9) : spellIntervalAbove(ctx.root, 3, 3);
      const relType: ScaleType = major ? 'natural_minor' : 'major';
      const own: ScaleType = major ? 'major' : 'natural_minor';
      return phrase(...scalePitches(ctx, own), { rest: 0.4 }, ...scalePitches(ctx, relType, relRoot));
    },
  },
  dominantKey: {
    learn: 'l2u4m1',
    notHere: (ctx) => (majorOrMinor(ctx.scaleType) ? null : 'only'),
    example: (ctx, t) => {
      const f = keyFacts(ctx.root, ctx.scaleType, t).facts.find((x) => x.id === 'dominant');
      return f ? { vars: { other: f.value } } : null;
    },
  },
  subdominantKey: {
    learn: 'l2u4m1',
    notHere: (ctx) => (majorOrMinor(ctx.scaleType) ? null : 'only'),
    example: (ctx, t) => {
      const f = keyFacts(ctx.root, ctx.scaleType, t).facts.find((x) => x.id === 'subdominant');
      return f ? { vars: { other: f.value } } : null;
    },
  },
  parentKey: {
    learn: 'l7u22m4',
    notHere: (ctx) => (CHURCH_MODES.has(ctx.scaleType) ? null : 'only'),
    example: (ctx, t) => {
      const f = keyFacts(ctx.root, ctx.scaleType, t).facts.find((x) => x.id === 'parent');
      return f ? { vars: { parent: f.value } } : null;
    },
  },
  circleOfFifths: {
    learn: 'l2u4m1',
    example: (ctx, t) => {
      const { facts } = keyFacts(ctx.root, ctx.scaleType, t);
      const a = facts.find((x) => x.id === 'subdominant');
      const b = facts.find((x) => x.id === 'dominant');
      return a && b ? { vars: { a: a.value, b: b.value } } : null;
    },
    hear: (ctx) => {
      const home = scalePitches(ctx)[0];
      // Up a 5th each time, folded back into one octave: four neighbours on the ring.
      return phrase(...[0, 7, 2, 9].map((s) => above(home, s)));
    },
  },
  relatedKeys: { learn: 'l5u16m2' },
  mode: { learn: 'l7u22m4' },
  classicalMinor: {
    learn: 'l2u5m2',
    example: (ctx) => ({
      vars: {
        up: list(buildScale(ctx.root, 'melodic_minor').notes),
        down: list([...buildScale(ctx.root, 'natural_minor').notes].reverse()),
      },
    }),
    hear: (ctx) => {
      const up = scalePitches(ctx, 'melodic_minor');
      const down = scalePitches(ctx, 'natural_minor').reverse().slice(1);
      return phrase(...up, ...down);
    },
  },
  writtenOctave: { learn: 'l1u33m1' },
  degree: {
    learn: 'l2u4m2',
    example: (ctx) => {
      const s = scaleOf(ctx);
      return { vars: { list: s.notes.map((n) => `${withGlyphs(formatDegree(degreeOf(s.root, n), '1'))} ${name(n)}`).join(' · ') } };
    },
    hear: (ctx) => phrase(...scalePitches(ctx)),
  },
  tonic: degreeEntry(0, 'tonic', (_ctx, up) => phrase(...[...up].reverse())),
  supertonic: degreeEntry(1, 'supertonic', (_ctx, up) => phrase(up[0], up[1], up[0])),
  mediant: degreeEntry(2, 'mediant', (_ctx, up) => phrase(up[0], up[2], [up[0], up[2]])),
  subdominant: degreeEntry(3, 'subdominant', (ctx, up) => {
    const i = diatonicOn(ctx, 1);
    const iv = diatonicOn(ctx, 4);
    return i && iv ? phrase(chordPitches(ctx, i.notes), chordPitches(ctx, iv.notes), chordPitches(ctx, i.notes)) : phrase(up[0], up[3], up[0]);
  }),
  dominant: degreeEntry(4, 'dominant', (ctx, up) => {
    const i = diatonicOn(ctx, 1);
    const v = diatonicOn(ctx, 5);
    return i && v ? phrase(chordPitches(ctx, v.notes), chordPitches(ctx, i.notes)) : phrase(up[4], up[0]);
  }),
  submediant: degreeEntry(5, 'submediant', (ctx, up) => {
    const i = diatonicOn(ctx, 1);
    const vi = diatonicOn(ctx, 6);
    return i && vi ? phrase(chordPitches(ctx, i.notes), chordPitches(ctx, vi.notes)) : phrase(up[0], up[5]);
  }),
  // The scale up to its 7th, a breath, then home: the pull (or its absence).
  leadingNote: degreeEntry(6, 'leading', (_ctx, up) => phrase(...up.slice(0, -1), { rest: 0.35 }, up[up.length - 1])),
  subtonic: degreeEntry(6, 'subtonic', (_ctx, up) => phrase(...up.slice(0, -1), { rest: 0.35 }, up[up.length - 1])),
  augFifth: degreeEntry(4, 'augFifth', (_ctx, up) => phrase(up[0], up[4], [up[0], up[4]])),

  chord: {
    learn: 'l1u3m4',
    example: chordExample('chord', 'major'),
    hear: (ctx) => {
      const c = chordFor(ctx, 'chord', 'major');
      const ps = chordPitches(ctx, c.notes, c.bassNote);
      return phrase(...ps, ps);
    },
  },
  chordsInKey: {
    learn: 'l2u7m5',
    notHere: (ctx) => (getDiatonicChordsForScale(scaleOf(ctx)).length ? null : 'notHere'),
    example: (ctx) => {
      const chords = getDiatonicChordsForScale(scaleOf(ctx));
      return chords.length ? { vars: { chords: chords.map((d) => chordSymbol(d.chord)).join(' · ') } } : null;
    },
    hear: (ctx) => {
      const chords = getDiatonicChordsForScale(scaleOf(ctx));
      return chords.length ? phrase(...chords.map((d) => chordPitches(ctx, d.chord.notes))) : null;
    },
  },
  romanNumeral: {
    learn: 'l2u7m5',
    notHere: (ctx) => (getDiatonicChordsForScale(scaleOf(ctx)).length ? null : 'notHere'),
    example: (ctx) => {
      const chords = getDiatonicChordsForScale(scaleOf(ctx));
      if (!chords.length) return null;
      const picked = chords.filter((d) => d.degree === 1 || d.degree === 4 || d.degree === 5);
      return { vars: { pairs: (picked.length ? picked : chords).map((d) => `${d.numeral} = ${chordSymbol(d.chord)}`).join(' · ') } };
    },
    hear: (ctx) => {
      const chords = [1, 4, 5, 1].map((d) => diatonicOn(ctx, d)).filter((c): c is Chord => !!c);
      return chords.length ? phrase(...chords.map((c) => chordPitches(ctx, c.notes))) : null;
    },
  },
  triad: {
    learn: 'l1u3m4',
    example: chordExample('triad', 'major'),
    hear: (ctx) => {
      const c = chordFor(ctx, 'triad', 'major');
      const ps = chordPitches(ctx, c.notes);
      return phrase(...ps, ps);
    },
  },
  majorChord: chordEntry('majorChord', 'major', 'l1u3m4'),
  minorChord: chordEntry('minorChord', 'minor', 'l2u7m3', 'major'),
  diminishedChord: chordEntry('diminishedChord', 'diminished', 'l2u7m3'),
  augmentedChord: chordEntry('augmentedChord', 'augmented', 'l2u7m3'),
  seventhChord: chordEntry('seventhChord', 'dominant7', 'l3u9m1', 'major'),
  dominantSeventh: {
    learn: 'l4u12m4',
    example: chordExample('dominantSeventh', 'dominant7'),
    // The chord, then where it pulls: the major chord a 5th below.
    hear: (ctx) => {
      const c = chordFor(ctx, 'dominantSeventh', 'dominant7');
      const home = buildChord(spellIntervalAbove(c.root, 4, 5), 'major');
      return phrase(chordPitches(ctx, c.notes, c.bassNote), chordPitches(ctx, home.notes));
    },
  },
  majorSeventh: chordEntry('majorSeventh', 'major7', 'l3u9m1', 'major'),
  minorSeventh: chordEntry('minorSeventh', 'minor7', 'l3u9m1', 'minor'),
  halfDiminished: chordEntry('halfDiminished', 'half_diminished7', 'l3u9m1'),
  diminishedSeventh: chordEntry('diminishedSeventh', 'diminished7', 'l3u9m1'),
  sixthChord: chordEntry('sixthChord', 'major6', 'l7u23m5', 'major'),
  susChord: {
    learn: 'l7u21m2',
    example: chordExample('susChord', 'sus4'),
    // Suspended, then settled.
    hear: (ctx) => {
      const c = chordFor(ctx, 'susChord', 'sus4');
      return phrase(chordPitches(ctx, c.notes, c.bassNote), chordPitches(ctx, buildChord(c.root, 'major').notes));
    },
  },
  powerChord: chordEntry('powerChord', 'power', undefined),
  addedNote: chordEntry('addedNote', 'add9', 'l7u21m1', 'major'),
  extendedChord: chordEntry('extendedChord', 'dominant9', 'l7u21m1', 'dominant7'),
  alteredChord: chordEntry('alteredChord', 'dominant7sharp9', 'l7u21m2', 'dominant7'),
  inversion: {
    learn: 'l2u7m4',
    example: (ctx): Example => {
      const c = chordFor(ctx, 'inversion', 'major');
      const n = c.notes;
      const rot = (k: number) => list([...n.slice(k), ...n.slice(0, k)]);
      const chord = chordSymbol({ ...c, bassNote: undefined });
      // A two-note chord (a power chord) has no 2nd inversion.
      if (n.length < 3) return { template: 'exampleTwo', vars: { chord, p0: rot(0), p1: rot(1) } };
      return { vars: { chord, p0: rot(0), p1: rot(1), p2: rot(2) } };
    },
    // Root position, then the 1st inversion: same notes, the 3rd lowest.
    hear: (ctx) => {
      const c = chordFor(ctx, 'inversion', 'major');
      const n = c.notes;
      return phrase(chordPitches(ctx, n), chordPitches(ctx, [...n.slice(1), n[0]]));
    },
  },
  formula: {
    learn: 'l1u3m4',
    example: (ctx) => {
      const c = chordFor(ctx, 'formula', 'major');
      const labels = c.algorithmicIntervalLabels ?? getChordShortIntervalLabels(c.quality);
      return { vars: { chord: chordSymbol(c), formula: labels.map((l) => withGlyphs(l)).join(' '), notes: list(c.notes) } };
    },
  },
  arpeggio: {
    example: chordExample('arpeggio', 'major'),
    hear: (ctx) => {
      const c = chordFor(ctx, 'arpeggio', 'major');
      return phrase(...chordPitches(ctx, c.notes, c.bassNote));
    },
  },
  compatibleScales: { learn: 'l7u22m1' },
  slashChord: {
    learn: 'l2u7m4',
    example: (ctx) => {
      const c = ctx.chord;
      if (!c?.bassNote) return null;
      return { vars: { chord: chordSymbol(c), name: chordSymbol({ ...c, bassNote: undefined }), bass: name(c.bassNote) } };
    },
    hear: (ctx) => {
      const c = ctx.chord?.bassNote ? ctx.chord : null;
      const base = c ?? diatonicOn(ctx, 1) ?? buildChord(ctx.root, 'major');
      const bass = c?.bassNote ?? base.notes[1];
      return phrase(chordPitches(ctx, base.notes), chordPitches(ctx, base.notes, bass));
    },
  },
  // Mode mixture: the borrowed chords the Build tab marks out of key (♭VII …).
  outOfKey: { learn: 'l5u16m4' },
  fret: { learn: 'l1u33m1' },
  position: { learn: 'l1u33m3' },
  fingerNumbers: { learn: 'l1u33m2' },
  stretch: {},
  tuning: {},
  anchorFret: { learn: 'l1u33m3' },
  tirandoApoyando: {},
  rightHandFingers: { learn: 'l1u33m2' },
  positionWalk: {},
  technicalSet: {},
  intervalScale: {
    hear: (ctx) => {
      const up = scalePitches(ctx);
      const parts: PitchedNote[] = [];
      for (let i = 0; i + 2 < up.length && i < 4; i++) parts.push(up[i], up[i + 2]);
      return phrase(...parts);
    },
  },
  brokenChord: {
    hear: (ctx) => {
      const c = diatonicOn(ctx, 1) ?? buildChord(ctx.root, 'major');
      const ps = chordPitches(ctx, c.notes);
      const top = above(ps[0], 12);
      return phrase(...ps, top, ...[...ps].reverse());
    },
  },
};

const SCALES: Record<string, EntrySpec> = Object.fromEntries(
  SCALE_TERM_IDS.map((id) => {
    const type = id.slice('scale_'.length) as ScaleType;
    return [id, scaleEntry(type, SCALE_LEARN[type])];
  }),
);

export const GLOSSARY: Record<TermId, EntrySpec> = { ...BASE, ...SCALES } as Record<TermId, EntrySpec>;

/** The scale type an entry names, for its title (`scaleName.<type>`). */
export function scaleOfTerm(id: TermId): ScaleType | null {
  return id.startsWith('scale_') ? (id.slice('scale_'.length) as ScaleType) : null;
}
