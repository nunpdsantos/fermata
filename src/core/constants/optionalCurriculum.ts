/** Optional units are visible and searchable, but never gate the main course.
 * Keep this eager registry free of lesson content (the overview is lazy). */
export const OPTIONAL_UNIT_IDS: ReadonlySet<string> = new Set(['u33']);

export function isOptionalModuleId(id: string): boolean {
  const unitId = id.match(/^l\d+(u\d+)m\d+$/)?.[1];
  return unitId !== undefined && OPTIONAL_UNIT_IDS.has(unitId);
}
