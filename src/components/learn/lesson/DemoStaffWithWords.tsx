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
  // `t` is bound to the language, so a language change describes it again.
  const { t } = useTranslation();
  const description = useMemo(() => describeDemonstration(demo, t), [demo, t]);
  return <DemoStaff demo={demo} description={description} />;
}
