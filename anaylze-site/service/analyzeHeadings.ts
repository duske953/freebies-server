import * as cheerio from 'cheerio';

export function analyzeHeadings($: cheerio.CheerioAPI) {
  const counts = {
    h1: $('h1').length,
    h2: $('h2').length,
    h3: $('h3').length,
    h4: $('h4').length,
    h5: $('h5').length,
    h6: $('h6').length,
  };

  return {
    counts,
    status: {
      hasH1: counts.h1 > 0,
      multipleH1: counts.h1 > 1,
    },
  };
}
