/**
 * Record that the Portuguese/Spanish translations were checked against the
 * current English (src/i18n/content/sourceHashes.json).
 *
 * sourceHashes.test.ts fails when an English curriculum / exercise /
 * template / song / level string changes after its translation was last
 * checked. Workflow after an English edit:
 *   1. update the PT and ES overlay text to match the new English;
 *   2. npm run i18n:rehash -- <pt|es|all> <key-prefix> [key-prefix ...]
 *      e.g.  npm run i18n:rehash -- all cur:l4u14m1
 *            npm run i18n:rehash -- pt ex:l3u11m1e2
 * Every key whose record changes is printed. Re-recording a whole language
 * without a key prefix would silently bless untranslated English edits, so it
 * needs --force-all (only for the initial snapshot or a reviewed bulk pass).
 *
 * Run: npx tsx scripts/i18n/rehash-sources.ts <pt|es|all> <prefix ...> | --force-all
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  overlayEntries,
  sourceHash,
  storedHash,
  LANGS,
  type Lang,
  type StoredHashes,
} from '../../src/i18n/content/__tests__/overlayEntries';

const FILE = fileURLToPath(new URL('../../src/i18n/content/sourceHashes.json', import.meta.url));

const args = process.argv.slice(2);
const forceAll = args.includes('--force-all');
const [scope = '', ...prefixes] = args.filter((a) => a !== '--force-all');
if (scope !== 'all' && scope !== 'pt' && scope !== 'es') {
  console.error('usage: rehash-sources.ts <pt|es|all> <key-prefix ...>   (or --force-all instead of prefixes)');
  process.exit(2);
}
if (prefixes.length === 0 && !forceAll) {
  console.error(
    'Refusing to re-record every entry without key prefixes: that would mark untranslated English edits as checked.\n' +
      'Name the keys you re-translated (e.g. cur:l4u14m1 ex:l3u11m1e2), or pass --force-all for a reviewed bulk pass.',
  );
  process.exit(2);
}
const langs: readonly Lang[] = scope === 'all' ? LANGS : [scope];

const stored: StoredHashes = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
const entries = overlayEntries();
const next: StoredHashes = {};
const changed: string[] = [];

for (const e of entries) {
  const current = sourceHash(e.en);
  const per: Partial<Record<Lang, string>> = {};
  for (const lang of LANGS) {
    const selected = langs.includes(lang) && (prefixes.length === 0 || prefixes.some((p) => e.key.startsWith(p)));
    const before = storedHash(stored, e.key, lang);
    per[lang] = selected ? current : before;
    if (selected && before !== current) changed.push(`${lang} ${e.key}${before === undefined ? ' (new)' : ''}`);
  }
  if (per.pt !== undefined && per.pt === per.es) next[e.key] = per.pt;
  else next[e.key] = Object.fromEntries(Object.entries(per).filter(([, v]) => v !== undefined));
}

const removed = Object.keys(stored).filter((k) => !(k in next));
const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
writeFileSync(FILE, `${JSON.stringify(sorted, null, 1)}\n`, 'utf8');
for (const line of changed) console.log(`re-recorded ${line}`);
for (const k of removed) console.log(`removed orphan ${k}`);
console.log(
  `${entries.length} entries; ${changed.length} hashes re-recorded (${langs.join('+')}${prefixes.length ? ` ${prefixes.join(' ')}` : ' --force-all'}); ${removed.length} orphaned keys removed`,
);
