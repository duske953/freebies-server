import * as cheerio from 'cheerio';
export default function detectPlatform(
  $: cheerio.CheerioAPI,
  html: string,
  headers: any,
) {
  const generator = $('meta[name="generator"]').attr('content') || '';

  if (
    generator.toLowerCase().includes('wordpress') ||
    html.includes('/wp-content/')
  )
    return 'wordpress';
  if (
    generator.toLowerCase().includes('squarespace') ||
    html.includes('squarespace')
  )
    return 'squarespace';
  if (generator.toLowerCase().includes('webflow') || html.includes('webflow'))
    return 'webflow';
  if (generator.toLowerCase().includes('shopify') || html.includes('shopify'))
    return 'shopify';
  if (generator.toLowerCase().includes('framer') || html.includes('framer'))
    return 'framer';

  return 'custom';
}
