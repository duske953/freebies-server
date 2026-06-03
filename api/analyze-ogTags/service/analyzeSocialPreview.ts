import { getPageData } from '../../anaylze-site/utils.ts';
import * as cheerio from 'cheerio';
import detectPlatform from './detectPlatform.ts';

export default async function analyzeOgTags(url: string) {
  const { html, headers } = await getPageData(url);
  const $ = cheerio.load(html);
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogType = $('meta[property="og:type"]').attr('content');

  const platform = detectPlatform($, html, headers);
  return {
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    platform,
  };
}
