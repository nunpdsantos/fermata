import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ReadStaffPrompt } from '../../core/types/drill';
import { withGlyphs } from '../../core/utils/drillBank/shared';
import { StaffNotation } from '../notation/StaffNotation';
import { staffTrim } from '../explore/staffTrim';

export function ReadingStaff({ staff }: { staff: ReadStaffPrompt }) {
  const { t } = useTranslation();
  const notes = useMemo(() => [staff.written], [staff.written]);
  const trim = staffTrim([staff.sounding], 'guitar', 150);
  return (
    <div className="reading-staff" role="img" aria-label={t('drill.reading.staff', { note: `${withGlyphs(staff.written)}${staff.written.octave}` })}>
      <div aria-hidden="true" style={{ marginTop: -trim.top, marginBottom: -trim.bottom }}>
        <StaffNotation notes={notes} clef={staff.clef} annotation={staff.annotation} height={150} duration="w" />
      </div>
    </div>
  );
}
