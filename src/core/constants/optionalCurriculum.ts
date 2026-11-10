/** Optional units are visible and searchable, but never gate the main course.
 * Keep this eager registry free of lesson content (the overview is lazy).
 *
 * Two kinds (both `CurriculumUnit.optional`):
 *  - 'u33' — Level 1's guitar notation (W10-08), listed on the Level 1 page;
 *  - the starting TRACKS (wave 2, `src/data/tracks.ts`): a unit that also
 *    carries `track` — not listed on its level's page, with its own card on
 *    Learn's overview and its own page. 'u34' = "Start with sound".
 *    'u35' ("From the chords you know") is added HERE, after 'u34', in the
 *    same change that adds its unit to curriculumL1.ts
 *    (`guitarNotationProgress.test.ts` keeps this list equal to the data).
 */
export const OPTIONAL_UNIT_IDS: ReadonlySet<string> = new Set(['u33', 'u34']);

export function isOptionalModuleId(id: string): boolean {
  const unitId = id.match(/^l\d+(u\d+)m\d+$/)?.[1];
  return unitId !== undefined && OPTIONAL_UNIT_IDS.has(unitId);
}
