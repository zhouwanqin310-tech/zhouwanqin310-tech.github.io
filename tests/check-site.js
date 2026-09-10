import { readdirSync, readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';

const root=path.resolve('_site');
const walk=d=>readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(root);
const htmls=files.filter(f=>f.endsWith('.html'));
for(const f of htmls){
 const html=readFileSync(f,'utf8');
 assert.equal((html.match(/<h1\b/g)||[]).length,1,`${f}: one H1`);
 assert(!/href="(?:#|undefined|false|)"/.test(html),`${f}: empty or invalid link`);
 assert(!html.includes('Invalid Date'),`${f}: invalid date`);
 assert(!html.includes('研究笔记示例')&&!html.includes('Example research note'),`${f}: leaked draft`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
  const target=path.join(root,decodeURIComponent(match[1]),match[1].endsWith('/')?'index.html':'');
  assert(existsSync(target),`${f}: broken local link ${match[1]}`);
 }
 assert(html.includes('rel="canonical"'),`${f}: canonical missing`);
}
for(const prefix of ['','en/']){
 const html=readFileSync(path.join(root,prefix,'index.html'),'utf8');
 assert((html.match(/<li class="publication/g)||[]).length > 0, 'Publications should render');
 assert(html.includes('portrait.jpg'));
 assert(existsSync(path.join(root,prefix,'cv/index.html')));
 assert(!existsSync(path.join(root,prefix,'notes/example/index.html')));
}
const sitemap=readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert(!sitemap.includes('/example/'));
assert(sitemap.includes('/en/publications/renar/'));
console.log(`PASS: ${htmls.length} pages, local links, bilingual routes, metadata, draft exclusion, publication counts.`);
