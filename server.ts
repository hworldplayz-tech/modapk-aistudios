import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json());

  // CORS middleware so custom domains (like modapk.linksshare.online) can freely call backend APIs
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // API Route: Google Play Store Metadata Scraper
  // Bypasses browser CORS completely by fetching directly from backend
  app.get('/api/scrape-playstore', async (req, res) => {
    const rawId = (req.query.id as string || '').trim();
    if (!rawId) {
      return res.status(400).json({ error: 'Missing app id or package name' });
    }

    // Extract package name if full URL was provided
    let packageId = rawId;
    const match = rawId.match(/[?&]id=([a-zA-Z0-9_.]+)/);
    if (match && match[1]) {
      packageId = match[1];
    } else {
      packageId = rawId.replace(/^https?:\/\/[^/]+\//, '').replace(/[^a-zA-Z0-9_.]/g, '');
    }

    if (!packageId) {
      return res.status(400).json({ error: 'Invalid Android package ID format' });
    }

    const playStoreUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(packageId)}&hl=en&gl=US`;

    try {
      // Direct server-to-server fetch with realistic Chrome User-Agent and timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(playStoreUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return res.status(response.status).json({
          error: `Google Play returned status ${response.status} (${response.statusText}). App might not exist in US store or is region-locked.`
        });
      }

      const html = await response.text();

      // Extract details
      // 1. Title
      let title = '';
      const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
      if (ogTitleMatch) {
        title = decodeHtml(ogTitleMatch[1].replace(/ - Apps on Google Play.*$/i, '').replace(/ - Android Apps.*$/i, '')).trim();
      }

      // 2. Icon URL
      let iconUrl = '';
      const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
      if (ogImageMatch) {
        iconUrl = ogImageMatch[1].replace(/=w\d+-h\d+.*$/, '=s512');
      }

      // 3. Developer
      let developer = '';
      const devMatch = html.match(/href="\/store\/apps\/developer\?id=[^"]+">([^<]+)<\/a>/i) ||
                       html.match(/href="\/store\/apps\/dev\?id=[^"]+">([^<]+)<\/a>/i) ||
                       html.match(/"author":\{"@type":"Person","name":"([^"]+)"\}/i) ||
                       html.match(/itemprop="author"[^>]*>([^<]+)</i);
      if (devMatch) {
        developer = decodeHtml(devMatch[1]).trim();
      }

      // 4. Description
      let description = '';
      let shortDescription = '';
      const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/i) || html.match(/<meta name="description" content="([^"]+)"/i);
      if (descMatch) {
        description = decodeHtml(descMatch[1]).trim();
        shortDescription = description.length > 180 ? description.substring(0, 177) + '...' : description;
      }

      // 5. Category & Type
      let category = 'Tools';
      let categoryType: 'games' | 'apps' = 'apps';
      const catMatch = html.match(/"applicationCategory":\s*"([^"]+)"/i) ||
                       html.match(/itemprop="genre">([^<]+)<\/span>/i) ||
                       html.match(/\/store\/apps\/category\/([A-Z_]+)/i);
      if (catMatch) {
        const rawCat = catMatch[1].replace(/_/g, ' ').toLowerCase();
        category = rawCat.replace(/\b\w/g, l => l.toUpperCase());
        if (rawCat.includes('game') || rawCat.includes('action') || rawCat.includes('arcade') ||
            rawCat.includes('rpg') || rawCat.includes('strategy') || rawCat.includes('casual') ||
            rawCat.includes('simulation') || rawCat.includes('adventure') || rawCat.includes('racing') ||
            rawCat.includes('puzzle') || rawCat.includes('sports')) {
          categoryType = 'games';
        }
      }

      // 6. Rating & Reviews
      let rating = 4.7;
      let ratingCount = 85000;
      const ratingMatch = html.match(/aria-label="Rated ([0-9.]+) stars out of five stars"/i) ||
                          html.match(/"ratingValue":\s*"([0-9.]+)"/i) ||
                          html.match(/([0-9.]+)\s*<i class="google-material-icons"/i);
      if (ratingMatch) {
        const parsed = parseFloat(ratingMatch[1]);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) rating = parsed;
      }

      const ratingCountMatch = html.match(/"ratingCount":\s*"([0-9]+)"/i) ||
                               html.match(/([0-9,]+)\s*reviews/i);
      if (ratingCountMatch) {
        const c = parseInt(ratingCountMatch[1].replace(/,/g, ''), 10);
        if (!isNaN(c) && c > 0) ratingCount = c;
      }

      // 7. Downloads Count
      let downloadsCount = 10000000;
      let downloadsText = '10M+';
      const downloadsMatch = html.match(/<div>([0-9]+[MKB\+]*)<\/div><div[^>]*>Downloads<\/div>/i) ||
                             html.match(/([0-9,]+\+)\s*downloads/i) ||
                             html.match(/([0-9,]+\+)\s*installs/i);
      if (downloadsMatch) {
        downloadsText = downloadsMatch[1];
        const num = parseInt(downloadsText.replace(/[^0-9]/g, ''), 10);
        if (downloadsText.includes('B')) downloadsCount = (num || 1) * 1000000000;
        else if (downloadsText.includes('M')) downloadsCount = (num || 10) * 1000000;
        else if (downloadsText.includes('K')) downloadsCount = (num || 50) * 1000;
        else if (num) downloadsCount = num;
      }

      // 8. Screenshots and Artwork
      const imgRegex = /https:\/\/play-lh\.googleusercontent\.com\/[a-zA-Z0-9_-]+/g;
      const matchedImages = html.match(imgRegex);
      let screenshots: string[] = [];
      let bannerUrl = '';

      if (matchedImages && matchedImages.length > 0) {
        const unique = Array.from(new Set(matchedImages));
        if (!iconUrl && unique[0]) {
          iconUrl = `${unique[0]}=s512`;
        }
        if (unique.length > 1) {
          screenshots = unique.slice(1, 8).map(u => `${u}=w1024-h768`);
          bannerUrl = `${unique[1] || unique[0]}=w1280-h720`;
        }
      }

      // 9. What's new
      let whatsNew = '- Latest Play Store update\n- Performance enhancements & bug fixes';
      const whatsNewMatch = html.match(/<div itemprop="description">([\s\S]*?)<\/div>/i) ||
                            html.match(/data-g-id="description">([\s\S]*?)<\/div>/i);
      if (whatsNewMatch) {
        const wn = decodeHtml(whatsNewMatch[1].replace(/<br\s*[\/]?>/gi, '\n').replace(/<[^>]+>/g, '')).trim();
        if (wn.length > 5 && wn.length < 500) {
          whatsNew = wn;
        }
      }

      return res.json({
        packageId,
        title: title || `App (${packageId})`,
        developer: developer || 'Official Developer',
        category: category || 'Tools',
        categoryType,
        version: 'v1.0.0',
        size: '50.0 MB',
        minAndroid: 'Android 6.0+',
        rating,
        ratingCount,
        downloadsCount,
        downloadsText,
        shortDescription: shortDescription || `${title} with premium unlocked features.`,
        description: description || `${title} official description from Google Play Store.`,
        whatsNew,
        iconUrl: iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=512&auto=format&fit=crop&q=80',
        bannerUrl: bannerUrl || iconUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
        screenshots: screenshots.length > 0 ? screenshots : [iconUrl]
      });

    } catch (err: any) {
      console.error('Server Play Store scrape error:', err);
      return res.status(500).json({ error: err?.message || 'Server failed to fetch Google Play' });
    }
  });

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MODAPKs Full-Stack Server running on port ${PORT}`);
  });
}

function decodeHtml(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

startServer();
