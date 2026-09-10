import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

export const launchDate = '2026-09-10T00:00:00+08:00';
export function parseDate(value) {
  if (!value) return null;
  const raw = value instanceof Date ? value.toISOString() : String(value);
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00+08:00` : raw);
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid content date: ${raw}`);
  return date;
}
export function gitDate(file, cwd = process.cwd()) {
  try {
    const result = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return parseDate(result);
  } catch { return null; }
}
export function contentUpdated(data, inputPath, cwd = process.cwd()) {
  if (data.updated) return parseDate(data.updated);
  const files = [inputPath];
  if (data.kind === 'profile') files.push('src/_data/site.js');
  for (const asset of [data.image, data.photo, ...(data.assets || [])]) {
    if (asset && !/^https?:/.test(asset)) files.push(`src/${asset.replace(/^\//, '')}`);
  }
  const dates = files.map(f => gitDate(f, cwd)).filter(Boolean);
  return dates.length ? new Date(Math.max(...dates)) : parseDate(data.created || launchDate);
}
export function dateLabel(value) {
  const d = parseDate(value);
  if (!d) return '';
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
}
export function route(data) {
  if (data.draft || data.kind === 'profile') return false;
  return `${data.lang === 'en' ? '/en' : ''}/${data.kind}/${data.key}/`;
}
export function validateRecord(data, inputPath) {
  if (!['zh', 'en'].includes(data.lang)) throw new Error(`${inputPath}: lang must be zh or en`);
  if (!['profile', 'publications', 'projects', 'activities', 'notes'].includes(data.kind)) throw new Error(`${inputPath}: invalid kind`);
  if (!data.key || !/^[a-z0-9-]+$/.test(data.key)) throw new Error(`${inputPath}: key must be a URL-safe slug`);
  if (!data.title) throw new Error(`${inputPath}: missing title`);
  if (data.updated) parseDate(data.updated);
  if (data.kind === 'publications' && !['published', 'review'].includes(data.status)) throw new Error(`${inputPath}: status must be published or review`);
  if (typeof data.draft !== 'undefined' && typeof data.draft !== 'boolean') throw new Error(`${inputPath}: draft must be true or false`);
  for (const link of data.links || []) {
    if (!link.url) continue;
    if (!/^https?:\/\//.test(link.url) && !link.url.startsWith('/')) throw new Error(`${inputPath}: invalid link ${link.url}`);
  }
  for (const asset of [data.image, data.photo, ...(data.assets || [])]) {
    if (asset && !/^https?:/.test(asset) && !existsSync(path.resolve('src', asset.replace(/^\//, '')))) throw new Error(`${inputPath}: missing asset ${asset}`);
  }
}
export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
export function authorsHtml(authors = []) {
  return authors.map(name => {
    const value = String(name);
    const match = value.match(/^(周万勤|Wanqin Zhou)(.*)$/);

    if (match) {
      return `<strong>${escapeHtml(match[1])}</strong>${escapeHtml(match[2])}`;
    }

    return escapeHtml(value);
  }).join(', ');
}
