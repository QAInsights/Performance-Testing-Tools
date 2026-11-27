/* global URL, console, fetch, process */
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { siteOrigin, joinBase } = await import('../src/config/site.ts');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const endpoint = 'https://api.indexnow.org/IndexNow';
const batchSize = 10000;

async function resolveKey() {
  if (process.env.INDEXNOW_KEY) return process.env.INDEXNOW_KEY.trim();
  const publicDir = resolve(
    fileURLToPath(new URL('..', import.meta.url)),
    'public',
  );
  const entries = await readdir(publicDir);
  const keyFile = entries.find((name) => /^[0-9a-f]{32,64}\.txt$/.test(name));
  if (!keyFile) {
    throw new Error('No IndexNow key file (hex *.txt) found in public/.');
  }
  return (await readFile(resolve(publicDir, keyFile), 'utf8')).trim();
}

function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(
    (match) => match[1],
  );
}

async function collectUrls(origin) {
  const indexUrl = `${origin}${joinBase('sitemap-index.xml')}`;
  const indexResponse = await fetch(indexUrl);
  if (!indexResponse.ok) {
    throw new Error(
      `Failed to fetch ${indexUrl}: HTTP ${indexResponse.status}`,
    );
  }
  const sitemapUrls = locs(await indexResponse.text());
  const urls = new Set();
  for (const sitemapUrl of sitemapUrls.length ? sitemapUrls : [indexUrl]) {
    const response = await fetch(sitemapUrl);
    if (!response.ok) continue;
    for (const url of locs(await response.text())) {
      if (url.startsWith(origin)) urls.add(url);
    }
  }
  return [...urls];
}

const key = await resolveKey();
const host = new URL(siteOrigin).host;
const urls = await collectUrls(siteOrigin);
console.log(
  `IndexNow: ${urls.length} URLs for ${host} (key ${key.slice(0, 8)}…)`,
);

if (dryRun) {
  console.log(urls.slice(0, 10).join('\n'));
  process.exit(0);
}

for (let index = 0; index < urls.length; index += batchSize) {
  const urlList = urls.slice(index, index + batchSize);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key,
      keyLocation: `${siteOrigin}${joinBase(`${key}.txt`)}`,
      urlList,
    }),
  });
  console.log(
    `IndexNow batch ${index / batchSize + 1}: HTTP ${response.status}`,
  );
  if (!response.ok) process.exitCode = 1;
}
