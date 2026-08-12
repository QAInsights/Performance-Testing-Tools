---
name: testing-load-profile-console
description: How to build, serve and end-to-end test the Astro "Performance Testing Tools" static site in this repo (directory, filters, compare rig, command palette, tool pages).
---

# Testing Performance Testing Tools (Astro static site)

## Serving the app

```bash
npm ci                       # or reuse existing node_modules
npm run build                # runs scripts/generate-content.mjs then astro build
npx astro preview --host 127.0.0.1 --port 4321
```

- The base comes from `SITE_BASE` in `src/config/site.ts` and defaults to `/`, so
  locally the entry URL is `http://127.0.0.1:4321/`. The
  `/Performance-Testing-Tools/` prefix only applies when `SITE_BASE` is set (the
  GitHub Pages deploy sets it); don't assume it locally.
- `public/manifest.webmanifest` still hardcodes the `/Performance-Testing-Tools/`
  base, so expect 2 pre-existing console errors on every page locally (a 404 for
  `icons/icon-192.png` plus "Error while trying to use the following icon from the
  Manifest"). Don't attribute them to the change under test.
- `base` / origin live in `src/config/site.ts`; runtime JS derives paths from
  `data-base` on `[data-directory]` and from `import.meta.env.BASE_URL`.
- Prefer testing the built `dist` output over `astro dev` some bugs (base-path
  string concatenation, canonical URLs) only appear in the build.
- A preview server may already be running on 4321; check with
  `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4321/`
  before starting another one.

## Where the behaviour lives

- `src/components/Directory.astro` - one inline `<script>` drives search, checkbox
  filters, sort, table/grid toggle, URL sync (`history.replaceState`), the compare
  tray (sessionStorage key `ptt-compare`, cap of 3) and the Ctrl+K command palette.
- `src/pages/compare.astro` - client-side matrix built from `?tools=a,b,c`
  (max 3, unknown slugs silently dropped, `.different` marks differing rows).
- `src/pages/tools/[slug].astro`, `categories/[category].astro`, `about.astro`.
- `src/components/LoadProfile.astro` - waveform must be a cyan stroke with
  `fill: none`; a filled blob means the `.profile-line` rule was lost.
- Tool-page enrichment (About / Features / Pricing / Author / AI features / Latest
  release / Sources panel) is read from the committed `src/data/enrichment.json`
  via `src/lib/enrichmentData.ts`, keyed by tool slug. Only seeded slugs render the
  panel, and no API key or network access is needed to test it never call the Exa
  API from a test run.

## Useful selectors / interactions

- Search input `[data-search]`; `/` key focuses it (ignored while an input is focused).
- Filter checkboxes `[data-filter="category|license|deployment|status|language|protocol|pick"]`;
  OR within a group, AND across groups.
- Sort `[data-sort]` (`name|category|vendor|released`); `released` sorts numerically
  with undated tools last in both directions.
- Result count `[data-results-count]`, empty state `[data-empty]`,
  clear buttons `[data-clear-filters]`.
- Compare checkboxes `[data-compare]`, tray `[data-compare-tray]`,
  count text `N / 3 selected`; the "Compare tools →" button is disabled below 2.
- Palette: `[data-palette]`, opener `[data-palette-open]`, input `[data-palette-search]`,
  items `.palette-item`.

## Known fragile areas check these explicitly

All four bit us once already and now have regression tests; re-check them after any
change to `Directory.astro`, `Seo.astro`, `ConsoleLayout.astro` or `src/lib/urls.ts`.

- **Palette styling**: the palette markup uses `.palette-backdrop`, `.palette`,
  `.palette-head`, `.palette-input`, `.palette-results`, `.palette-item`. If these
  rules go missing, the palette renders as unstyled text in normal document flow at
  the bottom of the page easy to miss because the DOM looks correct and the element
  is "visible". Always take a _screenshot_ after Ctrl+K, and assert overlay-ness
  (fixed position, non-static z-index, box inside the viewport), not visibility.
- **Palette entries**: `.tool-name` exists in both the table rows and the grid cards,
  so collecting from it naively lists every tool twice. Assert uniqueness.
- **Palette arrow keys**: keydown handlers on both the input and the results container
  can make every second ArrowDown bounce focus back to the input. Press Down 4+ times
  in a row and check the active item advances each press.
- **Base-path concatenation**: `import.meta.env.BASE_URL` has **no** trailing slash
  when a base is set, so `` `${BASE_URL}favicon.svg` `` yields
  `/Performance-Testing-Toolsfavicon.svg`. All joining goes through
  `src/lib/urls.ts` keep new call sites on it. To sweep the built HTML for this
  class of bug, build with `SITE_BASE=/Performance-Testing-Tools` and then:
  ```bash
  cd dist && grep -rhoP 'href="/Performance-Testing-Tools[^"#]*"' --include=*.html . \
    | sed 's/href="//;s/"$//' | sort -u \
    | while read l; do c=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:4321$l"); \
      [ "$c" != 200 ] && echo "$c $l"; done
  grep -o '<link rel="canonical" href="[^"]*"' index.html   # watch for a doubled base path
  ```
- **Canonical/OG URLs**: pages that pass no explicit canonical are the risky ones
  (`/`, `/about`, `/compare`) `Astro.url.pathname` already contains the base, so a
  naive prepend doubles it. Check one of those pages, not just a tool page.

## Mobile / JS-off testing tips

- Chrome cannot be resized below ~530px on this box; use DevTools device mode
  (F12 then Ctrl+Shift+M, set width 375) for the 375px checks.
- Toggle JavaScript through `chrome://settings/content/javascript` (a real UI path,
  keeps the recording understandable) and reload; the directory table and all tool
  pages must still render every tool.

## Devin Secrets Needed

None the site is fully static with no backend, auth, or API keys. Enrichment
content is committed JSON; the Exa API key (`EXA_API_KEY`) is only needed to
_refresh_ that data, never to test the site.
