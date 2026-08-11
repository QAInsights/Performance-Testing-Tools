/* global Buffer, URL */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const { tools } = await import('../src/data/tools.ts');
const { joinBase, siteOrigin } = await import('../src/config/site.ts');
const root = resolve(new URL('..', import.meta.url).pathname);
const publicDir = resolve(root, 'public');
const ogDir = resolve(publicDir, 'og');
await mkdir(ogDir, { recursive: true });

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
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#0A0A0A"/><path d="M0 120H1200M0 240H1200M0 360H1200M0 480H1200M120 0V630M240 0V630M360 0V630M480 0V630M600 0V630M720 0V630M840 0V630M960 0V630M1080 0V630" stroke="#005452" opacity=".45"/><text x="70" y="100" fill="#70D3CB" font-family="monospace" font-size="24" letter-spacing="5">LOAD PROFILE CONSOLE</text><text x="70" y="235" fill="#FBB03B" font-family="sans-serif" font-size="64" font-weight="700">${escapeXml(tool.name)}</text><text x="70" y="285" fill="#AAB5B4" font-family="monospace" font-size="24">${escapeXml(tool.category)} · ${escapeXml(tool.vendor)}</text><polyline points="${profile(tool)}" transform="translate(70 350) scale(.9 1.3)" fill="none" stroke="#1EAEDB" stroke-width="4"/></svg>`;
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

const concise = tools
  .map(
    (tool) =>
      `- [${tool.name}](${siteOrigin}${joinBase(`tools/${tool.slug}`)}) — ${tool.description} License: ${tool.license}; deployment: ${tool.deployment}; status: ${tool.status}.`,
  )
  .join('\n');
const full = tools
  .map(
    (tool) =>
      `## ${tool.name}\n- URL: ${tool.url}\n- Vendor: ${tool.vendor}\n- License: ${tool.license}\n- Deployment: ${tool.deployment}\n- Status: ${tool.status}\n- Category: ${tool.category}\n- Protocols: ${tool.protocols.join(', ')}\n- Description: ${tool.description}\n`,
  )
  .join('\n');
await writeFile(
  resolve(publicDir, 'llms.txt'),
  `# Performance Testing Tools\n\nA curated directory of performance testing tools from QAInsights.\n\n${concise}\n`,
);
await writeFile(
  resolve(publicDir, 'llms-full.txt'),
  `# Performance Testing Tools — Full Catalog\n\n${full}`,
);
await writeFile(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}${joinBase('sitemap-index.xml')}\n`,
);
