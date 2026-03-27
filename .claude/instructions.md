# Claude Instructions — Synkope Website

## Rules

- **Work documents, plans, analysis files, and to-do lists must only be created inside `.claude/`.** Never create documentation or planning files in the project root or any other directory.
- All user-facing content is written in Norwegian (Bokmål).
- Code, comments, commit messages, and files in `.claude/` are written in English.
- **Always run the Playwright tests locally before pushing to CI.** Run `npx playwright test --project=chromium` and confirm they pass before committing.
- **Use conventional commit format for all commits:** `type(scope): short description`. Types: `feat`, `fix`, `refactor`, `test`, `ci`, `docs`, `chore`, `style`. Example: `fix(nav): correct aria-expanded toggle on hamburger`.
- **Keep commits targeted and atomic.** Each commit must address exactly one problem, fix, or improvement. Related changes across multiple files are fine if they all serve the same single purpose — e.g. a bug fix that touches HTML, JS, and CSS together is one commit. What is forbidden is bundling unrelated concerns: do not mix a bug fix with a refactor, a refactor with a CI change, or a feature with a style cleanup. Stage files deliberately; never use `git add .` or `git add -A`.
- **Fix mistakes by amending the original commit, not by stacking correction commits.** If a commit introduced a problem, use `git commit --fixup=<hash>` and then `git rebase -i --autosquash` to fold the fix into the original commit before pushing. A PR should never contain commits like "fix typo in previous commit" or "forgot to update test" — the original commit should simply be correct.
- **Commit messages must describe the actual change, not the planning context.** Never reference documents, plans, phases, or roadmap items (e.g. do not write "Phase 1", "per improvement plan", "as per TODO"). Describe what changed and why, not where it came from.
- Do not introduce a build step. The site is served as-is — HTML, CSS, and JS files are deployed directly.
- Do not add frameworks, bundlers, or npm runtime dependencies. The stack is intentionally plain HTML + CSS + vanilla JS.
- Keep all JavaScript in `js/script.js`. Do not split it into modules unless explicitly asked.
- Keep all styles in `css/style.css`. Do not split it into multiple files unless explicitly asked.

## Project Overview

Website for Synkope, a Norwegian consulting company based in Oslo. The site is static, built with plain HTML, CSS, and vanilla JavaScript, and deployed to GitHub Pages.

**Live site:** https://synkope.github.io/synkope-website/

**Services offered:**
- IT Infrastructure (`tjenester/it-infrastruktur.html`)
- Project Management (`tjenester/prosjektstyring.html`)
- Information Security (`tjenester/informasjonssikkerhet.html`)
- EMC Testing (`tjenester/emc.html`)

## Tech Stack

- HTML5 — semantic markup, no templating engine
- CSS3 — custom properties, Flexbox, Grid
- Vanilla JavaScript — single `js/script.js` file
- Playwright — end-to-end tests in `tests/`
- GitHub Actions — CI (`.github/workflows/ci.yml`) and deploy (`.github/workflows/deploy.yml`)
- Formspree — contact form backend

## Key Conventions

- CSS custom properties for all colours and spacing are defined in `:root` in `css/style.css`
- `js/script.js` uses a **single** `DOMContentLoaded` listener
- Scroll handling is done through a **single** RAF-throttled `handleScroll()` dispatcher
- Global configuration constants live in the `CONFIG` object at the top of `script.js`
- Service pages in `tjenester/` share a common HTML structure — keep them consistent
- External links must have `rel="noopener noreferrer"` and `target="_blank"`

## File Layout

```
synkope-website/
├── index.html                   # Main / home page
├── css/style.css                # All styles
├── js/script.js                 # All JavaScript
├── images/                      # Images and icons
├── content/no.json              # Norwegian content loaded by ContentLoader
├── tjenester/                   # Four service detail pages
├── tests/                       # Playwright e2e tests
├── scripts/                     # Build / utility scripts
├── .github/workflows/           # CI and deploy pipelines
├── .well-known/                 # Security and MTA-STS files
├── .claude/                     # Claude context — NOT deployed
│   ├── instructions.md          # ← this file (tracked in git)
│   ├── IMPROVEMENT_PLAN.md      # Full phased improvement roadmap
│   ├── TODO.md                  # Outstanding content and UX tasks
│   └── ...                      # Other work documents (git-ignored)
└── README.md
```

## Improvement Status

Full roadmap: `.claude/IMPROVEMENT_PLAN.md`
Active branch: `improvement/phase-1-and-2`

### Completed
- **Phase 1 — Critical fixes:** filename mismatch, Loading… flash, contact form, deploy pipeline, broken tests
- **Phase 2 — Quality & reliability:** skip-nav, hamburger a11y, service page `<head>`, JS/CSS cleanup, unified scroll handler, full CI test suite

### Up next — Phase 3 (Architecture & Performance)
- Resolve dual-source content problem (HTML hardcoded vs `content/no.json`)
- Reduce HTML duplication across the four service pages
- Audit and remove remaining unused CSS
- Minification and font-loading optimisation in the deploy pipeline
- Generate and serve WebP images
- Fix and automate `sitemap.xml`
- Add Playwright tests for service pages