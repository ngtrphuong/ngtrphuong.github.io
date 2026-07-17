# Cursor rules for this project

## Why `.cursor/rules/*.mdc` (not a giant `.cursorrules`)

Per [PatrickJS/awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) and current Cursor docs (2026):

- Agent mode loads **`.cursor/rules/*.mdc`**
- Legacy root **`.cursorrules`** is often ignored in Agent mode
- Prefer **one concern per file**, scoped with `globs` / `alwaysApply` / agent `description`

The root `.cursorrules` file is a short pointer only.

## Rule map

| File | Activation | Purpose |
|------|------------|---------|
| `00-project-core.mdc` | Always | Stack, BASE_URL, validation |
| `security-anti-patterns.mdc` | Always | XSS, secrets, deps, file handling (selective) |
| `agent-governance.mdc` | Always | Rules stewardship, supply chain, honesty |
| `tools-crud.mdc` | Tool paths | Create/update/delete browser tools |
| `blog-content.mdc` | Blog/series | Posts, tags, series |
| `svelte5-islands.mdc` | `*.svelte` | Runes, Workers, hydration |
| `astro-pages.mdc` | `*.astro` / config | Layouts, collections, routing |
| `ai-speech-meeting-tools.mdc` | Agent-requested | STT/ASR, diarization, minutes |
| `testing.mdc` | `tests/**` | Unit + Playwright |
| `privacy-third-parties.mdc` | Ads/tools/privacy | Privacy + PII + third parties |
| `search-index.mdc` | Search files | Orama index |

## Security & privacy provenance

Selective guidance adapted from:

- [Arcanum-Sec/sec-context](https://github.com/Arcanum-Sec/sec-context) — AI security anti-patterns (CC BY 4.0; we keep a **short project-scoped** extract, not the full breadth/depth docs)
- [OWASP Secure Coding with AI Cheat Sheet](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Secure_Coding_with_AI_Cheat_Sheet.md) — rules-file stewardship
- [awesome-cursorrules DevSecOps rule](https://github.com/PatrickJS/awesome-cursorrules/blob/main/rules/security-devsecops-ssdls-appsec.mdc) — secrets/deps hygiene
- Anti-sycophancy / verification discipline (awesome-cursorrules)

**Intentionally omitted** (not applicable to static GitHub Pages tools): SQL injection, server auth/JWT, IDOR APIs, LDAP, etc.

For deep dives, open the upstream sec-context files in a separate review pass — do not paste 65K–100K tokens into always-on rules.

## How to extend

1. Add a new `.mdc` under `.cursor/rules/`
2. Start with YAML frontmatter (`description`, `globs` and/or `alwaysApply`)
3. Keep each file focused (~50–80 lines); put deep references in links, not dumps
4. Never weaken `security-anti-patterns` / `agent-governance` without an explicit user request

## Manual invoke

`@security-anti-patterns` · `@agent-governance` · `@ai-speech-meeting-tools` · `@tools-crud`
