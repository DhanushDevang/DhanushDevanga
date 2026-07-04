# Dhanush R Devang — Portfolio

A production-ready recruiter-focused portfolio, built as a "monitoring dashboard" for a systems/backend/AI engineer — status tags, a system-health-style scroll bar, and dashboard-style stat cards instead of a generic brochure layout.

## Stack
React 19 · Vite · TypeScript · Tailwind CSS v4 · Framer Motion · Lenis smooth scroll · React Icons · React Router

## Getting started
```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

## Where to edit content
Everything is data-driven — no content is hardcoded in components. Edit these files in `src/data/`:

| File | Controls |
|---|---|
| `portfolio.ts` | Name, roles, bio, headline, journey timeline |
| `socials.ts` | GitHub / LinkedIn / WhatsApp / Email / Instagram links |
| `projects.ts` | All project cards (title, problem, features, stack, links) |
| `skills.ts` | Skill categories |
| `experience.ts` | Job simulations / experience timeline |
| `education.ts` | Education timeline |
| `quotes.ts` | Random quote pool (add your real quotes here) |
| `achievements.ts` | Patents / awards |
| `certifications.ts` | Certification list |
| `stats.ts` | Hero stat cards (GitHub repo count is pulled live) |

## Things you still need to do

1. **Hero visual** — no portrait was provided, so the hero currently uses an abstract "system status" panel instead of a photo. To add your photo:
   - Drop your image into `src/assets/` (e.g. `portrait.jpg`)
   - In `src/components/sections/Hero.tsx`, replace the `glass relative mx-auto aspect-[4/5]...` panel's contents with an `<img>` tag, keeping the overlay/gradient divs on top of it for the dark-blur effect described in the brief.

2. **Resume file** — put your actual PDF at `public/resume.pdf` (the Download Resume buttons already link to `/resume.pdf`).

3. **Real project details** — `projects.ts` has full detail for **Contract Shield** (from your brief) and reasonable drafts for the other four (AI Vehicle Health Monitoring, Real-Time Messaging Platform, Weather Monitoring, Pet Boarding site — the messaging platform draft pulls from your WhatsApp clone work). Replace the `problem`, `features`, `results`, and add real `githubUrl` / `demoUrl` links.

4. **Quotes** — `quotes.ts` has 5 placeholder quotes in your voice. Swap in your real ones (the brief calls for "every quote provided by the user," but none were included in the prompt).

5. **Contact form** — currently opens a pre-filled `mailto:` link as a working fallback (no backend needed). To use EmailJS or Resend instead, replace the `handleSubmit` logic in `src/components/sections/Contact.tsx`.

6. **Domain-specific URLs** — `index.html`, `public/robots.txt`, and `public/sitemap.xml` reference a placeholder domain (`https://dhanushdevang.dev`). Swap in your real deployed URL before going live.

7. **OG image** — `index.html` references `/og-image.png` for social share previews; add a 1200×630 image at `public/og-image.png`.

## Deploying to Vercel
```bash
npm run build
```
Push to GitHub and import the repo in Vercel — it auto-detects Vite. Framework preset: **Vite**, build command `npm run build`, output directory `dist`.

## Accessibility & performance notes
- All interactive elements have visible focus states and `aria-*` labels.
- `prefers-reduced-motion` disables Lenis smooth scroll and non-essential animation.
- GitHub API responses are cached in `sessionStorage` for 30 minutes to avoid rate-limiting and redundant fetches.
- Images use `loading="lazy"` where applicable; add real `width`/`height` to your resume/portrait assets once added to prevent layout shift.
