import type { ReactNode } from 'react';
import { m, useIsPresent } from 'framer-motion';
import { SPRING_NAV } from '../../design/tokens/motion';

interface ScreenFrameProps {
  children: ReactNode;
  /** Horizontal travel of the slide (sign = navigation direction). */
  xOffset: number;
  /** 'right' = enters from +x and exits to -x (deeper screens); 'left' = the reverse (the levels overview). */
  enterFrom: 'right' | 'left';
}

/**
 * One Learn screen inside LearnView's AnimatePresence. While it animates OUT
 * it takes no pointer input and is inert (audit W9-08 / F-10): a tap meant
 * for the incoming screen used to land on the outgoing one — e.g. the Level
 * page's Continue banner as it faded, opening the wrong screen. The slide
 * itself is unchanged.
 */
export function ScreenFrame({ children, xOffset, enterFrom }: ScreenFrameProps) {
  const isPresent = useIsPresent();
  const x = enterFrom === 'right' ? xOffset : -xOffset;
  return (
    <m.div
      data-learn-screen=""
      initial={{ opacity: 0, x }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -x }}
      transition={SPRING_NAV}
      style={isPresent ? undefined : { pointerEvents: 'none' }}
      inert={!isPresent}
    >
      {children}
    </m.div>
  );
}
