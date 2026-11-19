/**
 * The staff description (audit A9) beyond what the served questions draw
 * today: every place on and around the staff, a chord, a melody, a key
 * signature with notes (only what the signature does not supply is printed,
 * a natural included), double accidentals, a flat below the bass staff.
 * The served questions themselves: staffDescriptions.corpus.test.ts.
 */
import { describe, it, expect } from 'vitest';
import type { TFunction } from 'i18next';
import i18n from '../../../i18n';
import type { PitchedNote } from '../../../core/types/music';
import { describeStaff, keySignatureMarks, staffPlace, staffPosition } from '../staffDescription';

const n = (s: string): PitchedNote => {
  const m = /^([A-G])(##|bb|#|b)?(\d)$/.exec(s)!;
  return { natural: m[1] as PitchedNote['natural'], accidental: (m[2] ?? '') as PitchedNote['accidental'], octave: Number(m[3]) };
};
const en = i18n.getFixedT('en') as TFunction;
const pt = i18n.getFixedT('pt') as TFunction;
const es = i18n.getFixedT('es') as TFunction;

describe('places', () => {
  it('from two ledger lines below to two above, treble and bass', () => {
    const treble = ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6', 'D6']
      .map((s) => staffPlace(staffPosition(n(s), 'treble')));
    expect(treble).toEqual([
      { kind: 'spaceUnderLedger', n: 2 }, { kind: 'ledgerBelow', n: 2 }, { kind: 'spaceUnderLedger', n: 1 }, { kind: 'ledgerBelow', n: 1 },
      { kind: 'spaceBelowStaff' },
      { kind: 'line', n: 1 }, { kind: 'space', n: 1 }, { kind: 'line', n: 2 }, { kind: 'space', n: 2 }, { kind: 'line', n: 3 },
      { kind: 'space', n: 3 }, { kind: 'line', n: 4 }, { kind: 'space', n: 4 }, { kind: 'line', n: 5 },
      { kind: 'spaceAboveStaff' },
      { kind: 'ledgerAbove', n: 1 }, { kind: 'spaceOverLedger', n: 1 }, { kind: 'ledgerAbove', n: 2 }, { kind: 'spaceOverLedger', n: 2 },
    ]);
    expect(staffPlace(staffPosition(n('G2'), 'bass'))).toEqual({ kind: 'line', n: 1 });
    expect(staffPlace(staffPosition(n('A3'), 'bass'))).toEqual({ kind: 'line', n: 5 });
    expect(staffPlace(staffPosition(n('C4'), 'bass'))).toEqual({ kind: 'ledgerAbove', n: 1 });
    expect(staffPlace(staffPosition(n('E2'), 'bass'))).toEqual({ kind: 'ledgerBelow', n: 1 });
  });

  it('a note is placed by its WRITTEN octave: C♭4 (it sounds B3) sits on ledger line 1 below the treble staff', () => {
    const cFlat4: PitchedNote = { natural: 'C', accidental: 'b', octave: 3 };
    expect(staffPlace(staffPosition(cFlat4, 'treble'))).toEqual({ kind: 'ledgerBelow', n: 1 });
  });
});

describe('sentences', () => {
  it('a chord: from its lowest note, whatever order it was written in', () => {
    expect(describeStaff({ notes: [n('G4'), n('C4'), n('E4')], clef: 'treble', chord: true }, en, 'en'))
      .toBe('Treble clef. 3 notes stacked as one chord, from the lowest: on ledger line 1 below the staff, on line 1 and on line 2. The staff\'s lines and spaces are counted from the bottom. Ledger lines are counted outwards from the staff.');
    expect(describeStaff({ notes: [n('G4'), n('C4'), n('E4')], clef: 'treble', chord: true }, pt, 'pt'))
      .toBe('Clave de sol. 3 notas sobrepostas num só acorde, da mais grave para a mais aguda: na linha suplementar 1 abaixo da pauta, na linha 1 e na linha 2. As linhas e os espaços da pauta contam-se de baixo para cima. As linhas suplementares contam-se a partir da pauta, para fora.');
  });

  it('a melody in the order written', () => {
    expect(describeStaff({ notes: [n('E4'), n('F#4'), n('G4')], clef: 'treble' }, es, 'es'))
      .toBe('Clave de sol. 3 notas, una después de otra: en la línea 1, después en el espacio 1, con un sostenido, después en la línea 2. Las líneas y los espacios del pentagrama se cuentan de abajo arriba.');
  });

  it('under a key signature only what it does not supply is printed — a natural included', () => {
    // D major (F♯, C♯): F♯4 prints nothing, F4 prints a natural, C♯5 nothing, B♭4 a flat.
    expect(describeStaff({ notes: [n('F#4'), n('F4'), n('C#5'), n('Bb4')], clef: 'treble', keySignature: 'D' }, en, 'en'))
      .toBe('Treble clef, 2 sharps in the key signature: on the F line and in the C space. 4 notes, one after the other: in space 1, then in space 1, with a natural sign, then in space 3, then on line 3, with a flat. The staff\'s lines and spaces are counted from the bottom.');
  });

  it('double accidentals and a bass key signature down to its F♭ below the staff', () => {
    expect(describeStaff({ notes: [n('C##4'), n('Ebb4')], clef: 'treble' }, en, 'en'))
      .toBe('Treble clef. 2 notes, one after the other: on ledger line 1 below the staff, with a double sharp, then on line 1, with a double flat. The staff\'s lines and spaces are counted from the bottom. Ledger lines are counted outwards from the staff.');
    expect(describeStaff({ notes: [], clef: 'bass', keySignature: 'Cb' }, en, 'en'))
      .toBe('Bass clef, 7 flats in the key signature: on the B line, in the E space, in the A space, on the D line, on the G line, in the C space and in the F space below the staff.');
    expect(keySignatureMarks('Cb', 'bass')!.at(-1)).toEqual({ type: 'b', letter: 'F', pos: -1 });
    expect(describeStaff({ notes: [], clef: 'bass', keySignature: 'G' }, pt, 'pt'))
      .toBe('Clave de fá, um sustenido na armação de clave: na linha do F.');
  });

  it('an unknown key signature is not described as one (and nothing is invented for it)', () => {
    expect(keySignatureMarks('H', 'treble')).toBeNull();
    expect(describeStaff({ notes: [n('G4')], clef: 'treble', keySignature: 'H' }, en, 'en'))
      .toBe("Treble clef. One note, on line 2. The staff's lines and spaces are counted from the bottom.");
  });
});
