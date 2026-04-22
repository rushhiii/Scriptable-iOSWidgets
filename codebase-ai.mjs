/**
 * codebase-ai.mjs — drop in any project root and run: node codebase-ai.mjs
 */

import { puter } from '@heyputer/puter.js';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// ─── CONFIG ────────────────────────────────────────────────────────────────

const IGNORE_DIRS  = new Set(['.git','node_modules','.next','.vscode','dist','build','out','.cache','coverage','__pycache__','.idea','vendor']);
const IGNORE_FILES = new Set(['.DS_Store','package-lock.json','yarn.lock','pnpm-lock.yaml','codebase-ai.mjs']);
const ALLOWED_EXTS = new Set(['.js','.mjs','.cjs','.ts','.tsx','.jsx','.py','.html','.css','.scss','.sh','.yaml','.yml']);

const MAX_FILE_CHARS  = 3_000;  // truncate any single file at this length
const MAX_TOTAL_CHARS = 60_000; // hard cap on total snapshot sent to AI
const MODEL = 'openai/gpt-5.3-codex';

// ─── FILE COLLECTION ───────────────────────────────────────────────────────

function collectFiles(dir, results = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return results; }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (IGNORE_FILES.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) collectFiles(fullPath, results);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTS.has(ext)) results.push(fullPath);
    }
  }
  return results;
}

function buildSnapshot(rootDir) {
  const files = collectFiles(rootDir);

  // Sort: smaller files first so we pack in as many as possible
  files.sort((a, b) => fs.statSync(a).size - fs.statSync(b).size);

  let totalChars = 0;
  const included = [];
  const skipped  = [];
  const parts    = [];

  for (const fp of files) {
    const rel = path.relative(rootDir, fp);
    let content = '';
    try { content = fs.readFileSync(fp, 'utf-8'); } catch { continue; }

    if (content.length > MAX_FILE_CHARS) {
      content = content.slice(0, MAX_FILE_CHARS) + `\n... [truncated — ${Math.round(fs.statSync(fp).size / 1024)}KB file]`;
    }

    const block = `### FILE: ${rel}\n\`\`\`\n${content}\n\`\`\``;

    if (totalChars + block.length > MAX_TOTAL_CHARS) {
      skipped.push(rel);
      continue;
    }

    parts.push(block);
    included.push(rel);
    totalChars += block.length;
  }

  return { snapshot: parts.join('\n\n'), included, skipped };
}

// ─── AI ────────────────────────────────────────────────────────────────────

async function analyzeCodebase(snapshot, fileList) {
  const system = `You are a senior software engineer reviewing a codebase.
CRITICAL: Respond ONLY with a single valid JSON object. No markdown fences, no preamble, no trailing text.
Keep each description under 15 words. Limit each category to 4 items max.
Required shape (do not deviate):
{"summary":"string","bugs":[{"title":"string","description":"string","file":"string"}],"improvements":[{"title":"string","description":"string","file":"string"}],"features":[{"title":"string","description":"string","file":"string"}],"security":[{"title":"string","description":"string","file":"string"}],"performance":[{"title":"string","description":"string","file":"string"}]}`;

  const user = `Files in project:\n${fileList.join('\n')}\n\nCodebase:\n${snapshot}`;

  const res = await puter.ai.chat(user, { model: MODEL, systemPrompt: system });
  let text = res?.message?.content?.[0]?.text ?? res?.toString() ?? '';

  // Strip accidental markdown fences
  text = text.replace(/^```(?:json)?/m, '').replace(/```$/m, '').trim();

  // If JSON was truncated, try to patch it closed
  if (!text.endsWith('}')) {
    text = text.replace(/,\s*$/, '');           // remove trailing comma
    text = text.replace(/,\s*([\]}])/g, '$1');  // remove comma before closing bracket
    const opens  = (text.match(/{/g) || []).length;
    const closes = (text.match(/}/g) || []).length;
    const arrOpens  = (text.match(/\[/g) || []).length;
    const arrCloses = (text.match(/\]/g) || []).length;
    text += ']'.repeat(Math.max(0, arrOpens - arrCloses));
    text += '}'.repeat(Math.max(0, opens - closes));
  }

  return JSON.parse(text);
}

