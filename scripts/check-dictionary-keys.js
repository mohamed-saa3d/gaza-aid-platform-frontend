/**
 * Verifies the dictionary contract in lib/dictionary.ts.
 *
 * Two failure modes are checked, both silent at runtime:
 *  1. a `t.<section>.<key>` reference that has no matching key (renders
 *     `undefined` with no type error, because sections are Record<string, string>);
 *  2. a key present in one language but not the other (renders the wrong language
 *     to half the users).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DICTIONARY = path.join(ROOT, 'lib', 'dictionary.ts');

const source = fs.readFileSync(DICTIONARY, 'utf8');

// Extract defined keys per section. Sections are declared as `name: {` ... `},`.
function keysForSection(sectionName) {
  const start = source.indexOf(`${sectionName}: {`);
  if (start === -1) return [];

  // Walk braces from the opening `{` to find the matching close.
  let depth = 0;
  let index = source.indexOf('{', start);
  const openIndex = index;

  for (; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    else if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) break;
    }
  }

  const body = source.slice(openIndex + 1, index);
  const keys = [];
  for (const match of body.matchAll(/^\s*([A-Za-z0-9_]+)\s*:/gm)) {
    keys.push(match[1]);
  }
  return keys;
}

const SECTIONS = ['nav', 'footer', 'common', 'rating', 'home', 'hero', 'quickDonate', 'why', 'live', 'branding', 'currency'];
const defined = Object.fromEntries(SECTIONS.map((s) => [s, keysForSection(s)]));

// Collect every file under components/ and app/.
function walk(directory, out = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next'].includes(entry.name)) continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

const files = [...walk(path.join(ROOT, 'components')), ...walk(path.join(ROOT, 'app'))];

const used = new Map(); // "section.key" -> Set(files)
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  for (const match of content.matchAll(/\bt\.(nav|footer|common|rating|home|hero|quickDonate|why|live|branding|currency)\.([A-Za-z0-9_]+)/g)) {
    const key = `${match[1]}.${match[2]}`;
    if (!used.has(key)) used.set(key, new Set());
    used.get(key).add(path.relative(ROOT, file));
  }
}

const missing = [];
for (const [key, where] of used) {
  const [section, name] = key.split('.');
  if (!defined[section].includes(name)) {
    missing.push({ key, usedIn: [...where] });
  }
}

console.log('Defined key counts:', JSON.stringify(Object.fromEntries(SECTIONS.map((s) => [s, defined[s].length]))));
console.log(`Referenced keys: ${used.size}`);

if (missing.length === 0) {
  console.log('\nOK - every t.* reference resolves to a defined dictionary key.');
} else {
  console.log(`\nMISSING ${missing.length} key(s):`);
  for (const item of missing) {
    console.log(`  ${item.key}  <- ${item.usedIn.join(', ')}`);
  }
  process.exitCode = 1;
}

// ── AR / EN parity ────────────────────────────────────────────────────────────
// A key defined in only one language silently shows the wrong language.
const enStart = source.indexOf('  en: {');
const arBlock = source.slice(source.indexOf('  ar: {'), enStart);
const enBlock = source.slice(enStart);

function sectionsIn(block) {
  const result = {};
  const re = /(nav|footer|common|rating|home|hero|quickDonate|why|live|branding|currency):\s*\{([\s\S]*?)\n    \}/g;
  let match;
  while ((match = re.exec(block))) {
    const keys = [];
    for (const key of match[2].matchAll(/^\s{6}([A-Za-z0-9_]+):/gm)) keys.push(key[1]);
    result[match[1]] = keys;
  }
  return result;
}

const arSections = sectionsIn(arBlock);
const enSections = sectionsIn(enBlock);

const parityIssues = [];
for (const section of SECTIONS) {
  const arKeys = new Set(arSections[section] || []);
  const enKeys = new Set(enSections[section] || []);
  const onlyAr = [...arKeys].filter((k) => !enKeys.has(k));
  const onlyEn = [...enKeys].filter((k) => !arKeys.has(k));

  if (onlyAr.length || onlyEn.length) {
    parityIssues.push({ section, onlyAr, onlyEn });
  }
}

if (parityIssues.length === 0) {
  console.log('OK - AR and EN define identical key sets.');
} else {
  console.log(`\nAR/EN PARITY MISMATCH in ${parityIssues.length} section(s):`);
  for (const issue of parityIssues) {
    console.log(`  ${issue.section}: only-in-ar=[${issue.onlyAr}] only-in-en=[${issue.onlyEn}]`);
  }
  process.exitCode = 1;
}
