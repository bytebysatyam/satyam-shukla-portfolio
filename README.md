# Satyam Shukla — Full Stack Developer Portfolio

A professional portfolio for full-time software opportunities and freelance business software enquiries. It presents supplied experience, training and projects without fabricated metrics, dates, repositories or testimonials. Designed to look complete before photos, screenshots and the resume are supplied.

## Stack and setup

React 19, Vite, JavaScript, React Router, Lucide React and modern CSS. Node.js 20.19+ or Node.js 22.12+ recommended. Google Fonts are optional network-loaded enhancements; system sans-serif fallbacks work offline.

```bash
cd satyam-portfolio
npm install
npm run dev
```

Open the Local URL printed by Vite (normally `http://127.0.0.1:5173`).

```bash
npm run test
npm run build
npm run preview
```

Build output is `dist/`. Preview normally uses `http://127.0.0.1:4173`.

## Routes and sections

- `/`: hero, professional strengths, selected work, experience, credentials, services, work process, skills, team strengths, about and contact.
- `/work/india-trade-overseas`: complete ITO contribution case study with frontend/backend work, data handling, integrations, production work, engineering learnings and screenshot gallery.
- Unknown paths: helpful 404 page.

The mobile navigation supports keyboard operation and Escape. Resume dialogs use native modal focus handling. Focus states, a skip link and reduced-motion support are included.

## Editing content

| Content | File |
| --- | --- |
| Name, email, LinkedIn, GitHub, phone, availability, bio, profile photo, resume | `src/data/profile.js` |
| Experience, editable dates, responsibilities | `src/data/experience.js` |
| Projects, case study copy, image paths, repository/live links | `src/data/projects.js` |
| Services | `src/data/services.js` |
| Skills | `src/data/skills.js` |
| Visual design and responsive rules | `src/styles/globals.css` |
| Homepage hero | `src/components/Hero.jsx` |

Experience dates intentionally remain empty until you provide them. They are hidden when empty. The optional phone field is empty; call/WhatsApp links appear only when a number is configured. Use an international number with country code. No location or years-of-experience claim is assumed.

Project `repo` and `live` links remain hidden when empty. Add only real, public URLs. Supporting project features are in expandable implementation details. A generic fourth project is disabled in data; add verified details before setting `enabled: true`.

To add a supporting project, copy the THDC object in `projects.js`, use a unique `id`, supply actual content, tags, screenshot path and optional links. The homepage renders enabled entries automatically. The dedicated ITO route uses the first project and its `sections`/`screenshots`; preserve that entry first unless also updating the route component.

Credentials reflect the supplied experience and training. Certificate links are optional. Configure verified certificates with `name`, `detail` and `file` in `profile.js`; the blank `additionalCertificate` object is an editable, hidden placeholder.

## Replace the asset placeholders

Add real files to these exact paths inside this project. The `.jpg` files intentionally do not exist yet; no fake JPEGs or human portraits are generated.

| Asset | Exact path |
| --- | --- |
| Profile photo (used in hero and about) | `src/assets/profile/profile.jpg` |
| ITO homepage | `src/assets/projects/ito/home-placeholder.jpg` |
| ITO product page | `src/assets/projects/ito/product-placeholder.jpg` |
| ITO enquiry form | `src/assets/projects/ito/lead-placeholder.jpg` |
| ITO CRM / dashboard | `src/assets/projects/ito/crm-placeholder.jpg` |
| ITO quotation / lead workflow | `src/assets/projects/ito/quotation-placeholder.jpg` |
| ITO payment journey | `src/assets/projects/ito/payment-placeholder.jpg` |
| ITO mobile view | `src/assets/projects/ito/mobile-placeholder.jpg` |
| THDC project UI | `src/assets/projects/thdc/ui-placeholder.jpg` |
| Gesture Mouse demo | `src/assets/projects/gesture-mouse/demo-placeholder.jpg` |

You can instead change paths in the data files. Supported source assets: JPG, JPEG, PNG, WebP, AVIF and SVG. Vite’s asset glob detects files, returns production-safe URLs and excludes missing files. Restart development/rebuild after adding assets. Screenshots load lazily, and unavailable or failed images fall back to designed placeholders. The ITO homepage preview starts as a clearly labeled illustrative workflow diagram, not a fabricated screenshot. Optimize images before adding them; use a sensible resolution, ideally under 250 KB each. Only use public or approved project visuals with private information removed.

## Resume PDF — exact path

Place your actual PDF at:

```text
D:\Portfolio\satyam-portfolio\public\resume\Satyam-Shukla-Resume.pdf
```

Its public URL is `/resume/Satyam-Shukla-Resume.pdf`. No fake PDF is created. All View Resume buttons open an accessible modal which checks the response’s PDF signature, so an SPA fallback page cannot be mistaken for a resume. When absent, the modal offers an email request. When present, it offers Open PDF and Download. Replace the file and rebuild to publish an updated copy.

## Contact form

Required fields have client-side validation. Freelance selection reveals an optional project type. Submitting **prepares** an encoded mailto draft and reveals an **Open email draft** link. The visitor must open their configured email app, review the draft and send it themselves. The website never claims delivery or stores submissions. A direct email link and copy button remain available if a mail app is unavailable. The message is limited to 2,000 characters for reasonable mailto lengths; client support for very long drafts can vary.

`src/lib/contact.js` isolates validation and draft construction for replacement with a real backend/service later. If connecting one, keep credentials on a server and show delivery success only after a successful response; add spam controls and appropriate privacy wording.

## SEO and deployment

Set your real public origin before deployment:

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SITE_URL=https://your-real-domain` (origin only).
3. Run `npm run build`.

The build generates `robots.txt` and `sitemap.xml`. The sitemap is deliberately empty until a real origin is configured; no fabricated domain is used. Canonical and Open Graph URLs become available when configured. Titles/descriptions, Open Graph and Twitter summary metadata, favicon and factual Person JSON-LD are included. Client navigation updates route metadata. An actual social preview image can be added later if desired.

Deploy `dist/` to any static host with SPA support. Configure the build command as `npm run build` and output directory as `dist`. A Netlify/Cloudflare Pages style `_redirects` file is supplied for client routes. For Vercel, an included `vercel.json` handles the same fallback. For Nginx, use `try_files $uri $uri/ /index.html;`. Other hosts need an equivalent rewrite so direct case-study links and reloads work. Deploy at the domain root, or adapt Vite `base` and router basename for subdirectory hosting.

No hosting account is created and nothing is publicly deployed as part of this local project build.

## Verification

`npm test` covers required field validation, email encoding, line breaks and conditional project-type inclusion. `npm run build` verifies imports and generates deployable assets. The build also writes a dedicated case-study HTML entry so direct links include its title and social metadata before JavaScript runs.

For optional automated browser QA, start `npm run dev`, then run `npm run test:browser` in another terminal. This uses your existing Windows Chrome installation in headless mode with a separate ignored browser profile; it does not install a browser. Override `CHROME_PATH` for another Chrome/Chromium path and `QA_ORIGIN` for another local server URL. The script checks both routes at 360, 390, 768, 1024 and 1440 widths, mobile navigation, resume fallback, form validation/draft generation, social links, metadata, placeholders, 404 behavior and runtime exceptions. It writes screenshots and a report to ignored `test-results/`. It does not send email. These checks expect the initial missing-resume state; adapt that assertion once your real PDF is added.

No performance score is claimed without an actual Lighthouse run.

Before launch, provide the real resume, approved photos/screenshots, experience dates and deployment domain. Public repository links, certificate files and phone number are optional. Review all supplied contribution descriptions for accuracy and permission to disclose.
