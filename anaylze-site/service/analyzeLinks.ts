import * as cheerio from 'cheerio';
import { checkResource } from '../utils.ts';
export async function analyzeLinks(url: string, $: cheerio.CheerioAPI) {
  try {
    const baseUrl = new URL(url);
    const links: string[] = [];
    
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (!href) return;
      try {
        const absoluteUrl = new URL(href, url);
        // Only include internal links (same origin)
        if (absoluteUrl.protocol.startsWith('http') && absoluteUrl.origin === baseUrl.origin) {
          links.push(absoluteUrl.href);
        }
      } catch (e) {}
    });

    const uniqueLinks = [...new Set(links)];
    const results = await Promise.allSettled(
      uniqueLinks.map((link) => checkResource(link)),
    );

    const badLinks = results
      .map((r: any) => r.value || { url: 'unknown', error: r.reason, ok: false })
      .filter((link) => !link.ok || link.isBotProtected);

    return {
      totalInternalLinks: uniqueLinks.length,
      brokenInternalLinks: results.filter((r: any) => r.status === 'fulfilled' && !r.value.ok && !r.value.isBotProtected).length,
      protectedInternalLinks: results.filter((r: any) => r.status === 'fulfilled' && r.value.isBotProtected).length,
      links: badLinks,
    };
  } catch (error: any) {
    if (error.message === 'BOT_PROTECTION') {
      return {
        error:
          'The site is protected by bot detection. We cannot analyze its content directly.',
        isBotProtected: true,
      };
    }
    return { error: error.message };
  }
}
