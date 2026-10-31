/**
 * Answer choices are matched to English BY INDEX: the overlay replaces the
 * label of choice i, and the correct flag stays with English choice i. If a
 * translation lists its choices in a different order, the learner is graded
 * against the wrong label. This compares a fingerprint of every choice —
 * Roman numerals, chord/note symbols and fractions — with the English choice
 * at the same index (review follow-up). It cannot see a swap between two
 * choices that carry no such tokens.
 */
import { describe, it, expect } from 'vitest';
import { overlayEntries, LANGS } from './overlayEntries';

// Tokens that are the same in every language and cannot be ordinary words:
// Roman numerals with their figures (V7, vii°7, V/V, IV6), chord symbols and
// notes carrying an accidental, a quality, a figure or a slash (Cmaj7, Am, G#,
// C/E, Bb), and fractions (6/4, 3/4). Plain numbers are left out: English
// spells ordinals ("second inversion") where PT/ES write "2.ª inversão".
const ROMAN = /(?<![\p{L}#♯♭])([#b♭♯]?(?:VII|VI|IV|III|II|V|I|vii|vi|iv|iii|ii|v|i)(?:[°ø+])?\d*(?:\/(?:[#b]?(?:VII|VI|IV|III|II|V|I|vii|vi|iv|iii|ii|v|i)|[A-G]))?)(?![\p{L}])/gu;
const CHORD = /(?<![\p{L}])([A-G](?:##|bb|#|b|♯|♭)?(?:maj|min|dim|aug|sus|add|alt|m|M|ø|°|\+)?\d*(?:b\d+|#\d+)*(?:\/[A-G](?:#|b)?)?)(?![\p{L}])/gu;
const FRACTION = /(?<![\d/])(\d+\/\d+)(?![\d/])/g;

/** Romans that are also words or pronouns in EN/PT/ES prose. */
const NOT_ROMAN = new Set(['I', 'vi', 'v', 'i']);

export function fingerprint(label: string): string {
  // English writes the diminished sign as "o" (viio7), PT/ES as "°".
  const t = label.replace(/(?<=[\p{L}])[ºo](?=\d|\/|\)|,|\.|-|–|—|\s|$)/gu, (m, off: number) => (/(?:^|[^\p{L}])[iIvV]+$/u.test(label.slice(0, off)) ? '°' : m));
  const romans = [...t.matchAll(ROMAN)].map((m) => m[1]).filter((r) => !NOT_ROMAN.has(r));
  // PT "Em" followed by a word is the preposition ("Em C maior, ...").
  // A bare B/C/D/F/G is always a note (none is a PT/ES/EN word). A bare A/E
  // is a note only beside a quality word ("A menor", "E major") or inside a
  // list, brackets or a note sequence ("(A, C#, E)", "C-E-G"): elsewhere it is
  // the article/preposition/conjunction.
  const chords = [...t.matchAll(CHORD)]
    .filter((m) => {
      const c = m[1];
      const at = m.index ?? 0;
      const before = t.slice(0, at);
      const after = t.slice(at + c.length);
      if (c === 'Em' && /^\s+\p{L}/u.test(after)) return false;
      // SATB voice labels ("S-A, A-T"; PT/ES "S-C, C-T" with C = contralto)
      if (/[ST][-–]$/.test(before) || /^[-–][ST](?![\p{L}])/u.test(after)) return false;
      if (c.length > 1 || /[BCDFG]/.test(c)) return true;
      if (/[(,\-–]\s*$/.test(before) || /^\s*[,)\-–]/.test(after)) return true;
      // Beside a quality word. English "A major triad…" / "A minor third…" is
      // the article, so a bare A counts only when the key name ends there.
      const quality = /^\s+(?:menor|maior|mayor|minor|major)(?![\p{L}])/iu.exec(after);
      if (!quality) return false;
      return c === 'E' || /^\s*(?:$|[,.;:)(—–-])/.test(after.slice(quality[0].length));
    })
    .map((m) => m[1])
    .map((c) => c.replace('♯', '#').replace('♭', 'b'));
  const fractions = [...t.matchAll(FRACTION)].map((m) => m[1]);
  return [...romans.map((r) => `R:${r}`), ...chords.map((c) => `C:${c}`), ...fractions.map((f) => `F:${f}`)].sort().join(' ');
}

const choices = overlayEntries().filter((e) => /\.choices\[\d+\]$|\.choiceSets\[\d+\]\[\d+\]$/.test(e.key));

describe('answer choices keep their English order', () => {
  it('fingerprints read note names, numerals and numbers', () => {
    expect(fingerprint('E major (E, G#, B) -- the dominant of A minor')).toBe(fingerprint('Acorde de E maior (E, G#, B) — a dominante de A menor'));
    expect(fingerprint('Ab major has 4 flats: Bb, Eb, Ab, Db')).toBe(fingerprint('Ab maior tem 4 bemóis: Bb, Eb, Ab, Db'));
    expect(fingerprint('Figured bass 6/4 indicates second inversion')).toBe(fingerprint('Baixo cifrado 6/4 indica 2.ª inversão'));
    expect(fingerprint('Ambas as notas do trítono')).toBe('');
    // A swapped pair is caught:
    expect(fingerprint('V7 resolves to I')).not.toBe(fingerprint('IV7 resolve para I'));
  });

  it('bare note letters count, so swapped key labels are caught (re-review item 1)', () => {
    // "A menor" swapped with "C menor": A counts beside a quality word.
    expect(fingerprint('A minor')).toBe(fingerprint('A menor'));
    expect(fingerprint('A minor')).not.toBe(fingerprint('C menor'));
    // "G maior (G, B, D)" swapped with "F maior (F, A, C)": bare G/B/D/F/C always
    // count, A inside the list counts.
    expect(fingerprint('G major (G, B, D) -- the dominant of C')).toBe(fingerprint('G maior (G, B, D) — a dominante de C'));
    expect(fingerprint('G major (G, B, D) -- the dominant of C')).not.toBe(fingerprint('F maior (F, A, C) — a subdominante'));
    // The article / conjunction / preposition A, E are not notes.
    expect(fingerprint('A deceptive cadence')).toBe('');
    expect(fingerprint('E depois resolve')).toBe('');
    expect(fingerprint('A escala menor harmónica')).toBe('');
  });

  it('a planted swap of two real choices fails the comparison', () => {
    const real = choices.find((c) => c.key === 'ex:l5u15m2e1.choices[0]')!;
    const other = choices.find((c) => c.key === 'ex:l5u15m2e1.choices[3]')!;
    expect(fingerprint(real.en)).toBe(fingerprint(real.tr.pt ?? ''));
    expect(fingerprint(real.en)).not.toBe(fingerprint(other.tr.pt ?? ''));
  });

  it('covers every answer choice; a substantial share carry a fingerprint', () => {
    expect(choices.length).toBeGreaterThan(1000);
    const withFingerprint = choices.filter((c) => fingerprint(c.en) !== '').length;
    // 552 on 2026-10-31; a sharp drop means the token patterns stopped matching.
    expect(withFingerprint).toBeGreaterThan(500);
  });

  for (const lang of LANGS) {
    it(`${lang}: every choice has the same note/numeral/number fingerprint as English at that index`, () => {
      const bad = choices
        .filter((c) => fingerprint(c.en) !== fingerprint(c.tr[lang] ?? ''))
        .map((c) => `${c.key}\n    EN [${fingerprint(c.en)}] ${c.en}\n    ${lang} [${fingerprint(c.tr[lang] ?? '')}] ${c.tr[lang]}`);
      expect(bad, bad.join('\n')).toEqual([]);
    });
  }
});
