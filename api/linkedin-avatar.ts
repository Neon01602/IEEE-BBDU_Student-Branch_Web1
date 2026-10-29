import { buildTargetUrl, fetchLiveLinkedInAvatar, isAllowedImageHost } from './_lib/linkedin.js';

export default async function handler(req: any, res: any) {
  const slug = (req.query.slug as string) || '';
  const url = (req.query.url as string) || '';
  if (!slug && !url) return res.status(400).send('Missing slug or url query parameter');

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(slug || 'member')}&background=090e28&color=38bdf8&size=512&bold=true`;

  try {
    const target = buildTargetUrl(slug || url);
    if (!target) return res.redirect(302, fallback);

    const { avatarUrl } = await fetchLiveLinkedInAvatar(target);
    if (req.query.redirect === 'true' || !isAllowedImageHost(avatarUrl)) {
      return res.redirect(302, avatarUrl);
    }

    const img = await fetch(avatarUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; IEEE-BBDU-Portal/1.0)' } });
    if (!img.ok) return res.redirect(302, avatarUrl);

    const buf = Buffer.from(await img.arrayBuffer());
    res.setHeader('Content-Type', img.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(buf);
  } catch {
    res.redirect(302, fallback);
  }
}
