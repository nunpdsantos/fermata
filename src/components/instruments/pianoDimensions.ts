// Shared by key rendering, black-key positioning and octave scrolling.
export type SizeMode = 'mobile' | 'tablet' | 'desktop';

export const PIANO_DIMS: Record<SizeMode, { white: [number, number]; black: [number, number]; labelSize: string }> = {
  // Key labels never go below the 12 px floor (D-28; were 10 / 9 / 8 px).
  desktop: { white: [44, 210], black: [28, 130], labelSize: '12px' },
  tablet:  { white: [36, 160], black: [22, 100], labelSize: '12px' },
  mobile:  { white: [36, 130], black: [22, 80],  labelSize: '12px' },
};

