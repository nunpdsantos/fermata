import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { m } from 'framer-motion';
import { SPRING_SNAPPY } from '../../design/tokens/motion';
import { Confetti } from './Confetti';

interface LevelAchievementProps {
  levelNumber: number;
  accentColor: string;
  moduleCount: number;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 8000;

export function LevelAchievement({ levelNumber, accentColor, moduleCount, onDismiss }: LevelAchievementProps) {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    import('../../utils/celebrationSound')
      .then(({ playCelebrationSound }) => playCelebrationSound())
      .catch(() => {}); // offline without the chunk cached — celebration is optional
    const timer = setTimeout(onDismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <m.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onDismiss}
      />

      {/* Confetti */}
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      {/* Card */}
      <m.div
        className="relative z-10 rounded-2xl p-8 text-center max-w-sm mx-4"
        style={{ backgroundColor: 'var(--bg-raised)', border: '1px solid var(--border)' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING_SNAPPY}
      >
        {/* Trophy icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text)' }}>
          {t('celebration.levelComplete', { n: levelNumber })}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          {t('celebration.modulesCompleted', { count: moduleCount })}
        </p>

        <button
          onClick={onDismiss}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
            border: `1px solid ${accentColor}30`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${accentColor}30`; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${accentColor}20`; }}
        >
          {t('celebration.continue')}
        </button>
      </m.div>
    </div>
  );
}
