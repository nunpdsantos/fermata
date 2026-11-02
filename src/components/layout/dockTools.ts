import { createContext } from 'react';

/**
 * Where the docked fretboard puts its position stepper and label toggle on a
 * wide screen (W11-B: the dock bar carries them, as in the workbench mockup,
 * so the guitar dock is one row shorter). Null = render them in place.
 */
export const DockToolsContext = createContext<HTMLElement | null>(null);

/** Wide enough for the bar to carry the fretboard's stepper and label toggle. */
export const DOCK_TOOLS_QUERY = '(min-width: 1200px)';
