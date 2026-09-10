import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, symlinkSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

test('adding Markdown publishes a note, preserves a draft, and exposes a translation fallback', () => {
 const cwd=mkdtempSync(path.join(tmpdir(),'homepage-editing-'));
 try {
  for(const item of ['src','lib','eleventy.config.js','package.json']) cpSync(path.resolve(item),path.join(cwd,item),{recursive:true});
  symlinkSync(path.resolve('node_modules'),path.join(cwd,'node_modules'),'dir');
  writeFileSync(path.join(cwd,'src/content/zh/notes/reading-log.md'),`---\ntitle: 测试阅读记录\nlang: zh\nkind: notes\nkey: reading-log\ndraft: false\ncreated: "2026-01-01"\nupdated: "2026-09-11"\n---\n\n这是新增的 Markdown 正文。\n`);
  execFileSync(process.execPath,[path.resolve('node_modules/@11ty/eleventy/cmd.cjs'),'--quiet'],{cwd,stdio:'pipe'});
  const note=readFileSync(path.join(cwd,'_site/notes/reading-log/index.html'),'utf8');
  const home=readFileSync(path.join(cwd,'_site/index.html'),'utf8');
  assert(note.includes('这是新增的 Markdown 正文。'));
  assert(note.includes('data-language-switch href="/en/"'));
  assert(note.includes('2026-09-11'));
  assert(home.includes('/notes/reading-log/'));
  assert(home.includes('2026-09-11'));
  assert(!existsSync(path.join(cwd,'_site/notes/example/index.html')));
  assert(!home.includes('研究笔记示例'));
 } finally {rmSync(cwd,{recursive:true,force:true});}
});
