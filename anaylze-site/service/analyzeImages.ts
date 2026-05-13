import { checkResource, getPageData, processUrlData } from '../utils.ts';
import * as cheerio from 'cheerio';

export async function analyzeImages(url: string, $: cheerio.CheerioAPI) {
  try {
    const images: Array<{ url: string; alt: string | null; hasAlt: boolean }> =
      [];

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      const dataSrc = $(el).attr('data-src');
      const srcset = $(el).attr('srcset');
      const alt = $(el).attr('alt');

      const imageUrl =
        src ||
        dataSrc ||
        (srcset ? srcset.split(',')[0].trim().split(' ')[0] : null);

      if (imageUrl) {
        try {
          const absoluteUrl = new URL(imageUrl, url).href;
          if (absoluteUrl.startsWith('http')) {
            images.push({
              url: absoluteUrl,
              alt: alt || null,
              hasAlt: !!(alt && alt.trim()),
            });
          }
        } catch (e) {}
      } else {
        images.push({
          url: 'missing-src',
          alt: alt || null,
          hasAlt: !!(alt && alt.trim()),
        });
      }
    });

    const uniqueUrls = [
      ...new Set(
        images.map((img) => img.url).filter((u) => u !== 'missing-src'),
      ),
    ];
    const checkResults = new Map();

    await Promise.all(
      uniqueUrls.map(async (imgUrl) => {
        const result = await checkResource(imgUrl);
        checkResults.set(imgUrl, result);
      }),
    );

    const allImageStatus = images.map((img) => {
      if (img.url === 'missing-src') {
        return { ...img, ok: false, error: 'Missing src attribute' };
      }
      const check = checkResults.get(img.url);
      return {
        ...img,
        ...check,
      };
    });

    const badImages = allImageStatus.filter(
      (img) => !img.ok || img.isBotProtected || !img.hasAlt,
    );

    return {
      totalImages: images.length,
      brokenImages: allImageStatus.filter(
        (img) => !img.ok && !img.isBotProtected,
      ).length,
      protectedImages: allImageStatus.filter((img) => img.isBotProtected)
        .length,
      missingAlt: images.filter((img) => !img.hasAlt).length,
      images: badImages,
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
