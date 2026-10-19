// Vite resolves supplied assets at build time; absent files become polished placeholders.
const assets = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png,webp,avif,svg,pdf}', { eager: true, query: '?url', import: 'default' });
export function assetUrl(path) {
  if (!path) return '';
  return path.startsWith('/src/assets/') ? (assets[path] || '') : path;
}
