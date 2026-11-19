/**
 * Retire saved per-exercise scores whose exercise changed (audit W4a follow-up).
 *
 * The progress store keeps a score per exercise id. When content changes the
 * exercise behind an id (templates re-keyed, a question rewritten, a generated
 * item dropped), an old score would otherwise attach to a different exercise.
 * This script compares every served exercise's identity (exerciseFingerprints.ts)
 * with the recorded snapshot (src/data/exercises/__tests__/exerciseIdentities.json) —
 * or with an older source tree — and, when ids changed:
 *   1. appends a new version to src/state/retiredExerciseIds.ts listing them
 *      (the progress store's version follows, and its migration drops those
 *      scores from older saved progress — completions and unlocks stay);
 *   2. re-records the snapshot.
 *
 * --respelled (the British spelling pass, 19 November 2026): a question
 * changed ONLY in spelling is the same exercise, so its score is kept, not
 * retired. For every id whose fingerprint differs from the snapshot, the
 * current English item is re-spelled the American way (respelling.ts, whole
 * words, case kept); when that gives exactly the recorded fingerprint, the id
 * is a respelling. If ANY changed id is not explained that way (or an id was
 * added or removed), it names them, exits 1 and writes nothing: those need
 * the ordinary run. Otherwise it records { module: { id: fingerprint before } }
 * under the date in src/data/exercises/__tests__/exerciseRespellings.json,
 * with the progress version it was made under, and re-records the snapshot.
 * No version is added, no score is retired, the progress version stays.
 *
 * Run:  npx tsx scripts/progress/retire-exercise-ids.ts            (vs the snapshot)
 *       npx tsx scripts/progress/retire-exercise-ids.ts --from <dir> (vs a tree with src/ — e.g. a git archive of main)
 *       npm run progress:retire -- --respelled [--date YYYY-MM-DD]  (vs the snapshot; date: today, UTC)
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { treeFingerprints, treeItems, changedIds, type Fingerprints, type TreeModules } from '../../src/data/exercises/__tests__/exerciseFingerprints';
import { americanOriginal } from '../../src/data/exercises/__tests__/respelling';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SNAPSHOT = `${ROOT}src/data/exercises/__tests__/exerciseIdentities.json`;
const RETIRED = `${ROOT}src/state/retiredExerciseIds.ts`;
const RESPELLINGS = `${ROOT}src/data/exercises/__tests__/exerciseRespellings.json`;

async function loadTree(root: string): Promise<TreeModules> {
  const authored = [];
  const templates = [];
  for (let n = 1; n <= 9; n++) {
    authored.push((await import(`${root}/src/data/exercises/exercisesL${n}.ts`)).default);
    templates.push((await import(`${root}/src/data/exercises/templatesL${n}.ts`)).default);
  }
  const { generateAllForLevel } = await import(`${root}/src/data/exercises/exerciseGenerator.ts`);
  return { authored, templates, generateAllForLevel };
}

const args = process.argv.slice(2);
const fromIdx = args.indexOf('--from');
const respelled = args.includes('--respelled');
const dateIdx = args.indexOf('--date');
if (respelled && fromIdx >= 0) {
  console.error('--respelled compares with the recorded snapshot only (no --from).');
  process.exit(2);
}
const before: Fingerprints = fromIdx >= 0
  ? treeFingerprints(await loadTree(args[fromIdx + 1].replace(/\/$/, '')))
  : JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
const tree = await loadTree(ROOT.replace(/\/$/, ''));
const after = treeFingerprints(tree);
const changed = changedIds(before, after);
const count = Object.values(changed).reduce((n, ids) => n + ids.length, 0);
const snapshotCount = () => Object.values(after).reduce((n, m) => n + Object.keys(m).length, 0);

if (respelled) {
  const items = treeItems(tree);
  const proved: Fingerprints = {};
  const refused: string[] = [];
  for (const [m, ids] of Object.entries(changed)) {
    for (const id of ids) {
      const ex = items[m]?.[id];
      if (!ex) refused.push(`${id}: removed`);
      else if (americanOriginal(ex, before[m][id])) (proved[m] ??= {})[id] = before[m][id];
      else refused.push(`${id}: changed by more than spelling`);
    }
  }
  for (const [m, ids] of Object.entries(after)) {
    for (const id of Object.keys(ids)) if (before[m]?.[id] === undefined) refused.push(`${id}: new id`);
  }
  if (refused.length > 0) {
    console.error(`--respelled: ${refused.length} id(s) are not respellings; nothing written. Retire them with the ordinary run:`);
    for (const r of refused) console.error(`  ${r}`);
    process.exit(1);
  }
  if (count === 0) {
    console.log('--respelled: no exercise changed identity; nothing written');
    process.exit(0);
  }
  const date = dateIdx >= 0 ? args[dateIdx + 1] : new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) {
    console.error(`--date: expected YYYY-MM-DD, got ${date}`);
    process.exit(2);
  }
  const { RETIRED_EXERCISE_IDS: retired } = await import(RETIRED);
  const progressVersion = Math.max(1, ...(retired as { version: number }[]).map((r) => r.version));
  const file: Record<string, { progressVersion: number; ids: Fingerprints }> = existsSync(RESPELLINGS) ? JSON.parse(readFileSync(RESPELLINGS, 'utf8')) : {};
  const entry = file[date] ?? { progressVersion, ids: {} };
  if (entry.progressVersion !== progressVersion) {
    console.error(`--respelled: the ${date} entry was made under progress version ${entry.progressVersion}, now ${progressVersion}; use another --date.`);
    process.exit(1);
  }
  for (const [m, ids] of Object.entries(proved)) entry.ids[m] = { ...entry.ids[m], ...ids };
  file[date] = entry;
  writeFileSync(RESPELLINGS, `${JSON.stringify(file, null, 1)}\n`, 'utf8');
  writeFileSync(SNAPSHOT, `${JSON.stringify(after, null, 1)}\n`, 'utf8');
  const byLevel: Record<string, number> = {};
  for (const [m, ids] of Object.entries(proved)) byLevel[m.slice(0, 2)] = (byLevel[m.slice(0, 2)] ?? 0) + Object.keys(ids).length;
  console.log(`--respelled: ${count} ids changed only in spelling, in ${Object.keys(proved).length} modules (${Object.entries(byLevel).map(([l, n]) => `${l} ${n}`).join(', ')}); recorded under ${date} (progress version ${progressVersion}, unchanged); no score retired`);
  for (const [m, ids] of Object.entries(proved)) console.log(`  ${m}: ${Object.keys(ids).join(' ')}`);
  console.log(`snapshot re-recorded (${snapshotCount()} exercises)`);
  process.exit(0);
}

const { RETIRED_EXERCISE_IDS } = existsSync(RETIRED)
  ? await import(RETIRED)
  : { RETIRED_EXERCISE_IDS: [] as { version: number; ids: Record<string, string> }[] };
const entries: { version: number; ids: Record<string, string> }[] = [...RETIRED_EXERCISE_IDS];

if (count > 0) {
  const version = Math.max(1, ...entries.map((e) => e.version)) + 1;
  // Ids are stored as their suffix after the module id ("g3", "e1"), space-separated.
  entries.push({ version, ids: Object.fromEntries(Object.entries(changed).map(([m, ids]) => [m, ids.map((id) => id.slice(m.length)).join(' ')])) });
  const body = entries
    .map((e) => `  {\n    version: ${e.version},\n    ids: {\n${Object.entries(e.ids).map(([m, s]) => `      ${m}: '${s}',`).join('\n')}\n    },\n  },`)
    .join('\n');
  writeFileSync(
    RETIRED,
    `/**
 * Saved per-exercise scores that no longer mean what they say (generated by
 * scripts/progress/retire-exercise-ids.ts — do not edit by hand).
 *
 * Each version lists, per module, the exercise ids (suffix after the module id)
 * whose exercise changed identity or was removed in that content release. The
 * progress store's persisted version is the highest version here; its migration
 * drops these scores from progress saved under an older version, so a score
 * never attaches to a different exercise. Module completion, unlocks, review
 * schedules and each module's "passed" flag are kept.
 */
export interface RetiredExerciseIds {
  version: number;
  /** moduleId -> space-separated id suffixes ("g1 g2 e3") */
  ids: Readonly<Record<string, string>>;
}

export const RETIRED_EXERCISE_IDS: readonly RetiredExerciseIds[] = [
${body}
];
`,
    'utf8',
  );
  console.log(`retired ${count} ids in ${Object.keys(changed).length} modules as version ${version}`);
  for (const [m, ids] of Object.entries(changed)) console.log(`  ${m}: ${ids.join(' ')}`);
} else {
  console.log('no exercise changed identity');
}
writeFileSync(SNAPSHOT, `${JSON.stringify(after, null, 1)}\n`, 'utf8');
console.log(`snapshot re-recorded (${snapshotCount()} exercises)`);
