/**
 * Static drill-family → curriculum-module map for the Drill "Learn about this →"
 * deep link shown on wrong / near-miss feedback.
 *
 * One module per family, chosen as the most on-point lesson for that fact type
 * by reading moduleIndex.ts. Record<DrillFamily, string> keeps coverage
 * complete at compile time; a test asserts every id exists in MODULE_INDEX.
 *
 * This is the ONLY curriculum coupling the drill layer has, and it is read-only
 * (it never touches module progress) — consistent with the spec's no-curriculum-
 * coupling constraint for scheduling.
 */
import type { DrillFamily } from '../core/types/drill';

export const DRILL_FAMILY_TO_MODULE: Record<DrillFamily, string> = {
  // All 15 major key signatures + the circle live in the same L2 module.
  keysig: 'l2u4m1', // All Major Keys and the Circle of Fifths
  circle: 'l2u4m1', // All Major Keys and the Circle of Fifths
  // Drill scales cover major + the three minor forms; the minor-scale module
  // is the closest single lesson (major scale is L1u3m1, but minor is where
  // the spelling difficulty the drill targets actually lives).
  scale: 'l2u5m1', // Natural Minor Scale
  degree: 'l2u4m2', // Scale Degree Names and Functions
  interval: 'l1u3m3', // Intervals by Number
  triad: 'l2u7m3', // The Four Triad Types
  seventh: 'l3u9m1', // Seventh Chords: The Five Qualities
  roman: 'l2u7m5', // Diatonic Triads and Roman Numerals
  function: 'l3u11m1', // Cadences: The Complete Set
};
