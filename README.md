# Satyam Shukla — Full Stack Developer

A professional portfolio for full-time software applications, recruiter/startup outreach and freelance business software enquiries. It presents supplied development experience and projects without invented dates, ownership claims, testimonials or metrics.

Live portfolio: https://satyam-shukla-portfolio-jet.vercel.app/

Repository: https://github.com/bytebysatyam/satyam-shukla-portfolio

## Setup

React 19, Vite, JavaScript, React Router, Lucide React and modern CSS. Use Node.js 22.12+ (Node.js 22.18 was used for verification). System fonts avoid external font downloads. No backend or database is needed to serve this portfolio.

```bash
git clone https://github.com/bytebysatyam/satyam-shukla-portfolio.git
cd satyam-shukla-portfolio
npm ci
npm run dev
```

For the existing local workspace, start in `D:\Portfolio\satyam-portfolio`. `npm install` is appropriate when dependency inputs change; `npm ci` reproduces the committed lockfile.

```bash
npm test
npm run build
npm run preview
```

Development normally uses http://127.0.0.1:5173/; production preview normally uses http://127.0.0.1:4173/. The build output is `dist/`. No lint command is configured.

## Routes and content

- `/`: hero, professional strengths, selected work, experience/credentials, services, process, skills, team strengths, about and contact.
- `/work/india-trade-overseas`: contribution case study with frontend/backend work, data handling, integrations, production debugging, engineering learnings and the live company website.
- Unknown paths: professional 404 view with `noindex` metadata and a route home. On SPA hosts, unknown paths may have an HTTP 200 fallback while the client shows the 404 view.

The mobile menu supports Escape, outside-click dismissal, focus containment, section navigation and body-scroll locking. Resume dialogs use native modal focus handling, explicit Escape dismissal and focus return. The profile photo appears only in the hero; About uses an engineering approach panel.

## Central configuration

| Content | File |
| --- | --- |
| Identity, positioning, phone, WhatsApp, email, social links, repository, website, resume, bio, credentials and metadata | `src/data/profile.js` |
| Experience, dates and responsibilities | `src/data/experience.js` |
| Projects, case study, contribution details, image labels and live/repository links | `src/data/projects.js` |
| Services | `src/data/services.js` |
| Skills | `src/data/skills.js` |
| Design and all responsive rules | `src/styles/globals.css` |

`profile.phones` contains both supplied numbers: +91 96708 21668 and +91 89578 79657. Each entry generates both a Call Me action and a WhatsApp action. Keep numbers in international format; `display` controls presentation only. Remove an entry to hide that number, or use an empty array to hide all call/WhatsApp actions. Dialing and WhatsApp URLs are normalized from this single configuration. All public contact details intentionally appear in the portfolio.

Experience dates remain empty until verified. Optional certificates are hidden until named; certificate links render only when a valid path is supplied. No certificate IDs or additional credentials are assumed.

## Images and authenticity

| Asset | Location | How it is presented |
| --- | --- | --- |
| Profile photo | `src/assets/profile/profile.jpg` | Hero only; high-priority loading, responsive crop; the original face/file is not edited |
| THDC visual | `src/assets/projects/thdc/ui-placeholder.jpg` | “Illustrative UI reconstruction,” with a note that generated figures are not project metrics |
| Gesture Mouse visual | `src/assets/projects/gesture-mouse/demo-placeholder.jpg` | “Project demo visual,” explicitly labeled generated rather than a captured live demonstration |
| Optional ITO screenshots | `src/assets/projects/ito/` | Only approved, present files render |

Both generated visuals are actual optimized JPEG files (roughly 215 KB and 175 KB) at 1280px width. They load lazily with a consistent 16:9 frame and descriptive alt text; the full visual is contained without stretching. Any apparent “live demo” wording or numbers inside the supplied generated images are illustrative, as their captions explain.

ITO currently has no screenshots in the repository. Its **Visit Live Website** link goes to https://www.indiatradeoverseas.com/. An illustrative workflow fills the flagship card; no missing screenshot gallery is shown. The source code is proprietary, so ITO never exposes a GitHub/source action.

If you later add approved ITO screenshots, use `home-placeholder.jpg`, `product-placeholder.jpg`, `lead-placeholder.jpg`, `crm-placeholder.jpg`, `quotation-placeholder.jpg`, `payment-placeholder.jpg` or `mobile-placeholder.jpg`, or edit the paths in `projects.js`. Only present images appear. Remove all private/customer data before including a real screenshot. Images are not required to use the live website link.

Source image paths resolve through Vite’s asset glob. Supported source formats are JPG, JPEG, PNG, WebP, AVIF and SVG. Missing paths or load failures use a designed fallback, never a broken-image icon. Restart development/rebuild when adding files.

The optional Windows helper `scripts/optimize-project-images.ps1` re-encodes only the two supplied project illustrations. Original files are preserved under ignored `.asset-originals/`; the profile photo is untouched. It always reads from the saved originals, so repeated runs do not repeatedly compress an already compressed image.

