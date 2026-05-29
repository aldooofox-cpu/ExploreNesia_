export function toMediaProxyUrl(url: string): string {
  const base = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  const clean = url.trim();

  // if already proxied, don't double-proxy
  if (clean.startsWith(`${base}/media/proxy?url=`)) {
    return clean;
  }

  return `${base}/media/proxy?url=${encodeURIComponent(clean)}`;
}

