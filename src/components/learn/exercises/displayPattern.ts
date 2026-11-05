/** Presentation only: keep scale step patterns together without changing
 * exercise text, answer values, grading or fingerprints. */
export function displayPattern(text: string): string {
  return text.replace(/\b[WHTS](?:-[WHTS]){2,}\b/g, (pattern) => pattern.replace(/-/g, '‑'));
}
