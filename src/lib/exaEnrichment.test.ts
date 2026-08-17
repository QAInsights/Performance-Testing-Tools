import { describe, expect, it } from 'vitest';
import { tools } from '../data/tools';
import {
  buildExaRequestBody,
  filterAiFeatures,
  isStale,
  mergeEnrichment,
  normalizeExaResponse,
  rankSources,
  sanitizeEnrichmentForDisplay,
} from './exaEnrichment';

describe('Exa enrichment helpers', () => {
  it('builds a flat Exa request body from tool identity', () => {
    const body = buildExaRequestBody(tools[0]);
    expect(body.query).toContain('Apache JMeter');
    expect(body.query).toContain('https://jmeter.apache.org/');
    expect(body.type).toBe('deep');
    expect(Object.keys(body.outputSchema.properties)).toHaveLength(8);
    expect(body.contents).toEqual({ highlights: true });
    expect(body.systemPrompt).toMatch(/aiFeatures must list only genuine/i);
  });

  it('normalizes grounded response content and citations', () => {
    const entry = normalizeExaResponse(
      {
        output: {
          content: {
            about: '  A useful tool. ',
            features: [' HTTP ', 'HTTP', '', 'Distributed'],
            pricing: 'Free',
            authorOrCompany: 'Authors',
            aiFeatures: ['AI assistant', 'JSR223 samplers with Groovy'],
            latestReleaseVersion: ' 1.2.3 ',
            latestReleaseDate: '2025-01-01',
            latestReleaseNotes: 'Bug fixes',
          },
          grounding: [
            {
              citations: [
                { url: 'https://example.com', title: 'Official' },
                { url: 'https://example.com', title: 'Official' },
                { url: 'javascript:alert(1)', title: 'Bad' },
              ],
            },
          ],
        },
      },
      '2025-02-01T00:00:00.000Z',
    );
    expect(entry.about).toBe('A useful tool.');
    expect(entry.features).toEqual(['HTTP', 'Distributed']);
    expect(entry.aiFeatures).toEqual(['AI assistant']);
    expect(entry.latestRelease?.version).toBe('1.2.3');
    expect(entry.sources).toEqual([
      { url: 'https://example.com', title: 'Official' },
    ]);
  });

  it('drops non-AI features mislabeled as AI', () => {
    expect(
      filterAiFeatures([
        'JSR223 samplers with support for scripting languages like Groovy',
        'AI-powered test generation',
        'Backend Listener for InfluxDB',
      ]),
    ).toEqual(['AI-powered test generation']);
  });

  it('prefers primary sources over low-quality mirrors', () => {
    const ranked = rankSources(
      [
        { url: 'https://www.softpedia.com/x', title: 'Mirror' },
        { url: 'https://jmeter.apache.org/', title: 'Official' },
        { url: 'https://github.com/apache/jmeter', title: 'Repo' },
      ],
      {
        url: 'https://jmeter.apache.org/',
        repoUrl: 'https://github.com/apache/jmeter',
      },
    );
    expect(ranked[0].url).toBe('https://jmeter.apache.org/');
    expect(ranked.map((source) => source.url)).not.toContain(
      'https://www.softpedia.com/x',
    );
  });

  it('sanitizes committed enrichment for display', () => {
    const cleaned = sanitizeEnrichmentForDisplay(
      {
        fetchedAt: '2026-01-01',
        aiFeatures: ['JSR223 samplers with Groovy', 'AI anomaly detection'],
        features: ['a', 'b', 'c', 'd'],
      },
      { url: 'https://example.com', status: 'Discontinued' },
    );
    expect(cleaned?.aiFeatures).toEqual(['AI anomaly detection']);
    expect(cleaned?.features).toEqual(['a', 'b', 'c']);
  });

  it('handles empty or garbage response content without inventing data', () => {
    const entry = normalizeExaResponse({
      output: { content: { about: 42, features: [' ', null] } },
      results: [{ url: 'not-a-url', title: 'Nope' }],
    });
    expect(entry.about).toBeUndefined();
    expect(entry.features).toBeUndefined();
    expect(entry.latestRelease).toBeUndefined();
    expect(entry.sources).toBeUndefined();
  });

  it('merges one entry while preserving prior entries in slug order', () => {
    const existing = {
      generatedAt: 'old',
      entries: {
        zed: { fetchedAt: 'yesterday', about: 'keep' },
      },
    };
    const merged = mergeEnrichment(
      existing,
      'apache-jmeter',
      {
        fetchedAt: 'today',
        about: 'new',
      },
      'now',
    );
    expect(merged.generatedAt).toBe('now');
    expect(Object.keys(merged.entries)).toEqual(['apache-jmeter', 'zed']);
    expect(merged.entries.zed.about).toBe('keep');
  });

  it('marks missing, invalid, and old timestamps stale', () => {
    const now = new Date('2025-02-14T00:00:00.000Z');
    expect(isStale(undefined, 13, now)).toBe(true);
    expect(isStale({ fetchedAt: 'invalid' }, 13, now)).toBe(true);
    expect(isStale({ fetchedAt: '2025-02-01T00:00:00.000Z' }, 13, now)).toBe(
      true,
    );
    expect(isStale({ fetchedAt: '2025-02-05T00:00:00.000Z' }, 13, now)).toBe(
      false,
    );
  });
});
