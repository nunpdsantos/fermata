import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type InstrumentType } from '../../state/store.ts';
import { SUPPORTED_LANGUAGES } from '../../i18n/index.ts';
import { requestDemo, useDemoFailed } from '../../state/demoRequest.ts';
import { resumeAudio } from '../../core/services/audio.ts';
import { chooseStartDoor } from '../../state/startDoors.ts';
import type { LearnerProfile } from '../../state/learnerProfile.ts';
import { Button } from '../ui/Button.tsx';
import { Card } from '../ui/Card.tsx';
import { Segment } from '../ui/Segment.tsx';

const DOORS: LearnerProfile[] = ['new', 'player', 'theory'];
const INSTRUMENTS: InstrumentType[] = ['piano', 'guitar'];

// The tour was asked for from this screen in this page: when the screen
// comes back after it, focus returns to the tour button.
let askedForTour = false;

const PLAY_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
    <path d="M7 4.5v15l12.5-7.5z" />
  </svg>
);

/**
 * The start screen (wave 1; a lazy chunk, StartHost mounts it IN PLACE of the
 * app): what Fermata is for, the tour, the instrument, three doors — the only
 * ways out (state/startDoors.ts) — the language and what it costs. A page,
 * not a modal: h1 Fermata, h2 the doors' question; focus starts on the h1
 * (on the tour button when the visitor comes back from the tour).
 *
 * "I'll use" stands BEFORE the doors (the brief listed it after them): a door
 * applies the instrument and leaves at once, so the choice must come first.
 */
export default function StartScreen() {
  const { t } = useTranslation();
  const instrument = useAppStore((s) => s.instrument);
  const setInstrument = useAppStore((s) => s.setInstrument);
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const tourRef = useRef<HTMLButtonElement>(null);
  const tourFailed = useDemoFailed();
  // The tour plays sound: resume the audio inside this tap (iOS allows it
  // only there; the tour's own resume runs after its chunk has loaded), then
  // ask for it — as the menu's "Show me around" does (TopBar).
  const watchTour = () => {
    askedForTour = true;
    void resumeAudio().catch(() => undefined);
    requestDemo('intro');
  };

  useEffect(() => {
    (askedForTour ? tourRef.current : headingRef.current)?.focus({ preventScroll: true });
  }, []);

  // A door opens Explore: fetch its code once this page has painted, so the
  // first sound is one tap away (it never delays this screen).
  useEffect(() => {
    const prefetch = () => void import('../../views/ExploreView.tsx').catch(() => {});
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(prefetch, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(prefetch, 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <main id="main-content" className="start-page" data-testid="start-screen">
      <div className="start-column">
        <header className="start-head">
          {/* Focused by script at load (the page's heading, not a control): no ring. */}
          <h1 ref={headingRef} tabIndex={-1} className="start-title" style={{ outline: 'none' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" className="shrink-0" aria-hidden="true">
              <path d="M4 14 A 8 8 0 0 1 20 14" />
              <circle cx="12" cy="16" r="1.8" fill="var(--accent)" />
            </svg>
            <span>{t('nav.musicTheory')}</span>
          </h1>
          <p className="start-lead">{t('start.tagline')}</p>
          <Button ref={tourRef} variant="primary" className="start-tour" startIcon={PLAY_ICON} onClick={watchTour} data-testid="start-tour">
            {t('start.tour')}
          </Button>
          {/* The tour could not open (TourHost): said here, as this page has no toast region. */}
          {tourFailed && <p className="start-tour-failed" role="status" data-testid="start-tour-failed">{t('showMe.loadFailed')}</p>}
        </header>

        <div className="start-row">
          <span className="start-row-label" id="start-instrument-label">{t('start.instrumentLabel')}</span>
          <Segment
            label={t('start.instrumentLabel')}
            value={instrument}
            onChange={setInstrument}
            options={INSTRUMENTS.map((i) => ({ value: i, label: t(`instrument.${i}`) }))}
          />
        </div>

        <section className="start-doors" aria-labelledby="start-doors-heading">
          <h2 id="start-doors-heading" className="start-doors-heading">{t('start.doorsHeading')}</h2>
          <ul className="start-door-list">
            {DOORS.map((profile) => (
              <li key={profile}>
                <Card
                  variant="interactive"
                  padding="none"
                  tappable
                  className={`start-door start-door-${profile}`}
                  data-testid={`start-door-${profile}`}
                  onClick={() => chooseStartDoor(profile, useAppStore.getState().instrument)}
                >
                  <span className="start-door-title">{t(`start.door.${profile}.title`)}</span>
                  <span className="start-door-line">{t(`start.door.${profile}.line`)}</span>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <div className="start-row">
          <span className="start-row-label">{t('settings.language')}</span>
          <Segment
            label={t('settings.language')}
            value={language}
            onChange={setLanguage}
            className="start-languages"
            options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.code as string, label: <span lang={l.code}>{l.label}</span> }))}
          />
        </div>

        <footer className="start-footer">
          <p>{t('start.footer')}</p>
        </footer>
      </div>
    </main>
  );
}
