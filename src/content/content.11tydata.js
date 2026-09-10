import { route, contentUpdated } from '../../lib/content.js';
export default {
  layout: 'detail.njk',
  eleventyComputed: {
    permalink: data => route(data),
    contentUpdated: data => contentUpdated(data, data.page.inputPath)
  }
};
