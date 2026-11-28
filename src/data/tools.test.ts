import { describe, expect, it } from 'vitest';
import { FEATURED_SLOT_COUNT } from './sponsors';
import { tools, validateTool } from './tools';

const TOP_TOOL_ENTITY_SLUGS = [
  'apache-jmeter',
  'grafana-k6',
  'gatling',
  'locust',
  'loadrunner-professional',
  'blazemeter',
  'artillery',
  'neoload',
  'taurus',
  'wrk',
  'grafana-cloud-k6',
  'azure-load-testing',
  'octoperf',
  'vegeta',
  'loadrunner-enterprise',
  'loadrunner-cloud',
  'gatling-enterprise',
  'loaderio',
  'apachebench',
  'autocannon',
] as const;

describe('performance tools dataset', () => {
  it('contains a complete, valid record for every tool', () => {
    expect(tools.length).toBeGreaterThanOrEqual(45);
    for (const tool of tools) {
      expect(validateTool(tool), tool.name).toBe(true);
    }
  });

  it('has unique slugs and names', () => {
    expect(new Set(tools.map((tool) => tool.slug)).size).toBe(tools.length);
    expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
  });

  it('keeps featured placements optional, active, and capped', () => {
    const featured = tools.filter((tool) => tool.featured === true);
    expect(featured.length).toBeLessThanOrEqual(FEATURED_SLOT_COUNT);
    for (const tool of tools) {
      if (tool.featured !== undefined) {
        expect(typeof tool.featured).toBe('boolean');
      }
    }
    for (const tool of featured) {
      expect(tool.status).toBe('Active');
    }
  });

  it('keeps top 20 entity copy specific and decision-useful', () => {
    expect(TOP_TOOL_ENTITY_SLUGS).toHaveLength(20);
    expect(new Set(TOP_TOOL_ENTITY_SLUGS).size).toBe(20);

    for (const slug of TOP_TOOL_ENTITY_SLUGS) {
      const tool = tools.find((candidate) => candidate.slug === slug);
      expect(tool, slug).toBeDefined();
      if (!tool) continue;

      const descriptionWords = tool.description.split(/\s+/).filter(Boolean);
      const longWords = tool.longDescription.split(/\s+/).filter(Boolean);
      expect(
        descriptionWords.length,
        `${slug} description`,
      ).toBeGreaterThanOrEqual(8);
      expect(
        descriptionWords.length,
        `${slug} description`,
      ).toBeLessThanOrEqual(24);
      expect(
        longWords.length,
        `${slug} longDescription`,
      ).toBeGreaterThanOrEqual(45);
      expect(
        tool.longDescription.toLowerCase(),
        `${slug} not placeholder`,
      ).not.toContain('lorem ipsum');
      expect(tool.longDescription, `${slug} richer than description`).not.toBe(
        tool.description,
      );
      expect(
        tool.longDescription.length,
        `${slug} longDescription length`,
      ).toBeGreaterThan(tool.description.length + 40);
    }
  });
});
