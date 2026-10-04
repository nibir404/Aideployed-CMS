#!/usr/bin/env node

/**
 * Aideployed-CMS Project Memory CLI
 * Manages persistent repository memory in MEMORY.md
 * 
 * Usage:
 *   node scripts/memory.mjs status
 *   node scripts/memory.mjs log --type feat --title "Title" --desc "Description"
 *   node scripts/memory.mjs next "New objective"
 *   node scripts/memory.mjs done "Completed objective"
 *   node scripts/memory.mjs sync
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MEMORY_PATH = path.join(ROOT_DIR, 'MEMORY.md');

function getGitStatus() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    const lastCommit = execSync('git log -1 --pretty=format:"%h - %s (%an)"', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    const status = execSync('git status --short', { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    const dirtyFiles = status ? status.split('\n').map(l => l.trim()).filter(Boolean) : [];
    return { branch, lastCommit, dirtyFiles };
  } catch {
    return { branch: 'unknown', lastCommit: 'none', dirtyFiles: [] };
  }
}

function getTodayString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

function getIsoTimestamp() {
  return new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
}

function readMemory() {
  if (!fs.existsSync(MEMORY_PATH)) {
    console.error(`Error: ${MEMORY_PATH} does not exist.`);
    process.exit(1);
  }
  return fs.readFileSync(MEMORY_PATH, 'utf8');
}

function writeMemory(content) {
  fs.writeFileSync(MEMORY_PATH, content, 'utf8');
}

function updateLastUpdatedDate(content) {
  const today = getTodayString();
  return content.replace(/> \*\*Last Updated\*\*: \d{4}-\d{2}-\d{2}/g, `> **Last Updated**: ${today}`);
}

function handleStatus() {
  const content = readMemory();
  const git = getGitStatus();

  console.log('\n======================================================');
  console.log('       Aideployed-CMS Project Memory Status           ');
  console.log('======================================================\n');
  console.log(`Git Branch    : ${git.branch}`);
  console.log(`Last Commit   : ${git.lastCommit}`);
  console.log(`Unsaved Files : ${git.dirtyFiles.length === 0 ? 'None (Clean)' : git.dirtyFiles.length + ' files'}`);
  if (git.dirtyFiles.length > 0) {
    git.dirtyFiles.slice(0, 8).forEach(f => console.log(`   - ${f}`));
    if (git.dirtyFiles.length > 8) console.log(`   ... and ${git.dirtyFiles.length - 8} more`);
  }

  // Extract Summary Section
  const summaryMatch = content.match(/## 1\. Project Status & Where It Was Left Off\n([\s\S]*?)(?=\n## 2\.)/);
  if (summaryMatch) {
    console.log('\n--- Current State & Where We Left Off ---');
    console.log(summaryMatch[1].trim());
  }

  // Extract Active Objectives
  const objMatch = content.match(/## 5\. Active Objectives & Next Steps\n([\s\S]*?)(?=\n## 6\.)/);
  if (objMatch) {
    console.log('\n--- Active Objectives & Next Steps ---');
    console.log(objMatch[1].trim());
  }

  // Extract Recent Evolution entries (last 2)
  const evoMatch = content.match(/## 7\. Evolution & Change Ledger\n([\s\S]*)/);
  if (evoMatch) {
    const entries = evoMatch[1].split(/(?=### \[\d{4}-\d{2}-\d{2})/g).filter(Boolean);
    console.log('\n--- Recent Changelog Entries ---');
    entries.slice(0, 2).forEach(entry => {
      console.log(entry.trim());
      console.log('');
    });
  }
  console.log('======================================================\n');
}

function handleNext(item) {
  if (!item) {
    console.error('Error: specify the objective text: npm run memory next "task description"');
    process.exit(1);
  }

  let content = readMemory();
  const targetHeader = '## 5. Active Objectives & Next Steps\n';
  const headerIndex = content.indexOf(targetHeader);

  if (headerIndex === -1) {
    console.error('Error: Could not find "Active Objectives & Next Steps" section in MEMORY.md');
    process.exit(1);
  }

  const insertionPoint = headerIndex + targetHeader.length;
  const newItem = `- [ ] ${item.trim()}\n`;
  content = content.slice(0, insertionPoint) + newItem + content.slice(insertionPoint);
  content = updateLastUpdatedDate(content);

  writeMemory(content);
  console.log(`Added objective: - [ ] ${item}`);
}

function handleDone(taskText) {
  if (!taskText) {
    console.error('Error: specify a snippet of the task text: npm run memory done "task description"');
    process.exit(1);
  }

  let content = readMemory();
  const searchPattern = new RegExp(`- \\[ \\] ([^\\n]*${escapeRegex(taskText)}[^\\n]*)`, 'i');
  const match = content.match(searchPattern);

  if (!match) {
    console.log(`No open task matching "${taskText}" was found.`);
    return;
  }

  const matchedTask = match[1];
  content = content.replace(match[0], `- [x] ${matchedTask}`);
  content = updateLastUpdatedDate(content);

  writeMemory(content);
  console.log(`Marked as completed: - [x] ${matchedTask}`);
}

function handleLog(args) {
  let type = 'FEAT';
  let title = '';
  let desc = '';
  let notes = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--type' && args[i + 1]) {
      type = args[++i].toUpperCase();
    } else if (args[i] === '--title' && args[i + 1]) {
      title = args[++i];
    } else if (args[i] === '--desc' && args[i + 1]) {
      desc = args[++i];
    } else if (args[i] === '--notes' && args[i + 1]) {
      notes = args[++i];
    }
  }

  if (!title) {
    console.error('Error: --title is required. Example: npm run memory log --type feat --title "Add X" --desc "Details"');
    process.exit(1);
  }

  const git = getGitStatus();
  const dateStr = getTodayString();
  const filesTouched = git.dirtyFiles.length > 0 
    ? git.dirtyFiles.map(f => f.replace(/^[MADRCU?!]{1,2}\s+/, '')).join(', ')
    : 'None / Already committed';

  const entry = `\n### [${dateStr}] ${type}: ${title}
- **Timestamp**: ${getIsoTimestamp()}
- **Description**: ${desc || title}
- **Files Touched**: \`${filesTouched}\`
- **Key Decisions / Notes**: ${notes || 'Standard implementation adhering to project architecture.'}
- **Git Baseline**: \`${git.branch}\` at \`${git.lastCommit || 'current'}\`\n`;

  let content = readMemory();
  const targetHeader = '## 7. Evolution & Change Ledger\n';
  const headerIndex = content.indexOf(targetHeader);

  if (headerIndex === -1) {
    console.error('Error: Could not find "Evolution & Change Ledger" section in MEMORY.md');
    process.exit(1);
  }

  const insertionPoint = headerIndex + targetHeader.length;
  content = content.slice(0, insertionPoint) + entry + content.slice(insertionPoint);
  content = updateLastUpdatedDate(content);

  writeMemory(content);
  console.log(`Logged changelog entry in MEMORY.md: [${type}] ${title}`);
}

function handleSync() {
  let content = readMemory();
  const git = getGitStatus();
  content = updateLastUpdatedDate(content);
  writeMemory(content);
  console.log(`Synced MEMORY.md with current git state (${git.branch}, dirty files: ${git.dirtyFiles.length}).`);
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// CLI Router
const [, , command, ...rest] = process.argv;

switch (command) {
  case 'status':
    handleStatus();
    break;
  case 'log':
    handleLog(rest);
    break;
  case 'next':
    handleNext(rest.join(' '));
    break;
  case 'done':
    handleDone(rest.join(' '));
    break;
  case 'sync':
    handleSync();
    break;
  default:
    console.log(`
Aideployed-CMS Memory Manager

Commands:
  node scripts/memory.mjs status          Show current project status & where we left off
  node scripts/memory.mjs log             Record an atomic changelog entry
    --type  <FEAT|FIX|ARCH|REFACTOR|CHORE>
    --title "Title of the change"
    --desc  "Detailed explanation"
    --notes "Tradeoffs or invariants"
  node scripts/memory.mjs next "<item>"   Add a new pending objective
  node scripts/memory.mjs done "<item>"   Mark an objective completed
  node scripts/memory.mjs sync            Update last-updated date & sync state
`);
}
