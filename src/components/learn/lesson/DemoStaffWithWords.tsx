/**
 * A demonstration's staff with its text alternative, as one lazy chunk (the
 * drawing, its plan and the `lessonDemo` words load together, when a lesson
 * with a demonstration is opened): `InlineTryThis` imports it with `lazy()`.
 */
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { Demonstration } from '../../../core/types/demonstration';
import { DemoStaff } from './DemoStaff';
import { describeDemonstration } from './demoDescription';

export default function DemoStaffWithWords({ demo }: { demo: Demonstration }) {
  const { t, i18n } = useTranslation();
  const description = useMemo(() => describeDemonstration(demo, t), [demo, t, i18n.language]);
  return <DemoStaff demo={demo} description={description} />;
}
