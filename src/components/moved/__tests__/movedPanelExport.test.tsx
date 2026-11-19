/**
 * The moving panel's export (fix pass, 2026-11-19): the same checked export
 * as Settings, its sentences in the panel (an open sheet covers the toasts),
 * and the export noted — the reminder stops for the visit — only when the
 * file is whole.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const { noteMovedExport } = vi.hoisted(() => ({ noteMovedExport: vi.fn() }));
vi.mock('../../../services/movedNotice', async (original) => ({ ...(await original<object>()), noteMovedExport }));

import i18n from '../../../i18n';
import MovedPanel from '../MovedPanel';
import movedEn from '../../../i18n/moved/en.json';
import { useToastStore } from '../../../state/toastStore';

let files: Blob[] = [];
beforeEach(async () => {
  localStorage.clear();
  localStorage.setItem('music-theory-app', JSON.stringify({ state: { language: 'en' }, version: 6 }));
  files = [];
  noteMovedExport.mockClear();
  useToastStore.setState({ toasts: [] });
  (URL as unknown as { createObjectURL: (b: Blob) => string }).createObjectURL = vi.fn((b: Blob) => { files.push(b); return 'blob:x'; });
  (URL as unknown as { revokeObjectURL: () => void }).revokeObjectURL = vi.fn();
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  await i18n.changeLanguage('en');
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
  localStorage.setItem('music-theory-app', JSON.stringify({ state: {}, version: 6 }));
});

const exportNow = () => fireEvent.click(screen.getByRole('button', { name: movedEn.export }));

describe('the moving panel\'s export', () => {
  it('a whole file: "Backup downloaded" in the panel (the toast is under the sheet), and the export counts for the visit', async () => {
    render(<MovedPanel open onClose={() => {}} />);
    exportNow();
    await waitFor(() => expect(noteMovedExport).toHaveBeenCalledTimes(1));
    expect(files).toHaveLength(1);
    const notes = await screen.findAllByTestId('moved-note');
    expect(notes.map((n) => [n.textContent, n.getAttribute('role'), n.getAttribute('data-tone')])).toEqual([[i18n.t('backup.exported'), 'alert', 'success']]);
  });

  it('a damaged part: the sentence in the panel (it names the part), and the export does not count — the reminder stays', async () => {
    localStorage.setItem('music-theory-progress', 'garbage');
    render(<MovedPanel open onClose={() => {}} />);
    exportNow();
    const note = await screen.findByTestId('moved-note');
    expect(note.textContent).toBe(i18n.t('backupFile.exportedWithout', { count: 1, sections: i18n.t('backup.section.learnProgress') }));
    expect(note.getAttribute('role')).toBe('alert');
    expect(noteMovedExport).not.toHaveBeenCalled();
  });

  it('no file could be made: one sentence says so, in the panel and as a toast; the export does not count', async () => {
    (URL as unknown as { createObjectURL: () => string }).createObjectURL = vi.fn(() => { throw new Error('blocked'); });
    render(<MovedPanel open onClose={() => {}} />);
    exportNow();
    const note = await screen.findByTestId('moved-note');
    expect(note.textContent).toBe(i18n.t('backupFile.exportFailed'));
    expect(useToastStore.getState().toasts.map((t) => [t.type, t.message])).toEqual([['error', i18n.t('backupFile.exportFailed')]]);
    expect(noteMovedExport).not.toHaveBeenCalled();
  });
});
