/**
 * Music audit 2, the review of builder K (item 1): the "This shape leaves out
 * X (d)" line named the wrong degree, or none, for a chord the PARSER built
 * with a slash bass that is not a chord tone — `chordFromParsed` puts that
 * bass first in `notes`, and the line read the degree by index ("C9♯11/A♭"
 * called D the ♯11; "C9/A" gave none). Checked here through the parser's own
 * path, against a table of degrees written from the semitones above the
 * root, independent of the app's labels.
 */
import { describe, expect, it } from 'vitest';
import { buildChord } from '../../../core/constants/chords';
import { chordShapesForCapo } from '../../../core/constants/guitarChordShapes';
import { chordFromParsed, parseChordSymbol } from '../../../core/utils/chordParser';
import type { Chord, ChordQuality, Note } from '../../../core/types/music';
import { leftOutTones } from '../leftOutWords';

const LETTER: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (n: Note) => (LETTER[n.natural] + [...n.accidental].reduce((a, c) => a + (c === '#' ? 1 : -1), 0) + 24) % 12;
const ROOTS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SUFFIX: Record<string, string> = {
  dominant9: '9', major9: 'maj9', minor9: 'm9', dominant11: '11', major11: 'maj11', minor11: 'm11',
  dominant13: '13', major13: 'maj13', minor13: 'm13', dominant13flat9: '13b9', dominant9sharp11: '9#11',
  major9sharp11: 'maj9#11', dominant9sus4: '9sus4', power: '5', sus2sus4: 'sus2sus4',
};
/** The degree a chord calls a tone this many semitones above its root. */
function expectedDegree(quality: string, semis: number): string {
  const sus = quality.includes('sus');
  return ({
    0: 'R', 1: 'b9', 2: quality === 'sus2sus4' ? '2' : '9', 3: 'b3', 4: '3', 5: sus ? '4' : '11', 6: '#11', 7: '5', 9: '13', 10: 'b7', 11: '7',
  } as Record<number, string>)[semis] ?? `? ${semis}`;
}
const words = (e: Parameters<typeof leftOutTones>[0], chord: Chord) =>
  leftOutTones(e, chord).map(({ note, degree }) => `${note.natural}${note.accidental} (${degree})`);

