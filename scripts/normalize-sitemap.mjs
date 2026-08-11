/* global URL */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { canonicalBase, joinBase, siteBase, siteOrigin } = await import(
  '../src/config/site.ts'
);
const root = fileURLToPath(new URL('..', import.meta.url));
const distDir = resolve(root, 'dist');

if (siteBase !== canonicalBase) {
  const servingRoot = `${siteOrigin}${joinBase('', siteBase)}`.replace(
    /\/+$/,
    '',
  );
  const canonicalRoot = `${siteOrigin}${canonicalBase}`.replace(/\/+$/, '');
  const files = await readdir(distDir);

  await Promise.all(
    files
      .filter(
        (file) =>
          file === 'sitemap-index.xml' || /^sitemap-\d+\.xml$/.test(file),
      )
      .map(async (file) => {
        const path = resolve(distDir, file);
        const content = await readFile(path, 'utf8');
        await writeFile(path, content.replaceAll(servingRoot, canonicalRoot));
      }),
  );
}
