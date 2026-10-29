const CACHE_TTL_MS = 15 * 60 * 1000;
const UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
const cache = new Map<string, { url: string; isRealPhoto: boolean; timestamp: number }>();

export function buildTargetUrl(input: string): string | null {
  let t = input.trim();
  if (/^https?:\/\//i.test(t)) {
    try {
      const host = new URL(t).hostname;
      if (host !== 'linkedin.com' && !host.endsWith('.linkedin.com')) return null;
      return t;
    } catch { return null; }
  }
  const slug = t.replace(/^\/+|\/+$/g, '').replace(/^in\//, '');
  return `https://www.linkedin.com/in/${encodeURIComponent(slug)}/`;
}

export function isAllowedImageHost(u: string): boolean {
  try {
    const h = new URL(u).hostname;
    return h.endsWith('licdn.com') || h === 'unavatar.io';
  } catch { return false; }
}

export async function fetchLiveLinkedInAvatar(targetUrl: string) {
  const cached = cache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { avatarUrl: cached.url, isRealPhoto: cached.isRealPhoto };
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);
    if (!response.ok) throw new Error(`LinkedIn returned HTTP ${response.status}`);

    const html = await response.text();
    const m =
      html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i) ||
      html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
    if (!m?.[1]) throw new Error('No og:image meta tag found');

    const rawUrl = m[1].replace(/&amp;/g, '&');
    const isPlaceholder = rawUrl.includes('ghost') || rawUrl.includes('1c5u578iilxfi4m4dvc4q810q');
    const isReal = rawUrl.includes('media.licdn.com') && !isPlaceholder;
    cache.set(targetUrl, { url: rawUrl, isRealPhoto: isReal, timestamp: Date.now() });
    return { avatarUrl: rawUrl, isRealPhoto: isReal };
  } catch (err: any) {
    console.warn(`[LinkedIn Avatar] fallback for "${targetUrl}":`, err.message);
    const slug = targetUrl.replace(/.*linkedin\.com\/in\/([^/?#]+).*/, '$1');
    return { avatarUrl: `https://unavatar.io/linkedin/${slug}`, isRealPhoto: false };
  }
}
