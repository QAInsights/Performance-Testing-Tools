import { describe, expect, it } from 'vitest';
import { tools, type Tool } from '../data/tools';
import {
  compareWithLinks,
  languageChips,
  protocolChips,
  sameCategoryTools,
  similarTools,
} from './toolRelations';

const makeTool = (overrides: Partial<Tool> = {}): Tool => ({
  slug: 'fixture-tool',
  name: 'Fixture Tool',
  vendor: 'Fixture Vendor',
  url: 'https://example.com',
  description: 'Fixture description.',
  longDescription: 'Fixture long description.',
  category: 'Load Testing',
  license: 'Open Source',
  pricingModel: 'Free',
  deployment: 'Self-hosted',
  scriptingLanguages: ['JavaScript'],
  protocols: ['HTTP'],
  osSupport: ['Linux'],
  status: 'Active',
  personalPick: false,
  generalPick: false,
  cloudBased: false,
  openSource: true,
  commercial: false,
  tags: ['fixture'],
  ...overrides,
});

describe('tool relation links', () => {
  it('builds same-category and compare links', () => {
    const tool = tools.find((item) => item.slug === 'apache-jmeter')!;
    const similar = sameCategoryTools(tool, tools, 3);
    expect(similar.length).toBeGreaterThan(0);
    expect(similar.every((item) => item.href.includes('/tools/'))).toBe(true);

    const compares = compareWithLinks(tool, tools, 3);
    expect(compares.length).toBeGreaterThan(0);
    expect(compares[0].href).toMatch(/\/(vs\/|compare\?tools=)/);
    expect(compares[0].slugs).toContain('apache-jmeter');
  });

  it('builds filter chips for languages and protocols', () => {
    const tool = tools.find((item) => item.slug === 'apache-jmeter')!;
    expect(languageChips(tool)[0].href).toMatch(/languages\/|language=/);
    expect(protocolChips(tool)[0].href).toMatch(/protocols\/|protocol=/);
  });

  it('scores similar tools, includes matched reasons, and removes zero-score candidates', () => {
    const source = makeTool({
      slug: 'source',
      protocols: ['HTTP', 'HTTPS', 'gRPC'],
      scriptingLanguages: ['JavaScript', 'Python', 'Go'],
    });
    const fullMatch = makeTool({
      slug: 'full-match',
      name: 'Full Match',
      protocols: ['HTTP', 'HTTPS', 'gRPC', 'WebSocket'],
      scriptingLanguages: ['JavaScript', 'Python', 'Go'],
    });
    const categoryActive = makeTool({
      slug: 'category-active',
      name: 'Category Active',
      protocols: [],
      scriptingLanguages: [],
    });
    const categoryDiscontinued = makeTool({
      slug: 'category-discontinued',
      name: 'Category Discontinued',
      protocols: [],
      scriptingLanguages: [],
      status: 'Discontinued',
    });
    const deploymentOnly = makeTool({
      slug: 'deployment-only',
      name: 'Deployment Only',
      category: 'Browser/RUM',
      protocols: [],
      scriptingLanguages: [],
    });
    const zeroScore = makeTool({
      slug: 'zero-score',
      name: 'Zero Score',
      category: 'Browser/RUM',
      deployment: 'Cloud',
      license: 'Commercial',
      protocols: [],
      scriptingLanguages: [],
    });

    const results = similarTools(
      source,
      [
        source,
        categoryDiscontinued,
        zeroScore,
        fullMatch,
        deploymentOnly,
        categoryActive,
      ],
      10,
    );

    expect(results.map((result) => result.slug)).toEqual([
      'full-match',
      'category-active',
      'category-discontinued',
      'deployment-only',
    ]);
    expect(results[0].reasons).toEqual([
      'same category',
      '3 shared protocols',
      '2 shared languages',
      'same deployment',
      'same license',
    ]);
    expect(results.some((result) => result.slug === 'zero-score')).toBe(false);
  });

  it('caps protocol and language scoring while reporting capped counts', () => {
    const source = makeTool({
      slug: 'source',
      protocols: ['HTTP', 'HTTPS', 'gRPC', 'WebSocket'],
      scriptingLanguages: ['JavaScript', 'Python', 'Go'],
    });
    const capped = makeTool({
      slug: 'capped',
      name: 'Capped',
      protocols: ['HTTP', 'HTTPS', 'gRPC', 'WebSocket'],
      scriptingLanguages: ['JavaScript', 'Python', 'Go'],
      category: 'Browser/RUM',
      deployment: 'Cloud',
      license: 'Commercial',
    });

    expect(similarTools(source, [source, capped])[0].reasons).toEqual([
      '3 shared protocols',
      '2 shared languages',
    ]);
  });
});
