/**
 * "So far" on Drill's settings and map: the part of a family the track
 * lessons opened, true as written (final review of wave 2: after l1u35m2 and
 * m3 it read "chords I, ii, III, IV, V, vi in the keys G, C, D, A, E" — the
 * third chord is the minor iii, and ii / iii / vi were opened in G, C and D
 * only).
 */
import { describe, it, expect } from 'vitest';
import i18n from '../../../i18n';
import type { TFunction } from 'i18next';
import { TRACK_UNLOCKS } from '../../../data/drillUnlocks';
import { partLabel } from '../followText';

const t = (lng: string) => i18n.getFixedT(lng) as unknown as TFunction;
const rows = (...ids: string[]) => ids.flatMap((id) => TRACK_UNLOCKS[id]).filter((r) => r.family === 'roman');

describe('the part of Roman numerals the chords track opened', () => {
  it('after "One, four, five" (l1u35m2): I, IV, V in five keys', () => {
    expect(partLabel(rows('l1u35m2'), t('en'))).toBe('chords I, IV, V in the keys G, C, D, A, E');
  });
  it('after m2 and m3: each key with the chords it opened, minor chords in lower case', () => {
    expect(partLabel(rows('l1u35m2', 'l1u35m3'), t('en'))).toBe(
      'chords I, ii, iii, IV, V, vi in the keys G, C, D; chords I, IV, V in the keys A, E',
    );
    expect(partLabel(rows('l1u35m2', 'l1u35m3'), t('pt'))).toBe(
      'acordes I, ii, iii, IV, V, vi nas tonalidades G, C, D; acordes I, IV, V nas tonalidades A, E',
    );
    expect(partLabel(rows('l1u35m2', 'l1u35m3'), t('es'))).toBe(
      'acordes I, ii, iii, IV, V, vi en las tonalidades G, C, D; acordes I, IV, V en las tonalidades A, E',
    );
  });
  it('after m3 alone: the six chords in G, C, D', () => {
    expect(partLabel(rows('l1u35m3'), t('en'))).toBe('chords I, ii, iii, IV, V, vi in the keys G, C, D');
  });
});
