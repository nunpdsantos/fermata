/**
 * Final review (2026-11-10): the lesson page's "Copy link" must copy a link
 * that opens THIS lesson. A link built from the unit's id (`?lesson=u7`) was
 * refused by every recipient's parser, while the sender saw "Link copied";
 * only the e2e clicked this menu. Here the copied address is read back by
 * the app's own parsers.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';

const copied = vi.hoisted(() => ({ urls: [] as string[] }));
vi.mock('../../../utils/exportHelpers.ts', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  copyToClipboard: async (text: string) => { copied.urls.push(text); return true; },
}));

import { ModuleView } from '../ModuleView';
import { readShareParams } from '../../../state/shareParams';
import { parseShareLink } from '../../../services/shareLinkParse';
import { MODULE_INDEX } from '../../../data/moduleIndex';
import type { CurriculumModule, CurriculumUnit, CurriculumLevel } from '../../../core/types/curriculum';

afterEach(cleanup);

describe('the lesson page\'s "Copy link"', () => {
  it('copies a link that opens this lesson', async () => {
    const entry = MODULE_INDEX.find((m) => m.id === 'l2u7m5')!;
    const module_ = { id: entry.id, unitId: entry.unitId, levelId: entry.level, title: entry.title, subtitle: '', objectives: [], concepts: [], tasks: [], prerequisites: [] } as unknown as CurriculumModule;
    const unit = { id: entry.unitId, levelId: entry.level, title: 'Unit', description: '', modules: [module_] } as unknown as CurriculumUnit;
    const level = { id: entry.level, number: 2, title: 'L', description: '', accentColor: '#8b5cf6', units: [unit] } as unknown as CurriculumLevel;
    expect(unit.id).not.toBe(module_.id); // a known positive: the two ids differ
    render(
      <ModuleView
        module={module_} unit={unit} level={level} unitIndex={0} moduleIndex={0}
        isModuleCompleted={false} isTaskCompleted={() => true} completedTaskCount={0}
        exercises={[]} exercisesState="ready" exercisesPassed={false} levelCompletedModuleCount={0}
        onToggleTask={() => {}} onCompleteModule={() => {}} onRecordExerciseResult={() => {}}
        onExercisesComplete={() => {}} onBack={() => {}} onBackToLevels={() => {}} onNavigateModule={() => {}}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Lesson actions' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Copy link' }));
    await waitFor(() => expect(copied.urls).toHaveLength(1));
    const url = new URL(copied.urls[0]);
    const target = parseShareLink(readShareParams(url.search, url.hash));
    expect(target.lesson).toEqual({ levelId: entry.level, unitId: entry.unitId, moduleId: 'l2u7m5' });
  });
});
