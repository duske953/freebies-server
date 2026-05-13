import { getPageData } from '../utils.ts';
import * as cheerio from 'cheerio';
import { analyzeLinks } from './analyzeLinks.ts';
import { analyzeImages } from './analyzeImages.ts';
import { analyzeSeo } from './analyzeSeo.ts';
import { analyzeHeadings } from './analyzeHeadings.ts';

export async function analyzeSite(url: string) {
  const { html } = await getPageData(url);
  const $ = cheerio.load(html);
  try {
    const data = {
      seo: analyzeSeo(url, $),
      headings: analyzeHeadings($),
      links: await analyzeLinks(url, $),
      images: await analyzeImages(url, $),
    };

    return {
      seo: {
        hasTitle: data.seo?.hasTitle
          ? {
              field: 'hasTitle',
              title: data.seo.title,
              severity: 'pass',
              message:
                "Google uses this as your first impression in search results, you're covered.",
            }
          : {
              field: 'hasTitle',
              severity: 'critical',
              title: 'No page title found',
              message:
                'This is the single most important SEO tag. Without it, Google picks random text from your page. Fix this first.',
            },

        hasDescription: data.seo?.hasDescription
          ? {
              field: 'hasDescription',
              severity: 'pass',
              title: 'Meta description is set',
              message:
                "This is your free ad copy in Google, visitors see it before they click. Make sure it's compelling.",
            }
          : {
              field: 'hasDescription',
              severity: 'critical',
              title: 'No meta description',
              message:
                "Google will auto-generate one, usually badly. Write a 1–2 sentence pitch and you'll get more clicks from the same ranking.",
            },

        hasKeywords: {
          field: 'hasKeywords',
          severity: 'info',
          title: 'Keywords meta tag',
          message:
            "Google hasn't used this tag for over a decade, but some smaller search engines still read it. No strong reason to add or remove it.",
        },

        hasCanonical: data.seo?.hasCanonical
          ? {
              field: 'hasCanonical',
              severity: 'pass',
              title: 'Canonical tag is set',
              message:
                "You've told Google which version of this page is the real one, prevents duplicate content from splitting your ranking.",
            }
          : {
              field: 'hasCanonical',
              severity: 'warning',
              title: 'No canonical tag',
              message:
                'If your page loads on multiple URLs (www vs non-www, HTTP vs HTTPS), Google may treat them as duplicates and split your ranking between them.',
            },

        hasFavicon: data.seo?.hasFavicon
          ? {
              field: 'hasFavicon',
              severity: 'pass',
              title: 'Favicon is present',
              message:
                'Your brand shows up in browser tabs and bookmarks, small detail, solid trust signal.',
            }
          : {
              field: 'hasFavicon',
              severity: 'warning',
              title: 'No favicon found',
              message:
                'Your site shows a blank tab icon. It makes the site look unfinished, takes 5 minutes to fix.',
            },

        og: {
          hasOgTitle: data.seo?.og?.hasOgTitle
            ? {
                field: 'hasOgTitle',
                severity: 'pass',
                title: 'OG title is set',
                message:
                  "When someone shares your link on LinkedIn or Facebook, they'll see the title you intended, not a random guess.",
              }
            : {
                field: 'hasOgTitle',
                severity: 'warning',
                title: 'No OG title tag',
                message:
                  "Every time someone shares your link on social media, the platform picks a title on its own, often the wrong one. Set this to control your brand's first impression.",
              },

          hasOgDescription: data.seo?.og?.hasOgDescription
            ? {
                field: 'hasOgDescription',
                severity: 'pass',
                title: 'OG description is set',
                message:
                  'Your social share cards will show a proper description, more context means more clicks from LinkedIn, Facebook, and Slack previews.',
              }
            : {
                field: 'hasOgDescription',
                severity: 'warning',
                title: 'No OG description',
                message:
                  'Social share previews will look sparse or show random body text. A one-liner here can meaningfully lift click-through when people share your link.',
              },

          hasOgImage: data.seo?.og?.hasOgImage
            ? {
                field: 'hasOgImage',
                severity: 'pass',
                title: 'OG image is set',
                message:
                  'Your link will show a rich preview card with an image on LinkedIn, Slack, iMessage, and X, dramatically more clickable than a plain link.',
              }
            : {
                field: 'hasOgImage',
                severity: 'critical',
                title: 'No OG image',
                message:
                  'Shared links show a blank or tiny placeholder, easy to scroll past. A branded 1200×630px image here turns every share into a visual ad for your site.',
              },
        },

        twitter: {
          hasTwitterCard: data.seo?.twitter?.hasTwitterCard
            ? {
                field: 'hasTwitterCard',
                severity: 'pass',
                title: 'Twitter card tag is set',
                message:
                  'Links shared on X/Twitter will expand into a rich card, image, title, and description, instead of just a plain URL.',
              }
            : {
                field: 'hasTwitterCard',
                severity: 'warning',
                title: 'No Twitter card tag',
                message:
                  'When your link is posted on X/Twitter, it shows as a bare URL. Add twitter:card to unlock the full image preview card.',
              },

          hasTwitterTitle: data.seo?.twitter?.hasTwitterTitle
            ? {
                field: 'hasTwitterTitle',
                severity: 'pass',
                title: 'Twitter title tag is set',
                message:
                  "Your link's title on X/Twitter is in your hands, not left to the algorithm to guess.",
              }
            : {
                field: 'hasTwitterTitle',
                severity: 'warning',
                title: 'No Twitter title tag',
                message:
                  'X will fall back to your OG title if it exists, otherwise it picks something itself. Add twitter:title to be certain.',
              },
        },
      },

      headings: {
        hasH1: data.headings?.status?.hasH1
          ? {
              field: 'hasH1',
              severity: 'pass',
              title: 'Page has an H1',
              message:
                "Google treats your H1 as the headline of the page, the core topic signal. You're good.",
            }
          : {
              field: 'hasH1',
              severity: 'critical',
              title: 'No H1 found',
              message:
                'Your page has no main heading, Google has to guess what the page is about. Add one that clearly describes the page topic.',
            },

        multipleH1: data.headings?.status?.multipleH1
          ? {
              field: 'multipleH1',
              severity: 'critical',
              title: 'Multiple H1 tags found',
              message:
                "Your page is sending mixed signals about what it's actually about. Keep one H1, your page's core headline, and demote the rest to H2.",
            }
          : {
              field: 'multipleH1',
              severity: 'pass',
              title: 'Only one H1, as it should be',
              message:
                'Your page has a single, clear main topic. Search engines and screen readers both prefer this.',
            },

        h2Count:
          data.headings?.counts.h2 === 0
            ? {
                field: 'h2Count',
                severity: 'warning',
                title: 'No H2 subheadings found',
                message:
                  'Breaking your page into sections with H2s makes it easier to skim, and easier for Google to understand your content structure.',
              }
            : {
                field: 'h2Count',
                severity: 'info',
                title: `${data.headings?.counts.h2} sections, ${data.headings?.counts.h3} sub-sections`,
                message:
                  'Well-structured content hierarchy gives readers and search engines a clear outline of your page.',
              },
      },

      links: {
        brokenLinks:
          data.links?.brokenInternalLinks! > 0
            ? {
                field: 'brokenLinks',
                severity: 'critical',
                title: `${data.links?.brokenInternalLinks} broken ${data.links?.brokenInternalLinks === 1 ? 'link' : 'links'} found`,
                message:
                  'Visitors who click these hit a dead end, and Google sees it as a sign of a neglected site. Takes 2 minutes to fix once you know where they are. ' +
                  data.links?.links?.map((link) => link.url).join(', '),
              }
            : {
                field: 'brokenLinks',
                severity: 'pass',
                title: 'No broken links found',
                message:
                  'Every link on your page works, no dead ends for visitors or crawlers. Keep it that way as you update content.',
              },

        links405:
          data.links?.protectedInternalLinks! > 0
            ? {
                field: 'links405',
                severity: 'warning',
                title: `${data.links?.protectedInternalLinks} ${data.links?.protectedInternalLinks === 1 ? 'link' : 'links'} blocked automated checks (405)`,
                message:
                  "These links returned 'Method Not Allowed', the page likely exists but blocks bots. Common on LinkedIn profiles. Verify manually before treating as broken.",
              }
            : null,
      },

      images: {
        missingAlt:
          data.images?.missingAlt! > 0
            ? {
                field: 'missingAlt',
                severity: 'critical',
                title: `${data.images?.missingAlt} ${data.images?.missingAlt === 1 ? 'image is' : 'images are'} missing alt text`,
                message:
                  'These images are invisible to screen readers and to Google Image Search. Each one is a missed keyword opportunity and a potential accessibility issue.',
              }
            : {
                field: 'missingAlt',
                severity: 'pass',
                title: 'All images have alt text',
                message:
                  "Every image is described, good for accessibility, Google Image Search, and anyone on a slow connection where images don't load.",
              },

        brokenImages:
          data.images?.brokenImages! > 0
            ? {
                field: 'brokenImages',
                severity: 'critical',
                title: `${data.images?.brokenImages} broken ${data.images?.brokenImages === 1 ? 'image' : 'images'} found`,
                message:
                  'These show as blank boxes to your visitors, one of the fastest ways to look untrustworthy. Usually a quick filepath fix.',
              }
            : {
                field: 'brokenImages',
                severity: 'pass',
                title: 'No broken images',
                message:
                  'Every image loads correctly, no blank boxes or broken icons that erode visitor trust.',
              },

        // duplicateImages:
        //   data.images?.brokenImages! > data.images?.totalImages!
        //     ? {
        //         field: 'duplicateImages',
        //         severity: 'info',
        //         title: `${data.images?.brokenImages} broken images across ${data.images?.totalImages} total`,
        //         message: `${data.images?.totalImages! - data.images?.brokenImages!} ${data.images?.totalImages! - data.images?.brokenImages! === 1 ? 'image is' : 'images are'} used more than once — that's fine, but if any are large files, loading them repeatedly adds unnecessary weight to your pages.`,
        //       }
        //     : null,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
