import { checkResource } from '../utils.ts';
import * as cheerio from 'cheerio';

export async function analyzeImages(url: string, $: cheerio.CheerioAPI) {
  try {
    const images: Array<{
      url: string | null;
      alt: string | null;
      hasAlt: boolean;
      ok?: boolean;
    }> = [];

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt');
      if (!src) {
        images.push({
          ok: false,
          url: null,
          alt: alt || null,
          hasAlt: !!(alt && alt.trim()),
        });
      } else {
        const absoluteUrl = new URL(src, url).href;
        if (absoluteUrl.startsWith('http')) {
          images.push({
            url: absoluteUrl,
            alt: alt || null,
            hasAlt: !!(alt && alt.trim()),
          });
        }
      }
    });

    const uniqueUrls = [
      ...new Map(images.map((img) => [img.url, img])).values(),
    ];

    const d = await Promise.all(
      uniqueUrls.map(async (img) => {
        return await checkResource(img.url as string);
      }),
    );

    return {
      totalImages: images.length,
      brokenImages: d.filter((img: any) => !img.ok && !img.isBotProtected)
        .length,
      protectedImages: d.filter((img: any) => img.isBotProtected).length,
      missingAlt: uniqueUrls.filter((img) => !img.hasAlt).length,
      uniqueImages: images.length - uniqueUrls.length,
    };
  } catch (error: any) {
    if (error.message === 'BOT_PROTECTION') {
      return {
        error:
          'The site is protected by bot detection. We cannot analyze its images directly.',
        isBotProtected: true,
      };
    }
    return { error: error.message };
  }
}
