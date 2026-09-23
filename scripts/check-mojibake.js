/**
 * Detects UTF-8 mojibake in source files: Arabic text that was decoded as
 * Latin-1/Windows-1252 and re-encoded, producing characters like 'Ø', 'Ù', 'Ã'.
 * Reads bytes via Node so PowerShell's console encoding cannot mask the result.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json']);
const IGNORED_DIRS = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

// Characters that only appear when UTF-8 was mis-decoded as a single-byte charset.
const MOJIBAKE_PATTERN = /[\u00C2\u00C3\u00D8\u00D9\u00E2\u20AC][\u0080-\u00BF\u2018\u2019\u201C\u201D\u2013\u2014]/;

const findings = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.env') continue;

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(fullPath);
      continue;
    }

    if (!EXTENSIONS.has(path.extname(entry.name))) continue;

    const content = fs.readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (MOJIBAKE_PATTERN.test(line)) {
        findings.push({ file: path.relative(ROOT, fullPath), line: index + 1, text: line.trim().slice(0, 120) });
      }
    });
  }
}

walk(ROOT);

if (findings.length === 0) {
  console.log('No mojibake found.');
} else {
  console.log(`Found ${findings.length} mojibake line(s):`);
  for (const finding of findings) {
    console.log(`  ${finding.file}:${finding.line}`);
    console.log(`     ${finding.text}`);
  }
}
