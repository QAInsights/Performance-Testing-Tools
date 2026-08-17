import type { Tool } from '../data/tools';

export interface FaqItem {
  question: string;
  answer: string;
}

const wordCount = (text: string) =>
  text.trim().split(/\s+/).filter(Boolean).length;

/** Clamp answer copy into the 40 to 80 word AEO band without truncating mid-sentence when possible. */
export function clampAnswer(text: string, min = 40, max = 80): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length <= max && words.length >= min) return clean;
  if (words.length > max) {
    const sliced = words.slice(0, max).join(' ');
    const lastStop = Math.max(sliced.lastIndexOf('.'), sliced.lastIndexOf(';'));
    if (lastStop > sliced.length * 0.5) {
      return sliced.slice(0, lastStop + 1).trim();
    }
    return `${sliced.replace(/[,:;]?$/, '')}.`;
  }
  return clean;
}

export function nearestRivals(
  tool: Tool,
  catalog: readonly Tool[],
  limit = 2,
): Tool[] {
  return catalog
    .filter(
      (item) =>
        item.slug !== tool.slug &&
        item.category === tool.category &&
        item.status === 'Active',
    )
    .sort((a, b) => {
      const score = (item: Tool) =>
        (item.generalPick ? 2 : 0) +
        (item.personalPick ? 1 : 0) +
        (item.license === tool.license ? 1 : 0);
      return score(b) - score(a) || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}

function whoIsItFor(tool: Tool): FaqItem {
  const audience =
    tool.category === 'Micro-benchmark CLI'
      ? 'developers who need fast HTTP or protocol micro-benchmarks from a terminal'
      : tool.category === 'Cloud Load Testing'
        ? 'teams that want managed load generation without operating generators themselves'
        : tool.category === 'Enterprise Suite'
          ? 'enterprise performance engineering teams with protocol breadth, governance, and analysis needs'
          : tool.category === 'Browser/RUM'
            ? 'teams validating real-browser or end-user experience under load'
            : tool.category === 'Protocol/API Load'
              ? 'engineers focused on API and protocol-level throughput and latency'
              : 'engineers designing load, stress, and performance tests for web and service systems';

  const licenseNote =
    tool.license === 'Open Source'
      ? 'It is open source, so teams can self-host and extend it.'
      : tool.license === 'Freemium'
        ? 'It offers a freemium path, so teams can start small before buying capacity.'
        : 'It is commercial software, typically licensed for larger or governed programs.';

  const answer = clampAnswer(
    `${tool.name} is best for ${audience}. ${licenseNote} Vendor: ${tool.vendor}. Deployment model: ${tool.deployment.toLowerCase()}. ${tool.pricingModel}`,
  );
  return { question: `Who is ${tool.name} for?`, answer };
}

function differsFromRival(
  tool: Tool,
  catalog: readonly Tool[],
): FaqItem | null {
  const rival = nearestRivals(tool, catalog, 1)[0];
  if (!rival) return null;

  const contrasts: string[] = [];
  if (tool.license !== rival.license) {
    contrasts.push(
      `${tool.name} is ${tool.license.toLowerCase()} while ${rival.name} is ${rival.license.toLowerCase()}`,
    );
  }
  if (tool.deployment !== rival.deployment) {
    contrasts.push(
      `deployment is ${tool.deployment.toLowerCase()} versus ${rival.deployment.toLowerCase()} for ${rival.name}`,
    );
  }
  const toolLangs = tool.scriptingLanguages.join(', ') || 'not recorded';
  const rivalLangs = rival.scriptingLanguages.join(', ') || 'not recorded';
  if (toolLangs !== rivalLangs) {
    contrasts.push(
      `scripting centers on ${toolLangs} rather than ${rivalLangs}`,
    );
  }
  if (!contrasts.length) {
    contrasts.push(
      `both sit in ${tool.category.toLowerCase()}, so shortlist on protocols, team skills, and pricing rather than category alone`,
    );
  }

  const answer = clampAnswer(
    `Compared with ${rival.name}, ${contrasts.join('; ')}. ${tool.name} lists protocols ${tool.protocols.join(', ') || 'not recorded'}; ${rival.name} lists ${rival.protocols.join(', ') || 'not recorded'}. Status is ${tool.status.toLowerCase()} versus ${rival.status.toLowerCase()}. Use the Test Rig to compare full specs side by side before a proof-of-concept.`,
  );
  return {
    question: `How does ${tool.name} differ from ${rival.name}?`,
    answer,
  };
}

function scriptingAndModel(tool: Tool): FaqItem {
  const languages = tool.scriptingLanguages.length
    ? tool.scriptingLanguages.join(', ')
    : 'languages not recorded in this catalog';
  const model =
    tool.category === 'Micro-benchmark CLI'
      ? 'CLI-driven request generation with a lightweight concurrency model suited to single-host benchmarks'
      : tool.tags.includes('gui')
        ? 'GUI-oriented authoring with optional scripting for advanced flows'
        : tool.scriptingLanguages.some((lang) =>
              /python|javascript|typescript|scala|java|go|rust|groovy/i.test(
                lang,
              ),
            )
          ? 'code-first scenarios where virtual users execute scripted behavior under load'
          : 'protocol-oriented virtual users configured through the product workflow';

  const answer = clampAnswer(
    `${tool.name} uses ${languages} for scripting or scenario definition. Runtime model: ${model}. OS support: ${tool.osSupport.join(', ') || 'not recorded'}. Protocols: ${tool.protocols.join(', ') || 'not recorded'}. Match these to how your team already authors tests and which systems you must drive under load.`,
  );
  return {
    question: `What scripting language and concurrency model does ${tool.name} use?`,
    answer,
  };
}

function cloudOrEnterprisePath(tool: Tool): FaqItem {
  let path: string;
  if (tool.deployment === 'Cloud') {
    path = `${tool.name} is cloud-hosted: you run tests on vendor-managed infrastructure without operating load generators yourself. That usually speeds ramp-up for distributed load while shifting capacity planning and data residency to the vendor.`;
  } else if (tool.deployment === 'Hybrid') {
    path = `${tool.name} supports a hybrid path that can combine self-hosted controllers or agents with cloud or distributed load as the product allows. Teams often keep sensitive assets private while bursting generators into the cloud.`;
  } else if (tool.category === 'Enterprise Suite') {
    path = `${tool.name} is positioned as an enterprise suite for on-premises or controlled environments; cloud options depend on the vendor product line and adjacent SaaS offerings in the same family.`;
  } else {
    path = `${tool.name} is primarily self-hosted; teams typically run generators on their own machines, CI runners, or private cloud. Plan for generator capacity, network access to targets, and result storage yourself.`;
  }

  const commercial =
    tool.license === 'Commercial' || tool.license === 'Freemium'
      ? ` Pricing model: ${tool.pricingModel}`
      : ` As open source, commercial support or hosted siblings may exist separately. Check the official site. Pricing note: ${tool.pricingModel}`;

  return {
    question: `What is the cloud or enterprise path for ${tool.name}?`,
    answer: clampAnswer(`${path}${commercial}`),
  };
}

function knownLimitations(tool: Tool): FaqItem {
  if (tool.status === 'Discontinued') {
    const successor = tool.successor
      ? ` Prefer ${tool.successor} or another active alternative for new work.`
      : ' Prefer an actively maintained alternative for new work.';
    return {
      question: `What are known limitations of ${tool.name}?`,
      answer: clampAnswer(
        `${tool.name} appears as discontinued in this directory.${successor} Historical references remain so older docs and diagrams still resolve. Verify any remaining commercial support directly with the vendor before depending on it.`,
      ),
    };
  }

  const limits: string[] = [];
  if (tool.category === 'Micro-benchmark CLI') {
    limits.push(
      'CLI micro-benchmarks excel at raw HTTP throughput but usually lack enterprise scenario orchestration, rich reporting, and multi-protocol suites',
    );
  }
  if (tool.deployment === 'Self-hosted') {
    limits.push(
      'self-hosted tools require you to provision, scale, and observe load generators yourself',
    );
  }
  if (tool.deployment === 'Cloud') {
    limits.push(
      'cloud services trade operational simplicity for vendor pricing, data residency, and network path differences versus your production topology',
    );
  }
  if (tool.license === 'Commercial') {
    limits.push(
      'commercial licensing and quotes can gate large-scale or enterprise use',
    );
  }
  if (!tool.protocols.length) {
    limits.push(
      'protocol coverage is not fully recorded in this catalog entry',
    );
  }
  if (!limits.length) {
    limits.push(
      'fit depends on team skills, protocol needs, CI integration, and total cost of ownership rather than feature checklists alone',
    );
  }

  return {
    question: `What are known limitations of ${tool.name}?`,
    answer: clampAnswer(
      `${tool.name} limitations to weigh: ${limits.join('; ')}. Status: ${tool.status.toLowerCase()}. Always validate against your target protocols and scale with a proof-of-concept.`,
    ),
  };
}

const ensureAnswerBand = (answer: string): string => {
  let text = answer.replace(/\s+/g, ' ').trim();
  if (wordCount(text) < 40) {
    text = `${text} Confirm details against the official site and a short proof-of-concept in your environment.`;
  }
  return clampAnswer(text, 40, 80);
};

export function buildToolFaq(tool: Tool, catalog: readonly Tool[]): FaqItem[] {
  const items = [
    whoIsItFor(tool),
    differsFromRival(tool, catalog),
    scriptingAndModel(tool),
    cloudOrEnterprisePath(tool),
    knownLimitations(tool),
  ].filter((item): item is FaqItem => Boolean(item));

  return items.map((item) => ({
    question: item.question,
    answer: ensureAnswerBand(item.answer),
  }));
}

export function assertFaqQuality(items: FaqItem[]): boolean {
  return (
    items.length >= 4 &&
    items.every(
      (item) =>
        item.question.length > 10 &&
        wordCount(item.answer) >= 35 &&
        wordCount(item.answer) <= 85 &&
        !/\blisted as\b/i.test(item.answer),
    )
  );
}
