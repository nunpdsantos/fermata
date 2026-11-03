import { lazy, Suspense, useState } from 'react';
import type { FretboardInputSpec, FretPlace } from '../../core/types/drill';

const Fretboard = lazy(() => import('../instruments/Fretboard').then((m) => ({ default: m.Fretboard })));

export function ReadingInput({ spec, disabled, accepted, onAnswer }: {
  spec: FretboardInputSpec;
  disabled: boolean;
  accepted: FretPlace[];
  onAnswer: (place: FretPlace) => void;
}) {
  const [picked, setPicked] = useState<FretPlace | null>(null);
  return (
    <Suspense fallback={<div className="reading-board" style={{ height: 310 }} aria-busy="true" />}>
      <Fretboard exercise={{ spec, disabled, accepted: disabled ? accepted : undefined, picked,
        onAnswer: (place) => { setPicked(place); onAnswer(place); } }} />
    </Suspense>
  );
}
