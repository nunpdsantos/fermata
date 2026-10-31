import { m } from 'framer-motion';
import { accentStrong } from '../../design/tokens/learnColors';

interface ProgressBarProps {
  percent: number;
  color: string;
  height?: number;
  delay?: number;
}

export function ProgressBar({ percent, color, height = 6, delay = 0 }: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, backgroundColor: 'var(--card-hover)' }}
    >
      <m.div
        className="h-full rounded-full"
        style={{ backgroundColor: accentStrong(color) }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        transition={{ duration: 0.6, ease: 'easeOut', delay }}
      />
    </div>
  );
}
