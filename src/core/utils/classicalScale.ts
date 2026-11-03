import { buildScale } from '../constants/scales';
import type { Note, ScaleType } from '../types/music';

/** Classical scale practice: melodic minor returns through natural minor.
 * The melodic_minor formula itself stays unchanged for jazz chord-scale use. */
export function classicalDescendingType(type: ScaleType): ScaleType {
  return type === 'melodic_minor' ? 'natural_minor' : type;
}

/** Tonic-first note pool; the display/player reverses its pitched ascent. */
export function classicalDescendingNotes(root: Note, type: ScaleType): Note[] {
  return buildScale(root, classicalDescendingType(type)).notes;
}
