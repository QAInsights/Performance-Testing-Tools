import type { Tool } from '../data/tools';
import type { EnrichmentEntry } from './enrichmentData';

/** Visible AEO answer box (about 40-60 words). */
export function toolAnswerBox(
  tool: Tool,
  enrichment?: EnrichmentEntry,
): string {
  const about = enrichment?.about || tool.longDescription || tool.description;
  const core = about.replace(/\s+/g, ' ').trim();
  const words = core.split(/\s+/);
  const trimmed =
    words.length > 55
      ? `${words
          .slice(0, 55)
          .join(' ')
          .replace(/[,:;]?$/, '')}.`
      : core;
  const status =
    tool.status === 'Discontinued'
      ? tool.successor
        ? ` Status: discontinued; successor ${tool.successor}.`
        : ' Status: discontinued.'
      : '';
  return `${trimmed}${status}`.replace(/\s+/g, ' ').trim();
}

export function bestFor(tool: Tool): string[] {
  const items: string[] = [];
  if (tool.category === 'Micro-benchmark CLI') {
    items.push('Quick HTTP or protocol micro-benchmarks from a single machine');
  } else if (tool.category === 'Cloud Load Testing') {
    items.push(
      'Teams that want managed load generation without operating injectors',
    );
  } else if (tool.category === 'Enterprise Suite') {
    items.push(
      'Enterprise programs that need suite-level analysis and governance',
    );
  } else if (tool.category === 'Protocol/API Load') {
    items.push('API and protocol throughput or latency campaigns');
  } else if (tool.category === 'AI/LLM Inference') {
    items.push(
      'Token-level latency and throughput benchmarks against LLM inference endpoints',
    );
  } else if (tool.category === 'Database Benchmarking') {
    items.push(
      'Database throughput, transaction latency, and capacity benchmarks',
    );
  } else if (tool.category === 'Code Benchmarking') {
    items.push('Repeatable method, function, and command runtime benchmarks');
  } else {
    items.push(
      `${tool.category} scenarios across typical web and service stacks`,
    );
  }

  if (tool.license === 'Open Source') {
    items.push(
      'Teams that prefer open-source licensing and self-hosting options',
    );
  } else if (tool.license === 'Freemium') {
    items.push(
      'Teams that want a free tier before committing to paid capacity',
    );
  } else {
    items.push(
      'Organizations budgeting for commercial licenses or subscriptions',
    );
  }

  if (tool.scriptingLanguages.length) {
    items.push(
      `Groups comfortable scripting in ${tool.scriptingLanguages.slice(0, 3).join(', ')}`,
    );
  }
  return items.slice(0, 4);
}

export function notBestFor(tool: Tool): string[] {
  const items: string[] = [];
  if (tool.status === 'Discontinued') {
    items.push(
      'New greenfield programs (prefer an active successor or alternative)',
    );
  }
  if (tool.category === 'Micro-benchmark CLI') {
    items.push(
      'Full multi-protocol enterprise journeys and rich business-flow reporting',
    );
  }
  if (tool.deployment === 'Cloud') {
    items.push('Strictly air-gapped environments with no approved cloud path');
  }
  if (tool.deployment === 'Self-hosted') {
    items.push(
      'Teams unwilling to operate generators, results storage, and scaling',
    );
  }
  if (tool.license === 'Commercial') {
    items.push('Projects that require a fully free open-source stack only');
  }
  if (!items.length) {
    items.push(
      'Workloads outside the listed protocols or languages without a proof-of-concept',
    );
  }
  return items.slice(0, 4);
}

export function architectureLine(tool: Tool): string {
  const langs = tool.scriptingLanguages.length
    ? tool.scriptingLanguages.join(', ')
    : 'languages not fully recorded';
  if (tool.category === 'Micro-benchmark CLI') {
    return `${tool.name} is typically driven as a CLI micro-benchmark with ${langs}. It favors single-host or simple distributed runs rather than enterprise controller grids.`;
  }
  if (tool.category === 'Database Benchmarking') {
    return `${tool.name} is operated as a database benchmark with ${langs}. Workload definitions and database sessions determine concurrency, while results focus on throughput and latency rather than browser journeys.`;
  }
  if (tool.category === 'Code Benchmarking') {
    return `${tool.name} is operated as a code benchmark harness with ${langs}. It isolates functions, methods, or commands and applies repeated measurements, warmups, and statistical comparison rather than generating protocol traffic.`;
  }
  if (tool.deployment === 'Cloud') {
    return `${tool.name} runs as a cloud service: scenarios use ${langs}, while generators and orchestration are vendor-managed.`;
  }
  return `${tool.name} is commonly operated as ${tool.deployment.toLowerCase()} software with scenario authoring in ${langs}. Concurrency and distribution depend on how you size workers or injectors.`;
}
