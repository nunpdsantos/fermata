/**
 * Audit 2026-11-18, A9: a graded question that points at notation must give
 * a screen reader the visual evidence. The check's staff (ExercisePrompt) is
 * a picture with a text alternative: `role="img"`, named by the description
 * of what is drawn (components/notation/staffDescription.ts) — the clef and
 * the key signature's sharps or flats by their lines and spaces, a note by
 * its numbered line or space — never the answer. In EN, PT and ES, in the
 * question's own language, before VexFlow has drawn anything.
 *
 * The real served items are used: the key-signature question of Level 1
 * (D major), the note on the second line (G), the interval from G to B.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import type { ExerciseDefinition } from '../../../../core/types/exercise';
import { levelCorpus } from '../../../../data/exercises/__tests__/learnCorpus';
import { useAppStore } from '../../../../state/store';
import i18n from '../../../../i18n';

vi.mock('../../../notation/StaffNotation', () => ({ StaffNotation: () => <div data-testid="vexflow" /> }));

import { ExercisePrompt } from '../ExercisePrompt';

afterEach(async () => {
  cleanup();
  useAppStore.setState({ language: 'en' });
  await i18n.changeLanguage('en');
});

const item = (id: string, lang: 'en' | 'pt' | 'es'): ExerciseDefinition => {
  const level = Number(id[1]);
  const hit = levelCorpus(level, lang).find((c) => c.exercise.id === id);
  if (!hit) throw new Error(`no served item ${id} in ${lang}`);
  return hit.exercise;
};

const WANT = {
  en: {
    l1u3m2g4: 'Treble clef, 2 sharps in the key signature: on the F line and in the C space.',
    l1u1m1e3: 'Treble clef. One note, on line 2. Lines and spaces are counted from the bottom.',
    l1u3m3g1: 'Treble clef. 2 notes, one after the other: on line 2, then on line 3. Lines and spaces are counted from the bottom.',
  },
  pt: {
    l1u3m2g4: 'Clave de sol, 2 sustenidos na armação de clave: na linha do F e no espaço do C.',
    l1u1m1e3: 'Clave de sol. Uma nota, na linha 2. As linhas e os espaços contam-se de baixo para cima.',
    l1u3m3g1: 'Clave de sol. 2 notas, uma depois da outra: na linha 2, depois na linha 3. As linhas e os espaços contam-se de baixo para cima.',
  },
  es: {
    l1u3m2g4: 'Clave de sol, 2 sostenidos en la armadura de clave: en la línea del F y en el espacio del C.',
    l1u1m1e3: 'Clave de sol. Una nota, en la línea 2. Las líneas y los espacios se cuentan de abajo arriba.',
    l1u3m3g1: 'Clave de sol. 2 notas, una después de otra: en la línea 2, después en la línea 3. Las líneas y los espacios se cuentan de abajo arriba.',
  },
} as const;

describe('the check\'s staff has a text alternative (A9)', () => {
  for (const lang of ['en', 'pt', 'es'] as const) {
    for (const [id, words] of Object.entries(WANT[lang])) {
      it(`${lang} ${id}: the staff is an image named by what it draws`, async () => {
        useAppStore.setState({ language: lang });
        await i18n.changeLanguage(lang);
        render(<ExercisePrompt exercise={item(id, lang)} />);
        const staff = screen.getByTestId('check-staff');
        const img = staff.querySelector('[role="img"]');
        expect(img, 'the staff is exposed as one image').not.toBeNull();
        expect(img!.getAttribute('aria-label')).toBe(words);
        // The drawing (lazy) comes inside it: the picture, not separate content.
        const drawing = await screen.findByTestId('vexflow');
        expect(img!.contains(drawing)).toBe(true);
        expect(drawing.closest('[aria-hidden="true"]'), 'the drawing itself is hidden from a screen reader').not.toBeNull();
        expect(img!.getAttribute('aria-label')).toBe(words);
      });
    }
  }
});
