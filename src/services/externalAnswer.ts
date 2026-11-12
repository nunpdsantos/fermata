/**
 * Where a note played on a real instrument goes in a check answered on the
 * instrument (wave 3, stream K). The instrument-answer input
 * (`learn/exercises/inputs/InstrumentInput.tsx`) registers its "add this
 * note" while the learner can still answer; the one listener
 * (`services/externalNotesListener.ts`) calls it for every note that starts.
 * A played note only ever ADDS (contract: `services/externalNotes.ts`).
 */
type AddNote = (midi: number) => void;

let target: AddNote | null = null;
const watchers = new Set<() => void>();

/** Register the answer's adder; returns the function that removes it. */
export function setExternalAnswerTarget(add: AddNote): () => void {
  target = add;
  for (const w of [...watchers]) w();
  return () => {
    if (target !== add) return;
    target = null;
    for (const w of [...watchers]) w();
  };
}

/** The answer a played note adds to now, if any. */
export function externalAnswerTarget(): AddNote | null {
  return target;
}

/** Told when the answer starts or stops taking notes. */
export function watchExternalAnswer(watch: () => void): () => void {
  watchers.add(watch);
  return () => {
    watchers.delete(watch);
  };
}
