import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { profile } from './src/data/profile.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let siteUrl = '';
  if (env.VITE_SITE_URL) {
    const parsed = new URL(env.VITE_SITE_URL);
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('VITE_SITE_URL must use https or http.');
    siteUrl = parsed.origin;
  }
  return {
    plugins: [react(), {
      name: 'portfolio-seo',
      transformIndexHtml(html) {
        const person = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.title, email: profile.email, sameAs: [profile.linkedin, profile.github] };
        const enriched = html.replace('<!--person-jsonld-->', `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`);
        return siteUrl ? enriched.replace('</head>', `<link rel="canonical" href="${siteUrl}/" /><meta property="og:url" content="${siteUrl}/" /></head>`) : enriched;
      },
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : '# Set VITE_SITE_URL and rebuild to include the sitemap URL.\n'}` });
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteUrl ? ['/', '/work/india-trade-overseas'].map(path => `<url><loc>${siteUrl}${path}</loc></url>`).join('') : ''}</urlset>` });
      },
    }],
  };
});
