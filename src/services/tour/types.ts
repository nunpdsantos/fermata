/**
 * The self-playing tour ("Show me", wave 1, brief B) — the shape of a tour.
 *
 * A tour is a list of steps. A step is one short caption (an i18n key in the
 * `showMe` namespace, EN / PT / ES), an optional element to spotlight, an
 * optional action, and the way it knows it is finished: its `run` resolves
 * only once the action has really finished (playback's own completion, a
 * view's chunk loaded and its target on screen and settled) — never a fixed
 * sleep hoping things loaded. The engine then holds for a readable pause.
 */

/** What a step's action is given. */
export interface StepContext {
  /** Aborted when the viewer leaves the step (Back, Next, End) or the tour stops. */
  signal: AbortSignal;
  /** True when this step may make sound (the viewer's toggle, and the audio is running). */
  sound(): boolean;
  /** Prefers reduced motion: no moving cue (the engine does not auto-advance either). */
  reducedMotion: boolean;
  /**
   * Show the "tap" cue on the element `selector` names (scrolled into view
   * if needed) and resolve once the viewer has had a moment to see WHERE —
   * the caller then performs the tap's action while the cue is still up.
   * Resolves at once if the element is not there.
   */
  tap(selector: string): Promise<void>;
  /** The element, once present, laid out and still (not moving); null if it never came. */
  settled(selector: string): Promise<Element | null>;
  /** Like `settled`, then scrolled into view if it is not (its scroller only, `block: 'nearest'`) and settled again. */
  reveal(selector: string): Promise<Element | null>;
}

export interface TourStep {
  id: string;
  /** i18n key of the caption (one short sentence). */
  caption: () => string;
  /** CSS selector of the element to spotlight (null: none). Read when the step shows. */
  target?: () => string | null;
  /** False where this step's target does not exist in this layout: the step is skipped. */
  available?: () => boolean;
  /** The step's action; resolves when it has really finished. */
  run?: (ctx: StepContext) => Promise<void>;
  /** The last card ("Your turn."): no auto-advance, no Next. */
  final?: boolean;
}
