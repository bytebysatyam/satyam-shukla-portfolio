import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { contactLinks, profile, siteMetadata } from './src/data/profile.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  let siteUrl = '';
  if (env.VITE_SITE_URL || profile.website) {
    const parsed = new URL(env.VITE_SITE_URL || profile.website);
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('VITE_SITE_URL must use https or http.');
    siteUrl = parsed.origin;
  }
  return {
    plugins: [react(), {
      name: 'portfolio-seo',
      transformIndexHtml(html) {
        const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
        const person = { '@context': 'https://schema.org', '@type': 'Person', name: profile.name, jobTitle: profile.title, email: profile.email, telephone: contactLinks.phones.map(phone => phone.number), ...(siteUrl ? { url: siteUrl } : {}), sameAs: [profile.linkedin, profile.github] };
        const enriched = html.replace('<!--person-jsonld-->', `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`)
          .replace(/<title>.*?<\/title>/, `<title>${escape(siteMetadata.title)}</title>`)
          .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*("\s*\/?>)/g, `$1${escape(siteMetadata.description)}$2`)
          .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*("\s*\/?>)/g, `$1${escape(siteMetadata.title)}$2`)
          .replace('<!--no-js-contact-->', `<section class="no-js"><h1>${escape(profile.name)}</h1><p>${escape(profile.positioning)}</p><p>This portfolio uses JavaScript for navigation. You can reach me directly:</p><p><a href="mailto:${escape(profile.email)}">Email Me</a> · <a href="${escape(profile.github)}">GitHub</a> · <a href="${escape(profile.linkedin)}">LinkedIn</a></p>${contactLinks.phones.map(phone => `<p>${escape(phone.display)}: <a href="${escape(phone.call)}">Call Me</a> · <a href="${escape(phone.whatsapp)}">WhatsApp</a></p>`).join('')}</section>`);
        return siteUrl ? enriched.replace('</head>', `<link rel="canonical" href="${siteUrl}/" /><meta property="og:url" content="${siteUrl}/" /></head>`) : enriched;
      },
      generateBundle() {
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}/sitemap.xml\n` : '# Set VITE_SITE_URL and rebuild to include the sitemap URL.\n'}` });
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteUrl ? ['/', '/work/india-trade-overseas'].map(path => `<url><loc>${siteUrl}${path}</loc></url>`).join('') : ''}</urlset>` });
      },
    }],
  };
});
