import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { siteMetadata } from '../src/data/profile.js';

// Give direct case-study requests the right metadata before JavaScript runs.
const title = siteMetadata.caseTitle;
const description = siteMetadata.caseDescription;
let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*("\s*\/?>)/g, `$1${description}$2`)
  .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*("\s*\/?>)/g, `$1${title}$2`)
  .replace(/(<link rel="canonical" href=")([^"]*?)("\s*\/?>)/, (_, start, origin, end) => `${start}${origin.replace(/\/$/, '')}/work/india-trade-overseas${end}`)
  .replace(/(<meta property="og:url" content=")([^"]*?)("\s*\/?>)/, (_, start, origin, end) => `${start}${origin.replace(/\/$/, '')}/work/india-trade-overseas${end}`);
await mkdir(new URL('../dist/work/india-trade-overseas/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/work/india-trade-overseas/index.html', import.meta.url), html);
console.log('Generated case-study HTML with route-specific SEO metadata.');
