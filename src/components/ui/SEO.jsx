import { useEffect } from 'react';

export default function SEO({ title, description, path = '/' }) {
  useEffect(() => {
    document.title = title;
    function meta(selector, content, attributes) {
      let node = document.head.querySelector(selector);
      if (!node) { node = document.createElement('meta'); Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value)); document.head.appendChild(node); }
      node.setAttribute('content', content);
    }
    meta('meta[name="description"]', description, { name: 'description' });
    meta('meta[property="og:title"]', title, { property: 'og:title' });
    meta('meta[property="og:description"]', description, { property: 'og:description' });
    meta('meta[name="twitter:title"]', title, { name: 'twitter:title' });
    meta('meta[name="twitter:description"]', description, { name: 'twitter:description' });
    if (import.meta.env.VITE_SITE_URL) {
      const url = `${new URL(import.meta.env.VITE_SITE_URL).origin}${path}`;
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
      canonical.href = url;
      meta('meta[property="og:url"]', url, { property: 'og:url' });
    }
  }, [title, description, path]);
  return null;
}
