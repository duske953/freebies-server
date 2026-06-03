export async function getPageData(url: string) {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (
    response.status === 403 ||
    response.status === 999 ||
    response.status === 429
  ) {
    throw new Error('BOT_PROTECTION');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.statusText}`);
  }

  const html = await response.text();
  return { html, status: response.status, headers: response.headers };
}

export async function processUrlData(url: string, method: string) {
  const response = await fetch(url, {
    method,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (
    response.status === 403 ||
    response.status === 999 ||
    response.status === 429
  ) {
    return {
      url,
      status: response.status,
      ok: false,
      isBotProtected: true,
      message: 'Access denied (Bot Protection)',
    };
  }

  return {
    url,
    status: response.status,
    ok: response.ok,
  };
}

export async function checkResource(url: string) {
  try {
    return await processUrlData(url, 'HEAD');
  } catch (error: any) {
    try {
      return await processUrlData(url, 'GET');
    } catch (innerError) {
      return {
        url,
        status: null,
        ok: false,
        error: error.message,
      };
    }
  }
}
