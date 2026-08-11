# Performance Testing Tools

[![CI](https://github.com/QAInsights/Performance-Testing-Tools/actions/workflows/ci.yml/badge.svg)](https://github.com/QAInsights/Performance-Testing-Tools/actions/workflows/ci.yml)
[![Live directory](https://img.shields.io/badge/live-directory-007F7C)](https://qainsights.github.io/Performance-Testing-Tools/)

Load Profile Console is a dark-first, searchable directory of performance testing tools curated by [QAInsights](https://qainsights.com/). It is designed for engineers comparing load, protocol, cloud, enterprise, and micro-benchmark tooling without losing historical context.

Live site: <https://qainsights.github.io/Performance-Testing-Tools/>

## Run locally

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run build
npm run preview
npm run lint
npm run format:check
npm run typecheck
npm test
npm run test:e2e
```

## Dataset

The catalog lives in [`src/data/tools.ts`](src/data/tools.ts). Every record has a typed schema covering official URL, ownership, description, category, licensing, deployment, protocols, lifecycle status, and recommendation flags. `datasetLastVerified` is shared across the catalog. Historical or renamed products remain listed with an explicit status and successor when known.

To add or correct a tool:

1. Add or edit one typed record in `src/data/tools.ts`.
2. Verify the official site, repository, vendor, licensing, and lifecycle status.
3. Keep descriptions factual and under 140 characters.
4. Run `npm test`, `npm run typecheck`, and `npm run build`.
5. For a public correction or suggestion, [open a GitHub issue](https://github.com/QAInsights/Performance-Testing-Tools/issues/new).

Build-time generation creates `public/llms.txt`, `public/llms-full.txt`, per-tool SVG OG images, and `public/robots.txt` from the dataset.

## Testing and deployment

Vitest covers dataset, SEO JSON-LD, and load-profile invariants. Playwright covers the project Pages base path, search URL state, filtering, and command palette behavior. The static Astro build produces the directory, category pages, detail pages, comparison page, and about page.

GitHub Actions runs formatting, linting, type checks, unit tests, Playwright, and the production build. The deploy workflow publishes `dist/` to GitHub Pages on pushes to `main`. Repository owners must switch Pages → Build and deployment → Source to **GitHub Actions** once.

## Original context

This project began as the `PerformanceTestingTools` draw.io diagram and a README list of tools. The original diagram and assets remain in the repository as historical source material. The directory preserves its personal-pick and general-pick legend while adding current lifecycle metadata.

![Performance Testing Tools](./assets/PerformanceTestingTools.jpg)

## Note(s) 📌

- Tools are arranged in a random order.

# Contribution are welcome 💜

Please raise an issue to discuss your suggestions or open a PR to request improvements.

> Designed using [Diagrams.net](https://github.com/jgraph/drawio)

# License 📜

MIT
