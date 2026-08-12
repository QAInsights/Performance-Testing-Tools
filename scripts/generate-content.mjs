/* global Buffer, URL */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildWebManifest,
} from './llms-content.mjs';

const { tools, datasetLastVerified } = await import('../src/data/tools.ts');
const { canonicalBase, joinBase, siteBase, siteNoIndex, siteOrigin } =
  await import('../src/config/site.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = resolve(root, 'public');
const ogDir = resolve(publicDir, 'og');
const wellKnownDir = resolve(publicDir, '.well-known');
await mkdir(ogDir, { recursive: true });
await mkdir(wellKnownDir, { recursive: true });

const escapeXml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const profile = (tool) => {
  let seed = [...tool.slug].reduce(
    (value, char) => (value * 31 + char.charCodeAt(0)) >>> 0,
    7,
  );
  const points = [];
  for (let index = 0; index < 40; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    points.push(`${index * 25},${150 - (seed % 55)}`);
  }
  return points.join(' ');
};
const svg = (tool) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0A0A0A"/><path d="M0 120H1200M0 240H1200M0 360H1200M0 480H1200M120 0V630M240 0V630M360 0V630M480 0V630M600 0V630M720 0V630M840 0V630M960 0V630M1080 0V630" stroke="#005452" opacity=".45"/><text x="70" y="100" fill="#70D3CB" font-family="monospace" font-size="24" letter-spacing="5">PERFORMANCE TESTING TOOLS</text><text x="70" y="235" fill="#FBB03B" font-family="sans-serif" font-size="64" font-weight="700">${escapeXml(tool.name)}</text><text x="70" y="285" fill="#AAB5B4" font-family="monospace" font-size="24">${escapeXml(tool.category)} · ${escapeXml(tool.vendor)}</text><polyline points="${profile(tool)}" transform="translate(70 350) scale(.9 1.3)" fill="none" stroke="#1EAEDB" stroke-width="4"/></svg>`;
await writeFile(resolve(ogDir, 'default.svg'), svg(tools[0]));
for (const tool of tools)
  await writeFile(resolve(ogDir, `${tool.slug}.svg`), svg(tool));
const ogPngs = tools.map(async (tool) => {
  const buffer = Buffer.from(svg(tool));
  await sharp(buffer)
    .png()
    .toFile(resolve(ogDir, `${tool.slug}.png`));
});
await Promise.all([
  sharp(Buffer.from(svg(tools[0])))
    .png()
    .toFile(resolve(ogDir, 'default.png')),
  ...ogPngs,
]);

const llmsOptions = { datasetLastVerified, seoYear: 2026 };
const llmsTxt = buildLlmsTxt(tools, siteOrigin, llmsOptions);
const llmsFull = buildLlmsFullTxt(tools, siteOrigin, llmsOptions);
await writeFile(resolve(publicDir, 'llms.txt'), llmsTxt);
await writeFile(resolve(publicDir, 'llms-full.txt'), llmsFull);
await writeFile(resolve(wellKnownDir, 'llms.txt'), llmsTxt);

const manifest = buildWebManifest(siteBase);
await writeFile(resolve(publicDir, 'manifest.webmanifest'), manifest);

// Open dataset for agents and backlinks (W6 / W7)
const toolsPublicDir = resolve(publicDir, 'tools');
await mkdir(toolsPublicDir, { recursive: true });
const catalogJson = {
  generatedAt: new Date().toISOString(),
  datasetLastVerified,
  count: tools.length,
  tools: tools.map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    vendor: tool.vendor,
    url: tool.url,
    repoUrl: tool.repoUrl ?? null,
    description: tool.description,
    category: tool.category,
    license: tool.license,
    pricingModel: tool.pricingModel,
    deployment: tool.deployment,
    scriptingLanguages: tool.scriptingLanguages,
    protocols: tool.protocols,
    osSupport: tool.osSupport,
    firstReleased: tool.firstReleased ?? null,
    status: tool.status,
    successor: tool.successor ?? null,
    personalPick: tool.personalPick,
    generalPick: tool.generalPick,
    tags: tool.tags,
    directoryUrl: `${siteOrigin}${joinBase(`tools/${tool.slug}`, canonicalBase)}`.replace(
      /\/$/,
      '',
    ),
  })),
};
await writeFile(
  resolve(publicDir, 'tools.json'),
  `${JSON.stringify(catalogJson, null, 2)}\n`,
);
for (const tool of catalogJson.tools) {
  await writeFile(
    resolve(toolsPublicDir, `${tool.slug}.json`),
    `${JSON.stringify(tool, null, 2)}\n`,
  );
}

await writeFile(
  resolve(publicDir, 'robots.txt'),
  siteNoIndex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}${joinBase('sitemap-index.xml', canonicalBase)}\n`,
);
