import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

interface CacheEntry {
  url: string;
  isRealPhoto: boolean;
  timestamp: number;
}
const avatarCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

const LINKEDIN_CRAWLER_UA = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';

async function fetchLiveLinkedInAvatar(slugOrUrl: string): Promise<{ avatarUrl: string; isRealPhoto: boolean }> {
  let targetUrl = slugOrUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    const cleanSlug = targetUrl.replace(/^\/+|\/+$/g, '').replace(/^in\//, '');
    targetUrl = `https://www.linkedin.com/in/${cleanSlug}/`;
  }

  const cached = avatarCache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { avatarUrl: cached.url, isRealPhoto: cached.isRealPhoto };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': LINKEDIN_CRAWLER_UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`LinkedIn returned HTTP ${response.status}`);
    }

    const html = await response.text();

    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i)
      || html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i)
      || html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);

    if (ogImageMatch && ogImageMatch[1]) {
      let rawUrl = ogImageMatch[1].replace(/&amp;/g, '&');
      const isPlaceholder = rawUrl.includes('ghost') || rawUrl.includes('1c5u578iilxfi4m4dvc4q810q');
      const isReal = rawUrl.includes('media.licdn.com') && !isPlaceholder;

      avatarCache.set(targetUrl, {
        url: rawUrl,
        isRealPhoto: isReal,
        timestamp: Date.now(),
      });

      return { avatarUrl: rawUrl, isRealPhoto: isReal };
    }

    throw new Error('No og:image meta tag found');
  } catch (err: any) {
    console.warn(`[LinkedIn Avatar] Live fetch fallback for "${targetUrl}":`, err.message);
    const cleanSlug = targetUrl.replace(/.*linkedin\.com\/in\/([^/?#]+).*/, '$1');
    return { avatarUrl: `https://unavatar.io/linkedin/${cleanSlug}`, isRealPhoto: false };
  }
}

app.get('/api/linkedin-avatar-info', async (req: Request, res: Response) => {
  const slug = (req.query.slug as string) || '';
  const url = (req.query.url as string) || '';

  if (!slug && !url) {
    res.status(400).json({ error: 'Missing slug or url parameter' });
    return;
  }

  const result = await fetchLiveLinkedInAvatar(slug || url);
  res.json({
    success: true,
    slug: slug || undefined,
    url: url || undefined,
    avatarUrl: result.avatarUrl,
    isRealPhoto: result.isRealPhoto,
    source: 'linkedin-live',
  });
});

app.get('/api/linkedin-avatar', async (req: Request, res: Response) => {
  const slug = (req.query.slug as string) || '';
  const url = (req.query.url as string) || '';
  const redirectParam = req.query.redirect === 'true';

  if (!slug && !url) {
    res.status(400).send('Missing slug or url query parameter');
    return;
  }

  try {
    const { avatarUrl } = await fetchLiveLinkedInAvatar(slug || url);

    if (redirectParam) {
      res.redirect(302, avatarUrl);
      return;
    }

    const imgResponse = await fetch(avatarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IEEE-BBDU-Portal/1.0)',
      },
    });

    if (!imgResponse.ok) {
      res.redirect(302, avatarUrl);
      return;
    }

    const contentType = imgResponse.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imgResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=86400');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (error: any) {
    const fallbackSlug = slug || 'member';
    res.redirect(302, `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackSlug)}&background=090e28&color=38bdf8&size=512&bold=true`);
  }
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
