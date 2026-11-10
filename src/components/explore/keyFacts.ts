/**
 * What the circle of fifths says about the selected key (W11-B, D-30), and
 * the one-line summary under the pickers: signature, relative key, dominant
 * and subdominant keys. Every name is SPELLED from the selected root (F♯
 * major's dominant is C♯ major, A♯ minor's relative is C♯ major) — never
 * looked up by pitch.
 *
 * Major family (major, major pentatonic, major blues): relative minor, and
 * the major keys a 5th above / below. Minor family (natural / harmonic /
 * melodic minor, minor pentatonic, blues): relative major, and the MINOR
 * keys a 5th above / below. Any other scale with a standard signature (the
 * church modes, the exotic scales that borrow one) names its parent major;
 * a scale without one says so.
 */
import { type Note, type ScaleType } from '../../core/types/music.ts';
import { withGlyphs } from '../../core/utils/accidentalGlyphs.ts';
import { keySignatureForScale, formatKeySignature, spellIntervalAbove, type SignatureInfo } from '../../core/utils/degreeSpelling.ts';

type T = (key: string, opts?: Record<string, unknown>) => string;

const MAJOR_FAMILY: ReadonlySet<ScaleType> = new Set<ScaleType>(['major', 'pentatonic_major', 'major_blues']);
export const MINOR_FAMILY: ReadonlySet<ScaleType> = new Set<ScaleType>([
  'natural_minor', 'harmonic_minor', 'melodic_minor', 'pentatonic_minor', 'blues',
]);

export interface KeyFact {
  id: 'signature' | 'relative' | 'dominant' | 'subdominant' | 'parent';
  label: string;
  value: string;
}

export interface KeyFacts {
  signature: SignatureInfo | null;
  /** "3♯", "no ♯/♭", or "No standard key signature". */
  signatureText: string;
  /** "A minor" / "C major" (major and minor families only). */
  relative: string | null;
  facts: KeyFact[];
}

/** `name`: how a key's root is named ("B", or "B (Si)" with the fixed-do names on). */
export function keyFacts(root: Note, type: ScaleType, t: T, name: (n: Note) => string = withGlyphs): KeyFacts {
  const majorKey = (n: Note, t: T) => t('circle.keyMajor', { note: name(n) });
  const minorKey = (n: Note, t: T) => t('circle.keyMinor', { note: name(n) });
  const signature = keySignatureForScale(root, type);
  const signatureText = signature ? formatKeySignature(signature, t('circle.noAccidentals')) : t('circle.noStandardSignature');
  const facts: KeyFact[] = [{ id: 'signature', label: t('explore.facts.signature'), value: signatureText }];
  let relative: string | null = null;
  const fifthUp = spellIntervalAbove(root, 5, 7);
  const fourthUp = spellIntervalAbove(root, 4, 5);
  if (MAJOR_FAMILY.has(type)) {
    relative = minorKey(spellIntervalAbove(root, 6, 9), t);
    facts.push(
      { id: 'relative', label: t('explore.facts.relative'), value: relative },
      { id: 'dominant', label: t('explore.facts.dominant'), value: majorKey(fifthUp, t) },
      { id: 'subdominant', label: t('explore.facts.subdominant'), value: majorKey(fourthUp, t) },
    );
  } else if (MINOR_FAMILY.has(type)) {
    relative = majorKey(spellIntervalAbove(root, 3, 3), t);
    facts.push(
      { id: 'relative', label: t('explore.facts.relative'), value: relative },
      { id: 'dominant', label: t('explore.facts.dominant'), value: minorKey(fifthUp, t) },
      { id: 'subdominant', label: t('explore.facts.subdominant'), value: minorKey(fourthUp, t) },
    );
  } else if (signature) {
    facts.push({ id: 'parent', label: t('circle.parentKey'), value: majorKey(signature.parent, t) });
  }
  return { signature, signatureText, relative, facts };
}