describe('the degree of a tone a grip leaves out', () => {
  it('through the parser: 15 qualities × 12 roots × 12 slash basses × capo 0 and 3, every degree right', () => {
    const wrong: string[] = [];
    let checked = 0;
    let slashWithForeignBass = 0;
    for (const [quality, suffix] of Object.entries(SUFFIX)) {
      for (const root of ROOTS) {
        for (const bass of ROOTS) {
          const parsed = parseChordSymbol(`${root}${suffix}/${bass}`);
          expect(parsed, `${root}${suffix}/${bass}`).toBeTruthy();
          const chord = chordFromParsed(parsed!);
          expect(chord.quality).toBe(quality);
          for (const capo of [0, 3]) {
            for (const e of chordShapesForCapo(chord, 0, capo).shapes) {
              for (const { note, degree } of leftOutTones(e, chord)) {
                checked++;
                if (chord.notes[0] === chord.bassNote) slashWithForeignBass++;
                const want = expectedDegree(quality, (pcOf(note) - pcOf(chord.root) + 12) % 12);
                if (degree !== want) wrong.push(`${root}${suffix}/${bass} capo ${capo}: ${note.natural}${note.accidental} named ${degree}, is ${want}`);
              }
            }
          }
        }
      }
    }
    expect(wrong).toEqual([]);
    // The walk met left-out tones, and among them chords whose foreign bass the parser put first.
    expect(checked).toBeGreaterThan(100);
    expect(slashWithForeignBass).toBeGreaterThan(10);
  }, 300_000);

  it('a chord the parser builds note by note (its own labels), with a slash bass put first: every degree is the parser\'s for that note', () => {
    // Cm(add11), C9♭13, C7♭9♭13… carry `algorithmicIntervalLabels` for
    // `algorithmicNotes`; `chordFromParsed` puts a foreign bass before them.
    // The degree must be the parser's label of that same note, never the
    // label of the note one place on.
    const SUFFIXES = ['m(add11)', '9b13', '7b9b13', 'maj7#9', 'm7b9', '7#9b13'];
    const wrong: string[] = [];
    let checked = 0;
    let bassFirst = 0;
    for (const suffix of SUFFIXES) {
      for (const root of ROOTS) {
        for (const bass of ROOTS) {
          const parsed = parseChordSymbol(`${root}${suffix}/${bass}`)!;
          if (!parsed?.algorithmicIntervalLabels || !parsed.algorithmicNotes) continue;
          const chord = chordFromParsed(parsed);
          const first = chord.notes.length === parsed.algorithmicNotes.length + 1;
          for (const capo of [0, 3]) {
            for (const e of chordShapesForCapo(chord, 0, capo).shapes) {
              for (const { note, degree } of leftOutTones(e, chord)) {
                checked++;
                if (first) bassFirst++;
                const at = parsed.algorithmicNotes.findIndex((x) => x.natural === note.natural && x.accidental === note.accidental);
                if (degree !== parsed.algorithmicIntervalLabels[at]) wrong.push(`${root}${suffix}/${bass} capo ${capo}: ${note.natural}${note.accidental} named ${degree}, the parser says ${parsed.algorithmicIntervalLabels[at]}`);
              }
            }
          }
        }
      }
    }
    expect(wrong).toEqual([]);
    expect(checked).toBeGreaterThan(50);
    expect(bassFirst).toBeGreaterThan(50);
  }, 300_000);

  it('Cm(add11)/F♯, no capo: a grip that leaves out F names it the 11', () => {
    const chord = chordFromParsed(parseChordSymbol('Cm(add11)/F#')!);
    expect(chord.algorithmicIntervalLabels).toEqual(['R', 'b3', '5', '11']);
    expect(chord.notes.map((n) => `${n.natural}${n.accidental}`)).toEqual(['F#', 'C', 'Eb', 'G', 'F']);
    const said = chordShapesForCapo(chord, 0, 0).shapes.flatMap((e) => words(e, chord));
    expect(said.length).toBeGreaterThan(0);
    expect(new Set(said)).toEqual(new Set(['F (11)']));
  });

  it('the review\'s cases: C9♯11/A♭ and C9/A name D the 9; F♯sus2sus4/F names G♯ the 2', () => {
    for (const [sym, capo] of [['C9#11/Ab', 3], ['C9/A', 3], ['F#sus2sus4/F', 3], ['C9#11/Ab', 0], ['C9/A', 0]] as const) {
      const chord = chordFromParsed(parseChordSymbol(sym)!);
      for (const e of chordShapesForCapo(chord, 0, capo).shapes) {
        for (const w of words(e, chord)) {
          if (w.startsWith('D ')) expect(w, sym).toBe('D (9)');
          if (w.startsWith('G# ')) expect(w, sym).toBe('G# (2)');
        }
      }
    }
  });

  it('one tone, a slash chord, with and without a capo: the first grip as the board offers it', () => {
    const first = (sym: string, capo: number) => {
      const chord = chordFromParsed(parseChordSymbol(sym)!);
      const e = chordShapesForCapo(chord, 0, capo).shapes[0];
      const frets = e.shape.strings.map((p) => (p.fret === null ? 'x' : e.baseFret + p.fret)).join('-');
      return `${frets}: ${words(e, chord).join(', ')}`;
    };
    expect(first('Bbm9/B', 0)).toBe('x-2-x-3-2-4: C (9)');
    expect(first('C13', 9)).toBe('x-x-10-9-11-10: A (13)');
  });

  it('two tones, each with its own degree (Cmaj9♯11 held as C E B: the 9 and the ♯11)', () => {
    const chord = buildChord({ natural: 'C', accidental: '' }, 'major9sharp11' as ChordQuality);
    // x 3 2 4 x x: C3 E3 B3 — a hand-made grip that sounds neither D nor F♯.
    const strings = [{ fret: null, finger: 0 }, { fret: 3, finger: 2 }, { fret: 2, finger: 1 }, { fret: 4, finger: 4 }, { fret: null, finger: 0 }, { fret: null, finger: 0 }] as Parameters<typeof leftOutTones>[0]['shape']['strings'];
    const e = { shape: { name: 'built', shortName: 'built', type: 'open' as const, cagedShape: 'C' as const, rootString: 5 as const, rootFretOffset: 0, strings }, baseFret: 0 };
    expect(words(e, chord)).toEqual(['D (9)', 'F# (#11)']);
  });

  it('a grip that sounds every named tone says nothing', () => {
    const chord = buildChord({ natural: 'C', accidental: '' }, 'major' as ChordQuality);
    expect(leftOutTones(chordShapesForCapo(chord, 0, 3).shapes[0], chord)).toEqual([]);
  });
});
