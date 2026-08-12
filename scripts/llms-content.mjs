/** Pure AEO / llms / manifest builders (no app imports; safe for generate script). */

export const CANONICAL_COMPARE_PAIRS = [
  ['apache-jmeter', 'grafana-k6'],
  ['apache-jmeter', 'gatling'],
  ['grafana-k6', 'gatling'],
  ['locust', 'grafana-k6'],
  ['apache-jmeter', 'loadrunner-professional'],
  ['blazemeter', 'grafana-cloud-k6'],
  ['octoperf', 'blazemeter'],
  ['artillery', 'grafana-k6'],
];

const joinCanonical = (path, origin) => {
  const clean = String(path || '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/^/, '');
  if (!clean) return origin.replace(/\/$/, '');
  return `${origin.replace(/\/$/, '')}/${clean}`;
};

const toolUrl = (slug, origin) => joinCanonical(`tools/${slug}`, origin);

const categoryPath = (category) =>
  `categories/${category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`;

const bySlug = (catalog, slug) => catalog.find((tool) => tool.slug === slug);

const pickReason = (tool) => {
  if (tool.personalPick && tool.generalPick) {
    return 'personal and general pick for broad real-world fit';
  }
  if (tool.personalPick) return 'personal pick for practical workflows';
  if (tool.generalPick) return 'general pick for teams evaluating defaults';
  return tool.description;
};

const compareVerdict = (a, b) => {
  const license =
    a.license === b.license
      ? `Both are ${a.license.toLowerCase()}.`
      : `${a.name} is ${a.license.toLowerCase()}; ${b.name} is ${b.license.toLowerCase()}.`;
  const deploy =
    a.deployment === b.deployment
      ? `Both deploy as ${a.deployment.toLowerCase()}.`
      : `${a.name} is ${a.deployment.toLowerCase()}; ${b.name} is ${b.deployment.toLowerCase()}.`;
  const langs = `Scripting: ${a.name} (${a.scriptingLanguages.join(', ') || 'n/a'}) vs ${b.name} (${b.scriptingLanguages.join(', ') || 'n/a'}).`;
  return `${license} ${deploy} ${langs} Choose ${a.name} when you need ${a.category.toLowerCase()} strengths around ${a.protocols.slice(0, 3).join(', ') || 'its protocol set'}; choose ${b.name} for ${b.category.toLowerCase()} with ${b.protocols.slice(0, 3).join(', ') || 'its protocol set'}.`;
};

const matrixLines = (title, predicate, catalog, origin) => {
  const lines = catalog
    .filter(predicate)
    .filter((tool) => tool.status === 'Active')
    .slice(0, 12)
    .map(
      (tool) =>
        `- [${tool.name}](${toolUrl(tool.slug, origin)}) ${tool.license}; ${tool.deployment}`,
    );
  return [`### ${title}`, ...lines, ''].join('\n');
};

export function buildLlmsTxt(
  catalog,
  origin,
  { datasetLastVerified, seoYear = 2026 } = {},
) {
  const topPicks = catalog.filter(
    (tool) => tool.personalPick || tool.generalPick,
  );
  const categories = [...new Set(catalog.map((tool) => tool.category))];

  const howToChoose = [
    '## How to choose a load testing tool',
    '',
    '1. Start from **protocol coverage** (HTTP, gRPC, browser, legacy), not brand familiarity.',
    '2. Match **authoring model** to the team: GUI/recorder, code-first (JS/Python/Java/Scala), or pure CLI.',
    '3. Decide **cloud vs self-hosted** for load generation, data residency, and cost predictability.',
    '4. Check **lifecycle status**. Discontinued tools stay listed here with successors when known.',
    '5. Shortlist 2-3 options and compare specs in the Test Rig before a proof-of-concept.',
    '',
  ].join('\n');

  const pickMatrices = [
    '## Pick matrices',
    '',
    matrixLines(
      'Open source (active)',
      (tool) => tool.license === 'Open Source',
      catalog,
      origin,
    ),
    matrixLines(
      'Commercial / freemium (active)',
      (tool) => tool.license !== 'Open Source',
      catalog,
      origin,
    ),
    matrixLines(
      'CLI micro-benchmarks',
      (tool) => tool.category === 'Micro-benchmark CLI',
      catalog,
      origin,
    ),
    matrixLines(
      'GUI-friendly or enterprise suites',
      (tool) =>
        tool.category === 'Enterprise Suite' || tool.tags.includes('gui'),
      catalog,
      origin,
    ),
    matrixLines(
      'Cloud load testing',
      (tool) =>
        tool.deployment === 'Cloud' || tool.category === 'Cloud Load Testing',
      catalog,
      origin,
    ),
    matrixLines(
      'Self-hosted engines',
      (tool) => tool.deployment === 'Self-hosted',
      catalog,
      origin,
    ),
  ].join('\n');

  const topSection = [
    '## Top picks',
    '',
    ...topPicks.map(
      (tool) =>
        `- [${tool.name}](${toolUrl(tool.slug, origin)}) ${pickReason(tool)}`,
    ),
    '',
  ].join('\n');

  const compareSection = [
    '## Canonical compare pairs',
    '',
    ...CANONICAL_COMPARE_PAIRS.flatMap(([aSlug, bSlug]) => {
      const a = bySlug(catalog, aSlug);
      const b = bySlug(catalog, bSlug);
      if (!a || !b) return [];
      const comparePath = `compare?tools=${[a.slug, b.slug].sort().join(',')}`;
      return [
        `### ${a.name} vs ${b.name}`,
        compareVerdict(a, b),
        `Links: [${a.name}](${toolUrl(a.slug, origin)}) · [${b.name}](${toolUrl(b.slug, origin)}) · [Compare](${joinCanonical(comparePath, origin)})`,
        '',
      ];
    }),
  ].join('\n');

  const catalogLines = catalog
    .map(
      (tool) =>
        `- [${tool.name}](${toolUrl(tool.slug, origin)}) ${tool.description} License: ${tool.license}; deployment: ${tool.deployment}; status: ${tool.status}.`,
    )
    .join('\n');

  const footer = [
    '## More',
    '',
    `- Full catalog with answer cards: ${joinCanonical('llms-full.txt', origin)}`,
    `- Sitemap: ${joinCanonical('sitemap-index.xml', origin)}`,
    `- Directory home: ${origin.replace(/\/$/, '')}/`,
    ...categories.map(
      (category) =>
        `- ${category}: ${joinCanonical(categoryPath(category), origin)}`,
    ),
    `- Dataset last verified: ${datasetLastVerified}`,
    '',
  ].join('\n');

  return [
    `# Performance Testing Tools`,
    '',
    `A decision-ready, curated directory of ${catalog.length} performance testing tools (${seoYear}) from QAInsights.`,
    `Canonical site: ${origin}`,
    '',
    howToChoose,
    pickMatrices,
    topSection,
    compareSection,
    '## Full tool index',
    '',
    catalogLines,
    '',
    footer,
  ].join('\n');
}

const whenNot = (tool) => {
  if (tool.status === 'Discontinued') {
    return tool.successor
      ? `Do not start new projects on it; prefer ${tool.successor}.`
      : 'Do not start new projects on it; choose an active alternative.';
  }
  if (tool.category === 'Micro-benchmark CLI') {
    return 'Not ideal as a full enterprise suite replacement or multi-protocol business-flow platform.';
  }
  if (tool.deployment === 'Cloud') {
    return 'Less ideal when you must keep all load generation fully on-premises with no vendor path.';
  }
  if (tool.license === 'Commercial') {
    return 'Less ideal when you require a fully open-source stack with zero commercial licensing.';
  }
  return 'Less ideal when required protocols or team languages are outside its listed strengths.';
};

export function buildLlmsFullTxt(
  catalog,
  origin,
  { datasetLastVerified } = {},
) {
  const cards = catalog
    .map((tool) => {
      const who =
        tool.category === 'Micro-benchmark CLI'
          ? 'Developers running quick HTTP/protocol benchmarks'
          : tool.category === 'Cloud Load Testing'
            ? 'Teams wanting managed cloud load generation'
            : tool.category === 'Enterprise Suite'
              ? 'Enterprise performance engineering organizations'
              : 'Engineers choosing load and performance testing tooling';
      return [
        `## ${tool.name}`,
        `- Directory: ${toolUrl(tool.slug, origin)}`,
        `- Official: ${tool.url}`,
        `- Vendor: ${tool.vendor}`,
        `- License: ${tool.license}`,
        `- Deployment: ${tool.deployment}`,
        `- Status: ${tool.status}${tool.successor ? ` (successor: ${tool.successor})` : ''}`,
        `- Category: ${tool.category}`,
        `- Protocols: ${tool.protocols.join(', ') || 'n/a'}`,
        `- Scripting: ${tool.scriptingLanguages.join(', ') || 'n/a'}`,
        `- Who: ${who}`,
        `- What: ${tool.description}`,
        `- When not: ${whenNot(tool)}`,
        `- Longer: ${tool.longDescription}`,
        '',
      ].join('\n');
    })
    .join('\n');

  return [
    `# Performance Testing Tools Full Catalog`,
    '',
    `Answer cards for ${catalog.length} tools. Last verified ${datasetLastVerified}.`,
    `Concise decision pack: ${joinCanonical('llms.txt', origin)}`,
    '',
    cards,
  ].join('\n');
}

export function buildWebManifest(basePath = '/') {
  const base =
    basePath === '/' || basePath === ''
      ? '/'
      : `/${basePath.replace(/^\/+|\/+$/g, '')}/`;
  const icon = (name) => `${base === '/' ? '/' : base}icons/${name}`;

  return `${JSON.stringify(
    {
      name: 'Performance Testing Tools',
      short_name: 'Perf Tools',
      description:
        'A curated directory of performance testing tools from QAInsights.',
      start_url: base,
      scope: base,
      display: 'standalone',
      background_color: '#0A0A0A',
      theme_color: '#0A0A0A',
      icons: [
        {
          src: icon('icon-192.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: icon('icon-512.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: icon('icon-192-maskable.png'),
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: icon('icon-512-maskable.png'),
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2,
  )}\n`;
}
