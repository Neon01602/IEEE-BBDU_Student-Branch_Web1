import { buildTargetUrl, fetchLiveLinkedInAvatar } from './_lib/linkedin.js';

export default async function handler(req: any, res: any) {
  const slug = (req.query.slug as string) || '';
  const url = (req.query.url as string) || '';
  if (!slug && !url) return res.status(400).json({ error: 'Missing slug or url parameter' });

  const target = buildTargetUrl(slug || url);
  if (!target) return res.status(400).json({ error: 'Invalid LinkedIn URL' });

  const result = await fetchLiveLinkedInAvatar(target);
  res.status(200).json({
    success: true,
    slug: slug || undefined,
    url: url || undefined,
    avatarUrl: result.avatarUrl,
    isRealPhoto: result.isRealPhoto,
    source: 'linkedin-live',
  });
}
