import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { contentUpdated, dateLabel, route, authorsHtml } from '../lib/content.js';

test('content dates track content and associated photos, not style or rebuilds', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'homepage-dates-'));
  const git = (...args) => execFileSync('git', args, {cwd, stdio:'pipe'});
  const commit = (date) => execFileSync('git', ['-c','user.name=Test','-c','user.email=test@example.com','commit','-am','test'], {cwd,stdio:'pipe',env:{...process.env,GIT_AUTHOR_DATE:date,GIT_COMMITTER_DATE:date}});
  try {
    git('init');
    mkdirSync(path.join(cwd,'src/assets'),{recursive:true});
    writeFileSync(path.join(cwd,'profile.md'),'one');
    writeFileSync(path.join(cwd,'english.md'),'English one');
    writeFileSync(path.join(cwd,'src/assets/photo.jpg'),'photo one');
    writeFileSync(path.join(cwd,'style.css'),'one');
    git('add','.');commit('2026-01-01T00:00:00+08:00');
    const record={photo:'/assets/photo.jpg'};
    assert.equal(dateLabel(contentUpdated(record,'profile.md',cwd)),'2026-01-01');
    writeFileSync(path.join(cwd,'style.css'),'two');commit('2026-02-01T00:00:00+08:00');
    assert.equal(dateLabel(contentUpdated(record,'profile.md',cwd)),'2026-01-01');
    writeFileSync(path.join(cwd,'profile.md'),'two');commit('2026-03-01T00:00:00+08:00');
    assert.equal(dateLabel(contentUpdated(record,'profile.md',cwd)),'2026-03-01');
    assert.equal(dateLabel(contentUpdated({},'english.md',cwd)),'2026-01-01');
    writeFileSync(path.join(cwd,'src/assets/photo.jpg'),'photo two');commit('2026-04-01T00:00:00+08:00');
    assert.equal(dateLabel(contentUpdated(record,'profile.md',cwd)),'2026-04-01');
    assert.equal(dateLabel(contentUpdated(record,'profile.md',cwd)),'2026-04-01');
    assert.equal(dateLabel(contentUpdated({...record,updated:'2025-12-01'},'profile.md',cwd)),'2025-12-01');
    assert.equal(dateLabel(contentUpdated({created:'2026-05-01'},'new.md',cwd)),'2026-05-01');
  } finally {rmSync(cwd,{recursive:true,force:true});}
});
test('Shanghai dates cross UTC midnight correctly', () => {
  assert.equal(dateLabel('2026-09-09T17:00:00Z'),'2026-09-10');
  assert.throws(()=>dateLabel('not-a-date'));
});
test('drafts have no public route and translations keep stable keys',()=>{
  assert.equal(route({lang:'zh',kind:'notes',key:'example',draft:true}),false);
  assert.equal(route({lang:'en',kind:'notes',key:'example'}),'/en/notes/example/');
  assert.equal(route({lang:'zh',kind:'profile',key:'profile'}),false);
});
test('author highlighting is exact and escapes HTML',()=>{
  assert.equal(authorsHtml(['Wanqin Zhou','<other>']),'<'+'strong>Wanqin Zhou</strong>, &lt;other&gt;');
  assert.equal(authorsHtml(['Wanqin Zhou Jr.']),'Wanqin Zhou Jr.');
});
