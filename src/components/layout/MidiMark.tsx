import { useTranslation } from 'react-i18next';
import { useMidiStatus } from '../../services/midi/midiStatus.ts';

/**
 * The dock bar's small mark while a MIDI keyboard is connected (wave 3,
 * stream K). Nothing at all is rendered while MIDI is off or no device is
 * there, so the bar is exactly as before.
 */
export function MidiMark() {
  const { t } = useTranslation();
  const connected = useMidiStatus((s) => s.state === 'on' && s.devices.length > 0);
  if (!connected) return null;
  const label = t('midiInputEntry.mark');
  return (
    <span role="img" aria-label={label} title={label} className="midi-mark" data-testid="midi-mark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
        <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
        <path d="M8 19v-5M12 19v-5M16 19v-5" />
        <path d="M6.5 5v7h3V5M14.5 5v7h3V5" fill="currentColor" />
      </svg>
    </span>
  );
}
