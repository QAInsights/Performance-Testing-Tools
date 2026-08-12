import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import { ecosystemLinksForTool, isJmeterFamily } from './ecosystemLinks';

describe('ecosystem links', () => {
  it('links JMeter family tools to docs and plugins', () => {
    const jmeter = tools.find((tool) => tool.slug === 'apache-jmeter')!;
    expect(isJmeterFamily(jmeter)).toBe(true);
    const links = ecosystemLinksForTool(jmeter);
    expect(links.some((link) => link.href.includes('plugins.jmeter.ai'))).toBe(
      true,
    );
    expect(links.some((link) => link.href.includes('docs.jmeter.ai'))).toBe(
      true,
    );
  });

  it('links JMeter DSL and k6 browser into the ecosystem graph', () => {
    const dsl = tools.find((tool) => tool.slug === 'jmeter-java-dsl')!;
    expect(isJmeterFamily(dsl)).toBe(true);
    expect(
      ecosystemLinksForTool(dsl).some((link) => link.href.includes('jmeter.ai')),
    ).toBe(true);

    const k6Browser = tools.find((tool) => tool.slug === 'grafana-k6-browser')!;
    const k6Links = ecosystemLinksForTool(k6Browser);
    expect(k6Links.some((link) => link.href.includes('k6'))).toBe(true);
  });

  it('skips ecosystem deep links for unrelated tools', () => {
    const wrk = tools.find((tool) => tool.slug === 'wrk')!;
    expect(ecosystemLinksForTool(wrk)).toEqual([]);
  });
});
