import { getPageData } from '../anaylze-site/utils.ts';
import * as cheerio from 'cheerio';

export default async function analyzeOgTags(url: string) {
  const { html } = await getPageData(url);
  const $ = cheerio.load(html);
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogType = $('meta[property="og:type"]').attr('content');
  const ogName = $('meta[property="og:name"]').attr('content');
  const ogUrl = $('meta[property="og:url"]').attr('content');
  return {
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    ogName,
    ogUrl,
  };
}
