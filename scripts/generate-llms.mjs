/* global URL */
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { tools, datasetLastVerified } = await import('../src/data/tools.ts');
const { siteOrigin } = await import('../src/config/site.ts');
const { buildLlmsFullTxt, buildLlmsTxt } = await import(
  '../src/lib/llmsGenerated.ts'
);

const root = fileURLToPath(new URL('..', import.meta.url));
const publicDir = resolve(root, 'public');
const wellKnownDir = resolve(publicDir, '.well-known');
await mkdir(wellKnownDir, { recursive: true });

const options = { datasetLastVerified, seoYear: 2026 };
const llmsTxt = buildLlmsTxt(tools, siteOrigin, options);
const llmsFull = buildLlmsFullTxt(tools, siteOrigin, options);
await writeFile(resolve(publicDir, 'llms.txt'), llmsTxt);
await writeFile(resolve(publicDir, 'llms-full.txt'), llmsFull);
await writeFile(resolve(wellKnownDir, 'llms.txt'), llmsTxt);