## Resume

The actual supplied PDF is included at:

```text
public/resume/Satyam-Shukla-Resume.pdf
```

Local absolute path: `D:\Portfolio\satyam-portfolio\public\resume\Satyam-Shukla-Resume.pdf`.

Every View Resume/Download Resume trigger opens an accessible dialog and checks the response's `%PDF-` signature, preventing an SPA fallback document from being mistaken for a PDF. Valid files expose View Resume in a new tab and a Download Resume link with the download attribute. If the file is missing, corrupt or unavailable, the dialog hides those links and offers an email request. Actual download handling depends on the visitor's browser/PDF settings. Replace the PDF and rebuild to update it.

## Contact

Email Me, Call Me, WhatsApp, LinkedIn and GitHub links are generated from the profile configuration. WhatsApp includes a professional prefilled message; the site does not send it automatically. Hiring and freelance paths select the relevant reason in the contact form. Copy-email feedback reflects whether the clipboard call succeeded.

The form validates name, email, a recognized reason and a useful message. Freelance selection reveals an optional project-type field. Submitting prepares an encoded **Open email draft** link; the visitor must open an email app, review it and send it themselves. No submission is stored or sent by this website, and no delivery-success message is shown. Direct contact links remain available if no email app is configured.

The message limit is 2,000 characters; mailto support for long drafts varies by client. `src/lib/contact.js` isolates validation/draft construction for later backend integration. Keep any future service credentials server-side and show delivery success only after a successful service response.

## SEO and Vercel deployment

`profile.website` is configured with the owner's supplied Vercel origin. Optional `VITE_SITE_URL` in `.env.local` or the hosting environment overrides it; `.env.example` documents that override without credentials. Do not set it to the ITO company domain. Change the central website value/environment override if the portfolio's deployment origin changes.

The build generates canonical URLs, Open Graph/Twitter summary metadata, `robots.txt`, a two-route `sitemap.xml` and factual Person JSON-LD with the supplied name, title, email, telephone, website and social URLs. A dedicated case-study HTML entry provides route-specific titles/social metadata before JavaScript runs. Client navigation updates metadata; the 404 view is `noindex`. The profile photo is never used for Open Graph. No rating, award, invented location or experience duration is added.

Vercel settings:

- Framework preset: Vite
- Root directory: repository root
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` supplies the nested case-study rewrite, SPA fallback and basic response headers. Public asset/resume paths are excluded from the SPA rewrite so a missing PDF does not become the homepage. Hashed build assets use immutable caching. Test a direct case-study URL and reload after deployment; local preview verifies the generated HTML, but the hosting provider's configuration is only fully verified on the deployed site.

For Netlify/Cloudflare Pages, `public/_redirects` supplies the SPA fallback. For Nginx, use `try_files $uri $uri/ /index.html;`. Deploy at the origin root; subdirectory hosting requires corresponding Vite/router configuration. Pushing to GitHub may trigger an existing Vercel integration, but a successful Git push alone does not prove deployment success.

## Adding projects

Copy a supporting project object in `src/data/projects.js`, assign a unique ID and add only real details. Configure `screenshot`, `visualAlt`, `visualLabel` and `visualNote` to distinguish actual screenshots from illustrations. Optional `details` supports problem, solution, role and learnings inside the implementation disclosure; `features` and `tags` support recruiter scanning. Repository and live actions stay hidden for empty URLs. Never expose a proprietary repository. Keep ITO first unless updating its dedicated case-study component. The generic future project remains disabled until actual content is supplied.

## Verification and limitations

`npm test` runs contact validation/draft unit tests. `npm run build` checks imports, emits production assets and writes route HTML. `npm run test:browser` is an optional, dependency-free headless Chrome audit of the local production preview. It covers 320, 360, 375, 390, 430, 768, 1024, 1280, 1440 and 1600px; menu keyboard/outside-click behavior, one profile photo, image loading and error fallbacks, real/missing resume responses, form drafts, contact links, accessible control names, canonical tags, case study, 404 and no-JavaScript contact fallback. It does not send email, make calls or open WhatsApp conversations.

Start `npm run preview`, then run `npm run test:browser` in another terminal. Set `QA_ORIGIN` to use another server; set `CHROME_PATH` to use another installed Chrome/Chromium binary. Each run uses a separate ignored browser profile and writes screenshots plus a report to ignored `test-results/`. The report is written only if the whole audit passes.

The current final-pass build and unit tests passed. The requested Chrome audit was declined, so the final visual/interactive browser checks remain unverified. No Lighthouse score or exhaustive accessibility certification is claimed. External GitHub/LinkedIn/deployed-site availability could not be fully verified from this environment. The supplied official ITO website was accessible during the external link check.

Remaining owner input is optional: verified experience dates, public supporting-project repositories, certificates and approved ITO screenshots. Review your resume/content as it changes and confirm the deployed Vercel build after pushing. No secrets or local-only verification/cache/browser files should be committed.
