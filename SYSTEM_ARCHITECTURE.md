# System Architecture — ngtrphuong.github.io

> Verified against the current repository source, GitHub Actions workflows, and the live site at [https://ngtrphuong.github.io/](https://ngtrphuong.github.io/) (checked 2026-07-17). Claims below are grounded in those sources only.

---

## 1. What this application is

A **personal website + blog + browser tools suite** for Phuong Nguyen (`ngtrphuong`).

| Fact | Value (from source / live site) |
|------|----------------------------------|
| Live URL | `https://ngtrphuong.github.io` |
| Repo | `https://github.com/ngtrphuong/ngtrphuong.github.io` |
| Default branch | `master` |
| Output model | Fully static (`output: 'static'` in `astro.config.ts`) |
| Hosting | GitHub Pages via the `gh-pages` branch |
| Package name | `ngtrphuong-blog` (`package.json`) |

Historical note: many layouts/components still comment that they “replace” old Jekyll `_layouts` / `_includes`. The **current** stack is Astro + Svelte, not Jekyll. Older blog posts that mention Jekyll describe past architecture and must not be treated as current deploy docs.

---

## 2. Technology stack

| Layer | Technology | Evidence |
|-------|------------|----------|
| Site generator | **Astro** (`astro` ^7) | `package.json`, `astro.config.ts` |
| Interactive UI | **Svelte 5** (`@astrojs/svelte`) | `package.json`, `svelte.config.js`, `*.svelte` |
| Content | **MDX / Markdown** content collections | `src/content.config.ts`, `src/content/blog/`, `src/content/tool-docs/` |
| Styling | Bootstrap 5 + Font Awesome + custom CSS | `BaseLayout.astro`, `src/styles/` |
| Search | **Orama** (client-side full-text) | `src/pages/search-index.json.ts`, `Search.svelte` |
| Images | Astro assets + Sharp | `astro.config.ts` (`image.service`) |
| Unit tests | Node.js test runner (`node --test`) | `package.json` → `npm test` |
| E2E tests | Playwright (Chromium) | `playwright.config.ts` |
| Comments | Giscus | `src/components/Giscus.astro` |
| Ads | Removed | — |
| Analytics | Removed | — |

**Runtime for tools:** almost all interactive tools run **entirely in the browser** (Web Crypto, WebAssembly, WebCodecs, Web Audio, Cache Storage, etc.). There is no application server.

---

## 3. High-level architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                     Authoring / Source                        │
│  src/content/blog/*.mdx   src/content/tool-docs/*.mdx         │
│  src/pages/**/*.astro     src/components/**                   │
│  src/scripts/tools/**     src/data/**                         │
└──────────────────────────────┬──────────────────────────────┘
                               │  npm run build (astro build)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Build-time (Node / Astro SSG)                 │
│  • Content collections validated (Zod schemas)                │
│  • getStaticPaths → HTML pages                                │
│  • search-index.json (Orama save)                             │
│  • feed.xml, sitemap                                          │
│  • public/ copied as-is (.nojekyll, dino, pdf worker)         │
└──────────────────────────────┬──────────────────────────────┘
                               │  dist/
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Pages (static hosting)                    │
│  Production: https://ngtrphuong.github.io/                    │
│  PR preview: .../pr-preview/pr-{N}/  (same gh-pages branch)   │
└──────────────────────────────┬──────────────────────────────┘
                               │  Browser
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Astro HTML shells + Svelte islands (client:load / only)      │
│  Orama search in-memory · Giscus                              │
└─────────────────────────────────────────────────────────────┘
```

### Layering inside the repo

| Path | Role |
|------|------|
| `src/pages/` | File-based routes + API endpoints (`feed.xml`, `search-index.json`) |
| `src/layouts/` | Page shells (`BaseLayout` → `PostLayout` / `ToolLayout` / …) |
| `src/components/` | Reusable Astro + Svelte UI |
| `src/components/tools/` | Tool UIs (Svelte islands) |
| `src/scripts/tools/` | Pure/browser logic used by tools (often unit-tested) |
| `src/content/` | Blog posts, tool docs, images |
| `src/data/` | Series config, tool listing helpers, donations data |
| `src/utils/` | Shared blog URL/date/tag helpers |
| `src/plugins/` | Rehype plugins (ad injection) |
| `public/` | Static assets copied verbatim into `dist/` |
| `tests/` | Unit (`*.test.ts`) and Playwright (`*.spec.ts`) |
| `.github/workflows/` | CI / deploy / PR preview / AI post trigger |

Path aliases (Vite + TypeScript): `@layouts`, `@components`, `@data`, `@utils`, `@images`, `@content`, `@scripts`, `@styles` — see `astro.config.ts` and `tsconfig.json`.

---

## 4. Content & routing model

### 4.1 Content collections (`src/content.config.ts`)

Two collections:

1. **`blog`** — `src/content/blog/**/*.{md,mdx}`  
   Frontmatter (Zod): `title`, optional `icon`, `tags`, `related` (references), `accent_color`, `date`, `ads`, `toc`, `manifest`, `redirect_from`, `description`, `image`.

2. **`toolDocs`** — `src/content/tool-docs/*.mdx`  
   Frontmatter: `title`, `description`, `icon`, `accent_color`, `quick_tool`, `listed`, `published`, `order`, `component`, `ads`, `manifest`.

### 4.2 Important URL conventions

| Resource | URL shape | Derived from |
|----------|-----------|--------------|
| Blog post | `/blog/YYYY/MM/DD/slug.html` | Filename `YYYY-MM-DD-slug.mdx` via `postUrlFromId()` |
| Blog list | `/blog/` then `/blog/page/N/` | 10 posts per page |
| Tags | `/blog/tags/{slug}/` | `tagSlug()` |
| Series | `/blog/series/{key}/` | `src/data/series.ts` |
| Tool | `/tools/{id}/` | `toolDocs` entry id + `published: true` |
| Search | `/search/` + `/search-index.json` | `Search.svelte` + endpoint |
| RSS | `/feed.xml` | `@astrojs/rss` |
| FGA page | `/FGA/` | `src/pages/FGA/index.astro` |
| Redirects | `/Captura/` → `/tools/captura/`, `/Fate-Grand-Automata/` → `/FGA/` | `astro.config.ts` `redirects` |

Site settings from `astro.config.ts`:

- `site: 'https://ngtrphuong.github.io'`
- `trailingSlash: 'ignore'` (legacy blog `.html` URLs + directory routes both work in `astro dev`)
- `base: process.env.ASTRO_BASE || '/'` (PR previews set `ASTRO_BASE`)
- `build.format: 'preserve'` (blog `[slug].astro` → `slug.html`; `index.astro` → directory `index.html`)

### 4.3 Layout hierarchy

```text
BaseLayout.astro          ← HTML head, Navbar, ViewTransitions
  ├─ PostLayout.astro     ← blog posts (TOC, series nav, Giscus)
  ├─ ToolLayout.astro     ← tools (header, share, Giscus)
  ├─ SeriesLayout.astro   ← series pages
  └─ PageLayout.astro     ← simple content pages (e.g. FGA)
```

MDX rendering goes through `RenderMDX.astro`, which remaps elements (`table`, `blockquote`, `pre`, `in-content-ad-marker`, plus custom `PostLink`, `Pintora`, `AlertInfo`, `Picture`).

---

## 5. Design patterns in use

Patterns below are named from observed code structure — not speculative frameworks.

### 5.1 Islands architecture (Astro + Svelte)

Pages are mostly static Astro HTML. Interactivity is hydrated as **islands**:

- `client:load` — most tools (Hash, JSON, QR, …)
- `client:only="svelte"` — Captura, LocalAI, Scratchpad (no SSR / heavy client APIs)

Evidence: `src/pages/tools/[id]/index.astro`.

### 5.2 Content-driven configuration

Tools are not hard-coded into the listing page. Metadata lives in MDX frontmatter; `getTools()` filters `published && listed` and sorts by `order`.

Blog posts are likewise collection-driven; series membership is a separate data map in TypeScript.

### 5.3 Component registry / dispatch

`component` frontmatter string selects the Svelte island via an explicit conditional map in `tools/[id]/index.astro`. Unknown keys throw at build time. This is a simple **registry / strategy** dispatch, not dynamic `import()` of arbitrary modules.

### 5.4 Nested layout composition

Layouts wrap each other (`ToolLayout` / `PostLayout` → `BaseLayout`) and use slots for page body and optional `head` content.

### 5.5 Explicit finite state machine (Captura)

`src/scripts/tools/captura/recorder-state-machine.ts` defines frozen `STATE` / `EVENT` sets and a `RecorderStateMachine` with a transition table (`state:event` → next state + effect). Used to coordinate recording lifecycle (IDLE → REQUESTING → COUNTDOWN → RECORDING → …).

### 5.6 Separation of UI and logic

| UI | Logic |
|----|-------|
| `src/components/tools/*.svelte` | `src/scripts/tools/*.ts` (+ `captura/` submodules) |

Unit tests target the logic modules (`tests/tools-*.test.ts`).

### 5.7 Build-time search index (offline-first)

At build, `src/pages/search-index.json.ts`:

1. Loads blog posts, tags, series, listed tools  
2. Inserts into Orama  
3. Serializes with `save()` to static JSON  

At runtime, `Search.svelte` `fetch`es that JSON, `load`s it, and searches locally.

### 5.8 Rehype AST transform

Ad injection via rehype was removed. Markdown/MDX renders without in-content ad markers.

### 5.9 Web Component for navbar behavior

`Navbar.astro` defines a custom element `site-navbar` for the mobile toggle (vanilla `HTMLElement`), keeping collapse logic outside Svelte.

### 5.10 Reusable CI workflows (`workflow_call`)

`build-site.yml` and `frontend-tests.yml` are callable workflows parameterized by `baseurl`, `testing`, and `artifact_name`. Used by both production deploy and PR preview.

### 5.11 Third-party scripts

Google AdSense and Google Analytics were removed from the site. Comments still use Giscus (`src/components/Giscus.astro`).

---

## 6. Exact deployment

### 6.1 Production path (push to `main` or `master`)

Workflow: `.github/workflows/deploy.yml`

```text
push → master/main
        │
        ├─► job build              → build-site.yml (production NODE_ENV)
        │                              npm ci → npm run build → npm test → artifact "site"
        │
        ├─► job build-for-testing  → build-site.yml (testing: true → NODE_ENV=development)
        │                              artifact "site-testing"
        │         │
        │         └─► job frontend-tests → frontend-tests.yml
        │                download site-testing → Playwright Chromium + ffmpeg → npm run test:e2e
        │
        └─► job deploy (needs: build AND frontend-tests)
               download artifact "site"
               JamesIves/github-pages-deploy-action@v4
                 folder: ./dist
                 branch: gh-pages
                 clean-exclude: pr-preview
```

**Exact publish target:** contents of `dist/` are committed to the **`gh-pages`** branch. GitHub Pages serves that branch at `https://ngtrphuong.github.io`.

`public/.nojekyll` is present so GitHub Pages does not run Jekyll on the published files.

CI Node version: **22** (`actions/setup-node` in `build-site.yml`). README documents local Node **20+**.

### 6.2 PR preview path

Workflow: `.github/workflows/pr-preview.yml`

| Step | Detail |
|------|--------|
| Trigger | PR opened / reopened / synchronize / closed |
| Build base | `ASTRO_BASE=/pr-preview/pr-{number}` |
| Mode | `testing: true` (no AdSense/GA) |
| Deploy action | `rossjrw/pr-preview-action@v1` |
| Preview branch | `gh-pages` |
| Preview URL | `https://ngtrphuong.github.io/pr-preview/pr-{NUMBER}/` |
| Cleanup | On PR close, preview is removed; production deploy keeps `pr-preview` via `clean-exclude` |

### 6.3 Other automation

| Workflow | Purpose |
|----------|---------|
| `ai-blog-post.yml` | Manual `workflow_dispatch`: creates a GitHub issue assigned to Copilot with blog-writing instructions (`COPILOT_PAT` secret) |
| `pr-frontend-tests.yml` | PR-focused frontend test pipeline |
| `copilot-setup-steps.yml` | Preinstalls deps/tools for Copilot coding agent |
| `dependabot.yml` | Dependency update PRs |

### 6.4 Local build / validate (canonical)

From README / Copilot instructions:

```bash
NODE_ENV=development npm run build   # 1 — required before tests that read dist/
npm test                             # 2 — Node unit tests
npm run check                        # 3 — astro check + svelte-check
npm run test:e2e                     # 4 — Playwright against dist/ on :4000
```

Playwright serves `dist/` with `python3 -m http.server 4000` (`playwright.config.ts`).

---

## 7. Feature subsystems (concise)

### Blog

- 80 `.mdx` posts under `src/content/blog/` (count at doc time).
- Pagination: 10 posts/page.
- Series: `blogging-with-jekyll`, `browser-hacks` in `src/data/series.ts` (+ per-series modules).
- Related posts via content `reference('blog')`.
- In-post widgets under `src/components/blog/` (Chrome Dino demos, bookmarklet helpers, etc.).

### Tools

Published tools are wired by `component` key. Listing uses `listed: true`. Examples of `listed: false` but still routable when `published: true`: **Diff**, **LocalAI** (reachable by URL, hidden from `/tools/` and home “Quick Tools”).

Orphan/incomplete MDX without frontmatter exists (`llm.mdx`, `tokenizer.mdx`) — schema defaults leave `published: false`, so they are not built as tool pages.

Tool logic often prefers client-side libraries: `spark-md5`, `qrcode`, `diff`/`diff2html`, `@imagemagick/magick-wasm`, `mediabunny`, `@huggingface/transformers`, etc. (`package.json`).

### Search

Indexes: posts, tag pages, series pages, listed tools → `/search-index.json`.

### Comments

- Comments: Giscus mapped to repo `ngtrphuong/ngtrphuong.github.io`, category `Announcements`, `data-mapping="pathname"`

---

## 8. How to customize (detailed)

### 8.1 Add a blog post

1. Create `src/content/blog/YYYY-MM-DD-slug.mdx` (prefer `.mdx`).
2. Frontmatter minimum:

```yaml
---
title: "Your Title"
description: "Short summary for SEO / cards"
tags: [example]
# optional: icon, accent_color, date, ads, toc, related, image
---
```

3. Body: Markdown/MDX. Use remapped components as needed (`Pintora`, `AlertInfo`, `PostLink`, …).
4. To place in a series: add the post id (`/blog/YYYY/MM/DD/slug` **without** `.html`) to the correct series module under `src/data/series/`.
5. Validate: `NODE_ENV=development npm run build && npm test`.

URL month/day are **zero-padded** even if the filename uses single digits.

### 8.2 Add a new browser tool

1. **Logic** (optional but preferred): `src/scripts/tools/my-tool.ts` + `tests/tools-my-tool.test.ts`.
2. **UI**: `src/components/tools/MyTool.svelte`.
3. **Docs/metadata**: `src/content/tool-docs/my-tool.mdx`:

```yaml
---
title: "My Tool"
description: "One-line description"
icon: "fas fa-wrench"
quick_tool: false      # true → appears in home Quick Tools
listed: true           # false → URL works, hidden from /tools/
published: true        # false → no page generated
order: 20
component: "my-tool"   # must match registry key below
ads: true
---
```

4. **Register** in `src/pages/tools/[id]/index.astro`: import the Svelte component and add a `toolComponentKey === 'my-tool'` branch (`client:load` or `client:only` as appropriate).
5. Rebuild and test.

### 8.3 Change site chrome / branding

| What | Where |
|------|--------|
| Site URL / base / redirects | `astro.config.ts` |
| Navbar links / brand text | `src/components/Navbar.astro` |
| Home hero, project cards, social links | `src/pages/index.astro` |
| Global CSS | `src/styles/styles.css`, `src/styles/blog.css` |
| Favicon | `public/images/favicon.ico` |
| Avatar / content images | `src/content/images/` (import via `@images`) |

### 8.4 Series

1. Define series object in `src/data/series/<name>.ts` matching `Series` in `src/data/series/types.ts`.
2. Register key in `SERIES_CONFIG` inside `src/data/series.ts`.
3. Post ids must be unique across series (build throws if duplicated).

### 8.5 Comments

| Knob | File / env |
|------|------------|
| Giscus repo/category/theme | `src/components/Giscus.astro` |

### 8.6 Search behavior

| Change | File |
|--------|------|
| What gets indexed | `src/pages/search-index.json.ts` |
| Markdown stripping | `src/scripts/search-index.ts` → `stripMarkdown` |
| UI / query | `src/components/Search.svelte` |
| Content length cap | `MAX_CONTENT_LENGTH = 2000` in the endpoint |

### 8.7 Deploy / preview behavior

| Change | File |
|--------|------|
| Production deploy gates | `.github/workflows/deploy.yml` |
| Build env / Node / artifacts | `.github/workflows/build-site.yml` |
| E2E in CI | `.github/workflows/frontend-tests.yml` |
| PR preview base path | `.github/workflows/pr-preview.yml` (`baseurl` input) |

Do **not** edit `dist/` or `gh-pages` by hand for normal releases — push to `master` and let Actions publish.

### 8.8 Static assets & embeds

| Asset | Path |
|-------|------|
| Chrome Dino offline game | `public/dino/` |
| PDF worker for PDF tool | `public/tools/pdf/pdf.worker.js` |

### 8.9 Funding / Copilot automation

- Sponsors button config: `.github/FUNDING.yml`
- AI post generator: `.github/workflows/ai-blog-post.yml` (requires `COPILOT_PAT`)

---

## 9. Testing map

| Command | What it covers |
|---------|----------------|
| `npm test` | Logic under `tests/*.test.ts` (many tools + search index file presence in `dist/`) |
| `npm run test:e2e` | Browser flows in `tests/**/*.spec.ts` and top-level `*.spec.ts` |
| `npm run check` | Astro + Svelte type/check |

Known operational constraints (from `.github/copilot-instructions.md`):

- Run build before `npm test` (needs `dist/search-index.json`).
- Install Playwright Chromium before e2e.
- Some AV tests need `ffprobe` (FFmpeg); CI installs it.

---

## 10. Mental model for contributors

1. **Content first** — posts and tool docs are data; pages are thin routers.
2. **Static forever** — no SSR server; anything interactive must work in the browser after `astro build`.
3. **Respect `BASE_URL`** — always use `import.meta.env.BASE_URL` for internal links so PR previews work.
4. **Register tools explicitly** — frontmatter `component` alone is not enough; wire the Svelte island in `tools/[id]/index.astro`.
5. **Deploy is gated** — production HTML only ships after a green production build **and** Playwright against a testing build.

---

## 11. Source-of-truth checklist (anti-hallucination)

When updating this document, re-verify against:

- [ ] `package.json` (versions / scripts)
- [ ] `astro.config.ts` (site, base, output, integrations)
- [ ] `src/content.config.ts` (schemas)
- [ ] `.github/workflows/deploy.yml` + `build-site.yml` + `pr-preview.yml`
- [ ] `src/pages/tools/[id]/index.astro` (tool registry)
- [ ] Live site smoke check: `/`, `/tools/`, `/blog/`, `/search/`

---

## 12. Cursor / agent rules

Executable AI coding rules live in **`.cursor/rules/*.mdc`** (see `.cursor/rules/README.md`). Root `.cursorrules` is a pointer only.

Always-on security/governance rules selectively adapt [Arcanum sec-context](https://github.com/Arcanum-Sec/sec-context) + [OWASP Secure Coding with AI](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.md) for this **static, browser-tool** threat model (XSS, secrets, slopsquatting, file/audio handling, PII in transcripts) — not the full upstream corpora.

*Generated from repository inspection and live-site verification. Prefer updating this file when architecture or deploy topology changes.*
