/**
 * The backup sentences (audit A15 / A16, fix pass 2026-11-19), word for word
 * in three languages. Each language used to be compared only with its own
 * `t()`, so a translation that said something else stayed green: on a review
 * copy the Portuguese "nothing changed" was turned into "your data was
 * replaced" and every test passed. Here every sentence is pinned verbatim,
 * and the two that matter most are checked for what they SAY: an import that
 * failed changed nothing; a partial export names the part and says the file
 * holds what could still be read.
 */
import { describe, expect, it } from 'vitest';
import en from '../backupFile/en.json';
import pt from '../backupFile/pt.json';
import es from '../backupFile/es.json';

const EN = {
  importFailed: 'The backup was not imported: this browser would not save it (its storage may be full). Nothing has changed.',
  importFailedPartly_one: 'The backup was not imported in full: this browser would not save it (its storage may be full). This part now comes from the backup: {{sections}}. Everything else is as it was.',
  importFailedPartly_other: 'The backup was not imported in full: this browser would not save it (its storage may be full). These parts now come from the backup: {{sections}}. Everything else is as it was.',
  exportedWithout_one: 'Backup downloaded, but without this part, which is damaged in this browser and could not be read: {{sections}}.',
  exportedWithout_other: 'Backup downloaded, but without these parts, which are damaged in this browser and could not be read: {{sections}}.',
  exportedPartly_one: 'Backup downloaded. This part was partly damaged in this browser, and the file holds what could still be read: {{sections}}.',
  exportedPartly_other: 'Backup downloaded. These parts were partly damaged in this browser, and the file holds what could still be read: {{sections}}.',
  exportedNewer_one: 'Backup downloaded, but without this part, which a newer version of Fermatina saved and this page cannot read: {{sections}}.',
  exportedNewer_other: 'Backup downloaded, but without these parts, which a newer version of Fermatina saved and this page cannot read: {{sections}}.',
  exportFailed: 'The backup file could not be made. Your data in this browser is unchanged.',
};
const PT = {
  importFailed: 'O backup não foi importado: este navegador não o deixou guardar (o espaço pode estar cheio). Nada foi alterado.',
  importFailedPartly_one: 'O backup não foi importado por inteiro: este navegador não o deixou guardar (o espaço pode estar cheio). Esta parte vem agora do backup: {{sections}}. Tudo o resto está como estava.',
  importFailedPartly_other: 'O backup não foi importado por inteiro: este navegador não o deixou guardar (o espaço pode estar cheio). Estas partes vêm agora do backup: {{sections}}. Tudo o resto está como estava.',
  exportedWithout_one: 'Backup transferido, mas sem esta parte, que está danificada neste navegador e não pôde ser lida: {{sections}}.',
  exportedWithout_other: 'Backup transferido, mas sem estas partes, que estão danificadas neste navegador e não puderam ser lidas: {{sections}}.',
  exportedPartly_one: 'Backup transferido. Esta parte estava parcialmente danificada neste navegador; o ficheiro guarda o que ainda foi possível ler: {{sections}}.',
  exportedPartly_other: 'Backup transferido. Estas partes estavam parcialmente danificadas neste navegador; o ficheiro guarda o que ainda foi possível ler: {{sections}}.',
  exportedNewer_one: 'Backup transferido, mas sem esta parte, que uma versão mais recente da Fermatina guardou e esta página não consegue ler: {{sections}}.',
  exportedNewer_other: 'Backup transferido, mas sem estas partes, que uma versão mais recente da Fermatina guardou e esta página não consegue ler: {{sections}}.',
  exportFailed: 'Não foi possível criar o ficheiro de backup. Os teus dados neste navegador não foram alterados.',
};
const ES = {
  importFailed: 'El backup no se ha importado: este navegador no ha permitido guardarlo (puede que el espacio esté lleno). No ha cambiado nada.',
  importFailedPartly_one: 'El backup no se ha importado entero: este navegador no ha permitido guardarlo (puede que el espacio esté lleno). Esta parte viene ahora del backup: {{sections}}. Todo lo demás está como estaba.',
  importFailedPartly_other: 'El backup no se ha importado entero: este navegador no ha permitido guardarlo (puede que el espacio esté lleno). Estas partes vienen ahora del backup: {{sections}}. Todo lo demás está como estaba.',
  exportedWithout_one: 'Backup descargado, pero sin esta parte, que está dañada en este navegador y no se ha podido leer: {{sections}}.',
  exportedWithout_other: 'Backup descargado, pero sin estas partes, que están dañadas en este navegador y no se han podido leer: {{sections}}.',
  exportedPartly_one: 'Backup descargado. Esta parte estaba parcialmente dañada en este navegador; el archivo guarda lo que aún se ha podido leer: {{sections}}.',
  exportedPartly_other: 'Backup descargado. Estas partes estaban parcialmente dañadas en este navegador; el archivo guarda lo que aún se ha podido leer: {{sections}}.',
  exportedNewer_one: 'Backup descargado, pero sin esta parte, que guardó una versión más reciente de Fermatina y esta página no puede leer: {{sections}}.',
  exportedNewer_other: 'Backup descargado, pero sin estas partes, que guardó una versión más reciente de Fermatina y esta página no puede leer: {{sections}}.',
  exportFailed: 'No se ha podido crear el archivo de backup. Tus datos en este navegador no han cambiado.',
};

describe('the backup sentences, word for word', () => {
  it.each([['en', en, EN], ['pt', pt, PT], ['es', es, ES]] as const)('%s', (_lang, file, pinned) => {
    expect(file).toEqual(pinned);
  });
});

/** What each language must say, in its own words (the phrases the language review approved). */
const SAYS = {
  nothingChanged: { en: 'Nothing has changed.', pt: 'Nada foi alterado.', es: 'No ha cambiado nada.' },
  notImported: { en: 'was not imported', pt: 'não foi importado', es: 'no se ha importado' },
  partlyRead: { en: 'the file holds what could still be read', pt: 'o ficheiro guarda o que ainda foi possível ler', es: 'el archivo guarda lo que aún se ha podido leer' },
  part: { en: /\bparts?\b/, pt: /\bpartes?\b/, es: /\bpartes?\b/ },
} as const;
/** Words that would turn "nothing changed" into its opposite. */
const REPLACED = /replac|overwr|lost|substitu|apag|perd|reemplaz|sustitu|borr/i;

describe('what the two that matter most say', () => {
  for (const [lang, file] of [['en', en], ['pt', pt], ['es', es]] as const) {
    it(`${lang}: an import that failed says it was not imported and that nothing changed — never that anything was replaced or lost`, () => {
      expect(file.importFailed).toContain(SAYS.notImported[lang]);
      expect(file.importFailed.endsWith(SAYS.nothingChanged[lang])).toBe(true);
      expect(file.importFailed).not.toMatch(REPLACED);
    });
    it(`${lang}: a partial export names the part and says the file holds what could still be read`, () => {
      for (const key of ['exportedPartly_one', 'exportedPartly_other'] as const) {
        expect(file[key]).toContain('{{sections}}');
        expect(file[key]).toContain(SAYS.partlyRead[lang]);
        expect(file[key]).toMatch(SAYS.part[lang]);
        expect(file[key]).not.toMatch(REPLACED);
      }
    });
  }
  it('the sabotage the review planted would fail here (known positive)', () => {
    const sabotaged = 'O backup não foi importado: este navegador não o deixou guardar. Os dados que tinhas foram substituídos.';
    expect(sabotaged.endsWith(SAYS.nothingChanged.pt) && !REPLACED.test(sabotaged)).toBe(false);
  });
});
