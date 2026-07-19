// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';
import linkValidator from 'astro-link-validator';
import basicSsl from '@vitejs/plugin-basic-ssl';

const SITE = 'https://ngtrphuong.github.io';

// Only run link validation on production builds (not PR preview builds that use a
// custom base URL, since the validator can't resolve base-prefixed links against dist/).
const isPreviewBuild = Boolean(process.env.ASTRO_BASE);
const integrations = [
  svelte(),
  mdx(),
  sitemap(),
  ...(isPreviewBuild ? [] : [linkValidator({ failOnBrokenLinks: true })]),
];

export default defineConfig({
  site: SITE,
  // Static redirects (replaces redirect-only pages)
  redirects: {
    // Emit directory-style index.html so trailing-slash links resolve
    '/Captura/index': '/tools/captura/',
    '/Fate-Grand-Automata/index': '/FGA/',
  },
  // base is injected at build time via ASTRO_BASE env variable (used for PR previews)
  base: process.env.ASTRO_BASE || '/',
  // 'ignore' so legacy blog URLs (.../slug.html) work in `astro dev` while
  // directory routes (.../tools/, .../blog/) continue to work with or without a slash.
  trailingSlash: 'ignore',
  output: 'static',
  integrations,
  // Astro has its own top-level server.host/allowedHosts — separate from (and takes priority
  // over) vite.server below. Both are set here for LAN/public-IP/FQDN dev access.
  server: { host: true, allowedHosts: true },
  vite: {
    resolve: {
      alias: {
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@data': fileURLToPath(new URL('./src/data', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@images': fileURLToPath(new URL('./src/content/images', import.meta.url)),
        '@content': fileURLToPath(new URL('./src/content', import.meta.url)),
        '@scripts': fileURLToPath(new URL('./src/scripts', import.meta.url)),
        '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
      },
    },
    // Dev/preview only — self-signed HTTPS cert (@vitejs/plugin-basic-ssl is a no-op during
    // `astro build`, it only patches the dev/preview server config). Mic/camera capture
    // (getUserMedia/getDisplayMedia) requires a "secure context" — the browser only grants that
    // for https:// or literally "localhost", never a bare LAN/public IP or a custom hostname over
    // plain http://. Without this, navigator.mediaDevices is undefined entirely on any non-
    // localhost origin, breaking Live/Record. `host: true` + `allowedHosts: true` let the dev
    // server accept connections from any interface/hostname (LAN IP, FQDN) — appropriate for a
    // local dev server on a trusted network, not something to carry into a real deployment.
    plugins: [basicSsl()],
    server: { host: true, allowedHosts: true },
    preview: { host: true, allowedHosts: true },
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'github-dark' },
  },
  build: {
    // With [slug].astro → dist/.../slug.html (matches postUrlFromId / legacy Jekyll URLs).
    // index.astro pages stay as .../index.html directory routes.
    format: 'preserve',
  },
  image: {
    service: { entrypoint: 'astro/assets/services/sharp' },
    responsiveStyles: true,
    // Required after Astro 6.3.x for processing repository-managed SVG assets.
    // Do not use untrusted/user-provided SVG inputs.
    dangerouslyProcessSVG: true,
  },
});
