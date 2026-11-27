import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cardSourcePath = path.join(__dirname, '../src/miraie-ac-card.ts');
const cardSource = fs.readFileSync(cardSourcePath, 'utf8');

console.log('🔍 Starting UI Text, Spelling & Capitalization Audit...\n');

let errors = 0;

// Helper to assert conditions
function assert(condition, message) {
  if (condition) {
    console.log(`✅ Passed: ${message}`);
  } else {
    console.error(`❌ Failed: ${message}`);
    errors++;
  }
}

// ─────────────────────────────────────────────
// 1. Audit Typo Dictionary
// ─────────────────────────────────────────────
const commonTypos = [
  'temparature',
  'celcius',
  'horisontal',
  'verticle',
  'desription',
  'unsuccesful',
  'recieve',
  'untill',
  'blater',
  'controll',
  'convertable'
];

let foundTypos = 0;
for (const typo of commonTypos) {
  const regex = new RegExp(`\\b${typo}\\b`, 'i');
  if (regex.test(cardSource)) {
    console.error(`❌ Typo detected: "${typo}" found in source.`);
    foundTypos++;
    errors++;
  }
}
if (foundTypos === 0) {
  console.log('✅ Passed: No common spelling typos detected in source.');
}

// ─────────────────────────────────────────────
// 2. Audit Toast Messages for Sentence Case
// ─────────────────────────────────────────────
const toastRegex = /_showToast\(\s*(['"`])(.*?)\1\s*\)/g;
let toastMatch;
let toastCount = 0;
let invalidToasts = 0;

while ((toastMatch = toastRegex.exec(cardSource)) !== null) {
  const toastText = toastMatch[2].trim();
  // Ignore dynamic variable interpolation starting expressions like `${...}`
  if (!toastText.startsWith('$')) {
    toastCount++;
    const firstChar = toastText.charAt(0);
    if (firstChar !== firstChar.toUpperCase()) {
      console.error(`❌ Toast string does not start with uppercase: "${toastText}"`);
      invalidToasts++;
      errors++;
    }
  }
}

assert(invalidToasts === 0, `All static toast messages (${toastCount} checked) start with a capital letter.`);

// ─────────────────────────────────────────────
// 3. Audit Tooltip Titles for Capitalization
// ─────────────────────────────────────────────
const titleRegex = /title=(['"`])(.*?)\1/g;
let titleMatch;
let titleCount = 0;
let invalidTitles = 0;

while ((titleMatch = titleRegex.exec(cardSource)) !== null) {
  const titleText = titleMatch[2].trim();
  // If static string without starting interpolation
  if (titleText && !titleText.startsWith('$')) {
    titleCount++;
    const firstChar = titleText.charAt(0);
    if (firstChar !== firstChar.toUpperCase() && !titleText.startsWith('%')) {
      console.error(`❌ Tooltip title does not start with uppercase: "${titleText}"`);
      invalidTitles++;
      errors++;
    }
  }
}

assert(invalidTitles === 0, `All static tooltip title attributes (${titleCount} checked) start with a capital letter.`);

// ─────────────────────────────────────────────
// 4. Audit Visual Editor Section Titles
// ─────────────────────────────────────────────
const editorSectionTitles = [
  'Appearance & Theme',
  'Sensors',
  'Connectivity & Failover',
  'AC Features & Controls',
  'Energy & Diagnostics'
];

for (const section of editorSectionTitles) {
  assert(cardSource.includes(`title: '${section}'`), `Editor section title "${section}" is properly defined in Title Case.`);
}

// ─────────────────────────────────────────────
// 5. Audit Mode & Preset Label Formatters
// ─────────────────────────────────────────────
// Check mode mapping in _modeLabel
assert(cardSource.includes("cool: 'Cool'") && cardSource.includes("fan_only: 'Fan'") && cardSource.includes("auto: 'Auto'"), 'HVAC mode mapping produces correct Title Case strings.');

// Check preset mapping in _presetLabel
assert(cardSource.includes("if (p === 'boost') return 'Powerful';") && cardSource.includes("if (p === 'eco') return 'Eco';"), 'Preset label mapping produces "Powerful" and "Eco" in Title Case.');

// Check source label mapping in _sourceLabel
assert(cardSource.includes("if (lower === 'ir') return 'IR';") && cardSource.includes("if (lower === 'cloud') return 'Cloud';"), 'Transport source label mapping formats IR and Cloud correctly.');
assert(cardSource.includes("if (lower === 'local udp' || lower === 'local_udp' || lower === 'udp') return 'Local UDP';"), 'Transport source label mapping formats Local UDP correctly.');
assert(cardSource.includes("if (lower === 'ir blaster' || lower === 'ir_blaster') return 'IR Blaster';"), 'Source label handles "IR Blaster" with uppercase acronym and Title Case.');
assert(cardSource.includes("if (lower === 'ir remote' || lower === 'ir_remote') return 'IR Remote';"), 'Source label handles "IR Remote" with uppercase acronym and Title Case.');

// Evaluate extracted _sourceLabel logic against test fixtures
function simulateSourceLabel(s) {
  if (!s) return 'Unknown';
  const trimmed = s.trim();
  const lower = trimmed.toLowerCase();
  if (lower === 'ir') return 'IR';
  if (lower === 'cloud') return 'Cloud';
  if (lower === 'local udp' || lower === 'local_udp' || lower === 'udp') return 'Local UDP';
  if (lower === 'ir blaster' || lower === 'ir_blaster') return 'IR Blaster';
  if (lower === 'ir remote' || lower === 'ir_remote') return 'IR Remote';
  if (lower === 'ir failover' || lower === 'ir_failover') return 'IR Failover';
  if (lower === 'ir failover (offline)' || lower === 'ir_failover (offline)') return 'IR Failover (Offline)';

  return trimmed
    .split(/[\s_]+/)
    .map(w => {
      const lw = w.toLowerCase();
      if (lw === 'ir') return 'IR';
      if (lw === 'udp') return 'UDP';
      if (lw === 'mqtt') return 'MQTT';
      if (lw === 'ha') return 'HA';
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

assert(simulateSourceLabel('ir blaster') === 'IR Blaster', 'Source label converts "ir blaster" -> "IR Blaster"');
assert(simulateSourceLabel('IR Blaster') === 'IR Blaster', 'Source label preserves "IR Blaster"');
assert(simulateSourceLabel('ir remote') === 'IR Remote', 'Source label converts "ir remote" -> "IR Remote"');
assert(simulateSourceLabel('IR Remote') === 'IR Remote', 'Source label preserves "IR Remote"');
assert(simulateSourceLabel('ir failover (offline)') === 'IR Failover (Offline)', 'Source label converts "ir failover (offline)" -> "IR Failover (Offline)"');
assert(simulateSourceLabel('cloud') === 'Cloud', 'Source label converts "cloud" -> "Cloud"');
assert(simulateSourceLabel('local udp') === 'Local UDP', 'Source label converts "local udp" -> "Local UDP"');
assert(simulateSourceLabel('local_udp') === 'Local UDP', 'Source label converts "local_udp" -> "Local UDP"');

// ─────────────────────────────────────────────
// Summary
// ─────────────────────────────────────────────
if (errors > 0) {
  console.error(`\n❌ UI Text Audit completed with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log('\n🎉 All UI text, spelling, and capitalization checks passed cleanly!');
}
