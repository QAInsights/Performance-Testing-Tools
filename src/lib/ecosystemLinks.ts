import type { Tool } from '../data/tools';

export interface EcosystemLink {
  label: string;
  href: string;
  external: boolean;
}

const JMETER_FAMILY_SLUGS = new Set([
  'apache-jmeter',
  'jmeter-plugins',
  'jmeter-java-dsl',
  'smartmeter',
  'blazemeter',
  'octoperf',
  'azure-load-testing',
  'redline13',
  'taurus',
  'reqfleet',
]);

const K6_FAMILY_SLUGS = new Set([
  'grafana-k6',
  'grafana-cloud-k6',
  'grafana-k6-browser',
  'k6-cloud-legacy',
]);

/** Deep links into the jmeter.ai / QAInsights ecosystem for related tool pages. */
export function ecosystemLinksForTool(tool: Tool): EcosystemLink[] {
  const links: EcosystemLink[] = [];

  if (JMETER_FAMILY_SLUGS.has(tool.slug) || tool.tags.includes('jmeter')) {
    links.push(
      {
        label: 'JMeter documentation (docs.jmeter.ai)',
        href: 'https://docs.jmeter.ai/',
        external: true,
      },
      {
        label: 'JMeter plugins directory',
        href: 'https://plugins.jmeter.ai/',
        external: true,
      },
    );
  }

  if (
    tool.slug === 'apache-jmeter' ||
    tool.slug === 'jmeter-plugins' ||
    tool.slug === 'jmeter-java-dsl'
  ) {
    links.push({
      label: 'JMeter AI assistant',
      href: 'https://jmeter.ai/',
      external: true,
    });
    links.push({
      label: 'QAInsights JMeter tutorials',
      href: 'https://qainsights.com/?s=jmeter',
      external: true,
    });
  }

  if (K6_FAMILY_SLUGS.has(tool.slug) || tool.tags.includes('k6')) {
    links.push({
      label: 'QAInsights k6 coverage',
      href: 'https://qainsights.com/?s=k6',
      external: true,
    });
  }

  if (tool.slug === 'grafana-k6' || tool.slug === 'grafana-cloud-k6') {
    links.push({
      label: 'k6 browser module',
      href: 'https://grafana.com/docs/k6/latest/using-k6-browser/',
      external: true,
    });
  }

  if (tool.slug === 'grafana-k6-browser') {
    links.push({
      label: 'Grafana k6 (protocol engine)',
      href: 'https://grafana.com/docs/k6/latest/',
      external: true,
    });
  }

  if (tool.slug === 'gatling' || tool.slug === 'gatling-enterprise') {
    links.push({
      label: 'QAInsights Gatling coverage',
      href: 'https://qainsights.com/?s=gatling',
      external: true,
    });
  }

  if (tool.slug === 'ngrinder') {
    links.push({
      label: 'nGrinder documentation',
      href: 'https://naver.github.io/ngrinder/',
      external: true,
    });
  }

  return links;
}

export function isJmeterFamily(tool: Tool): boolean {
  return JMETER_FAMILY_SLUGS.has(tool.slug) || tool.tags.includes('jmeter');
}
