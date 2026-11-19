/**
 * Queries whose Quick Search results at 6de6c0e are recorded in
 * fixtures/searchResults.6de6c0e.json (what each result opens, in order, in
 * EN / PT / ES): the audit's fixes must keep every one of them (A3: "never
 * lose a query that works today"). Words that begin like a solfège syllable,
 * bare syllables, letters, PT / ES phrases, names, lessons.
 */
export const SEARCH_SAMPLE = [
  'dom', 'Dom', 'domi', 'sim', 'lab', 'Lab', 'fab', 'mib', 'lam', 'sol', 'Sol', 'Do', 'Re', 'Mi', 'Fa', 'La', 'Si', 'Do7', 'Dom7', 'Domaj7', 'Dosus4', 'Dodim',
  'dim', 'C', 'Cm', 'Cmaj7', 'Cmaj', 'C7#', 'G7', 'C7alt', 'Dm7', 'Bbm7b5', 'F#dim7', 'Cmaj7/G', 'Eb', 'f#', 'c sharp minor', 'g dominant',
  'D dorian', 'key of G', 'key of A minor', 'key of Eb major', 'blues scale', 'C whole tone scale', 'major', 'minor', 'lydian dominant', 'Half-Diminished', 'Dominant 7th',
  'escala de Ré maior', 'Ré maior', 'tonalidade de Sol', 'tonalidad de La menor', 'acorde de Ré menor', 'Fá sustenido menor', 'Sib', 'Fá#', 'Do mayor', 'C menor harmónica',
  'tritone', 'fugue', 'cadence', 'Solo', 'Lamb', 'Mix', 'Dorian',
] as const;
