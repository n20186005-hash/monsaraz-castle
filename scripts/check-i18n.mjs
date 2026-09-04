// Structural parity check for the four locale files under src/messages.
// Verifies: JSON validity, identical leaf-key trees, equal array lengths.
// Usage: node scripts/check-i18n.mjs
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const langs = ['pt', 'en', 'zh', 'mwl'];
const data = {};
for (const l of langs) {
  const raw = readFileSync(join(root, 'src', 'messages', `${l}.json`), 'utf8');
  try {
    data[l] = JSON.parse(raw);
  } catch (e) {
    console.error(`[FAIL] ${l}.json is not valid JSON: ${e.message}`);
    process.exit(1);
  }
}

function collect(node, path, leafs, arrays) {
  if (Array.isArray(node)) {
    arrays.set(path, node.length);
    node.forEach((child, i) => collect(child, `${path}.${i}`, leafs, arrays));
    return;
  }
  if (node !== null && typeof node === 'object') {
    for (const key of Object.keys(node)) {
      collect(node[key], path ? `${path}.${key}` : key, leafs, arrays);
    }
    return;
  }
  leafs.add(path);
}

let errors = 0;
const ref = langs[0];

const refLeafs = new Set();
const refArrays = new Map();
collect(data[ref], '', refLeafs, refArrays);

for (const l of langs.slice(1)) {
  const leafs = new Set();
  const arrays = new Map();
  collect(data[l], '', leafs, arrays);

  const missing = [...refLeafs].filter((k) => !leafs.has(k));
  const extra = [...leafs].filter((k) => !refLeafs.has(k));
  const missingArr = [...refArrays.entries()].filter(([k]) => !arrays.has(k));
  const extraArr = [...arrays.entries()].filter(([k]) => !refArrays.has(k));
  const lengthDiff = [...refArrays.entries()]
    .filter(([k, len]) => arrays.has(k) && arrays.get(k) !== len)
    .map(([k, len]) => `${k} (${ref}: ${len}, ${l}: ${arrays.get(k)})`);

  if (missing.length || extra.length || missingArr.length || extraArr.length || lengthDiff.length) {
    errors++;
    console.error(`[FAIL] ${l}.json structure differs from ${ref}.json`);
    if (missing.length) console.error('  missing keys:', missing.join(', '));
    if (extra.length) console.error('  extra keys  :', extra.join(', '));
    if (missingArr.length) console.error('  missing arrays:', missingArr.map(([k]) => k).join(', '));
    if (extraArr.length) console.error('  extra arrays  :', extraArr.map(([k]) => k).join(', '));
    if (lengthDiff.length) console.error('  length diff   :', lengthDiff.join(' | '));
  } else {
    console.log(`[PASS] ${l}.json: ${leafs.size} leaf keys, all array lengths match`);
  }
}

if (errors === 0) {
  console.log(`[PASS] ${ref}.json reference: ${refLeafs.size} leaf keys`);
  console.log('[PASS] All four locale files are structurally identical.');
  process.exit(0);
}
process.exit(1);