async function implementSuggestion(snapshot, item) {
  const user = `Codebase:\n\n${snapshot}

Implement this suggestion:
Title: ${item.title}
Description: ${item.description}
File: ${item.file || 'infer from codebase'}

Show ONLY the changed file(s) in this exact format:
### FILE: relative/path/to/file.js
\`\`\`
full updated file content here
\`\`\`

Then briefly explain what changed.`;

  const res = await puter.ai.chat(user, { model: MODEL });
  return res?.message?.content?.[0]?.text ?? res?.toString() ?? '';
}

function applyChanges(rootDir, response) {
  const rx = /###\s*FILE:\s*(.+?)\n```(?:\w+)?\n([\s\S]*?)```/g;
  let match, count = 0;

  while ((match = rx.exec(response)) !== null) {
    const relPath = match[1].trim();
    const content = match[2];
    const full    = path.join(rootDir, relPath);

    if (fs.existsSync(full)) fs.writeFileSync(full + '.bak', fs.readFileSync(full));
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
    console.log(`  ✅ Updated: ${relPath}  (original → ${relPath}.bak)`);
    count++;
  }
  return count;
}

// ─── UI ────────────────────────────────────────────────────────────────────

function ask(q) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(r => rl.question(q, a => { rl.close(); r(a.trim()); }));
}

function printSuggestions(parsed) {
  const categories = [
    { key: 'bugs',         icon: '🐛', label: 'Bugs & Errors'         },
    { key: 'security',     icon: '🔒', label: 'Security Issues'        },
    { key: 'improvements', icon: '✨', label: 'Improvements & Cleanup' },
    { key: 'performance',  icon: '⚡', label: 'Performance Wins'       },
    { key: 'features',     icon: '🚀', label: 'Features to Build'      },
  ];

  let index = 1;
  const all = [];

  for (const { key, icon, label } of categories) {
    const items = parsed[key] || [];
    if (!items.length) continue;
    console.log(`\n${icon}  ${label}`);
    console.log('─'.repeat(44));
    for (const item of items) {
      console.log(`  [${index}] ${item.title}`);
      console.log(`      ${item.description}  (${item.file})`);
      all.push(item);
      index++;
    }
  }
  return all;
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║        Codebase AI Assistant         ║');
  console.log('╚══════════════════════════════════════╝\n');

  const root = process.cwd();
  console.log(`📁 Project: ${root}\n`);

  console.log('🔍 Scanning codebase...');
  const { snapshot, included, skipped } = buildSnapshot(root);

  if (!included.length) {
    console.error('No supported files found. Run this from your project root.');
    process.exit(1);
  }

  console.log(`   Included : ${included.length} files`);
  if (skipped.length) {
    console.log(`   Skipped  : ${skipped.length} files (hit size limit) — run inside a subfolder to focus`);
  }

  console.log('\n🤖 Analyzing with AI (15–30 seconds)...\n');

  let parsed;
  try {
    parsed = await analyzeCodebase(snapshot, included);
  } catch (err) {
    console.error('❌ Failed to parse AI response:', err.message);
    console.error('\n💡 Tips:');
    console.error('   • cd into a subfolder (e.g. src/) and run again to reduce scope');
    console.error('   • Or delete generated/minified .js files you don\'t want reviewed');
    process.exit(1);
  }

  console.log(`📋 ${parsed.summary}\n`);

  const all = printSuggestions(parsed);

  if (!all.length) {
    console.log('\n✅ No major issues found!');
    return;
  }

  console.log('\n' + '─'.repeat(44));
  const choice = await ask('\nPick a number to implement, or Enter to exit: ');
  if (!choice) { console.log('\nExiting.\n'); return; }

  const idx = parseInt(choice, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= all.length) {
    console.log('Invalid number.'); return;
  }

  const item = all[idx];
  console.log(`\n⚙️  Implementing: "${item.title}"...\n`);

  const result = await implementSuggestion(snapshot, item);

  console.log('\n' + '─'.repeat(44));
  const apply = await ask('Apply changes directly to files? (y/n): ');

  if (apply.toLowerCase() === 'y') {
    const n = applyChanges(root, result);
    if (n === 0) {
      console.log('\n⚠️  No file blocks detected — printing output instead:\n');
      console.log(result);
    } else {
      console.log(`\n✅ ${n} file(s) updated. Originals backed up as .bak`);
    }
  } else {
    console.log('\n📄 Suggested changes:\n');
    console.log(result);
  }

  console.log('\nDone!\n');
}

main().catch(e => { console.error(e); process.exit(1); });
