export default function cleanUrl(url: string) {
  return url.includes('https://')
    ? url
    : url.includes('http://')
      ? url.replace('http://', 'https://')
      : `https://${url}`;
}
