/**
 * Record that the Portuguese/Spanish translations were checked against the
 * current English (src/i18n/content/sourceHashes.json).
 *
 * sourceHashes.test.ts fails when an English curriculum / exercise /
 * template / song / level string changes after its translation was last
 * checked. Workflow after an English edit:
 *   1. update the PT and ES overlay text to match the new English;
 *   2. npm run i18n:rehash -- <pt|es|all> [key-prefix ...]
 *      e.g.  npm run i18n:rehash -- all cur:l4u14m1
 *            npm run i18n:rehash -- pt ex:l3u11m1e2
 * Without a key prefix every entry of that language is re-recorded — only do
 * that when every listed English change has been translated.
 *
 * Run: npx tsx scripts/i18n/rehash-sources.ts <pt|es|all> [prefix ...]
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

const [scope = '', ...prefixes] = process.argv.slice(2);
if (scope !== 'all' && scope !== 'pt' && scope !== 'es') {
  console.error('usage: rehash-sources.ts <pt|es|all> [key-prefix ...]');
  process.exit(2);
}
const langs: readonly Lang[] = scope === 'all' ? LANGS : [scope];

const stored: StoredHashes = existsSync(FILE) ? JSON.parse(readFileSync(FILE, 'utf8')) : {};
const entries = overlayEntries();
const next: StoredHashes = {};
let updated = 0;

for (const e of entries) {
  const current = sourceHash(e.en);
  const per: Partial<Record<Lang, string>> = {};
  for (const lang of LANGS) {
    const selected = langs.includes(lang) && (prefixes.length === 0 || prefixes.some((p) => e.key.startsWith(p)));
    const before = storedHash(stored, e.key, lang);
    per[lang] = selected ? current : before;
    if (selected && before !== current) updated++;
  }
  if (per.pt !== undefined && per.pt === per.es) next[e.key] = per.pt;
  else next[e.key] = Object.fromEntries(Object.entries(per).filter(([, v]) => v !== undefined));
}

const removed = Object.keys(stored).filter((k) => !(k in next)).length;
const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
writeFileSync(FILE, `${JSON.stringify(sorted, null, 1)}\n`, 'utf8');
console.log(`${entries.length} entries; ${updated} hashes updated (${langs.join('+')}${prefixes.length ? ` ${prefixes.join(' ')}` : ''}); ${removed} orphaned keys removed`);
