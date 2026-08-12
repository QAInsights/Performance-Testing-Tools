/* global URL, console, fetch, process, setTimeout */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const { tools } = await import('../src/data/tools.ts');
const { buildExaRequestBody, isStale, mergeEnrichment, normalizeExaResponse } =
  await import('../src/lib/exaEnrichment.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const outputPath = resolve(root, 'src/data/enrichment.json');
const args = process.argv.slice(2);
const getFlag = (name, fallback) => {
  const value = args.find((arg) => arg.startsWith(`--${name}=`));
  return value ? value.slice(name.length + 3) : fallback;
};
const requestedSlugs = args
  .filter((arg) => arg.startsWith('--slug='))
  .flatMap((arg) => arg.slice('--slug='.length).split(','))
  .map((slug) => slug.trim())
  .filter(Boolean);
const all = args.includes('--all') || requestedSlugs.length === 0;
const staleDays = Number(getFlag('stale-days', '13'));
const concurrency = Math.max(1, Number(getFlag('concurrency', '3')));
const dryRun = args.includes('--dry-run');

if (!process.env.EXA_API_KEY) {
  console.error('EXA_API_KEY is required.');
  process.exit(1);
}

const existing = JSON.parse(await readFile(outputPath, 'utf8'));
const selected = tools.filter(
  (tool) => all || requestedSlugs.includes(tool.slug),
);
const unknownSlugs = requestedSlugs.filter(
  (slug) => !tools.some((tool) => tool.slug === slug),
);
for (const slug of unknownSlugs)
  console.warn(`Warning: unknown tool slug "${slug}".`);

const targets = selected.filter((tool) =>
  isStale(existing.entries[tool.slug], staleDays),
);
if (!targets.length) {
  console.log('No stale enrichment entries to fetch.');
  process.exit(0);
}

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
const fetchTool = async (tool) => {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch('https://api.exa.ai/search', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.EXA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildExaRequestBody(tool)),
      });
      if (!response.ok) {
        if (
          attempt === 3 ||
          ![429, 500, 502, 503, 504].includes(response.status)
        )
          throw new Error(`HTTP ${response.status}`);
        await sleep(2 ** (attempt - 1) * 1000);
        continue;
      }
      return await response.json();
    } catch (error) {
      if (attempt === 3) throw error;
      await sleep(2 ** (attempt - 1) * 1000);
    }
  }
  throw new Error('Request failed after retries.');
};

let dataset = existing;
let succeeded = 0;
let totalCost = 0;
for (let index = 0; index < targets.length; index += concurrency) {
  const batch = targets.slice(index, index + concurrency);
  const results = await Promise.allSettled(
    batch.map(async (tool) => {
      const response = await fetchTool(tool);
      const cost = response.costDollars?.total;
      if (typeof cost === 'number') totalCost += cost;
      return [tool.slug, normalizeExaResponse(response)];
    }),
  );
  for (const [resultIndex, result] of results.entries()) {
    const tool = batch[resultIndex];
    if (result.status === 'fulfilled') {
      dataset = mergeEnrichment(dataset, result.value[0], result.value[1]);
      succeeded += 1;
    } else {
      console.warn(
        `Warning: enrichment failed for ${tool.slug}: ${result.reason}`,
      );
    }
  }
}

console.log(`Exa enrichment cost: $${totalCost.toFixed(6)}`);
if (!succeeded) {
  console.error('All requested tools failed.');
  process.exit(1);
}
const prettyJson = await prettier.format(
  `${JSON.stringify(dataset, null, 2)}\n`,
  {
    ...(await prettier.resolveConfig(outputPath)),
    filepath: outputPath,
  },
);
if (!dryRun) {
  await writeFile(outputPath, prettyJson);
} else {
  console.log(prettyJson);
}
