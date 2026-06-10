import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrillRunner } from '../components/drill/useDrillRunner';
import { QuestionCard } from '../components/drill/QuestionCard';
import { ChoiceChips } from '../components/drill/ChoiceChips';
import { NoteChips } from '../components/drill/NoteChips';
import { AccidentalSlots } from '../components/drill/AccidentalSlots';
import { RootQualityChips } from '../components/drill/RootQualityChips';
import { FeedbackStrip } from '../components/drill/FeedbackStrip';
import { useDrillStore } from '../state/drillStore';
import type { DrillItem } from '../core/types/drill';
import type { AnswerPayload } from '../components/drill/grading';

const SESSION_LENGTHS = [12, 24, 40] as const;

export function DrillView() {
  const { t } = useTranslation();
  const runner = useDrillRunner();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { item, phase, result, asked, total, correctCount, sessionComplete } = runner;

  return (
    <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
      <div className="mx-auto w-full max-w-xl px-4 py-6 max-sm:py-5">
        {sessionComplete ? (
          <SessionSummary
            correct={correctCount}
            asked={asked}
            onNewSession={runner.startNewSession}
          />
        ) : item ? (
          <>
            <QuestionCard
              asked={asked}
              total={total}
              prompt={t(item.promptKey, item.promptParams)}
              onEndSession={runner.endSession}
              onOpenSettings={() => setSettingsOpen((v) => !v)}
            >
              {/* Key by item id so each question gets a fresh input instance —
                  resets selection/commit-guard state without a transition effect. */}
              <DrillInput key={item.id} item={item} phase={phase} onAnswer={runner.answer} />
            </QuestionCard>

            {phase === 'feedback' && result && (
              <FeedbackStrip
                result={result}
                answerText={canonicalAnswer(item)}
                whyText={t(item.whyKey, item.whyParams)}
                onContinue={runner.advance}
                showContinue={!result.correct}
              />
            )}

            {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
          </>
        ) : (
          // Pre-auto-start tick: session not yet created. Brief, no flash of summary.
          <div className="h-24" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

// ─── Input router ─────────────────────────────────────────────────────────────

interface DrillInputProps {
  item: DrillItem;
  phase: 'answering' | 'feedback';
  onAnswer: (payload: AnswerPayload) => void;
}

/**
 * Routes each item to its tap-only answer component by input.format and wires
 * the per-format feedback highlight from the canonical answer. The input is
 * disabled during the feedback phase; the answer payload carries display
 * strings (grading normalizes display → ASCII).
 */
function DrillInput({ item, phase, onAnswer }: DrillInputProps) {
  const disabled = phase === 'feedback';

  switch (item.input.format) {
    case 'choice': {
      const correct = item.answer.kind === 'choice' ? item.answer.correct : null;
      return (
        <ChoiceChips
          choices={item.input.choices}
          disabled={disabled}
          selected={null}
          correctChoice={disabled ? correct : null}
          onSelect={(choice) => onAnswer({ format: 'choice', choice })}
        />
      );
    }
    case 'noteChips': {
      const correctNotes = item.answer.kind === 'notes' ? item.answer.notes : [];
      return (
        <NoteChips
          chips={item.input.chips}
          expectedCount={item.input.expectedCount}
          disabled={disabled}
          onAnswer={(notes) => onAnswer({ format: 'noteChips', notes })}
          feedback={disabled ? { correctNotes } : undefined}
        />
      );
    }
    case 'accidentalSlots': {
      const correctSpelled = item.answer.kind === 'accidentals' ? item.answer.spelled : [];
      return (
        <AccidentalSlots
          letters={item.input.letters}
          disabled={disabled}
          onAnswer={(spelled) => onAnswer({ format: 'accidentalSlots', spelled })}
          feedback={disabled ? { correctSpelled } : undefined}
        />
      );
    }
    case 'rootQuality': {
      const rq = item.answer.kind === 'rootQuality' ? item.answer : null;
      return (
        <RootQualityChips
          roots={item.input.roots}
          qualities={item.input.qualities}
          disabled={disabled}
          onAnswer={({ root, quality }) => onAnswer({ format: 'rootQuality', root, quality })}
          feedback={disabled && rq ? { correctRoot: rq.root, correctQuality: rq.quality } : undefined}
        />
      );
    }
  }
}

// ─── Session summary (minimal — full screen is Task 11) ───────────────────────

interface SessionSummaryProps {
  correct: number;
  asked: number;
  onNewSession: () => void;
}

function SessionSummary({ correct, asked, onNewSession }: SessionSummaryProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center text-center gap-5 py-10">
      <p className="text-2xl font-medium tabular-nums" style={{ color: 'var(--text)' }}>
        {t('drill.summary.score', { correct, asked })}
      </p>
      <button
        type="button"
        onClick={onNewSession}
        className="min-h-[44px] px-6 rounded-lg text-sm font-medium transition-colors"
        style={{ backgroundColor: 'var(--accent)', color: 'var(--bg)' }}
      >
        {t('drill.summary.newSession')}
      </button>
    </div>
  );
}

// ─── Settings panel (minimal — full UI is Task 11) ────────────────────────────

function SettingsPanel({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const length = useDrillStore((s) => s.settings.length);
  const updateSettings = useDrillStore((s) => s.updateSettings);

  return (
    <div
      role="group"
      aria-label={t('drill.settings.title')}
      className="rounded-xl p-4 mt-4"
      style={{
        backgroundColor: 'var(--bg-raised)',
        border: '1px solid var(--border)',
      }}
    >
      <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-dim)' }}>
        {t('drill.settings.length')}
      </p>
      <div
        className="grid grid-cols-3 gap-1 rounded-lg p-0.5"
        style={{ backgroundColor: 'color-mix(in srgb, var(--card-hover) 60%, transparent)' }}
      >
        {SESSION_LENGTHS.map((len) => {
          const active = len === length;
          return (
            <button
              key={len}
              type="button"
              onClick={() => {
                updateSettings({ length: len });
                onClose();
              }}
              className="min-h-[40px] rounded-md text-sm font-medium tabular-nums transition-colors"
              style={{
                backgroundColor: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: active ? 600 : 500,
              }}
              aria-pressed={active}
            >
              {len}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function canonicalAnswer(item: DrillItem): string {
  switch (item.answer.kind) {
    case 'choice':
      return item.answer.correct;
    case 'notes':
      return item.answer.notes.join(' ');
    case 'accidentals':
      return item.answer.spelled.join(' ');
    case 'rootQuality':
      return `${item.answer.root} ${item.answer.quality}`;
  }
}
