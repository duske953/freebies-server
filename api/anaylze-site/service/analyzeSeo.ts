import * as cheerio from 'cheerio';

export function analyzeSeo(url: string, $: cheerio.CheerioAPI) {
  const titleTag = $('title').first();
  const hasTitle = !!titleTag.text().trim();

  const hasDescription = !!$('meta[name="description"]')
    .first()
    .attr('content');
  const hasKeywords = !!$('meta[name="keywords"]').first().attr('content');
  const hasCanonical = !!$('link[rel="canonical"]').first().attr('href');

  const favicon =
    $('link[rel="icon"]').first().attr('href') ||
    $('link[rel="shortcut icon"]').first().attr('href') ||
    $('link[rel="apple-touch-icon"]').first().attr('href');
  const hasFavicon = !!favicon;

  const hasOgTitle = !!$('meta[property="og:title"]').first().attr('content');
  const hasOgDescription = !!$('meta[property="og:description"]')
    .first()
    .attr('content');
  const hasOgImage = !!$('meta[property="og:image"]').first().attr('content');

  const hasTwitterCard = !!$('meta[name="twitter:card"]')
    .first()
    .attr('content');
  const hasTwitterTitle = !!$('meta[name="twitter:title"]')
    .first()
    .attr('content');

  return {
    hasTitle,
    title: titleTag.text().trim(),
    hasDescription,
    hasKeywords,
    hasCanonical,
    hasFavicon,
    og: {
      hasOgTitle,
      hasOgDescription,
      hasOgImage,
    },
    twitter: {
      hasTwitterCard,
      hasTwitterTitle,
    },
  };
}
