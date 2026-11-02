import type { ChordQuality } from '../core/types/music';

/**
 * Every chord quality's display name in Portuguese (pt-PT) and Spanish
 * (D-17, W11-A review): the chord panel, the chord browser / builder and the
 * Drill quality chips used to fall back to the English name for the ~40
 * qualities the exercise dictionary (i18n/content/musicTerms.ts) does not
 * cover.
 *
 * Conventions — taken from the dictionary and the PT/ES lesson text:
 *  - the dictionary's own names, in their standalone form, for the qualities
 *    it covers ("Sétima da dominante", "Maior com 7.ª M e 9.ª"; a unit test
 *    keeps the two in step);
 *  - ordinal abbreviations for added intervals (6.ª, 9.ª, 11.ª, 13.ª), "M"
 *    for a major seventh, as the dictionary writes them;
 *  - alterations as symbols (♭9, ♯9, ♯11, ♭13, ♭5, ♯5): the lessons name
 *    them so ("Alterações: b9, #9, #11, b13");
 *  - "power chord", "sus4", "6/9" stay as written: the lessons use them as is;
 *  - PT "décima primeira / décima terceira", ES "oncena / trecena", as the
 *    lessons name the 11th and 13th; "suspenso / suspendido", "nota
 *    adicionada / añadida", "dominante alterada".
 * Typed as Record<ChordQuality, …>, so a new quality cannot ship untranslated.
 */
export const CHORD_QUALITY_NAMES_PT: Record<ChordQuality, string> = {
  major: 'Maior',
  minor: 'Menor',
  diminished: 'Diminuto',
  augmented: 'Aumentado',
  major6: 'Maior com 6.ª',
  minor6: 'Menor com 6.ª',
  major7: 'Maior com 7.ª M',
  minor7: 'Menor com 7.ª',
  dominant7: 'Sétima da dominante',
  diminished7: 'Sétima diminuta',
  half_diminished7: 'Meio-diminuto',
  augmented7: 'Aumentado com 7.ª',
  sus2: 'Suspenso de 2.ª',
  sus4: 'Suspenso de 4.ª',
  add9: 'Com 9.ª adicionada',
  minor_major7: 'Menor com 7.ª M',
  power: 'Power chord',
  dominant7sus4: 'Sétima da dominante sus4',
  major9: 'Maior com 7.ª M e 9.ª',
  minor9: 'Menor com 7.ª e 9.ª',
  dominant9: 'Nona da dominante',
  dominant7flat9: 'Sétima da dominante ♭9',
  dominant7sharp9: 'Sétima da dominante ♯9',
  dominant7flat5: 'Sétima da dominante ♭5',
  dominant7sharp5: 'Sétima da dominante ♯5',
  dominant7alt: 'Dominante alterada',
  dominant11: 'Décima primeira da dominante',
  major11: 'Maior com 7.ª M e 11.ª',
  minor11: 'Menor com 7.ª e 11.ª',
  dominant9sharp11: 'Nona da dominante ♯11',
  dominant7sharp11: 'Sétima da dominante ♯11',
  major9sharp11: 'Maior com 7.ª M, 9.ª e ♯11',
  dominant13: 'Décima terceira da dominante',
  major13: 'Maior com 7.ª M e 13.ª',
  minor13: 'Menor com 7.ª e 13.ª',
  dominant13flat9: 'Décima terceira da dominante ♭9',
  dominant7flat13: 'Sétima da dominante ♭13',
  add11: 'Com 11.ª adicionada',
  six_nine: '6/9',
  minor_six_nine: 'Menor 6/9',
  dominant9sus4: 'Nona da dominante sus4',
  sus2sus4: 'Sus2/4',
  augmented_major7: 'Aumentado com 7.ª M',
  major7flat5: 'Maior com 7.ª M e ♭5',
  diminished_major7: 'Diminuto com 7.ª M',
  major7sharp11: 'Maior com 7.ª M e ♯11',
  dominant7sharp5flat9: 'Sétima da dominante ♯5 ♭9',
  dominant7flat5flat9: 'Sétima da dominante ♭5 ♭9',
  dominant7sharp5sharp9: 'Sétima da dominante ♯5 ♯9',
  dominant7flat5sharp9: 'Sétima da dominante ♭5 ♯9',
};

export const CHORD_QUALITY_NAMES_ES: Record<ChordQuality, string> = {
  major: 'Mayor',
  minor: 'Menor',
  diminished: 'Disminuido',
  augmented: 'Aumentado',
  major6: 'Mayor con 6.ª',
  minor6: 'Menor con 6.ª',
  major7: 'Mayor con 7.ª M',
  minor7: 'Menor con 7.ª',
  dominant7: 'Séptima de dominante',
  diminished7: 'Séptima disminuida',
  half_diminished7: 'Semidisminuido',
  augmented7: 'Aumentado con 7.ª',
  sus2: 'Suspendido de 2.ª',
  sus4: 'Suspendido de 4.ª',
  add9: 'Con 9.ª añadida',
  minor_major7: 'Menor con 7.ª M',
  power: 'Power chord',
  dominant7sus4: 'Séptima de dominante sus4',
  major9: 'Mayor con 7.ª M y 9.ª',
  minor9: 'Menor con 7.ª y 9.ª',
  dominant9: 'Novena de dominante',
  dominant7flat9: 'Séptima de dominante ♭9',
  dominant7sharp9: 'Séptima de dominante ♯9',
  dominant7flat5: 'Séptima de dominante ♭5',
  dominant7sharp5: 'Séptima de dominante ♯5',
  dominant7alt: 'Dominante alterada',
  dominant11: 'Oncena de dominante',
  major11: 'Mayor con 7.ª M y 11.ª',
  minor11: 'Menor con 7.ª y 11.ª',
  dominant9sharp11: 'Novena de dominante ♯11',
  dominant7sharp11: 'Séptima de dominante ♯11',
  major9sharp11: 'Mayor con 7.ª M, 9.ª y ♯11',
  dominant13: 'Trecena de dominante',
  major13: 'Mayor con 7.ª M y 13.ª',
  minor13: 'Menor con 7.ª y 13.ª',
  dominant13flat9: 'Trecena de dominante ♭9',
  dominant7flat13: 'Séptima de dominante ♭13',
  add11: 'Con 11.ª añadida',
  six_nine: '6/9',
  minor_six_nine: 'Menor 6/9',
  dominant9sus4: 'Novena de dominante sus4',
  sus2sus4: 'Sus2/4',
  augmented_major7: 'Aumentado con 7.ª M',
  major7flat5: 'Mayor con 7.ª M y ♭5',
  diminished_major7: 'Disminuido con 7.ª M',
  major7sharp11: 'Mayor con 7.ª M y ♯11',
  dominant7sharp5flat9: 'Séptima de dominante ♯5 ♭9',
  dominant7flat5flat9: 'Séptima de dominante ♭5 ♭9',
  dominant7sharp5sharp9: 'Séptima de dominante ♯5 ♯9',
  dominant7flat5sharp9: 'Séptima de dominante ♭5 ♯9',
};
