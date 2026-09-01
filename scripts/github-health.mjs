/* global URL, console, fetch, process, setTimeout */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const { tools } = await import('../src/data/tools.ts');

const root = fileURLToPath(new URL('..', import.meta.url));
const outputPath = resolve(root, 'src/data/githubHealth.json');
const staleWindow = 24 * 60 * 60 * 1000;

let existing = { generatedAt: new Date().toISOString(), entries: {} };
try {
  existing = JSON.parse(await readFile(outputPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const githubRepo = /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)\/?$/i;
const targets = tools
  .map((tool) => {
    const match = tool.repoUrl?.match(githubRepo);
    return match
      ? {
          slug: tool.slug,
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
        }
      : undefined;
  })
  .filter(Boolean);

const now = Date.now();
const pending = targets.filter(
  ({ slug }) =>
    !existing.entries[slug] ||
    now - new Date(existing.entries[slug].fetchedAt).getTime() >= staleWindow,
);

const sleep = (milliseconds) =>
  new Promise((resolveSleep) => setTimeout(resolveSleep, milliseconds));
const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'performance-testing-tools-health',
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};
let dataset = existing;
let fetched = 0;
let rateLimited = false;

for (const [index, target] of pending.entries()) {
  const response = await fetch(
    `https://api.github.com/repos/${target.owner}/${target.repo}`,
    { headers },
  );
  if (response.status === 403 || response.status === 429) {
    const remaining = pending.length - index;
    console.warn(
      `GitHub API rate limit reached; ${remaining} health entries remain.`,
    );
    rateLimited = true;
    break;
  }
  if (!response.ok) {
    console.warn(
      `Warning: GitHub health failed for ${target.slug}: HTTP ${response.status}`,
    );
  } else {
    const repository = await response.json();
    dataset.entries[target.slug] = {
      stars: repository.stargazers_count,
      lastPushedAt: repository.pushed_at,
      archived: repository.archived,
      fetchedAt: new Date().toISOString(),
    };
    fetched += 1;
  }
  if (index < pending.length - 1) await sleep(200);
}

dataset.generatedAt = new Date().toISOString();
const prettyJson = await prettier.format(
  `${JSON.stringify(dataset, null, 2)}\n`,
  {
    ...(await prettier.resolveConfig(outputPath)),
    filepath: outputPath,
  },
);
await writeFile(outputPath, prettyJson);
console.log(
  `GitHub health: fetched ${fetched}; ${targets.filter(({ slug }) => !dataset.entries[slug]).length} entries missing.`,
);
if (rateLimited) process.exitCode = 0;
