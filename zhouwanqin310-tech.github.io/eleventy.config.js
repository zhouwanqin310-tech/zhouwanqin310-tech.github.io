import { contentUpdated, dateLabel, route, validateRecord, authorsHtml } from './lib/content.js';

export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addWatchTarget('lib/');
  eleventyConfig.addFilter('dateLabel', dateLabel);
  eleventyConfig.addFilter('authorsHtml', authorsHtml);
  eleventyConfig.addFilter('visibleLinks', links => (links || []).filter(l => l.url));
  eleventyConfig.addFilter('kindLabel', (kind, lang) => ({ zh: { publications: '学术成果', projects: '研究项目', activities: '学术活动', notes: '研究笔记' }, en: { publications: 'Publications', projects: 'Projects', activities: 'Academic activities', notes: 'Research notes' } })[lang]?.[kind] || '');
  eleventyConfig.addFilter('statusLabel', (status, lang) => lang === 'en' ? (status === 'published' ? 'Published' : 'Under review') : (status === 'published' ? '已发表' : '在投与审稿中'));
  eleventyConfig.addFilter('record', (items, key, lang, kind) => items.find(i => i.data.key === key && i.data.lang === lang && (!kind || i.data.kind === kind)));
  eleventyConfig.addFilter('forLanguage', (items, lang) => items.filter(i => i.data.lang === lang));
  eleventyConfig.addFilter('forKind', (items, kind) => items.filter(i => i.data.kind === kind));
  eleventyConfig.addFilter('forStatus', (items, status) => items.filter(i => i.data.status === status));
  eleventyConfig.addFilter('latest', items => new Date(Math.max(...items.map(i => +i.data.contentUpdated))));
  eleventyConfig.addFilter('route', route);
  eleventyConfig.addCollection('records', api => {
    const seen = new Set();
    return api.getFilteredByGlob('src/content/**/*.md').filter(item => {
      validateRecord(item.data, item.inputPath);
      const key = `${item.data.lang}/${item.data.kind}/${item.data.key}`;
      if (seen.has(key)) throw new Error(`Duplicate content key: ${key}`);
      seen.add(key);
      item.data.contentUpdated = contentUpdated(item.data, item.inputPath);
      return !item.data.draft;
    }).sort((a, b) => (a.data.order ?? 100) - (b.data.order ?? 100) || (b.data.year ?? 0) - (a.data.year ?? 0) || a.data.key.localeCompare(b.data.key));
  });
  return {
    dir: { input: 'src', output: '_site', includes: '_includes', data: '_data' },
    htmlTemplateEngine: 'njk', markdownTemplateEngine: false,
    templateFormats: ['md', 'njk']
  };
}
