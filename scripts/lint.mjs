#!/usr/bin/env node
import { existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const targets = [];
for (const [dir, extension] of [['src', '.js'], ['demo', '.js'], ['scripts', '.mjs']]) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) if (name.endsWith(extension)) targets.push(join(dir, name));
}

let failed = false;
for (const file of targets) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) {
    failed = true;
    console.error(`${file}\n${result.stderr || result.stdout}`.trim());
  }
}
process.exit(failed ? 1 : 0);
